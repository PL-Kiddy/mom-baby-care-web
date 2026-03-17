import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, type Post } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    api.posts
      .getById(id)
      .then((res) => setPost(res.result))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-text-muted">Đang tải...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-4">
          <p className="text-text-muted">Không tìm thấy bài viết</p>
          <Link to="/posts" className="text-primary font-bold hover:underline">
            Quay lại danh sách
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-4 md:px-10 lg:px-40 py-8 max-w-4xl mx-auto w-full">
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/posts" className="hover:text-primary">Bài viết</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-text-main dark:text-white font-medium line-clamp-1">{post.title}</span>
        </nav>

        <article>
          <h1 className="text-3xl font-extrabold text-text-main dark:text-white mb-4">
            {post.title}
          </h1>
          <span className="text-gray-400 text-sm">{formatDate(post.created_at)}</span>
          {post.thumbnail && (
            <div className="my-8 rounded-2xl overflow-hidden">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <div
            className="prose prose-pink max-w-none text-text-main dark:text-gray-200 mt-6"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </article>

        {post.suggested_products_detail && post.suggested_products_detail.length > 0 && (
          <section className="mt-16 pt-8 border-t border-[#fce7ef] dark:border-[#3d262b]">
            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-6">
              Sản phẩm gợi ý
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {post.suggested_products_detail.map((p) => (
                <div
                  key={p._id}
                  className="group rounded-2xl overflow-hidden border border-[#fce7ef] dark:border-[#3d262b] hover:shadow-xl transition-all"
                >
                  <Link to={`/products/${p._id}`} className="block aspect-square p-4 bg-white dark:bg-white/5">
                    <img
                      src={p.image || 'https://via.placeholder.com/150'}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="p-4">
                    <Link to={`/products/${p._id}`}>
                      <h3 className="font-bold text-sm line-clamp-2 text-text-main dark:text-white group-hover:text-primary">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-primary font-bold mt-1">{formatPrice(p.price)}</p>
                    <button
                      onClick={() => addToCart(p)}
                      className="mt-2 w-full py-2 bg-primary/20 text-primary rounded-lg font-bold text-sm hover:bg-primary hover:text-white transition-colors"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;
