import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Sữa non Alpha Lipid Lifeline 450g',
      category: 'Sữa bột cho bé',
      price: 1280000,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFhC6G5Ov2gEaewKcm80Tk8ggEsveikLA7jjdBZ9R14nhrvW3n0G6mmd120i8Z2pKcLYZ04XCmQOrl5Ec1LuM4D5Xp5xJs8Tuol1SPk9x-du2cCv6-vXLgXGQ6OTiP4GttpsrKBAB64vQgVuwZAPD_BFQZuy3CHB4Uh0lhMdObOYuzrTGvLIQigDDAlVPt0Qf5q4DparIpKFiTH5I7XDvhS9N4f5K1bQ6WdiWK0WUsVLO-kMkcrFROSNCcfJ11aRezBObWaEg3X6Xw',
    },
    {
      id: 2,
      name: 'Vitamin D3K2 LineaBon tăng chiều cao',
      category: 'Vitamin & Thực phẩm chức năng',
      price: 295000,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvj_n_L3sW5BuN5sE5iPdrQjDktES93xlJqLvwxcNe10jftXDKmR5qCaZME71uO0XQtp_6RyIttJrz6rddvw92pYOrXS1d4Ww6tAx9Yb1lffbDWEmziNSF_ouOPF2-NqgQqWCyJKlOIK3R2X5FHDz1hafcGgFq4Fxx7PhJQN1zPXo9MpiSoB2wZGleE8oB3t360yLe5Je8z68fkhI31AJ3OsqC7BGdOC3x90g-EAE6z-_WhtNZ9VqJ97L-Xr6DU-ii_0AduO5r2lGF',
    },
  ]);

  const [voucherCode, setVoucherCode] = useState('MOM20');
  const [isVoucherApplied, setIsVoucherApplied] = useState(true);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const applyVoucher = () => {
    if (voucherCode.trim()) {
      setIsVoucherApplied(true);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = isVoucherApplied ? subtotal * 0.2 : 0;
  const total = subtotal - discount;

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const suggestedProducts = [
    {
      id: 1,
      name: 'Sữa Meiji nội địa Nhật Bản số 0',
      price: 550000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYu9wFI2w9Kr8qDGm1DHsJRMDRPIsQ0xnhEKdF43mgEX0DhRWa6r8OblY8KO5JM3dY4GqUN-hcrSwA7iooBJh3N_gxNU1jnfOmDVlgItSLXvK6BO_QbWMD4xfmYzOVIaig2lIUXew8pZP9hg1jHSm1cJWytbDtcFCSWHde5sKe_bd9cOf1azrW6x-JhYyekJ2IYhF9bINZn7AcM1_Eb_q23mcXP_z32ew8Ktgy60NA_soj84JdztCVH5BRWnEfZSh-R2SYAdYcgFAS',
    },
    {
      id: 2,
      name: 'Sữa Similac 5G số 4 900g (2-6 tuổi)',
      price: 820000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-CVaLoDkC_e3pLGdBkner4LC1NJ7-KSvdOvTghfUPs4KzH9v7F4x7NysG_4kUZ0nZ5tiUZRF1VMjWu_6on_U9DoIBYB9yenpgw4rTFT0L34HGGAjUzJPf7Z7-T1pC94NVIwSSL5N3NYHHHn57vR-iq0AlmOuwojsAApCehC5f33cmhcFiPPxcEPNvaBf9wRjuI__TTMBAmq5Aw-gY7mAa6FaXqYIrGYLs9JkN5NU-aFkV-Y0p28tAEx-XrT_Cuh5eDKiScO8UavxX',
    },
    {
      id: 3,
      name: 'Sữa bột Ensure Gold ít ngọt 850g',
      price: 745000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKR7K-cAnw5BSrGtm0lbmP0-kF9BwjxSPT8E1BYlX8ZvZRpgoOGsqv8-NANXDRplIEyu3fWyZtcZcISBlzrqe2MbfYYDOOe_f-1ifaa2hvYGaBFnUA2jC6wIjFKcoqy7ITF7zJyPheSqKmT6430UMGTADGpvyEA_q-LsZlEOpXqtxyb3RWww_uqbXHSihbWQN6J0tu-pPz9C3-QhiQHcxMPXbQJ_3cFhn0rjCrvIG6KYeUOzHwIunguM1MuHrb2isfiouXW5457aob',
    },
    {
      id: 4,
      name: 'Bột ăn dặm Heinz ngũ cốc vị sữa',
      price: 125000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbrQwpVzkCE0WQjCUgAG9NuRYJQIn7604jhnQLXHuIY57-DgZqzg59LSqy71v4n9avvMbxefP6IUvWbVEz5XdWrxLunZAYzdwWsXvsfU-nEic1D1LWvMt-ixHZgqULm7q4FjaCBTuIZBJh4oKnMrLS8bQeMJbgDXl8jev90FGGZjra20_SFv9DKDNOlmrHunUwfle3dJ4uv7O6Yznu-rcKIMDoc-JVG22KVjpcLSGFpoOilB2M2_jO_qkTC4NdO4mq0gNsJJxc_4B_',
    },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Giỏ hàng</span>
        </div>

        <h2 className="text-3xl font-extrabold text-text-main dark:text-white mb-8">
          Giỏ hàng của mẹ
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white dark:bg-[#2d1b20] p-12 rounded-2xl border border-[#fce7ef] dark:border-[#3d262b] text-center">
                <span className="material-symbols-outlined text-[80px] text-text-muted/30 mb-4">
                  shopping_cart
                </span>
                <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                  Giỏ hàng trống
                </h3>
                <p className="text-text-muted mb-6">Hãy thêm sản phẩm vào giỏ hàng nhé!</p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-primary-dark text-white font-bold px-6 py-3 rounded-xl hover:bg-primary transition-all"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#2d1b20] p-4 md:p-6 rounded-2xl border border-[#fce7ef] dark:border-[#3d262b] flex flex-col sm:flex-row items-center gap-6 group"
                  >
                    <div className="size-24 bg-background-light dark:bg-white/5 rounded-xl p-2 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-grow flex flex-col gap-1">
                      <h3 className="font-bold text-lg text-text-main dark:text-white group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-text-muted">
                        Danh mục: {item.category}
                      </p>
                      <div className="mt-2 text-primary font-bold text-lg">
                        {formatPrice(item.price)}
                      </div>
                    </div>

                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center bg-background-light dark:bg-white/5 rounded-full px-2 py-1 border border-[#fce7ef] dark:border-white/10">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="size-8 flex items-center justify-center text-text-muted hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">
                            remove
                          </span>
                        </button>
                        <span className="w-8 text-center font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="size-8 flex items-center justify-center text-text-muted hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
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

                  <div className="flex justify-between text-text-muted">
                    <span>Phí vận chuyển</span>
                    <span className="text-green-500 font-semibold">Miễn phí</span>
                  </div>

                  <div className="pt-4 border-t border-[#fce7ef] dark:border-[#3d262b]">
                    <label className="block text-sm font-bold mb-2">
                      Mã ưu đãi (Voucher)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 bg-[#fff0f4] dark:bg-white/5 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-primary placeholder:text-primary/50 focus:ring-2 focus:ring-primary/50"
                      />
                      <button
                        onClick={applyVoucher}
                        className="bg-primary/20 text-primary font-bold px-4 rounded-xl hover:bg-primary hover:text-white transition-all text-sm"
                      >
                        Áp dụng
                      </button>
                    </div>
                    {isVoucherApplied && (
                      <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">
                        Đã áp dụng mã giảm giá 20%
                      </p>
                    )}
                  </div>

                  {isVoucherApplied && (
                    <div className="flex justify-between text-primary font-medium">
                      <span>Ưu đãi giảm giá</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t-2 border-dashed border-[#fce7ef] dark:border-[#3d262b] mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold">Tổng cộng</span>
                    <span className="text-2xl font-black text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-primary-dark hover:bg-primary-dark/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                  Tiến hành thanh toán
                  <span className="material-symbols-outlined">payments</span>
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted">
                  <span className="material-symbols-outlined text-sm">
                    verified_user
                  </span>
                  Thanh toán an toàn &amp; bảo mật
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Products */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-text-main dark:text-white">
              Sản phẩm gợi ý cho mẹ
            </h2>
            <Link
              to="/"
              className="text-primary font-bold flex items-center gap-1 hover:underline"
            >
              Xem thêm <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-[#2d1b20] rounded-2xl overflow-hidden border border-[#fce7ef] dark:border-[#3d262b] hover:shadow-xl transition-all"
              >
                <div className="relative aspect-square p-4 flex items-center justify-center bg-[#fffafa] dark:bg-white/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                  <button className="absolute bottom-3 right-3 size-10 bg-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                    <span className="material-symbols-outlined">
                      add_shopping_cart
                    </span>
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sm mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-primary font-black">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
