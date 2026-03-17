import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Post } from '@/lib/api';

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.posts
      .getAll()
      .then((res) => setPosts(res.result || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="px-4 md:px-10 lg:px-40 py-12">
        <div className="text-center py-12 text-text-muted">Đang tải bài viết...</div>
      </section>
    );
  }

  const displayPosts = posts.slice(0, 3);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

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
            to="/posts"
            className="hidden sm:flex text-primary font-bold text-sm hover:underline items-center"
          >
            Đọc thêm <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <Link key={post._id} to={`/posts/${post._id}`}>
              <article className="flex flex-col gap-4 group cursor-pointer h-full">
                <div className="rounded-2xl overflow-hidden aspect-video relative">
                  <img
                    src={post.thumbnail || 'https://via.placeholder.com/400x225?text=Bài+viết'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/400x225?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                  {post.tags?.[0] && (
                    <span className="text-primary text-xs font-extrabold uppercase tracking-wider">
                      {post.tags[0]}
                    </span>
                  )}
                  <h3 className="text-text-main dark:text-white text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-text-muted dark:text-gray-400 text-sm line-clamp-2">
                    {post.content?.replace(/<[^>]*>/g, '').slice(0, 120)}...
                  </p>
                  <span className="text-gray-400 text-xs mt-1 font-medium">
                    {formatDate(post.created_at)}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
