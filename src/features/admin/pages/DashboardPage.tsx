import StatCard from '../components/StatCard'
import RevenueChart from '../components/RevenueChart'
import CategoryChart from '../components/CategoryChart'
import RecentOrders from '../components/RecentOrders'
import { QuickActions, TopProducts, ActivityFeed } from '../components/DashboardWidgets'
import { IconRevenue, IconOrder, IconAccount, IconProduct } from '../../../shared/components/Icons'
import type { StatCardData } from '../../../shared/types'

const STATS: StatCardData[] = [
  { label: 'Doanh thu tháng', value: '128.4M', change: '+12.5% so với tháng trước', changeType: 'up',   icon: IconRevenue, color: 'orange' },
  { label: 'Đơn hàng mới',   value: '342',     change: '+8.2% tuần này',            changeType: 'up',   icon: IconOrder,   color: 'pink'   },
  { label: 'Thành viên',     value: '1,847',   change: '+56 tháng này',             changeType: 'up',   icon: IconAccount, color: 'teal'   },
  { label: 'Sản phẩm',       value: '94',      change: '3 sắp hết hàng',           changeType: 'down', icon: IconProduct, color: 'gold'   },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="grid gap-4 md:gap-5 grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm shadow-pink-50">
          <RevenueChart />
        </div>
        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm shadow-pink-50">
          <CategoryChart />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm shadow-pink-50">
        <RecentOrders />
      </div>
      <div className="grid gap-4 md:gap-5 grid-cols-1 lg:grid-cols-3">
        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm shadow-pink-50">
          <QuickActions />
        </div>
        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm shadow-pink-50">
          <TopProducts />
        </div>
        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm shadow-pink-50">
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
