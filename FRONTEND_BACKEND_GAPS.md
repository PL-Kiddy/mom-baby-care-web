## Tổng quan

File này ghi lại **những điểm frontend (FE) CHƯA khớp hoàn toàn với backend (BE)**, và **những yêu cầu dự án vẫn chưa được đáp ứng đầy đủ** (tính đến commit `feat: sync frontend with backend - verify email, profile, orders, blog detail, report, cart localStorage` trên nhánh `dev`).

---

## 1. FE chưa khớp 100% với Backend

### 1.1. Thanh toán MoMo – mount route backend

- **Backend**: Có `payments.routers.ts` với route `POST /api/payments/create-url`, nhưng trong `SDN302-PRJ/src/index.ts` **chưa mount**:
  - Chưa có dòng `app.use('/api/payments', paymentsRouters)`.
- **Frontend**: `createMoMoPaymentApi` (FE) đang gọi `POST ${BASE_URL}/api/payments/create-url` trong bước checkout (CartPage).
- **Kết quả**: FE gọi đúng path mong đợi, nhưng nếu BE không mount route, request sẽ lỗi 404.

> Trạng thái: **Cần BE mount route `/api/payments` để FE hoạt động đúng**. FE đã cấu hình sẵn, không cần chỉnh thêm.

### 1.2. Giỏ hàng (Cart) – chỉ lưu local, không có API BE

- **Backend**:
  - Không có route/cart riêng (`/cart`, `/api/cart`, ...). Chỉ có API **đơn hàng**:
    - `POST /orders` (tạo đơn)
    - `GET /orders/my-orders`, `GET /orders/:order_id`, `PATCH /orders/:order_id/cancel`, ...
- **Frontend**:
  - `CartPage` sử dụng **state + localStorage** (`milkcare_cart_items`) để lưu giỏ hàng trên trình duyệt.
  - Khi thanh toán, FE gửi thẳng payload lên `POST /orders` dùng các item trong cart.
- **Kết quả**:
  - Tính năng “giỏ hàng” hoạt động **hoàn toàn phía FE**, **không có đồng bộ với BE** (không có cart theo user trên server).

> Trạng thái: **Khớp với những gì BE đang có**, nhưng nếu sau này BE bổ sung API giỏ hàng, FE cần cập nhật để đồng bộ cart theo user (thay vì chỉ localStorage).

### 1.3. Chat tư vấn

- **Yêu cầu BE** (theo mô tả chức năng): Staff có trang **`/staff/chat`** để tư vấn.
- **Backend thực tế**:
  - Trong `SDN302-PRJ/src/index.ts` không mount router dành cho chat (không có `/api/chat` hoặc tương tự).
  - Không thấy route hay controller chuyên cho chat/realtime.
- **Frontend**:
  - Có `ChatPage.tsx` (Staff) với UI chat mô phỏng (session, message list, ...), nhưng **không gọi API backend** (data mock cứng trong FE).
  - **Member** không có trang/chat riêng để gửi yêu cầu tư vấn.
- **Kết quả**:
  - Chat hiện tại là **UI mock phía FE**, **chưa tích hợp BE**.

> Trạng thái: **Không khớp với kỳ vọng “chat thật” trên BE**. Cần thêm API/chat backend (websocket hoặc REST) và cập nhật FE để dùng dữ liệu thật.

### 1.4. Tìm kiếm sản phẩm / bài viết phía server

- **Backend**:
  - `GET /api/products`, `GET /api/posts` không định nghĩa query search cụ thể (search theo tên, category, ...).
- **Frontend**:
  - Nhiều màn hình (ProductListPage, các trang admin/staff) có ô tìm kiếm nhưng **lọc client-side** trên dữ liệu đã load (`Array.filter` sau khi fetch).
- **Kết quả**:
  - Không có sai khác về URL, nhưng **search chưa sử dụng backend**. Với số lượng dữ liệu lớn, có thể phải bổ sung query API.

> Trạng thái: **Chấp nhận được với dữ liệu nhỏ**. Nếu BE sau này hỗ trợ query search, FE cần chuyển từ filter client sang gửi query lên server.

### 1.5. Phân quyền quản lý user giữa Admin / Staff

- **Backend**:
  - Các route quản lý user (`/admins/getAllUser`, `/admins/deleteUser/:user_id`, `/admins/me/:user_id`) mount dưới `/admins`, mặc định dành cho **Admin**.
- **Frontend**:
  - `AccountsPage` hiện nằm trong layout Admin (`/admin/accounts`) và dùng auth role `'admin'` → **phù hợp**.
  - Staff không có UI riêng để chỉnh sửa user (đúng với backend hiện tại).
- **Kết quả**: **Không có lệch URL**, nhưng cần lưu ý trong tài liệu chức năng: **chỉ Admin quản lý account**; Staff không được phép, để tránh hiểu nhầm yêu cầu.

---

## 2. Yêu cầu dự án chưa đáp ứng (hoặc chỉ đáp ứng một phần)

### 2.1. Chat tư vấn cho Member

**Yêu cầu dự án (tóm lược)**:  
> Member có thể “đăng ký tư vấn trực tuyến” để được hỗ trợ chọn và mua sữa.

- **Backend**: Chưa có API/MQ chat hoặc channel cho Member.
- **Frontend**:  
  - Staff có trang `ChatPage` giả lập; Member **chưa có trang chat** hay form đăng ký tư vấn riêng (chỉ có form báo cáo/góp ý `/account/report`).  

> Trạng thái: **Chưa đáp ứng đầy đủ** phần “chat/đăng ký tư vấn trực tuyến” giữa Member và Staff.

Gợi ý hoàn thiện (tương lai):
- BE: thêm module chat (REST + polling, websocket, hoặc dùng dịch vụ ngoài).
- FE: thêm trang chat cho Member, kết nối với Staff `ChatPage` qua API chung.

### 2.2. Giỏ hàng đồng bộ giữa nhiều thiết bị / session

**Yêu cầu dự án (ngầm hiểu từ “mua hàng online”):**  
> Khi member đăng nhập, giỏ hàng của họ nên được giữ khi đổi thiết bị / trình duyệt.

- Hiện tại:
  - FE lưu giỏ hàng trong **localStorage** (`milkcare_cart_items`) theo trình duyệt.
  - Khi member đăng nhập trên máy khác, giỏ hàng không đi theo (vì không có API cart BE).

> Trạng thái: **Mới đáp ứng giỏ hàng trên 1 thiết bị**. Nếu consider “đa thiết bị” là yêu cầu, thì đang **chưa đạt**.

### 2.3. Tối ưu phân tích/báo cáo nâng cao

Trong phạm vi yêu cầu cơ bản của đồ án, backend chỉ cung cấp:
- `GET /admins/dashboard/stats` – thống kê tổng quan.

Frontend (Dashboard, RevenuePage) đang:
- Hiển thị số liệu tổng quan, biểu đồ cơ bản.

Nếu mở rộng yêu cầu (báo cáo chi tiết hơn, lọc nâng cao...), hiện tại:
- **Chưa có** thêm API nâng cao và UI phân tích sâu.

> Trạng thái: **Đáp ứng mức cơ bản**, chưa phải dashboard chuyên sâu.

---

## 3. Tóm tắt nhanh

- **Đã khớp FE–BE** cho hầu hết core features: auth, verify email, profile, đơn hàng, thanh toán (COD/BANK/MoMo), voucher, rewards, posts, reviews, reports, pre-order, phân quyền Admin/Staff/Member.
- **FE/BE CHƯA đủ / CHƯA dùng hết**:
  - Chat tư vấn: mới UI phía Staff, chưa có API BE và chưa có flow Member ↔ Staff.
  - Giỏ hàng: FE dùng localStorage, BE chưa có cart API → chưa đồng bộ đa thiết bị.
  - Search & analytics nâng cao: mới là filter client + dashboard basic, chưa tận dụng API tìm kiếm/báo cáo nếu sau này được thêm.

File này nhằm hỗ trợ review, nghiệm thu và định hướng các bước nâng cấp tiếp theo cho dự án.

