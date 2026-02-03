import React from 'react';

const categories = [
  {
    icon: 'water_drop',
    bgColor: 'bg-[#f0f9ff] dark:bg-blue-900/20',
    iconColor: 'text-blue-400',
    title: 'Sữa bột',
    subtitle: 'Cho bé 0-3 tuổi',
  },
  {
    icon: 'pregnant_woman',
    bgColor: 'bg-[#fff7ed] dark:bg-orange-900/20',
    iconColor: 'text-orange-400',
    title: 'Sữa bầu',
    subtitle: 'Dinh dưỡng cho mẹ',
  },
  {
    icon: 'medication_liquid',
    bgColor: 'bg-[#fdf2f8] dark:bg-pink-900/20',
    iconColor: 'text-pink-400',
    title: 'Vitamin',
    subtitle: 'Tăng đề kháng',
  },
  {
    icon: 'restaurant',
    bgColor: 'bg-[#f0fdf4] dark:bg-green-900/20',
    iconColor: 'text-green-500',
    title: 'Đồ ăn dặm',
    subtitle: 'Bột, bánh, snack',
  },
];

const CategoriesSection: React.FC = () => {
  return (
    <section className="px-4 md:px-10 lg:px-40 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between px-2">
          <h2 className="text-text-main dark:text-white text-2xl md:text-[28px] font-extrabold leading-tight">
            Danh mục nổi bật
          </h2>
          <a className="text-primary font-bold text-sm hover:text-primary-hover hover:underline flex items-center" href="#">
            Xem tất cả <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <a
              key={index}
              className="group flex flex-col items-center gap-4 p-6 bg-white dark:bg-[#2d1b20] rounded-2xl border border-[#fce7ef] dark:border-[#3d262b] hover:shadow-lg hover:border-primary/40 transition-all duration-300"
              href="#"
            >
              <div className={`size-24 rounded-full ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <span className={`material-symbols-outlined text-4xl ${category.iconColor}`}>
                  {category.icon}
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-text-main dark:text-white font-bold text-lg mb-1">
                  {category.title}
                </h3>
                <p className="text-text-muted dark:text-gray-400 text-xs font-medium">
                  {category.subtitle}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
