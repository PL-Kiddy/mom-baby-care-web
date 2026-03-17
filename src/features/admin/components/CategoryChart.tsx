import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './CategoryChart.module.css'

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
      <div className={styles.wrap}>
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
        <div className={styles.center}>
          <div className={styles.centerVal}>{TOTAL_PRODUCTS}</div>
          <div className={styles.centerLabel}>sản phẩm</div>
        </div>
      </div>
      <div className={styles.legend}>
        {DATA.map((d) => (
          <div className={styles.item} key={d.name}>
            <div className={styles.dot} style={{ background: d.color }} />
            <span>{d.name}</span>
            <span className={styles.pct}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
