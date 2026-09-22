"use client"

import { useRef, useId, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import { Card069 } from "@/registry/components/card/card-069/card-069"

export type Layout009Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout009Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 панель, 02 панель, 03 панель, 04 панель, 05 панель. Без них — призрак. */
  items?: readonly Layout009Item[]
  /** Раскрытие по наведению или по клику. */
  expand?: "hover" | "click"
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Раскрывающиеся панели: пять вертикальных панелей в ряд, наведённая
// или сфокусированная растёт по flex-grow, остальные ужимаются — без JS,
// на переходе flex. В режиме click раскрытие держат radio-кнопки. На
// узкой ширине панели стоят столбиком и растут по высоте.
const SLOTS = ["a", "b", "c", "d", "e"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  a: "image",
  b: "image",
  c: "image",
  d: "image",
  e: "image",
}

const STYLES = `
:where([data-vibeui-block="layout-009"]){
--vibeui-layout-009-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-009-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-009-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-009-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-009-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-009-ink:light-dark(#000000,#ffffff);
--vibeui-layout-009-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-009-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-009-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-009-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-009-on-accent:oklch(from var(--vibeui-layout-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-009-glow:color-mix(in oklab,var(--vibeui-layout-009-accent) 42%,transparent);
--vibeui-layout-009-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-009-radius:1.25rem;--vibeui-layout-009-dur-4:340ms;--vibeui-layout-009-dur-5:460ms;
--vibeui-layout-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-009-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-009"]{color-scheme:dark}
:where([data-vibeui-block="layout-009"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-009"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-009"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-009-bg);color:var(--vibeui-layout-009-ink);font-family:var(--vibeui-layout-009-font)}
[data-vibeui-block="layout-009"] *{box-sizing:border-box}
[data-vibeui-block="layout-009"] [data-part="panel"] [data-part="tile"]{flex:1}
[data-vibeui-block="layout-009"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-009"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-009"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-009"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-009-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-009"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-009-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-009"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-009"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-009-ghost);margin-top:0.25rem}
[data-vibeui-block="layout-009"][data-numbers] [data-part="icon"],[data-vibeui-block="layout-009"][data-numbers] [data-part="faces"],[data-vibeui-block="layout-009"][data-numbers] [data-part="spark"],[data-vibeui-block="layout-009"][data-numbers] [data-part="rows"],[data-vibeui-block="layout-009"][data-numbers] [data-part="window"]{margin-top:2rem}
[data-vibeui-block="layout-009"] [data-part="button"]{display:inline-block;width:6.5rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-layout-009-accent);margin-top:0.5rem;transition:transform var(--vibeui-layout-009-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-009"] [data-part="big"]{display:block;height:3rem;width:55%;border-radius:0.75rem;background:var(--vibeui-layout-009-ghost-strong)}
[data-vibeui-block="layout-009"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="layout-009"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-009"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-009-accent);flex:none;transition:transform var(--vibeui-layout-009-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-009"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-009-ghost);flex:1}
[data-vibeui-block="layout-009"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="layout-009"] [data-part="rows"][data-table] span{gap:1.25rem;padding:0.5rem 0;border-bottom:1px solid var(--vibeui-layout-009-edge)}
[data-vibeui-block="layout-009"] [data-part="rows"][data-table] b:first-child{max-width:30%}
[data-vibeui-block="layout-009"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-009-accent);margin-bottom:auto;transition:transform var(--vibeui-layout-009-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-009"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="layout-009"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-layout-009-tile);background:var(--vibeui-layout-009-ghost-strong);margin-inline-start:-0.625rem;transition:transform var(--vibeui-layout-009-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-009"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-layout-009-accent)}
[data-vibeui-block="layout-009"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="layout-009"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-layout-009-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="layout-009"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-layout-009-glow);fill-opacity:0.25;stroke:none}
[data-vibeui-block="layout-009"] [data-part="window"]{display:block;flex:1;min-height:8rem;border-radius:0.75rem 0.75rem 0 0;border:1px solid var(--vibeui-layout-009-edge);border-bottom:0;background:linear-gradient(var(--vibeui-layout-009-tile-2),var(--vibeui-layout-009-tile-2)) 0 0 / 100% 2rem no-repeat,repeating-linear-gradient(to bottom,transparent 0 2.75rem,var(--vibeui-layout-009-ghost) 2.75rem 3.25rem) 1.25rem 0 / calc(100% - 2.5rem) 100% no-repeat,var(--vibeui-layout-009-tile);position:relative;margin-bottom:0}
[data-vibeui-block="layout-009"] [data-part="window"] i{position:absolute;top:0.7rem;width:0.6rem;height:0.6rem;border-radius:999px;background:var(--vibeui-layout-009-ghost-strong)}
[data-vibeui-block="layout-009"] [data-part="window"] i:nth-child(1){left:0.75rem;background:var(--vibeui-layout-009-accent)}
[data-vibeui-block="layout-009"] [data-part="window"] i:nth-child(2){left:1.6rem}
[data-vibeui-block="layout-009"] [data-part="window"] i:nth-child(3){left:2.45rem}
@keyframes vibeui-layout-009-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-009-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
@supports (animation-timeline: view()){
}

[data-vibeui-block="layout-009"] [data-part="body"]{display:flex;flex-direction:column;gap:0.75rem;min-height:30rem}
[data-vibeui-block="layout-009"] [data-part="panel"]{position:relative;display:flex;flex:1 1 0;min-height:0;min-width:0;transition:flex-grow 0.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-009"] [data-part="panel"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="layout-009"] [data-part="panel"] label{position:absolute;inset:0;cursor:pointer;z-index:1;border-radius:var(--vibeui-layout-009-radius)}
[data-vibeui-block="layout-009"] [data-part="panel"] [data-vibeui-block="card-069"]{flex:1;min-height:5.5rem;padding:1.25rem}
[data-vibeui-block="layout-009"] [data-part="panel"] [data-vibeui-block="card-069"] > [data-part="image"]{position:absolute;inset:0;border-radius:0;margin:0;min-height:0;opacity:0.9}
[data-vibeui-block="layout-009"] [data-part="panel"] [data-vibeui-block="card-069"] > :not([data-part="image"]):not([data-part="media"]):not([data-part="num"]){position:relative;z-index:1}
[data-vibeui-block="layout-009"] [data-part="panel"] [data-vibeui-block="card-069"] [data-part="bar"]{opacity:0;transform:translateY(8px);transition:opacity var(--vibeui-card-069-dur-5),transform var(--vibeui-card-069-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-009"] [data-part="panel"] h3,[data-vibeui-block="layout-009"] [data-part="panel"] p{opacity:0;transform:translateY(8px);transition:opacity var(--vibeui-layout-009-dur-5),transform var(--vibeui-layout-009-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-009"] [data-part="panel"] [data-vibeui-block="card-069"]:hover{transform:none}
[data-vibeui-block="layout-009"][data-expand="click"] [data-part="panel"]:has(input:checked),[data-vibeui-block="layout-009"]:not([data-expand="click"]) [data-part="panel"]:hover,[data-vibeui-block="layout-009"]:not([data-expand="click"]) [data-part="panel"]:focus-within{flex-grow:3.2}
[data-vibeui-block="layout-009"][data-expand="click"] [data-part="panel"]:has(input:checked) [data-vibeui-block="card-069"] [data-part="bar"],[data-vibeui-block="layout-009"][data-expand="click"] [data-part="panel"]:has(input:checked) h3,[data-vibeui-block="layout-009"][data-expand="click"] [data-part="panel"]:has(input:checked) p,[data-vibeui-block="layout-009"]:not([data-expand="click"]) [data-part="panel"]:hover [data-vibeui-block="card-069"] [data-part="bar"],[data-vibeui-block="layout-009"]:not([data-expand="click"]) [data-part="panel"]:hover h3,[data-vibeui-block="layout-009"]:not([data-expand="click"]) [data-part="panel"]:hover p,[data-vibeui-block="layout-009"]:not([data-expand="click"]) [data-part="panel"]:focus-within [data-vibeui-block="card-069"] [data-part="bar"],[data-vibeui-block="layout-009"]:not([data-expand="click"]) [data-part="panel"]:focus-within h3,[data-vibeui-block="layout-009"]:not([data-expand="click"]) [data-part="panel"]:focus-within p{opacity:1;transform:none}
[data-vibeui-block="layout-009"]:not([data-expand="click"]) [data-part="panel"] label{display:none}
[data-vibeui-block="layout-009"] [data-part="panel"] [data-vibeui-block="card-069"] [data-part="num"]{z-index:2}
@container (min-width: 48rem){
[data-vibeui-block="layout-009"] [data-part="body"]{flex-direction:row;min-height:30rem}
[data-vibeui-block="layout-009"] [data-part="panel"] [data-vibeui-block="card-069"]{min-height:30rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-009"] *{animation:none!important;transition:none!important}
}
`



/** Раскрывающиеся панели: наведённая панель расширяется, остальные сжимаются. */
export function Layout009({
  heading,
  lead,
  items,
  expand = "hover",
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout009Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-009-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Card069 key={key ?? area} data-part="tile" {...items?.[SLOTS.indexOf(area)]} numbers={numbers} index={SLOTS.indexOf(area)} ghost={GHOST[area]} data-area={area} className={className} accent={accent} />
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
      target.style.setProperty("--vibeui-card-069-mx", `${x}%`)
      target.style.setProperty("--vibeui-card-069-my", `${y}%`)
      target.style.setProperty("--vibeui-card-069-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-card-069-on", "0")
  }
  const groupId = `panels-${useId().replace(/:/g, "")}`

  return (
    <>
      <style href="vibeui-layout-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-009"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-expand={expand === "hover" ? undefined : expand}
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
            {(["a", "b", "c", "d", "e"] as const).map((area, index) => (
              <div data-part="panel" key={area}>
                <input type="radio" name={groupId} id={`${groupId}-${area}`} defaultChecked={index === 0} />
                <label htmlFor={`${groupId}-${area}`} aria-label={items?.[index]?.title ?? `Панель ${index + 1}`} />
                {tile(area)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
