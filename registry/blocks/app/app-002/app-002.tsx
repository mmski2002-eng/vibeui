"use client"

import { useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type App002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  beforeLabel?: string
  afterLabel?: string
  /** Часы сна по дням недели до и после — семь чисел. */
  before?: readonly number[]
  after?: readonly number[]
  days?: readonly string[]
  /** Подписи под графиком: среднее до / после, засыпание. */
  beforeNote?: string
  afterNote?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «До / после» с ползунком сравнения: два графика сна за неделю лежат друг
// на друге, верхний обрезан clip-path по положению ползунка, который тянут
// мышью или пальцем (pointer events, доля ширины в состоянии). Слева — до
// приложения, справа — после; подписи среднего часа и засыпания меняют
// прозрачность вместе с ползунком. Рукоятка — с двумя стрелками.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="app-002"]){
--vibeui-app-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-app-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-app-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-app-002-on-accent:oklch(from var(--vibeui-app-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-app-002-muted:color-mix(in oklab,var(--vibeui-app-002-fg) 60%,var(--vibeui-app-002-bg));
--vibeui-app-002-line:color-mix(in oklab,var(--vibeui-app-002-fg) 12%,transparent);
--vibeui-app-002-panel:color-mix(in oklab,var(--vibeui-app-002-fg) 5%,var(--vibeui-app-002-bg));
--vibeui-app-002-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-app-002-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-app-002-p:0.5;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="app-002"]{color-scheme:dark}
:where([data-vibeui-block="app-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="app-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="app-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-app-002-bg);color:var(--vibeui-app-002-fg);font-family:var(--vibeui-app-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="app-002"] *{box-sizing:border-box}
[data-vibeui-block="app-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="app-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:600;color:var(--vibeui-app-002-accent)}
[data-vibeui-block="app-002"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,5cqi,3.4rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="app-002"] [data-part="lede"]{margin:1rem 0 0;max-width:28rem;color:var(--vibeui-app-002-muted)}
[data-vibeui-block="app-002"] [data-part="notes"]{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.8rem}
[data-vibeui-block="app-002"] [data-part="notes"] div{padding:1rem 1.1rem;border-radius:1rem;background:var(--vibeui-app-002-panel);transition:opacity .3s}
[data-vibeui-block="app-002"] [data-part="notes"] div:first-child{opacity:calc(1 - var(--vibeui-app-002-p) * .6)}
[data-vibeui-block="app-002"] [data-part="notes"] div:last-child{opacity:calc(.4 + var(--vibeui-app-002-p) * .6);box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-app-002-accent) 50%,transparent) inset}
[data-vibeui-block="app-002"] [data-part="notes"] small{display:block;font-family:var(--vibeui-app-002-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-app-002-muted)}
[data-vibeui-block="app-002"] [data-part="notes"] b{display:block;margin-top:.3rem;font-size:1.4rem;font-weight:800;letter-spacing:-.02em}
[data-vibeui-block="app-002"] [data-part="notes"] span{font-size:.82rem;color:var(--vibeui-app-002-muted)}
[data-vibeui-block="app-002"] [data-part="compare"]{position:relative;height:20rem;border-radius:1.4rem;background:var(--vibeui-app-002-panel);overflow:hidden;user-select:none;-webkit-user-select:none;touch-action:pan-y;cursor:ew-resize}
[data-vibeui-block="app-002"] [data-part="chart"]{position:absolute;inset:0;display:flex;align-items:flex-end;gap:.6rem;padding:3rem 1.5rem 2.4rem}
[data-vibeui-block="app-002"] [data-part="chart"][data-side="after"]{clip-path:inset(0 0 0 calc(var(--vibeui-app-002-p) * 100%))}
[data-vibeui-block="app-002"] [data-part="chart"] i{flex:1;position:relative;height:calc(var(--vibeui-app-002-h) * 100%);border-radius:.5rem .5rem .2rem .2rem;background:color-mix(in oklab,var(--vibeui-app-002-fg) 22%,transparent)}
[data-vibeui-block="app-002"] [data-part="chart"][data-side="after"] i{background:var(--vibeui-app-002-accent)}
[data-vibeui-block="app-002"] [data-part="chart"] i::after{content:attr(data-v);position:absolute;left:50%;top:-1.4rem;transform:translateX(-50%);font-family:var(--vibeui-app-002-mono);font-size:.68rem;color:var(--vibeui-app-002-muted)}
[data-vibeui-block="app-002"] [data-part="chart"][data-side="after"] i::after{color:var(--vibeui-app-002-accent)}
[data-vibeui-block="app-002"] [data-part="days"]{position:absolute;left:1.5rem;right:1.5rem;bottom:.8rem;display:flex;gap:.6rem;font-family:var(--vibeui-app-002-mono);font-size:.68rem;color:var(--vibeui-app-002-muted)}
[data-vibeui-block="app-002"] [data-part="days"] span{flex:1;text-align:center}
[data-vibeui-block="app-002"] [data-part="tag"]{position:absolute;top:.9rem;padding:.3rem .6rem;border-radius:999px;font-size:.72rem;font-weight:600;background:var(--vibeui-app-002-bg);box-shadow:0 0 0 1px var(--vibeui-app-002-line)}
[data-vibeui-block="app-002"] [data-part="tag"][data-side="before"]{left:.9rem}
[data-vibeui-block="app-002"] [data-part="tag"][data-side="after"]{right:.9rem;background:var(--vibeui-app-002-accent);color:var(--vibeui-app-002-on-accent);box-shadow:none}
[data-vibeui-block="app-002"] [data-part="handle"]{position:absolute;top:0;bottom:0;left:calc(var(--vibeui-app-002-p) * 100%);width:2px;background:var(--vibeui-app-002-fg);transform:translateX(-50%)}
[data-vibeui-block="app-002"] [data-part="handle"] i{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:2.6rem;height:2.6rem;border-radius:50%;background:var(--vibeui-app-002-fg);color:var(--vibeui-app-002-bg);display:grid;place-items:center;font-size:.8rem;font-style:normal;letter-spacing:-.1em;box-shadow:0 8px 20px -8px rgb(0 0 0 / .6)}
[data-vibeui-block="app-002"] [data-part="range"]{position:absolute;inset:0;width:100%;height:100%;opacity:0;margin:0;cursor:ew-resize}
[data-vibeui-block="app-002"] [data-part="range"]:focus-visible + [data-part="handle"] i{outline:2px solid var(--vibeui-app-002-accent);outline-offset:3px}
@container (min-width: 60rem){[data-vibeui-block="app-002"] [data-part="shell"]{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="app-002"] *{transition:none!important}}`

/** «До / после»: два графика сна и ползунок сравнения. */
export function App002({
  eyebrow = "Результат",
  title = "Неделя до и неделя после",
  lede = "Данные восьмисот пользователей за первый месяц. Тяните ползунок — увидите разницу по дням.",
  beforeLabel = "до",
  afterLabel = "после",
  before = [5.4, 6.1, 5.8, 6.4, 5.2, 7.0, 6.6],
  after = [7.1, 7.4, 7.2, 7.6, 7.0, 8.1, 7.8],
  days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
  beforeNote = "засыпали за 48 мин",
  afterNote = "засыпают за 12 мин",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: App002Props) {
  const box = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0.5)
  const avg = (list: readonly number[]) => (list.reduce((a, b) => a + b, 0) / Math.max(1, list.length)).toFixed(1)
  const max = Math.max(...before, ...after, 1)

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1 && event.pointerType === "mouse") return
    const rect = box.current?.getBoundingClientRect()
    if (!rect) return
    setP(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)))
  }

  const palette = {
    "--vibeui-app-002-p": p,
    ...(accent ? { "--vibeui-app-002-accent": accent } : null),
    ...(ink ? { "--vibeui-app-002-fg": ink } : null),
    ...(background ? { "--vibeui-app-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-app-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="app-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="notes">
              <div>
                <small>{beforeLabel}</small>
                <b>{avg(before)} ч</b>
                <span>{beforeNote}</span>
              </div>
              <div>
                <small>{afterLabel}</small>
                <b>{avg(after)} ч</b>
                <span>{afterNote}</span>
              </div>
            </div>
          </div>
          <div ref={box} data-part="compare" onPointerDown={move} onPointerMove={move}>
            <div data-part="chart" data-side="before" aria-hidden="true">
              {before.map((v, i) => (
                <i key={i} data-v={v} style={{ ["--vibeui-app-002-h" as string]: v / max }} />
              ))}
            </div>
            <div data-part="chart" data-side="after" aria-hidden="true">
              {after.map((v, i) => (
                <i key={i} data-v={v} style={{ ["--vibeui-app-002-h" as string]: v / max }} />
              ))}
            </div>
            <div data-part="days" aria-hidden="true">
              {days.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <span data-part="tag" data-side="before">
              {beforeLabel}
            </span>
            <span data-part="tag" data-side="after">
              {afterLabel}
            </span>
            <input data-part="range" type="range" min={0} max={100} value={Math.round(p * 100)} onChange={(event) => setP(Number(event.target.value) / 100)} aria-label="Сравнение до и после" />
            <div data-part="handle" aria-hidden="true">
              <i>◀ ▶</i>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
