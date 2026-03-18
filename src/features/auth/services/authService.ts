import type { LoginCredentials, AuthResponse, AuthUser } from '../../../shared/types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? 'Đăng nhập thất bại')
  }
  return res.json() as Promise<AuthResponse>
}

export async function getMeApi(token: string): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error('Token không hợp lệ')
  return res.json() as Promise<AuthUser>
}

export async function logoutApi(token: string): Promise<void> {
  await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST', headers: authHeaders(token),
  }).catch(() => {})
}

// TODO: Xóa hàm này khi BE sẵn sàng
export async function mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  await new Promise((r) => setTimeout(r, 800))
  const MOCK: Record<string, AuthResponse> = {
    'admin@gmail.com': {
      token: 'mock-admin-token-xyz',
      user: { id: '1', name: 'Admin MilkCare', email: 'admin@gmail.com', role: 'admin' },
    },
    'staff@gmail.com': {
      token: 'mock-staff-token-abc',
      user: { id: '2', name: 'Nhân viên A', email: 'staff@gmail.com', role: 'staff' },
    },
    'member@gmail.com': {
      token: 'mock-member-token-123',
      user: { id: '3', name: 'Mẹ Demo', email: 'member@gmail.com', role: 'member' },
    },
  }
  const match = MOCK[credentials.email]
  if (!match || credentials.password !== '123456') throw new Error('Email hoặc mật khẩu không đúng')
  return match
}
