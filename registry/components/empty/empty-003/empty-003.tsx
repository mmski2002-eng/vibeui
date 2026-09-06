import type { ComponentProps, CSSProperties } from "react"

export type Empty003Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  query?: string
  keep?: number
  /** Надпись над разбором запроса. */
  label?: string
  title?: string
  text?: string
  /** Подпись кнопки. `{query}` — место укороченного запроса. */
  actionTemplate?: string
  onAction?: () => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пустой поиск, который разбирает сам запрос. Вместо совета
// «попробуйте иначе» слова запроса показаны чипами, а лишние — зачёркнуты:
// видно, что именно сузило выдачу до нуля. Главное действие ровно одно —
// повторить поиск по укороченному запросу.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="empty-003"]){
--vibeui-empty-003-bg:transparent;
--vibeui-empty-003-fg:light-dark(oklch(0.21 0 265),oklch(0.95 0 265));
--vibeui-empty-003-muted:color-mix(in oklab,var(--vibeui-empty-003-fg) 68%,transparent);
--vibeui-empty-003-border:light-dark(oklch(0.91 0 265),oklch(0.37 0 265));
--vibeui-empty-003-strike:light-dark(oklch(0.97 0 265),oklch(0.3 0 265));
--vibeui-empty-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-empty-003-accent-fg:light-dark(oklch(0.99 0 265),oklch(0.18 0 265));
--vibeui-empty-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-003"]{color-scheme:dark}
[data-vibeui-block="empty-003"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-003-bg);
border:1px solid var(--vibeui-empty-003-border);border-radius:1rem;
font-family:var(--vibeui-empty-003-font);color:var(--vibeui-empty-003-fg);
}
[data-vibeui-block="empty-003"] [data-part="label"]{
margin:0;font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-empty-003-muted);
}
/* Разбор запроса: лишние слова зачёркнуты, а не описаны словами. */
[data-vibeui-block="empty-003"] [data-part="words"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.3125rem;margin:0.125rem 0 0.25rem;
}
[data-vibeui-block="empty-003"] [data-part="word"]{
padding:0.1875rem 0.5625rem;border-radius:9999px;
border:1px solid var(--vibeui-empty-003-border);
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="empty-003"] [data-part="word"][data-extra="true"]{
color:var(--vibeui-empty-003-muted);text-decoration:line-through;
background:var(--vibeui-empty-003-strike);
}
[data-vibeui-block="empty-003"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-003"] [data-part="text"]{
margin:0;max-width:34ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-003-muted);
}
[data-vibeui-block="empty-003"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.5rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.375rem;padding:0.3125rem 1rem;border-radius:0.75rem;
background:var(--vibeui-empty-003-accent);color:var(--vibeui-empty-003-accent-fg);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-003"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-003-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-003"] *{animation:none!important;transition:none!important}}
`

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
 * Пустой поиск с разбором запроса: лишние слова видно, действие одно.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty003({
  query = "карточка товара с ценой и рейтингом",
  keep = 2,
  label = "Ничего не нашлось по запросу",
  title = "Слишком точный запрос",
  text = "Чем короче запрос, тем больше он находит. Уточнения лучше добавлять фильтрами, а не словами.",
  actionTemplate = "Искать «{query}»",
  onAction,
  background = "",
  accent,
  className,
  style,
  ...props
}: Empty003Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-empty-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const words = query.trim().split(/\s+/).filter(Boolean)
  const short = words.slice(0, Math.max(1, keep)).join(" ")

  return (
    <>
      <style href="vibeui-empty-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="empty"
        data-vibeui-block="empty-003"
        role="status"
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <p data-part="words">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              data-part="word"
              data-extra={index >= Math.max(1, keep)}
            >
              {word}
            </span>
          ))}
        </p>
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        <button type="button" data-part="action" onClick={onAction}>
          {actionTemplate.replace("{query}", short)}
        </button>
      </div>
    </>
  )
}
