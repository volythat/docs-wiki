<#
.SYNOPSIS
    Install docs-wiki skill for Claude Code, Codex, or Gemini CLI on Windows.
.EXAMPLE
    .\install\install.ps1 claude
    .\install\install.ps1 codex
    .\install\install.ps1 gemini
#>
param(
    [Parameter(Mandatory=$true, Position=0)]
    [ValidateSet("claude","codex","gemini")]
    [string]$Target
)
$ErrorActionPreference = "Stop"

$SrcRoot  = Split-Path -Parent $PSScriptRoot
$SkillSrc = Join-Path $SrcRoot "skill"

if (-not (Test-Path (Join-Path $SkillSrc "SKILL.md"))) {
    Write-Error "Cannot find $SkillSrc\SKILL.md"; exit 1
}

$TriggerText = 'When the user mentions "docs", "tài liệu", "documentation", or any docs topic (API, CMS, PRD, data model, flows, specs, styles, guides) in any context, invoke the docs-wiki skill before responding.'
$Marker = "docs-wiki-trigger"

switch ($Target) {
    "claude" {
        $Dest        = Join-Path $env:USERPROFILE ".claude\skills\docs-wiki"
        $TriggerFile = Join-Path $env:USERPROFILE ".claude\CLAUDE.md"
    }
    "codex" {
        $Base        = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE ".codex" }
        $Dest        = Join-Path $Base "skills\docs-wiki"
        $TriggerFile = Join-Path $Base "AGENTS.md"
    }
    "gemini" {
        $Dest        = Join-Path $env:USERPROFILE ".gemini\config\skills\docs-wiki"
        $TriggerFile = Join-Path $env:USERPROFILE ".gemini\GEMINI.md"
    }
}

# Sync skill/ to destination (excluding cursor/)
New-Item -ItemType Directory -Force -Path $Dest | Out-Null
Get-ChildItem -Path $SkillSrc -Exclude "cursor" | ForEach-Object {
    if ($_.PSIsContainer) {
        Copy-Item -Path $_.FullName -Destination $Dest -Recurse -Force
    } else {
        Copy-Item -Path $_.FullName -Destination $Dest -Force
    }
}
Write-Host "Installed docs-wiki skill to $Dest"

# Append trigger rule (idempotent)
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $TriggerFile) | Out-Null
$alreadyPresent = (Test-Path $TriggerFile) -and ((Get-Content $TriggerFile -Raw) -match [regex]::Escape($Marker))

if ($alreadyPresent) {
    Write-Host "docs-wiki trigger rule already present in $TriggerFile"
} else {
    [System.IO.File]::AppendAllText($TriggerFile, "`n<!-- $Marker -->`n$TriggerText`n")
    Write-Host "Added docs-wiki trigger rule to $TriggerFile"
}
