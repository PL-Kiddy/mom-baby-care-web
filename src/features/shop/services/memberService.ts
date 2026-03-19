import { refreshAccessTokenApi } from '../../auth/services/authService'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function withRefresh<T>(
  token: string | null,
  refreshToken: string | null,
  call: (accessToken: string) => Promise<T>,
): Promise<T> {
  if (!token) {
    throw new Error('Bạn cần đăng nhập để thực hiện thao tác này.')
  }

  try {
    return await call(token)
  } catch (err: any) {
    if (err?.status !== 401 || !refreshToken) throw err
    const newAccess = await refreshAccessTokenApi(refreshToken)
    if (!newAccess) throw err
    return await call(newAccess)
  }
}

export async function checkVoucherApi(
  token: string | null,
  refreshToken: string | null,
  payload: { code: string; orderTotal: number },
) {
  return withRefresh(token, refreshToken, async (accessToken) => {
    const res = await fetch(`${BASE_URL}/api/vouchers/check`, {
      method: 'POST',
      headers: authHeaders(accessToken),
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error: any = new Error(json.message ?? 'Mã giảm giá không hợp lệ')
      error.status = res.status
      throw error
    }
    return json.result
  })
}

export async function createReportApi(
  token: string | null,
  refreshToken: string | null,
  payload: { type: 'comment' | 'product' | 'order' | 'other'; target_id?: string; reason: string; description?: string },
) {
  return withRefresh(token, refreshToken, async (accessToken) => {
    const res = await fetch(`${BASE_URL}/api/reports`, {
      method: 'POST',
      headers: authHeaders(accessToken),
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error: any = new Error(json.message ?? 'Không thể gửi báo cáo')
      error.status = res.status
      throw error
    }
    return json.result
  })
}

export async function getRewardsApi() {
  const res = await fetch(`${BASE_URL}/api/rewards`)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Không thể tải danh sách quà tặng')
  }
  return json.result ?? []
}

export async function getPointHistoryApi(token: string | null, refreshToken: string | null) {
  return withRefresh(token, refreshToken, async (accessToken) => {
    const res = await fetch(`${BASE_URL}/api/users/points`, {
      headers: authHeaders(accessToken),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error: any = new Error(json.message ?? 'Không thể tải lịch sử điểm')
      error.status = res.status
      throw error
    }
    return json.result
  })
}

export async function redeemRewardApi(
  token: string | null,
  refreshToken: string | null,
  rewardId: string,
) {
  return withRefresh(token, refreshToken, async (accessToken) => {
    const res = await fetch(`${BASE_URL}/api/rewards/redeem`, {
      method: 'POST',
      headers: authHeaders(accessToken),
      body: JSON.stringify({ reward_id: rewardId }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error: any = new Error(json.message ?? 'Không thể đổi quà')
      error.status = res.status
      throw error
    }
    return json.result
  })
}

export async function getProductReviewsApi(productId: string) {
  const res = await fetch(`${BASE_URL}/api/products/${productId}/reviews`)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Không thể tải đánh giá sản phẩm')
  }
  return json.result ?? []
}

export async function createReviewApi(
  token: string | null,
  refreshToken: string | null,
  payload: { productId: string; rating: number; comment: string },
) {
  return withRefresh(token, refreshToken, async (accessToken) => {
    const res = await fetch(`${BASE_URL}/api/reviews/${payload.productId}`, {
      method: 'POST',
      headers: authHeaders(accessToken),
      body: JSON.stringify({ rating: payload.rating, comment: payload.comment }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error: any = new Error(json.message ?? 'Không thể gửi đánh giá')
      error.status = res.status
      throw error
    }
    return json.result
  })
}

