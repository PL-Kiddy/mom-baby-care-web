import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [address, setAddress] = useState('');

  const total = Math.max(0, subtotal - voucherDiscount);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim() || subtotal <= 0) return;
    setVoucherError(null);
    if (!isAuthenticated) {
      setVoucherError('Vui lòng đăng nhập để sử dụng mã giảm giá.');
      return;
    }
    try {
      const res = await api.vouchers.check({ code: voucherCode.trim(), total_amount: subtotal });
      setVoucherDiscount(res.result.discount_amount);
      setVoucherApplied(true);
    } catch (err: unknown) {
      setVoucherError((err as { message?: string })?.message || 'Mã không hợp lệ.');
      setVoucherDiscount(0);
      setVoucherApplied(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setCheckoutError('Giỏ hàng trống.');
      return;
    }
    if (!address.trim()) {
      setCheckoutError('Vui lòng nhập địa chỉ giao hàng.');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      await api.orders.create({
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        address: address.trim(),
        voucher_code: voucherApplied && voucherCode.trim() ? voucherCode.trim() : undefined,
      });
      clearCart();
      navigate('/');
    } catch (err: unknown) {
      setCheckoutError((err as { message?: string })?.message || 'Đặt hàng thất bại.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const [suggestedProducts, setSuggestedProducts] = useState<Array<{ _id: string; name: string; price: number; image?: string }>>([]);

  useEffect(() => {
    if (items.length === 0) {
      api.products.getAll().then((res) => setSuggestedProducts((res.result || []).slice(0, 4))).catch(() => {});
    } else {
      setSuggestedProducts([]);
    }
  }, [items.length]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 py-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Giỏ hàng</span>
        </div>

        <h2 className="text-3xl font-extrabold text-text-main dark:text-white mb-8">
          Giỏ hàng của mẹ
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {items.length === 0 ? (
              <div className="bg-white dark:bg-[#2d1b20] p-12 rounded-2xl border border-[#fce7ef] dark:border-[#3d262b] text-center">
                <span className="material-symbols-outlined text-[80px] text-text-muted/30 mb-4">
                  shopping_cart
                </span>
                <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                  Giỏ hàng trống
                </h3>
                <p className="text-text-muted mb-6">Hãy thêm sản phẩm vào giỏ hàng nhé!</p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-primary-dark text-white font-bold px-6 py-3 rounded-xl hover:bg-primary transition-all"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="bg-white dark:bg-[#2d1b20] p-4 md:p-6 rounded-2xl border border-[#fce7ef] dark:border-[#3d262b] flex flex-col sm:flex-row items-center gap-6"
                  >
                    <div className="size-24 bg-background-light dark:bg-white/5 rounded-xl p-2 flex-shrink-0">
                      <img
                        src={item.image || 'https://via.placeholder.com/96'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-grow flex flex-col gap-1">
                      <Link to={`/products/${item.product_id}`}>
                        <h3 className="font-bold text-lg text-text-main dark:text-white hover:text-primary">
                          {item.name}
                        </h3>
                      </Link>
                      {item.category && (
                        <p className="text-sm text-text-muted">Danh mục: {item.category}</p>
                      )}
                      <div className="mt-2 text-primary font-bold text-lg">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center bg-background-light dark:bg-white/5 rounded-full px-2 py-1 border border-[#fce7ef] dark:border-white/10">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="size-8 flex items-center justify-center text-text-muted hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="size-8 flex items-center justify-center text-text-muted hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <Link
                    to="/products"
                    className="flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </>
            )}
          </div>

          {items.length > 0 && (
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white dark:bg-[#2d1b20] p-6 rounded-2xl border border-[#fce7ef] dark:border-[#3d262b] shadow-sm">
                <h3 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-text-muted">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-text-main dark:text-white">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-[#fce7ef] dark:border-[#3d262b]">
                    <label className="block text-sm font-bold mb-2">Mã ưu đãi (Voucher)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => { setVoucherCode(e.target.value); setVoucherError(null); }}
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 bg-[#fff0f4] dark:bg-white/5 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-primary placeholder:text-primary/50 focus:ring-2 focus:ring-primary/50"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        className="bg-primary/20 text-primary font-bold px-4 rounded-xl hover:bg-primary hover:text-white transition-all text-sm"
                      >
                        Áp dụng
                      </button>
                    </div>
                    {voucherError && (
                      <p className="text-xs text-red-500 mt-1">{voucherError}</p>
                    )}
                    {voucherApplied && voucherDiscount > 0 && (
                      <p className="text-[10px] text-primary font-bold mt-1 uppercase">
                        Đã giảm {formatPrice(voucherDiscount)}
                      </p>
                    )}
                  </div>

                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-primary font-medium">
                      <span>Ưu đãi giảm giá</span>
                      <span>-{formatPrice(voucherDiscount)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#fce7ef] dark:border-[#3d262b] mb-4">
                  <label className="block text-sm font-bold mb-2">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Đường ABC, Quận 1, TP.HCM"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#fff0f4] dark:bg-white/5 border border-[#fce7ef] dark:border-[#3d262b] text-sm"
                  />
                </div>

                <div className="pt-6 border-t-2 border-dashed border-[#fce7ef] dark:border-[#3d262b] mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold">Tổng cộng</span>
                    <span className="text-2xl font-black text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {checkoutError && (
                  <p className="text-sm text-red-500 mb-4">{checkoutError}</p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-primary-dark hover:bg-primary-dark/90 disabled:opacity-70 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
                  <span className="material-symbols-outlined">payments</span>
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-text-muted mt-4 text-center">
                    Đăng nhập để đặt hàng và sử dụng voucher
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {items.length === 0 && suggestedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-extrabold text-text-main dark:text-white mb-8">
              Sản phẩm gợi ý cho mẹ
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/products/${p._id}`}
                  className="group bg-white dark:bg-[#2d1b20] rounded-2xl overflow-hidden border border-[#fce7ef] dark:border-[#3d262b] hover:shadow-xl transition-all"
                >
                  <div className="aspect-square p-4 flex items-center justify-center bg-[#fffafa] dark:bg-white/5">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm mb-2 line-clamp-2">{p.name}</h4>
                    <p className="text-primary font-black">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
