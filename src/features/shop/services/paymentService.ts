const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function createMoMoPaymentApi(
  token: string,
  payload: { order_id: string; amount: number; return_url: string },
) {
  const res = await fetch(`${BASE_URL}/api/payments/create-url`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tạo thanh toán MoMo')
  return json.result
}

