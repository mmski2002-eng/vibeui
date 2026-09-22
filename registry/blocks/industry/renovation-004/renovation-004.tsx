"use client"

import { useSyncExternalStore, type CSSProperties } from "react"
import { Card096 } from "@/registry/components/card/card-096/card-096"

export type Renovation004Report = {
  /** День стройки, с 1. */
  day: number
  time?: string
  title: string
  text: string
  photo?: string
  /** Кто написал: прораб, электрик. */
  by?: string
}

export type Renovation004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  object?: string
  /** Сколько дней назад началась стройка — считается от сегодняшней даты. */
  startedDaysAgo?: number
  totalDays?: number
  /** Текущий этап и следующая веха. */
  stage?: string
  next?: string
  reports?: readonly Renovation004Report[]
  /** Сколько отчётов показать. */
  limit?: number
  camLabel?: string
  /** Короткие месяцы и подписи кабинета заказчика. */
  months?: readonly string[]
  loadingLabel?: string
  dayLine?: string
  startLabel?: string
  endLabel?: string
  nowLabel?: string
  nextLabel?: string
  feedLabel?: string
  dayLabel?: string
  plannedLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Стройка онлайн» — демонстрация прозрачности: карточка объекта с
// прогресс-кольцом (день N из M), которое считается от сегодняшней даты
// через useSyncExternalStore (на сервере снимок null — рендерится пустое
// кольцо, на клиенте докручивается переходом). Рядом лента отчётов по
// дням: даты тоже считаются от сегодня, будущие дни помечены
// «запланировано». Два фото из ленты, точка «камера онлайн» пульсирует.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="renovation-004"]){
--vibeui-renovation-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-renovation-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-renovation-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-renovation-004-on-accent:oklch(from var(--vibeui-renovation-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-renovation-004-muted:color-mix(in oklab,var(--vibeui-renovation-004-fg) 62%,var(--vibeui-renovation-004-bg));
--vibeui-renovation-004-line:color-mix(in oklab,var(--vibeui-renovation-004-fg) 16%,transparent);
--vibeui-renovation-004-grid:color-mix(in oklab,var(--vibeui-renovation-004-fg) 9%,transparent);
--vibeui-renovation-004-grid-fine:color-mix(in oklab,var(--vibeui-renovation-004-fg) 4%,transparent);
--vibeui-renovation-004-ok:#3ddc84;
--vibeui-renovation-004-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-renovation-004-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-renovation-004-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="renovation-004"]{color-scheme:dark}
:where([data-vibeui-block="renovation-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="renovation-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="renovation-004"]{box-sizing:border-box;padding:5rem 0;background-color:var(--vibeui-renovation-004-bg);background-image:linear-gradient(var(--vibeui-renovation-004-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-renovation-004-grid) 1px,transparent 1px),linear-gradient(var(--vibeui-renovation-004-grid-fine) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-renovation-004-grid-fine) 1px,transparent 1px);background-size:5rem 5rem,5rem 5rem,1rem 1rem,1rem 1rem;color:var(--vibeui-renovation-004-fg);font-family:var(--vibeui-renovation-004-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="renovation-004"] *{box-sizing:border-box}
[data-vibeui-block="renovation-004"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="renovation-004"] [data-part="head"]{max-width:44rem;margin-bottom:2.5rem}
[data-vibeui-block="renovation-004"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1rem;font-family:var(--vibeui-renovation-004-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-renovation-004-muted)}
[data-vibeui-block="renovation-004"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-renovation-004-accent)}
[data-vibeui-block="renovation-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-renovation-004-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="renovation-004"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-renovation-004-muted)}
[data-vibeui-block="renovation-004"] [data-part="grid"]{display:grid;gap:1.25rem;align-items:start}
[data-vibeui-block="renovation-004"] [data-part="card"]{position:relative;display:grid;gap:1.4rem;padding:1.6rem;border:1px solid var(--vibeui-renovation-004-fg);background:color-mix(in oklab,var(--vibeui-renovation-004-bg) 75%,transparent)}
[data-vibeui-block="renovation-004"] [data-part="card"]::before{content:"";position:absolute;inset:.4rem;border:1px solid var(--vibeui-renovation-004-line);pointer-events:none}
[data-vibeui-block="renovation-004"] [data-part="cam"]{display:inline-flex;align-items:center;gap:.5rem;justify-self:start;padding:.3rem .6rem;border:1px solid var(--vibeui-renovation-004-line);font-family:var(--vibeui-renovation-004-mono);font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-renovation-004-muted)}
[data-vibeui-block="renovation-004"] [data-part="cam"] i{width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-renovation-004-ok);box-shadow:0 0 0 0 var(--vibeui-renovation-004-ok);animation:vibeui-renovation-004-pulse 2s ease-out infinite}
[data-vibeui-block="renovation-004"] [data-part="ring"]{position:relative;width:11rem;aspect-ratio:1;margin:0 auto}
[data-vibeui-block="renovation-004"] [data-part="ring"] svg{width:100%;height:100%;transform:rotate(-90deg)}
[data-vibeui-block="renovation-004"] [data-part="ring"] circle{fill:none;stroke-width:6}
[data-vibeui-block="renovation-004"] [data-part="ring"] circle:nth-child(1){stroke:var(--vibeui-renovation-004-line)}
[data-vibeui-block="renovation-004"] [data-part="ring"] circle:nth-child(2){stroke:var(--vibeui-renovation-004-accent);stroke-linecap:butt;stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--vibeui-renovation-004-p));transition:stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="renovation-004"] [data-part="ring"] [data-part="ticks"]{position:absolute;inset:.9rem;border-radius:50%;background:repeating-conic-gradient(var(--vibeui-renovation-004-line) 0 .6deg,transparent .6deg 30deg);-webkit-mask:radial-gradient(circle,transparent 62%,#000 63%);mask:radial-gradient(circle,transparent 62%,#000 63%)}
[data-vibeui-block="renovation-004"] [data-part="ring"] output{position:absolute;inset:0;display:grid;place-content:center;text-align:center;font-family:var(--vibeui-renovation-004-mono)}
[data-vibeui-block="renovation-004"] [data-part="ring"] output b{font-size:2.2rem;font-weight:600;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="renovation-004"] [data-part="ring"] output small{font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-renovation-004-muted);margin-top:.3rem}
[data-vibeui-block="renovation-004"] [data-part="object"]{margin:0;font-family:var(--vibeui-renovation-004-display);font-weight:700;font-size:1.3rem;letter-spacing:-.02em;line-height:1.15}
[data-vibeui-block="renovation-004"] [data-part="meta"]{display:grid;margin:0;border-top:1px solid var(--vibeui-renovation-004-line)}
[data-vibeui-block="renovation-004"] [data-part="meta"] div{display:grid;grid-template-columns:6rem 1fr;gap:.6rem;padding:.5rem 0;border-bottom:1px solid var(--vibeui-renovation-004-line);font-size:.88rem}
[data-vibeui-block="renovation-004"] [data-part="meta"] dt{font-family:var(--vibeui-renovation-004-mono);font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-renovation-004-muted);padding-top:.15rem}
[data-vibeui-block="renovation-004"] [data-part="meta"] dd{margin:0;font-variant-numeric:tabular-nums}
[data-vibeui-block="renovation-004"] [data-part="feed"]{position:relative;display:grid;gap:0;margin:0;padding:0 0 0 1.4rem;list-style:none;border-left:1px dashed color-mix(in oklab,var(--vibeui-renovation-004-fg) 35%,transparent)}
@keyframes vibeui-renovation-004-pulse{to{box-shadow:0 0 0 .6rem transparent}}
@container (min-width: 60rem){[data-vibeui-block="renovation-004"] [data-part="grid"]{grid-template-columns:22rem minmax(0,1fr);gap:2.5rem}[data-vibeui-block="renovation-004"] [data-part="card"]{position:sticky;top:5.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="renovation-004"] *{animation:none!important;transition:none!important}}`

const DEFAULT_REPORTS: Renovation004Report[] = [
  { day: 38, time: "09:40", title: "Затирка швов в гостевом санузле", text: "Ринат закончил укладку на стенах, сегодня затирка эпоксидной. Люк под ванной — ревизионный, 30×40, скрытый.", photo: "/demo/renovation/site-01.webp", by: "Игорь, прораб" },
  { day: 37, time: "18:10", title: "Опрессовка отопления — 10 бар, держит", text: "Полтора часа под давлением, падения нет. Акт подписал, фото манометра в чате.", by: "Артём, сантехник" },
  { day: 36, time: "12:25", title: "Привезли инженерную доску", text: "Дуб «Натур», 28 коробок, лежит в спальне на акклиматизацию. Влажность стяжки 2,1 % — можно класть с понедельника.", photo: "/demo/renovation/site-02.webp", by: "Игорь, прораб" },
  { day: 34, time: "17:00", title: "Второй слой шпаклёвки в гостиной", text: "Завтра шкурим с лампой, в четверг грунт под покраску. Цвет NCS S 1002-Y — образец на стене у окна.", by: "Ольга, маляр" },
  { day: 41, time: "10:00", title: "Укладка доски в спальне и кабинете", text: "Плавающим способом на подложку 2 мм, зазор у стен 10 мм.", by: "план" },
  { day: 45, time: "10:00", title: "Установка дверей", text: "Шесть полотен скрытого монтажа, коробки уже стоят.", by: "план" },
]

function subscribe(listener: () => void) {
  const timer = window.setInterval(listener, 60000)
  return () => window.clearInterval(timer)
}

function formatDay(dayStart: number, day: number, months: readonly string[]) {
  const date = new Date(dayStart + (day - 1) * 86400000)
  return `${date.getDate()} ${months[date.getMonth()]}`
}

/** Стройка онлайн: прогресс-кольцо от сегодняшней даты и лента отчётов по дням. */
export function Renovation004({
  eyebrow = "Стройка онлайн",
  title = "Вы видите объект каждый день, а не «когда приедете»",
  lede = "Прораб пишет отчёт с фото каждый вечер, камера на объекте — круглосуточно. Так выглядит кабинет заказчика прямо сейчас.",
  object = "Трёшка на Полежаевской, 78 м²",
  startedDaysAgo = 37,
  totalDays = 84,
  stage = "Плитка, малярка",
  next = "Полы — с понедельника",
  reports = DEFAULT_REPORTS,
  limit = 6,
  camLabel = "камера онлайн",
  months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
  loadingLabel = "загрузка",
  dayLine = "день {day} из {total}",
  startLabel = "Старт",
  endLabel = "Сдача",
  nowLabel = "Сейчас",
  nextLabel = "Дальше",
  feedLabel = "Отчёты с объекта",
  dayLabel = "день {n}",
  plannedLabel = "запланировано",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Renovation004Props) {
  // Снимок — начало сегодняшнего дня в мс; на сервере null, чтобы разметка совпала.
  const today = useSyncExternalStore(
    subscribe,
    () => {
      const now = new Date()
      return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    },
    () => null,
  )
  const day = today === null ? 0 : Math.min(totalDays, startedDaysAgo + 1)
  const dayStart = today === null ? 0 : today - startedDaysAgo * 86400000
  const progress = day / totalDays
  const feed = [...reports].sort((a, b) => b.day - a.day).slice(0, limit)

  const palette = {
    ...(accent ? { "--vibeui-renovation-004-accent": accent } : null),
    ...(ink ? { "--vibeui-renovation-004-fg": ink } : null),
    ...(background ? { "--vibeui-renovation-004-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-renovation-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="renovation-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            <div data-part="card">
              {camLabel ? (
                <span data-part="cam">
                  <i aria-hidden="true" />
                  {camLabel}
                </span>
              ) : null}
              <div data-part="ring" style={{ ["--vibeui-renovation-004-p" as string]: progress.toFixed(4) }}>
                <div data-part="ticks" aria-hidden="true" />
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="46" />
                  <circle cx="50" cy="50" r="46" pathLength={1} />
                </svg>
                <output aria-live="polite">
                  <b>{today === null ? "—" : `${Math.round(progress * 100)} %`}</b>
                  <small>{today === null ? loadingLabel : dayLine.replace("{day}", String(day)).replace("{total}", String(totalDays))}</small>
                </output>
              </div>
              <h3 data-part="object">{object}</h3>
              <dl data-part="meta">
                <div>
                  <dt>{startLabel}</dt>
                  <dd>{today === null ? "—" : formatDay(dayStart, 1, months)}</dd>
                </div>
                <div>
                  <dt>{endLabel}</dt>
                  <dd>{today === null ? "—" : formatDay(dayStart, totalDays, months)}</dd>
                </div>
                <div>
                  <dt>{nowLabel}</dt>
                  <dd>{stage}</dd>
                </div>
                <div>
                  <dt>{nextLabel}</dt>
                  <dd>{next}</dd>
                </div>
              </dl>
            </div>
            <ol data-part="feed" aria-label={feedLabel}>
              {feed.map((report) => {
                const future = today !== null && report.day > day
                return (
                  <Card096 key={`${report.day}-${report.title}`} data-part="report" day={report.day} title={report.title} time={report.time} text={report.text} photo={report.photo} by={report.by} dayLabel={dayLabel} months={months} plannedLabel={plannedLabel} future={future} today={today} dayStart={dayStart} accent={accent} />
                )
              })}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
