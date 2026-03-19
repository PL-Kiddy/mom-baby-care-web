const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function getMyOrdersApi(token: string) {
  const res = await fetch(`${BASE_URL}/orders/my-orders`, {
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tải đơn hàng của bạn')
  return json.result ?? []
}

export async function getOrderByIdApi(token: string, orderId: string) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tải chi tiết đơn hàng')
  return json.result
}

export async function cancelOrderApi(token: string, orderId: string) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
    method: 'PATCH',
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể hủy đơn hàng')
  return json.result
}

export async function createOrderApi(
  token: string,
  payload: {
    items: { product_id: string; quantity: number }[]
    address: any
    voucher_code?: string
  },
) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tạo đơn hàng')
  return json.result
}

