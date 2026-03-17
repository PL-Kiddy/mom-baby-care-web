import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('forgot_password_token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!token) return;
    setLoading(true);
    try {
      await api.members.resetPassword({
        forgot_password_token: token,
        password,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Đặt lại mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

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
              {success
                ? 'Mật khẩu đã được đổi thành công. Đang chuyển đến trang đăng nhập...'
                : 'Nhập mật khẩu mới cho tài khoản của bạn'}
            </p>
          </div>
        </div>

        {!success && token ? (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {error && (
              <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-bold text-text-main ml-1">
                Mật khẩu mới
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60">
                  lock
                </span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="confirm" className="text-sm font-bold text-text-main ml-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60">
                  lock
                </span>
                <input
                  type="password"
                  id="confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-dark hover:bg-primary disabled:opacity-70 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-2"
            >
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        ) : success ? (
          <div className="relative z-10 text-center py-4">
            <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-600 text-[40px]">check_circle</span>
            </div>
            <Link to="/login" className="text-primary font-bold hover:text-primary-dark">
              Đăng nhập ngay
            </Link>
          </div>
        ) : !token ? (
          <div className="relative z-10 text-center py-4">
            <Link to="/forgot-password" className="text-primary font-bold hover:text-primary-dark">
              Gửi lại email đặt lại mật khẩu
            </Link>
          </div>
        ) : null}
      </div>

      <Link
        to="/"
        className="mt-8 flex items-center gap-1.5 text-text-muted text-sm font-bold hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">keyboard_backspace</span>
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default ResetPassword;
