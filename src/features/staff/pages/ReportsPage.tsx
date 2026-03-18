import { useEffect, useState } from 'react'
import { IconAlertCircle, IconCheckCircle, IconEye, IconRefresh, IconSearch, IconClock, IconUser, IconTag } from '../../../shared/components/Icons'
import { useAuth } from '../../../shared/hooks/useAuth'
import { getReportsApi, updateReportStatusApi } from '../services/staffService'
import type { ReportItem } from '../../../shared/types'

const STATUS_MAP: Record<string, string> = {
  'open': 'Chưa xử lý',
  'processing': 'Đang xử lý',
  'resolved': 'Đã giải quyết',
}

const PRIORITY_MAP: Record<string, string> = {
  'high': 'Cao',
  'medium': 'Trung bình',
  'low': 'Thấp',
}

const TYPE_MAP: Record<string, string> = {
  'complaint': 'Khiếu nại',
  'return': 'Hoàn hàng',
  'feedback': 'Phản hồi',
}

const TABS = ['Tất cả', 'Chưa xử lý', 'Đang xử lý', 'Đã giải quyết'] as const

export default function ReportsPage() {
  const { token } = useAuth()
  const [tab, setTab] = useState(0)
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadReports = async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await getReportsApi(token)
      setReports(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReports() }, [token])

  const resolve = async (id: string) => {
    if (!token) return
    try {
      await updateReportStatusApi(token, id, 'resolved')
      loadReports()
    } catch (err: any) { alert(err.message) }
  }

  const process = async (id: string) => {
    if (!token) return
    try {
      await updateReportStatusApi(token, id, 'processing')
      loadReports()
    } catch (err: any) { alert(err.message) }
  }

  const filtered = reports.filter((r) => {
    const matchTab = tab === 0 || 
      (tab === 1 && r.status === 'open') ||
      (tab === 2 && r.status === 'processing') ||
      (tab === 3 && r.status === 'resolved')
    const matchSearch = 
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId.toLowerCase().includes(search.toLowerCase()) ||
      r.content.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div>
      <div className="mb-5 grid gap-4 md:grid-cols-4">
        {[
          { label: 'Chưa xử lý',    value: reports.filter((r) => r.status === 'open').length, color: 'red' },
          { label: 'Đang xử lý',    value: reports.filter((r) => r.status === 'processing').length, color: 'gold' },
          { label: 'Đã giải quyết', value: reports.filter((r) => r.status === 'resolved').length, color: 'green' },
          { label: 'Ưu tiên cao',   value: reports.filter((r) => r.priority === 'high').length, color: 'blue' },
        ].map((s) => (
          <div key={s.label} className="card p-5 flex flex-col items-center">
            <div
              className={`text-2xl font-bold ${
                s.color === 'red'
                  ? 'text-[var(--red)]'
                  : s.color === 'gold'
                    ? 'text-[var(--gold)]'
                    : s.color === 'green'
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--accent)]'
              }`}
            >
              {s.value}
            </div>
            <div className="text-[12px] text-[var(--muted)] uppercase tracking-wider font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="search-wrapper flex-1" style={{ position: 'relative' }}>
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
              className="input h-10 pl-10"
              style={{ paddingLeft: '40px' }}
              placeholder="Tìm khách hàng, mã đơn, nội dung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary h-10 w-10 !p-0" onClick={loadReports} title="Làm mới">
            <IconRefresh size={18} />
          </button>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="tab-row h-12 !mb-0 px-4 border-b border-[var(--border)]">
          {TABS.map((t, i) => (
            <button key={t} className={`tab !py-2 ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
              {t}
            </button>
          ))}
        </div>
        <div className="table-wrap">
          {loading ? (
            <div className="p-20 text-center text-[var(--muted)] animate-pulse flex flex-col items-center gap-3">
              <IconRefresh size={24} className="animate-spin" />
              Đang tải danh sách báo cáo...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-20 text-center text-[var(--muted)]">Không tìm thấy báo cáo nào trong mục này</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Loại</th>
                  <th>Khách hàng</th>
                  <th>Thông tin đơn</th>
                  <th>Nội dung</th>
                  <th>Ưu tiên</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any) => (
                  <tr key={r._id || r.id}>
                    <td>
                      <span
                        className={`status-badge ${r.type === 'complaint' ? 'cancelled' : r.type === 'return' ? 'pending' : 'member'}`}
                      >
                        {TYPE_MAP[r.type] || r.type}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-main text-[13px]">{r.customer}</span>
                        <span className="text-[11px] text-[var(--muted)] flex items-center gap-1">
                          <IconClock size={10} /> {r.createdAt || new Date(r.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--accent)] text-[12px]">{r.orderId}</span>
                      </div>
                    </td>
                    <td>
                      <div className="max-w-[250px] text-[13px] text-text-main line-clamp-2" title={r.content}>
                        {r.content}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {r.priority === 'high' && <IconAlertCircle size={14} color="var(--red)" />}
                        <span
                          className={`text-[12px] font-bold ${
                            r.priority === 'high'
                              ? 'text-[var(--red)]'
                              : r.priority === 'medium'
                                ? 'text-[var(--gold)]'
                                : 'text-[var(--muted)]'
                          }`}
                        >
                          {PRIORITY_MAP[r.priority] || r.priority}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${r.status === 'open' ? 'cancelled' : r.status === 'processing' ? 'pending' : 'completed'}`}
                      >
                        {STATUS_MAP[r.status] || r.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn-icon p-2 hover:bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--accent)]"
                          title="Xem chi tiết"
                        >
                          <IconEye size={16} />
                        </button>
                        {r.status === 'open' && (
                          <button
                            className="btn-icon p-2 bg-[rgba(234,179,8,0.1)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white"
                            onClick={() => process(r._id || r.id)}
                            title="Tiếp nhận xử lý"
                          >
                            <IconAlertCircle size={16} />
                          </button>
                        )}
                        {r.status === 'processing' && (
                          <button
                            className="btn-icon p-2 bg-[rgba(255,143,163,0.1)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                            onClick={() => resolve(r._id || r.id)}
                            title="Hoàn thành giải quyết"
                          >
                            <IconCheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
