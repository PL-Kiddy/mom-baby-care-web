import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../../../shared/hooks/useAuth'

export default function AccountProfilePage() {
  const { user } = useAuth()

  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-[960px] mx-auto px-4 md:px-8 lg:px-0 py-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Tài khoản của tôi</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-6">
          Thông tin tài khoản
        </h1>

        <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {user?.name
                ?.split(' ')
                .map((w) => w[0])
                .slice(-2)
                .join('')
                .toUpperCase() ?? 'ME'}
            </div>
            <div>
              <div className="font-bold text-text-main">{user?.name ?? 'Thành viên'}</div>
              <div className="text-sm text-text-muted">{user?.email ?? 'member@gmail.com'}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-pink-50">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1">
                Họ và tên
              </label>
              <input
                disabled
                value={user?.name ?? ''}
                className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1">
                Email
              </label>
              <input
                disabled
                value={user?.email ?? ''}
                className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
              />
            </div>
          </div>

          <p className="text-xs text-text-muted mt-2">
            Phần chỉnh sửa chi tiết hồ sơ sẽ được kết nối với backend trong các bước tiếp theo.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

