import { Routes, Route } from 'react-router-dom'

// Auth
import LoginPage       from '../features/auth/pages/LoginPage'
import ProtectedRoute  from '../shared/components/ProtectedRoute'
import RootRedirect    from '../shared/components/RootRedirect'

// Admin
import AdminLayout    from '../features/admin/layout/AdminLayout'
import DashboardPage  from '../features/admin/pages/DashboardPage'
import OrdersPage     from '../features/admin/pages/OrdersPage'
import ProductsPage   from '../features/admin/pages/ProductsPage'
import AccountsPage   from '../features/admin/pages/AccountsPage'
import VouchersPage   from '../features/admin/pages/VouchersPage'
import PostsPage      from '../features/admin/pages/PostsPage'
import RevenuePage    from '../features/admin/pages/RevenuePage'

// Staff
import StaffLayout       from '../features/staff/layout/StaffLayout'
import OrderConfirmPage  from '../features/staff/pages/OrderConfirmPage'
import TrackingPage      from '../features/staff/pages/TrackingPage'
import InventoryPage     from '../features/staff/pages/InventoryPage'
import ReportsPage       from '../features/staff/pages/ReportsPage'
import StaffVouchersPage from '../features/staff/pages/VouchersPage'
import StaffPostsPage    from '../features/staff/pages/PostsPage'
import ChatPage          from '../features/staff/pages/ChatPage'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/"      element={<RootRedirect />} />

      {/* Admin — role: admin */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders"    element={<OrdersPage />} />
          <Route path="products"  element={<ProductsPage />} />
          <Route path="accounts"  element={<AccountsPage />} />
          <Route path="vouchers"  element={<VouchersPage />} />
          <Route path="posts"     element={<PostsPage />} />
          <Route path="revenue"   element={<RevenuePage />} />
        </Route>
      </Route>

      {/* Staff — role: staff */}
      <Route element={<ProtectedRoute allowedRole="staff" />}>
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="orders"    element={<OrderConfirmPage />} />
          <Route path="tracking"  element={<TrackingPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="reports"   element={<ReportsPage />} />
          <Route path="vouchers"  element={<StaffVouchersPage />} />
          <Route path="posts"     element={<StaffPostsPage />} />
          <Route path="chat"      element={<ChatPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
