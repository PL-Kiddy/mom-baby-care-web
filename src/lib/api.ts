const BASE_URL = import.meta.env.VITE_API_URL
if (!BASE_URL) {
  throw new Error('VITE_API_URL chưa được cấu hình trong file .env')
}

export interface ApiError {
  message: string
  status?: number
}

async function request<T>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, string> } = {}
): Promise<T> {
  const { params, ...fetchOptions } = options
  let url = `${BASE_URL}${endpoint}`
  if (params) {
    const search = new URLSearchParams(params).toString()
    url += (url.includes('?') ? '&' : '?') + search
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  const token = localStorage.getItem('access_token')
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw { message: data.message || 'Có lỗi xảy ra', status: response.status }
  }
  return data as T
}

// Types từ BE
export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  image?: string
  description?: string
  rating?: number
  sold?: number
  allow_preorder?: boolean
  category?: string
  brand?: string
  age_range?: string
}

export interface Post {
  _id: string
  title: string
  content: string
  thumbnail?: string
  tags?: string[]
  suggested_products?: string[]
  suggested_products_detail?: Product[]
  created_at?: string
  author?: { name?: string }
}

export interface VoucherCheckResult {
  discount_amount: number
  final_amount: number
  code: string
}

export interface OrderItem {
  product_id: string
  quantity: number
}

export interface MemberProfile {
  _id: string
  name: string
  email: string
  phone_number?: string
  date_of_birth?: string
  gender?: string
  address?: { street?: string; ward?: string; district?: string; city?: string; country?: string; zipcode?: string }
  avatar?: string
}

export interface OrderItemDetail {
  product_id: string
  quantity: number
  price_at_purchase: number
}

export interface Order {
  _id: string
  user_id: string
  items: OrderItemDetail[]
  total_amount: number
  discount_amount: number
  final_amount: number
  address: string
  status: string
  created_at: string
  updated_at?: string
}

export const api = {
  auth: {
    login: (body: { email: string; password: string }) =>
      request<{ result: { access_token: string; refresh_token: string; role: number }; redirectTo: string }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify(body) }
      ),
    getMe: () => request<{ result: unknown }>('/auth/me'),
  },
  members: {
    register: (body: RegisterBody) =>
      request<{ result: { message: string } }>('/members/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getMe: () => request<{ result: MemberProfile }>('/members/me'),
    updateMe: (body: { name?: string; date_of_birth?: string; gender?: string; address?: Record<string, string>; avatar?: string }) =>
      request<{ result: MemberProfile }>('/members/me', {
        method: 'PATCH',
        body: JSON.stringify(body),
      }),
    forgotPassword: (body: { email: string }) =>
      request<{ message: string }>('/members/forgot-password', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    resetPassword: (body: { forgot_password_token: string; password: string; confirm_password: string }) =>
      request<{ message: string }>('/members/reset-password', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    resendVerifyEmail: (body: { email: string }) =>
      request<{ message: string }>('/members/resend-email-verify-token', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
  products: {
    getAll: () => request<{ result: Product[] }>('/api/products'),
    getById: (id: string) => request<{ result: Product }>(`/api/products/${id}`),
    getReviews: (id: string) => request<{ result: Array<{ rating: number; comment: string; user?: { name: string } }> }>(`/api/products/${id}/reviews`),
  },
  posts: {
    getAll: () => request<{ result: Post[] }>('/api/posts'),
    getById: (id: string) => request<{ result: Post }>(`/api/posts/${id}`),
  },
  vouchers: {
    check: (body: { code: string; total_amount: number }) =>
      request<{ result: VoucherCheckResult }>('/api/vouchers/check', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
  orders: {
    create: (body: { items: OrderItem[]; address: string; voucher_code?: string }) =>
      request<{ result: unknown; message: string }>('/orders', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getMyOrders: () => request<{ result: Order[] }>('/orders/my-orders'),
    getById: (id: string) => request<{ result: Order }>(`/orders/${id}`),
    cancel: (id: string) =>
      request<{ result: Order; message: string }>(`/orders/${id}/cancel`, { method: 'PATCH' }),
  },
}

export interface RegisterBody {
  name: string
  gender: string
  email: string
  password: string
  confirm_password: string
  phone_number: string
  date_of_birth: string
  address: {
    street?: string
    ward?: string
    district?: string
    city?: string
    country?: string
    zipcode?: string
  }
}
