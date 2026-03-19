import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { getPostsApi } from '../services/shopService'

interface BlogPost {
  _id: string
  title: string
  thumbnail?: string
  tags?: string[]
  created_at?: string
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPostsApi()
        setPosts(data)
      } catch (err: any) {
        setError(err.message ?? 'Không thể tải danh sách bài viết')
      } finally {
        setLoading(false)
      }
    }

    void fetchPosts()
  }, [])

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('vi-VN')
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
          <span className="text-primary font-bold">Bài viết</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-6">
          Góc chia sẻ kinh nghiệm
        </h1>

        {loading && (
          <p className="text-center text-text-muted mt-10">Đang tải bài viết...</p>
        )}
        {error && !loading && (
          <p className="text-center text-red-500 mt-10">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post._id}`}
                className="flex flex-col gap-3 bg-white rounded-2xl border border-[#fce7ef] hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="aspect-video bg-[#fffafa]">
                  {post.thumbnail && (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="px-4 pb-4 flex flex-col gap-1">
                  {post.tags && post.tags.length > 0 && (
                    <span className="text-primary text-xs font-extrabold uppercase tracking-wider">
                      {post.tags[0]}
                    </span>
                  )}
                  <h2 className="text-sm font-bold text-text-main line-clamp-2">
                    {post.title}
                  </h2>
                  <span className="text-[11px] text-text-muted">
                    {formatDate(post.created_at)}
                  </span>
                </div>
              </Link>
            ))}
            {posts.length === 0 && (
              <p className="col-span-full text-center text-text-muted">
                Chưa có bài viết nào.
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

