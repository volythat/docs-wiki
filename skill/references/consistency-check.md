# Kiểm tra nhất quán (chạy KHI người dùng yêu cầu)

Quét toàn bộ `<docs_dir>` và báo cáo các loại lệch. KHÔNG tự chạy sau mỗi lần sửa.

> Đường dẫn dưới đây dùng tên mặc định (`_sources`, `api/api.html`, `api/bruno`). Resolve
> theo `dirs.*` trong `.docswiki.yml` nếu dự án đặt tên khác (xem `config.md`).

## 5 loại lệch

### 1. Link gãy
Mọi link markdown `(<path>#<anchor>)` trỏ tới một file trong docs PHẢI có anchor tồn tại.
Có HAI style đường dẫn cùng hợp lệ — phải quét cả hai:
- **Doc dẫn xuất** (overview/cms/mobile/design ở gốc `docs/`): trỏ kèm tiền tố thư mục,
  vd `(_sources/glossary.md#shopping-cart)`, `(api/api.html#create-order)`.
- **Link nội bộ giữa các file `_sources/`**: trỏ kiểu sibling, KHÔNG có tiền tố `_sources/`,
  vd `(glossary.md#shopping-cart)`, `(data-model.md#order)` (xem `flows.md`).

Cách quét:
- Grep mọi link `(<đường-dẫn>.md#<anchor>)` và `(<đường-dẫn>.html#<anchor>)` trong `docs/`.
- **Base resolve = thư mục chứa file có link** (không phải gốc `docs/`). Quy tắc này đúng cho
  cả hai style: doc dẫn xuất ở gốc → `_sources/glossary.md` ra `docs/_sources/glossary.md`;
  `flows.md` trong `_sources/` → `glossary.md` ra `docs/_sources/glossary.md`.
- Với mỗi đích: kiểm tra `### <anchor>`, `<a id="<anchor>">`, hoặc `id="<anchor>"` có tồn tại
  trong file đã resolve không. Báo link không tìm thấy đích.
- **Bỏ qua** link nằm trong dòng hướng dẫn (blockquote bắt đầu bằng `>`): đó là ví dụ minh hoạ
  cách viết link, không phải tham chiếu thật (vd dòng đầu mỗi file `_sources/`).

### 2. Term/field mồ côi
Khái niệm được nhắc trong doc dẫn xuất nhưng chưa định nghĩa trong `_sources`.
- Heuristic: tìm các cụm in đậm/term lặp lại trong overview/cms/mobile/design mà KHÔNG có
  link tới `_sources`. Liệt kê để người dùng xác nhận có cần định nghĩa không.

### 3. Định nghĩa trùng (chép thay vì link)
Một định nghĩa bị lặp ở doc dẫn xuất.
- Tìm các đoạn mô tả entity/field/flow trong doc dẫn xuất trùng nội dung với `_sources`.
- Báo: "nên thay bằng link tới `_sources/...#anchor`".

### 4. .bru lệch api.html
- Lập danh sách endpoint từ `api.html` (mỗi `<section data-method data-path>`).
- Lập danh sách file `.bru` trong `api/bruno/`.
- Báo: endpoint có trong html nhưng thiếu .bru; .bru thừa không có trong html;
  method/path/body khác nhau.

### 5. Field không tồn tại / lệch type
- Với mỗi `data-ref="data-model.md#<entity>"` trong api.html: kiểm tra các field trong
  request-body có mặt trong entity đó của `data-model.md` không.
- Báo field dùng trong API mà data-model không có.

## Mẫu báo cáo

```
## Kiểm tra nhất quán — <ngày>

### Link gãy (n)
- cms.md:42 → _sources/glossary.md#shopping-cart  (anchor không tồn tại)

### Term mồ côi (n)
- mobile.md: "điểm thưởng" lặp 3 lần, chưa có trong glossary

### Định nghĩa trùng (n)
- overview.md:15-20 chép định nghĩa Order → nên link _sources/data-model.md#order

### .bru lệch (n)
- api.html có endpoint #refund-order nhưng thiếu api/bruno/refund-order.bru

### Field không tồn tại (n)
- api.html #create-order dùng field "coupon" không có trong data-model.md#order

Tổng: n vấn đề.
```
