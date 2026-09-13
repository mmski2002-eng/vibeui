"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"

export type Layout004Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout004Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 карточка, 02 карточка, 03 карточка, 04 карточка. Без них — призрак. */
  items?: readonly Layout004Item[]
  /** Уменьшать уходящую карточку. */
  shrink?: boolean
  /** Отступ закрепления сверху: под шапку или без. */
  offset?: "none" | "header"
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Стопка карточек: каждая карточка — position: sticky с одним и тем же
// top, поэтому следующая наезжает на предыдущую. Где есть view(), уходящая
// карточка чуть уменьшается и темнеет, пока её накрывают; без поддержки
// стопка просто накладывается — тоже работает. Своё появление, каскад
// плиток здесь выключен: движение задаёт прокрутка.
const SLOTS = ["one", "two", "three", "four"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  one: "lead",
  two: "image",
  three: "list",
  four: "proof",
}

const STYLES = `
:where([data-vibeui-block="layout-004"]){
--vibeui-layout-004-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-004-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-004-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-004-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-004-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-004-ink:light-dark(#000000,#ffffff);
--vibeui-layout-004-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-004-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-004-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-004-on-accent:oklch(from var(--vibeui-layout-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-004-glow:color-mix(in oklab,var(--vibeui-layout-004-accent) 42%,transparent);
--vibeui-layout-004-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-004-radius:1.25rem;--vibeui-layout-004-dur-4:340ms;--vibeui-layout-004-dur-5:460ms;
--vibeui-layout-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-004"]{color-scheme:dark}
:where([data-vibeui-block="layout-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-004"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-004-bg);color:var(--vibeui-layout-004-ink);font-family:var(--vibeui-layout-004-font)}
[data-vibeui-block="layout-004"] *{box-sizing:border-box}
[data-vibeui-block="layout-004"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-004"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-004"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-004"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-004-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-004"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-004-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-004"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-004"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-004-ghost);margin-top:0.25rem}
/* Плитка: слот с контентом или призраком, номером и светом за курсором. */
[data-vibeui-block="layout-004"] [data-part="tile"]{
position:relative;overflow:hidden;min-height:10rem;padding:1.5rem;border-radius:var(--vibeui-layout-004-radius);
background:var(--vibeui-layout-004-tile);border:1px solid var(--vibeui-layout-004-edge);
display:flex;flex-direction:column;justify-content:flex-end;gap:0.75rem;
--vibeui-layout-004-mx:50%;--vibeui-layout-004-my:50%;--vibeui-layout-004-on:0;
transition:transform var(--vibeui-layout-004-dur-5) cubic-bezier(.2,.8,.2,1),border-color var(--vibeui-layout-004-dur-5);
}
[data-vibeui-block="layout-004"] [data-part="tile"]::before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(22rem circle at var(--vibeui-layout-004-mx) var(--vibeui-layout-004-my),color-mix(in oklab,var(--vibeui-layout-004-accent) 14%,transparent),transparent 60%);opacity:var(--vibeui-layout-004-on);transition:opacity var(--vibeui-layout-004-dur-5)}
[data-vibeui-block="layout-004"] [data-part="tile"]::after{content:"";position:absolute;inset:-1px;pointer-events:none;border-radius:inherit;padding:1px;background:radial-gradient(18rem circle at var(--vibeui-layout-004-mx) var(--vibeui-layout-004-my),color-mix(in oklab,var(--vibeui-layout-004-accent) 70%,transparent),transparent 55%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:var(--vibeui-layout-004-on);transition:opacity var(--vibeui-layout-004-dur-5)}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover{border-color:var(--vibeui-layout-004-edge-hover)}
[data-vibeui-block="layout-004"] [data-part="tile"] h3{margin:0;font-size:1.125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="layout-004"] [data-part="tile"] p{margin:0;color:var(--vibeui-layout-004-muted);font-size:0.9375rem;line-height:1.45}
[data-vibeui-block="layout-004"] [data-part="value"]{font-size:clamp(2.5rem,6cqi,3.5rem);font-weight:650;letter-spacing:-0.03em;line-height:1}
[data-vibeui-block="layout-004"] [data-part="media"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="layout-004"] [data-part="media"] > *{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="layout-004"] [data-part="tile"] > :not([data-part="media"]):not([data-part="num"]){position:relative}
[data-vibeui-block="layout-004"] [data-part="num"]{position:absolute;top:1.125rem;left:1.125rem;z-index:1;font:500 0.6875rem/1 var(--vibeui-layout-004-mono);letter-spacing:0.08em;padding:0.375rem 0.5rem;border-radius:999px;color:var(--vibeui-layout-004-muted);border:1px solid var(--vibeui-layout-004-edge);background:color-mix(in oklab,var(--vibeui-layout-004-tile) 70%,transparent);transition:color var(--vibeui-layout-004-dur-4),border-color var(--vibeui-layout-004-dur-4),background-color var(--vibeui-layout-004-dur-4)}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover [data-part="num"]{color:var(--vibeui-layout-004-on-accent);background:var(--vibeui-layout-004-accent);border-color:var(--vibeui-layout-004-accent)}
[data-vibeui-block="layout-004"][data-numbers] [data-part="icon"],[data-vibeui-block="layout-004"][data-numbers] [data-part="faces"],[data-vibeui-block="layout-004"][data-numbers] [data-part="spark"],[data-vibeui-block="layout-004"][data-numbers] [data-part="rows"],[data-vibeui-block="layout-004"][data-numbers] [data-part="image"],[data-vibeui-block="layout-004"][data-numbers] [data-part="window"]{margin-top:2rem}
/* Призраки. */
[data-vibeui-block="layout-004"] [data-part="bar"]{display:block;height:0.875rem;border-radius:999px;background:var(--vibeui-layout-004-ghost-strong);width:70%}
[data-vibeui-block="layout-004"] [data-part="bar"][data-soft]{background:var(--vibeui-layout-004-ghost);height:0.625rem;width:50%}
[data-vibeui-block="layout-004"] [data-part="bar"][data-wide]{width:88%}
[data-vibeui-block="layout-004"] [data-part="bar"][data-big]{height:1.5rem}
[data-vibeui-block="layout-004"] [data-part="button"]{display:inline-block;width:6.5rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-layout-004-accent);margin-top:0.5rem;transition:transform var(--vibeui-layout-004-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover [data-part="button"]{transform:translateX(4px)}
[data-vibeui-block="layout-004"] [data-part="big"]{display:block;height:3rem;width:55%;border-radius:0.75rem;background:var(--vibeui-layout-004-ghost-strong)}
[data-vibeui-block="layout-004"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="layout-004"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-004"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-004-accent);flex:none;transition:transform var(--vibeui-layout-004-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-004"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-004-ghost);flex:1}
[data-vibeui-block="layout-004"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="layout-004"] [data-part="rows"][data-table] span{gap:1.25rem;padding:0.5rem 0;border-bottom:1px solid var(--vibeui-layout-004-edge)}
[data-vibeui-block="layout-004"] [data-part="rows"][data-table] b:first-child{max-width:30%}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover [data-part="rows"] i{transform:scale(1.35)}
[data-vibeui-block="layout-004"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-004-accent);margin-bottom:auto;transition:transform var(--vibeui-layout-004-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover [data-part="icon"]{transform:rotate(-6deg) scale(1.08)}
[data-vibeui-block="layout-004"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="layout-004"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-layout-004-tile);background:var(--vibeui-layout-004-ghost-strong);margin-inline-start:-0.625rem;transition:transform var(--vibeui-layout-004-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-004"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-layout-004-accent)}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover [data-part="faces"] i:nth-child(2){transform:translateX(3px)}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover [data-part="faces"] i:nth-child(3){transform:translateX(6px)}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover [data-part="faces"] i:nth-child(4){transform:translateX(9px)}
[data-vibeui-block="layout-004"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="layout-004"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-layout-004-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="layout-004"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-layout-004-glow);fill-opacity:0.25;stroke:none}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover [data-part="spark"] path:not([data-fill]){animation:vibeui-layout-004-draw 1.1s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-004"] [data-part="image"]{display:block;flex:1;min-height:6rem;border-radius:0.75rem;background:radial-gradient(70% 80% at 80% 15%,var(--vibeui-layout-004-glow) 0%,transparent 65%),radial-gradient(60% 70% at 15% 85%,var(--vibeui-layout-004-glow-soft) 0%,transparent 65%),var(--vibeui-layout-004-tile-2);margin-bottom:auto;transition:transform 0.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover [data-part="image"]{transform:scale(1.02)}
[data-vibeui-block="layout-004"] [data-part="window"]{display:block;flex:1;min-height:8rem;border-radius:0.75rem 0.75rem 0 0;border:1px solid var(--vibeui-layout-004-edge);border-bottom:0;background:linear-gradient(var(--vibeui-layout-004-tile-2),var(--vibeui-layout-004-tile-2)) 0 0 / 100% 2rem no-repeat,repeating-linear-gradient(to bottom,transparent 0 2.75rem,var(--vibeui-layout-004-ghost) 2.75rem 3.25rem) 1.25rem 0 / calc(100% - 2.5rem) 100% no-repeat,var(--vibeui-layout-004-tile);position:relative;margin-bottom:0}
[data-vibeui-block="layout-004"] [data-part="window"] i{position:absolute;top:0.7rem;width:0.6rem;height:0.6rem;border-radius:999px;background:var(--vibeui-layout-004-ghost-strong)}
[data-vibeui-block="layout-004"] [data-part="window"] i:nth-child(1){left:0.75rem;background:var(--vibeui-layout-004-accent)}
[data-vibeui-block="layout-004"] [data-part="window"] i:nth-child(2){left:1.6rem}
[data-vibeui-block="layout-004"] [data-part="window"] i:nth-child(3){left:2.45rem}
@keyframes vibeui-layout-004-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-004-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}

[data-vibeui-block="layout-004"] [data-part="body"]{display:flex;flex-direction:column;gap:1.5rem;--vibeui-layout-004-top:1rem}
[data-vibeui-block="layout-004"][data-offset="header"] [data-part="body"]{--vibeui-layout-004-top:5rem}
[data-vibeui-block="layout-004"] [data-part="tile"]{position:sticky;top:var(--vibeui-layout-004-top);min-height:24rem;transform-origin:center top;box-shadow:0 -1rem 3rem color-mix(in oklab,#000 18%,transparent)}
[data-vibeui-block="layout-004"] [data-part="tile"]:nth-child(2){background:var(--vibeui-layout-004-tile-2)}
[data-vibeui-block="layout-004"] [data-part="tile"]:nth-child(4){background:var(--vibeui-layout-004-tile-2)}
[data-vibeui-block="layout-004"] [data-part="tile"]:last-child{margin-bottom:8rem}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover{transform:none}
[data-vibeui-block="layout-004"] [data-part="tile"] h3{font-size:clamp(1.5rem,3cqi,2.25rem);letter-spacing:-0.02em}
[data-vibeui-block="layout-004"] [data-area="two"] [data-part="image"]{min-height:12rem}
/* Уходящая карточка слушает вход следующей: свой view() у sticky-карточки
   не двигается, пока она прилипла, а следующая входит снизу честно. */
[data-vibeui-block="layout-004"] [data-part="body"]{timeline-scope:--vibeui-layout-004-c1,--vibeui-layout-004-c2,--vibeui-layout-004-c3,--vibeui-layout-004-c4}
[data-vibeui-block="layout-004"] [data-part="tile"]:nth-child(1){view-timeline-name:--vibeui-layout-004-c1}
[data-vibeui-block="layout-004"] [data-part="tile"]:nth-child(2){view-timeline-name:--vibeui-layout-004-c2}
[data-vibeui-block="layout-004"] [data-part="tile"]:nth-child(3){view-timeline-name:--vibeui-layout-004-c3}
[data-vibeui-block="layout-004"] [data-part="tile"]:nth-child(4){view-timeline-name:--vibeui-layout-004-c4}
@supports (animation-timeline: view()){
[data-vibeui-block="layout-004"][data-shrink] [data-part="tile"]:not(:last-child){animation:vibeui-layout-004-sink linear both;animation-range:entry 0% entry 100%}
[data-vibeui-block="layout-004"][data-shrink] [data-part="tile"]:nth-child(1){animation-timeline:--vibeui-layout-004-c2}
[data-vibeui-block="layout-004"][data-shrink] [data-part="tile"]:nth-child(2){animation-timeline:--vibeui-layout-004-c3}
[data-vibeui-block="layout-004"][data-shrink] [data-part="tile"]:nth-child(3){animation-timeline:--vibeui-layout-004-c4}
}
@keyframes vibeui-layout-004-sink{to{transform:scale(.92) translateY(-1rem);filter:brightness(.7)}}
@container (min-width: 48rem){
[data-vibeui-block="layout-004"] [data-part="tile"]{min-height:28rem;padding:2.5rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-004"] *{animation:none!important;transition:none!important}
[data-vibeui-block="layout-004"] [data-part="tile"]:hover{transform:none}
[data-vibeui-block="layout-004"] [data-part="tile"]::before,[data-vibeui-block="layout-004"] [data-part="tile"]::after{display:none}
}
`

function Ghost({ kind }: { kind: string }) {
  switch (kind) {
    case "lead":
      return <><span data-part="bar" data-wide="" /><span data-part="bar" /><span data-part="bar" data-soft="" /><span data-part="button" /></>
    case "image":
      return <><span data-part="image" /><span data-part="bar" /><span data-part="bar" data-soft="" /></>
    case "list":
      return <><div data-part="rows"><span><i /><b /></span><span><i /><b /></span><span><i /><b /></span><span><i /><b /></span></div><span data-part="bar" data-soft="" /></>
    case "proof":
      return <><div data-part="faces"><i /><i /><i /><i /></div><span data-part="bar" data-wide="" /><span data-part="bar" data-soft="" /></>
    default:
      return null
  }
}

type TileProps = {
  area: (typeof SLOTS)[number]
  item?: Layout004Item
  numbers: boolean
  index: number
  className?: string
}

function Tile({ area, item, numbers, index, className }: TileProps) {
  const filled = Boolean(item && (item.title || item.text || item.value || item.media))

  return (
    <article
      data-part="tile"
      data-area={area}
      className={className}
      aria-hidden={filled ? undefined : true}
      style={{ "--vibeui-layout-004-i": index } as CSSProperties}
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
        <Ghost kind={GHOST[area]} />
      )}
    </article>
  )
}

/** Стопка карточек: секции наезжают друг на друга при прокрутке. */
export function Layout004({
  heading,
  lead,
  items,
  shrink = true,
  offset = "none",
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout004Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-004-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Tile
      key={key ?? area}
      area={area}
      item={items?.[SLOTS.indexOf(area)]}
      numbers={numbers}
      index={SLOTS.indexOf(area)}
      className={className}
    />
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
      target.style.setProperty("--vibeui-layout-004-mx", `${x}%`)
      target.style.setProperty("--vibeui-layout-004-my", `${y}%`)
      target.style.setProperty("--vibeui-layout-004-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-layout-004-on", "0")
  }

  return (
    <>
      <style href="vibeui-layout-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-004"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-shrink={shrink ? "" : undefined}
        data-offset={offset === "none" ? undefined : offset}
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
            {tile("one")}
            {tile("two")}
            {tile("three")}
            {tile("four")}
          </div>
        </div>
      </section>
    </>
  )
}
