import { useState, useEffect } from 'react'
import { IconTruck, IconRefresh, IconEye, IconSearch, IconClock, IconPhone, IconUser, IconMapPin } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getStaffOrdersApi } from '../services/staffService'

const STATUS_LABEL: Record<string, string> = {
  'confirmed': 'Đã xác nhận',
  'processing': 'Đang xử lý',
  'shipping': 'Đang giao hàng',
  'shipped': 'Đã giao hàng',
  'delivered': 'Đã hoàn thành',
  'cancelled': 'Đã hủy',
  'returned': 'Hoàn hàng',
}

const STATUS_STEPS = ['confirmed', 'processing', 'shipping', 'delivered']

export default function TrackingPage() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any | null>(null)

  const loadOrders = async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getStaffOrdersApi(token)
      setOrders(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [token])

  const filtered = orders.filter((o) => {
    const matchTab =
      tab === 0 ||
      (tab === 1 && o.status === 'processing') ||
      (tab === 2 && o.status === 'shipping') ||
      (tab === 3 && (o.status === 'shipped' || o.status === 'delivered')) ||
      (tab === 4 && o.status === 'returned')
    const matchSearch =
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.tracking_number?.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const TABS = ['Tất cả', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Hoàn hàng'] as const

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr),400px]">
      <div className="min-w-0">
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
                placeholder="Tìm mã đơn, tên khách hàng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-secondary h-10 w-10 !p-0" onClick={loadOrders} title="Làm mới">
              <IconRefresh size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="card !p-0 overflow-hidden">
          <div className="tab-row h-12 !mb-0 px-4 border-b border-[var(--border)]">
            {TABS.map((t, i) => (
              <button key={t} className={`tab !py-2 ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>
          <div className="table-wrap">
            {loading ? (
              <div className="p-20 text-center text-[var(--muted)] animate-pulse flex flex-col items-center gap-3">
                <IconRefresh size={24} className="animate-spin" />
                Đang tải dữ liệu vận chuyển...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-20 text-center text-[var(--muted)]">Không tìm thấy vận đơn nào</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Vận đơn</th>
                    <th>Trạng thái</th>
                    <th>Cập nhật</th>
                    <th className="text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr
                      key={o._id}
                      className={selected?._id === o._id ? 'bg-[rgba(255,143,163,0.05)]' : 'cursor-pointer hover:bg-[var(--surface2)]'}
                      onClick={() => setSelected(o)}
                    >
                      <td><span className="font-bold text-[var(--accent)] text-[13px]">{o._id.slice(-8).toUpperCase()}</span></td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-main">{o.customer_name}</span>
                          <span className="text-[11px] text-[var(--muted)]">{o.phone}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-mono text-[12px] text-[var(--accent)] font-bold">{o.tracking_number || 'Chưa có'}</span>
                          <span className="text-[11px] text-[var(--muted)]">{o.shipping_method || 'Nhanh'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${
                          o.status === 'shipping' ? 'pending' : 
                          (o.status === 'shipped' || o.status === 'delivered') ? 'completed' : 
                          o.status === 'cancelled' ? 'cancelled' : 'member'
                        }`}>
                          {STATUS_LABEL[o.status] || o.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
                          <IconClock size={12} /> {new Date(o.updated_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="text-right">
                        <button className="btn-icon p-2 hover:bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--accent)]">
                          <IconEye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {selected ? (
          <div className="card h-fit sticky top-4">
             <div className="flex items-center justify-between mb-5">
               <h3 className="text-[16px] font-bold text-text-main flex items-center gap-2">
                 <IconTruck size={20} className="text-[var(--accent)]" /> Chi tiết vận chuyển
               </h3>
               <button onClick={() => setSelected(null)} className="text-[var(--muted)] hover:text-[var(--red)]">✕</button>
             </div>

             <div className="mb-6 p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[14px] font-bold text-[var(--accent)] mb-1">Đơn hàng {selected._id.slice(-8).toUpperCase()}</div>
                    <div className="text-[12px] text-[var(--muted)] flex items-center gap-2">
                      <IconUser size={12} /> {selected.customer_name}
                    </div>
                  </div>
                  <span className={`status-badge ${selected.status === 'shipping' ? 'pending' : (selected.status === 'shipped' || selected.status === 'delivered') ? 'completed' : 'member'}`}>
                    {STATUS_LABEL[selected.status]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[var(--muted)]">
                   <IconPhone size={12} /> {selected.phone}
                </div>
             </div>

             <div className="space-y-6 mb-8 relative px-2">
                <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-[var(--border)]" />
                {STATUS_STEPS.map((step, i) => {
                  const currentIdx = STATUS_STEPS.indexOf(selected.status === 'shipped' ? 'delivered' : selected.status)
                  const isDone = i <= currentIdx
                  const isCurrent = i === currentIdx
                  return (
                    <div key={step} className="flex gap-4 relative z-10">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                        isDone ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'bg-[var(--surface2)] border-[var(--border)] text-[var(--muted)]'
                      }`}>
                        {isDone ? '✓' : i + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[13px] font-bold ${isDone ? 'text-text-main' : 'text-[var(--muted)]'}`}>
                          {STATUS_LABEL[step]}
                        </span>
                        {isCurrent && (
                          <span className="text-[11px] text-[var(--accent)] font-medium">Đã cập nhật lúc {new Date(selected.updated_at).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
             </div>

             <div className="space-y-3">
               <div className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--surface2)]">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--muted)]">Địa chỉ nhận hàng</span>
                  <div className="flex gap-2 text-[12px] text-text-main">
                    <IconMapPin size={14} className="mt-0.5 text-[var(--accent)] shrink-0" />
                    <span>{selected.address}</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--surface2)]">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--muted)]">Vận đơn</span>
                    <span className="text-[12px] font-mono font-bold text-[var(--accent)]">{selected.tracking_number || 'N/A'}</span>
                 </div>
                 <div className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--surface2)]">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--muted)]">Hình thức</span>
                    <span className="text-[12px] font-bold text-text-main">{selected.shipping_method || 'Giao tiết kiệm'}</span>
                 </div>
               </div>
             </div>
          </div>
        ) : (
          <div className="card h-[400px] flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-16 h-16 rounded-full bg-[var(--surface2)] flex items-center justify-center mb-4">
              <IconTruck size={32} className="text-[var(--muted)]" />
            </div>
            <p className="text-[13px] text-[var(--muted)] max-w-[200px]">Chọn một vận đơn trong danh sách để xem chi tiết</p>
          </div>
        )}
      </div>
    </div>
  )
}
