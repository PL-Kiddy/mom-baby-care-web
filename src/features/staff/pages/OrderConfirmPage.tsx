import { useState } from 'react'
import { IconCheckCircle, IconEye, IconWarning } from '../../../shared/components/Icons'
import type { Order, OrderStatus } from '../../../shared/types'
import styles from './StaffPage.module.css'

const ORDERS: Order[] = [
  { id: '#ORD-0381', customer: 'Nguyễn Thị Mai',  phone: '0901234567', product: 'Similac Gain IQ 4',    total: '450,000 ₫',   status: 'pending',    time: '10/03/2025 08:12', payment: 'Chuyển khoản' },
  { id: '#ORD-0382', customer: 'Lê Bích Ngọc',    phone: '0911222333', product: 'Enfamama A+ Vanilla',  total: '560,000 ₫',   status: 'pending',    time: '10/03/2025 09:05', payment: 'Ví MoMo' },
  { id: '#ORD-0383', customer: 'Trần Thu Hà',     phone: '0922333444', product: 'Aptamil Gold+ 2',      total: '840,000 ₫',   status: 'pending',    time: '10/03/2025 09:44', payment: 'COD' },
  { id: '#ORD-0380', customer: 'Trần Hoa Linh',   phone: '0912345678', product: 'Nan Optipro 1',        total: '780,000 ₫',   status: 'processing', time: '09/03/2025 14:30', payment: 'Ví MoMo' },
  { id: '#ORD-0379', customer: 'Lê Thanh Nga',    phone: '0923456789', product: 'Aptamil Gold',         total: '1,200,000 ₫', status: 'completed',  time: '08/03/2025 11:00', payment: 'COD' },
  { id: '#ORD-0378', customer: 'Phạm Minh Anh',   phone: '0934567890', product: 'Dumex Mamil',          total: '320,000 ₫',   status: 'cancelled',  time: '08/03/2025 10:20', payment: 'Chuyển khoản' },
]

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    'Chờ xác nhận',
  processing: 'Đang xử lý',
  completed:  'Hoàn thành',
  cancelled:  'Đã hủy',
}

const TABS = ['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Hoàn thành', 'Đã hủy'] as const

export default function OrderConfirmPage() {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [orders, setOrders] = useState<Order[]>(ORDERS)

  const pendingCount = orders.filter((o) => o.status === 'pending').length

  const filtered = orders.filter((o) => {
    const matchTab = tab === 0 || STATUS_LABEL[o.status] === TABS[tab]
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const confirmOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'processing' as OrderStatus } : o))
    )
  }

  const cancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' as OrderStatus } : o))
    )
  }

  return (
    <div>
      {/* Summary row */}
      <div className={styles.summaryRow}>
        {[
          { label: 'Chờ xác nhận', value: pendingCount,                                       color: 'gold' },
          { label: 'Đang xử lý',   value: orders.filter(o => o.status === 'processing').length, color: 'blue' },
          { label: 'Hoàn thành',   value: orders.filter(o => o.status === 'completed').length,  color: 'green' },
          { label: 'Đã hủy',       value: orders.filter(o => o.status === 'cancelled').length,  color: 'red' },
        ].map((s) => (
          <div key={s.label} className={`card ${styles.summaryCard}`}>
            <div className={`${styles.summaryValue} ${styles[s.color]}`}>{s.value}</div>
            <div className={styles.summaryLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className="input"
          style={{ maxWidth: 300 }}
          placeholder="Tìm mã đơn, khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {pendingCount > 0 && (
          <div className={styles.pendingAlert}>
            <IconWarning size={14} color="var(--gold)" />
            Có <strong>{pendingCount}</strong> đơn đang chờ xác nhận
          </div>
        )}
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
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{o.id}</td>
                  <td style={{ fontWeight: 500 }}>{o.customer}</td>
                  <td style={{ color: 'var(--muted)' }}>{o.phone}</td>
                  <td>{o.product}</td>
                  <td style={{ color: 'var(--muted)' }}>{o.payment}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 600 }}>{o.total}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{o.time}</td>
                  <td><span className={`status-badge ${o.status}`}>{STATUS_LABEL[o.status]}</span></td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button className={styles.iconBtn} title="Xem chi tiết">
                        <IconEye size={14} />
                      </button>
                      {o.status === 'pending' && (
                        <>
                          <button
                            className={`${styles.iconBtn} ${styles.confirm}`}
                            title="Xác nhận"
                            onClick={() => confirmOrder(o.id)}
                          >
                            <IconCheckCircle size={14} />
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.cancel}`}
                            title="Hủy đơn"
                            onClick={() => cancelOrder(o.id)}
                          >
                            <IconWarning size={14} />
                          </button>
                        </>
                      )}
                    </div>
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
