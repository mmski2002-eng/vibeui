"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import { Card072 } from "@/registry/components/card/card-072/card-072"

export type Layout014Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout014Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 год/этап 1 (value), 02 событие, 03 событие, 04 год/этап 2 (value), 05 событие, 06 год/этап 3 (value), 07 событие. Без них — призрак. */
  items?: readonly Layout014Item[]
  /** Сторона закреплённого года. */
  side?: "left" | "right"
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Таймлайн: слева год или этап, закреплённый на время своей группы,
// справа события. Год — крупный моноширинный, у линии времени точки
// событий подсвечиваются акцентом. Закрепление — position: sticky в
// пределах группы, без JS. На узкой ширине год становится заголовком.
const SLOTS = ["y1", "e1", "e2", "y2", "e3", "y3", "e4"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  y1: "empty",
  e1: "text",
  e2: "image",
  y2: "empty",
  e3: "note",
  y3: "empty",
  e4: "lead",
}

const STYLES = `
:where([data-vibeui-block="layout-014"]){
--vibeui-layout-014-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-014-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-014-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-014-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-014-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-014-ink:light-dark(#000000,#ffffff);
--vibeui-layout-014-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-014-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-014-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-014-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-014-on-accent:oklch(from var(--vibeui-layout-014-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-014-glow:color-mix(in oklab,var(--vibeui-layout-014-accent) 42%,transparent);
--vibeui-layout-014-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-014-radius:1.25rem;--vibeui-layout-014-dur-4:340ms;--vibeui-layout-014-dur-5:460ms;
--vibeui-layout-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-014-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-014"]{color-scheme:dark}
:where([data-vibeui-block="layout-014"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-014"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-014"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-014-bg);color:var(--vibeui-layout-014-ink);font-family:var(--vibeui-layout-014-font)}
[data-vibeui-block="layout-014"] *{box-sizing:border-box}
[data-vibeui-block="layout-014"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-014"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-014"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-014"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-014-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-014"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-014-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-014"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-014"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-014-ghost);margin-top:0.25rem}
[data-vibeui-block="layout-014"] [data-part="tile-num"]{position:absolute;top:1.125rem;left:1.125rem;z-index:1;font:500 0.6875rem/1 var(--vibeui-layout-014-mono);letter-spacing:0.08em;padding:0.375rem 0.5rem;border-radius:999px;color:var(--vibeui-layout-014-muted);border:1px solid var(--vibeui-layout-014-edge);background:color-mix(in oklab,var(--vibeui-layout-014-tile) 70%,transparent);transition:color var(--vibeui-layout-014-dur-4),border-color var(--vibeui-layout-014-dur-4),background-color var(--vibeui-layout-014-dur-4)}
[data-vibeui-block="layout-014"][data-numbers] [data-part="icon"],[data-vibeui-block="layout-014"][data-numbers] [data-part="faces"],[data-vibeui-block="layout-014"][data-numbers] [data-part="spark"],[data-vibeui-block="layout-014"][data-numbers] [data-part="rows"],[data-vibeui-block="layout-014"][data-numbers] [data-part="window"]{margin-top:2rem}
[data-vibeui-block="layout-014"] [data-part="big"]{display:block;height:3rem;width:55%;border-radius:0.75rem;background:var(--vibeui-layout-014-ghost-strong)}
[data-vibeui-block="layout-014"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="layout-014"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-014"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-014-accent);flex:none;transition:transform var(--vibeui-layout-014-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-014"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-014-ghost);flex:1}
[data-vibeui-block="layout-014"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="layout-014"] [data-part="rows"][data-table] span{gap:1.25rem;padding:0.5rem 0;border-bottom:1px solid var(--vibeui-layout-014-edge)}
[data-vibeui-block="layout-014"] [data-part="rows"][data-table] b:first-child{max-width:30%}
[data-vibeui-block="layout-014"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-014-accent);margin-bottom:auto;transition:transform var(--vibeui-layout-014-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-014"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="layout-014"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-layout-014-tile);background:var(--vibeui-layout-014-ghost-strong);margin-inline-start:-0.625rem;transition:transform var(--vibeui-layout-014-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-014"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-layout-014-accent)}
[data-vibeui-block="layout-014"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="layout-014"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-layout-014-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="layout-014"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-layout-014-glow);fill-opacity:0.25;stroke:none}
[data-vibeui-block="layout-014"] [data-part="window"]{display:block;flex:1;min-height:8rem;border-radius:0.75rem 0.75rem 0 0;border:1px solid var(--vibeui-layout-014-edge);border-bottom:0;background:linear-gradient(var(--vibeui-layout-014-tile-2),var(--vibeui-layout-014-tile-2)) 0 0 / 100% 2rem no-repeat,repeating-linear-gradient(to bottom,transparent 0 2.75rem,var(--vibeui-layout-014-ghost) 2.75rem 3.25rem) 1.25rem 0 / calc(100% - 2.5rem) 100% no-repeat,var(--vibeui-layout-014-tile);position:relative;margin-bottom:0}
[data-vibeui-block="layout-014"] [data-part="window"] i{position:absolute;top:0.7rem;width:0.6rem;height:0.6rem;border-radius:999px;background:var(--vibeui-layout-014-ghost-strong)}
[data-vibeui-block="layout-014"] [data-part="window"] i:nth-child(1){left:0.75rem;background:var(--vibeui-layout-014-accent)}
[data-vibeui-block="layout-014"] [data-part="window"] i:nth-child(2){left:1.6rem}
[data-vibeui-block="layout-014"] [data-part="window"] i:nth-child(3){left:2.45rem}
@keyframes vibeui-layout-014-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-014-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
@supports (animation-timeline: view()){
}

[data-vibeui-block="layout-014"] [data-part="body"]{display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-014"] [data-part="group"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="layout-014"] [data-part="year"]{position:sticky;top:1rem;align-self:start;display:flex;flex-direction:column;gap:0.5rem;padding:0.5rem 0}
[data-vibeui-block="layout-014"] [data-part="year"] b{font:700 clamp(2.5rem,6cqi,4.5rem)/1 var(--vibeui-layout-014-mono);letter-spacing:-0.04em;color:var(--vibeui-layout-014-ink)}
[data-vibeui-block="layout-014"] [data-part="year"] > span:not([data-part]){display:block;width:5rem;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-014-ghost)}
[data-vibeui-block="layout-014"] [data-part="year"] [data-part="tile-num"]{position:static;align-self:flex-start}
[data-vibeui-block="layout-014"] [data-part="events"]{display:flex;flex-direction:column;gap:1rem;position:relative;padding-left:1.75rem}
[data-vibeui-block="layout-014"] [data-part="events"]::before{content:"";position:absolute;left:0.5rem;top:0.5rem;bottom:0.5rem;width:2px;background:var(--vibeui-layout-014-edge-hover)}
[data-vibeui-block="layout-014"] [data-part="events"] [data-vibeui-block="card-072"]{min-height:9rem}
[data-vibeui-block="layout-014"][data-numbers] [data-part="events"] [data-vibeui-block="card-072"]{padding-top:3.25rem}
[data-vibeui-block="layout-014"] [data-part="events"] [data-vibeui-block="card-072"]::after{display:none}
[data-vibeui-block="layout-014"] [data-part="dot"]{position:absolute;left:-1.75rem;top:1.5rem;width:1.125rem;height:1.125rem;border-radius:999px;background:var(--vibeui-layout-014-bg);border:2px solid var(--vibeui-layout-014-edge-hover);transition:transform var(--vibeui-layout-014-dur-5),border-color var(--vibeui-layout-014-dur-5),background-color var(--vibeui-layout-014-dur-5);z-index:1}
[data-vibeui-block="layout-014"] [data-part="events"] [data-vibeui-block="card-072"]{overflow:visible}
[data-vibeui-block="layout-014"] [data-part="events"] [data-vibeui-block="card-072"]::before{border-radius:inherit}
@container (min-width: 48rem){
[data-vibeui-block="layout-014"] [data-part="group"]{grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:2rem}
[data-vibeui-block="layout-014"][data-side="right"] [data-part="year"]{order:2;align-items:flex-end}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-014"] *{animation:none!important;transition:none!important}
}
`



/** Таймлайн с годом: год закреплён, события идут мимо. */
export function Layout014({
  heading,
  lead,
  items,
  side = "left",
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout014Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-014-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Card072 key={key ?? area} data-part="tile" {...items?.[SLOTS.indexOf(area)]} numbers={numbers} index={SLOTS.indexOf(area)} ghost={GHOST[area]} data-area={area} className={className} accent={accent} />
  )
  const frame = useRef(0)

  // Один слушатель на раскладку: событие всплывает от плитки, координаты
  // пишутся только ей. Только мышь — на touch свет не нужен.
  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return

    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    if (!target) return

    const bounds = target.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      target.style.setProperty("--vibeui-card-072-mx", `${x}%`)
      target.style.setProperty("--vibeui-card-072-my", `${y}%`)
      target.style.setProperty("--vibeui-card-072-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-card-072-on", "0")
  }

  return (
    <>
      <style href="vibeui-layout-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-014"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-side={side === "left" ? undefined : side}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {hasHead ? (
            <div data-part="head">
              {heading ? <h2>{heading}</h2> : null}
              {lead ? <p>{lead}</p> : null}
            </div>
          ) : (
            <div data-part="head" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}
          <div data-part="body" onPointerMove={handleMove} onPointerOut={handleLeave}>
            {[
              { year: "y1" as const, events: ["e1", "e2"] as const, fallback: "2024" },
              { year: "y2" as const, events: ["e3"] as const, fallback: "2025" },
              { year: "y3" as const, events: ["e4"] as const, fallback: "2026" },
            ].map(({ year, events, fallback }) => (
              <div data-part="group" key={year}>
                <div data-part="year">
                  {numbers ? (
                    <span data-part="tile-num" aria-hidden="true">
                      {String(SLOTS.indexOf(year) + 1).padStart(2, "0")}
                    </span>
                  ) : null}
                  <b>{items?.[SLOTS.indexOf(year)]?.value ?? fallback}</b>
                  {items?.[SLOTS.indexOf(year)]?.title ? <h3>{items[SLOTS.indexOf(year)]?.title}</h3> : <span aria-hidden="true" />}
                </div>
                <div data-part="events">
                  {events.map((area) => (
                    <div key={area} style={{ position: "relative" }}>
                      <i data-part="dot" aria-hidden="true" />
                      {tile(area)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
