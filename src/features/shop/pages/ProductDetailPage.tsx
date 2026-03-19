import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getProductByIdApi } from '../services/shopService'
import { createReviewApi, getProductReviewsApi } from '../services/memberService'
import { useAuth } from '../../../shared/hooks/useAuth'

interface ProductDetail {
  _id: string
  name: string
  category?: string
  price?: number
  image?: string
  description?: string
  stock?: number
  allow_preorder?: boolean
}

interface ProductReview {
  _id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { token, refreshToken, user } = useAuth()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [creatingReview, setCreatingReview] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Không tìm thấy sản phẩm')
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        const data = await getProductByIdApi(id)
        setProduct(data)
      } catch (err: any) {
        setError(err.message ?? 'Không thể tải chi tiết sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const data = await getProductReviewsApi(id)
        setReviews(data)
      } catch {
        setReviews([])
      } finally {
        setReviewsLoading(false)
      }
    }

    void fetchProduct()
    void fetchReviews()
  }, [id])

  const formatPrice = (price?: number) => {
    if (price == null) return 'Liên hệ'
    return price.toLocaleString('vi-VN') + 'đ'
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
          <Link to="/products" className="hover:text-primary">
            Sản phẩm
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold line-clamp-1">
            {product?.name ?? 'Đang tải...'}
          </span>
        </div>

        {loading && (
          <p className="text-center text-text-muted mt-10">Đang tải chi tiết sản phẩm...</p>
        )}
        {error && !loading && (
          <p className="text-center text-red-500 mt-10">{error}</p>
        )}

        {!loading && !error && product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="bg-white rounded-2xl border border-[#fce7ef] p-6 flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full max-h-[420px] object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-text-muted">
                  Chưa có hình sản phẩm
                </div>
              )}
            </div>

            <div className="space-y-4">
              {product.category && (
                <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                  {product.category}
                </p>
              )}
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
                <span className="text-3xl font-black text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.stock !== undefined && (
                <p className="text-xs text-text-muted">
                  Tồn kho hiện tại:{' '}
                  <span className="font-bold text-text-main">
                    {product.stock}
                  </span>
                </p>
              )}
              {product.allow_preorder && (
                <p className="text-xs font-bold text-amber-600 mt-1">
                  Sản phẩm cho phép <span className="underline">đặt trước</span> nếu tạm hết hàng. Cửa hàng sẽ ưu tiên giao khi có lại.
                </p>
              )}
              <p className="text-sm text-text-muted">
                {product.description ??
                  'Chi tiết sản phẩm sẽ được cập nhật từ nội dung mô tả trong hệ thống.'}
              </p>
              <button className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary-dark hover:bg-primary text-white font-bold shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined">add_shopping_cart</span>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        )}

        {!loading && !error && product && (
          <section className="mt-10 max-w-2xl">
            <h2 className="text-lg font-extrabold text-text-main mb-3">
              Đánh giá từ các mẹ
            </h2>
            {reviewsLoading ? (
              <p className="text-sm text-text-muted">Đang tải đánh giá...</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-text-muted">
                Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên chia sẻ trải nghiệm của mẹ nhé!
              </p>
            ) : (
              <ul className="space-y-3 mb-6">
                {reviews.map((r) => (
                  <li key={r._id} className="border border-pink-50 rounded-xl px-4 py-3 bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-text-main">
                        {r.user_name}
                      </p>
                      <span className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        {r.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mb-1">
                      {new Date(r.created_at).toLocaleString('vi-VN')}
                    </p>
                    <p className="text-sm text-text-main">{r.comment}</p>
                  </li>
                ))}
              </ul>
            )}

            {user ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!id) return
                  setReviewError(null)
                  setCreatingReview(true)
                  try {
                    await createReviewApi(token, refreshToken, {
                      productId: id,
                      rating: reviewRating,
                      comment: reviewComment,
                    })
                    const data = await getProductReviewsApi(id)
                    setReviews(data)
                    setReviewComment('')
                    setReviewRating(5)
                  } catch (err: any) {
                    setReviewError(err.message ?? 'Không thể gửi đánh giá')
                  } finally {
                    setCreatingReview(false)
                  }
                }}
                className="bg-white rounded-2xl border border-[#fce7ef] p-4 space-y-3"
              >
                <h3 className="text-sm font-extrabold text-text-main">
                  Viết đánh giá của mẹ
                </h3>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-text-muted">Đánh giá:</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="px-2 py-1 text-xs rounded-lg border border-pink-100"
                  >
                    {[5, 4, 3, 2, 1].map((v) => (
                      <option key={v} value={v}>
                        {v} sao
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Mẹ hãy chia sẻ cảm nhận sau khi sử dụng sản phẩm..."
                  className="w-full min-h-[80px] text-sm rounded-xl border border-pink-100 px-3 py-2 resize-y focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
                {reviewError && (
                  <p className="text-xs text-red-500">{reviewError}</p>
                )}
                <button
                  type="submit"
                  disabled={creatingReview}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-dark hover:bg-primary text-white text-xs font-bold shadow-md shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {creatingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>
            ) : (
              <p className="text-xs text-text-muted mt-2">
                <Link to="/login" className="text-primary font-bold">
                  Đăng nhập
                </Link>{' '}
                để viết đánh giá cho sản phẩm này.
              </p>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

