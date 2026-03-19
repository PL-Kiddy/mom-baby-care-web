import type { LoginCredentials, AuthResponse, AuthUser } from '../../../shared/types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payloadBase64Url = parts[1]
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(payloadBase64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

const ROLE_MAP: Record<number, 'admin' | 'staff' | 'member'> = {
  1: 'member',
  2: 'staff',
  3: 'admin',
}

function mapUser(data: any): AuthUser {
  return {
    id: data._id,
    name: data.name,
    email: data.email,
    role: ROLE_MAP[data.role] || 'member',
    avatar: data.avatar,
  }
}

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Đăng nhập thất bại')
  }

  const { access_token, refresh_token } = json.result ?? {}
  // Sau khi login, gọi /me để lấy thông tin đầy đủ
  const user = await getMeApi(access_token)

  const response: AuthResponse = {
    user,
    token: access_token,
    refreshToken: refresh_token,
  }

  return response
}

export async function getMeApi(token: string): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders(token) })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Token không hợp lệ')
  return mapUser(json.result)
}


export async function registerApi(data: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/members/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (json.errors) {
      const errorDetail = Object.values(json.errors)
        .map((err: any) => (typeof err === 'object' ? err.msg : err))
        .join(', ')
      throw new Error(`${json.message}: ${errorDetail}`)
    }
    throw new Error(json.message ?? 'Đăng ký thất bại')
  }
  return json.result
}

export async function logoutApi(token: string): Promise<void> {
  // Thực tế có thể gọi BE để xóa session/token
  console.log('Logging out with token:', token)
}

export async function resendEmailVerifyApi(email: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/members/resend-email-verify-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Không thể gửi lại email xác thực')
  }
}

export async function forgotPasswordApi(email: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/members/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Không thể gửi email đặt lại mật khẩu')
  }
}

export async function verifyForgotPasswordTokenApi(token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/members/verify-forgot-password-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ forgot_password_token: token }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn')
  }
}

export async function resetPasswordApi(params: {
  password: string
  confirm_password: string
  forgot_password_token: string
}): Promise<void> {
  const res = await fetch(`${BASE_URL}/members/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Không thể đặt lại mật khẩu')
  }
}

export async function refreshAccessTokenApi(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/members/refresh-access-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(json.message ?? 'Không thể làm mới phiên đăng nhập')
    }

    const accessToken = json.result?.access_token as string | undefined
    if (!accessToken) return null

    // Backend middleware yêu cầu member phải có claim `verify = UserVerifyStatus.Verified (1)`
    // Token refresh hiện tại chỉ set `user_id`, nên nếu thiếu claim `verify` => member sẽ bị 403 khi mua hàng.
    const payload = decodeJwtPayload(accessToken)
    const userRole = payload?.user_role != null ? Number(payload.user_role) : undefined
    const verify = payload?.verify != null ? Number(payload.verify) : undefined
    if (userRole === 1 && verify !== 1) {
      return null
    }

    return accessToken
  } catch {
    return null
  }
}
