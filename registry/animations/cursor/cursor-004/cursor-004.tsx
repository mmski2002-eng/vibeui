"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Cursor004Node = {
  label: string
  /** Доли кадра: где стоит узел. */
  at: [number, number]
}

export type Cursor004Props = Omit<ComponentProps<"div">, "children"> & {
  /** Узлы, к которым тянется резинка. */
  nodes?: Cursor004Node[]
  /** Расстояние в пикселях, дальше которого нить рвётся. */
  reach?: number
  /** Провисание: 0 — струна, 1 — верёвка. */
  sag?: number
  /** Толщина нити в пикселях. */
  thickness?: number
  /** Цвет нити и подсветки узла. */
  accent?: string
  /** Реакция на курсор. */
  interactive?: boolean
}

const DEFAULT_NODES: Cursor004Node[] = [
  { label: "Источник", at: [0.16, 0.28] },
  { label: "Фильтр", at: [0.5, 0.2] },
  { label: "Модель", at: [0.82, 0.36] },
  { label: "Отчёт", at: [0.3, 0.74] },
  { label: "Вебхук", at: [0.72, 0.76] },
]

/** Узлов в нити: меньше — угловато, больше — дороже и незаметно глазу. */
const KNOTS = 16

// Идея компонента: курсор тянет за собой настоящую нить. Она провисает под
// собственным весом, пружинит на рывке, натягивается в струну, когда узел
// далеко, и рвётся, если перетянуть, — с отдачей, как у настоящей резинки.
//
// Нить считается по Верле: цепочка узлов, каждый помнит своё прошлое
// положение, между ними держатся расстояния. Это дешевле любой физической
// библиотеки и даёт то самое запаздывание хвоста, ради которого всё и
// затевалось: пружина на transform так не умеет.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="cursor-004"]){
--vibeui-cursor-004-paper:light-dark(oklch(0.99 0 0),oklch(0.15 0 0));
--vibeui-cursor-004-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cursor-004-muted:color-mix(in oklab,var(--vibeui-cursor-004-ink) 50%,transparent);
--vibeui-cursor-004-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 16%));
--vibeui-cursor-004-surface:light-dark(oklch(0.97 0 0),oklch(0.19 0 0));
--vibeui-cursor-004-accent:light-dark(oklch(0.55 0.19 264),oklch(0.74 0.16 264));
--vibeui-cursor-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cursor-004"]{color-scheme:dark}
[data-vibeui-block="cursor-004"]{
position:relative;box-sizing:border-box;width:100%;aspect-ratio:16/9;min-height:12rem;
overflow:hidden;border:1px solid var(--vibeui-cursor-004-border);border-radius:0.75rem;
background:var(--vibeui-cursor-004-paper);color:var(--vibeui-cursor-004-ink);
font-family:var(--vibeui-cursor-004-font);
/* Родной курсор здесь лишний: его роль исполняет конец нити. */
cursor:none;touch-action:pan-y;
}
[data-vibeui-block="cursor-004"] *{box-sizing:border-box}
/* Точки поля: без них нить висит в пустоте и её длина не читается. */
[data-vibeui-block="cursor-004"] [data-part="dots"]{
position:absolute;inset:0;pointer-events:none;
background-image:radial-gradient(circle,var(--vibeui-cursor-004-border) 0.0625rem,transparent 0.0625rem);
background-size:1.5rem 1.5rem;opacity:0.8;
}
[data-vibeui-block="cursor-004"] canvas{
position:absolute;inset:0;display:block;width:100%;height:100%;
pointer-events:none;z-index:2;
}
/* Узел: круглый порт с подписью. Подсвечивается тот, за который держится
   нить, — иначе непонятно, к чему именно тянется рука. */
[data-vibeui-block="cursor-004"] [data-part="node"]{
position:absolute;transform:translate(-50%,-50%);z-index:3;
display:inline-flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.75rem 0.4375rem 0.5rem;border-radius:9999px;
background:var(--vibeui-cursor-004-surface);
border:1px solid var(--vibeui-cursor-004-border);
font-size:0.75rem;font-weight:600;color:var(--vibeui-cursor-004-muted);
transition:border-color 0.2s ease,color 0.2s ease,transform 0.2s ease;
}
[data-vibeui-block="cursor-004"] [data-part="port"]{
width:0.5rem;height:0.5rem;border-radius:9999px;flex:none;
background:color-mix(in oklab,var(--vibeui-cursor-004-ink) 30%,transparent);
transition:background 0.2s ease,box-shadow 0.2s ease;
}
[data-vibeui-block="cursor-004"] [data-part="node"][data-hot="true"]{
border-color:color-mix(in oklab,var(--vibeui-cursor-004-accent) 65%,transparent);
color:var(--vibeui-cursor-004-accent);
transform:translate(-50%,-50%) scale(1.04);
}
[data-vibeui-block="cursor-004"] [data-part="node"][data-hot="true"] [data-part="port"]{
background:var(--vibeui-cursor-004-accent);
box-shadow:0 0 0 0.25rem color-mix(in oklab,var(--vibeui-cursor-004-accent) 22%,transparent);
}
/* Пробник цвета: канве нужна строка, а в переменной стоит light-dark() —
   разрешённый цвет снимается с этого пустого узла. */
[data-vibeui-block="cursor-004"] [data-part="probe"]{
position:absolute;width:0;height:0;overflow:hidden;
color:var(--vibeui-cursor-004-accent);
}
[data-vibeui-block="cursor-004"] [data-part="hint"]{
position:absolute;left:50%;bottom:0.75rem;transform:translateX(-50%);z-index:4;
pointer-events:none;font-size:0.75rem;color:var(--vibeui-cursor-004-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cursor-004"] *{animation:none!important;transition:none!important}
}
`

/**
 * Разрешённый цвет для канвы. В переменной стоит light-dark(), и
 * getPropertyValue вернул бы саму функцию — канва такую строку не понимает.
 * Поэтому цвет снимается с пустого узла-пробника, которому он назначен.
 */
function readColour(probe: HTMLElement | null, fallback: string) {
  if (!probe) return fallback

  const value = getComputedStyle(probe).color

  return value || fallback
}

/**
 * Резинка к узлу: нить от курсора к ближайшему узлу — провисает, пружинит и
 * рвётся, если перетянуть. Один файл, ноль зависимостей.
 */
export function Cursor004({
  nodes = DEFAULT_NODES,
  reach = 260,
  sag = 0.55,
  thickness = 2,
  accent,
  interactive = true,
  className,
  style,
  ...props
}: Cursor004Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const settings = useRef({ reach, sag, thickness, interactive })

  useEffect(() => {
    settings.current = { reach, sag, thickness, interactive }
  })

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current

    if (!host || !canvas) return

    const context = canvas.getContext("2d")
    const probe = host.querySelector<HTMLElement>('[data-part="probe"]')

    if (!context) return

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")

    // Цепочка Верле: у каждого узла есть текущее и прошлое положение,
    // скорость выводится из их разницы. Отдельного массива скоростей нет —
    // на разрыве и рывке он бы разошёлся с положениями.
    const rope = Array.from({ length: KNOTS }, () => ({
      x: 0,
      y: 0,
      px: 0,
      py: 0,
    }))
    const hand = { x: 0, y: 0 }
    let anchor: { x: number; y: number; node: HTMLElement } | null = null
    let raf = 0
    let inside = false
    let width = 0
    let height = 0
    let ratio = 1
    let snapped = 0

    const resize = () => {
      ratio = Math.min(2, window.devicePixelRatio || 1)

      const nextWidth = Math.round(host.clientWidth * ratio)
      const nextHeight = Math.round(host.clientHeight * ratio)

      if (nextWidth === width && nextHeight === height) return

      width = nextWidth
      height = nextHeight
      canvas.width = width
      canvas.height = height
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const ports = () =>
      [...host.querySelectorAll<HTMLElement>('[data-part="node"]')]

    /** Ближайший узел в пределах досягаемости — за него и держится нить. */
    const findAnchor = () => {
      const box = host.getBoundingClientRect()
      const current = settings.current
      let best = current.reach
      let found: { x: number; y: number; node: HTMLElement } | null = null

      for (const node of ports()) {
        const rect = node.getBoundingClientRect()
        const x = rect.left - box.left + rect.width / 2
        const y = rect.top - box.top + rect.height / 2
        const distance = Math.hypot(hand.x - x, hand.y - y)

        if (distance < best) {
          best = distance
          found = { x, y, node }
        }
      }

      return found
    }

    const seed = () => {
      for (let index = 0; index < rope.length; index += 1) {
        rope[index].x = hand.x
        rope[index].y = hand.y
        rope[index].px = hand.x
        rope[index].py = hand.y
      }
    }

    const draw = () => {
      raf = 0

      resize()

      const current = settings.current
      const cssWidth = host.clientWidth
      const cssHeight = host.clientHeight

      context.clearRect(0, 0, cssWidth, cssHeight)

      if (!inside || !current.interactive) return

      const next = findAnchor()

      // Разрыв: узел ушёл из досягаемости. Нить не исчезает мгновенно —
      // ей дают отлететь, иначе связь читается как баг отрисовки.
      if (anchor && !next) snapped = 1
      anchor = next

      for (const node of ports()) {
        if (anchor && node === anchor.node) node.dataset.hot = "true"
        else delete node.dataset.hot
      }

      const gravity = 0.55 * current.sag

      for (const knot of rope) {
        const vx = (knot.x - knot.px) * 0.92
        const vy = (knot.y - knot.py) * 0.92

        knot.px = knot.x
        knot.py = knot.y
        knot.x += vx
        knot.y += vy + gravity
      }

      // Концы: первый узел всегда в руке, последний — на порту, пока нить
      // цела. Ограничения прогоняются несколько раз: за один проход цепочка
      // остаётся резиновой и провисает сильнее, чем нужно.
      rope[0].x = hand.x
      rope[0].y = hand.y

      const tail = rope[rope.length - 1]

      if (anchor) {
        tail.x = anchor.x
        tail.y = anchor.y
      }

      const span = anchor
        ? Math.hypot(anchor.x - hand.x, anchor.y - hand.y)
        : current.reach
      const segment = (span / (rope.length - 1)) * (1 + 0.12 * current.sag)

      for (let pass = 0; pass < 6; pass += 1) {
        for (let index = 0; index < rope.length - 1; index += 1) {
          const a = rope[index]
          const b = rope[index + 1]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const distance = Math.hypot(dx, dy) || 0.0001
          const shift = ((distance - segment) / distance) * 0.5
          const moveX = dx * shift
          const moveY = dy * shift

          if (index !== 0) {
            a.x += moveX
            a.y += moveY
          }

          if (!(anchor && index + 1 === rope.length - 1)) {
            b.x -= moveX
            b.y -= moveY
          }
        }

        rope[0].x = hand.x
        rope[0].y = hand.y

        if (anchor) {
          tail.x = anchor.x
          tail.y = anchor.y
        }
      }

      if (!anchor && snapped > 0) snapped = Math.max(0, snapped - 0.03)

      const ink = readColour(probe, "#5b7cfa")
      const alpha = anchor ? 1 : snapped

      if (alpha > 0.01) {
        // Нить рисуется одной кривой через середины отрезков: ломаная из
        // шестнадцати узлов выдала бы себя углами.
        context.save()
        context.globalAlpha = alpha
        context.strokeStyle = ink
        context.lineWidth = current.thickness
        context.lineCap = "round"
        context.lineJoin = "round"
        context.beginPath()
        context.moveTo(rope[0].x, rope[0].y)

        for (let index = 1; index < rope.length - 1; index += 1) {
          const knot = rope[index]
          const nextKnot = rope[index + 1]

          context.quadraticCurveTo(
            knot.x,
            knot.y,
            (knot.x + nextKnot.x) / 2,
            (knot.y + nextKnot.y) / 2,
          )
        }

        context.lineTo(tail.x, tail.y)
        context.stroke()

        if (anchor) {
          context.fillStyle = ink
          context.beginPath()
          context.arc(tail.x, tail.y, current.thickness * 1.6, 0, Math.PI * 2)
          context.fill()
        }

        context.restore()
      }

      // Конец нити в руке: точка на месте курсора, раз родной спрятан.
      context.fillStyle = ink
      context.beginPath()
      context.arc(hand.x, hand.y, current.thickness * 1.8, 0, Math.PI * 2)
      context.fill()

      if (!calm.matches) raf = requestAnimationFrame(draw)
    }

    const run = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    const move = (event: PointerEvent) => {
      const box = host.getBoundingClientRect()

      hand.x = event.clientX - box.left
      hand.y = event.clientY - box.top

      if (!inside) {
        inside = true
        seed()
      }

      run()
    }

    const leave = () => {
      inside = false
      anchor = null
      snapped = 0

      for (const node of ports()) delete node.dataset.hot

      run()
    }

    const sizes = new ResizeObserver(() => run())

    sizes.observe(host)
    host.addEventListener("pointermove", move)
    host.addEventListener("pointerleave", leave)
    run()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      sizes.disconnect()
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerleave", leave)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-cursor-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cursor-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-slot="cursor"
        data-vibeui-block="cursor-004"
        className={className}
        style={palette}
      >
        <span data-part="probe" aria-hidden="true" />
        <div data-part="dots" />
        <canvas ref={canvasRef} aria-hidden="true" />

        {nodes.map((node) => (
          <span
            key={node.label}
            data-part="node"
            style={{ left: `${node.at[0] * 100}%`, top: `${node.at[1] * 100}%` }}
          >
            <span data-part="port" />
            {node.label}
          </span>
        ))}

        <span data-part="hint">
          Нить держится за ближайший узел и рвётся, если перетянуть
        </span>
      </div>
    </>
  )
}
