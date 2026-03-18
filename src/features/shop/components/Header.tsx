import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(false)

  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase()

  const handleLogout = () => {
    logout()
    setOpenMenu(false)
    navigate('/login', { replace: true })
  }

  const isLoggedIn = !!user

  return (
    <header className="bg-white dark:bg-[#2d1b20] sticky top-0 z-50 border-b border-[#fce7ef] dark:border-[#3d262b]">
      <div className="px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-8 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2 text-text-main dark:text-white group">
            <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px]">child_care</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden md:block">
              Mom&amp;Baby<span className="text-primary">Care</span>
            </h1>
          </Link>
        </div>

        <div className="flex-1 max-w-[600px] hidden md:block">
          <label className="flex w-full items-center rounded-xl bg-[#fff0f4] dark:bg-[#3d262b] px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <span className="material-symbols-outlined text-primary dark:text-[#ff8fa3]">search</span>
            <input
              className="w-full bg-transparent border-none text-sm text-text-main dark:text-white placeholder:text-primary/70 dark:placeholder:text-[#ff8fa3]/70 focus:ring-0"
              placeholder="Tìm kiếm sữa, bỉm, vitamin..."
              type="text"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 relative">
          <button className="md:hidden p-2 text-text-main dark:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-symbols-outlined">search</span>
          </button>
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl hover:bg-[#fff0f4] dark:hover:bg-white/5 transition-colors text-text-main dark:text-white group"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute top-1.5 right-1.5 size-2.5 bg-primary rounded-full border-2 border-white dark:border-[#2d1b20]" />
          </Link>

          {!isLoggedIn && (
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#fff0f4] dark:hover:bg-white/5 transition-colors text-text-main dark:text-white font-bold text-sm"
            >
              <span className="material-symbols-outlined">account_circle</span>
              <span className="hidden sm:block">Đăng nhập</span>
            </Link>
          )}

          {isLoggedIn && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((v) => !v)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#fff0f4] hover:bg-primary/20 text-text-main text-sm font-semibold transition-colors"
              >
                <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {initials ?? 'ME'}
                </div>
                <span className="hidden sm:block max-w-[120px] truncate">
                  {user?.name ?? 'Thành viên'}
                </span>
                <span className="material-symbols-outlined text-[18px] text-primary">
                  expand_more
                </span>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#fce7ef] rounded-2xl shadow-lg shadow-pink-100/60 py-2 z-50">
                  <div className="px-3 pb-2 border-b border-pink-50">
                    <div className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Tài khoản
                    </div>
                    <div className="text-sm font-bold text-text-main truncate">
                      {user?.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-rose-500 font-semibold hover:bg-rose-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="hidden md:flex justify-center border-t border-[#fce7ef] dark:border-[#3d262b] bg-white/50 dark:bg-[#2d1b20]/50 backdrop-blur-sm">
        <div className="flex gap-8 py-3">
          <Link
            to="/"
            className="text-text-main dark:text-gray-200 text-sm font-bold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5"
          >
            Trang chủ
          </Link>
          <Link
            to="/products"
            className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5"
          >
            Sản phẩm
          </Link>
          <Link
            to="/blog"
            className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5"
          >
            Bài viết sức khỏe
          </Link>
          <Link
            to="/account/orders"
            className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5"
          >
            Đơn hàng của tôi
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Header;
