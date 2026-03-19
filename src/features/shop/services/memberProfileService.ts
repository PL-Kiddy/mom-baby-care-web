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

export async function updateProfileApi(
  token: string | null,
  refreshToken: string | null,
  payload: {
    name?: string
    date_of_birth?: string
    gender?: 'male' | 'female' | 'other'
    address?: {
      street?: string
      ward?: string
      district?: string
      city?: string
      country?: string
      zipcode?: string
    }
    avatar?: string
  },
) {
  return withRefresh(token, refreshToken, async (accessToken) => {
    const res = await fetch(`${BASE_URL}/members/me`, {
      method: 'PATCH',
      headers: authHeaders(accessToken),
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error: any = new Error(json.message ?? 'Không thể cập nhật hồ sơ.')
      error.status = res.status
      throw error
    }
    return json.result
  })
}

