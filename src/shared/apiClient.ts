const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'

export interface RequestOptions extends RequestInit {
  token?: string
}

export function getBaseUrl() {
  return BASE_URL
}

export function isMockEnabled() {
  return USE_MOCK
}

export async function fetchJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`
  const { token, headers, ...rest } = options

  const finalHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(headers || {})
  }

  if (token) {
    (finalHeaders as Record<string, string>).Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    const message = (errorBody as { message?: string }).message ?? `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return res.json() as Promise<T>
}

