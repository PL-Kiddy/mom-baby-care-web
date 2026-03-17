import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
    address: {
      street: '',
      ward: '',
      district: '',
      city: '',
      country: 'Việt Nam',
      zipcode: '',
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1] as keyof typeof formData.address;
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirm_password) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setLoading(true);
    try {
      await api.members.register({
        name: formData.name,
        gender: formData.gender,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        confirm_password: formData.confirm_password,
        date_of_birth: formData.date_of_birth
          ? new Date(formData.date_of_birth).toISOString()
          : new Date().toISOString(),
        address: formData.address,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light font-display min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl shadow-pink-100/50 p-8 md:p-10 border border-pink-50 relative overflow-hidden">
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
            <h2 className="text-xl font-extrabold text-text-main">Tạo tài khoản mới</h2>
            <p className="text-text-muted text-sm font-medium mt-1">
              Đăng ký để bắt đầu hành trình chăm sóc bé yêu
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium">
            Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản. Đang chuyển đến trang đăng nhập...
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {error && (
            <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Full Name Input */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-bold text-text-main ml-1">
              Họ và tên
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                person
              </span>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nguyễn Thị Mẹ"
                className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label htmlFor="gender" className="text-sm font-bold text-text-main ml-1">
              Giới tính
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-bold text-text-main ml-1">
              Email
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                mail
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="me@vidu.com"
                className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
                required
              />
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-1">
            <label htmlFor="phone_number" className="text-sm font-bold text-text-main ml-1">
              Số điện thoại
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                phone
              </span>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="0912345678"
                className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
                required
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-1">
            <label htmlFor="date_of_birth" className="text-sm font-bold text-text-main ml-1">
              Ngày sinh
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main"
            />
          </div>

          {/* Address - Street */}
          <div className="space-y-1">
            <label htmlFor="address.street" className="text-sm font-bold text-text-main ml-1">
              Địa chỉ (đường, số nhà)
            </label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="47/42 Nguyễn Văn Đậu"
              className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="address.ward" className="text-sm font-bold text-text-main ml-1">
                Phường/Xã
              </label>
              <input
                type="text"
                name="address.ward"
                value={formData.address.ward}
                onChange={handleChange}
                placeholder="Phường 6"
                className="w-full px-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl text-text-main"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="address.district" className="text-sm font-bold text-text-main ml-1">
                Quận/Huyện
              </label>
              <input
                type="text"
                name="address.district"
                value={formData.address.district}
                onChange={handleChange}
                placeholder="Bình Thạnh"
                className="w-full px-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl text-text-main"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="address.city" className="text-sm font-bold text-text-main ml-1">
                Thành phố
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="Hồ Chí Minh"
                className="w-full px-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl text-text-main"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="address.zipcode" className="text-sm font-bold text-text-main ml-1">
                Mã bưu điện
              </label>
              <input
                type="text"
                name="address.zipcode"
                value={formData.address.zipcode}
                onChange={handleChange}
                placeholder="700000"
                className="w-full px-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl text-text-main"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-bold text-text-main ml-1">
              Mật khẩu
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                lock
              </span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
                required
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label htmlFor="confirm_password" className="text-sm font-bold text-text-main ml-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
                lock_reset
              </span>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#fff9fa] border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text-main placeholder:text-text-muted/40 transition-all"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-primary-dark hover:bg-primary disabled:opacity-70 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] mt-2"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
          </button>
        </form>

        {/* Social Register */}
        <div className="mt-8 relative z-10">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-50"></div>
            </div>
            <span className="relative px-4 bg-white text-xs font-bold text-text-muted uppercase tracking-wider">
              Hoặc đăng ký bằng
            </span>
          </div>

          <div className="flex justify-center gap-4">
            {/* Google Register */}
            <button
              type="button"
              aria-label="Đăng ký bằng Google"
              className="size-12 rounded-full border border-pink-100 flex items-center justify-center hover:bg-pink-50 transition-colors group shadow-sm"
            >
              <svg className="size-6 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.90 3.33-2.01 4.46-1.27 1.27-3.23 2.32-6.4 2.32-5.11 0-9.18-4.13-9.18-9.25s4.07-9.25 9.18-9.25c2.77 0 4.77 1.08 6.27 2.51l2.31-2.31C18.42 1.07 15.68 0 12.48 0 6.95 0 2.42 4.53 2.42 10.06s4.53 10.06 10.06 10.06c2.97 0 5.22-0.98 6.98-2.81 1.81-1.81 2.38-4.38 2.38-6.39 0-0.61-0.05-1.19-0.14-1.7h-9.22z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-10 text-center relative z-10">
          <p className="text-sm text-text-muted font-medium">
            Đã có tài khoản?
            <Link
              to="/login"
              className="text-primary font-bold hover:text-primary-dark transition-colors ml-1"
            >
              Đăng nhập ngay
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

export default Register;

