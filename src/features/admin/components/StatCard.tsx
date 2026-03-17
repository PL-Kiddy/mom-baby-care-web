import { IconTrendUp, IconTrendDown } from '../../../shared/components/Icons'
import type { StatCardData } from '../../../shared/types'
import styles from './StatCard.module.css'

type Props = StatCardData

export default function StatCard({ label, value, change, changeType, icon: Icon, color }: Props) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.top}>
        <div className={styles.label}>{label}</div>
        <div className={`${styles.iconBox} ${styles[color]}`}>
          <Icon size={16} />
        </div>
      </div>
      <div className={`${styles.value} ${styles[color]}`}>{value}</div>
      <div className={`${styles.change} ${styles[changeType]}`}>
        {changeType === 'up' ? <IconTrendUp size={12} /> : <IconTrendDown size={12} />}
        <span>{change}</span>
      </div>
    </div>
  )
}
