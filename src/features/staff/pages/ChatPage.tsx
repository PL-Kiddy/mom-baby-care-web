import { useState } from 'react'
import { IconSend, IconMessageSquare } from '../../../shared/components/Icons'
import type { ChatSession } from '../../../shared/types'
import styles from './ChatPage.module.css'

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
    <div className={styles.chatLayout}>
      {/* Session list */}
      <div className={styles.sessionList}>
        <div className={styles.sessionHeader}>
          <span className={styles.sessionTitle}>Hội thoại</span>
          <span className={styles.sessionBadge}>{sessions.filter(s => s.unread > 0).length} mới</span>
        </div>
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`${styles.sessionItem} ${selected.id === s.id ? styles.sessionActive : ''}`}
            onClick={() => setSelected(s)}
          >
            <div className={styles.sessionAvatar} style={{
              background: s.status === 'waiting'
                ? 'linear-gradient(135deg, var(--gold), #f59e0b)'
                : s.status === 'active'
                  ? 'linear-gradient(135deg, var(--teal), var(--accent))'
                  : 'var(--surface2)',
              color: s.status === 'closed' ? 'var(--muted)' : s.status === 'waiting' ? '#0b0e18' : '#0b0e18',
            }}>
              {s.avatar}
            </div>
            <div className={styles.sessionInfo}>
              <div className={styles.sessionName}>{s.customer}</div>
              <div className={styles.sessionLast}>{s.lastMessage}</div>
            </div>
            <div className={styles.sessionMeta}>
              <div className={styles.sessionTime}>{s.time}</div>
              {s.unread > 0 && <div className={styles.unreadBadge}>{s.unread}</div>}
              <span className={`status-badge ${s.status === 'waiting' ? 'pending' : s.status === 'active' ? 'processing' : 'inactive'}`} style={{ fontSize: 9, padding: '2px 6px' }}>
                {s.status === 'waiting' ? 'Chờ' : s.status === 'active' ? 'Đang' : 'Đóng'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className={styles.chatWindow}>
        {/* Chat header */}
        <div className={styles.chatHeader}>
          <div className={styles.sessionAvatar} style={{ background: 'linear-gradient(135deg, var(--teal), var(--accent))', color: '#0b0e18' }}>
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
        <div className={styles.messages}>
          {currentMsgs.length === 0 && (
            <div className={styles.emptyChat}>
              <IconMessageSquare size={28} color="var(--muted)" />
              <p>Chưa có tin nhắn nào</p>
            </div>
          )}
          {currentMsgs.map((msg) => (
            <div key={msg.id} className={`${styles.bubble} ${msg.sender === 'staff' ? styles.staffBubble : styles.customerBubble}`}>
              <div className={styles.bubbleText}>{msg.text}</div>
              <div className={styles.bubbleTime}>{msg.time}</div>
            </div>
          ))}
        </div>

        {/* Quick replies */}
        <div className={styles.quickReplies}>
          {QUICK_REPLIES.map((q) => (
            <button key={q} className={styles.quickReply} onClick={() => setInput(q)}>
              {q.length > 40 ? q.slice(0, 40) + '...' : q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className={styles.inputRow}>
          <textarea
            className={styles.chatInput}
            placeholder="Nhập tin nhắn... (Enter để gửi)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
          />
          <button className={styles.sendBtn} onClick={send} disabled={!input.trim()}>
            <IconSend size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
