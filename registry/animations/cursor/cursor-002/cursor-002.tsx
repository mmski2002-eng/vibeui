"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Cursor002Target = {
  label: string
  hint?: string
}

export type Cursor002Props = Omit<ComponentProps<"div">, "children"> & {
  /** Цели, к которым притягивается кольцо. */
  targets?: Cursor002Target[]
  /** Подпись над полем. */
  caption?: string
  /** Радиус притяжения в пикселях: ближе — кольцо садится на цель. */
  pull?: number
  /** Инерция кольца: 0.05 — ленивое, 0.4 — почти без отставания. */
  lag?: number
  /** Растяжение по направлению движения. Ноль отключает. */
  stretch?: number
  /** Цвет кольца и подсветки цели. */
  accent?: string
  /** Реакция на курсор. */
  interactive?: boolean
}

const DEFAULT_TARGETS: Cursor002Target[] = [
  { label: "Открыть проект", hint: "⏎" },
  { label: "Поделиться", hint: "S" },
  { label: "Архивировать", hint: "⌫" },
]

// Идея компонента: курсор здесь не точка, а кольцо с инерцией. Оно отстаёт
// от руки, растягивается по направлению движения и садится на кнопку, когда
// та оказывается рядом, — так интерфейс сам показывает, что нажимать.
//
// Всё держится на трёх числах: положение руки, положение кольца и цель, к
// которой оно притянуто. Пружина считается в rAF, а не в CSS-переходе:
// переход не умеет менять цель на середине пути, а рука меняет её постоянно.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="cursor-002"]){
--vibeui-cursor-002-paper:light-dark(oklch(0.99 0 0),oklch(0.15 0 0));
--vibeui-cursor-002-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cursor-002-muted:color-mix(in oklab,var(--vibeui-cursor-002-ink) 55%,transparent);
--vibeui-cursor-002-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 16%));
--vibeui-cursor-002-surface:light-dark(oklch(0.97 0 0),oklch(0.2 0 0));
--vibeui-cursor-002-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.16 264));
--vibeui-cursor-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cursor-002-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cursor-002"]{color-scheme:dark}
[data-vibeui-block="cursor-002"]{
position:relative;box-sizing:border-box;width:100%;aspect-ratio:16/9;min-height:12rem;
overflow:hidden;border:1px solid var(--vibeui-cursor-002-border);border-radius:0.75rem;
background:var(--vibeui-cursor-002-paper);color:var(--vibeui-cursor-002-ink);
font-family:var(--vibeui-cursor-002-font);
/* Родной курсор внутри поля не нужен: его роль исполняет кольцо. */
cursor:none;touch-action:pan-y;
}
[data-vibeui-block="cursor-002"] *{box-sizing:border-box}
/* Сетка: без неё кольцо летает в пустоте и движение не читается. */
[data-vibeui-block="cursor-002"] [data-part="grid"]{
position:absolute;inset:0;pointer-events:none;
background-image:
linear-gradient(90deg,var(--vibeui-cursor-002-border) 1px,transparent 1px),
linear-gradient(180deg,var(--vibeui-cursor-002-border) 1px,transparent 1px);
background-size:3rem 3rem;
mask-image:radial-gradient(80% 70% at 50% 50%,#000 30%,transparent 100%);
opacity:0.7;
}
[data-vibeui-block="cursor-002"] [data-part="caption"]{
position:absolute;left:1rem;top:0.875rem;z-index:3;pointer-events:none;
font-size:0.6875rem;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-cursor-002-muted);
}
[data-vibeui-block="cursor-002"] [data-part="targets"]{
position:absolute;inset:0;z-index:2;
display:flex;flex-wrap:wrap;align-content:center;justify-content:center;
gap:0.75rem;padding:3rem 1.5rem 1.5rem;
}
[data-vibeui-block="cursor-002"] [data-part="target"]{
position:relative;display:inline-flex;align-items:center;gap:0.625rem;
padding:0.625rem 1rem;border-radius:0.75rem;
background:var(--vibeui-cursor-002-surface);
border:1px solid var(--vibeui-cursor-002-border);
font-size:0.875rem;font-weight:600;
transition:transform 0.25s ease,border-color 0.25s ease,color 0.25s ease;
}
/* Цель под кольцом: она приподнимается и берёт акцент — иначе притяжение
   видно только по кольцу, а не по интерфейсу. */
[data-vibeui-block="cursor-002"] [data-part="target"][data-hot="true"]{
transform:translateY(-0.125rem);
border-color:color-mix(in oklab,var(--vibeui-cursor-002-accent) 60%,transparent);
color:var(--vibeui-cursor-002-accent);
}
[data-vibeui-block="cursor-002"] kbd{
padding:0.0625rem 0.375rem;border-radius:0.3125rem;
background:color-mix(in oklab,var(--vibeui-cursor-002-ink) 8%,transparent);
border:1px solid var(--vibeui-cursor-002-border);
font-family:var(--vibeui-cursor-002-mono);font-size:0.6875rem;
color:var(--vibeui-cursor-002-muted);
}
/* Кольцо: рисуется поверх всего и не ловит события — иначе оно закрывало бы
   собой ту самую кнопку, к которой стремится. */
[data-vibeui-block="cursor-002"] [data-part="ring"]{
position:absolute;left:0;top:0;z-index:4;pointer-events:none;
width:2.5rem;height:2.5rem;margin:-1.25rem 0 0 -1.25rem;
border-radius:9999px;
border:1.5px solid var(--vibeui-cursor-002-accent);
opacity:0;transition:opacity 0.25s ease,border-radius 0.25s ease;
}
[data-vibeui-block="cursor-002"] [data-part="dot"]{
position:absolute;left:0;top:0;z-index:5;pointer-events:none;
width:0.375rem;height:0.375rem;margin:-0.1875rem 0 0 -0.1875rem;
border-radius:9999px;background:var(--vibeui-cursor-002-accent);
opacity:0;transition:opacity 0.25s ease;
}
[data-vibeui-block="cursor-002"][data-pointer="true"] [data-part="ring"],
[data-vibeui-block="cursor-002"][data-pointer="true"] [data-part="dot"]{opacity:1}
[data-vibeui-block="cursor-002"] [data-part="hint"]{
position:absolute;left:50%;bottom:0.875rem;transform:translateX(-50%);z-index:3;
pointer-events:none;font-size:0.75rem;color:var(--vibeui-cursor-002-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cursor-002"] *{animation:none!important;transition:none!important}
}
`

/**
 * Магнитный курсор: кольцо с инерцией, которое растягивается на скорости и
 * садится на ближайшую кнопку. Один файл, ноль зависимостей.
 */
export function Cursor002({
  targets = DEFAULT_TARGETS,
  caption = "Наведите курсор",
  pull = 90,
  lag = 0.18,
  stretch = 1,
  accent,
  interactive = true,
  className,
  style,
  ...props
}: Cursor002Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const settings = useRef({ pull, lag, stretch, interactive })

  useEffect(() => {
    settings.current = { pull, lag, stretch, interactive }
  })

  useEffect(() => {
    const host = hostRef.current
    const ring = ringRef.current
    const dot = dotRef.current

    if (!host || !ring || !dot) return

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")

    // Рука, кольцо и его прошлое положение: скорость считается по разнице,
    // а не по событиям указателя — события приходят рывками.
    const hand = { x: 0, y: 0 }
    const ringAt = { x: 0, y: 0 }
    let raf = 0
    let inside = false

    const buttons = () =>
      [...host.querySelectorAll<HTMLElement>('[data-part="target"]')]

    const step = () => {
      raf = 0

      const current = settings.current
      const box = host.getBoundingClientRect()
      let goalX = hand.x
      let goalY = hand.y
      let hot: HTMLElement | null = null
      let width = 40
      let height = 40
      let radius = 9999

      // Притяжение: ближайшая кнопка в радиусе забирает кольцо себе и
      // отдаёт ему свою форму — кольцо буквально надевается на цель.
      if (current.interactive) {
        let best = current.pull

        for (const button of buttons()) {
          const rect = button.getBoundingClientRect()
          const centerX = rect.left - box.left + rect.width / 2
          const centerY = rect.top - box.top + rect.height / 2
          const distance = Math.hypot(hand.x - centerX, hand.y - centerY)

          if (distance < best) {
            best = distance
            hot = button
            goalX = centerX
            goalY = centerY
            width = rect.width + 12
            height = rect.height + 12
            radius = 14
          }
        }
      }

      for (const button of buttons()) {
        if (button === hot) button.dataset.hot = "true"
        else delete button.dataset.hot
      }

      const ease = calm.matches ? 1 : Math.min(1, Math.max(0.02, current.lag))
      const previousX = ringAt.x
      const previousY = ringAt.y

      ringAt.x += (goalX - ringAt.x) * ease
      ringAt.y += (goalY - ringAt.y) * ease

      // Растяжение: кольцо вытягивается вдоль движения и сжимается поперёк,
      // как капля. Без этого инерция читается как задержка, а не как масса.
      const speed = Math.hypot(ringAt.x - previousX, ringAt.y - previousY)
      const pullFactor = hot ? 0 : Math.min(0.42, speed * 0.012 * current.stretch)
      const angle =
        speed > 0.1
          ? (Math.atan2(ringAt.y - previousY, ringAt.x - previousX) * 180) /
            Math.PI
          : 0

      ring.style.width = `${width}px`
      ring.style.height = `${height}px`
      ring.style.margin = `${-height / 2}px 0 0 ${-width / 2}px`
      ring.style.borderRadius = `${radius}px`
      ring.style.transform = `translate3d(${ringAt.x.toFixed(1)}px, ${ringAt.y.toFixed(1)}px, 0) rotate(${angle.toFixed(1)}deg) scale(${(1 + pullFactor).toFixed(3)}, ${(1 - pullFactor * 0.7).toFixed(3)})`
      dot.style.transform = `translate3d(${hand.x.toFixed(1)}px, ${hand.y.toFixed(1)}px, 0)`

      const settled =
        Math.abs(goalX - ringAt.x) < 0.4 && Math.abs(goalY - ringAt.y) < 0.4

      if (!settled && inside && !calm.matches) raf = requestAnimationFrame(step)
    }

    const run = () => {
      if (!raf) raf = requestAnimationFrame(step)
    }

    const move = (event: PointerEvent) => {
      const box = host.getBoundingClientRect()

      hand.x = event.clientX - box.left
      hand.y = event.clientY - box.top

      if (!inside) {
        // Первый вход: кольцо появляется там же, где рука, а не летит через
        // всё поле из левого верхнего угла.
        inside = true
        ringAt.x = hand.x
        ringAt.y = hand.y
        host.dataset.pointer = "true"
      }

      run()
    }

    const leave = () => {
      inside = false
      host.dataset.pointer = "false"

      for (const button of buttons()) delete button.dataset.hot

      run()
    }

    host.addEventListener("pointermove", move)
    host.addEventListener("pointerleave", leave)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerleave", leave)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-cursor-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cursor-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-slot="cursor"
        data-vibeui-block="cursor-002"
        className={className}
        style={palette}
      >
        <div data-part="grid" />
        <span data-part="caption">{caption}</span>

        <div data-part="targets">
          {targets.map((target) => (
            <span data-part="target" key={target.label}>
              {target.label}
              {target.hint ? <kbd>{target.hint}</kbd> : null}
            </span>
          ))}
        </div>

        <div data-part="ring" ref={ringRef} aria-hidden="true" />
        <div data-part="dot" ref={dotRef} aria-hidden="true" />
        <span data-part="hint">Кольцо отстаёт от руки и садится на кнопку</span>
      </div>
    </>
  )
}
