import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getPointHistoryApi, getRewardsApi, redeemRewardApi } from '../services/memberService'

interface RewardItem {
  _id: string
  name: string
  required_points: number
  description?: string
}

interface PointHistoryItem {
  id: string
  type: 'earn' | 'spend'
  points: number
  description: string
  created_at: string
}

export default function AccountRewardsPage() {
  const { user, token, refreshToken } = useAuth()
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [history, setHistory] = useState<PointHistoryItem[]>([])
  const [currentPoints, setCurrentPoints] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redeemingId, setRedeemingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [rewardsData, historyData] = await Promise.all([
          getRewardsApi(),
          getPointHistoryApi(token, refreshToken),
        ])
        setRewards(rewardsData?.rewards ?? rewardsData ?? [])
        const list = historyData?.history ?? historyData ?? []
        setHistory(list)
        setCurrentPoints(historyData?.current_points ?? historyData?.points ?? 0)
      } catch (err: any) {
        setError(err.message ?? 'Không thể tải thông tin điểm thưởng')
      } finally {
        setLoading(false)
      }
    }

    void fetchAll()
  }, [token, refreshToken])

  const handleRedeem = async (rewardId: string) => {
    try {
      setRedeemingId(rewardId)
      await redeemRewardApi(token, refreshToken, rewardId)
      // Sau khi đổi quà, reload lịch sử + điểm
      const historyData = await getPointHistoryApi(token, refreshToken)
      const list = historyData?.history ?? historyData ?? []
      setHistory(list)
      setCurrentPoints(historyData?.current_points ?? historyData?.points ?? 0)
    } catch (err: any) {
      alert(err.message ?? 'Không thể đổi quà')
    } finally {
      setRedeemingId(null)
    }
  }

  return (
    <div className="bg-background-light text-text-main font-display min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow w-full max-w-[960px] mx-auto px-4 md:px-8 lg:px-0 py-8">
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/account/profile" className="hover:text-primary">
            Tài khoản của tôi
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-bold">Điểm thưởng</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-text-main mb-6">
          Điểm thưởng của {user?.name ?? 'mẹ'}
        </h1>

        {loading && <p className="text-center text-text-muted mt-10">Đang tải điểm thưởng...</p>}
        {error && !loading && (
          <p className="text-center text-red-500 mt-10">{error}</p>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-[#fce7ef] shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Tổng điểm hiện tại
                </p>
                <p className="text-3xl font-black text-primary mt-1">
                  {currentPoints.toLocaleString('vi-VN')} điểm
                </p>
              </div>
              <p className="text-xs text-text-muted max-w-sm">
                Tích điểm mỗi khi mẹ mua hàng. Điểm có thể dùng để đổi quà hoặc voucher giảm giá
                trong các chương trình khuyến mãi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white rounded-2xl border border-[#fce7ef] p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-text-main mb-2">
                  Quà tặng có thể đổi
                </h2>
                {rewards.length === 0 ? (
                  <p className="text-sm text-text-muted">Hiện chưa có quà tặng nào.</p>
                ) : (
                  <ul className="space-y-3">
                    {rewards.map((reward) => (
                      <li
                        key={reward._id}
                        className="flex items-start justify-between gap-3 border border-pink-50 rounded-xl px-3 py-3"
                      >
                        <div>
                          <p className="font-bold text-sm text-text-main">{reward.name}</p>
                          <p className="text-xs text-text-muted mt-1">
                            {reward.description}
                          </p>
                          <p className="text-xs font-bold text-primary mt-1">
                            {reward.required_points.toLocaleString('vi-VN')} điểm
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={currentPoints < reward.required_points || redeemingId === reward._id}
                          onClick={() => handleRedeem(reward._id)}
                          className="text-xs font-bold px-3 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {redeemingId === reward._id ? 'Đang đổi...' : 'Đổi quà'}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="bg-white rounded-2xl border border-[#fce7ef] p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-text-main mb-2">
                  Lịch sử điểm
                </h2>
                {history.length === 0 ? (
                  <p className="text-sm text-text-muted">Chưa có giao dịch điểm nào.</p>
                ) : (
                  <ul className="space-y-2 max-h-72 overflow-auto pr-1">
                    {history.map((item) => (
                      <li key={item.id} className="flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-text-main">
                            {item.description}
                          </p>
                          <p className="text-[10px] text-text-muted mt-0.5">
                            {new Date(item.created_at).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <span
                          className={
                            item.type === 'earn'
                              ? 'text-emerald-600 font-bold'
                              : 'text-rose-500 font-bold'
                          }
                        >
                          {item.type === 'earn' ? '+' : '-'}
                          {item.points.toLocaleString('vi-VN')}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

