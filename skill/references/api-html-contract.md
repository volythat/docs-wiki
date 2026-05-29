# api.html ↔ Bruno Generation Contract

`<dirs.api>/api.html` is the API source of truth. The skill reads it to generate `<dirs.bruno>/`.
Every endpoint MUST follow the structure below — this is the contract between author and skill.

## Endpoint structure

```html
<section class="endpoint" id="create-order"
         data-method="POST" data-path="/orders"
         data-auth="bearer" data-seq="1">
  <h3>Tạo đơn hàng</h3>
  <p class="desc">Short description (Vietnamese).</p>

  <div class="headers">
    <div class="header" data-key="Content-Type" data-value="application/json"></div>
  </div>

  <h4>Request body</h4>
  <pre class="request-body" data-ref="data-model.md#order"><code>{
  "items": [{ "productId": "string", "qty": 0 }],
  "note": "string"
}</code></pre>

  <h4>Response 201</h4>
  <pre class="response" data-status="201"><code>{
  "id": "string",
  "status": "pending"
}</code></pre>
</section>
```

**Required attributes on `<section>`:** `id` (slug per `lang.anchor`), `data-method`, `data-path`.
**Optional:** `data-auth` (`none|bearer|basic`, default `none`), `data-seq` (order in Bruno), `data-deprecated="true"` (marks endpoint as no longer in use — generated .bru gets a leading `# DEPRECATED` comment; consistency check warns if any derived doc still links to it).
**`data-ref`** on request-body: LOGICAL pointer to an entity in `<dirs.sources>/data-model.md`
(format `data-model.md#<entity>`) for field validation — NOT a relative file path from
`<dirs.api>/api.html`. When checking drift, resolve `<entity>` inside `<dirs.sources>/data-model.md`.

**Presentation wrappers are allowed.** The generator parses by CLASS/ATTRIBUTE (`section.endpoint`,
`data-*`, `h3`, `div.headers > div.header`, `pre.request-body`, `pre.response`), NOT by DOM position.
Templates may wrap content in `div.endpoint-doc` / `div.endpoint-code`, add `div.route`,
`p.section-label`… for styling — as long as the required elements/attributes are intact.
`<h3>` may be a flat label (e.g. `<h3>Tạo đơn hàng</h3>`) since method/path are already in
`data-method`/`data-path`; `div.route` is decorative and ignored by the generator.

## Query parameters

For GET endpoints (or any endpoint with URL query params), add `div.query-params` inside `<section>`:

```html
<div class="query-params">
  <div class="param" data-name="status"  data-type="string"  data-required="false"
       data-example="pending" data-desc="pending|completed|cancelled"></div>
  <div class="param" data-name="page"    data-type="integer" data-required="false"
       data-example="1"       data-desc="page number, 1-based"></div>
</div>
```

**`div.param` attributes:** `data-name` (required), `data-type` (`string|integer|boolean`, optional),
`data-required` (`true|false`, optional, default `false`), `data-example` (value written into the
`.bru` params block — omit if no sensible default), `data-desc` (human note, NOT written to `.bru`).

## Error responses

Add multiple `<pre class="response">` elements with different `data-status` values:

```html
<h4>Response 201</h4>
<pre class="response" data-status="201"><code>{"id": "string", "status": "pending"}</code></pre>

<h4>Response 400</h4>
<pre class="response" data-status="400"><code>{"error": "invalid_input", "message": "string"}</code></pre>

<h4>Response 401</h4>
<pre class="response" data-status="401"><code>{"error": "unauthorized"}</code></pre>
```

The `.bru` file records only the **first 2xx response** body (`data-status` starting with `2`).
All other status variants are preserved as documentation in `api.html` only — they are NOT mapped
to Bruno test assertions.

## File upload (multipart)

Set `data-content-type="multipart"` on `pre.request-body`. The JSON block describes the fields
(`"file": "binary"` marks binary fields):

```html
<pre class="request-body" data-content-type="multipart"><code>{
  "file": "binary",
  "caption": "string"
}</code></pre>
```

Default `data-content-type` when absent is `json`.

## Generated Bruno layout (default)

```
api/bruno/
  bruno.json
  environments/
    local.bru
  <slug>.bru          ← one file per endpoint, name = section id
```

`bruno.json`:
```json
{
  "version": "1",
  "name": "API",
  "type": "collection",
  "ignore": ["node_modules", ".git"]
}
```

`environments/<bruno.env>.bru` (filename = `bruno.env`, default `local`):
```
vars {
  baseUrl: <bruno.base_url>
}
```
`<bruno.base_url>` comes from `.docswiki.yml` (default `http://localhost:3000`); see `config.md`.
Bruno output directory is `<dirs.bruno>` (default `api/bruno`), not hardcoded.

## Endpoint → .bru mapping algorithm

For each `<section class="endpoint">`:
1. Filename = `<id>.bru`.
2. If `data-deprecated="true"`: prepend `# DEPRECATED` as the very first line before all other blocks.
3. `meta` block: `name` = label from `<h3>`, `type: http`, `seq` = `data-seq` (default: order of appearance).
   - If `<h3>` contains method/path decoration (e.g. `<span class="method">POST</span> /orders — Tạo đơn hàng`),
     take the label after the `—` separator (`Tạo đơn hàng`). If no `—`, take the full stripped text.
4. Method block (`get`/`post`/…) from `data-method` (lowercase):
   - `url: {{baseUrl}}<data-path>`
   - `body: json` if `pre.request-body` exists AND `data-content-type` is absent or `json`
   - `body: multipart` if `pre.request-body` exists AND `data-content-type="multipart"`
   - `body: none` if no `pre.request-body`
   - `auth: <data-auth>`
5. `headers` block: each `div.header` → `<data-key>: <data-value>`.
   - If `data-auth="bearer"`: also add `auth:bearer { token: {{token}} }` block.
6. `body:json` / `body:multipart` block: copy raw text from `pre.request-body > code`.
   For multipart: emit `body:multipart { ... }` instead of `body:json { ... }`.
7. `params:query` block: if `div.query-params` exists → each `div.param` with `data-example` →
   `<data-name>: <data-example>`. Params without `data-example` are omitted. Skip block entirely
   if no param has `data-example`.

## Complete example

The section above generates `api/bruno/create-order.bru`:

```
meta {
  name: Tạo đơn hàng
  type: http
  seq: 1
}

post {
  url: {{baseUrl}}/orders
  body: json
  auth: bearer
}

headers {
  Content-Type: application/json
}

auth:bearer {
  token: {{token}}
}

body:json {
  {
    "items": [{ "productId": "string", "qty": 0 }],
    "note": "string"
  }
}
```
