const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

function normalizeProduct(p: any) {
  if (!p) return p
  return {
    ...p,
    image: p.image || p.image_url || '',
  }
}

export async function getProductsApi() {
  const res = await fetch(`${BASE_URL}/api/products`)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Không thể tải danh sách sản phẩm')
  }
  const list = json.result ?? []
  return Array.isArray(list) ? list.map(normalizeProduct) : []
}

export async function getProductByIdApi(id: string) {
  const res = await fetch(`${BASE_URL}/api/products/${id}`)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Không thể tải chi tiết sản phẩm')
  }
  return normalizeProduct(json.result)
}

export async function getPostsApi() {
  const res = await fetch(`${BASE_URL}/api/posts`)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Không thể tải danh sách bài viết')
  }
  return json.result ?? []
}

export async function getPostByIdApi(id: string) {
  const res = await fetch(`${BASE_URL}/api/posts/${id}`)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json.message ?? 'Không thể tải chi tiết bài viết')
  }
  return json.result
}

