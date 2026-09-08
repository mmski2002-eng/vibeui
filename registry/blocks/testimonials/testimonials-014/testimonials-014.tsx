import type { CSSProperties } from "react"

export type Testimonials014Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  eyebrow?: string
  title?: string
  posterLabel?: string
  duration?: string
  transcriptLabel?: string
  quote?: string
  name?: string
  role?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Видео-отзыв с текстовой расшифровкой. Постер с кнопкой play — декорация:
// компонент не тянет плеер и видеофайл, реальное видео подключают на месте.
// Расшифровка рядом обязательна — большинство не нажмёт play, а суть отзыва
// должна дойти и до них. Кнопка нарисована, но не интерактивна: неработающий
// настоящий button обманул бы клавиатуру и скринридер.
const STYLES = `
:where([data-vibeui-block="testimonials-014"]){
--vibeui-testimonials-014-bg:transparent;
--vibeui-testimonials-014-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-testimonials-014-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-014-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-014-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-testimonials-014-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-testimonials-014-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-testimonials-014-accent-ink:oklch(0.15 0.02 39.8);
--vibeui-testimonials-014-poster-a:oklch(0.26 0.03 39.8);
--vibeui-testimonials-014-poster-b:oklch(0.17 0.015 39.8);
--vibeui-testimonials-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-014"]{color-scheme:dark}
[data-vibeui-block="testimonials-014"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-014-bg);color:var(--vibeui-testimonials-014-ink);
font-family:var(--vibeui-testimonials-014-font);
}
[data-vibeui-block="testimonials-014"] [data-part="shell"]{
max-width:70rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="testimonials-014"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-testimonials-014-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="testimonials-014"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="testimonials-014"] [data-part="layout"]{display:grid;gap:1.5rem;align-items:center}
[data-vibeui-block="testimonials-014"] [data-part="poster"]{
position:relative;aspect-ratio:16/9;min-inline-size:0;
display:grid;place-items:center;overflow:hidden;
border-radius:1.125rem;
color-scheme:dark;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="testimonials-014"] [data-part="poster"][data-empty="true"]{background:
radial-gradient(120% 150% at 15% 0%,color-mix(in oklab,var(--vibeui-testimonials-014-accent) 30%,transparent),transparent 55%),
linear-gradient(140deg,var(--vibeui-testimonials-014-poster-a),var(--vibeui-testimonials-014-poster-b));}
[data-vibeui-block="testimonials-014"] [data-part="poster"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="testimonials-014"] [data-part="play"]{
width:4rem;height:4rem;border-radius:999px;
display:grid;place-items:center;
background:var(--vibeui-testimonials-014-accent-fill);
color:var(--vibeui-testimonials-014-accent-ink);
box-shadow:0 18px 40px -18px oklch(0.55 0.2144 39.8 / 70%);
}
[data-vibeui-block="testimonials-014"] [data-part="play"] svg{
width:1.375rem;height:1.375rem;margin-left:0.1875rem;
}
[data-vibeui-block="testimonials-014"] [data-part="poster-meta"]{
position:absolute;left:1rem;right:1rem;bottom:1rem;
display:flex;justify-content:space-between;align-items:center;gap:0.75rem;
color:oklch(0.96 0 0);font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="testimonials-014"] [data-part="duration"]{
flex:none;padding:0.1875rem 0.5rem;border-radius:0.375rem;
background:oklch(0.15 0 0 / 55%);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="testimonials-014"] [data-part="transcript"]{min-inline-size:0}
[data-vibeui-block="testimonials-014"] [data-part="transcript-label"]{
margin:0 0 0.875rem;color:var(--vibeui-testimonials-014-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="testimonials-014"] [data-part="figure"]{margin:0;display:grid;gap:1.25rem}
[data-vibeui-block="testimonials-014"] [data-part="quote"]{
margin:0;font-size:clamp(1.125rem,2.8cqi,1.5rem);line-height:1.5;
}
[data-vibeui-block="testimonials-014"] [data-part="quote"]::before{content:"«";color:var(--vibeui-testimonials-014-accent)}
[data-vibeui-block="testimonials-014"] [data-part="quote"]::after{content:"»";color:var(--vibeui-testimonials-014-accent)}
[data-vibeui-block="testimonials-014"] [data-part="author"]{
display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap;
}
[data-vibeui-block="testimonials-014"] [data-part="name"]{font-size:0.9375rem;font-weight:640}
[data-vibeui-block="testimonials-014"] [data-part="role"]{color:var(--vibeui-testimonials-014-muted);font-size:0.875rem}
@container (min-width: 48rem){
[data-vibeui-block="testimonials-014"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-014"] [data-part="layout"]{grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-014"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/** Постер видео-отзыва с кнопкой play и текстовой расшифровкой рядом. */
export function Testimonials014({
  eyebrow = "Видео-отзыв",
  image = "",
  title = "Две минуты о том, как это работает",
  posterLabel = "Анна Ковалёва — о переходе на VibeUI",
  duration = "2:14",
  transcriptLabel = "Расшифровка",
  quote = "Я выбрала блоки в каталоге и просто отдала ссылку агенту. Через час секции стояли в проекте — ровно такие, какими я их видела в превью. Неделю вёрстки мы превратили в один вечер.",
  name = "Анна Ковалёва",
  role = "Руководитель маркетинга, «Северный путь»",
  background = "",
  accent,
  className,
  style,
}: Testimonials014Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-testimonials-014-accent": accent,
          "--vibeui-testimonials-014-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-testimonials-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-014"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="layout">
            <div
              data-part="poster"
              data-empty={image ? undefined : "true"}
              aria-hidden="true"
            >
              {image ? (
                <img src={image} alt="" loading="lazy" decoding="async" />
              ) : null}
              <span data-part="play">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 4.6c0-1.2 1.3-2 2.4-1.4l11 6.4c1 .6 1 2.2 0 2.8l-11 6.4c-1.1.6-2.4-.2-2.4-1.4V4.6Z" />
                </svg>
              </span>
              <div data-part="poster-meta">
                <span>{posterLabel}</span>
                <span data-part="duration">{duration}</span>
              </div>
            </div>
            <div data-part="transcript">
              <p data-part="transcript-label">{transcriptLabel}</p>
              <figure data-part="figure">
                <blockquote data-part="quote">{quote}</blockquote>
                <figcaption data-part="author">
                  <span data-part="name">{name}</span>
                  <span data-part="role">{role}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
