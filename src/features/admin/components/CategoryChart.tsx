import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface Category {
  name: string
  value: number
  color: string
}

const DATA: Category[] = [
  { name: 'Sữa mẹ bầu', value: 38, color: 'var(--accent)' },
  { name: 'Sữa trẻ em', value: 25, color: 'var(--pink)' },
  { name: 'Thực phẩm',  value: 22, color: 'var(--teal)' },
  { name: 'Phụ kiện',   value: 15, color: 'var(--gold)' },
]

const TOTAL_PRODUCTS = 94

export default function CategoryChart() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Danh mục sản phẩm</span>
      </div>
      <div className="relative mb-4 flex justify-center">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={DATA}
              cx="50%" cy="50%"
              innerRadius={42} outerRadius={62}
              paddingAngle={3}
              dataKey="value"
            >
              {DATA.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => `${v}%`}
              contentStyle={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-[26px] font-bold tracking-[-1px] text-[var(--accent)]">
            {TOTAL_PRODUCTS}
          </div>
          <div className="text-[11px] text-[var(--muted)]">sản phẩm</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {DATA.map((d) => (
          <div className="flex items-center gap-2 text-[13px]" key={d.name}>
            <div className="h-[10px] w-[10px] flex-shrink-0 rounded-full" style={{ background: d.color }} />
            <span>{d.name}</span>
            <span className="ml-auto text-[12px] text-[var(--muted)]">
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
