import { useEffect, useState } from 'react'
import { IconDownload, IconPlus, IconWarning } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getProductsApi, createProductApi, deleteProductApi, updateProductApi } from '../services/adminService'
import type { Product } from '../../../shared/types'
import Modal from '../../../shared/components/Modal'
import { exportToCSV } from '../../../shared/utils/exportUtils'

const CATS = ['Tất cả', 'Sữa trẻ em', 'Sữa mẹ bầu', 'Thực phẩm', 'Phụ kiện'] as const

export default function ProductsPage() {
  const { token } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState(0)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '67484dfc3e9a56285ca423d2', // Default to a valid category ID if available, or empty
    price: '',
    stock_quantity: '',
    image_url: '',
    brand: 'MilkCare',
    age_range: 'Mọi lứa tuổi',
  })

  const loadMappedProducts = (data: any) => {
    const sorted = [...data].sort((a: any, b: any) => 
      new Date(b.created_at || b.createdAt || 0).getTime() - 
      new Date(a.created_at || a.createdAt || 0).getTime()
    )
    const mapped = sorted.map((item: any) => ({
      ...item,
      id: item._id.substring(item._id.length - 6).toUpperCase(),
      mongoId: item._id,
      name: item.name,
      categoryLabel: item.category?.name || 'Chưa phân loại',
      price: `${item.price?.toLocaleString()} ₫`,
      stock: item.stock_quantity || 0,
      sold: item.sold_quantity || 0,
      statusLabel: item.is_active ? 'active' : 'inactive'
    }))
    setProducts(mapped)
  }

  const loadProducts = async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getProductsApi(token)
      loadMappedProducts(data)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
      }

      if (editingId) {
        await updateProductApi(token, editingId, payload)
        alert('Cập nhật sản phẩm thành công!')
      } else {
        await createProductApi(token, payload)
        alert('Thêm sản phẩm thành công!')
      }
      
      setIsModalOpen(false)
      loadProducts()
      resetForm()
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xử lý sản phẩm')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: '',
      description: '',
      category_id: '67484dfc3e9a56285ca423d2',
      price: '',
      stock_quantity: '',
      image_url: '',
      brand: 'MilkCare',
      age_range: 'Mọi lứa tuổi',
    })
  }

  const handleEdit = (p: any) => {
    setEditingId(p.mongoId)
    setFormData({
      name: p.name,
      description: p.description || '',
      category_id: p.category?._id || '67484dfc3e9a56285ca423d2',
      price: String(p.price_raw || p.price?.replace(/[. ₫]/g, '') || ''), // Rough extraction if original is missing
      stock_quantity: String(p.stock),
      image_url: p.image_url || '',
      brand: p.brand || 'MilkCare',
      age_range: p.age_range || 'Mọi lứa tuổi',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (mongoId: string) => {
    if (!token) return
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return
    try {
      await deleteProductApi(token, mongoId)
      alert('Xóa sản phẩm thành công!')
      loadProducts()
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa sản phẩm')
    }
  }

  const handleExport = () => {
    const headers = [
      { key: 'id', label: 'Mã SP' },
      { key: 'name', label: 'Tên sản phẩm' },
      { key: 'category', label: 'Danh mục' },
      { key: 'price', label: 'Giá' },
      { key: 'stock', label: 'Tồn kho' },
      { key: 'sold', label: 'Đã bán' },
      { key: 'statusLabel', label: 'Trạng thái' },
    ]

    const exportData = filtered.map(p => ({
      ...p,
      statusLabel: p.status === 'active' ? 'Đang bán' : 'Ẩn'
    }))

    exportToCSV(exportData, headers, 'Danh_sach_san_pham')
  }

  const filtered = products.filter((p) => {
    const matchCat = cat === 0 || p.categoryLabel === CATS[cat]
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const currentProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [cat, search])

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          className="input"
          style={{ maxWidth: 280 }}
          placeholder="Tìm tên sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={handleExport} disabled={loading || filtered.length === 0}>
            <IconDownload size={14} /> Xuất Excel
          </button>
          <button className="btn btn-primary" onClick={() => { resetForm(); setIsModalOpen(true); }}>
            <IconPlus size={14} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="card">
        <div className="tab-row">
          {CATS.map((c, i) => (
            <button key={c} className={`tab ${cat === i ? 'active' : ''}`} onClick={() => setCat(i)}>{c}</button>
          ))}
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="p-10 text-center text-[var(--muted)] animate-pulse">Đang tải sản phẩm...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Đã bán</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((p) => (
                  <tr key={p.mongoId}>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{p.id}</td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td><span className="status-badge member">{p.categoryLabel}</span></td>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{p.price}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: p.stock <= 5 ? 'var(--red)' : 'var(--text)', fontWeight: p.stock <= 5 ? 700 : 400 }}>
                        {p.stock <= 5 && <IconWarning size={13} color="var(--red)" />}
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{p.sold}</td>
                    <td><span className={`status-badge ${p.statusLabel}`}>{p.status === 'active' || p.statusLabel === 'active' ? 'Đang bán' : 'Ẩn'}</span></td>
                    <td>
                      <span className="cursor-pointer text-[12px] text-primary hover:underline font-bold" onClick={() => handleEdit(p)}>
                        Sửa
                      </span>
                      {' · '}
                      <span 
                         className="cursor-pointer text-[12px] text-primary hover:underline font-bold"
                         onClick={() => handleDelete(p.mongoId)}
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
        
        {/* Pagination Controls */}
        {!loading && filtered.length > 0 && (
          <div className="p-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="text-[12px] text-[var(--muted)]">
              Hiển thị {Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(filtered.length, currentPage * itemsPerPage)} của {filtered.length} sản phẩm
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-outline h-8 px-3 text-[12px]"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-[var(--accent)] text-white shadow-lg' 
                      : 'hover:bg-[var(--surface2)] text-[var(--muted)]'
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                className="btn btn-outline h-8 px-3 text-[12px]"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label text-text-main font-bold">Tên sản phẩm</label>
              <input 
                required className="input w-full" 
                placeholder="VD: Sữa Enfamil NeuroPro" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="label text-text-main font-bold">Giá bán (₫)</label>
              <input 
                required type="number" className="input w-full" 
                placeholder="VD: 550000" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="label text-text-main font-bold">Số lượng tồn kho</label>
              <input 
                required type="number" className="input w-full" 
                placeholder="VD: 100" 
                value={formData.stock_quantity}
                onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
              />
            </div>
            <div>
              <label className="label text-text-main font-bold">Thương hiệu</label>
              <input 
                className="input w-full" 
                placeholder="VD: Enfamil" 
                value={formData.brand}
                onChange={e => setFormData({...formData, brand: e.target.value})}
              />
            </div>
            <div>
              <label className="label text-text-main font-bold">Độ tuổi</label>
              <input 
                className="input w-full" 
                placeholder="VD: 0-6 tháng" 
                value={formData.age_range}
                onChange={e => setFormData({...formData, age_range: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="label text-text-main font-bold">Link ảnh sản phẩm</label>
              <input 
                className="input w-full" 
                placeholder="https://..." 
                value={formData.image_url}
                onChange={e => setFormData({...formData, image_url: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="label text-text-main font-bold">Mô tả sản phẩm</label>
              <textarea 
                className="input w-full min-h-[80px] py-3 px-4 rounded-xl border border-pink-100 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-main" 
                placeholder="Nhập mô tả chi tiết về sản phẩm..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" className="btn btn-secondary flex-1" 
              onClick={() => setIsModalOpen(false)}
            >Hủy</button>
            <button 
              type="submit" className="btn btn-primary flex-1 font-bold" 
              disabled={submitting}
            >
              {submitting ? 'Đang xử lý...' : editingId ? 'Cập Nhật' : 'Xác nhận Thêm'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
