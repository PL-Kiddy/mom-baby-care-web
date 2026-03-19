import { useState, useEffect } from 'react'
import { IconPlus, IconEye, IconRefresh, IconSearch } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { createPostApi, deletePostApi, updatePostApi } from '../services/adminService'
import Modal from '../../../shared/components/Modal'
import { exportToCSV } from '../../../shared/utils/exportUtils'
import { IconDownload } from '../../../shared/components/Icons'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export default function PostsPage() {
  const { token } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

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
      const payload = {
        ...formData,
        suggested_products: formData.suggested_products.split(',').map(s => s.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
      }

      if (editingId) {
        await updatePostApi(token, editingId, payload)
        alert('Cập nhật bài viết thành công!')
      } else {
        await createPostApi(token, payload)
        alert('Đăng bài viết thành công!')
      }

      setIsModalOpen(false)
      loadPosts()
      resetForm()
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xử lý bài viết')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: '',
      content: '',
      thumbnail: '',
      suggested_products: '',
      tags: '',
      status: 'published',
    })
  }

  const handleEdit = (post: any) => {
    setEditingId(post._id)
    setFormData({
      title: post.title || '',
      content: post.content || '',
      thumbnail: post.thumbnail || '',
      suggested_products: post.suggested_products?.join(', ') || '',
      tags: post.tags?.join(', ') || '',
      status: post.status || 'published',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return

    try {
      await deletePostApi(token, id)
      alert('Xóa bài viết thành công!')
      loadPosts()
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa bài viết')
    }
  }

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = () => {
    const headers = [
      { key: 'title', label: 'Tiêu đề' },
      { key: 'view', label: 'Lượt xem' },
      { key: 'status', label: 'Trạng thái' },
      { key: 'created_at', label: 'Ngày đăng' },
    ]
    exportToCSV(filtered, headers, 'Danh_sach_bai_viet')
  }

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
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={handleExport} disabled={loading || filtered.length === 0}>
            <IconDownload size={14} /> Xuất Excel
          </button>
          <button className="btn btn-primary" onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}>
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
                      <span className="cursor-pointer text-[12px] text-primary hover:underline font-bold" onClick={() => handleEdit(p)}>
                        Sửa
                      </span>
                      {' · '}
                      <span 
                        className="cursor-pointer text-[12px] text-primary hover:underline font-bold"
                        onClick={() => handleDelete(p._id)}
                      >
                        Xóa
                      </span>
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
        title={editingId ? "Cập Nhật Bài Viết" : "Đăng Bài Viết Mới"}
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
              {submitting ? 'Đang xử lý...' : (editingId ? 'Cập nhật' : 'Đăng bài')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

