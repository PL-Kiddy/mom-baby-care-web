import { NavLink, useNavigate } from 'react-router-dom'
import {
  IconDashboard, IconProduct, IconOrder, IconAccount,
  IconVoucher, IconPost, IconRevenue, IconMilk, IconLogout,
} from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import type { NavGroup } from '../../../shared/types'
import styles from './Sidebar.module.css'

const NAV: NavGroup[] = [
  { section: 'Tổng quan', items: [
    { to: '/dashboard', Icon: IconDashboard, label: 'Dashboard' },
  ]},
  { section: 'Quản lý', items: [
    { to: '/products', Icon: IconProduct, label: 'Sản phẩm' },
    { to: '/orders',   Icon: IconOrder,   label: 'Đơn hàng', badge: 14 },
    { to: '/accounts', Icon: IconAccount, label: 'Tài khoản' },
    { to: '/vouchers', Icon: IconVoucher, label: 'Voucher' },
    { to: '/posts',    Icon: IconPost,    label: 'Bài viết' },
  ]},
  { section: 'Báo cáo', items: [
    { to: '/revenue', Icon: IconRevenue, label: 'Doanh thu' },
  ]},
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = user?.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() ?? 'A'

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}><IconMilk size={22} color="var(--accent)" /></div>
        <div>
          <div className={styles.logoTitle}>MilkCare</div>
          <div className={styles.logoSub}>Admin Portal</div>
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
        <div className={styles.adminAvatar}>{initials}</div>
        <div className={styles.adminMeta}>
          <div className={styles.adminName}>{user?.name ?? 'Admin'}</div>
          <div className={styles.adminRole}>{user?.email}</div>
        </div>
        <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/login', { replace: true }) }}>
          <IconLogout size={15} />
        </button>
      </div>
    </aside>
  )
}
