# Consistency Check (run ONLY when requested)

Scan all of `<docs_dir>` and report discrepancy types. Do NOT auto-run after every edit.

> Paths below use default names (root `docs/`, `_sources`, `api/bruno`). Resolve
> from `docs_dir`/`dirs.*` in `.docswiki.yml` if the project uses different names (see `config.md`).

## Ignore patterns (from config)

Before scanning, read the `ignore` array from `.docswiki.yml` (default `[]`). Each entry is a
glob pattern relative to `<docs_dir>`. Skip any file or directory matching at least one pattern.

```yaml
ignore:
  - "api/sdk-generated"   # skip entire generated subfolder
  - "**/CHANGELOG.md"     # skip any CHANGELOG regardless of depth
```

Apply ignore patterns to **all 6 check types** below. Files excluded here do not appear in the report.

## 6 discrepancy types

### 1. Broken links
Every markdown link `(<path>#<anchor>)` pointing to a file inside docs MUST have an existing anchor.
Two valid path styles — scan both:
- **Derived docs** (overview/cms/mobile/design at root of `docs/`): include directory prefix,
  e.g. `(_sources/glossary.md#shopping-cart)`. Endpoint links point to a `.bru` file path
  (no anchor), e.g. `(api/bruno/orders/create-order.bru)` — see Type 4.
- **Internal links between `_sources/` files**: sibling-style, NO `_sources/` prefix,
  e.g. `(glossary.md#shopping-cart)`, `(data-model.md#order)` (as seen in `flows.md`).

How to scan:
- Grep all links `(<path>.md#<anchor>)` in `<docs_dir>` for anchor-based targets.
  `.bru` file-path links (no anchor) are checked in Type 4, not here.
- **Base resolve = directory of the file containing the link** (not root `docs/`). This rule applies
  to both styles: derived doc at root → `_sources/glossary.md` resolves to `docs/_sources/glossary.md`;
  `flows.md` inside `_sources/` → `glossary.md` resolves to `docs/_sources/glossary.md`.
- For each target: check whether `### <anchor>`, `<a id="<anchor>">`, or `id="<anchor>"` exists
  in the resolved file. Report links where the target is not found.
- **Skip** links inside instruction lines (blockquotes starting with `>`): those are illustrative
  examples of how to write links, not real references (e.g. the header line in each `_sources/` file).

### 2. Orphan terms/fields
Concepts mentioned in derived docs but not yet defined in `_sources`.
- Scan all derived docs (files outside `_sources/`). For each file, collect:
  (a) bold phrases (`**...**` or `__...__`) that have no adjacent `_sources/` link on the same or next line;
  (b) terms repeated 3+ times across 2+ derived docs with no link to `_sources/` anywhere.
- For each candidate: check whether a matching anchor exists in `_sources/` (fuzzy match on slug).
- Report: term, file(s) + occurrence count, and whether a corresponding `_sources/` anchor was found.
  List as candidates — ask user to confirm whether a definition is needed before acting.

### 3. Duplicate definitions (copied instead of linked)
A definition that is repeated inline in a derived doc.
- Find entity/field/flow descriptions in derived docs that duplicate content in `_sources`.
- Report: "should be replaced with a link to `_sources/...#anchor`".

### 4. Endpoint links (.bru)
`.bru` files in `<dirs.bruno>` are the API source. Check the links between them and derived docs:
- **Broken endpoint link:** any `(<path>.bru)` link in derived docs whose target file does not exist.
- **Orphan endpoint:** a `.bru` file in `<dirs.bruno>` not linked from any derived doc (like an
  orphan anchor in Type 5). Skip `bruno.json` and files under `environments/`.
- **Deprecated still referenced:** a `.bru` whose `docs` block starts with `> **DEPRECATED**` but is
  still linked from a derived doc — grep `(<path>.bru)` in files outside `_sources/`; warn.

### 5. Orphan anchors (defined but not referenced)
Anchors defined in `<dirs.sources>/` but not linked from any derived doc.
- For each `### <slug>` and `<a id="...">` in `<dirs.sources>/` files: check whether at least
  one link `(<path>#<slug>)` exists in files **outside** `_sources/`.
- **Skip** internal links between `_sources/` files (sibling links like `(glossary.md#term)`):
  an anchor needs at least one link from a derived doc.
- **Skip** `INDEX.md` — this file links to every anchor by design and does not count as "actually used".
- Report: "anchor `#<slug>` in `<file>` has no references from any derived doc".
- **Note:** newly created anchors that are indexed in `INDEX.md` but not yet linked from any derived doc
  will appear here — this is expected behavior for new terms, not an error. Only worth investigating
  if the anchor has existed a long time with no incoming links.

### 6. Non-existent fields / type mismatch
- For each `.bru` file in `<dirs.bruno>`: read the `docs` block and find a link
  `data-model.md#<entity>` (the body's declared source entity).
- Compare the keys in the `.bru` `body:json` block against the fields of that entity in
  `<dirs.sources>/data-model.md`.
- Report fields used in the `.bru` body that data-model does not define.
- A `.bru` with a `body:json` but no `data-model` link in its `docs` block → report as a hint
  ("body entity not declared"), not an error.

## Report template

```
## Consistency Check — <date>

### Broken links (n)
- cms.md:42 → _sources/glossary.md#shopping-cart  (anchor not found)

### Orphan terms (n)
- mobile.md: "điểm thưởng" appears 3 times, not in glossary

### Duplicate definitions (n)
- overview.md:15-20 copies Order definition → should link _sources/data-model.md#order

### Endpoint links (n)
- mobile.md:30 → api/bruno/orders/refund-order.bru  (file not found)
- api/bruno/orders/list-orders.bru is not linked from any derived doc (orphan endpoint)

### Orphan anchors (n)
- _sources/glossary.md#loyalty-points has no references from any derived doc

### Non-existent fields (n)
- api/bruno/orders/create-order.bru body uses field "coupon" not in data-model.md#order

Total: n issues.
```
