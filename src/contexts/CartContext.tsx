import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Product } from '@/lib/api'

export interface CartItem {
  product_id: string
  quantity: number
  name: string
  price: number
  image?: string
  category?: string
}

const CART_STORAGE_KEY = 'mom_baby_cart'

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product | CartItem, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | null>(null)

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addToCart = useCallback((product: Product | CartItem, qty = 1) => {
    const productId = 'product_id' in product ? product.product_id : product._id
    const name = 'name' in product ? product.name : (product as CartItem).name
    const price = 'price' in product ? product.price : (product as CartItem).price
    const image = 'image' in product ? product.image : (product as CartItem).image
    const category = 'category' in product ? product.category : (product as CartItem).category

    setItems((prev) => {
      const found = prev.find((i) => i.product_id === productId)
      if (found) {
        return prev.map((i) =>
          i.product_id === productId ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { product_id: productId, quantity: qty, name, price, image, category }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.product_id !== productId))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
