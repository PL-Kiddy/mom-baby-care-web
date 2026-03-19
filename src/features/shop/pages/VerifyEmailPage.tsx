import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export default function VerifyEmailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [message, setMessage] = useState<string>('Đang xác thực email của mẹ...')

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('email_verify_token') ?? searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Liên kết xác thực không hợp lệ hoặc đã hết hạn.')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`${BASE_URL}/members/verify-email?email_verify_token=${encodeURIComponent(token)}`)
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(json.message ?? 'Xác thực email thất bại.')
        }
        setStatus('success')
        setMessage('Email của mẹ đã được xác thực thành công. Mẹ có thể đăng nhập ngay bây giờ.')
        setTimeout(() => navigate('/login', { replace: true }), 2500)
      } catch (err: any) {
        setStatus('error')
        setMessage(err.message ?? 'Liên kết xác thực không hợp lệ hoặc đã hết hạn.')
      }
    }

    void verify()
  }, [location.search, navigate])

  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-[600px] mx-auto px-4 md:px-0 py-10">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Xác thực email</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm p-6 md:p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div
              className={`size-14 rounded-full flex items-center justify-center ${
                status === 'pending'
                  ? 'bg-primary/10 text-primary'
                  : status === 'success'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-500'
              }`}
            >
              <span className="material-symbols-outlined text-[32px]">
                {status === 'success'
                  ? 'mark_email_read'
                  : status === 'error'
                    ? 'error'
                    : 'hourglass_top'}
              </span>
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold text-text-main">
            {status === 'success'
              ? 'Xác thực email thành công'
              : status === 'error'
                ? 'Không thể xác thực email'
                : 'Đang xác thực email'}
          </h1>

          <p
            className={`text-sm ${
              status === 'error' ? 'text-rose-500' : 'text-text-muted'
            }`}
          >
            {message}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3 text-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#fce7ef] text-text-main hover:bg-[#fff0f4]"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Về trang chủ
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              Đăng nhập
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

