import type { ReactNode } from 'react'
import { IconSearch, IconBell, IconCalendar } from './Icons'
import styles from './Topbar.module.css'

interface TopbarProps { title: string; extra?: ReactNode }

export default function Topbar({ title, extra }: TopbarProps) {
  const today = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        {extra}
        <div className={styles.search}>
          <IconSearch size={14} color="var(--muted)" />
          <span>Tìm kiếm...</span>
        </div>
        <div className={styles.date}>
          <IconCalendar size={13} color="var(--muted)" />
          <span>{today}</span>
        </div>
        <div className={styles.notif}>
          <IconBell size={16} />
          <span className={styles.dot} />
        </div>
      </div>
    </header>
  )
}
