# Project Config — `.docswiki.yml`

Place at **cwd (root folder)** because it contains paths to docs and must sit above them.
Skill reads this file BEFORE every command (step 0 in SKILL.md).

## Schema & defaults

```yaml
docs_dir: docs              # docs folder, relative from cwd
dirs:                       # subdirectory names, relative from docs_dir
  api: api                  #   -> <docs_dir>/api
  sources: _sources         #   -> <docs_dir>/_sources
  bruno: api/bruno          #   -> <docs_dir>/api/bruno
lang:
  anchor: en                # language for slugs/anchors
  content: vi               # language for display content
bruno:
  base_url: http://localhost:3000
  env: local                # -> environments/<env>.bru
project:
  name: ""                  # <title>/<h1> in api.html + README heading
  description: ""           # optional
ignore: []                  # glob patterns for files/folders to skip in consistency checks
                            # relative to <docs_dir>, e.g. ["api/sdk-generated", "**/CHANGELOG.md"]
```

| Key | Default | Used by |
|---|---|---|
| `docs_dir` | `docs` | all commands — root for path resolution |
| `dirs.api` / `dirs.sources` / `dirs.bruno` | `api` / `_sources` / `api/bruno` | all file-writing commands |
| `lang.anchor` / `lang.content` | `en` / `vi` | anchor conventions (`reference-conventions.md`) |
| `bruno.base_url` / `bruno.env` | `http://localhost:3000` / `local` | Bruno generation (`api-html-contract.md`) |
| `project.name` / `project.description` | empty | README + `api.html` |
| `ignore` | `[]` | consistency check — glob patterns excluded from scan |

## Resolve rules (step 0)

1. Read `.docswiki.yml` at cwd. If absent, read `.docswiki` (no extension) as YAML.
   Both present → `.docswiki.yml` takes precedence.
2. Merge with defaults: **shallow merge per leaf key** (only written keys override).
3. Unknown keys → silently ignored.
4. No file found → use all defaults. Do NOT block execution.

All paths and conventions below are resolved from this config, never hardcoded.
`<docs_dir>`, `<dirs.sources>`… in other references are placeholders pointing here.
