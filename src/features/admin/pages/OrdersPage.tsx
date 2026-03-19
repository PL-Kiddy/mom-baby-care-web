import { useState, useEffect } from 'react'
import { IconDownload, IconPlus, IconRefresh } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getAllOrdersApi, createOrderApi, getProductsApi, updateOrderStatusApi } from '../services/adminService'
import Modal from '../../../shared/components/Modal'
import { exportToCSV } from '../../../shared/utils/exportUtils'

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
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [productList, setProductList] = useState<any[]>([])

  // Form state
  const [formData, setFormData] = useState({
    items: [{ product_id: '', quantity: 1 }],
    payment_method: 'COD',
    address: 'Mua tại quầy',
    total_amount: '',
    voucher_code: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const [orderData, productData] = await Promise.all([
        getAllOrdersApi(token),
        getProductsApi(token)
      ])
      setOrders(orderData || [])
      setProductList(productData || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [token])

  useEffect(() => {
    let total = 0
    formData.items.forEach(item => {
      const product = productList.find(p => p._id === item.product_id)
      if (product && product.price) {
        total += product.price * item.quantity
      }
    })
    setFormData(prev => ({ ...prev, total_amount: String(total) }))
  }, [formData.items, productList])

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
      loadData()
      setFormData({
        items: [{ product_id: '', quantity: 1 }],
        payment_method: 'COD',
        address: 'Mua tại quầy',
        total_amount: '',
        voucher_code: '',
      })
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo đơn hàng')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    if (!token || !selectedOrder) return
    try {
      await updateOrderStatusApi(token, selectedOrder._id, status)
      alert('Cập nhật trạng thái thành công!')
      setSelectedOrder(null)
      loadData()
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật trạng thái')
    }
  }

  const handleExport = () => {
    const headers = [
      { key: '_id', label: 'Mã đơn hàng' },
      { key: 'customerName', label: 'Tên khách hàng' },
      { key: 'customerEmail', label: 'Email' },
      { key: 'total_amount', label: 'Tổng tiền' },
      { key: 'payment_method', label: 'Thanh toán' },
      { key: 'status', label: 'Trạng thái' },
      { key: 'created_at', label: 'Ngày đặt' },
    ]

    const exportData = filtered.map(o => ({
      ...o,
      customerName: o.user?.name || 'Khách vãng lai',
      customerEmail: o.user?.email || 'N/A',
      status: STATUS_LABEL[o.status?.toLowerCase()] || o.status
    }))

    exportToCSV(exportData, headers, 'Danh_sach_don_hang')
  }

  const filtered = orders.filter((o) => {
    const status = o.status?.toLowerCase() || ''
    const matchTab = tab === 0 || STATUS_LABEL[status] === TABS[tab]
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
        <button className="btn btn-secondary" onClick={loadData} disabled={loading}>
          <IconRefresh size={14} className={loading ? 'animate-spin' : ''} />
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={handleExport} disabled={loading || filtered.length === 0}>
            <IconDownload size={14} /> Xuất Excel
          </button>
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
                      <span className={`status-badge ${o.status?.toLowerCase()}`}>
                        {STATUS_LABEL[o.status?.toLowerCase()] || o.status}
                      </span>
                    </td>
                    <td className="text-[13px] text-text-muted">
                      {new Date(o.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <button 
                        className="text-xs text-primary hover:underline font-bold"
                        onClick={() => setSelectedOrder(o)}
                      >
                        Xem chi tiết
                      </button>
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
              <div key={index} className="flex items-center gap-2">
                <select 
                  required className="input" 
                  style={{ flex: 1, minWidth: '150px' }}
                  value={item.product_id}
                  onChange={e => {
                    const newItems = [...formData.items]
                    newItems[index].product_id = e.target.value
                    setFormData({...formData, items: newItems})
                  }}
                >
                  <option value="">Chọn sản phẩm...</option>
                  {productList.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} - {p.price?.toLocaleString()} ₫
                    </option>
                  ))}
                </select>
                <div style={{ width: '80px' }}>
                  <input 
                    required type="number" className="input w-full text-center" 
                    min="1"
                    title="Số lượng"
                    value={item.quantity}
                    onChange={e => {
                      const newItems = [...formData.items]
                      newItems[index].quantity = Number(e.target.value)
                      setFormData({...formData, items: newItems})
                    }}
                  />
                </div>
                {index > 0 && (
                  <button 
                    type="button" 
                    className="size-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    onClick={() => {
                      const newItems = formData.items.filter((_, i) => i !== index)
                      setFormData({...formData, items: newItems})
                    }}
                  >✕</button>
                )}
              </div>
            ))}
            <button 
              type="button" className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
              onClick={() => setFormData({...formData, items: [...formData.items, { product_id: '', quantity: 1 }]})}
            >
              <IconPlus size={12} /> Thêm sản phẩm khác
            </button>
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
            <div className="col-span-2">
              <label className="label">Địa chỉ nhận hàng / Ghi chú</label>
              <input 
                required className="input w-full" 
                placeholder="VD: Mua tại quầy hoặc địa chỉ giao hàng" 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Tổng số tiền (₫)</label>
              <input 
                required type="number" className="input w-full bg-gray-50 font-bold text-primary" 
                placeholder="Tự động tính toán..." 
                value={formData.total_amount}
                readOnly
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

      <Modal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        title="Chi Tiết Đơn Hàng"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-pink-50 pb-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Mã đơn hàng</p>
                <p className="text-lg font-bold text-primary">#{selectedOrder._id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Ngày đặt</p>
                <p className="font-bold text-text-main">{new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-2">Thông tin khách hàng</p>
                <p className="font-bold text-text-main">{selectedOrder.user?.name || 'Khách vãng lai'}</p>
                <p className="text-sm text-text-muted">{selectedOrder.user?.email || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-2">Thanh toán</p>
                <p className="font-bold text-text-main">{selectedOrder.payment_method}</p>
                <span className={`status-badge ${selectedOrder.status?.toLowerCase()} mt-1 inline-block`}>
                  {STATUS_LABEL[selectedOrder.status?.toLowerCase()] || selectedOrder.status}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-3">Sản phẩm đã đặt</p>
              <div className="space-y-2">
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white border border-pink-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-primary/5 rounded flex items-center justify-center text-primary font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-main">{item.product_id}</p>
                        <p className="text-xs text-text-muted">ID Sản phẩm: {item.product_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-main">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-pink-50 flex justify-between items-center">
              <div className="text-lg font-bold text-text-main">Tổng tiền:</div>
              <div className="text-2xl font-black text-primary">
                {selectedOrder.total_amount?.toLocaleString()} ₫
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              {selectedOrder.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-primary flex-1 font-bold"
                    onClick={() => handleUpdateStatus('processing')}
                  >
                    Duyệt đơn
                  </button>
                  <button 
                    className="btn btn-secondary flex-1 font-bold text-red-600"
                    onClick={() => {
                      if(window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                        handleUpdateStatus('cancelled')
                      }
                    }}
                  >
                    Hủy đơn
                  </button>
                </>
              )}
              {selectedOrder.status === 'processing' && (
                <button 
                  className="btn btn-primary flex-1 font-bold"
                  onClick={() => handleUpdateStatus('completed')}
                >
                  Đã giao thành công
                </button>
              )}
               <button 
                className="btn btn-secondary w-full font-bold ml-auto max-w-[120px]"
                onClick={() => setSelectedOrder(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

