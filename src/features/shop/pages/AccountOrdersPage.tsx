import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import type { Order } from '../../../shared/types'

const MOCK_MEMBER_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Mẹ Demo',
    phone: '0901 234 567',
    product: 'Combo sữa bầu + vitamin',
    total: '1.575.000đ',
    status: 'processing',
    time: 'Hôm qua, 14:23',
    payment: 'VNPay',
  },
  {
    id: 'ORD-002',
    customer: 'Mẹ Demo',
    phone: '0901 234 567',
    product: 'Sữa Meiji số 0',
    total: '550.000đ',
    status: 'completed',
    time: 'Tuần trước',
    payment: 'Tiền mặt',
  },
]

export default function AccountOrdersPage() {
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

        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm divide-y divide-pink-50">
          {MOCK_MEMBER_ORDERS.map((o) => (
            <div key={o.id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-text-main">{o.id}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fff0f4] text-primary font-bold uppercase">
                    {o.status === 'completed'
                      ? 'Hoàn thành'
                      : o.status === 'processing'
                        ? 'Đang xử lý'
                        : 'Đang chờ'}
                  </span>
                </div>
                <p className="text-sm text-text-muted line-clamp-1 mt-1">{o.product}</p>
                <p className="text-xs text-text-muted mt-1">{o.time} • {o.payment}</p>
              </div>
              <div className="text-right">
                <div className="text-primary font-extrabold text-lg">{o.total}</div>
                <button className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

