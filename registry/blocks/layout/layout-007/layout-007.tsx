"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import { Card067 } from "@/registry/components/card/card-067/card-067"

export type Layout007Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout007Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 верхний левый блок, 02 верхний правый блок, 03 нижний левый блок, 04 нижний правый блок. Без них — призрак. */
  items?: readonly Layout007Item[]
  /** Слово заголовка. */
  word?: string
  /** Начертание слова. */
  weight?: "bold" | "black"
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Кинетический заголовок: слово масштаба вьюпорта — сама архитектура
// кадра, контент — четыре коротких блока по углам. Буквы разъезжаются
// по прокрутке (view()), на наведении каждая приподнимается. Слово —
// настоящий текст, не призрак: типографика здесь и есть раскладка.
const SLOTS = ["tl", "tr", "bl", "br"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  tl: "note",
  tr: "stat",
  bl: "text",
  br: "lead",
}

const STYLES = `
:where([data-vibeui-block="layout-007"]){
--vibeui-layout-007-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-007-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-007-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-007-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-007-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-007-ink:light-dark(#000000,#ffffff);
--vibeui-layout-007-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-007-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-007-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-007-on-accent:oklch(from var(--vibeui-layout-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-007-glow:color-mix(in oklab,var(--vibeui-layout-007-accent) 42%,transparent);
--vibeui-layout-007-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-007-radius:1.25rem;--vibeui-layout-007-dur-4:340ms;--vibeui-layout-007-dur-5:460ms;
--vibeui-layout-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-007-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-007"]{color-scheme:dark}
:where([data-vibeui-block="layout-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-007"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-007-bg);color:var(--vibeui-layout-007-ink);font-family:var(--vibeui-layout-007-font)}
[data-vibeui-block="layout-007"] *{box-sizing:border-box}
[data-vibeui-block="layout-007"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-007"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-007"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-007"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-007-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-007"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-007-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-007"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-007"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-007-ghost);margin-top:0.25rem}
[data-vibeui-block="layout-007"][data-numbers] [data-part="icon"],[data-vibeui-block="layout-007"][data-numbers] [data-part="faces"],[data-vibeui-block="layout-007"][data-numbers] [data-part="spark"],[data-vibeui-block="layout-007"][data-numbers] [data-part="rows"],[data-vibeui-block="layout-007"][data-numbers] [data-part="image"],[data-vibeui-block="layout-007"][data-numbers] [data-part="window"]{margin-top:2rem}
[data-vibeui-block="layout-007"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="layout-007"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-007"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-007-accent);flex:none;transition:transform var(--vibeui-layout-007-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-007"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-007-ghost);flex:1}
[data-vibeui-block="layout-007"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="layout-007"] [data-part="rows"][data-table] span{gap:1.25rem;padding:0.5rem 0;border-bottom:1px solid var(--vibeui-layout-007-edge)}
[data-vibeui-block="layout-007"] [data-part="rows"][data-table] b:first-child{max-width:30%}
[data-vibeui-block="layout-007"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-007-accent);margin-bottom:auto;transition:transform var(--vibeui-layout-007-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-007"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="layout-007"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-layout-007-tile);background:var(--vibeui-layout-007-ghost-strong);margin-inline-start:-0.625rem;transition:transform var(--vibeui-layout-007-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-007"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-layout-007-accent)}
[data-vibeui-block="layout-007"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="layout-007"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-layout-007-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="layout-007"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-layout-007-glow);fill-opacity:0.25;stroke:none}
[data-vibeui-block="layout-007"] [data-part="image"]{display:block;flex:1;min-height:6rem;border-radius:0.75rem;background:radial-gradient(70% 80% at 80% 15%,var(--vibeui-layout-007-glow) 0%,transparent 65%),radial-gradient(60% 70% at 15% 85%,var(--vibeui-layout-007-glow-soft) 0%,transparent 65%),var(--vibeui-layout-007-tile-2);margin-bottom:auto;transition:transform 0.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-007"] [data-part="window"]{display:block;flex:1;min-height:8rem;border-radius:0.75rem 0.75rem 0 0;border:1px solid var(--vibeui-layout-007-edge);border-bottom:0;background:linear-gradient(var(--vibeui-layout-007-tile-2),var(--vibeui-layout-007-tile-2)) 0 0 / 100% 2rem no-repeat,repeating-linear-gradient(to bottom,transparent 0 2.75rem,var(--vibeui-layout-007-ghost) 2.75rem 3.25rem) 1.25rem 0 / calc(100% - 2.5rem) 100% no-repeat,var(--vibeui-layout-007-tile);position:relative;margin-bottom:0}
[data-vibeui-block="layout-007"] [data-part="window"] i{position:absolute;top:0.7rem;width:0.6rem;height:0.6rem;border-radius:999px;background:var(--vibeui-layout-007-ghost-strong)}
[data-vibeui-block="layout-007"] [data-part="window"] i:nth-child(1){left:0.75rem;background:var(--vibeui-layout-007-accent)}
[data-vibeui-block="layout-007"] [data-part="window"] i:nth-child(2){left:1.6rem}
[data-vibeui-block="layout-007"] [data-part="window"] i:nth-child(3){left:2.45rem}
@keyframes vibeui-layout-007-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-007-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}

[data-vibeui-block="layout-007"] [data-part="body"]{display:grid;gap:1rem;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-areas:"word word" "tl tr" "bl br";min-height:32rem}
[data-vibeui-block="layout-007"] [data-part="word"]{grid-area:word;display:flex;justify-content:center;align-items:center;gap:0;padding:1rem 0;font-weight:800;font-size:clamp(4rem,20cqi,17rem);line-height:0.9;letter-spacing:-0.05em;user-select:none;margin:0}
[data-vibeui-block="layout-007"][data-weight="bold"] [data-part="word"]{font-weight:650}
[data-vibeui-block="layout-007"] [data-part="word"] span{display:inline-block;transition:transform var(--vibeui-layout-007-dur-5) cubic-bezier(.2,.8,.2,1),color var(--vibeui-layout-007-dur-5);will-change:transform}
[data-vibeui-block="layout-007"] [data-part="word"] span:hover{transform:translateY(-0.08em) rotate(calc(var(--vibeui-layout-007-r) * 4deg));color:var(--vibeui-layout-007-accent)}
[data-vibeui-block="layout-007"] [data-area="tl"]{grid-area:tl}[data-vibeui-block="layout-007"] [data-area="tr"]{grid-area:tr}[data-vibeui-block="layout-007"] [data-area="bl"]{grid-area:bl}[data-vibeui-block="layout-007"] [data-area="br"]{grid-area:br}
@supports (animation-timeline: view()){
[data-vibeui-block="layout-007"] [data-part="word"] span{animation:vibeui-layout-007-spread linear both;animation-timeline:view();animation-range:entry 0% cover 45%}
}
@keyframes vibeui-layout-007-spread{from{transform:translateX(calc(var(--vibeui-layout-007-r) * -0.6em)) translateY(0.3em);opacity:0}to{transform:none;opacity:1}}
@container (min-width: 56rem){
[data-vibeui-block="layout-007"] [data-part="body"]{grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1fr);grid-template-areas:"tl word tr" "bl word br";min-height:36rem;align-items:start}
[data-vibeui-block="layout-007"] [data-part="word"]{align-self:center}
[data-vibeui-block="layout-007"] [data-area="bl"],[data-vibeui-block="layout-007"] [data-area="br"]{align-self:end}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-007"] *{animation:none!important;transition:none!important}
}
`



/** Кинетический заголовок: слово во весь кадр держит раскладку. */
export function Layout007({
  heading,
  lead,
  items,
  word = "Design",
  weight = "black",
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout007Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-007-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Card067 key={key ?? area} data-part="tile" {...items?.[SLOTS.indexOf(area)]} numbers={numbers} index={SLOTS.indexOf(area)} ghost={GHOST[area]} data-area={area} className={className} accent={accent} />
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
      target.style.setProperty("--vibeui-card-067-mx", `${x}%`)
      target.style.setProperty("--vibeui-card-067-my", `${y}%`)
      target.style.setProperty("--vibeui-card-067-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-card-067-on", "0")
  }

  return (
    <>
      <style href="vibeui-layout-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-007"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-weight={weight === "black" ? undefined : weight}
        className={className}
        style={palette}
      >
        <div data-part="frame">

          <div data-part="body" onPointerMove={handleMove} onPointerOut={handleLeave}>
            <h2 data-part="word" aria-label={word}>
              {[...word].map((letter, index, all) => (
                <span
                  key={index}
                  aria-hidden="true"
                  style={{ "--vibeui-layout-007-r": index - (all.length - 1) / 2 } as CSSProperties}
                >
                  {letter}
                </span>
              ))}
            </h2>
            {tile("tl")}
            {tile("tr")}
            {tile("bl")}
            {tile("br")}
          </div>
        </div>
      </section>
    </>
  )
}
