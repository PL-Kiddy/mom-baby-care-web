import { useState } from 'react'
import { IconSend, IconMessageSquare } from '../../../shared/components/Icons'
import type { ChatSession } from '../../../shared/types'

const SESSIONS: ChatSession[] = [
  { id: 'C001', customer: 'Nguyễn Thị Hương', avatar: 'H', lastMessage: 'Bé 6 tháng tuổi dùng sữa nào tốt ạ?',             time: '5 phút',    unread: 2, status: 'waiting', topic: 'Tư vấn sữa bé' },
  { id: 'C002', customer: 'Trần Thị Mai',     avatar: 'M', lastMessage: 'Chị đang mang thai tháng 5, nên uống loại nào?',  time: '12 phút',   unread: 1, status: 'waiting', topic: 'Sữa mẹ bầu' },
  { id: 'C003', customer: 'Lê Bích Ngọc',     avatar: 'N', lastMessage: 'Shop ơi còn hàng Similac không?',                 time: '20 phút',   unread: 0, status: 'active',  topic: 'Kiểm tra tồn kho' },
  { id: 'C004', customer: 'Phạm Thu Hà',      avatar: 'H', lastMessage: 'Cho mình hỏi voucher WELCOME20 áp dụng được không?', time: '1 giờ',  unread: 0, status: 'active',  topic: 'Voucher & Khuyến mãi' },
  { id: 'C005', customer: 'Võ Minh Anh',      avatar: 'A', lastMessage: 'Cảm ơn shop đã tư vấn!',                          time: '2 giờ',    unread: 0, status: 'closed',  topic: 'Tư vấn sữa bé' },
]

interface Message {
  id: number
  sender: 'customer' | 'staff'
  text: string
  time: string
}

const INIT_MESSAGES: Record<string, Message[]> = {
  C001: [
    { id: 1, sender: 'customer', text: 'Bé 6 tháng tuổi dùng sữa nào tốt ạ?', time: '14:10' },
    { id: 2, sender: 'customer', text: 'Bé nhà mình hay bị táo bón', time: '14:11' },
  ],
  C002: [
    { id: 1, sender: 'customer', text: 'Chị đang mang thai tháng 5, nên uống loại nào?', time: '13:58' },
  ],
  C003: [
    { id: 1, sender: 'customer', text: 'Shop ơi còn hàng Similac không?', time: '13:50' },
    { id: 2, sender: 'staff',    text: 'Dạ shop còn ạ, bạn cần loại nào ạ?', time: '13:51' },
    { id: 3, sender: 'customer', text: 'Similac Gain IQ 4, hộp 900g', time: '13:52' },
  ],
}

const QUICK_REPLIES = [
  'Dạ, bạn vui lòng cho biết thêm bé được mấy tháng tuổi ạ?',
  'Shop đang có khuyến mãi 10% cho đơn từ 500k ạ!',
  'Sản phẩm này phù hợp với bé trên 6 tháng ạ.',
  'Bạn có thể đặt hàng trực tiếp trên website ạ.',
]

export default function ChatPage() {
  const [sessions] = useState<ChatSession[]>(SESSIONS)
  const [selected, setSelected] = useState<ChatSession>(SESSIONS[0])
  const [messages, setMessages] = useState<Record<string, Message[]>>(INIT_MESSAGES)
  const [input, setInput] = useState('')

  const currentMsgs = messages[selected.id] ?? []

  const send = () => {
    if (!input.trim()) return
    const newMsg: Message = {
      id: Date.now(),
      sender: 'staff',
      text: input.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] ?? []), newMsg],
    }))
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div
      className="
        grid h-[calc(100vh-130px)] gap-4
        grid-cols-[300px,minmax(0,1fr)]
      "
    >
      {/* Session list */}
      <div
        className="
          flex flex-col overflow-hidden
          rounded-[var(--radius)] border border-[var(--border)]
          bg-[var(--surface)]
        "
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 pb-3 pt-4">
          <span className="text-[14px] font-semibold">Hội thoại</span>
          <span className="rounded-full bg-[var(--teal)] px-2 py-[2px] text-[10px] font-bold text-[#0b0e18]">
            {sessions.filter(s => s.unread > 0).length} mới
          </span>
        </div>
        {sessions.map((s) => (
          <div
            key={s.id}
            className={[
              'flex cursor-pointer items-start gap-2.5 border-b border-[rgba(31,38,64,0.4)] px-3.5 py-3 transition-colors',
              'hover:bg-[var(--surface2)]',
              selected.id === s.id
                ? 'border-l-2 border-l-[var(--teal)] bg-[rgba(52,211,153,0.06)]'
                : '',
            ].join(' ')}
            onClick={() => setSelected(s)}
          >
            <div
              className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
              style={{
                background: s.status === 'waiting'
                ? 'linear-gradient(135deg, var(--gold), #f59e0b)'
                : s.status === 'active'
                  ? 'linear-gradient(135deg, var(--teal), var(--accent))'
                  : 'var(--surface2)',
                color:
                  s.status === 'closed'
                    ? 'var(--muted)'
                    : '#0b0e18',
              }}
            >
              {s.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold">
                {s.customer}
              </div>
              <div className="mt-[2px] truncate text-[11px] text-[var(--muted)]">
                {s.lastMessage}
              </div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-1">
              <div className="text-[10px] text-[var(--muted)]">
                {s.time}
              </div>
              {s.unread > 0 && (
                <div className="rounded-[10px] bg-[var(--teal)] px-1.5 py-[1px] text-[9px] font-bold text-[#0b0e18]">
                  {s.unread}
                </div>
              )}
              <span className={`status-badge ${s.status === 'waiting' ? 'pending' : s.status === 'active' ? 'processing' : 'inactive'}`} style={{ fontSize: 9, padding: '2px 6px' }}>
                {s.status === 'waiting' ? 'Chờ' : s.status === 'active' ? 'Đang' : 'Đóng'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div
        className="
          flex flex-col overflow-hidden
          rounded-[var(--radius)] border border-[var(--border)]
          bg-[var(--surface)]
        "
      >
        {/* Chat header */}
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-[var(--border)] px-4 py-3.5">
          <div
            className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
            style={{ background: 'linear-gradient(135deg, var(--teal), var(--accent))', color: '#0b0e18' }}
          >
            {selected.avatar}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{selected.customer}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{selected.topic}</div>
          </div>
          <span className={`status-badge ${selected.status === 'waiting' ? 'pending' : selected.status === 'active' ? 'processing' : 'inactive'}`} style={{ marginLeft: 'auto' }}>
            {selected.status === 'waiting' ? 'Đang chờ' : selected.status === 'active' ? 'Đang hoạt động' : 'Đã đóng'}
          </span>
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-4">
          {currentMsgs.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-[13px] text-[var(--muted)] opacity-60">
              <IconMessageSquare size={28} color="var(--muted)" />
              <p>Chưa có tin nhắn nào</p>
            </div>
          )}
          {currentMsgs.map((msg) => (
            <div
              key={msg.id}
              className={[
                'flex max-w-[65%] flex-col',
                msg.sender === 'staff' ? 'self-end' : 'self-start',
              ].join(' ')}
            >
              <div
                className={[
                  'rounded-[14px] px-3.5 py-2.5 text-[13px] leading-relaxed',
                  msg.sender === 'staff'
                    ? 'border border-[rgba(52,211,153,0.2)] bg-[rgba(52,211,153,0.15)]'
                    : 'border border-[var(--border)] bg-[var(--surface2)]',
                  msg.sender === 'staff'
                    ? 'rounded-br-[4px]'
                    : 'rounded-bl-[4px]',
                ].join(' ')}
              >
                {msg.text}
              </div>
              <div
                className={[
                  'mt-1 px-1 text-[10px] text-[var(--muted)]',
                  msg.sender === 'staff' ? 'text-right' : 'text-left',
                ].join(' ')}
              >
                {msg.time}
              </div>
            </div>
          ))}
        </div>

        {/* Quick replies */}
        <div className="flex flex-shrink-0 gap-1.5 overflow-x-auto border-t border-[var(--border)] px-3.5 py-2.5">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              className="
                whitespace-nowrap rounded-[20px] border border-[var(--border)]
                bg-[var(--surface2)] px-3 py-1 text-[11px] font-medium
                text-[var(--muted)] transition-colors hover:border-[var(--teal)] hover:text-[var(--teal)]
              "
              onClick={() => setInput(q)}
            >
              {q.length > 40 ? q.slice(0, 40) + '...' : q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex flex-shrink-0 items-end gap-2.5 border-t border-[var(--border)] px-3.5 py-3">
          <textarea
            className="
              min-h-[42px] flex-1 resize-none rounded-[10px]
              border border-[var(--border)] bg-[var(--surface2)]
              px-3.5 py-2.5 text-[13px] text-[var(--text)]
              outline-none transition-colors
              focus:border-[var(--teal)]
            "
            placeholder="Nhập tin nhắn... (Enter để gửi)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
          />
          <button
            className="
              flex h-10 w-10 flex-shrink-0 items-center justify-center
              rounded-[10px] border-0 bg-[var(--teal)]
              text-[#0b0e18] transition-all
              enabled:hover:bg-[#5ee7be]
              disabled:cursor-not-allowed disabled:opacity-40
            "
            onClick={send}
            disabled={!input.trim()}
          >
            <IconSend size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
