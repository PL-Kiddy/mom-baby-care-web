import { IconMilk } from './Icons'

export default function LoadingScreen() {
  return (
    <div
      className="
        flex min-h-screen flex-col items-center justify-center gap-6
        bg-[var(--bg)]
      "
    >
      <div
        className="
          flex h-16 w-16 items-center justify-center
          rounded-[18px]
          border border-[rgba(108,142,255,0.2)]
          bg-[rgba(108,142,255,0.1)]
          animate-pulse
        "
      >
        <IconMilk size={36} color="var(--accent)" />
      </div>

      <div className="flex gap-2">
        <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--pink)] delay-200" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--teal)] delay-400" />
      </div>
    </div>
  )
}
