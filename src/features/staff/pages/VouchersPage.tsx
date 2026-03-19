import { useState, useEffect } from 'react'
import { IconPlus, IconRefresh, IconSearch, IconTag, IconClock } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getVouchersApi, createVoucherApi, updateVoucherApi } from '../services/staffService'
import Modal from '../../../shared/components/Modal'
import type { Voucher } from '../../../shared/types'

const EMPTY_FORM = {
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  min_order_value: '',
  start_date: '',
  end_date: '',
  usage_limit: '',
}

export default function StaffVouchersPage() {
  const { token } = useAuth()
  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  const loadVouchers = async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getVouchersApi(token)
      setVouchers(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadVouchers() }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        discount_value: Number(formData.discount_value),
        min_order_value: Number(formData.min_order_value) || 0,
        usage_limit: Number(formData.usage_limit),
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      }

      if (editingId) {
        await updateVoucherApi(token, editingId, payload)
        alert('Cập nhật voucher thành công!')
      } else {
        await createVoucherApi(token, payload)
        alert('Tạo voucher thành công!')
      }
      
      setIsModalOpen(false)
      loadVouchers()
      resetForm()
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xử lý voucher')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM)
  }

  const handleEdit = (v: any) => {
    setEditingId(v._id)
    setFormData({
      code: v.code,
      discount_type: v.discount_type,
      discount_value: String(v.discount_value),
      min_order_value: String(v.min_order_value),
      start_date: v.start_date ? new Date(v.start_date).toISOString().split('T')[0] : '',
      end_date: v.end_date ? new Date(v.end_date).toISOString().split('T')[0] : '',
      usage_limit: String(v.usage_limit),
    })
    setIsModalOpen(true)
  }

  const filtered = vouchers.filter((v) =>
    v.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
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
              placeholder="Tìm mã voucher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary h-10 w-10 !p-0" onClick={loadVouchers} title="Làm mới">
            <IconRefresh size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <button className="btn btn-primary h-10 px-4" onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <IconPlus size={16} /> <span className="hidden sm:inline">Tạo voucher mới</span>
        </button>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="table-wrap">
          {loading ? (
            <div className="p-20 text-center text-[var(--muted)] animate-pulse flex flex-col items-center gap-3">
              <IconRefresh size={24} className="animate-spin" />
              Đang cập nhật danh sách voucher...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-20 text-center text-[var(--muted)]">Không tìm thấy voucher nào</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã voucher</th>
                  <th>Loại</th>
                  <th>Giá trị</th>
                  <th>Đơn tối thiểu</th>
                  <th>Tiến độ dùng</th>
                  <th>Hết hạn</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v: any) => (
                  <tr key={v._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <IconTag size={14} className="text-[var(--accent)]" />
                        <span className="font-bold text-[var(--accent)] tracking-wider text-[13px]">{v.code}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${v.discount_type === 'percentage' ? 'guest' : 'processing'}`}>
                        {v.discount_type === 'percentage' ? 'Phần trăm' : 'Số tiền'}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-[var(--gold)]">
                        {v.discount_type === 'percentage' ? `${v.discount_value}%` : `${v.discount_value.toLocaleString()} ₫`}
                      </span>
                    </td>
                    <td className="text-[var(--muted)]">{v.min_order_value?.toLocaleString()} ₫</td>
                    <td>
                      <div className="flex flex-col gap-1.5 w-[140px]">
                        <div className="flex justify-between text-[11px] font-medium text-[var(--muted)]">
                          <span>{v.usage_count || 0}/{v.usage_limit} lượt</span>
                          <span>{Math.round(((v.usage_count || 0) / (v.usage_limit || 1)) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--surface2)] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${((v.usage_count || 0) >= (v.usage_limit || 1)) ? 'bg-[var(--red)]' : 'bg-[var(--accent)]'}`}
                            style={{ width: `${Math.min(((v.usage_count || 0) / (v.usage_limit || 1)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-[var(--muted)] text-[12px]">
                        <IconClock size={12} /> {new Date(v.end_date).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${new Date(v.end_date) > new Date() ? 'completed' : 'cancelled'}`}>
                        {new Date(v.end_date) > new Date() ? 'Còn hạn' : 'Hết hạn'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button 
                        className="btn btn-secondary !p-1.5 !rounded-lg" 
                        title="Sửa voucher"
                        onClick={() => handleEdit(v)}
                      >
                        <span className="text-[12px] font-medium">Sửa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Cập Nhật Voucher' : 'Tạo Voucher Mới'}>
        <form onSubmit={handleSubmit} className="space-y-5 p-1">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="block text-[13px] font-bold text-text-main mb-1.5">Mã Voucher</label>
              <input 
                required className="input w-full h-11" 
                placeholder="VD: MILKCARE2025" 
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-1.5">Loại giảm giá</label>
              <select 
                className="input w-full h-11"
                value={formData.discount_type}
                onChange={e => setFormData({...formData, discount_type: e.target.value})}
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="amount">Số tiền (₫)</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-1.5">Giá trị giảm</label>
              <input 
                required type="number" className="input w-full h-11" 
                placeholder={formData.discount_type === 'percentage' ? 'VD: 20' : 'VD: 50000'} 
                value={formData.discount_value}
                onChange={e => setFormData({...formData, discount_value: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[13px] font-bold text-text-main mb-1.5">Đơn hàng tối thiểu (₫)</label>
              <input 
                type="number" className="input w-full h-11" 
                placeholder="VD: 200000" 
                value={formData.min_order_value}
                onChange={e => setFormData({...formData, min_order_value: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-1.5">Ngày bắt đầu</label>
              <input 
                required type="date" className="input w-full h-11" 
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-1.5">Ngày kết thúc</label>
              <input 
                required type="date" className="input w-full h-11" 
                value={formData.end_date}
                onChange={e => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[13px] font-bold text-text-main mb-1.5">Số lượt sử dụng tối đa</label>
              <input 
                required type="number" className="input w-full h-11" 
                placeholder="VD: 100" 
                value={formData.usage_limit}
                onChange={e => setFormData({...formData, usage_limit: e.target.value})}
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button 
              type="button" className="btn btn-secondary h-11 flex-1 font-bold" 
              onClick={() => setIsModalOpen(false)}
            >Bỏ qua</button>
            <button 
              type="submit" className="btn btn-primary h-11 flex-1 font-bold shadow-lg shadow-[rgba(var(--accent-rgb),0.2)]" 
              disabled={submitting}
            >
              {submitting ? 'Đang xử lý...' : editingId ? 'Cập Nhật' : 'Xác nhận tạo'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
