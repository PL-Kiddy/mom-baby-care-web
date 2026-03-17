import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, type Order, type Product } from '@/lib/api';

const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';
const formatDate = (dateStr?: string) =>
  dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '-';

const STATUS_LABEL: Record<string, string> = {
  Pending: 'Chờ xử lý',
  Delivering: 'Đang giao',
  Delivered: 'Đã giao',
  Cancelled: 'Đã hủy',
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.orders.getById(id);
        setOrder(res.result);
        const ids = [...new Set(res.result.items.map((i) => i.product_id))];
        const productMap: Record<string, Product> = {};
        await Promise.all(
          ids.map(async (pid) => {
            try {
              const p = await api.products.getById(pid);
              productMap[pid] = p.result;
            } catch {
              productMap[pid] = { _id: pid, name: 'Sản phẩm', price: 0, stock: 0 };
            }
          })
        );
        setProducts(productMap);
      } catch (err: unknown) {
        setError((err as { message?: string })?.message || 'Không tải được đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCancel = async () => {
    if (!order || order.status !== 'Pending') return;
    setCancelLoading(true);
    setError(null);
    try {
      await api.orders.cancel(order._id);
      setOrder((o) => (o ? { ...o, status: 'Cancelled' } : null));
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Hủy đơn thất bại.');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <p className="text-text-muted">Đang tải...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <p className="text-red-600 mb-4">{error || 'Không tìm thấy đơn hàng.'}</p>
          <Link to="/account" className="text-primary font-bold hover:text-primary-dark">
            Quay lại tài khoản
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header />
      <main className="flex-1 px-4 md:px-10 lg:px-40 py-8">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/account"
            className="inline-flex items-center gap-1 text-text-muted text-sm font-bold hover:text-primary mb-6"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Quay lại tài khoản
          </Link>

          <h1 className="text-2xl font-bold text-text-main mb-6">
            Đơn hàng #{order._id.slice(-8).toUpperCase()}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/30 p-6 md:p-8 border border-pink-50 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-sm">Ngày đặt: {formatDate(order.created_at)}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Pending'
                    ? 'bg-amber-100 text-amber-700'
                    : order.status === 'Delivering'
                    ? 'bg-blue-100 text-blue-700'
                    : order.status === 'Delivered'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {STATUS_LABEL[order.status] || order.status}
              </span>
            </div>

            <div>
              <h2 className="font-bold text-text-main mb-2">Địa chỉ giao hàng</h2>
              <p className="text-text-muted text-sm">{order.address}</p>
            </div>

            <div>
              <h2 className="font-bold text-text-main mb-3">Sản phẩm</h2>
              <ul className="space-y-3">
                {order.items.map((item) => {
                  const product = products[item.product_id];
                  return (
                    <li
                      key={item.product_id}
                      className="flex items-center gap-4 p-3 bg-pink-50/50 rounded-xl"
                    >
                      {product?.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-pink-100 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-pink-300">inventory_2</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.product_id}`}
                          className="font-semibold text-text-main hover:text-primary truncate block"
                        >
                          {product?.name || 'Sản phẩm'}
                        </Link>
                        <p className="text-sm text-text-muted">
                          x{item.quantity} · {formatPrice(item.price_at_purchase)}
                        </p>
                      </div>
                      <span className="font-bold text-text-main">
                        {formatPrice(item.price_at_purchase * item.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-pink-100 pt-4 space-y-2">
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Giảm giá</span>
                  <span className="text-primary">-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-text-main">
                <span>Tổng thanh toán</span>
                <span>{formatPrice(order.final_amount)}</span>
              </div>
            </div>

            {order.status === 'Pending' && (
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="w-full py-3 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 disabled:opacity-70"
              >
                {cancelLoading ? 'Đang hủy...' : 'Hủy đơn hàng'}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
