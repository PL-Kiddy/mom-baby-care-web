import type { JSX, ReactNode } from 'react'
import type { IconProps } from '../../../shared/types'
import {
  IconProduct, IconVoucher, IconPost, IconChart, IconEye, IconWarning,
} from '../../../shared/components/Icons'

import { useNavigate } from 'react-router-dom'
type CustomIcon = (props: IconProps) => JSX.Element

// ─── Quick Actions ────────────────────────────────────────────────────────────
interface Action {
  Icon: CustomIcon
  label: string
  color: string
  path: string
}

const ACTIONS: Action[] = [
  { Icon: IconProduct, label: 'Thêm sản phẩm mới', color: 'blue', path: '/admin/products' },
  { Icon: IconVoucher, label: 'Tạo voucher mới',    color: 'purple', path: '/admin/vouchers' },
  { Icon: IconPost,    label: 'Đăng bài viết',      color: 'teal', path: '/admin/posts' },
  { Icon: IconChart,   label: 'Xuất báo cáo',       color: 'gold', path: '/admin/revenue' },
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Thao tác nhanh</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {ACTIONS.map(({ Icon, label, color, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="
              flex items-center gap-3 rounded-[9px]
              border border-[var(--border)] bg-[var(--surface2)]
              px-3.5 py-[11px] text-left text-[13px] font-medium text-[var(--text)]
              transition-colors hover:border-[var(--accent)] hover:bg-[rgba(108,142,255,0.06)] hover:text-[var(--accent)]
            "
          >
            <span
              className={`
                flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[8px]
                ${
                  color === 'blue'
                    ? 'bg-[rgba(108,142,255,0.15)] text-[var(--accent)]'
                    : color === 'purple'
                      ? 'bg-[rgba(192,132,252,0.15)] text-[var(--pink)]'
                      : color === 'teal'
                        ? 'bg-[rgba(52,211,153,0.15)] text-[var(--teal)]'
                        : 'bg-[rgba(251,191,36,0.15)] text-[var(--gold)]'
                }
              `}
            >
              <Icon size={15} />
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Top Products ─────────────────────────────────────────────────────────────
interface TopProduct {
  name: string
  orders: number
  revenue: string
}

const TOP_PRODUCTS: TopProduct[] = [
  { name: 'Similac Gain IQ 4',   orders: 89, revenue: '4.5M ₫' },
  { name: 'Enfamama A+ Vanilla', orders: 72, revenue: '3.8M ₫' },
  { name: 'Aptamil Gold+ 2',     orders: 61, revenue: '3.2M ₫' },
  { name: 'Nan Optipro 1',       orders: 54, revenue: '2.9M ₫' },
]

export function TopProducts({ data }: { data?: any[] }) {
  const displayData = data || TOP_PRODUCTS

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Sản phẩm bán chạy</span>
        <span className="card-action">Xem thêm</span>
      </div>
      <div className="flex flex-col gap-3.5">
        {displayData.map((p, i) => (
          <div key={p.name} className="flex items-center gap-3 text-[13px]">
            <div
              className="
                flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center
                rounded-[6px] border border-[var(--border)] bg-[var(--surface2)]
                text-[11px] font-bold text-[var(--muted)]
              "
            >
              {i + 1}
            </div>
            <div className="min-width-0 flex-1">
              <div className="max-w-[220px] truncate text-[13px] font-medium">
                {p.name}
              </div>
              <div className="mt-[2px] flex items-center gap-1 text-[11px] text-[var(--muted)]">
                <IconEye size={11} color="var(--muted)" />
                {p.orders || (Math.floor(Math.random() * 50) + 10)} lượt bán
              </div>
            </div>
            <div className="whitespace-nowrap text-[13px] font-semibold text-[var(--accent)]">
              {p.revenue.toLocaleString()}M ₫
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
interface Activity {
  Icon: CustomIcon
  bg: string
  iconColor: string
  text: ReactNode
  time: string
}

const ACTIVITIES: Activity[] = [
  {
    Icon: IconProduct,
    bg: 'rgba(108,142,255,.12)', iconColor: 'var(--accent)',
    text: <><strong>Đơn hàng mới #381</strong> từ Nguyễn Thị Mai</>,
    time: '10 phút trước',
  },
  {
    Icon: IconChart,
    bg: 'rgba(52,211,153,.12)', iconColor: 'var(--teal)',
    text: <><strong>Thành viên mới</strong> đăng ký: hoatran@gmail.com</>,
    time: '35 phút trước',
  },
  {
    Icon: IconPost,
    bg: 'rgba(192,132,252,.12)', iconColor: 'var(--pink)',
    text: <><strong>Đánh giá mới</strong> cho Similac Gain IQ 4 — 5 sao</>,
    time: '1 giờ trước',
  },
  {
    Icon: IconVoucher,
    bg: 'rgba(251,191,36,.12)', iconColor: 'var(--gold)',
    text: <><strong>Chat tư vấn</strong> — 3 khách đang chờ phản hồi</>,
    time: '2 giờ trước',
  },
  {
    Icon: IconWarning,
    bg: 'rgba(248,113,113,.12)', iconColor: 'var(--red)',
    text: <><strong>Cảnh báo kho</strong>: Nan Optipro 1 sắp hết hàng</>,
    time: '3 giờ trước',
  },
]

export function ActivityFeed() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Hoạt động gần đây</span>
      </div>
      <div className="flex flex-col gap-3.5">
        {ACTIVITIES.map(({ Icon, bg, iconColor, text, time }, i) => (
          <div key={i} className="flex gap-3 text-[13px]">
            <div
              className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[8px]"
              style={{ background: bg }}
            >
              <Icon size={13} color={iconColor} />
            </div>
            <div>
              <div className="text-[12px] leading-relaxed text-[var(--muted)]">
                <span className="font-semibold text-[var(--text)]">
                  {/* bold phần strong đã render sẵn */}
                </span>
                {text}
              </div>
              <div className="mt-[3px] text-[11px] text-[var(--muted)]">
                {time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
