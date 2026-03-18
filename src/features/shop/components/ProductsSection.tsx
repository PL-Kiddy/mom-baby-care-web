import React from 'react'
import { MOCK_SHOP_PRODUCTS } from '../data/mockShopData'

const ProductsSection: React.FC = () => {
  return (
    <section className="px-4 md:px-10 lg:px-40 py-8 bg-white dark:bg-[#25161a]">
      <div className="flex flex-col gap-8 py-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-text-main dark:text-white text-3xl font-extrabold mb-3">
            Sản phẩm bán chạy
          </h2>
          <p className="text-text-muted dark:text-gray-400 font-medium">
            Những sản phẩm được các mẹ tin dùng nhiều nhất trong tuần qua.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_SHOP_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-background-light dark:bg-[#2d1b20] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-primary/30"
            >
              <div className="relative aspect-square overflow-hidden bg-white dark:bg-white/5 p-4 flex items-center justify-center">
                {product.badgeText && (
                  <span className={`absolute top-3 left-3 ${product.badgeColor ?? 'bg-rose-500'} text-white text-xs font-bold px-2 py-1 rounded-md`}>
                    {product.badgeText}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute bottom-3 right-3 size-10 bg-primary text-[#4a1d26] rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-primary-hover">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-yellow-400 text-[18px]">star</span>
                  <span className="text-xs font-semibold text-text-muted dark:text-gray-400">
                    {product.rating} ({product.reviews}{product.reviews >= 200 ? '+' : ''} đánh giá)
                  </span>
                </div>
                <h3 className="text-text-main dark:text-white font-bold text-base leading-tight mb-2 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    {product.originalPrice && (
                      <p className="text-gray-400 text-xs line-through font-medium">
                        {product.originalPrice}
                      </p>
                    )}
                    <p className="text-primary font-extrabold text-lg">{product.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button className="px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-[#4a1d26] font-bold transition-colors">
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
