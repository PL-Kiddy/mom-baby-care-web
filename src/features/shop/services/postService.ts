import { fetchJson, isMockEnabled } from '../../../shared/apiClient'

export interface BlogCard {
  id: string
  title: string
  category: string
  description: string
  date: string
  readTime: string
  image: string
  views: number
}

const MOCK_BLOG_POSTS: BlogCard[] = [
  {
    id: '1',
    title: 'Hướng dẫn mẹ cách chọn sữa công thức phù hợp cho trẻ sơ sinh',
    category: 'Dinh dưỡng',
    description: 'Những lưu ý quan trọng giúp mẹ chọn đúng loại sữa phù hợp với từng giai đoạn phát triển của bé.',
    date: '12/05/2023',
    readTime: '8 phút đọc',
    image:
      'https://images.pexels.com/photos/3875228/pexels-photo-3875228.jpeg?auto=compress&cs=tinysrgb&w=1200',
    views: 1240
  },
  {
    id: '2',
    title: 'Chế độ dinh dưỡng cho mẹ bầu 3 tháng cuối để thai nhi tăng cân chuẩn',
    category: 'Thai kỳ',
    description: 'Gợi ý thực đơn giàu dinh dưỡng nhưng vẫn nhẹ bụng cho mẹ bầu trong giai đoạn cuối thai kỳ.',
    date: '10/05/2023',
    readTime: '6 phút đọc',
    image:
      'https://images.pexels.com/photos/3875031/pexels-photo-3875031.jpeg?auto=compress&cs=tinysrgb&w=1200',
    views: 980
  },
  {
    id: '3',
    title: 'Thực đơn ăn dặm kiểu Nhật cho bé 6 tháng tuổi mới bắt đầu',
    category: 'Ăn dặm',
    description: 'Nguyên tắc ăn dặm kiểu Nhật và gợi ý món ăn phù hợp cho bé mới làm quen với thức ăn đặc.',
    date: '08/05/2023',
    readTime: '7 phút đọc',
    image:
      'https://images.pexels.com/photos/7098289/pexels-photo-7098289.jpeg?auto=compress&cs=tinysrgb&w=1200',
    views: 756
  }
]

export async function getHomePosts(): Promise<BlogCard[]> {
  if (isMockEnabled()) {
    return MOCK_BLOG_POSTS
  }

  const posts = await fetchJson<any[]>('/api/posts')

  return posts.slice(0, 3).map((p, index) => ({
    id: p._id ?? String(p.id ?? index),
    title: p.title ?? '',
    category: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags[0] : 'Bài viết',
    description: p.summary ?? p.content?.slice(0, 120) ?? '',
    date: p.published_at ? new Date(p.published_at).toLocaleDateString('vi-VN') : '',
    readTime: p.read_time ?? '5 phút đọc',
    image: p.thumbnail ?? MOCK_BLOG_POSTS[index % MOCK_BLOG_POSTS.length].image,
    views: typeof p.views === 'number' ? p.views : 0
  }))
}

