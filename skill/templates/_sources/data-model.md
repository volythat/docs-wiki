# Mô hình dữ liệu (Data Model)

> NGUỒN SỰ THẬT cho entity & field. Entity = heading `###` slug tiếng Anh.
> Field cần link riêng → đặt `<a id="<entity>-<field>"></a>` trong cột Field.

### user
**Người dùng**

| Field | Type | Mô tả |
|---|---|---|
| <a id="user-email"></a>`email` | string | Email đăng nhập |
| `name` | string | Tên hiển thị |

### order
**Đơn hàng**

| Field | Type | Mô tả |
|---|---|---|
| `id` | string | Mã đơn |
| `items` | array | Danh sách sản phẩm |
| `note` | string | Ghi chú đơn |
| `status` | enum | pending \| paid \| shipped |
