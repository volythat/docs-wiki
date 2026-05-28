---
name: docs-wiki
description: >
  Single-source-of-truth documentation management — Vietnamese and English.
  Execute immediately, no brainstorming needed — these are direct operational commands.
  Use for: init docs / khởi tạo docs,
  add/edit term|field|endpoint|flow|decision / thêm/sửa thuật ngữ|field|endpoint|flow|quyết định,
  add docs file / thêm file docs, analyze old docs / phân tích docs cũ,
  restructure docs / tái cấu trúc docs, generate Bruno / sinh bruno,
  check consistency / kiểm tra nhất quán, where used / dùng ở đâu,
  create search index / tạo index tìm kiếm, update TOC / cập nhật mục lục.
  Also trigger for any request involving project documentation (PRD, API, CMS, mobile, design,
  specs, data model, flows) — even without an explicit command. If unsure whether docs-wiki
  applies, ask the user before proceeding.
---

# docs-wiki

> **Direct operational commands — do NOT run brainstorming first.** When the user says any command from the table below, execute immediately. This is not creative work.

Single-source-of-truth documentation system for app projects. Every fact (term, field, flow, endpoint) is defined in exactly ONE place in `_sources/` (or `api/api.html`); everywhere else only LINKS to it.

## Project config (.docswiki.yml) — read BEFORE every command

**Step 0 (before every command):** read `.docswiki.yml` at cwd (root folder).
- Present → merge with defaults (shallow merge per leaf key); unknown keys ignored.
- Absent → use all defaults, do NOT block execution.
- Also read `.docswiki` (no extension) if present, treat as YAML; `.docswiki.yml` takes precedence.

All paths/conventions below come FROM config, never hardcoded. Defaults: `docs_dir: docs`;
`dirs: {api: api, sources: _sources, bruno: api/bruno}`; `lang: {anchor: en, content: vi}`;
`bruno: {base_url: http://localhost:3000, env: local}`. Full schema: `references/config.md`.
Below, `<docs_dir>`, `<dirs.sources>`… are values resolved from config.

## Commands

| User says | Action |
|---|---|
| "khởi tạo docs" / "init docs" / "initialize docs" | **Pre-check:** if cwd has no `.docswiki.yml` AND the `docs` folder already exists → STOP, warn of overwrite risk, offer two options: (A) create `.docswiki.yml` with a different `docs_dir` first (e.g. `docs-v2`) then re-run, or (B) confirm scaffolding into current folder (existing files won't be overwritten but new files will be added). Only proceed after user chooses. If `.docswiki.yml` already exists: copy `templates/` into `<docs_dir>`, do NOT overwrite existing files. If cwd has no `.docswiki.yml` and user confirms (B): also generate `.docswiki.yml` at the same time. Report files created. |
| "thêm/sửa thuật ngữ\|field\|endpoint\|flow X" / "add/edit term\|field\|endpoint\|flow X" | Write definition to `<dirs.sources>` (or `<dirs.api>/api.html`), anchor per `lang.anchor`, content per `lang.content`, conventions in `references/reference-conventions.md`; suggest where to link. After writing: if `<dirs.sources>/INDEX.md` exists → update the corresponding entry (add if new, update description if already present). |
| "thêm/sửa quyết định X" / "add/edit decision X" | Write architecture decision to `<dirs.sources>/decisions.md` in minimal ADR format: **Context** (background/problem), **Decision** (chosen solution), **Consequences** (trade-offs). Anchor = English slug describing the decision (e.g. `use-uuid-for-id`). Append if new, update if already exists. If the decision supersedes an old one: add "Supersedes: [old-name](#old-anchor)" and update the old decision with "Superseded by: [new-name](#new-anchor)". ADR is append-only — NEVER delete old decisions, only mark superseded. After writing, if INDEX.md exists → add only a NEW entry for the newly created anchor; NEVER modify entries for old superseded anchors. |
| "thêm file docs [tên]" / "add docs file [name]" / "new docs file [name]" | Ask doc type before creating: **(R) Reference** — technical facts (fields, endpoints, config); **(H) How-to** — step-by-step guide for an already competent user; **(E) Explanation** — rationale, trade-offs, design context. If type cannot be determined → default to **(R) Reference**. Generate appropriate template header per type (Reference: table/list facts + source links; How-to: numbered steps + prerequisites; Explanation: prose + link to decisions.md if relevant). Then create `<docs_dir>/[name].md` linking to `<dirs.sources>/` (DO NOT copy definitions). If related entities/terms are undefined in `<dirs.sources>`, ask user if they want to add them first. After creating, "update TOC" will pick up this file automatically (scan-based, no manual registration needed). |
| "phân tích docs cũ từ [folder]" / "analyze old docs from [folder]" | **Pre-check:** if `<docs_dir>` matches `[folder]` → STOP, require different `docs_dir` in `.docswiki.yml`. `[folder]` is READ-ONLY, never modified or overwritten. **Phase 1 — Analysis:** Read all files in `[folder]`. Classify each content block as: (A) *Source definitions* (terms, entities, fields, flows, architecture decisions) → will go into `<dirs.sources>/glossary.md`, `data-model.md`, or `flows.md`; (B) *Feature summaries/specs* → will become derived docs, propose grouping into domain subfolders (e.g. `features/`, `monetization/`, `content/`); (C) *Endpoints/API* → will go into `<dirs.api>/api.html`; (D) *Unclear* → list separately. Output report: classification list + proposed folder tree for `<docs_dir>`. Ask for confirmation or adjustments before doing anything. **Phase 2 — Execute:** Only after confirmation: (1) create `<dirs.sources>/` with extracted source definitions — each definition appears here only, NEVER copied elsewhere; (2) create derived files in proposed subfolders — each file may ONLY contain links to `<dirs.sources>/` and short descriptions, NEVER repeat definitions inline; (3) create `<dirs.api>/api.html` if endpoints exist. NEVER touch `[folder]` at any step. |
| "tái cấu trúc docs" / "restructure docs" | Reshape current `<docs_dir>` to meet docs-wiki standards — do NOT delete and rebuild from scratch. **Mandatory exception:** `<dirs.sources>/decisions.md` is append-only — never restructure, move, or extract content from this file at any step. **Phase 1 — Audit:** Read all files in `<docs_dir>`, identify: (A) definition content sitting inline in derived docs → needs moving to `<dirs.sources>/`; (B) files not grouped into domain subfolders; (C) files already compliant (links only). Output "what needs fixing where" report + proposed folder tree after restructuring. Ask for confirmation. **Phase 2 — Execute (step-by-step, without breaking links):** (1) Extract definitions from derived docs → write to `<dirs.sources>/` with correct anchors; (2) Replace extracted content with links to corresponding anchors; (3) Move files to proposed subfolders, update all links pointing to those files; (4) Report each change made. Never delete a file without separate confirmation. |
| "sinh bruno" / "generate bruno" | Per `references/api-html-contract.md`: read `<dirs.api>/api.html`, generate/update `<dirs.bruno>`; `baseUrl`/env name per `bruno.*`. |
| "kiểm tra nhất quán" / "check consistency" | Per `references/consistency-check.md`: scan `<docs_dir>`, output report. Run ONLY when requested. |
| "X dùng ở đâu" / "where is X used" | Grep all links pointing to X's anchor in `<docs_dir>`; list file + line. |
| "tạo index tìm kiếm" / "create search index" | Scan all headings (anchors) in `<dirs.sources>/` files. For each anchor, take the first sentence below it as a short description (max 10 words). Generate/overwrite `<dirs.sources>/INDEX.md` with format: `- [Anchor name](file.md#anchor) — short description`, grouped by source file with `## filename` headers. Goal: AI reads this file first (~100-200 tokens) for orientation, then jumps directly to the needed anchor without scanning all docs. After generating, report the number of anchors indexed and the file path. |
| "cập nhật mục lục" / "update TOC" | Regenerate `README.md` by SCANNING `<docs_dir>` (not a hardcoded list → new files appear automatically) + table of contents from `<dirs.api>/api.html`. Use `project.name` for the title. |

## Implicit rules (ALWAYS follow)
1. **Write source first, link second.** Adding new info → write to `<dirs.sources>`/`<dirs.api>/api.html` FIRST, then link from derived docs. NEVER copy a definition into a derived doc.
2. **Anchor per `lang.anchor`, content per `lang.content`** (default EN/VI). See `references/reference-conventions.md`.
3. **Run consistency check only when requested** — do not auto-run after every edit.
4. **api.html is the API source of truth**, `.bru` files are generated output. Never edit `.bru` by hand.

## References
- `references/config.md` — `.docswiki.yml` schema + resolve rules.
- `references/reference-conventions.md` — anchor/link conventions.
- `references/api-html-contract.md` — api.html structure + Bruno generation.
- `references/consistency-check.md` — 6 consistency check types + scanning approach.
- `templates/_sources/decisions.md` — ADR template (append-only); copied to `<dirs.sources>/` on "init docs".
