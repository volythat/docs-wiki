# Consistency Check (run ONLY when requested)

Scan all of `<docs_dir>` and report discrepancy types. Do NOT auto-run after every edit.

> Paths below use default names (root `docs/`, `_sources`, `api/api.html`, `api/bruno`). Resolve
> from `docs_dir`/`dirs.*` in `.docswiki.yml` if the project uses different names (see `config.md`).

## 6 discrepancy types

### 1. Broken links
Every markdown link `(<path>#<anchor>)` pointing to a file inside docs MUST have an existing anchor.
Two valid path styles — scan both:
- **Derived docs** (overview/cms/mobile/design at root of `docs/`): include directory prefix,
  e.g. `(_sources/glossary.md#shopping-cart)`, `(api/api.html#create-order)`.
- **Internal links between `_sources/` files**: sibling-style, NO `_sources/` prefix,
  e.g. `(glossary.md#shopping-cart)`, `(data-model.md#order)` (as seen in `flows.md`).

How to scan:
- Grep all links `(<path>.md#<anchor>)` and `(<path>.html#<anchor>)` in `<docs_dir>`.
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

### 4. .bru vs. api.html drift
- List endpoints from `<dirs.api>/api.html` (each `<section data-method data-path>`).
- List `.bru` files in `<dirs.bruno>`.
- Report: endpoints in html but missing a .bru; surplus .bru with no html counterpart;
  method/path/body mismatches.
- Report: endpoints with `data-deprecated="true"` in api.html that are still linked from derived docs —
  use the same link grep from type 1 to find `(api.html#<slug>)` in files outside `_sources/`;
  warn "deprecated endpoint is still being referenced".

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
- For each `data-ref="data-model.md#<entity>"` in api.html: check whether fields in the
  request-body exist in that entity in `data-model.md`.
- Report fields used in the API that data-model does not define.

## Report template

```
## Consistency Check — <date>

### Broken links (n)
- cms.md:42 → _sources/glossary.md#shopping-cart  (anchor not found)

### Orphan terms (n)
- mobile.md: "điểm thưởng" appears 3 times, not in glossary

### Duplicate definitions (n)
- overview.md:15-20 copies Order definition → should link _sources/data-model.md#order

### .bru drift (n)
- api.html has endpoint #refund-order but api/bruno/refund-order.bru is missing

### Orphan anchors (n)
- _sources/glossary.md#loyalty-points has no references from any derived doc

### Non-existent fields (n)
- api.html #create-order uses field "coupon" not found in data-model.md#order

Total: n issues.
```
