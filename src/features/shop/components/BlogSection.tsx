import React from 'react'
import { Link } from 'react-router-dom'
import { MOCK_BLOG_POSTS } from '../data/mockShopData'

const BlogSection: React.FC = () => {
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
          {MOCK_BLOG_POSTS.map((post) => (
            <article key={post.id} className="flex flex-col gap-4 group cursor-pointer">
              <div className="rounded-2xl overflow-hidden aspect-video relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-primary text-xs font-extrabold uppercase tracking-wider">
                  {post.category}
                </span>
                <h3 className="text-text-main dark:text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-text-muted dark:text-gray-400 text-sm line-clamp-2">
                  {post.description}
                </p>
                <span className="text-gray-400 text-xs mt-1 font-medium">
                  {post.date} • {post.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
