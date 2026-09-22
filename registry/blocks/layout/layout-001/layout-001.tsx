"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import { Card061 } from "@/registry/components/card/card-061/card-061"

export type Layout001Item = {
  /** Заголовок плитки. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для плитки-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри плитки. */
  media?: ReactNode
}

export type Layout001Props = {
  /** Заголовок над сеткой. */
  heading?: string
  /** Подзаголовок над сеткой. */
  lead?: string
  /** До шести плиток по порядку: ведущая, показатель, список, иконка, доказательство, график. Без них — призрак. */
  items?: readonly Layout001Item[]
  /** С какой стороны ведущая плитка. */
  side?: "left" | "right"
  /** Скругление плиток. */
  radius?: "soft" | "sharp"
  /** Номера плиток 01–06: подсказка, какой слот items куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Bento-витрина: шесть плиток разного веса на сетке 4×3 — ведущая 2×2,
// высокий список на три ряда, широкое доказательство, два квадрата.
// Иерархия задаётся размером, а не цветом. Ведущая плитка живая: два
// радиальных пятна медленно плывут одним CSS-keyframe. Сетка —
// grid-template-areas по container-запросам: 1 → 2 → 4 колонки; порядок
// DOM совпадает с порядком чтения на любой ширине.
// Появление — по прокрутке через animation-timeline: view() (плитка
// проявляется, когда входит в кадр), без поддержки — каскад при загрузке.
// Единственный JS — свет за курсором: координаты пишутся в CSS-переменные
// плитки через rAF, без state; на touch и при reduced-motion света нет.
// Номера 01–06 показывают, какой слот items в какую плитку ложится.
const AREAS = ["lead", "stat", "list", "icon", "proof", "chart"] as const

const STYLES = `
:where([data-vibeui-block="layout-001"]){
--vibeui-layout-001-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-001-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-001-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-001-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-001-ink:light-dark(#000000,#ffffff);
--vibeui-layout-001-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-001-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-001-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-001-on-accent:oklch(from var(--vibeui-layout-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-001-glow:color-mix(in oklab,var(--vibeui-layout-001-accent) 42%,transparent);
--vibeui-layout-001-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-001-radius:1.25rem;--vibeui-layout-001-dur-2:180ms;--vibeui-layout-001-dur-4:340ms;--vibeui-layout-001-dur-5:460ms;
--vibeui-layout-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="layout-001"][data-radius="sharp"]){--vibeui-layout-001-radius:0.5rem}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-001"]{color-scheme:dark}
:where([data-vibeui-block="layout-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-001"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-001-bg);color:var(--vibeui-layout-001-ink);
font-family:var(--vibeui-layout-001-font);
}
[data-vibeui-block="layout-001"] *{box-sizing:border-box}
[data-vibeui-block="layout-001"] [data-part="frame"]{
max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);
display:flex;flex-direction:column;gap:2rem;
}
[data-vibeui-block="layout-001"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-001"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-001"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-001-muted);font-size:1.0625rem;line-height:1.5}
/* Призрак заголовка: те же две строки, что и у текста, плотные, как текст. */
[data-vibeui-block="layout-001"] [data-part="head"] span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-001-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-001"] [data-part="head"] span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-001"] [data-part="head"] span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-001-ghost);margin-top:0.25rem}
/* Сетка: одна колонка, с 40rem — две, с 64rem — четыре с областями. */
[data-vibeui-block="layout-001"] [data-part="grid"]{
display:grid;gap:1rem;grid-template-columns:minmax(0,1fr);grid-auto-rows:minmax(11rem,auto);
}
/* Ведущая плитка живёт: два пятна плывут по одному keyframe, слоями фона. */
[data-vibeui-block="layout-001"] [data-area="lead"]{
min-height:18rem;
background:
radial-gradient(70% 80% at var(--vibeui-layout-001-x,80%) var(--vibeui-layout-001-y,10%),var(--vibeui-layout-001-glow) 0%,transparent 65%),
radial-gradient(60% 70% at calc(100% - var(--vibeui-layout-001-x,80%)) calc(100% - var(--vibeui-layout-001-y,10%)),var(--vibeui-layout-001-glow-soft) 0%,transparent 65%),
var(--vibeui-layout-001-tile);
animation:vibeui-layout-001-rise 0.8s cubic-bezier(.2,.8,.2,1) both,vibeui-layout-001-drift 14s ease-in-out infinite alternate;
}
@container (min-width: 40rem){
[data-vibeui-block="layout-001"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="layout-001"] [data-area="lead"]{grid-column:span 2}
[data-vibeui-block="layout-001"] [data-area="chart"]{grid-column:span 2}
}
@container (min-width: 64rem){
[data-vibeui-block="layout-001"] [data-part="frame"]{padding-block:4rem}
[data-vibeui-block="layout-001"] [data-part="grid"]{
grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:minmax(12rem,auto);
grid-template-areas:"lead lead stat list" "lead lead icon list" "proof proof chart list";
}
[data-vibeui-block="layout-001"][data-side="right"] [data-part="grid"]{
grid-template-areas:"stat list lead lead" "icon list lead lead" "chart list proof proof";
}
[data-vibeui-block="layout-001"] [data-area="lead"]{grid-area:lead}
[data-vibeui-block="layout-001"] [data-area="stat"]{grid-area:stat}
[data-vibeui-block="layout-001"] [data-area="list"]{grid-area:list}
[data-vibeui-block="layout-001"] [data-area="icon"]{grid-area:icon}
[data-vibeui-block="layout-001"] [data-area="proof"]{grid-area:proof}
[data-vibeui-block="layout-001"] [data-area="chart"]{grid-area:chart}
}
/* Появление по прокрутке: где есть view(), плитка проявляется, входя в
   кадр (от нижней кромки до 35% высоты вьюпорта); задержки нет — очередь
   задаёт сама прокрутка. Без поддержки — каскад при загрузке. */
@supports (animation-timeline: view()){
[data-vibeui-block="layout-001"] [data-area="lead"]{
animation:vibeui-layout-001-rise linear both,vibeui-layout-001-drift 14s ease-in-out infinite alternate;
animation-timeline:view(),auto;animation-range:entry 0% entry 35%,normal;
}
}
@keyframes vibeui-layout-001-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-001-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
@keyframes vibeui-layout-001-drift{
from{--vibeui-layout-001-x:88%;--vibeui-layout-001-y:0%}
to{--vibeui-layout-001-x:62%;--vibeui-layout-001-y:34%}
}
@property --vibeui-layout-001-x{syntax:"<percentage>";inherits:false;initial-value:80%}
@property --vibeui-layout-001-y{syntax:"<percentage>";inherits:false;initial-value:10%}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-001"] *{animation:none!important;transition:none!important}
}
`



/** Bento-витрина: шесть плиток разного веса, ведущая живёт. Без JS. */
export function Layout001({
  heading,
  lead,
  items,
  side = "left",
  radius = "soft",
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout001Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-001-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const frame = useRef(0)

  // Один слушатель на сетку: событие всплывает от плитки, координаты пишутся
  // только ей. Только мышь — на touch свет не нужен, композиция без него полна.
  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return

    const tile = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    if (!tile) return

    const bounds = tile.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      tile.style.setProperty("--vibeui-card-061-mx", `${x}%`)
      tile.style.setProperty("--vibeui-card-061-my", `${y}%`)
      tile.style.setProperty("--vibeui-card-061-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const tile = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    tile?.style.setProperty("--vibeui-card-061-on", "0")
  }

  return (
    <>
      <style href="vibeui-layout-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-001"
        data-tone={tone === "auto" ? undefined : tone}
        data-side={side === "right" ? "right" : undefined}
        data-radius={radius === "sharp" ? "sharp" : undefined}
        data-numbers={numbers ? "" : undefined}
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
          <div data-part="grid" onPointerMove={handleMove} onPointerOut={handleLeave}>
            {AREAS.map((area, index) => (
              <Card061 key={area} data-part="tile" {...items?.[index]} numbers={numbers} index={index} ghost={area} data-area={area} className={className} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
