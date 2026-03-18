import { useState } from 'react'
import { IconWarning, IconPlus, IconArrowUp } from '../../../shared/components/Icons'
import type { InventoryItem } from '../../../shared/types'

const ITEMS: InventoryItem[] = [
  { id: 'SP001', name: 'Similac Gain IQ 4',    category: 'Sữa trẻ em',  sku: 'SIM-GIQ-4',   stock: 120, minStock: 20, incoming: 0,   unit: 'hộp', lastUpdated: '10/03/2025' },
  { id: 'SP002', name: 'Enfamama A+ Vanilla',  category: 'Sữa mẹ bầu', sku: 'ENF-APV',     stock: 85,  minStock: 15, incoming: 50,  unit: 'hộp', lastUpdated: '09/03/2025' },
  { id: 'SP003', name: 'Aptamil Gold+ 2',      category: 'Sữa trẻ em',  sku: 'APT-GLD-2',   stock: 4,   minStock: 20, incoming: 100, unit: 'hộp', lastUpdated: '10/03/2025' },
  { id: 'SP004', name: 'Nan Optipro 1',        category: 'Sữa trẻ em',  sku: 'NAN-OPT-1',   stock: 0,   minStock: 20, incoming: 80,  unit: 'hộp', lastUpdated: '08/03/2025' },
  { id: 'SP005', name: 'Dumex Mamil Gold',     category: 'Sữa trẻ em',  sku: 'DUM-MML-G',   stock: 67,  minStock: 10, incoming: 0,   unit: 'hộp', lastUpdated: '09/03/2025' },
  { id: 'SP006', name: 'Frisolac Gold 2',      category: 'Sữa trẻ em',  sku: 'FRI-GLD-2',   stock: 3,   minStock: 15, incoming: 60,  unit: 'hộp', lastUpdated: '10/03/2025' },
  { id: 'SP007', name: 'Nestlé NAN HA 1',     category: 'Sữa trẻ em',  sku: 'NES-NAH-1',   stock: 45,  minStock: 10, incoming: 0,   unit: 'hộp', lastUpdated: '07/03/2025' },
  { id: 'SP008', name: 'Abbott Grow 3',        category: 'Sữa trẻ em',  sku: 'ABB-GRW-3',   stock: 32,  minStock: 10, incoming: 0,   unit: 'hộp', lastUpdated: '06/03/2025' },
]

function StockBar({ stock, min }: { stock: number; min: number }) {
  const max = Math.max(min * 5, stock, 1)
  const pct = (stock / max) * 100
  const color = stock === 0 ? 'var(--red)' : stock <= min ? 'var(--gold)' : 'var(--teal)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: 'var(--border)', borderRadius: 4 }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: color, transition: 'width .3s' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 28 }}>{stock}</span>
    </div>
  )
}

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')

  const lowStock = ITEMS.filter((i) => i.stock > 0 && i.stock <= i.minStock).length
  const outStock  = ITEMS.filter((i) => i.stock === 0).length

  const filtered = ITEMS.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'low' && item.stock > 0 && item.stock <= item.minStock) ||
      (filter === 'out' && item.stock === 0)
    return matchSearch && matchFilter
  })

  return (
    <div>
      {/* Summary */}
      <div className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Tổng sản phẩm',  value: ITEMS.length, color: 'blue' },
          { label: 'Sắp hết hàng',   value: lowStock,      color: 'gold' },
          { label: 'Hết hàng',       value: outStock,       color: 'red'  },
          { label: 'Hàng sắp về',    value: ITEMS.filter(i => i.incoming > 0).length, color: 'green' },
        ].map((s) => (
          <div
            key={s.label}
            className="card flex flex-col gap-1.5 text-center"
          >
            <div
              className={[
                'text-2xl font-bold tracking-[-0.5px]',
                s.color === 'red'
                  ? 'text-[var(--red)]'
                  : s.color === 'gold'
                    ? 'text-[var(--gold)]'
                    : s.color === 'green'
                      ? 'text-[var(--teal)]'
                      : 'text-[var(--accent)]',
              ].join(' ')}
            >
              {s.value}
            </div>
            <div className="text-[12px] text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          className="input"
          style={{ maxWidth: 280 }}
          placeholder="Tìm tên sản phẩm, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="tab-row" style={{ marginBottom: 0 }}>
          {(['all', 'low', 'out'] as const).map((f) => (
            <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Tất cả' : f === 'low' ? `Sắp hết (${lowStock})` : `Hết hàng (${outStock})`}
            </button>
          ))}
        </div>
        <button className="btn btn-primary ml-auto">
          <IconPlus size={14} /> Nhập hàng
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Tồn kho</th>
                <th>Mức tối thiểu</th>
                <th>Hàng sắp về</th>
                <th>Cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--muted)' }}>{item.sku}</td>
                  <td style={{ fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {item.stock === 0 && <IconWarning size={13} color="var(--red)" />}
                      {item.stock > 0 && item.stock <= item.minStock && <IconWarning size={13} color="var(--gold)" />}
                      {item.name}
                    </div>
                  </td>
                  <td><span className="status-badge member">{item.category}</span></td>
                  <td style={{ minWidth: 140 }}><StockBar stock={item.stock} min={item.minStock} /></td>
                  <td style={{ color: 'var(--muted)' }}>{item.minStock} {item.unit}</td>
                  <td>
                    {item.incoming > 0 ? (
                      <span style={{ color: 'var(--teal)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <IconArrowUp size={12} color="var(--teal)" /> +{item.incoming}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--muted)' }}>—</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{item.lastUpdated}</td>
                  <td>
                    <span className="cursor-pointer text-[12px] text-[var(--accent)] hover:underline">
                      Nhập kho
                    </span>
                    {' · '}
                    <span className="cursor-pointer text-[12px] text-[var(--accent)] hover:underline">
                      Sửa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
