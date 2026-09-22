"use client"

import { useEffect, useId, useRef, useState, type CSSProperties } from "react"
import { Button089 } from "@/registry/components/button/button-089/button-089"

export type Fintech001Operation = {
  title: string
  note: string
  /** Число со знаком в рублях; форматируется блоком. */
  amount: number
}

export type Fintech001Period = {
  label: string
  balance: number
  /** Подпись изменения: «+12,4 % к прошлой неделе». */
  delta: string
  /** 8–16 точек графика, любые единицы. */
  points: readonly number[]
  operations: readonly Fintech001Operation[]
}

export type Fintech001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  facts?: readonly string[]
  account?: string
  periods?: readonly Fintech001Period[]
  currency?: string
  /** aria переключателя периода. */
  tabsLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Живой баланс»: стеклянный виджет-дашборд рядом с текстом. Когда виджет
// доезжает до viewport, area-график прорисовывается (stroke-dashoffset по
// pathLength), баланс докручивается, операции появляются по одной через
// animation-delay. Переключатель день / неделя / месяц морфит линию —
// точки интерполируются через requestAnimationFrame, а не перерисовываются
// скачком. Цифры моноширинные с tabular-nums, чтобы не дрожали.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="fintech-001"]){
--vibeui-fintech-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-fintech-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-fintech-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-fintech-001-on-accent:oklch(from var(--vibeui-fintech-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-fintech-001-mint:color-mix(in oklab,var(--vibeui-fintech-001-accent) 45%,#99f6e4);
--vibeui-fintech-001-muted:color-mix(in oklab,var(--vibeui-fintech-001-fg) 62%,var(--vibeui-fintech-001-bg));
--vibeui-fintech-001-line:color-mix(in oklab,var(--vibeui-fintech-001-fg) 11%,transparent);
--vibeui-fintech-001-glass:color-mix(in oklab,var(--vibeui-fintech-001-fg) 5%,transparent);
--vibeui-fintech-001-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-fintech-001-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-fintech-001-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="fintech-001"]{color-scheme:dark}
:where([data-vibeui-block="fintech-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="fintech-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="fintech-001"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-fintech-001-bg);color:var(--vibeui-fintech-001-fg);font-family:var(--vibeui-fintech-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="fintech-001"] *{box-sizing:border-box}
[data-vibeui-block="fintech-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="fintech-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-fintech-001-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-fintech-001-accent)}
[data-vibeui-block="fintech-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-fintech-001-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="fintech-001"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-fintech-001-muted)}
[data-vibeui-block="fintech-001"] [data-part="facts"]{margin:1.6rem 0 0;padding:0;list-style:none;display:grid;gap:.6rem}
[data-vibeui-block="fintech-001"] [data-part="facts"] li{display:flex;gap:.7rem;align-items:baseline;padding:.75rem 1rem;border-radius:.9rem;background:var(--vibeui-fintech-001-glass);border:1px solid var(--vibeui-fintech-001-line)}
[data-vibeui-block="fintech-001"] [data-part="facts"] li::before{content:"→";font-family:var(--vibeui-fintech-001-mono);color:var(--vibeui-fintech-001-accent)}
[data-vibeui-block="fintech-001"] [data-part="widget"]{position:relative;isolation:isolate;padding:1.4rem;border-radius:1.6rem;background:color-mix(in oklab,var(--vibeui-fintech-001-bg) 55%,transparent);border:1px solid color-mix(in oklab,var(--vibeui-fintech-001-fg) 16%,transparent);backdrop-filter:blur(20px);box-shadow:0 1px 0 rgb(255 255 255 / .12) inset,0 40px 80px -40px rgb(0 0 0 / .7)}
[data-vibeui-block="fintech-001"] [data-part="widget"]::before{content:"";position:absolute;z-index:-1;inset:-30% -20% auto;height:70%;background:radial-gradient(closest-side,var(--vibeui-fintech-001-accent),transparent);opacity:.25;filter:blur(60px);pointer-events:none}
[data-vibeui-block="fintech-001"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:1rem}
[data-vibeui-block="fintech-001"] [data-part="account"]{margin:0;font-size:.8rem;color:var(--vibeui-fintech-001-muted);display:flex;align-items:center;gap:.5rem}
[data-vibeui-block="fintech-001"] [data-part="account"]::before{content:"";width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-fintech-001-accent);animation:vibeui-fintech-001-ping 2s ease-out infinite}
[data-vibeui-block="fintech-001"] [data-part="balance"]{margin:.3rem 0 0;font-family:var(--vibeui-fintech-001-mono);font-weight:600;font-size:clamp(1.8rem,5cqi,2.6rem);letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="fintech-001"] [data-part="delta"]{display:inline-block;margin:.5rem 0 0;padding:.2rem .6rem;border-radius:999px;font-family:var(--vibeui-fintech-001-mono);font-size:.72rem;background:color-mix(in oklab,var(--vibeui-fintech-001-accent) 16%,transparent);color:var(--vibeui-fintech-001-accent)}
[data-vibeui-block="fintech-001"] [data-part="tabs"]{display:inline-flex;padding:.25rem;border-radius:999px;background:var(--vibeui-fintech-001-glass);border:1px solid var(--vibeui-fintech-001-line)}
[data-vibeui-block="fintech-001"] [data-part="chart"]{display:block;width:100%;height:auto;margin:1.2rem 0 0;overflow:visible}
[data-vibeui-block="fintech-001"] [data-part="area"]{opacity:0;transition:opacity 1s ease-out .6s}
[data-vibeui-block="fintech-001"] [data-part="stroke"]{fill:none;stroke:var(--vibeui-fintech-001-accent);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1}
[data-vibeui-block="fintech-001"] [data-part="dot"]{fill:var(--vibeui-fintech-001-accent);opacity:0;transition:opacity .4s 1.3s}
[data-vibeui-block="fintech-001"] [data-part="dot"]:first-of-type{animation:vibeui-fintech-001-halo 2s ease-out infinite;transform-box:fill-box;transform-origin:center}
[data-vibeui-block="fintech-001"] [data-part="gridline"]{stroke:var(--vibeui-fintech-001-line);stroke-width:1}
[data-vibeui-block="fintech-001"][data-visible="true"] [data-part="area"]{opacity:1}
[data-vibeui-block="fintech-001"][data-visible="true"] [data-part="stroke"]{animation:vibeui-fintech-001-draw 1.4s cubic-bezier(.2,.7,.2,1) forwards}
[data-vibeui-block="fintech-001"][data-visible="true"] [data-part="dot"]{opacity:1}
[data-vibeui-block="fintech-001"] [data-part="ops"]{margin:1.2rem 0 0;padding:1rem 0 0;border-top:1px solid var(--vibeui-fintech-001-line);list-style:none;display:grid;gap:.25rem}
[data-vibeui-block="fintech-001"] [data-part="op"]{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.8rem;padding:.55rem .5rem;border-radius:.8rem;font-size:.88rem;opacity:0;transform:translateY(8px)}
[data-vibeui-block="fintech-001"][data-visible="true"] [data-part="op"]{animation:vibeui-fintech-001-in .55s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--vibeui-fintech-001-d,1s) + var(--vibeui-fintech-001-i) * .32s)}
[data-vibeui-block="fintech-001"] [data-part="op"] i{width:2rem;height:2rem;border-radius:.65rem;display:grid;place-items:center;font-style:normal;font-family:var(--vibeui-fintech-001-mono);font-size:.7rem;background:var(--vibeui-fintech-001-glass);color:var(--vibeui-fintech-001-muted)}
[data-vibeui-block="fintech-001"] [data-part="op"][data-plus="true"] i{background:color-mix(in oklab,var(--vibeui-fintech-001-accent) 16%,transparent);color:var(--vibeui-fintech-001-accent)}
[data-vibeui-block="fintech-001"] [data-part="op"] div{min-width:0}
[data-vibeui-block="fintech-001"] [data-part="op"] div span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="fintech-001"] [data-part="op"] div span:last-child{font-size:.75rem;color:var(--vibeui-fintech-001-muted)}
[data-vibeui-block="fintech-001"] [data-part="op"] b{font-family:var(--vibeui-fintech-001-mono);font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="fintech-001"] [data-part="op"][data-plus="true"] b{color:var(--vibeui-fintech-001-accent)}
@keyframes vibeui-fintech-001-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-fintech-001-in{to{opacity:1;transform:translateY(0)}}
@keyframes vibeui-fintech-001-ping{0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-fintech-001-accent) 60%,transparent)}100%{box-shadow:0 0 0 .5rem transparent}}
@keyframes vibeui-fintech-001-halo{from{transform:scale(1);opacity:.6}to{transform:scale(3.5);opacity:0}}
@container (min-width: 60rem){[data-vibeui-block="fintech-001"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:4rem}[data-vibeui-block="fintech-001"] [data-part="widget"]{padding:1.8rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="fintech-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="fintech-001"] [data-part="stroke"]{stroke-dashoffset:0}[data-vibeui-block="fintech-001"] [data-part="area"],[data-vibeui-block="fintech-001"] [data-part="dot"],[data-vibeui-block="fintech-001"] [data-part="op"]{opacity:1;transform:none}}`

const DEFAULT_PERIODS: Fintech001Period[] = [
  {
    label: "День",
    balance: 1284650,
    delta: "+48 900 ₽ с утра",
    points: [62, 60, 61, 58, 64, 66, 65, 70, 69, 74, 73, 78],
    operations: [
      { title: "ООО «Прим-Логистик»", note: "СБП · 09:12", amount: 48900 },
      { title: "Яндекс Go · корпоративный", note: "карта сотрудника · 10:40", amount: -1240 },
      { title: "Аренда, ул. Правды 8", note: "по расписанию · 11:00", amount: -62000 },
      { title: "Ozon · выплата", note: "маркетплейс · 12:30", amount: 184300 },
      { title: "Канцелярия «Скрепка»", note: "счёт № 418 · 13:05", amount: -8420 },
    ],
  },
  {
    label: "Неделя",
    balance: 1284650,
    delta: "+12,4 % к прошлой неделе",
    points: [40, 44, 42, 50, 47, 55, 53, 61, 58, 66, 71, 78],
    operations: [
      { title: "Wildberries · выплата", note: "маркетплейс · вт", amount: 96120 },
      { title: "Зарплата · 6 человек", note: "проект выплат · пт", amount: -318500 },
      { title: "Ozon · выплата", note: "маркетплейс · чт", amount: 184300 },
      { title: "ИП Кравцова · дизайн", note: "СБП, 0 ₽ комиссии · ср", amount: -35000 },
      { title: "УСН 6 % · аванс", note: "посчитан сам · пн", amount: -41760 },
    ],
  },
  {
    label: "Месяц",
    balance: 1284650,
    delta: "+31,8 % к августу",
    points: [22, 30, 28, 36, 41, 39, 48, 52, 50, 63, 70, 78],
    operations: [
      { title: "Выплаты маркетплейсов", note: "14 зачислений", amount: 1126400 },
      { title: "Зарплата и взносы", note: "2 проекта выплат", amount: -637000 },
      { title: "Аренда и коммуналка", note: "3 платежа", amount: -74600 },
      { title: "Поставщики", note: "27 платежей по СБП", amount: -412300 },
      { title: "Эквайринг · касса", note: "выручка за месяц", amount: 268900 },
    ],
  },
]

function formatMoney(value: number, currency: string) {
  const sign = value < 0 ? "−" : ""
  const digits = String(Math.round(Math.abs(value))).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${sign}${digits} ${currency}`
}

const WIDTH = 320
const HEIGHT = 120

function toCoords(points: readonly number[]) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const step = points.length > 1 ? WIDTH / (points.length - 1) : 0
  return points.map((value, index) => ({ x: index * step, y: 12 + (1 - (value - min) / span) * (HEIGHT - 24) }))
}

function toPath(points: readonly number[]) {
  const coords = toCoords(points)
  if (coords.length === 0) return { line: "", area: "", last: { x: 0, y: 0 } }
  let line = `M${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`
  for (let index = 1; index < coords.length; index += 1) {
    const previous = coords[index - 1]
    const current = coords[index]
    const middle = ((previous.x + current.x) / 2).toFixed(1)
    line += ` C${middle} ${previous.y.toFixed(1)} ${middle} ${current.y.toFixed(1)} ${current.x.toFixed(1)} ${current.y.toFixed(1)}`
  }
  const last = coords[coords.length - 1]
  const area = `${line} L${last.x.toFixed(1)} ${HEIGHT} L0 ${HEIGHT} Z`
  return { line, area, last }
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

/** Живой баланс: график рисуется, операции появляются, период морфит линию. */
export function Fintech001({
  eyebrow = "Дашборд",
  title = "Деньги видно сразу, а не в выписке по понедельникам",
  lede = "Баланс, поступления и налоги — на одном экране. График перестраивается по дню, неделе и месяцу; каждая операция подписана так, чтобы не лезть в бухгалтерию.",
  facts = ["Зачисления от маркетплейсов видны в момент выплаты", "Налог УСН считается с каждого поступления", "Экспорт в 1С и Excel одной кнопкой"],
  account = "Основной счёт · 40702…4821",
  periods = DEFAULT_PERIODS,
  currency = "₽",
  tabsLabel = "Период",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Fintech001Props) {
  const id = useId()
  const rootRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [periodIndex, setPeriodIndex] = useState(0)
  const [touched, setTouched] = useState(false)
  const period = periods[Math.min(periodIndex, periods.length - 1)]
  const targetPoints = period?.points ?? []
  const targetBalance = period?.balance ?? 0
  const [shownPoints, setShownPoints] = useState<readonly number[]>(targetPoints)
  const [shownBalance, setShownBalance] = useState(0)
  const pointsRef = useRef<readonly number[]>(targetPoints)
  const balanceRef = useRef(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const key = targetPoints.join(",")

  useEffect(() => {
    if (!visible) return
    const from = pointsRef.current
    const to = key.split(",").map(Number)
    const fromBalance = balanceRef.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 700)
      const k = easeOut(t)
      const next = to.map((value, index) => (from[index] ?? value) + (value - (from[index] ?? value)) * k)
      pointsRef.current = next
      balanceRef.current = fromBalance + (targetBalance - fromBalance) * k
      setShownPoints(next)
      setShownBalance(balanceRef.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [visible, key, targetBalance])

  const path = toPath(shownPoints)

  const palette = {
    ...(accent ? { "--vibeui-fintech-001-accent": accent } : null),
    ...(ink ? { "--vibeui-fintech-001-fg": ink } : null),
    ...(background ? { "--vibeui-fintech-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-fintech-001" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="fintech-001" data-tone={tone === "auto" ? undefined : tone} data-visible={visible} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="widget" aria-live="polite">
            <div data-part="head">
              <div>
                <p data-part="account">{account}</p>
                <p data-part="balance">{formatMoney(visible ? shownBalance : 0, currency)}</p>
                {period?.delta ? <span data-part="delta">{period.delta}</span> : null}
              </div>
              {periods.length > 1 ? (
                <div data-part="tabs" role="group" aria-label={tabsLabel}>
                  {periods.map((item, index) => (
                    <Button089 key={item.label} data-part="period" label={item.label} aria-pressed={index === periodIndex} onClick={() => { setPeriodIndex(index); setTouched(true) }} accent={accent} />
                  ))}
                </div>
              ) : null}
            </div>
            <svg data-part="chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true">
              <defs>
                <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--vibeui-fintech-001-accent)" stopOpacity=".35" />
                  <stop offset="1" stopColor="var(--vibeui-fintech-001-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((ratio) => (
                <line key={ratio} data-part="gridline" x1="0" x2={WIDTH} y1={HEIGHT * ratio} y2={HEIGHT * ratio} />
              ))}
              <path data-part="area" d={path.area} fill={`url(#${id}-fill)`} />
              <path data-part="stroke" d={path.line} pathLength={1} />
              <circle data-part="dot" cx={path.last.x} cy={path.last.y} r="4" />
              <circle data-part="dot" cx={path.last.x} cy={path.last.y} r="4" />
            </svg>
            {period && period.operations.length > 0 ? (
              <ul data-part="ops" key={periodIndex} style={{ ["--vibeui-fintech-001-d" as string]: touched ? ".1s" : "1s" }}>
                {period.operations.map((operation, index) => (
                  <li key={operation.title + index} data-part="op" data-plus={operation.amount > 0} style={{ ["--vibeui-fintech-001-i" as string]: index }}>
                    <i aria-hidden="true">{operation.amount > 0 ? "↓" : "↑"}</i>
                    <div>
                      <span>{operation.title}</span>
                      <span>{operation.note}</span>
                    </div>
                    <b>{`${operation.amount > 0 ? "+" : ""}${formatMoney(operation.amount, currency)}`}</b>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
