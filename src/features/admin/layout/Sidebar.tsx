import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  IconDashboard, IconProduct, IconOrder, IconAccount,
  IconVoucher, IconPost, IconRevenue, IconMilk, IconLogout,
} from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import type { NavGroup } from '../../../shared/types'

const NAV: NavGroup[] = [
  { section: 'Tổng quan', items: [
    { to: '/admin/dashboard', Icon: IconDashboard, label: 'Dashboard' },
  ]},

  { section: 'Quản lý', items: [
    { to: '/admin/products', Icon: IconProduct, label: 'Sản phẩm' },
    { to: '/admin/orders',   Icon: IconOrder,   label: 'Đơn hàng', badge: 0 },
    { to: '/admin/accounts', Icon: IconAccount, label: 'Tài khoản' },
    { to: '/admin/vouchers', Icon: IconVoucher, label: 'Voucher' },
    { to: '/admin/posts',    Icon: IconPost,    label: 'Bài viết' },
  ]},
  { section: 'Báo cáo', items: [
    { to: '/admin/revenue', Icon: IconRevenue, label: 'Doanh thu' },
  ]},

]

export default function Sidebar() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [pendingOrders, setPendingOrders] = useState(0)
  const initials = user?.name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() ?? 'A'

  useEffect(() => {
    async function fetchCount() {
      if (!token) return
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const json = await res.json()
        const count = (json.result || []).filter((o: any) => o.status?.toLowerCase() === 'pending').length
        setPendingOrders(count)
      } catch (err) {
        console.error('Failed to fetch admin order count:', err)
      }
    }
    fetchCount()
    const timer = setInterval(fetchCount, 30000)
    return () => clearInterval(timer)
  }, [token])

  const navWithCounts = NAV.map(group => ({
    ...group,
    items: group.items.map(item => {
      if (item.to === '/admin/orders') return { ...item, badge: pendingOrders }
      return item
    })
  }))

  return (
    <aside className="w-[260px] min-h-screen bg-white border-r border-[#fce7ef] fixed top-0 left-0 z-40 flex flex-col shadow-sm">
      <div className="px-5 py-5 border-b border-[#fce7ef] flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <IconMilk size={22} color="var(--accent)" />
        </div>
        <div>
          <div className="text-[15px] font-bold tracking-tight text-text-main">
            MilkCare
          </div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-text-muted font-semibold">
            Admin Portal
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
        {navWithCounts.map(group => (
          <div key={group.section}>
            <div className="px-2 pt-3 pb-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-text-muted">
              {group.section}
            </div>
            {group.items.map(({ to, Icon, label, badge }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all',
                    'text-text-muted hover:text-text-main hover:bg-[#fff0f4]',
                    isActive ? 'bg-primary/10 text-primary border-l-2 border-primary pl-2.5' : 'border-l-2 border-transparent',
                  ].join(' ')
                }>
                <span className="w-5 flex items-center justify-center opacity-80">
                  <Icon size={16} />
                </span>
                {label}
                {badge !== undefined && badge > 0 && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-[#fce7ef] flex items-center gap-3 bg-background-light/40">
        <div className="size-9 rounded-xl bg-gradient-to-tr from-primary to-rose-400 text-white flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-text-main truncate">
            {user?.name ?? 'Admin'}
          </div>
          <div className="text-[11px] text-text-muted truncate">
            {user?.email}
          </div>
        </div>
        <button
          className="p-1.5 rounded-lg text-text-muted hover:text-rose-500 hover:bg-rose-50 transition-colors flex items-center"
          onClick={() => { logout(); navigate('/login', { replace: true }) }}
        >
          <IconLogout size={15} />
        </button>
      </div>
    </aside>
  )
}
