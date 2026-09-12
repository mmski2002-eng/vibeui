import type { CSSProperties } from "react"

type Blog012Topic = {
  name: string
  count: string
  note: string
  href?: string
}

export type Blog012Props = {
  eyebrow?: string
  title?: string
  /** Подпись под числом в плитке: «статей». */
  countLabel?: string
  topics?: Blog012Topic[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Сетка рубрик блога плитками: имя темы, счётчик статей и одна строка о
// том, что внутри. Счётчик показан крупно и оранжевым — это честный ответ
// на главный вопрос перед кликом: есть ли там что читать. Пустые рубрики
// с таким дизайном спрятать не получится, и это намеренно.
const STYLES = `
:where([data-vibeui-block="blog-012"]){
--vibeui-blog-012-bg:transparent;
--vibeui-blog-012-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-blog-012-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-blog-012-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-blog-012-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-blog-012-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-blog-012-tint:color-mix(in oklab,var(--vibeui-blog-012-accent) 8%,light-dark(oklch(1 0 0),oklch(0.22 0 0)));
--vibeui-blog-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-012"]{color-scheme:dark}
[data-vibeui-block="blog-012"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-blog-012-bg);color:var(--vibeui-blog-012-ink);
font-family:var(--vibeui-blog-012-font);
}
[data-vibeui-block="blog-012"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="blog-012"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-blog-012-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="blog-012"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="blog-012"] [data-part="grid"]{display:grid;gap:1rem}
[data-vibeui-block="blog-012"] [data-part="tile"]{
position:relative;min-inline-size:0;
display:flex;flex-direction:column;gap:0.625rem;
padding:1.5rem;border:1px solid var(--vibeui-blog-012-border);border-radius:1.125rem;
background:var(--vibeui-blog-012-card);
transition:border-color .18s ease,background-color .18s ease,transform .18s ease;
}
[data-vibeui-block="blog-012"] [data-part="tile"]:hover{
border-color:color-mix(in oklab,var(--vibeui-blog-012-accent) 45%,var(--vibeui-blog-012-border));
background:var(--vibeui-blog-012-tint);
transform:translateY(-2px);
}
[data-vibeui-block="blog-012"] [data-part="tile"]:focus-within{
outline:2px solid var(--vibeui-blog-012-accent);outline-offset:2px;
}
[data-vibeui-block="blog-012"] [data-part="count"]{
font-size:clamp(1.75rem,5cqi,2.25rem);line-height:1;font-weight:800;letter-spacing:-0.03em;
color:var(--vibeui-blog-012-accent);
}
[data-vibeui-block="blog-012"] [data-part="count"] small{
display:block;margin-top:0.25rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-blog-012-muted);
}
[data-vibeui-block="blog-012"] [data-part="name"]{
margin:0;font-size:1.125rem;line-height:1.25;letter-spacing:-0.01em;font-weight:700;
}
[data-vibeui-block="blog-012"] [data-part="link"]{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="blog-012"] [data-part="link"]::after{
content:"";position:absolute;inset:0;
}
[data-vibeui-block="blog-012"] [data-part="note"]{
margin:0;color:var(--vibeui-blog-012-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 40rem){
[data-vibeui-block="blog-012"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="blog-012"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 64rem){
[data-vibeui-block="blog-012"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TOPICS: Blog012Topic[] = [
  {
    name: "Вёрстка",
    count: "14",
    note: "Раскладки, container queries, типографика и всё, что держит сетку.",
  },
  {
    name: "Компоненты",
    count: "11",
    note: "Разборы блоков каталога: почему секция устроена так, а не иначе.",
  },
  {
    name: "Работа с ИИ",
    count: "9",
    note: "Как агент читает инструкции и что положить в metadata, чтобы он не выдумывал.",
  },
  {
    name: "Продукт",
    count: "7",
    note: "Решения самого VibeUI: каталог, превью и путь блока до чужого проекта.",
  },
  {
    name: "Доступность",
    count: "6",
    note: "Фокус, клавиатура и скринридеры — то, что не видно на скриншоте.",
  },
  {
    name: "Процессы",
    count: "5",
    note: "Как полторы тысячи блоков собираются, проверяются и не разваливаются.",
  },
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

/** Плитки рубрик блога: имя темы, крупный счётчик статей и строка о содержимом. */
export function Blog012({
  eyebrow = "Рубрики",
  title = "О чём пишет журнал",
  countLabel = "статей",
  topics = DEFAULT_TOPICS,
  background = "",
  accent,
  className,
  style,
}: Blog012Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="blog-012"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            {topics.map((topic) => (
              <article key={topic.name} data-part="tile">
                <p data-part="count">
                  {topic.count}
                  <small>{countLabel}</small>
                </p>
                <h3 data-part="name">
                  <a data-part="link" href={topic.href ?? "#"}>
                    {topic.name}
                  </a>
                </h3>
                <p data-part="note">{topic.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
