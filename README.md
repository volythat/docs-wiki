# docs-wiki

🇻🇳 [Tiếng Việt](README.vi.md)

A **single-source-of-truth documentation skill** for app projects. Every fact
(term, field, flow, endpoint) is defined in exactly **one place** inside
`_sources/` (or a `.bru` file in `api/bruno/`); everything else only **links** to it. This
keeps docs consistent as the project evolves and enables automated consistency
checks.

> **No runtime.** This skill is a set of Markdown instructions for your AI tool.
> "Installing" means copying the `skill/` folder into the tool's skills
> directory, then giving natural-language commands (see [Usage](#usage)).

## Install

### Linux / macOS

```bash
./install/install.sh claude    # → ~/.claude/skills/docs-wiki/  + ~/.claude/CLAUDE.md
./install/install.sh codex     # → ~/.codex/skills/docs-wiki/   + ~/.codex/AGENTS.md
./install/install.sh gemini    # → ~/.gemini/config/skills/docs-wiki/ + ~/.gemini/GEMINI.md
```

> **Convenience aliases:** `install-claude.sh`, `install-codex.sh`, and
> `install-gemini.sh` are thin wrappers that forward to `install.sh`.

To **uninstall**:
```bash
./install/install.sh uninstall claude   # removes ~/.claude/skills/docs-wiki/ + trigger rule
./install/install.sh uninstall codex
./install/install.sh uninstall gemini
```

### Windows (PowerShell)

```powershell
.\install\install.ps1 claude   # → ~\.claude\skills\docs-wiki\  + ~\.claude\CLAUDE.md
.\install\install.ps1 codex    # → ~\.codex\skills\docs-wiki\   + ~\.codex\AGENTS.md
.\install\install.ps1 gemini   # → ~\.gemini\config\skills\docs-wiki\ + ~\.gemini\GEMINI.md
```

If PowerShell blocks the script, run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

To **uninstall**:
```powershell
.\install\install.ps1 claude -Uninstall
.\install\install.ps1 codex  -Uninstall
.\install\install.ps1 gemini -Uninstall
```

Each install script (bash or PowerShell) does two things:
1. Syncs `skill/` into the platform's skills directory
2. Appends a trigger rule to the platform's global instruction file (idempotent — safe to re-run)

The trigger rule is what makes the skill activate automatically when you mention
docs-related topics. Re-run the script whenever you update the skill source.

### Cursor

Cursor rules are **project-local** — run this script once per project.

**Linux / macOS:**
```bash
./install/install-cursor.sh /path/to/your/project
# or from inside the project:
/path/to/docs-wiki/install/install-cursor.sh .
```

**Windows (PowerShell):**
```powershell
.\install\install-cursor.ps1 C:\path\to\project
# or from inside the project:
\path\to\docs-wiki\install\install-cursor.ps1 .
```

Creates `.cursor/rules/docs-wiki.mdc` + `.cursor/rules/docs-wiki/references/`
and `.cursor/rules/docs-wiki/templates/` in the target project. The rule
activates automatically when you issue docs-wiki commands in Cursor.

To **uninstall** (removes all docs-wiki rules from the project):
```bash
./install/install-cursor.sh uninstall /path/to/your/project
```
```powershell
.\install\install-cursor.ps1 C:\path\to\project -Uninstall
```

## Usage

After installing, talk to your AI in natural language. The skill recognises
these commands:

| You say | What happens |
|---|---|
| **"init docs"** | Scaffolds the `docs/` folder from templates and generates `.docswiki.yml`. Never overwrites existing files. |
| **"add/edit term\|field\|endpoint\|flow X"** | Writes the definition into the source (`_sources/`, or a `.bru` file in `api/bruno/` for endpoints), then suggests where to link. Updates `INDEX.md` if present. |
| **"add/edit decision X"** | Writes an Architecture Decision Record (ADR) to `_sources/decisions.md` in Context / Decision / Consequences format. Append-only — old decisions are never deleted. |
| **"add docs file [name]"** | Asks for doc type (Reference / How-to / Explanation), then creates `docs/[name].md` with links to `_sources/` — no copied definitions. The next "update TOC" picks it up automatically. |
| **"analyze old docs from [folder]"** | `[folder]` is **read-only** — never modified. Requires `docs_dir` in `.docswiki.yml` to point to a *different* folder; stops with a warning if they match. **Phase 1:** classifies content into definitions → `_sources/`, summaries → derived docs, endpoints → `.bru` files in `api/bruno/`, unclear → listed separately. Outputs report and asks for confirmation. **Phase 2:** creates files only after confirmation. |
| **"restructure docs"** | Audits the current `docs/` folder, moves inline definitions to `_sources/`, groups files into domain subfolders, and replaces copied content with links. Step-by-step with confirmation. |
| **"generate bruno"** | Scaffolds a new `.bru` endpoint skeleton under `api/bruno/` (and `bruno.json` / environment if missing) for you to fill in. |
| **"check consistency"** | Scans all of `docs/` and reports 6 drift types: broken links, orphan terms, duplicate definitions, endpoint links (`.bru`), orphan anchors, and missing fields. |
| **"where is X used"** | Lists every file + line that links to X's anchor. |
| **"create search index"** | Scans all anchors in `_sources/` and generates `_sources/INDEX.md` — a compact (~100-200 token) index for fast AI navigation. |
| **"update TOC"** | Regenerates the docs `README.md` by scanning the directory (no hardcoded manifest). |

### Core rules

1. **Write to source first, then link** — never copy a definition into a derived doc.
2. **English anchors, Vietnamese content** by default (configurable via `.docswiki.yml`).
3. **`.bru` files in `api/bruno/` are the API source of truth** — hand-authored with `docs` blocks; the HTML docs is generated by Bruno on demand and not committed.
4. **Consistency check runs only on request**, not automatically after every edit.

## Dashboard

`skill/dashboard/build.js` generates a self-contained `dashboard.html` — a single-page app that renders all your docs and API endpoints in a browser.

**Features:** sidebar navigation, full-text search (`⌘K`), light/dark theme, Mermaid diagram support, copy buttons on code blocks, right-side heading outline, and an overview stats page.

### Setup

```bash
cd skill/dashboard
npm install
```

### Run

```bash
# From your project root (reads .docswiki.yml automatically)
node /path/to/docs-wiki/skill/dashboard/build.js

# Explicit paths
node /path/to/docs-wiki/skill/dashboard/build.js --docs=docs --out=dashboard.html
```

| Flag | Default | Description |
|---|---|---|
| `--docs=<path>` | `docs_dir` from `.docswiki.yml` | Docs folder to scan |
| `--out=<path>` | `dashboard.html` at project root | Output HTML file |

The generated file is fully self-contained — open it in any browser, no server needed.

---

## Migrating an existing project

If your project already has docs (even messy ones), the recommended approach is
to **restructure into a new folder** so existing docs stay untouched until
you're ready to replace them.

### Step-by-step

**1. Configure a new target folder**

Create `.docswiki.yml` at your project root, pointing `docs_dir` at a new
folder (e.g. `docs-v2`). The old folder is untouched.

```yaml
docs_dir: docs-v2
project:
  name: My Project
```

**2. Scaffold the structure**

Tell your AI: `"init docs"`. The skill creates `docs-v2/`
with the full template structure and will not overwrite anything that already
exists.

**3. Move definitions into `_sources/` first**

Audit your existing docs and identify what is a *definition* vs. what is a
*summary/view*. For each definition (term, entity, field, flow):

> `"add term [X]"` / `"add field [X]"` / `"add flow [X]"`

The skill writes it to the correct source file (`glossary.md`, `data-model.md`,
`flows.md`) with the right anchor and conventions.

**4. Rebuild derived docs as link-only files**

For each section (CMS, mobile, design, backend…):

> `"add docs file cms"` / `"add docs file mobile"` …

The skill creates the file with sections that *link* to `_sources/`, never
copying definitions.

**5. Migrate the API**

Recreate each existing endpoint as a `.bru` file under `api/bruno/` following the contract in
`skill/references/bruno-contract.md` (use `"generate bruno"` to scaffold a skeleton, then fill it in).
Bruno's "Generate Documentation" exports a complete HTML when you need a shareable file.

**6. Check consistency**

> `"check consistency"` — reports broken links, orphan terms, endpoint-link issues, and
> field mismatches. Fix what's flagged before switching over.

**7. Update the table of contents**

> `"update TOC"` — scans `docs-v2/` and regenerates `README.md`.

**8. Switch over**

Once everything looks good, rename `docs-v2/` → `docs/` (or update `docs_dir`
in `.docswiki.yml`) and retire the old folder.

---

## Configuration — `.docswiki.yml`

The skill reads `.docswiki.yml` at the project root **before every command**.
Declare only the keys you want to override; missing keys use defaults. Missing
file entirely → all defaults, nothing is blocked. The "init docs" command
generates this file automatically.

```yaml
docs_dir: docs              # docs folder (rename if your project uses a different name)
dirs:
  sources: _sources
  bruno: api/bruno
lang:
  anchor: en                # language for slugs/anchors (stable identifiers)
  content: vi               # language for content
bruno:
  base_url: http://localhost:3000
  env: local
project:
  name: ""
  description: ""
```

Full schema and resolve rules: [`skill/references/config.md`](skill/references/config.md).

## Repository structure

```
.
├── skill/                  # Skill source (what gets installed)
│   ├── SKILL.md            # Entry point: commands + implicit rules
│   ├── agents/             # Codex UI metadata (openai.yaml)
│   ├── dashboard/          # Standalone HTML dashboard generator
│   │   ├── build.js        # node build.js → dashboard.html
│   │   └── package.json    # single dependency: marked
│   ├── references/         # Details: config, link conventions, Bruno contract, consistency checks
│   └── templates/          # docs/ scaffolding + sample .docswiki.yml
├── install/
│   ├── install.sh          # Linux/macOS: shared logic (rsync + trigger injection)
│   ├── install-claude.sh   # Wrapper → ~/.claude/skills/docs-wiki/
│   ├── install-codex.sh    # Wrapper → ~/.codex/skills/docs-wiki/
│   ├── install-gemini.sh   # Wrapper → ~/.gemini/config/skills/docs-wiki/
│   ├── install-cursor.sh   # Generates Cursor rule from SKILL.md → <project>/.cursor/rules/
│   ├── install.ps1         # Windows equivalent of install.sh
│   └── install-cursor.ps1  # Windows equivalent of install-cursor.sh
└── README.md               # This file
```

Detailed skill behaviour lives in [`skill/SKILL.md`](skill/SKILL.md) and the
files under `skill/references/`.
