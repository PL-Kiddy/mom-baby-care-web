import { useEffect, useState } from 'react'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getAllOrdersApi } from '../services/adminService'
import type { Order, OrderStatus } from '../../../shared/types'

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    'Chờ xác nhận',
  processing: 'Đang giao',
  completed:  'Hoàn thành',
  cancelled:  'Đã hủy',
}

const TABS = ['Tất cả', 'Chờ xử lý', 'Đang giao', 'Hoàn thành'] as const

export default function RecentOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    async function loadOrders() {
      if (!token) return
      try {
        const data = await getAllOrdersApi(token)
        // BE trả về mảng đơn hàng, ta map sang định dạng Order của UI
        const mapped: Order[] = data.map((item: any) => ({
          id: `#${item._id.substring(item._id.length - 6).toUpperCase()}`,
          customer: item.user?.name || 'Khách vãng lai',
          phone: item.user?.phone_number || '-',
          product: item.items?.[0]?.product?.name || 'Nhiều sản phẩm',
          total: `${item.total_amount?.toLocaleString()} ₫`,
          status: item.status?.toLowerCase() as OrderStatus,
          time: new Date(item.createdAt).toLocaleDateString('vi-VN'),
          payment: item.payment_method || 'Chưa rõ'
        }))
        setOrders(mapped.slice(0, 5)) // Chỉ lấy 5 đơn mới nhất cho Dashboard
      } catch (error) {
        console.error('Failed to load recent orders:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [token])


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
        {loading ? (
          <div className="p-8 text-center text-text-muted animate-pulse">Đang tải đơn hàng...</div>
        ) : (
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
              {orders.map((o: Order) => (
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
        )}
      </div>

    </div>
  )
}
