import { useEffect, useState } from 'react'
import { IconWarning, IconPlus, IconArrowUp, IconSearch, IconRefresh } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getProductsApi } from '../../admin/services/adminService'
import type { Product } from '../../../shared/types'

function StockBar({ stock, min = 10 }: { stock: number; min?: number }) {
  const max = Math.max(min * 5, stock, 1)
  const pct = Math.min((stock / max) * 100, 100)
  const color = stock === 0 ? 'var(--red)' : stock <= min ? 'var(--gold)' : 'var(--accent)'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[var(--surface2)] rounded-full overflow-hidden">
        <div style={{ width: `${pct}%`, background: color }} className="h-full transition-all duration-500" />
      </div>
      <span style={{ color }} className="text-[11px] font-bold min-w-[20px]">{stock}</span>
    </div>
  )
}

export default function InventoryPage() {
  const { token } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getProductsApi(token)
      setProducts(data || [])
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [token])

  const lowStockThreshold = 10
  const lowStock = products.filter((i) => i.stock > 0 && i.stock <= lowStockThreshold).length
  const outStock  = products.filter((i) => i.stock === 0).length

  const filtered = products.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'low' && item.stock > 0 && item.stock <= lowStockThreshold) ||
      (filter === 'out' && item.stock === 0)
    return matchSearch && matchFilter
  })

  return (
    <div>
      <div className="mb-5 grid gap-4 md:grid-cols-4">
        {[
          { label: 'Tổng sản phẩm',  value: products.length, color: 'blue' },
          { label: 'Sắp hết hàng',   value: lowStock,      color: 'gold' },
          { label: 'Hết hàng',       value: outStock,       color: 'red'  },
          { label: 'Đang kinh doanh', value: products.filter(p => p.stock > 0).length, color: 'green' },
        ].map((s) => (
          <div key={s.label} className="card p-5 flex flex-col items-center">
            <div className={`text-2xl font-bold ${
              s.color === 'red' ? 'text-[var(--red)]' : 
              s.color === 'gold' ? 'text-[var(--gold)]' : 
              s.color === 'green' ? 'text-[var(--accent)]' : 'text-[var(--accent)]'
            }`}>
              {s.value}
            </div>
            <div className="text-[12px] text-[var(--muted)] uppercase tracking-wider font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="search-wrapper flex-1" style={{ position: 'relative' }}>
            <IconSearch 
              className="search-icon" 
              size={16} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--muted)',
                pointerEvents: 'none'
              }} 
            />
            <input
              className="input h-10 pl-10"
              style={{ paddingLeft: '40px' }}
              placeholder="Tìm tên sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="tab-row h-10 !mb-0 px-1">
            {(['all', 'low', 'out'] as const).map((f) => (
              <button key={f} className={`tab !py-1 !px-4 ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'Tất cả' : f === 'low' ? `Sắp hết` : `Hết hàng`}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary h-10 w-10 !p-0" onClick={loadProducts} title="Làm mới">
            <IconRefresh size={18} />
          </button>
        </div>
        <button className="btn btn-primary h-10 px-6">
          <IconPlus size={16} /> Nhập hàng
        </button>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th>Đã bán</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-[var(--muted)] animate-pulse">
                    Đang tải dữ liệu kho hàng...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-[var(--muted)]">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[var(--surface2)] overflow-hidden flex-shrink-0 border border-[var(--border)]">
                          {item.image ? (
                            <img src={item.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[var(--muted)]">📦</div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-text-main line-clamp-1">{item.name}</div>
                          <div className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                            {item.stock === 0 && <span className="text-[var(--red)] font-bold">HẾT HÀNG</span>}
                            {item.stock > 0 && item.stock <= lowStockThreshold && <span className="text-[var(--gold)] font-bold">SẮP HẾT</span>}
                            ID: {item._id?.substring(item._id.length - 6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-[var(--accent)]">
                      {item.price?.toLocaleString()} ₫
                    </td>
                    <td className="w-[180px]">
                      <StockBar stock={item.stock} min={lowStockThreshold} />
                    </td>
                    <td className="text-[var(--muted)] font-medium">
                      {item.sold || 0}
                    </td>
                    <td>
                      <span className={`status-badge ${item.stock > 0 ? 'completed' : 'cancelled'}`}>
                        {item.stock > 0 ? 'Kinh doanh' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="text-[12px] text-[var(--muted)]">
                      {item.updated_at ? new Date(item.updated_at).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-[12px] font-bold text-[var(--accent)] hover:opacity-80">Nhập kho</button>
                        <span className="text-[12px] text-[var(--border)]">|</span>
                        <button className="text-[12px] font-bold text-[var(--accent)] hover:opacity-80">Sửa</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
