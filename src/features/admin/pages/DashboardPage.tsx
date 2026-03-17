import StatCard from '../components/StatCard'
import RevenueChart from '../components/RevenueChart'
import CategoryChart from '../components/CategoryChart'
import RecentOrders from '../components/RecentOrders'
import { QuickActions, TopProducts, ActivityFeed } from '../components/DashboardWidgets'
import { IconRevenue, IconOrder, IconAccount, IconProduct } from '../../../shared/components/Icons'
import type { StatCardData } from '../../../shared/types'
import styles from './DashboardPage.module.css'

const STATS: StatCardData[] = [
  { label: 'Doanh thu tháng', value: '128.4M', change: '+12.5% so với tháng trước', changeType: 'up',   icon: IconRevenue, color: 'orange' },
  { label: 'Đơn hàng mới',   value: '342',     change: '+8.2% tuần này',            changeType: 'up',   icon: IconOrder,   color: 'pink'   },
  { label: 'Thành viên',     value: '1,847',   change: '+56 tháng này',             changeType: 'up',   icon: IconAccount, color: 'teal'   },
  { label: 'Sản phẩm',       value: '94',      change: '3 sắp hết hàng',           changeType: 'down', icon: IconProduct, color: 'gold'   },
]

export default function DashboardPage() {
  return (
    <div>
      <div className={styles.statsGrid}>
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className={styles.chartsRow}>
        <RevenueChart />
        <CategoryChart />
      </div>
      <RecentOrders />
      <div className={styles.bottomRow}>
        <QuickActions />
        <TopProducts />
        <ActivityFeed />
      </div>
    </div>
  )
}
