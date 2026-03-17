import { useState } from 'react'
import { IconPlus } from '../../../shared/components/Icons'
import type { Voucher } from '../../../shared/types'
import styles from './TablePage.module.css'

const VOUCHERS: Voucher[] = [
  { code: 'WELCOME20', type: 'Phần trăm', value: '20%',       minOrder: '200,000 ₫', used: 45,  limit: 100, expires: '31/03/2025', status: 'active' },
  { code: 'MAMOM50K',  type: 'Cố định',   value: '50,000 ₫',  minOrder: '300,000 ₫', used: 88,  limit: 100, expires: '20/03/2025', status: 'active' },
  { code: 'BABY10',    type: 'Phần trăm', value: '10%',       minOrder: '150,000 ₫', used: 100, limit: 100, expires: '15/03/2025', status: 'inactive' },
  { code: 'VIP30',     type: 'Phần trăm', value: '30%',       minOrder: '500,000 ₫', used: 12,  limit: 50,  expires: '30/04/2025', status: 'active' },
]

export default function VouchersPage() {
  const [search, setSearch] = useState('')

  const filtered = VOUCHERS.filter((v) =>
    v.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className={styles.toolbar}>
        <input
          className="input"
          style={{ maxWidth: 280 }}
          placeholder="Tìm mã voucher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-primary"><IconPlus size={14} /> Tạo voucher</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã voucher</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>Đơn tối thiểu</th>
                <th>Đã dùng / Giới hạn</th>
                <th>Hết hạn</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.code}>
                  <td style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: 1 }}>{v.code}</td>
                  <td><span className="status-badge guest">{v.type}</span></td>
                  <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{v.value}</td>
                  <td style={{ color: 'var(--muted)' }}>{v.minOrder}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 4 }}>
                        <div style={{
                          height: '100%', borderRadius: 4,
                          background: v.used >= v.limit ? 'var(--red)' : 'var(--teal)',
                          width: `${(v.used / v.limit) * 100}%`,
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{v.used}/{v.limit}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{v.expires}</td>
                  <td>
                    <span className={`status-badge ${v.status}`}>
                      {v.status === 'active' ? 'Đang hoạt động' : 'Đã tắt'}
                    </span>
                  </td>
                  <td>
                    <span className={styles.link}>Sửa</span>
                    {' · '}
                    <span className={styles.link}>Xóa</span>
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
