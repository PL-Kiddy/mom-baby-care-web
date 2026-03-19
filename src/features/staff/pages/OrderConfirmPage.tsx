import { useEffect, useState } from 'react'
import { IconCheckCircle, IconEye, IconWarning, IconSearch, IconRefresh, IconUser, IconPhone, IconClock, IconTag, IconCreditCard } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getStaffOrdersApi, updateOrderStatusApi } from '../services/staffService'
import type { Order, OrderStatus } from '../../../shared/types'

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    'Chờ xác nhận',
  processing: 'Đang xử lý',
  completed:  'Hoàn thành',
  cancelled:  'Đã hủy',
}

const TABS = ['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Hoàn thành', 'Đã hủy'] as const

export default function OrderConfirmPage() {
  const { token } = useAuth()
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [rawOrders, setRawOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadOrders = async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getStaffOrdersApi(token)
      setRawOrders(data)
      const mapped: Order[] = data.map((item: any) => ({
        id: `#${item._id.substring(item._id.length - 6).toUpperCase()}`,
        _realId: item._id, // Lưu lại ID thực để dùng cho API update
        customer: item.user?.name || 'Khách vãng lai',
        phone: item.user?.phone_number || '-',
        product: item.items?.[0]?.product?.name || 'Nhiều sản phẩm',
        payment: item.payment_method || 'Chưa rõ',
        total: `${(item.final_amount || item.total_amount)?.toLocaleString()} ₫`,
        status: (item.status?.toLowerCase() === 'delivering' ? 'processing' : item.status?.toLowerCase()) as OrderStatus,
        time: item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : 'Chưa rõ',
      }))
      setOrders(mapped)
    } catch (err) {
      console.error('Failed to load staff orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [token])

  const openDetails = (realId: string) => {
    console.log('Opening details for:', realId)
    const raw = rawOrders.find(o => o._id === realId)
    console.log('Found raw order:', raw)
    if (raw) {
      setSelectedOrder(raw)
      setIsModalOpen(true)
    } else {
      console.warn('Could not find raw order for ID:', realId)
    }
  }

  const pendingCount = orders.filter((o) => o.status === 'pending').length

  const confirmOrder = async (id: string, realId: string) => {
    if (!token) return
    if (!window.confirm('Bạn có chắc chắn muốn xác nhận đơn hàng này không?')) return
    try {
      await updateOrderStatusApi(token, realId, 'Delivering')
      alert('Xác nhận đơn hàng thành công!')
      loadOrders() // Tải lại danh sách sau khi update
    } catch (err) {
      alert('Không thể xác nhận đơn hàng')
    }
  }

  const cancelOrder = async (id: string, realId: string) => {
    if (!token) return
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return
    try {
      await updateOrderStatusApi(token, realId, 'Cancelled')
      alert('Đã hủy đơn hàng!')
      loadOrders()
    } catch (err) {
      alert('Không thể hủy đơn hàng')
    }
  }


  const filtered = orders.filter((o) => {
    const matchTab = tab === 0 || STATUS_LABEL[o.status] === TABS[tab]
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div>
      {/* Summary row */}
      <div className="mb-5 grid gap-4 md:grid-cols-4">
        {[
          { label: 'Chờ xác nhận', value: pendingCount,                                       color: 'gold' },
          { label: 'Đang xử lý',   value: orders.filter(o => o.status === 'processing').length, color: 'blue' },
          { label: 'Hoàn thành',   value: orders.filter(o => o.status === 'completed').length,  color: 'green' },
          { label: 'Đã hủy',       value: orders.filter(o => o.status === 'cancelled').length,  color: 'red' },
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

      {/* Toolbar */}
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
              placeholder="Tìm mã đơn, khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary h-10 w-10 !p-0" onClick={loadOrders} title="Làm mới">
            <IconRefresh size={18} />
          </button>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-[rgba(234,179,8,0.1)] px-4 py-2 border border-[rgba(234,179,8,0.2)]">
            <IconWarning size={14} color="var(--gold)" />
            <span className="text-[13px] text-[var(--gold)] font-medium">
              Có <strong className="font-bold">{pendingCount}</strong> đơn đang chờ bạn xác nhận
            </span>
          </div>
        )}
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
              Đang cập nhật danh sách đơn hàng...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-20 text-center text-[var(--muted)]">Không có đơn hàng nào trong mục này</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Thông tin đơn</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o: any) => (
                  <tr key={o._realId}>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--accent)] text-[13px]">{o.id}</span>
                        <span className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                          <IconClock size={10} /> {o.time}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <div className="font-semibold text-text-main flex items-center gap-1.5 text-[13px]">
                          <IconUser size={12} className="text-[var(--muted)]" /> {o.customer}
                        </div>
                        <div className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                          <IconPhone size={10} /> {o.phone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col max-w-[200px]">
                        <span className="text-[13px] font-medium text-text-main line-clamp-1">{o.product}</span>
                        <span className={`status-badge !w-fit mt-1 ${o.status}`}>{STATUS_LABEL[o.status as OrderStatus]}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-[var(--muted)] text-[12px]">
                        <IconCreditCard size={12} /> {o.payment}
                      </div>
                    </td>
                    <td>
                      <span className="font-bold text-[var(--accent)] text-[14px]">{o.total}</span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn-icon p-2 hover:bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--accent)]"
                          title="Xem chi tiết"
                          onClick={() => openDetails(o._realId)}
                        >
                          <IconEye size={16} />
                        </button>
                        {o.status === 'pending' && (
                          <>
                            <button
                              className="btn-icon p-2 bg-[rgba(255,143,163,0.1)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                              title="Xác nhận đơn"
                              onClick={() => confirmOrder(o.id, o._realId)}
                            >
                              <IconCheckCircle size={16} />
                            </button>
                            <button
                              className="btn-icon p-2 bg-[rgba(248,113,113,0.1)] text-[var(--red)] hover:bg-[var(--red)] hover:text-white"
                              title="Hủy đơn"
                              onClick={() => cancelOrder(o.id, o._realId)}
                            >
                              <IconWarning size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content !max-w-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xl font-bold text-text-main">Chi tiết đơn hàng</h3>
                <p className="text-sm text-[var(--muted)]">Mã đơn: <span className="text-[var(--accent)] font-mono font-bold uppercase">{selectedOrder._id.substring(selectedOrder._id.length-8)}</span></p>
              </div>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">Khách hàng</span>
                  <div className="flex items-center gap-2 font-medium text-text-main">
                    <IconUser size={14} className="text-[var(--accent)]" /> {selectedOrder.user?.name || 'Khách vãng lai'}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">Số điện thoại</span>
                  <div className="flex items-center gap-2 font-medium text-text-main">
                    <IconPhone size={14} className="text-[var(--accent)]" /> {selectedOrder.user?.phone_number || '-'}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">Thời gian đặt</span>
                  <div className="flex items-center gap-2 font-medium text-text-main">
                    <IconClock size={14} className="text-[var(--accent)]" /> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('vi-VN') : 'Chưa rõ'}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-bold mb-1">Phương thức</span>
                  <div className="flex items-center gap-2 font-medium text-text-main">
                    <IconCreditCard size={14} className="text-[var(--accent)]" /> {selectedOrder.payment_method || 'Thanh toán tại quầy'}
                  </div>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="mb-8">
              <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-bold mb-3 block">Sản phẩm đã chọn</span>
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[var(--surface2)] overflow-hidden">
                        <img 
                          src={item.product?.image || 'https://via.placeholder.com/150'} 
                          alt={item.product?.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-text-main text-[13px]">{item.product?.name}</div>
                        <div className="text-[11px] text-[var(--muted)]">Đơn giá: {(item.price_at_purchase || item.product?.price || 0).toLocaleString()} ₫</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] font-bold text-[var(--accent)]">x{item.quantity}</div>
                      <div className="text-[13px] font-bold text-text-main">{((item.price_at_purchase || item.product?.price || 0) * item.quantity).toLocaleString()} ₫</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-[var(--surface2)] rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--muted)]">Tạm tính</span>
                <span className="font-medium">{selectedOrder.total_amount?.toLocaleString()} ₫</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--muted)]">Giảm giá {selectedOrder.voucher_code ? `(${selectedOrder.voucher_code})` : ''}</span>
                <span className="text-[var(--red)] font-medium">-{selectedOrder.discount_amount?.toLocaleString() || 0} ₫</span>
              </div>
              <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center">
                <span className="font-bold text-text-main">Tổng thanh toán</span>
                <span className="text-xl font-black text-[var(--accent)]">{selectedOrder.final_amount?.toLocaleString()} ₫</span>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button className="btn btn-secondary px-8" onClick={() => setIsModalOpen(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

