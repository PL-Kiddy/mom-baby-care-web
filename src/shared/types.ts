// ===== AUTH TYPES =====

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'member'
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
  refreshToken?: string
}

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isStaff: boolean
}

// ===== SHARED TYPES =====

export type OrderStatus    = 'pending' | 'processing' | 'completed' | 'cancelled'
export type UserRole       = 'admin' | 'staff' | 'member' | 'guest'
export type ActiveStatus   = 'active' | 'inactive'
export type TrackingStatus = 'confirmed' | 'packing' | 'shipping' | 'delivered' | 'returned'

export interface Order {
  id: string
  customer: string
  phone: string
  product: string
  total: string
  status: OrderStatus
  time: string
  payment: string
}

export interface Product {
  id?: string
  _id: string
  name: string
  category: string
  price: number
  stock: number
  sold: number
  image?: string
  status: ActiveStatus
  updated_at?: string
  created_at?: string
}

export interface Account {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  joined: string
  orders: number
  status: ActiveStatus
}

export interface Voucher {
  code: string
  type: string
  value: string
  minOrder: string
  used: number
  limit: number
  expires: string
  status: ActiveStatus
}

export interface Post {
  id: number
  title: string
  category: string
  author: string
  views: number
  date: string
  status: ActiveStatus
}

export interface NavItem {
  to: string
  Icon: React.ComponentType<IconProps>
  label: string
  badge?: number
}

export interface NavGroup {
  section: string
  items: NavItem[]
}

export interface IconProps {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}


export interface StatCardData {
  label: string
  value: string
  change: string
  changeType: 'up' | 'down'
  icon: React.ComponentType<IconProps>
  color: 'orange' | 'pink' | 'teal' | 'gold'
}

export interface TrackingOrder {
  id: string
  customer: string
  phone: string
  product: string
  total: string
  address: string
  trackingCode: string
  carrier: string
  status: TrackingStatus
  updatedAt: string
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  sku: string
  stock: number
  minStock: number
  incoming: number
  unit: string
  lastUpdated: string
}

export interface ReportItem {
  id: string
  type: 'order' | 'return' | 'complaint' | 'feedback'
  customer: string
  orderId: string
  content: string
  status: 'open' | 'processing' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export interface ChatSession {
  id: string
  customer: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  status: 'waiting' | 'active' | 'closed'
  topic: string
}
