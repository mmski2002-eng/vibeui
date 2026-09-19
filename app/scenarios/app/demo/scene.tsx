"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

export type ScenePhase = "day" | "dusk" | "night" | "dawn"

// Обёртка демо-страницы: следит за секциями с `data-scene` через
// IntersectionObserver и переключает фазу суток на корне — цвета фона,
// чернил и акцента лежат в зарегистрированных CSS-переменных, поэтому
// перетекают плавно, а блоки получают их через пропсы `background/ink/accent`.
// О смене фазы сообщает событием `vibeui-scene:phase`.
const STYLES = `
@property --vibeui-scene-bg{syntax:"<color>";inherits:true;initial-value:#f4f2fb}
@property --vibeui-scene-ink{syntax:"<color>";inherits:true;initial-value:#1c1b2e}
@property --vibeui-scene-accent{syntax:"<color>";inherits:true;initial-value:#7c5cff}
[data-scene-root]{--vibeui-scene-bg:#f4f2fb;--vibeui-scene-ink:#1c1b2e;--vibeui-scene-accent:#7c5cff;background:var(--vibeui-scene-bg);color:var(--vibeui-scene-ink);transition:--vibeui-scene-bg 1.6s ease,--vibeui-scene-ink 1.6s ease,--vibeui-scene-accent 1.6s ease}
[data-scene-root][data-phase="dusk"]{--vibeui-scene-bg:#2b2750;--vibeui-scene-ink:#f4f2fb;--vibeui-scene-accent:#a68cff}
[data-scene-root][data-phase="night"]{--vibeui-scene-bg:#151428;--vibeui-scene-ink:#f4f2fb;--vibeui-scene-accent:#a68cff}
[data-scene-root][data-phase="dawn"]{--vibeui-scene-bg:#f7efe8;--vibeui-scene-ink:#1c1b2e;--vibeui-scene-accent:#7c5cff}
[data-scene-root]::after{content:"";position:fixed;inset:0;z-index:80;pointer-events:none;opacity:.045;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E");background-size:220px}
@media (prefers-reduced-motion:reduce){[data-scene-root]{transition:none}}`

export function Scene({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const sections = Array.from(element.querySelectorAll<HTMLElement>("[data-scene]"))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        const hit = visible[visible.length - 1]
        if (!hit) return
        const phase = (hit.target as HTMLElement).dataset.scene ?? "day"
        if (element.dataset.phase === phase) return
        element.dataset.phase = phase
        window.dispatchEvent(new CustomEvent("vibeui-scene:phase", { detail: phase }))
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style href="vibeui-app-scene" precedence="medium">
        {STYLES}
      </style>
      <div ref={root} data-scene-root="" data-phase="day" style={style} className={className}>
        {children}
      </div>
    </>
  )
}
