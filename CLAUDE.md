# docs-wiki — Claude Code Instructions

Repo này chứa **nguồn skill `docs-wiki`** cho Claude Code. Không phải dự án app;
không có runtime, test suite, hay build step.

## Cấu trúc

- `skill/` — nguồn skill: SKILL.md (điểm vào), references/, templates/, agents/ (Codex UI)
- `install/install.sh <claude|codex|gemini>` — logic dùng chung (rsync + inject trigger)
- `install/install-claude.sh` / `install-codex.sh` / `install-gemini.sh` — wrapper mỏng gọi `install.sh` với target tương ứng (→ `~/.claude` · `~/.codex` · `~/.gemini/config`)
- `install/install-cursor.sh <project>` — **sinh** Cursor rule từ `SKILL.md` vào `<project>/.cursor/rules/` (không có file `.mdc` viết tay)
- `install/install.ps1 <claude|codex|gemini>` — bản Windows (PowerShell) của `install.sh`
- `install/install-cursor.ps1 <project>` — bản Windows (PowerShell) của `install-cursor.sh`
- `docs/` — **KHÔNG commit**, luôn untracked (spec/plan tạm thời)
- `README.md` / `README.vi.md` — tài liệu cho người dùng (EN + VI)

## Quy tắc bắt buộc

- **Không bao giờ commit `docs/`** — thư mục này untracked theo thiết kế.
- Sau mỗi lần sửa file trong `skill/`: chạy `./install/install-claude.sh` để đồng bộ sang `~/.claude/`.
- Commit message bằng tiếng Anh, theo pattern: `feat:` / `fix:` / `docs:` / `chore:`.
- Chỉ commit khi người dùng yêu cầu.


## Workflow thường gặp

**Sửa skill rồi test:**
```bash
# 1. Sửa file trong skill/
# 2. Đồng bộ
./install/install-claude.sh
# 3. Mở Claude Code ở một project khác, dùng thử skill
```

**Commit + push:**
```bash
git add skill/SKILL.md skill/references/...   # chỉ stage file cần thiết
git commit -m "feat: ..."
git push
```

## Remote

`git@github.com:volythat/docs-wiki.git`
