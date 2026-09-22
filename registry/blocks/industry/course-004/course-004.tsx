import type { CSSProperties } from "react"
import { Card092 } from "@/registry/components/card/card-092/card-092"

export type Course004Day = {
  /** «пн», «ср», «сб» — колонка календаря. */
  day: string
  title: string
  text?: string
  /** «запись», «лайв», «ревью». */
  kind?: string
  time?: string
}

export type Course004Format = {
  title: string
  text: string
}

export type Course004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Занятия недели — раскладываются по колонкам дней. */
  days?: readonly Course004Day[]
  /** Подписи колонок: семь дней. */
  weekdays?: readonly string[]
  /** Форматы: записи, лайвы, чат, ревью. */
  formats?: readonly Course004Format[]
  image?: string
  imageAlt?: string
  /** Подпись к фото: «лайв по средам, запись остаётся». */
  caption?: string
  /** aria календаря. */
  calendarLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Как проходит неделя — календарной лентой: семь колонок с днями, занятия
// лежат как события в календаре, лайв пульсирует точкой, пустые дни
// заштрихованы. Колонки появляются каскадом. На узком экране колонки
// становятся строками с днём слева. Ниже фото занятия и форматы.
// Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="course-004"]){
--vibeui-course-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-course-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-course-004-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-course-004-card:light-dark(#f8fafc,#242424);
--vibeui-course-004-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-course-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-course-004-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-course-004-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-course-004-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="course-004"]{color-scheme:dark}
:where([data-vibeui-block="course-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="course-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="course-004"]{box-sizing:border-box;display:block;background:var(--vibeui-course-004-bg);color:var(--vibeui-course-004-fg);font-family:var(--vibeui-course-004-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="course-004"] *{box-sizing:border-box}
[data-vibeui-block="course-004"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="course-004"] [data-part="head"]{max-width:40rem;margin-bottom:2.5rem}
[data-vibeui-block="course-004"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-course-004-accent);font-weight:700}
[data-vibeui-block="course-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-course-004-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="course-004"] [data-part="lede"]{margin:.75rem 0 0;color:var(--vibeui-course-004-muted)}
[data-vibeui-block="course-004"] [data-part="calendar"]{display:grid;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="course-004"] [data-part="col"]{display:grid;grid-template-columns:3.2rem minmax(0,1fr);gap:.5rem;align-items:start;animation:vibeui-course-004-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-course-004-n) * 80ms)}
@keyframes vibeui-course-004-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
[data-vibeui-block="course-004"] [data-part="dayname"]{display:grid;place-items:center;height:3rem;border-radius:.75rem;background:var(--vibeui-course-004-card);border:1px solid var(--vibeui-course-004-line);font-family:var(--vibeui-course-004-display);font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--vibeui-course-004-muted)}
[data-vibeui-block="course-004"] [data-part="col"][data-busy="true"] [data-part="dayname"]{color:var(--vibeui-course-004-fg)}
[data-vibeui-block="course-004"] [data-part="events"]{display:grid;gap:.5rem;margin:0;padding:0;list-style:none;min-height:3rem}
[data-vibeui-block="course-004"] [data-part="empty"]{min-height:3rem;border-radius:.75rem;background:repeating-linear-gradient(-45deg,transparent 0 6px,color-mix(in oklab,var(--vibeui-course-004-line) 70%,transparent) 6px 7px)}
@keyframes vibeui-course-004-pulse{0%{transform:scale(.4);opacity:.8}100%{transform:scale(1.4);opacity:0}}
[data-vibeui-block="course-004"] [data-part="side"]{display:grid;gap:1.25rem;margin-top:2.5rem}
[data-vibeui-block="course-004"] [data-part="picture"]{position:relative;overflow:hidden;border-radius:1.1rem;aspect-ratio:16/9;background:light-dark(#e5e7eb,#1f2430)}
[data-vibeui-block="course-004"] [data-part="picture"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="course-004"] [data-part="caption"]{position:absolute;left:.9rem;bottom:.9rem;padding:.4rem .7rem;border-radius:.5rem;background:rgb(17 24 39 / .75);color:#fff;font-size:.75rem;backdrop-filter:blur(6px)}
[data-vibeui-block="course-004"] [data-part="formats"]{display:grid;gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="course-004"] [data-part="format"]{display:grid;gap:.15rem;padding:.9rem 1rem;border-radius:.9rem;background:var(--vibeui-course-004-card);border:1px solid var(--vibeui-course-004-line)}
[data-vibeui-block="course-004"] [data-part="format"] b{font-weight:600}
[data-vibeui-block="course-004"] [data-part="format"] span{font-size:.85rem;color:var(--vibeui-course-004-muted)}
@container (min-width: 48rem){
[data-vibeui-block="course-004"] [data-part="calendar"]{grid-template-columns:repeat(7,minmax(0,1fr));gap:.6rem}
[data-vibeui-block="course-004"] [data-part="col"]{grid-template-columns:1fr;gap:.6rem}
[data-vibeui-block="course-004"] [data-part="events"],[data-vibeui-block="course-004"] [data-part="empty"]{min-height:9rem}
[data-vibeui-block="course-004"] [data-part="formats"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 64rem){
[data-vibeui-block="course-004"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="course-004"] [data-part="side"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:2rem;margin-top:3rem;align-items:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="course-004"] *{animation:none!important;transition:none!important}}`

const DEFAULT_DAYS: Course004Day[] = [
  { day: "пн", kind: "запись", time: "с утра", title: "Три урока недели открываются", text: "Смотрите в своём темпе, конспекты и файлы — в личном кабинете." },
  { day: "ср", kind: "лайв", time: "19:30 · 1,5 ч", title: "Лайв с автором: разбор и вопросы", text: "Запись остаётся, вопросы можно задать заранее в чате." },
  { day: "чт", kind: "чат", time: "весь день", title: "Вопросы куратору", text: "Отвечает в течение двух часов в рабочее время." },
  { day: "сб", kind: "ревью", time: "до 12:00", title: "Дедлайн домашки", text: "Куратор проверяет за 48 часов и записывает видеоразбор." },
  { day: "вс", kind: "чат", time: "весь день", title: "Разбор чужих работ", text: "Смотрите, как решили другие, и обсуждаете в чате потока." },
]

const DEFAULT_FORMATS: Course004Format[] = [
  { title: "18 записанных уроков", text: "по 35–50 минут, с таймкодами и файлами" },
  { title: "6 лайвов с автором", text: "по средам, записи хранятся год" },
  { title: "Куратор на каждые 12 человек", text: "видеоразбор каждой домашки" },
  { title: "Чат потока", text: "и закрытое сообщество выпускников после" },
]

const LIVE = new Set(["лайв", "live", "эфир", "вебинар"])

/** Как проходит неделя: календарная лента на семь дней, лайв пульсирует, фото и форматы. */
export function Course004({
  eyebrow = "Как проходит обучение",
  title = "Одна неделя курса — по дням",
  lede = "Уроки в записи, лайв по средам и домашка с проверкой. Пять-семь часов в неделю, всё остальное — в вашем темпе.",
  days = DEFAULT_DAYS,
  weekdays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
  formats = DEFAULT_FORMATS,
  image = "",
  imageAlt = "",
  caption = "Лайв по средам — запись остаётся",
  calendarLabel = "Неделя по дням",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Course004Props) {
  const palette = {
    ...(accent ? { "--vibeui-course-004-accent": accent } : null),
    ...(ink ? { "--vibeui-course-004-fg": ink } : null),
    ...(background ? { "--vibeui-course-004-bg": background } : null),
    ...style,
  } as CSSProperties
  const columns = weekdays.map((name) => ({ name, events: days.filter((item) => item.day.toLowerCase() === name.toLowerCase()) }))

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-course-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="course-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ol data-part="calendar" aria-label={calendarLabel}>
            {columns.map((column, index) => (
              <li key={column.name} data-part="col" data-busy={column.events.length > 0} style={{ ["--vibeui-course-004-n" as string]: index }}>
                <span data-part="dayname">{column.name}</span>
                {column.events.length > 0 ? (
                  <ul data-part="events">
                    {column.events.map((item) => {
                      const live = item.kind ? LIVE.has(item.kind.toLowerCase()) : false
                      return (
                        <Card092 key={item.title} data-part="event" title={item.title} kind={item.kind} time={item.time} text={item.text} live={live} accent={accent} />
                      )
                    })}
                  </ul>
                ) : (
                  <span data-part="empty" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
          <div data-part="side">
            {image ? (
              <div data-part="picture">
                <img src={image} alt={imageAlt} loading="lazy" />
                {caption ? <span data-part="caption">{caption}</span> : null}
              </div>
            ) : null}
            {formats.length > 0 ? (
              <ul data-part="formats">
                {formats.map((format) => (
                  <li key={format.title} data-part="format">
                    <b>{format.title}</b>
                    <span>{format.text}</span>
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
