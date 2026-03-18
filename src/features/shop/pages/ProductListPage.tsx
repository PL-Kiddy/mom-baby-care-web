import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getAllProducts, type ShopProductWithMedia } from '../services/productService'

export default function ProductListPage() {
  const [products, setProducts] = useState<ShopProductWithMedia[]>([])

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [])

  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 py-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Tất cả sản phẩm</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-1">
              Tất cả sản phẩm
            </h1>
            <p className="text-text-muted text-sm">
              Khám phá các sản phẩm dinh dưỡng cho mẹ và bé.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="px-3 py-2 rounded-xl border border-[#fce7ef] bg-white text-sm">
              <option>Sắp xếp: Phổ biến nhất</option>
              <option>Giá tăng dần</option>
              <option>Giá giảm dần</option>
              <option>Bán chạy</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="group bg-white rounded-2xl border border-[#fce7ef] hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden flex flex-col"
            >
              <div className="relative aspect-square p-3 bg-[#fffafa] flex items-center justify-center">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                  {p.category}
                </p>
                <h3 className="text-sm font-bold text-text-main line-clamp-2">
                  {p.name}
                </h3>
                <p className="mt-auto text-primary font-extrabold">
                  {p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

