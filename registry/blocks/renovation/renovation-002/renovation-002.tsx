"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Renovation002Stage = {
  name: string
  /** Начало и длительность в неделях. */
  start: number
  weeks: number
  text: string
  /** Кто ведёт этап. */
  crew?: string
}

export type Renovation002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  stages?: readonly Renovation002Stage[]
  /** Всего недель на шкале. Пусто — по последнему этапу. */
  totalWeeks?: number
  hereLabel?: string
  /** Подпись под шкалой. */
  fine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Этапы ремонта как диаграмма Ганта на sticky-сцене: секция выше экрана,
// внутри липкая панель с полосами этапов по неделям. Пока страница
// прокручивается сквозь секцию, по шкале едет маркер «вы здесь», полосы
// заливаются акцентом ровно на пройденную долю, текущий этап раскрывает
// описание и бригаду, пройденные получают галочку. Прогресс считается из
// scrollY в обработчике, в CSS уходит одна переменная на полосу.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="renovation-002"]){
--vibeui-renovation-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-renovation-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-renovation-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-renovation-002-on-accent:oklch(from var(--vibeui-renovation-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-renovation-002-muted:color-mix(in oklab,var(--vibeui-renovation-002-fg) 62%,var(--vibeui-renovation-002-bg));
--vibeui-renovation-002-line:color-mix(in oklab,var(--vibeui-renovation-002-fg) 16%,transparent);
--vibeui-renovation-002-grid:color-mix(in oklab,var(--vibeui-renovation-002-fg) 7%,transparent);
--vibeui-renovation-002-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-renovation-002-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-renovation-002-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="renovation-002"]{color-scheme:dark}
:where([data-vibeui-block="renovation-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="renovation-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="renovation-002"]{box-sizing:border-box;background-color:var(--vibeui-renovation-002-bg);color:var(--vibeui-renovation-002-fg);font-family:var(--vibeui-renovation-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="renovation-002"] *{box-sizing:border-box}
[data-vibeui-block="renovation-002"] [data-part="track"]{position:relative;min-height:calc(var(--vibeui-renovation-002-steps) * 34svh + 100svh)}
[data-vibeui-block="renovation-002"] [data-part="stage"]{position:sticky;top:0;max-height:100svh;overflow:hidden;padding:clamp(1.25rem,4cqi,3.5rem) 0;background-image:linear-gradient(var(--vibeui-renovation-002-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-renovation-002-grid) 1px,transparent 1px);background-size:5rem 5rem}
[data-vibeui-block="renovation-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:1.5rem}
[data-vibeui-block="renovation-002"] [data-part="head"]{display:grid;gap:.6rem;max-width:44rem}
[data-vibeui-block="renovation-002"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0;font-family:var(--vibeui-renovation-002-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-renovation-002-muted)}
[data-vibeui-block="renovation-002"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-renovation-002-accent)}
[data-vibeui-block="renovation-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-renovation-002-display);font-weight:800;font-size:clamp(1.8rem,4.6cqi,3.4rem);line-height:1;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="renovation-002"] [data-part="lede"]{margin:0;color:var(--vibeui-renovation-002-muted);font-size:.95rem}
[data-vibeui-block="renovation-002"] [data-part="chart"]{position:relative;display:grid;grid-template-columns:minmax(6rem,9rem) minmax(0,1fr);gap:0;border:1px solid var(--vibeui-renovation-002-line);background:color-mix(in oklab,var(--vibeui-renovation-002-bg) 72%,transparent)}
[data-vibeui-block="renovation-002"] [data-part="axis"]{grid-column:2;display:grid;grid-template-columns:repeat(var(--vibeui-renovation-002-total),1fr);border-bottom:1px solid var(--vibeui-renovation-002-line);font-family:var(--vibeui-renovation-002-mono);font-size:.62rem;color:var(--vibeui-renovation-002-muted)}
[data-vibeui-block="renovation-002"] [data-part="axis"] span{padding:.35rem 0 .3rem .3rem;border-left:1px dashed var(--vibeui-renovation-002-line);white-space:nowrap;overflow:hidden}
[data-vibeui-block="renovation-002"] [data-part="axis"] span:nth-child(even){color:transparent}
[data-vibeui-block="renovation-002"] [data-part="corner"]{grid-column:1;grid-row:1;display:flex;align-items:end;padding:.35rem .6rem .3rem;border-right:1px solid var(--vibeui-renovation-002-line);border-bottom:1px solid var(--vibeui-renovation-002-line);font-family:var(--vibeui-renovation-002-mono);font-size:.62rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-renovation-002-muted)}
[data-vibeui-block="renovation-002"] [data-part="rows"]{display:contents}
[data-vibeui-block="renovation-002"] [data-part="row"]{display:contents}
[data-vibeui-block="renovation-002"] [data-part="name"]{display:flex;align-items:center;gap:.4rem;min-height:2.4rem;padding:.35rem .6rem;border-right:1px solid var(--vibeui-renovation-002-line);border-bottom:1px solid var(--vibeui-renovation-002-line);font-size:.8rem;font-weight:500;line-height:1.2;transition:color .2s}
[data-vibeui-block="renovation-002"] [data-part="name"] svg{flex-shrink:0;width:.85rem;height:.85rem;color:var(--vibeui-renovation-002-accent);opacity:0;transform:scale(.5);transition:opacity .25s,transform .25s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="renovation-002"] [data-part="row"][data-state="done"] [data-part="name"] svg{opacity:1;transform:scale(1)}
[data-vibeui-block="renovation-002"] [data-part="row"][data-state="todo"] [data-part="name"]{color:var(--vibeui-renovation-002-muted)}
[data-vibeui-block="renovation-002"] [data-part="row"][data-state="now"] [data-part="name"]{font-weight:700}
[data-vibeui-block="renovation-002"] [data-part="lane"]{position:relative;border-bottom:1px solid var(--vibeui-renovation-002-line);background-image:repeating-linear-gradient(90deg,transparent 0 calc(100% / var(--vibeui-renovation-002-total) - 1px),var(--vibeui-renovation-002-line) calc(100% / var(--vibeui-renovation-002-total) - 1px) calc(100% / var(--vibeui-renovation-002-total)))}
[data-vibeui-block="renovation-002"] [data-part="bar"]{position:absolute;top:.55rem;bottom:.55rem;left:calc(var(--vibeui-renovation-002-start) / var(--vibeui-renovation-002-total) * 100%);width:calc(var(--vibeui-renovation-002-len) / var(--vibeui-renovation-002-total) * 100%);border:1px solid color-mix(in oklab,var(--vibeui-renovation-002-fg) 40%,transparent);background:color-mix(in oklab,var(--vibeui-renovation-002-fg) 6%,transparent);overflow:hidden;transition:border-color .3s}
[data-vibeui-block="renovation-002"] [data-part="bar"]::after{content:"";position:absolute;inset:0;background:var(--vibeui-renovation-002-accent);transform:scaleX(var(--vibeui-renovation-002-p));transform-origin:left;transition:transform .15s linear}
[data-vibeui-block="renovation-002"] [data-part="row"][data-state="now"] [data-part="bar"]{border-color:var(--vibeui-renovation-002-fg)}
[data-vibeui-block="renovation-002"] [data-part="here"]{position:absolute;grid-column:2;top:0;bottom:0;left:calc(var(--vibeui-renovation-002-here) * 100%);width:0;border-left:2px solid var(--vibeui-renovation-002-fg);pointer-events:none;transition:left .15s linear;z-index:2}
[data-vibeui-block="renovation-002"] [data-part="here"] span{position:absolute;top:-.1rem;left:-.35rem;padding:.25rem .5rem;background:var(--vibeui-renovation-002-fg);color:var(--vibeui-renovation-002-bg);font-family:var(--vibeui-renovation-002-mono);font-size:.62rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}
[data-vibeui-block="renovation-002"] [data-part="here"][data-end="true"] span{left:auto;right:-.35rem}
[data-vibeui-block="renovation-002"] [data-part="now"]{display:grid;gap:.3rem;min-height:5.2rem;padding:1rem 1.2rem;border:1px solid var(--vibeui-renovation-002-fg);background:color-mix(in oklab,var(--vibeui-renovation-002-bg) 80%,transparent)}
[data-vibeui-block="renovation-002"] [data-part="now"] small{font-family:var(--vibeui-renovation-002-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-renovation-002-muted)}
[data-vibeui-block="renovation-002"] [data-part="now"] h3{margin:0;font-family:var(--vibeui-renovation-002-display);font-weight:700;font-size:1.25rem;letter-spacing:-.02em}
[data-vibeui-block="renovation-002"] [data-part="now"] p{margin:0;font-size:.92rem;color:var(--vibeui-renovation-002-muted)}
[data-vibeui-block="renovation-002"] [data-part="now"] b{font-family:var(--vibeui-renovation-002-mono);font-weight:500;font-size:.78rem;color:var(--vibeui-renovation-002-fg)}
[data-vibeui-block="renovation-002"] [data-part="fine"]{margin:0;font-family:var(--vibeui-renovation-002-mono);font-size:.7rem;color:var(--vibeui-renovation-002-muted)}
@container (min-width: 60rem){[data-vibeui-block="renovation-002"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) 20rem;grid-template-areas:"head head" "chart now" "fine fine";align-items:start;gap:1.5rem 2rem}[data-vibeui-block="renovation-002"] [data-part="head"]{grid-area:head}[data-vibeui-block="renovation-002"] [data-part="chart"]{grid-area:chart;grid-template-columns:minmax(9rem,13rem) minmax(0,1fr)}[data-vibeui-block="renovation-002"] [data-part="now"]{grid-area:now;position:sticky;top:0}[data-vibeui-block="renovation-002"] [data-part="fine"]{grid-area:fine}[data-vibeui-block="renovation-002"] [data-part="name"]{font-size:.9rem;min-height:3rem}[data-vibeui-block="renovation-002"] [data-part="axis"] span:nth-child(even){color:inherit}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="renovation-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_STAGES: Renovation002Stage[] = [
  { name: "Демонтаж", start: 0, weeks: 1, text: "Снимаем всё до бетона, вывозим мусор в тот же день. Соседей предупреждаем письмом за три дня.", crew: "Игорь + 3" },
  { name: "Перегородки", start: 1, weeks: 1.5, text: "Кладём новые стены из пазогребня по согласованной перепланировке. Проёмы усиливаем.", crew: "Игорь + 2" },
  { name: "Электрика, черновая", start: 2, weeks: 2, text: "Штробы, кабель в гофре, щит на 36 модулей. Каждую линию прозваниваем и подписываем.", crew: "Дмитрий" },
  { name: "Сантехника, черновая", start: 2.5, weeks: 1.5, text: "Разводка воды и канализации, коллекторы, опрессовка 10 бар.", crew: "Артём" },
  { name: "Стяжка и штукатурка", start: 4, weeks: 2, text: "Полусухая стяжка, штукатурка по маякам. Через две недели — влажность проверяем прибором.", crew: "Марат + 2" },
  { name: "Плитка", start: 6, weeks: 2, text: "Санузлы и кухня. Швы 1,5 мм, крестики-СВП, углы под 45°.", crew: "Ринат" },
  { name: "Потолки и малярка", start: 7, weeks: 2.5, text: "Шпаклёвка в три слоя, ошкуривание с лампой, покраска валиком в два слоя.", crew: "Ольга + 1" },
  { name: "Полы и двери", start: 9.5, weeks: 1.5, text: "Инженерная доска по подложке, плинтус в цвет, двери и наличники.", crew: "Марат" },
  { name: "Чистовая и приёмка", start: 11, weeks: 1, text: "Розетки, светильники, сантехника, уборка. Подписываем акт — только если вы довольны.", crew: "вся бригада" },
]

/** Этапы работ диаграммой Ганта, по которой едет маркер при прокрутке. */
export function Renovation002({
  eyebrow = "Этапы работ",
  title = "12 недель по календарю, а не «как пойдёт»",
  lede = "Прокручивайте — маркер идёт по неделям, как идёт стройка. Каждый этап начинается в свою дату, и вы видите её в договоре.",
  stages = DEFAULT_STAGES,
  totalWeeks,
  hereLabel = "вы здесь",
  fine = "Пример графика капитального ремонта 54 м². Ваш график — после замера, в тот же день.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Renovation002Props) {
  const total = totalWeeks ?? Math.ceil(Math.max(...stages.map((stage) => stage.start + stage.weeks)))
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = track.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const value = travel > 0 ? -rect.top / travel : 0
      setProgress(Math.min(1, Math.max(0, value)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const week = progress * total
  const nowIndex = stages.findIndex((stage) => week >= stage.start && week < stage.start + stage.weeks)
  const current = nowIndex >= 0 ? stages[nowIndex] : week >= total ? stages[stages.length - 1] : stages[0]
  const weekLabel = Math.min(total, Math.floor(week) + 1)

  const palette = {
    ...(accent ? { "--vibeui-renovation-002-accent": accent } : null),
    ...(ink ? { "--vibeui-renovation-002-fg": ink } : null),
    ...(background ? { "--vibeui-renovation-002-bg": background } : null),
    "--vibeui-renovation-002-total": total,
    "--vibeui-renovation-002-steps": stages.length,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-renovation-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="renovation-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="track" ref={trackRef}>
          <div data-part="stage">
            <div data-part="shell">
              <div data-part="head">
                {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
                <h2 data-part="title">{title}</h2>
                {lede ? <p data-part="lede">{lede}</p> : null}
              </div>
              <div data-part="chart" role="table" aria-label="График работ по неделям">
                <div data-part="corner" role="columnheader">
                  Этап / неделя
                </div>
                <div data-part="axis" role="row" aria-hidden="true">
                  {Array.from({ length: total }, (_, index) => (
                    <span key={index}>{index + 1}</span>
                  ))}
                </div>
                <div data-part="rows" role="rowgroup">
                  {stages.map((stage, index) => {
                    const done = week >= stage.start + stage.weeks
                    const state = done ? "done" : index === nowIndex ? "now" : "todo"
                    return (
                      <div key={stage.name} data-part="row" data-state={state} role="row">
                        <div data-part="name" role="rowheader">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M3 8.5l3.5 3.5L13 5" />
                          </svg>
                          {stage.name}
                        </div>
                        <div
                          data-part="lane"
                          role="cell"
                          aria-label={`недели ${stage.start + 1}–${Math.ceil(stage.start + stage.weeks)}`}
                          style={{ ["--vibeui-renovation-002-start" as string]: stage.start, ["--vibeui-renovation-002-len" as string]: stage.weeks }}
                        >
                          <div data-part="bar" style={{ ["--vibeui-renovation-002-p" as string]: Math.min(1, Math.max(0, (week - stage.start) / stage.weeks)).toFixed(3) }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div data-part="here" data-end={progress > 0.85} style={{ ["--vibeui-renovation-002-here" as string]: progress.toFixed(4), gridRow: `1 / span ${stages.length + 1}` }} aria-hidden="true">
                  <span>
                    {hereLabel} · нед {weekLabel}
                  </span>
                </div>
              </div>
              <div data-part="now" aria-live="polite">
                <small>
                  {nowIndex >= 0 ? `Этап ${nowIndex + 1} из ${stages.length}` : week >= total ? "Объект сдан" : "Старт"} · нед {Math.min(total, Math.floor(current.start) + 1)}–{Math.ceil(current.start + current.weeks)}
                </small>
                <h3>{current.name}</h3>
                <p>{current.text}</p>
                {current.crew ? <b>бригада: {current.crew}</b> : null}
              </div>
              {fine ? <p data-part="fine">{fine}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
