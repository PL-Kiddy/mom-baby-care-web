import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="px-4 md:px-10 lg:px-40 py-8 md:py-12">
      <div className="@container bg-[#fff0f5] dark:bg-[#2d1b20] rounded-[2rem] overflow-hidden p-6 md:p-12 relative isolate shadow-sm ring-1 ring-[#fce7ef] dark:ring-white/5">
        <div className="absolute -top-24 -right-24 size-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 size-48 bg-purple-300/20 rounded-full blur-2xl -z-10"></div>
        
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 flex flex-col gap-6 text-center md:text-left z-10">
            <div>
              <span className="inline-block px-3 py-1 bg-white dark:bg-white/10 text-primary text-xs font-extrabold uppercase tracking-wider rounded-full mb-4 border border-primary/20 shadow-sm">
                Tháng vàng cho mẹ
              </span>
              <h2 className="text-text-main dark:text-white text-3xl md:text-5xl font-extrabold leading-[1.15] tracking-tight mb-4">
                Dinh dưỡng trọn vẹn <br />
                <span className="text-primary">cho Mẹ &amp; Bé</span>
              </h2>
              <p className="text-text-muted dark:text-gray-300 text-base md:text-lg max-w-lg mx-auto md:mx-0 font-medium">
                Nhập mã <span className="font-bold text-text-main dark:text-white bg-primary/20 px-1 rounded">MOM20</span> để được giảm ngay 20% cho các dòng sữa bầu cao cấp trong tháng này.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button className="bg-primary hover:bg-primary-hover text-[#4a1d26] font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                <span>Mua ngay</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <button className="bg-white dark:bg-white/10 hover:bg-[#fff5f7] dark:hover:bg-white/20 text-text-main dark:text-white font-bold py-3 px-8 rounded-xl transition-all border border-[#fce7ef] dark:border-white/10">
                Xem chi tiết
              </button>
            </div>

            <div className="flex items-center gap-6 justify-center md:justify-start mt-2 text-sm text-text-muted dark:text-gray-400 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span>100% Chính hãng</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
                <span>Freeship 0đ</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center md:justify-end">
            <div className="relative w-full max-w-[450px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 bg-gray-200 dark:bg-gray-800">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#fff1f2] to-[#fbcfe8] dark:from-[#3d262b] dark:to-[#2d1b20] flex items-center justify-center">
                <span className="material-symbols-outlined text-9xl text-primary/30">family_star</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
