import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getProductsApi } from '../services/shopService'
import { checkVoucherApi } from '../services/memberService'
import { useAuth } from '../../../shared/hooks/useAuth'
import { createOrderApi } from '../services/orderService'
import {
  type CartItem,
} from '../../../shared/utils/cartStorage'
import {
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  replaceCartWithSingleItemApi,
  updateCartQuantityApi,
} from '../services/cartService'
import BANK_QR_IMAGE from '../../../assets/IMG_8711.JPG'

const CartPage = () => {
  const navigate = useNavigate()
  const { user, token, refreshToken } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const orderSummaryRef = useRef<HTMLDivElement | null>(null)
  const isLoggedMember = Boolean(user && token)

  const [voucherCode, setVoucherCode] = useState('')
  const [isVoucherApplied, setIsVoucherApplied] = useState(false)
  const [voucherError, setVoucherError] = useState<string | null>(null)
  const [voucherDiscount, setVoucherDiscount] = useState(0)
  const [checkingVoucher, setCheckingVoucher] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK'>('COD')
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  // Load cart:
  // - Member: ưu tiên backend `/api/carts`
  // - Guest: không cho thao tác giỏ hàng -> luôn hiển thị giỏ trống
  useEffect(() => {
    const loadCart = async () => {
      // Member -> backend
      if (isLoggedMember) {
        try {
          const backendItems = await getCartApi(token, refreshToken)
          setCartItems(backendItems)
          return
        } catch (err) {
          console.error('CartPage: load cart from backend failed', err)
          setCartItems([])
          return
        }
      }

      setCartItems([])
    }

    void loadCart()
  }, [isLoggedMember, token, refreshToken])

  const updateQuantity = async (id: string, change: number) => {
    if (!isLoggedMember) {
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }

    const current = cartItems.find((i) => i.id === id)
    if (!current) return

    const nextQuantity = Math.max(1, current.quantity + change)
    try {
      setCheckoutError(null)
      await updateCartQuantityApi(token, refreshToken, { product_id: id, quantity: nextQuantity })
      const backendItems = await getCartApi(token, refreshToken)
      setCartItems(backendItems)
    } catch (err: any) {
      setCheckoutError(err.message ?? 'Không thể cập nhật số lượng')
    }
  }

  const removeItem = async (id: string) => {
    if (!isLoggedMember) {
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }

    try {
      setCheckoutError(null)
      await removeCartItemApi(token, refreshToken, id)
      const backendItems = await getCartApi(token, refreshToken)
      setCartItems(backendItems)
    } catch (err: any) {
      setCheckoutError(err.message ?? 'Không thể xóa sản phẩm khỏi giỏ')
    }
  }

  const applyVoucher = () => {
    if (voucherCode.trim()) {
      setIsVoucherApplied(true);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = isVoucherApplied ? voucherDiscount : 0
  const total = Math.max(0, subtotal - discount)

  const formatPrice = (price: number) => {
    if (!price || price <= 0) return 'Chưa có giá'
    return price.toLocaleString('vi-VN') + 'đ'
  }

  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductsApi()
        setSuggestedProducts(data.slice(0, 4))
      } catch {
        setSuggestedProducts([])
      }
    }
    void load()
  }, [])

  const quickBuy = async (product: any) => {
    const item: CartItem = {
      id: product._id,
      name: product.name,
      category: product.category ?? '',
      price: product.price ?? 0,
      quantity: 1,
      image: product.image ?? '',
    }

    if (isLoggedMember) {
      try {
        const backendItems = await replaceCartWithSingleItemApi(token, refreshToken, {
          product_id: item.id,
          quantity: 1,
        })
        setCartItems(backendItems)
      } catch (err) {
        console.error('CartPage: quickBuy backend failed', err)
      }
    } else {
      navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }

    // Khi user bấm "Mua ngay" ở phần gợi ý phía dưới,
    // tự cuộn lên khu "Tóm tắt đơn hàng" để tới trang thanh toán ngay.
    orderSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || item.id}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                          <span className="material-symbols-outlined">image_not_supported</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow flex flex-col gap-1">
                      <h3 className="font-bold text-lg text-text-main dark:text-white group-hover:text-primary transition-colors">
                        {item.name || item.id}
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
            <div className="lg:col-span-4 sticky top-24" ref={orderSummaryRef}>
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
                        type="button"
                        onClick={async () => {
                          if (!voucherCode.trim()) return
                          setVoucherError(null)
                          setCheckingVoucher(true)
                          try {
                            const result = await checkVoucherApi(token, refreshToken, {
                              code: voucherCode.trim(),
                              orderTotal: subtotal,
                            })
                            const discountValue = result?.discount_amount ?? 0
                            setVoucherDiscount(discountValue)
                            setIsVoucherApplied(true)
                          } catch (err: any) {
                            setIsVoucherApplied(false)
                            setVoucherDiscount(0)
                            setVoucherError(err.message ?? 'Mã giảm giá không hợp lệ')
                          } finally {
                            setCheckingVoucher(false)
                          }
                        }}
                        disabled={checkingVoucher || subtotal <= 0}
                        className="bg-primary/20 text-primary font-bold px-4 rounded-xl hover:bg-primary hover:text-white transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {checkingVoucher ? 'Đang kiểm tra...' : 'Áp dụng'}
                      </button>
                    </div>
                    {voucherError && (
                      <p className="text-xs text-red-500 mt-1">{voucherError}</p>
                    )}
                    {isVoucherApplied && (
                      <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">
                        Đã áp dụng mã giảm giá
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

                <div className="pt-6 border-t-2 border-dashed border-[#fce7ef] dark:border-[#3d262b] mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold">Tổng cộng</span>
                    <span className="text-2xl font-black text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-bold mb-2">Phương thức thanh toán</p>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                      />
                      Thanh toán khi nhận hàng (COD)
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="BANK"
                        checked={paymentMethod === 'BANK'}
                        onChange={() => setPaymentMethod('BANK')}
                      />
                      Chuyển khoản ngân hàng
                    </label>
                  </div>

                  {paymentMethod === 'BANK' && (
                    <div className="mt-4 bg-[#fffafa] border border-[#fce7ef] rounded-2xl p-4 flex flex-col items-center gap-3">
                      <p className="text-xs font-bold text-text-muted text-center">
                        Quét mã QR để chuyển khoản
                      </p>
                      <img
                        src={BANK_QR_IMAGE}
                        alt="Mã QR chuyển khoản"
                        className="w-full max-w-[320px] rounded-xl border border-[#fce7ef]"
                      />
                      <p className="text-[11px] text-text-muted text-center">
                        Nội dung chuyển khoản/chi tiết ngân hàng có thể xem theo mã QR.
                      </p>
                    </div>
                  )}
                </div>

                {checkoutError && (
                  <p className="text-xs text-red-500 mb-3">{checkoutError}</p>
                )}

                <button
                  className="w-full bg-primary-dark hover:bg-primary-dark/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={cartItems.length === 0 || isPlacingOrder}
                  onClick={async () => {
                    if (!user || !token) {
                      navigate('/login', { state: { from: { pathname: '/cart' } } })
                      return
                    }
                    if (cartItems.length === 0) return

                    setCheckoutError(null)
                    setIsPlacingOrder(true)
                    try {
                      const orderPayload = {
                        items: cartItems.map((i) => ({
                          product_id: i.id,
                          quantity: i.quantity,
                        })),
                        // Backend yêu cầu `address` là string (không phải object)
                        address: `${user.name} | 0123456789 | Địa chỉ sẽ cập nhật sau, HCM`,
                        voucher_code: isVoucherApplied ? voucherCode.trim() : undefined,
                      }

                      await createOrderApi(token, orderPayload)

                      // Sau khi tạo order thành công: clear cart (chỉ cần backend vì guest không thao tác giỏ)
                      try {
                        await clearCartApi(token, refreshToken)
                      } catch (err) {
                        console.error('CartPage: clear backend cart failed', err)
                      }
                      setCartItems([])

                      navigate('/account/orders')
                    } catch (err: any) {
                      setCheckoutError(err.message ?? 'Không thể thanh toán, vui lòng thử lại.')
                    } finally {
                      setIsPlacingOrder(false)
                    }
                  }}
                >
                  {isPlacingOrder ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
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
                key={product._id}
                className="group bg-white dark:bg-[#2d1b20] rounded-2xl overflow-hidden border border-[#fce7ef] dark:border-[#3d262b] hover:shadow-xl transition-all"
              >
                <div className="relative aspect-square p-4 flex items-center justify-center bg-[#fffafa] dark:bg-white/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                  <button
                    type="button"
                    onClick={() => quickBuy(product)}
                    className="absolute bottom-3 right-3 size-10 bg-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    aria-label="Mua ngay"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
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
  )
}

export default CartPage;
