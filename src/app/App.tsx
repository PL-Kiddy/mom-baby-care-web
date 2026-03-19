import { Routes, Route } from 'react-router-dom'

// Auth
import LoginPage from '../features/auth/pages/LoginPage'
import ProtectedRoute from '../shared/components/ProtectedRoute'
import RootRedirect from '../shared/components/RootRedirect'

// Shop (member)
import HomePage from '../features/shop/pages/HomePage'
import CustomerRegisterPage from '../features/shop/pages/CustomerRegisterPage'
import CustomerForgotPasswordPage from '../features/shop/pages/CustomerForgotPasswordPage'
import ResetPasswordPage from '../features/shop/pages/ResetPasswordPage'
import CartPage from '../features/shop/pages/CartPage'
import ProductListPage from '../features/shop/pages/ProductListPage'
import ProductDetailPage from '../features/shop/pages/ProductDetailPage'
import BlogListPage from '../features/shop/pages/BlogListPage'
import BlogDetailPage from '../features/shop/pages/BlogDetailPage'
import PaymentResultPage from '../features/shop/pages/PaymentResultPage'
import AccountProfilePage from '../features/shop/pages/AccountProfilePage'
import AccountOrdersPage from '../features/shop/pages/AccountOrdersPage'
import AccountRewardsPage from '../features/shop/pages/AccountRewardsPage'
import MemberRoute from '../shared/components/MemberRoute'
import VerifyEmailPage from '../features/shop/pages/VerifyEmailPage'
import AfterRegisterVerifyNoticePage from '../features/shop/pages/AfterRegisterVerifyNoticePage'
import AccountOrderDetailPage from '../features/shop/pages/AccountOrderDetailPage'
import MemberReportPage from '../features/shop/pages/MemberReportPage'

// Admin
import AdminLayout from '../features/admin/layout/AdminLayout'
import DashboardPage from '../features/admin/pages/DashboardPage'
import OrdersPage from '../features/admin/pages/OrdersPage'
import ProductsPage from '../features/admin/pages/ProductsPage'
import AccountsPage from '../features/admin/pages/AccountsPage'
import VouchersPage from '../features/admin/pages/VouchersPage'
import PostsPage from '../features/admin/pages/PostsPage'
import RevenuePage from '../features/admin/pages/RevenuePage'

// Staff
import StaffLayout from '../features/staff/layout/StaffLayout'
import OrderConfirmPage from '../features/staff/pages/OrderConfirmPage'
import TrackingPage from '../features/staff/pages/TrackingPage'
import InventoryPage from '../features/staff/pages/InventoryPage'
import ReportsPage from '../features/staff/pages/ReportsPage'
import StaffVouchersPage from '../features/staff/pages/VouchersPage'
import StaffPostsPage from '../features/staff/pages/PostsPage'
import ChatPage from '../features/staff/pages/ChatPage'

export default function App() {
  return (
    <Routes>
      {/* Public auth + member shop */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<CustomerRegisterPage />} />
      <Route path="/forgot-password" element={<CustomerForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />
      <Route path="/blogs" element={<BlogListPage />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:id" element={<BlogDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/payment-result" element={<PaymentResultPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/after-register-verify" element={<AfterRegisterVerifyNoticePage />} />

      {/* Member protected routes */}
      <Route element={<MemberRoute />}>
        <Route path="/account/profile" element={<AccountProfilePage />} />
        <Route path="/account/orders" element={<AccountOrdersPage />} />
        <Route path="/account/orders/:orderId" element={<AccountOrderDetailPage />} />
        <Route path="/account/rewards" element={<AccountRewardsPage />} />
        <Route path="/account/report" element={<MemberReportPage />} />
      </Route>

      {/* Admin — role: admin */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="vouchers" element={<VouchersPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
        </Route>
      </Route>

      {/* Staff — role: staff */}
      <Route element={<ProtectedRoute allowedRole="staff" />}>
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="orders" element={<OrderConfirmPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="vouchers" element={<StaffVouchersPage />} />
          <Route path="posts" element={<StaffPostsPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}
