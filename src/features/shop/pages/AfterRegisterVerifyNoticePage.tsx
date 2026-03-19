import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { resendEmailVerifyApi } from '../../auth/services/authService'

export default function AfterRegisterVerifyNoticePage() {
  const location = useLocation()
  const emailFromState = (location.state as { email?: string } | null)?.email
  const [email, setEmail] = useState(emailFromState ?? '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    if (!email) {
      setError('Vui lòng nhập email đã đăng ký.')
      return
    }
    try {
      setLoading(true)
      await resendEmailVerifyApi(email)
      setMessage('Đã gửi lại email xác thực. Mẹ kiểm tra hộp thư (kể cả spam) nhé.')
    } catch (err: any) {
      setError(err.message ?? 'Không thể gửi lại email xác thực.')
    } finally {
      setLoading(false)
    }
  }

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

        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">mark_email_unread</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-text-main">
                Vui lòng kiểm tra email để xác thực tài khoản
              </h1>
              <p className="text-sm text-text-muted mt-1">
                Hệ thống đã gửi một email chứa liên kết xác thực đến địa chỉ mẹ dùng khi đăng ký.
              </p>
            </div>
          </div>

          <form onSubmit={handleResend} className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-text-muted mb-1">
              Email đã đăng ký
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="me@vidu.com"
                className="flex-1 px-3 py-2.5 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">
                  refresh
                </span>
                {loading ? 'Đang gửi...' : 'Gửi lại email'}
              </button>
            </div>
          </form>

          {message && (
            <p className="text-sm text-emerald-600 font-medium mt-2">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500 font-medium mt-2">
              {error}
            </p>
          )}

          <p className="text-xs text-text-muted mt-4">
            Nếu mẹ không thấy email trong hộp thư đến, vui lòng kiểm tra thêm mục Spam/Quảng cáo.
          </p>

          <div className="pt-4 border-t border-pink-50 flex items-center justify-between text-sm">
            <span className="text-text-muted">Đã xác thực xong?</span>
            <Link to="/login" className="text-primary font-bold hover:text-primary-dark">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

