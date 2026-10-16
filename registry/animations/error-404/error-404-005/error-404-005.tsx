"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Error404005Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  message?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет пришельцев и цифр. */
  accent?: string
  /** Пусто — тёмная подложка по умолчанию. */
  background?: string
  levelLabel?: string
  /** Подпись пришельца для скринридера; номер дописывается в конец. */
  targetLabel?: string
}

// Ошибку охраняют пиксельные пришельцы: строй марширует ступенькой
// (steps()), как в аркаде, и клик сбивает любого. Когда сбиты все, строй
// возвращается и счётчик уровня растёт. Пришелец — одна SVG-маска 11×8.
const STYLES = `
:where([data-vibeui-block="error-404-005"]){
--vibeui-error-404-005-bg:radial-gradient(120% 90% at 50% 0%,light-dark(oklch(0.93 0.03 15),oklch(0.32 0.06 15)),light-dark(oklch(0.98 0.005 15),oklch(0.14 0.01 15)));
--vibeui-error-404-005-fg:light-dark(oklch(0.18 0 0),oklch(0.97 0 0));
--vibeui-error-404-005-accent:light-dark(oklch(0.18 0 0),oklch(0.97 0 0));
--vibeui-error-404-005-font:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-005"]{color-scheme:dark}
[data-vibeui-block="error-404-005"]{
position:relative;display:flex;flex-direction:column;align-items:center;gap:0.75rem;overflow:hidden;box-sizing:border-box;min-height:28rem;padding:1.25rem;
background:var(--vibeui-error-404-005-bg);color:var(--vibeui-error-404-005-fg);font-family:var(--vibeui-error-404-005-font);
}
[data-vibeui-block="error-404-005"] [data-part="hud"]{align-self:flex-start;margin:0;font-size:0.75rem}
[data-vibeui-block="error-404-005"] [data-part="fleet"]{
display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:0.75rem 1.25rem;width:min(100%,30rem);
animation:vibeui-error-404-005-march 4s steps(8,jump-none) infinite alternate;
}
[data-vibeui-block="error-404-005"] [data-part="alien"]{
appearance:none;border:0;padding:0;background:var(--vibeui-error-404-005-accent);cursor:crosshair;
aspect-ratio:11/8;width:100%;
mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 8'%3E%3Cpath d='M2 0h1v1H2zM8 0h1v1H8zM3 1h5v1H3zM2 2h7v1H2zM1 3h2v1H1zM4 3h3v1H4zM8 3h2v1H8zM0 4h11v1H0zM0 5h1v2H0zM2 5h7v1H2zM10 5h1v2h-1zM2 6h1v1H2zM8 6h1v1H8zM3 7h2v1H3zM6 7h2v1H6z'/%3E%3C/svg%3E") center/contain no-repeat;
animation:vibeui-error-404-005-wiggle .8s steps(1) infinite;
transition:opacity .25s ease,transform .25s ease;
}
[data-vibeui-block="error-404-005"] [data-part="alien"]:nth-child(odd){animation-delay:-.4s}
[data-vibeui-block="error-404-005"] [data-part="alien"][data-hit="true"]{opacity:0;transform:scale(1.8);pointer-events:none}
[data-vibeui-block="error-404-005"] [data-part="alien"]:focus-visible{outline:2px solid var(--vibeui-error-404-005-accent);outline-offset:3px}
@keyframes vibeui-error-404-005-march{from{transform:translateX(-1.5rem)}to{transform:translateX(1.5rem)}}
@keyframes vibeui-error-404-005-wiggle{50%{transform:scaleX(-1)}}
[data-vibeui-block="error-404-005"] [data-part="message"]{margin:0.5rem 0 0;text-align:center;font-size:0.8125rem;line-height:1.5}
[data-vibeui-block="error-404-005"] [data-part="code"]{
margin:auto 0 0;font-family:ui-sans-serif,system-ui,sans-serif;font-weight:200;font-size:min(36cqi,14rem);line-height:0.9;letter-spacing:0.02em;
color:var(--vibeui-error-404-005-accent);
}
[data-vibeui-block="error-404-005"] [data-part="action"]{
padding:0.5rem 1rem;border-radius:999px;background:var(--vibeui-error-404-005-fg);color:light-dark(oklch(0.98 0 0),oklch(0.15 0 0));
text-decoration:none;font-size:0.8125rem;
}
[data-vibeui-block="error-404-005"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-error-404-005-fg);outline-offset:3px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="error-404-005"] :is([data-part="fleet"],[data-part="alien"]){animation:none!important;transition:none!important}
}
[data-vibeui-block="error-404-005"]{width:100%}
`

const FLEET = 16

export function Error404005({
  code = "404",
  message = "Упс, что-то пошло не так. Сбейте баги, чтобы вернуться домой.",
  actionLabel = "На главную",
  actionHref = "/",
  accent,
  background,
  levelLabel = "Уровень",
  targetLabel = "Сбить пришельца",
  className,
  style,
  ...props
}: Error404005Props) {
  const [hit, setHit] = useState<Set<number>>(() => new Set())
  const [level, setLevel] = useState(1)

  const shoot = (index: number) => {
    const next = new Set(hit).add(index)
    if (next.size === FLEET) {
      setLevel(level + 1)
      setHit(new Set())
      return
    }
    setHit(next)
  }

  const palette = {
    ...(accent ? { "--vibeui-error-404-005-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-005-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-005"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <p data-part="hud" aria-live="polite">
          {levelLabel} {level}
        </p>
        <div data-part="fleet">
          {Array.from({ length: FLEET }, (_, index) => (
            <button
              key={`${level}-${index}`}
              type="button"
              data-part="alien"
              data-hit={hit.has(index) || undefined}
              aria-label={`${targetLabel} ${index + 1}`}
              onClick={() => shoot(index)}
            />
          ))}
        </div>
        <p data-part="message">{message}</p>
        <h1 data-part="code">{code}</h1>
        <a data-part="action" href={actionHref}>
          {actionLabel}
        </a>
      </section>
    </>
  )
}
