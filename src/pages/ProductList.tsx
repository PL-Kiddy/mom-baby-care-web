import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, type Product } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';

const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    api.products
      .getAll()
      .then((res) => setProducts(res.result || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <Header />

        {/* Main Content Layout */}
        <main className="flex flex-1 px-6 lg:px-20 py-8 gap-8">
          {/* Sidebar Filter */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">category</span> Danh mục
              </h3>
              <div className="flex flex-col gap-1">
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white font-medium"
                >
                  <span className="material-symbols-outlined text-xl">liquor</span> Sữa bột
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">pregnant_woman</span> Sữa bầu
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">pill</span> Vitamin
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">set_meal</span> Đồ ăn dặm
                </a>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700" />

            <div>
              <h3 className="text-lg font-bold mb-4">Khoảng giá</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary border-slate-300"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    Dưới 500.000đ
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary border-slate-300"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    500.000đ - 1.000.000đ
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary border-slate-300"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    Trên 1.000.000đ
                  </span>
                </label>
              </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700" />

            <div>
              <h3 className="text-lg font-bold mb-4">Thương hiệu</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary border-slate-300"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">Abbott</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary border-slate-300"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">Enfa</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary border-slate-300"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">Meiji</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary border-slate-300"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    Vinamilk
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Listing */}
          <div className="flex-1">
            {/* Breadcrumbs & Sort */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                  <a href="#" className="hover:text-primary">
                    Trang chủ
                  </a>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <span className="text-slate-900 dark:text-slate-100 font-medium">
                    Sữa bột cho bé
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Sữa bột cho bé
                </h1>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary/50"
                />
                <span className="text-sm text-slate-500">Sắp xếp theo:</span>
                <select className="rounded-lg border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-sm focus:ring-primary">
                  <option>Mới nhất</option>
                  <option>Giá thấp đến cao</option>
                  <option>Giá cao đến thấp</option>
                  <option>Bán chạy nhất</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="col-span-full text-center py-16 text-text-muted">Đang tải sản phẩm...</div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => (
              <div key={product._id} className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <Link to={`/products/${product._id}`}>
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={product.image || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image'; }}
                    />
                  </Link>
                  <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">favorite</span>
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  {product.brand && <p className="text-xs text-slate-400 uppercase font-semibold mb-1">{product.brand}</p>}
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-slate-800 dark:text-slate-100 font-bold text-base mb-2 line-clamp-2 hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-sm text-yellow-400">star</span>
                    <span className="text-xs text-slate-400 ml-1">({product.sold || 0} đã bán)</span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-primary text-xl font-bold">{formatPrice(product.price)}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-primary text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center items-center gap-2">
              <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface dark:hover:bg-slate-800 text-slate-500">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-white font-bold">
                1
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                2
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                3
              </button>
              <span className="px-2">...</span>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                12
              </button>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface dark:hover:bg-slate-800 text-slate-500">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </main>

      <Footer />
    </div>
  );
};

export default ProductList;

