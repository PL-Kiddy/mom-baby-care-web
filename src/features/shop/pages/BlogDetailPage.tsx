import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getPostByIdApi } from '../services/shopService'

interface BlogPostDetail {
  _id: string
  title: string
  content?: string
  thumbnail?: string
  tags?: string[]
  created_at?: string
  suggested_products?: {
    _id: string
    name: string
    price?: number
    image?: string
  }[]
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Không tìm thấy bài viết')
      setLoading(false)
      return
    }
    const fetchPost = async () => {
      try {
        const data = await getPostByIdApi(id)
        setPost(data)
      } catch (err: any) {
        setError(err.message ?? 'Không thể tải chi tiết bài viết')
      } finally {
        setLoading(false)
      }
    }
    void fetchPost()
  }, [id])

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('vi-VN')
  }

  const formatPrice = (price?: number) => {
    if (price == null) return 'Liên hệ'
    return price.toLocaleString('vi-VN') + 'đ'
  }

  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-[960px] mx-auto px-4 md:px-0 py-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/blog" className="hover:text-primary">
            Bài viết
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold line-clamp-1">
            {post?.title ?? 'Chi tiết bài viết'}
          </span>
        </div>

        {loading && (
          <p className="text-center text-text-muted mt-10">Đang tải bài viết...</p>
        )}
        {error && !loading && (
          <p className="text-center text-red-500 mt-10">{error}</p>
        )}

        {!loading && !error && post && (
          <article className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm p-6 md:p-8 space-y-4">
            {post.thumbnail && (
              <div className="rounded-2xl overflow-hidden mb-4">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full max-h-[360px] object-cover"
                />
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 text-xs font-extrabold text-primary uppercase tracking-wide">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-main">
              {post.title}
            </h1>
            <p className="text-xs text-text-muted">
              {formatDate(post.created_at)}
            </p>
            <div
              className="prose prose-sm max-w-none text-text-main prose-p:mb-3 prose-li:mb-1"
              dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
            />

            {post.suggested_products && post.suggested_products.length > 0 && (
              <section className="mt-6 pt-4 border-t border-pink-50">
                <h2 className="text-lg font-extrabold text-text-main mb-3">
                  Sản phẩm gợi ý trong bài viết
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.suggested_products.map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => navigate(`/products/${p._id}`)}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-pink-50 hover:border-primary/40 hover:shadow-md bg-[#fffafa] text-left"
                    >
                      <div className="size-14 rounded-xl bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-text-muted">
                            child_care
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-main line-clamp-2">
                          {p.name}
                        </p>
                        <p className="text-xs text-primary font-bold mt-1">
                          {formatPrice(p.price)}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Nhấn để xem chi tiết và mua ngay
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </article>
        )}
      </main>
      <Footer />
    </div>
  )
}

