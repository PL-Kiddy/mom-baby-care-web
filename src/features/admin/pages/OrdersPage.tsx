import { useState } from 'react'
import { IconDownload, IconPlus } from '../../../shared/components/Icons'
import type { Order, OrderStatus } from '../../../shared/types'
import styles from './TablePage.module.css'

const ORDERS: Order[] = [
  { id: '#ORD-0381', customer: 'Nguyễn Thị Mai', phone: '0901234567', product: 'Similac Gain IQ',   total: '450,000 ₫',   status: 'pending',    time: '10/03/2025', payment: 'Chuyển khoản' },
  { id: '#ORD-0380', customer: 'Trần Hoa Linh',   phone: '0912345678', product: 'Enfamama A+',       total: '780,000 ₫',   status: 'processing', time: '10/03/2025', payment: 'Ví MoMo' },
  { id: '#ORD-0379', customer: 'Lê Thanh Nga',    phone: '0923456789', product: 'Aptamil Gold',      total: '1,200,000 ₫', status: 'completed',  time: '09/03/2025', payment: 'COD' },
  { id: '#ORD-0378', customer: 'Phạm Minh Anh',   phone: '0934567890', product: 'Dumex Mamil',       total: '320,000 ₫',   status: 'cancelled',  time: '09/03/2025', payment: 'Chuyển khoản' },
  { id: '#ORD-0377', customer: 'Võ Thị Thu',      phone: '0945678901', product: 'Nan Optipro',       total: '560,000 ₫',   status: 'pending',    time: '08/03/2025', payment: 'Ví MoMo' },
  { id: '#ORD-0376', customer: 'Hoàng Thị Lan',   phone: '0956789012', product: 'Frisolac Gold',     total: '890,000 ₫',   status: 'completed',  time: '08/03/2025', payment: 'COD' },
]

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    'Chờ xác nhận',
  processing: 'Đang giao',
  completed:  'Hoàn thành',
  cancelled:  'Đã hủy',
}

const TABS = ['Tất cả', 'Chờ xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'] as const

export default function OrdersPage() {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')

  const filtered = ORDERS.filter((o) => {
    const matchTab = tab === 0 || STATUS_LABEL[o.status] === TABS[tab]
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div>
      <div className={styles.toolbar}>
        <input
          className="input"
          style={{ maxWidth: 300 }}
          placeholder="Tìm theo mã đơn, khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-outline"><IconDownload size={14} /> Xuất Excel</button>
          <button className="btn btn-primary"><IconPlus size={14} /> Tạo đơn</button>
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
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Sản phẩm</th>
                <th>Thanh toán</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{o.id}</td>
                  <td>{o.customer}</td>
                  <td style={{ color: 'var(--muted)' }}>{o.phone}</td>
                  <td>{o.product}</td>
                  <td style={{ color: 'var(--muted)' }}>{o.payment}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 600 }}>{o.total}</td>
                  <td><span className={`status-badge ${o.status}`}>{STATUS_LABEL[o.status]}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{o.time}</td>
                  <td>
                    <span className={styles.link}>Xem</span>
                    {o.status === 'pending' && <> · <span className={styles.link}>Duyệt</span></>}
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
