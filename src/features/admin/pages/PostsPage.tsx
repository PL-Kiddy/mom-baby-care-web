import { useState } from 'react'
import { IconPlus, IconEye } from '../../../shared/components/Icons'
import type { Post } from '../../../shared/types'

const POSTS: Post[] = [
  { id: 1, title: 'Dinh dưỡng cho mẹ bầu 3 tháng đầu',       category: 'Mẹ bầu', author: 'Admin', views: 1240, date: '08/03/2025', status: 'active' },
  { id: 2, title: 'Top 5 sữa tốt nhất cho bé 0-6 tháng',      category: 'Em bé',  author: 'Staff', views: 980,  date: '07/03/2025', status: 'active' },
  { id: 3, title: 'Cách chọn sữa công thức phù hợp',          category: 'Tư vấn', author: 'Admin', views: 750,  date: '05/03/2025', status: 'active' },
  { id: 4, title: 'Thực phẩm cần tránh khi cho con bú',        category: 'Mẹ bầu', author: 'Staff', views: 620,  date: '03/03/2025', status: 'inactive' },
  { id: 5, title: 'Hướng dẫn pha sữa đúng cách cho bé',       category: 'Em bé',  author: 'Admin', views: 540,  date: '01/03/2025', status: 'active' },
]

export default function PostsPage() {
  const [search, setSearch] = useState('')

  const filtered = POSTS.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          className="input"
          style={{ maxWidth: 320 }}
          placeholder="Tìm tiêu đề bài viết..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-primary"><IconPlus size={14} /> Tạo bài viết</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Tác giả</th>
                <th>Lượt xem</th>
                <th>Ngày đăng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--muted)' }}>{p.id}</td>
                  <td style={{ fontWeight: 500, maxWidth: 280 }}>{p.title}</td>
                  <td><span className="status-badge member">{p.category}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{p.author}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <IconEye size={13} color="var(--muted)" />
                      {p.views.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{p.date}</td>
                  <td><span className={`status-badge ${p.status}`}>{p.status === 'active' ? 'Đã đăng' : 'Ẩn'}</span></td>
                  <td>
                    <span className="cursor-pointer text-[12px] text-[var(--accent)] hover:underline">
                      Sửa
                    </span>
                    {' · '}
                    <span className="cursor-pointer text-[12px] text-[var(--accent)] hover:underline">
                      {p.status === 'active' ? 'Ẩn' : 'Hiện'}
                    </span>
                    {' · '}
                    <span className="cursor-pointer text-[12px] text-[var(--accent)] hover:underline">
                      Xóa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
