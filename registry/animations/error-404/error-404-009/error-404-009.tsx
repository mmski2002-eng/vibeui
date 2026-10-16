"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Error404009Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  lines?: string[]
  hint?: string
  actionLabel?: string
  actionHref?: string
  /** Пусто — тёмная подложка по умолчанию. */
  background?: string
}

// Сломанный экран: строки двоятся в красный и голубой канал и дёргаются
// срезами clip-path, по фону бежит шум. Клик в любом месте «перемешивает»
// одну строку случайными знаками — страница отзывается, а не просто мигает.
const STYLES = `
:where([data-vibeui-block="error-404-009"]){
--vibeui-error-404-009-bg:light-dark(oklch(0.95 0 0),oklch(0.16 0 0));
--vibeui-error-404-009-fg:light-dark(oklch(0.15 0 0),oklch(0.96 0 0));
--vibeui-error-404-009-red:oklch(0.63 0.26 25);
--vibeui-error-404-009-cyan:oklch(0.85 0.15 200);
--vibeui-error-404-009-font:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-009"]{color-scheme:dark}
[data-vibeui-block="error-404-009"]{
position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.375rem;overflow:hidden;box-sizing:border-box;min-height:26rem;padding:2rem 1rem;
background:var(--vibeui-error-404-009-bg);color:var(--vibeui-error-404-009-fg);font-family:var(--vibeui-error-404-009-font);text-align:center;cursor:pointer;user-select:none;
}
[data-vibeui-block="error-404-009"]::before{
content:"";position:absolute;inset:-50%;pointer-events:none;opacity:.14;
background:repeating-radial-gradient(circle at 17% 32%,var(--vibeui-error-404-009-fg) 0 1px,transparent 1px 3px),repeating-linear-gradient(0deg,color-mix(in oklab,var(--vibeui-error-404-009-fg) 30%,transparent) 0 1px,transparent 1px 3px);
animation:vibeui-error-404-009-noise .4s steps(4) infinite;
}
[data-vibeui-block="error-404-009"] [data-part="code"]{
margin:0 0 1rem;padding:0.125rem 0.5rem;background:var(--vibeui-error-404-009-fg);color:var(--vibeui-error-404-009-bg);font-size:1.5rem;font-weight:800;
}
[data-vibeui-block="error-404-009"] [data-part="line"]{
position:relative;margin:0;font-size:clamp(0.875rem,2.4cqi,1.125rem);letter-spacing:0.04em;word-break:break-all;
text-shadow:-2px 0 var(--vibeui-error-404-009-red),2px 0 var(--vibeui-error-404-009-cyan);
animation:vibeui-error-404-009-jitter 2.6s steps(1) infinite;
}
[data-vibeui-block="error-404-009"] [data-part="line"]:nth-child(odd){animation-delay:-1.3s}
[data-vibeui-block="error-404-009"] [data-part="hint"]{margin:0.75rem 0 0;font-size:0.8125rem;opacity:.75}
[data-vibeui-block="error-404-009"] [data-part="action"]{position:relative;margin-top:1.25rem;color:inherit;font-size:0.8125rem;text-underline-offset:3px}
[data-vibeui-block="error-404-009"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-error-404-009-cyan);outline-offset:3px}
@keyframes vibeui-error-404-009-noise{0%{transform:translate(0,0)}25%{transform:translate(-3%,2%)}50%{transform:translate(2%,-3%)}75%{transform:translate(-2%,-1%)}}
@keyframes vibeui-error-404-009-jitter{
0%,86%,100%{transform:none;clip-path:none}
88%{transform:translateX(-4px);clip-path:inset(10% 0 55% 0)}
90%{transform:translateX(5px);clip-path:inset(55% 0 8% 0)}
92%{transform:translateX(-2px);clip-path:inset(30% 0 30% 0)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-009"] *,[data-vibeui-block="error-404-009"]::before{animation:none!important}}
[data-vibeui-block="error-404-009"]{width:100%}
`

const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

function scramble(length: number) {
  return Array.from({ length }, () => NOISE[Math.floor(Math.random() * NOISE.length)]).join("")
}

export function Error404009({
  code = "404",
  lines = ["123456789", "AWEUGUYIUHOIJOPKOopkopdaodpasd", "(не волнуйтесь)"],
  hint = "(просто кликните по экрану)",
  actionLabel = "Вернуться на главную",
  actionHref = "/",
  background,
  className,
  style,
  ...props
}: Error404009Props) {
  const [shown, setShown] = useState(lines)

  const shuffle = () => {
    const target = Math.floor(Math.random() * shown.length)
    setShown(shown.map((line, index) => (index === target ? scramble(Math.max(6, line.length)) : line)))
  }

  const palette = {
    ...(background ? { "--vibeui-error-404-009-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-009" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-009"
        data-slot="not-found"
        className={className}
        style={palette}
        onClick={shuffle}
      >
        <h1 data-part="code">{code}</h1>
        <div aria-hidden="true">
          {shown.map((line, index) => (
            <p key={index} data-part="line">
              {line}
            </p>
          ))}
        </div>
        <p data-part="hint">{hint}</p>
        <a data-part="action" href={actionHref} onClick={(event) => event.stopPropagation()}>
          {actionLabel}
        </a>
      </section>
    </>
  )
}
