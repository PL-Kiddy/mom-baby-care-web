import { useState } from 'react'
import type { Order, OrderStatus } from '../../../shared/types'

const ORDERS: Order[] = [
  { id: '#ORD-0381', customer: 'Nguyễn Thị Mai', phone: '0901234567', product: 'Similac Gain IQ',   total: '450,000 ₫',   status: 'pending',    time: '10 phút trước', payment: 'Chuyển khoản' },
  { id: '#ORD-0380', customer: 'Trần Hoa Linh',   phone: '0912345678', product: 'Enfamama A+',       total: '780,000 ₫',   status: 'processing', time: '1 giờ trước',   payment: 'Ví MoMo' },
  { id: '#ORD-0379', customer: 'Lê Thanh Nga',    phone: '0923456789', product: 'Aptamil Gold',      total: '1,200,000 ₫', status: 'completed',  time: '3 giờ trước',   payment: 'COD' },
  { id: '#ORD-0378', customer: 'Phạm Minh Anh',   phone: '0934567890', product: 'Dumex Mamil',       total: '320,000 ₫',   status: 'cancelled',  time: '5 giờ trước',   payment: 'Chuyển khoản' },
  { id: '#ORD-0377', customer: 'Võ Thị Thu',      phone: '0945678901', product: 'Nan Optipro',       total: '560,000 ₫',   status: 'pending',    time: '6 giờ trước',   payment: 'Ví MoMo' },
]

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    'Chờ xác nhận',
  processing: 'Đang giao',
  completed:  'Hoàn thành',
  cancelled:  'Đã hủy',
}

const TABS = ['Tất cả', 'Chờ xử lý', 'Đang giao', 'Hoàn thành'] as const

export default function RecentOrders() {
  const [tab, setTab] = useState(0)

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Đơn hàng gần đây</span>
        <span className="card-action">Xem tất cả →</span>
      </div>
      <div className="tab-row">
        {TABS.map((t, i) => (
          <button key={t} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.id}>
                <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.product}</td>
                <td style={{ color: 'var(--green)', fontWeight: 600 }}>{o.total}</td>
                <td>
                  <span className={`status-badge ${o.status}`}>
                    {STATUS_LABEL[o.status]}
                  </span>
                </td>
                <td style={{ color: 'var(--muted)', fontSize: 12 }}>{o.time}</td>
                <td>
                  <span className="cursor-pointer text-[12px] text-[var(--accent)] hover:underline">
                    Xem
                  </span>
                  {o.status === 'pending' && (
                    <>
                      {' '}
                      ·{' '}
                      <span className="cursor-pointer text-[12px] text-[var(--accent)] hover:underline">
                        Duyệt
                      </span>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
