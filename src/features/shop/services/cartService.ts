import { refreshAccessTokenApi } from '../../auth/services/authService'
import { CART_STORAGE_KEY, type CartItem } from '../../../shared/utils/cartStorage'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function withRefresh<T>(
  token: string | null,
  refreshToken: string | null,
  call: (accessToken: string) => Promise<T>,
): Promise<T> {
  if (!token) throw new Error('Bạn cần đăng nhập để thực hiện thao tác này.')

  try {
    return await call(token)
  } catch (err: any) {
    if (err?.status !== 401 || !refreshToken) throw err
    const newAccess = await refreshAccessTokenApi(refreshToken)
    if (!newAccess) throw err
    return await call(newAccess)
  }
}

type BackendCartItem = {
  product_id: any
  quantity: number
  product_name?: string
  price?: number
  image?: string
  stock?: number
}

type BackendCartResult = {
  user_id: any
  items: BackendCartItem[]
}

function toId(value: any) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value?.toString === 'function') return value.toString()
  return String(value)
}

function mapBackendCartToCartItems(cart: BackendCartResult | null | undefined): CartItem[] {
  const items = cart?.items ?? []
  return items.map((i) => ({
    id: toId(i.product_id),
    name: i.product_name ?? '',
    category: '', // backend cart aggregate hiện chưa trả `category`
    price: i.price ?? 0,
    quantity: i.quantity ?? 1,
    image: i.image ?? '',
  }))
}

export async function getCartApi(token: string | null, refreshToken: string | null): Promise<CartItem[]> {
  return withRefresh(token, refreshToken, async (accessToken) => {
    const res = await fetch(`${BASE_URL}/api/carts/`, { headers: authHeaders(accessToken) })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error: any = new Error(json.message ?? 'Không thể lấy giỏ hàng')
      error.status = res.status
      throw error
    }

    return mapBackendCartToCartItems(json.result as BackendCartResult)
  })
}

export async function addToCartApi(
  token: string | null,
  refreshToken: string | null,
  payload: { product_id: string; quantity: number },
): Promise<void> {
  await withRefresh(token, refreshToken, async (accessToken) => {
    const res = await fetch(`${BASE_URL}/api/carts/add`, {
      method: 'POST',
      headers: authHeaders(accessToken),
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error: any = new Error(json.message ?? 'Không thể thêm vào giỏ hàng')
      error.status = res.status
      throw error
    }
  })
}

export async function removeCartItemApi(
  token: string | null,
  refreshToken: string | null,
  product_id: string,
): Promise<void> {
  await withRefresh(token, refreshToken, async (accessToken) => {
    const res = await fetch(`${BASE_URL}/api/carts/remove/${product_id}`, {
      method: 'DELETE',
      headers: authHeaders(accessToken),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error: any = new Error(json.message ?? 'Không thể xóa sản phẩm khỏi giỏ')
      error.status = res.status
      throw error
    }
  })
}

export async function updateCartQuantityApi(
  token: string | null,
  refreshToken: string | null,
  payload: { product_id: string; quantity: number },
): Promise<void> {
  await withRefresh(token, refreshToken, async (accessToken) => {
    const res = await fetch(`${BASE_URL}/api/carts/update`, {
      method: 'PUT',
      headers: authHeaders(accessToken),
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error: any = new Error(json.message ?? 'Không thể cập nhật số lượng trong giỏ')
      error.status = res.status
      throw error
    }
  })
}

export async function clearCartApi(token: string | null, refreshToken: string | null): Promise<void> {
  const current = await getCartApi(token, refreshToken)
  await Promise.all(current.map((i) => removeCartItemApi(token, refreshToken, i.id)))
}

export async function replaceCartWithSingleItemApi(
  token: string | null,
  refreshToken: string | null,
  payload: { product_id: string; quantity: number },
): Promise<CartItem[]> {
  await clearCartApi(token, refreshToken)
  await addToCartApi(token, refreshToken, payload)
  return getCartApi(token, refreshToken)
}

/**
 * Sync giỏ local guest -> giỏ backend của user.
 * Quy tắc: luôn merge (add) local lên backend rồi xóa local.
 */
export async function syncLocalCartToBackendIfNeeded(token: string | null, refreshToken: string | null) {
  const raw = localStorage.getItem(CART_STORAGE_KEY)
  if (!raw) return

  const parsed = (() => {
    try {
      return JSON.parse(raw) as CartItem[]
    } catch {
      return null
    }
  })()

  if (!parsed || parsed.length === 0) return

  for (const item of parsed) {
    await addToCartApi(token, refreshToken, { product_id: item.id, quantity: item.quantity })
  }

  localStorage.removeItem(CART_STORAGE_KEY)
}

