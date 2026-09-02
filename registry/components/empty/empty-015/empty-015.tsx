import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Empty015Item = {
  id: string
  title: string
  time: string
}

export type Empty015Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  items?: Empty015Item[]
  retryLabel?: string
  onRetry?: () => void
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: связь пропала, но экран не должен пустеть вслед за ней.
// Баннер сверху объясняет, что происходит, а список под ним остаётся
// прежним контентом — только с меткой возраста у каждой записи, чтобы
// было видно, что это не свежие данные, а последнее, что успело сохраниться.
const STYLES = `
:where([data-vibeui-block="empty-015"]){
--vibeui-empty-015-bg:transparent;
--vibeui-empty-015-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.006 265));
--vibeui-empty-015-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-empty-015-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-empty-015-banner:light-dark(oklch(0.97 0.02 65),oklch(0.3 0.04 65));
--vibeui-empty-015-wait:light-dark(oklch(0.6 0.16 65),oklch(0.8 0.13 65));
--vibeui-empty-015-row:light-dark(oklch(0.97 0.003 265),oklch(0.28 0.009 265));
--vibeui-empty-015-control:light-dark(oklch(1 0 0),oklch(0.24 0.011 265));
--vibeui-empty-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="empty-015"]{
display:flex;flex-direction:column;
width:100%;max-width:26rem;box-sizing:border-box;
background:var(--vibeui-empty-015-bg);
border:1px solid var(--vibeui-empty-015-border);border-radius:1rem;overflow:hidden;
font-family:var(--vibeui-empty-015-font);color:var(--vibeui-empty-015-fg);
}
[data-vibeui-block="empty-015"] [data-part="banner"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.75rem 1rem;
background:var(--vibeui-empty-015-banner);
border-bottom:1px solid var(--vibeui-empty-015-border);
}
[data-vibeui-block="empty-015"] [data-part="mark"]{
flex:none;width:1.375rem;height:1.375rem;color:var(--vibeui-empty-015-wait);
}
[data-vibeui-block="empty-015"] [data-part="banner-text"]{
flex:1;min-width:0;display:flex;flex-direction:column;gap:0.0625rem;
}
[data-vibeui-block="empty-015"] [data-part="title"]{margin:0;font-size:0.8125rem;font-weight:700;line-height:1.3}
[data-vibeui-block="empty-015"] [data-part="text"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-empty-015-muted);
}
[data-vibeui-block="empty-015"] [data-part="retry"]{
flex:none;appearance:none;cursor:pointer;
height:2rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-empty-015-border);
background:var(--vibeui-empty-015-control);color:var(--vibeui-empty-015-fg);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="empty-015"] [data-part="retry"]:hover{background:var(--vibeui-empty-015-row)}
[data-vibeui-block="empty-015"] [data-part="retry"]:focus-visible{
outline:2px solid var(--vibeui-empty-015-wait);outline-offset:2px;
}
[data-vibeui-block="empty-015"] [data-part="list"]{
list-style:none;margin:0;padding:0.5rem;display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="empty-015"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.625rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-empty-015-row);
}
[data-vibeui-block="empty-015"] [data-part="item-title"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="empty-015"] [data-part="item-time"]{
flex:none;padding:0.1875rem 0.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-empty-015-wait) 16%,transparent);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-empty-015-fg);
}
@container (max-width: 22rem){
[data-vibeui-block="empty-015"] [data-part="banner"]{flex-wrap:wrap}
[data-vibeui-block="empty-015"] [data-part="retry"]{flex:1 1 100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Empty015Item[] = [
  { id: "1", title: "Отчёт по продажам за март", time: "Кэш 14:08" },
  { id: "2", title: "Список клиентов", time: "Кэш 14:08" },
  { id: "3", title: "Статус доставок", time: "Кэш 13:52" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Офлайн-баннер поверх сохранённых данных: список остаётся на экране,
 * каждая запись помечена временем кэша, повтор подключения — вручную.
 * Один файл, ноль внешних зависимостей.
 */
export function Empty015({
  title = "Нет соединения",
  text = "Показаны сохранённые данные. Список обновится сам, как только связь вернётся.",
  items = DEFAULT_ITEMS,
  retryLabel = "Обновить",
  onRetry,
  background = "",
  accent,
  className,
  style,
  ...props
}: Empty015Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-015-wait": accent } : null),
    ...(background
      ? {
          "--vibeui-empty-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="empty-015"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <div data-part="banner">
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
            <line x1="2" y1="2" x2="22" y2="22" />
            <path d="M8.5 16.5a5 5 0 0 1 7 0" />
            <path d="M5 12.5a10 10 0 0 1 5.5-3.4" />
            <path d="M19 12.5a10 10 0 0 0-3-2.2" />
            <path d="M2 8.5a15 15 0 0 1 4-2.7" />
            <path d="M22 8.5a15 15 0 0 0-9-4.3" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
          <div data-part="banner-text">
            <h3 data-part="title">{title}</h3>
            <p data-part="text">{text}</p>
          </div>
          <button type="button" data-part="retry" onClick={onRetry}>
            {retryLabel}
          </button>
        </div>
        <ul data-part="list">
          {items.map((item) => (
            <li key={item.id} data-part="item">
              <span data-part="item-title">{item.title}</span>
              <span data-part="item-time">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
