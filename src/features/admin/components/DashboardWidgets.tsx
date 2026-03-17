import type { ReactNode } from 'react'
import type { IconProps } from '../../../shared/types'
import {
  IconProduct, IconVoucher, IconPost, IconChart, IconEye, IconWarning,
} from '../../../shared/components/Icons'
import styles from './DashboardWidgets.module.css'

// ─── Quick Actions ────────────────────────────────────────────────────────────
interface Action {
  Icon: React.ComponentType<IconProps>
  label: string
  color: string
}

const ACTIONS: Action[] = [
  { Icon: IconProduct, label: 'Thêm sản phẩm mới', color: 'blue' },
  { Icon: IconVoucher, label: 'Tạo voucher mới',    color: 'purple' },
  { Icon: IconPost,    label: 'Đăng bài viết',      color: 'teal' },
  { Icon: IconChart,   label: 'Xuất báo cáo',       color: 'gold' },
]

export function QuickActions() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Thao tác nhanh</span>
      </div>
      <div className={styles.actionsList}>
        {ACTIONS.map(({ Icon, label, color }) => (
          <button key={label} className={styles.actionBtn}>
            <span className={`${styles.actionIcon} ${styles[color]}`}>
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

export function TopProducts() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Sản phẩm bán chạy</span>
        <span className="card-action">Xem thêm</span>
      </div>
      <div className={styles.productList}>
        {TOP_PRODUCTS.map((p, i) => (
          <div key={p.name} className={styles.productRow}>
            <div className={styles.productRank}>{i + 1}</div>
            <div className={styles.productInfo}>
              <div className={styles.productName}>{p.name}</div>
              <div className={styles.productSub}>
                <IconEye size={11} color="var(--muted)" />
                {p.orders} đơn tháng này
              </div>
            </div>
            <div className={styles.productRevenue}>{p.revenue}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
interface Activity {
  Icon: React.ComponentType<IconProps>
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
      <div className={styles.activityList}>
        {ACTIVITIES.map(({ Icon, bg, iconColor, text, time }, i) => (
          <div key={i} className={styles.activityItem}>
            <div className={styles.actIcon} style={{ background: bg }}>
              <Icon size={13} color={iconColor} />
            </div>
            <div>
              <div className={styles.actText}>{text}</div>
              <div className={styles.actTime}>{time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
