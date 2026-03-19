import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../../../shared/hooks/useAuth'
import { createReportApi } from '../services/memberService'

export default function MemberReportPage() {
  const { token, refreshToken } = useAuth()
  const [type, setType] = useState<'comment' | 'product' | 'order' | 'other'>('other')
  const [targetId, setTargetId] = useState('')
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      setLoading(true)
      await createReportApi(token, refreshToken, {
        type,
        target_id: targetId || undefined,
        reason,
        description: description || undefined,
      })
      setSuccess('Đã gửi báo cáo. Cảm ơn mẹ đã phản hồi để cửa hàng cải thiện dịch vụ.')
      setReason('')
      setDescription('')
      setTargetId('')
      setType('other')
    } catch (err: any) {
      setError(err.message ?? 'Không thể gửi báo cáo, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-[720px] mx-auto px-4 md:px-0 py-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/account/profile" className="hover:text-primary">
            Tài khoản của tôi
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Gửi báo cáo / góp ý</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-6">
          Gửi báo cáo & góp ý cho cửa hàng
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm p-6 space-y-4"
        >
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted">
              Loại báo cáo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
            >
              <option value="order">Đơn hàng</option>
              <option value="product">Sản phẩm</option>
              <option value="comment">Đánh giá / bình luận</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted">
              Mã đơn / ID sản phẩm / ID bình luận (nếu có)
            </label>
            <input
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="Ví dụ: mã đơn hàng hoặc mã sản phẩm"
              className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted">
              Lý do báo cáo *
            </label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Mô tả ngắn gọn lý do báo cáo..."
              className="w-full px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted">
              Mô tả chi tiết (tuỳ chọn)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mẹ có thể chia sẻ thêm chi tiết để cửa hàng hiểu rõ hơn..."
              className="w-full min-h-[100px] px-3 py-2 rounded-xl border border-[#fce7ef] bg-[#fffafa] text-sm resize-y"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-emerald-600 font-medium">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-extrabold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]">
              flag
            </span>
            {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  )
}

