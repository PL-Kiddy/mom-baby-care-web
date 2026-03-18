import { useState } from 'react'
import { IconCheckCircle, IconEye, IconWarning } from '../../../shared/components/Icons'
import type { Order, OrderStatus } from '../../../shared/types'

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
      <div className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Chờ xác nhận', value: pendingCount,                                       color: 'gold' },
          { label: 'Đang xử lý',   value: orders.filter(o => o.status === 'processing').length, color: 'blue' },
          { label: 'Hoàn thành',   value: orders.filter(o => o.status === 'completed').length,  color: 'green' },
          { label: 'Đã hủy',       value: orders.filter(o => o.status === 'cancelled').length,  color: 'red' },
        ].map((s) => (
          <div
            key={s.label}
            className="card flex flex-col gap-1.5 text-center"
          >
            <div
              className={[
                'text-2xl font-bold tracking-[-0.5px]',
                s.color === 'red'
                  ? 'text-[var(--red)]'
                  : s.color === 'gold'
                    ? 'text-[var(--gold)]'
                    : s.color === 'green'
                      ? 'text-[var(--teal)]'
                      : 'text-[var(--accent)]',
              ].join(' ')}
            >
              {s.value}
            </div>
            <div className="text-[12px] text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          className="input"
          style={{ maxWidth: 300 }}
          placeholder="Tìm mã đơn, khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {pendingCount > 0 && (
          <div
            className="
              flex items-center gap-2 rounded-lg border border-[rgba(234,179,8,0.4)]
              bg-[rgba(234,179,8,0.08)] px-3 py-2 text-[12px] text-[var(--gold)]
            "
          >
            <IconWarning size={14} color="var(--gold)" />
            Có <strong className="font-semibold">{pendingCount}</strong> đơn đang chờ xác nhận
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
                    <div className="flex items-center gap-1.5">
                      <button
                        className="
                          flex h-7 w-7 items-center justify-center rounded-md
                          border border-[var(--border)] bg-[var(--surface2)]
                          text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]
                        "
                        title="Xem chi tiết"
                      >
                        <IconEye size={14} />
                      </button>
                      {o.status === 'pending' && (
                        <>
                          <button
                            className="
                              flex h-7 w-7 items-center justify-center rounded-md
                              border border-[rgba(52,211,153,0.5)] bg-[rgba(52,211,153,0.12)]
                              text-[var(--teal)] transition-colors hover:border-[var(--teal)]
                            "
                            title="Xác nhận"
                            onClick={() => confirmOrder(o.id)}
                          >
                            <IconCheckCircle size={14} />
                          </button>
                          <button
                            className="
                              flex h-7 w-7 items-center justify-center rounded-md
                              border border-[rgba(248,113,113,0.6)] bg-[rgba(248,113,113,0.12)]
                              text-[var(--red)] transition-colors hover:border-[var(--red)]
                            "
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
