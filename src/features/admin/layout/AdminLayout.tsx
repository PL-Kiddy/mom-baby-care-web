import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from '../../../shared/components/Topbar'
import styles from './AdminLayout.module.css'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/orders':    'Quản lý Đơn hàng',
  '/products':  'Quản lý Sản phẩm',
  '/accounts':  'Quản lý Tài khoản',
  '/vouchers':  'Quản lý Voucher',
  '/posts':     'Quản lý Bài viết',
  '/revenue':   'Báo cáo Doanh thu',
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar title={PAGE_TITLES[pathname] ?? 'Admin'} />
        <div className={styles.content}><Outlet /></div>
      </div>
    </div>
  )
}
