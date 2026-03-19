const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function getStaffOrdersApi(token: string) {
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

export async function getReportsApi(token: string) {
  const res = await fetch(`${BASE_URL}/api/admin/reports`, {
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tải báo cáo')
  return json.result
}


export async function updateReportStatusApi(token: string, reportId: string, status: string) {
  const res = await fetch(`${BASE_URL}/api/admin/reports/${reportId}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể cập nhật báo cáo')
  return json.result
}

export async function getVouchersApi(token: string) {
  const res = await fetch(`${BASE_URL}/api/vouchers`, {
    headers: authHeaders(token),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể tải danh sách voucher')
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

export async function updateVoucherApi(token: string, voucherId: string, data: any) {
  const res = await fetch(`${BASE_URL}/api/vouchers/${voucherId}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Không thể cập nhật voucher')
  return json.result
}
