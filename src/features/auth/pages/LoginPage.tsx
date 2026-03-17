import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'
import { IconMilk, IconEye } from '../../../shared/components/Icons'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { login, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  // Đã đăng nhập rồi → redirect về portal tương ứng
  if (!isLoading && user) {
    const dest = user.role === 'admin' ? '/dashboard' : '/staff/orders'
    return <Navigate to={dest} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      // Sau khi login thành công, AuthContext cập nhật user
      // → RootRedirect sẽ tự chuyển hướng đúng portal
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname
      navigate(from ?? '/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role: 'admin' | 'staff') => {
    setEmail(role === 'admin' ? 'admin@milkcare.com' : 'staff@milkcare.com')
    setPassword('123456')
    setError('')
  }

  return (
    <div className={styles.page}>
      {/* Background decoration */}
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </div>

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <IconMilk size={28} color="var(--accent)" />
          </div>
          <div>
            <div className={styles.logoTitle}>MilkCare</div>
            <div className={styles.logoSub}>Management System</div>
          </div>
        </div>

        <h1 className={styles.heading}>Đăng nhập</h1>
        <p className={styles.sub}>Vui lòng đăng nhập để tiếp tục</p>

        {/* Demo hint */}
        <div className={styles.demoBox}>
          <span className={styles.demoLabel}>Demo nhanh:</span>
          <button className={styles.demoBtn} type="button" onClick={() => fillDemo('admin')}>
            Admin
          </button>
          <button className={styles.demoBtn} type="button" onClick={() => fillDemo('staff')}>
            Staff
          </button>
          <span className={styles.demoPass}>pass: 123456</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              type="email"
              placeholder="admin@milkcare.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label}>Mật khẩu</label>
            <div className={styles.pwWrap}>
              <input
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw((p) => !p)}
              >
                <IconEye size={15} color={showPw ? 'var(--accent)' : 'var(--muted)'} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <div className={styles.error}>{error}</div>}

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Role info */}
        <div className={styles.roleInfo}>
          <div className={styles.roleItem}>
            <span className={styles.roleDot} style={{ background: 'var(--accent)' }} />
            <span><strong>Admin</strong> — Quản lý toàn hệ thống, báo cáo doanh thu</span>
          </div>
          <div className={styles.roleItem}>
            <span className={styles.roleDot} style={{ background: 'var(--teal)' }} />
            <span><strong>Staff</strong> — Xử lý đơn hàng, kho, tư vấn khách hàng</span>
          </div>
        </div>
      </div>
    </div>
  )
}
