import { useState } from 'react'
import { IconTruck, IconRefresh, IconEye } from '../../../shared/components/Icons'
import type { TrackingOrder, TrackingStatus } from '../../../shared/types'
import styles from './StaffPage.module.css'

const ORDERS: TrackingOrder[] = [
  { id: '#ORD-0380', customer: 'Trần Hoa Linh',   phone: '0912345678', product: 'Nan Optipro 1',       total: '780,000 ₫',   address: '123 Nguyễn Huệ, Q.1, TP.HCM',     trackingCode: 'GHTK-AB12345', carrier: 'GHTK',      status: 'shipping',   updatedAt: '10/03 10:30' },
  { id: '#ORD-0376', customer: 'Hoàng Thị Lan',   phone: '0956789012', product: 'Frisolac Gold',       total: '890,000 ₫',   address: '456 Lê Lợi, Q.3, TP.HCM',         trackingCode: 'GHTK-CD67890', carrier: 'GHTK',      status: 'packing',    updatedAt: '10/03 09:15' },
  { id: '#ORD-0375', customer: 'Bùi Thị Hoa',     phone: '0967890123', product: 'Similac Gain IQ',     total: '350,000 ₫',   address: '789 Trần Hưng Đạo, Q.5, TP.HCM',  trackingCode: 'VNP-EF11111',  carrier: 'VNPost',    status: 'delivered',  updatedAt: '09/03 16:45' },
  { id: '#ORD-0374', customer: 'Đỗ Minh Tú',      phone: '0978901234', product: 'Aptamil Gold+ 1',     total: '460,000 ₫',   address: '321 Đinh Tiên Hoàng, Bình Thạnh', trackingCode: 'JTE-GH22222',  carrier: 'J&T Express', status: 'confirmed',  updatedAt: '10/03 08:00' },
  { id: '#ORD-0373', customer: 'Ngô Thị Phương',  phone: '0989012345', product: 'Enfamama A+',         total: '280,000 ₫',   address: '654 Phan Văn Trị, Gò Vấp',        trackingCode: 'JTE-IJ33333',  carrier: 'J&T Express', status: 'returned',   updatedAt: '08/03 14:20' },
]

const STATUS_LABEL: Record<TrackingStatus, string> = {
  confirmed: 'Đã xác nhận',
  packing:   'Đang đóng gói',
  shipping:  'Đang giao',
  delivered: 'Đã giao',
  returned:  'Hoàn hàng',
}

const STATUS_STEPS: TrackingStatus[] = ['confirmed', 'packing', 'shipping', 'delivered']

const TABS = ['Tất cả', 'Đang đóng gói', 'Đang giao', 'Đã giao', 'Hoàn hàng'] as const

export default function TrackingPage() {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<TrackingOrder | null>(null)

  const filtered = ORDERS.filter((o) => {
    const matchTab =
      tab === 0 ||
      (tab === 1 && o.status === 'packing') ||
      (tab === 2 && o.status === 'shipping') ||
      (tab === 3 && o.status === 'delivered') ||
      (tab === 4 && o.status === 'returned')
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.trackingCode.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className={styles.twoCol}>
      {/* Left - table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className={styles.toolbar}>
          <input
            className="input"
            style={{ maxWidth: 300 }}
            placeholder="Tìm mã đơn, mã tracking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline" style={{ marginLeft: 'auto' }}>
            <IconRefresh size={14} /> Cập nhật
          </button>
        </div>

        <div className="card">
          <div className="tab-row">
            {TABS.map((t, i) => (
              <button key={t} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Mã vận đơn</th>
                  <th>Đơn vị</th>
                  <th>Trạng thái</th>
                  <th>Cập nhật</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    style={{ cursor: 'pointer', background: selected?.id === o.id ? 'rgba(52,211,153,.04)' : '' }}
                    onClick={() => setSelected(o)}
                  >
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{o.id}</td>
                    <td style={{ fontWeight: 500 }}>{o.customer}</td>
                    <td style={{ color: 'var(--muted)' }}>{o.product}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--teal)' }}>{o.trackingCode}</td>
                    <td style={{ color: 'var(--muted)' }}>{o.carrier}</td>
                    <td><span className={`status-badge ${o.status}`}>{STATUS_LABEL[o.status]}</span></td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{o.updatedAt}</td>
                    <td>
                      <button className={styles.iconBtn} onClick={() => setSelected(o)}>
                        <IconEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right - detail panel */}
      {selected ? (
        <div className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <div>
              <div className={styles.detailOrderId}>{selected.id}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{selected.customer} · {selected.phone}</div>
            </div>
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
          </div>

          {/* Timeline */}
          <div className={styles.timeline}>
            {STATUS_STEPS.map((step, i) => {
              const steps = STATUS_STEPS
              const currentIdx = steps.indexOf(selected.status as TrackingStatus)
              const isDone = i <= currentIdx
              const isCurrent = i === currentIdx
              return (
                <div key={step} className={styles.timelineStep}>
                  <div className={`${styles.timelineDot} ${isDone ? styles.done : ''} ${isCurrent ? styles.current : ''}`}>
                    {isDone && !isCurrent && <span style={{ fontSize: 10 }}>✓</span>}
                  </div>
                  <div>
                    <div className={`${styles.timelineLabel} ${isCurrent ? styles.activeLabel : ''}`}>
                      {STATUS_LABEL[step]}
                    </div>
                    {isCurrent && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{selected.updatedAt}</div>
                    )}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`${styles.timelineLine} ${i < currentIdx ? styles.doneLine : ''}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Info */}
          <div className={styles.infoGrid}>
            {[
              { label: 'Sản phẩm',   value: selected.product },
              { label: 'Tổng tiền',  value: selected.total },
              { label: 'Mã vận đơn', value: selected.trackingCode },
              { label: 'Đơn vị VC',  value: selected.carrier },
              { label: 'Địa chỉ',    value: selected.address },
            ].map(({ label, value }) => (
              <div key={label} className={styles.infoRow}>
                <span className={styles.infoLabel}>{label}</span>
                <span className={styles.infoValue}>{value}</span>
              </div>
            ))}
          </div>

          <div className={styles.detailActions}>
            <button className="btn btn-outline" style={{ flex: 1 }}>
              <IconTruck size={14} /> Cập nhật trạng thái
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.emptyPanel}>
          <IconTruck size={32} color="var(--muted)" />
          <p>Chọn một đơn hàng để xem chi tiết tracking</p>
        </div>
      )}
    </div>
  )
}
