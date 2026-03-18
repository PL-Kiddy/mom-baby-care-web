import { useState } from 'react'
import { IconAlertCircle, IconCheckCircle, IconEye } from '../../../shared/components/Icons'
import type { ReportItem } from '../../../shared/types'

const REPORTS: ReportItem[] = [
  { id: 'R001', type: 'complaint', customer: 'Nguyễn Thị Mai',   orderId: '#ORD-0350', content: 'Sản phẩm giao sai, nhận được Similac 2 thay vì Similac 4',          status: 'open',       priority: 'high',   createdAt: '10/03/2025' },
  { id: 'R002', type: 'return',    customer: 'Trần Hoa Linh',    orderId: '#ORD-0342', content: 'Hộp sữa bị móp, đề nghị đổi hàng mới',                               status: 'processing', priority: 'medium', createdAt: '09/03/2025' },
  { id: 'R003', type: 'feedback',  customer: 'Lê Thanh Nga',     orderId: '#ORD-0338', content: 'Giao hàng nhanh, sản phẩm đúng, rất hài lòng',                        status: 'resolved',   priority: 'low',    createdAt: '08/03/2025' },
  { id: 'R004', type: 'complaint', customer: 'Phạm Minh Anh',    orderId: '#ORD-0331', content: 'Chờ đợi quá lâu, đơn hàng đặt 5 ngày vẫn chưa giao',                  status: 'open',       priority: 'high',   createdAt: '08/03/2025' },
  { id: 'R005', type: 'return',    customer: 'Võ Thị Thu',       orderId: '#ORD-0325', content: 'Hạn sử dụng còn rất ngắn, không đủ thời gian dùng hết',                status: 'open',       priority: 'medium', createdAt: '07/03/2025' },
  { id: 'R006', type: 'feedback',  customer: 'Hoàng Thị Lan',   orderId: '#ORD-0318', content: 'Staff tư vấn nhiệt tình, nhưng app hay bị lỗi khi thanh toán',          status: 'processing', priority: 'low',    createdAt: '06/03/2025' },
]

const TYPE_LABEL: Record<ReportItem['type'], string> = {
  order:     'Đơn hàng',
  return:    'Hoàn hàng',
  complaint: 'Khiếu nại',
  feedback:  'Phản hồi',
}
const STATUS_LABEL: Record<ReportItem['status'], string> = {
  open:       'Chưa xử lý',
  processing: 'Đang xử lý',
  resolved:   'Đã giải quyết',
}
const PRIORITY_LABEL: Record<ReportItem['priority'], string> = {
  low:    'Thấp',
  medium: 'Trung bình',
  high:   'Cao',
}

const TABS = ['Tất cả', 'Chưa xử lý', 'Đang xử lý', 'Đã giải quyết'] as const

export default function ReportsPage() {
  const [tab, setTab] = useState(0)
  const [reports, setReports] = useState<ReportItem[]>(REPORTS)

  const filtered = reports.filter((r) => {
    if (tab === 0) return true
    return STATUS_LABEL[r.status] === TABS[tab]
  })

  const resolve = (id: string) =>
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: 'resolved' as const } : r))

  const process = (id: string) =>
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: 'processing' as const } : r))

  return (
    <div>
      {/* Summary */}
      <div className="mb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Chưa xử lý',    value: reports.filter(r => r.status === 'open').length,       color: 'red' },
          { label: 'Đang xử lý',    value: reports.filter(r => r.status === 'processing').length,  color: 'gold' },
          { label: 'Đã giải quyết', value: reports.filter(r => r.status === 'resolved').length,    color: 'green' },
          { label: 'Ưu tiên cao',   value: reports.filter(r => r.priority === 'high').length,      color: 'blue' },
        ].map((s) => (
          <div
            key={s.label}
            className="card flex flex-col gap-1.5 text-center"
          >
            <div
              className={[
                'text-2xl font-bold tracking-[-0.5px]',
                s.color === 'red'
                  ? 'text-[var(--red)]'
                  : s.color === 'gold'
                    ? 'text-[var(--gold)]'
                    : s.color === 'green'
                      ? 'text-[var(--teal)]'
                      : 'text-[var(--accent)]',
              ].join(' ')}
            >
              {s.value}
            </div>
            <div className="text-[12px] text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
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
                <th>ID</th>
                <th>Loại</th>
                <th>Khách hàng</th>
                <th>Mã đơn</th>
                <th>Nội dung</th>
                <th>Ưu tiên</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{r.id}</td>
                  <td>
                    <span className={`status-badge ${r.type === 'complaint' ? 'cancelled' : r.type === 'return' ? 'pending' : 'member'}`}>
                      {TYPE_LABEL[r.type]}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{r.customer}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{r.orderId}</td>
                  <td style={{ color: 'var(--muted)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.content}
                  </td>
                  <td>
                    <span style={{
                      color: r.priority === 'high' ? 'var(--red)' : r.priority === 'medium' ? 'var(--gold)' : 'var(--muted)',
                      fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      {r.priority === 'high' && <IconAlertCircle size={12} color="var(--red)" />}
                      {PRIORITY_LABEL[r.priority]}
                    </span>
                  </td>
                  <td><span className={`status-badge ${r.status === 'open' ? 'cancelled' : r.status === 'processing' ? 'pending' : 'completed'}`}>{STATUS_LABEL[r.status]}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{r.createdAt}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="
                          flex h-7 w-7 items-center justify-center rounded-md
                          border border-[var(--border)] bg-[var(--surface2)]
                          text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]
                        "
                      >
                        <IconEye size={14} />
                      </button>
                      {r.status === 'open' && (
                        <button
                          className="
                            flex h-7 w-7 items-center justify-center rounded-md
                            border border-[rgba(234,179,8,0.4)] bg-[rgba(234,179,8,0.08)]
                            text-[var(--gold)] transition-colors hover:border-[var(--gold)]
                          "
                          onClick={() => process(r.id)}
                          title="Tiếp nhận"
                        >
                          <IconAlertCircle size={14} />
                        </button>
                      )}
                      {r.status === 'processing' && (
                        <button
                          className="
                            flex h-7 w-7 items-center justify-center rounded-md
                            border border-[rgba(52,211,153,0.5)] bg-[rgba(52,211,153,0.12)]
                            text-[var(--teal)] transition-colors hover:border-[var(--teal)]
                          "
                          onClick={() => resolve(r.id)}
                          title="Đánh dấu giải quyết"
                        >
                          <IconCheckCircle size={14} />
                        </button>
                      )}
                    </div>
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
