"use client"

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode, type RefObject } from "react"

export type Sketch021Day = {
  label: string
  note?: string
}

export type Sketch021Slot = {
  time: string
  taken?: boolean
}

export type Sketch021Props = {
  eyebrow?: string
  title?: string
  description?: string
  days?: readonly Sketch021Day[]
  slots?: readonly Sketch021Slot[]
  phoneLabel?: string
  phonePlaceholder?: string
  phoneHint?: string
  consentLabel?: string
  submitLabel?: string
  /** Что показать после отправки. */
  doneLabel?: string
  footNote?: string
  /** Куда отправить форму. Пусто — форма только показывает «готово». */
  action?: string
  /** Почерк: аккуратный или размашистый. */
  /** Подписи групп формы и занятого слота. */
  dayLegend?: string
  slotLegend?: string
  takenLabel?: string
  rough?: "neat" | "loose"
  /** Дрожание линии: покой, мягкое или живое. */
  boil?: "still" | "soft" | "lively"
  /** Зерно почерка: одно число — один и тот же рисунок. Без него — от заголовка. */
  seed?: number
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Цвет линий и кнопки. По умолчанию — цвет текста. */
  accent?: string
  /** Цвет текста. */
  ink?: string
  className?: string
  style?: CSSProperties
}

// Запись от руки: настоящая <form> в нарисованной рамке — дни и время как
// капсулы-радиокнопки (занятые перечёркнуты), телефон в рукописной рамке,
// чекбокс с галочкой в два штриха, кнопка залита чернилами. Всё рисуется
// по коробкам элементов и кипит тремя кадрами.
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

function hash(text: string) {
  let value = 2166136261

  for (let index = 0; index < text.length; index += 1) {
    value = Math.imul(value ^ text.charCodeAt(index), 16777619)
  }

  return value >>> 0
}

function sketch(points: Point[], seed: number, rough: number, boil: number, closed = false) {
  const base = random(seed)
  const shake = (amount: number, next: () => number) => (next() - 0.5) * 2 * amount
  const anchors = points.map(([x, y]) => [x + shake(rough, base), y + shake(rough, base)] as Point)

  if (closed && anchors.length > 1) {
    anchors.push([anchors[0][0] + shake(rough * 0.4, base), anchors[0][1] + shake(rough * 0.4, base)])
  }

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

function rectPoints(w: number, h: number, inset: number, radius: number, step = 14): Point[] {
  const x0 = inset
  const y0 = inset
  const x1 = w - inset
  const y1 = h - inset
  const r = Math.min(radius, (x1 - x0) / 2, (y1 - y0) / 2)
  const points: Point[] = []
  const edge = (ax: number, ay: number, bx: number, by: number) => {
    const length = Math.hypot(bx - ax, by - ay)
    const count = Math.max(1, Math.round(length / step))

    for (let index = 0; index < count; index += 1) {
      const t = index / count

      points.push([ax + (bx - ax) * t, ay + (by - ay) * t])
    }
  }
  const corner = (cx: number, cy: number, from: number) => {
    for (let index = 0; index <= 2; index += 1) {
      const angle = from + (Math.PI / 2) * (index / 2)

      points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r])
    }
  }

  edge(x0 + r, y0, x1 - r, y0)
  corner(x1 - r, y0 + r, -Math.PI / 2)
  edge(x1, y0 + r, x1, y1 - r)
  corner(x1 - r, y1 - r, 0)
  edge(x1 - r, y1, x0 + r, y1)
  corner(x0 + r, y1 - r, Math.PI / 2)
  edge(x0, y1 - r, x0, y0 + r)
  corner(x0 + r, y0 + r, Math.PI)

  return points
}

function useSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const element = ref.current

    if (!element) return

    const observer = new ResizeObserver(() => {
      const w = element.offsetWidth
      const h = element.offsetHeight

      setSize((current) => (current.w === w && current.h === h ? current : { w, h }))
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [ref])

  return size
}

type Layer = { frames: string[]; part: string }

function Ink({ w, h, layers }: { w: number; h: number; layers: Layer[] }) {
  if (w === 0 || h === 0) return null

  return (
    <svg data-part="ink" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {layers.map((layer, index) =>
        layer.frames.map((d, frame) => <path key={`${index}-${frame}`} d={d} data-part={layer.part} data-i={frame} />),
      )}
    </svg>
  )
}

const ROUGH = { neat: 0.8, loose: 1.8 } as const
const BOIL = { still: 0, soft: 0.7, lively: 1.4 } as const

/** Любой элемент в нарисованной рамке: измеряет себя и рисует контур по коробке. */
function Frame({
  part,
  seed,
  rough,
  boil,
  radius = 10,
  fill = false,
  shadow = false,
  strike = false,
  children,
}: {
  part: string
  seed: number
  rough: number
  boil: number
  radius?: number
  fill?: boolean
  shadow?: boolean
  /** Перечёркнуть по диагонали — для занятого времени. */
  strike?: boolean
  children: ReactNode
}) {
  const host = useRef<HTMLSpanElement>(null)
  const { w, h } = useSize(host)
  const line = sketch(rectPoints(w, h, 2, radius, 12), seed, rough, boil, true)
  const layers: Layer[] = []

  if (shadow) {
    layers.push({ frames: sketch(rectPoints(w, h, 2, radius, 14).map(([x, y]) => [x + 6, y + 7] as Point), seed + 2, rough * 1.2, boil, true), part: "shadow" })
  }

  if (fill) {
    layers.push({ frames: line, part: "fill" })
  }

  layers.push({ frames: line, part: "line" })

  if (strike) {
    layers.push({ frames: sketch([[6, h - 6], [w - 6, 6]], seed + 5, rough, boil), part: "strike" })
  }

  return (
    <span ref={host} data-part={part} data-filled={fill ? "" : undefined}>
      <Ink w={w} h={h} layers={layers} />
      {children}
    </span>
  )
}

const STYLES = `
:where([data-vibeui-block="sketch-021"]){
--vibeui-sketch-021-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-sketch-021-paper:light-dark(#fbf8f3,#1c1a18);
--vibeui-sketch-021-card:light-dark(#ffffff,#242220);
--vibeui-sketch-021-muted:light-dark(color-mix(in oklab,#000000 55%,#ffffff),color-mix(in oklab,#ffffff 60%,#1c1a18));
--vibeui-sketch-021-accent:var(--vibeui-sketch-021-ink);
--vibeui-sketch-021-on-accent:oklch(from var(--vibeui-sketch-021-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sketch-021-width:2;
--vibeui-sketch-021-font:"Neucha","Caveat","Segoe Print","Bradley Hand",cursive;
--vibeui-sketch-021-display:"Caveat","Neucha","Segoe Print",cursive;
--vibeui-sketch-021-frame:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sketch-021"]{color-scheme:dark}
:where([data-vibeui-block="sketch-021"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="sketch-021"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="sketch-021"]{position:relative;isolation:isolate;box-sizing:border-box;display:block;background:var(--vibeui-sketch-021-paper);color:var(--vibeui-sketch-021-ink);font-family:var(--vibeui-sketch-021-font);font-size:1.125rem;line-height:1.4}
[data-vibeui-block="sketch-021"] *{box-sizing:border-box}
[data-vibeui-block="sketch-021"] [data-part="ink"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:-1}
[data-vibeui-block="sketch-021"] path{fill:none;stroke:var(--vibeui-sketch-021-accent);stroke-width:var(--vibeui-sketch-021-width);stroke-linecap:round;stroke-linejoin:round;opacity:clamp(0,1 - (var(--vibeui-sketch-021-frame) - var(--vibeui-sketch-021-i)) * (var(--vibeui-sketch-021-frame) - var(--vibeui-sketch-021-i)),1)}
[data-vibeui-block="sketch-021"] path[data-i="0"]{--vibeui-sketch-021-i:0}
[data-vibeui-block="sketch-021"] path[data-i="1"]{--vibeui-sketch-021-i:1}
[data-vibeui-block="sketch-021"] path[data-i="2"]{--vibeui-sketch-021-i:2}
[data-vibeui-block="sketch-021"] path[data-part="fill"]{fill:var(--vibeui-sketch-021-accent);stroke-width:calc(var(--vibeui-sketch-021-width) * 2)}
[data-vibeui-block="sketch-021"] path[data-part="shadow"]{stroke:var(--vibeui-sketch-021-muted);opacity:calc(clamp(0,1 - (var(--vibeui-sketch-021-frame) - var(--vibeui-sketch-021-i)) * (var(--vibeui-sketch-021-frame) - var(--vibeui-sketch-021-i)),1) * 0.35)}
[data-vibeui-block="sketch-021"] path[data-part="strike"]{stroke:var(--vibeui-sketch-021-muted)}
@property --vibeui-sketch-021-frame{syntax:"<integer>";inherits:true;initial-value:0}
[data-vibeui-block="sketch-021"][data-boil] svg{animation:vibeui-sketch-021-boil 1.2s step-end infinite}
@keyframes vibeui-sketch-021-boil{0%{--vibeui-sketch-021-frame:0}33.33%{--vibeui-sketch-021-frame:1}66.67%{--vibeui-sketch-021-frame:2}}
[data-vibeui-block="sketch-021"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3.5rem 1.5rem;display:grid;gap:2.5rem;align-items:start}
[data-vibeui-block="sketch-021"] [data-part="eyebrow"]{margin:0 0 .75rem;font-family:var(--vibeui-sketch-021-display);font-size:1.25rem;color:var(--vibeui-sketch-021-accent)}
[data-vibeui-block="sketch-021"] [data-part="title"]{margin:0 0 1rem;font-family:var(--vibeui-sketch-021-display);font-weight:700;font-size:clamp(2.25rem,5.5cqi,3.75rem);line-height:1;text-wrap:balance}
[data-vibeui-block="sketch-021"] [data-part="description"]{margin:0;max-width:30rem;font-size:1.2rem;color:var(--vibeui-sketch-021-muted)}
/* Форма — лист с тенью, чуть повёрнутый; поля ровные внутри. */
[data-vibeui-block="sketch-021"] [data-part="card"]{position:relative;isolation:isolate;display:block;padding:1.5rem 1.5rem 1.75rem;background:var(--vibeui-sketch-021-card);transform:rotate(.6deg)}
[data-vibeui-block="sketch-021"] [data-part="card"] > form{transform:rotate(-.6deg)}
[data-vibeui-block="sketch-021"] fieldset{margin:0 0 1.25rem;padding:0;border:0;min-width:0}
[data-vibeui-block="sketch-021"] legend,[data-vibeui-block="sketch-021"] [data-part="label"]{display:block;padding:0;margin:0 0 .5rem;font-family:var(--vibeui-sketch-021-display);font-size:1.3rem;font-weight:600;line-height:1}
[data-vibeui-block="sketch-021"] [data-part="row"]{display:flex;flex-wrap:wrap;gap:.6rem}
[data-vibeui-block="sketch-021"] [data-part="grid"]{display:grid;grid-template-columns:repeat(auto-fill,minmax(5.5rem,1fr));gap:.6rem}
[data-vibeui-block="sketch-021"] [data-part="option"]{position:relative;display:block;cursor:pointer}
[data-vibeui-block="sketch-021"] [data-part="option"] input{position:absolute;inset:0;opacity:0;margin:0;cursor:inherit}
[data-vibeui-block="sketch-021"] [data-part="chip"],[data-vibeui-block="sketch-021"] [data-part="slot"]{position:relative;isolation:isolate;display:grid;justify-items:center;gap:.1rem;padding:.55rem .9rem .6rem;min-width:5.5rem;text-align:center;line-height:1.05;transition:transform .2s}
[data-vibeui-block="sketch-021"] [data-part="slot"]{padding:.7rem .5rem}
[data-vibeui-block="sketch-021"] [data-part="option"]:hover [data-part="chip"],[data-vibeui-block="sketch-021"] [data-part="option"]:hover [data-part="slot"]{transform:rotate(-1.5deg)}
[data-vibeui-block="sketch-021"] [data-part="option"] input:focus-visible ~ [data-part="chip"],[data-vibeui-block="sketch-021"] [data-part="option"] input:focus-visible ~ [data-part="slot"]{outline:2px dashed var(--vibeui-sketch-021-accent);outline-offset:3px}
[data-vibeui-block="sketch-021"] [data-part="chip"] b,[data-vibeui-block="sketch-021"] [data-part="slot"] b{font-family:var(--vibeui-sketch-021-display);font-size:1.3rem;font-weight:600}
[data-vibeui-block="sketch-021"] [data-part="chip"] small,[data-vibeui-block="sketch-021"] [data-part="slot"] small{font-size:.85rem;color:var(--vibeui-sketch-021-muted)}
[data-vibeui-block="sketch-021"] [data-filled]{color:var(--vibeui-sketch-021-on-accent)}
[data-vibeui-block="sketch-021"] [data-filled] small{color:inherit;opacity:.8}
[data-vibeui-block="sketch-021"] [data-part="option"][data-taken]{cursor:not-allowed;opacity:.55}
[data-vibeui-block="sketch-021"] [data-part="field"]{position:relative;isolation:isolate;display:block;margin:0 0 .35rem}
[data-vibeui-block="sketch-021"] [data-part="field"] input{width:100%;padding:.7rem 1rem;border:0;background:transparent;font:inherit;font-size:1.15rem;color:inherit;outline:none}
[data-vibeui-block="sketch-021"] [data-part="field"] input::placeholder{color:var(--vibeui-sketch-021-muted);opacity:.7}
[data-vibeui-block="sketch-021"] [data-part="field"]:focus-within path{stroke-width:calc(var(--vibeui-sketch-021-width) * 1.5)}
[data-vibeui-block="sketch-021"] [data-part="hint"]{display:block;margin:0 0 1.25rem;font-size:.95rem;color:var(--vibeui-sketch-021-muted)}
[data-vibeui-block="sketch-021"] [data-part="consent"]{display:flex;gap:.7rem;align-items:flex-start;margin:0 0 1.5rem;font-size:1rem;color:var(--vibeui-sketch-021-muted);cursor:pointer;position:relative}
[data-vibeui-block="sketch-021"] [data-part="consent"] input{position:absolute;opacity:0;width:1px;height:1px}
[data-vibeui-block="sketch-021"] [data-part="box"]{position:relative;isolation:isolate;flex:none;width:1.5rem;height:1.5rem;margin-top:.05rem}
[data-vibeui-block="sketch-021"] [data-part="box"] [data-part="tick"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible;opacity:0;transform:scale(.6);transition:opacity .15s,transform .2s cubic-bezier(.3,1.4,.4,1)}
[data-vibeui-block="sketch-021"] [data-part="consent"] input:checked ~ [data-part="box"] [data-part="tick"]{opacity:1;transform:none}
[data-vibeui-block="sketch-021"] [data-part="consent"] input:focus-visible ~ [data-part="box"]{outline:2px dashed var(--vibeui-sketch-021-accent);outline-offset:3px}
[data-vibeui-block="sketch-021"] [data-part="tick"] path{stroke-width:2.6}
[data-vibeui-block="sketch-021"] [data-part="submit-frame"]{position:relative;isolation:isolate;display:block}
[data-vibeui-block="sketch-021"] [data-part="submit"]{position:relative;isolation:isolate;display:block;width:100%;padding:.85rem 1.5rem .95rem;border:0;background:none;font:inherit;font-family:var(--vibeui-sketch-021-display);font-size:1.6rem;font-weight:700;line-height:1;color:var(--vibeui-sketch-021-on-accent);cursor:pointer;transition:transform .2s}
[data-vibeui-block="sketch-021"] [data-part="submit"]:hover{transform:rotate(-1deg) translateY(-1px)}
[data-vibeui-block="sketch-021"] [data-part="submit"]:focus-visible{outline:2px dashed var(--vibeui-sketch-021-accent);outline-offset:4px}
[data-vibeui-block="sketch-021"] [data-part="submit"] [data-part="ink"]{z-index:-1}
[data-vibeui-block="sketch-021"] [data-part="foot"]{margin:1rem 0 0;font-size:.95rem;color:var(--vibeui-sketch-021-muted)}
[data-vibeui-block="sketch-021"] [data-part="done"]{margin:0;padding:2rem 0;font-family:var(--vibeui-sketch-021-display);font-size:2rem;text-align:center}
@container (min-width: 52rem){
[data-vibeui-block="sketch-021"] [data-part="shell"]{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:4rem;padding:5rem 2.5rem}
[data-vibeui-block="sketch-021"] [data-part="card"]{padding:2rem 2.25rem 2.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sketch-021"] svg{animation:none!important}[data-vibeui-block="sketch-021"] *{transition:none!important}}`

const DEFAULT_DAYS: Sketch021Day[] = [
  { label: "Сегодня", note: "14 мая" },
  { label: "Завтра", note: "15 мая" },
  { label: "Пятница", note: "16 мая" },
]

const DEFAULT_SLOTS: Sketch021Slot[] = [
  { time: "10:00" },
  { time: "11:00", taken: true },
  { time: "12:00" },
  { time: "14:00" },
  { time: "15:00", taken: true },
  { time: "16:00" },
  { time: "17:00" },
  { time: "18:00" },
]

/** Запись от руки: настоящая форма в нарисованной рамке с капсулами дней и времени. */
export function Sketch021({
  eyebrow = "Запись",
  title = "Выберите день, я перезвоню",
  description = "Пятнадцать минут по телефону: обсудим идею, место и что взять с собой.",
  days = DEFAULT_DAYS,
  slots = DEFAULT_SLOTS,
  phoneLabel = "Телефон",
  phonePlaceholder = "+7 999 123-45-67",
  phoneHint = "Можно с кодом страны. Маску не ставлю: она ломает вставку из буфера.",
  consentLabel = "Согласна на звонок по этому номеру.",
  submitLabel = "Записаться",
  doneLabel = "Записала. Перезвоню в выбранное время.",
  footNote = "Отвечаю в тот же день. Переносы без вопросов.",
  action = "",
  dayLegend = "День",
  slotLegend = "Время звонка",
  takenLabel = "занято",
  rough = "loose",
  boil = "soft",
  seed,
  tone = "auto",
  accent,
  ink,
  className,
  style,
}: Sketch021Props) {
  const id = useId()
  const base = seed ?? hash(title)
  const roughness = ROUGH[rough] ?? ROUGH.loose
  const shake = BOIL[boil] ?? BOIL.soft
  const [day, setDay] = useState(0)
  const [slot, setSlot] = useState(() => slots.findIndex((item) => !item.taken))
  const [done, setDone] = useState(false)
  const tick = sketch([[4, 12], [10, 18], [21, 4]], base + 7, roughness * 0.8, shake * 0.8)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (action) return

    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-sketch-021-accent": accent } : null),
    ...(ink ? { "--vibeui-sketch-021-ink": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-sketch-021" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="sketch-021"
        data-tone={tone === "auto" ? undefined : tone}
        data-boil={shake > 0 ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {description ? <p data-part="description">{description}</p> : null}
          </div>
          <Frame part="card" seed={base + 1} rough={roughness} boil={shake} radius={8} shadow>
            {done ? (
              <p data-part="done">{doneLabel}</p>
            ) : (
              <form action={action || undefined} method={action ? "post" : undefined} onSubmit={submit}>
                <fieldset>
                  <legend>{dayLegend}</legend>
                  <div data-part="row">
                    {days.map((item, index) => (
                      <label key={item.label} data-part="option">
                        <input type="radio" name="day" value={item.label} checked={day === index} onChange={() => setDay(index)} />
                        <Frame part="chip" seed={base + 10 + index} rough={roughness} boil={shake} radius={14} fill={day === index}>
                          <b>{item.label}</b>
                          {item.note ? <small>{item.note}</small> : null}
                        </Frame>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend>{slotLegend}</legend>
                  <div data-part="grid">
                    {slots.map((item, index) => (
                      <label key={item.time} data-part="option" data-taken={item.taken ? "" : undefined}>
                        <input type="radio" name="slot" value={item.time} disabled={item.taken} checked={slot === index} onChange={() => setSlot(index)} />
                        <Frame part="slot" seed={base + 30 + index} rough={roughness} boil={shake} radius={8} fill={slot === index} strike={item.taken}>
                          <b>{item.time}</b>
                          {item.taken ? <small>{takenLabel}</small> : null}
                        </Frame>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label htmlFor={`${id}-phone`} data-part="label">
                  {phoneLabel}
                </label>
                <Frame part="field" seed={base + 60} rough={roughness} boil={shake} radius={10}>
                  <input id={`${id}-phone`} type="tel" name="phone" required inputMode="tel" autoComplete="tel" placeholder={phonePlaceholder} />
                </Frame>
                {phoneHint ? <span data-part="hint">{phoneHint}</span> : null}

                <label data-part="consent">
                  <input type="checkbox" name="consent" required />
                  <Frame part="box" seed={base + 70} rough={roughness} boil={shake} radius={4}>
                    <svg data-part="tick" viewBox="0 0 24 24" aria-hidden="true">
                      {tick.map((d, frame) => (
                        <path key={frame} d={d} data-i={frame} />
                      ))}
                    </svg>
                  </Frame>
                  <span>{consentLabel}</span>
                </label>

                <Frame part="submit-frame" seed={base + 80} rough={roughness} boil={shake} radius={14} fill>
                  <button type="submit" data-part="submit">
                    {submitLabel}
                  </button>
                </Frame>
                {footNote ? <p data-part="foot">{footNote}</p> : null}
              </form>
            )}
          </Frame>
        </div>
      </section>
    </>
  )
}
