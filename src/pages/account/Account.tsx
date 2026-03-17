import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api, type MemberProfile, type Order } from '@/lib/api';

const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';
const formatDate = (dateStr?: string) =>
  dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '-';

const STATUS_LABEL: Record<string, string> = {
  Pending: 'Chờ xử lý',
  Delivering: 'Đang giao',
  Delivered: 'Đã giao',
  Cancelled: 'Đã hủy',
};

const Account = () => {
  const [tab, setTab] = useState<'profile' | 'orders'>('profile');
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<MemberProfile>>({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, ordersRes] = await Promise.all([
          api.members.getMe(),
          api.orders.getMyOrders(),
        ]);
        setProfile(profileRes.result);
        setFormData(profileRes.result);
        setOrders(ordersRes.result || []);
      } catch (err: unknown) {
        setError((err as { message?: string })?.message || 'Không tải được dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    try {
      const res = await api.members.updateMe({
        name: formData.name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        address: formData.address as Record<string, string> | undefined,
      });
      setProfile(res.result);
      setEditMode(false);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Cập nhật thất bại.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancelLoading(orderId);
    setError(null);
    try {
      await api.orders.cancel(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: 'Cancelled' } : o
        )
      );
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || 'Hủy đơn thất bại.');
    } finally {
      setCancelLoading(null);
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

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header />
      <main className="flex-1 px-4 md:px-10 lg:px-40 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-text-main mb-6">Tài khoản của tôi</h1>

          <div className="flex gap-4 border-b border-pink-100 mb-6">
            <button
              onClick={() => setTab('profile')}
              className={`pb-3 px-1 font-bold text-sm border-b-2 transition-colors ${
                tab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setTab('orders')}
              className={`pb-3 px-1 font-bold text-sm border-b-2 transition-colors ${
                tab === 'orders'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              Đơn hàng của tôi
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {tab === 'profile' && profile && (
            <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/30 p-6 md:p-8 border border-pink-50">
              {!editMode ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-lg font-bold text-text-main">Thông tin cá nhân</h2>
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-primary font-bold text-sm hover:text-primary-dark"
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-text-muted font-medium">Họ tên</dt>
                      <dd className="text-text-main font-semibold">{profile.name}</dd>
                    </div>
                    <div>
                      <dt className="text-text-muted font-medium">Email</dt>
                      <dd className="text-text-main">{profile.email}</dd>
                    </div>
                    {profile.phone_number && (
                      <div>
                        <dt className="text-text-muted font-medium">Số điện thoại</dt>
                        <dd className="text-text-main">{profile.phone_number}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-text-muted font-medium">Ngày sinh</dt>
                      <dd className="text-text-main">{formatDate(profile.date_of_birth)}</dd>
                    </div>
                    {profile.gender && (
                      <div>
                        <dt className="text-text-muted font-medium">Giới tính</dt>
                        <dd className="text-text-main">
                          {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : profile.gender}
                        </dd>
                      </div>
                    )}
                    {profile.address && (
                      <div>
                        <dt className="text-text-muted font-medium">Địa chỉ</dt>
                        <dd className="text-text-main">
                          {[
                            profile.address.street,
                            profile.address.ward,
                            profile.address.district,
                            profile.address.city,
                          ]
                            .filter(Boolean)
                            .join(', ') || '-'}
                        </dd>
                      </div>
                    )}
                  </dl>
                </>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <h2 className="text-lg font-bold text-text-main mb-4">Chỉnh sửa thông tin</h2>
                  <div>
                    <label className="block text-sm font-bold text-text-main mb-1">Họ tên</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-main mb-1">Ngày sinh</label>
                    <input
                      type="date"
                      value={formData.date_of_birth ? formData.date_of_birth.slice(0, 10) : ''}
                      onChange={(e) => setFormData((p) => ({ ...p, date_of_birth: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-main mb-1">Giới tính</label>
                    <select
                      value={formData.gender || ''}
                      onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-main mb-1">Địa chỉ (đường, phường, quận, thành phố)</label>
                    <input
                      type="text"
                      value={
                        typeof formData.address === 'object' && formData.address
                          ? [
                              formData.address.street,
                              formData.address.ward,
                              formData.address.district,
                              formData.address.city,
                            ]
                              .filter(Boolean)
                              .join(', ')
                          : ''
                      }
                      onChange={(e) => {
                        const parts = e.target.value.split(',').map((s) => s.trim());
                        setFormData((p) => ({
                          ...p,
                          address: {
                            street: parts[0] || '',
                            ward: parts[1] || '',
                            district: parts[2] || '',
                            city: parts[3] || '',
                          },
                        }));
                      }}
                      placeholder="Số nhà, phường, quận, thành phố"
                      className="w-full px-4 py-2.5 border border-pink-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark disabled:opacity-70"
                    >
                      {saveLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setFormData(profile);
                      }}
                      className="px-6 py-2.5 bg-gray-100 text-text-main font-bold rounded-xl hover:bg-gray-200"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/30 p-12 text-center border border-pink-50">
                  <span className="material-symbols-outlined text-5xl text-pink-200 mb-4 block">
                    shopping_bag
                  </span>
                  <p className="text-text-muted font-medium mb-4">Bạn chưa có đơn hàng nào</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark"
                  >
                    Mua sắm ngay
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl shadow-lg shadow-pink-100/30 p-6 border border-pink-50"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <p className="text-sm text-text-muted">
                          Đơn hàng #{order._id.slice(-8).toUpperCase()} · {formatDate(order.created_at)}
                        </p>
                        <p className="font-bold text-text-main mt-1">
                          {formatPrice(order.final_amount)}
                          {order.discount_amount > 0 && (
                            <span className="text-sm text-text-muted font-normal ml-2">
                              (đã giảm {formatPrice(order.discount_amount)})
                            </span>
                          )}
                        </p>
                      </div>
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
                    <p className="text-sm text-text-muted mb-4">
                      {order.items.length} sản phẩm · Giao đến: {order.address}
                    </p>
                    <div className="flex gap-3">
                      <Link
                        to={`/account/orders/${order._id}`}
                        className="text-primary font-bold text-sm hover:text-primary-dark"
                      >
                        Xem chi tiết
                      </Link>
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancelLoading === order._id}
                          className="text-red-600 font-bold text-sm hover:text-red-700 disabled:opacity-70"
                        >
                          {cancelLoading === order._id ? 'Đang hủy...' : 'Hủy đơn'}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
