# docs-wiki

🇬🇧 [English](README.md)

Skill tài liệu **single-source-of-truth** cho dự án app. Mỗi sự thật (thuật ngữ,
field, flow, endpoint) định nghĩa đúng **một chỗ** trong `_sources/` (hoặc
`api/api.html`); mọi nơi khác chỉ **link** tới. Nhờ đó tài liệu không bị lệch
khi sửa, và có thể kiểm tra nhất quán tự động.

> **Không có runtime.** Skill này là một tập chỉ dẫn Markdown cho Claude.
> "Cài đặt" nghĩa là copy thư mục `skill/` vào thư mục skills của công cụ, rồi
> ra lệnh bằng ngôn ngữ tự nhiên (xem [Cách dùng](#cách-dùng)).

## Cài đặt

### Claude Code

```bash
./install/install-claude.sh
```

Script copy `skill/` → `~/.claude/skills/docs-wiki/`. Chạy lại mỗi khi sửa
nguồn skill để đồng bộ. Sau khi cài, mở Claude Code ở thư mục dự án và ra lệnh
trực tiếp — skill tự kích hoạt theo `description`.

> Hỗ trợ đa công cụ (Codex, Antigravity, Cursor) đang trong kế hoạch (Plan 2),
> chưa khả dụng.

## Cách dùng

Sau khi cài, nói chuyện với Claude bằng ngôn ngữ tự nhiên. Skill nhận diện các
lệnh sau:

| Bạn nói | Skill làm gì |
|---|---|
| **"khởi tạo docs"** | Tạo khung thư mục `docs/` từ template + sinh `.docswiki.yml`. Không ghi đè file đã có. |
| **"thêm/sửa thuật ngữ\|field\|endpoint\|flow X"** | Ghi định nghĩa vào nguồn (`_sources/` hoặc `api/api.html`), gợi ý chỗ nên link. |
| **"thêm file docs [tên]"** | Tạo `docs/[tên].md` theo cấu trúc tài liệu dẫn xuất: tiêu đề, mô tả ngắn, các section với link tới `_sources/` (không chép định nghĩa). Nếu thực thể liên quan chưa có trong `_sources/`, hỏi có muốn thêm vào nguồn trước không. "Cập nhật mục lục" chạy sau sẽ tự nhận file mới. |
| **"phân tích docs cũ từ [folder]"** | **Pha 1:** Đọc toàn bộ file trong `[folder]`, phân loại nội dung thành: định nghĩa → `_sources/`, tổng hợp/góc nhìn → file dẫn xuất, endpoint → `api.html`, không rõ → liệt kê riêng. Xuất báo cáo phân loại, hỏi xác nhận. **Pha 2:** Chỉ sau khi xác nhận mới tạo file — nguồn trước, dẫn xuất sau. Không tạo gì khi chưa được duyệt. |
| **"sinh bruno"** | Đọc `api/api.html`, sinh/cập nhật collection Bruno trong `api/bruno/`. |
| **"kiểm tra nhất quán"** | Quét toàn bộ `docs/`, báo cáo 5 loại lệch (link gãy, term mồ côi, định nghĩa trùng, `.bru` lệch, field không tồn tại). |
| **"X dùng ở đâu"** | Liệt kê mọi file + dòng có link trỏ tới anchor của X. |
| **"cập nhật mục lục"** | Sinh lại `README.md` của docs + mục lục trong `api.html` bằng cách quét thư mục (không theo danh sách cứng). |

### Quy tắc cốt lõi

1. **Ghi nguồn trước, link sau** — không bao giờ chép định nghĩa vào doc dẫn xuất.
2. **Anchor tiếng Anh, nội dung tiếng Việt** (mặc định, đổi được qua config).
3. **`api.html` là gốc của API**, các file `.bru` là sản phẩm sinh ra — không sửa `.bru` bằng tay.
4. **Kiểm tra nhất quán chỉ chạy khi bạn yêu cầu**, không tự động sau mỗi lần sửa.

## Dùng với dự án đã có sẵn (migration)

Nếu dự án đã có docs (dù lộn xộn), cách an toàn nhất là **tái cấu trúc vào
folder mới** — docs cũ giữ nguyên cho đến khi bạn sẵn sàng thay thế.

### Quy trình

**1. Trỏ config sang folder mới**

Tạo `.docswiki.yml` ở thư mục gốc dự án, đặt `docs_dir` trỏ vào folder mới
(ví dụ `docs-v2`). Folder cũ không bị đụng.

```yaml
docs_dir: docs-v2
project:
  name: Tên dự án
```

**2. Khởi tạo cấu trúc**

Nói với Claude: `"khởi tạo docs"`. Skill tạo `docs-v2/` với toàn bộ cấu trúc
template, không ghi đè gì đã tồn tại.

**3. Chuyển định nghĩa vào `_sources/` trước**

Đọc lại docs cũ và phân loại: cái nào là *định nghĩa* (thuật ngữ, entity,
field, flow), cái nào là *tổng hợp/góc nhìn*. Với mỗi định nghĩa:

> `"thêm thuật ngữ [X]"` / `"thêm field [X]"` / `"thêm flow [X]"`

Skill ghi vào đúng file nguồn (`glossary.md`, `data-model.md`, `flows.md`) với
anchor và quy ước đúng.

**4. Tạo lại file dẫn xuất — chỉ link, không chép**

Với mỗi góc nhìn (CMS, mobile, design, backend…):

> `"thêm file docs cms"` / `"thêm file docs mobile"` …

Skill tạo file với các section *link tới `_sources/`*, không bao giờ chép lại
định nghĩa.

**5. Di chuyển API**

Copy các endpoint từ docs cũ vào `api/api.html` theo đúng hợp đồng trong
`skill/references/api-html-contract.md`, rồi:

> `"sinh bruno"` — sinh lại toàn bộ collection Bruno từ HTML.

**6. Kiểm tra nhất quán**

> `"kiểm tra nhất quán"` — báo cáo link gãy, term mồ côi, `.bru` lệch, field
> không tồn tại. Sửa hết trước khi chuyển sang dùng thật.

**7. Cập nhật mục lục**

> `"cập nhật mục lục"` — quét `docs-v2/` và sinh lại `README.md`.

**8. Chuyển hẳn sang folder mới**

Sau khi ổn, đổi tên `docs-v2/` → `docs/` (hoặc cập nhật `docs_dir` trong
`.docswiki.yml`) và lưu trữ folder cũ.

---

## Cấu hình — `.docswiki.yml`

Skill đọc `.docswiki.yml` ở thư mục tổng **trước mọi lệnh**. Chỉ cần ghi khóa
muốn đổi; khóa thiếu dùng mặc định. Thiếu hẳn file → dùng toàn bộ mặc định,
không chặn việc. Lệnh "khởi tạo docs" tự sinh file này.

```yaml
docs_dir: docs              # thư mục docs (dự án khác có thể đổi tên)
dirs:
  api: api
  sources: _sources
  bruno: api/bruno
lang:
  anchor: en                # ngôn ngữ slug/anchor
  content: vi               # ngôn ngữ nội dung
bruno:
  base_url: http://localhost:3000
  env: local
project:
  name: ""
  description: ""
```

Schema đầy đủ + quy tắc resolve: [`skill/references/config.md`](skill/references/config.md).

## Cấu trúc repo

```
.
├── skill/                  # NGUỒN của skill (cài cái này)
│   ├── SKILL.md            # điểm vào: lệnh + quy tắc ngầm
│   ├── references/         # chi tiết: config, quy ước link, hợp đồng api.html, check nhất quán
│   └── templates/          # khung docs/ + .docswiki.yml mẫu
├── install/
│   └── install-claude.sh   # copy skill/ → ~/.claire/skills/docs-wiki/
└── README.md               # README tiếng Anh
```

Chi tiết hành vi skill nằm trong [`skill/SKILL.md`](skill/SKILL.md) và các file
trong `skill/references/`.
