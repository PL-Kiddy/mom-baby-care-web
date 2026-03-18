import type { Product, Post } from '../../../shared/types'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Sữa non Alpha Lipid Lifeline 450g',
    category: 'Sữa bột cho bé',
    price: '1.280.000đ',
    stock: 20,
    sold: 124,
    status: 'active',
  },
  {
    id: 'p2',
    name: 'Sữa Meiji nội địa Nhật Bản số 0 (0-1 tuổi)',
    category: 'Sữa bột cho bé',
    price: '550.000đ',
    stock: 35,
    sold: 210,
    status: 'active',
  },
  {
    id: 'p3',
    name: 'Sữa Similac 5G số 4 900g (2-6 tuổi)',
    category: 'Sữa bột cho bé',
    price: '820.000đ',
    stock: 18,
    sold: 167,
    status: 'active',
  },
  {
    id: 'p4',
    name: 'Vitamin D3K2 LineaBon tăng chiều cao',
    category: 'Vitamin & Thực phẩm chức năng',
    price: '295.000đ',
    stock: 40,
    sold: 96,
    status: 'active',
  },
]

export interface ShopProductWithMedia extends Product {
  image: string
  rating: number
  reviews: number
  originalPrice?: string
  badgeText?: string
  badgeColor?: string
}

export const MOCK_SHOP_PRODUCTS: ShopProductWithMedia[] = [
  {
    ...MOCK_PRODUCTS[0],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFhC6G5Ov2gEaewKcm80Tk8ggEsveikLA7jjdBZ9R14nhrvW3n0G6mmd120i8Z2pKcLYZ04XCmQOrl5Ec1LuM4D5Xp5xJs8Tuol1SPk9x-du2cCv6-vXLgXGQ6OTiP4GttpsrKBAB64vQgVuwZAPD_BFQZuy3CHB4Uh0lhMdObOYuzrTGvLIQigDDAlVPt0Qf5q4DparIpKFiTH5I7XDvhS9N4f5K1bQ6WdiWK0WUsVLO-kMkcrFROSNCcfJ11aRezBObWaEg3X6Xw',
    rating: 4.9,
    reviews: 128,
    originalPrice: '1.500.000đ',
    badgeText: '-15%',
    badgeColor: 'bg-rose-500',
  },
  {
    ...MOCK_PRODUCTS[1],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYu9wFI2w9Kr8qDGm1DHsJRMDRPIsQ0xnhEKdF43mgEX0DhRWa6r8OblY8KO5JM3dY4GqUN-hcrSwA7iooBJh3N_gxNU1jnfOmDVlgItSLXvK6BO_QbWMD4xfmYzOVIaig2lIUXew8pZP9hg1jHSm1cJWytbDtcFCSWHde5sKe_bd9cOf1azrW6x-JhYyekJ2IYhF9bINZn7AcM1_Eb_q23mcXP_z32ew8Ktgy60NA_soj84JdztCVH5BRWnEfZSh-R2SYAdYcgFAS',
    rating: 5.0,
    reviews: 85,
  },
  {
    ...MOCK_PRODUCTS[2],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-CVaLoDkC_e3pLGdBkner4LC1NJ7-KSvdOvTghfUPs4KzH9v7F4x7NysG_4kUZ0nZ5tiUZRF1VMjWu_6on_U9DoIBYB9yenpgw4rTFT0L34HGGAjUzJPf7Z7-T1pC94NVIwSSL5N3NYHHHn57vR-iq0AlmOuwojsAApCehC5f33cmhcFiPPxcEPNvaBf9wRjuI__TTMBAmq5Aw-gY7mAa6FaXqYIrGYLs9JkN5NU-aFkV-Y0p28tAEx-XrT_Cuh5eDKiScO8UavxX',
    rating: 4.8,
    reviews: 200,
    badgeText: 'Mới',
    badgeColor: 'bg-blue-400',
  },
  {
    ...MOCK_PRODUCTS[3],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBvj_n_L3sW5BuN5sE5iPdrQjDktES93xlJqLvwxcNe10jftXDKmR5qCaZME71uO0XQtp_6RyIttJrz6rddvw92pYOrXS1d4Ww6tAx9Yb1lffbDWEmziNSF_ouOPF2-NqgQqWCyJKlOIK3R2X5FHDz1hafcGgFq4Fxx7PhJQN1zPXo9MpiSoB2wZGleE8oB3t360yLe5Je8z68fkhI31AJ3OsqC7BGdOC3x90g-EAE6z-_WhtNZ9VqJ97L-Xr6DU-ii_0AduO5r2lGF',
    rating: 4.9,
    reviews: 56,
    originalPrice: '350.000đ',
  },
]

export const MOCK_BLOG_POSTS: Post[] = [
  {
    id: 1,
    title: 'Hướng dẫn mẹ cách chọn sữa công thức phù hợp cho trẻ sơ sinh',
    category: 'Dinh dưỡng',
    author: 'BS. Lan Anh',
    views: 1240,
    date: '12/05/2023',
    status: 'active',
  },
  {
    id: 2,
    title: 'Chế độ dinh dưỡng cho mẹ bầu 3 tháng cuối để thai nhi tăng cân chuẩn',
    category: 'Thai kỳ',
    author: 'Chuyên gia dinh dưỡng',
    views: 980,
    date: '10/05/2023',
    status: 'active',
  },
  {
    id: 3,
    title: 'Thực đơn ăn dặm kiểu Nhật cho bé 6 tháng tuổi mới bắt đầu',
    category: 'Ăn dặm',
    author: 'Mẹ Nhím',
    views: 756,
    date: '08/05/2023',
    status: 'active',
  },
]

