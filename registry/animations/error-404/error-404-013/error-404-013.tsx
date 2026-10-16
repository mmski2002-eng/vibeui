"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, PointerEvent } from "react"

export type Error404013Props = Omit<ComponentProps<"section">, "children"> & {
  label?: string
  title?: string
  actionLabel?: string
  actionHref?: string
  /** Фото для следа; пусто — цветные плашки. */
  images?: string[]
  /** Пусто — тёмная подложка по умолчанию. */
  background?: string
}

// След из карточек за курсором: каждые несколько десятков пикселей пути
// под указателем ложится новая карточка поверх старых, а хвост тает.
// Огромный заголовок лежит под следом, поэтому карточки его то прячут,
// то открывают — страница живёт, пока по ней водят мышью.
const STYLES = `
:where([data-vibeui-block="error-404-013"]){
--vibeui-error-404-013-bg:light-dark(oklch(0.96 0 0),oklch(0.17 0 0));
--vibeui-error-404-013-fg:light-dark(oklch(0.15 0 0),oklch(0.97 0 0));
--vibeui-error-404-013-font:"Arial Narrow",Impact,ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-013"]{color-scheme:dark}
[data-vibeui-block="error-404-013"]{
position:relative;display:grid;place-items:center;overflow:hidden;box-sizing:border-box;min-height:28rem;padding:2rem 1rem;text-align:center;
background:var(--vibeui-error-404-013-bg);color:var(--vibeui-error-404-013-fg);font-family:var(--vibeui-error-404-013-font);touch-action:pan-y;
}
[data-vibeui-block="error-404-013"] [data-part="label"]{margin:0 0 1rem;font-family:ui-monospace,monospace;font-size:0.75rem;letter-spacing:0.15em}
[data-vibeui-block="error-404-013"] [data-part="title"]{margin:0;font-size:clamp(2.5rem,12cqi,9rem);font-weight:900;line-height:0.85;text-transform:uppercase}
[data-vibeui-block="error-404-013"] [data-part="action"]{
position:relative;z-index:30;display:inline-block;margin-top:1.5rem;font-family:ui-monospace,monospace;font-size:0.8125rem;color:inherit;
}
[data-vibeui-block="error-404-013"] [data-part="action"]:focus-visible{outline:2px solid currentColor;outline-offset:3px}
[data-vibeui-block="error-404-013"] [data-part="card"]{
position:absolute;z-index:10;left:0;top:0;width:min(28cqi,9rem);aspect-ratio:4/5;margin:calc(min(28cqi,9rem) * -0.625) 0 0 calc(min(28cqi,9rem) * -0.5);
background:var(--vibeui-error-404-013-tone);background-size:cover;background-position:center;pointer-events:none;
box-shadow:0 0.75rem 2rem oklch(0 0 0 / 35%);
animation:vibeui-error-404-013-fade 1.4s ease-in forwards;
}
@keyframes vibeui-error-404-013-fade{0%{opacity:0;scale:.6}12%{opacity:1;scale:1}70%{opacity:1}100%{opacity:0;scale:.9}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-013"] [data-part="card"]{display:none}}
[data-vibeui-block="error-404-013"]{width:100%}
`

const TONES = [
  "linear-gradient(135deg,oklch(0.8 0.08 200),oklch(0.55 0.1 230))",
  "linear-gradient(135deg,oklch(0.75 0.12 30),oklch(0.6 0.15 10))",
  "linear-gradient(135deg,oklch(0.9 0.02 90),oklch(0.7 0.03 80))",
  "linear-gradient(135deg,oklch(0.6 0.2 300),oklch(0.45 0.18 280))",
  "linear-gradient(135deg,oklch(0.75 0.17 140),oklch(0.5 0.14 150))",
  "linear-gradient(135deg,oklch(0.3 0 0),oklch(0.5 0 0))",
]
const STEP = 70
const TAIL = 12

type Card = { id: number; x: number; y: number; tone: string }

export function Error404013({
  label = "[ОШИБКА 404]",
  title = "Страница не найдена",
  actionLabel = "[ НА ГЛАВНУЮ ]",
  actionHref = "/",
  images = [],
  background,
  className,
  style,
  ...props
}: Error404013Props) {
  const [cards, setCards] = useState<Card[]>([])
  const last = useRef({ x: 0, y: 0, id: 0 })

  const trail = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - box.left
    const y = event.clientY - box.top
    if (Math.hypot(x - last.current.x, y - last.current.y) < STEP) return
    const id = (last.current.id += 1)
    last.current.x = x
    last.current.y = y
    const tone = images.length ? `url("${images[id % images.length]}")` : TONES[id % TONES.length]
    setCards((current) => [...current.slice(-TAIL + 1), { id, x, y, tone }])
  }

  const palette = {
    ...(background ? { "--vibeui-error-404-013-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-013" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-013"
        data-slot="not-found"
        className={className}
        style={palette}
        onPointerMove={trail}
      >
        <div>
          <p data-part="label">{label}</p>
          <h1 data-part="title">{title}</h1>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
        {cards.map((card) => (
          <span
            key={card.id}
            data-part="card"
            aria-hidden="true"
            style={
              {
                translate: `${card.x}px ${card.y}px`,
                zIndex: 10 + (card.id % TAIL),
                "--vibeui-error-404-013-tone": card.tone,
              } as CSSProperties
            }
          />
        ))}
      </section>
    </>
  )
}
