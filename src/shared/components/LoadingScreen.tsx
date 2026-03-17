import styles from './LoadingScreen.module.css'
import { IconMilk } from './Icons'

export default function LoadingScreen() {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}><IconMilk size={36} color="var(--accent)" /></div>
      <div className={styles.dots}><span /><span /><span /></div>
    </div>
  )
}
