import { useState } from 'react'
import { IconSend, IconMessageSquare, IconSearch, IconClock, IconRefresh } from '../../../shared/components/Icons'
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
  const [search, setSearch] = useState('')

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

  const filteredSessions = sessions.filter(s => 
    s.customer.toLowerCase().includes(search.toLowerCase()) || 
    s.topic.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex gap-5 h-[calc(100vh-140px)]">
      {/* Session list */}
      <div className="w-[320px] flex flex-col card !p-0 overflow-hidden bg-[var(--surface-solid)]">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-text-main">Hội thoại</h3>
            <span className="bg-[rgba(255,143,163,0.1)] text-[var(--accent)] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[rgba(255,143,163,0.2)]">
              {sessions.filter(s => s.unread > 0).length} Mới
            </span>
          </div>
          <div className="search-wrapper" style={{ position: 'relative' }}>
            <IconSearch 
              className="search-icon" 
              size={14} 
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
              className="input pl-9 h-9 text-[13px]" 
              style={{ paddingLeft: '36px' }}
              placeholder="Tìm khách hàng..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredSessions.map((s) => (
            <div
              key={s.id}
              className={`flex items-start gap-3 p-4 border-b border-[var(--border)] cursor-pointer transition-all hover:bg-[var(--surface2)] ${
                selected.id === s.id ? 'bg-[rgba(255,143,163,0.05)] border-l-4 border-l-[var(--accent)]' : ''
              }`}
              onClick={() => setSelected(s)}
            >
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm"
                  style={{ 
                    background: s.status === 'waiting' 
                      ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' 
                      : s.status === 'active' 
                        ? 'linear-gradient(135deg, var(--accent), var(--accent2))' 
                        : 'var(--muted)' 
                  }}
                >
                  {s.avatar}
                </div>
                {s.status === 'active' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--accent)] border-2 border-[var(--surface)] shadow-sm" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="text-[13px] font-bold text-text-main truncate">{s.customer}</span>
                  <span className="text-[10px] text-[var(--muted)]">{s.time}</span>
                </div>
                <div className="text-[11px] text-[var(--muted)] truncate mb-1">{s.lastMessage}</div>
                <div className="flex items-center gap-2">
                   <span className={`status-badge !px-1.5 !py-0 !text-[9px] ${s.status === 'waiting' ? 'pending' : s.status === 'active' ? 'processing' : 'member'}`}>
                     {s.status === 'waiting' ? 'Đang chờ' : s.status === 'active' ? 'Hoạt động' : 'Đã đóng'}
                   </span>
                   {s.unread > 0 && (
                     <span className="bg-[var(--red)] text-white text-[9px] font-bold px-1.5 rounded-full">{s.unread}</span>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col card !p-0 overflow-hidden bg-[var(--surface-solid)] relative">
        {/* Chat header */}
        <div className="flex items-center gap-3 p-4 border-b border-[var(--border)] bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
          >
            {selected.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-text-main">{selected.customer}</h3>
            <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
               <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Đang hoạt động</span>
               <span>•</span>
               <span>Chủ đề: {selected.topic}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary !p-2 rounded-lg" title="Làm mới">
               <IconRefresh size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[rgba(var(--accent-rgb),0.01)]">
          {currentMsgs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--muted)] opacity-50">
               <IconMessageSquare size={48} className="mb-3" />
               <p className="text-[13px]">Bắt đầu cuộc trò chuyện với {selected.customer}</p>
            </div>
          ) : (
            currentMsgs.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'staff' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${msg.sender === 'staff' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                   <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                     msg.sender === 'staff' 
                       ? 'bg-[var(--accent)] text-white rounded-tr-none' 
                       : 'bg-[var(--surface2)] text-text-main border border-[var(--border)] rounded-tl-none'
                   }`}>
                     {msg.text}
                   </div>
                   <div className="text-[10px] text-[var(--muted)] flex items-center gap-1 px-1">
                     <IconClock size={10} /> {msg.time}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick replies */}
        <div className="p-3 border-t border-[var(--border)] flex gap-2 overflow-x-auto no-scrollbar bg-[var(--surface2)]/30">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-[11px] font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-sm"
              onClick={() => setInput(q)}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[var(--border)] flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              className="input w-full min-h-[44px] max-h-[120px] py-2.5 pl-4 pr-4 resize-none text-[13px]"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
          </div>
          <button
            className="w-11 h-11 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center shadow-lg shadow-[rgba(255,143,163,0.2)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            onClick={send}
            disabled={!input.trim()}
          >
            <IconSend size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
