"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Error404011Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет пузырьков. */
  accent?: string
  /** Пусто — глубокая синяя подложка. */
  background?: string
  /** Сколько пузырьков в толще. */
  count?: number
}

// Глубина: пузырьки разного размера поднимаются с разной скоростью, а
// крупные и близкие размыты сильнее — так плоский холст читается объёмом.
// Курсор мягко раздвигает толщу. Огромный код проступает сквозь неё.
const STYLES = `
:where([data-vibeui-block="error-404-011"]){
--vibeui-error-404-011-bg:linear-gradient(180deg,light-dark(oklch(0.95 0.02 230),oklch(0.3 0.04 240)),light-dark(oklch(0.85 0.04 235),oklch(0.16 0.03 245)));
--vibeui-error-404-011-fg:light-dark(oklch(0.25 0.06 245),oklch(0.95 0.01 240));
--vibeui-error-404-011-accent:light-dark(oklch(0.55 0.09 235),oklch(0.8 0.05 230));
--vibeui-error-404-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-011"]{color-scheme:dark}
[data-vibeui-block="error-404-011"]{
position:relative;display:grid;place-items:center;overflow:hidden;box-sizing:border-box;min-height:28rem;padding:2rem 1rem;text-align:center;
background:var(--vibeui-error-404-011-bg);color:var(--vibeui-error-404-011-fg);font-family:var(--vibeui-error-404-011-font);
}
[data-vibeui-block="error-404-011"] [data-part="canvas"]{position:absolute;inset:0;width:100%;height:100%;color:var(--vibeui-error-404-011-accent)}
[data-vibeui-block="error-404-011"] [data-part="code"]{
position:absolute;inset:0;display:grid;place-items:center;margin:0;font-size:46cqi;font-weight:800;letter-spacing:-0.05em;
color:color-mix(in oklab,var(--vibeui-error-404-011-fg) 6%,transparent);pointer-events:none;
}
[data-vibeui-block="error-404-011"] [data-part="copy"]{position:relative;display:flex;flex-direction:column;align-items:center;gap:1.25rem}
[data-vibeui-block="error-404-011"] [data-part="title"]{margin:0;font-size:clamp(1.5rem,5cqi,2.5rem);font-weight:300;letter-spacing:0.3em;text-transform:uppercase}
[data-vibeui-block="error-404-011"] [data-part="action"]{
padding:0.625rem 1.25rem;border:1px solid color-mix(in oklab,var(--vibeui-error-404-011-fg) 30%,transparent);border-radius:999px;color:inherit;text-decoration:none;font-size:0.875rem;
backdrop-filter:blur(6px);transition:background .2s ease;
}
[data-vibeui-block="error-404-011"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-error-404-011-fg) 12%,transparent)}
[data-vibeui-block="error-404-011"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-error-404-011-accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-011"] *{transition:none!important}}
[data-vibeui-block="error-404-011"]{width:100%}
`

type Bubble = { x: number; y: number; r: number; speed: number; drift: number; phase: number }

export function Error404011({
  code = "404",
  title = "Страница утонула",
  actionLabel = "Всплыть на главную",
  actionHref = "/",
  accent,
  background,
  count = 260,
  className,
  style,
  ...props
}: Error404011Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const pointer = { x: -9999, y: -9999 }
    let width = 0
    let height = 0
    let frame = 0
    let visible = true
    let bubbles: Bubble[] = []

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      bubbles = Array.from({ length: count }, () => {
        const depth = Math.random() ** 2
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 1 + depth * 7,
          speed: 0.15 + depth * 0.9,
          drift: 0.2 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
        }
      })
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      context.fillStyle = getComputedStyle(canvas).color
      for (const bubble of bubbles) {
        if (!reduced) {
          bubble.y -= bubble.speed
          if (bubble.y < -10) bubble.y = height + 10
        }
        const dx = bubble.x - pointer.x
        const dy = bubble.y - pointer.y
        const push = Math.max(0, 1 - Math.hypot(dx, dy) / 140) * 26
        const x = bubble.x + Math.sin(time / 1400 + bubble.phase) * bubble.drift * 8 + Math.sign(dx) * push
        context.globalAlpha = 0.25 + (bubble.r / 8) * 0.45
        context.filter = bubble.r > 5.5 ? "blur(2px)" : "none"
        context.beginPath()
        context.arc(x, bubble.y, bubble.r, 0, Math.PI * 2)
        context.fill()
      }
      context.filter = "none"
    }

    const loop = (time: number) => {
      draw(time)
      frame = visible ? requestAnimationFrame(loop) : 0
    }

    const move = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect()
      pointer.x = event.clientX - box.left
      pointer.y = event.clientY - box.top
    }
    const leave = () => ((pointer.x = -9999), (pointer.y = -9999))

    resize()
    const observer = new ResizeObserver(() => {
      resize()
      if (reduced) draw(0)
    })
    observer.observe(canvas)
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame && !reduced) frame = requestAnimationFrame(loop)
    })
    seen.observe(canvas)
    if (reduced) draw(0)
    else frame = requestAnimationFrame(loop)
    const host = canvas.parentElement
    host?.addEventListener("pointermove", move)
    host?.addEventListener("pointerleave", leave)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      seen.disconnect()
      host?.removeEventListener("pointermove", move)
      host?.removeEventListener("pointerleave", leave)
    }
  }, [count])

  const palette = {
    ...(accent ? { "--vibeui-error-404-011-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-011-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-011" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-011"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <canvas ref={canvasRef} data-part="canvas" aria-hidden="true" />
        <p data-part="code" aria-hidden="true">
          {code}
        </p>
        <div data-part="copy">
          <h1 data-part="title">
            <span hidden>{code} </span>
            {title}
          </h1>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </section>
    </>
  )
}
