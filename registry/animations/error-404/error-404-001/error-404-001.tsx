"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Error404001Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет пылинок и заголовка. */
  accent?: string
  /** Пусто — тёмная подложка по умолчанию. */
  background?: string
  /** Сколько пылинок; на узком кадре берётся меньше. */
  density?: number
}

// Цифры собраны из тысяч пылинок: каждая держится за свою точку глифа
// пружиной и разлетается от курсора. Точки снимаются с невидимого холста,
// куда код пишется системным шрифтом, — без шрифтов и картинок.
const STYLES = `
:where([data-vibeui-block="error-404-001"]){
--vibeui-error-404-001-bg:light-dark(oklch(0.97 0.004 50),oklch(0.16 0.004 50));
--vibeui-error-404-001-fg:light-dark(oklch(0.2 0.004 50),oklch(0.96 0.004 50));
--vibeui-error-404-001-muted:light-dark(oklch(0.48 0.01 50),oklch(0.72 0.01 50));
--vibeui-error-404-001-accent:light-dark(oklch(0.6 0.2 38),oklch(0.68 0.19 38));
--vibeui-error-404-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-001"]{color-scheme:dark}
[data-vibeui-block="error-404-001"]{
position:relative;display:block;overflow:hidden;box-sizing:border-box;min-height:28rem;
background:var(--vibeui-error-404-001-bg);color:var(--vibeui-error-404-001-fg);
font-family:var(--vibeui-error-404-001-font);
}
[data-vibeui-block="error-404-001"] [data-part="canvas"]{position:absolute;inset:0;width:100%;height:100%;display:block}
[data-vibeui-block="error-404-001"] [data-part="copy"]{
position:absolute;left:1.5rem;right:1.5rem;bottom:1.75rem;display:flex;flex-direction:column;gap:0.5rem;
pointer-events:none;
}
[data-vibeui-block="error-404-001"] [data-part="title"]{margin:0;font-size:clamp(1.25rem,4cqi,1.75rem);font-weight:500;color:var(--vibeui-error-404-001-accent)}
[data-vibeui-block="error-404-001"] [data-part="text"]{margin:0;max-width:34rem;font-size:clamp(1rem,3cqi,1.5rem);line-height:1.25}
[data-vibeui-block="error-404-001"] [data-part="action"]{
pointer-events:auto;align-self:flex-start;margin-top:0.75rem;padding:0.5rem 1rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-error-404-001-fg) 10%,transparent);color:inherit;text-decoration:none;font-size:0.875rem;
transition:background .2s ease;
}
[data-vibeui-block="error-404-001"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-error-404-001-fg) 18%,transparent)}
[data-vibeui-block="error-404-001"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-error-404-001-accent);outline-offset:3px}
@container (min-width:48rem){
[data-vibeui-block="error-404-001"] [data-part="copy"]{left:2.5rem;right:2.5rem;bottom:2.5rem;align-items:center;text-align:center}
[data-vibeui-block="error-404-001"] [data-part="action"]{align-self:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-001"] *{transition:none!important}}
[data-vibeui-block="error-404-001"]{width:100%}
`

type Dust = { x: number; y: number; hx: number; hy: number; vx: number; vy: number }

export function Error404001({
  code = "404",
  title = "Страница не найдена",
  description = "Страницы, которую вы искали, нет или она переехала.",
  actionLabel = "На главную",
  actionHref = "/",
  accent,
  background,
  density = 2600,
  className,
  style,
  ...props
}: Error404001Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const pointer = { x: -9999, y: -9999 }
    let dust: Dust[] = []
    let width = 0
    let height = 0
    let frame = 0
    let visible = true

    const sample = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      if (!width || !height) return
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const probe = document.createElement("canvas")
      probe.width = width
      probe.height = height
      const ink = probe.getContext("2d")
      if (!ink) return
      const size = Math.min(width * 0.4, height * 0.5)
      ink.font = `900 ${size}px system-ui, sans-serif`
      ink.textAlign = "center"
      ink.textBaseline = "middle"
      ink.fillText(code, width / 2, height * 0.32)

      const pixels = ink.getImageData(0, 0, width, height).data
      const points: [number, number][] = []
      for (let y = 0; y < height; y += 3) {
        for (let x = 0; x < width; x += 3) {
          if (pixels[(y * width + x) * 4 + 3] > 128) points.push([x, y])
        }
      }
      const total = Math.min(points.length, Math.round(density * Math.min(1, width / 900)))
      dust = Array.from({ length: total }, () => {
        const [hx, hy] = points[Math.floor(Math.random() * points.length)]
        return { x: Math.random() * width, y: Math.random() * height, hx, hy, vx: 0, vy: 0 }
      })
      if (reduced) dust.forEach((particle) => ((particle.x = particle.hx), (particle.y = particle.hy)))
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.fillStyle = getComputedStyle(canvas).color
      for (const particle of dust) {
        const dx = particle.x - pointer.x
        const dy = particle.y - pointer.y
        const distance = dx * dx + dy * dy
        if (distance < 9000) {
          const push = (9000 - distance) / 9000
          particle.vx += (dx / Math.sqrt(distance + 1)) * push * 2.4
          particle.vy += (dy / Math.sqrt(distance + 1)) * push * 2.4
        }
        particle.vx = (particle.vx + (particle.hx - particle.x) * 0.012) * 0.9
        particle.vy = (particle.vy + (particle.hy - particle.y) * 0.012) * 0.9
        particle.x += particle.vx + (Math.random() - 0.5) * 0.4
        particle.y += particle.vy + (Math.random() - 0.5) * 0.4
        context.globalAlpha = 0.45 + Math.random() * 0.4
        context.fillRect(particle.x, particle.y, 1.6, 1.6)
      }
    }

    const loop = () => {
      draw()
      frame = visible ? requestAnimationFrame(loop) : 0
    }

    const move = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect()
      pointer.x = event.clientX - box.left
      pointer.y = event.clientY - box.top
    }
    const leave = () => ((pointer.x = -9999), (pointer.y = -9999))

    sample()
    const resize = new ResizeObserver(() => {
      sample()
      if (reduced) draw()
    })
    resize.observe(canvas)
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame && !reduced) frame = requestAnimationFrame(loop)
    })
    seen.observe(canvas)
    if (reduced) draw()
    else frame = requestAnimationFrame(loop)
    canvas.parentElement?.addEventListener("pointermove", move)
    canvas.parentElement?.addEventListener("pointerleave", leave)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      seen.disconnect()
      canvas.parentElement?.removeEventListener("pointermove", move)
      canvas.parentElement?.removeEventListener("pointerleave", leave)
    }
  }, [code, density])

  const palette = {
    ...(accent ? { "--vibeui-error-404-001-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-001"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <canvas
          ref={canvasRef}
          data-part="canvas"
          aria-hidden="true"
          style={{ color: "var(--vibeui-error-404-001-accent)" }}
        />
        <div data-part="copy">
          <h1 data-part="title">
            <span hidden>{code} </span>
            {title}
          </h1>
          <p data-part="text">{description}</p>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </section>
    </>
  )
}
