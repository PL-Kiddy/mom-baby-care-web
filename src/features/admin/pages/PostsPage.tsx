import { useState, useEffect } from 'react'
import { IconPlus, IconEye, IconRefresh, IconSearch } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { createPostApi } from '../services/adminService'
import Modal from '../../../shared/components/Modal'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export default function PostsPage() {
  const { token } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: '',
    suggested_products: '',
    tags: '',
    status: 'published',
  })
  const [submitting, setSubmitting] = useState(false)

  const loadPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/posts`)
      const json = await res.json()
      setPosts(json.result || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPosts() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSubmitting(true)
    try {
      await createPostApi(token, {
        ...formData,
        suggested_products: formData.suggested_products.split(',').map(s => s.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
      })
      setIsModalOpen(false)
      loadPosts()
      setFormData({
        title: '',
        content: '',
        thumbnail: '',
        suggested_products: '',
        tags: '',
        status: 'published',
      })
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo bài viết')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="search-wrapper flex-1" style={{ position: 'relative', maxWidth: 320 }}>
          <IconSearch 
            className="search-icon" 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--muted)',
              pointerEvents: 'none'
            }} 
          />
          <input
            className="input h-10"
            style={{ paddingLeft: '40px' }}
            placeholder="Tìm tiêu đề bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" onClick={loadPosts} disabled={loading}>
          <IconRefresh size={14} className={loading ? 'animate-spin' : ''} />
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <IconPlus size={14} /> Tạo bài viết
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="p-10 text-center text-text-muted animate-pulse">Đang tải danh sách...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Tags</th>
                  <th>Lượt xem</th>
                  <th>Ngày đăng</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td className="font-semibold text-text-main py-3" style={{ maxWidth: 300 }}>
                      <div className="truncate" title={p.title}>{p.title}</div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {p.tags?.map((t: string) => (
                          <span key={t} className="status-badge guest text-[10px] px-1.5 py-0">#{t}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-[13px] text-text-muted">
                        <IconEye size={13} /> {p.view?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="text-[13px] text-text-muted">
                      {new Date(p.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <span className={`status-badge ${p.status === 'published' ? 'completed' : 'pending'}`}>
                        {p.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                      </span>
                    </td>
                    <td>
                      <button className="text-xs text-primary hover:underline">Sửa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Đăng Bài Viết Mới"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Tiêu đề</label>
            <input 
              required className="input w-full" 
              placeholder="VD: Bí quyết chăm sóc trẻ sơ sinh" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="label">Nội dung</label>
            <textarea 
              required className="input w-full h-32 py-2" 
              placeholder="Nhập nội dung bài viết..." 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>
          <div>
            <label className="label">Ảnh bìa (Thumbnail URL)</label>
            <input 
              className="input w-full" 
              placeholder="https://example.com/image.jpg" 
              value={formData.thumbnail}
              onChange={e => setFormData({...formData, thumbnail: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Sản phẩm gợi ý (ID, cách nhau bởi dấu phẩy)</label>
              <input 
                className="input w-full" 
                placeholder="ID1, ID2..." 
                value={formData.suggested_products}
                onChange={e => setFormData({...formData, suggested_products: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Gắn thẻ (Tags, cách nhau bởi dấu phẩy)</label>
              <input 
                className="input w-full" 
                placeholder="Mẹ bầu, Dinh dưỡng..." 
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="label">Trạng thái</label>
            <select 
              className="input w-full"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="published">Công khai (Published)</option>
              <option value="draft">Bản nháp (Draft)</option>
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button 
              type="button" className="btn btn-secondary flex-1" 
              onClick={() => setIsModalOpen(false)}
            >Hủy</button>
            <button 
              type="submit" className="btn btn-primary flex-1" 
              disabled={submitting}
            >
              {submitting ? 'Đang đăng...' : 'Đăng bài'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

