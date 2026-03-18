import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import type { TooltipProps } from 'recharts'

interface MonthData {
  month: string
  revenue: number
  orders: number
}

const DATA_6M: MonthData[] = [
  { month: 'T10', revenue: 95,  orders: 55 },
  { month: 'T11', revenue: 112, orders: 68 },
  { month: 'T12', revenue: 88,  orders: 80 },
  { month: 'T1',  revenue: 120, orders: 70 },
  { month: 'T2',  revenue: 105, orders: 62 },
  { month: 'T3',  revenue: 128, orders: 85 },
]

const DATA_1Y: MonthData[] = [
  { month: 'T4',  revenue: 72,  orders: 40 },
  { month: 'T5',  revenue: 80,  orders: 48 },
  { month: 'T6',  revenue: 65,  orders: 35 },
  { month: 'T7',  revenue: 90,  orders: 55 },
  { month: 'T8',  revenue: 85,  orders: 50 },
  { month: 'T9',  revenue: 78,  orders: 45 },
  { month: 'T10', revenue: 95,  orders: 55 },
  { month: 'T11', revenue: 112, orders: 68 },
  { month: 'T12', revenue: 88,  orders: 80 },
  { month: 'T1',  revenue: 120, orders: 70 },
  { month: 'T2',  revenue: 105, orders: 62 },
  { month: 'T3',  revenue: 128, orders: 85 },
]

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="flex flex-col gap-1 rounded-[12px] border border-[#fce7ef] bg-white px-3.5 py-2.5 text-[12px] shadow-lg shadow-pink-100/20">
      <div className="mb-1 font-bold text-[var(--text)]">{label}</div>
      <div style={{ color: 'var(--accent)', fontWeight: 600 }}>Doanh thu: {payload[0]?.value}M ₫</div>
      <div style={{ color: 'var(--teal)', fontWeight: 600 }}>Đơn hàng: {payload[1]?.value}</div>
    </div>

  )
}

export default function RevenueChart({ data }: { data?: MonthData[] }) {
  const [period, setPeriod] = useState<'6m' | '1y'>('6m')
  
  // Use provided data or fallback to empty array
  const displayData = data || (period === '6m' ? DATA_6M : DATA_1Y)

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Doanh thu theo tháng</span>
        <div className="tab-row" style={{ marginBottom: 0 }}>
          <button className={`tab ${period === '6m' ? 'active' : ''}`} onClick={() => setPeriod('6m')}>6 tháng</button>
          <button className={`tab ${period === '1y' ? 'active' : ''}`} onClick={() => setPeriod('1y')}>1 năm</button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={displayData} barGap={4}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />

          <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,142,255,.05)' }} />
          <Bar dataKey="revenue" fill="var(--accent)" radius={[6, 6, 0, 0]} maxBarSize={28} />
          <Bar dataKey="orders"  fill="var(--teal)"   radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex gap-4 text-[12px] text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <div className="h-[10px] w-[10px] rounded-[3px] bg-[var(--accent)]" />
          Doanh thu (triệu ₫)
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-[10px] w-[10px] rounded-[3px] bg-[var(--teal)]" />
          Đơn hàng
        </div>
      </div>
    </div>
  )
}
