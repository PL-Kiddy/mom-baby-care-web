import { useState, useEffect } from 'react'
import { IconPlus, IconRefresh } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { createVoucherApi, deleteVoucherApi } from '../services/adminService'
import Modal from '../../../shared/components/Modal'
import { exportToCSV } from '../../../shared/utils/exportUtils'
import { IconDownload } from '../../../shared/components/Icons'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export default function VouchersPage() {
  const { token } = useAuth()
  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_value: '',
    start_date: '',
    end_date: '',
    usage_limit: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const loadVouchers = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/vouchers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const json = await res.json()
      setVouchers(json.result || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadVouchers() }, [token])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSubmitting(true)
    try {
      await createVoucherApi(token, {
        ...formData,
        discount_value: Number(formData.discount_value),
        min_order_value: Number(formData.min_order_value) || 0,
        usage_limit: Number(formData.usage_limit),
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      })
      alert('Tạo voucher thành công!')
      setIsModalOpen(false)
      loadVouchers()
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_value: '',
        start_date: '',
        end_date: '',
        usage_limit: '',
      })
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo voucher')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!window.confirm('Bạn có chắc chắn muốn xóa voucher này không?')) return
    
    // Lưu ý: BE hiện tại chưa hỗ trợ endpoint DELETE /api/vouchers/:id
    alert('Tính năng xóa voucher đang chờ Backend hỗ trợ. Vui lòng liên hệ bộ phận BE để cấp quyền này.')
    
    /* 
    try {
      await deleteVoucherApi(token, id)
      alert('Xóa voucher thành công!')
      loadVouchers()
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa voucher')
    }
    */
  }

  const filtered = vouchers.filter((v) =>
    v.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = () => {
    const headers = [
      { key: 'code', label: 'Mã voucher' },
      { key: 'discount_type', label: 'Loại' },
      { key: 'discount_value', label: 'Giá trị' },
      { key: 'min_order_value', label: 'Đơn tối thiểu' },
      { key: 'usage_limit', label: 'Giới hạn' },
      { key: 'end_date', label: 'Hết hạn' },
    ]
    exportToCSV(filtered, headers, 'Danh_sach_voucher')
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          className="input"
          style={{ maxWidth: 280 }}
          placeholder="Tìm mã voucher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={loadVouchers} disabled={loading}>
          <IconRefresh size={14} className={loading ? 'animate-spin' : ''} />
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={handleExport} disabled={loading || filtered.length === 0}>
            <IconDownload size={14} /> Xuất Excel
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <IconPlus size={14} /> Tạo voucher
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="p-10 text-center text-text-muted animate-pulse">Đang tải danh sách...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã voucher</th>
                  <th>Loại</th>
                  <th>Giá trị</th>
                  <th>Đơn tối thiểu</th>
                  <th>Dùng / Giới hạn</th>
                  <th>Hết hạn</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v._id}>
                    <td className="font-bold text-primary tracking-wider">{v.code}</td>
                    <td>
                      <span className={`status-badge ${v.discount_type === 'percentage' ? 'guest' : 'processing'}`}>
                        {v.discount_type === 'percentage' ? 'Phần trăm' : 'Số tiền'}
                      </span>
                    </td>
                    <td className="font-semibold text-text-main">
                      {v.discount_type === 'percentage' ? `${v.discount_value}%` : `${v.discount_value.toLocaleString()} ₫`}
                    </td>
                    <td className="text-text-muted">{v.min_order_value?.toLocaleString()} ₫</td>
                    <td>
                      <span className="text-sm font-medium">{v.usage_count || 0} / {v.usage_limit}</span>
                    </td>
                    <td className="text-text-muted text-[13px]">
                      {new Date(v.end_date).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <span className={`status-badge ${new Date(v.end_date) > new Date() ? 'completed' : 'cancelled'}`}>
                        {new Date(v.end_date) > new Date() ? 'Còn hạn' : 'Hết hạn'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="text-xs text-primary hover:underline font-bold"
                        onClick={() => handleDelete(v._id)}
                      >Xóa</button>
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
        title="Tạo Voucher Mới"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Mã Voucher</label>
              <input 
                required className="input w-full" 
                placeholder="VD: MILKCARE20" 
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
              />
            </div>
            <div>
              <label className="label">Loại giảm giá</label>
              <select 
                className="input w-full"
                value={formData.discount_type}
                onChange={e => setFormData({...formData, discount_type: e.target.value})}
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="amount">Số tiền (₫)</option>
              </select>
            </div>
            <div>
              <label className="label">Giá trị giảm</label>
              <input 
                required type="number" className="input w-full" 
                placeholder={formData.discount_type === 'percentage' ? 'VD: 20' : 'VD: 50000'} 
                value={formData.discount_value}
                onChange={e => setFormData({...formData, discount_value: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="label">Giá trị đơn hàng tối thiểu (₫)</label>
              <input 
                type="number" className="input w-full" 
                placeholder="VD: 200000" 
                value={formData.min_order_value}
                onChange={e => setFormData({...formData, min_order_value: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Ngày bắt đầu</label>
              <input 
                required type="date" className="input w-full" 
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Ngày kết thúc</label>
              <input 
                required type="date" className="input w-full" 
                value={formData.end_date}
                onChange={e => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="label">Số lượt sử dụng tối đa</label>
              <input 
                required type="number" className="input w-full" 
                placeholder="VD: 100" 
                value={formData.usage_limit}
                onChange={e => setFormData({...formData, usage_limit: e.target.value})}
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
              {submitting ? 'Đang tạo...' : 'Tạo Voucher'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

