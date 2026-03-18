import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { MOCK_SHOP_PRODUCTS } from '../data/mockShopData'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const product = MOCK_SHOP_PRODUCTS.find((p) => p.id === id) ?? MOCK_SHOP_PRODUCTS[0]

  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 py-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/products" className="hover:text-primary">
            Sản phẩm
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="bg-white rounded-2xl border border-[#fce7ef] p-6 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full max-h-[420px] object-contain"
            />
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
              {product.category}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-main">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="material-symbols-outlined text-yellow-400 text-[18px]">
                star
              </span>
              <span>4.9 (128+ đánh giá)</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-primary">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
            <p className="text-sm text-text-muted">
              Mô tả chi tiết sản phẩm sẽ được kết nối từ backend. Hiện tại đây là dữ liệu
              mock dùng để demo layout trang chi tiết sản phẩm.
            </p>
            <button className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary-dark hover:bg-primary text-white font-bold shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined">add_shopping_cart</span>
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

