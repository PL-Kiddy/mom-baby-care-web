import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng nhập
    console.log('Login:', { identifier, password });
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
            <h2 className="text-xl font-extrabold text-text-main">Chào mừng mẹ quay trở lại</h2>
            <p className="text-text-muted text-sm font-medium mt-1">
              Đăng nhập để tiếp tục hành trình chăm sóc bé yêu
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Email/Phone Input */}
          <div className="space-y-1">
            <label htmlFor="identifier" className="text-sm font-bold text-text-main ml-1">
              Email hoặc Số điện thoại
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                alternate_email
              </span>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="mẹ@vidu.com"
                className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
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
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary-dark hover:bg-primary text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-2"
          >
            Đăng nhập
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-8 relative z-10">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-50"></div>
            </div>
            <span className="relative px-4 bg-white text-xs font-bold text-text-muted uppercase tracking-wider">
              Hoặc đăng nhập bằng
            </span>
          </div>

          <div className="flex justify-center gap-4">
            {/* Google Login */}
            <button
              type="button"
              aria-label="Đăng nhập bằng Google"
              className="size-12 rounded-full border border-pink-100 flex items-center justify-center hover:bg-pink-50 transition-colors group shadow-sm"
            >
              <svg className="size-6 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.90 3.33-2.01 4.46-1.27 1.27-3.23 2.32-6.4 2.32-5.11 0-9.18-4.13-9.18-9.25s4.07-9.25 9.18-9.25c2.77 0 4.77 1.08 6.27 2.51l2.31-2.31C18.42 1.07 15.68 0 12.48 0 6.95 0 2.42 4.53 2.42 10.06s4.53 10.06 10.06 10.06c2.97 0 5.22-0.98 6.98-2.81 1.81-1.81 2.38-4.38 2.38-6.39 0-0.61-0.05-1.19-0.14-1.7h-9.22z"></path>
              </svg>
            </button>

            {/* Facebook Login */}
            <button
              type="button"
              aria-label="Đăng nhập bằng Facebook"
              className="size-12 rounded-full border border-pink-100 flex items-center justify-center hover:bg-pink-50 transition-colors group shadow-sm"
            >
              <svg className="size-6 text-blue-600 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-0.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Register Link */}
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

export default Login;
