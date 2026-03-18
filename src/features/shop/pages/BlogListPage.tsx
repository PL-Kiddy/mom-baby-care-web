import Header from '../components/Header'
import Footer from '../components/Footer'
import { MOCK_BLOG_POSTS } from '../data/mockShopData'
import { Link } from 'react-router-dom'

export default function BlogListPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_BLOG_POSTS.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="flex flex-col gap-3 bg-white rounded-2xl border border-[#fce7ef] hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="aspect-video bg-[#fffafa]" />
              <div className="px-4 pb-4 flex flex-col gap-1">
                <span className="text-primary text-xs font-extrabold uppercase tracking-wider">
                  {post.category}
                </span>
                <h2 className="text-sm font-bold text-text-main line-clamp-2">
                  {post.title}
                </h2>
                <span className="text-[11px] text-text-muted">
                  {post.date} • {post.views} lượt xem
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

