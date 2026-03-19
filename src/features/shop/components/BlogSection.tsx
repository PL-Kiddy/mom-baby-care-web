import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPostsApi } from '../services/shopService'

interface HomePost {
  _id: string
  title: string
  thumbnail?: string
  tags?: string[]
  created_at?: string
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<HomePost[]>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPostsApi()
        setPosts(data.slice(0, 3))
      } catch {
        setPosts([])
      }
    }
    void fetch()
  }, [])

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('vi-VN')
  }

  return (
    <section className="px-4 md:px-10 lg:px-40 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-text-main dark:text-white text-2xl md:text-[28px] font-extrabold leading-tight mb-2">
              Góc chia sẻ kinh nghiệm
            </h2>
            <p className="text-text-muted dark:text-gray-400 text-sm font-medium">
              Kiến thức bổ ích cho hành trình làm mẹ.
            </p>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex text-primary font-bold text-sm hover:underline items-center"
          >
            Đọc thêm <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post._id}`}
              className="flex flex-col gap-4 group cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden aspect-video relative">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#fffafa]" />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <div className="flex flex-col gap-2">
                {post.tags && post.tags.length > 0 && (
                  <span className="text-primary text-xs font-extrabold uppercase tracking-wider">
                    {post.tags[0]}
                  </span>
                )}
                <h3 className="text-text-main dark:text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <span className="text-gray-400 text-xs mt-1 font-medium">
                  {formatDate(post.created_at)}
                </span>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="col-span-full text-center text-text-muted text-sm">
              Chưa có bài viết nào.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default BlogSection;
