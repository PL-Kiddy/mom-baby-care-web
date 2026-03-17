import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, type Product } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';

const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    api.products
      .getById(id)
      .then((res) => setProduct(res.result))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-text-muted">Đang tải...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4">
          <p className="text-text-muted">Không tìm thấy sản phẩm</p>
          <Link to="/products" className="text-primary font-bold hover:underline">
            Quay lại danh sách
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => addToCart(product, quantity);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="aspect-square rounded-2xl bg-white dark:bg-white/5 border border-secondary overflow-hidden p-8 flex items-center justify-center">
            <img
              src={product.image || 'https://via.placeholder.com/400'}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image'; }}
            />
          </div>

          <div className="flex flex-col">
            {product.brand && (
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3 uppercase">
                {product.brand}
              </span>
            )}
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-primary">
                <span className="material-symbols-outlined">star</span>
                <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  ({product.sold || 0} đã bán)
                </span>
              </div>
            </div>

            <div className="p-6 bg-secondary/30 dark:bg-white/5 rounded-2xl mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-black text-primary">{formatPrice(product.price)}</span>
              </div>
            </div>

            {product.description && (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-bold">Số lượng:</span>
              <div className="flex items-center bg-background-light dark:bg-white/5 rounded-full border border-[#fce7ef] dark:border-white/10">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="size-10 flex items-center justify-center text-text-muted hover:text-primary"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="size-10 flex items-center justify-center text-text-muted hover:text-primary"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              {product.stock !== undefined && (
                <span className="text-sm text-text-muted">Còn {product.stock} sản phẩm</span>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
                Thêm vào giỏ hàng
              </button>
              <Link
                to="/cart"
                className="flex-1 bg-primary/20 text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/30 transition-all"
              >
                Mua ngay
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
