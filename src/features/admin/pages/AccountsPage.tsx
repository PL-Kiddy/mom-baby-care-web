import { useState } from 'react'
import { IconPlus } from '../../../shared/components/Icons'
import type { Account, UserRole } from '../../../shared/types'
import styles from './TablePage.module.css'

const ACCOUNTS: Account[] = [
  { id: 'U001', name: 'Nguyễn Thị Mai',  email: 'mai.nguyen@gmail.com',  phone: '0901234567', role: 'member', joined: '15/01/2025', orders: 12, status: 'active' },
  { id: 'U002', name: 'Trần Hoa Linh',   email: 'linh.tran@gmail.com',   phone: '0912345678', role: 'member', joined: '20/01/2025', orders: 8,  status: 'active' },
  { id: 'U003', name: 'Lê Thanh Nga',    email: 'nga.le@gmail.com',      phone: '0923456789', role: 'member', joined: '01/02/2025', orders: 5,  status: 'inactive' },
  { id: 'U004', name: 'Staff Minh',      email: 'minh.staff@milk.com',   phone: '0934000001', role: 'staff',  joined: '01/01/2025', orders: 0,  status: 'active' },
  { id: 'U005', name: 'Phạm Thị Hương',  email: 'huong.pham@gmail.com',  phone: '0945678901', role: 'member', joined: '10/02/2025', orders: 3,  status: 'active' },
]

const ROLE_LABEL: Record<UserRole, string> = {
  admin:  'Admin',
  staff:  'Staff',
  member: 'Member',
  guest:  'Guest',
}

const TABS = ['Tất cả', 'Member', 'Staff', 'Admin'] as const

export default function AccountsPage() {
  const [tab, setTab]     = useState(0)
  const [search, setSearch] = useState('')

  const filtered = ACCOUNTS.filter((a) => {
    const matchTab = tab === 0 || a.role === TABS[tab].toLowerCase()
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div>
      <div className={styles.toolbar}>
        <input
          className="input"
          style={{ maxWidth: 280 }}
          placeholder="Tìm tên, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-primary"><IconPlus size={14} /> Tạo tài khoản</button>
        </div>
      </div>

      <div className="card">
        <div className="tab-row">
          {TABS.map((t, i) => (
            <button key={t} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th>Đơn hàng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{a.id}</td>
                  <td style={{ fontWeight: 500 }}>{a.name}</td>
                  <td style={{ color: 'var(--muted)' }}>{a.email}</td>
                  <td style={{ color: 'var(--muted)' }}>{a.phone}</td>
                  <td><span className={`status-badge ${a.role}`}>{ROLE_LABEL[a.role]}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{a.joined}</td>
                  <td>{a.orders}</td>
                  <td><span className={`status-badge ${a.status}`}>{a.status === 'active' ? 'Hoạt động' : 'Đã khóa'}</span></td>
                  <td>
                    <span className={styles.link}>Xem</span>
                    {' · '}
                    <span className={styles.link}>{a.status === 'active' ? 'Khóa' : 'Mở khóa'}</span>
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
