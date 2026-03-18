import type { ReactNode } from 'react'
import { IconSearch, IconBell, IconCalendar } from './Icons'

interface TopbarProps { title: string; extra?: ReactNode }

export default function Topbar({ title, extra }: TopbarProps) {
  const today = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <header
      className="
        sticky top-0 z-50 flex items-center gap-4
        border-b border-[var(--border)]
        bg-[rgba(11,14,24,0.85)] backdrop-blur-[16px]
        px-7 py-3.5
      "
    >
      <h1 className="flex-1 text-[17px] font-semibold tracking-[-0.3px]">
        {title}
      </h1>

      <div className="flex items-center gap-2.5">
        {extra}

        <button
          type="button"
          className="
            flex min-w-[180px] items-center gap-2
            rounded-lg border border-[var(--border)]
            bg-[var(--surface2)]
            px-[14px] py-[7px]
            text-[13px] text-[var(--muted)]
            transition-colors
            hover:border-[var(--accent)]
          "
        >
          <IconSearch size={14} color="var(--muted)" />
          <span>Tìm kiếm...</span>
        </button>

        <div
          className="
            flex items-center gap-1.5
            rounded-lg border border-[var(--border)]
            bg-[var(--surface2)]
            px-3 py-[7px]
            text-[12px] text-[var(--muted)]
          "
        >
          <IconCalendar size={13} color="var(--muted)" />
          <span>{today}</span>
        </div>

        <button
          type="button"
          className="
            relative flex h-9 w-9 items-center justify-center
            rounded-lg border border-[var(--border)]
            bg-[var(--surface2)]
            text-[var(--muted)]
            transition-all
            hover:border-[var(--accent)] hover:text-[var(--accent)]
          "
        >
          <IconBell size={16} />
          <span
            className="
              absolute right-[7px] top-[7px]
              h-[7px] w-[7px]
              rounded-full border-2 border-[var(--bg)]
              bg-[var(--accent)]
            "
          />
        </button>
      </div>
    </header>
  )
}
