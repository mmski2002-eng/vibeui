"use client"

import { useEffect, useRef, type CSSProperties } from "react"

export type Background006Props = {
  /** Плотность: 1 — около 140 снежинок на экран 1440×900, растёт с площадью. */
  density?: number
  /** Ветер: −1…1, отрицательный — влево. */
  wind?: number
  /** Скорость падения, 1 — спокойный снег. */
  speed?: number
  /** Цвет снежинок. */
  color?: string
  /** Подложка слоя; пусто — прозрачный, снег ложится на страницу. */
  backdrop?: string
  /** Слой на весь экран поверх страницы (fixed) или внутри родителя (absolute). */
  fixed?: boolean
  /** Выключить снег, не размонтируя слой. */
  paused?: boolean
  zIndex?: number
  className?: string
  style?: CSSProperties
}

// Снег на весь экран: canvas поверх страницы, pointer-events:none. Снежинки
// трёх глубин — дальние мелкие и бледные, ближние крупнее и чуть размыты
// (рисуются мягким радиальным градиентом), падают со своей скоростью и
// покачиваются. Ветер — общий сдвиг плюс медленное дыхание. Цикл rAF стоит
// в скрытой вкладке и когда слой не в кадре; prefers-reduced-motion
// оставляет один статичный кадр редких снежинок.
const STYLES = `
[data-vibeui-block="background-006"]{position:absolute;inset:0;display:block;pointer-events:none;overflow:hidden;background:var(--vibeui-background-006-backdrop,transparent)}
[data-vibeui-block="background-006"][data-fixed="true"]{position:fixed}
[data-vibeui-block="background-006"] canvas{display:block;width:100%;height:100%}`

type Flake = {
  x: number
  y: number
  r: number
  depth: number
  vy: number
  phase: number
  sway: number
}

function seed(width: number, height: number, density: number): Flake[] {
  const count = Math.round((width * height) / 9200 * density)
  const flakes: Flake[] = []
  for (let i = 0; i < count; i++) {
    const depth = Math.random()
    flakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.7 + depth * depth * 2.6,
      depth,
      vy: 18 + depth * 46,
      phase: Math.random() * Math.PI * 2,
      sway: 0.4 + Math.random() * 0.8,
    })
  }
  return flakes
}

/** Снег на весь экран: canvas поверх страницы, три глубины, ветер, пауза вне кадра и в скрытой вкладке. */
export function Background006({
  density = 1,
  wind = 0.25,
  speed = 1,
  color = "#ffffff",
  backdrop,
  fixed = true,
  paused = false,
  zIndex = 50,
  className,
  style,
}: Background006Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const settings = useRef({ density, wind, speed, color, paused })

  // Свежие значения для цикла анимации без перезапуска эффекта. Обновляем в
  // эффекте, а не во время рендера: правка ref в рендере ломает конкурентный
  // режим и запрещена react-hooks/refs.
  useEffect(() => {
    settings.current = { density, wind, speed, color, paused }
  }, [density, wind, speed, color, paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let flakes: Flake[] = []
    let frame = 0
    let last = 0
    let visible = true
    let time = 0
    // Внешний выключатель: кнопка «снег» в любой шапке ставит
    // data-vibeui-snow="off" на <html> и шлёт событие vibeui-snow.
    let muted = document.documentElement.dataset.vibeuiSnow === "off"

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      flakes = seed(width, height, reduced ? settings.current.density * 0.25 : settings.current.density)
      if (reduced) draw(0)
    }

    const draw = (delta: number) => {
      const { wind: gust, speed: pace, color: ink } = settings.current
      context.clearRect(0, 0, width, height)
      context.fillStyle = ink
      const breeze = gust * 26 + Math.sin(time * 0.35) * 10
      for (const flake of flakes) {
        if (delta > 0) {
          flake.phase += delta * flake.sway
          flake.y += flake.vy * pace * delta
          flake.x += (breeze * (0.4 + flake.depth) + Math.sin(flake.phase) * 9 * flake.depth) * delta
          if (flake.y > height + 6) {
            flake.y = -6
            flake.x = Math.random() * width
          }
          if (flake.x > width + 6) flake.x = -6
          else if (flake.x < -6) flake.x = width + 6
        }
        context.globalAlpha = 0.28 + flake.depth * 0.6
        context.beginPath()
        context.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2)
        context.fill()
        if (flake.depth > 0.8) {
          context.globalAlpha = 0.12
          context.beginPath()
          context.arc(flake.x, flake.y, flake.r * 2.2, 0, Math.PI * 2)
          context.fill()
        }
      }
      context.globalAlpha = 1
    }

    const tick = (now: number) => {
      frame = 0
      if (!visible || document.hidden || settings.current.paused || muted) {
        last = 0
        return
      }
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      time += delta
      draw(delta)
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (reduced || frame) return
      frame = requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    watcher.observe(canvas)
    const onVisibility = () => {
      if (!document.hidden) start()
    }
    document.addEventListener("visibilitychange", onVisibility)
    const onSnow = () => {
      muted = document.documentElement.dataset.vibeuiSnow === "off"
      if (muted || settings.current.paused) context.clearRect(0, 0, width, height)
      else start()
    }
    window.addEventListener("vibeui-snow", onSnow)
    resize()
    start()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer.disconnect()
      watcher.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("vibeui-snow", onSnow)
    }
  }, [])

  useEffect(() => {
    // Смена paused идёт тем же путём, что и внешний выключатель.
    window.dispatchEvent(new Event("vibeui-snow"))
  }, [paused])

  const palette = {
    ...(backdrop ? { "--vibeui-background-006-backdrop": backdrop } : null),
    zIndex,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-background-006" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="background-006" data-fixed={fixed ? "true" : undefined} aria-hidden="true" className={className} style={palette}>
        <canvas ref={canvasRef} />
      </div>
    </>
  )
}
