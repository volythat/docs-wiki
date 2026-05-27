# docs-wiki

🇻🇳 [Tiếng Việt](README.vi.md)

A **single-source-of-truth documentation skill** for app projects. Every fact
(term, field, flow, endpoint) is defined in exactly **one place** inside
`_sources/` (or `api/api.html`); everything else only **links** to it. This
keeps docs consistent as the project evolves and enables automated consistency
checks.

> **No runtime.** This skill is a set of Markdown instructions for Claude.
> "Installing" means copying the `skill/` folder into your AI tool's skills
> directory, then giving natural-language commands (see [Usage](#usage)).

## Install

### Claude Code

```bash
./install/install-claude.sh
```

Copies `skill/` → `~/.claude/skills/docs-wiki/`. Re-run whenever you update
the skill source to sync changes. After installing, open Claude Code in your
project folder and issue commands directly — the skill activates automatically.

> Multi-tool support (Codex, Antigravity, Cursor) is planned (Plan 2), not yet
> available.

## Usage

After installing, talk to Claude in natural language. The skill recognises these
commands:

| You say | What happens |
|---|---|
| **"init docs"** | Scaffolds the `docs/` folder from templates and generates `.docswiki.yml`. Never overwrites existing files. |
| **"add/update term\|field\|endpoint\|flow X"** | Writes the definition into the source (`_sources/` or `api/api.html`), then suggests where to link. |
| **"add docs file [name]"** | Creates `docs/[name].md` as a derived doc: title, short description, sections with links to `_sources/` (no copied definitions). If related entities are missing from `_sources/`, asks whether to add them first. The next "update table of contents" picks it up automatically. |
| **"generate bruno"** | Reads `api/api.html` and generates/updates a Bruno collection under `api/bruno/`. |
| **"check consistency"** | Scans all of `docs/` and reports 5 drift types (broken links, orphan terms, duplicate definitions, `.bru` drift, missing fields). |
| **"where is X used"** | Lists every file + line that links to X's anchor. |
| **"update table of contents"** | Regenerates the docs `README.md` and `api.html` TOC by scanning the directory (no hardcoded manifest). |

### Core rules

1. **Write to source first, then link** — never copy a definition into a derived doc.
2. **English anchors, Vietnamese content** by default (configurable via `.docswiki.yml`).
3. **`api.html` is the API source of truth** — `.bru` files are generated output, never edit them by hand.
4. **Consistency check runs only on request**, not automatically after every edit.

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

Tell Claude: `"khởi tạo docs"` (or `"init docs"`). The skill creates `docs-v2/`
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

Copy your existing endpoints into `api/api.html` following the contract in
`skill/references/api-html-contract.md`, then:

> `"generate bruno"` — regenerates the Bruno collection from the HTML.

**6. Check consistency**

> `"check consistency"` — reports broken links, orphan terms, `.bru` drift, and
> field mismatches. Fix what's flagged before switching over.

**7. Update the table of contents**

> `"update table of contents"` — scans `docs-v2/` and regenerates `README.md`.

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
  api: api
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
│   ├── references/         # Details: config, link conventions, api.html contract, consistency checks
│   └── templates/          # docs/ scaffolding + sample .docswiki.yml
├── install/
│   └── install-claude.sh   # Copies skill/ → ~/.claude/skills/docs-wiki/
└── README.md               # This file
```

Detailed skill behaviour lives in [`skill/SKILL.md`](skill/SKILL.md) and the
files under `skill/references/`.
