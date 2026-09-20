"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Bento014Number = {
  value: number
  label: string
  /** Суффикс после числа: «+», «%». */
  suffix?: string
}

export type Bento014City = {
  name: string
  years: string
}

export type Bento014Props = {
  eyebrow?: string
  title?: string
  /** Портрет и рабочий стол — две фотоплитки. Пусто — типографские плитки. */
  portrait?: string
  desk?: string
  bio?: readonly string[]
  numbers?: readonly Bento014Number[]
  cities?: readonly Bento014City[]
  /** Одна фраза-факт в отдельной плитке. */
  fact?: string
  /** Текст плитки «рабочий стол», если фото нет. */
  deskNote?: string
  /** Что пишется сейчас и на сколько готово. */
  nowTitle?: string
  nowNote?: string
  nowPercent?: number
  /** Подписи ячеек бенто. */
  portraitAlt?: string
  portraitCaption?: string
  portraitLabel?: string
  portraitFact?: string
  bioLabel?: string
  nowLabel?: string
  draftLine?: string
  numbersLabel?: string
  citiesLabel?: string
  deskAlt?: string
  deskCaption?: string
  deskLabel?: string
  factLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «О себе» как bento: плитки разного размера на тонких линиях, без карточных
// теней — как развороты книги. Высокий портрет, плитка с биографией,
// три цифры, которые докручиваются, когда плитка появляется на экране
// (IntersectionObserver + requestAnimationFrame), маршрут городов с годами,
// плитка-факт курсивом, «сейчас пишу» с полосой готовности черновика и
// рабочий стол. На узком экране всё в одну колонку.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"

const STYLES = `
:where([data-vibeui-block="bento-014"]){
--vibeui-bento-014-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bento-014-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-014-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-014-muted:color-mix(in oklab,var(--vibeui-bento-014-fg) 60%,var(--vibeui-bento-014-bg));
--vibeui-bento-014-line:color-mix(in oklab,var(--vibeui-bento-014-fg) 14%,transparent);
--vibeui-bento-014-paper:color-mix(in oklab,var(--vibeui-bento-014-bg) 95%,var(--vibeui-bento-014-fg));
--vibeui-bento-014-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-bento-014-font:"PT Serif",Georgia,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-014"]{color-scheme:dark}
:where([data-vibeui-block="bento-014"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-014"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="bento-014"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="bento-014"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="bento-014"]{box-sizing:border-box;padding:clamp(4rem,8cqi,7rem) 0;background:var(--vibeui-bento-014-bg);color:var(--vibeui-bento-014-fg);font-family:var(--vibeui-bento-014-font);font-size:1.05rem;line-height:1.65;transition:background-color .6s,color .6s}
[data-vibeui-block="bento-014"] *{box-sizing:border-box}
[data-vibeui-block="bento-014"] [data-part="shell"]{max-width:74rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bento-014"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-bento-014-accent)}
[data-vibeui-block="bento-014"] [data-part="title"]{margin:0 0 2.5rem;font-family:var(--vibeui-bento-014-display);font-weight:400;font-size:clamp(2.4rem,6cqi,4.4rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="bento-014"] [data-part="grid"]{display:grid;gap:1px;background:var(--vibeui-bento-014-line);border:1px solid var(--vibeui-bento-014-line);transition:background-color .6s,border-color .6s}
[data-vibeui-block="bento-014"] [data-part="tile"]{position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:1.2rem;min-height:12rem;padding:1.6rem;background:var(--vibeui-bento-014-bg);overflow:hidden;transition:background-color .6s}
[data-vibeui-block="bento-014"] [data-part="tile"][data-photo]{padding:0;min-height:20rem}
[data-vibeui-block="bento-014"] [data-part="tile"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bento-014"] [data-part="tile"]:hover img{transform:scale(1.04)}
[data-vibeui-block="bento-014"] [data-part="caption"]{position:absolute;left:1.2rem;bottom:1rem;padding:.3rem .7rem;background:color-mix(in oklab,var(--vibeui-bento-014-bg) 80%,transparent);backdrop-filter:blur(8px);font-size:.72rem;font-style:italic;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-bento-014-fg)}
[data-vibeui-block="bento-014"] [data-part="label"]{margin:0;font-size:.72rem;font-style:italic;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-bento-014-muted)}
[data-vibeui-block="bento-014"] [data-part="bio"]{margin:0;display:grid;gap:.8em;max-width:34rem}
[data-vibeui-block="bento-014"] [data-part="bio"] p{margin:0}
[data-vibeui-block="bento-014"] [data-part="bio"] p:first-child::first-letter{float:left;font-family:var(--vibeui-bento-014-display);font-size:3.4em;line-height:.8;padding:.08em .14em 0 0;color:var(--vibeui-bento-014-accent)}
[data-vibeui-block="bento-014"] [data-part="numbers"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="bento-014"] [data-part="numbers"] b{display:block;font-family:var(--vibeui-bento-014-display);font-weight:400;font-size:clamp(2.6rem,5cqi,4rem);line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="bento-014"] [data-part="numbers"] b span{color:var(--vibeui-bento-014-accent)}
[data-vibeui-block="bento-014"] [data-part="numbers"] small{display:block;margin-top:.4rem;font-size:.8rem;font-style:italic;color:var(--vibeui-bento-014-muted)}
[data-vibeui-block="bento-014"] [data-part="cities"]{margin:0;padding:0;list-style:none;display:grid}
[data-vibeui-block="bento-014"] [data-part="cities"] li{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;padding:.55rem 0;border-top:1px solid var(--vibeui-bento-014-line);font-family:var(--vibeui-bento-014-display);font-size:1.35rem;transition:padding-left .4s cubic-bezier(.2,.8,.2,1),color .3s}
[data-vibeui-block="bento-014"] [data-part="cities"] li:hover{padding-left:.6rem;color:var(--vibeui-bento-014-accent)}
[data-vibeui-block="bento-014"] [data-part="cities"] small{font-family:var(--vibeui-bento-014-font);font-size:.8rem;font-style:italic;color:var(--vibeui-bento-014-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="bento-014"] [data-part="fact"]{margin:0;font-family:var(--vibeui-bento-014-display);font-style:italic;font-size:clamp(1.5rem,2.6cqi,2rem);line-height:1.3}
[data-vibeui-block="bento-014"] [data-part="fact"]::before{content:"«";color:var(--vibeui-bento-014-accent)}
[data-vibeui-block="bento-014"] [data-part="fact"]::after{content:"»";color:var(--vibeui-bento-014-accent)}
[data-vibeui-block="bento-014"] [data-part="now"]{display:grid;gap:.5rem}
[data-vibeui-block="bento-014"] [data-part="now"] b{font-family:var(--vibeui-bento-014-display);font-weight:400;font-size:1.6rem;line-height:1.1}
[data-vibeui-block="bento-014"] [data-part="now"] p{margin:0;font-size:.9rem;color:var(--vibeui-bento-014-muted)}
[data-vibeui-block="bento-014"] [data-part="bar"]{position:relative;height:3px;background:var(--vibeui-bento-014-line);margin-top:.4rem;overflow:hidden}
[data-vibeui-block="bento-014"] [data-part="bar"] i{position:absolute;inset:0;background:var(--vibeui-bento-014-accent);transform:scaleX(0);transform-origin:left;transition:transform 1.6s cubic-bezier(.2,.8,.2,1) .2s}
[data-vibeui-block="bento-014"][data-live="true"] [data-part="bar"] i{transform:scaleX(var(--vibeui-bento-014-now))}
[data-vibeui-block="bento-014"] [data-part="now"] output{font-size:.8rem;font-style:italic;color:var(--vibeui-bento-014-muted);font-variant-numeric:tabular-nums}
@container (min-width: 44rem){[data-vibeui-block="bento-014"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:dense}[data-vibeui-block="bento-014"] [data-part="tile"][data-span="2"]{grid-column:span 2}}
@container (min-width: 64rem){[data-vibeui-block="bento-014"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:minmax(14rem,auto)}[data-vibeui-block="bento-014"] [data-part="tile"][data-span="2"],[data-vibeui-block="bento-014"] [data-part="tile"][data-wide]{grid-column:span 2}[data-vibeui-block="bento-014"] [data-part="tile"][data-tall]{grid-row:span 2}[data-vibeui-block="bento-014"] [data-part="tile"][data-photo]{min-height:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-014"] *{animation:none!important;transition:none!important}[data-vibeui-block="bento-014"] [data-part="bar"] i{transform:scaleX(var(--vibeui-bento-014-now))}}`

const DEFAULT_NUMBERS: Bento014Number[] = [
  { value: 142, label: "эссе написано" },
  { value: 2, label: "книги изданы" },
  { value: 18400, label: "читателей писем", suffix: "+" },
]

function formatNumber(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/** «О себе» как bento: портрет, докручивающиеся цифры, города, факт и черновик. */
export function Bento014({
  eyebrow = "О себе",
  title = "Коротко, в цифрах и городах",
  portrait,
  desk,
  bio = [
    "Родилась в Петербурге, в доме с эркером, который потом снесли. Училась на филолога, работала редактором в трёх журналах, два из них закрылись — не из-за меня.",
    "Пишу эссе с 2019 года: сначала в письмах друзьям, потом в колонке, потом в книгу. Живу там, где есть балкон и вокзал в получасе.",
  ],
  numbers = DEFAULT_NUMBERS,
  cities = [
    { name: "Петербург", years: "1991–2014" },
    { name: "Москва", years: "2014–2019" },
    { name: "Тбилиси", years: "2019–2021" },
    { name: "Лиссабон", years: "2021–2024" },
    { name: "Петербург", years: "2024 — сейчас" },
  ],
  fact = "Пишу от руки, перепечатываю вечером. Половина текста теряется по дороге — и это лучшая редактура из всех.",
  deskNote = "Стол у окна, тетрадь в клетку, карандаш 2B и чашка, которая никогда не бывает пустой.",
  nowTitle = "Сейчас пишу: «Ночная смена»",
  nowNote = "Книга о людях, которые не спят, когда спит город: пекари, диспетчеры, санитарки. Черновик готов на",
  nowPercent = 62,
  portraitAlt = "Портрет автора",
  portraitCaption = "портрет · 2025",
  portraitLabel = "Портрет",
  portraitFact = "Фотографий мало: я обычно по ту сторону страницы.",
  bioLabel = "Биография",
  nowLabel = "Сейчас пишу",
  draftLine = "черновик · {n}%",
  numbersLabel = "В цифрах",
  citiesLabel = "Города",
  deskAlt = "Рабочий стол автора",
  deskCaption = "рабочий стол",
  deskLabel = "Рабочий стол",
  factLabel = "Факт",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento014Props) {
  const [mode, setMode] = useState<"day" | "night" | null>(null)
  const [live, setLive] = useState(false)
  const [shown, setShown] = useState<readonly number[]>(() => numbers.map(() => 0))
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => window.removeEventListener("vibeui-writer:theme", onTheme)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setLive(true)
        const start = performance.now()
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / 1800)
          const eased = 1 - Math.pow(1 - t, 4)
          setShown(numbers.map((item) => item.value * eased))
          if (t < 1) frame = window.requestAnimationFrame(step)
        }
        frame = window.requestAnimationFrame(step)
      },
      { threshold: 0.25 },
    )
    observer.observe(root)
    return () => {
      observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [numbers])

  const palette = {
    ...(accent ? { "--vibeui-bento-014-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-014-fg": ink } : null),
    ...(background ? { "--vibeui-bento-014-bg": background } : null),
    "--vibeui-bento-014-now": Math.min(1, Math.max(0, nowPercent / 100)),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-014" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="bento-014" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ?? undefined} data-live={live} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            <div data-part="tile" data-photo={portrait ? "true" : undefined} data-tall="">
              {portrait ? (
                <>
                  <img src={portrait} alt={portraitAlt} />
                  <span data-part="caption">{portraitCaption}</span>
                </>
              ) : (
                <>
                  <p data-part="label">{portraitLabel}</p>
                  <p data-part="fact">{portraitFact}</p>
                </>
              )}
            </div>
            <div data-part="tile" data-span="2">
              <p data-part="label">{bioLabel}</p>
              <div data-part="bio">
                {bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div data-part="tile">
              <p data-part="label">{nowLabel}</p>
              <div data-part="now">
                <b>{nowTitle}</b>
                <p>
                  {nowNote} {nowPercent}%.
                </p>
                <span data-part="bar" aria-hidden="true">
                  <i />
                </span>
                <output>{draftLine.replace("{n}", String(nowPercent))}</output>
              </div>
            </div>
            <div data-part="tile" data-span="2">
              <p data-part="label">{numbersLabel}</p>
              <ul data-part="numbers">
                {numbers.map((item, i) => (
                  <li key={item.label}>
                    <b>
                      {formatNumber(shown[i] ?? 0)}
                      {item.suffix ? <span>{item.suffix}</span> : null}
                    </b>
                    <small>{item.label}</small>
                  </li>
                ))}
              </ul>
            </div>
            <div data-part="tile">
              <p data-part="label">{citiesLabel}</p>
              <ul data-part="cities">
                {cities.map((city, i) => (
                  <li key={city.name + i}>
                    <span>{city.name}</span>
                    <small>{city.years}</small>
                  </li>
                ))}
              </ul>
            </div>
            <div data-part="tile" data-photo={desk ? "true" : undefined} data-wide="">
              {desk ? (
                <>
                  <img src={desk} alt={deskAlt} />
                  <span data-part="caption">{deskCaption}</span>
                </>
              ) : (
                <>
                  <p data-part="label">{deskLabel}</p>
                  <p data-part="fact">{deskNote}</p>
                </>
              )}
            </div>
            <div data-part="tile" data-span="2">
              <p data-part="label">{factLabel}</p>
              <p data-part="fact">{fact}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
