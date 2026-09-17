"use client"

import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

export type Sketch018Doodle =
  | "film"
  | "frame"
  | "coffee"
  | "clock"
  | "glasses"
  | "lens"
  | "heart"
  | "chat"
  | "coin"
  | "tag"
  | "phone"
  | "calendar"
  | "star"
  | "camera"

export type Sketch018Props = {
  /** Секции страницы: каждый прямой потомок становится «листом». */
  children?: ReactNode
  /**
   * Доодлы на полях: по паре на лист — левый у узла нитки, правый зеркально.
   * Рисуются, когда нитка доходит до листа.
   */
  doodles?: readonly (readonly [Sketch018Doodle, Sketch018Doodle?])[]
  /** Нитка карандашом вдоль края, которая дорисовывается по мере прокрутки. */
  thread?: boolean
  /** Подписи к узлам нитки — по одной на лист, рукописные. */
  labels?: readonly string[]
  /** Почерк: аккуратный или размашистый. */
  rough?: "neat" | "loose"
  /** Дрожание линии: покой, мягкое или живое. */
  boil?: "still" | "soft" | "lively"
  /** Зерно почерка: одно число — один и тот же рисунок. */
  seed?: number
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Цвет нитки. По умолчанию — цвет текста. */
  accent?: string
  /** Цвет текста подписей. */
  ink?: string
  className?: string
  style?: CSSProperties
}

// Прокрутка как стопка листов: каждая секция въезжает снизу под небольшим
// наклоном и ложится ровно, будто её положили на стол; вдоль края идёт
// карандашная нитка, которая дорисовывается по мере прокрутки и завязывает
// узел у каждого листа. Сами секции — любые: блок ничего в них не меняет.
const FONTS = "https://fonts.googleapis.com/css2?family=Neucha&family=Caveat:wght@400..700&display=swap"

type Point = [number, number]

function random(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function sketch(points: Point[], seed: number, rough: number, boil: number) {
  const base = random(seed)
  const shake = (amount: number, next: () => number) => (next() - 0.5) * 2 * amount
  const anchors = points.map(([x, y]) => [x + shake(rough, base), y + shake(rough, base)] as Point)

  return [0, 1, 2].map((frame) => {
    const next = random(seed + 7919 * (frame + 1))
    const pts = frame === 0 ? anchors : anchors.map(([x, y]) => [x + shake(boil, next), y + shake(boil, next)] as Point)
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`

    for (let index = 1; index < pts.length; index += 1) {
      const [x0, y0] = pts[index - 1]
      const [x1, y1] = pts[index]
      const cx = (x0 + x1) / 2 + shake(rough * 0.8, next)
      const cy = (y0 + y1) / 2 + shake(rough * 0.8, next)

      d += `Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`
    }

    return d
  })
}

function circlePoints(cx: number, cy: number, r: number, count = 16): Point[] {
  return Array.from({ length: count + 2 }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2

    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as Point
  })
}

function arcPoints(cx: number, cy: number, r: number, from: number, to: number, count = 8): Point[] {
  return Array.from({ length: count + 1 }, (_, index) => {
    const angle = from + ((to - from) * index) / count

    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as Point
  })
}

/** Значки в коробке 48×48: каждый — несколько штрихов, как в блокноте. */
const DOODLES: Record<Sketch018Doodle, Point[][]> = {
  film: [circlePoints(24, 24, 18), circlePoints(24, 24, 7, 10), [[24, 6], [24, 12]], [[42, 24], [36, 24]], [[24, 42], [24, 36]], [[6, 24], [12, 24]]],
  frame: [[[8, 12], [40, 12], [40, 36], [8, 36], [8, 12]], [[14, 18], [34, 18], [34, 30], [14, 30], [14, 18]], [[8, 12], [14, 18]], [[40, 36], [34, 30]]],
  coffee: [[[10, 18], [12, 38], [30, 38], [32, 18], [10, 18]], arcPoints(35, 27, 6, -Math.PI / 2, Math.PI / 2, 6), [[16, 12], [18, 8], [16, 4]], [[24, 12], [26, 8], [24, 4]]],
  clock: [circlePoints(24, 24, 18), [[24, 24], [24, 12]], [[24, 24], [33, 28]], [[24, 6], [24, 9]]],
  glasses: [circlePoints(14, 26, 8, 12), circlePoints(34, 26, 8, 12), [[22, 25], [26, 25]], [[6, 24], [3, 18]], [[42, 24], [45, 18]]],
  lens: [circlePoints(24, 24, 18), circlePoints(24, 24, 10, 12), [[24, 14], [30, 24]], [[30, 24], [24, 34]], [[24, 34], [18, 24]], [[18, 24], [24, 14]]],
  heart: [[[24, 40], [8, 24], ...arcPoints(15, 17, 8, Math.PI, 0, 6), ...arcPoints(33, 17, 8, Math.PI, 0, 6), [40, 24], [24, 40]]],
  chat: [[[8, 10], [40, 10], [40, 30], [22, 30], [14, 38], [15, 30], [8, 30], [8, 10]], [[15, 18], [33, 18]], [[15, 23], [28, 23]]],
  coin: [circlePoints(24, 24, 18), circlePoints(24, 24, 13, 12), [[20, 16], [20, 32]], [[20, 16], [27, 16], [28, 22], [20, 24]], [[17, 28], [26, 28]]],
  tag: [[[8, 8], [28, 8], [42, 22], [26, 40], [8, 22], [8, 8]], circlePoints(16, 16, 3, 8), [[26, 40], [8, 22]]],
  phone: [[[10, 8], [18, 6], [22, 16], [17, 20], [26, 32], [31, 28], [42, 32], [40, 40], [30, 42], ...arcPoints(30, 18, 24, Math.PI * 0.75, Math.PI * 1.25, 6)]],
  calendar: [[[8, 12], [40, 12], [40, 40], [8, 40], [8, 12]], [[8, 20], [40, 20]], [[16, 6], [16, 16]], [[32, 6], [32, 16]], [[14, 27], [18, 27]], [[22, 27], [26, 27]], [[30, 27], [34, 27]], [[14, 34], [18, 34]]],
  star: [[[24, 5], [29, 19], [44, 19], [32, 28], [37, 43], [24, 34], [11, 43], [16, 28], [4, 19], [19, 19], [24, 5]]],
  camera: [[[6, 16], [16, 16], [19, 10], [29, 10], [32, 16], [42, 16], [42, 40], [6, 40], [6, 16]], circlePoints(24, 28, 8, 12), circlePoints(24, 28, 3, 8), [[35, 21], [39, 21]]],
}

/** Один доодл: штрихи тремя кадрами boil, дорисовка по data-reached. */
function Doodle({ name, seed, rough, boil, reached, side }: { name: Sketch018Doodle; seed: number; rough: number; boil: number; reached: boolean; side: "left" | "right" }) {
  const strokes = DOODLES[name] ?? DOODLES.star

  return (
    <svg data-part="doodle" data-side={side} data-reached={reached ? "" : undefined} viewBox="0 0 48 48" aria-hidden="true">
      {strokes.map((points, index) =>
        sketch(points, seed + index * 31, rough * 0.55, boil * 0.6).map((d, frame) => (
          <path key={`${index}-${frame}`} d={d} pathLength={1} data-i={frame} style={{ ["--vibeui-sketch-018-k" as string]: index }} />
        )),
      )}
    </svg>
  )
}

const ROUGH = { neat: 0.8, loose: 1.8 } as const
const BOIL = { still: 0, soft: 0.7, lively: 1.4 } as const

/** Один лист: въезжает, когда доезжает до экрана, и больше не дёргается. */
function Sheet({ index, tilt, children }: { index: number; tilt: number; children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = host.current

    if (!element) return

    // Первый лист виден сразу: он и так на экране при загрузке.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.6) {
      setShown(true)

      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.02 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={host}
      data-part="sheet"
      data-shown={shown ? "" : undefined}
      data-n={index}
      style={{ ["--vibeui-sketch-018-tilt" as string]: `${tilt.toFixed(2)}deg` }}
    >
      {children}
    </div>
  )
}

const STYLES = `
:where([data-vibeui-block="sketch-018"]){
--vibeui-sketch-018-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-018-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1c1a18));
--vibeui-sketch-018-accent:var(--vibeui-sketch-018-ink);
--vibeui-sketch-018-width:2;
--vibeui-sketch-018-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-018-frame:0;
--vibeui-sketch-018-progress:0;
--vibeui-sketch-018-rail:0px;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-018"]{color-scheme:dark}
:where([data-vibeui-block="sketch-018"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-018"][data-tone="dark"]){color-scheme:dark}
/* overflow-x:clip: наклонённый лист во всю ширину высовывает углы за край, и
   без clip у страницы появляется горизонтальная прокрутка. */
[data-vibeui-block="sketch-018"]{position:relative;display:block;box-sizing:border-box;padding-left:var(--vibeui-sketch-018-rail);padding-right:var(--vibeui-sketch-018-rail-right,0px);overflow-x:clip}
[data-vibeui-block="sketch-018"] *{box-sizing:border-box}
[data-vibeui-block="sketch-018"] [data-part="sheet"]{position:relative;transform:translateY(64px) rotate(var(--vibeui-sketch-018-tilt)) scale(.985);opacity:0;transform-origin:50% 100%;transition:transform .9s cubic-bezier(.2,.8,.2,1),opacity .6s ease;will-change:transform,opacity}
[data-vibeui-block="sketch-018"] [data-part="sheet"][data-shown]{transform:none;opacity:1}
/* Нитка: вертикальная линия слева, три кадра boil; длина рисуется от
   progress (pathLength=1), узлы вспыхивают, когда нитка до них доходит. */
[data-vibeui-block="sketch-018"] [data-part="thread"]{position:absolute;top:0;bottom:0;left:0;width:var(--vibeui-sketch-018-rail);pointer-events:none;overflow:visible}
[data-vibeui-block="sketch-018"] [data-part="thread"] svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
[data-vibeui-block="sketch-018"] [data-part="thread"] path{fill:none;stroke:var(--vibeui-sketch-018-accent);stroke-width:var(--vibeui-sketch-018-width);stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--vibeui-sketch-018-progress));opacity:clamp(0,1 - (var(--vibeui-sketch-018-frame) - var(--vibeui-sketch-018-i)) * (var(--vibeui-sketch-018-frame) - var(--vibeui-sketch-018-i)),1)}
[data-vibeui-block="sketch-018"] [data-part="thread"] path[data-i="0"]{--vibeui-sketch-018-i:0}
[data-vibeui-block="sketch-018"] [data-part="thread"] path[data-i="1"]{--vibeui-sketch-018-i:1}
[data-vibeui-block="sketch-018"] [data-part="thread"] path[data-i="2"]{--vibeui-sketch-018-i:2}
@property --vibeui-sketch-018-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-018"][data-boil] [data-part="thread"] svg{animation:vibeui-sketch-018-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-018-boil{0%{--vibeui-sketch-018-frame:0}33.33%{--vibeui-sketch-018-frame:1}66.67%{--vibeui-sketch-018-frame:2}}
[data-vibeui-block="sketch-018"] [data-part="knot"]{position:absolute;left:calc(var(--vibeui-sketch-018-rail) / 2);transform:translate(-50%,-50%) scale(0);width:.9rem;height:.9rem;border-radius:50% 45% 55% 40%;background:var(--vibeui-sketch-018-accent);transition:transform .4s cubic-bezier(.3,1.4,.4,1)}
[data-vibeui-block="sketch-018"] [data-part="knot"][data-reached]{transform:translate(-50%,-50%) scale(1)}
[data-vibeui-block="sketch-018"] [data-part="label"]{position:absolute;left:calc(var(--vibeui-sketch-018-rail) / 2 - 1.6rem);margin-top:1rem;writing-mode:vertical-rl;transform:rotate(180deg);transform-origin:50% 50%;white-space:nowrap;line-height:1;font-family:var(--vibeui-sketch-018-display);font-size:1.1rem;color:var(--vibeui-sketch-018-muted);opacity:0;transition:opacity .5s .2s}
[data-vibeui-block="sketch-018"] [data-part="label"][data-reached]{opacity:1}
/* Доодлы на полях: слева у узла (чуть ниже), справа зеркально на правой
   рейке. Штрихи дорисовываются по очереди, когда нитка доходит до листа. */
[data-vibeui-block="sketch-018"] [data-part="margin"]{position:absolute;top:0;bottom:0;pointer-events:none}
[data-vibeui-block="sketch-018"] [data-part="margin"][data-side="left"]{left:0;width:var(--vibeui-sketch-018-rail)}
[data-vibeui-block="sketch-018"] [data-part="margin"][data-side="right"]{right:0;width:var(--vibeui-sketch-018-rail-right,0px)}
[data-vibeui-block="sketch-018"] [data-part="doodle"]{position:absolute;left:50%;width:2.9rem;height:2.9rem;overflow:visible;transform:translate(-50%,0) rotate(var(--vibeui-sketch-018-spin,-6deg));opacity:.85}
[data-vibeui-block="sketch-018"] [data-part="doodle"][data-side="left"]{margin-top:7rem}
[data-vibeui-block="sketch-018"] [data-part="doodle"][data-side="right"]{margin-top:10rem;--vibeui-sketch-018-spin:7deg}
[data-vibeui-block="sketch-018"] [data-part="doodle"] path{fill:none;stroke:var(--vibeui-sketch-018-accent);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .5s cubic-bezier(.4,0,.2,1);transition-delay:calc(var(--vibeui-sketch-018-k) * 120ms);opacity:clamp(0,1 - (var(--vibeui-sketch-018-frame) - var(--vibeui-sketch-018-i)) * (var(--vibeui-sketch-018-frame) - var(--vibeui-sketch-018-i)),1)}
[data-vibeui-block="sketch-018"] [data-part="doodle"] path[data-i="0"]{--vibeui-sketch-018-i:0}
[data-vibeui-block="sketch-018"] [data-part="doodle"] path[data-i="1"]{--vibeui-sketch-018-i:1}
[data-vibeui-block="sketch-018"] [data-part="doodle"] path[data-i="2"]{--vibeui-sketch-018-i:2}
[data-vibeui-block="sketch-018"] [data-part="doodle"][data-reached] path{stroke-dashoffset:0}
[data-vibeui-block="sketch-018"][data-boil] [data-part="doodle"]{animation:vibeui-sketch-018-boil 1.2s step-end infinite}
/* Рейки — по ширине окна, не контейнера: container query не применяется к
   самому контейнеру, а рейка живёт на корне блока. */
@media (min-width: 64rem){
[data-vibeui-block="sketch-018"][data-thread]{--vibeui-sketch-018-rail:4.5rem}
[data-vibeui-block="sketch-018"][data-doodles]{--vibeui-sketch-018-rail:4.5rem;--vibeui-sketch-018-rail-right:4.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-018"] *{transition:none!important;animation:none!important}[data-vibeui-block="sketch-018"] [data-part="sheet"]{transform:none;opacity:1}[data-vibeui-block="sketch-018"] [data-part="thread"] path,[data-vibeui-block="sketch-018"] [data-part="doodle"] path{stroke-dashoffset:0}}`

/** Демо-секции для превью: показываются, когда блок вставлен без своих. */
const DEMO_SHEETS = [
  { title: "Работы", text: "Живые кадры со съёмок: свет, эмоции, детали." },
  { title: "Как проходит съёмка", text: "От заявки до готовой галереи — шаг за шагом." },
  { title: "Обо мне", text: "Пара слов о подходе и любимых историях." },
].map((sheet) => (
  <section key={sheet.title} style={{ padding: "1.25rem 0" }}>
    <h3
      style={{
        margin: 0,
        fontFamily: "var(--vibeui-sketch-018-display)",
        fontSize: "2.25rem",
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {sheet.title}
    </h3>
    <p
      style={{
        margin: "0.6rem 0 0",
        maxWidth: "42ch",
        color: "var(--vibeui-sketch-018-muted)",
      }}
    >
      {sheet.text}
    </p>
    <div
      aria-hidden="true"
      style={{
        marginTop: "1.1rem",
        height: 160,
        borderRadius: 14,
        background: "var(--vibeui-sketch-018-muted)",
        opacity: 0.14,
      }}
    />
  </section>
))

/** Стопка листов: секции въезжают на стол, нитка карандашом тянется по краю. */
export function Sketch018({
  children,
  thread = true,
  doodles = [],
  labels = [],
  rough = "loose",
  boil = "soft",
  seed = 7,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch018Props) {
  const host = useRef<HTMLDivElement>(null)
  const roughness = ROUGH[rough] ?? ROUGH.loose
  const shake = BOIL[boil] ?? BOIL.soft
  // Без своих секций блок показывает демо-листы — иначе он пуст (это обёртка
  // прокрутки, содержимое приносит пользователь). Как только появятся дети,
  // демо исчезает.
  const provided = Children.toArray(children)
  const sheets = provided.length > 0 ? provided : DEMO_SHEETS
  const [height, setHeight] = useState(0)
  const [progress, setProgress] = useState(0)
  const [knots, setKnots] = useState<number[]>([])
  const tilts = (() => {
    const next = random(seed)

    return sheets.map((_, index) => (index % 2 === 0 ? -1 : 1) * (0.8 + next() * 1.2))
  })()

  // Прогресс нитки — доля блока, которую уже прокрутили мимо середины экрана.
  // Считается на rAF: слушатель скролла только ставит флаг.
  useEffect(() => {
    const element = host.current

    if (!element || (!thread && doodles.length === 0)) return

    let raf = 0
    const measure = () => {
      raf = 0
      const rect = element.getBoundingClientRect()
      const middle = window.innerHeight * 0.55
      const value = Math.min(1, Math.max(0, (middle - rect.top) / rect.height))

      setHeight(rect.height)
      setProgress(value)
      setKnots(
        Array.from(element.querySelectorAll<HTMLElement>('[data-part="sheet"]')).map(
          (sheet) => (sheet.offsetTop + 8) / rect.height,
        ),
      )
    }
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    const observer = new ResizeObserver(schedule)
    observer.observe(element)

    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      observer.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [thread, doodles.length, sheets.length])

  const rail = 72
  const count = Math.max(2, Math.round(height / 40))
  const line =
    height > 0
      ? sketch(
          Array.from({ length: count }, (_, index) => [rail / 2, (index / (count - 1)) * height] as Point),
          seed + 3,
          roughness * 1.6,
          shake,
        )
      : []

  const palette = {
    ...(accent ? { "--vibeui-sketch-018-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-018-ink": ink } : null),
    ["--vibeui-sketch-018-progress" as string]: progress.toFixed(4),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-018" precedence="medium">
        {STYLES}
      </style>
      <div
        ref={host}
        data-vibeui-block="sketch-018"
        data-tone={tone === "auto" ? undefined : tone}
        data-boil={shake > 0 ? "" : undefined}
        data-thread={thread ? "" : undefined}
        data-doodles={doodles.length > 0 ? "" : undefined}
        className={className}
        style={palette}
      >
        {thread && height > 0 ? (
          <div data-part="thread" aria-hidden="true">
            <svg viewBox={`0 0 ${rail} ${height}`} preserveAspectRatio="none">
              {line.map((d, frame) => (
                <path key={frame} d={d} pathLength={1} data-i={frame} />
              ))}
            </svg>
            {knots.map((at, index) => (
              <span key={index}>
                <span data-part="knot" data-reached={progress >= at ? "" : undefined} style={{ top: `${at * 100}%` }} />
                {labels[index] ? (
                  <span data-part="label" data-reached={progress >= at ? "" : undefined} style={{ top: `${at * 100}%` }}>
                    {labels[index]}
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        ) : null}
        {doodles.length > 0 && height > 0
          ? (["left", "right"] as const).map((side) => (
              <div key={side} data-part="margin" data-side={side} aria-hidden="true">
                {knots.map((at, index) => {
                  const name = doodles[index]?.[side === "left" ? 0 : 1]

                  return name ? (
                    <div key={index} style={{ position: "absolute", top: `${at * 100}%`, left: 0, right: 0 }}>
                      <Doodle name={name} seed={seed + 500 + index * 7 + (side === "right" ? 3 : 0)} rough={roughness} boil={shake} reached={progress >= at} side={side} />
                    </div>
                  ) : null
                })}
              </div>
            ))
          : null}
        {sheets.map((sheet, index) => (
          <Sheet key={index} index={index} tilt={tilts[index] ?? 0}>
            {sheet}
          </Sheet>
        ))}
      </div>
    </>
  )
}
