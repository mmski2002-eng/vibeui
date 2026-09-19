"use client"

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react"

export type Language003Milestone = {
  week: number
  /** Что человек уже может: «заказать ужин и поспорить о счёте». */
  can: string
}

export type Language003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Словарный запас по неделям: элемент 0 — старт, последний — конец курса. */
  words?: readonly number[]
  milestones?: readonly Language003Milestone[]
  /** Неделя, на которой стоит ползунок при загрузке. */
  defaultWeek?: number
  lessonsPerWeek?: number
  /** Минут разговора за занятие — для счётчика. */
  speakingMinutes?: number
  wordsLabel?: string
  lessonsLabel?: string
  minutesLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Прогресс за три месяца» — интерактивный график словарного запаса на
// тетрадной линовке. Линия рисуется, когда блок попадает в экран
// (IntersectionObserver + stroke-dashoffset через pathLength), под ней
// проявляется заливка. Ползунок недель двигает точку по кривой — вместе с
// ней едут вертикальная направляющая и подпись с числом слов, а слева
// пересчитываются счётчики и меняется рукописная фраза «к этой неделе вы
// уже можете…». Вехи отмечены кружками на линии.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="language-003"]){
--vibeui-language-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-language-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-language-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-language-003-on-accent:oklch(from var(--vibeui-language-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-language-003-muted:color-mix(in oklab,var(--vibeui-language-003-fg) 62%,var(--vibeui-language-003-bg));
--vibeui-language-003-line:color-mix(in oklab,var(--vibeui-language-003-fg) 12%,transparent);
--vibeui-language-003-rule:color-mix(in oklab,var(--vibeui-language-003-fg) 9%,transparent);
--vibeui-language-003-paper:color-mix(in oklab,var(--vibeui-language-003-bg) 92%,#fff);
--vibeui-language-003-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-language-003-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-language-003-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="language-003"]{color-scheme:dark}
:where([data-vibeui-block="language-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="language-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="language-003"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-language-003-bg);color:var(--vibeui-language-003-fg);font-family:var(--vibeui-language-003-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="language-003"] *{box-sizing:border-box}
[data-vibeui-block="language-003"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="language-003"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-language-003-hand);font-size:1.4rem;color:var(--vibeui-language-003-accent)}
[data-vibeui-block="language-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-language-003-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="language-003"] [data-part="lede"]{margin:1rem 0 0;max-width:28rem;color:var(--vibeui-language-003-muted)}
[data-vibeui-block="language-003"] [data-part="stats"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem;margin:1.6rem 0 0;padding:0;list-style:none}
[data-vibeui-block="language-003"] [data-part="stats"] li{padding:.9rem .9rem;border-radius:1rem;background:var(--vibeui-language-003-paper);border:1px solid var(--vibeui-language-003-line)}
[data-vibeui-block="language-003"] [data-part="stats"] b{display:block;font-family:var(--vibeui-language-003-display);font-weight:800;font-size:clamp(1.4rem,3cqi,2rem);line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:var(--vibeui-language-003-accent)}
[data-vibeui-block="language-003"] [data-part="stats"] span{display:block;margin-top:.3rem;font-size:.75rem;color:var(--vibeui-language-003-muted)}
[data-vibeui-block="language-003"] [data-part="can"]{position:relative;margin:1.4rem 0 0;padding:.9rem 1rem .9rem 2.4rem;font-family:var(--vibeui-language-003-hand);font-size:1.35rem;line-height:1.3;color:var(--vibeui-language-003-fg);background-image:repeating-linear-gradient(180deg,transparent 0 calc(1.75rem - 1px),var(--vibeui-language-003-rule) calc(1.75rem - 1px) 1.75rem);border-left:2px solid color-mix(in oklab,var(--vibeui-language-003-accent) 50%,transparent)}
[data-vibeui-block="language-003"] [data-part="can"]::before{content:"→";position:absolute;left:.6rem;top:.85rem;color:var(--vibeui-language-003-accent)}
[data-vibeui-block="language-003"] [data-part="can"] q{quotes:"«" "»"}
[data-vibeui-block="language-003"] [data-part="board"]{display:grid;gap:1rem;padding:1.25rem;border-radius:1.4rem;background:var(--vibeui-language-003-paper);border:1px solid var(--vibeui-language-003-line);box-shadow:0 30px 60px -40px color-mix(in oklab,var(--vibeui-language-003-fg) 50%,transparent)}
[data-vibeui-block="language-003"] [data-part="chart"]{width:100%;height:auto;display:block;overflow:visible;font-family:var(--vibeui-language-003-font)}
[data-vibeui-block="language-003"] [data-part="rule"]{stroke:var(--vibeui-language-003-rule);stroke-width:1}
[data-vibeui-block="language-003"] [data-part="axis"]{fill:var(--vibeui-language-003-muted);font-size:11px;font-weight:500}
[data-vibeui-block="language-003"] [data-part="area"]{fill:url(#vibeui-language-003-fill);opacity:0;transition:opacity .8s ease-out 1.2s}
[data-vibeui-block="language-003"] [data-part="board"][data-visible="true"] [data-part="area"]{opacity:1}
[data-vibeui-block="language-003"] [data-part="curve"]{fill:none;stroke:var(--vibeui-language-003-accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1}
[data-vibeui-block="language-003"] [data-part="board"][data-visible="true"] [data-part="curve"]{animation:vibeui-language-003-draw 1.6s cubic-bezier(.4,0,.2,1) forwards}
[data-vibeui-block="language-003"] [data-part="milestone"]{fill:var(--vibeui-language-003-paper);stroke:var(--vibeui-language-003-accent);stroke-width:2;opacity:0;transition:opacity .4s ease-out 1.4s}
[data-vibeui-block="language-003"] [data-part="board"][data-visible="true"] [data-part="milestone"]{opacity:1}
[data-vibeui-block="language-003"] [data-part="milestone"][data-reached="true"]{fill:var(--vibeui-language-003-accent)}
[data-vibeui-block="language-003"] [data-part="cursor"]{transition:transform .45s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="language-003"] [data-part="cursor"] line{stroke:var(--vibeui-language-003-fg);stroke-width:1;stroke-dasharray:3 4;opacity:.5}
[data-vibeui-block="language-003"] [data-part="dot"]{transition:transform .45s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="language-003"] [data-part="dot"] circle{fill:var(--vibeui-language-003-accent);stroke:var(--vibeui-language-003-paper);stroke-width:3}
[data-vibeui-block="language-003"] [data-part="dot"] circle:first-child{fill:color-mix(in oklab,var(--vibeui-language-003-accent) 25%,transparent);stroke:none;transform-box:fill-box;transform-origin:center;animation:vibeui-language-003-pulse 2s ease-out infinite}
[data-vibeui-block="language-003"] [data-part="tag"]{fill:var(--vibeui-language-003-fg)}
[data-vibeui-block="language-003"] [data-part="tag"] + text{fill:var(--vibeui-language-003-bg);font-family:var(--vibeui-language-003-display);font-size:12px;font-weight:700;text-anchor:middle}
[data-vibeui-block="language-003"] [data-part="control"]{display:grid;gap:.5rem}
[data-vibeui-block="language-003"] [data-part="control"] label{display:flex;justify-content:space-between;align-items:baseline;font-size:.85rem;color:var(--vibeui-language-003-muted)}
[data-vibeui-block="language-003"] [data-part="control"] output{font-family:var(--vibeui-language-003-display);font-weight:800;font-size:1.3rem;letter-spacing:-.02em;color:var(--vibeui-language-003-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="language-003"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.5rem;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-language-003-accent) var(--vibeui-language-003-fill),var(--vibeui-language-003-line) var(--vibeui-language-003-fill));outline:none;cursor:pointer}
[data-vibeui-block="language-003"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-language-003-paper);border:3px solid var(--vibeui-language-003-accent);box-shadow:0 0 0 5px color-mix(in oklab,var(--vibeui-language-003-accent) 18%,transparent);cursor:grab}
[data-vibeui-block="language-003"] [data-part="range"]::-moz-range-thumb{width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-language-003-paper);border:3px solid var(--vibeui-language-003-accent);box-shadow:0 0 0 5px color-mix(in oklab,var(--vibeui-language-003-accent) 18%,transparent);cursor:grab}
[data-vibeui-block="language-003"] [data-part="range"]:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-language-003-accent) 40%,transparent)}
[data-vibeui-block="language-003"] [data-part="months"]{display:flex;justify-content:space-between;margin:0;padding:0;list-style:none;font-size:.72rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-language-003-muted)}
@keyframes vibeui-language-003-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-language-003-pulse{from{transform:scale(.6);opacity:1}to{transform:scale(2.2);opacity:0}}
@container (min-width: 60rem){[data-vibeui-block="language-003"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="language-003"] *{animation:none!important;transition:none!important}[data-vibeui-block="language-003"] [data-part="curve"]{stroke-dashoffset:0}[data-vibeui-block="language-003"] [data-part="area"],[data-vibeui-block="language-003"] [data-part="milestone"]{opacity:1}}`

const DEFAULT_WORDS = [40, 110, 190, 270, 360, 440, 520, 610, 690, 780, 860, 950, 1050]

const DEFAULT_MILESTONES: Language003Milestone[] = [
  { week: 0, can: "представиться и сказать, откуда вы" },
  { week: 2, can: "рассказать, как прошли выходные, и не сбиться" },
  { week: 4, can: "заказать ужин и поспорить о счёте" },
  { week: 6, can: "объяснить врачу, что болит, и понять ответ" },
  { week: 8, can: "смотреть сериал с субтитрами на языке, а не на русском" },
  { week: 10, can: "поддержать small talk с коллегой из Лондона" },
  { week: 12, can: "провести созвон с носителем без паники" },
]

const WIDTH = 640
const HEIGHT = 280
const PAD = { top: 30, right: 24, bottom: 34, left: 44 }

function formatNumber(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/** График словарного запаса за три месяца с ползунком недель. */
export function Language003({
  eyebrow = "прогресс",
  title = "Что будет через три месяца, если не бросить",
  lede = "Мы считаем слова, которые вы реально используете в речи, а не просто видели. Подвиньте ползунок — покажем, что вы сможете сказать к этой неделе.",
  words = DEFAULT_WORDS,
  milestones = DEFAULT_MILESTONES,
  defaultWeek = 6,
  lessonsPerWeek = 2,
  speakingMinutes = 25,
  wordsLabel = "слов в активе",
  lessonsLabel = "занятий",
  minutesLabel = "минут разговора",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Language003Props) {
  const weeks = Math.max(1, words.length - 1)
  const [week, setWeek] = useState(Math.min(weeks, Math.max(0, defaultWeek)))
  const [visible, setVisible] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)
  const rangeId = useId()

  useEffect(() => {
    const node = boardRef.current
    if (!node) return
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setVisible(true), 0)
      return () => clearTimeout(timer)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const geometry = useMemo(() => {
    const max = Math.max(...words, 1)
    const innerWidth = WIDTH - PAD.left - PAD.right
    const innerHeight = HEIGHT - PAD.top - PAD.bottom
    const points = words.map((value, index) => ({
      x: PAD.left + (index / weeks) * innerWidth,
      y: PAD.top + (1 - value / max) * innerHeight,
    }))
    let line = `M${points[0].x},${points[0].y}`
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1]
      const current = points[index]
      const dx = (current.x - previous.x) / 2
      line += ` C${previous.x + dx},${previous.y} ${current.x - dx},${current.y} ${current.x},${current.y}`
    }
    const bottom = HEIGHT - PAD.bottom
    const area = `${line} L${points[points.length - 1].x},${bottom} L${points[0].x},${bottom} Z`
    const rules = [0, 0.25, 0.5, 0.75, 1].map((ratio) => PAD.top + ratio * innerHeight)
    return { points, line, area, rules, max, bottom }
  }, [words, weeks])

  const point = geometry.points[week]
  const value = words[week]
  const reached = [...milestones].filter((milestone) => milestone.week <= week).sort((a, b) => b.week - a.week)[0] ?? milestones[0]
  const fill = `${(week / weeks) * 100}%`

  const palette = {
    ...(accent ? { "--vibeui-language-003-accent": accent } : null),
    ...(ink ? { "--vibeui-language-003-fg": ink } : null),
    ...(background ? { "--vibeui-language-003-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-language-003" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="language-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <ul data-part="stats" aria-live="polite">
              <li>
                <b>{formatNumber(value)}</b>
                <span>{wordsLabel}</span>
              </li>
              <li>
                <b>{week * lessonsPerWeek}</b>
                <span>{lessonsLabel}</span>
              </li>
              <li>
                <b>{formatNumber(week * lessonsPerWeek * speakingMinutes)}</b>
                <span>{minutesLabel}</span>
              </li>
            </ul>
            {reached ? (
              <p data-part="can">
                к неделе {week}: <q>{reached.can}</q>
              </p>
            ) : null}
          </div>
          <div data-part="board" ref={boardRef} data-visible={visible ? "true" : undefined}>
            <svg data-part="chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Словарный запас по неделям: от ${words[0]} до ${words[weeks]} слов`}>
              <defs>
                <linearGradient id="vibeui-language-003-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--vibeui-language-003-accent)" stopOpacity="0.28" />
                  <stop offset="1" stopColor="var(--vibeui-language-003-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {geometry.rules.map((y, index) => (
                <g key={y}>
                  <line data-part="rule" x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} />
                  <text data-part="axis" x={PAD.left - 8} y={y + 4} textAnchor="end">
                    {formatNumber(geometry.max * (1 - index / 4))}
                  </text>
                </g>
              ))}
              {geometry.points.map((item, index) =>
                index % 2 === 0 ? (
                  <text key={index} data-part="axis" x={item.x} y={HEIGHT - 10} textAnchor="middle">
                    {index === 0 ? "старт" : `${index} нед`}
                  </text>
                ) : null,
              )}
              <path data-part="area" d={geometry.area} />
              <path data-part="curve" d={geometry.line} pathLength={1} />
              {milestones.map((milestone) => {
                const target = geometry.points[Math.min(weeks, Math.max(0, milestone.week))]
                return target ? <circle key={milestone.week} data-part="milestone" data-reached={milestone.week <= week ? "true" : undefined} cx={target.x} cy={target.y} r="5" /> : null
              })}
              <g data-part="cursor" style={{ transform: `translateX(${point.x}px)` }}>
                <line x1="0" x2="0" y1={point.y} y2={geometry.bottom} />
              </g>
              <g data-part="dot" style={{ transform: `translate(${point.x}px, ${point.y}px)` }}>
                <circle r="10" />
                <circle r="6" />
                <rect data-part="tag" x="-32" y="-40" width="64" height="24" rx="8" />
                <text y="-24">{formatNumber(value)} сл.</text>
              </g>
            </svg>
            <div data-part="control">
              <label htmlFor={rangeId}>
                <span>Неделя обучения</span>
                <output htmlFor={rangeId}>{week === 0 ? "старт" : `неделя ${week}`}</output>
              </label>
              <input id={rangeId} data-part="range" type="range" min={0} max={weeks} step={1} value={week} onChange={(event) => setWeek(Number(event.target.value))} style={{ ["--vibeui-language-003-fill" as string]: fill }} aria-valuetext={`неделя ${week}, ${value} слов`} />
              <ul data-part="months" aria-hidden="true">
                <li>старт</li>
                <li>1 месяц</li>
                <li>2 месяца</li>
                <li>3 месяца</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
