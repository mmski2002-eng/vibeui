import type { CSSProperties } from "react"

export type Blog013Props = {
  topic?: string
  title?: string
  lede?: string
  author?: string
  /** Фото автора. Без него в кружке остаются инициалы. */
  avatarImage?: string
  role?: string
  date?: string
  readingTime?: string
  /** Ширина декоративной полосы прогресса чтения в процентах, 0–100. */
  progress?: number
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка поста: тег рубрики, крупный заголовок, лид и строка автора с датой
// и временем чтения. Сверху — тонкая оранжевая полоса прогресса чтения.
// Полоса декоративная и статичная: живой прогресс требует скролл-слушателя,
// а шапка обязана оставаться серверной. Ширину задаёт проп progress.
const STYLES = `
:where([data-vibeui-block="blog-013"]){
--vibeui-blog-013-bg:transparent;
--vibeui-blog-013-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-blog-013-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-blog-013-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-blog-013-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-blog-013-tint:color-mix(in oklab,var(--vibeui-blog-013-accent) 12%,light-dark(oklch(1 0 0),oklch(0.22 0 0)));
--vibeui-blog-013-track:color-mix(in oklab,var(--vibeui-blog-013-accent) 14%,transparent);
--vibeui-blog-013-progress:24%;
--vibeui-blog-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-013"]{color-scheme:dark}
[data-vibeui-block="blog-013"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-blog-013-bg);color:var(--vibeui-blog-013-ink);
font-family:var(--vibeui-blog-013-font);
}
[data-vibeui-block="blog-013"] [data-part="bar"]{
height:0.25rem;background:var(--vibeui-blog-013-track);
}
[data-vibeui-block="blog-013"] [data-part="bar"]::before{
content:"";display:block;height:100%;
width:var(--vibeui-blog-013-progress);
background:var(--vibeui-blog-013-accent);
}
[data-vibeui-block="blog-013"] [data-part="shell"]{
max-width:52rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="blog-013"] [data-part="topic"]{
display:inline-block;margin:0 0 1rem;
padding:0.25rem 0.75rem;border-radius:999px;
background:var(--vibeui-blog-013-tint);
color:var(--vibeui-blog-013-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="blog-013"] [data-part="title"]{
margin:0 0 1rem;max-width:24ch;
font-size:clamp(1.75rem,6cqi,3rem);line-height:1.08;letter-spacing:-0.03em;font-weight:800;
}
[data-vibeui-block="blog-013"] [data-part="lede"]{
margin:0 0 1.75rem;max-width:56ch;
color:var(--vibeui-blog-013-muted);
font-size:clamp(1rem,2.4cqi,1.1875rem);line-height:1.6;
}
[data-vibeui-block="blog-013"] [data-part="byline"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1rem;
padding-top:1.25rem;border-top:1px solid var(--vibeui-blog-013-border);
}
[data-vibeui-block="blog-013"] [data-part="avatar"]{
position:relative;width:2.75rem;height:2.75rem;flex:none;border-radius:999px;
display:grid;place-items:center;
color:var(--vibeui-blog-013-accent);
font-size:0.875rem;font-weight:750;letter-spacing:0.02em;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="blog-013"] [data-part="avatar"][data-empty="true"]{background:var(--vibeui-blog-013-tint);}
[data-vibeui-block="blog-013"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="blog-013"] [data-part="who"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="blog-013"] [data-part="author"]{font-size:0.9375rem;font-weight:650}
[data-vibeui-block="blog-013"] [data-part="role"]{color:var(--vibeui-blog-013-muted);font-size:0.8125rem}
[data-vibeui-block="blog-013"] [data-part="when"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.75rem;margin-left:auto;
color:var(--vibeui-blog-013-muted);font-size:0.8125rem;
}
@container (min-width: 40rem){
[data-vibeui-block="blog-013"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-013"] *{animation:none!important;transition:none!important}}
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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

/** Шапка поста: тег, заголовок, автор и декоративная полоса прогресса чтения. */
export function Blog013({
  topic = "Работа с ИИ",
  title = "Отдайте вёрстку агенту: как «Copy for AI» переносит блок в проект",
  lede = "Кнопка в каталоге отдаёт агенту не код, а инструкцию: что установить, что сохранить и что можно менять. Разбираем, из чего она собирается и почему агент по ней не выдумывает лишнего.",
  author = "Вера Славина",
  avatarImage = "",
  role = "редактор VibeUI",
  date = "26 марта 2026",
  readingTime = "9 минут чтения",
  progress = 24,
  background = "",
  accent,
  className,
  style,
}: Blog013Props) {
  const clamped = Math.min(100, Math.max(0, progress))
  const palette = {
    "--vibeui-blog-013-progress": `${clamped}%`,
    ...(accent ? { "--vibeui-blog-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-013" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="blog-013"
        className={className}
        style={palette}
      >
        <div data-part="bar" aria-hidden="true" />
        <div data-part="shell">
          <p data-part="topic">{topic}</p>
          <h1 data-part="title">{title}</h1>
          <p data-part="lede">{lede}</p>
          <div data-part="byline">
            <span
              data-part="avatar"
              data-empty={avatarImage ? undefined : "true"}
              aria-hidden="true"
            >
              {avatarImage ? (
                <img src={avatarImage} alt="" loading="lazy" decoding="async" />
              ) : null}
              {initials(author)}
            </span>
            <span data-part="who">
              <span data-part="author">{author}</span>
              <span data-part="role">{role}</span>
            </span>
            <p data-part="when">
              <time>{date}</time>
              <span>{readingTime}</span>
            </p>
          </div>
        </div>
      </header>
    </>
  )
}
