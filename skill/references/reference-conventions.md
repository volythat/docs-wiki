# Quy ước tham chiếu (single source of truth)

## Nguyên tắc cốt lõi
- **Anchor = slug theo `lang.anchor`** (mặc định `en`, định danh ổn định).
  **Nội dung hiển thị theo `lang.content`** (mặc định `vi`).
  Đổi nhãn hiển thị không được làm gãy anchor. (`lang.*` lấy từ `.docswiki.yml`, xem `config.md`.)
- Định nghĩa nằm ở `<dirs.sources>/` (hoặc `<dirs.api>/api.html` cho endpoint). Nơi khác CHỈ link.

## Cách tạo anchor

| Loại | Nơi định nghĩa | Anchor | Ví dụ link |
|---|---|---|---|
| Thuật ngữ | `_sources/glossary.md` | heading `### <english-slug>` | `[Giỏ hàng](_sources/glossary.md#shopping-cart)` |
| Entity | `_sources/data-model.md` | heading `### <english-slug>` | `[Người dùng](_sources/data-model.md#user)` |
| Field | `_sources/data-model.md` | `<a id="<entity>-<field>"></a>` trong bảng | `[email](_sources/data-model.md#user-email)` |
| Flow | `_sources/flows.md` | heading `### <english-slug>` | `[Thanh toán](_sources/flows.md#checkout)` |
| Endpoint | `api/api.html` | `id="<english-slug>"` trên `<section>` | `[Tạo đơn hàng](api/api.html#create-order)` |

## Quy tắc đặt slug
- Chữ thường, nối bằng `-`, chỉ ký tự `[a-z0-9-]`.
- Mô tả ngữ nghĩa, không phải bản dịch máy móc (vd `checkout`, không `thanh-toan`).
- Slug đặt một lần, không đổi. Khi cần đổi tên: đổi NHÃN hiển thị, giữ nguyên slug.

## Khi nào link, khi nào chép
- Doc dẫn xuất (overview/cms/mobile/design): luôn LINK tới định nghĩa, không chép.
- Được phép viết câu mô tả ngữ cảnh quanh link, miễn không lặp lại định nghĩa gốc.
