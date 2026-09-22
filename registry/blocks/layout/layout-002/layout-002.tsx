"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import { Card062 } from "@/registry/components/card/card-062/card-062"

export type Layout002Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout002Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 заголовок и действие, 02 окно продукта, 03 показатель, 04 доказательство. Без них — призрак. */
  items?: readonly Layout002Item[]
  /** С какой стороны плитка с заголовком. */
  side?: "left" | "right"
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Bento-hero: первый экран как bento — заголовок и действие в большой
// плитке 2×2, окно продукта 2×1, два доказательства 1×1. Без картинки
// на весь экран: иерархию держит сетка. Плитки появляются каскадом по
// прокрутке, окно продукта чуть приподнимается за курсором.
const SLOTS = ["title", "product", "proofA", "proofB"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  title: "title",
  product: "window",
  proofA: "stat",
  proofB: "proof",
}

const STYLES = `
:where([data-vibeui-block="layout-002"]){
--vibeui-layout-002-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-002-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-002-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-002-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-002-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-002-ink:light-dark(#000000,#ffffff);
--vibeui-layout-002-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-002-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-002-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-002-on-accent:oklch(from var(--vibeui-layout-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-002-glow:color-mix(in oklab,var(--vibeui-layout-002-accent) 42%,transparent);
--vibeui-layout-002-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-002-radius:1.25rem;--vibeui-layout-002-dur-4:340ms;--vibeui-layout-002-dur-5:460ms;
--vibeui-layout-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-002-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-002"]{color-scheme:dark}
:where([data-vibeui-block="layout-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-002"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-002-bg);color:var(--vibeui-layout-002-ink);font-family:var(--vibeui-layout-002-font)}
[data-vibeui-block="layout-002"] *{box-sizing:border-box}
[data-vibeui-block="layout-002"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-002"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-002"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-002"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-002-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-002"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-002-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-002"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-002"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-002-ghost);margin-top:0.25rem}
[data-vibeui-block="layout-002"][data-numbers] [data-part="icon"],[data-vibeui-block="layout-002"][data-numbers] [data-part="spark"],[data-vibeui-block="layout-002"][data-numbers] [data-part="rows"],[data-vibeui-block="layout-002"][data-numbers] [data-part="image"]{margin-top:2rem}
[data-vibeui-block="layout-002"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="layout-002"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-002"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-002-accent);flex:none;transition:transform var(--vibeui-layout-002-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-002"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-002-ghost);flex:1}
[data-vibeui-block="layout-002"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="layout-002"] [data-part="rows"][data-table] span{gap:1.25rem;padding:0.5rem 0;border-bottom:1px solid var(--vibeui-layout-002-edge)}
[data-vibeui-block="layout-002"] [data-part="rows"][data-table] b:first-child{max-width:30%}
[data-vibeui-block="layout-002"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-002-accent);margin-bottom:auto;transition:transform var(--vibeui-layout-002-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-002"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="layout-002"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-layout-002-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="layout-002"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-layout-002-glow);fill-opacity:0.25;stroke:none}
[data-vibeui-block="layout-002"] [data-part="image"]{display:block;flex:1;min-height:6rem;border-radius:0.75rem;background:radial-gradient(70% 80% at 80% 15%,var(--vibeui-layout-002-glow) 0%,transparent 65%),radial-gradient(60% 70% at 15% 85%,var(--vibeui-layout-002-glow-soft) 0%,transparent 65%),var(--vibeui-layout-002-tile-2);margin-bottom:auto;transition:transform 0.6s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-layout-002-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-002-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
@supports (animation-timeline: view()){
}

[data-vibeui-block="layout-002"] [data-part="body"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr);grid-auto-rows:minmax(10rem,auto)}
[data-vibeui-block="layout-002"] [data-area="title"]{min-height:18rem;justify-content:center;gap:1rem}
[data-vibeui-block="layout-002"] [data-area="title"] h3{font-size:clamp(2rem,5cqi,3.5rem);line-height:1.05;letter-spacing:-0.03em;font-weight:650}
[data-vibeui-block="layout-002"] [data-area="title"] p{font-size:1.125rem}
[data-vibeui-block="layout-002"] [data-area="product"]{min-height:14rem;padding-bottom:0;justify-content:flex-end}
@container (min-width: 40rem){
[data-vibeui-block="layout-002"] [data-part="body"]{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="layout-002"] [data-area="title"]{grid-column:span 2}
[data-vibeui-block="layout-002"] [data-area="product"]{grid-column:span 2}
}
@container (min-width: 64rem){
[data-vibeui-block="layout-002"] [data-part="body"]{grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:minmax(12rem,auto);grid-template-areas:"title title product product" "title title proofA proofB"}
[data-vibeui-block="layout-002"][data-side="right"] [data-part="body"]{grid-template-areas:"product product title title" "proofA proofB title title"}
[data-vibeui-block="layout-002"] [data-area="title"]{grid-area:title;min-height:26rem}
[data-vibeui-block="layout-002"] [data-area="product"]{grid-area:product}
[data-vibeui-block="layout-002"] [data-area="proofA"]{grid-area:proofA}
[data-vibeui-block="layout-002"] [data-area="proofB"]{grid-area:proofB}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-002"] *{animation:none!important;transition:none!important}
}
`



/** Bento-hero: первый экран, собранный из плиток. */
export function Layout002({
  heading,
  lead,
  items,
  side = "left",
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout002Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-002-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Card062 key={key ?? area} data-part="tile" {...items?.[SLOTS.indexOf(area)]} numbers={numbers} index={SLOTS.indexOf(area)} ghost={GHOST[area]} data-area={area} className={className} accent={accent} />
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
      target.style.setProperty("--vibeui-card-062-mx", `${x}%`)
      target.style.setProperty("--vibeui-card-062-my", `${y}%`)
      target.style.setProperty("--vibeui-card-062-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-card-062-on", "0")
  }

  return (
    <>
      <style href="vibeui-layout-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-002"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-side={side === "left" ? undefined : side}
        className={className}
        style={palette}
      >
        <div data-part="frame">

          <div data-part="body" onPointerMove={handleMove} onPointerOut={handleLeave}>
            {tile("title")}
            {tile("product")}
            {tile("proofA")}
            {tile("proofB")}
          </div>
        </div>
      </section>
    </>
  )
}
