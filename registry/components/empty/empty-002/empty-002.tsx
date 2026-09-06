import type { ComponentProps, CSSProperties } from "react"

export type Empty002Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  query?: string
  /** Начало фразы с запросом. `{query}` — место самого запроса. */
  queryTemplate?: string
  suggestions?: string[]
  resetLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пустая выдача поиска. Она отличается от пустого раздела
// тем, что данные есть — их просто не нашлось по запросу. Поэтому здесь не
// «создайте первый проект», а сам запрос, причины и готовые ходы: убрать
// фильтры или попробовать соседний запрос.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="empty-002"]){
--vibeui-empty-002-bg:transparent;
--vibeui-empty-002-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-empty-002-muted:color-mix(in oklab,var(--vibeui-empty-002-fg) 68%,transparent);
--vibeui-empty-002-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-empty-002-hover:light-dark(oklch(0.97 0 265),oklch(0.31 0 265));
--vibeui-empty-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-empty-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-002"]{color-scheme:dark}
[data-vibeui-block="empty-002"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:1.25rem 1rem;
text-align:center;
background:var(--vibeui-empty-002-bg);
border:1px solid var(--vibeui-empty-002-border);border-radius:0.875rem;
font-family:var(--vibeui-empty-002-font);color:var(--vibeui-empty-002-fg);
}
/* Лупа с чертой: знак «искали, но не нашли», а не просто пустая коробка. */
[data-vibeui-block="empty-002"] [data-part="mark"]{
position:relative;width:2.25rem;height:2.25rem;margin-bottom:0.125rem;
}
[data-vibeui-block="empty-002"] [data-part="mark"]::before{
content:"";position:absolute;left:0.125rem;top:0.125rem;width:1.5rem;height:1.5rem;
border:2px solid var(--vibeui-empty-002-border);border-radius:9999px;
}
[data-vibeui-block="empty-002"] [data-part="mark"]::after{
content:"";position:absolute;right:0.1875rem;bottom:0.25rem;
width:0.75rem;height:2px;background:var(--vibeui-empty-002-border);
transform:rotate(45deg);border-radius:9999px;
}
[data-vibeui-block="empty-002"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="empty-002"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-empty-002-muted)}
[data-vibeui-block="empty-002"] [data-part="query"]{color:var(--vibeui-empty-002-fg);font-weight:650}
/* Готовые ходы вместо совета «попробуйте другой запрос». */
[data-vibeui-block="empty-002"] [data-part="chips"]{display:flex;flex-wrap:wrap;justify-content:center;gap:0.375rem;margin-top:0.125rem}
[data-vibeui-block="empty-002"] [data-part="chip"]{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-empty-002-border);border-radius:9999px;
background:transparent;color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="empty-002"] [data-part="chip"]:hover{background:var(--vibeui-empty-002-hover)}
[data-vibeui-block="empty-002"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-empty-002-accent);outline-offset:2px}
[data-vibeui-block="empty-002"] [data-part="reset"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;margin-top:0.25rem;
color:var(--vibeui-empty-002-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="empty-002"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-empty-002-accent);outline-offset:2px;border-radius:0.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SUGGESTIONS = ["кнопка", "карточка", "календарь"]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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

/**
 * Пустая выдача поиска: сам запрос, причина и готовые ходы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty002({
  title = "Ничего не нашлось",
  text = "ничего не нашлось. Возможно, мешают фильтры или в запросе опечатка.",
  query = "карточкa товара",
  queryTemplate = "По запросу «{query}»",
  suggestions = DEFAULT_SUGGESTIONS,
  resetLabel = "Сбросить фильтры",
  background = "",
  accent,
  className,
  style,
  ...props
}: Empty002Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-empty-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const [beforeQuery = "", afterQuery = ""] = queryTemplate.split("{query}")

  return (
    <>
      <style href="vibeui-empty-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="empty"
        data-vibeui-block="empty-002"
        role="status"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <h3 data-part="title">{title}</h3>
        <p data-part="text">
          {query ? (
            <>
              {beforeQuery}
              <span data-part="query">{query}</span>
              {afterQuery}{" "}
            </>
          ) : null}
          {text}
        </p>
        {suggestions.length ? (
          <div data-part="chips">
            {suggestions.map((item) => (
              <button key={item} type="button" data-part="chip">
                {item}
              </button>
            ))}
          </div>
        ) : null}
        <button type="button" data-part="reset">
          {resetLabel}
        </button>
      </div>
    </>
  )
}
