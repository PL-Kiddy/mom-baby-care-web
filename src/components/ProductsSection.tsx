import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Product } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';

const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

const ProductsSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.products
      .getAll()
      .then((res) => setProducts(res.result || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="px-4 md:px-10 lg:px-40 py-8 bg-white dark:bg-[#25161a]">
        <div className="text-center py-12 text-text-muted">Đang tải sản phẩm...</div>
      </section>
    );
  }

  const displayProducts = products.slice(0, 8);

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
          {displayProducts.map((product) => (
            <div
              key={product._id}
              className="group flex flex-col bg-background-light dark:bg-[#2d1b20] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-primary/30"
            >
              <div className="relative aspect-square overflow-hidden bg-white dark:bg-white/5 p-4 flex items-center justify-center">
                <Link to={`/products/${product._id}`} className="absolute inset-0 z-0" />
                <img
                  src={product.image || '/placeholder-product.png'}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=No+Image';
                  }}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="absolute bottom-3 right-3 z-10 size-10 bg-primary text-[#4a1d26] rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-primary-hover"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-yellow-400 text-[18px]">star</span>
                  <span className="text-xs font-semibold text-text-muted dark:text-gray-400">
                    {product.rating?.toFixed(1) || '0'} ({product.sold || 0} đã bán)
                  </span>
                </div>
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-text-main dark:text-white font-bold text-base leading-tight mb-2 line-clamp-2 min-h-[40px] hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto flex items-end justify-between">
                  <p className="text-primary font-extrabold text-lg">{formatPrice(product.price)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Link
            to="/products"
            className="px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-[#4a1d26] font-bold transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
