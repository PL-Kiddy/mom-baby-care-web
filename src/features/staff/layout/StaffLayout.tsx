import { Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom'
import {
  IconOrder, IconTruck, IconInventory, IconReport,
  IconVoucher, IconPost, IconMessageSquare, IconMilk, IconLogout,
} from '../../../shared/components/Icons'
import Topbar from '../../../shared/components/Topbar'
import { useAuth } from '../../../shared/hooks/useAuth'
import type { NavGroup } from '../../../shared/types'
import styles from './StaffLayout.module.css'

const PAGE_TITLES: Record<string, string> = {
  '/staff/orders':    'Xác nhận Đơn hàng',
  '/staff/tracking':  'Tracking Đơn hàng',
  '/staff/inventory': 'Quản lý Kho hàng',
  '/staff/reports':   'Xử lý Report',
  '/staff/vouchers':  'Tạo Voucher',
  '/staff/posts':     'Quản lý Bài viết',
  '/staff/chat':      'Chat Tư vấn',
}

const NAV: NavGroup[] = [
  { section: 'Đơn hàng', items: [
    { to: '/staff/orders',   Icon: IconOrder,          label: 'Xác nhận đơn', badge: 5 },
    { to: '/staff/tracking', Icon: IconTruck,          label: 'Tracking' },
  ]},
  { section: 'Kho & Sản phẩm', items: [
    { to: '/staff/inventory', Icon: IconInventory, label: 'Kho hàng' },
  ]},
  { section: 'Nội dung', items: [
    { to: '/staff/posts',    Icon: IconPost,    label: 'Bài viết' },
    { to: '/staff/vouchers', Icon: IconVoucher, label: 'Voucher' },
  ]},
  { section: 'Hỗ trợ', items: [
    { to: '/staff/reports', Icon: IconReport,        label: 'Report',      badge: 3 },
    { to: '/staff/chat',    Icon: IconMessageSquare, label: 'Chat tư vấn', badge: 7 },
  ]},
]

export default function StaffLayout() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = user?.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() ?? 'S'

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}><IconMilk size={22} color="var(--teal)" /></div>
          <div>
            <div className={styles.logoTitle}>MilkCare</div>
            <div className={styles.logoSub}>Staff Portal</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {NAV.map(group => (
            <div key={group.section}>
              <div className={styles.navSection}>{group.section}</div>
              {group.items.map(({ to, Icon, label, badge }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                  <span className={styles.iconWrap}><Icon size={16} /></span>
                  {label}
                  {badge !== undefined && <span className={styles.badge}>{badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className={styles.footer}>
          <div className={styles.staffAvatar}>{initials}</div>
          <div className={styles.staffMeta}>
            <div className={styles.staffName}>{user?.name ?? 'Staff'}</div>
            <div className={styles.staffRole}>{user?.email}</div>
          </div>
          <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/login', { replace: true }) }}>
            <IconLogout size={15} />
          </button>
        </div>
      </aside>
      <div className={styles.main}>
        <Topbar title={PAGE_TITLES[pathname] ?? 'Staff Portal'} />
        <div className={styles.content}><Outlet /></div>
      </div>
    </div>
  )
}
