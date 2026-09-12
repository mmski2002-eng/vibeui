"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"

export type Surface002Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Радиус светового пятна. */
  radius?: "small" | "large"
  /** Сила света. */
  strength?: "soft" | "bright"
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Направленный свет за курсором: спокойное графитовое поле с локальным
// тёплым пятном возле указателя. Единственный клиентский фон набора:
// координаты пишутся в CSS-переменные через rAF-троттлинг, без state и
// перерисовок React. При touch и prefers-reduced-motion пятно стоит в
// выбранной точке — композиция полностью сохраняется статикой. Эффект
// подсвечивает материал, но не обозначает интерактивность.
const STYLES = `
:where([data-vibeui-block="surface-002"]){
--vibeui-surface-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-surface-002-ink:light-dark(#000000,#ffffff);
--vibeui-surface-002-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 62%,#1a1a1a));
--vibeui-surface-002-ghost:light-dark(color-mix(in oklab,#000000 10%,transparent),color-mix(in oklab,#ffffff 12%,transparent));
--vibeui-surface-002-ghost-soft:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 6%,transparent));
--vibeui-surface-002-grid:light-dark(color-mix(in oklab,#000000 7%,transparent),color-mix(in oklab,#ffffff 5%,transparent));
--vibeui-surface-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-surface-002-x:70%;
--vibeui-surface-002-y:30%;
--vibeui-surface-002-r:22rem;
--vibeui-surface-002-power:26%;
--vibeui-surface-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-002"][data-radius="small"]){--vibeui-surface-002-r:14rem}
:where([data-vibeui-block="surface-002"][data-strength="bright"]){--vibeui-surface-002-power:40%}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="surface-002"]{color-scheme:dark}
:where([data-vibeui-block="surface-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="surface-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="surface-002"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-002-bg);color:var(--vibeui-surface-002-ink);
font-family:var(--vibeui-surface-002-font);
}
[data-vibeui-block="surface-002"] *{box-sizing:border-box}
[data-vibeui-block="surface-002"] [data-part="spot"]{
position:absolute;inset:0;pointer-events:none;
background:radial-gradient(var(--vibeui-surface-002-r) var(--vibeui-surface-002-r) at var(--vibeui-surface-002-x) var(--vibeui-surface-002-y),color-mix(in oklab,var(--vibeui-surface-002-accent) var(--vibeui-surface-002-power),transparent),transparent 72%);
}
[data-vibeui-block="surface-002"] [data-part="texture"]{
position:absolute;inset:0;pointer-events:none;
background-image:linear-gradient(var(--vibeui-surface-002-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-surface-002-grid) 1px,transparent 1px);
background-size:3rem 3rem;
-webkit-mask-image:radial-gradient(calc(var(--vibeui-surface-002-r)*1.4) calc(var(--vibeui-surface-002-r)*1.4) at var(--vibeui-surface-002-x) var(--vibeui-surface-002-y),#000000 30%,transparent 100%);
mask-image:radial-gradient(calc(var(--vibeui-surface-002-r)*1.4) calc(var(--vibeui-surface-002-r)*1.4) at var(--vibeui-surface-002-x) var(--vibeui-surface-002-y),#000000 30%,transparent 100%);
}
[data-vibeui-block="surface-002"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:2.5rem clamp(1.5rem,6cqi,4rem);display:flex;flex-direction:column;
}
/* Призрак портфолио: сетка работ. Свет за курсором делают ради сетки —
   он проявляет материал ровно там, куда смотрит человек. */
[data-vibeui-block="surface-002"] [data-part="ghost"]{
display:flex;flex-direction:column;gap:1.75rem;flex:1;justify-content:center;
}
[data-vibeui-block="surface-002"] [data-part="head"]{display:flex;align-items:center;gap:0.875rem}
[data-vibeui-block="surface-002"] [data-part="mark"]{width:1.5rem;height:1.5rem;flex:none;border-radius:0.375rem;
background:var(--vibeui-surface-002-accent);color:oklch(from var(--vibeui-surface-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="surface-002"] [data-part="head"] span:not([data-part]){
width:4rem;height:0.5rem;border-radius:999px;background:var(--vibeui-surface-002-ghost);
}
[data-vibeui-block="surface-002"] [data-part="works"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;
}
[data-vibeui-block="surface-002"] [data-part="works"] span{
height:7rem;border-radius:0.75rem;background:var(--vibeui-surface-002-ghost-soft);
border:1px solid var(--vibeui-surface-002-line);
}
[data-vibeui-block="surface-002"] [data-part="works"] span:first-child{
border-color:color-mix(in oklab,var(--vibeui-surface-002-accent) 45%,transparent);
}
@container (min-width: 48rem){
[data-vibeui-block="surface-002"] [data-part="frame"]{padding-block:3.5rem;min-height:34rem}
[data-vibeui-block="surface-002"] [data-part="works"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-002"] *{animation:none!important;transition:none!important}}
`

/** Графитовый фон с тёплым светом, следующим за курсором. Статичен на touch. */
export function Surface002({
  children,
  radius = "large",
  strength = "soft",
  tone = "auto",
  accent,
  className,
  style,
}: Surface002Props) {
  const host = useRef<HTMLElement>(null)
  const frame = useRef(0)

  function handleMove(event: PointerEvent<HTMLElement>) {
    // Только мышь: на touch пятно остаётся в статичной точке композиции.
    if (event.pointerType !== "mouse" || !host.current) {
      return
    }

    const target = host.current
    const bounds = target.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      target.style.setProperty("--vibeui-surface-002-x", `${x}%`)
      target.style.setProperty("--vibeui-surface-002-y", `${y}%`)
    })
  }

  const palette = {
    ...(accent ? { "--vibeui-surface-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-002" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={host}
        data-vibeui-block="surface-002"
        data-tone={tone === "auto" ? undefined : tone}
        data-radius={radius === "small" ? "small" : undefined}
        data-strength={strength === "bright" ? "bright" : undefined}
        onPointerMove={handleMove}
        className={className}
        style={palette}
      >
        <div data-part="spot" aria-hidden="true" />
        <div data-part="texture" aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <div data-part="ghost" aria-hidden="true">
              <div data-part="head">
                <span data-part="mark" />
                <span />
                <span />
              </div>
              <div data-part="works">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
