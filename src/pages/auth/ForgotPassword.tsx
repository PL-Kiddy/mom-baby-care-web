import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.members.forgotPassword({ email: email.trim() });
      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Không tìm thấy email. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light font-display min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl shadow-pink-100/50 p-8 md:p-10 border border-pink-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 size-32 bg-primary/5 rounded-full blur-2xl"></div>

        {/* Header */}
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
            <h2 className="text-xl font-extrabold text-text-main">Quên mật khẩu?</h2>
            <p className="text-text-muted text-sm font-medium mt-1">
              {!isSubmitted
                ? 'Nhập email đăng ký để nhận link đặt lại mật khẩu'
                : 'Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn'}
            </p>
          </div>
        </div>

        {!isSubmitted ? (
          <>
            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {error && (
                <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              {/* Email Input */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-bold text-text-main ml-1">
                  Email
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                    alternate_email
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mẹ@vidu.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-dark hover:bg-primary disabled:opacity-70 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-2"
              >
                {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center relative z-10">
              <p className="text-sm text-text-muted font-medium">
                Đã nhớ mật khẩu?
                <Link
                  to="/login"
                  className="text-primary font-bold hover:text-primary-dark transition-colors ml-1"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="relative z-10 space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="size-16 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600 text-[40px]">
                      mark_email_read
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-main mb-2">Email đã được gửi!</h3>
                <p className="text-sm text-text-muted">
                  Vui lòng kiểm tra email{' '}
                  <span className="font-bold text-text-main">{email}</span> và làm theo hướng
                  dẫn để đặt lại mật khẩu.
                </p>
                <p className="text-xs text-text-muted mt-3">
                  Không nhận được email? Kiểm tra thư mục spam hoặc
                </p>
              </div>

              <button
                onClick={() => { setIsSubmitted(false); setError(null); }}
                className="w-full bg-background-light text-primary font-bold py-3 rounded-xl hover:bg-pink-100 transition-all"
              >
                Gửi lại email
              </button>

              <Link
                to="/login"
                className="block text-center text-sm text-primary font-bold hover:text-primary-dark transition-colors"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Back to Home Link */}
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

export default ForgotPassword;

