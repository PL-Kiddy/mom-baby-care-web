import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, type Post } from '@/lib/api';

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.posts
      .getAll()
      .then((res) => setPosts(res.result || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-4 md:px-10 lg:px-40 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-text-main dark:text-white">
            Bài viết sức khỏe
          </h1>
          <p className="text-text-muted dark:text-gray-400 mt-2">
            Kiến thức bổ ích cho hành trình làm mẹ
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-text-muted">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post._id} to={`/posts/${post._id}`}>
                <article className="group flex flex-col h-full rounded-2xl overflow-hidden border border-[#fce7ef] dark:border-[#3d262b] hover:shadow-xl transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.thumbnail || 'https://via.placeholder.com/400x225?text=Bài+viết'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    {post.tags?.[0] && (
                      <span className="text-primary text-xs font-bold uppercase mb-2">
                        {post.tags[0]}
                      </span>
                    )}
                    <h2 className="text-lg font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-text-muted text-sm mt-2 line-clamp-2 flex-1">
                      {post.content?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                    </p>
                    <span className="text-gray-400 text-xs mt-4">{formatDate(post.created_at)}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PostsList;
