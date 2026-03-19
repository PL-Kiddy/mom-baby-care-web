import { getMeApi } from '../../auth/services/authService'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export async function getAllUsersApi(token: string) {
  const res = await fetch(`${BASE_URL}/admins/getAllUser`, {
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tải danh sách tài khoản')
  return json.result
}

function authHeaders(token: string) {

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function getDashboardStatsApi(token: string) {
  const res = await fetch(`${BASE_URL}/admins/dashboard/stats`, {
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tải thống kê')
  return json.result
}

export async function getAllOrdersApi(token: string) {
  const res = await fetch(`${BASE_URL}/orders/all`, {
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tải danh sách đơn hàng')
  return json.result
}

export async function updateOrderStatusApi(token: string, orderId: string, status: string) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể cập nhật trạng thái đơn hàng')
  return json.result
}

export async function getProductsApi(token: string) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tải danh sách sản phẩm')
  return json.result
}



export async function createVoucherApi(token: string, data: any) {
  const res = await fetch(`${BASE_URL}/api/vouchers`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tạo voucher')
  return json.result
}

export async function createPostApi(token: string, data: any) {
  const res = await fetch(`${BASE_URL}/api/posts`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể đăng bài viết')
  return json.result
}

export async function createOrderApi(token: string, data: any) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tạo đơn hàng')
  return json.result
}

export async function createProductApi(token: string, data: any) {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tạo sản phẩm')
  return json.result
}

export async function updateProductApi(token: string, id: string, data: any) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể cập nhật sản phẩm')
  return json.result
}

export async function deleteProductApi(token: string, id: string) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể xóa sản phẩm')
  return json.result
}
export async function deleteVoucherApi(token: string, id: string) {
  const res = await fetch(`${BASE_URL}/api/vouchers/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể xóa voucher')
  return json.result
}

export async function deletePostApi(token: string, id: string) {
  const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể xóa bài viết')
  return json.result
}

export async function updatePostApi(token: string, id: string, data: any) {
  const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể cập nhật bài viết')
  return json.result
}

