import type { CSSProperties } from "react"

type Errorpage006Link = {
  label: string
  href: string
}

export type Errorpage006Props = {
  query?: string
  title?: string
  description?: string
  tipsLabel?: string
  tips?: string[]
  popularLabel?: string
  popular?: Errorpage006Link[]
  /** Пусто — подложки нет, страница лежит прямо на фоне сайта. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Пустая выдача поиска: запрос показан крупно в кавычках, чтобы человек
// сразу увидел, что именно искалось, и заметил опечатку. Лупа собрана из
// CSS — кольцо и ручка. Дальше два уровня помощи: советы, как
// переформулировать, и популярные разделы — выдача не должна заканчиваться
// тупиком, из пустоты всегда есть ссылка дальше.
const STYLES = `
:where([data-vibeui-block="errorpage-006"]){
--vibeui-errorpage-006-bg:transparent;
--vibeui-errorpage-006-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-errorpage-006-muted:light-dark(oklch(0.48 0 0),oklch(0.7 0 0));
--vibeui-errorpage-006-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-errorpage-006-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-errorpage-006-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-errorpage-006-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-errorpage-006-accent-ink:oklch(from var(--vibeui-errorpage-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-errorpage-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-errorpage-006-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="errorpage-006"]{color-scheme:dark}
[data-vibeui-block="errorpage-006"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-errorpage-006-bg);color:var(--vibeui-errorpage-006-ink);
font-family:var(--vibeui-errorpage-006-font);
}
[data-vibeui-block="errorpage-006"] [data-part="frame"]{
max-width:42rem;margin:0 auto;padding:4rem 1.25rem;
display:flex;flex-direction:column;align-items:center;text-align:center;
}
/* Лупа чистым CSS: кольцо — рамка, ручка — повёрнутый псевдоэлемент. */
[data-vibeui-block="errorpage-006"] [data-part="lens"]{
position:relative;width:2.75rem;height:2.75rem;margin-right:1rem;
border:0.375rem solid color-mix(in oklab,var(--vibeui-errorpage-006-accent) 60%,var(--vibeui-errorpage-006-muted));
border-radius:999px;
}
[data-vibeui-block="errorpage-006"] [data-part="lens"]::after{
content:"";position:absolute;right:-0.875rem;bottom:-0.625rem;
width:1.25rem;height:0.375rem;border-radius:999px;
background:var(--vibeui-errorpage-006-accent-fill);
rotate:45deg;
}
[data-vibeui-block="errorpage-006"] [data-part="query"]{
margin:1.5rem 0 0;max-width:100%;overflow-wrap:break-word;
font-size:clamp(1.375rem,5cqi,2rem);line-height:1.2;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="errorpage-006"] [data-part="query"]::before{content:"«";color:var(--vibeui-errorpage-006-accent)}
[data-vibeui-block="errorpage-006"] [data-part="query"]::after{content:"»";color:var(--vibeui-errorpage-006-accent)}
[data-vibeui-block="errorpage-006"] [data-part="title"]{
margin:0.625rem 0 0;
font-size:clamp(1.125rem,3.5cqi,1.375rem);line-height:1.25;font-weight:650;
color:var(--vibeui-errorpage-006-muted);
}
[data-vibeui-block="errorpage-006"] [data-part="description"]{
margin:0.75rem 0 0;max-width:46ch;
color:var(--vibeui-errorpage-006-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="errorpage-006"] [data-part="tips"]{
margin:2rem 0 0;width:100%;max-width:28rem;text-align:left;
padding:1.25rem 1.5rem;
border:1px solid var(--vibeui-errorpage-006-border);border-radius:1rem;
background:color-mix(in oklab,var(--vibeui-errorpage-006-accent) 8%,var(--vibeui-errorpage-006-card));
}
[data-vibeui-block="errorpage-006"] [data-part="tips-label"]{
margin:0 0 0.75rem;
color:var(--vibeui-errorpage-006-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="errorpage-006"] [data-part="tips-list"]{
margin:0;padding:0;list-style:none;
display:grid;gap:0.5rem;
}
[data-vibeui-block="errorpage-006"] [data-part="tip"]{
display:flex;gap:0.625rem;align-items:baseline;
font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="errorpage-006"] [data-part="tip"]::before{
content:"";flex:none;
width:0.375rem;height:0.375rem;border-radius:999px;
background:var(--vibeui-errorpage-006-accent);color:oklch(from var(--vibeui-errorpage-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="errorpage-006"] [data-part="popular-label"]{
margin:2rem 0 0;
color:var(--vibeui-errorpage-006-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="errorpage-006"] [data-part="popular"]{
margin-top:0.875rem;
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;
}
[data-vibeui-block="errorpage-006"] [data-part="chip"]{
display:inline-block;text-decoration:none;
padding:0.4375rem 0.875rem;border:1px solid var(--vibeui-errorpage-006-border);border-radius:999px;
color:inherit;font-size:0.875rem;font-weight:550;
background:var(--vibeui-errorpage-006-card);
transition:border-color var(--vibeui-errorpage-006-dur-2) ease,color var(--vibeui-errorpage-006-dur-2) ease;
}
[data-vibeui-block="errorpage-006"] [data-part="chip"]:hover{
border-color:color-mix(in oklab,var(--vibeui-errorpage-006-accent) 50%,var(--vibeui-errorpage-006-border));
color:var(--vibeui-errorpage-006-accent);
}
[data-vibeui-block="errorpage-006"] a:focus-visible{
outline:2px solid var(--vibeui-errorpage-006-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="errorpage-006"] [data-part="frame"]{padding:6rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="errorpage-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TIPS = [
  "Опишите блок проще: «навбар со стеклом» вместо точного названия",
  "Уберите цвет из запроса — оттенок настраивается у любого блока",
  "Поищите по назначению: «тарифы», «отзывы», «футер»",
]

const DEFAULT_POPULAR: Errorpage006Link[] = [
  { label: "Хиро-секции", href: "/components?c=hero" },
  { label: "Навбары", href: "/components?c=navbar" },
  { label: "Тарифы", href: "/components?c=pricing" },
  { label: "Футеры", href: "/components?c=footer" },
]

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

/** Пустая выдача поиска: запрос в кавычках, советы и популярные разделы. */
export function Errorpage006({
  query = "фиолетовый навбар со стеклом",
  title = "Ничего не нашлось",
  description = "По этому запросу в каталоге пусто. Так бывает: у блоков простые имена, а оттенки настраиваются после установки.",
  tipsLabel = "Попробуйте иначе",
  tips = DEFAULT_TIPS,
  popularLabel = "Часто ищут",
  popular = DEFAULT_POPULAR,
  background = "",
  accent,
  className,
  style,
}: Errorpage006Props) {
  const palette = {
    ...(accent ? { "--vibeui-errorpage-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-errorpage-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-errorpage-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="errorpage-006"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="lens" aria-hidden="true" />
          <p data-part="query">{query}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <div data-part="tips">
            <p data-part="tips-label">{tipsLabel}</p>
            <ul data-part="tips-list">
              {tips.map((tip) => (
                <li key={tip} data-part="tip">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <p data-part="popular-label">{popularLabel}</p>
          <nav data-part="popular" aria-label={popularLabel}>
            {popular.map((link) => (
              <a key={link.label} data-part="chip" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>
    </>
  )
}
