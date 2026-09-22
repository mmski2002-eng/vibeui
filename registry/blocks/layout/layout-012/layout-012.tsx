"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import { Card071 } from "@/registry/components/card/card-071/card-071"

export type Layout012Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout012Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 центр, 02 узел, 03 узел, 04 узел, 05 узел, 06 узел, 07 узел. Без них — призрак. */
  items?: readonly Layout012Item[]
  /** Число колец. */
  rings?: "one" | "two"
  /** Вращение колец. */
  spin?: boolean
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Орбита интеграций: центр и узлы по одному-двум кольцам, кольца
// медленно вращаются, узлы противовращаются и остаются прямыми; при
// наведении на орбиту вращение замирает. Позиция узла — rotate/translate
// от угла по индексу, ничего не считается в JS. Для «работает с».
const SLOTS = ["core", "n1", "n2", "n3", "n4", "n5", "n6"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  core: "icon",
  n1: "icon",
  n2: "icon",
  n3: "icon",
  n4: "icon",
  n5: "icon",
  n6: "icon",
}

const STYLES = `
:where([data-vibeui-block="layout-012"]){
--vibeui-layout-012-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-012-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-012-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-012-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-012-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-012-ink:light-dark(#000000,#ffffff);
--vibeui-layout-012-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-012-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-012-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-012-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-012-on-accent:oklch(from var(--vibeui-layout-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-012-glow:color-mix(in oklab,var(--vibeui-layout-012-accent) 42%,transparent);
--vibeui-layout-012-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-012-radius:1.25rem;--vibeui-layout-012-dur-4:340ms;--vibeui-layout-012-dur-5:460ms;
--vibeui-layout-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-012-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-012"]{color-scheme:dark}
:where([data-vibeui-block="layout-012"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-012"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-012"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-012-bg);color:var(--vibeui-layout-012-ink);font-family:var(--vibeui-layout-012-font)}
[data-vibeui-block="layout-012"] *{box-sizing:border-box}
[data-vibeui-block="layout-012"] [data-part="node"] [data-part="tile"]{width:4.5rem;margin:-2.25rem}
[data-vibeui-block="layout-012"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-012"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-012"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-012"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-012-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-012"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-012-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-012"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-012"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-012-ghost);margin-top:0.25rem}
[data-vibeui-block="layout-012"][data-numbers] [data-part="faces"],[data-vibeui-block="layout-012"][data-numbers] [data-part="spark"],[data-vibeui-block="layout-012"][data-numbers] [data-part="rows"],[data-vibeui-block="layout-012"][data-numbers] [data-part="image"],[data-vibeui-block="layout-012"][data-numbers] [data-part="window"]{margin-top:2rem}
[data-vibeui-block="layout-012"] [data-part="button"]{display:inline-block;width:6.5rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-layout-012-accent);margin-top:0.5rem;transition:transform var(--vibeui-layout-012-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-012"] [data-part="big"]{display:block;height:3rem;width:55%;border-radius:0.75rem;background:var(--vibeui-layout-012-ghost-strong)}
[data-vibeui-block="layout-012"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="layout-012"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-012"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-012-accent);flex:none;transition:transform var(--vibeui-layout-012-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-012"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-012-ghost);flex:1}
[data-vibeui-block="layout-012"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="layout-012"] [data-part="rows"][data-table] span{gap:1.25rem;padding:0.5rem 0;border-bottom:1px solid var(--vibeui-layout-012-edge)}
[data-vibeui-block="layout-012"] [data-part="rows"][data-table] b:first-child{max-width:30%}
[data-vibeui-block="layout-012"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="layout-012"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-layout-012-tile);background:var(--vibeui-layout-012-ghost-strong);margin-inline-start:-0.625rem;transition:transform var(--vibeui-layout-012-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-012"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-layout-012-accent)}
[data-vibeui-block="layout-012"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="layout-012"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-layout-012-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="layout-012"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-layout-012-glow);fill-opacity:0.25;stroke:none}
[data-vibeui-block="layout-012"] [data-part="image"]{display:block;flex:1;min-height:6rem;border-radius:0.75rem;background:radial-gradient(70% 80% at 80% 15%,var(--vibeui-layout-012-glow) 0%,transparent 65%),radial-gradient(60% 70% at 15% 85%,var(--vibeui-layout-012-glow-soft) 0%,transparent 65%),var(--vibeui-layout-012-tile-2);margin-bottom:auto;transition:transform 0.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-012"] [data-part="window"]{display:block;flex:1;min-height:8rem;border-radius:0.75rem 0.75rem 0 0;border:1px solid var(--vibeui-layout-012-edge);border-bottom:0;background:linear-gradient(var(--vibeui-layout-012-tile-2),var(--vibeui-layout-012-tile-2)) 0 0 / 100% 2rem no-repeat,repeating-linear-gradient(to bottom,transparent 0 2.75rem,var(--vibeui-layout-012-ghost) 2.75rem 3.25rem) 1.25rem 0 / calc(100% - 2.5rem) 100% no-repeat,var(--vibeui-layout-012-tile);position:relative;margin-bottom:0}
[data-vibeui-block="layout-012"] [data-part="window"] i{position:absolute;top:0.7rem;width:0.6rem;height:0.6rem;border-radius:999px;background:var(--vibeui-layout-012-ghost-strong)}
[data-vibeui-block="layout-012"] [data-part="window"] i:nth-child(1){left:0.75rem;background:var(--vibeui-layout-012-accent)}
[data-vibeui-block="layout-012"] [data-part="window"] i:nth-child(2){left:1.6rem}
[data-vibeui-block="layout-012"] [data-part="window"] i:nth-child(3){left:2.45rem}
@keyframes vibeui-layout-012-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-012-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}

[data-vibeui-block="layout-012"] [data-part="body"]{display:grid;place-items:center;min-height:30rem;position:relative;--vibeui-layout-012-r1:8rem;--vibeui-layout-012-r2:13rem}
[data-vibeui-block="layout-012"] [data-part="ring"]{position:absolute;left:50%;top:50%;width:calc(var(--vibeui-layout-012-rr) * 2);height:calc(var(--vibeui-layout-012-rr) * 2);margin:calc(-1 * var(--vibeui-layout-012-rr));border-radius:999px;border:1px dashed var(--vibeui-layout-012-edge-hover);animation:vibeui-layout-012-spin var(--vibeui-layout-012-dur) linear infinite}
[data-vibeui-block="layout-012"] [data-part="ring"][data-k="1"]{--vibeui-layout-012-rr:var(--vibeui-layout-012-r1);--vibeui-layout-012-dur:40s}
[data-vibeui-block="layout-012"] [data-part="ring"][data-k="2"]{--vibeui-layout-012-rr:var(--vibeui-layout-012-r2);--vibeui-layout-012-dur:70s;animation-direction:reverse}
[data-vibeui-block="layout-012"]:not([data-spin]) [data-part="ring"]{animation:none}
[data-vibeui-block="layout-012"][data-rings="one"] [data-part="ring"][data-k="2"]{display:none}
[data-vibeui-block="layout-012"] [data-part="body"]:hover [data-part="ring"]{animation-play-state:paused}
[data-vibeui-block="layout-012"] [data-part="node"]{position:absolute;left:50%;top:50%;width:0;height:0;transform:rotate(var(--vibeui-layout-012-a)) translateX(var(--vibeui-layout-012-rr))}
[data-vibeui-block="layout-012"] [data-part="node"] [data-vibeui-block="card-071"]{width:4.5rem;height:4.5rem;min-height:0;padding:0;margin:-2.25rem;display:grid;place-items:center;border-radius:1.25rem;transform:rotate(calc(-1 * var(--vibeui-layout-012-a)));animation:vibeui-layout-012-counter var(--vibeui-layout-012-dur) linear infinite}
[data-vibeui-block="layout-012"] [data-part="ring"][data-k="2"] [data-part="node"] [data-vibeui-block="card-071"]{animation-direction:reverse}
[data-vibeui-block="layout-012"]:not([data-spin]) [data-part="node"] [data-vibeui-block="card-071"]{animation:none}
[data-vibeui-block="layout-012"] [data-part="body"]:hover [data-part="node"] [data-vibeui-block="card-071"]{animation-play-state:paused}
[data-vibeui-block="layout-012"] [data-part="node"] [data-vibeui-block="card-071"]:hover{transform:rotate(calc(-1 * var(--vibeui-layout-012-a))) scale(1.12)}
[data-vibeui-block="layout-012"] [data-part="node"] [data-vibeui-block="card-071"] [data-part="icon"]{margin:0;width:2rem;height:2rem;border-radius:0.625rem}
[data-vibeui-block="layout-012"] [data-part="node"] [data-vibeui-block="card-071"] [data-part="bar"],[data-vibeui-block="layout-012"] [data-part="node"] p{display:none}
[data-vibeui-block="layout-012"] [data-part="node"] h3{font-size:0.75rem;text-align:center;padding:0 0.25rem}
[data-vibeui-block="layout-012"] [data-part="node"] [data-vibeui-block="card-071"] [data-part="num"]{top:0.25rem;left:auto;right:0.25rem;padding:0.25rem 0.375rem;font-size:0.5625rem}
[data-vibeui-block="layout-012"] [data-area="core"],[data-vibeui-block="layout-012"] [data-part="node"] [data-vibeui-block="card-071"]{grid-template-columns:1fr;justify-items:center}
[data-vibeui-block="layout-012"] [data-area="core"]{width:7rem;height:7rem;min-height:0;padding:0;display:grid;place-items:center;border-radius:2rem;position:relative;z-index:1;box-shadow:0 0 0 1rem color-mix(in oklab,var(--vibeui-layout-012-accent) 8%,transparent),0 0 4rem var(--vibeui-layout-012-glow)}
[data-vibeui-block="layout-012"] [data-area="core"] p{display:none}
[data-vibeui-block="layout-012"] [data-area="core"] h3{font-size:0.875rem;text-align:center}
@keyframes vibeui-layout-012-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-layout-012-counter{to{transform:rotate(calc(-1 * var(--vibeui-layout-012-a) - 360deg))}}
@container (min-width: 48rem){
[data-vibeui-block="layout-012"] [data-part="body"]{min-height:36rem;--vibeui-layout-012-r1:10rem;--vibeui-layout-012-r2:16rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-012"] *{animation:none!important;transition:none!important}
}
`



/** Орбита интеграций: центр и узлы по кольцам. */
export function Layout012({
  heading,
  lead,
  items,
  rings = "two",
  spin = true,
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout012Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-012-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Card071 key={key ?? area} data-part="tile" {...items?.[SLOTS.indexOf(area)]} numbers={numbers} index={SLOTS.indexOf(area)} ghost={GHOST[area]} data-area={area} className={className} accent={accent} />
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
      target.style.setProperty("--vibeui-card-071-mx", `${x}%`)
      target.style.setProperty("--vibeui-card-071-my", `${y}%`)
      target.style.setProperty("--vibeui-card-071-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-card-071-on", "0")
  }

  return (
    <>
      <style href="vibeui-layout-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-012"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-rings={rings === "two" ? undefined : rings}
        data-spin={spin ? "" : undefined}
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
            {tile("core")}
            {[
              { k: 1, nodes: ["n1", "n2", "n3"] as const },
              { k: 2, nodes: ["n4", "n5", "n6"] as const },
            ].map(({ k, nodes }) => (
              <div data-part="ring" data-k={k} key={k}>
                {nodes.map((area, index) => (
                  <div
                    data-part="node"
                    key={area}
                    style={{ "--vibeui-layout-012-a": `${(360 / nodes.length) * index + (k === 2 ? 60 : 0)}deg` } as CSSProperties}
                  >
                    {tile(area)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
