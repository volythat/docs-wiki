---
name: docs-wiki
description: Use when creating or maintaining application documentation (PRD, API, CMS, mobile, design) that must stay consistent. Manages a single-source-of-truth docs system - scaffolds the structure, writes facts into central sources, generates Bruno files from api.html, checks consistency, and finds where things are referenced.
---

# docs-wiki

Hệ thống tài liệu single-source-of-truth cho dự án app. Mỗi sự thật (thuật ngữ, field,
flow, endpoint) định nghĩa đúng MỘT chỗ trong `_sources/` (hoặc `api/api.html`); mọi nơi
khác chỉ LINK tới.

## Cấu hình dự án (.docswiki.yml) — đọc TRƯỚC mọi lệnh

**Bước 0 (chạy trước mọi lệnh):** đọc `.docswiki.yml` ở cwd (folder tổng).
- Có → gộp với mặc định (merge nông theo từng khóa lá); khóa lạ bỏ qua.
- Không có → dùng toàn bộ mặc định, KHÔNG chặn việc.
- Cũng đọc `.docswiki` (không đuôi) nếu có, coi như YAML; ưu tiên `.docswiki.yml`.

Mọi đường dẫn/quy ước phía sau LẤY TỪ config, không hardcode. Mặc định: `docs_dir: docs`;
`dirs: {api: api, sources: _sources, bruno: api/bruno}`; `lang: {anchor: en, content: vi}`;
`bruno: {base_url: http://localhost:3000, env: local}`. Schema đầy đủ: `references/config.md`.
Dưới đây `<docs_dir>`, `<dirs.sources>`… là giá trị resolve từ config.

## Lệnh

| Người dùng nói | Hành động |
|---|---|
| "khởi tạo docs" | **Kiểm tra trước:** nếu cwd chưa có `.docswiki.yml` VÀ thư mục `docs` đã tồn tại → DỪNG, cảnh báo nguy cơ ghi đè lên docs cũ, đề xuất hai lựa chọn: (A) tạo `.docswiki.yml` với `docs_dir` khác trước (ví dụ `docs-v2`) rồi chạy lại, hoặc (B) xác nhận muốn scaffold vào folder hiện tại (rõ ràng file đã có sẽ không bị ghi đè nhưng file mới sẽ được thêm vào). Chỉ tiếp tục khi người dùng chọn. Nếu đã có `.docswiki.yml`: copy `templates/` vào `<docs_dir>`, KHÔNG ghi đè file đã tồn tại. Nếu cwd chưa có `.docswiki.yml` và người dùng xác nhận (B): thực hiện đồng thời sinh `.docswiki.yml`. Báo các file đã tạo. |
| "thêm/sửa thuật ngữ\|field\|endpoint\|flow X" | Ghi định nghĩa vào `<dirs.sources>` (hoặc `<dirs.api>/api.html`), anchor theo `lang.anchor`, nội dung theo `lang.content`, quy ước ở `references/reference-conventions.md`; gợi ý chỗ nên link. |
| "thêm file docs [tên]" | Tạo `<docs_dir>/[tên].md` theo cấu trúc tài liệu dẫn xuất: tiêu đề, mô tả ngắn, các section với link tới `<dirs.sources>/` (KHÔNG chép định nghĩa). Nếu có thực thể/thuật ngữ liên quan chưa định nghĩa trong `<dirs.sources>`, hỏi người dùng có muốn thêm vào nguồn trước không. Sau khi tạo, "cập nhật mục lục" sẽ tự nhận file này (scan-based, không cần khai báo thêm). |
| "phân tích docs cũ từ [folder]" | **Pha 1 — Phân tích:** Đọc toàn bộ file trong `[folder]`, phân loại từng đoạn nội dung thành: (A) *Định nghĩa* (thuật ngữ, entity, field, flow) → đề xuất đưa vào file nào trong `<dirs.sources>/`; (B) *Tổng hợp/góc nhìn* (mô tả tính năng, hướng dẫn, liệt kê) → đề xuất thành file dẫn xuất nào; (C) *Endpoint/API* → đề xuất đưa vào `<dirs.api>/api.html`; (D) *Không rõ* → liệt kê riêng để người dùng quyết định. Xuất báo cáo phân loại, hỏi xác nhận hoặc điều chỉnh. **Pha 2 — Thực thi:** Chỉ sau khi người dùng xác nhận, tạo lần lượt từng file theo phân loại đã duyệt — nguồn trước (`<dirs.sources>/`), dẫn xuất sau. KHÔNG tạo file nào khi chưa được xác nhận. |
| "sinh bruno" | Theo `references/api-html-contract.md`: đọc `<dirs.api>/api.html`, sinh/cập nhật `<dirs.bruno>`; `baseUrl`/tên env theo `bruno.*`. |
| "kiểm tra nhất quán" | Theo `references/consistency-check.md`: quét `<docs_dir>`, xuất báo cáo. CHỈ chạy khi được yêu cầu. |
| "X dùng ở đâu" | Grep mọi link trỏ tới anchor của X trong `<docs_dir>`; liệt kê file + dòng. |
| "cập nhật mục lục" | Sinh lại `README.md` bằng cách QUÉT `<docs_dir>` (không theo danh sách cứng → file mới tự xuất hiện) + mục lục trong `<dirs.api>/api.html`. Dùng `project.name` cho tiêu đề. |

## Quy tắc ngầm (LUÔN tuân theo)
1. **Ghi nguồn trước, link sau.** Thêm thông tin mới → ghi vào `<dirs.sources>`/`<dirs.api>/api.html`
   TRƯỚC, rồi mới link từ doc dẫn xuất. KHÔNG BAO GIỜ chép định nghĩa vào doc dẫn xuất.
2. **Anchor theo `lang.anchor`, nội dung theo `lang.content`** (mặc định EN/VI). Xem `references/reference-conventions.md`.
3. **Kiểm tra nhất quán chỉ khi được yêu cầu** — không tự chạy sau mỗi lần sửa.
4. **api.html là gốc của API**, `.bru` là sản phẩm sinh ra. Không sửa `.bru` bằng tay.

## References
- `references/config.md` — schema `.docswiki.yml` + quy tắc resolve.
- `references/reference-conventions.md` — quy ước anchor/link.
- `references/api-html-contract.md` — cấu trúc api.html + cách sinh Bruno.
- `references/consistency-check.md` — 5 loại lệch + cách quét.
