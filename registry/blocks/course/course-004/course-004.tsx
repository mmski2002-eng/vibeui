import type { CSSProperties } from "react"

export type Course004Day = {
  /** «пн», «ср», «сб». */
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
  /** Неделя по дням — лента слева направо. */
  days?: readonly Course004Day[]
  /** Форматы: записи, лайвы, чат, ревью. */
  formats?: readonly Course004Format[]
  image?: string
  imageAlt?: string
  /** Подпись к фото: «лайв по средам, запись остаётся». */
  caption?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Как проходит неделя: лента дней слева направо с точками на общей линии,
// у каждого дня тип (запись, лайв, ревью) и время; ниже — фото занятия и
// список форматов с цифрами. Линия ленты дорисовывается при появлении.
// Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="course-004"]){
--vibeui-course-004-bg:light-dark(#ffffff,#0f1117);
--vibeui-course-004-fg:light-dark(#111827,#f3f4f6);
--vibeui-course-004-muted:light-dark(#6b7280,#9ca3af);
--vibeui-course-004-card:light-dark(#f8fafc,#161a23);
--vibeui-course-004-line:light-dark(#e5e7eb,#262b36);
--vibeui-course-004-accent:#4f46e5;
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
[data-vibeui-block="course-004"] [data-part="week"]{position:relative;display:grid;gap:1.5rem;margin:0;padding:0 0 0 2rem;list-style:none}
[data-vibeui-block="course-004"] [data-part="week"]::before{content:"";position:absolute;left:.55rem;top:.6rem;bottom:.6rem;width:2px;background:var(--vibeui-course-004-line)}
[data-vibeui-block="course-004"] [data-part="week"]::after{content:"";position:absolute;left:.55rem;top:.6rem;bottom:.6rem;width:2px;background:var(--vibeui-course-004-accent);transform-origin:top;animation:vibeui-course-004-line 1.4s .2s cubic-bezier(.2,.8,.2,1) both}
@keyframes vibeui-course-004-line{from{transform:scaleY(0)}to{transform:scaleY(1)}}
[data-vibeui-block="course-004"] [data-part="day"]{position:relative;animation:vibeui-course-004-in .5s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(.2s + var(--vibeui-course-004-n) * 120ms)}
@keyframes vibeui-course-004-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
[data-vibeui-block="course-004"] [data-part="dot"]{position:absolute;left:-2rem;top:.3rem;width:1.2rem;height:1.2rem;border-radius:50%;background:var(--vibeui-course-004-bg);border:3px solid var(--vibeui-course-004-accent)}
[data-vibeui-block="course-004"] [data-part="day"][data-kind="live"] [data-part="dot"]{background:var(--vibeui-course-004-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-course-004-accent) 20%,transparent)}
[data-vibeui-block="course-004"] [data-part="when"]{display:flex;align-items:baseline;gap:.6rem;margin:0 0 .25rem}
[data-vibeui-block="course-004"] [data-part="dayname"]{font-family:var(--vibeui-course-004-display);font-size:1.1rem;font-weight:700;text-transform:uppercase;letter-spacing:.02em}
[data-vibeui-block="course-004"] [data-part="kind"]{padding:.15rem .5rem;border-radius:.4rem;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;font-weight:700;background:var(--vibeui-course-004-card);border:1px solid var(--vibeui-course-004-line);color:var(--vibeui-course-004-muted)}
[data-vibeui-block="course-004"] [data-part="day"][data-kind="live"] [data-part="kind"]{background:var(--vibeui-course-004-marker);color:#1a2e05;border-color:transparent}
[data-vibeui-block="course-004"] [data-part="time"]{font-size:.78rem;color:var(--vibeui-course-004-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="course-004"] [data-part="daytitle"]{margin:0;font-weight:600}
[data-vibeui-block="course-004"] [data-part="text"]{margin:.2rem 0 0;font-size:.875rem;color:var(--vibeui-course-004-muted);max-width:28rem}
[data-vibeui-block="course-004"] [data-part="side"]{display:grid;gap:1.25rem;margin-top:2.5rem}
[data-vibeui-block="course-004"] [data-part="picture"]{position:relative;overflow:hidden;border-radius:1.1rem;aspect-ratio:16/10;background:light-dark(#e5e7eb,#1f2430)}
[data-vibeui-block="course-004"] [data-part="picture"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="course-004"] [data-part="caption"]{position:absolute;left:.9rem;bottom:.9rem;padding:.4rem .7rem;border-radius:.5rem;background:rgb(17 24 39 / .75);color:#fff;font-size:.75rem}
[data-vibeui-block="course-004"] [data-part="formats"]{display:grid;gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="course-004"] [data-part="format"]{display:grid;gap:.15rem;padding:.9rem 1rem;border-radius:.9rem;background:var(--vibeui-course-004-card);border:1px solid var(--vibeui-course-004-line)}
[data-vibeui-block="course-004"] [data-part="format"] b{font-weight:600}
[data-vibeui-block="course-004"] [data-part="format"] span{font-size:.85rem;color:var(--vibeui-course-004-muted)}
@container (min-width: 60rem){
[data-vibeui-block="course-004"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="course-004"] [data-part="grid"]{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:4rem;align-items:start}
[data-vibeui-block="course-004"] [data-part="side"]{margin-top:0}
[data-vibeui-block="course-004"] [data-part="formats"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="course-004"] *{animation:none!important;transition:none!important}}`

const DEFAULT_DAYS: Course004Day[] = [
  { day: "пн", kind: "запись", time: "с утра", title: "Три урока недели открываются", text: "Смотрите в своём темпе, конспекты и файлы — в личном кабинете." },
  { day: "ср", kind: "лайв", time: "19:30, 1,5 ч", title: "Лайв с автором: разбор и вопросы", text: "Запись остаётся, вопросы можно задать заранее в чате." },
  { day: "сб", kind: "ревью", time: "до 12:00", title: "Дедлайн домашки", text: "Куратор проверяет за 48 часов и записывает видеоразбор." },
  { day: "вс", kind: "чат", time: "весь день", title: "Разбор чужих работ", text: "Смотрите, как решили другие, и обсуждаете в чате потока." },
]

const DEFAULT_FORMATS: Course004Format[] = [
  { title: "18 записанных уроков", text: "по 35–50 минут, с таймкодами и файлами" },
  { title: "6 лайвов с автором", text: "по средам, записи хранятся год" },
  { title: "Куратор на каждые 12 человек", text: "видеоразбор каждой домашки" },
  { title: "Чат потока", text: "и закрытое сообщество выпускников после" },
]

const KIND: Record<string, string> = { лайв: "live", live: "live" }

/** Как проходит неделя: лента дней с типом занятия, фото и форматы обучения. */
export function Course004({
  eyebrow = "Как проходит обучение",
  title = "Одна неделя курса — по дням",
  lede = "Уроки в записи, лайв по средам и домашка с проверкой. Пять-семь часов в неделю, всё остальное — в вашем темпе.",
  days = DEFAULT_DAYS,
  formats = DEFAULT_FORMATS,
  image = "",
  imageAlt = "",
  caption = "Лайв по средам — запись остаётся",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Course004Props) {
  const palette = {
    ...(accent ? { "--vibeui-course-004-accent": accent } : null),
    ...(background ? { "--vibeui-course-004-bg": background } : null),
    ...style,
  } as CSSProperties

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
          <div data-part="grid">
            <ol data-part="week">
              {days.map((item, index) => (
                <li key={item.day + item.title} data-part="day" data-kind={item.kind ? (KIND[item.kind.toLowerCase()] ?? "rec") : undefined} style={{ ["--vibeui-course-004-n" as string]: index }}>
                  <span data-part="dot" aria-hidden="true" />
                  <p data-part="when">
                    <span data-part="dayname">{item.day}</span>
                    {item.kind ? <span data-part="kind">{item.kind}</span> : null}
                    {item.time ? <span data-part="time">{item.time}</span> : null}
                  </p>
                  <p data-part="daytitle">{item.title}</p>
                  {item.text ? <p data-part="text">{item.text}</p> : null}
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
        </div>
      </section>
    </>
  )
}
