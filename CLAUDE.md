# docs-wiki — Claude Code Instructions

Repo này chứa **nguồn skill `docs-wiki`** cho Claude Code. Không phải dự án app;
không có runtime, test suite, hay build step.

## Cấu trúc

- `skill/` — nguồn skill: SKILL.md (điểm vào), references/, templates/
- `install/install-claude.sh` — đồng bộ `skill/` → `~/.claude/skills/docs-wiki/`
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

`git@github.com:volythat/docs-wiki.git` — SSH key: `~/.ssh/volythat_github`
