# Quy ước tài liệu (đọc tay)

- **Nguồn sự thật**: `_sources/` (thuật ngữ, data model, flow, quyết định kiến trúc) và file `.bru` trong `api/bruno/` (endpoint).
- **Anchor tiếng Anh, nội dung tiếng Việt.** Đổi nhãn tiếng Việt không đổi anchor.
- **Doc dẫn xuất chỉ link, không chép định nghĩa.**
- **File `.bru` trong `api/bruno/` là gốc API** (viết tay, có khối `docs`); HTML docs do Bruno tự sinh khi cần, không commit.
- **decisions.md là append-only** — không xóa/sửa quyết định cũ, chỉ thêm ADR mới.
- **Loại file tài liệu**: (R) Reference — sự thật kỹ thuật; (H) How-to — hướng dẫn từng bước; (E) Explanation — lý do/thiết kế.
- Cần kiểm tra lệch: nhờ Claude "kiểm tra nhất quán".
