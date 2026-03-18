import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface Category {
  name: string
  value: number
  color: string
}

const COLORS = ['#ff8fa3', '#ffafbd', '#34d399', '#fbbf24', '#8b5cf6', '#3b82f6']

export default function CategoryChart({ data }: { data?: { name: string, count: number }[] }) {
  const [active, setActive] = useState<number | null>(null)

  const staticData = data || [
    { name: 'Sữa mẹ bầu', count: 38 },
    { name: 'Sữa trẻ em', count: 25 },
    { name: 'Thực phẩm',  count: 22 },
    { name: 'Phụ kiện',   count: 15 },
  ]

  const total = staticData.reduce((sum, item) => sum + item.count, 0)
  const chartData = staticData.map((item, i) => ({
    name: item.name,
    value: item.count,
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
    color: COLORS[i % COLORS.length]
  }))

  return (
    <div className="card h-full">
      <div className="card-header pb-0 border-none">
        <span className="card-title">Danh mục sản phẩm</span>
      </div>
      <div className="relative flex justify-center py-6">
        <ResponsiveContainer width={150} height={150}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%" cy="50%"
              innerRadius={45} outerRadius={65}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {chartData.map((entry, i) => (
                <Cell 
                  key={i} 
                  fill={entry.color} 
                  style={{ outline: active === i ? '4px solid rgba(0,0,0,0.05)' : 'none', cursor: 'pointer' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full transition-all duration-300">
          <div className={`text-[28px] font-extrabold tracking-tight leading-tight transition-colors ${active !== null ? '' : 'text-text-main'}`} style={{ color: active !== null ? chartData[active].color : undefined }}>
            {active !== null ? `${chartData[active].percentage}%` : total}
          </div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted mt-1 px-4 leading-none truncate">
            {active !== null ? chartData[active].name : 'Sản phẩm'}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {chartData.map((d) => (
          <div className="flex items-center gap-2 text-[13px]" key={d.name}>
            <div className="h-[10px] w-[10px] flex-shrink-0 rounded-full" style={{ background: d.color }} />
            <span>{d.name}</span>
            <span className="ml-auto text-[12px] text-[var(--muted)]">
              {d.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
