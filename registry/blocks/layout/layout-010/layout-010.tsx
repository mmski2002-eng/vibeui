"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import type { ComponentProps } from "react"

export type Layout010Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout010Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 плитка, 02 плитка, 03 плитка, 04 плитка, 05 плитка, 06 плитка, 07 плитка, 08 плитка. Без них — призрак. */
  items?: readonly Layout010Item[]
  /** Число колонок на широком экране. */
  columns?: "three" | "four"
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Мозаика: плотная сетка плиток разной высоты на grid-auto-flow: dense —
// без экспериментального masonry и без JS. Высота плитки задаётся span
// рядов по её слоту, dense заполняет дыры следующими по порядку. Порядок
// DOM остаётся порядком чтения: dense переставляет только визуально
// и только вперёд по мелким плиткам.
const SLOTS = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  m1: "image",
  m2: "text",
  m3: "image",
  m4: "stat",
  m5: "image",
  m6: "note",
  m7: "image",
  m8: "proof",
}

const STYLES = `
:where([data-vibeui-block="layout-010"]){
--vibeui-layout-010-dur-4:340ms;
--vibeui-layout-010-dur-5:460ms;
--vibeui-layout-010-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-010-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-010-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-010-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-010-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-010-ink:light-dark(#000000,#ffffff);
--vibeui-layout-010-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-010-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-010-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-010-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-010-on-accent:oklch(from var(--vibeui-layout-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-010-glow:color-mix(in oklab,var(--vibeui-layout-010-accent) 42%,transparent);
--vibeui-layout-010-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-010-radius:1.25rem;--vibeui-layout-010-dur-4:340ms;--vibeui-layout-010-dur-5:460ms;
--vibeui-layout-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-010-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-010"]{color-scheme:dark}
:where([data-vibeui-block="layout-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-010"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-010-bg);color:var(--vibeui-layout-010-ink);font-family:var(--vibeui-layout-010-font)}
[data-vibeui-block="layout-010"] *{box-sizing:border-box}
[data-vibeui-block="layout-010"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-010"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-010"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-010"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-010-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-010"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-010-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-010"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-010"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-010-ghost);margin-top:0.25rem}
[data-vibeui-block="layout-010"][data-numbers] [data-part="icon"],[data-vibeui-block="layout-010"][data-numbers] [data-part="spark"],[data-vibeui-block="layout-010"][data-numbers] [data-part="rows"],[data-vibeui-block="layout-010"][data-numbers] [data-part="window"]{margin-top:2rem}
[data-vibeui-block="layout-010"] [data-part="button"]{display:inline-block;width:6.5rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-layout-010-accent);margin-top:0.5rem;transition:transform var(--vibeui-layout-010-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-010"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="layout-010"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-010"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-010-accent);flex:none;transition:transform var(--vibeui-layout-010-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-010"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-010-ghost);flex:1}
[data-vibeui-block="layout-010"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="layout-010"] [data-part="rows"][data-table] span{gap:1.25rem;padding:0.5rem 0;border-bottom:1px solid var(--vibeui-layout-010-edge)}
[data-vibeui-block="layout-010"] [data-part="rows"][data-table] b:first-child{max-width:30%}
[data-vibeui-block="layout-010"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-010-accent);margin-bottom:auto;transition:transform var(--vibeui-layout-010-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-010"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="layout-010"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-layout-010-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="layout-010"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-layout-010-glow);fill-opacity:0.25;stroke:none}
[data-vibeui-block="layout-010"] [data-part="window"]{display:block;flex:1;min-height:8rem;border-radius:0.75rem 0.75rem 0 0;border:1px solid var(--vibeui-layout-010-edge);border-bottom:0;background:linear-gradient(var(--vibeui-layout-010-tile-2),var(--vibeui-layout-010-tile-2)) 0 0 / 100% 2rem no-repeat,repeating-linear-gradient(to bottom,transparent 0 2.75rem,var(--vibeui-layout-010-ghost) 2.75rem 3.25rem) 1.25rem 0 / calc(100% - 2.5rem) 100% no-repeat,var(--vibeui-layout-010-tile);position:relative;margin-bottom:0}
[data-vibeui-block="layout-010"] [data-part="window"] i{position:absolute;top:0.7rem;width:0.6rem;height:0.6rem;border-radius:999px;background:var(--vibeui-layout-010-ghost-strong)}
[data-vibeui-block="layout-010"] [data-part="window"] i:nth-child(1){left:0.75rem;background:var(--vibeui-layout-010-accent)}
[data-vibeui-block="layout-010"] [data-part="window"] i:nth-child(2){left:1.6rem}
[data-vibeui-block="layout-010"] [data-part="window"] i:nth-child(3){left:2.45rem}
@keyframes vibeui-layout-010-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-010-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
@supports (animation-timeline: view()){
}

[data-vibeui-block="layout-010"] [data-part="body"]{display:grid;gap:1rem;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:6rem;grid-auto-flow:dense}
[data-vibeui-block="layout-010"] [data-area="m1"],[data-vibeui-block="layout-010"] [data-area="m5"]{grid-row:span 4}
[data-vibeui-block="layout-010"] [data-area="m3"],[data-vibeui-block="layout-010"] [data-area="m7"]{grid-row:span 3}
[data-vibeui-block="layout-010"] [data-area="m2"],[data-vibeui-block="layout-010"] [data-area="m6"]{grid-row:span 2}
[data-vibeui-block="layout-010"] [data-area="m4"],[data-vibeui-block="layout-010"] [data-area="m8"]{grid-row:span 2}
@container (min-width: 48rem){
[data-vibeui-block="layout-010"] [data-part="body"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="layout-010"][data-columns="four"] [data-part="body"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-010"] *{animation:none!important;transition:none!important}
}
@keyframes vibeui-layout-010-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
[data-vibeui-block="layout-010"] [data-part="tile"]{position:relative;overflow:hidden;min-height:10rem;padding:1.5rem;border-radius:var(--vibeui-layout-010-radius);
background:var(--vibeui-layout-010-tile);border:1px solid var(--vibeui-layout-010-edge);
display:flex;flex-direction:column;justify-content:flex-end;gap:0.75rem;
--vibeui-layout-010-mx:50%;--vibeui-layout-010-my:50%;--vibeui-layout-010-on:0;
transition:transform var(--vibeui-layout-010-dur-5) cubic-bezier(.2,.8,.2,1),border-color var(--vibeui-layout-010-dur-5);}
[data-vibeui-block="layout-010"] [data-part="tile"]::before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(22rem circle at var(--vibeui-layout-010-mx) var(--vibeui-layout-010-my),color-mix(in oklab,var(--vibeui-layout-010-accent) 14%,transparent),transparent 60%);opacity:var(--vibeui-layout-010-on);transition:opacity var(--vibeui-layout-010-dur-5)}
[data-vibeui-block="layout-010"] [data-part="tile"]::after{content:"";position:absolute;inset:-1px;pointer-events:none;border-radius:inherit;padding:1px;background:radial-gradient(18rem circle at var(--vibeui-layout-010-mx) var(--vibeui-layout-010-my),color-mix(in oklab,var(--vibeui-layout-010-accent) 70%,transparent),transparent 55%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:var(--vibeui-layout-010-on);transition:opacity var(--vibeui-layout-010-dur-5)}
[data-vibeui-block="layout-010"] [data-part="tile"]:hover{border-color:var(--vibeui-layout-010-edge-hover)}
[data-vibeui-block="layout-010"] [data-part="tile"] h3{margin:0;font-size:1.125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="layout-010"] [data-part="tile"] p{margin:0;color:var(--vibeui-layout-010-muted);font-size:0.9375rem;line-height:1.45}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="value"]{font-size:clamp(2.5rem,6cqi,3.5rem);font-weight:650;letter-spacing:-0.03em;line-height:1}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="media"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="media"] > *{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="layout-010"] [data-part="tile"] > :not([data-part="media"]):not([data-part="num"]){position:relative}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="num"]{position:absolute;top:1.125rem;left:1.125rem;z-index:1;font:500 0.6875rem/1 var(--vibeui-layout-010-mono);letter-spacing:0.08em;padding:0.375rem 0.5rem;border-radius:999px;color:var(--vibeui-layout-010-muted);border:1px solid var(--vibeui-layout-010-edge);background:color-mix(in oklab,var(--vibeui-layout-010-tile) 70%,transparent);transition:color var(--vibeui-layout-010-dur-4),border-color var(--vibeui-layout-010-dur-4),background-color var(--vibeui-layout-010-dur-4)}
[data-vibeui-block="layout-010"] [data-part="tile"]:hover [data-part="num"]{color:var(--vibeui-layout-010-on-accent);background:var(--vibeui-layout-010-accent);border-color:var(--vibeui-layout-010-accent)}
[data-vibeui-block="layout-010"] [data-part="tile"][data-numbers] [data-part="faces"],[data-vibeui-block="layout-010"] [data-part="tile"][data-numbers] [data-part="image"]{margin-top:2rem}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="bar"]{display:block;height:0.875rem;border-radius:999px;background:var(--vibeui-layout-010-ghost-strong);width:70%}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="bar"][data-soft]{background:var(--vibeui-layout-010-ghost);height:0.625rem;width:50%}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="bar"][data-wide]{width:88%}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="bar"][data-big]{height:1.5rem}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="big"]{display:block;height:3rem;width:55%;border-radius:0.75rem;background:var(--vibeui-layout-010-ghost-strong)}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-layout-010-tile);background:var(--vibeui-layout-010-ghost-strong);margin-inline-start:-0.625rem;transition:transform var(--vibeui-layout-010-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-layout-010-accent)}
[data-vibeui-block="layout-010"] [data-part="tile"]:hover [data-part="faces"] i:nth-child(2){transform:translateX(3px)}
[data-vibeui-block="layout-010"] [data-part="tile"]:hover [data-part="faces"] i:nth-child(3){transform:translateX(6px)}
[data-vibeui-block="layout-010"] [data-part="tile"]:hover [data-part="faces"] i:nth-child(4){transform:translateX(9px)}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="image"]{display:block;flex:1;min-height:6rem;border-radius:0.75rem;background:radial-gradient(70% 80% at 80% 15%,var(--vibeui-layout-010-glow) 0%,transparent 65%),radial-gradient(60% 70% at 15% 85%,var(--vibeui-layout-010-glow-soft) 0%,transparent 65%),var(--vibeui-layout-010-tile-2);margin-bottom:auto;transition:transform 0.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-010"] [data-part="tile"]:hover [data-part="image"]{transform:scale(1.02)}
[data-vibeui-block="layout-010"] [data-part="tile"]{animation:vibeui-layout-010-rise 0.8s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-layout-010-i) * 80ms)}
@supports (animation-timeline: view()){
[data-vibeui-block="layout-010"] [data-part="tile"]{animation:vibeui-layout-010-rise linear both;animation-timeline:view();animation-range:entry 0% entry 35%;animation-delay:0s}
}
[data-vibeui-block="layout-010"] [data-part="tile"]{min-height:0}
[data-vibeui-block="layout-010"] [data-part="tile"] [data-part="image"]{min-height:0}
[data-vibeui-block="layout-010"] [data-part="tile"]:hover{transform:translateY(-4px)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-010"] [data-part="tile"]:hover{transform:none}
[data-vibeui-block="layout-010"] [data-part="tile"]::before,[data-vibeui-block="layout-010"] [data-part="tile"]::after{display:none}
}
`

function Ghost({ kind }: { kind: string }) {
  switch (kind) {
    case "image":
      return <><span data-part="image" /><span data-part="bar" /><span data-part="bar" data-soft="" /></>
    case "text":
      return <><span data-part="bar" data-wide="" /><span data-part="bar" data-soft="" data-wide="" /><span data-part="bar" data-soft="" /><span data-part="bar" data-soft="" data-wide="" /></>
    case "stat":
      return <><span data-part="big" /><span data-part="bar" data-soft="" /></>
    case "note":
      return <><span data-part="bar" /><span data-part="bar" data-soft="" data-wide="" /><span data-part="bar" data-soft="" /></>
    case "proof":
      return <><div data-part="faces"><i /><i /><i /><i /></div><span data-part="bar" data-wide="" /><span data-part="bar" data-soft="" /></>
    default:
      return null
  }
}

type TileProps = Omit<ComponentProps<"article">, "title" | "children"> & {
  media?: ReactNode
  value?: string
  title?: string
  text?: string
  numbers?: boolean
  index?: number
  ghost?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Tile({
  media,
  value,
  title,
  text,
  numbers = true,
  index = 0,
  ghost = "",
  accent,
  className,
  style,
  ...props
}: TileProps) {
  const palette = {
    "--vibeui-layout-010-i": index,
    ...(accent ? { "--vibeui-layout-010-accent": accent } : null),
    ...style,
  } as CSSProperties
  const filled = Boolean((title || text || value || media))

  return (
      <article
          {...props}
          data-numbers={numbers ? "" : undefined}
          aria-hidden={filled ? undefined : true}
          className={className}
          style={palette}
        >
        {media ? <div data-part="media">{media}</div> : null}
        {numbers ? (
          <span data-part="num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        {filled ? (
          <>
            {value ? <span data-part="value">{value}</span> : null}
            {title ? <h3>{title}</h3> : null}
            {text ? <p>{text}</p> : null}
          </>
        ) : (
          <Ghost kind={ghost} />
        )}
      </article>
  )
}

/** Мозаика: плотная сетка плиток разной высоты. */
export function Layout010({
  heading,
  lead,
  items,
  columns = "three",
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout010Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-010-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Tile key={key ?? area} data-part="tile" {...items?.[SLOTS.indexOf(area)]} numbers={numbers} index={SLOTS.indexOf(area)} ghost={GHOST[area]} data-area={area} className={className} accent={accent} />
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
      target.style.setProperty("--vibeui-card-070-mx", `${x}%`)
      target.style.setProperty("--vibeui-card-070-my", `${y}%`)
      target.style.setProperty("--vibeui-card-070-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-card-070-on", "0")
  }

  return (
    <>
      <style href="vibeui-layout-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-010"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-columns={columns === "three" ? undefined : columns}
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
            {tile("m1")}
            {tile("m2")}
            {tile("m3")}
            {tile("m4")}
            {tile("m5")}
            {tile("m6")}
            {tile("m7")}
            {tile("m8")}
          </div>
        </div>
      </section>
    </>
  )
}
