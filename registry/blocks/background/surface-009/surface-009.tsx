"use client"

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react"

export type Surface009Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Радиус светового пятна. */
  radius?: "small" | "large"
  /** Сила света. */
  strength?: "soft" | "bright"
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
:where([data-vibeui-block="surface-009"]){
--vibeui-surface-009-bg:#1a1a1a;
--vibeui-surface-009-ink:#ffffff;
--vibeui-surface-009-muted:color-mix(in oklab,#ffffff 62%,#1a1a1a);
--vibeui-surface-009-accent:#ff5900;
--vibeui-surface-009-x:70%;
--vibeui-surface-009-y:30%;
--vibeui-surface-009-r:22rem;
--vibeui-surface-009-power:26%;
--vibeui-surface-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-009"][data-radius="small"]){--vibeui-surface-009-r:14rem}
:where([data-vibeui-block="surface-009"][data-strength="bright"]){--vibeui-surface-009-power:40%}
[data-vibeui-block="surface-009"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-009-bg);color:var(--vibeui-surface-009-ink);
font-family:var(--vibeui-surface-009-font);
}
[data-vibeui-block="surface-009"] *{box-sizing:border-box}
[data-vibeui-block="surface-009"] [data-part="spot"]{
position:absolute;inset:0;pointer-events:none;
background:radial-gradient(var(--vibeui-surface-009-r) var(--vibeui-surface-009-r) at var(--vibeui-surface-009-x) var(--vibeui-surface-009-y),color-mix(in oklab,var(--vibeui-surface-009-accent) var(--vibeui-surface-009-power),transparent),transparent 72%);
}
[data-vibeui-block="surface-009"] [data-part="texture"]{
position:absolute;inset:0;pointer-events:none;
background-image:linear-gradient(color-mix(in oklab,#ffffff 5%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in oklab,#ffffff 5%,transparent) 1px,transparent 1px);
background-size:3rem 3rem;
-webkit-mask-image:radial-gradient(calc(var(--vibeui-surface-009-r)*1.4) calc(var(--vibeui-surface-009-r)*1.4) at var(--vibeui-surface-009-x) var(--vibeui-surface-009-y),#000000 30%,transparent 100%);
mask-image:radial-gradient(calc(var(--vibeui-surface-009-r)*1.4) calc(var(--vibeui-surface-009-r)*1.4) at var(--vibeui-surface-009-x) var(--vibeui-surface-009-y),#000000 30%,transparent 100%);
}
[data-vibeui-block="surface-009"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;
}
[data-vibeui-block="surface-009"] [data-part="kicker"]{
margin:0;display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:620;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-surface-009-muted);
}
[data-vibeui-block="surface-009"] [data-part="kicker"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-surface-009-accent);
}
[data-vibeui-block="surface-009"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(2rem,5.5cqi,3.75rem);line-height:1.05;letter-spacing:-0.02em;font-weight:660;
}
[data-vibeui-block="surface-009"] [data-part="lede"]{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-009-muted);
}
[data-vibeui-block="surface-009"] a:focus-visible{
outline:2px solid var(--vibeui-surface-009-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-009"] [data-part="frame"]{padding:6rem 3rem;min-height:34rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-009"] *{animation:none!important;transition:none!important}}
`

/** Графитовый фон с тёплым светом, следующим за курсором. Статичен на touch. */
export function Surface009({
  children,
  radius = "large",
  strength = "soft",
  accent,
  className,
  style,
}: Surface009Props) {
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
      target.style.setProperty("--vibeui-surface-009-x", `${x}%`)
      target.style.setProperty("--vibeui-surface-009-y", `${y}%`)
    })
  }

  const palette = {
    ...(accent ? { "--vibeui-surface-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-009" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={host}
        data-vibeui-block="surface-009"
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
            <>
              <p data-part="kicker">Портфолио · инструменты</p>
              <h2 data-part="title">Свет идёт за вниманием</h2>
              <p data-part="lede">
                Тёплое пятно проявляет сетку материала возле указателя и
                не трогает читаемость текста. На touch-устройствах свет
                стоит на месте — композиция не зависит от эффекта.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  )
}
