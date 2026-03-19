import { Link, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const PaymentResultPage = () => {
  const query = useQuery()
  const resultCode = query.get('resultCode') || query.get('status') || '0'
  const isSuccess = resultCode === '0' || resultCode === 'success'

  return (
    <div className="bg-background-light font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-[960px] mx-auto px-4 md:px-8 lg:px-0 py-10">
        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className={`size-16 rounded-full flex items-center justify-center ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
              <span className="material-symbols-outlined text-[32px]">
                {isSuccess ? 'check_circle' : 'error'}
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-text-main mb-2">
            {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
          </h1>
          <p className="text-sm text-text-muted mb-6">
            {isSuccess
              ? 'Đơn hàng của mẹ đã được ghi nhận. Mẹ có thể xem lại chi tiết trong mục Đơn hàng của tôi.'
              : 'Thanh toán không thành công hoặc đã bị hủy. Nếu cần hỗ trợ, vui lòng liên hệ đội ngũ chăm sóc khách hàng.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/account/orders"
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
            >
              Xem đơn hàng của tôi
            </Link>
            <Link
              to="/products"
              className="px-6 py-2.5 rounded-xl border border-primary text-primary text-sm font-bold hover:bg-primary/5 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PaymentResultPage

