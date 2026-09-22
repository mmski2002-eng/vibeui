"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { Mockup010 } from "@/registry/components/mockup/mockup-010/mockup-010"

export type Surface013Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Темп течения: покой, спокойно или живо. */
  speed?: "still" | "calm" | "lively"
  /** Число частиц. */
  density?: "sparse" | "dense"
  /** Сила акцента: едва заметный, спокойный или яркий. */
  intensity?: "faint" | "soft" | "bright"
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Акцентный цвет палитры. */
  accent?: string
  /** Своя палитра четырёх цветов в hex; без неё — база темы плюс accent. */
  colors?: readonly [string, string, string, string]
  className?: string
  style?: CSSProperties
}

// Поток частиц: настоящие частицы на canvas2D. Каждая идёт по полю
// направлений из simplex-шума, кадр не стирается, а притеняется
// полупрозрачной заливкой цвета фона — так за частицами остаются
// гаснущие следы. Тысяча частиц и одна заливка в кадр — дешевле любого
// шейдера, WebGL здесь не нужен. Палитра живёт в CSS с light-dark и
// читается через computed-цвета рамки холста, как у шейдерных фонов.
const STYLES = `
:where([data-vibeui-block="surface-013"]){
--vibeui-surface-013-c1:light-dark(#ffffff,#000000);
--vibeui-surface-013-c2:light-dark(#f2f2f2,#1a1a1a);
--vibeui-surface-013-c3:light-dark(#9a9a9a,#6a6a6a);
--vibeui-surface-013-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-surface-013-c4:var(--vibeui-surface-013-accent);
--vibeui-surface-013-ink:light-dark(#000000,#ffffff);
--vibeui-surface-013-ghost:light-dark(color-mix(in oklab,#000000 78%,transparent),color-mix(in oklab,#ffffff 82%,transparent));
--vibeui-surface-013-ghost-soft:light-dark(color-mix(in oklab,#000000 40%,transparent),color-mix(in oklab,#ffffff 45%,transparent));
--vibeui-surface-013-glass:light-dark(color-mix(in oklab,#ffffff 42%,transparent),color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-surface-013-edge:light-dark(color-mix(in oklab,#000000 10%,transparent),color-mix(in oklab,#ffffff 18%,transparent));
--vibeui-surface-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="surface-013"]{color-scheme:dark}
:where([data-vibeui-block="surface-013"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="surface-013"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="surface-013"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-013-c1);color:var(--vibeui-surface-013-ink);
font-family:var(--vibeui-surface-013-font);
}
[data-vibeui-block="surface-013"] *{box-sizing:border-box}
[data-vibeui-block="surface-013"] [data-part="ghost"]{flex:1}
/* Заглушка того же характера: пока холст не ожил, те же цвета лежат
   мягкими пятнами. */
[data-vibeui-block="surface-013"] [data-part="still"]{
position:absolute;inset:0;pointer-events:none;
background:
radial-gradient(60% 70% at 18% 28%,var(--vibeui-surface-013-c2) 0%,transparent 70%),
radial-gradient(55% 60% at 82% 30%,var(--vibeui-surface-013-c3) 0%,transparent 70%),
var(--vibeui-surface-013-c1);
}
/* Рамка нулевой ширины несёт четыре цвета палитры: computed-значение
   border-color уже разрешило light-dark, холсту остаётся прочитать rgb. */
[data-vibeui-block="surface-013"] canvas{
position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;
border:0 solid transparent;
border-top-color:var(--vibeui-surface-013-c1);
border-right-color:var(--vibeui-surface-013-c2);
border-bottom-color:var(--vibeui-surface-013-c3);
border-left-color:var(--vibeui-surface-013-c4);
opacity:0;transition:opacity 0.8s ease;
}
[data-vibeui-block="surface-013"][data-drawn="true"] canvas{opacity:1}
[data-vibeui-block="surface-013"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:2rem clamp(1.5rem,6cqi,4rem);display:flex;flex-direction:column;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-013"] [data-part="frame"]{min-height:34rem;padding-block:2.5rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-013"] *{animation:none!important;transition:none!important}}
`

const SPEEDS = { still: 0, calm: 1, lively: 2.2 } as const
const DENSITIES = { sparse: 700, dense: 1600 } as const
const INTENSITIES = { faint: 0.3, soft: 0.55, bright: 1 } as const

type Rgb = [number, number, number]

/** Цвет из computed-style ("rgb(r, g, b)") → [r, g, b] 0…255. */
function toRgb(value: string, fallback: Rgb): Rgb {
  const match = /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(value)

  if (!match) return fallback

  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

// Simplex-шум 2D — по Stefan Gustavson (public domain), без таблиц
// перестановок: хэш координат вершины выбирает градиент. Для поля
// направлений этого хватает.
const GRAD = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

function hash(x: number, y: number) {
  let h = (x * 374761393 + y * 668265263) | 0

  h = ((h ^ (h >>> 13)) * 1274126177) | 0

  return (h ^ (h >>> 16)) & 7
}

function corner(gx: number, gy: number, x: number, y: number) {
  const t = 0.5 - x * x - y * y

  if (t < 0) return 0

  const g = GRAD[hash(gx, gy)]

  return t * t * t * t * (g[0] * x + g[1] * y)
}

function snoise(x: number, y: number) {
  const F = 0.3660254037844386
  const G = 0.21132486540518713
  const s = (x + y) * F
  const i = Math.floor(x + s)
  const j = Math.floor(y + s)
  const t = (i + j) * G
  const x0 = x - (i - t)
  const y0 = y - (j - t)
  const i1 = x0 > y0 ? 1 : 0
  const j1 = x0 > y0 ? 0 : 1
  const x1 = x0 - i1 + G
  const y1 = y0 - j1 + G
  const x2 = x0 - 1 + 2 * G
  const y2 = y0 - 1 + 2 * G

  return (
    70 *
    (corner(i, j, x0, y0) +
      corner(i + i1, j + j1, x1, y1) +
      corner(i + 1, j + 1, x2, y2))
  )
}

function mixColor(a: Rgb, b: Rgb, k: number): Rgb {
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
}

function rgba(color: Rgb, alpha: number) {
  return `rgba(${color[0]},${color[1]},${color[2]},${alpha})`
}

/** Поток частиц: до 1600 частиц идут по шумовому полю, оставляя гаснущие следы. */
export function Surface013({
  children,
  speed = "calm",
  density = "dense",
  intensity = "soft",
  tone = "auto",
  accent,
  colors,
  className,
  style,
}: Surface013Props) {
  const host = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Настройки читаются на каждом кадре, поэтому живут в ref: пересобирать
  // сцену ради смены темпа незачем.
  const settings = useRef({
    speed: SPEEDS[speed],
    count: DENSITIES[density],
    power: INTENSITIES[intensity],
  })
  // Палитра перечитывается по сигналу: смена темы, accent или colors.
  const paletteDirty = useRef(true)
  // Запуск кадров снаружи эффекта: после «still» цикл стоит, его надо будить.
  const wake = useRef<() => void>(() => {})

  useEffect(() => {
    settings.current = {
      speed: SPEEDS[speed] ?? 1,
      count: DENSITIES[density] ?? 1600,
      power: INTENSITIES[intensity] ?? 0.55,
    }
    wake.current()
  }, [speed, density, intensity])

  useEffect(() => {
    paletteDirty.current = true
    wake.current()
  }, [tone, accent, colors])

  useEffect(() => {
    const section = host.current
    const canvas = canvasRef.current

    if (!section || !canvas) return

    const ink = canvas.getContext("2d", { alpha: false })

    if (!ink) return

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")
    const scheme = window.matchMedia("(prefers-color-scheme: dark)")

    let frame = 0
    let previous = 0
    let elapsed = 0
    let visible = true
    let width = 0
    let height = 0
    let ratio = 1
    let fresh = true

    // Частицы: x, y, возраст в кадрах и оттенок 0…1 — плоские массивы,
    // без объектов, чтобы сборщик мусора не вмешивался в кадр.
    const MAX = 1600
    const xs = new Float32Array(MAX)
    const ys = new Float32Array(MAX)
    const ages = new Float32Array(MAX)
    const hues = new Float32Array(MAX)

    const palette = {
      base: [0, 0, 0] as Rgb,
      low: [26, 26, 26] as Rgb,
      mid: [106, 106, 106] as Rgb,
      high: [242, 242, 242] as Rgb,
    }

    const readPalette = () => {
      const computed = getComputedStyle(canvas)

      palette.base = toRgb(computed.borderTopColor, [0, 0, 0])
      palette.low = toRgb(computed.borderRightColor, [26, 26, 26])
      palette.mid = toRgb(computed.borderBottomColor, [106, 106, 106])
      palette.high = toRgb(computed.borderLeftColor, [242, 242, 242])
      paletteDirty.current = false
      fresh = true
    }

    const respawn = (index: number) => {
      xs[index] = Math.random() * width
      ys[index] = Math.random() * height
      ages[index] = Math.random() * 80
      hues[index] = Math.random()
    }

    const resize = () => {
      // Следы — тонкие линии, им нужен честный пиксель, но не больше 1.5×.
      ratio = Math.min(1.5, window.devicePixelRatio || 1)

      const nextWidth = Math.max(1, Math.round(section.clientWidth * ratio))
      const nextHeight = Math.max(1, Math.round(section.clientHeight * ratio))

      if (nextWidth === width && nextHeight === height) return

      width = nextWidth
      height = nextHeight
      canvas.width = width
      canvas.height = height

      for (let index = 0; index < MAX; index += 1) respawn(index)

      fresh = true
    }

    // Один шаг: поле направлений — угол из шума, медленно плывущего во
    // времени; частица идёт по нему, за край или по возрасту — рождается заново.
    const step = (count: number, dt: number) => {
      const scale = 1.6 / Math.max(width, height)
      const drift = elapsed * 0.08
      const stride = 1.1 * ratio * dt

      for (let index = 0; index < count; index += 1) {
        const angle =
          snoise(xs[index] * scale, ys[index] * scale + drift) * Math.PI * 2
        const nx = xs[index] + Math.cos(angle) * stride
        const ny = ys[index] + Math.sin(angle) * stride

        ages[index] += dt

        if (
          nx < 0 ||
          ny < 0 ||
          nx > width ||
          ny > height ||
          ages[index] > 140 + hues[index] * 120
        ) {
          respawn(index)
          ages[index] = 0
          continue
        }

        xs[index] = nx
        ys[index] = ny
      }
    }

    const paint = (count: number, power: number, dt: number) => {
      // Притенение вместо очистки: прошлые следы гаснут, новые ложатся сверху.
      ink.fillStyle = rgba(palette.base, fresh ? 1 : Math.min(1, 0.06 * dt))
      ink.fillRect(0, 0, width, height)
      fresh = false

      const scale = 1.6 / Math.max(width, height)
      const drift = elapsed * 0.08
      const stride = 1.1 * ratio * dt
      const dim = mixColor(palette.low, palette.mid, 0.8)
      const bright = mixColor(palette.mid, palette.high, power)

      ink.lineWidth = ratio
      ink.lineCap = "round"

      for (let index = 0; index < count; index += 1) {
        const angle =
          snoise(xs[index] * scale, ys[index] * scale + drift) * Math.PI * 2
        const life = Math.min(1, ages[index] / 30)
        const isAccent = hues[index] > 0.75

        ink.strokeStyle = rgba(
          isAccent ? bright : dim,
          life * (0.35 + 0.65 * power) * (isAccent ? 1 : 0.6),
        )
        ink.beginPath()
        ink.moveTo(xs[index], ys[index])
        ink.lineTo(
          xs[index] + Math.cos(angle) * stride * 1.5,
          ys[index] + Math.sin(angle) * stride * 1.5,
        )
        ink.stroke()
      }
    }

    const draw = (now: number) => {
      const current = settings.current

      frame = 0

      if (document.hidden || !visible) return

      const moving = previous > 0 && !calm.matches
      const dt = moving ? Math.min(3, ((now - previous) / 16.7) * current.speed) : 1

      if (moving) elapsed += (now - previous) * 0.001 * current.speed

      previous = now

      resize()

      if (paletteDirty.current) readPalette()

      const count = Math.min(MAX, current.count)

      if (calm.matches || current.speed === 0) {
        // Покой — один кадр, но прогретый: следы уже должны быть видны.
        for (let warm = 0; warm < 40; warm += 1) {
          step(count, 1)
          paint(count, current.power, 1)
        }

        section.dataset.drawn = "true"
        previous = 0

        return
      }

      step(count, dt)
      paint(count, current.power, dt)
      section.dataset.drawn = "true"

      frame = requestAnimationFrame(draw)
    }

    const run = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const stop = () => {
      previous = 0
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    }

    const repaint = () => {
      paletteDirty.current = true
      run()
    }

    wake.current = run

    // Фон за пределами экрана и во вкладке в фоне не рисуется: он там никому
    // не виден, а батарею тратит.
    const watcher = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting)

      if (visible) run()
      else stop()
    })

    watcher.observe(section)

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (visible) run()
    }

    const sizes = new ResizeObserver(run)

    sizes.observe(section)

    // Классовая тёмная тема переключается на <html>: ловим её, чтобы
    // перечитать палитру, иначе холст останется в прошлой теме.
    const themes = new MutationObserver(repaint)

    themes.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    })

    document.addEventListener("visibilitychange", onVisibility)
    calm.addEventListener("change", run)
    scheme.addEventListener("change", repaint)
    run()

    return () => {
      stop()
      wake.current = () => {}
      watcher.disconnect()
      sizes.disconnect()
      themes.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      calm.removeEventListener("change", run)
      scheme.removeEventListener("change", repaint)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-surface-013-accent": accent } : null),
    ...(colors
      ? {
          "--vibeui-surface-013-c1": colors[0],
          "--vibeui-surface-013-c2": colors[1],
          "--vibeui-surface-013-c3": colors[2],
          "--vibeui-surface-013-c4": colors[3],
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-013" precedence="medium">
        {STYLES}
      </style>
      <section
        ref={host}
        data-vibeui-block="surface-013"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="still" aria-hidden="true" />
        <canvas ref={canvasRef} aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <Mockup010 data-part="ghost"  accent={accent} />
          )}
        </div>
      </section>
    </>
  )
}
