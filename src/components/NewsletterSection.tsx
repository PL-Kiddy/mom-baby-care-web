import React from 'react';

const NewsletterSection: React.FC = () => {
  return (
    <section className="px-4 md:px-10 lg:px-40 py-12 bg-primary/10 dark:bg-primary/5 mt-8 border-y border-[#fce7ef] dark:border-transparent">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex size-16 bg-white dark:bg-[#2d1b20] rounded-full items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-3xl">mail</span>
          </div>
          <div>
            <h3 className="text-text-main dark:text-white text-2xl font-bold">Đăng ký nhận tin</h3>
            <p className="text-text-muted dark:text-gray-300 font-medium">
              Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên.
            </p>
          </div>
        </div>
        <div className="w-full md:w-auto flex-1 max-w-md">
          <form className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 rounded-xl border border-[#fce7ef] dark:border-gray-700 bg-white dark:bg-[#2d1b20] focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder:text-text-muted/50"
              placeholder="Nhập email của mẹ..."
              type="email"
            />
            <button className="bg-primary hover:bg-primary-hover text-[#4a1d26] font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-primary/20">
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
