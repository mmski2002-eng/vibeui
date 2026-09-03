"use client"

import { useId, useState, type CSSProperties } from "react"

export type Empty010Props = {
  title?: string
  text?: string
  initialQuery?: string
  suggestions?: string[]
  placeholder?: string
  searchLabel?: string
  resetLabel?: string
  onSearch?: (query: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: пустая выдача поиска, где сброс — это реальное действие
// с полем, а не подпись под чужим запросом. Поле редактируемо, чипы
// подставляют в него слово, а кнопка сброса возвращает поле к исходному
// запросу или очищает его. Отличие от статичной карточки "Ничего не
// нашлось": здесь ищут заново, не покидая экран.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="empty-010"]){
--vibeui-empty-010-bg:transparent;
--vibeui-empty-010-fg:light-dark(oklch(0.21 0.014 265),oklch(0.95 0.005 265));
--vibeui-empty-010-muted:color-mix(in oklab,var(--vibeui-empty-010-fg) 68%,transparent);
--vibeui-empty-010-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-empty-010-hover:light-dark(oklch(0.97 0.003 265),oklch(0.31 0.011 265));
--vibeui-empty-010-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-empty-010-accent-fg:light-dark(oklch(0.99 0.01 265),oklch(0.18 0.03 265));
--vibeui-empty-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-010"]{color-scheme:dark}
[data-vibeui-block="empty-010"]{
display:flex;flex-direction:column;align-items:center;gap:0.625rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:26rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-010-bg);
border:1px solid var(--vibeui-empty-010-border);border-radius:1rem;
font-family:var(--vibeui-empty-010-font);color:var(--vibeui-empty-010-fg);
}
[data-vibeui-block="empty-010"] [data-part="mark"]{
color:var(--vibeui-empty-010-muted);width:2rem;height:2rem;
}
[data-vibeui-block="empty-010"] [data-part="field-label"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;
clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="empty-010"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-010"] [data-part="text"]{
margin:0;max-width:32ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-010-muted);
}
[data-vibeui-block="empty-010"] [data-part="form"]{
display:flex;width:100%;gap:0.5rem;margin-top:0.25rem;
}
[data-vibeui-block="empty-010"] [data-part="field"]{
flex:1;min-width:0;height:2.5rem;padding:0 0.875rem;
border:1px solid var(--vibeui-empty-010-border);border-radius:0.75rem;
background:var(--vibeui-empty-010-bg);color:var(--vibeui-empty-010-fg);
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="empty-010"] [data-part="field"]:focus-visible{
outline:2px solid var(--vibeui-empty-010-accent);outline-offset:2px;
}
[data-vibeui-block="empty-010"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;flex:none;
height:2.5rem;padding:0 1rem;border-radius:0.75rem;
background:var(--vibeui-empty-010-accent);color:var(--vibeui-empty-010-accent-fg);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-010"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-empty-010-accent);outline-offset:2px;
}
[data-vibeui-block="empty-010"] [data-part="chips"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.375rem;margin:0.125rem 0 0;
list-style:none;padding:0;
}
[data-vibeui-block="empty-010"] [data-part="chip"]{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-empty-010-border);border-radius:9999px;
background:transparent;color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="empty-010"] [data-part="chip"]:hover{background:var(--vibeui-empty-010-hover)}
[data-vibeui-block="empty-010"] [data-part="chip"]:focus-visible{
outline:2px solid var(--vibeui-empty-010-accent);outline-offset:2px;
}
[data-vibeui-block="empty-010"] [data-part="reset"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;margin-top:0.125rem;
color:var(--vibeui-empty-010-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="empty-010"] [data-part="reset"]:disabled{
color:var(--vibeui-empty-010-muted);cursor:not-allowed;
}
[data-vibeui-block="empty-010"] [data-part="reset"]:focus-visible{
outline:2px solid var(--vibeui-empty-010-accent);outline-offset:2px;border-radius:0.25rem;
}
@container (max-width: 22rem){
[data-vibeui-block="empty-010"] [data-part="form"]{flex-direction:column}
[data-vibeui-block="empty-010"] [data-part="submit"]{width:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SUGGESTIONS = ["кнопка", "карточка", "иконка"]

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
 * Пустая выдача поиска с редактируемым полем: чипы подставляют слово,
 * сброс возвращает исходный запрос. Один файл, ноль внешних зависимостей.
 */
export function Empty010({
  title = "Ничего не нашлось",
  text = "Попробуйте другое слово или возьмите одну из подсказок ниже.",
  initialQuery = "карточкa товара",
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = "Что ищем?",
  searchLabel = "Искать",
  resetLabel = "Вернуть исходный запрос",
  onSearch,
  background = "",
  accent,
  className,
  style,
}: Empty010Props) {
  const [query, setQuery] = useState(initialQuery)
  const fieldId = useId()
  const palette = {
    ...(accent ? { "--vibeui-empty-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-empty-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-010" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="empty"
        data-vibeui-block="empty-010"
        role="status"
        className={className}
        style={palette}
      >
        <svg
          data-part="mark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <line x1="20" y1="20" x2="15.3" y2="15.3" />
        </svg>
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        <form
          data-part="form"
          onSubmit={(event) => {
            event.preventDefault()
            onSearch?.(query)
          }}
        >
          <label htmlFor={fieldId} data-part="field-label">
            {placeholder}
          </label>
          <input
            id={fieldId}
            data-part="field"
            type="search"
            value={query}
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" data-part="submit">
            {searchLabel}
          </button>
        </form>
        {suggestions.length ? (
          <ul data-part="chips">
            {suggestions.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  data-part="chip"
                  onClick={() => setQuery(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <button
          type="button"
          data-part="reset"
          disabled={query === initialQuery}
          onClick={() => setQuery(initialQuery)}
        >
          {resetLabel}
        </button>
      </div>
    </>
  )
}
