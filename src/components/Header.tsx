import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
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

        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 text-text-main dark:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-symbols-outlined">search</span>
          </button>
          <Link 
            to="/cart" 
            className="relative p-2.5 rounded-xl hover:bg-[#fff0f4] dark:hover:bg-white/5 transition-colors text-text-main dark:text-white group"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-primary rounded-full border-2 border-white dark:border-[#2d1b20] text-[10px] font-bold flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link 
              to="/account" 
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#fff0f4] dark:hover:bg-white/5 transition-colors text-text-main dark:text-white font-bold text-sm"
            >
              <span className="material-symbols-outlined">account_circle</span>
              <span className="hidden sm:block">Tài khoản</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#fff0f4] dark:hover:bg-white/5 transition-colors text-text-main dark:text-white font-bold text-sm"
            >
              <span className="material-symbols-outlined">account_circle</span>
              <span className="hidden sm:block">Đăng nhập</span>
            </Link>
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
          <button
            className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5"
          >
            Sữa cho mẹ
          </button>
          <Link
            to="/products"
            className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5"
          >
            Danh sách sản phẩm
          </Link>
          <button
            className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5"
          >
            Ăn dặm
          </button>
          <Link
            to="/posts"
            className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5"
          >
            Bài viết sức khỏe
          </Link>
          <button className="text-rose-500 text-sm font-extrabold hover:text-rose-600 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">local_offer</span>
            Ưu đãi
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
