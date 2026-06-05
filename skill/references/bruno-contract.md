# Bruno `.bru` ↔ API Source Contract

`<dirs.bruno>` (mặc định `api/bruno`) là **nguồn sự thật cho API**. Mỗi endpoint là một
file `.bru` viết tay. Bruno GUI tự xuất một file HTML docs hoàn chỉnh khi cần
("Generate Documentation") — file HTML đó **không commit** vào repo.

> Trước đây `api.html` là nguồn và `.bru` là output. Hợp đồng này đảo chiều: `.bru` là nguồn.

## Cấu trúc một endpoint (`.bru`)

```
meta {
  name: Tạo đơn hàng          # nhãn hiển thị, theo lang.content
  type: http
  seq: 1                       # thứ tự hiển thị trong collection (tùy chọn)
}
post {
  url: {{baseUrl}}/orders
  body: json
  auth: bearer                 # none | bearer | basic
}
headers {
  Content-Type: application/json
}
params:query {                 # chỉ thêm khi endpoint có query param
  status: pending
}
body:json {
  {
    "items": [{ "productId": "string", "qty": 0 }],
    "note": "string"
  }
}
docs {
  Tạo một đơn hàng mới từ giỏ hàng hiện tại.

  Body theo entity [order](../../_sources/data-model.md#order).
}
```

## Quy ước

- **Định danh endpoint = đường dẫn file `.bru`.** Tên file = slug theo `lang.anchor`
  (vd `create-order.bru`). Đặt một lần; đổi tên endpoint = đổi tên file + cập nhật mọi link.
- **`meta.name`** = nhãn hiển thị theo `lang.content`. **`meta.seq`** = thứ tự (tùy chọn).
- **Khối method** (`get`/`post`/`put`/`patch`/`delete`): `url` dùng `{{baseUrl}}`;
  `auth: none|bearer|basic`; `body: json` khi có body JSON.
- **`headers`**: mỗi dòng `Key: Value`.
- **`params:query`**: chỉ khi có query param; mỗi dòng `name: example`. (Tiền tố `~` = param tắt.)
- **`body:json`**: thân request JSON. Là nguồn để consistency check đối chiếu field.
- **Khối `docs`** (markdown, `lang.content`): mô tả endpoint. Khi body khớp một entity,
  thêm link `[<entity>](<đường-dẫn-tương-đối>/data-model.md#<entity>)` để khai báo nguồn field.
- **Deprecated**: dòng đầu khối `docs` viết `> **DEPRECATED**`. Consistency check grep dòng này
  và cảnh báo nếu endpoint vẫn bị doc dẫn xuất link.
- **Nhiều response / mã lỗi**: Bruno không lưu nhiều response mẫu — mô tả các mã lỗi bằng
  văn bản trong khối `docs` nếu cần, không bắt buộc cấu trúc hóa.

## Biến môi trường

`{{baseUrl}}` định nghĩa trong `<dirs.bruno>/environments/<bruno.env>.bru`:

```
vars {
  baseUrl: http://localhost:3000
}
```

`baseUrl` lấy từ `bruno.base_url`, tên file env lấy từ `bruno.env` trong `.docswiki.yml`.

## Cấu trúc collection sinh ra (mặc định)

```
api/bruno/
  bruno.json                 # { "version": "1", "name": ..., "type": "collection" }
  environments/
    local.bru                # vars { baseUrl: ... }
  <nhóm>/                     # subfolder theo domain (tùy chọn), vd orders/
    create-order.bru
```
