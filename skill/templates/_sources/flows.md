# Luồng nghiệp vụ (Flows)

> NGUỒN SỰ THẬT cho business logic/flow. Mỗi flow = heading `###` slug tiếng Anh.

### checkout
**Luồng thanh toán**
1. Người dùng xác nhận [Giỏ hàng](glossary.md#shopping-cart).
2. Tạo [Đơn hàng](data-model.md#order) trạng thái `pending`.
3. Thanh toán thành công → `paid`.
