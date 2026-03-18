import { IconTrendUp, IconTrendDown } from '../../../shared/components/Icons'
import type { StatCardData } from '../../../shared/types'

type Props = StatCardData

export default function StatCard({ label, value, change, changeType, icon: Icon, color }: Props) {
  const accentColor =
    color === 'orange'
      ? 'text-[var(--accent)]'
      : color === 'pink'
        ? 'text-[var(--pink)]'
        : color === 'teal'
          ? 'text-[var(--teal)]'
          : 'text-[var(--gold)]'

  const iconBg =
    color === 'orange'
      ? 'bg-[rgba(108,142,255,0.12)] text-[var(--accent)]'
      : color === 'pink'
        ? 'bg-[rgba(192,132,252,0.12)] text-[var(--pink)]'
        : color === 'teal'
          ? 'bg-[rgba(52,211,153,0.12)] text-[var(--teal)]'
          : 'bg-[rgba(251,191,36,0.12)] text-[var(--gold)]'

  const changeColor =
    changeType === 'up'
      ? 'text-[var(--green)]'
      : changeType === 'down'
        ? 'text-[var(--red)]'
        : 'text-[var(--muted)]'

  return (
    <div
      className="
        rounded-[var(--radius)] border border-[#fce7ef]
        bg-white px-5 py-5 shadow-sm shadow-pink-50/50
        transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-pink-100/50
      "
    >

      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="text-[12px] font-medium uppercase tracking-[0.6px] text-[var(--muted)]">
          {label}
        </div>
        <div
          className={`
            flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[9px]
            ${iconBg}
          `}
        >
          <Icon size={16} />
        </div>
      </div>
      <div className={`mb-2 text-[28px] font-bold tracking-[-1px] ${accentColor}`}>
        {value}
      </div>
      <div className={`flex items-center gap-1.5 text-[12px] ${changeColor}`}>
        {changeType === 'up' ? <IconTrendUp size={12} /> : <IconTrendDown size={12} />}
        <span>{change}</span>
      </div>
    </div>
  )
}
