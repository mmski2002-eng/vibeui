"use client"

import { useEffect, useState, type CSSProperties, type ReactNode } from "react"

type TintShellProps = {
  /** Базовый цвет бумаги: к нему подмешивается цвет наведённого проекта. */
  base: string
  style?: CSSProperties
  className?: string
  children: ReactNode
}

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const STYLES = `
@property --vibeui-page-bg{syntax:"<color>";inherits:true;initial-value:#efeee9}
[data-vibeui-page]{transition:--vibeui-page-bg .9s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-page-grain]{position:fixed;inset:0;z-index:60;pointer-events:none;background-image:${NOISE};background-size:180px 180px;opacity:.045;mix-blend-mode:multiply}
@media (prefers-reduced-motion:reduce){[data-vibeui-page]{transition:none}}`

/**
 * Обёртка демо-страницы: слушает `vibeui-page:tint` от блоков и плавно
 * подмешивает цвет наведённого проекта в фон всей страницы (блоки получают
 * `background: var(--vibeui-page-bg)`), сверху — зерно бумаги.
 */
export function TintShell({ base, style, className, children }: TintShellProps) {
  const [tint, setTint] = useState<string | null>(null)

  useEffect(() => {
    const onTint = (event: Event) => setTint((event as CustomEvent<{ color: string | null }>).detail?.color ?? null)
    window.addEventListener("vibeui-page:tint", onTint)
    return () => window.removeEventListener("vibeui-page:tint", onTint)
  }, [])

  const shell = {
    ...style,
    "--vibeui-page-bg": tint ? `color-mix(in oklab, ${tint} 18%, ${base})` : base,
  } as CSSProperties

  return (
    <div data-vibeui-page="" style={shell} className={className}>
      <style href="vibeui-page-tint" precedence="medium">
        {STYLES}
      </style>
      {children}
      <div data-vibeui-page-grain="" aria-hidden="true" />
    </div>
  )
}
