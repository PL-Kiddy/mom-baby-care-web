import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from '../../../shared/components/Topbar'

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/orders':    'Quản lý Đơn hàng',
  '/admin/products':  'Quản lý Sản phẩm',
  '/admin/accounts':  'Quản lý Tài khoản',
  '/admin/vouchers':  'Quản lý Voucher',
  '/admin/posts':     'Quản lý Bài viết',
  '/admin/revenue':   'Báo cáo Doanh thu',
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex bg-background-light text-text-main font-display">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-[260px]">
        <Topbar title={PAGE_TITLES[pathname] ?? 'Admin'} />
        <div className="flex-1 px-6 py-7 md:px-10 lg:px-12 bg-background-light/60">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
