import type { LoginCredentials, AuthResponse, AuthUser } from '../../../shared/types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
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

  const { access_token } = json.result
  // Sau khi login, gọi /me để lấy thông tin đầy đủ
  const user = await getMeApi(access_token)

  return { user, token: access_token }
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
  if (!res.ok) throw new Error(json.message ?? 'Đăng ký thất bại')
  return json.result
}

export async function logoutApi(token: string): Promise<void> {
  // Thực tế có thể gọi BE để xóa session/token
  console.log('Logging out with token:', token)
}
