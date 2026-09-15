import type { CSSProperties } from "react"

export type Course003Case = {
  name: string
  image?: string
  /** Кем был: «маркетолог, 3 года». */
  before: string
  /** Кем стал: «продуктовый дизайнер в Ozon». */
  after: string
  /** Рост дохода или срок: «×2 к доходу», «оффер через 2 месяца». */
  gain?: string
  /** Скрин проекта из портфолио. */
  work?: string
  workAlt?: string
  quote?: string
  /** Ссылка на кейс или профиль. */
  href?: string
}

export type Course003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  cases?: readonly Course003Case[]
  beforeLabel?: string
  afterLabel?: string
  linkLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Результаты выпускников: карточки с фото проекта, портретом и стрелкой
// «было → стало», прибавкой в плашке и короткой цитатой. Скрин проекта
// приподнимается по наведению, карточки появляются каскадом. Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="course-003"]){
--vibeui-course-003-bg:light-dark(#f8fafc,#12151c);
--vibeui-course-003-fg:light-dark(#111827,#f3f4f6);
--vibeui-course-003-muted:light-dark(#6b7280,#9ca3af);
--vibeui-course-003-card:light-dark(#ffffff,#161a23);
--vibeui-course-003-line:light-dark(#e5e7eb,#262b36);
--vibeui-course-003-accent:#4f46e5;
--vibeui-course-003-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-course-003-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-course-003-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="course-003"]{color-scheme:dark}
:where([data-vibeui-block="course-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="course-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="course-003"]{box-sizing:border-box;display:block;background:var(--vibeui-course-003-bg);color:var(--vibeui-course-003-fg);font-family:var(--vibeui-course-003-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="course-003"] *{box-sizing:border-box}
[data-vibeui-block="course-003"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="course-003"] [data-part="head"]{max-width:40rem;margin-bottom:2.5rem}
[data-vibeui-block="course-003"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-course-003-accent);font-weight:700}
[data-vibeui-block="course-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-course-003-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="course-003"] [data-part="lede"]{margin:.75rem 0 0;color:var(--vibeui-course-003-muted)}
[data-vibeui-block="course-003"] [data-part="grid"]{display:grid;gap:1.25rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="course-003"] [data-part="card"]{display:flex;flex-direction:column;overflow:hidden;border-radius:1.25rem;background:var(--vibeui-course-003-card);border:1px solid var(--vibeui-course-003-line);animation:vibeui-course-003-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-course-003-n) * 90ms);transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
[data-vibeui-block="course-003"] [data-part="card"]:hover{transform:translateY(-4px);box-shadow:0 30px 50px -30px rgb(17 24 39 / .35)}
@keyframes vibeui-course-003-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
[data-vibeui-block="course-003"] [data-part="work"]{position:relative;aspect-ratio:4/3;overflow:hidden;background:light-dark(#e5e7eb,#1f2430)}
[data-vibeui-block="course-003"] [data-part="work"] img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="course-003"] [data-part="card"]:hover [data-part="work"] img{transform:scale(1.04)}
[data-vibeui-block="course-003"] [data-part="gain"]{position:absolute;left:.9rem;top:.9rem;padding:.35rem .7rem;border-radius:.5rem;background:var(--vibeui-course-003-marker);color:#1a2e05;font-family:var(--vibeui-course-003-display);font-size:.75rem;font-weight:600}
[data-vibeui-block="course-003"] [data-part="body"]{display:grid;gap:.9rem;padding:1.25rem}
[data-vibeui-block="course-003"] [data-part="who"]{display:flex;align-items:center;gap:.75rem}
[data-vibeui-block="course-003"] [data-part="avatar"]{width:2.75rem;height:2.75rem;border-radius:50%;object-fit:cover;flex:none;background:light-dark(#e5e7eb,#1f2430)}
[data-vibeui-block="course-003"] [data-part="name"]{font-weight:600}
[data-vibeui-block="course-003"] [data-part="path"]{display:grid;grid-template-columns:1fr auto 1fr;gap:.6rem;align-items:center;padding:.8rem .9rem;border-radius:.75rem;background:var(--vibeui-course-003-bg);font-size:.82rem}
[data-vibeui-block="course-003"] [data-part="path"] small{display:block;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-course-003-muted);margin-bottom:.2rem}
[data-vibeui-block="course-003"] [data-part="path"] [data-part="after"]{font-weight:600;color:var(--vibeui-course-003-accent)}
[data-vibeui-block="course-003"] [data-part="arrow"]{width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-course-003-accent);display:grid;place-items:center;color:#fff;font-size:.8rem}
[data-vibeui-block="course-003"] [data-part="quote"]{margin:0;font-size:.9rem;color:var(--vibeui-course-003-muted);font-style:italic}
[data-vibeui-block="course-003"] [data-part="link"]{margin-top:auto;justify-self:start;color:inherit;font-size:.82rem;font-weight:600;text-decoration:none;border-bottom:1px solid var(--vibeui-course-003-accent);padding-bottom:.1rem}
[data-vibeui-block="course-003"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-course-003-accent);outline-offset:3px}
@container (min-width: 44rem){[data-vibeui-block="course-003"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="course-003"] [data-part="shell"]{padding:5.5rem 2rem}[data-vibeui-block="course-003"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="course-003"] *{animation:none!important;transition:none!important}}`

const DEFAULT_CASES: Course003Case[] = [
  { name: "Артём Гусев", before: "маркетолог, 4 года", after: "продуктовый дизайнер, Ozon", gain: "оффер через 2 месяца", quote: "Кейс с защиты показал на собеседовании — взяли без тестового." },
  { name: "Лена Крылова", before: "графический дизайнер", after: "UI-дизайнер, Самокат", gain: "×1,8 к доходу", quote: "Наконец поняла автолейаут. Теперь макеты не разваливаются." },
  { name: "Даниил Орлов", before: "продакт-менеджер", after: "продакт, сам собирает прототипы", gain: "гипотезы за вечер", quote: "Перестал ждать дизайнера две недели ради одного экрана." },
]

/** Результаты выпускников: скрин проекта, портрет, «было → стало», прибавка и цитата. */
export function Course003({
  eyebrow = "Результаты",
  title = "Кем стали выпускники прошлых потоков",
  lede = "Не «трудоустроили 100 %», а конкретные люди и конкретные офферы — с работами, которые они собрали на курсе.",
  cases = DEFAULT_CASES,
  beforeLabel = "Было",
  afterLabel = "Стало",
  linkLabel = "Смотреть кейс",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Course003Props) {
  const palette = {
    ...(accent ? { "--vibeui-course-003-accent": accent } : null),
    ...(background ? { "--vibeui-course-003-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-course-003" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="course-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {cases.map((item, index) => (
              <li key={item.name} data-part="card" style={{ ["--vibeui-course-003-n" as string]: index }}>
                <div data-part="work">
                  {item.work ? <img src={item.work} alt={item.workAlt ?? ""} loading="lazy" /> : null}
                  {item.gain ? <span data-part="gain">{item.gain}</span> : null}
                </div>
                <div data-part="body">
                  <div data-part="who">
                    {item.image ? <img data-part="avatar" src={item.image} alt="" loading="lazy" /> : <span data-part="avatar" />}
                    <span data-part="name">{item.name}</span>
                  </div>
                  <div data-part="path">
                    <span>
                      <small>{beforeLabel}</small>
                      {item.before}
                    </span>
                    <span data-part="arrow" aria-hidden="true">
                      →
                    </span>
                    <span data-part="after">
                      <small>{afterLabel}</small>
                      {item.after}
                    </span>
                  </div>
                  {item.quote ? <p data-part="quote">«{item.quote}»</p> : null}
                  {item.href && linkLabel ? (
                    <a data-part="link" href={item.href}>
                      {linkLabel} →
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
