import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductsApi } from '../services/shopService'

interface HomeProduct {
  _id: string
  name: string
  price?: number
  image?: string
}

const ProductsSection: React.FC = () => {
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
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group flex flex-col bg-background-light dark:bg-[#2d1b20] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-primary/30"
              >
                <div className="relative aspect-square overflow-hidden bg-white dark:bg-white/5 p-4 flex items-center justify-center">
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
                  <button className="absolute bottom-3 right-3 size-10 bg-primary text-[#4a1d26] rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-primary-hover">
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-text-main dark:text-white font-bold text-base leading-tight mb-2 line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex items-end justify-between">
                    <p className="text-primary font-extrabold text-lg">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
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
