import { useState, useEffect } from 'react'
import { IconPlus, IconRefresh } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getAllUsersApi } from '../services/adminService'
import { registerApi } from '../../auth/services/authService'
import Modal from '../../../shared/components/Modal'

const ROLE_LABEL: Record<number, string> = {
  3: 'Admin',
  2: 'Staff',
  1: 'Member',
  0: 'Guest',
}

const ROLE_CLASS: Record<number, string> = {
  3: 'admin',
  2: 'staff',
  1: 'member',
  0: 'guest',
}

const TABS = ['Tất cả', 'Member', 'Staff', 'Admin'] as const

export default function AccountsPage() {
  const { token } = useAuth()
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]     = useState(0)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    role: 1, // Default to Member
  })
  const [submitting, setSubmitting] = useState(false)

  const loadAccounts = async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getAllUsersApi(token)
      setAccounts(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAccounts() }, [token])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirm_password) {
      alert('Mật khẩu xác nhận không khớp')
      return
    }
    setSubmitting(true)
    try {
      await registerApi({
        ...formData,
        Address: {
          street: 'N/A',
          ward: 'N/A',
          district: 'N/A',
          city: 'N/A',
          country: 'Vietnam'
        },
        phone_number: '0123456789'
      })
      setIsModalOpen(false)
      loadAccounts()
      setFormData({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        date_of_birth: '',
        gender: 'male',
        role: 1,
      })
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo tài khoản')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = accounts.filter((a) => {
    const roleString = ROLE_LABEL[a.role]?.toLowerCase() || 'member'
    const matchTab = tab === 0 || roleString === TABS[tab].toLowerCase()
    const matchSearch =
      (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          className="input"
          style={{ maxWidth: 280 }}
          placeholder="Tìm tên, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={loadAccounts} disabled={loading}>
          <IconRefresh size={14} className={loading ? 'animate-spin' : ''} />
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <IconPlus size={14} /> Tạo tài khoản
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
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Ngày tham gia</th>
                  <th>Xác thực</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a._id}>
                    <td className="text-[11px] text-text-muted">...{a._id?.substring(a._id.length - 6) || 'N/A'}</td>
                    <td className="font-semibold text-text-main">{a.name}</td>
                    <td className="text-text-muted">{a.email}</td>
                    <td>
                      <span className={`status-badge ${ROLE_CLASS[a.role]}`}>
                        {ROLE_LABEL[a.role] || 'Member'}
                      </span>
                    </td>
                    <td className="text-[13px] text-text-muted">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${a.verify === 1 ? 'completed' : 'pending'}`}>
                        {a.verify === 1 ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge active">Hoạt động</span>
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
        title="Tạo Tài Khoản Mới"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Họ tên</label>
            <input 
              required className="input w-full" 
              placeholder="VD: Nguyễn Văn A" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input 
              required type="email" className="input w-full" 
              placeholder="VD: nguyenvana@gmail.com" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Mật khẩu</label>
              <input 
                required type="password" className="input w-full" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Xác nhận mật khẩu</label>
              <input 
                required type="password" className="input w-full" 
                value={formData.confirm_password}
                onChange={e => setFormData({...formData, confirm_password: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Ngày sinh</label>
              <input 
                required type="date" className="input w-full" 
                value={formData.date_of_birth}
                onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Giới tính</label>
              <select 
                className="input w-full"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as any})}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Vai trò</label>
            <select 
              className="input w-full"
              value={formData.role}
              onChange={e => setFormData({...formData, role: Number(e.target.value)})}
            >
              <option value={1}>Member</option>
              <option value={2}>Staff</option>
              <option value={3}>Admin</option>
            </select>
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
              {submitting ? 'Đang tạo...' : 'Tạo Tài khoản'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

