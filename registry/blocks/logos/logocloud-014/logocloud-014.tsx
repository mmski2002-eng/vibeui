"use client"

import { useSyncExternalStore, type CSSProperties } from "react"

export type Logocloud014Item = {
  name: string
  /** Короткая марка в квадратике: «1С», «WB». Пусто — первые буквы. */
  mark?: string
}

export type Logocloud014Counter = {
  label: string
  /** Значение на начало суток. */
  base: number
  /** Прирост в секунду с начала суток. */
  perSecond: number
  suffix?: string
}

export type Logocloud014Props = {
  eyebrow?: string
  title?: string
  rows?: readonly (readonly Logocloud014Item[])[]
  counters?: readonly Logocloud014Counter[]
  /** Секунд на полный проход строки. */
  speed?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Интеграции бегущими строками: две ленты стеклянных чипов (1С, маркетплейсы,
// кассы, CRM) едут в разные стороны, по краям тают маской, по наведению
// останавливаются. Над ними два счётчика, которые считаются от текущего
// времени — «компаний с нами» и «переводов сегодня» растут каждую секунду.
// Время читается через useSyncExternalStore с серверным снимком null, на
// сервере вместо цифр — тире, поэтому гидрация не расходится.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="logocloud-014"]){
--vibeui-logocloud-014-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-logocloud-014-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-logocloud-014-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-logocloud-014-muted:color-mix(in oklab,var(--vibeui-logocloud-014-fg) 62%,var(--vibeui-logocloud-014-bg));
--vibeui-logocloud-014-line:color-mix(in oklab,var(--vibeui-logocloud-014-fg) 11%,transparent);
--vibeui-logocloud-014-glass:color-mix(in oklab,var(--vibeui-logocloud-014-fg) 5%,transparent);
--vibeui-logocloud-014-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-logocloud-014-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-logocloud-014-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="logocloud-014"]{color-scheme:dark}
:where([data-vibeui-block="logocloud-014"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="logocloud-014"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="logocloud-014"]{box-sizing:border-box;overflow:hidden;padding:4rem 0;background:var(--vibeui-logocloud-014-bg);color:var(--vibeui-logocloud-014-fg);font-family:var(--vibeui-logocloud-014-font);font-size:1rem;line-height:1.5;overflow:hidden}
[data-vibeui-block="logocloud-014"] *{box-sizing:border-box}
[data-vibeui-block="logocloud-014"] [data-part="shell"]{max-width:80rem;margin:0 auto 2.4rem;padding:0 1.25rem;display:grid;gap:1.6rem}
[data-vibeui-block="logocloud-014"] [data-part="eyebrow"]{margin:0 0 .5rem;font-family:var(--vibeui-logocloud-014-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-logocloud-014-accent)}
[data-vibeui-block="logocloud-014"] [data-part="title"]{margin:0;font-family:var(--vibeui-logocloud-014-display);font-weight:800;font-size:clamp(1.6rem,3.6cqi,2.4rem);line-height:1.05;letter-spacing:-.03em;text-wrap:balance;max-width:28rem}
[data-vibeui-block="logocloud-014"] [data-part="counters"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="logocloud-014"] [data-part="counter"]{padding:1rem 1.2rem;border-radius:1.1rem;background:var(--vibeui-logocloud-014-glass);border:1px solid var(--vibeui-logocloud-014-line)}
[data-vibeui-block="logocloud-014"] [data-part="counter"] strong{display:block;font-family:var(--vibeui-logocloud-014-mono);font-weight:600;font-size:clamp(1.6rem,4cqi,2.2rem);line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:var(--vibeui-logocloud-014-accent)}
[data-vibeui-block="logocloud-014"] [data-part="counter"] span{display:flex;align-items:center;gap:.45rem;margin:.4rem 0 0;font-size:.82rem;color:var(--vibeui-logocloud-014-muted)}
[data-vibeui-block="logocloud-014"] [data-part="counter"] span::before{content:"";width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-logocloud-014-accent);animation:vibeui-logocloud-014-blink 1s steps(2,end) infinite}
[data-vibeui-block="logocloud-014"] [data-part="rows"]{display:grid;gap:.8rem;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
[data-vibeui-block="logocloud-014"] [data-part="row"]{display:flex;width:max-content;gap:.8rem;animation:vibeui-logocloud-014-run var(--vibeui-logocloud-014-t) linear infinite}
[data-vibeui-block="logocloud-014"] [data-part="row"][data-dir="rtl"]{animation-direction:reverse}
[data-vibeui-block="logocloud-014"] [data-part="rows"]:hover [data-part="row"]{animation-play-state:paused}
[data-vibeui-block="logocloud-014"] [data-part="lane"]{display:flex;gap:.8rem;padding-right:.8rem;margin:0;list-style:none}
[data-vibeui-block="logocloud-014"] [data-part="chip"]{display:inline-flex;align-items:center;gap:.6rem;padding:.55rem 1rem .55rem .55rem;border-radius:999px;background:var(--vibeui-logocloud-014-glass);border:1px solid var(--vibeui-logocloud-014-line);white-space:nowrap;font-weight:500;font-size:.92rem;transition:border-color .2s,background .2s}
[data-vibeui-block="logocloud-014"] [data-part="chip"]:hover{border-color:color-mix(in oklab,var(--vibeui-logocloud-014-accent) 50%,transparent);background:color-mix(in oklab,var(--vibeui-logocloud-014-accent) 10%,transparent)}
[data-vibeui-block="logocloud-014"] [data-part="chip"] i{display:grid;place-items:center;width:1.8rem;height:1.8rem;border-radius:.55rem;background:color-mix(in oklab,var(--vibeui-logocloud-014-accent) 16%,transparent);color:var(--vibeui-logocloud-014-accent);font-style:normal;font-family:var(--vibeui-logocloud-014-mono);font-size:.64rem;font-weight:600}
@keyframes vibeui-logocloud-014-run{to{transform:translateX(-50%)}}
@keyframes vibeui-logocloud-014-blink{50%{opacity:.2}}
@container (min-width: 40rem){[data-vibeui-block="logocloud-014"] [data-part="counters"]{grid-template-columns:1fr 1fr}}
@container (min-width: 60rem){[data-vibeui-block="logocloud-014"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) auto;align-items:end}[data-vibeui-block="logocloud-014"] [data-part="counter"]{min-width:14rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="logocloud-014"] *{animation:none!important;transition:none!important}[data-vibeui-block="logocloud-014"] [data-part="rows"]{mask-image:none}[data-vibeui-block="logocloud-014"] [data-part="row"]{width:auto;flex-wrap:wrap}[data-vibeui-block="logocloud-014"] [data-part="lane"]:last-child{display:none}}`

const DEFAULT_ROWS: Logocloud014Item[][] = [
  [{ name: "1С:Бухгалтерия", mark: "1С" }, { name: "Ozon Seller", mark: "OZ" }, { name: "Wildberries", mark: "WB" }, { name: "Яндекс Маркет", mark: "ЯМ" }, { name: "МойСклад", mark: "МС" }, { name: "Эвотор", mark: "ЭВ" }, { name: "АТОЛ", mark: "АТ" }, { name: "Контур.Эльба", mark: "КЭ" }],
  [{ name: "Битрикс24", mark: "Б24" }, { name: "amoCRM", mark: "amo" }, { name: "СБП", mark: "СБП" }, { name: "Тинькофф Касса", mark: "ТК" }, { name: "Модульбанк API", mark: "API" }, { name: "Telegram-бот", mark: "TG" }, { name: "Google Таблицы", mark: "GS" }, { name: "Honest Sign", mark: "ЧЗ" }],
]

const listeners = new Set<() => void>()
let timer: number | undefined

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (timer === undefined) timer = window.setInterval(() => listeners.forEach((fn) => fn()), 1000)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.clearInterval(timer)
      timer = undefined
    }
  }
}

function useSecondsSinceMidnight(): number | null {
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 1000), () => null)
  if (tick === null) return null
  const now = new Date()
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
}

function formatNumber(value: number) {
  return String(Math.floor(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function markOf(item: Logocloud014Item) {
  return item.mark ?? item.name.slice(0, 2).toUpperCase()
}

/** Интеграции бегущими строками и счётчики от текущего времени. */
export function Logocloud014({
  eyebrow = "Интеграции",
  title = "Подключается к тому, чем вы уже пользуетесь",
  rows = DEFAULT_ROWS,
  counters = [
    { label: "компаний ведут счёт в Оси", base: 48210, perSecond: 0.0021 },
    { label: "переводов за сегодня", base: 0, perSecond: 3.4 },
  ],
  speed = 40,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Logocloud014Props) {
  const seconds = useSecondsSinceMidnight()

  const palette = {
    ...(accent ? { "--vibeui-logocloud-014-accent": accent } : null),
    ...(ink ? { "--vibeui-logocloud-014-fg": ink } : null),
    ...(background ? { "--vibeui-logocloud-014-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-logocloud-014" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="logocloud-014" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
          </div>
          {counters.length > 0 ? (
            <ul data-part="counters">
              {counters.map((counter) => (
                <li key={counter.label} data-part="counter">
                  <strong aria-live="off">{seconds === null ? "— — —" : `${formatNumber(counter.base + counter.perSecond * seconds)}${counter.suffix ?? ""}`}</strong>
                  <span>{counter.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div data-part="rows" aria-label="Интеграции">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} data-part="row" data-dir={rowIndex % 2 ? "rtl" : "ltr"} style={{ ["--vibeui-logocloud-014-t" as string]: `${speed + rowIndex * 8}s` }}>
              {[0, 1].map((copy) => (
                <ul key={copy} data-part="lane" aria-hidden={copy === 1 ? true : undefined}>
                  {row.map((item) => (
                    <li key={item.name} data-part="chip">
                      <i aria-hidden="true">{markOf(item)}</i>
                      {item.name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
