import type { LoginCredentials, AuthResponse, AuthUser } from '../../../shared/types'
import { fetchJson, isMockEnabled } from '../../../shared/apiClient'

function mapAuthUserFromBackend(user: any): AuthUser {
  const roleMap: Record<number | string, AuthUser['role']> = {
    1: 'member',
    2: 'staff',
    3: 'admin',
    member: 'member',
    staff: 'staff',
    admin: 'admin'
  }

  const rawRole = user.role ?? 'member'
  const role = roleMap[rawRole] ?? 'member'

  return {
    id: user.id ?? user._id ?? '',
    name: user.name ?? '',
    email: user.email ?? '',
    avatar: user.avatar,
    role
  }
}

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  if (isMockEnabled()) {
    await new Promise((r) => setTimeout(r, 800))
    const MOCK: Record<string, AuthResponse> = {
      'admin@gmail.com': {
        token: 'mock-admin-token-xyz',
        user: { id: '1', name: 'Admin MilkCare', email: 'admin@gmail.com', role: 'admin' }
      },
      'staff@gmail.com': {
        token: 'mock-staff-token-abc',
        user: { id: '2', name: 'Nhân viên A', email: 'staff@gmail.com', role: 'staff' }
      },
      'member@gmail.com': {
        token: 'mock-member-token-123',
        user: { id: '3', name: 'Mẹ Demo', email: 'member@gmail.com', role: 'member' }
      }
    }
    const match = MOCK[credentials.email]
    if (!match || credentials.password !== '123456') throw new Error('Email hoặc mật khẩu không đúng')
    return match
  }

  const result = await fetchJson<{ token: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })

  return {
    token: result.token,
    user: mapAuthUserFromBackend(result.user)
  }
}

export async function getMeApi(token: string): Promise<AuthUser> {
  if (isMockEnabled()) {
    // Giả lập lấy thông tin từ token mock
    if (token.startsWith('mock-admin')) {
      return { id: '1', name: 'Admin MilkCare', email: 'admin@gmail.com', role: 'admin' }
    }
    if (token.startsWith('mock-staff')) {
      return { id: '2', name: 'Nhân viên A', email: 'staff@gmail.com', role: 'staff' }
    }
    if (token.startsWith('mock-member')) {
      return { id: '3', name: 'Mẹ Demo', email: 'member@gmail.com', role: 'member' }
    }
    throw new Error('Token không hợp lệ')
  }

  const user = await fetchJson<any>('/auth/me', { token })
  return mapAuthUserFromBackend(user)
}

export async function logoutApi(token: string, refreshToken?: string): Promise<void> {
  if (isMockEnabled()) return

  await fetchJson('/members/logout', {
    method: 'POST',
    token,
    body: JSON.stringify(
      refreshToken
        ? { refresh_token: refreshToken }
        : {}
    )
  }).catch(() => {})
}

