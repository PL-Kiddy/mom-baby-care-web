import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPasswordApi, verifyForgotPasswordTokenApi } from '../../auth/services/authService'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('forgot_password_token') || searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Liên kết đặt lại mật khẩu không hợp lệ.')
      setIsVerifying(false)
      return
    }

    const verifyToken = async () => {
      try {
        await verifyForgotPasswordTokenApi(token)
      } catch (err: any) {
        setError(err.message ?? 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')
      } finally {
        setIsVerifying(false)
      }
    }

    void verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await resetPasswordApi({
        password,
        confirm_password: confirmPassword,
        forgot_password_token: token,
      })
      setSuccess('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err: any) {
      setError(err.message ?? 'Không thể đặt lại mật khẩu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDisabled = isVerifying || isSubmitting

  return (
    <div className="bg-background-light font-display min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl shadow-pink-100/50 p-8 md:p-10 border border-pink-50 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 size-32 bg-primary/5 rounded-full blur-2xl"></div>

        <div className="flex flex-col items-center gap-4 mb-8 text-center relative z-10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">child_care</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-main">
              Mom&Baby<span className="text-primary">Care</span>
            </h1>
          </Link>
          <div className="mt-2">
            <h2 className="text-xl font-extrabold text-text-main">Đặt lại mật khẩu</h2>
            <p className="text-text-muted text-sm font-medium mt-1">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>
        </div>

        {isVerifying ? (
          <p className="text-center text-text-muted text-sm">Đang kiểm tra liên kết đặt lại mật khẩu...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-bold text-text-main ml-1">
                Mật khẩu mới
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-bold text-text-main ml-1">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                  lock_reset
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium text-center">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-emerald-600 font-medium text-center">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={isDisabled}
              className="w-full bg-primary-dark hover:bg-primary text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center relative z-10">
          <Link
            to="/login"
            className="text-primary font-bold hover:text-primary-dark transition-colors text-sm"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>

      <Link
        to="/"
        className="mt-8 flex items-center gap-1.5 text-text-muted text-sm font-bold hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">keyboard_backspace</span>
        Quay lại trang chủ
      </Link>
    </div>
  )
}

export default ResetPasswordPage

