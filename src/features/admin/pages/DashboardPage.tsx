import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import RevenueChart from '../components/RevenueChart'
import CategoryChart from '../components/CategoryChart'
import RecentOrders from '../components/RecentOrders'
import { QuickActions, TopProducts, ActivityFeed } from '../components/DashboardWidgets'
import { IconRevenue, IconOrder, IconAccount, IconProduct } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getDashboardStatsApi } from '../services/adminService'
import type { StatCardData } from '../../../shared/types'

export default function DashboardPage() {
  const { token } = useAuth()
  const [stats, setStats] = useState<StatCardData[]>([])
  const [chartData, setChartData] = useState<{ revenue_by_month?: any[], category_stats?: any[], top_products?: any[] }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      if (!token) return
      try {
        const data = await getDashboardStatsApi(token)
        setChartData({
          revenue_by_month: data.revenue_by_month,
          category_stats: data.category_stats,
          top_products: data.top_products
        })
        
        // Ánh xạ dữ liệu từ BE sang định dạng UI StatCardData
        const mapping: StatCardData[] = [
          {
            label: 'Doanh thu tháng',
            value: `${(data.total_revenue || 0).toLocaleString()} ₫`,
            change: '+12.5% so với tháng trước',
            changeType: 'up',
            icon: IconRevenue,
            color: 'orange'
          },

          {
            label: 'Đơn hàng mới',
            value: data.total_orders?.toString() || '0',
            change: '+8.2% tuần này',
            changeType: 'up',
            icon: IconOrder,
            color: 'pink'
          },
          {
            label: 'Thành viên',
            value: data.total_users?.toLocaleString() || '0',
            change: '+56 tháng này',
            changeType: 'up',
            icon: IconAccount,
            color: 'teal'
          },
          {
            label: 'Sản phẩm',
            value: (data.category_stats?.reduce((sum: number, c: any) => sum + c.count, 0) || 0).toString(),
            change: '3 sắp hết hàng',
            changeType: 'down',
            icon: IconProduct,
            color: 'gold'
          },
        ]
        setStats(mapping)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [token])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-[#fce7ef]" />
          ))
        ) : (
          stats.map((s) => <StatCard key={s.label} {...s} />)
        )}
      </div>
      <div className="grid gap-4 md:gap-5 grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm shadow-pink-50">
          <RevenueChart data={chartData.revenue_by_month} />
        </div>
        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm shadow-pink-50">
          <CategoryChart data={chartData.category_stats} />
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
          <TopProducts data={chartData.top_products} />
        </div>
        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm shadow-pink-50">
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}

