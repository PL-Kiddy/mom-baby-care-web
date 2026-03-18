import React from 'react';

interface Product {
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: { text: string; color: string };
}

const products: Product[] = [
  {
    name: 'Sữa non Alpha Lipid Lifeline 450g',
    price: '1.280.000đ',
    originalPrice: '1.500.000đ',
    discount: '-15%',
    rating: 4.9,
    reviews: 128,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFhC6G5Ov2gEaewKcm80Tk8ggEsveikLA7jjdBZ9R14nhrvW3n0G6mmd120i8Z2pKcLYZ04XCmQOrl5Ec1LuM4D5Xp5xJs8Tuol1SPk9x-du2cCv6-vXLgXGQ6OTiP4GttpsrKBAB64vQgVuwZAPD_BFQZuy3CHB4Uh0lhMdObOYuzrTGvLIQigDDAlVPt0Qf5q4DparIpKFiTH5I7XDvhS9N4f5K1bQ6WdiWK0WUsVLO-kMkcrFROSNCcfJ11aRezBObWaEg3X6Xw',
    badge: { text: '-15%', color: 'bg-rose-500' },
  },
  {
    name: 'Sữa Meiji nội địa Nhật Bản số 0 (0-1 tuổi)',
    price: '550.000đ',
    rating: 5.0,
    reviews: 85,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYu9wFI2w9Kr8qDGm1DHsJRMDRPIsQ0xnhEKdF43mgEX0DhRWa6r8OblY8KO5JM3dY4GqUN-hcrSwA7iooBJh3N_gxNU1jnfOmDVlgItSLXvK6BO_QbWMD4xfmYzOVIaig2lIUXew8pZP9hg1jHSm1cJWytbDtcFCSWHde5sKe_bd9cOf1azrW6x-JhYyekJ2IYhF9bINZn7AcM1_Eb_q23mcXP_z32ew8Ktgy60NA_soj84JdztCVH5BRWnEfZSh-R2SYAdYcgFAS',
  },
  {
    name: 'Sữa Similac 5G số 4 900g (2-6 tuổi)',
    price: '820.000đ',
    rating: 4.8,
    reviews: 200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-CVaLoDkC_e3pLGdBkner4LC1NJ7-KSvdOvTghfUPs4KzH9v7F4x7NysG_4kUZ0nZ5tiUZRF1VMjWu_6on_U9DoIBYB9yenpgw4rTFT0L34HGGAjUzJPf7Z7-T1pC94NVIwSSL5N3NYHHHn57vR-iq0AlmOuwojsAApCehC5f33cmhcFiPPxcEPNvaBf9wRjuI__TTMBAmq5Aw-gY7mAa6FaXqYIrGYLs9JkN5NU-aFkV-Y0p28tAEx-XrT_Cuh5eDKiScO8UavxX',
    badge: { text: 'Mới', color: 'bg-blue-400' },
  },
  {
    name: 'Vitamin D3K2 LineaBon tăng chiều cao',
    price: '295.000đ',
    originalPrice: '350.000đ',
    rating: 4.9,
    reviews: 56,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvj_n_L3sW5BuN5sE5iPdrQjDktES93xlJqLvwxcNe10jftXDKmR5qCaZME71uO0XQtp_6RyIttJrz6rddvw92pYOrXS1d4Ww6tAx9Yb1lffbDWEmziNSF_ouOPF2-NqgQqWCyJKlOIK3R2X5FHDz1hafcGgFq4Fxx7PhJQN1zPXo9MpiSoB2wZGleE8oB3t360yLe5Je8z68fkhI31AJ3OsqC7BGdOC3x90g-EAE6z-_WhtNZ9VqJ97L-Xr6DU-ii_0AduO5r2lGF',
  },
];

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
          {products.map((product, index) => (
            <div
              key={index}
              className="group flex flex-col bg-background-light dark:bg-[#2d1b20] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-primary/30"
            >
              <div className="relative aspect-square overflow-hidden bg-white dark:bg-white/5 p-4 flex items-center justify-center">
                {product.badge && (
                  <span className={`absolute top-3 left-3 ${product.badge.color} text-white text-xs font-bold px-2 py-1 rounded-md`}>
                    {product.badge.text}
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
