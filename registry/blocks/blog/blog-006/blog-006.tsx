import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button077 } from "@/registry/components/button/button-077/button-077"

export type Blog006Related = {
  title: string
  reason: string
  topic: string
  readingTime: string
  order?: string
  href?: string
}

export type Blog006Props = {
  title?: string
  afterTitle?: string
  /** Подпись над карточками: {title} — название прочитанной статьи. */
  afterLabel?: string
  items?: Blog006Related[]
  allLabel?: string
  allHref?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: «похожие статьи», в которых видно, чем они похожи. Обычный
// такой блок показывает три заголовка и молчит о связи, поэтому по нему не
// кликают. Здесь у каждой карточки есть строка «почему рядом» — общая
// тема, продолжение разбора или противоположный вывод.
//
// Порядковая подпись («часть 2 из 3») стоит там, где обычно висит рубрика:
// читатель, дочитавший статью, чаще ищет продолжение, чем что-то похожее
// вообще. Блок стоит внизу материала, поэтому он тише самой статьи: фон
// приглушённый, заголовки меньше, ни одной цветной заливки во всю ширину.
const STYLES = `
:where([data-vibeui-block="blog-006"]){
--vibeui-blog-006-bg:transparent;
--vibeui-blog-006-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-blog-006-fg:light-dark(oklch(0.2 0 265),oklch(0.95 0 265));
--vibeui-blog-006-muted:light-dark(oklch(0.52 0 265),oklch(0.72 0 265));
--vibeui-blog-006-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-blog-006-accent:light-dark(oklch(0.287 0 0),oklch(0.91 0 0));
--vibeui-blog-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-blog-006-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-006"]{color-scheme:dark}
[data-vibeui-block="blog-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-blog-006-bg);color:var(--vibeui-blog-006-fg);
font-family:var(--vibeui-blog-006-sans);
border-top:1px solid var(--vibeui-blog-006-border);
}
[data-vibeui-block="blog-006"] *{box-sizing:border-box}
[data-vibeui-block="blog-006"] [data-part="all"]{justify-self:start}
[data-vibeui-block="blog-006"] [data-part="frame"]{
max-width:68rem;margin:0 auto;padding:2.5rem 1.25rem;display:grid;gap:1.125rem;
}
[data-vibeui-block="blog-006"] [data-part="head"]{display:grid;gap:0.25rem}
[data-vibeui-block="blog-006"] [data-part="after"]{
margin:0;font-size:0.875rem;line-height:1.5;color:var(--vibeui-blog-006-muted);
}
[data-vibeui-block="blog-006"] [data-part="after"] b{color:var(--vibeui-blog-006-fg);font-weight:640}
[data-vibeui-block="blog-006"] [data-part="grid"]{display:grid;gap:0.75rem}
[data-vibeui-block="blog-006"] article{
position:relative;display:grid;gap:0.4375rem;align-content:start;
padding:0.9375rem 1rem 1rem;border-radius:1rem;
background:var(--vibeui-blog-006-card);border:1px solid var(--vibeui-blog-006-border);
transition:border-color var(--vibeui-blog-006-dur-2) ease;
}
[data-vibeui-block="blog-006"] article:hover{border-color:color-mix(in oklab,var(--vibeui-blog-006-accent) 45%,var(--vibeui-blog-006-border))}
[data-vibeui-block="blog-006"] article:focus-within{outline:2px solid var(--vibeui-blog-006-accent);outline-offset:2px}
/* Порядковая подпись важнее рубрики: дочитавший ищет продолжение. */
[data-vibeui-block="blog-006"] [data-part="order"]{
justify-self:start;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-blog-006-accent) 12%,transparent);
color:var(--vibeui-blog-006-accent);
font-size:0.625rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
}
[data-vibeui-block="blog-006"] h3{margin:0;font-size:0.9375rem;line-height:1.35;font-weight:650}
[data-vibeui-block="blog-006"] h3 a{color:inherit;text-decoration:none}
[data-vibeui-block="blog-006"] h3 a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="blog-006"] h3 a:focus-visible{outline:none}
/* Строка «почему рядом»: без неё блок похожих статей просто игнорируют. */
[data-vibeui-block="blog-006"] [data-part="reason"]{
margin:0;display:flex;gap:0.4375rem;
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-blog-006-muted);
}
[data-vibeui-block="blog-006"] [data-part="link-glyph"]{
flex:none;width:0.75rem;height:0.75rem;margin-top:0.25rem;border-radius:0.25rem;
border:1.5px solid color-mix(in oklab,var(--vibeui-blog-006-accent) 55%,transparent);
border-right-color:transparent;border-bottom-color:transparent;
transform:rotate(-45deg);
}
[data-vibeui-block="blog-006"] [data-part="meta"]{
display:flex;flex-wrap:wrap;gap:0.4375rem;margin-top:0.125rem;
font-size:0.75rem;color:var(--vibeui-blog-006-muted);
}
[data-vibeui-block="blog-006"] [data-part="dot"]{opacity:.5}
@container (min-width: 44rem){
[data-vibeui-block="blog-006"] [data-part="frame"]{padding:3rem 2rem}
[data-vibeui-block="blog-006"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Blog006Related[] = [
  {
    title: "Единицы cqi и текст, который знает своё место",
    reason:
      "Продолжение этого разбора: та же механика, но про размер шрифта, а не про раскладку.",
    topic: "Вёрстка",
    readingTime: "6 мин",
    order: "Часть 2 из 3",
  },
  {
    title: "Мы вернули два медиазапроса — и не жалеем",
    reason:
      "Противоположный вывод на тех же данных: где контейнерный запрос оказался лишним.",
    topic: "Вёрстка",
    readingTime: "8 мин",
  },
  {
    title: "Каталог компонентов, который не врёт",
    reason:
      "Тот же приём в другой задаче: миниатюра показывает настоящую раскладку блока.",
    topic: "Продукт",
    readingTime: "5 мин",
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

/**
 * Похожие статьи с объяснением, чем именно они связаны с прочитанной.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Blog006({
  title = "Что читать дальше",
  afterTitle = "Контейнерные запросы вместо брейкпоинтов",
  afterLabel = "После статьи «{title}»",
  items = DEFAULT_ITEMS,
  allLabel = "Весь архив рубрики «Вёрстка»",
  allHref = "#",
  background = "",
  accent,
  className,
  style,
}: Blog006Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  // Название выделено внутри фразы, поэтому подпись приходит шаблоном и
  // режется по метке: перевод волен ставить название куда угодно.
  const [beforeTitle, afterTitleTail = ""] = afterLabel.split("{title}")

  return (
    <>
      <style href="vibeui-blog-006" precedence="medium">
        {STYLES}
      </style>
      <aside
        data-vibeui-block="blog-006"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <header data-part="head">
            <Heading001
              data-part="heading"
              title={title}
              size="xs"
              accent={accent}
            />
            <p data-part="after">
              {beforeTitle}
              <b>{afterTitle}</b>
              {afterTitleTail}
            </p>
          </header>

          <div data-part="grid">
            {items.map((item) => (
              <article key={item.title}>
                {item.order ? (
                  <span data-part="order">{item.order}</span>
                ) : null}
                <h3>
                  <a href={item.href ?? "#"}>{item.title}</a>
                </h3>
                <p data-part="reason">
                  <span data-part="link-glyph" aria-hidden="true" />
                  <span>{item.reason}</span>
                </p>
                <p data-part="meta">
                  <span>{item.topic}</span>
                  <span data-part="dot">·</span>
                  <span>{item.readingTime}</span>
                </p>
              </article>
            ))}
          </div>

          <Button077
            data-part="all"
            label={allLabel}
            href={allHref}
            accent={accent}
          />
        </div>
      </aside>
    </>
  )
}
