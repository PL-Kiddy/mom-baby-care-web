import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'

export default function LoginPage() {
  const { login, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  // Đã đăng nhập rồi → redirect về portal tương ứng
  if (!isLoading && user) {
    const dest =
      user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'staff'
          ? '/staff/orders'
          : '/'
    return <Navigate to={dest} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      // Sau khi login thành công, AuthContext cập nhật user
      // → RootRedirect (/portal) sẽ tự chuyển hướng đúng portal
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname
      navigate(from ?? '/portal', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role: 'admin' | 'staff' | 'member') => {
    if (role === 'admin')      setEmail('admin@gmail.com')
    else if (role === 'staff') setEmail('staff@gmail.com')
    else                       setEmail('member@gmail.com')
    setPassword('123456')
    setError('')
  }

  return (
    <div className="bg-background-light font-display min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl shadow-pink-100/50 p-8 md:p-10 border border-pink-50 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 size-32 bg-primary/5 rounded-full blur-2xl" />

        <div className="flex flex-col items-center gap-4 mb-8 text-center relative z-10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[32px]">child_care</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-main">
              Mom&amp;Baby<span className="text-primary">Care</span>
            </h1>
          </Link>
          <div className="mt-2">
            <h2 className="text-xl font-extrabold text-text-main">Chào mừng mẹ quay trở lại</h2>
            <p className="text-text-muted text-sm font-medium mt-1">
              Đăng nhập để tiếp tục hành trình chăm sóc bé yêu
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-bold text-text-main ml-1">
              Email
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                alternate_email
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@gmail.com / admin@gmail.com..."
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label htmlFor="password" className="text-sm font-bold text-text-main">
                Mật khẩu
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                lock
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-dark hover:bg-primary text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-2"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-8 relative z-10">
          <div className="relative flex items-center justify-center mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-50" />
            </div>
            <span className="relative px-4 bg-white text-xs font-bold text-text-muted uppercase tracking-wider">
              Demo nhanh
            </span>
          </div>
          <div className="flex justify-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemo('member')}
              className="px-3 py-1.5 rounded-full border border-pink-100 bg-[#fff9fa] text-text-main font-semibold hover:bg-primary/10 transition-colors"
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => fillDemo('staff')}
              className="px-3 py-1.5 rounded-full border border-pink-100 bg-[#fff9fa] text-text-main font-semibold hover:bg-primary/10 transition-colors"
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="px-3 py-1.5 rounded-full border border-pink-100 bg-[#fff9fa] text-text-main font-semibold hover:bg-primary/10 transition-colors"
            >
              Admin
            </button>
            <span className="text-[11px] text-text-muted ml-1">pass: 123456</span>
          </div>
        </div>

        <div className="mt-10 text-center relative z-10">
          <p className="text-sm text-text-muted font-medium">
            Mẹ chưa có tài khoản?
            <Link
              to="/register"
              className="text-primary font-bold hover:text-primary-dark transition-colors ml-1"
            >
              Đăng ký tài khoản mới
            </Link>
          </p>
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
