import type { Product } from '../../../shared/types'
import { fetchJson, isMockEnabled } from '../../../shared/apiClient'

export interface ShopProductWithMedia extends Product {
  image: string
  rating: number
  reviews: number
  originalPrice?: string
  badgeText?: string
  badgeColor?: string
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Sữa non Alpha Lipid Lifeline 450g',
    category: 'Sữa bột cho bé',
    price: '1.280.000đ',
    stock: 20,
    sold: 124,
    status: 'active'
  },
  {
    id: 'p2',
    name: 'Sữa Meiji nội địa Nhật Bản số 0 (0-1 tuổi)',
    category: 'Sữa bột cho bé',
    price: '550.000đ',
    stock: 35,
    sold: 210,
    status: 'active'
  },
  {
    id: 'p3',
    name: 'Sữa Similac 5G số 4 900g (2-6 tuổi)',
    category: 'Sữa bột cho bé',
    price: '820.000đ',
    stock: 18,
    sold: 167,
    status: 'active'
  },
  {
    id: 'p4',
    name: 'Vitamin D3K2 LineaBon tăng chiều cao',
    category: 'Vitamin & Thực phẩm chức năng',
    price: '295.000đ',
    stock: 40,
    sold: 96,
    status: 'active'
  }
]

const MOCK_SHOP_PRODUCTS: ShopProductWithMedia[] = [
  {
    ...MOCK_PRODUCTS[0],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFhC6G5Ov2gEaewKcm80Tk8ggEsveikLA7jjdBZ9R14nhrvW3n0G6mmd120i8Z2pKcLYZ04XCmQOrl5Ec1LuM4D5Xp5xJs8Tuol1SPk9x-du2cCv6-vXLgXGQ6OTiP4GttpsrKBAB64vQgVuwZAPD_BFQZuy3CHB4Uh0lhMdObOYuzrTGvLIQigDDAlVPt0Qf5q4DparIpKFiTH5I7XDvhS9N4f5K1bQ6WdiWK0WUsVLO-kMkcrFROSNCcfJ11aRezBObWaEg3X6Xw',
    rating: 4.9,
    reviews: 128,
    originalPrice: '1.500.000đ',
    badgeText: '-15%',
    badgeColor: 'bg-rose-500'
  },
  {
    ...MOCK_PRODUCTS[1],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYu9wFI2w9Kr8qDGm1DHsJRMDRPIsQ0xnhEKdF43mgEX0DhRWa6r8OblY8KO5JM3dY4GqUN-hcrSwA7iooBJh3N_gxNU1jnfOmDVlgItSLXvK6BO_QbWMD4xfmYzOVIaig2lIUXew8pZP9hg1jHSm1cJWytbDtcFCSWHde5sKe_bd9cOf1azrW6x-JhYyekJ2IYhF9bINZn7AcM1_Eb_q23mcXP_z32ew8Ktgy60NA_soj84JdztCVH5BRWnEfZSh-R2SYAdYcgFAS',
    rating: 5.0,
    reviews: 85
  },
  {
    ...MOCK_PRODUCTS[2],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-CVaLoDkC_e3pLGdBkner4LC1NJ7-KSvdOvTghfUPs4KzH9v7F4x7NysG_4kUZ0nZ5tiUZRF1VMjWu_6on_U9DoIBYB9yenpgw4rTFT0L34HGGAjUzJPf7Z7-T1pC94NVIwSSL5N3NYHHHn57vR-iq0AlmOuwojsAApCehC5f33cmhcFiPPxcEPNvaBf9wRjuI__TTMBAmq5Aw-gY7mAa6FaXqYIrGYLs9JkN5NU-aFkV-Y0p28tAEx-XrT_Cuh5eDKiScO8UavxX',
    rating: 4.8,
    reviews: 200,
    badgeText: 'Mới',
    badgeColor: 'bg-blue-400'
  },
  {
    ...MOCK_PRODUCTS[3],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvj_n_L3sW5BuN5sE5iPdrQjDktES93xlJqLvwxcNe10jftXDKmR5qCaZME71uO0XQtp_6RyIttJrz6rddvw92pYOrXS1d4Ww6tAx9Yb1lffbDWEmziNSF_ouOPF2-NqgQqWCyJKlOIK3R2X5FHDz1hafcGgFq4Fxx7PhJQN1zPXo9MpiSoB2wZGleE8oB3t360yLe5Je8z68fkhI31AJ3OsqC7BGdOC3x90g-EAE6z-_WhtNZ9VqJ97L-Xr6DU-ii_0AduO5r2lGF',
    rating: 4.9,
    reviews: 56,
    originalPrice: '350.000đ'
  }
]

function mapBackendProductToUi(p: any): Product {
  return {
    id: p._id ?? '',
    name: p.name ?? '',
    category: p.category ?? 'Sản phẩm',
    price: typeof p.price === 'number' ? `${p.price.toLocaleString('vi-VN')}đ` : String(p.price ?? ''),
    stock: p.stock ?? 0,
    sold: p.sold ?? 0,
    status: 'active'
  }
}

export async function getHomeProducts(): Promise<ShopProductWithMedia[]> {
  if (isMockEnabled()) {
    return MOCK_SHOP_PRODUCTS
  }

  const products = await fetchJson<any[]>('/api/products')
  const mapped = products.map(mapBackendProductToUi)

  // Tạm thời ghép thêm media đơn giản cho UI
  return mapped.slice(0, 4).map((p, index) => ({
    ...p,
    image: MOCK_SHOP_PRODUCTS[index % MOCK_SHOP_PRODUCTS.length].image,
    rating: 4.8,
    reviews: 100 + index * 10
  }))
}

export async function getAllProducts(): Promise<ShopProductWithMedia[]> {
  if (isMockEnabled()) {
    return MOCK_SHOP_PRODUCTS
  }

  const products = await fetchJson<any[]>('/api/products')
  const mapped = products.map(mapBackendProductToUi)

  return mapped.map((p, index) => ({
    ...p,
    image: MOCK_SHOP_PRODUCTS[index % MOCK_SHOP_PRODUCTS.length].image,
    rating: 4.8,
    reviews: 100 + index * 10
  }))
}

