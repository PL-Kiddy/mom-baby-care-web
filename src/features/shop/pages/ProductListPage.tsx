import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getProductsApi } from '../services/shopService'
import { type CartItem } from '../../../shared/utils/cartStorage'
import { useAuth } from '../../../shared/hooks/useAuth'
import { replaceCartWithSingleItemApi } from '../services/cartService'

interface ProductListItem {
  _id: string
  name: string
  category?: string
  price?: number
  image?: string
}

export default function ProductListPage() {
  const navigate = useNavigate()
  const { user, token, refreshToken } = useAuth()
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsApi()
        setProducts(data)
      } catch (err: any) {
        setError(err.message ?? 'Không thể tải danh sách sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    void fetchProducts()
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set)
  }, [products])

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchName =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase())
        const matchCategory =
          categoryFilter === 'all' || !p.category || p.category === categoryFilter
        return matchName && matchCategory
      }),
    [products, search, categoryFilter],
  )

  const formatPrice = (price?: number) => {
    if (price == null) return 'Liên hệ'
    return price.toLocaleString('vi-VN') + 'đ'
  }

  const quickBuy = (p: ProductListItem) => {
    const item: CartItem = {
      id: p._id,
      name: p.name,
      category: p.category ?? '',
      price: p.price ?? 0,
      quantity: 1,
      image: p.image ?? '',
    }
    if (!user || !token || !refreshToken) {
      navigate('/login', { state: { from: { pathname: '/products' } } })
      return
    }
    void replaceCartWithSingleItemApi(token, refreshToken, { product_id: item.id, quantity: 1 })
    navigate('/cart')
  }

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
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên sản phẩm..."
              className="flex-1 px-3 py-2 rounded-xl border border-[#fce7ef] bg-white text-sm"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#fce7ef] bg-white text-sm"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <p className="text-center text-text-muted mt-10">Đang tải sản phẩm...</p>
        )}
        {error && !loading && (
          <p className="text-center text-red-500 mt-6">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <div
                key={p._id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/products/${p._id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') navigate(`/products/${p._id}`)
                }}
                className="group bg-white rounded-2xl border border-[#fce7ef] hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden flex flex-col cursor-pointer"
              >
                <div className="relative aspect-square p-3 bg-[#fffafa] flex items-center justify-center">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
                      Không có hình
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  {p.category && (
                    <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                      {p.category}
                    </p>
                  )}
                  <h3 className="text-sm font-bold text-text-main line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="mt-auto text-primary font-extrabold">
                    {formatPrice(p.price)}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Link
                      to={`/products/${p._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Xem chi tiết
                    </Link>
                    <button
                      type="button"
                      className="text-xs font-bold text-text-muted hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        quickBuy(p)
                      }}
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-text-muted">
                Không tìm thấy sản phẩm phù hợp.
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

