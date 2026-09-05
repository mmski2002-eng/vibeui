import type { CSSProperties } from "react"

export type BlogPost001Paragraph = {
  /** Ширина каждой строки-плейсхолдера в процентах (0–100). */
  lines: number[]
}

export type BlogPost001Props = {
  category?: string
  title?: string
  author?: string
  date?: string
  readTime?: string
  paragraphs?: BlogPost001Paragraph[]
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Секция статьи блога: заголовок и мета настоящие, тело — декоративные
// серые полоски-плейсхолдеры разной ширины, имитирующие абзацы текста. Это
// приём макета, а не заглушка под lorem-ipsum: полоски остаются полосками.
//
// Палитра, шрифт и keyframes живут здесь, а не в globals.css проекта.
// container-type делает секцию собственным query-контейнером: колонка чтения
// и типографика считаются от ширины блока, а не от ширины окна. Появление
// сверху вниз (заголовок → мета → строки абзацев по очереди) собрано на CSS:
// каждый элемент с [data-reveal] всплывает, задержка задаётся по порядку.
const STYLES = `
:where([data-vibeui-block="blog-post-001"]){
--vibeui-blog-post-001-bg:transparent;
--vibeui-blog-post-001-fg:light-dark(oklch(0.22 0.01 265),oklch(0.94 0.005 265));
--vibeui-blog-post-001-muted:light-dark(oklch(0.55 0.02 265),oklch(0.72 0.02 265));
--vibeui-blog-post-001-border:light-dark(oklch(0.9 0.008 265),oklch(0.3 0.01 265));
--vibeui-blog-post-001-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.16 264));
--vibeui-blog-post-001-accent-fg:oklch(from var(--vibeui-blog-post-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-blog-post-001-line:color-mix(in oklab,var(--vibeui-blog-post-001-fg) 13%,transparent);
--vibeui-blog-post-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-post-001"]{color-scheme:dark}
[data-vibeui-block="blog-post-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);margin:0;
container-type:inline-size;
padding:clamp(1.75rem,6cqi,4.5rem) clamp(1.25rem,5cqi,2.5rem);
background:var(--vibeui-blog-post-001-bg);
color:var(--vibeui-blog-post-001-fg);
font-family:var(--vibeui-blog-post-001-font);
-webkit-font-smoothing:antialiased;
}
[data-vibeui-block="blog-post-001"] *{box-sizing:border-box}
[data-vibeui-block="blog-post-001"] [data-part="column"]{
margin-inline:auto;width:100%;max-width:42rem;
}
[data-vibeui-block="blog-post-001"] [data-part="category"]{
display:inline-flex;align-items:center;height:1.5rem;padding:0 0.625rem;
border-radius:9999px;font-size:0.75rem;font-weight:600;letter-spacing:0.01em;
color:var(--vibeui-blog-post-001-accent);
background:color-mix(in oklab,var(--vibeui-blog-post-001-accent) 13%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-blog-post-001-accent) 24%,transparent);
}
[data-vibeui-block="blog-post-001"] [data-part="title"]{
margin:0.875rem 0 0;
font-size:clamp(1.75rem,6cqi,2.85rem);line-height:1.1;
font-weight:700;letter-spacing:-0.02em;text-wrap:balance;
}
[data-vibeui-block="blog-post-001"] [data-part="meta"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.5rem 0.625rem;
margin-top:1.125rem;
font-size:0.875rem;color:var(--vibeui-blog-post-001-muted);
}
[data-vibeui-block="blog-post-001"] [data-part="avatar"]{
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;flex:none;border-radius:9999px;
font-size:0.8125rem;font-weight:650;letter-spacing:0.01em;
color:var(--vibeui-blog-post-001-accent-fg);
background:var(--vibeui-blog-post-001-accent);
}
[data-vibeui-block="blog-post-001"] [data-part="author"]{
font-weight:600;color:var(--vibeui-blog-post-001-fg);
}
[data-vibeui-block="blog-post-001"] [data-part="sep"]{
width:0.1875rem;height:0.1875rem;flex:none;border-radius:9999px;
background:currentColor;opacity:0.6;
}
[data-vibeui-block="blog-post-001"] [data-part="rule"]{
margin:clamp(1.5rem,4cqi,2.25rem) 0 0;height:1px;border:0;
background:var(--vibeui-blog-post-001-border);
}
[data-vibeui-block="blog-post-001"] [data-part="body"]{
margin-top:clamp(1.5rem,4cqi,2.25rem);
display:flex;flex-direction:column;gap:clamp(1.25rem,3.5cqi,1.75rem);
}
[data-vibeui-block="blog-post-001"] [data-part="paragraph"]{
display:flex;flex-direction:column;gap:0.6875rem;
}
[data-vibeui-block="blog-post-001"] [data-part="linebar"]{
height:0.6875rem;border-radius:9999px;max-width:100%;
background:var(--vibeui-blog-post-001-line);
}
[data-vibeui-block="blog-post-001"] [data-reveal]{
animation:vibeui-blog-post-001-rise 0.6s cubic-bezier(0.16,1,0.3,1) both;
}
@container (min-width:34rem){
[data-vibeui-block="blog-post-001"] [data-part="linebar"]{height:0.75rem}
[data-vibeui-block="blog-post-001"] [data-part="body"]{gap:1.75rem}
}
@keyframes vibeui-blog-post-001-rise{
from{opacity:0;transform:translateY(10px)}
to{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="blog-post-001"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_PARAGRAPHS: BlogPost001Paragraph[] = [
  { lines: [100, 96, 88, 62] },
  { lines: [100, 92, 70] },
  { lines: [97, 100, 90, 84, 55] },
  { lines: [100, 86, 48] },
]

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return "•"
  }

  const first = parts[0].charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : ""

  return (first + last).toUpperCase()
}

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

export function BlogPost001({
  category = "Инженерия",
  title = "Как мы сократили время сборки вдвое",
  author = "Анна Ковалёва",
  date = "5 сентября 2026",
  readTime = "7 мин чтения",
  paragraphs = DEFAULT_PARAGRAPHS,
  accent,
  background = "",
  className,
  style,
}: BlogPost001Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-post-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-post-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  let step = 0
  const delay = () => ({ animationDelay: `${(step++ * 0.08).toFixed(2)}s` })

  return (
    <>
      <style href="vibeui-blog-post-001" precedence="medium">
        {STYLES}
      </style>
      <article
        data-vibeui-block="blog-post-001"
        className={className}
        style={palette}
      >
        <div data-part="column">
          <header>
            {category ? (
              <span data-part="category" data-reveal style={delay()}>
                {category}
              </span>
            ) : null}
            <h1 data-part="title" data-reveal style={delay()}>
              {title}
            </h1>
            <div data-part="meta" data-reveal style={delay()}>
              <span data-part="avatar" aria-hidden="true">
                {initialsFrom(author)}
              </span>
              <span data-part="author">{author}</span>
              <span data-part="sep" aria-hidden="true" />
              <span>{date}</span>
              <span data-part="sep" aria-hidden="true" />
              <span>{readTime}</span>
            </div>
          </header>

          <hr data-part="rule" />

          <div data-part="body">
            {paragraphs.map((paragraph, paragraphIndex) => (
              <div data-part="paragraph" key={paragraphIndex}>
                {paragraph.lines.map((width, lineIndex) => (
                  <div
                    data-part="linebar"
                    data-reveal
                    key={lineIndex}
                    aria-hidden="true"
                    style={{
                      width: `${Math.max(0, Math.min(100, width))}%`,
                      ...delay(),
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </article>
    </>
  )
}
