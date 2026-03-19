# Task List - Frontend (Guest & Member)

## Scope

Task list nay tong hop cac chuc nang frontend cho 2 role `guest` va `member`, dua tren cac phan da trien khai va dong bo voi backend trong qua trinh lam viec.

## Task Table

| No | Task Name | Status | Notes |
|---:|---|---|---|
| 1 | Build: Auth APIs (Register, Login, JWT, Refresh Token) | DONE | Da dung `authService`, login + get me, refresh token theo `/members/refresh-access-token`. |
| 2 | Build: Email Verification & Reset Password APIs | DONE | Da co trang sau dang ky, resend verify email, verify email page, forgot/reset password flow. Da them route alias `/members/reset-password` de khop link email backend. |
| 3 | Build: User Profile APIs (Member Profile) | DONE | Da co cap nhat profile member (`PATCH /members/me`) va dong bo user state trong auth context. |
| 4 | Build: Product Listing & Product Detail UX | DONE | Card san pham click vao se vao chi tiet; support quick-buy va add-to-cart theo flow da dieu chinh. |
| 5 | Build: Cart Flow (Guest/Member rules) | DONE | Member dung backend cart APIs (`/api/carts/*`), guest bi chan thao tac gio theo yeu cau moi. |
| 6 | Build: Shopping Cart APIs integration | DONE | Da them `cartService` (get/add/update/remove/clear cart) va map du lieu gio hang backend cho FE. |
| 7 | Build: Order & Checkout Flow APIs | DONE | Da tao don that (`POST /orders`), gui items + address string + voucher_code, clear cart sau checkout. |
| 8 | Build: Voucher Validation APIs | DONE | Da sua payload check voucher khop backend (`total_amount`), apply discount tren CartPage. |
| 9 | Build: Member Order List & Order Detail | DONE | Da co list don, huy don pending, xem chi tiet don (`/account/orders/:orderId`). |
| 10 | Build: Order Detail Data Alignment | DONE | Da render `price_at_purchase`, address string; fallback payment_method; fetch ten san pham de hien thi thay vi product id. |
| 11 | Build: Blog Detail + Suggested Product Quick Buy | DONE | Da them route `/blog/:id`, hien thi bai viet chi tiet va mua nhanh san pham goi y. |
| 12 | Build: Member Report API Flow | DONE | Da co form gui report member (`POST /api/reports`). |
| 13 | Build: Payment Method UI Adjustments | DONE | Da bo MoMo tren FE; giu COD + Bank transfer; hien thi QR khi chon chuyen khoan. |
| 14 | Build: Frontend-Backend Gap Documentation updates | DONE | Da cap nhat tai lieu gap/fix de phan anh cac muc da khop backend. |

## Notes for project defense

- Cac muc tren tap trung pham vi `guest/member` ben frontend.
- Mot so logic hien thi duoc bo sung fallback de tranh vo UI khi backend khong tra du field (vd: `payment_method`, `product_name` trong order detail).
- Neu can mo rong tiep theo scope project: chat member, pre-order UI chi tiet, thong bao realtime.

