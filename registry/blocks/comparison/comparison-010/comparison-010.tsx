"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Comparison010Stat = {
  value: number
  /** Что после числа: «объектов», «дней задержки». */
  label: string
  suffix?: string
}

export type Comparison010Row = {
  criterion: string
  /** true — галочка, false — крест, строка — текст в ячейке. */
  us: boolean | string
  them: boolean | string
}

export type Comparison010Props = {
  eyebrow?: string
  title?: string
  lede?: string
  stats?: readonly Comparison010Stat[]
  usLabel?: string
  themLabel?: string
  rows?: readonly Comparison010Row[]
  fine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Сравнение «мы против типичной бригады»: сверху три счётчика, которые
// докручиваются, когда секция входит в экран (IntersectionObserver +
// requestAnimationFrame), ниже таблица критериев. Галочки в нашей колонке
// прорисовываются штрихом строка за строкой, кресты в чужой проявляются
// приглушённо. Наша колонка выделена жёлтой шапкой-штампом. На узком —
// колонка критерия сжимается, значки остаются.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="comparison-010"]){
--vibeui-comparison-010-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-comparison-010-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-comparison-010-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-comparison-010-on-accent:oklch(from var(--vibeui-comparison-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-comparison-010-muted:color-mix(in oklab,var(--vibeui-comparison-010-fg) 62%,var(--vibeui-comparison-010-bg));
--vibeui-comparison-010-line:color-mix(in oklab,var(--vibeui-comparison-010-fg) 16%,transparent);
--vibeui-comparison-010-grid:color-mix(in oklab,var(--vibeui-comparison-010-fg) 7%,transparent);
--vibeui-comparison-010-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-comparison-010-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-comparison-010-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comparison-010"]{color-scheme:dark}
:where([data-vibeui-block="comparison-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="comparison-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="comparison-010"]{box-sizing:border-box;padding:5rem 0;background-color:var(--vibeui-comparison-010-bg);background-image:linear-gradient(var(--vibeui-comparison-010-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-comparison-010-grid) 1px,transparent 1px);background-size:5rem 5rem;color:var(--vibeui-comparison-010-fg);font-family:var(--vibeui-comparison-010-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="comparison-010"] *{box-sizing:border-box}
[data-vibeui-block="comparison-010"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="comparison-010"] [data-part="head"]{max-width:44rem;margin-bottom:2.5rem}
[data-vibeui-block="comparison-010"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1rem;font-family:var(--vibeui-comparison-010-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-comparison-010-muted)}
[data-vibeui-block="comparison-010"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-comparison-010-accent)}
[data-vibeui-block="comparison-010"] [data-part="title"]{margin:0;font-family:var(--vibeui-comparison-010-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="comparison-010"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-comparison-010-muted)}
[data-vibeui-block="comparison-010"] [data-part="stats"]{display:grid;gap:0;margin:0 0 2rem;padding:0;list-style:none;border:1px solid var(--vibeui-comparison-010-line);background:color-mix(in oklab,var(--vibeui-comparison-010-bg) 72%,transparent)}
[data-vibeui-block="comparison-010"] [data-part="stat"]{display:grid;gap:.2rem;padding:1.2rem 1.4rem;border-bottom:1px solid var(--vibeui-comparison-010-line)}
[data-vibeui-block="comparison-010"] [data-part="stat"]:last-child{border-bottom:0}
[data-vibeui-block="comparison-010"] [data-part="stat"] b{font-family:var(--vibeui-comparison-010-mono);font-weight:600;font-size:clamp(2.2rem,5cqi,3.4rem);letter-spacing:-.05em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="comparison-010"] [data-part="stat"] b small{font-size:.5em;letter-spacing:0;color:var(--vibeui-comparison-010-accent);margin-left:.15em}
[data-vibeui-block="comparison-010"] [data-part="stat"] span{font-family:var(--vibeui-comparison-010-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-comparison-010-muted)}
[data-vibeui-block="comparison-010"] [data-part="table"]{width:100%;border-collapse:collapse;border:1px solid var(--vibeui-comparison-010-line);background:color-mix(in oklab,var(--vibeui-comparison-010-bg) 72%,transparent);font-size:.92rem}
[data-vibeui-block="comparison-010"] [data-part="table"] th,[data-vibeui-block="comparison-010"] [data-part="table"] td{padding:.85rem 1rem;border-bottom:1px solid var(--vibeui-comparison-010-line);text-align:left;vertical-align:middle}
[data-vibeui-block="comparison-010"] [data-part="table"] th{font-family:var(--vibeui-comparison-010-mono);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-comparison-010-muted);font-weight:500}
[data-vibeui-block="comparison-010"] [data-part="table"] tbody th{font-family:var(--vibeui-comparison-010-font);font-size:inherit;letter-spacing:0;text-transform:none;color:inherit;font-weight:500}
[data-vibeui-block="comparison-010"] [data-part="table"] th[data-col="us"]{background:var(--vibeui-comparison-010-accent);color:var(--vibeui-comparison-010-on-accent);font-weight:600}
[data-vibeui-block="comparison-010"] [data-part="table"] th[data-col],[data-vibeui-block="comparison-010"] [data-part="table"] td[data-col]{width:5.5rem;text-align:center;border-left:1px solid var(--vibeui-comparison-010-line)}
[data-vibeui-block="comparison-010"] [data-part="table"] td[data-col="us"]{background:color-mix(in oklab,var(--vibeui-comparison-010-accent) 10%,transparent)}
[data-vibeui-block="comparison-010"] [data-part="table"] tr:last-child td{border-bottom:0}
[data-vibeui-block="comparison-010"] [data-part="table"] tbody tr{opacity:0;transform:translateY(.4rem);transition:opacity .5s ease-out,transform .5s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--vibeui-comparison-010-i) * 90ms)}
[data-vibeui-block="comparison-010"][data-in="true"] [data-part="table"] tbody tr{opacity:1;transform:none}
[data-vibeui-block="comparison-010"] [data-part="mark"]{display:inline-block;width:1.4rem;height:1.4rem;vertical-align:middle}
[data-vibeui-block="comparison-010"] [data-part="mark"] path{fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .5s ease-out;transition-delay:calc(var(--vibeui-comparison-010-i) * 90ms + .25s)}
[data-vibeui-block="comparison-010"][data-in="true"] [data-part="mark"] path{stroke-dashoffset:0}
[data-vibeui-block="comparison-010"] [data-part="mark"][data-kind="yes"]{color:var(--vibeui-comparison-010-fg)}
[data-vibeui-block="comparison-010"] [data-part="mark"][data-kind="no"]{color:var(--vibeui-comparison-010-muted);opacity:.7}
[data-vibeui-block="comparison-010"] [data-part="cell-text"]{font-family:var(--vibeui-comparison-010-mono);font-size:.78rem;font-weight:500}
[data-vibeui-block="comparison-010"] [data-part="fine"]{margin:1rem 0 0;font-family:var(--vibeui-comparison-010-mono);font-size:.7rem;color:var(--vibeui-comparison-010-muted)}
@container (min-width: 40rem){[data-vibeui-block="comparison-010"] [data-part="stats"]{grid-template-columns:repeat(3,minmax(0,1fr))}[data-vibeui-block="comparison-010"] [data-part="stat"]{border-bottom:0;border-right:1px solid var(--vibeui-comparison-010-line)}[data-vibeui-block="comparison-010"] [data-part="stat"]:last-child{border-right:0}[data-vibeui-block="comparison-010"] [data-part="table"] th[data-col],[data-vibeui-block="comparison-010"] [data-part="table"] td[data-col]{width:12rem}}
@container (min-width: 60rem){[data-vibeui-block="comparison-010"] [data-part="wrap"]{display:grid;grid-template-columns:18rem minmax(0,1fr);gap:2rem;align-items:start}[data-vibeui-block="comparison-010"] [data-part="stats"]{grid-template-columns:1fr;margin:0}[data-vibeui-block="comparison-010"] [data-part="stat"]{border-right:0;border-bottom:1px solid var(--vibeui-comparison-010-line)}[data-vibeui-block="comparison-010"] [data-part="stat"]:last-child{border-bottom:0}[data-vibeui-block="comparison-010"] [data-part="table"] th[data-col],[data-vibeui-block="comparison-010"] [data-part="table"] td[data-col]{width:14rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="comparison-010"] *{animation:none!important;transition:none!important}[data-vibeui-block="comparison-010"] [data-part="table"] tbody tr{opacity:1;transform:none}[data-vibeui-block="comparison-010"] [data-part="mark"] path{stroke-dashoffset:0}}`

const DEFAULT_STATS: Comparison010Stat[] = [
  { value: 312, label: "объектов сдано" },
  { value: 0, label: "дней задержки за 14 лет" },
  { value: 100, label: "смет не выросли после подписания", suffix: "%" },
]

const DEFAULT_ROWS: Comparison010Row[] = [
  { criterion: "Цена фиксируется в договоре", us: true, them: "«примерно»" },
  { criterion: "Срок в календаре с датами этапов", us: true, them: false },
  { criterion: "Штраф за задержку — 0,5 % в день", us: true, them: false },
  { criterion: "Ежедневный фотоотчёт и камера", us: true, them: "по звонку" },
  { criterion: "Скрытые работы принимаются актом", us: true, them: false },
  { criterion: "Уборка объекта каждый вечер", us: true, them: false },
  { criterion: "Гарантия", us: "5 лет", them: "устная" },
  { criterion: "Оплата по этапам, без предоплаты 50 %", us: true, them: false },
]

function formatNumber(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/** Сравнение «мы против типичной бригады» с счётчиками и прорисовкой галочек. */
export function Comparison010({
  eyebrow = "Почему мы",
  title = "Чем мы отличаемся от «бригады по объявлению»",
  lede = "Не обещания, а пункты договора. Каждую строку можно проверить до подписания.",
  stats = DEFAULT_STATS,
  usLabel = "Ровно",
  themLabel = "Типичная бригада",
  rows = DEFAULT_ROWS,
  fine = "Выписка из типового договора, редакция 2026 года. Полный текст — по запросу до замера.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Comparison010Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [shown, setShown] = useState<readonly number[]>(() => stats.map(() => 0))

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  // Ключ из значений, а не сам массив: инлайновый проп не перезапускает счёт.
  const valuesKey = stats.map((stat) => stat.value).join(",")

  useEffect(() => {
    if (!inView) return
    const targets = valuesKey.split(",").map(Number)
    let frame = 0
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1400)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(targets.map((value) => value * eased))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, valuesKey])

  const palette = {
    ...(accent ? { "--vibeui-comparison-010-accent": accent } : null),
    ...(ink ? { "--vibeui-comparison-010-fg": ink } : null),
    ...(background ? { "--vibeui-comparison-010-bg": background } : null),
    ...style,
  } as CSSProperties

  const cell = (value: boolean | string, col: "us" | "them", index: number) => (
    <td data-col={col} style={{ ["--vibeui-comparison-010-i" as string]: index }}>
      {typeof value === "string" ? (
        <span data-part="cell-text">{value}</span>
      ) : value ? (
        <svg data-part="mark" data-kind="yes" viewBox="0 0 24 24" role="img" aria-label="да">
          <path d="M5 12.5l4.5 4.5L19 7" pathLength={1} />
        </svg>
      ) : (
        <svg data-part="mark" data-kind="no" viewBox="0 0 24 24" role="img" aria-label="нет">
          <path d="M7 7l10 10M17 7L7 17" pathLength={1} />
        </svg>
      )}
    </td>
  )

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-comparison-010" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="comparison-010" data-tone={tone === "auto" ? undefined : tone} data-in={inView} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="wrap">
            {stats.length > 0 ? (
              <ul data-part="stats">
                {stats.map((stat, index) => (
                  <li key={stat.label} data-part="stat">
                    <b>
                      {formatNumber(shown[index] ?? 0)}
                      {stat.suffix ? <small>{stat.suffix}</small> : null}
                    </b>
                    <span>{stat.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div>
              <table data-part="table">
                <thead>
                  <tr>
                    <th scope="col">Критерий</th>
                    <th scope="col" data-col="us">
                      {usLabel}
                    </th>
                    <th scope="col" data-col="them">
                      {themLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.criterion} style={{ ["--vibeui-comparison-010-i" as string]: index }}>
                      <th scope="row">{row.criterion}</th>
                      {cell(row.us, "us", index)}
                      {cell(row.them, "them", index)}
                    </tr>
                  ))}
                </tbody>
              </table>
              {fine ? <p data-part="fine">{fine}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
