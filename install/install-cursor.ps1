<#
.SYNOPSIS
    Install docs-wiki Cursor rules into a project on Windows.
    Generates docs-wiki.mdc from SKILL.md — no hand-written copy.
.EXAMPLE
    .\install\install-cursor.ps1 C:\path\to\project
    .\install\install-cursor.ps1 .
#>
param(
    [Parameter(Position=0)]
    [string]$Project = "."
)
$ErrorActionPreference = "Stop"

$SrcRoot  = Split-Path -Parent $PSScriptRoot
$SkillSrc = Join-Path $SrcRoot "skill"
$SkillMd  = Join-Path $SkillSrc "SKILL.md"
$RulesDir = Join-Path $Project ".cursor\rules"

if (-not (Test-Path $Project))  { Write-Error "Project directory not found: $Project"; exit 1 }
if (-not (Test-Path $SkillMd))  { Write-Error "Cannot find $SkillMd"; exit 1 }

New-Item -ItemType Directory -Force -Path "$RulesDir\docs-wiki\references" | Out-Null
New-Item -ItemType Directory -Force -Path "$RulesDir\docs-wiki\templates"  | Out-Null

Copy-Item -Path "$SkillSrc\references\*.md" -Destination "$RulesDir\docs-wiki\references\" -Force
Copy-Item -Path "$SkillSrc\templates\*"     -Destination "$RulesDir\docs-wiki\templates\"  -Recurse -Force

$PathNote = '> **Cursor path note:** All relative paths in this rule (`references/xxx.md`, `templates/`) resolve to `.cursor/rules/docs-wiki/` in your project root. Read reference files with the Read tool when needed.'

# Transform SKILL.md frontmatter for Cursor:
#   - remove the `name:` key
#   - add `globs:` and `alwaysApply: false` before closing `---`
$lines          = Get-Content $SkillMd
$header         = [System.Collections.Generic.List[string]]::new()
$body           = [System.Collections.Generic.List[string]]::new()
$inFm           = $false
$fmDone         = $false
$bodyStarted    = $false

foreach ($line in $lines) {
    if (-not $fmDone) {
        if ((-not $inFm) -and $line -eq "---") { $header.Add($line); $inFm = $true; continue }
        if ($inFm -and $line -eq "---") {
            $header.Add("globs:"); $header.Add("alwaysApply: false"); $header.Add("---")
            $fmDone = $true; $inFm = $false; continue
        }
        if ($inFm -and $line -match "^name:") { continue }
        if ($inFm) { $header.Add($line); continue }
    }
    if ($line -match "^# docs-wiki") { $bodyStarted = $true }
    if ($bodyStarted) { $body.Add($line) }
}

$mdc = ($header -join "`n") + "`n`n" + $PathNote + "`n`n" + ($body -join "`n") + "`n"
[System.IO.File]::WriteAllText((Join-Path $RulesDir "docs-wiki.mdc"), $mdc, [System.Text.Encoding]::UTF8)
Write-Host "Generated docs-wiki.mdc from SKILL.md"

# Trigger rule (idempotent)
$TriggerFile = Join-Path $RulesDir "docs-wiki-trigger.mdc"
if (-not (Test-Path $TriggerFile)) {
    $trigger = @"
---
description: docs-wiki passive trigger
globs:
alwaysApply: true
---
When the user mentions "docs", "tài liệu", "documentation", or any docs topic (API, CMS, PRD, data model, flows, specs, styles, guides) in any context, invoke the docs-wiki skill before responding.
"@
    [System.IO.File]::WriteAllText($TriggerFile, $trigger, [System.Text.Encoding]::UTF8)
    Write-Host "Created docs-wiki-trigger.mdc in $RulesDir"
}

Write-Host "Installed docs-wiki Cursor rules to $RulesDir"
