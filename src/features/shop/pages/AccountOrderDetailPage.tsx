import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getOrderByIdApi } from '../services/orderService'

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

interface OrderDetail {
  _id: string
  total_amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  payment_method: string
  created_at: string
  address?: any
  items?: OrderItem[]
}

export default function AccountOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { token } = useAuth()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token || !orderId) {
        setLoading(false)
        return
      }
      try {
        const data = await getOrderByIdApi(token, orderId)
        setOrder(data)
      } catch (err: any) {
        setError(err.message ?? 'Không thể tải chi tiết đơn hàng')
      } finally {
        setLoading(false)
      }
    }
    void fetchOrder()
  }, [token, orderId])

  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-[960px] mx-auto px-4 md:px-8 lg:px-0 py-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/account/orders" className="hover:text-primary">
            Đơn hàng của tôi
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Chi tiết đơn</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-6">
          Chi tiết đơn hàng
        </h1>

        {loading && (
          <p className="text-center text-text-muted mt-8">Đang tải chi tiết đơn hàng...</p>
        )}
        {error && !loading && (
          <p className="text-center text-red-500 mt-8">{error}</p>
        )}

        {!loading && !error && order && (
          <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-sm text-text-muted">Mã đơn</div>
                <div className="text-lg font-extrabold text-text-main">
                  #{order._id.slice(-8)}
                </div>
                <div className="text-xs text-text-muted mt-1">
                  {new Date(order.created_at).toLocaleString('vi-VN')} • {order.payment_method}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-muted mb-1">Trạng thái</div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#fff0f4] text-primary uppercase">
                  {order.status === 'completed'
                    ? 'Hoàn thành'
                    : order.status === 'processing'
                      ? 'Đang xử lý'
                      : order.status === 'pending'
                        ? 'Đang chờ'
                        : 'Đã hủy'}
                </span>
              </div>
            </div>

            <div className="border-t border-pink-50 pt-4 space-y-3">
              <h2 className="text-sm font-bold text-text-main uppercase tracking-wide">
                Sản phẩm
              </h2>
              {order.items && order.items.length > 0 ? (
                <div className="divide-y divide-pink-50">
                  {order.items.map((item) => (
                    <div
                      key={item.product_id}
                      className="py-3 flex items-center justify-between gap-3 text-sm"
                    >
                      <div>
                        <div className="font-semibold text-text-main">
                          {item.product_name ?? 'Sản phẩm'}
                        </div>
                        <div className="text-xs text-text-muted">
                          SL: {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-text-main">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-xs text-text-muted">
                          {item.price.toLocaleString('vi-VN')}đ / sản phẩm
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted">
                  Thông tin chi tiết sản phẩm hiện không khả dụng.
                </p>
              )}
            </div>

            <div className="border-t border-pink-50 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="text-sm text-text-muted">
                <div className="font-bold text-text-main mb-1">
                  Địa chỉ giao hàng
                </div>
                {order.address ? (
                  <p>
                    {order.address.street}, {order.address.ward},{' '}
                    {order.address.district}, {order.address.city}
                  </p>
                ) : (
                  <p>Địa chỉ không khả dụng.</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted uppercase tracking-wide">
                  Tổng thanh toán
                </div>
                <div className="text-2xl font-extrabold text-primary">
                  {order.total_amount.toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

