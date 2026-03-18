import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import { IconRevenue, IconChart, IconOrder, IconDashboard } from '../../../shared/components/Icons'
import type { IconProps } from '../../../shared/types'

interface MonthData  { month: string; revenue: number }
interface ProductData { name: string;  revenue: number }

const MONTHLY: MonthData[] = [
  { month: 'T4',  revenue: 72  },
  { month: 'T5',  revenue: 80  },
  { month: 'T6',  revenue: 65  },
  { month: 'T7',  revenue: 90  },
  { month: 'T8',  revenue: 85  },
  { month: 'T9',  revenue: 78  },
  { month: 'T10', revenue: 95  },
  { month: 'T11', revenue: 112 },
  { month: 'T12', revenue: 88  },
  { month: 'T1',  revenue: 120 },
  { month: 'T2',  revenue: 105 },
  { month: 'T3',  revenue: 128 },
]

const TOP_PRODUCTS: ProductData[] = [
  { name: 'Similac Gain IQ', revenue: 31 },
  { name: 'Enfamama A+',     revenue: 22 },
  { name: 'Aptamil Gold',    revenue: 19 },
  { name: 'Nan Optipro',     revenue: 16 },
  { name: 'Dumex Mamil',     revenue: 12 },
]

const TOOLTIP_STYLE: React.CSSProperties = {
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  fontSize: 12,
}

interface SummaryCard {
  label: string
  value: string
  Icon: React.ComponentType<IconProps>
  color: string
}

import { useState, useEffect } from 'react'
import { getDashboardStatsApi } from '../services/adminService'
import { useAuth } from '../../../shared/hooks/useAuth'

export default function RevenuePage() {
  const { token } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!token) return
      try {
        const res = await getDashboardStatsApi(token)
        setData(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const monthlyData = data?.revenue_by_month || MONTHLY
  const topProducts = data?.top_products || TOP_PRODUCTS
  const totalRev = (data?.total_revenue || 0)

  const SUMMARY: SummaryCard[] = [
    { label: 'Tổng doanh thu',     value: `${totalRev.toLocaleString()} ₫`,  Icon: IconRevenue,   color: 'var(--accent)' },
    { label: 'Tháng này',          value: `${(monthlyData[monthlyData.length - 1]?.revenue || 0).toFixed(1)}M ₫`, Icon: IconChart,     color: 'var(--teal)' },
    { label: 'Tổng đơn hàng',      value: (data?.total_orders || 0).toString(), Icon: IconOrder,     color: 'var(--pink)' },
    { label: 'Sản phẩm kinh doanh', value: (data?.total_products || 0).toString(), Icon: IconDashboard, color: 'var(--gold)' },
  ]

  if (loading) return <div className="p-10 text-center animate-pulse">Đang tải báo cáo...</div>

  return (
    <div>
      {/* Summary cards */}
      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {SUMMARY.map((s) => (
          <div className="card" key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, color: s.color }}>
              <s.Icon size={26} color={s.color} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 24, color: s.color, letterSpacing: -1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">Doanh thu 12 tháng (triệu ₫)</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(31,38,64,.6)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: number) => [`${v.toFixed(1)}M ₫`, 'Doanh thu']}
            />
            <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2.5} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Top sản phẩm bách chạy (triệu ₫)</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topProducts} layout="vertical" barSize={22}>
            <CartesianGrid stroke="rgba(31,38,64,.6)" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name" type="category"
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              axisLine={false} tickLine={false} width={130}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: number) => [`${v.toFixed(1)}M ₫`, 'Doanh thu']}
            />
            <Bar dataKey="revenue" fill="var(--teal)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
