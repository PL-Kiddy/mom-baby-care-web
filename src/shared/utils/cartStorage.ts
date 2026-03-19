export const CART_STORAGE_KEY = 'milkcare_cart_items'

export interface CartItem {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  image: string
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function getCartItemsFromStorage(): CartItem[] {
  const parsed = safeJsonParse<CartItem[]>(localStorage.getItem(CART_STORAGE_KEY))
  return Array.isArray(parsed) ? parsed : []
}

export function setCartItemsToStorage(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function addCartItemToStorage(item: CartItem) {
  const prev = getCartItemsFromStorage()
  const exists = prev.find((p) => p.id === item.id)
  const next = exists
    ? prev.map((p) =>
        p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p,
      )
    : [...prev, item]
  setCartItemsToStorage(next)
  return next
}

export function setSingleCartItemToStorage(item: CartItem) {
  setCartItemsToStorage([item])
}

