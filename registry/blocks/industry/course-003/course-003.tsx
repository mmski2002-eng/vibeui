"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Card091 } from "@/registry/components/card/card-091/card-091"

export type Course003Case = {
  name: string
  image?: string
  /** Кем был: «маркетолог, 3 года». */
  before: string
  /** Кем стал: «продуктовый дизайнер в Ozon». */
  after: string
  /** Рост дохода или срок: «×2 к доходу», «оффер через 2 месяца». */
  gain?: string
  /** Скрин проекта из портфолио. */
  work?: string
  workAlt?: string
  quote?: string
  /** Ссылка на кейс или профиль. */
  href?: string
}

export type Course003Stat = {
  /** Число для счётчика. */
  value: number
  /** Суффикс после числа: «%», «+». */
  suffix?: string
  label: string
}

export type Course003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  cases?: readonly Course003Case[]
  /** Счётчики над лентой: набегают при появлении. */
  stats?: readonly Course003Stat[]
  beforeLabel?: string
  afterLabel?: string
  linkLabel?: string
  /** aria стрелок. */
  prevLabel?: string
  nextLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Результаты выпускников горизонтальной лентой: карточки на 70 % ширины со
// scroll-snap, тянутся мышью (pointer capture) и колесом, стрелки по краям.
// Над лентой счётчики, набегающие при появлении. У карточки крупный скрин,
// курсорный блик через --mx/--my и стрелка «было → стало», которая
// дорисовывается, когда карточка в кадре.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="course-003"]){
--vibeui-course-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-course-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-course-003-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-course-003-card:light-dark(#ffffff,#242424);
--vibeui-course-003-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-course-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-course-003-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-course-003-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-course-003-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="course-003"]{color-scheme:dark}
:where([data-vibeui-block="course-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="course-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="course-003"]{box-sizing:border-box;display:block;overflow:hidden;background:var(--vibeui-course-003-bg);color:var(--vibeui-course-003-fg);font-family:var(--vibeui-course-003-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="course-003"] *{box-sizing:border-box}
[data-vibeui-block="course-003"] [data-part="card"]{flex:0 0 min(82%,34rem)}
[data-vibeui-block="course-003"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="course-003"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.5rem 3rem;margin-bottom:2rem}
[data-vibeui-block="course-003"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-course-003-accent);font-weight:700}
[data-vibeui-block="course-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-course-003-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em;max-width:20ch}
[data-vibeui-block="course-003"] [data-part="lede"]{margin:.75rem 0 0;max-width:34rem;color:var(--vibeui-course-003-muted)}
[data-vibeui-block="course-003"] [data-part="arrows"]{display:flex;gap:.5rem}
[data-vibeui-block="course-003"] [data-part="arrows"] button{width:2.75rem;height:2.75rem;border-radius:50%;border:1px solid var(--vibeui-course-003-line);background:var(--vibeui-course-003-card);color:inherit;font:inherit;cursor:pointer;display:grid;place-items:center;transition:background .2s,color .2s,transform .2s}
[data-vibeui-block="course-003"] [data-part="arrows"] button:hover{background:var(--vibeui-course-003-fg);color:var(--vibeui-course-003-bg);transform:translateY(-1px)}
[data-vibeui-block="course-003"] [data-part="arrows"] button:focus-visible{outline:2px solid var(--vibeui-course-003-accent);outline-offset:2px}
[data-vibeui-block="course-003"] [data-part="arrows"] svg{width:1rem;height:1rem}
[data-vibeui-block="course-003"] [data-part="stats"]{display:flex;flex-wrap:wrap;gap:1rem 2.5rem;margin:0 0 2rem;padding:0;list-style:none}
[data-vibeui-block="course-003"] [data-part="stat"] b{display:block;font-family:var(--vibeui-course-003-display);font-size:clamp(1.8rem,4cqi,2.6rem);font-weight:700;line-height:1;letter-spacing:-.03em;color:var(--vibeui-course-003-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="course-003"] [data-part="stat"] span{display:block;margin-top:.3rem;font-size:.8rem;color:var(--vibeui-course-003-muted)}
[data-vibeui-block="course-003"] [data-part="lane"]{display:flex;gap:1.25rem;margin:0 -1.25rem;padding:.5rem 1.25rem 1.5rem;list-style:none;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:1.25rem;scrollbar-width:none;cursor:grab;overscroll-behavior-x:contain}
[data-vibeui-block="course-003"] [data-part="lane"]::-webkit-scrollbar{display:none}
[data-vibeui-block="course-003"] [data-part="lane"][data-drag="true"]{cursor:grabbing;scroll-snap-type:none;user-select:none}
@container (min-width: 64rem){
[data-vibeui-block="course-003"] [data-part="card"]{flex-basis:min(56%,38rem)}
[data-vibeui-block="course-003"] [data-part="shell"]{padding:5.5rem 2rem 4.5rem}
[data-vibeui-block="course-003"] [data-part="lane"]{margin:0 -2rem;padding:.5rem 2rem 1.5rem;scroll-padding-inline:2rem;gap:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="course-003"] *{animation:none!important;transition:none!important}}`

const DEFAULT_CASES: Course003Case[] = [
  { name: "Артём Гусев", before: "маркетолог, 4 года", after: "продуктовый дизайнер, Ozon", gain: "оффер через 2 месяца", quote: "Кейс с защиты показал на собеседовании — взяли без тестового." },
  { name: "Лена Крылова", before: "графический дизайнер", after: "UI-дизайнер, Самокат", gain: "×1,8 к доходу", quote: "Наконец поняла автолейаут. Теперь макеты не разваливаются." },
  { name: "Даниил Орлов", before: "продакт-менеджер", after: "продакт, сам собирает прототипы", gain: "гипотезы за вечер", quote: "Перестал ждать дизайнера две недели ради одного экрана." },
]

const DEFAULT_STATS: Course003Stat[] = [
  { value: 3200, suffix: "+", label: "выпускников за 5 лет" },
  { value: 71, suffix: " %", label: "сменили работу за полгода" },
  { value: 48, label: "компаний-партнёров" },
]

function Counter({ value, suffix, active }: { value: number; suffix?: string; active: boolean }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    let frame = 0
    const step = (time: number) => {
      const t = Math.min(1, (time - start) / 1400)
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, value])
  return (
    <b>
      {new Intl.NumberFormat("ru-RU").format(active ? shown : value)}
      {suffix}
    </b>
  )
}

/** Результаты выпускников горизонтальной лентой: drag и snap, счётчики, «было → стало». */
export function Course003({
  eyebrow = "Результаты",
  title = "Кем стали выпускники прошлых потоков",
  lede = "Не «трудоустроили 100 %», а конкретные люди и конкретные офферы — с работами, которые они собрали на курсе.",
  cases = DEFAULT_CASES,
  stats = DEFAULT_STATS,
  beforeLabel = "Было",
  afterLabel = "Стало",
  linkLabel = "Смотреть кейс",
  prevLabel = "Назад",
  nextLabel = "Вперёд",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Course003Props) {
  const lane = useRef<HTMLUListElement>(null)
  const root = useRef<HTMLElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [seen, setSeen] = useState(false)
  const [visible, setVisible] = useState<Record<number, boolean>>({})
  const palette = {
    ...(accent ? { "--vibeui-course-003-accent": accent } : null),
    ...(ink ? { "--vibeui-course-003-fg": ink } : null),
    ...(background ? { "--vibeui-course-003-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    const node = root.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSeen(true)
        })
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const list = lane.current
    if (!list || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index)
            setVisible((state) => (state[index] ? state : { ...state, [index]: true }))
          }
        })
      },
      { root: list, threshold: 0.6 },
    )
    Array.from(list.children).forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [cases])

  const down = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse" || !lane.current) return
    drag.current = { x: event.clientX, left: lane.current.scrollLeft, moved: false }
    lane.current.setPointerCapture(event.pointerId)
  }
  const move = (event: PointerEvent<HTMLUListElement>) => {
    if (!drag.current || !lane.current) return
    const dx = event.clientX - drag.current.x
    if (!drag.current.moved && Math.abs(dx) > 4) {
      drag.current.moved = true
      setDragging(true)
    }
    if (drag.current.moved) lane.current.scrollLeft = drag.current.left - dx
  }
  const up = (event: PointerEvent<HTMLUListElement>) => {
    if (!drag.current || !lane.current) return
    lane.current.releasePointerCapture(event.pointerId)
    drag.current = null
    setDragging(false)
  }
  const shift = (direction: 1 | -1) => {
    const list = lane.current
    const first = list?.firstElementChild as HTMLElement | null
    if (!list || !first) return
    list.scrollBy({ left: direction * (first.offsetWidth + 20), behavior: "smooth" })
  }
  const glow = (event: PointerEvent<HTMLLIElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-course-003-mx", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--vibeui-course-003-my", `${event.clientY - rect.top}px`)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-course-003" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="course-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <div data-part="arrows">
              <button type="button" aria-label={prevLabel} onClick={() => shift(-1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button type="button" aria-label={nextLabel} onClick={() => shift(1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          {stats.length > 0 ? (
            <ul data-part="stats">
              {stats.map((stat) => (
                <li key={stat.label} data-part="stat">
                  <Counter value={stat.value} suffix={stat.suffix} active={seen} />
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <ul ref={lane} data-part="lane" data-drag={dragging} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
            {cases.map((item, index) => (
              <Card091 key={item.name} data-part="card" name={item.name} work={item.work} workAlt={item.workAlt} gain={item.gain} image={item.image} before={item.before} after={item.after} quote={item.quote} href={item.href} beforeLabel={beforeLabel} afterLabel={afterLabel} linkLabel={linkLabel} data-index={index} data-seen={visible[index] ? "true" : undefined} onPointerMove={glow} onClickCapture={(event) => dragging && event.preventDefault()} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
