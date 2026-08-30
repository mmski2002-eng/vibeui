import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alert016Tone = "info" | "success" | "warning" | "danger"

export type Alert016Entry = {
  tone?: Alert016Tone
  title: string
  description?: string
  time?: string
}

export type Alert016Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  title?: string
  entries?: Alert016Entry[]
  /** Сколько записей показывать: остальные сворачиваются в строку-счётчик. */
  visible?: number
  clearLabel?: string
  onClear?: () => void
}

// Идея компонента: несколько сообщений в одной рамке вместо стопки отдельных
// алертов. Пять карточек подряд — это стена, которую пролистывают; здесь у
// них общая рамка, общий заголовок и одна кнопка «очистить». Лишние записи
// сворачиваются в строку со счётчиком, а не растягивают блок.
const STYLES = `
:where([data-vibeui-block="alert-016"]){
--vibeui-alert-016-fg:oklch(0.22 0.014 265);
--vibeui-alert-016-muted:oklch(0.5 0.014 265);
--vibeui-alert-016-bg:oklch(1 0 0);
--vibeui-alert-016-border:oklch(0.9 0.006 265);
--vibeui-alert-016-tone:oklch(0.58 0.18 262);
--vibeui-alert-016-radius:0.875rem;
--vibeui-alert-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:oklch(0.985 0.002 265);
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
[data-vibeui-block="alert-016"] [data-part="entry"][data-tone="success"]{--vibeui-alert-016-tone:oklch(0.58 0.15 152)}
[data-vibeui-block="alert-016"] [data-part="entry"][data-tone="warning"]{--vibeui-alert-016-tone:oklch(0.68 0.15 70)}
[data-vibeui-block="alert-016"] [data-part="entry"][data-tone="danger"]{--vibeui-alert-016-tone:oklch(0.56 0.19 25)}
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
 * Несколько сообщений в одной рамке: общий заголовок и свёрнутый хвост.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert016({
  title = "Уведомления",
  entries = DEFAULT_ENTRIES,
  visible = 3,
  clearLabel = "Очистить",
  onClear,
  className,
  style,
  ...props
}: Alert016Props) {
  const shown = entries.slice(0, Math.max(1, visible))
  const rest = entries.length - shown.length

  return (
    <>
      <style href="vibeui-alert-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-016"
        role="status"
        aria-label={title}
        className={className}
        style={style as CSSProperties}
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
        {rest > 0 ? <div data-part="more">Ещё {rest} — в журнале</div> : null}
      </div>
    </>
  )
}
