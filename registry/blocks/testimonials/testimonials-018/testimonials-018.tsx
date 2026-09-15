import type { CSSProperties } from "react"

export type Testimonials018Item = {
  quote: string
  name: string
  role: string
  image?: string
  /** Ссылка на профиль: подпись становится ссылкой. */
  href?: string
  /** Видео-отзыв: превью и ссылка. */
  video?: string
  videoHref?: string
  /** Поток: «поток 12, весна 2026». */
  cohort?: string
}

export type Testimonials018Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Testimonials018Item[]
  /** Общая оценка и подпись. */
  score?: string
  scoreLabel?: string
  videoLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы студентов: карточки-мозаика, одна с видео-превью и кнопкой play,
// у остальных фото, имя с ссылкой на профиль, должность и поток. Слева
// сверху общая оценка со звёздами. Карточки появляются каскадом.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-018"]){
--vibeui-testimonials-018-bg:light-dark(#ffffff,#0f1117);
--vibeui-testimonials-018-fg:light-dark(#111827,#f3f4f6);
--vibeui-testimonials-018-muted:light-dark(#6b7280,#9ca3af);
--vibeui-testimonials-018-card:light-dark(#f8fafc,#161a23);
--vibeui-testimonials-018-line:light-dark(#e5e7eb,#262b36);
--vibeui-testimonials-018-accent:#4f46e5;
--vibeui-testimonials-018-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-testimonials-018-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-018-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-018"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-018"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-018"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-018"]{box-sizing:border-box;display:block;background:var(--vibeui-testimonials-018-bg);color:var(--vibeui-testimonials-018-fg);font-family:var(--vibeui-testimonials-018-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="testimonials-018"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-018"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="testimonials-018"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.5rem 3rem;margin-bottom:2.5rem}
[data-vibeui-block="testimonials-018"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-testimonials-018-accent);font-weight:700}
[data-vibeui-block="testimonials-018"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-018-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="testimonials-018"] [data-part="lede"]{margin:.75rem 0 0;max-width:34rem;color:var(--vibeui-testimonials-018-muted)}
[data-vibeui-block="testimonials-018"] [data-part="score"]{display:flex;align-items:center;gap:.9rem}
[data-vibeui-block="testimonials-018"] [data-part="score"] b{font-family:var(--vibeui-testimonials-018-display);font-size:2.5rem;font-weight:700;line-height:1;letter-spacing:-.02em}
[data-vibeui-block="testimonials-018"] [data-part="stars"]{display:block;color:var(--vibeui-testimonials-018-accent);letter-spacing:.1em;font-size:.9rem}
[data-vibeui-block="testimonials-018"] [data-part="score"] small{display:block;font-size:.78rem;color:var(--vibeui-testimonials-018-muted)}
[data-vibeui-block="testimonials-018"] [data-part="grid"]{display:grid;gap:1.25rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="testimonials-018"] [data-part="card"]{display:flex;flex-direction:column;gap:1rem;padding:1.5rem;border-radius:1.25rem;background:var(--vibeui-testimonials-018-card);border:1px solid var(--vibeui-testimonials-018-line);animation:vibeui-testimonials-018-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-testimonials-018-n) * 90ms)}
@keyframes vibeui-testimonials-018-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
[data-vibeui-block="testimonials-018"] [data-part="video"]{position:relative;display:block;aspect-ratio:16/10;overflow:hidden;border-radius:.9rem;background:light-dark(#e5e7eb,#1f2430)}
[data-vibeui-block="testimonials-018"] [data-part="video"] img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="testimonials-018"] [data-part="video"]:hover img{transform:scale(1.04)}
[data-vibeui-block="testimonials-018"] [data-part="play"]{position:absolute;left:1rem;bottom:1rem;display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .9rem .5rem .5rem;border-radius:999px;background:#fff;color:#111827;font-size:.8rem;font-weight:600}
[data-vibeui-block="testimonials-018"] [data-part="play"]::before{content:"";width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-testimonials-018-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 6.5v11l9-5.5z' fill='%23fff'/%3E%3C/svg%3E") center/1rem no-repeat}
[data-vibeui-block="testimonials-018"] [data-part="quote"]{margin:0;font-size:1.02rem;line-height:1.5}
[data-vibeui-block="testimonials-018"] [data-part="quote"]::before{content:"“";display:block;font-family:var(--vibeui-testimonials-018-display);font-size:2.5rem;line-height:.6;color:var(--vibeui-testimonials-018-accent);margin-bottom:.4rem}
[data-vibeui-block="testimonials-018"] [data-part="who"]{display:flex;align-items:center;gap:.75rem;margin-top:auto;padding-top:1rem;border-top:1px solid var(--vibeui-testimonials-018-line)}
[data-vibeui-block="testimonials-018"] [data-part="avatar"]{width:2.5rem;height:2.5rem;border-radius:50%;object-fit:cover;flex:none;background:light-dark(#e5e7eb,#1f2430)}
[data-vibeui-block="testimonials-018"] [data-part="name"]{display:block;font-weight:600;color:inherit;text-decoration:none}
[data-vibeui-block="testimonials-018"] a[data-part="name"]{border-bottom:1px solid var(--vibeui-testimonials-018-accent)}
[data-vibeui-block="testimonials-018"] a:focus-visible{outline:2px solid var(--vibeui-testimonials-018-accent);outline-offset:3px}
[data-vibeui-block="testimonials-018"] [data-part="role"]{display:block;font-size:.8rem;color:var(--vibeui-testimonials-018-muted)}
[data-vibeui-block="testimonials-018"] [data-part="cohort"]{margin-left:auto;flex:none;padding:.25rem .55rem;border-radius:.4rem;background:var(--vibeui-testimonials-018-marker);color:#1a2e05;font-size:.68rem;font-weight:700}
@container (min-width: 44rem){[data-vibeui-block="testimonials-018"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="testimonials-018"] [data-part="shell"]{padding:5.5rem 2rem}[data-vibeui-block="testimonials-018"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-018"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Testimonials018Item[] = [
  { quote: "Самое ценное — ревью. Куратор разобрал мою домашку на 20 минут видео и показал, где я теряю пользователя. На работе так никто не делает.", name: "Марина Соколова", role: "UI-дизайнер, Авито", cohort: "поток 11", videoHref: "#" },
  { quote: "Пришёл продактом, чтобы перестать ждать дизайнеров. Через месяц собрал прототип фичи сам и получил «да» на тест за один созвон.", name: "Игорь Левин", role: "Продакт-менеджер, Ozon", cohort: "поток 12" },
  { quote: "Лайвы по средам — это отдельный курс. Ксения на живом файле показывает, как думает, а не только что нажать.", name: "Алина Фёдорова", role: "Дизайнер, фриланс", cohort: "поток 12" },
]

/** Отзывы студентов: мозаика карточек с видео-отзывом, фото, потоком и общей оценкой. */
export function Testimonials018({
  eyebrow = "Отзывы",
  title = "Что говорят после защиты",
  lede = "Отзывы из чата выпускников и с открытых площадок — с именами, должностями и ссылками на профили.",
  items = DEFAULT_ITEMS,
  score = "4,9",
  scoreLabel = "по 412 отзывам выпускников",
  videoLabel = "Видео-отзыв",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Testimonials018Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-018-accent": accent } : null),
    ...(background ? { "--vibeui-testimonials-018-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-018" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-018" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            {score ? (
              <p data-part="score">
                <b>{score}</b>
                <span>
                  <span data-part="stars" aria-hidden="true">
                    ★★★★★
                  </span>
                  {scoreLabel ? <small>{scoreLabel}</small> : null}
                </span>
              </p>
            ) : null}
          </div>
          <ul data-part="grid">
            {items.map((item, index) => (
              <li key={item.name} data-part="card" style={{ ["--vibeui-testimonials-018-n" as string]: index }}>
                {item.videoHref ? (
                  <a data-part="video" href={item.videoHref} aria-label={`${videoLabel}: ${item.name}`}>
                    {item.video ? <img src={item.video} alt="" loading="lazy" /> : null}
                    <span data-part="play">{videoLabel}</span>
                  </a>
                ) : null}
                <blockquote data-part="quote">{item.quote}</blockquote>
                <div data-part="who">
                  {item.image ? <img data-part="avatar" src={item.image} alt="" loading="lazy" /> : <span data-part="avatar" />}
                  <span>
                    {item.href ? (
                      <a data-part="name" href={item.href}>
                        {item.name}
                      </a>
                    ) : (
                      <span data-part="name">{item.name}</span>
                    )}
                    <span data-part="role">{item.role}</span>
                  </span>
                  {item.cohort ? <span data-part="cohort">{item.cohort}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
