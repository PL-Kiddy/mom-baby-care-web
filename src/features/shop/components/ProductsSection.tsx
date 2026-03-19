import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProductsApi } from '../services/shopService'
import { type CartItem } from '../../../shared/utils/cartStorage'
import { useAuth } from '../../../shared/hooks/useAuth'
import { replaceCartWithSingleItemApi } from '../services/cartService'

interface HomeProduct {
  _id: string
  name: string
  category?: string
  price?: number
  image?: string
}

const ProductsSection: React.FC = () => {
  const navigate = useNavigate()
  const { user, token, refreshToken } = useAuth()
  const [products, setProducts] = useState<HomeProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsApi()
        setProducts(data.slice(0, 4))
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    void fetchProducts()
  }, [])

  const formatPrice = (price?: number) => {
    if (price == null) return 'Liên hệ'
    return price.toLocaleString('vi-VN') + 'đ'
  }

  const quickBuy = (product: HomeProduct) => {
    const item: CartItem = {
      id: product._id,
      name: product.name,
      category: '',
      price: product.price ?? 0,
      quantity: 1,
      image: product.image ?? '',
    }
    if (!user || !token || !refreshToken) {
      navigate('/login', { state: { from: { pathname: '/products' } } })
      return
    }
    void replaceCartWithSingleItemApi(token, refreshToken, { product_id: item.id, quantity: 1 })
    navigate('/cart')
  }

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

        {loading ? (
          <p className="text-center text-text-muted">Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const productId = product._id
              return (
                <div
                  key={productId}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/products/${productId}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') navigate(`/products/${productId}`)
                  }}
                  className="group bg-white dark:bg-[#2d1b20] rounded-2xl overflow-hidden border border-[#fce7ef] dark:border-[#3d262b] hover:shadow-xl transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-square p-4 bg-[#fffafa] dark:bg-white/5 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
                        Không có hình
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    {product.category && (
                      <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                        {product.category}
                      </p>
                    )}

                    <h3 className="text-sm font-bold text-text-main line-clamp-2 mt-2">{product.name}</h3>

                    <p className="mt-auto text-primary font-extrabold text-lg">
                      {formatPrice(product.price)}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <Link
                        to={`/products/${productId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Xem chi tiết
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          quickBuy(product)
                        }}
                        className="text-xs font-bold text-text-muted hover:text-primary"
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

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
  )
}

export default ProductsSection;
