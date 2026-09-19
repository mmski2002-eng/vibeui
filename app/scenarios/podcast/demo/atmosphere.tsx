"use client"

import { useEffect, useState, type CSSProperties } from "react"

/**
 * Атмосфера демо-страницы подкаста: мягкое сияние акцента, которое следует
 * за секцией в кадре (IntersectionObserver по `[data-scene]`) и разливается
 * снизу от мини-плеера, пока что-то играет (`vibeui-player:state`); поверх —
 * живое зерно. Рисуется поверх секций через mix-blend-mode, поэтому видно и
 * на непрозрачных фонах блоков; события мыши не перехватывает.
 */
export function Atmosphere({ accent }: { accent: string }) {
  const [spot, setSpot] = useState({ x: 28, y: 40 })
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"))
    if (scenes.length === 0) return
    const ratios = new Map<Element, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio)
        let best: Element | null = null
        let bestRatio = 0
        for (const [element, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = element
            bestRatio = ratio
          }
        }
        if (!best) return
        const index = scenes.indexOf(best as HTMLElement)
        setSpot({ x: index % 2 === 0 ? 24 : 76, y: 35 + (index % 3) * 15 })
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    )
    scenes.forEach((scene) => observer.observe(scene))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<{ playing?: boolean }>).detail
      setPlaying(Boolean(detail?.playing))
    }
    window.addEventListener("vibeui-player:state", onState)
    return () => window.removeEventListener("vibeui-player:state", onState)
  }, [])

  const style = {
    "--demo-accent": accent,
    "--demo-sx": `${spot.x}%`,
    "--demo-sy": `${spot.y}%`,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-demo-atmosphere" precedence="medium">
        {`
[data-demo-glow]{position:fixed;inset:0;z-index:40;pointer-events:none;mix-blend-mode:screen;translate:calc(var(--demo-sx) - 50%) calc(var(--demo-sy) - 50%);transition:translate 1.6s cubic-bezier(.2,.8,.2,1);will-change:translate}
[data-demo-glow]::after{content:"";position:absolute;inset:-30%;background:radial-gradient(38% 38% at 50% 50%,color-mix(in oklab,var(--demo-accent) 17%,transparent),transparent 70%);animation:demo-glow-drift 12s ease-in-out infinite alternate}
[data-demo-player]{position:fixed;inset:0;z-index:40;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(60% 45% at 50% 112%,color-mix(in oklab,var(--demo-accent) 34%,transparent),transparent 70%);opacity:0;transition:opacity 1s}
[data-demo-player][data-playing="true"]{opacity:1;animation:demo-glow-breathe 2.6s ease-in-out infinite}
[data-demo-grain]{position:fixed;inset:-10%;z-index:41;pointer-events:none;opacity:.07;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:220px 220px;animation:demo-grain 1.2s steps(4) infinite}
@keyframes demo-glow-drift{to{translate:4% 3%;scale:1.1}}
@keyframes demo-glow-breathe{50%{opacity:.55}}
@keyframes demo-grain{25%{translate:-2% 3%}50%{translate:3% -1%}75%{translate:-1% -3%}}
@media (prefers-reduced-motion:reduce){[data-demo-glow],[data-demo-glow]::after,[data-demo-player],[data-demo-grain]{animation:none!important;transition:none!important}}
`}
      </style>
      <div data-demo-glow aria-hidden="true" style={style} />
      <div data-demo-player data-playing={playing} aria-hidden="true" style={{ ["--demo-accent" as string]: accent }} />
      <div data-demo-grain aria-hidden="true" />
    </>
  )
}
