"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Background002Props = Omit<ComponentProps<"div">, "children"> & {
  background?: string
  primary?: string
  secondary?: string
  scatter?: number
  density?: number
  speed?: number
  scroll?: boolean
  /** Сколько плиток одновременно летит снизу и встраивается в шар. */
  arrivals?: number
}

const DEFAULTS = {
  background: "#00052e",
  primary: "#1137d8",
  secondary: "#24c7d8",
  warning: "#ffb82e",
}

const STYLES = `
:where([data-vibeui-block="background-002"]){
--vibeui-background-002-bg:#00052e;
--vibeui-background-002-primary:#1137d8;
--vibeui-background-002-secondary:#24c7d8;
--vibeui-background-002-grid:rgb(48 75 190 / 15%);
--vibeui-background-002-field:rgb(34 65 205 / 16%);
--vibeui-background-002-ink:#ffffff;
--vibeui-background-002-muted:rgb(177 191 255 / 74%);
--vibeui-background-002-panel:rgb(7 16 74 / 62%);
--vibeui-background-002-border:rgb(120 151 255 / 34%);
--vibeui-background-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="background-002"]{
position:relative;
isolation:isolate;
overflow:hidden;
width:100%;
/* Высота берётся у родителя: в карточке каталога кадр выше, чем 42rem, и
   без height синий фон обрывался, а под ним оставалась чёрная полоса. */
height:100%;
min-height:42rem;
background:
radial-gradient(circle at 50% 42%,rgb(18 48 180 / 12%) 0,transparent 35rem),
var(--vibeui-background-002-bg);
color:var(--vibeui-background-002-ink);
font-family:var(--vibeui-background-002-font);
}
[data-vibeui-block="background-002"] *{box-sizing:border-box}
[data-vibeui-block="background-002"] [data-part="field"]{
position:absolute;
inset:0;
z-index:0;
pointer-events:none;
opacity:.78;
background-image:
linear-gradient(90deg,var(--vibeui-background-002-grid) 1px,transparent 1px),
linear-gradient(180deg,var(--vibeui-background-002-grid) 1px,transparent 1px),
radial-gradient(circle at 18% 24%,var(--vibeui-background-002-field) 0 .18rem,transparent .2rem),
radial-gradient(circle at 72% 18%,var(--vibeui-background-002-field) 0 .14rem,transparent .16rem),
radial-gradient(circle at 78% 72%,var(--vibeui-background-002-field) 0 .22rem,transparent .24rem),
radial-gradient(circle at 28% 78%,var(--vibeui-background-002-field) 0 .16rem,transparent .18rem);
background-position:center,center,0 0,0 0,0 0,0 0;
background-size:4rem 4rem,4rem 4rem,7.5rem 6rem,8rem 7rem,6.5rem 8rem,9rem 6.5rem;
mask-image:radial-gradient(ellipse at 50% 48%,#000 0,transparent 78%);
}
[data-vibeui-block="background-002"] [data-part="field"]::before{
content:"";
position:absolute;
inset:-10%;
background-image:
linear-gradient(90deg,transparent 0 44%,rgb(20 48 185 / 18%) 44% 56%,transparent 56%),
linear-gradient(180deg,transparent 0 44%,rgb(20 48 185 / 16%) 44% 56%,transparent 56%);
background-size:11rem 11rem,13rem 13rem;
transform:rotate(-8deg);
mask-image:radial-gradient(ellipse at 50% 50%,#000 0,transparent 66%);
}
[data-vibeui-block="background-002"] canvas{
position:absolute;
inset:0;
z-index:1;
display:block;
width:100%;
height:100%;
}
@container (max-width: 42rem){
[data-vibeui-block="background-002"] canvas{transform:scale(1.04)}
}
`

type Particle = {
  x: number
  y: number
  z: number
  spin: number
  size: number
  depth: number
  hue: number
  seed: number
  orbit: number
}

/** Сколько живёт одно выделение: секунда — и прицел переезжает дальше. */
const MARK_LIFE = 1000

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function ease(value: number) {
  return value * value * (3 - 2 * value)
}

function hexToRgb(value: string, fallback: string) {
  const match =
    /^#?([0-9a-f]{6})$/i.exec(value.trim()) ??
    /^#?([0-9a-f]{6})$/i.exec(fallback)
  const number = Number.parseInt(match?.[1] ?? "ffffff", 16)

  return {
    red: (number >> 16) & 255,
    green: (number >> 8) & 255,
    blue: number & 255,
  }
}

function buildParticles(count: number) {
  const particles: Particle[] = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let index = 0; index < count; index += 1) {
    const t = (index + 0.5) / count
    const y = 1 - 2 * t
    const radius = Math.sqrt(1 - y * y)
    const theta = index * goldenAngle
    const seed = Math.sin(index * 91.73) * 0.5 + 0.5

    particles.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      spin: theta,
      size: mix(0.85, 3.2, seed),
      depth: mix(0.45, 1.35, Math.sin(index * 17.19) * 0.5 + 0.5),
      hue: Math.sin(index * 29.17) * 0.5 + 0.5,
      seed,
      orbit: mix(-1, 1, Math.sin(index * 53.11) * 0.5 + 0.5),
    })
  }

  return particles
}

/**
 * Место плитки в кадре. Тот же расчёт, что и в основном цикле, вынесен
 * отдельно: прилетающая снизу плитка обязана попасть ровно в своё гнездо,
 * а не «примерно туда».
 */
function project(particle: Particle, time: number, crumble: number) {
  const yaw = particle.spin + time * (0.76 + particle.orbit * 0.1)
  const pitch = -0.45 + Math.sin(time * 0.7) * 0.08
  const scatterX = Math.sin(particle.seed * 37 + time * 1.7) * crumble * 0.42
  const scatterY = Math.cos(particle.seed * 43 + time * 1.2) * crumble * 0.32
  const px = particle.x * Math.cos(yaw) - particle.z * Math.sin(yaw)
  const pz = particle.x * Math.sin(yaw) + particle.z * Math.cos(yaw)
  const py = particle.y * Math.cos(pitch) - pz * Math.sin(pitch)
  const z = particle.y * Math.sin(pitch) + pz * Math.cos(pitch)

  return {
    x: px + scatterX * (1 + particle.depth),
    y: py + scatterY * (1 + particle.depth),
    z: z + crumble * particle.depth * 0.45,
  }
}

/** Плитка, летящая снизу в свободное гнездо шара. */
type Arrival = {
  slot: number
  born: number
  life: number
  from: number
  sway: number
}

function newArrival(count: number, now: number): Arrival {
  return {
    slot: Math.floor(Math.random() * count),
    born: now,
    // Разброс по времени: одинаковая длительность превращает поток в залп.
    life: 1600 + Math.random() * 2200,
    from: (Math.random() - 0.5) * 1.8,
    sway: Math.random() * 0.4 + 0.1,
  }
}

function nearestScrollParent(element: HTMLElement) {
  let parent = element.parentElement

  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent)

    if (/(auto|scroll)/.test(`${style.overflow}${style.overflowY}`)) {
      return parent
    }

    parent = parent.parentElement
  }

  return null
}

function scrollProgress(host: HTMLElement, scrollParent: HTMLElement | null) {
  const rect = host.getBoundingClientRect()
  const viewportHeight = scrollParent
    ? scrollParent.getBoundingClientRect().height
    : window.innerHeight
  const travel = Math.max(1, rect.height * 0.78)

  return clamp((viewportHeight * 0.18 - rect.top) / travel)
}

export function Background002({
  background = DEFAULTS.background,
  primary = DEFAULTS.primary,
  secondary = DEFAULTS.secondary,
  scatter = 1,
  density = 1700,
  speed = 1,
  scroll = true,
  arrivals = 18,
  className,
  style,
  ...props
}: Background002Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const settings = useRef({
    background,
    primary,
    secondary,
    scatter,
    density,
    speed,
    scroll,
    arrivals,
  })

  useEffect(() => {
    settings.current = {
      background,
      primary,
      secondary,
      scatter,
      density,
      speed,
      scroll,
      arrivals,
    }
  })

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current

    if (!host || !canvas) return

    const context = canvas.getContext("2d", { alpha: true })
    if (!context) return

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const scrollParent = nearestScrollParent(host)
    let particles = buildParticles(
      Math.round(clamp(density / 1800, 0.25, 1) * 1800),
    )
    let width = 0
    let height = 0
    let frame = 0
    let visible = true
    let lastDensity = density
    // Выделение: ровно одна плитка за раз. Каждую секунду прицел переезжает
    // на новую — так глаз успевает заметить событие, а не тонет в мигании.
    let markIndex = 0
    let markSince = 0
    // Плитки в полёте живут вне списка шара: у них своя жизнь и свои гнёзда.
    const flying: Arrival[] = []
    let progress = settings.current.scroll
      ? scrollProgress(host, scrollParent)
      : 0
    let targetProgress = progress

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.max(1, Math.round(host.clientWidth * pixelRatio))
      const nextHeight = Math.max(1, Math.round(host.clientHeight * pixelRatio))

      if (nextWidth === width && nextHeight === height) return

      width = nextWidth
      height = nextHeight
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${host.clientWidth}px`
      canvas.style.height = `${host.clientHeight}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const request = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const onScroll = () => {
      targetProgress = settings.current.scroll
        ? scrollProgress(host, scrollParent)
        : clamp(settings.current.scatter)
      request()
    }

    const draw = (now: number) => {
      frame = 0

      if (!visible || document.hidden) return

      resize()

      const current = settings.current
      const nextDensity = Math.round(
        clamp(current.density / 1800, 0.25, 1) * 1800,
      )

      if (Math.abs(nextDensity - lastDensity) > 8) {
        particles = buildParticles(nextDensity)
        lastDensity = nextDensity
      }

      targetProgress = current.scroll
        ? scrollProgress(host, scrollParent)
        : clamp(current.scatter)
      progress = motion.matches
        ? targetProgress
        : mix(progress, targetProgress, 0.11)

      const cssWidth = host.clientWidth
      const cssHeight = host.clientHeight
      const primaryRgb = hexToRgb(current.primary, DEFAULTS.primary)
      const secondaryRgb = hexToRgb(current.secondary, DEFAULTS.secondary)
      const warningRgb = hexToRgb(DEFAULTS.warning, DEFAULTS.warning)
      const time = motion.matches
        ? 0
        : now * 0.00017 * clamp(current.speed, 0.2, 2.2)
      const crumble = ease(clamp(progress * current.scatter))

      if (now - markSince >= MARK_LIFE) {
        markIndex = Math.floor(Math.random() * particles.length)
        markSince = now
      }

      const markAge = clamp((now - markSince) / MARK_LIFE)
      // Появление и уход быстрые, середина — ровное жёлтое пятно: плитка
      // «горит» секунду, а не пульсирует.
      const markGlow = clamp(Math.min(markAge * 8, (1 - markAge) * 8))
      const centerX = cssWidth * 0.5
      const centerY = cssHeight * (cssWidth < 680 ? 0.52 : 0.5)
      const baseRadius =
        Math.min(cssWidth, cssHeight) * (cssWidth < 680 ? 0.57 : 0.72)
      const scale = baseRadius * mix(1, 1.34, crumble)

      context.clearRect(0, 0, cssWidth, cssHeight)
      context.globalCompositeOperation = "lighter"

      const sorted = particles
        .map((particle) => {
          const yaw = particle.spin + time * (0.76 + particle.orbit * 0.1)
          const pitch = -0.45 + Math.sin(time * 0.7) * 0.08
          const scatterX =
            Math.sin(particle.seed * 37 + time * 1.7) * crumble * 0.42
          const scatterY =
            Math.cos(particle.seed * 43 + time * 1.2) * crumble * 0.32
          const px = particle.x * Math.cos(yaw) - particle.z * Math.sin(yaw)
          const pz = particle.x * Math.sin(yaw) + particle.z * Math.cos(yaw)
          const py = particle.y * Math.cos(pitch) - pz * Math.sin(pitch)
          const z = particle.y * Math.sin(pitch) + pz * Math.cos(pitch)

          return {
            particle,
            x: px + scatterX * (1 + particle.depth),
            y: py + scatterY * (1 + particle.depth),
            z: z + crumble * particle.depth * 0.45,
          }
        })
        .sort((a, b) => a.z - b.z)

      for (const item of sorted) {
        const { particle } = item
        const perspective = 1 / (1.55 - item.z * 0.36)
        const edge = clamp(1 - Math.hypot(item.x, item.y) * 0.48)
        const alpha =
          clamp((item.z + 1.08) * 0.58) * edge * mix(0.98, 0.34, crumble)

        if (alpha < 0.018) continue

        const x = centerX + item.x * scale * perspective
        const y = centerY + item.y * scale * perspective
        const tileSize =
          particle.size * mix(3.2, 5.4, particle.seed) * perspective
        const targetStrength =
          particles[markIndex] === particle ? markGlow : 0
        const colorMix = particle.hue > 0.94 ? 1 : clamp(item.z * 0.12)
        const baseRed = mix(primaryRgb.red, secondaryRgb.red, colorMix)
        const baseGreen = mix(primaryRgb.green, secondaryRgb.green, colorMix)
        const baseBlue = mix(primaryRgb.blue, secondaryRgb.blue, colorMix)
        const red = Math.round(baseRed)
        const green = Math.round(baseGreen)
        const blue = Math.round(baseBlue)

        // Глубина резкости: у самого силуэта и на дальней стороне плитка
        // теряет грань. Вместо фильтра — три прямоугольника с растущим
        // размером и падающей прозрачностью: фильтр на каждой из полутора
        // тысяч плиток стоил бы кадров, а картинка та же.
        const rim = clamp(Math.hypot(item.x, item.y) * 0.94)
        const soft = clamp(Math.pow(rim, 2.6) * 0.85 + clamp(-item.z * 0.5) * 0.3)

        context.save()
        context.translate(x, y)
        context.rotate((particle.spin % 0.18) + time * 0.06)

        if (soft > 0.04 && targetStrength < 0.02) {
          const halo = tileSize * (1 + soft * 0.9)
          const wide = tileSize * (1 + soft * 1.9)

          context.fillStyle = `rgb(${red} ${green} ${blue} / ${alpha * soft * 0.16})`
          context.fillRect(-wide * 0.5, -wide * 0.5, wide, wide)
          context.fillStyle = `rgb(${red} ${green} ${blue} / ${alpha * soft * 0.28})`
          context.fillRect(-halo * 0.5, -halo * 0.5, halo, halo)
        }

        if (targetStrength < 0.02) {
          context.fillStyle = `rgb(${red} ${green} ${blue} / ${alpha * mix(1, 0.55, soft)})`
          context.fillRect(-tileSize * 0.5, -tileSize * 0.5, tileSize, tileSize)
        }
        // Выделение: плитка желтеет, но не растёт — прыжок размера читался
        // бы как ошибка отрисовки. Рисуется она поверх, а не в additive-режиме:
        // жёлтый, сложенный со свечением шара, выцветает в белый.
        if (targetStrength > 0.02) {
          const targetAlpha = clamp(0.35 + 0.65 * targetStrength)
          const gap = tileSize * 0.95
          const arm = tileSize * 0.42

          context.globalCompositeOperation = "source-over"
          context.fillStyle = `rgb(${warningRgb.red} ${warningRgb.green} ${warningRgb.blue} / ${targetAlpha})`
          context.fillRect(-tileSize * 0.5, -tileSize * 0.5, tileSize, tileSize)
          context.globalAlpha = targetStrength
          context.strokeStyle = `rgb(${secondaryRgb.red} ${secondaryRgb.green} ${secondaryRgb.blue})`
          context.lineWidth = Math.max(1, tileSize * 0.07)
          context.beginPath()
          context.moveTo(-gap, -gap + arm)
          context.lineTo(-gap, -gap)
          context.lineTo(-gap + arm, -gap)
          context.moveTo(gap - arm, -gap)
          context.lineTo(gap, -gap)
          context.lineTo(gap, -gap + arm)
          context.moveTo(gap, gap - arm)
          context.lineTo(gap, gap)
          context.lineTo(gap - arm, gap)
          context.moveTo(-gap + arm, gap)
          context.lineTo(-gap, gap)
          context.lineTo(-gap, gap - arm)
          context.stroke()
          context.globalAlpha = 1
          context.globalCompositeOperation = "lighter"
        }
        context.restore()
      }

      // Поток снизу: плитки поднимаются из-за нижней кромки кадра и
      // встраиваются в шар. Гнездо у каждой своё, поэтому в конце пути
      // плитка садится ровно на место, а не растворяется рядом.
      const wanted = Math.round(clamp(current.arrivals ?? 18, 0, 40))

      while (flying.length > wanted) flying.pop()
      while (flying.length < wanted) {
        flying.push(newArrival(particles.length, now - Math.random() * 2600))
      }

      for (let index = 0; index < flying.length; index += 1) {
        const arrival = flying[index]
        const life = motion.matches ? arrival.life : arrival.life / clamp(current.speed, 0.2, 2.2)
        let phase = (now - arrival.born) / life

        if (phase >= 1) {
          flying[index] = newArrival(particles.length, now)
          phase = 0
        }

        const particle = particles[arrival.slot % particles.length]
        const seat = project(particle, time, crumble)
        const perspective = 1 / (1.55 - seat.z * 0.36)
        const seatX = centerX + seat.x * scale * perspective
        const seatY = centerY + seat.y * scale * perspective
        const tileSize = particle.size * mix(3.2, 5.4, particle.seed) * perspective

        // Полёт: быстрый старт снизу и мягкая посадка. Кубическая кривая
        // даёт ту самую «вставку» — плитка приходит и замирает.
        const path = 1 - Math.pow(1 - phase, 3)
        const startX = centerX + arrival.from * scale
        const startY = cssHeight + tileSize * 4
        const swayX = Math.sin(phase * Math.PI * 1.4 + arrival.slot) * arrival.sway * scale * (1 - path)
        const x = mix(startX, seatX, path) + swayX
        const y = mix(startY, seatY, path)
        const appear = clamp(phase * 6)
        // Размер только уменьшается к посадке: подскок в конце читался бы
        // как мигание, а не как встраивание.
        const size = tileSize * mix(1.35, 1, ease(path))
        const alpha = appear * mix(0.85, 1, path)

        context.save()
        context.translate(x, y)
        context.rotate(mix(0.7, particle.spin % 0.18, path))
        // След: три ослабевающие копии позади — иначе плитка читается как
        // моргнувшая точка, а не как летящая.
        for (let ghost = 3; ghost > 0; ghost -= 1) {
          const back = ghost * mix(26, 4, path)
          const ghostAlpha = alpha * 0.13 * (1 - ghost / 4) * (1 - path * 0.6)

          context.fillStyle = `rgb(${secondaryRgb.red} ${secondaryRgb.green} ${secondaryRgb.blue} / ${ghostAlpha})`
          context.fillRect(-size * 0.4, back - size * 0.4, size * 0.8, size * 0.8)
        }

        context.fillStyle = `rgb(${secondaryRgb.red} ${secondaryRgb.green} ${secondaryRgb.blue} / ${alpha})`
        context.fillRect(-size * 0.5, -size * 0.5, size, size)

        context.restore()
      }

      context.globalCompositeOperation = "source-over"

      host.dataset.drawn = "true"

      if (
        !motion.matches &&
        (Math.abs(progress - targetProgress) > 0.002 || visible)
      ) {
        frame = requestAnimationFrame(draw)
      }
    }

    const watcher = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting)
      if (visible) request()
      else if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    })

    watcher.observe(host)
    const sizes = new ResizeObserver(request)
    sizes.observe(host)
    const scrollTarget = scrollParent ?? window
    scrollTarget.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    document.addEventListener("visibilitychange", request)
    motion.addEventListener("change", request)
    request()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      watcher.disconnect()
      sizes.disconnect()
      scrollTarget.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      document.removeEventListener("visibilitychange", request)
      motion.removeEventListener("change", request)
    }
  }, [density])

  const palette = {
    "--vibeui-background-002-bg": background,
    "--vibeui-background-002-primary": primary,
    "--vibeui-background-002-secondary": secondary,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-background-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-vibeui-block="background-002"
        data-slot="particle-sphere-background"
        className={className}
        style={palette}
      >
        <div data-part="field" aria-hidden="true" />
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    </>
  )
}
