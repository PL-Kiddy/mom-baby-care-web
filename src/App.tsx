import { Routes, Route, Navigate } from 'react-router-dom'

// Public shop pages (Guest/Member)
import HomePage from './features/shop/pages/HomePage'
import ProductListPage from './features/shop/pages/ProductListPage'
import ProductDetailPage from './features/shop/pages/ProductDetailPage'
import BlogListPage from './features/shop/pages/BlogListPage'
import BlogDetailPage from './features/shop/pages/BlogDetailPage'
import AccountProfilePage from './features/shop/pages/AccountProfilePage'
import AccountOrdersPage from './features/shop/pages/AccountOrdersPage'
import AccountOrderDetailPage from './features/shop/pages/AccountOrderDetailPage'
import AccountRewardsPage from './features/shop/pages/AccountRewardsPage'
import MemberReportPage from './features/shop/pages/MemberReportPage'
import CustomerRegisterPage from './features/shop/pages/CustomerRegisterPage'
import CustomerForgotPasswordPage from './features/shop/pages/CustomerForgotPasswordPage'
import ResetPasswordPage from './features/shop/pages/ResetPasswordPage'
import VerifyEmailPage from './features/shop/pages/VerifyEmailPage'
import AfterRegisterVerifyNoticePage from './features/shop/pages/AfterRegisterVerifyNoticePage'
import CartPage from './features/shop/pages/CartPage'

// Admin/Staff auth + layouts
import LoginPage from './features/auth/pages/LoginPage'
import ProtectedRoute from './shared/components/ProtectedRoute'
import MemberRoute from './shared/components/MemberRoute'
import RootRedirect from './shared/components/RootRedirect'

import AdminLayout from './features/admin/layout/AdminLayout'
import DashboardPage from './features/admin/pages/DashboardPage'
import OrdersPage from './features/admin/pages/OrdersPage'
import ProductsPage from './features/admin/pages/ProductsPage'
import AccountsPage from './features/admin/pages/AccountsPage'
import VouchersPage from './features/admin/pages/VouchersPage'
import PostsPage from './features/admin/pages/PostsPage'
import RevenuePage from './features/admin/pages/RevenuePage'

import StaffLayout from './features/staff/layout/StaffLayout'
import OrderConfirmPage from './features/staff/pages/OrderConfirmPage'
import TrackingPage from './features/staff/pages/TrackingPage'
import InventoryPage from './features/staff/pages/InventoryPage'
import ReportsPage from './features/staff/pages/ReportsPage'
import StaffVouchersPage from './features/staff/pages/VouchersPage'
import StaffPostsPage from './features/staff/pages/PostsPage'
import ChatPage from './features/staff/pages/ChatPage'

export default function App() {
  return (
    <Routes>
      {/* Public shop (Guest/Member) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<CustomerRegisterPage />} />
      <Route path="/forgot-password" element={<CustomerForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/members/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/after-register-verify" element={<AfterRegisterVerifyNoticePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:id" element={<BlogDetailPage />} />
      {/* MoMo disabled: không còn route payment-result */}

      {/* Member-only account area */}
      <Route element={<MemberRoute />}>
        <Route path="/account/profile" element={<AccountProfilePage />} />
        <Route path="/account/orders" element={<AccountOrdersPage />} />
        <Route path="/account/orders/:orderId" element={<AccountOrderDetailPage />} />
        <Route path="/account/rewards" element={<AccountRewardsPage />} />
        <Route path="/account/report" element={<MemberReportPage />} />
      </Route>

      {/* Admin/Staff auth portal (giữ path cũ, redirect về /login) */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />
      <Route path="/portal" element={<RootRedirect />} />

      {/* Admin — role: admin */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
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
    </Routes>
  )
}
