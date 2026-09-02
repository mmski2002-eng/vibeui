import type { CSSProperties } from "react"

export type Blog003Props = {
  badge?: string
  topic?: string
  title?: string
  excerpt?: string
  author?: string
  role?: string
  date?: string
  readingTime?: string
  words?: string
  ctaLabel?: string
  href?: string
  coverLabel?: string
  hue?: number
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: один анонс, который стоит на главной вместо ленты. Раз статья
// одна, у неё есть место на честные сигналы: кто написал, когда, сколько
// читать и сколько в ней слов. Время чтения — самый частый вопрос перед
// кликом, поэтому оно не в подвале карточки, а рядом с именем автора.
//
// Обложка нарисована слоями градиентов, а не картинкой: блок остаётся одним
// файлом, а анонс не ждёт иллюстратора. Она объявлена decorative — role img
// без подписи только мешал бы. Ссылка растянута псевдоэлементом, но текст
// ссылки остаётся заголовком: «читать далее» в списке ссылок бесполезно.
const STYLES = `
:where([data-vibeui-block="blog-003"]){
--vibeui-blog-003-bg:transparent;
--vibeui-blog-003-card:light-dark(oklch(1 0 0),oklch(0.245 0.014 300));
--vibeui-blog-003-fg:light-dark(oklch(0.2 0.014 265),oklch(0.95 0.005 265));
--vibeui-blog-003-muted:light-dark(oklch(0.51 0.014 265),oklch(0.72 0.012 265));
--vibeui-blog-003-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.014 300));
--vibeui-blog-003-accent:light-dark(oklch(0.52 0.18 300),oklch(0.76 0.15 300));
--vibeui-blog-003-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.035 300));
/* Плашка лежит на цветной обложке, а не на фоне блока: у неё своя пара. */
--vibeui-blog-003-chip:light-dark(oklch(1 0 0 / 88%),oklch(0.22 0.02 300 / 88%));
--vibeui-blog-003-chip-fg:light-dark(oklch(0.2 0.014 265),oklch(0.95 0.005 265));
--vibeui-blog-003-serif:ui-serif,Georgia,"Times New Roman",serif;
--vibeui-blog-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="blog-003"]{
background:var(--vibeui-blog-003-bg);color:var(--vibeui-blog-003-fg);
font-family:var(--vibeui-blog-003-sans);
}
[data-vibeui-block="blog-003"] *{box-sizing:border-box}
[data-vibeui-block="blog-003"] [data-part="frame"]{max-width:72rem;margin:0 auto;padding:2.5rem 1.25rem}
[data-vibeui-block="blog-003"] [data-part="card"]{
position:relative;display:grid;overflow:hidden;
border:1px solid var(--vibeui-blog-003-border);border-radius:1.375rem;
background:var(--vibeui-blog-003-card);
}
[data-vibeui-block="blog-003"] [data-part="card"]:focus-within{outline:2px solid var(--vibeui-blog-003-accent);outline-offset:3px}
/* Обложка слоями градиентов: анонс не ждёт иллюстратора. */
[data-vibeui-block="blog-003"] [data-part="cover"]{
position:relative;min-height:11rem;aspect-ratio:16 / 10;overflow:hidden;
display:flex;align-items:flex-end;padding:1rem;
}
[data-vibeui-block="blog-003"] [data-part="cover"]::after{
content:"";position:absolute;inset:0;
background:
radial-gradient(80% 60% at 20% 20%,oklch(1 0 0 / 32%),transparent 65%),
radial-gradient(70% 70% at 85% 90%,oklch(0 0 0 / 22%),transparent 70%);
}
[data-vibeui-block="blog-003"] [data-part="cover-label"]{
position:relative;z-index:1;
padding:0.25rem 0.625rem;border-radius:9999px;
background:var(--vibeui-blog-003-chip);color:var(--vibeui-blog-003-chip-fg);
font-size:0.6875rem;font-weight:660;letter-spacing:0.03em;
}
[data-vibeui-block="blog-003"] [data-part="body"]{display:grid;gap:0.75rem;align-content:center;padding:1.375rem 1.25rem 1.5rem}
[data-vibeui-block="blog-003"] [data-part="tags"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.4375rem}
[data-vibeui-block="blog-003"] [data-part="badge"]{
padding:0.1875rem 0.5625rem;border-radius:9999px;
background:var(--vibeui-blog-003-accent);color:var(--vibeui-blog-003-on-accent);
font-size:0.625rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
}
[data-vibeui-block="blog-003"] [data-part="topic"]{
padding:0.1875rem 0.5625rem;border-radius:9999px;
border:1px solid var(--vibeui-blog-003-border);
font-size:0.6875rem;font-weight:620;color:var(--vibeui-blog-003-muted);
}
[data-vibeui-block="blog-003"] h2{
margin:0;font-family:var(--vibeui-blog-003-serif);font-weight:600;
font-size:clamp(1.375rem,3.6cqi,2.125rem);line-height:1.15;letter-spacing:-0.02em;
max-width:22ch;
}
[data-vibeui-block="blog-003"] h2 a{color:inherit;text-decoration:none}
[data-vibeui-block="blog-003"] h2 a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="blog-003"] h2 a:focus-visible{outline:none}
[data-vibeui-block="blog-003"] [data-part="excerpt"]{
margin:0;max-width:52ch;font-size:0.9375rem;line-height:1.65;color:var(--vibeui-blog-003-muted);
}
/* Время чтения — вопрос перед кликом, поэтому рядом с автором, а не в подвале. */
[data-vibeui-block="blog-003"] [data-part="byline"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem;margin-top:0.25rem;
padding-top:0.875rem;border-top:1px solid var(--vibeui-blog-003-border);
font-size:0.8125rem;color:var(--vibeui-blog-003-muted);
}
[data-vibeui-block="blog-003"] [data-part="avatar"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:2.125rem;height:2.125rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-blog-003-accent) 16%,transparent);
color:var(--vibeui-blog-003-accent);font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="blog-003"] [data-part="who"]{display:grid;line-height:1.35}
[data-vibeui-block="blog-003"] [data-part="name"]{color:var(--vibeui-blog-003-fg);font-weight:650}
[data-vibeui-block="blog-003"] [data-part="role"]{font-size:0.75rem}
[data-vibeui-block="blog-003"] [data-part="stats"]{
margin-left:auto;display:flex;flex-wrap:wrap;gap:0.4375rem;align-items:center;
font-size:0.75rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="blog-003"] [data-part="dot"]{opacity:.5}
[data-vibeui-block="blog-003"] [data-part="cta"]{
justify-self:start;display:inline-flex;align-items:center;gap:0.4375rem;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-blog-003-accent);color:var(--vibeui-blog-003-on-accent);
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="blog-003"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-top:1.5px solid currentColor;
transform:rotate(45deg);
}
@container (min-width: 46rem){
[data-vibeui-block="blog-003"] [data-part="frame"]{padding:3.25rem 2rem}
[data-vibeui-block="blog-003"] [data-part="card"]{grid-template-columns:1fr 1.15fr}
[data-vibeui-block="blog-003"] [data-part="cover"]{aspect-ratio:auto;height:100%}
[data-vibeui-block="blog-003"] [data-part="body"]{padding:2rem 2rem 2.125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-003"] *{animation:none!important;transition:none!important}}
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

/**
 * Крупный анонс статьи: обложка-градиент, автор, время чтения и объём.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Blog003({
  badge = "Свежее",
  topic = "Разработка",
  title = "Почему мы отказались от библиотеки иконок",
  excerpt = "Двести килобайт ради восьми иконок — плохая сделка. Рассказываем, как перешли на инлайновые SVG, что при этом сломалось и почему в итоге сборка похудела вдвое.",
  author = "Аня Соколова",
  role = "фронтенд-лид",
  date = "12 марта 2025",
  readingTime = "7 минут",
  words = "1 400 слов",
  ctaLabel = "Читать статью",
  href = "#",
  coverLabel = "Выпуск №14",
  hue = 300,
  background = "",
  accent,
  className,
  style,
}: Blog003Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="blog-003"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <article data-part="card">
            <div
              data-part="cover"
              style={{
                background: `linear-gradient(150deg, oklch(0.74 0.15 ${hue}), oklch(0.46 0.2 ${hue + 35}))`,
              }}
            >
              <span data-part="cover-label">{coverLabel}</span>
            </div>

            <div data-part="body">
              <div data-part="tags">
                <span data-part="badge">{badge}</span>
                <span data-part="topic">{topic}</span>
              </div>

              <h2>
                <a href={href}>{title}</a>
              </h2>
              <p data-part="excerpt">{excerpt}</p>

              <p data-part="byline">
                <span data-part="avatar" aria-hidden="true">
                  {author.slice(0, 1)}
                </span>
                <span data-part="who">
                  <span data-part="name">{author}</span>
                  <span data-part="role">{role}</span>
                </span>
                <span data-part="stats">
                  <time>{date}</time>
                  <span data-part="dot">·</span>
                  <span>{readingTime}</span>
                  <span data-part="dot">·</span>
                  <span>{words}</span>
                </span>
              </p>

              <span data-part="cta">
                {ctaLabel}
                <span data-part="arrow" aria-hidden="true" />
              </span>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
