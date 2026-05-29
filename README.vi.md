# docs-wiki

🇬🇧 [English](README.md)

Skill tài liệu **single-source-of-truth** cho dự án app. Mỗi sự thật (thuật ngữ,
field, flow, endpoint) định nghĩa đúng **một chỗ** trong `_sources/` (hoặc
`api/api.html`); mọi nơi khác chỉ **link** tới. Nhờ đó tài liệu không bị lệch
khi sửa, và có thể kiểm tra nhất quán tự động.

> **Không có runtime.** Skill này là một tập chỉ dẫn Markdown cho công cụ AI.
> "Cài đặt" nghĩa là copy thư mục `skill/` vào thư mục skills của công cụ, rồi
> ra lệnh bằng ngôn ngữ tự nhiên (xem [Cách dùng](#cách-dùng)).

## Cài đặt

### Linux / macOS

```bash
./install/install.sh claude    # → ~/.claude/skills/docs-wiki/  + ~/.claude/CLAUDE.md
./install/install.sh codex     # → ~/.codex/skills/docs-wiki/   + ~/.codex/AGENTS.md
./install/install.sh gemini    # → ~/.gemini/config/skills/docs-wiki/ + ~/.gemini/GEMINI.md
```

> **Alias tiện lợi:** `install-claude.sh`, `install-codex.sh`, `install-gemini.sh`
> là wrapper mỏng gọi thẳng vào `install.sh`.

Để **gỡ cài đặt**:
```bash
./install/install.sh uninstall claude   # xoá ~/.claude/skills/docs-wiki/ + trigger rule
./install/install.sh uninstall codex
./install/install.sh uninstall gemini
```

### Windows (PowerShell)

```powershell
.\install\install.ps1 claude   # → ~\.claude\skills\docs-wiki\  + ~\.claude\CLAUDE.md
.\install\install.ps1 codex    # → ~\.codex\skills\docs-wiki\   + ~\.codex\AGENTS.md
.\install\install.ps1 gemini   # → ~\.gemini\config\skills\docs-wiki\ + ~\.gemini\GEMINI.md
```

Nếu PowerShell chặn script, chạy một lần: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

Để **gỡ cài đặt**:
```powershell
.\install\install.ps1 claude -Uninstall
.\install\install.ps1 codex  -Uninstall
.\install\install.ps1 gemini -Uninstall
```

Mỗi lần chạy (bash hay PowerShell) đều làm hai việc:
1. Đồng bộ `skill/` vào thư mục skills của platform
2. Thêm trigger rule vào file hướng dẫn toàn cục của platform (idempotent — chạy lại nhiều lần vẫn an toàn)

Trigger rule là thứ khiến skill tự kích hoạt khi bạn nhắc đến docs. Chạy lại
script mỗi khi sửa nguồn skill để đồng bộ.

### Cursor

Cursor rules là **project-local** — chạy script này một lần cho mỗi dự án.

**Linux / macOS:**
```bash
./install/install-cursor.sh /đường/dẫn/dự-án
# hoặc từ bên trong dự án:
/đường/dẫn/docs-wiki/install/install-cursor.sh .
```

**Windows (PowerShell):**
```powershell
.\install\install-cursor.ps1 C:\đường\dẫn\dự-án
# hoặc từ bên trong dự án:
\đường\dẫn\docs-wiki\install\install-cursor.ps1 .
```

Tạo `.cursor/rules/docs-wiki.mdc` + `.cursor/rules/docs-wiki/references/`
và `.cursor/rules/docs-wiki/templates/` trong dự án. Rule tự kích hoạt khi bạn
ra lệnh docs-wiki trong Cursor.

## Cách dùng

Sau khi cài, nói chuyện với AI bằng ngôn ngữ tự nhiên. Skill nhận diện các lệnh
sau:

| Bạn nói | Skill làm gì |
|---|---|
| **"khởi tạo docs"** | Tạo khung thư mục `docs/` từ template + sinh `.docswiki.yml`. Không ghi đè file đã có. |
| **"thêm/sửa thuật ngữ\|field\|endpoint\|flow X"** | Ghi định nghĩa vào nguồn (`_sources/` hoặc `api/api.html`), gợi ý chỗ nên link. Cập nhật `INDEX.md` nếu có. |
| **"thêm/sửa quyết định X"** | Ghi Architecture Decision Record (ADR) vào `_sources/decisions.md` theo format Context / Decision / Consequences. Append-only — quyết định cũ không bao giờ bị xóa. |
| **"thêm file docs [tên]"** | Hỏi loại tài liệu (Reference / How-to / Explanation), rồi tạo `docs/[tên].md` với link tới `_sources/` — không chép định nghĩa. "Cập nhật mục lục" chạy sau sẽ tự nhận file mới. |
| **"phân tích docs cũ từ [folder]"** | `[folder]` chỉ được **đọc**, không bao giờ bị sửa. Yêu cầu `docs_dir` trong `.docswiki.yml` trỏ sang folder *khác*; dừng cảnh báo nếu trùng nhau. **Pha 1:** phân loại: định nghĩa → `_sources/`, tổng hợp → file dẫn xuất, endpoint → `api.html`, không rõ → liệt kê riêng. Xuất báo cáo, hỏi xác nhận. **Pha 2:** tạo file chỉ sau khi xác nhận. |
| **"tái cấu trúc docs"** | Kiểm tra toàn bộ `docs/`, chuyển định nghĩa inline vào `_sources/`, nhóm file vào subfolder theo domain, thay nội dung chép bằng link. Từng bước có xác nhận. |
| **"sinh bruno"** | Đọc `api/api.html`, sinh/cập nhật collection Bruno trong `api/bruno/`. |
| **"kiểm tra nhất quán"** | Quét toàn bộ `docs/`, báo cáo 6 loại lệch: link gãy, term mồ côi, định nghĩa trùng, `.bru` lệch, anchor mồ côi, field không tồn tại. |
| **"X dùng ở đâu"** | Liệt kê mọi file + dòng có link trỏ tới anchor của X. |
| **"tạo index tìm kiếm"** | Quét toàn bộ anchor trong `_sources/`, sinh `_sources/INDEX.md` — index gọn (~100-200 token) để AI tìm kiếm nhanh. |
| **"cập nhật mục lục"** | Sinh lại `README.md` của docs bằng cách quét thư mục (không theo danh sách cứng). |

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

Nói với AI: `"khởi tạo docs"`. Skill tạo `docs-v2/` với toàn bộ cấu trúc
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
│   ├── agents/             # metadata Codex UI (openai.yaml)
│   ├── references/         # chi tiết: config, quy ước link, hợp đồng api.html, check nhất quán
│   └── templates/          # khung docs/ + .docswiki.yml mẫu
├── install/
│   ├── install.sh          # Linux/macOS: logic dùng chung (rsync + inject trigger)
│   ├── install-claude.sh   # wrapper → ~/.claude/skills/docs-wiki/
│   ├── install-codex.sh    # wrapper → ~/.codex/skills/docs-wiki/
│   ├── install-gemini.sh   # wrapper → ~/.gemini/config/skills/docs-wiki/
│   ├── install-cursor.sh   # sinh Cursor rule từ SKILL.md → <project>/.cursor/rules/
│   ├── install.ps1         # Windows: tương đương install.sh
│   └── install-cursor.ps1  # Windows: tương đương install-cursor.sh
└── README.md               # README tiếng Anh
```

Chi tiết hành vi skill nằm trong [`skill/SKILL.md`](skill/SKILL.md) và các file
trong `skill/references/`.
