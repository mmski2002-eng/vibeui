import type { ComponentProps, CSSProperties } from "react"

export type TestimonialsAnim001Quote = {
  quote: string
  name: string
  role: string
  /** 1-2 буквы для плейсхолдера аватара; по умолчанию берутся из имени. */
  initials?: string
  /** 0-5, по умолчанию 5. */
  rating?: number
}

export type TestimonialsAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  kicker?: string
  title?: string
  description?: string
  quotes?: TestimonialsAnim001Quote[]
  accent?: string
  /** Ряд звёзд рейтинга над цитатой. */
  ratings?: boolean
  /** Аватар-плейсхолдер рядом с именем автора. */
  avatars?: boolean
}

// Идея: сетка карточек отзыва, которая проявляется stagger fade+translateY.
// Внутри каждой карточки — ряд из пяти звёзд: закрашенные звёзды заполняются
// по очереди слева направо через nth-child задержку, как будто рейтинг
// печатается на глазах. Пустые звёзды остаются контуром сразу — красится
// только количество, равное rating. container-type держит раскладку от
// ширины секции: одна колонка в узком месте, три — в полную ширину.
const STYLES = `
:where([data-vibeui-block="testimonials-anim-001"]){
--vibeui-testimonials-anim-001-bg:transparent;
--vibeui-testimonials-anim-001-fg:light-dark(oklch(0.19 0.016 266),oklch(0.98 0.003 266));
--vibeui-testimonials-anim-001-muted:light-dark(oklch(0.5 0.021 266),oklch(0.75 0.019 266));
--vibeui-testimonials-anim-001-border:light-dark(oklch(0.16 0.014 266 / 12%),oklch(1 0 0 / 12%));
--vibeui-testimonials-anim-001-card:light-dark(oklch(1 0 0),oklch(0.225 0.008 266));
--vibeui-testimonials-anim-001-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.163 264));
--vibeui-testimonials-anim-001-accent-fg:light-dark(oklch(0.99 0.004 266),oklch(0.17 0.02 266));
--vibeui-testimonials-anim-001-star:light-dark(oklch(0.75 0.15 85),oklch(0.8 0.14 85));
--vibeui-testimonials-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-anim-001"]{color-scheme:dark}
[data-vibeui-block="testimonials-anim-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);
container-type:inline-size;
background:var(--vibeui-testimonials-anim-001-bg);color:var(--vibeui-testimonials-anim-001-fg);
font-family:var(--vibeui-testimonials-anim-001-font);
}
[data-vibeui-block="testimonials-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-anim-001"] [data-part="frame"]{
padding:clamp(2.5rem,10cqi,5rem) clamp(1.25rem,6cqi,2.5rem);
}
[data-vibeui-block="testimonials-anim-001"] [data-part="head"]{
max-width:38rem;margin:0 auto;text-align:center;
}
[data-vibeui-block="testimonials-anim-001"] [data-part="kicker"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0 0 0.75rem;
font-size:0.75rem;font-weight:650;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-testimonials-anim-001-accent);
}
[data-vibeui-block="testimonials-anim-001"] [data-part="title"]{
margin:0;font-size:clamp(1.5rem,4.5cqi,2.5rem);font-weight:650;
letter-spacing:-0.02em;line-height:1.15;text-wrap:balance;
}
[data-vibeui-block="testimonials-anim-001"] [data-part="desc"]{
margin:0.875rem 0 0;font-size:clamp(0.9375rem,1.6cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-testimonials-anim-001-muted);text-wrap:pretty;
}
[data-vibeui-block="testimonials-anim-001"] [data-part="grid"]{
display:grid;grid-template-columns:minmax(0,1fr);gap:1.25rem;
margin-top:clamp(2rem,6cqi,3.5rem);
}
@container (min-width:38rem){
[data-vibeui-block="testimonials-anim-001"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width:58rem){
[data-vibeui-block="testimonials-anim-001"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="testimonials-anim-001"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.875rem;padding:1.5rem;
border-radius:1.25rem;border:1px solid var(--vibeui-testimonials-anim-001-border);
background:var(--vibeui-testimonials-anim-001-card);
opacity:0;transform:translateY(16px);
animation:vibeui-testimonials-anim-001-in .6s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="testimonials-anim-001"] [data-part="card"]:nth-child(1){animation-delay:0s}
[data-vibeui-block="testimonials-anim-001"] [data-part="card"]:nth-child(2){animation-delay:.12s}
[data-vibeui-block="testimonials-anim-001"] [data-part="card"]:nth-child(3){animation-delay:.24s}
[data-vibeui-block="testimonials-anim-001"] [data-part="card"]:nth-child(4){animation-delay:.36s}
[data-vibeui-block="testimonials-anim-001"] [data-part="card"]:nth-child(5){animation-delay:.48s}
[data-vibeui-block="testimonials-anim-001"] [data-part="card"]:nth-child(6){animation-delay:.6s}
[data-vibeui-block="testimonials-anim-001"][data-ratings="false"] [data-part="stars"]{display:none}
[data-vibeui-block="testimonials-anim-001"][data-avatars="false"] [data-part="avatar"]{display:none}
[data-vibeui-block="testimonials-anim-001"] [data-part="stars"]{display:flex;gap:0.1875rem}
[data-vibeui-block="testimonials-anim-001"] [data-part="star"]{
width:1rem;height:1rem;color:var(--vibeui-testimonials-anim-001-border);
}
[data-vibeui-block="testimonials-anim-001"] [data-part="star"][data-filled="true"]{
color:var(--vibeui-testimonials-anim-001-star);
opacity:0;animation:vibeui-testimonials-anim-001-pop .35s ease-out both;
animation-delay:calc(.5s + var(--vibeui-testimonials-anim-001-star-index,0) * .1s);
}
[data-vibeui-block="testimonials-anim-001"] [data-part="quote"]{
margin:0;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-testimonials-anim-001-fg);
text-wrap:pretty;
}
[data-vibeui-block="testimonials-anim-001"] [data-part="author"]{
display:flex;align-items:center;gap:0.625rem;margin-top:auto;padding-top:0.25rem;
}
[data-vibeui-block="testimonials-anim-001"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2.25rem;height:2.25rem;border-radius:9999px;font-size:0.75rem;font-weight:700;
color:var(--vibeui-testimonials-anim-001-accent-fg);
background:var(--vibeui-testimonials-anim-001-accent);
}
[data-vibeui-block="testimonials-anim-001"] [data-part="who"]{display:flex;flex-direction:column;min-width:0}
[data-vibeui-block="testimonials-anim-001"] [data-part="name"]{
font-size:0.8125rem;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="testimonials-anim-001"] [data-part="role"]{
font-size:0.75rem;color:var(--vibeui-testimonials-anim-001-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@keyframes vibeui-testimonials-anim-001-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes vibeui-testimonials-anim-001-pop{from{opacity:0;transform:scale(0.4)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="testimonials-anim-001"] [data-part="card"]{animation:none;opacity:1;transform:none}
[data-vibeui-block="testimonials-anim-001"] [data-part="star"][data-filled="true"]{animation:none;opacity:1}
}
`

const STAR = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2.5 15 9l7 .9-5.1 4.9L18.2 21.5 12 17.9 5.8 21.5 7.1 14.8 2 9.9 9 9z" />
  </svg>
)

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

const DEFAULT_QUOTES: TestimonialsAnim001Quote[] = [
  {
    quote:
      "Собрали лендинг за вечер: скопировали блоки, отдали ИИ — и получили ровно то, что видели в превью.",
    name: "Елена Радина",
    role: "Основательница, Studio Nord",
    rating: 5,
  },
  {
    quote:
      "Компоненты переносятся без правок — ни разу не пришлось донастраивать тему после установки.",
    name: "Павел Кузьмин",
    role: "Frontend Lead, Flowbase",
    rating: 5,
  },
  {
    quote:
      "Анимации выглядят как в дорогом агентстве, а ставятся одной командой в терминале.",
    name: "Ирина Гай",
    role: "Продакт-дизайнер, Northlane",
    rating: 4,
  },
]

/**
 * Секция отзывов: карточки проявляются stagger, звёзды рейтинга закрашиваются
 * по очереди слева направо. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function TestimonialsAnim001({
  kicker = "Отзывы",
  title = "Команды, которые уже собрали сайт",
  description = "Реальные слова людей, которые ставили компоненты в свой проект и не переписывали их с нуля.",
  quotes = DEFAULT_QUOTES,
  accent,
  ratings = true,
  avatars = true,
  className,
  style,
  ...props
}: TestimonialsAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="testimonials-anim-001"
        data-slot="testimonials-section"
        data-ratings={ratings ? undefined : "false"}
        data-avatars={avatars ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {kicker || title || description ? (
            <div data-part="head">
              {kicker ? <p data-part="kicker">{kicker}</p> : null}
              {title ? <h2 data-part="title">{title}</h2> : null}
              {description ? <p data-part="desc">{description}</p> : null}
            </div>
          ) : null}
          <div data-part="grid">
            {quotes.map((entry) => {
              const rating = entry.rating ?? 5

              return (
                <figure data-part="card" key={entry.name}>
                  <div data-part="stars" role="img" aria-label={`${rating} из 5`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        data-part="star"
                        data-filled={index < rating ? "true" : undefined}
                        aria-hidden="true"
                        key={index}
                        style={
                          {
                            "--vibeui-testimonials-anim-001-star-index": index,
                          } as CSSProperties
                        }
                      >
                        {STAR}
                      </span>
                    ))}
                  </div>
                  <blockquote data-part="quote">{entry.quote}</blockquote>
                  <figcaption data-part="author">
                    <span data-part="avatar" aria-hidden="true">
                      {entry.initials ?? initialsFrom(entry.name)}
                    </span>
                    <span data-part="who">
                      <span data-part="name">{entry.name}</span>
                      <span data-part="role">{entry.role}</span>
                    </span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
