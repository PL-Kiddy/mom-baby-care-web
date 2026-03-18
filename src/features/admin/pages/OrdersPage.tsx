import { useState, useEffect } from 'react'
import { IconDownload, IconPlus, IconRefresh } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getAllOrdersApi, createOrderApi } from '../services/adminService'
import Modal from '../../../shared/components/Modal'

const STATUS_LABEL: Record<string, string> = {
  pending:    'Chờ xác nhận',
  processing: 'Đang giao',
  completed:  'Hoàn thành',
  cancelled:  'Đã hủy',
}

const TABS = ['Tất cả', 'Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'] as const

export default function OrdersPage() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    items: [{ product_id: '', quantity: 1 }],
    payment_method: 'COD',
    total_amount: '',
    voucher_code: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const loadOrders = async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getAllOrdersApi(token)
      setOrders(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [token])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSubmitting(true)
    try {
      await createOrderApi(token, {
        ...formData,
        total_amount: Number(formData.total_amount),
        items: formData.items.filter(it => it.product_id),
      })
      setIsModalOpen(false)
      loadOrders()
      setFormData({
        items: [{ product_id: '', quantity: 1 }],
        payment_method: 'COD',
        total_amount: '',
        voucher_code: '',
      })
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo đơn hàng')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = orders.filter((o) => {
    const matchTab = tab === 0 || STATUS_LABEL[o.status] === TABS[tab]
    const matchSearch =
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          className="input"
          style={{ maxWidth: 300 }}
          placeholder="Tìm theo mã đơn, khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={loadOrders} disabled={loading}>
          <IconRefresh size={14} className={loading ? 'animate-spin' : ''} />
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <IconPlus size={14} /> Tạo đơn
          </button>
        </div>
      </div>

      <div className="card">
        <div className="tab-row">
          {TABS.map((t, i) => (
            <button key={t} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="p-10 text-center text-text-muted animate-pulse">Đang tải danh sách...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm (SL)</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id}>
                    <td className="font-semibold text-primary">...{o._id.substring(o._id.length - 6)}</td>
                    <td>
                      <div className="font-medium text-text-main">{o.user?.name || 'Khách vãng lai'}</div>
                      <div className="text-[11px] text-text-muted">{o.user?.email}</div>
                    </td>
                    <td>
                      <div className="max-w-[200px] truncate" title={o.items?.map((it:any) => `${it.product_id} x${it.quantity}`).join(', ')}>
                        {o.items?.length} sản phẩm
                      </div>
                    </td>
                    <td>
                      <span className="text-[13px] text-text-muted">{o.payment_method}</span>
                    </td>
                    <td className="font-bold text-teal-600">
                      {o.total_amount?.toLocaleString()} ₫
                    </td>
                    <td>
                      <span className={`status-badge ${o.status}`}>
                        {STATUS_LABEL[o.status] || o.status}
                      </span>
                    </td>
                    <td className="text-[13px] text-text-muted">
                      {new Date(o.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <button className="text-xs text-primary hover:underline">Xem</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Tạo Đơn Hàng Thủ Công"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-3">
            <label className="label">Danh sách sản phẩm</label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input 
                  required className="input flex-1" 
                  placeholder="ID Sản phẩm" 
                  value={item.product_id}
                  onChange={e => {
                    const newItems = [...formData.items]
                    newItems[index].product_id = e.target.value
                    setFormData({...formData, items: newItems})
                  }}
                />
                <input 
                  required type="number" className="input w-20" 
                  min="1"
                  value={item.quantity}
                  onChange={e => {
                    const newItems = [...formData.items]
                    newItems[index].quantity = Number(e.target.value)
                    setFormData({...formData, items: newItems})
                  }}
                />
                {index > 0 && (
                  <button 
                    type="button" className="text-red-500 px-2"
                    onClick={() => {
                      const newItems = formData.items.filter((_, i) => i !== index)
                      setFormData({...formData, items: newItems})
                    }}
                  >✕</button>
                )}
              </div>
            ))}
            <button 
              type="button" className="text-xs text-primary font-medium hover:underline"
              onClick={() => setFormData({...formData, items: [...formData.items, { product_id: '', quantity: 1 }]})}
            >+ Thêm sản phẩm</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Phương thức thanh toán</label>
              <select 
                className="input w-full"
                value={formData.payment_method}
                onChange={e => setFormData({...formData, payment_method: e.target.value})}
              >
                <option value="COD">COD</option>
                <option value="Banking">Chuyển khoản</option>
                <option value="Momo">Ví MoMo</option>
              </select>
            </div>
            <div>
              <label className="label">Tổng số tiền (₫)</label>
              <input 
                required type="number" className="input w-full" 
                placeholder="VD: 500000" 
                value={formData.total_amount}
                onChange={e => setFormData({...formData, total_amount: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Mã Voucher (Nếu có)</label>
              <input 
                className="input w-full uppercase" 
                placeholder="VD: GIAM50K" 
                value={formData.voucher_code}
                onChange={e => setFormData({...formData, voucher_code: e.target.value.toUpperCase()})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" className="btn btn-secondary flex-1" 
              onClick={() => setIsModalOpen(false)}
            >Hủy</button>
            <button 
              type="submit" className="btn btn-primary flex-1" 
              disabled={submitting}
            >
              {submitting ? 'Đang tạo...' : 'Tạo Đơn Hàng'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

