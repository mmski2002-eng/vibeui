"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"

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
[data-vibeui-block="layout-001"] [data-part="tile"]{
position:relative;overflow:hidden;min-height:11rem;
padding:1.5rem;border-radius:var(--vibeui-layout-001-radius);
background:var(--vibeui-layout-001-tile);border:1px solid var(--vibeui-layout-001-edge);
display:flex;flex-direction:column;justify-content:flex-end;gap:0.75rem;
--vibeui-layout-001-mx:50%;--vibeui-layout-001-my:50%;--vibeui-layout-001-on:0;
transition:transform var(--vibeui-layout-001-dur-5) cubic-bezier(.2,.8,.2,1),border-color var(--vibeui-layout-001-dur-5);
animation:vibeui-layout-001-rise 0.8s cubic-bezier(.2,.8,.2,1) both;
animation-delay:calc(var(--vibeui-layout-001-i) * 80ms);
}
/* Свет за курсором: пятно и подсветка кромки в точке указателя. Оба слоя —
   псевдоэлементы с opacity, transform-only анимации, ничего не перерисовывает
   раскладку. */
[data-vibeui-block="layout-001"] [data-part="tile"]::before{
content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;
background:radial-gradient(22rem circle at var(--vibeui-layout-001-mx) var(--vibeui-layout-001-my),color-mix(in oklab,var(--vibeui-layout-001-accent) 14%,transparent),transparent 60%);
opacity:var(--vibeui-layout-001-on);transition:opacity var(--vibeui-layout-001-dur-5);
}
[data-vibeui-block="layout-001"] [data-part="tile"]::after{
content:"";position:absolute;inset:-1px;pointer-events:none;border-radius:inherit;padding:1px;
background:radial-gradient(18rem circle at var(--vibeui-layout-001-mx) var(--vibeui-layout-001-my),color-mix(in oklab,var(--vibeui-layout-001-accent) 70%,transparent),transparent 55%);
-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
-webkit-mask-composite:xor;mask-composite:exclude;
opacity:var(--vibeui-layout-001-on);transition:opacity var(--vibeui-layout-001-dur-5);
}
[data-vibeui-block="layout-001"] [data-part="tile"]:hover{transform:translateY(-4px) scale(1.01);border-color:var(--vibeui-layout-001-edge-hover)}
[data-vibeui-block="layout-001"] [data-part="tile"]:active{transform:translateY(-1px) scale(.995);transition-duration:var(--vibeui-layout-001-dur-2)}
/* Номер плитки: подсказка для наполнения, стоит в верхнем углу; контент,
   прижатый к верху, отступает под него. */
[data-vibeui-block="layout-001"][data-numbers] [data-part="icon"],[data-vibeui-block="layout-001"][data-numbers] [data-part="faces"],[data-vibeui-block="layout-001"][data-numbers] [data-part="spark"],[data-vibeui-block="layout-001"][data-numbers] [data-part="rows"]{margin-top:2rem}
/* Номер плитки: подсказка для наполнения, стоит в верхнем углу. */
[data-vibeui-block="layout-001"] [data-part="num"]{
position:absolute;top:1.125rem;left:1.125rem;z-index:1;
font:500 0.6875rem/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:0.08em;
padding:0.375rem 0.5rem;border-radius:999px;
color:var(--vibeui-layout-001-muted);border:1px solid var(--vibeui-layout-001-edge);
background:color-mix(in oklab,var(--vibeui-layout-001-tile) 70%,transparent);
transition:color var(--vibeui-layout-001-dur-4),border-color var(--vibeui-layout-001-dur-4),background-color var(--vibeui-layout-001-dur-4);
}
[data-vibeui-block="layout-001"] [data-part="tile"]:hover [data-part="num"]{
color:var(--vibeui-layout-001-on-accent);background:var(--vibeui-layout-001-accent);border-color:var(--vibeui-layout-001-accent);
}
[data-vibeui-block="layout-001"] [data-part="tile"] h3{margin:0;font-size:1.125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="layout-001"] [data-part="tile"] p{margin:0;color:var(--vibeui-layout-001-muted);font-size:0.9375rem;line-height:1.45}
[data-vibeui-block="layout-001"] [data-part="value"]{font-size:clamp(2.5rem,6cqi,3.5rem);font-weight:650;letter-spacing:-0.03em;line-height:1}
[data-vibeui-block="layout-001"] [data-part="media"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="layout-001"] [data-part="media"] > *{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="layout-001"] [data-part="tile"] > :not([data-part="media"]):not([data-part="num"]){position:relative}
/* Ведущая плитка живёт: два пятна плывут по одному keyframe, слоями фона. */
[data-vibeui-block="layout-001"] [data-area="lead"]{
min-height:18rem;
background:
radial-gradient(70% 80% at var(--vibeui-layout-001-x,80%) var(--vibeui-layout-001-y,10%),var(--vibeui-layout-001-glow) 0%,transparent 65%),
radial-gradient(60% 70% at calc(100% - var(--vibeui-layout-001-x,80%)) calc(100% - var(--vibeui-layout-001-y,10%)),var(--vibeui-layout-001-glow-soft) 0%,transparent 65%),
var(--vibeui-layout-001-tile);
animation:vibeui-layout-001-rise 0.8s cubic-bezier(.2,.8,.2,1) both,vibeui-layout-001-drift 14s ease-in-out infinite alternate;
}
[data-vibeui-block="layout-001"] [data-part="button"]{transition:transform var(--vibeui-layout-001-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-001"] [data-area="lead"]:hover [data-part="button"]{transform:translateX(4px)}
/* Иконка, аватары и точки чуть оживают вместе с плиткой — отклик читается. */
[data-vibeui-block="layout-001"] [data-part="icon"],[data-vibeui-block="layout-001"] [data-part="faces"] i,[data-vibeui-block="layout-001"] [data-part="rows"] i{transition:transform var(--vibeui-layout-001-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-001"] [data-part="tile"]:hover [data-part="icon"]{transform:rotate(-6deg) scale(1.08)}
[data-vibeui-block="layout-001"] [data-part="tile"]:hover [data-part="faces"] i{transform:translateX(calc(var(--vibeui-layout-001-k) * 3px))}
[data-vibeui-block="layout-001"] [data-part="tile"]:hover [data-part="rows"] i{transform:scale(1.35)}
[data-vibeui-block="layout-001"] [data-part="spark"] path:not([data-fill]){stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="layout-001"] [data-part="tile"]:hover [data-part="spark"] path:not([data-fill]){animation:vibeui-layout-001-draw 1.1s cubic-bezier(.2,.8,.2,1)}
/* Призраки плиток: плашки той же геометрии, что и текст, плотные. */
[data-vibeui-block="layout-001"] [data-part="bar"]{display:block;height:0.875rem;border-radius:999px;background:var(--vibeui-layout-001-ghost-strong);width:70%}
[data-vibeui-block="layout-001"] [data-part="bar"][data-soft]{background:var(--vibeui-layout-001-ghost);height:0.625rem;width:50%}
[data-vibeui-block="layout-001"] [data-part="bar"][data-wide]{width:85%}
[data-vibeui-block="layout-001"] [data-part="button"]{display:inline-block;width:6.5rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-layout-001-accent);margin-top:0.5rem}
[data-vibeui-block="layout-001"] [data-part="big"]{display:block;height:3rem;width:55%;border-radius:0.75rem;background:var(--vibeui-layout-001-ghost-strong)}
[data-vibeui-block="layout-001"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="layout-001"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-001"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-001-accent);flex:none}
[data-vibeui-block="layout-001"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-001-ghost);flex:1}
[data-vibeui-block="layout-001"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="layout-001"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-001-accent);margin-bottom:auto}
[data-vibeui-block="layout-001"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="layout-001"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-layout-001-tile);background:var(--vibeui-layout-001-ghost-strong);margin-inline-start:-0.625rem}
[data-vibeui-block="layout-001"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-layout-001-accent)}
[data-vibeui-block="layout-001"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="layout-001"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-layout-001-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="layout-001"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-layout-001-glow);fill-opacity:0.25;stroke:none}
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
[data-vibeui-block="layout-001"] [data-part="tile"]{
animation:vibeui-layout-001-rise linear both;animation-timeline:view();animation-range:entry 0% entry 35%;animation-delay:0s;
}
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
[data-vibeui-block="layout-001"] [data-part="tile"]:hover{transform:none}
[data-vibeui-block="layout-001"] [data-part="tile"]::before,[data-vibeui-block="layout-001"] [data-part="tile"]::after{display:none}
}
`

function Ghost({ area }: { area: (typeof AREAS)[number] }) {
  switch (area) {
    case "lead":
      return (
        <>
          <span data-part="bar" data-wide="" />
          <span data-part="bar" />
          <span data-part="bar" data-soft="" />
          <span data-part="button" />
        </>
      )
    case "stat":
      return (
        <>
          <span data-part="big" />
          <span data-part="bar" data-soft="" />
        </>
      )
    case "list":
      return (
        <>
          <div data-part="rows">
            <span><i /><b /></span>
            <span><i /><b /></span>
            <span><i /><b /></span>
            <span><i /><b /></span>
            <span><i /><b /></span>
          </div>
          <span data-part="bar" data-soft="" />
        </>
      )
    case "icon":
      return (
        <>
          <span data-part="icon" />
          <span data-part="bar" />
          <span data-part="bar" data-soft="" />
        </>
      )
    case "proof":
      return (
        <>
          <div data-part="faces">
            {[0, 1, 2, 3].map((k) => (
              <i key={k} style={{ "--vibeui-layout-001-k": k } as CSSProperties} />
            ))}
          </div>
          <span data-part="bar" data-wide="" />
          <span data-part="bar" data-soft="" />
        </>
      )
    case "chart":
      return (
        <>
          <svg data-part="spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
            <path data-fill="" d="M0 32 L14 26 L28 29 L42 18 L56 21 L70 10 L84 13 L100 4 L100 40 L0 40 Z" />
            <path d="M0 32 L14 26 L28 29 L42 18 L56 21 L70 10 L84 13 L100 4" />
          </svg>
          <span data-part="bar" />
          <span data-part="bar" data-soft="" />
        </>
      )
  }
}

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
      tile.style.setProperty("--vibeui-layout-001-mx", `${x}%`)
      tile.style.setProperty("--vibeui-layout-001-my", `${y}%`)
      tile.style.setProperty("--vibeui-layout-001-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const tile = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    tile?.style.setProperty("--vibeui-layout-001-on", "0")
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
            {AREAS.map((area, index) => {
              const item = items?.[index]
              const filled = Boolean(item && (item.title || item.text || item.value || item.media))

              return (
                <article
                  key={area}
                  data-part="tile"
                  data-area={area}
                  aria-hidden={filled ? undefined : true}
                  style={{ "--vibeui-layout-001-i": index } as CSSProperties}
                >
                  {item?.media ? <div data-part="media">{item.media}</div> : null}
                  {numbers ? (
                    <span data-part="num" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  ) : null}
                  {filled ? (
                    <>
                      {item?.value ? <span data-part="value">{item.value}</span> : null}
                      {item?.title ? <h3>{item.title}</h3> : null}
                      {item?.text ? <p>{item.text}</p> : null}
                    </>
                  ) : (
                    <Ghost area={area} />
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
