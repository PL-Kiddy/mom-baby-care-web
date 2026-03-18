import { useState } from 'react'
import { IconDownload, IconPlus, IconWarning } from '../../../shared/components/Icons'
import type { Product } from '../../../shared/types'

const PRODUCTS: Product[] = [
  { id: 'SP001', name: 'Similac Gain IQ 4',    category: 'Sữa trẻ em',  price: '350,000 ₫', stock: 120, sold: 89, status: 'active' },
  { id: 'SP002', name: 'Enfamama A+ Vanilla',  category: 'Sữa mẹ bầu', price: '280,000 ₫', stock: 85,  sold: 72, status: 'active' },
  { id: 'SP003', name: 'Aptamil Gold+ 2',      category: 'Sữa trẻ em',  price: '420,000 ₫', stock: 4,   sold: 61, status: 'active' },
  { id: 'SP004', name: 'Nan Optipro 1',        category: 'Sữa trẻ em',  price: '310,000 ₫', stock: 0,   sold: 54, status: 'inactive' },
  { id: 'SP005', name: 'Dumex Mamil Gold',     category: 'Sữa trẻ em',  price: '395,000 ₫', stock: 67,  sold: 48, status: 'active' },
  { id: 'SP006', name: 'Frisolac Gold 2',      category: 'Sữa trẻ em',  price: '445,000 ₫', stock: 3,   sold: 43, status: 'active' },
]

const CATS = ['Tất cả', 'Sữa trẻ em', 'Sữa mẹ bầu', 'Thực phẩm', 'Phụ kiện'] as const

export default function ProductsPage() {
  const [cat, setCat] = useState(0)
  const [search, setSearch] = useState('')

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = cat === 0 || p.category === CATS[cat]
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

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
          <button className="btn btn-outline"><IconDownload size={14} /> Xuất Excel</button>
          <button className="btn btn-primary"><IconPlus size={14} /> Thêm sản phẩm</button>
        </div>
      </div>

      <div className="card">
        <div className="tab-row">
          {CATS.map((c, i) => (
            <button key={c} className={`tab ${cat === i ? 'active' : ''}`} onClick={() => setCat(i)}>{c}</button>
          ))}
        </div>
        <div className="table-wrap">
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
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{p.id}</td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td><span className="status-badge member">{p.category}</span></td>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{p.price}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: p.stock <= 5 ? 'var(--red)' : 'var(--text)', fontWeight: p.stock <= 5 ? 700 : 400 }}>
                      {p.stock <= 5 && <IconWarning size={13} color="var(--red)" />}
                      {p.stock}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{p.sold}</td>
                  <td><span className={`status-badge ${p.status}`}>{p.status === 'active' ? 'Đang bán' : 'Ẩn'}</span></td>
                  <td>
                    <span className="cursor-pointer text-[12px] text-[var(--accent)] hover:underline">
                      Sửa
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
