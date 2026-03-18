import { useState } from 'react'
import { IconTruck, IconRefresh, IconEye } from '../../../shared/components/Icons'
import type { TrackingOrder, TrackingStatus } from '../../../shared/types'

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
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr),minmax(0,1.3fr)]">
      {/* Left - table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mb-5 flex flex-wrap items-center gap-3">
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
        <div className="card h-full border border-[var(--border)] bg-[var(--surface)]">
          <div className="mb-4 flex items-start justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div>
              <div className="text-[15px] font-semibold text-[var(--accent)]">
                {selected.id}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{selected.customer} · {selected.phone}</div>
            </div>
            <button
              className="
                flex h-7 w-7 items-center justify-center rounded-md
                border border-[var(--border)] text-[var(--muted)]
                transition-colors hover:border-[var(--red)] hover:text-[var(--red)]
              "
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>

          {/* Timeline */}
          <div className="mb-5 space-y-3">
            {STATUS_STEPS.map((step, i) => {
              const steps = STATUS_STEPS
              const currentIdx = steps.indexOf(selected.status as TrackingStatus)
              const isDone = i <= currentIdx
              const isCurrent = i === currentIdx
              return (
                <div
                  key={step}
                  className="relative flex items-center gap-3"
                >
                  <div
                    className={[
                      'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold',
                      isDone
                        ? 'border-[var(--teal)] bg-[rgba(52,211,153,0.15)] text-[var(--teal)]'
                        : 'border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)]',
                      isCurrent ? 'ring-2 ring-[rgba(52,211,153,0.35)]' : '',
                    ].join(' ')}
                  >
                    {isDone && !isCurrent && <span style={{ fontSize: 10 }}>✓</span>}
                  </div>
                  <div>
                    <div
                      className={[
                        'text-[13px] font-medium',
                        isCurrent ? 'text-[var(--teal)]' : 'text-[var(--text)]',
                      ].join(' ')}
                    >
                      {STATUS_LABEL[step]}
                    </div>
                    {isCurrent && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{selected.updatedAt}</div>
                    )}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={[
                        'absolute left-[13px] top-7 h-6 w-[2px]',
                        i < currentIdx
                          ? 'bg-[var(--teal)]'
                          : 'bg-[var(--border)]',
                      ].join(' ')}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Info */}
          <div className="mb-4 grid gap-3 text-[13px] sm:grid-cols-2">
            {[
              { label: 'Sản phẩm',   value: selected.product },
              { label: 'Tổng tiền',  value: selected.total },
              { label: 'Mã vận đơn', value: selected.trackingCode },
              { label: 'Đơn vị VC',  value: selected.carrier },
              { label: 'Địa chỉ',    value: selected.address },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-3 rounded-lg bg-[var(--surface2)] px-3 py-2"
              >
                <span className="text-[12px] font-medium text-[var(--muted)]">
                  {label}
                </span>
                <span className="max-w-[60%] text-right text-[var(--text)]">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="btn btn-outline flex-1">
              <IconTruck size={14} /> Cập nhật trạng thái
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface2)] px-6 py-10 text-center text-[13px] text-[var(--muted)]">
          <IconTruck size={32} color="var(--muted)" />
          <p>Chọn một đơn hàng để xem chi tiết tracking</p>
        </div>
      )}
    </div>
  )
}
