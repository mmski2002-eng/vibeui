"use client"

import { useRef, useId, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import { Card068 } from "@/registry/components/card/card-068/card-068"

export type Layout008Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout008Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 навигация сайдбара, 02 топбар, 03 показатель, 04 показатель, 05 график, 06 таблица. Без них — призрак. */
  items?: readonly Layout008Item[]
  /** Сторона сайдбара. */
  side?: "left" | "right"
  /** Сайдбар свёрнут при загрузке. */
  collapsed?: boolean
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Оболочка приложения: сайдбар, топбар, рабочая область. Сайдбар
// сворачивается чекбоксом и :has() — без JS и без состояния: кнопка в
// топбаре — это label. Владелец прокрутки — рабочая область (data-part
// main), оболочка фиксированной высоты; в Copy for AI это сказано явно.
const SLOTS = ["nav", "top", "kpi1", "kpi2", "kpi3", "table"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  nav: "list",
  top: "empty",
  kpi1: "stat",
  kpi2: "stat",
  kpi3: "chart",
  table: "table",
}

const STYLES = `
:where([data-vibeui-block="layout-008"]){
--vibeui-layout-008-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-008-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-008-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-008-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-008-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-008-ink:light-dark(#000000,#ffffff);
--vibeui-layout-008-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-008-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-008-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-008-on-accent:oklch(from var(--vibeui-layout-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-008-glow:color-mix(in oklab,var(--vibeui-layout-008-accent) 42%,transparent);
--vibeui-layout-008-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-008-radius:1.25rem;--vibeui-layout-008-dur-4:340ms;--vibeui-layout-008-dur-5:460ms;
--vibeui-layout-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-008"]{color-scheme:dark}
:where([data-vibeui-block="layout-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-008"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-008-bg);color:var(--vibeui-layout-008-ink);font-family:var(--vibeui-layout-008-font)}
[data-vibeui-block="layout-008"] *{box-sizing:border-box}
[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"]{flex:1}
[data-vibeui-block="layout-008"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-008"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-008"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-008"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-008-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-008"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-008-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-008"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-008"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-008-ghost);margin-top:0.25rem}
[data-vibeui-block="layout-008"][data-numbers] [data-part="icon"],[data-vibeui-block="layout-008"][data-numbers] [data-part="faces"],[data-vibeui-block="layout-008"][data-numbers] [data-part="image"],[data-vibeui-block="layout-008"][data-numbers] [data-part="window"]{margin-top:2rem}
/* Призраки. */
[data-vibeui-block="layout-008"] [data-part="tile-bar"]{display:block;height:0.875rem;border-radius:999px;background:var(--vibeui-layout-008-ghost-strong);width:70%}
[data-vibeui-block="layout-008"] [data-part="tile-bar"][data-soft]{background:var(--vibeui-layout-008-ghost);height:0.625rem;width:50%}
[data-vibeui-block="layout-008"] [data-part="tile-bar"][data-wide]{width:88%}
[data-vibeui-block="layout-008"] [data-part="tile-bar"][data-big]{height:1.5rem}
[data-vibeui-block="layout-008"] [data-part="button"]{display:inline-block;width:6.5rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-layout-008-accent);margin-top:0.5rem;transition:transform var(--vibeui-layout-008-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-008-accent);margin-bottom:auto;transition:transform var(--vibeui-layout-008-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="layout-008"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-layout-008-tile);background:var(--vibeui-layout-008-ghost-strong);margin-inline-start:-0.625rem;transition:transform var(--vibeui-layout-008-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-layout-008-accent)}
[data-vibeui-block="layout-008"] [data-part="image"]{display:block;flex:1;min-height:6rem;border-radius:0.75rem;background:radial-gradient(70% 80% at 80% 15%,var(--vibeui-layout-008-glow) 0%,transparent 65%),radial-gradient(60% 70% at 15% 85%,var(--vibeui-layout-008-glow-soft) 0%,transparent 65%),var(--vibeui-layout-008-tile-2);margin-bottom:auto;transition:transform 0.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="window"]{display:block;flex:1;min-height:8rem;border-radius:0.75rem 0.75rem 0 0;border:1px solid var(--vibeui-layout-008-edge);border-bottom:0;background:linear-gradient(var(--vibeui-layout-008-tile-2),var(--vibeui-layout-008-tile-2)) 0 0 / 100% 2rem no-repeat,repeating-linear-gradient(to bottom,transparent 0 2.75rem,var(--vibeui-layout-008-ghost) 2.75rem 3.25rem) 1.25rem 0 / calc(100% - 2.5rem) 100% no-repeat,var(--vibeui-layout-008-tile);position:relative;margin-bottom:0}
[data-vibeui-block="layout-008"] [data-part="window"] i{position:absolute;top:0.7rem;width:0.6rem;height:0.6rem;border-radius:999px;background:var(--vibeui-layout-008-ghost-strong)}
[data-vibeui-block="layout-008"] [data-part="window"] i:nth-child(1){left:0.75rem;background:var(--vibeui-layout-008-accent)}
[data-vibeui-block="layout-008"] [data-part="window"] i:nth-child(2){left:1.6rem}
[data-vibeui-block="layout-008"] [data-part="window"] i:nth-child(3){left:2.45rem}
@keyframes vibeui-layout-008-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-008-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
@supports (animation-timeline: view()){
}

[data-vibeui-block="layout-008"] [data-part="frame"]{padding:0;max-width:none}
[data-vibeui-block="layout-008"] [data-part="body"]{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);height:min(44rem,100dvh);border:1px solid var(--vibeui-layout-008-edge);border-radius:var(--vibeui-layout-008-radius);overflow:hidden;background:var(--vibeui-layout-008-tile)}
[data-vibeui-block="layout-008"] [data-part="toggle"]{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="layout-008"] [data-part="side"]{display:none;flex-direction:column;gap:1rem;padding:1rem;border-right:1px solid var(--vibeui-layout-008-edge);background:var(--vibeui-layout-008-tile-2);grid-row:1 / -1;overflow:auto;width:16rem;transition:width var(--vibeui-layout-008-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="side"] [data-vibeui-block="card-068"]{background:none;border:0;padding:0;min-height:0;flex:1;justify-content:flex-start}
[data-vibeui-block="layout-008"] [data-part="side"] [data-vibeui-block="card-068"]::before,[data-vibeui-block="layout-008"] [data-part="side"] [data-vibeui-block="card-068"]::after{display:none}
[data-vibeui-block="layout-008"] [data-part="side"] [data-vibeui-block="card-068"] [data-part="num"]{position:static;align-self:flex-start}
[data-vibeui-block="layout-008"] [data-part="brand"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-008"] [data-part="brand"] i{width:2rem;height:2rem;border-radius:0.5rem;background:var(--vibeui-layout-008-accent);flex:none}
[data-vibeui-block="layout-008"] [data-part="brand"] b{display:block;height:0.75rem;width:5rem;border-radius:999px;background:var(--vibeui-layout-008-ghost-strong)}
[data-vibeui-block="layout-008"] [data-part="side"] [data-vibeui-block="card-068"] [data-part="rows"]{justify-content:flex-start;gap:0.5rem}
[data-vibeui-block="layout-008"] [data-part="side"] [data-vibeui-block="card-068"] [data-part="rows"] span{padding:0.5rem 0.625rem;border-radius:0.5rem}
[data-vibeui-block="layout-008"] [data-part="side"] [data-vibeui-block="card-068"] [data-part="rows"] span:first-child{background:color-mix(in oklab,var(--vibeui-card-068-accent) 12%,transparent)}
[data-vibeui-block="layout-008"] [data-part="side"] [data-vibeui-block="card-068"] [data-part="rows"] i{border-radius:0.25rem;width:1rem;height:1rem;background:var(--vibeui-card-068-ghost-strong)}
[data-vibeui-block="layout-008"] [data-part="side"] [data-vibeui-block="card-068"] [data-part="rows"] span:first-child i{background:var(--vibeui-card-068-accent)}
[data-vibeui-block="layout-008"] [data-part="top"]{display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;border-bottom:1px solid var(--vibeui-layout-008-edge)}
[data-vibeui-block="layout-008"] [data-part="top"] label{width:2.25rem;height:2.25rem;border-radius:0.5rem;border:1px solid var(--vibeui-layout-008-edge);display:grid;place-items:center;cursor:pointer;color:var(--vibeui-layout-008-muted)}
[data-vibeui-block="layout-008"] [data-part="top"] label:hover{border-color:var(--vibeui-layout-008-edge-hover);color:var(--vibeui-layout-008-ink)}
[data-vibeui-block="layout-008"] [data-part="top"] [data-part="tile-bar"]{height:0.625rem;width:8rem;margin:0}
[data-vibeui-block="layout-008"] [data-part="top"] [data-part="faces"]{margin:0 0 0 auto}
[data-vibeui-block="layout-008"] [data-part="top"] [data-part="faces"] i{width:2rem;height:2rem}
[data-vibeui-block="layout-008"] [data-part="main"]{overflow:auto;padding:1rem;display:grid;gap:1rem;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start}
[data-vibeui-block="layout-008"] [data-part="main"] [data-vibeui-block="card-068"]{min-height:8rem;padding:1.25rem}
[data-vibeui-block="layout-008"] [data-area="kpi3"]{grid-column:span 2}
[data-vibeui-block="layout-008"] [data-area="table"]{grid-column:span 2;justify-content:flex-start}
[data-vibeui-block="layout-008"] [data-area="top"]{display:none}
@container (min-width: 48rem){
[data-vibeui-block="layout-008"] [data-part="body"]{grid-template-columns:auto minmax(0,1fr)}
[data-vibeui-block="layout-008"] [data-part="side"]{display:flex}
[data-vibeui-block="layout-008"][data-side="right"] [data-part="side"]{order:3;border-right:0;border-left:1px solid var(--vibeui-layout-008-edge)}
[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"]{width:4.5rem}
[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"] [data-part="brand"] b,[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"] [data-vibeui-block="card-068"] [data-part="rows"] b,[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"] [data-part="tile-bar"],[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"] h3,[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"] p{display:none}
[data-vibeui-block="layout-008"] [data-part="main"]{grid-template-columns:repeat(3,minmax(0,1fr));padding:1.5rem}
[data-vibeui-block="layout-008"] [data-area="kpi3"]{grid-column:span 1}
[data-vibeui-block="layout-008"] [data-area="table"]{grid-column:span 3}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-008"] *{animation:none!important;transition:none!important}
}
`



/** Оболочка приложения: сайдбар, топбар и рабочая область. */
export function Layout008({
  heading,
  lead,
  items,
  side = "left",
  collapsed = false,
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout008Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-008-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Card068 key={key ?? area} data-part="tile" {...items?.[SLOTS.indexOf(area)]} numbers={numbers} index={SLOTS.indexOf(area)} ghost={GHOST[area]} data-area={area} className={className} accent={accent} />
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
      target.style.setProperty("--vibeui-card-068-mx", `${x}%`)
      target.style.setProperty("--vibeui-card-068-my", `${y}%`)
      target.style.setProperty("--vibeui-card-068-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-card-068-on", "0")
  }
  const toggleId = `shell-${useId().replace(/:/g, "")}`

  return (
    <>
      <style href="vibeui-layout-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-008"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-side={side === "left" ? undefined : side}
        data-collapsed={collapsed ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">

          <div data-part="body" onPointerMove={handleMove} onPointerOut={handleLeave}>
            <input data-part="toggle" type="checkbox" id={toggleId} defaultChecked={collapsed} />
            <aside data-part="side">
              <div data-part="brand" aria-hidden="true"><i /><b /></div>
              {tile("nav")}
            </aside>
            <header data-part="top">
              <label htmlFor={toggleId} title="Свернуть меню" aria-label="Свернуть меню">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12" /></svg>
              </label>
              {items?.[1]?.title ? <h3>{items[1].title}</h3> : <span data-part="tile-bar" aria-hidden="true" />}
              <div data-part="faces" aria-hidden="true"><i /><i /></div>
            </header>
            <main data-part="main">
              {tile("kpi1")}
              {tile("kpi2")}
              {tile("kpi3")}
              {tile("table")}
            </main>
          </div>
        </div>
      </section>
    </>
  )
}
