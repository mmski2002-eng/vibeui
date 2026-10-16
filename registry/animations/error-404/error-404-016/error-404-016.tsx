"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Error404016Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  description?: string
  startLabel?: string
  actionLabel?: string
  actionHref?: string
  scoreLabel?: string
  overLabel?: string
  hint?: string
  /** Цвет корабля и выстрелов. */
  accent?: string
  /** Пусто — чёрная подложка. */
  background?: string
}

// Аркада на странице ошибки: «Начать игру» прячет заголовок и запускает
// холст. Корабль следует за указателем или стрелками, стреляет пробелом,
// кликом или касанием; злодеи спускаются волнами и ускоряются со счётом.
// Цикл на requestAnimationFrame стоит, пока игра не идёт или кадр не виден.
const STYLES = `
:where([data-vibeui-block="error-404-016"]){
--vibeui-error-404-016-bg:light-dark(oklch(0.97 0 0),oklch(0.1 0 0));
--vibeui-error-404-016-fg:light-dark(oklch(0.12 0 0),oklch(0.98 0 0));
--vibeui-error-404-016-muted:light-dark(oklch(0.5 0 0),oklch(0.7 0 0));
--vibeui-error-404-016-accent:light-dark(oklch(0.55 0.15 70),oklch(0.85 0.17 90));
--vibeui-error-404-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-016"]{color-scheme:dark}
[data-vibeui-block="error-404-016"]{
position:relative;display:grid;place-items:center;overflow:hidden;box-sizing:border-box;min-height:28rem;padding:2rem 1rem;text-align:center;
background:var(--vibeui-error-404-016-bg);color:var(--vibeui-error-404-016-fg);font-family:var(--vibeui-error-404-016-font);
}
[data-vibeui-block="error-404-016"] [data-part="canvas"]{position:absolute;inset:0;width:100%;height:100%;touch-action:none;color:var(--vibeui-error-404-016-accent)}
[data-vibeui-block="error-404-016"] [data-part="intro"]{position:relative;display:flex;flex-direction:column;align-items:center;gap:0.75rem}
[data-vibeui-block="error-404-016"][data-playing] [data-part="intro"]{display:none}
[data-vibeui-block="error-404-016"] [data-part="villains"]{display:flex;gap:0.75rem;margin-bottom:0.5rem}
[data-vibeui-block="error-404-016"] [data-part="villain"]{
width:1.5rem;aspect-ratio:1;border-radius:0.25rem;background:var(--vibeui-error-404-016-tone);
animation:vibeui-error-404-016-hop .6s steps(2) var(--vibeui-error-404-016-delay) infinite alternate;
}
@keyframes vibeui-error-404-016-hop{to{transform:translateY(-0.375rem)}}
[data-vibeui-block="error-404-016"] [data-part="code"]{margin:0;font-family:ui-serif,Georgia,serif;font-style:italic;font-weight:700;font-size:clamp(4rem,20cqi,9rem);line-height:1}
[data-vibeui-block="error-404-016"] [data-part="title"]{margin:0;font-size:1.0625rem}
[data-vibeui-block="error-404-016"] [data-part="text"]{margin:0;color:var(--vibeui-error-404-016-muted);font-size:0.8125rem}
[data-vibeui-block="error-404-016"] [data-part="actions"]{display:flex;flex-wrap:wrap;justify-content:center;gap:0.75rem;margin-top:0.75rem}
[data-vibeui-block="error-404-016"] :is([data-part="start"],[data-part="action"]){
appearance:none;padding:0.625rem 1.125rem;border-radius:999px;border:1px solid var(--vibeui-error-404-016-fg);font:inherit;font-size:0.8125rem;font-weight:600;cursor:pointer;text-decoration:none;
}
[data-vibeui-block="error-404-016"] [data-part="start"]{background:var(--vibeui-error-404-016-fg);color:var(--vibeui-error-404-016-bg)}
[data-vibeui-block="error-404-016"] [data-part="action"]{background:transparent;color:var(--vibeui-error-404-016-fg)}
[data-vibeui-block="error-404-016"] :is([data-part="start"],[data-part="action"]):focus-visible{outline:2px solid var(--vibeui-error-404-016-accent);outline-offset:3px}
[data-vibeui-block="error-404-016"] [data-part="hud"]{
position:absolute;left:1rem;top:1rem;margin:0;font-family:ui-monospace,monospace;font-size:0.75rem;pointer-events:none;
}
[data-vibeui-block="error-404-016"] [data-part="hint"]{position:absolute;bottom:1rem;left:0;right:0;margin:0;color:var(--vibeui-error-404-016-muted);font-size:0.6875rem;pointer-events:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-016"] [data-part="villain"]{animation:none}}
[data-vibeui-block="error-404-016"]{width:100%}
`

const TONES = ["oklch(0.65 0.2 300)", "oklch(0.7 0.18 145)", "oklch(0.65 0.22 25)", "oklch(0.75 0.15 200)", "oklch(0.8 0.15 70)"]

type Shot = { x: number; y: number }
type Foe = { x: number; y: number; tone: string }

export function Error404016({
  code = "404",
  title = "Ой, что-то пошло не так.",
  description = "Победите злодеев и верните мир на место.",
  startLabel = "Начать игру",
  actionLabel = "На главную",
  actionHref = "/",
  scoreLabel = "Очки",
  overLabel = "Игра окончена — клик, чтобы сыграть ещё",
  hint = "Ведите мышью или стрелками, стреляйте кликом или пробелом",
  accent,
  background,
  className,
  style,
  ...props
}: Error404016Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [over, setOver] = useState(false)

  useEffect(() => {
    if (!playing) return
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return

    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    let width = canvas.clientWidth
    let height = canvas.clientHeight
    canvas.width = width * ratio
    canvas.height = height * ratio
    context.setTransform(ratio, 0, 0, ratio, 0, 0)

    let ship = width / 2
    let target = ship
    let shots: Shot[] = []
    let foes: Foe[] = []
    let points = 0
    let alive = true
    let frame = 0
    let spawn = 0
    let cooldown = 0
    const keys = new Set<string>()

    const fire = () => {
      if (!alive) return restart()
      if (cooldown > 0) return
      shots.push({ x: ship, y: height - 40 })
      cooldown = 10
    }
    const restart = () => {
      shots = []
      foes = []
      points = 0
      alive = true
      setScore(0)
      setOver(false)
    }

    const tick = () => {
      if (keys.has("ArrowLeft")) target -= 7
      if (keys.has("ArrowRight")) target += 7
      target = Math.max(16, Math.min(width - 16, target))
      ship += (target - ship) * 0.25
      cooldown -= 1

      if (alive) {
        spawn -= 1
        if (spawn <= 0) {
          foes.push({ x: 20 + Math.random() * (width - 40), y: -20, tone: TONES[Math.floor(Math.random() * TONES.length)] })
          spawn = Math.max(18, 60 - points / 2)
        }
        const speed = 1 + points / 120
        foes.forEach((foe) => (foe.y += speed))
        shots.forEach((shot) => (shot.y -= 9))
        for (const shot of shots) {
          const hit = foes.findIndex((foe) => Math.abs(foe.x - shot.x) < 16 && Math.abs(foe.y - shot.y) < 16)
          if (hit >= 0) {
            foes.splice(hit, 1)
            shot.y = -99
            points += 10
            setScore(points)
          }
        }
        shots = shots.filter((shot) => shot.y > -20)
        if (foes.some((foe) => foe.y > height - 40)) {
          alive = false
          setOver(true)
        }
      }

      context.clearRect(0, 0, width, height)
      for (const foe of foes) {
        context.fillStyle = foe.tone
        context.fillRect(foe.x - 12, foe.y - 12, 24, 24)
        context.fillStyle = "#000"
        context.fillRect(foe.x - 7, foe.y - 4, 4, 4)
        context.fillRect(foe.x + 3, foe.y - 4, 4, 4)
      }
      context.fillStyle = getComputedStyle(canvas).color
      shots.forEach((shot) => context.fillRect(shot.x - 1.5, shot.y - 8, 3, 12))
      context.beginPath()
      context.moveTo(ship, height - 46)
      context.lineTo(ship + 14, height - 20)
      context.lineTo(ship - 14, height - 20)
      context.closePath()
      context.fill()
      frame = requestAnimationFrame(tick)
    }

    const move = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect()
      target = event.clientX - box.left
    }
    const down = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault()
        fire()
      }
      if (event.key.startsWith("Arrow")) {
        event.preventDefault()
        keys.add(event.key)
      }
    }
    const up = (event: KeyboardEvent) => keys.delete(event.key)
    const resize = new ResizeObserver(() => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    })

    resize.observe(canvas)
    canvas.addEventListener("pointermove", move)
    canvas.addEventListener("pointerdown", fire)
    canvas.addEventListener("keydown", down)
    canvas.addEventListener("keyup", up)
    canvas.focus()
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      canvas.removeEventListener("pointermove", move)
      canvas.removeEventListener("pointerdown", fire)
      canvas.removeEventListener("keydown", down)
      canvas.removeEventListener("keyup", up)
    }
  }, [playing])

  const palette = {
    ...(accent ? { "--vibeui-error-404-016-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-016-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-016" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-016"
        data-slot="not-found"
        data-playing={playing || undefined}
        className={className}
        style={palette}
      >
        {playing ? (
          <>
            <canvas ref={canvasRef} data-part="canvas" tabIndex={0} aria-label={hint} />
            <p data-part="hud" aria-live="polite">
              {over ? overLabel : `${scoreLabel}: ${score}`}
            </p>
            <p data-part="hint">{hint}</p>
          </>
        ) : null}
        <div data-part="intro">
          <div data-part="villains" aria-hidden="true">
            {TONES.map((tone, index) => (
              <span
                key={tone}
                data-part="villain"
                style={
                  {
                    "--vibeui-error-404-016-tone": tone,
                    "--vibeui-error-404-016-delay": `${index * -0.15}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <h1 data-part="code">{code}</h1>
          <p data-part="title">{title}</p>
          <p data-part="text">{description}</p>
          <div data-part="actions">
            <button type="button" data-part="start" onClick={() => setPlaying(true)}>
              {startLabel}
            </button>
            <a data-part="action" href={actionHref}>
              {actionLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
