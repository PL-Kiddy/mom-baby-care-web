import { Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom'
import {
  IconOrder, IconTruck, IconInventory, IconReport,
  IconVoucher, IconPost, IconMessageSquare, IconMilk, IconLogout,
} from '../../../shared/components/Icons'
import Topbar from '../../../shared/components/Topbar'
import { useAuth } from '../../../shared/hooks/useAuth'
import type { NavGroup } from '../../../shared/types'

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
    <div className="flex min-h-screen">
      <aside
        className="
          fixed left-0 top-0 z-[100] flex min-h-screen
          w-[var(--sidebar-width)] flex-col border-r border-[var(--border)]
          bg-[var(--surface-solid)]
        "
      >
        <div
          className="
            flex items-center gap-3 border-b border-[var(--border)]
            px-5 py-5
          "
        >
          <div
            className="
              flex h-[38px] w-[38px] items-center justify-center
              rounded-[10px] border border-[rgba(52,211,153,0.2)]
              bg-[rgba(52,211,153,0.1)]
              flex-shrink-0
            "
          >
            <IconMilk size={22} color="var(--teal)" />
          </div>
          <div>
            <div className="text-[16px] font-bold tracking-[-0.3px]">
              MilkCare
            </div>
            <div className="mt-[2px] text-[10px] font-medium uppercase tracking-[1.5px] text-[var(--teal)]">
              Staff Portal
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-3">
          {NAV.map(group => (
            <div key={group.section}>
              <div className="px-2.5 pb-1 pt-3 text-[9px] font-semibold uppercase tracking-[2px] text-[var(--muted)]">
                {group.section}
              </div>
              {group.items.map(({ to, Icon, label, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    [
                      'mb-[2px] flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[var(--muted)] no-underline transition-all',
                      'hover:bg-[var(--surface2)] hover:text-[var(--text)]',
                      isActive
                        ? 'border-l-2 border-l-[var(--teal)] bg-[rgba(52,211,153,0.1)] pl-2 text-[var(--teal)]'
                        : '',
                    ].join(' ')
                  }
                >
                  <span className="flex w-[18px] flex-shrink-0 items-center opacity-75">
                    <Icon size={16} />
                  </span>
                  {label}
                  {badge !== undefined && (
                    <span className="ml-auto rounded-[20px] bg-[var(--teal)] px-1.5 py-[2px] text-[9px] font-bold text-[#0b0e18]">
                      {badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 border-t border-[var(--border)] px-4 py-3.5">
          <div
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              bg-[linear-gradient(135deg,var(--teal),var(--accent))]
              text-[13px] font-bold text-[#0b0e18]
            "
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold">
              {user?.name ?? 'Staff'}
            </div>
            <div className="truncate text-[11px] text-[var(--teal)]">
              {user?.email}
            </div>
          </div>
          <button
            className="
              flex items-center rounded-md p-1.5 text-[var(--muted)]
              transition-colors hover:bg-[rgba(248,113,113,0.1)] hover:text-[var(--red)]
            "
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
          >
            <IconLogout size={15} />
          </button>
        </div>
      </aside>

      <div className="ml-[var(--sidebar-width)] flex min-w-0 flex-1 flex-col">
        <Topbar title={PAGE_TITLES[pathname] ?? 'Staff Portal'} />
        <div className="flex-1 px-7 py-7">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
