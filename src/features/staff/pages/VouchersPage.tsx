import { useState } from 'react'
import { IconPlus } from '../../../shared/components/Icons'
import type { Voucher } from '../../../shared/types'
import styles from './StaffPage.module.css'

const VOUCHERS: Voucher[] = [
  { code: 'WELCOME20', type: 'Phần trăm', value: '20%',      minOrder: '200,000 ₫', used: 45,  limit: 100, expires: '31/03/2025', status: 'active' },
  { code: 'MAMOM50K',  type: 'Cố định',   value: '50,000 ₫', minOrder: '300,000 ₫', used: 88,  limit: 100, expires: '20/03/2025', status: 'active' },
  { code: 'BABY10',    type: 'Phần trăm', value: '10%',      minOrder: '150,000 ₫', used: 100, limit: 100, expires: '15/03/2025', status: 'inactive' },
  { code: 'VIP30',     type: 'Phần trăm', value: '30%',      minOrder: '500,000 ₫', used: 12,  limit: 50,  expires: '30/04/2025', status: 'active' },
]

interface NewVoucher { code: string; type: string; value: string; minOrder: string; limit: string; expires: string }
const EMPTY: NewVoucher = { code: '', type: 'Phần trăm', value: '', minOrder: '', limit: '', expires: '' }

export default function StaffVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(VOUCHERS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<NewVoucher>(EMPTY)
  const [search, setSearch] = useState('')

  const filtered = vouchers.filter((v) => v.code.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = () => {
    if (!form.code || !form.value) return
    const newV: Voucher = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: form.value,
      minOrder: form.minOrder || '0 ₫',
      used: 0,
      limit: parseInt(form.limit) || 100,
      expires: form.expires,
      status: 'active',
    }
    setVouchers((prev) => [newV, ...prev])
    setForm(EMPTY)
    setShowForm(false)
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <input className="input" style={{ maxWidth: 260 }} placeholder="Tìm mã voucher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setShowForm(!showForm)}>
          <IconPlus size={14} /> Tạo voucher mới
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className={`card ${styles.formCard}`}>
          <div className="card-header" style={{ marginBottom: 16 }}>
            <span className="card-title">Tạo Voucher mới</span>
            <button className="btn btn-outline" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => setShowForm(false)}>Hủy</button>
          </div>
          <div className={styles.formGrid}>
            {[
              { label: 'Mã voucher *', key: 'code',     placeholder: 'VD: SUMMER30' },
              { label: 'Giá trị *',    key: 'value',    placeholder: 'VD: 20% hoặc 50000' },
              { label: 'Đơn tối thiểu', key: 'minOrder', placeholder: 'VD: 300,000 ₫' },
              { label: 'Giới hạn',     key: 'limit',    placeholder: 'VD: 100' },
              { label: 'Hết hạn',      key: 'expires',  placeholder: 'VD: 31/12/2025' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className={styles.formGroup}>
                <label className={styles.formLabel}>{label}</label>
                <input
                  className="input"
                  placeholder={placeholder}
                  value={form[key as keyof NewVoucher]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Loại</label>
              <select className="input" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                <option>Phần trăm</option>
                <option>Cố định</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleCreate}>
            Tạo voucher
          </button>
        </div>
      )}

      <div className="card">
        <div className="table-wrap">
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
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.code}>
                  <td style={{ color: 'var(--teal)', fontWeight: 700, letterSpacing: 1 }}>{v.code}</td>
                  <td><span className="status-badge guest">{v.type}</span></td>
                  <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{v.value}</td>
                  <td style={{ color: 'var(--muted)' }}>{v.minOrder}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 4 }}>
                        <div style={{ height: '100%', borderRadius: 4, background: v.used >= v.limit ? 'var(--red)' : 'var(--teal)', width: `${(v.used / v.limit) * 100}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{v.used}/{v.limit}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{v.expires}</td>
                  <td><span className={`status-badge ${v.status}`}>{v.status === 'active' ? 'Hoạt động' : 'Đã tắt'}</span></td>
                  <td>
                    <span className={styles.link}>Sửa</span>
                    {' · '}
                    <span className={styles.link}>{v.status === 'active' ? 'Tắt' : 'Bật'}</span>
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
