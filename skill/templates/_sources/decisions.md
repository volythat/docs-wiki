# Quyết định kiến trúc (Architecture Decision Records)

> NGUỒN SỰ THẬT cho quyết định thiết kế. Mỗi mục là heading `###` với slug tiếng Anh.
> Nơi khác CHỈ link tới (vd `[Dùng UUID](_sources/decisions.md#use-uuid-for-id)`).
> **ADR là append-only:** KHÔNG xóa/sửa quyết định cũ — nếu thay đổi, viết ADR mới có "Supersedes".

<!-- EXAMPLE — xóa trước khi dùng thật -->
### use-uuid-for-id
**Dùng UUID thay ID số nguyên**

- **Context:** Hệ thống cần hỗ trợ multi-tenant và import data từ ngoài; ID số nguyên gây xung đột khi merge.
- **Decision:** Dùng UUID v4 làm primary key cho mọi entity.
- **Consequences:** (+) Không xung đột khi merge data. (−) Index lớn hơn, query chậm hơn ~10% so với integer key.
<!-- END EXAMPLE -->
