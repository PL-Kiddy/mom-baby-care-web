import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-[#2d1b20] sticky top-0 z-50 border-b border-[#fce7ef] dark:border-[#3d262b]">
      <div className="px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-8 flex-shrink-0">
          <a className="flex items-center gap-2 text-text-main dark:text-white group" href="#">
            <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[28px]">child_care</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden md:block">
              Mom&amp;Baby<span className="text-primary">Care</span>
            </h1>
          </a>
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
          <button className="relative p-2.5 rounded-xl hover:bg-[#fff0f4] dark:hover:bg-white/5 transition-colors text-text-main dark:text-white group">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute top-1.5 right-1.5 size-2.5 bg-primary rounded-full border-2 border-white dark:border-[#2d1b20]"></span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#fff0f4] dark:hover:bg-white/5 transition-colors text-text-main dark:text-white font-bold text-sm">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="hidden sm:block">Đăng nhập</span>
          </button>
        </div>
      </div>

      <nav className="hidden md:flex justify-center border-t border-[#fce7ef] dark:border-[#3d262b] bg-white/50 dark:bg-[#2d1b20]/50 backdrop-blur-sm">
        <div className="flex gap-8 py-3">
          <a className="text-text-main dark:text-gray-200 text-sm font-bold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5" href="#">
            Trang chủ
          </a>
          <a className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5" href="#">
            Sữa cho mẹ
          </a>
          <a className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5" href="#">
            Sữa cho bé
          </a>
          <a className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5" href="#">
            Ăn dặm
          </a>
          <a className="text-text-main dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5" href="#">
            Bài viết sức khỏe
          </a>
          <a className="text-rose-500 text-sm font-extrabold hover:text-rose-600 transition-colors flex items-center gap-1" href="#">
            <span className="material-symbols-outlined text-[16px]">local_offer</span>
            Ưu đãi
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
