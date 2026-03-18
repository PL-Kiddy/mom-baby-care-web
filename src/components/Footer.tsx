import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#2d1b20] border-t border-[#fce7ef] dark:border-[#3d262b] pt-16 pb-8">
      <div className="px-4 md:px-10 lg:px-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-text-main dark:text-white">
              <div className="size-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">child_care</span>
              </div>
              <span className="text-lg font-bold">
                Mom&amp;Baby<span className="text-primary">Care</span>
              </span>
            </div>
            <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed font-medium">
              Hệ thống cửa hàng mẹ và bé uy tín hàng đầu. Cam kết sản phẩm chính hãng, an toàn tuyệt đối cho sức khỏe của bé yêu.
            </p>
            <div className="flex gap-3 mt-2">
              <a className="size-8 rounded-full bg-[#fff0f4] dark:bg-white/10 flex items-center justify-center hover:bg-primary hover:text-[#4a1d26] transition-colors text-text-muted" href="#">
                <span className="material-symbols-outlined text-[18px]">public</span>
              </a>
              <a className="size-8 rounded-full bg-[#fff0f4] dark:bg-white/10 flex items-center justify-center hover:bg-primary hover:text-[#4a1d26] transition-colors text-text-muted" href="#">
                <span className="material-symbols-outlined text-[18px]">share</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-text-main dark:text-white font-bold mb-4">Về chúng tôi</h4>
            <ul className="flex flex-col gap-3 text-sm text-text-muted dark:text-gray-400 font-medium">
              <li><a className="hover:text-primary transition-colors" href="#">Giới thiệu</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Hệ thống cửa hàng</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Tuyển dụng</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-main dark:text-white font-bold mb-4">Chính sách</h4>
            <ul className="flex flex-col gap-3 text-sm text-text-muted dark:text-gray-400 font-medium">
              <li><a className="hover:text-primary transition-colors" href="#">Chính sách đổi trả</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Chính sách bảo mật</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Điều khoản dịch vụ</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Giao hàng &amp; thanh toán</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-main dark:text-white font-bold mb-4">Liên hệ</h4>
            <ul className="flex flex-col gap-4 text-sm text-text-muted dark:text-gray-400 font-medium">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                <span>123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">call</span>
                <span>1900 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                <span>hotro@mombabycare.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#fce7ef] dark:border-[#3d262b] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 font-medium">© 2024 Mom&amp;BabyCare. All rights reserved.</p>
          <div className="flex gap-4">
            <div className="h-6 w-10 bg-[#fce7ef] dark:bg-white/10 rounded"></div>
            <div className="h-6 w-10 bg-[#fce7ef] dark:bg-white/10 rounded"></div>
            <div className="h-6 w-10 bg-[#fce7ef] dark:bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
