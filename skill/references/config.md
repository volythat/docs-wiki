# Cấu hình dự án — `.docswiki.yml`

File đặt tại **cwd (folder tổng)** vì nó chứa đường dẫn tới docs, phải nằm trên/ngoài docs.
Skill đọc file này TRƯỚC mọi lệnh (bước 0 trong SKILL.md).

## Schema & mặc định

```yaml
docs_dir: docs              # thư mục docs, tương đối từ cwd
dirs:                       # tên thư mục con, tương đối từ docs_dir
  api: api                  #   -> <docs_dir>/api
  sources: _sources         #   -> <docs_dir>/_sources
  bruno: api/bruno          #   -> <docs_dir>/api/bruno
lang:
  anchor: en                # ngôn ngữ slug/anchor
  content: vi               # ngôn ngữ nội dung
bruno:
  base_url: http://localhost:3000
  env: local                # -> environments/<env>.bru
project:
  name: ""                  # <title>/<h1> api.html + tiêu đề README
  description: ""           # tùy chọn
```

| Khóa | Default | Dùng ở đâu |
|---|---|---|
| `docs_dir` | `docs` | mọi lệnh — gốc resolve đường dẫn |
| `dirs.api` / `dirs.sources` / `dirs.bruno` | `api` / `_sources` / `api/bruno` | mọi lệnh thao tác file |
| `lang.anchor` / `lang.content` | `en` / `vi` | quy ước anchor (`reference-conventions.md`) |
| `bruno.base_url` / `bruno.env` | `http://localhost:3000` / `local` | sinh Bruno (`api-html-contract.md`) |
| `project.name` / `project.description` | rỗng | README + `api.html` |

## Quy tắc resolve (bước 0)

1. Đọc `.docswiki.yml` ở cwd. Nếu không có, đọc `.docswiki` (không đuôi) coi như YAML.
   Có cả hai → ưu tiên `.docswiki.yml`.
2. Gộp với mặc định: **merge nông theo từng khóa lá** (chỉ khóa được ghi mới override).
3. Khóa lạ → bỏ qua, không báo lỗi.
4. Không có file nào → dùng toàn bộ mặc định. KHÔNG chặn việc.

Mọi đường dẫn/quy ước phía sau lấy từ config đã resolve, tuyệt đối không hardcode.
`<docs_dir>`, `<dirs.sources>`… trong các reference khác là placeholder trỏ về config này.
