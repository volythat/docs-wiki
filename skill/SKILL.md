---
name: docs-wiki
description: Use when creating or maintaining application documentation (PRD, API, CMS, mobile, design) that must stay consistent. Manages a single-source-of-truth docs system - scaffolds the structure, writes facts into central sources, generates Bruno files from api.html, checks consistency, and finds where things are referenced.
---

# docs-wiki

Hệ thống tài liệu single-source-of-truth cho dự án app. Mỗi sự thật (thuật ngữ, field,
flow, endpoint) định nghĩa đúng MỘT chỗ trong `_sources/` (hoặc `api/api.html`); mọi nơi
khác chỉ LINK tới.

## Định vị thư mục docs
- Mặc định: thư mục `docs/` ngay dưới cwd (mô hình "folder tổng" chứa các repo con).
- Ghi đè: nếu có file `.docswiki` ở cwd với `docs_dir: <tên>`, dùng tên đó.

## Lệnh

| Người dùng nói | Hành động |
|---|---|
| "khởi tạo docs" | Copy toàn bộ `templates/` vào `docs/`. Báo các file đã tạo. |
| "thêm/sửa thuật ngữ\|field\|endpoint\|flow X" | Ghi định nghĩa vào đúng file `_sources` (hoặc `api.html`), tạo anchor tiếng Anh theo `references/reference-conventions.md`, gợi ý chỗ nên link. |
| "sinh bruno" | Theo `references/api-html-contract.md`: đọc `api/api.html`, sinh/cập nhật `api/bruno/`. |
| "kiểm tra nhất quán" | Theo `references/consistency-check.md`: quét docs, xuất báo cáo. CHỈ chạy khi được yêu cầu. |
| "X dùng ở đâu" | Grep mọi link trỏ tới anchor của X trong `docs/`; liệt kê file + dòng. |
| "cập nhật mục lục" | Sinh lại `README.md` (sơ đồ điều hướng) và mục lục trong `api/api.html`. |

## Quy tắc ngầm (LUÔN tuân theo)
1. **Ghi nguồn trước, link sau.** Thêm thông tin mới → ghi vào `_sources`/`api.html` TRƯỚC,
   rồi mới link từ doc dẫn xuất. KHÔNG BAO GIỜ chép định nghĩa vào doc dẫn xuất.
2. **Anchor tiếng Anh, nội dung tiếng Việt.** Xem `references/reference-conventions.md`.
3. **Kiểm tra nhất quán chỉ khi được yêu cầu** — không tự chạy sau mỗi lần sửa.
4. **api.html là gốc của API**, `.bru` là sản phẩm sinh ra. Không sửa `.bru` bằng tay.

## References
- `references/reference-conventions.md` — quy ước anchor/link.
- `references/api-html-contract.md` — cấu trúc api.html + cách sinh Bruno.
- `references/consistency-check.md` — 5 loại lệch + cách quét.
