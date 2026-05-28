# Reference Conventions (single source of truth)

## Core principles
- **Anchor = slug per `lang.anchor`** (default `en`, stable identifier).
  **Display content per `lang.content`** (default `vi`).
  Renaming display label must NOT break the anchor. (`lang.*` from `.docswiki.yml`, see `config.md`.)
- Definitions live in `<dirs.sources>/` (or `<dirs.api>/api.html` for endpoints). Everywhere else only LINKS.

## Creating anchors

| Type | Defined in | Anchor | Example link |
|---|---|---|---|
| Term | `_sources/glossary.md` | heading `### <lang.anchor-slug>` | `[Giỏ hàng](_sources/glossary.md#shopping-cart)` |
| Entity | `_sources/data-model.md` | heading `### <lang.anchor-slug>` | `[Người dùng](_sources/data-model.md#user)` |
| Field | `_sources/data-model.md` | `<a id="<entity>-<field>"></a>` inside table | `[email](_sources/data-model.md#user-email)` |
| Flow | `_sources/flows.md` | heading `### <lang.anchor-slug>` | `[Thanh toán](_sources/flows.md#checkout)` |
| Endpoint | `api/api.html` | `id="<lang.anchor-slug>"` on `<section>` | `[Tạo đơn hàng](api/api.html#create-order)` |
| Decision | `_sources/decisions.md` | heading `### <lang.anchor-slug>` | `[Dùng UUID](_sources/decisions.md#use-uuid-for-id)` |

## Slug rules
- Lowercase, hyphen-separated, only `[a-z0-9-]`.
- Semantic description, not literal translation (e.g. `checkout`, not `thanh-toan`).
- Set once, never changed. To rename: change the DISPLAY label, keep the slug.

## When to link vs. copy
- Derived docs (overview/cms/mobile/design): always LINK to the definition, never copy.
- May write contextual sentences around the link, as long as they don't repeat the definition itself.
