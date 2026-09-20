"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { FullScreenQuad } from "three/addons/postprocessing/Pass.js"
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js"

export type Folio002Site = {
  /** Название — подпись в списке и на коконе. */
  title: string
  /** Ссылка; без неё кокон только раскрывается. */
  url?: string
  /** Описание в раскрытой карточке. */
  description?: string
  /** Подпись рядом с описанием: жанр, роль, дата. */
  note?: string
}

export type Folio002Palette = "moonlight" | "nightshade" | "ember" | "absinthe" | "aurora" | "vapor" | "gilded" | "crimson" | "sakura" | "silver"

export type Folio002Props = {
  /** Заголовок в левом верхнем углу. */
  title?: string
  /** Подпись под заголовком. */
  subtitle?: string
  /** Заголовок списка «пойманных». */
  caption?: string
  /** Работы: висят коконами в паутине и перечислены слева. */
  sites?: readonly Folio002Site[]
  /** Палитра света: ключевой, контровой, пыль, дымка. */
  palette?: Folio002Palette
  /** Сила ветра, 0 — штиль. */
  wind?: number
  /** Число мух, 0 — без них. */
  flies?: number
  /** Зерно случайности паутины; смена — новая паутина. */
  seed?: number
  /** Камера мышью: drag — вращение, колесо с Ctrl или на весь экран — зум; off — статичный ракурс. */
  orbit?: boolean
  className?: string
  style?: CSSProperties
}

// «Паутина»: портфолио как сайт-паутина. Сцена на three.js — процедурная
// орбитальная паутина из нитей с верлет-физикой (пружины по типам нитей,
// провисание, ветер, обрывы), капли росы, пыль и дымка, пост-обработка:
// bloom, лучи от луны, анаморфные блики, halation, хроматика, цветокоррекция,
// зерно, виньетка. Работы висят коконами на нитях и перечислены слева —
// наведение подсвечивает кокон, клик раскрывает карточку. Курсор тянет
// нити, сильный рывок рвёт, «Respin» плетёт заново. Мухи летают, садятся,
// попадаются и вырываются. Единственный блок каталога с npm-зависимостью
// (three): без неё такого света и глубины не получить.
const STYLES = `
:where([data-vibeui-block="folio-002"]){
--vibeui-folio-002-bg:#050306;
--vibeui-folio-002-fg:#f2eef3;
--vibeui-folio-002-muted:#8a8290;
--vibeui-folio-002-accent:#9fbaf5;
--vibeui-folio-002-font:"Manrope",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="folio-002"]{position:relative;display:block;width:100%;height:min(44rem,100dvh);min-height:24rem;overflow:hidden;border-radius:0.75rem;background:var(--vibeui-folio-002-bg);color:var(--vibeui-folio-002-fg);font:400 0.875rem/1.5 var(--vibeui-folio-002-font);color-scheme:dark;user-select:none;isolation:isolate}
[data-vibeui-block="folio-002"] *{box-sizing:border-box}
[data-vibeui-block="folio-002"] canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:default}
[data-vibeui-block="folio-002"] [data-part="fallback"]{position:absolute;inset:0;display:grid;place-items:center;color:var(--vibeui-folio-002-muted);background:radial-gradient(60% 50% at 50% 50%,#1a1220,#050306)}
/* Панель слева: заголовок, «Respin», список пойманных. */
[data-vibeui-block="folio-002"] [data-part="panel"]{position:absolute;left:2rem;top:1.75rem;z-index:2;display:flex;flex-direction:column;gap:0.35rem;max-width:min(20rem,60%);pointer-events:none}
[data-vibeui-block="folio-002"] [data-part="panel"] > *{pointer-events:auto}
[data-vibeui-block="folio-002"] h2{margin:0;font-size:1.125rem;font-weight:600;letter-spacing:-0.01em;line-height:1.2}
[data-vibeui-block="folio-002"] [data-part="subtitle"]{margin:0 0 0.9rem;color:var(--vibeui-folio-002-muted);font-size:0.8125rem}
[data-vibeui-block="folio-002"] [data-part="respin"]{display:inline-flex;align-items:center;gap:0.5rem;align-self:flex-start;padding:0.2rem 0;border:0;background:none;color:var(--vibeui-folio-002-accent);font:600 0.6875rem/1 var(--vibeui-folio-002-font);letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;opacity:0.85;transition:opacity 0.2s}
[data-vibeui-block="folio-002"] [data-part="respin"]:hover{opacity:1}
[data-vibeui-block="folio-002"] [data-part="respin"] svg{width:0.85rem;height:0.85rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:transform 0.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="folio-002"] [data-part="respin"]:hover svg{transform:rotate(-180deg)}
[data-vibeui-block="folio-002"] [data-part="caption"]{margin:1.6rem 0 0.35rem;color:var(--vibeui-folio-002-muted);font-size:0.6875rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="folio-002"] ol{margin:0;padding:0 0 0 0.55rem;list-style:none;border-left:1px solid color-mix(in oklab,var(--vibeui-folio-002-fg) 14%,transparent)}
[data-vibeui-block="folio-002"] li{position:relative}
[data-vibeui-block="folio-002"] li::before{content:"";position:absolute;left:-0.7rem;top:50%;width:5px;height:5px;border-radius:50%;background:var(--vibeui-folio-002-muted);transform:translateY(-50%);transition:background 0.2s,box-shadow 0.2s}
[data-vibeui-block="folio-002"] li[data-focus]::before{background:var(--vibeui-folio-002-accent);box-shadow:0 0 8px var(--vibeui-folio-002-accent)}
[data-vibeui-block="folio-002"] li button{display:flex;align-items:baseline;gap:0.75rem;width:100%;padding:0.3rem 0.5rem;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;border-radius:0.35rem;transition:color 0.2s}
[data-vibeui-block="folio-002"] li button small{color:var(--vibeui-folio-002-muted);font-size:0.6875rem;letter-spacing:0.08em}
[data-vibeui-block="folio-002"] li button span{font-size:0.9375rem;font-weight:500}
[data-vibeui-block="folio-002"] li[data-focus] button{color:#fff}
/* Карточка раскрытого кокона: у кокона, следует за ним. */
[data-vibeui-block="folio-002"] [data-part="card"]{position:absolute;z-index:3;width:min(18rem,70%);padding:0.9rem 1rem 1rem;border:1px solid color-mix(in oklab,var(--vibeui-folio-002-accent) 35%,transparent);border-radius:0.6rem;background:color-mix(in oklab,var(--vibeui-folio-002-bg) 82%,transparent);backdrop-filter:blur(10px);box-shadow:0 12px 40px rgb(0 0 0 / .5),0 0 0 1px rgb(255 255 255 / .04) inset;transform:translate(-50%,0.9rem);animation:vibeui-folio-002-card 0.35s cubic-bezier(.2,.8,.2,1) both}
@keyframes vibeui-folio-002-card{from{opacity:0}}
[data-vibeui-block="folio-002"] [data-part="card"][data-flip]{transform:translate(-50%,calc(-100% - 1.2rem))}
[data-vibeui-block="folio-002"] [data-part="card"] h3{margin:0 0 0.2rem;font-size:1rem;font-weight:600}
[data-vibeui-block="folio-002"] [data-part="card"] small{display:block;margin-bottom:0.5rem;color:var(--vibeui-folio-002-accent);font-size:0.6875rem;letter-spacing:0.1em;text-transform:uppercase}
[data-vibeui-block="folio-002"] [data-part="card"] p{margin:0 0 0.75rem;color:color-mix(in oklab,var(--vibeui-folio-002-fg) 80%,transparent);font-size:0.8125rem}
[data-vibeui-block="folio-002"] [data-part="card"] a{display:inline-flex;align-items:center;gap:0.4rem;color:var(--vibeui-folio-002-fg);font-size:0.75rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;border-bottom:1px solid color-mix(in oklab,var(--vibeui-folio-002-accent) 60%,transparent)}
[data-vibeui-block="folio-002"] [data-part="card"] [data-part="close"]{position:absolute;right:0.5rem;top:0.5rem;width:1.5rem;height:1.5rem;border:0;border-radius:50%;background:none;color:var(--vibeui-folio-002-muted);font-size:1rem;line-height:1;cursor:pointer}
[data-vibeui-block="folio-002"] [data-part="card"] [data-part="close"]:hover{color:var(--vibeui-folio-002-fg);background:rgb(255 255 255 / .08)}
@container (max-width: 40rem){
[data-vibeui-block="folio-002"] [data-part="panel"]{left:1.1rem;top:1.1rem;max-width:70%}
[data-vibeui-block="folio-002"] li button span{font-size:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="folio-002"] [data-part="card"]{animation:none}}
`

// Палитры: ключевой свет, контровой, «блуждающий» (капли), луна, пыль,
// дымка, блик, halation. Линейные RGB.
const PALETTES: Record<Folio002Palette, Record<"key" | "rim" | "dew" | "sun" | "dust" | "haze" | "streak" | "halation", [number, number, number]>> = {
  moonlight: { key: [0.8, 0.89, 1], rim: [1, 0.78, 0.52], dew: [0.9, 0.95, 1], sun: [0.86, 0.92, 1], dust: [0.64, 0.74, 0.92], haze: [0.5, 0.62, 0.85], streak: [0.49, 0.75, 1], halation: [1, 0.62, 0.38] },
  nightshade: { key: [0.72, 0.55, 1], rim: [1, 0.82, 0.35], dew: [0.85, 0.75, 1], sun: [0.8, 0.65, 1], dust: [0.72, 0.6, 0.95], haze: [0.58, 0.48, 0.85], streak: [0.7, 0.5, 1], halation: [1, 0.78, 0.3] },
  ember: { key: [0.45, 0.85, 0.88], rim: [1, 0.42, 0.2], dew: [0.7, 0.95, 0.95], sun: [0.55, 0.85, 0.9], dust: [0.5, 0.78, 0.82], haze: [0.4, 0.62, 0.66], streak: [0.35, 0.85, 0.9], halation: [1, 0.45, 0.18] },
  absinthe: { key: [0.5, 1, 0.55], rim: [1, 0.4, 0.8], dew: [0.75, 1, 0.8], sun: [0.6, 1, 0.65], dust: [0.55, 0.9, 0.6], haze: [0.42, 0.75, 0.5], streak: [0.45, 1, 0.6], halation: [1, 0.4, 0.75] },
  aurora: { key: [0.45, 1, 0.7], rim: [0.75, 0.5, 1], dew: [0.7, 1, 0.85], sun: [0.6, 1, 0.75], dust: [0.55, 0.9, 0.7], haze: [0.45, 0.75, 0.6], streak: [0.5, 1, 0.75], halation: [0.72, 0.45, 1] },
  vapor: { key: [0.4, 0.9, 1], rim: [1, 0.45, 0.75], dew: [0.7, 0.95, 1], sun: [0.55, 0.9, 1], dust: [0.5, 0.8, 0.95], haze: [0.4, 0.65, 0.8], streak: [0.4, 0.9, 1], halation: [1, 0.4, 0.7] },
  gilded: { key: [1, 0.85, 0.55], rim: [0.45, 0.55, 1], dew: [1, 0.9, 0.7], sun: [1, 0.9, 0.6], dust: [0.9, 0.8, 0.55], haze: [0.75, 0.65, 0.45], streak: [1, 0.85, 0.5], halation: [0.5, 0.55, 1] },
  crimson: { key: [1, 0.45, 0.45], rim: [0.6, 0.8, 1], dew: [1, 0.7, 0.7], sun: [1, 0.55, 0.5], dust: [0.9, 0.55, 0.55], haze: [0.7, 0.42, 0.45], streak: [1, 0.45, 0.5], halation: [0.6, 0.78, 1] },
  sakura: { key: [1, 0.7, 0.85], rim: [0.55, 0.95, 0.75], dew: [1, 0.8, 0.9], sun: [1, 0.75, 0.85], dust: [0.95, 0.7, 0.8], haze: [0.8, 0.55, 0.65], streak: [1, 0.7, 0.85], halation: [0.55, 0.95, 0.7] },
  silver: { key: [0.92, 0.95, 1], rim: [0.85, 0.88, 0.95], dew: [0.95, 0.97, 1], sun: [0.95, 0.97, 1], dust: [0.75, 0.8, 0.9], haze: [0.6, 0.66, 0.78], streak: [0.75, 0.85, 1], halation: [0.9, 0.85, 0.8] },
}

// Камера: четыре ракурса с весами, паутина лежит в плоскости XY — наклон
// даёт только положение камеры. Джиттер по рысканью и тангажу.
const SHOTS = [
  { pos: [-1.38, -0.96, 2.58], target: [0, -0.06, 0], weight: 2 },
  { pos: [1.52, -0.88, 2.48], target: [0, -0.02, 0], weight: 1 },
  { pos: [-1.5, 0.95, 2.3], target: [0.18, -0.12, 0], weight: 1 },
  { pos: [1.55, 0.95, 2.35], target: [-0.15, -0.1, 0], weight: 1 },
] as const


const DEFAULT_SITES: readonly Folio002Site[] = [
  { title: "Атлас", url: "#", description: "Интерактивная карта проектов студии: слои, фильтры, маршруты.", note: "веб · 2025" },
  { title: "Пульс", url: "#", description: "Панель метрик для команды поддержки в реальном времени.", note: "приложение · 2024" },
  { title: "Сад", url: "#", description: "Игра-медитация: растишь сад под звуки дождя.", note: "игра · 2024" },
]

// Типы нитей: рама, радиусы, спираль, ступица, растяжки, свисающие.
const THREAD = { frame: 0, radial: 1, spiral: 2, hub: 3, mooring: 4, dangle: 5, wrap: 6 } as const
type ThreadType = (typeof THREAD)[keyof typeof THREAD]

const THICKNESS = [0.0032, 0.0019, 0.0013, 0.0017, 0.0038, 0.001, 0.0026]
const STIFFNESS = [1, 0.95, 0.55, 0.95, 1, 0.6, 0.9]
const SLACK = [0.99, 0.997, 0.985, 0.995, 0.96, 1.03, 1]
const TEAR = [1.7, 1.6, 1.5, 1.8, 1.95, 99, 99]
const SEG_LEN = [0.036, 0.042, 0.04, 0.03, 0.11, 0.03, 0.05]

const GRAVITY = -0.14
const DAMPING = 0.985
const SUBSTEPS = 2
const ITERATIONS = 8
const BEND_ITERATIONS = 3
const MAX_SPEED = 0.22
const TEAR_BUDGET = 4
const GRAB_RADIUS = 0.08
const PICK_RADIUS = 0.045
const GRAB_STIFFNESS = 0.35

function mulberry32(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)

    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

type Web = {
  count: number
  pos: Float32Array
  prev: Float32Array
  invMass: Float32Array
  gravScale: Float32Array
  windScale: Float32Array
  /** Положение покоя и сила «памяти формы»: паутина возвращается к сплетённому. */
  rest: Float32Array
  pin: Float32Array
  /** Узлы коконов — по одному на работу. */
  preyNodes: Int32Array
  segCount: number
  segA: Int32Array
  segB: Int32Array
  segRest: Float32Array
  segType: Uint8Array
  segAlive: Float32Array
  /** Длина дуги вдоль нити в начале и конце сегмента — для бусин и мерцания. */
  segArc0: Float32Array
  segArc1: Float32Array
  bendCount: number
  bendA: Int32Array
  bendC: Int32Array
  bendRest: Float32Array
  /** Узлы на спирали — кандидаты для росы и коконов. */
  spiralNodes: Int32Array
  tears: number
}

// Плетение: рама-многоугольник с якорями-растяжками наружу, радиусы от
// ступицы до рамы (узлы рамы вставлены в точках пересечения — стык общий),
// две тугие петли ступицы, свободная зона, спираль с геометрическим ростом,
// свисающие обрывки снизу. Все нити нарезаны на узлы по длине сегмента.
function buildWeb(seed: number, preyCount: number): Web {
  const random = mulberry32(seed)
  const jitter = (amount: number) => (random() * 2 - 1) * amount
  const xs: number[] = []
  const ys: number[] = []
  const zs: number[] = []
  const masses: number[] = []
  const gravity: number[] = []
  const winds: number[] = []
  const segA: number[] = []
  const segB: number[] = []
  const segType: number[] = []
  const segArc0: number[] = []
  const segArc1: number[] = []
  const bendA: number[] = []
  const bendC: number[] = []
  const spiralNodes: number[] = []

  const addNode = (x: number, y: number, z: number, pinned = false, exact = false) => {
    xs.push(x)
    ys.push(y)
    zs.push(exact ? z : z + jitter(0.03))
    masses.push(pinned ? 0 : 1)
    gravity.push(1)
    winds.push(1)

    return xs.length - 1
  }
  const link = (a: number, b: number, type: ThreadType, arc = random() * 40) => {
    segA.push(a)
    segB.push(b)
    segType.push(type)
    segArc0.push(arc)
    segArc1.push(arc + Math.hypot(xs[b] - xs[a], ys[b] - ys[a]))
  }
  // Нить между двумя существующими узлами, нарезанная по segLen; возвращает
  // список узлов от a до b включительно.
  const thread = (a: number, b: number, type: ThreadType, curve = 0): number[] => {
    const dx = xs[b] - xs[a]
    const dy = ys[b] - ys[a]
    const length = Math.hypot(dx, dy)
    const steps = Math.max(1, Math.round(length / SEG_LEN[type]))
    const nodes = [a]

    for (let i = 1; i < steps; i++) {
      const t = i / steps
      const sag = curve * Math.sin(t * Math.PI)

      nodes.push(addNode(xs[a] + dx * t - dy * sag, ys[a] + dy * t + dx * sag, zs[a] + (zs[b] - zs[a]) * t, false, true))
    }

    nodes.push(b)

    let arc = random() * 40

    for (let i = 1; i < nodes.length; i++) {
      link(nodes[i - 1], nodes[i], type, arc)
      arc += Math.hypot(xs[nodes[i]] - xs[nodes[i - 1]], ys[nodes[i]] - ys[nodes[i - 1]])
    }
    for (let i = 1; i < nodes.length - 1; i++) {
      bendA.push(nodes[i - 1])
      bendC.push(nodes[i + 1])
    }

    return nodes
  }

  const radialCount = 30
  const cornerCount = 8
  const rings = 12
  const growth = 1.18

  // Рама: 8 углов с джиттером, нижняя половина вытянута вниз.
  const cornerAngles: number[] = []
  const cornerX: number[] = []
  const cornerY: number[] = []

  for (let k = 0; k < cornerCount; k++) {
    const angle = (k / cornerCount) * Math.PI * 2 + Math.PI / cornerCount + jitter(0.12)
    const radius = 1 + jitter(0.1)
    const y = Math.sin(angle) * radius

    cornerAngles.push(angle)
    cornerX.push(Math.cos(angle) * radius * 0.92)
    cornerY.push((y < 0 ? y * (1 + 0.16) : y) * 0.86)
  }

  // Радиусы: направление и точка пересечения с рамой.
  const radialAngles: number[] = []
  const hits: { x: number; y: number; edge: number; t: number }[] = []

  for (let i = 0; i < radialCount; i++) {
    const angle = (i / radialCount) * Math.PI * 2 + jitter(0.05)
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)

    radialAngles.push(angle)

    for (let k = 0; k < cornerCount; k++) {
      const ax = cornerX[k]
      const ay = cornerY[k]
      const bx = cornerX[(k + 1) % cornerCount]
      const by = cornerY[(k + 1) % cornerCount]
      const ex = bx - ax
      const ey = by - ay
      const denominator = dx * ey - dy * ex

      if (Math.abs(denominator) < 1e-6) continue

      const s = (ax * ey - ay * ex) / denominator
      const t = (ax * dy - ay * dx) / denominator

      if (s > 0 && t >= 0 && t <= 1) {
        hits.push({ x: dx * s, y: dy * s, edge: k, t })
        break
      }
    }
  }

  // Узлы рамы: углы плюс точки пересечения по порядку вдоль ребра.
  const cornerNodes = cornerX.map((x, k) => addNode(x, cornerY[k], 0))
  const hitNodes = hits.map((hit) => addNode(hit.x, hit.y, 0))

  for (let k = 0; k < cornerCount; k++) {
    const onEdge = hits
      .map((hit, index) => ({ hit, index }))
      .filter(({ hit }) => hit.edge === k)
      .sort((a, b) => a.hit.t - b.hit.t)
    let previous = cornerNodes[k]

    for (const { index } of onEdge) {
      thread(previous, hitNodes[index], THREAD.frame)
      previous = hitNodes[index]
    }

    thread(previous, cornerNodes[(k + 1) % cornerCount], THREAD.frame)
  }

  // Растяжки: от углов наружу к закреплённым далёким якорям, две-три
  // на угол — как настоящие мостовые нити к веткам.
  for (let k = 0; k < cornerCount; k++) {
    const branches = 1 + (random() < 0.45 ? 1 : 0)

    for (let b = 0; b < branches; b++) {
      const angle = cornerAngles[k] + jitter(0.45) + (b ? jitter(0.6) : 0)
      const distance = 2.2 + random() * 1.3
      const anchor = addNode(Math.cos(angle) * distance, Math.sin(angle) * distance * (Math.sin(angle) < 0 ? 1.2 : 1), jitter(0.3), true)

      thread(cornerNodes[k], anchor, THREAD.mooring)
    }
  }

  // Ступица и радиусы. Узлы стыка со спиралью вставлены в радиус заранее —
  // в точных точках, чтобы кольца шли ровно.
  const hubRadius = 0.022
  const minRadial = Math.min(...hits.map((hit) => Math.hypot(hit.x, hit.y)))
  const outer = minRadial * 0.92
  const inner = Math.min(0.17, outer / Math.pow(growth, rings - 1))
  const step = Math.pow(outer / inner, 1 / (rings - 1))
  const crossing: number[][] = []
  const hubRing1: number[] = []
  const hubRing2: number[] = []

  for (let i = 0; i < radialCount; i++) {
    const angle = radialAngles[i]
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    const start = addNode(dx * hubRadius, dy * hubRadius, 0)
    const second = addNode(dx * hubRadius * 2.4, dy * hubRadius * 2.4, 0)
    const nodes: number[] = []
    let previous = second

    link(start, second, THREAD.hub)
    hubRing1.push(start)
    hubRing2.push(second)

    for (let k = 0; k < rings; k++) {
      const radius = inner * Math.pow(step, k + i / radialCount) * (1 + jitter(0.006))
      const node = addNode(dx * radius, dy * radius, 0)

      thread(previous, node, THREAD.radial)
      nodes.push(node)
      previous = node
    }

    thread(previous, hitNodes[i], THREAD.radial)
    crossing.push(nodes)
  }

  for (let i = 0; i < radialCount; i++) {
    link(hubRing1[i], hubRing1[(i + 1) % radialCount], THREAD.hub)
    link(hubRing2[i], hubRing2[(i + 1) % radialCount], THREAD.hub)
  }

  // Спираль по стыкам, между ними нить с лёгким провисанием.
  let previous = -1

  for (let k = 0; k < rings; k++) {
    for (let i = 0; i < radialCount; i++) {
      const node = crossing[i][k]

      if (previous >= 0) {
        const nodes = thread(previous, node, THREAD.spiral, 0.012 * (0.3 + random()))

        for (let n = 1; n < nodes.length - 1; n++) spiralNodes.push(nodes[n])
      }

      spiralNodes.push(node)
      previous = node
    }
  }

  // Свисающие обрывки внизу: свободный конец, только гравитация.
  const bottom = hitNodes.filter((node) => ys[node] < -0.3)
  const dangleNodes: number[] = []

  for (let d = 0; d < 4 && bottom.length; d++) {
    const from = bottom[Math.floor(random() * bottom.length)]
    const length = 0.12 + random() * 0.2
    const end = addNode(xs[from] + jitter(0.05), ys[from] - length, zs[from])
    const nodes = thread(from, end, THREAD.dangle)

    for (const node of nodes.slice(1)) dangleNodes.push(node)
  }

  // Коконы: тяжёлый узел чуть ниже стыка спирали, прикручен обмоткой к
  // стыку и соседям — паутина под ним провисает, как под добычей.
  const preyNodes: number[] = []
  const candidates = spiralNodes.filter((node) => {
    const radius = Math.hypot(xs[node], ys[node])

    return radius > 0.3 && radius < 0.78
  })

  for (let i = 0; i < preyCount && candidates.length; i++) {
    let anchor = candidates[Math.floor(random() * candidates.length)]

    for (let attempt = 0; attempt < 20; attempt++) {
      const near = preyNodes.some((prey) => Math.hypot(xs[prey] - xs[anchor], ys[prey] - ys[anchor]) < 0.32)

      if (!near) break
      anchor = candidates[Math.floor(random() * candidates.length)]
    }

    const node = addNode(xs[anchor] + jitter(0.015), ys[anchor] - 0.035, zs[anchor] + 0.035)

    masses[node] = 1 / 0.35
    gravity[node] = 2.2
    winds[node] = 0.35
    link(anchor, node, THREAD.wrap)

    const neighbours = segA
      .map((a, index) => (a === anchor ? segB[index] : segB[index] === anchor ? a : -1))
      .filter((other) => other >= 0)
      .slice(0, 3)

    for (const other of neighbours) link(other, node, THREAD.wrap)
    preyNodes.push(node)
  }

  const count = xs.length
  const pos = new Float32Array(count * 3)
  const invMass = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    pos[i * 3] = xs[i]
    pos[i * 3 + 1] = ys[i]
    pos[i * 3 + 2] = zs[i]
    invMass[i] = masses[i]
  }

  const gravScale = Float32Array.from(gravity)
  const windScale = Float32Array.from(winds)
  const pin = new Float32Array(count).fill(1)

  for (let s = 0; s < segA.length; s++) {
    if (segType[s] === THREAD.frame || segType[s] === THREAD.mooring) {
      pin[segA[s]] = 2.2
      pin[segB[s]] = 2.2
    }
  }
  for (const node of preyNodes) pin[node] = 0.3
  for (const node of dangleNodes) pin[node] = 0

  const segCount = segA.length
  const segRest = new Float32Array(segCount)

  for (let s = 0; s < segCount; s++) {
    const a = segA[s] * 3
    const b = segB[s] * 3

    segRest[s] = Math.hypot(pos[a] - pos[b], pos[a + 1] - pos[b + 1], pos[a + 2] - pos[b + 2]) * SLACK[segType[s]]
  }

  const bendCount = bendA.length
  const bendRest = new Float32Array(bendCount)

  for (let b = 0; b < bendCount; b++) {
    const a = bendA[b] * 3
    const c = bendC[b] * 3

    bendRest[b] = Math.hypot(pos[a] - pos[c], pos[a + 1] - pos[c + 1], pos[a + 2] - pos[c + 2])
  }

  return {
    count,
    pos,
    prev: pos.slice(),
    invMass,
    gravScale,
    windScale,
    rest: pos.slice(),
    pin,
    preyNodes: Int32Array.from(preyNodes),
    segCount,
    segA: Int32Array.from(segA),
    segB: Int32Array.from(segB),
    segRest,
    segType: Uint8Array.from(segType),
    segAlive: new Float32Array(segCount).fill(1),
    segArc0: Float32Array.from(segArc0),
    segArc1: Float32Array.from(segArc1),
    bendCount,
    bendA: Int32Array.from(bendA),
    bendC: Int32Array.from(bendC),
    bendRest,
    spiralNodes: Int32Array.from(spiralNodes),
    tears: 0,
  }
}

type Grab = { x: number; y: number; z: number; node: number; active: boolean; hover: boolean }

// Шаг физики: верлет с ветром и захватом, затем итерации пружин по типам,
// затем «сгибы» — узел через один держит нить гладкой. Порванная нить
// выпадает из решателя, обрывки повисают.
type Kick = { node: number; fx: number; fy: number; fz: number }

function stepWeb(web: Web, dt: number, time: number, windForce: number, grab: Grab, kicks: Kick[]) {
  const { pos, prev, invMass, gravScale, windScale, rest: restPos, pin, count } = web
  const h = dt / SUBSTEPS
  const maxStep = MAX_SPEED * h
  const windDirX = 0.24
  const windDirY = 0.1
  const windDirZ = -0.96
  const gustPhase = time * 0.37
  const gust = Math.max(0, Math.sin(gustPhase) * 0.6 + Math.sin(gustPhase * 2.7 + 1.3) * 0.4) * 1.6
  const breeze = 1.6 * (0.55 + 0.45 * Math.sin(time * 0.9))

  for (let sub = 0; sub < SUBSTEPS; sub++) {
    for (let i = 0; i < count; i++) {
      const w = invMass[i]

      if (w === 0) continue

      const index = i * 3
      const x = pos[index]
      const y = pos[index + 1]
      const z = pos[index + 2]
      let vx = (x - prev[index]) * DAMPING
      let vy = (y - prev[index + 1]) * DAMPING
      let vz = (z - prev[index + 2]) * DAMPING
      const speed = Math.hypot(vx, vy, vz)

      if (speed > maxStep) {
        const scale = maxStep / speed
        vx *= scale
        vy *= scale
        vz *= scale
      }

      // Ветер: волна по пространству плюс дрожь каждого узла.
      const wave = Math.sin(x * 2.4 + time * 2.1) * Math.cos(y * 1.7 - time * 1.4)
      const flutter = Math.sin(time * 9 + i * 1.7) * 0.35
      const force = windForce * (breeze + gust) * (0.5 + 0.5 * wave + flutter) * 0.035 * windScale[i]
      const memory = pin[i] * 3
      let ax = windDirX * force + (restPos[index] - x) * memory
      let ay = GRAVITY * gravScale[i] + windDirY * force + (restPos[index + 1] - y) * memory
      let az = windDirZ * force + (restPos[index + 2] - z) * (memory + 1.5)

      if (grab.hover || grab.active) {
        const dx = grab.x - x
        const dy = grab.y - y
        const distance = Math.hypot(dx, dy)

        if (distance < GRAB_RADIUS) {
          const pull = GRAB_STIFFNESS * (1 - distance / GRAB_RADIUS) * (grab.active ? 90 : 25)

          ax += dx * pull
          ay += dy * pull
          az += (grab.z - z) * pull * 0.5
          vx *= 0.7
          vy *= 0.7
        }
      }

      for (const kick of kicks) {
        if (kick.node !== i) continue

        ax += kick.fx * 60
        ay += kick.fy * 60
        az += kick.fz * 60
      }

      prev[index] = x
      prev[index + 1] = y
      prev[index + 2] = z
      pos[index] = x + vx + ax * h * h
      pos[index + 1] = y + vy + ay * h * h
      pos[index + 2] = z + vz + az * h * h
    }

    if (grab.active && grab.node >= 0 && invMass[grab.node] > 0) {
      const index = grab.node * 3

      pos[index] += (grab.x - pos[index]) * 0.6
      pos[index + 1] += (grab.y - pos[index + 1]) * 0.6
      pos[index + 2] += (grab.z - pos[index + 2]) * 0.6
    }

    const { segA, segB, segRest, segType, segAlive, segCount } = web

    for (let iteration = 0; iteration < ITERATIONS; iteration++) {
      for (let s = 0; s < segCount; s++) {
        if (segAlive[s] === 0) continue

        const a = segA[s] * 3
        const b = segB[s] * 3
        const wa = invMass[segA[s]]
        const wb = invMass[segB[s]]
        const sum = wa + wb

        if (sum === 0) continue

        const dx = pos[b] - pos[a]
        const dy = pos[b + 1] - pos[a + 1]
        const dz = pos[b + 2] - pos[a + 2]
        const length = Math.hypot(dx, dy, dz) || 1e-6
        const rest = segRest[s]

        if (iteration === 0 && web.tears < TEAR_BUDGET && length > rest * TEAR[segType[s]]) {
          segAlive[s] = 0
          web.tears += 1
          pin[segA[s]] = 0
          pin[segB[s]] = 0
          continue
        }

        const correction = ((length - rest) / length) * STIFFNESS[segType[s]]
        const cx = dx * correction
        const cy = dy * correction
        const cz = dz * correction

        pos[a] += (cx * wa) / sum
        pos[a + 1] += (cy * wa) / sum
        pos[a + 2] += (cz * wa) / sum
        pos[b] -= (cx * wb) / sum
        pos[b + 1] -= (cy * wb) / sum
        pos[b + 2] -= (cz * wb) / sum
      }
    }

    const { bendA, bendC, bendRest, bendCount } = web

    for (let iteration = 0; iteration < BEND_ITERATIONS; iteration++) {
      for (let b = 0; b < bendCount; b++) {
        const a = bendA[b] * 3
        const c = bendC[b] * 3
        const wa = invMass[bendA[b]]
        const wc = invMass[bendC[b]]
        const sum = wa + wc

        if (sum === 0) continue

        const dx = pos[c] - pos[a]
        const dy = pos[c + 1] - pos[a + 1]
        const dz = pos[c + 2] - pos[a + 2]
        const length = Math.hypot(dx, dy, dz) || 1e-6

        if (length >= bendRest[b]) continue

        const correction = ((length - bendRest[b]) / length) * 0.4
        const cx = dx * correction
        const cy = dy * correction
        const cz = dz * correction

        pos[a] += (cx * wa) / sum
        pos[a + 1] += (cy * wa) / sum
        pos[a + 2] += (cz * wa) / sum
        pos[c] -= (cx * wc) / sum
        pos[c + 1] -= (cy * wc) / sum
        pos[c + 2] -= (cz * wc) / sum
      }
    }
  }
}

// Нити рисуются лентами: два треугольника на сегмент, ширина в пикселях
// считается в вершинном шейдере, не тоньше uMinPx. Блик анизотропный
// (Кадзия—Кэй): нить светится там, где перпендикулярна полувектору света.
const THREAD_VERTEX = /* glsl */ `
uniform vec2 uResolution;
uniform float uMinPx;
uniform float uHalo;
attribute vec3 aStart;
attribute vec3 aEnd;
attribute vec2 aCorner;
attribute vec3 aInfo;
attribute vec2 aArc;
varying float vAcross;
varying float vCore;
varying vec3 vWorld;
varying vec3 vTangent;
varying float vArc;
varying float vStick;
varying float vAlpha;
void main(){
  vec4 cs = projectionMatrix * modelViewMatrix * vec4(aStart, 1.0);
  vec4 ce = projectionMatrix * modelViewMatrix * vec4(aEnd, 1.0);
  vec2 halfRes = uResolution * 0.5;
  vec2 ss = cs.xy / cs.w * halfRes;
  vec2 se = ce.xy / ce.w * halfRes;
  vec2 d = se - ss;
  float len = max(length(d), 1e-4);
  vec2 dir = d / len;
  vec2 n = vec2(-dir.y, dir.x);
  vec4 c = mix(cs, ce, aCorner.y);
  float pxThick = aInfo.x * projectionMatrix[1][1] * halfRes.y / max(c.w, 1e-3);
  float w = max(pxThick, uMinPx);
  float extent = w * 0.5 + uHalo;
  vec2 p = mix(ss, se, aCorner.y) + n * aCorner.x * extent + dir * (aCorner.y * 2.0 - 1.0) * 0.6;
  c.xy = p / halfRes * c.w;
  gl_Position = c;
  vAcross = aCorner.x;
  vCore = (w * 0.5) / extent;
  vWorld = (modelMatrix * vec4(mix(aStart, aEnd, aCorner.y), 1.0)).xyz;
  vTangent = normalize(mat3(modelMatrix) * (aEnd - aStart));
  vArc = mix(aArc.x, aArc.y, aCorner.y);
  float stick[7];
  stick[0] = 0.05; stick[1] = 0.05; stick[2] = 1.0; stick[3] = 0.18; stick[4] = 0.03; stick[5] = 0.4; stick[6] = 0.08;
  vStick = stick[int(aInfo.y + 0.5)];
  vAlpha = aInfo.z * min(1.0, pxThick / uMinPx + 0.45);
}
`

// Освещение шёлка: три точечных источника с затуханием 1/(d²·f+1) — ключевой,
// контровой и блуждающий; блик Кадзия—Кэя по касательной, слабый диффуз,
// мерцание вдоль нити, «бусины» росы там, где нить липкая, спад по глубине
// и «лужа» видимости вокруг центра — растяжки тают к якорям.
const THREAD_FRAGMENT = /* glsl */ `
precision highp float;
uniform vec3 uKeyPos;
uniform vec3 uRimPos;
uniform vec3 uWanderPos;
uniform vec3 uKeyColor;
uniform vec3 uRimColor;
uniform vec3 uWanderColor;
uniform vec3 uCamera;
uniform float uTime;
uniform float uFade;
varying float vAcross;
varying float vCore;
varying vec3 vWorld;
varying vec3 vTangent;
varying float vArc;
varying float vStick;
varying float vAlpha;
float sinT(vec3 t, vec3 v){ float c = dot(t, v); return sqrt(max(1.0 - c * c, 0.0)); }
vec3 light(vec3 pos, vec3 color, float intensity, vec3 T, vec3 V, float shimmer){
  vec3 d = pos - vWorld;
  float d2 = dot(d, d);
  vec3 L = normalize(d);
  float kk = clamp(dot(T, L) * dot(T, V) + sinT(T, L) * sinT(T, V), 0.0, 1.0);
  float spec = pow(kk, 75.0) * 1.6 * shimmer;
  float diff = sinT(T, L) * 0.09;
  return color * (intensity / (d2 * 0.5 + 1.0)) * (spec + diff);
}
void main(){
  float a = abs(vAcross);
  float core = 1.0 - smoothstep(vCore * 0.55, vCore, a);
  float halo = (1.0 - smoothstep(vCore, 1.0, a)) * 0.05;
  vec3 T = normalize(vTangent);
  vec3 V = normalize(uCamera - vWorld);
  float shimmer = 0.9 + 0.1 * sin(uTime * 1.6 + vArc * 31.0);
  vec3 color = light(uKeyPos, uKeyColor, 3.1, T, V, shimmer) + light(uRimPos, uRimColor, 1.4, T, V, shimmer) + light(uWanderPos, uWanderColor, 0.8, T, V, shimmer);
  color += vec3(0.55, 0.7, 1.0) * 0.012;
  float camDist = length(uCamera - vWorld);
  float near = clamp((2.2 - camDist) * 0.8, 0.0, 1.0);
  float bead = pow(0.5 + 0.5 * sin(vArc * 340.0), 16.0) * vStick * near;
  color *= 1.0 + bead * 2.4;
  float profile = pow(1.0 - a, 1.5) * 0.8 + 0.2;
  float thickness = 0.95 + 0.18 * sin(vArc * 9.1) + 0.1 * sin(vArc * 2.3);
  float depth = exp(-camDist * 0.09);
  float pool = 1.0 - smoothstep(1.15, 1.7, length(vWorld - vec3(0.0, -0.05, 0.0)));
  float hub = 0.2 + 0.8 * smoothstep(0.03, 0.24, length(vWorld.xy));
  color = clamp(color * profile * thickness * depth * pool * hub, 0.0, 6.0);
  float alpha = (core + halo) * vAlpha * uFade;
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(color * alpha, alpha);
}
`

// Точки: роса на узлах и пыль в объёме. Размер в пикселях, мягкий диск с
// бликом у росы (aKind = 1) и просто мягкий диск у пыли (aKind = 0).
const POINT_VERTEX = /* glsl */ `
uniform float uPixelHeight;
uniform float uFocus;
uniform float uTime;
uniform float uFade;
attribute float aSize;
attribute float aKind;
attribute float aSeed;
varying float vKind;
varying float vAlpha;
varying float vSeed;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = -mv.z;
  float coc = clamp(abs(dist - uFocus) * 0.75, 0.0, 1.0);
  float grow = aKind > 0.5 ? 1.0 : 1.0 + coc * 3.6;
  float dim = aKind > 0.5 ? 1.0 : mix(1.0, 0.32, coc);
  float px = aSize * grow * projectionMatrix[1][1] * uPixelHeight * 0.5 / max(dist, 0.2);
  gl_PointSize = max(px, aKind > 0.5 ? 2.0 : 1.5);
  vKind = aKind;
  vSeed = aSeed;
  float twinkle = aKind > 0.5 ? 0.75 + 0.25 * sin(uTime * (1.5 + aSeed * 2.0) + aSeed * 40.0) : 0.6 + 0.4 * sin(uTime * 0.6 + aSeed * 30.0);
  float depth = exp(-dist * 0.1);
  vAlpha = dim * twinkle * depth * uFade * (aKind > 1.5 ? 0.6 : 1.0);
}
`

const POINT_FRAGMENT = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform vec3 uDewColor;
uniform vec3 uHazeColor;
varying float vKind;
varying float vAlpha;
varying float vSeed;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv) * 2.0;
  if (r > 1.0) discard;
  float disc = vKind > 1.5 ? pow(1.0 - r, 3.0) : pow(1.0 - r, vKind > 0.5 ? 1.6 : 1.2);
  float spark = vKind > 0.5 && vKind < 1.5 ? pow(max(0.0, 1.0 - length(uv - vec2(-0.12, -0.14)) * 6.0), 2.0) * 1.4 : 0.0;
  vec3 color = vKind > 1.5 ? uHazeColor : (vKind > 0.5 ? uDewColor : uColor);
  float strength = vKind > 1.5 ? 0.016 : (vKind > 0.5 ? 0.7 : 0.5);
  float alpha = (disc * strength + spark) * vAlpha;
  gl_FragColor = vec4(color * alpha, alpha);
}
`

// Кокон: капсула, обмотанная шёлком — полосы по оси, френель по краю,
// ключевой и контровой свет; aGlow — подсветка при наведении и раскрытии.
const PREY_VERTEX = /* glsl */ `
attribute float aGlow;
attribute float aDim;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vLocal;
varying float vGlow;
varying float vDim;
void main(){
  vLocal = position;
  vec4 world = instanceMatrix * vec4(position, 1.0);
  vec4 mv = modelViewMatrix * world;
  vNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);
  vView = -mv.xyz;
  vGlow = aGlow;
  vDim = aDim;
  gl_Position = projectionMatrix * mv;
}
`

const PREY_FRAGMENT = /* glsl */ `
precision highp float;
uniform vec3 uKeyDir;
uniform vec3 uRimDir;
uniform vec3 uKeyColor;
uniform vec3 uRimColor;
uniform vec3 uSilk;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vLocal;
varying float vGlow;
varying float vDim;
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float wrap = 0.5 + 0.5 * sin(vLocal.y * 320.0 + sin(vLocal.x * 120.0) * 2.0 + atan(vLocal.x, vLocal.z) * 5.0);
  float silk = 0.55 + 0.45 * pow(wrap, 2.0);
  float key = max(0.0, dot(N, uKeyDir));
  float rim = max(0.0, dot(N, uRimDir));
  vec3 H = normalize(uKeyDir + V);
  float spec = pow(max(0.0, dot(N, H)), 22.0);
  float fresnel = pow(1.0 - max(0.0, dot(N, V)), 1.8);
  vec3 color = uSilk * (0.06 + 0.4 * key) * silk + uKeyColor * (spec * 0.5 + fresnel * 0.3) + uRimColor * rim * 0.2 * silk;
  color += (uKeyColor * 0.6 + uSilk * 0.4) * vGlow * (0.06 + 0.1 * fresnel + 0.02 * sin(uTime * 6.0));
  color *= vDim;
  gl_FragColor = vec4(color, 1.0);
}
`

// Муха: хитин — тёмный, с резким бликом и ободком френеля; глаза красные;
// крылья — прозрачная плёнка с радужным отливом, смазанная взмахом.
const CHITIN_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vLocal;
void main(){
  vLocal = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const CHITIN_FRAGMENT = /* glsl */ `
precision highp float;
uniform vec3 uKeyDir;
uniform vec3 uRimDir;
uniform vec3 uKeyColor;
uniform vec3 uRimColor;
uniform vec3 uBase;
uniform float uBands;
uniform float uShine;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vLocal;
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  vec3 Hk = normalize(uKeyDir + V);
  float band = uBands > 0.0 ? 0.7 + 0.3 * smoothstep(0.3, 0.7, 0.5 + 0.5 * sin(vLocal.y * uBands)) : 1.0;
  float spec = pow(max(0.0, dot(N, Hk)), uShine);
  float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.6);
  float key = max(0.0, dot(N, uKeyDir));
  vec3 color = uBase * band * (0.3 + 0.7 * key) + uKeyColor * spec * 0.5 + uRimColor * fresnel * 0.22 + uKeyColor * fresnel * 0.12;
  gl_FragColor = vec4(color, 1.0);
}
`

const WING_VERTEX = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main(){
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const WING_FRAGMENT = /* glsl */ `
precision highp float;
uniform vec3 uKeyColor;
uniform float uSmear;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main(){
  vec2 c = vUv - vec2(0.5, 0.3);
  float shape = 1.0 - smoothstep(0.85, 1.0, length(c * vec2(2.3, 1.5)));
  if (shape <= 0.0) discard;
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float fresnel = pow(1.0 - abs(dot(N, V)), 2.0);
  float veins = smoothstep(0.96, 1.0, 0.5 + 0.5 * sin(vUv.x * 31.0 + vUv.y * 5.0)) * 0.15 + smoothstep(0.97, 1.0, 0.5 + 0.5 * sin(vUv.y * 22.0)) * 0.1;
  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (fresnel * 9.0 + vec3(0.0, 0.33, 0.67)));
  vec3 color = uKeyColor * (0.5 + fresnel * 0.4) + irid * fresnel * 0.35 + veins * uKeyColor;
  float alpha = (0.45 + fresnel * 0.4 + veins) * shape * uSmear;
  gl_FragColor = vec4(color * alpha, alpha);
}
`

// Световой столб от луны и пятно света внизу: видны при отдалении, в них
// плывёт пыль. Столб — плоскость к камере с мягкими краями и волокнами.
const BEAM_VERTEX = /* glsl */ `
varying vec2 vUv;
varying float vDepth;
void main(){
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`
const BEAM_FRAGMENT = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;
varying float vDepth;
void main(){
  float x = vUv.x - 0.5;
  float width = mix(0.42, 0.14, vUv.y);
  float edge = 1.0 - smoothstep(width * 0.3, width, abs(x));
  float fibres = 0.88 + 0.12 * sin(vUv.x * 14.0 + uTime * 0.2) * sin(vUv.x * 5.0 - uTime * 0.13);
  float vertical = pow(1.0 - vUv.y, 0.9) * smoothstep(0.0, 0.12, vUv.y) * (0.35 + 0.65 * vUv.y);
  float alpha = edge * vertical * fibres * uStrength;
  gl_FragColor = vec4(uColor * alpha, alpha);
}
`
const POOL_FRAGMENT = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uStrength;
varying vec2 vUv;
varying float vDepth;
void main(){
  vec2 c = (vUv - 0.5) * vec2(2.0, 2.6);
  float glow = pow(max(0.0, 1.0 - length(c)), 1.6) * uStrength;
  gl_FragColor = vec4(uColor * glow, glow);
}
`

// Луна: мягкое пятно за паутиной — источник для лучей.
const GLOW_VERTEX = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const GLOW_FRAGMENT = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uBrightness;
varying vec2 vUv;
void main(){
  float r = length(vUv - 0.5) * 2.0;
  float glow = pow(max(0.0, 1.0 - r), 2.2) * uBrightness;
  gl_FragColor = vec4(uColor * glow, glow);
}
`

// Свет: лучи от луны (радиальное размытие яркого), анаморфные блики по
// двум осям, halation — считается на половине разрешения.
const LIGHT_FRAGMENT = /* glsl */ `
precision highp float;
uniform sampler2D tDiffuse;
uniform vec2 uSun;
uniform vec2 uTexel;
uniform vec3 uStreakTint;
uniform vec3 uHalationTint;
uniform float uQuality;
varying vec2 vUv;
vec3 bright(vec2 uv, float threshold){
  vec3 c = texture2D(tDiffuse, uv).rgb;
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  return c * smoothstep(threshold, threshold + 0.25, l);
}
void main(){
  vec3 rays = vec3(0.0);
  vec2 delta = (vUv - uSun) * (0.9 / 36.0);
  float dither = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
  vec2 uv = vUv - delta * dither;
  float weight = 0.5;
  float decay = 1.0;
  int samples = uQuality > 0.5 ? 36 : 18;
  for (int i = 0; i < 36; i++) {
    if (i >= samples) break;
    uv -= delta * (uQuality > 0.5 ? 1.0 : 2.0);
    rays += bright(uv, 0.05) * decay * weight;
    decay *= uQuality > 0.5 ? 0.957 : 0.916;
  }
  rays *= 0.039 * 0.35;
  vec3 streak = vec3(0.0);
  float reachX = 0.13;
  float reachY = 0.05;
  for (int i = -8; i <= 8; i++) {
    float t = float(i) / 8.0;
    float falloff = 1.0 - abs(t);
    streak += bright(vUv + vec2(t * reachX, 0.0), 0.15) * falloff * falloff;
    streak += bright(vUv + vec2(0.0, t * reachY), 0.15) * falloff * falloff * 0.75;
  }
  streak *= uStreakTint * 0.045;
  vec3 halo = vec3(0.0);
  for (int x = -2; x <= 2; x++) for (int y = -2; y <= 2; y++) {
    halo += bright(vUv + vec2(float(x), float(y)) * uTexel * 3.0, 0.3);
  }
  halo *= uHalationTint * (0.12 / 25.0) * 1.2;
  gl_FragColor = vec4(rays + streak + halo, 1.0);
}
`

// Финал: сцена + свет, хроматика, тональная кривая, цветокоррекция, зерно,
// виньетка; тонмаппинг и sRGB — чанками three.
const FINAL_FRAGMENT = /* glsl */ `
precision highp float;
uniform sampler2D tDiffuse;
uniform sampler2D tLight;
uniform float uTime;
uniform float uChroma;
uniform vec3 uShadowTint;
uniform vec3 uHighlightTint;
uniform float uGrain;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + fract(uTime) * 43758.5453) * 43758.5453); }
void main(){
  vec2 centered = vUv - 0.5;
  float r2 = dot(centered, centered);
  vec2 shift = centered * r2 * uChroma;
  vec3 scene = vec3(
    texture2D(tDiffuse, vUv + shift).r,
    texture2D(tDiffuse, vUv).g,
    texture2D(tDiffuse, vUv - shift).b
  );
  vec3 light = texture2D(tLight, vUv).rgb;
  vec3 color = scene + light;
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color *= mix(uShadowTint, uHighlightTint, smoothstep(0.0, 0.6, lum));
  color = (color - 0.5 * lum * 0.12) * 1.12 + lum * 0.06;
  color = mix(vec3(lum), color, 1.1);
  float vignette = 1.0 - smoothstep(0.22, 0.66, length(centered) * 1.15);
  color *= mix(0.15, 1.0, pow(vignette, 1.5));
  color += (hash(vUv * vec2(1920.0, 1080.0)) - 0.5) * uGrain * 0.022;
  gl_FragColor = vec4(max(color, 0.0), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

const QUAD_VERTEX = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

type Scene = {
  dispose: () => void
  respin: () => void
  setPalette: (palette: Folio002Palette) => void
  setWind: (value: number) => void
  setFocus: (index: number | null) => void
  setOpen: (index: number | null) => void
  onPin: (callback: (points: { x: number; y: number }[], width: number, height: number) => void) => void
  onOpen: (callback: (index: number) => void) => void
}

const vec3 = (rgb: [number, number, number]) => new THREE.Vector3(rgb[0], rgb[1], rgb[2])

type FlyState = "fly" | "hover" | "perch" | "stuck" | "flee"

// Муха: тело из трёх сфер, глаза, шесть ног, два крыла с двумя смазанными
// копиями. Летает саккадами вокруг паутины, зависает, садится на нить
// и чистится, пугается курсора, влетает в сеть — бьётся, дёргая узлы,
// и либо вырывается, либо затихает и улетает по таймеру.
class Fly {
  root = new THREE.Group()
  position = new THREE.Vector3()
  velocity = new THREE.Vector3()
  target = new THREE.Vector3()
  state: FlyState = "fly"
  timer = 0
  saccade = 0
  perchCheck = 0
  node = -1
  seed: number
  bank = 0
  speed: number
  wings: THREE.Mesh[] = []
  legs: THREE.LineSegments
  legPhase = 0
  random: () => number
  stuckAt = 0
  burst = 0
  catchCooldown = 0
  wasBehind = false

  constructor(index: number, chitin: THREE.ShaderMaterial, eye: THREE.ShaderMaterial, wing: THREE.ShaderMaterial, private web: () => Web) {
    this.seed = index
    this.random = mulberry32(100 + index * 17)
    this.speed = 0.35 + this.random() * 0.35
    const size = 1.7 + (this.random() - 0.5) * 0.5
    const sphere = new THREE.SphereGeometry(1, 10, 8)
    const part = (material: THREE.Material, x: number, sx: number, sy: number, sz: number, y = 0) => {
      const mesh = new THREE.Mesh(sphere, material)

      mesh.position.set(x, y, 0)
      mesh.scale.set(sx, sy, sz).multiplyScalar(size)
      this.root.add(mesh)

      return mesh
    }

    part(chitin, 0.018, 0.0075, 0.0068, 0.0068)
    part(chitin, 0.004, 0.0095, 0.0085, 0.0085, 0.001)
    part(chitin, -0.016, 0.016, 0.0088, 0.0088, -0.001)
    part(eye, 0.023, 0.0038, 0.0042, 0.0034, 0.0015).position.z = 0.0042 * size
    part(eye, 0.023, 0.0038, 0.0042, 0.0034, 0.0015).position.z = -0.0042 * size

    const legGeometry = new THREE.BufferGeometry()

    legGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6 * 2 * 2 * 3), 3).setUsage(THREE.DynamicDrawUsage))
    this.legs = new THREE.LineSegments(legGeometry, new THREE.LineBasicMaterial({ color: 0x1a1418, transparent: true, opacity: 0.9 }))
    this.root.add(this.legs)

    // Крыло: лежит в плоскости XZ, корень у груди, растёт вбок по Z;
    // чуть отведено назад. Взмах — поворот вокруг оси тела (X).
    const wingGeometry = new THREE.PlaneGeometry(0.016, 0.038)

    wingGeometry.rotateX(-Math.PI / 2)
    wingGeometry.translate(-0.004, 0, 0.019)

    for (let side = -1; side <= 1; side += 2) {
      for (let copy = 0; copy < 3; copy++) {
        const mesh = new THREE.Mesh(wingGeometry, wing.clone())

        mesh.position.set(0.004 * size, 0.005 * size, 0)
        mesh.scale.set(size, size, size * side)
        mesh.userData = { side, copy }
        this.root.add(mesh)
        this.wings.push(mesh)
      }
    }

    this.spawn()
  }

  spawn() {
    const angle = this.random() * Math.PI * 2
    const radius = 1.4 + this.random() * 0.4

    this.position.set(Math.cos(angle) * radius * 1.4, Math.sin(angle) * radius, -0.5 + this.random() * 1.6)
    this.velocity.set(0, 0, 0)
    this.pickTarget()
    this.state = "fly"
    this.timer = 0
  }

  pickTarget() {
    const excursion = this.random() < 0.4

    if (excursion) {
      const angle = this.random() * Math.PI * 2
      const radius = 1.4 + this.random() * 1.8

      this.target.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.7, -0.7 + this.random() * 2.2)
    } else {
      const angle = this.random() * Math.PI * 2
      const radius = this.random() * 0.9

      this.target.set(Math.cos(angle) * radius * 1.2, Math.sin(angle) * radius, -0.35 + this.random() * 0.9)
    }

    this.saccade = 0.25 + this.random() * 0.65
  }

  // Толчки паутине: сидящая муха чуть тянет узел вниз, застрявшая бьётся.
  kick(kicks: Kick[], time: number) {
    if (this.node < 0) return

    if (this.state === "perch") {
      kicks.push({ node: this.node, fx: 0, fy: -0.02, fz: 0 })
    } else if (this.state === "stuck") {
      const burst = this.burst > 0 ? 1 : 0
      const amp = 0.09 + burst * 0.5

      kicks.push({ node: this.node, fx: Math.sin(time * 9 + this.seed) * amp, fy: Math.cos(time * 7.3 + this.seed) * amp - 0.05, fz: Math.sin(time * 11) * amp * 0.5 })
    }
  }

  step(dt: number, time: number) {
    const web = this.web()

    this.timer += dt
    this.catchCooldown = Math.max(0, this.catchCooldown - dt)

    if (this.state === "perch" || this.state === "stuck") {
      const node = this.node * 3

      if (this.state === "stuck") {
        this.burst -= dt
        if (this.burst < -(0.5 + this.random() * 0.9)) {
          this.burst = 0.18
          if (this.random() < 0.18) {
            this.state = "flee"
            this.timer = 0
            this.velocity.set((this.random() - 0.5) * 2, 0.6 + this.random(), 1.2).normalize().multiplyScalar(0.9)
            this.node = -1
            this.catchCooldown = 3
          }
        }
        if (this.timer > 12) {
          this.state = "flee"
          this.timer = 0
          this.velocity.set((this.random() - 0.5) * 2, 0.5, 1).normalize().multiplyScalar(0.9)
          this.node = -1
          this.catchCooldown = 3
        }
      } else if (this.timer > 2.5 + this.random() * 4) {
        this.state = "fly"
        this.timer = 0
        this.velocity.set((this.random() - 0.5) * 0.6, 0.35, 0.4).normalize().multiplyScalar(0.55)
        this.node = -1
        this.catchCooldown = 1.2
        this.pickTarget()
      }

      if (this.node >= 0) {
        const squirm = this.state === "stuck" ? 0.01 : 0
        this.position.set(web.pos[node] + Math.sin(time * 9) * squirm, web.pos[node + 1] + 0.008 + Math.cos(time * 9.5) * squirm, web.pos[node + 2] + 0.012)
        this.updatePose(dt, time)

        return
      }
    }

    if (this.state === "flee") {
      if (this.timer > 0.5 + this.random() * 0.7) {
        this.state = "fly"
        this.timer = 0
        this.pickTarget()
      }
    } else if (this.state === "hover") {
      this.velocity.multiplyScalar(Math.pow(0.85, dt * 60))
      if (this.timer > 0.25 + this.random() * 0.55) {
        this.state = "fly"
        this.timer = 0
        this.pickTarget()
      }
    } else {
      this.saccade -= dt
      if (this.saccade <= 0) {
        if (this.random() < 0.4) {
          this.state = "hover"
          this.timer = 0
        } else {
          this.pickTarget()
        }
      }

      const desired = this.target.clone().sub(this.position)
      const distance = desired.length()

      if (distance < 0.08) this.pickTarget()
      desired.normalize().multiplyScalar(this.speed * (this.target.length() > 1.3 ? 1.9 : 1))
      const steer = desired.sub(this.velocity).multiplyScalar(Math.min(1, dt * 5))

      this.velocity.add(steer)
      this.bank += ((steer.x * 4) - this.bank) * Math.min(1, dt * 6)

      // Посадка: иногда выбираем узел спирали и летим к нему.
      this.perchCheck -= dt
      if (this.perchCheck <= 0) {
        this.perchCheck = 4 + this.random() * 5
        if (this.random() < 0.6 && web.spiralNodes.length) {
          const node = web.spiralNodes[Math.floor(this.random() * web.spiralNodes.length)]

          this.target.set(web.pos[node * 3], web.pos[node * 3 + 1], web.pos[node * 3 + 2] + 0.02)
          this.node = node
          this.saccade = 6
        }
      }

      if (this.node >= 0 && this.state === "fly") {
        const node = this.node * 3
        const gap = Math.hypot(web.pos[node] - this.position.x, web.pos[node + 1] - this.position.y, web.pos[node + 2] - this.position.z)

        if (gap < 0.03) {
          this.state = "perch"
          this.timer = 0
          this.velocity.set(0, 0, 0)
          this.legPhase = 0
        }
      }
    }

    // Попадание в сеть: пересечение плоскости внутри спирали.
    const before = this.position.z
    this.position.addScaledVector(this.velocity, dt)
    this.position.y += Math.sin(time * 6 * Math.PI * 2 + this.seed) * 0.004 * dt * 10
    const behind = this.position.z < 0

    if (behind !== this.wasBehind && this.state !== "perch" && this.state !== "stuck" && this.catchCooldown <= 0 && this.node < 0) {
      const radius = Math.hypot(this.position.x, this.position.y)

      if (radius > 0.2 && radius < 0.95 && this.random() < 0.5) {
        let best = -1
        let bestDistance = 0.06

        for (let i = 0; i < web.spiralNodes.length; i++) {
          const node = web.spiralNodes[i] * 3
          const distance = Math.hypot(web.pos[node] - this.position.x, web.pos[node + 1] - this.position.y)

          if (distance < bestDistance) {
            bestDistance = distance
            best = web.spiralNodes[i]
          }
        }

        if (best >= 0) {
          this.node = best
          this.state = "stuck"
          this.timer = 0
          this.burst = 0
          this.velocity.set(0, 0, 0)
        }
      }
    }

    this.wasBehind = behind
    void before

    if (this.position.length() > 3.8) this.spawn()
    this.updatePose(dt, time)
  }

  startle(x: number, y: number) {
    if (this.state === "stuck" || this.state === "perch") return

    const dx = this.position.x - x
    const dy = this.position.y - y

    if (Math.hypot(dx, dy) < 0.16 && this.state !== "flee") {
      this.state = "flee"
      this.timer = 0
      this.velocity.set(dx, dy, 0.6).normalize().multiplyScalar(1.7)
      this.node = -1
    }
  }

  updatePose(dt: number, time: number) {
    this.root.position.copy(this.position)
    const moving = this.velocity.length() > 0.02

    if (moving) {
      const forward = this.velocity.clone().normalize()
      const matrix = new THREE.Matrix4().lookAt(new THREE.Vector3(), forward.clone().negate(), new THREE.Vector3(0, 1, 0))

      this.root.quaternion.setFromRotationMatrix(matrix)
      this.root.rotateY(Math.PI / 2)
      this.root.rotateX(-this.bank * 0.35)
    } else if (this.state === "perch" || this.state === "stuck") {
      this.root.rotation.set(0.2, this.seed * 1.7 + Math.sin(time * 0.3) * 0.1, 0.05)
    }

    // Крылья: взмах 48 Гц, две смазанные копии по сторонам; сидя — сложены.
    const folded = this.state === "perch" || this.state === "stuck" ? 1 : 0
    const beat = folded && this.state === "perch" ? 0 : Math.sin(time * 48 * Math.PI * 2 + this.seed) * 0.85

    for (const wing of this.wings) {
      const { side, copy } = wing.userData as { side: number; copy: number }
      const smear = copy === 0 ? 0 : (copy === 1 ? -0.45 : 0.45)
      // Сложенные крылья лежат вдоль спины; в полёте — веером вверх-вниз.
      const lift = folded ? 0.08 : 0.35 + beat + smear
      const sweep = folded ? 1.25 : 0.35

      wing.rotation.set(-side * lift, -side * sweep, 0)
      ;(wing.material as THREE.ShaderMaterial).uniforms.uSmear.value = folded ? (copy === 0 ? 1 : 0) : (copy === 0 ? 0.7 : 0.4)
    }

    // Ноги: сидя — чистятся, в полёте — поджаты, застряв — сучат.
    const positions = this.legs.geometry.getAttribute("position") as THREE.BufferAttribute
    const array = positions.array as Float32Array
    const flail = this.state === "stuck" ? Math.sin(time * 17) * 0.38 : this.state === "perch" ? Math.sin(time * 26) * 0.28 * (Math.sin(time * 0.9) > 0.3 ? 1 : 0) : 0
    const tuck = this.state === "fly" || this.state === "hover" || this.state === "flee" ? 1 : 0

    for (let i = 0; i < 6; i++) {
      const side = i < 3 ? 1 : -1
      const along = 0.012 - (i % 3) * 0.011
      const spread = tuck ? 0.5 : 1
      const knee = 0.011 * spread
      const drop = tuck ? -0.006 : -0.012
      const wave = (i % 3 === 0 ? flail : i % 3 === 1 ? -flail * 0.6 : flail * 0.3)
      const o = i * 12

      array[o] = along
      array[o + 1] = -0.004
      array[o + 2] = side * 0.005
      array[o + 3] = along + wave * 0.01
      array[o + 4] = -0.004 + knee * 0.5
      array[o + 5] = side * (0.005 + knee)
      array[o + 6] = array[o + 3]
      array[o + 7] = array[o + 4]
      array[o + 8] = array[o + 5]
      array[o + 9] = along + wave * 0.014
      array[o + 10] = drop
      array[o + 11] = side * (0.005 + knee * 1.4)
    }

    positions.needsUpdate = true
    void dt
  }

  dispose() {
    this.legs.geometry.dispose()
    ;(this.legs.material as THREE.Material).dispose()
    for (const wing of this.wings) (wing.material as THREE.Material).dispose()
  }
}

function createScene(host: HTMLElement, canvas: HTMLCanvasElement, options: { seed: number; palette: Folio002Palette; wind: number; sites: number; flies: number; orbit: boolean; reducedMotion: boolean }): Scene | null {
  let renderer: THREE.WebGLRenderer

  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance", stencil: false, depth: true })
  } catch {
    return null
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.autoClear = true
  renderer.setClearColor(0x000000, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(46, 1, 0.01, 60)
  const cameraBase = new THREE.Vector3()
  const cameraTarget = new THREE.Vector3()
  const group = new THREE.Group()

  scene.add(group)

  // Ракурс: взвешенный выбор по зерну, джиттер ±3° рысканья и ±2° тангажа,
  // в портрете камера отъезжает на 30 %.
  function dealShot(shotSeed: number) {
    const random = mulberry32(shotSeed * 7919 + 13)
    const total = SHOTS.reduce((sum, shot) => sum + shot.weight, 0)
    let pick = random() * total
    let shot: (typeof SHOTS)[number] = SHOTS[0]

    for (const candidate of SHOTS) {
      pick -= candidate.weight
      if (pick <= 0) {
        shot = candidate
        break
      }
    }

    cameraTarget.set(shot.target[0], shot.target[1], shot.target[2])
    const offset = new THREE.Vector3(shot.pos[0], shot.pos[1], shot.pos[2]).sub(cameraTarget)
    const yaw = ((random() * 2 - 1) * 3 * Math.PI) / 180
    const pitch = ((random() * 2 - 1) * 2 * Math.PI) / 180

    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw)
    offset.applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch)
    offset.multiplyScalar(1 + (random() * 2 - 1) * 0.04)
    cameraBase.copy(cameraTarget).add(offset)
  }

  let palette = PALETTES[options.palette]
  let windForce = options.wind
  let seed = options.seed
  let web = buildWeb(seed, options.sites)
  let fade = 0
  let time = 0
  let shotDirty = true

  dealShot(seed)

  // Орбита: вращение и панорама перетаскиванием по пустому месту, зум
  // колесом — только с Ctrl/⌘ или когда блок занимает почти весь экран,
  // иначе колесо должно листать страницу. Захват нити отключает орбиту.
  const controls = new OrbitControls(camera, canvas)

  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 0.08
  controls.maxDistance = 9
  controls.enablePan = true
  controls.rotateSpeed = 0.6
  controls.enabled = options.orbit
  controls.enableZoom = false
  const onWheelGate = (event: WheelEvent) => {
    controls.enableZoom = options.orbit && (event.ctrlKey || event.metaKey || host.clientHeight > window.innerHeight * 0.8)
  }

  canvas.addEventListener("wheel", onWheelGate, { capture: true, passive: true })

  // Ленты нитей.
  const threadMaterial = new THREE.ShaderMaterial({
    vertexShader: THREAD_VERTEX,
    fragmentShader: THREAD_FRAGMENT,
    uniforms: {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMinPx: { value: 1.1 },
      uHalo: { value: 0.9 },
      uKeyPos: { value: new THREE.Vector3(-1.3, 1, 1.15) },
      uRimPos: { value: new THREE.Vector3(1.7, -0.45, -1.9) },
      uWanderPos: { value: new THREE.Vector3(0.8, 0.4, 1.2) },
      uKeyColor: { value: vec3(palette.key) },
      uRimColor: { value: vec3(palette.rim) },
      uWanderColor: { value: vec3(palette.dew) },
      uCamera: { value: new THREE.Vector3() },
      uTime: { value: 0 },
      uFade: { value: 0 },
      uKeyDir: { value: new THREE.Vector3(-1.3, 1, 1.15).normalize() },
      uRimDir: { value: new THREE.Vector3(1.7, -0.45, -1.9).normalize() },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
  let threadGeometry = new THREE.BufferGeometry()
  const threadMesh = new THREE.Mesh(threadGeometry, threadMaterial)

  threadMesh.frustumCulled = false
  group.add(threadMesh)

  // Роса.
  const pointMaterial = new THREE.ShaderMaterial({
    vertexShader: POINT_VERTEX,
    fragmentShader: POINT_FRAGMENT,
    uniforms: {
      uPixelHeight: { value: 800 },
      uFocus: { value: 3 },
      uTime: { value: 0 },
      uFade: { value: 0 },
      uColor: { value: vec3(palette.dust) },
      uDewColor: { value: vec3(palette.dew) },
      uHazeColor: { value: vec3(palette.haze) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  let dewGeometry = new THREE.BufferGeometry()
  const dewPoints = new THREE.Points(dewGeometry, pointMaterial)
  let dewNodes = new Int32Array(0)

  dewPoints.frustumCulled = false
  group.add(dewPoints)

  // Пыль и дымка в объёме сцены.
  const dustCount = 186
  const dustGeometry = new THREE.BufferGeometry()
  const dustPositions = new Float32Array(dustCount * 3)
  const dustSizes = new Float32Array(dustCount)
  const dustKinds = new Float32Array(dustCount)
  const dustSeeds = new Float32Array(dustCount)
  const dustVelocity = new Float32Array(dustCount)
  const dustRandom = mulberry32(7)

  for (let i = 0; i < dustCount; i++) {
    const haze = i < 6

    dustPositions[i * 3] = (dustRandom() * 2 - 1) * (haze ? 2.2 : 1.3)
    dustPositions[i * 3 + 1] = (dustRandom() * 2 - 1) * (haze ? 1.4 : 0.95)
    dustPositions[i * 3 + 2] = (dustRandom() * 2 - 1) * 0.85 + 0.5
    dustSizes[i] = haze ? 1 + dustRandom() * 0.9 : 0.003 + dustRandom() * 0.02
    dustKinds[i] = haze ? 2 : 0
    dustSeeds[i] = dustRandom()
    dustVelocity[i] = 0.4 + dustRandom() * 0.8
  }

  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3))
  dustGeometry.setAttribute("aSize", new THREE.BufferAttribute(dustSizes, 1))
  dustGeometry.setAttribute("aKind", new THREE.BufferAttribute(dustKinds, 1))
  dustGeometry.setAttribute("aSeed", new THREE.BufferAttribute(dustSeeds, 1))
  const dustMaterial = pointMaterial.clone()

  dustMaterial.uniforms.uColor.value = vec3(palette.dust)
  dustMaterial.uniforms.uDewColor.value = vec3(palette.dew)
  dustMaterial.uniforms.uHazeColor.value = vec3(palette.haze)
  const dustPoints = new THREE.Points(dustGeometry, dustMaterial)

  dustPoints.frustumCulled = false
  scene.add(dustPoints)

  // Коконы: инстансы капсулы, позиция из физики, подсветка из state.
  // Кокон: низкополигональный эллипсоид с плоскими гранями — шёлк, намотанный
  // слоями, ловит свет гранями как кристалл.
  const preyGeometry = new THREE.IcosahedronGeometry(0.034, 1).toNonIndexed()

  {
    const positions = preyGeometry.getAttribute("position") as THREE.BufferAttribute
    const random = mulberry32(3)
    const bumps = new Map<string, number>()

    for (let v = 0; v < positions.count; v++) {
      const key = `${positions.getX(v).toFixed(4)}|${positions.getY(v).toFixed(4)}|${positions.getZ(v).toFixed(4)}`
      let bump = bumps.get(key)

      if (bump === undefined) {
        bump = 0.86 + random() * 0.28
        bumps.set(key, bump)
      }

      positions.setXYZ(v, positions.getX(v) * bump * 0.8, positions.getY(v) * bump * 1.55, positions.getZ(v) * bump * 0.8)
    }

    positions.needsUpdate = true
    preyGeometry.computeVertexNormals()
  }
  const preyMaterial = new THREE.ShaderMaterial({
    vertexShader: PREY_VERTEX,
    fragmentShader: PREY_FRAGMENT,
    uniforms: {
      uKeyDir: threadMaterial.uniforms.uKeyDir,
      uRimDir: threadMaterial.uniforms.uRimDir,
      uKeyColor: { value: vec3(palette.key) },
      uRimColor: { value: vec3(palette.rim) },
      uSilk: { value: new THREE.Vector3(0.55, 0.57, 0.66) },
      uTime: { value: 0 },
    },
  })
  const preyCount = Math.max(1, options.sites)
  const preyMesh = new THREE.InstancedMesh(preyGeometry, preyMaterial, preyCount)
  const preyGlow = new Float32Array(preyCount)
  const preyDim = new Float32Array(preyCount).fill(1)
  const preyTilt = Array.from({ length: preyCount }, (_, i) => new THREE.Euler(0.4 + i * 0.7, i * 1.3, 0.9 + i * 0.5))
  const preyMatrix = new THREE.Matrix4()
  const preyQuaternion = new THREE.Quaternion()
  const preyScale = new THREE.Vector3(1, 1, 1)
  const preyPosition = new THREE.Vector3()

  preyGeometry.setAttribute("aGlow", new THREE.InstancedBufferAttribute(preyGlow, 1).setUsage(THREE.DynamicDrawUsage))
  preyGeometry.setAttribute("aDim", new THREE.InstancedBufferAttribute(preyDim, 1).setUsage(THREE.DynamicDrawUsage))
  preyMesh.count = options.sites
  preyMesh.frustumCulled = false
  group.add(preyMesh)

  // Мухи.
  const chitinMaterial = new THREE.ShaderMaterial({
    vertexShader: CHITIN_VERTEX,
    fragmentShader: CHITIN_FRAGMENT,
    uniforms: {
      uKeyDir: threadMaterial.uniforms.uKeyDir,
      uRimDir: threadMaterial.uniforms.uRimDir,
      uKeyColor: preyMaterial.uniforms.uKeyColor,
      uRimColor: preyMaterial.uniforms.uRimColor,
      uBase: { value: new THREE.Vector3(0.36, 0.37, 0.44) },
      uBands: { value: 320 },
      uShine: { value: 95 },
    },
  })
  const eyeMaterial = new THREE.ShaderMaterial({
    vertexShader: CHITIN_VERTEX,
    fragmentShader: CHITIN_FRAGMENT,
    uniforms: {
      uKeyDir: threadMaterial.uniforms.uKeyDir,
      uRimDir: threadMaterial.uniforms.uRimDir,
      uKeyColor: preyMaterial.uniforms.uKeyColor,
      uRimColor: preyMaterial.uniforms.uRimColor,
      uBase: { value: new THREE.Vector3(0.9, 0.12, 0.05) },
      uBands: { value: 0 },
      uShine: { value: 40 },
    },
  })
  const wingMaterial = new THREE.ShaderMaterial({
    vertexShader: WING_VERTEX,
    fragmentShader: WING_FRAGMENT,
    uniforms: { uKeyColor: preyMaterial.uniforms.uKeyColor, uSmear: { value: 1 } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  })
  const flies: Fly[] = []

  for (let i = 0; i < (options.reducedMotion ? 0 : options.flies); i++) {
    const fly = new Fly(i, chitinMaterial, eyeMaterial, wingMaterial, () => web)

    flies.push(fly)
    group.add(fly.root)
  }

  // Луна за паутиной.
  const sunPosition = new THREE.Vector3(-0.35, 2.35, -0.5)
  const glowMaterial = new THREE.ShaderMaterial({
    vertexShader: GLOW_VERTEX,
    fragmentShader: GLOW_FRAGMENT,
    uniforms: { uColor: { value: vec3(palette.sun) }, uBrightness: { value: 0.08 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), glowMaterial)

  glow.position.copy(sunPosition)
  glow.lookAt(camera.position)
  scene.add(glow)

  const beamMaterial = new THREE.ShaderMaterial({
    vertexShader: BEAM_VERTEX,
    fragmentShader: BEAM_FRAGMENT,
    uniforms: { uColor: { value: vec3(palette.haze) }, uTime: { value: 0 }, uStrength: { value: 0.26 } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  })
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 6.4), beamMaterial)

  beam.position.set(-0.25, -0.9, -0.3)
  beam.renderOrder = -2
  scene.add(beam)
  const poolMaterial = new THREE.ShaderMaterial({
    vertexShader: BEAM_VERTEX,
    fragmentShader: POOL_FRAGMENT,
    uniforms: { uColor: { value: vec3(palette.dust).lerp(new THREE.Vector3(1, 1, 1), 0.45) }, uStrength: { value: 0.42 } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  })
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(11, 5), poolMaterial)

  pool.position.set(-0.25, -2.6, -0.3)
  pool.renderOrder = -1
  scene.add(pool)

  // Пост-обработка: сцена → bloom (поверх сцены) → свет на полукадре → финал.
  const size = new THREE.Vector2(1, 1)
  const rtScene = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: true })
  const rtLight = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false })
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.28, 0.35, 0.3)

  bloom.renderToScreen = false
  const lightMaterial = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERTEX,
    fragmentShader: LIGHT_FRAGMENT,
    uniforms: {
      tDiffuse: { value: rtScene.texture },
      uSun: { value: new THREE.Vector2(0.4, 1.3) },
      uTexel: { value: new THREE.Vector2(1, 1) },
      uStreakTint: { value: vec3(palette.streak) },
      uHalationTint: { value: vec3(palette.halation) },
      uQuality: { value: 1 },
    },
    depthTest: false,
    depthWrite: false,
  })
  const finalMaterial = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERTEX,
    fragmentShader: FINAL_FRAGMENT,
    uniforms: {
      tDiffuse: { value: rtScene.texture },
      tLight: { value: rtLight.texture },
      uTime: { value: 0 },
      uChroma: { value: 0.005 },
      uShadowTint: { value: new THREE.Vector3(0.93, 1.01, 1.08) },
      uHighlightTint: { value: new THREE.Vector3(1.06, 1, 0.94) },
      uGrain: { value: 1 },
    },
    depthTest: false,
    depthWrite: false,
  })
  const lightQuad = new FullScreenQuad(lightMaterial)
  const finalQuad = new FullScreenQuad(finalMaterial)

  // Геометрия нитей и росы под текущую паутину.
  function rebuildGeometry() {
    threadGeometry.dispose()
    threadGeometry = new THREE.BufferGeometry()
    const segCount = web.segCount
    const starts = new Float32Array(segCount * 12)
    const ends = new Float32Array(segCount * 12)
    const corners = new Float32Array(segCount * 8)
    const info = new Float32Array(segCount * 12)
    const arcs = new Float32Array(segCount * 8)
    const index = new Uint32Array(segCount * 6)

    for (let s = 0; s < segCount; s++) {
      const thickness = THICKNESS[web.segType[s]]

      for (let v = 0; v < 4; v++) {
        corners[s * 8 + v * 2] = v % 2 === 0 ? -1 : 1
        corners[s * 8 + v * 2 + 1] = v < 2 ? 0 : 1
        info[s * 12 + v * 3] = thickness
        info[s * 12 + v * 3 + 1] = web.segType[s]
        info[s * 12 + v * 3 + 2] = 1
        arcs[s * 8 + v * 2] = web.segArc0[s]
        arcs[s * 8 + v * 2 + 1] = web.segArc1[s]
      }

      const base = s * 4

      index.set([base, base + 1, base + 2, base + 1, base + 3, base + 2], s * 6)
    }

    threadGeometry.setAttribute("aStart", new THREE.BufferAttribute(starts, 3).setUsage(THREE.DynamicDrawUsage))
    threadGeometry.setAttribute("aEnd", new THREE.BufferAttribute(ends, 3).setUsage(THREE.DynamicDrawUsage))
    threadGeometry.setAttribute("aCorner", new THREE.BufferAttribute(corners, 2))
    threadGeometry.setAttribute("aInfo", new THREE.BufferAttribute(info, 3).setUsage(THREE.DynamicDrawUsage))
    threadGeometry.setAttribute("aArc", new THREE.BufferAttribute(arcs, 2))
    threadGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segCount * 12), 3))
    threadGeometry.setIndex(new THREE.BufferAttribute(index, 1))
    threadMesh.geometry = threadGeometry

    // Роса: 240 узлов спирали.
    const dewCount = Math.min(240, web.spiralNodes.length)
    const random = mulberry32(seed + 11)
    const picked = new Set<number>()

    while (picked.size < dewCount) picked.add(web.spiralNodes[Math.floor(random() * web.spiralNodes.length)])
    dewNodes = Int32Array.from(picked)
    dewGeometry.dispose()
    dewGeometry = new THREE.BufferGeometry()
    const dewPositions = new Float32Array(dewCount * 3)
    const dewSizes = new Float32Array(dewCount)
    const dewKinds = new Float32Array(dewCount).fill(1)
    const dewSeeds = new Float32Array(dewCount)

    for (let i = 0; i < dewCount; i++) {
      dewSizes[i] = 0.006 + random() * 0.012
      dewSeeds[i] = random()
    }

    dewGeometry.setAttribute("position", new THREE.BufferAttribute(dewPositions, 3).setUsage(THREE.DynamicDrawUsage))
    dewGeometry.setAttribute("aSize", new THREE.BufferAttribute(dewSizes, 1))
    dewGeometry.setAttribute("aKind", new THREE.BufferAttribute(dewKinds, 1))
    dewGeometry.setAttribute("aSeed", new THREE.BufferAttribute(dewSeeds, 1))
    dewPoints.geometry = dewGeometry
  }

  function uploadWeb() {
    const starts = threadGeometry.getAttribute("aStart") as THREE.BufferAttribute
    const ends = threadGeometry.getAttribute("aEnd") as THREE.BufferAttribute
    const info = threadGeometry.getAttribute("aInfo") as THREE.BufferAttribute
    const startArray = starts.array as Float32Array
    const endArray = ends.array as Float32Array
    const infoArray = info.array as Float32Array
    const { pos, segA, segB, segAlive, segCount } = web

    for (let s = 0; s < segCount; s++) {
      const a = segA[s] * 3
      const b = segB[s] * 3
      const alive = segAlive[s]

      for (let v = 0; v < 4; v++) {
        const o = s * 12 + v * 3

        startArray[o] = pos[a]
        startArray[o + 1] = pos[a + 1]
        startArray[o + 2] = pos[a + 2]
        endArray[o] = pos[b]
        endArray[o + 1] = pos[b + 1]
        endArray[o + 2] = pos[b + 2]
        infoArray[o + 2] = alive
      }
    }

    starts.needsUpdate = true
    ends.needsUpdate = true
    info.needsUpdate = true

    const dew = dewGeometry.getAttribute("position") as THREE.BufferAttribute
    const dewArray = dew.array as Float32Array

    for (let i = 0; i < dewNodes.length; i++) {
      const node = dewNodes[i] * 3

      dewArray[i * 3] = pos[node]
      dewArray[i * 3 + 1] = pos[node + 1]
      dewArray[i * 3 + 2] = pos[node + 2] + 0.004
    }

    dew.needsUpdate = true
  }

  rebuildGeometry()

  // Курсор: луч в плоскость паутины (в локальных координатах группы).
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(10, 10)
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const hit = new THREE.Vector3()
  const inverse = new THREE.Matrix4()
  const grab: Grab = { x: 0, y: 0, z: 0, node: -1, active: false, hover: false }
  const parallax = new THREE.Vector2(0, 0)
  const parallaxTarget = new THREE.Vector2(0, 0)

  function updatePointer(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect()

    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
    parallaxTarget.set(pointer.x, pointer.y)
    raycaster.setFromCamera(pointer, camera)
    group.updateMatrixWorld()
    plane.normal.set(0, 0, 1).applyQuaternion(group.quaternion)
    plane.constant = -plane.normal.dot(group.position)

    if (raycaster.ray.intersectPlane(plane, hit)) {
      inverse.copy(group.matrixWorld).invert()
      hit.applyMatrix4(inverse)
      grab.x = hit.x
      grab.y = hit.y
      grab.z = hit.z
      grab.hover = true
    } else {
      grab.hover = false
    }
  }

  function nearestNode(x: number, y: number, radius: number) {
    const { pos, count, invMass } = web
    let best = -1
    let bestDistance = radius

    for (let i = 0; i < count; i++) {
      if (invMass[i] === 0) continue

      const distance = Math.hypot(pos[i * 3] - x, pos[i * 3 + 1] - y)

      if (distance < bestDistance) {
        bestDistance = distance
        best = i
      }
    }

    return best
  }

  function preyAt(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    let best = -1
    let bestDistance = 28

    preyScreen.forEach((point, index) => {
      const distance = Math.hypot(point.x - x, point.y - y)

      if (distance < bestDistance) {
        bestDistance = distance
        best = index
      }
    })

    return best
  }

  const onMove = (event: PointerEvent) => {
    updatePointer(event)
    hoverPrey = grab.active ? -1 : preyAt(event)
    if (grab.hover) for (const fly of flies) fly.startle(grab.x, grab.y)
    canvas.style.cursor = grab.active ? "grabbing" : hoverPrey >= 0 ? "pointer" : nearestNode(grab.x, grab.y, PICK_RADIUS) >= 0 ? "grab" : "default"
  }
  const onDown = (event: PointerEvent) => {
    if (event.button !== 0) return

    updatePointer(event)
    const prey = preyAt(event)

    if (prey >= 0) {
      for (const callback of openCallbacks) callback(prey)

      return
    }

    const node = nearestNode(grab.x, grab.y, PICK_RADIUS)

    if (node < 0) return

    grab.node = node
    grab.active = true
    controls.enabled = false
    canvas.setPointerCapture(event.pointerId)
    canvas.style.cursor = "grabbing"
  }
  const onUp = () => {
    grab.active = false
    grab.node = -1
    controls.enabled = options.orbit
    canvas.style.cursor = "default"
  }
  const onLeave = () => {
    hoverPrey = -1
    grab.hover = false
    parallaxTarget.set(0, 0)
  }

  canvas.addEventListener("pointermove", onMove)
  canvas.addEventListener("pointerdown", onDown)
  canvas.addEventListener("pointerup", onUp)
  canvas.addEventListener("pointercancel", onUp)
  canvas.addEventListener("pointerleave", onLeave)

  // Размер: буферы под DPR, свет на половине.
  function resize() {
    const width = Math.max(1, host.clientWidth)
    const height = Math.max(1, host.clientHeight)

    renderer.setSize(width, height, false)
    renderer.getDrawingBufferSize(size)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    threadMaterial.uniforms.uMinPx.value = camera.aspect < 1 ? 1.4 : 1.1
    shotDirty = true
    rtScene.setSize(size.x, size.y)
    rtLight.setSize(Math.max(1, Math.floor(size.x * 0.4)), Math.max(1, Math.floor(size.y * 0.4)))
    bloom.setSize(Math.floor(size.x * 0.5), Math.floor(size.y * 0.5))
    threadMaterial.uniforms.uResolution.value.copy(size)
    pointMaterial.uniforms.uPixelHeight.value = size.y
    dustMaterial.uniforms.uPixelHeight.value = size.y
    lightMaterial.uniforms.uTexel.value.set(1 / rtLight.width, 1 / rtLight.height)
  }

  const observer = new ResizeObserver(resize)

  observer.observe(host)
  resize()

  // Кадр: физика фиксированным шагом, качество по времени кадра.
  let visible = true
  let frame = 0
  let last = performance.now()
  let accumulator = 0
  let slowFrames = 0
  let quality = 1
  let skipFrame = false
  const swayOffset = new THREE.Vector3()
  const swayPrevious = new THREE.Vector3()
  const sunScreen = new THREE.Vector3()
  const pinCallbacks: ((points: { x: number; y: number }[], width: number, height: number) => void)[] = []
  const openCallbacks: ((index: number) => void)[] = []
  let focusIndex: number | null = null
  let openIndex: number | null = null
  let hoverPrey = -1
  const preyScreen: { x: number; y: number }[] = []

  function render(now: number) {
    frame = requestAnimationFrame(render)

    if (!visible) return

    const dt = Math.min(0.05, (now - last) / 1000)

    last = now

    if (dt > 0.03) slowFrames += 1
    else slowFrames = Math.max(0, slowFrames - 1)
    if (slowFrames > 40 && quality === 1) {
      quality = 0
      lightMaterial.uniforms.uQuality.value = 0
      renderer.setPixelRatio(1)
      resize()
    }

    // Слабое железо: рисуем через кадр, физика идёт своим шагом.
    if (quality === 0) {
      skipFrame = !skipFrame
      if (skipFrame) {
        accumulator += dt
        return
      }
    }

    accumulator += dt
    let steps = 0

    while (accumulator >= 1 / 60 && steps < 2) {
      time += 1 / 60
      const lit = focusIndex ?? (hoverPrey >= 0 ? hoverPrey : null)
      const kicks: Kick[] = lit !== null && web.preyNodes[lit] !== undefined ? [{ node: web.preyNodes[lit], fx: Math.sin(time * 18) * 0.5, fy: Math.cos(time * 13) * 0.4, fz: Math.sin(time * 11) * 0.3 }] : []

      for (const fly of flies) fly.kick(kicks, time)
      stepWeb(web, 1 / 60, time, options.reducedMotion ? 0 : windForce, grab, kicks)
      for (const fly of flies) fly.step(1 / 60, time)
      accumulator -= 1 / 60
      steps += 1
    }

    fade = Math.min(1, fade + dt * 1.4)
    threadMaterial.uniforms.uFade.value = fade
    pointMaterial.uniforms.uFade.value = fade
    dustMaterial.uniforms.uFade.value = 1
    pointMaterial.uniforms.uTime.value = time
    dustMaterial.uniforms.uTime.value = time
    finalMaterial.uniforms.uTime.value = options.reducedMotion ? 1 : time
    uploadWeb()

    // Пыль плывёт по ветру и оборачивается.
    if (!options.reducedMotion) {
      const drift = 0.03 + windForce * 0.05

      for (let i = 0; i < dustCount; i++) {
        const o = i * 3
        const v = dustVelocity[i]

        dustPositions[o] += drift * v * dt * 0.6 + Math.sin(time * 0.3 + i * 2.1) * dt * 0.045
        dustPositions[o + 1] += Math.sin(time * 0.5 + i) * dt * 0.03
        dustPositions[o + 2] -= drift * v * dt * 0.4
        if (dustPositions[o] > 1.55) dustPositions[o] = -1.55
        if (dustPositions[o + 2] < -0.35) dustPositions[o + 2] = 1.35
      }

      ;(dustGeometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true
    }

    // Коконы: позиция из узла, лёгкое покачивание, подсветка с плавностью.
    preyMaterial.uniforms.uTime.value = time
    const lit = focusIndex ?? (hoverPrey >= 0 ? hoverPrey : null)

    for (let i = 0; i < web.preyNodes.length; i++) {
      const node = web.preyNodes[i] * 3
      const targetGlow = lit === i || openIndex === i ? 1 : 0
      const targetDim = lit === null && openIndex === null ? 1 : lit === i || openIndex === i ? 1 : 0.25

      preyGlow[i] += (targetGlow - preyGlow[i]) * Math.min(1, dt * 9)
      preyDim[i] += (targetDim - preyDim[i]) * Math.min(1, dt * 5)
      preyPosition.set(web.pos[node], web.pos[node + 1], web.pos[node + 2])
      const swing = preyTilt[i]
      const vx = web.pos[node] - web.prev[node]

      preyQuaternion.setFromEuler(swing)
      preyQuaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), vx * 40 + Math.sin(time * 1.3 + i) * 0.06))
      const scale = 1 + (openIndex === i ? 0.18 : 0) + preyGlow[i] * 0.06
      preyScale.set(scale, scale, scale)
      preyMatrix.compose(preyPosition, preyQuaternion, preyScale)
      preyMesh.setMatrixAt(i, preyMatrix)
    }

    preyMesh.instanceMatrix.needsUpdate = true
    ;(preyGeometry.getAttribute("aGlow") as THREE.BufferAttribute).needsUpdate = true
    ;(preyGeometry.getAttribute("aDim") as THREE.BufferAttribute).needsUpdate = true

    // Камера: ракурс держат контролы (орбита с демпфированием), поверх —
    // покачивание и лёгкий параллакс за курсором; в портрете дальше.
    parallax.lerp(parallaxTarget, 0.04)
    if (shotDirty) {
      const push = camera.aspect < 1 ? 1.3 + (1 - camera.aspect) * 0.8 : 1

      controls.target.copy(cameraTarget)
      camera.position.copy(cameraTarget).addScaledVector(new THREE.Vector3().subVectors(cameraBase, cameraTarget), push)
      shotDirty = false
    }

    controls.update()
    const sway = options.reducedMotion ? 0 : 0.0055

    camera.position.add(swayOffset.set(parallax.x * 0.1 + Math.sin(time * 0.37) * sway * 6, parallax.y * 0.06 + Math.sin(time * 0.53 + 1) * sway * 4, 0).sub(swayPrevious))
    swayPrevious.set(parallax.x * 0.1 + Math.sin(time * 0.37) * sway * 6, parallax.y * 0.06 + Math.sin(time * 0.53 + 1) * sway * 4, 0)
    camera.updateMatrixWorld()
    glow.lookAt(camera.position)
    beam.lookAt(camera.position.x, beam.position.y, camera.position.z)
    pool.lookAt(camera.position.x, pool.position.y, camera.position.z)
    beamMaterial.uniforms.uTime.value = time
    threadMaterial.uniforms.uCamera.value.copy(camera.position)
    threadMaterial.uniforms.uTime.value = time
    threadMaterial.uniforms.uWanderPos.value.set(Math.cos(time * 0.31) * 1.5, 0.25 + Math.sin(time * 0.21) * 0.9, 1 + Math.sin(time * 0.43) * 0.45)
    pointMaterial.uniforms.uFocus.value = camera.position.length()
    dustMaterial.uniforms.uFocus.value = camera.position.length()

    sunScreen.copy(sunPosition).project(camera)
    lightMaterial.uniforms.uSun.value.set(sunScreen.x * 0.5 + 0.5, sunScreen.y * 0.5 + 0.5)

    renderer.setRenderTarget(rtScene)
    renderer.clear()
    renderer.render(scene, camera)
    bloom.render(renderer, rtScene, rtScene, dt, false)
    renderer.setRenderTarget(rtLight)
    lightQuad.render(renderer)
    renderer.setRenderTarget(null)
    finalQuad.render(renderer)

    // Экранные координаты коконов: наведение курсором и карточка.
    preyScreen.length = 0

    for (let i = 0; i < web.preyNodes.length; i++) {
      const node = web.preyNodes[i] * 3
      const point = new THREE.Vector3(web.pos[node], web.pos[node + 1], web.pos[node + 2]).applyMatrix4(group.matrixWorld).project(camera)

      preyScreen.push({ x: (point.x * 0.5 + 0.5) * host.clientWidth, y: (-point.y * 0.5 + 0.5) * host.clientHeight })
    }

    for (const callback of pinCallbacks) callback(preyScreen, host.clientWidth, host.clientHeight)
  }

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && document.visibilityState === "visible"
    last = performance.now()
  })

  intersection.observe(host)
  const onVisibility = () => {
    visible = document.visibilityState === "visible"
    last = performance.now()
  }

  document.addEventListener("visibilitychange", onVisibility)
  frame = requestAnimationFrame(render)

  return {
    dispose() {
      cancelAnimationFrame(frame)
      observer.disconnect()
      intersection.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
      canvas.removeEventListener("pointerleave", onLeave)
      threadGeometry.dispose()
      dewGeometry.dispose()
      dustGeometry.dispose()
      threadMaterial.dispose()
      pointMaterial.dispose()
      dustMaterial.dispose()
      glowMaterial.dispose()
      glow.geometry.dispose()
      beam.geometry.dispose()
      beamMaterial.dispose()
      pool.geometry.dispose()
      poolMaterial.dispose()
      controls.dispose()
      canvas.removeEventListener("wheel", onWheelGate, { capture: true })
      preyGeometry.dispose()
      preyMaterial.dispose()
      chitinMaterial.dispose()
      eyeMaterial.dispose()
      wingMaterial.dispose()
      for (const fly of flies) fly.dispose()
      lightMaterial.dispose()
      finalMaterial.dispose()
      lightQuad.dispose()
      finalQuad.dispose()
      bloom.dispose()
      rtScene.dispose()
      rtLight.dispose()
      renderer.dispose()
    },
    respin() {
      seed = (seed * 1664525 + 1013904223) >>> 0
      web = buildWeb(seed, options.sites)
      fade = 0
      rebuildGeometry()
      dealShot(seed)
      shotDirty = true
    },
    setPalette(next) {
      palette = PALETTES[next]
      threadMaterial.uniforms.uKeyColor.value = vec3(palette.key)
      threadMaterial.uniforms.uRimColor.value = vec3(palette.rim)
      threadMaterial.uniforms.uWanderColor.value = vec3(palette.dew)
      dustMaterial.uniforms.uHazeColor.value = vec3(palette.haze)
      beamMaterial.uniforms.uColor.value = vec3(palette.haze)
      poolMaterial.uniforms.uColor.value = vec3(palette.dust).lerp(new THREE.Vector3(1, 1, 1), 0.45)
      pointMaterial.uniforms.uColor.value = vec3(palette.dust)
      pointMaterial.uniforms.uDewColor.value = vec3(palette.dew)
      dustMaterial.uniforms.uColor.value = vec3(palette.dust)
      dustMaterial.uniforms.uDewColor.value = vec3(palette.dew)
      glowMaterial.uniforms.uColor.value = vec3(palette.sun)
      lightMaterial.uniforms.uStreakTint.value = vec3(palette.streak)
      lightMaterial.uniforms.uHalationTint.value = vec3(palette.halation)
      preyMaterial.uniforms.uKeyColor.value = vec3(palette.key)
      preyMaterial.uniforms.uRimColor.value = vec3(palette.rim)
    },
    setWind(value) {
      windForce = value
    },
    setFocus(index) {
      focusIndex = index
    },
    setOpen(index) {
      openIndex = index
    },
    onPin(callback) {
      pinCallbacks.push(callback)
    },
    onOpen(callback) {
      openCallbacks.push(callback)
    },
  }
}

/** Паутина: портфолио-сцена на three.js — нити с физикой, роса, свет, коконы-работы. Зависимость: three. */
export function Folio002({
  title = "Сайт-паутина",
  subtitle = "сайт, который и есть паутина",
  caption = "Пойманы в сеть",
  sites = DEFAULT_SITES,
  palette = "moonlight",
  wind = 1,
  flies = 3,
  seed = 1,
  orbit = true,
  className,
  style,
}: Folio002Props) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<Scene | null>(null)
  const [supported, setSupported] = useState(true)
  const [focus, setFocus] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [pins, setPins] = useState<{ x: number; y: number }[]>([])
  const [box, setBox] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!host.current || !canvas.current) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const scene = createScene(host.current, canvas.current, { seed, palette, wind, sites: sites.length, flies, orbit, reducedMotion })

    if (!scene) {
      setSupported(false)

      return
    }

    sceneRef.current = scene
    let raf = 0
    let latest: { x: number; y: number }[] = []

    // Позиции коконов в DOM — не чаще раза в кадр и только при открытой карточке.
    scene.onOpen((index) => setOpen((current) => (current === index ? null : index)))
    scene.onPin((points, width, height) => {
      latest = points
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0
          setPins(latest)
          setBox((current) => (current.width === width && current.height === height ? current : { width, height }))
        })
      }
    })

    return () => {
      cancelAnimationFrame(raf)
      scene.dispose()
      sceneRef.current = null
    }
    // Сцена живёт на seed; палитра и ветер меняются без пересборки.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, sites.length, flies, orbit])

  useEffect(() => sceneRef.current?.setPalette(palette), [palette])
  useEffect(() => sceneRef.current?.setWind(wind), [wind])
  useEffect(() => sceneRef.current?.setFocus(focus), [focus])
  useEffect(() => sceneRef.current?.setOpen(open), [open])

  const opened = open !== null ? sites[open] : null
  const pin = open !== null ? pins[open] : null
  const cardX = pin ? Math.min(Math.max(pin.x, 160), Math.max(160, box.width - 160)) : 0
  const flip = pin ? pin.y > box.height * 0.55 : false

  return (
    <>
      <style href="vibeui-folio-002" precedence="medium">
        {STYLES}
      </style>
      <link rel="stylesheet" precedence="default" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" />
      <div ref={host} data-vibeui-block="folio-002" data-palette={palette} className={className} style={style}>
        {supported ? <canvas ref={canvas} aria-hidden="true" /> : <div data-part="fallback">WebGL недоступен</div>}

        <aside data-part="panel">
          <h2>{title}</h2>
          <p data-part="subtitle">{subtitle}</p>
          <button
            type="button"
            data-part="respin"
            onClick={() => {
              setOpen(null)
              sceneRef.current?.respin()
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6" /><path d="M20 4v5h-5" /></svg>
            Сплести заново
          </button>
          <p data-part="caption">{caption}</p>
          <ol>
            {sites.map((site, index) => (
              <li key={site.title} data-focus={focus === index || open === index ? "" : undefined}>
                <button
                  type="button"
                  onPointerEnter={() => setFocus(index)}
                  onPointerLeave={() => setFocus(null)}
                  onFocus={() => setFocus(index)}
                  onBlur={() => setFocus(null)}
                  onClick={() => setOpen((current) => (current === index ? null : index))}
                >
                  <small>{String(sites.length - index).padStart(2, "0")}</small>
                  <span>{site.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {opened && pin ? (
          <div data-part="card" data-flip={flip ? "" : undefined} role="dialog" aria-label={opened.title} style={{ left: cardX, top: pin.y }}>
            <button type="button" data-part="close" aria-label="Закрыть" onClick={() => setOpen(null)}>×</button>
            <h3>{opened.title}</h3>
            {opened.note ? <small>{opened.note}</small> : null}
            {opened.description ? <p>{opened.description}</p> : null}
            {opened.url ? (
              <a href={opened.url} target="_blank" rel="noreferrer">
                Открыть ↗
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  )
}
