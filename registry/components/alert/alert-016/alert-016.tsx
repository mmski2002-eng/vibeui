import type { ComponentProps, CSSProperties } from "react"

export type Alert016Tone = "info" | "success" | "warning" | "danger"

export type Alert016Entry = {
  tone?: Alert016Tone
  title: string
  description?: string
  time?: string
}

export type Alert016Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  title?: string
  entries?: Alert016Entry[]
  /** Сколько записей показывать: остальные сворачиваются в строку-счётчик. */
  visible?: number
  clearLabel?: string
  onClear?: () => void
  /** Строка свёрнутого хвоста; {n} заменяется числом скрытых записей. */
  moreLabel?: string
  /** Пусто — подложки нет, группа лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: несколько сообщений в одной рамке вместо стопки отдельных
// алертов. Пять карточек подряд — это стена, которую пролистывают; здесь у
// них общая рамка, общий заголовок и одна кнопка «очистить». Лишние записи
// сворачиваются в строку со счётчиком, а не растягивают блок.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-016"]){
--vibeui-alert-016-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-alert-016-muted:color-mix(in oklab,var(--vibeui-alert-016-fg) 68%,transparent);
--vibeui-alert-016-bg:transparent;
--vibeui-alert-016-head:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-alert-016-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-alert-016-tone:light-dark(oklch(0.58 0.18 39.8),oklch(0.76 0.15 39.8));
--vibeui-alert-016-radius:0.875rem;
--vibeui-alert-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-016"]{color-scheme:dark}
[data-vibeui-block="alert-016"]{
display:flex;flex-direction:column;
width:100%;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-alert-016-border);
border-radius:var(--vibeui-alert-016-radius);
background:var(--vibeui-alert-016-bg);color:var(--vibeui-alert-016-fg);
font-family:var(--vibeui-alert-016-font);
}
[data-vibeui-block="alert-016"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
padding:0.6875rem 1rem;border-bottom:1px solid var(--vibeui-alert-016-border);
background:var(--vibeui-alert-016-head);
}
[data-vibeui-block="alert-016"] [data-part="head-title"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="alert-016"] [data-part="clear"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-alert-016-muted);font:inherit;font-size:0.75rem;
}
[data-vibeui-block="alert-016"] [data-part="clear"]:hover{color:var(--vibeui-alert-016-fg)}
[data-vibeui-block="alert-016"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-alert-016-tone);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="alert-016"] [data-part="entry"]{
display:flex;align-items:flex-start;gap:0.625rem;
padding:0.75rem 1rem;
}
[data-vibeui-block="alert-016"] [data-part="entry"] + [data-part="entry"]{border-top:1px solid var(--vibeui-alert-016-border)}
[data-vibeui-block="alert-016"] [data-part="entry"][data-tone="success"]{--vibeui-alert-016-tone:light-dark(oklch(0.58 0.15 152),oklch(0.74 0.16 152))}
[data-vibeui-block="alert-016"] [data-part="entry"][data-tone="warning"]{--vibeui-alert-016-tone:light-dark(oklch(0.68 0.15 70),oklch(0.8 0.15 70))}
[data-vibeui-block="alert-016"] [data-part="entry"][data-tone="danger"]{--vibeui-alert-016-tone:light-dark(oklch(0.56 0.19 25),oklch(0.71 0.18 25))}
[data-vibeui-block="alert-016"] [data-part="dot"]{
flex:none;width:0.4375rem;height:0.4375rem;margin-top:0.4375rem;
border-radius:9999px;background:var(--vibeui-alert-016-tone);
}
[data-vibeui-block="alert-016"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-016"] [data-part="title"]{font-size:0.875rem;font-weight:550;line-height:1.4}
[data-vibeui-block="alert-016"] [data-part="description"]{font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-016-muted)}
[data-vibeui-block="alert-016"] [data-part="time"]{
flex:none;font-size:0.75rem;color:var(--vibeui-alert-016-muted);white-space:nowrap;
}
/* Хвост списка сворачивается в строку: стопка не должна расти бесконечно. */
[data-vibeui-block="alert-016"] [data-part="more"]{
padding:0.625rem 1rem;border-top:1px solid var(--vibeui-alert-016-border);
font-size:0.75rem;color:var(--vibeui-alert-016-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Alert016Entry[] = [
  {
    tone: "success",
    title: "Проект опубликован",
    description: "Изменения видны по адресу проекта.",
    time: "2 мин",
  },
  {
    tone: "warning",
    title: "Домен подтверждается",
    description: "DNS-запись найдена, ждём сертификат.",
    time: "18 мин",
  },
  {
    tone: "danger",
    title: "Сборка страницы «Услуги» упала",
    description: "Прошлая версия продолжает работать.",
    time: "1 ч",
  },
  {
    title: "Приглашён участник",
    description: "anna@studio.ru — роль редактора.",
    time: "3 ч",
  },
]

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
 * Несколько сообщений в одной рамке: общий заголовок и свёрнутый хвост.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert016({
  title = "Уведомления",
  entries = DEFAULT_ENTRIES,
  visible = 3,
  clearLabel = "Очистить",
  onClear,
  moreLabel = "Ещё {n} — в журнале",
  background = "",
  className,
  style,
  ...props
}: Alert016Props) {
  const shown = entries.slice(0, Math.max(1, visible))
  const rest = entries.length - shown.length
  const palette = {
    ...(background
      ? {
          "--vibeui-alert-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-016"
        role="status"
        aria-label={title}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="head-title">
            {title} · {entries.length}
          </span>
          {onClear && clearLabel ? (
            <button data-part="clear" type="button" onClick={onClear}>
              {clearLabel}
            </button>
          ) : null}
        </div>
        {shown.map((entry) => (
          <div
            key={entry.title}
            data-part="entry"
            data-tone={entry.tone ?? "info"}
          >
            <span data-part="dot" aria-hidden="true" />
            <span data-part="text">
              <span data-part="title">{entry.title}</span>
              {entry.description ? (
                <span data-part="description">{entry.description}</span>
              ) : null}
            </span>
            {entry.time ? <span data-part="time">{entry.time}</span> : null}
          </div>
        ))}
        {rest > 0 ? (
          <div data-part="more">{moreLabel.replace("{n}", String(rest))}</div>
        ) : null}
      </div>
    </>
  )
}
