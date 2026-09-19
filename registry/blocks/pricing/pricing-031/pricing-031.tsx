"use client"

import { useState, type CSSProperties } from "react"

export type Pricing031Format = {
  key: string
  label: string
  /** Цена одного занятия. */
  perLesson: number
  /** Размер: «до 6 человек», «вы и ещё один», «только вы». */
  size: string
  features: readonly string[]
  /** Стикер на карточке: «выбирают 78%». */
  sticker?: string
}

export type Pricing031Row = {
  label: string
  /** По одному значению на колонку: "yes" | "no" | "part" | произвольный текст. */
  values: readonly string[]
}

export type Pricing031Props = {
  eyebrow?: string
  title?: string
  lede?: string
  formats?: readonly Pricing031Format[]
  minPerWeek?: number
  maxPerWeek?: number
  defaultPerWeek?: number
  /** Недель в расчётном месяце. */
  weeksPerMonth?: number
  currency?: string
  actionLabel?: string
  actionHref?: string
  compareTitle?: string
  /** Заголовки колонок сравнения; первая — «мы». */
  compareColumns?: readonly string[]
  compareRows?: readonly Pricing031Row[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Тарифы языковой школы: переключатель формата «группа / пара /
// индивидуально» — сегментный контрол с ползущей подложкой, под ним
// слайдер «занятий в неделю». Справа карточка-«квитанция» с зубчатым краем:
// цена в месяц пересчитывается на лету (tabular-nums, без прыжков), ниже
// цена за занятие и список, что входит. Внизу таблица «мы vs приложение vs
// репетитор» — колонка школы подсвечена и слегка приподнята, отметки
// ✓ / ~ / ✗ в кружках.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="pricing-031"]){
--vibeui-pricing-031-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-pricing-031-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-031-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-031-on-accent:oklch(from var(--vibeui-pricing-031-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-031-muted:color-mix(in oklab,var(--vibeui-pricing-031-fg) 62%,var(--vibeui-pricing-031-bg));
--vibeui-pricing-031-line:color-mix(in oklab,var(--vibeui-pricing-031-fg) 12%,transparent);
--vibeui-pricing-031-rule:color-mix(in oklab,var(--vibeui-pricing-031-fg) 8%,transparent);
--vibeui-pricing-031-paper:color-mix(in oklab,var(--vibeui-pricing-031-bg) 92%,#fff);
--vibeui-pricing-031-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-031-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-031-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-031"]{color-scheme:dark}
:where([data-vibeui-block="pricing-031"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-031"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-031"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-pricing-031-bg);color:var(--vibeui-pricing-031-fg);font-family:var(--vibeui-pricing-031-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-031"] *{box-sizing:border-box}
[data-vibeui-block="pricing-031"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="pricing-031"] [data-part="head"]{max-width:40rem;margin:0 0 2.5rem}
[data-vibeui-block="pricing-031"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-pricing-031-hand);font-size:1.4rem;color:var(--vibeui-pricing-031-accent)}
[data-vibeui-block="pricing-031"] [data-part="title"]{margin:0;font-family:var(--vibeui-pricing-031-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="pricing-031"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-pricing-031-muted)}
[data-vibeui-block="pricing-031"] [data-part="calc"]{display:grid;gap:1.5rem;align-items:start}
[data-vibeui-block="pricing-031"] [data-part="controls"]{display:grid;gap:1.4rem;padding:1.4rem;border-radius:1.4rem;background:var(--vibeui-pricing-031-paper);border:1px solid var(--vibeui-pricing-031-line)}
[data-vibeui-block="pricing-031"] [data-part="label"]{margin:0 0 .6rem;font-size:.78rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-pricing-031-muted)}
[data-vibeui-block="pricing-031"] [data-part="segments"]{position:relative;display:grid;grid-template-columns:repeat(var(--vibeui-pricing-031-n),minmax(0,1fr));padding:.3rem;border-radius:1rem;background:var(--vibeui-pricing-031-bg);border:1px solid var(--vibeui-pricing-031-line)}
[data-vibeui-block="pricing-031"] [data-part="segments"]::before{content:"";position:absolute;top:.3rem;bottom:.3rem;left:.3rem;width:calc((100% - .6rem) / var(--vibeui-pricing-031-n));border-radius:.75rem;background:var(--vibeui-pricing-031-fg);transform:translateX(calc(var(--vibeui-pricing-031-active) * 100%));transition:transform .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="pricing-031"] [data-part="segment"]{position:relative;padding:.7rem .4rem;border:0;border-radius:.75rem;background:transparent;color:var(--vibeui-pricing-031-muted);font:inherit;font-size:.9rem;font-weight:600;cursor:pointer;transition:color .3s}
[data-vibeui-block="pricing-031"] [data-part="segment"][aria-pressed="true"]{color:var(--vibeui-pricing-031-bg)}
[data-vibeui-block="pricing-031"] [data-part="segment"]:focus-visible{outline:2px solid var(--vibeui-pricing-031-accent);outline-offset:2px}
[data-vibeui-block="pricing-031"] [data-part="size"]{margin:.6rem 0 0;font-family:var(--vibeui-pricing-031-hand);font-size:1.15rem;color:var(--vibeui-pricing-031-accent)}
[data-vibeui-block="pricing-031"] [data-part="perweek"]{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 .6rem}
[data-vibeui-block="pricing-031"] [data-part="perweek"] [data-part="label"]{margin:0}
[data-vibeui-block="pricing-031"] [data-part="perweek"] output{font-family:var(--vibeui-pricing-031-display);font-weight:800;font-size:1.4rem;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-031"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.5rem;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-pricing-031-accent) var(--vibeui-pricing-031-fill),var(--vibeui-pricing-031-line) var(--vibeui-pricing-031-fill));outline:none;cursor:pointer}
[data-vibeui-block="pricing-031"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-pricing-031-paper);border:3px solid var(--vibeui-pricing-031-accent);box-shadow:0 0 0 5px color-mix(in oklab,var(--vibeui-pricing-031-accent) 18%,transparent);cursor:grab}
[data-vibeui-block="pricing-031"] [data-part="range"]::-moz-range-thumb{width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-pricing-031-paper);border:3px solid var(--vibeui-pricing-031-accent);box-shadow:0 0 0 5px color-mix(in oklab,var(--vibeui-pricing-031-accent) 18%,transparent);cursor:grab}
[data-vibeui-block="pricing-031"] [data-part="range"]:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-pricing-031-accent) 40%,transparent)}
[data-vibeui-block="pricing-031"] [data-part="ticks"]{display:flex;justify-content:space-between;margin:.5rem 0 0;padding:0;list-style:none;font-size:.72rem;color:var(--vibeui-pricing-031-muted)}
[data-vibeui-block="pricing-031"] [data-part="receipt"]{position:relative;display:grid;gap:1rem;padding:1.8rem 1.6rem 2.2rem;background:var(--vibeui-pricing-031-paper);border:1px solid var(--vibeui-pricing-031-line);border-bottom:0;border-radius:1.2rem 1.2rem 0 0;transform:rotate(.6deg)}
[data-vibeui-block="pricing-031"] [data-part="receipt"]::after{content:"";position:absolute;left:0;right:0;bottom:-.7rem;height:.7rem;background:linear-gradient(135deg,var(--vibeui-pricing-031-paper) 50%,transparent 50%) 0 0/.7rem .7rem repeat-x,linear-gradient(-135deg,var(--vibeui-pricing-031-paper) 50%,transparent 50%) 0 0/.7rem .7rem repeat-x;filter:drop-shadow(0 1px 0 var(--vibeui-pricing-031-line))}
[data-vibeui-block="pricing-031"] [data-part="sticker"]{position:absolute;right:1rem;top:-.9rem;padding:.4rem .8rem;border-radius:.3rem;background:var(--vibeui-pricing-031-accent);color:var(--vibeui-pricing-031-on-accent);font-family:var(--vibeui-pricing-031-hand);font-size:1.1rem;line-height:1.1;transform:rotate(3deg);animation:vibeui-pricing-031-pop .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="pricing-031"] [data-part="receipt"] h3{margin:0;font-family:var(--vibeui-pricing-031-display);font-weight:700;font-size:1.2rem}
[data-vibeui-block="pricing-031"] [data-part="price"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:.2rem .5rem;font-family:var(--vibeui-pricing-031-display);font-weight:800;font-size:clamp(2.4rem,5cqi,3.4rem);letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums;color:var(--vibeui-pricing-031-accent)}
[data-vibeui-block="pricing-031"] [data-part="price"] small{font-family:var(--vibeui-pricing-031-font);font-weight:500;font-size:.9rem;letter-spacing:0;color:var(--vibeui-pricing-031-muted)}
[data-vibeui-block="pricing-031"] [data-part="breakdown"]{display:grid;gap:.4rem;margin:0;padding:1rem 0 0;border-top:1px dashed var(--vibeui-pricing-031-line);font-size:.88rem;color:var(--vibeui-pricing-031-muted)}
[data-vibeui-block="pricing-031"] [data-part="breakdown"] div{display:flex;justify-content:space-between;gap:1rem}
[data-vibeui-block="pricing-031"] [data-part="breakdown"] dd{margin:0;font-variant-numeric:tabular-nums;color:var(--vibeui-pricing-031-fg);font-weight:600}
[data-vibeui-block="pricing-031"] [data-part="features"]{margin:0;padding:1rem 0 0;border-top:1px dashed var(--vibeui-pricing-031-line);list-style:none;display:grid;gap:.45rem;font-size:.92rem}
[data-vibeui-block="pricing-031"] [data-part="features"] li{display:flex;gap:.5rem;align-items:baseline}
[data-vibeui-block="pricing-031"] [data-part="features"] li::before{content:"✓";font-weight:700;color:var(--vibeui-pricing-031-accent)}
[data-vibeui-block="pricing-031"] [data-part="action"]{display:inline-flex;justify-content:center;align-items:center;padding:.9rem 1.3rem;border-radius:1rem;background:var(--vibeui-pricing-031-accent);color:var(--vibeui-pricing-031-on-accent);font-weight:600;text-decoration:none;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="pricing-031"] [data-part="action"]:hover{transform:translateY(-2px);box-shadow:0 12px 26px -12px var(--vibeui-pricing-031-accent)}
[data-vibeui-block="pricing-031"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-pricing-031-fg);outline-offset:2px}
[data-vibeui-block="pricing-031"] [data-part="compare"]{margin:4rem 0 0}
[data-vibeui-block="pricing-031"] [data-part="compare"] h3{margin:0 0 1.2rem;font-family:var(--vibeui-pricing-031-display);font-weight:800;font-size:clamp(1.5rem,3cqi,2.1rem);letter-spacing:-.03em}
[data-vibeui-block="pricing-031"] [data-part="table"]{width:100%;border-collapse:separate;border-spacing:0;font-size:.9rem}
[data-vibeui-block="pricing-031"] [data-part="table"] th,[data-vibeui-block="pricing-031"] [data-part="table"] td{padding:.8rem .6rem;text-align:center;border-bottom:1px solid var(--vibeui-pricing-031-rule);vertical-align:middle}
[data-vibeui-block="pricing-031"] [data-part="table"] th{font-family:var(--vibeui-pricing-031-display);font-weight:700;font-size:.85rem}
[data-vibeui-block="pricing-031"] [data-part="table"] th:first-child,[data-vibeui-block="pricing-031"] [data-part="table"] td:first-child{text-align:left;color:var(--vibeui-pricing-031-muted);font-weight:500;padding-left:0}
[data-vibeui-block="pricing-031"] [data-part="table"] [data-us]{background:color-mix(in oklab,var(--vibeui-pricing-031-accent) 9%,var(--vibeui-pricing-031-bg));color:var(--vibeui-pricing-031-fg)}
[data-vibeui-block="pricing-031"] [data-part="table"] thead [data-us]{border-radius:1rem 1rem 0 0;border-top:2px solid var(--vibeui-pricing-031-accent);border-left:2px solid var(--vibeui-pricing-031-accent);border-right:2px solid var(--vibeui-pricing-031-accent);color:var(--vibeui-pricing-031-accent)}
[data-vibeui-block="pricing-031"] [data-part="table"] tbody [data-us]{border-left:2px solid var(--vibeui-pricing-031-accent);border-right:2px solid var(--vibeui-pricing-031-accent)}
[data-vibeui-block="pricing-031"] [data-part="table"] tbody tr:last-child [data-us]{border-bottom:2px solid var(--vibeui-pricing-031-accent);border-radius:0 0 1rem 1rem}
[data-vibeui-block="pricing-031"] [data-part="mark"]{display:inline-grid;place-items:center;width:1.6rem;height:1.6rem;border-radius:50%;font-weight:700;font-size:.8rem}
[data-vibeui-block="pricing-031"] [data-part="mark"][data-v="yes"]{background:var(--vibeui-pricing-031-accent);color:var(--vibeui-pricing-031-on-accent)}
[data-vibeui-block="pricing-031"] [data-part="mark"][data-v="part"]{border:1.5px solid var(--vibeui-pricing-031-muted);color:var(--vibeui-pricing-031-muted)}
[data-vibeui-block="pricing-031"] [data-part="mark"][data-v="no"]{border:1.5px solid var(--vibeui-pricing-031-line);color:var(--vibeui-pricing-031-muted)}
@keyframes vibeui-pricing-031-pop{from{opacity:0;transform:rotate(3deg) scale(.7)}}
@container (min-width: 56rem){[data-vibeui-block="pricing-031"] [data-part="calc"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:2.5rem}[data-vibeui-block="pricing-031"] [data-part="table"] th,[data-vibeui-block="pricing-031"] [data-part="table"] td{padding:1rem 1.2rem;font-size:.95rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-031"] *{animation:none!important;transition:none!important}}`

const DEFAULT_FORMATS: Pricing031Format[] = [
  { key: "group", label: "Группа", perLesson: 990, size: "до 6 человек, 60 минут", features: ["Носитель раз в неделю", "Разговорный клуб по субботам", "Запись занятий и конспекты", "Чат группы с преподавателем"], sticker: "выбирают 78%" },
  { key: "pair", label: "Пара", perLesson: 1690, size: "вы и ещё один, 60 минут", features: ["Своё расписание", "Носитель раз в неделю", "Разговорный клуб по субботам", "Запись занятий и конспекты"] },
  { key: "solo", label: "Индивидуально", perLesson: 2490, size: "только вы, 60 минут", features: ["Программа под вашу цель", "Любое время, перенос за 6 часов", "Носитель по запросу", "Запись занятий и конспекты"] },
]

const DEFAULT_ROWS: Pricing031Row[] = [
  { label: "Живой разговор на каждом занятии", values: ["yes", "no", "yes"] },
  { label: "Носитель языка", values: ["yes", "no", "part"] },
  { label: "Домашка с проверкой человеком", values: ["yes", "no", "yes"] },
  { label: "Группа, где не стыдно ошибаться", values: ["yes", "no", "no"] },
  { label: "Расписание держит вас", values: ["yes", "part", "part"] },
  { label: "В месяц при двух занятиях в неделю", values: ["7 920 ₽", "990 ₽", "20 000 ₽"] },
]

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

function pluralLessons(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "занятие"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "занятия"
  return "занятий"
}

/** Тарифы с переключателем формата, слайдером занятий и таблицей «мы vs …». */
export function Pricing031({
  eyebrow = "цены",
  title = "Платите за занятия, а не за «доступ к платформе»",
  lede = "Выберите формат и сколько раз в неделю вы готовы заниматься — цена пересчитается. Первое занятие бесплатно в любом формате.",
  formats = DEFAULT_FORMATS,
  minPerWeek = 1,
  maxPerWeek = 4,
  defaultPerWeek = 2,
  weeksPerMonth = 4,
  currency = "₽",
  actionLabel = "Записаться на пробный урок",
  actionHref = "#trial",
  compareTitle = "Мы, приложение или репетитор?",
  compareColumns = ["Слово", "Приложение", "Репетитор"],
  compareRows = DEFAULT_ROWS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing031Props) {
  const [active, setActive] = useState(0)
  const [perWeek, setPerWeek] = useState(Math.min(maxPerWeek, Math.max(minPerWeek, defaultPerWeek)))
  const format = formats[Math.min(active, formats.length - 1)]
  const lessons = perWeek * weeksPerMonth
  const monthly = format ? format.perLesson * lessons : 0
  const fill = `${((perWeek - minPerWeek) / Math.max(1, maxPerWeek - minPerWeek)) * 100}%`

  const palette = {
    ...(accent ? { "--vibeui-pricing-031-accent": accent } : null),
    ...(ink ? { "--vibeui-pricing-031-fg": ink } : null),
    ...(background ? { "--vibeui-pricing-031-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-031" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="pricing-031" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="calc">
            <div data-part="controls">
              <div>
                <p data-part="label">Формат</p>
                <div data-part="segments" role="group" aria-label="Формат занятий" style={{ ["--vibeui-pricing-031-n" as string]: formats.length, ["--vibeui-pricing-031-active" as string]: active }}>
                  {formats.map((item, index) => (
                    <button key={item.key} data-part="segment" type="button" aria-pressed={active === index} onClick={() => setActive(index)}>
                      {item.label}
                    </button>
                  ))}
                </div>
                {format ? <p data-part="size">{format.size}</p> : null}
              </div>
              <div>
                <div data-part="perweek">
                  <p data-part="label">Занятий в неделю</p>
                  <output>{perWeek}</output>
                </div>
                <input data-part="range" type="range" min={minPerWeek} max={maxPerWeek} step={1} value={perWeek} onChange={(event) => setPerWeek(Number(event.target.value))} aria-label="Занятий в неделю" style={{ ["--vibeui-pricing-031-fill" as string]: fill }} />
                <ul data-part="ticks" aria-hidden="true">
                  {Array.from({ length: maxPerWeek - minPerWeek + 1 }, (_, index) => (
                    <li key={index}>{minPerWeek + index}</li>
                  ))}
                </ul>
              </div>
            </div>
            {format ? (
              <div data-part="receipt" aria-live="polite">
                {format.sticker ? (
                  <span data-part="sticker" key={format.key}>
                    {format.sticker}
                  </span>
                ) : null}
                <h3>{format.label}</h3>
                <div data-part="price">
                  {formatMoney(monthly, currency)}
                  <small>в месяц</small>
                </div>
                <dl data-part="breakdown">
                  <div>
                    <dt>Занятие</dt>
                    <dd>{formatMoney(format.perLesson, currency)}</dd>
                  </div>
                  <div>
                    <dt>В месяц</dt>
                    <dd>
                      {lessons} {pluralLessons(lessons)}
                    </dd>
                  </div>
                  <div>
                    <dt>Первое занятие</dt>
                    <dd>бесплатно</dd>
                  </div>
                </dl>
                <ul data-part="features">
                  {format.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                {actionLabel ? (
                  <a data-part="action" href={actionHref}>
                    {actionLabel}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
          {compareRows.length > 0 ? (
            <div data-part="compare">
              <h3>{compareTitle}</h3>
              <table data-part="table">
                <thead>
                  <tr>
                    <th scope="col"> </th>
                    {compareColumns.map((column, index) => (
                      <th key={column} scope="col" data-us={index === 0 ? "" : undefined}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      {row.values.map((value, index) => (
                        <td key={index} data-us={index === 0 ? "" : undefined}>
                          {value === "yes" || value === "no" || value === "part" ? (
                            <span data-part="mark" data-v={value} aria-label={value === "yes" ? "да" : value === "no" ? "нет" : "частично"}>
                              {value === "yes" ? "✓" : value === "no" ? "✕" : "~"}
                            </span>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
