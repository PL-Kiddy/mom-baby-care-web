import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getAllOrdersApi, updateOrderStatusApi } from '../services/adminService'
import type { Order, OrderStatus } from '../../../shared/types'

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    'Chờ xác nhận',
  processing: 'Đang giao',
  completed:  'Hoàn thành',
  cancelled:  'Đã hủy',
}

const TABS = ['Tất cả', 'Chờ xử lý', 'Đang giao', 'Hoàn thành'] as const
const TAB_STATUS: Record<number, string> = {
  1: 'pending',
  2: 'processing',
  3: 'completed'
}

export default function RecentOrders() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    async function loadOrders() {
      if (!token) return
      try {
        const data = await getAllOrdersApi(token)
        
        let filteredData = data
        if (tab !== 0) {
          filteredData = data.filter((item: any) => item.status?.toLowerCase() === TAB_STATUS[tab])
        }

        const mapped = filteredData.map((item: any) => ({
          _rawId: item._id,
          id: `#${item._id.substring(item._id.length - 6).toUpperCase()}`,
          customer: item.user?.name || 'Khách vãng lai',
          phone: item.user?.phone_number || '-',
          product: item.items?.[0]?.product?.name || 'Vài sản phẩm',
          total: `${(item.final_amount ?? item.total_amount ?? 0).toLocaleString()} ₫`,
          status: item.status?.toLowerCase(),
          time: item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : 'Unknown',
          payment: item.payment_method || 'Chưa rõ'
        }))
        setAllOrders(data)
        setOrders(mapped.slice(0, 5)) 
      } catch (error) {
        console.error('Failed to load recent orders:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [token, tab])

  const handleApprove = async (orderId: string) => {
    if (!token) return
    try {
      await updateOrderStatusApi(token, orderId, 'processing')
      alert('Đã duyệt đơn hàng thành công!')
      // Tải lại bằng cách refresh state
      setTab(0) // reset tab to trigger reload
    } catch (err: any) {
      alert(err.message || 'Lỗi khi duyệt đơn')
    }
  }


  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Đơn hàng gần đây</span>
        <span className="card-action cursor-pointer" onClick={() => navigate('/admin/orders')}>Xem tất cả →</span>
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
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.product}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 600 }}>{o.total}</td>
                  <td>
                    <span className={`status-badge ${o.status}`}>
                      {STATUS_LABEL[o.status as OrderStatus] || o.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{o.time}</td>
                  <td>
                    <span 
                      className="cursor-pointer text-[12px] text-[var(--accent)] hover:underline"
                      onClick={() => navigate('/admin/orders')}
                    >
                      Xem
                    </span>
                    {o.status === 'pending' && (
                      <>
                        {' '}
                        ·{' '}
                        <span 
                          className="cursor-pointer text-[12px] text-[var(--accent)] hover:underline"
                          onClick={() => handleApprove(o._rawId)}
                        >
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
