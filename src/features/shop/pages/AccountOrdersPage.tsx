import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getMyOrdersApi, cancelOrderApi } from '../services/orderService'

interface MemberOrder {
  _id: string
  total_amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  payment_method: string
  created_at: string
}

export default function AccountOrdersPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<MemberOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const data = await getMyOrdersApi(token)
        setOrders(data)
      } catch (err: any) {
        setError(err.message ?? 'Không thể tải đơn hàng của bạn')
      } finally {
        setLoading(false)
      }
    }
    void fetchOrders()
  }, [token])

  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-[960px] mx-auto px-4 md:px-8 lg:px-0 py-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Đơn hàng của tôi</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-6">
          Đơn hàng của tôi
        </h1>

        {loading && (
          <p className="text-center text-text-muted mt-8">
            Đang tải đơn hàng...
          </p>
        )}
        {error && !loading && (
          <p className="text-center text-red-500 mt-8">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm divide-y divide-pink-50">
            {orders.length === 0 ? (
              <div className="p-6 text-center text-sm text-text-muted">
                Mẹ chưa có đơn hàng nào.
              </div>
            ) : (
              orders.map((o) => (
                <div key={o._id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="text-text-main">#{o._id.slice(-6)}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fff0f4] text-primary font-bold uppercase">
                        {o.status === 'completed'
                          ? 'Hoàn thành'
                          : o.status === 'processing'
                            ? 'Đang xử lý'
                            : o.status === 'pending'
                              ? 'Đang chờ'
                              : 'Đã hủy'}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      {new Date(o.created_at).toLocaleString('vi-VN')} • {o.payment_method}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-primary font-extrabold text-lg">
                      {o.total_amount.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        onClick={() => navigate(`/account/orders/${o._id}`)}
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        Xem chi tiết
                      </button>
                      {o.status === 'pending' && token && (
                        <button
                          className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 hover:underline"
                          onClick={async () => {
                            if (!window.confirm('Mẹ chắc chắn muốn hủy đơn này?')) return
                            try {
                              await cancelOrderApi(token, o._id)
                              const data = await getMyOrdersApi(token)
                              setOrders(data)
                            } catch (err: any) {
                              alert(err.message ?? 'Không thể hủy đơn')
                            }
                          }}
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

