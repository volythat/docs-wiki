# Hợp đồng cấu trúc api.html ↔ sinh Bruno

`api/api.html` là GỐC của API. Skill đọc nó để sinh `api/bruno/`. Vì vậy mỗi endpoint
PHẢI theo cấu trúc dưới đây — đây là hợp đồng giữa người soạn và skill.

## Cấu trúc một endpoint

```html
<section class="endpoint" id="create-order"
         data-method="POST" data-path="/orders"
         data-auth="bearer" data-seq="1">
  <h3>Tạo đơn hàng</h3>
  <p class="desc">Mô tả ngắn (tiếng Việt).</p>

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

**Thuộc tính bắt buộc trên `<section>`:** `id` (slug tiếng Anh), `data-method`, `data-path`.
**Tuỳ chọn:** `data-auth` (`none|bearer|basic`, mặc định `none`), `data-seq` (thứ tự trong Bruno).
**`data-ref`** trên request-body: con trỏ LOGIC tới entity trong `_sources/data-model.md`
(dạng `data-model.md#<entity>`) để kiểm tra field — KHÔNG phải đường dẫn file tương đối từ
`api/api.html`. Khi dò lệch, resolve `<entity>` trong `_sources/data-model.md`.

**Wrapper trình bày được phép.** Generator parse theo CLASS/THUỘC TÍNH (`section.endpoint`,
`data-*`, `h3`, `div.headers > div.header`, `pre.request-body`, `pre.response`), KHÔNG theo vị
trí trong DOM. Template ships có thể bọc nội dung trong `div.endpoint-doc` / `div.endpoint-code`,
thêm `div.route`, `p.section-label`… để làm đẹp — miễn các phần tử/thuộc tính bắt buộc còn nguyên.
`<h3>` có thể là nhãn phẳng (vd `<h3>Tạo đơn hàng</h3>`) vì method/path đã nằm ở `data-method`/
`data-path`; `div.route` chỉ là trang trí, generator không đọc.

## Bố cục Bruno sinh ra

```
api/bruno/
  bruno.json
  environments/
    local.bru
  <slug>.bru          ← mỗi endpoint một file, tên = id của section
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

`environments/local.bru`:
```
vars {
  baseUrl: http://localhost:3000
}
```

## Thuật toán map endpoint → .bru

Với mỗi `<section class="endpoint">`:
1. Tên file = `<id>.bru`.
2. Khối `meta`: `name` = nhãn mô tả trong `<h3>`, `type: http`, `seq` = `data-seq` (mặc định thứ tự xuất hiện).
   - Nếu `<h3>` có trang trí method/path (vd `<span class="method">POST</span> /orders — Tạo đơn hàng`),
     lấy phần nhãn sau dấu `—` (`Tạo đơn hàng`). Nếu không có dấu `—`, lấy toàn bộ text đã strip thẻ.
3. Khối method (`get`/`post`/...) theo `data-method` (chữ thường):
   - `url: {{baseUrl}}<data-path>`
   - `body: json` nếu có `pre.request-body`, ngược lại `body: none`
   - `auth: <data-auth>`
4. Khối `headers`: từng `div.header` → `<data-key>: <data-value>`.
   - Nếu `data-auth="bearer"`: thêm khối `auth:bearer { token: {{token}} }`.
5. Khối `body:json`: copy nguyên text trong `pre.request-body > code`.

## Ví dụ hoàn chỉnh

Section ở trên sinh ra `api/bruno/create-order.bru`:

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
