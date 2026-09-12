import type { ComponentProps, CSSProperties } from "react"

export type Card020Props = Omit<
  ComponentProps<"article">,
  "children" | "title"
> & {
  title?: string
  message?: string
  /** Важность: красит рельс, значок и слово в подписи. */
  severity?: "info" | "success" | "warning" | "error"
  /** Метка времени словами: «12 мин назад». Компонент ничего не пересчитывает. */
  time?: string
  /** Машиночитаемое время для <time datetime>: ISO 8601. */
  dateTime?: string
  actionLabel?: string
  href?: string
  /** Подпись крестика для скринридера. Кнопка видима только на карточке. */
  dismissLabel?: string
  /** Слово важности перед заголовком для скринридера: ключи те же, что у severity. */
  severityText?: Record<string, string>
  /** Пусто — подложки нет, уведомление лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: системное уведомление, у которого важность и время —
// не украшение, а содержание. Время лежит в <time datetime>, поэтому
// «12 мин назад» остаётся точной датой для машин. Важность несут рельс,
// значок и слово: цветной полоски одной мало на монохромном экране.
const STYLES = `
:where([data-vibeui-block="card-020"]){
--vibeui-card-020-bg:transparent;
--vibeui-card-020-surface:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-card-020-ink:light-dark(oklch(0.2 0 265),oklch(0.97 0 265));
--vibeui-card-020-hover:light-dark(oklch(0.95 0 265),oklch(0.33 0 265));
--vibeui-card-020-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-card-020-muted:color-mix(in oklab,var(--vibeui-card-020-fg) 68%,transparent);
--vibeui-card-020-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-020-tone:light-dark(oklch(0.29 0 0),oklch(0.903 0 0));
--vibeui-card-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-020"]{color-scheme:dark}
[data-vibeui-block="card-020"]{
position:relative;display:flex;align-items:flex-start;gap:0.6875rem;
overflow:hidden;width:100%;max-width:25rem;box-sizing:border-box;
padding:0.8125rem 0.875rem 0.875rem 1.125rem;
background:var(--vibeui-card-020-bg);color:var(--vibeui-card-020-fg);
border:1px solid var(--vibeui-card-020-border);border-radius:0.875rem;
font-family:var(--vibeui-card-020-font);
}
/* Рельс слева: важность видно в списке до чтения заголовка. */
[data-vibeui-block="card-020"]::before{
content:"";position:absolute;inset-block:0;inset-inline-start:0;
width:0.25rem;background:var(--vibeui-card-020-tone);
}
[data-vibeui-block="card-020"][data-severity="success"]{--vibeui-card-020-tone:light-dark(oklch(0.56 0.15 152),oklch(0.75 0.14 152))}
[data-vibeui-block="card-020"][data-severity="warning"]{--vibeui-card-020-tone:light-dark(oklch(0.68 0.15 75),oklch(0.81 0.14 75))}
[data-vibeui-block="card-020"][data-severity="error"]{--vibeui-card-020-tone:light-dark(oklch(0.57 0.19 27),oklch(0.73 0.16 27))}
[data-vibeui-block="card-020"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.625rem;height:1.625rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-card-020-tone) 14%,var(--vibeui-card-020-surface));
color:color-mix(in oklab,var(--vibeui-card-020-tone) 85%,var(--vibeui-card-020-ink));
}
[data-vibeui-block="card-020"] [data-part="icon"] svg{width:0.9375rem;height:0.9375rem}
[data-vibeui-block="card-020"] [data-part="body"]{flex:1;min-width:0;display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="card-020"] [data-part="head"]{
display:flex;align-items:baseline;gap:0.5rem;
}
[data-vibeui-block="card-020"] [data-part="title"]{
margin:0;flex:1;min-width:0;font-size:0.875rem;font-weight:660;line-height:1.35;
}
/* Время в <time datetime>: словами для человека, ISO для машины. */
[data-vibeui-block="card-020"] [data-part="time"]{
flex:none;font-size:0.6875rem;white-space:nowrap;color:var(--vibeui-card-020-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-020"] [data-part="message"]{
margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-card-020-muted);
}
[data-vibeui-block="card-020"] [data-part="action"]{
align-self:flex-start;margin-top:0.1875rem;
font-size:0.8125rem;font-weight:650;
color:color-mix(in oklab,var(--vibeui-card-020-tone) 78%,var(--vibeui-card-020-ink));
text-decoration:none;border-radius:0.25rem;
}
[data-vibeui-block="card-020"] [data-part="action"]:hover{text-decoration:underline}
[data-vibeui-block="card-020"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-card-020-tone);outline-offset:2px;
}
[data-vibeui-block="card-020"] [data-part="dismiss"]{
appearance:none;cursor:pointer;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;margin:-0.125rem -0.125rem 0 0;
border:0;border-radius:0.375rem;background:transparent;
color:var(--vibeui-card-020-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="card-020"] [data-part="dismiss"]:hover{
background:var(--vibeui-card-020-hover);color:var(--vibeui-card-020-fg);
}
[data-vibeui-block="card-020"] [data-part="dismiss"]:focus-visible{
outline:2px solid var(--vibeui-card-020-tone);outline-offset:2px;
}
[data-vibeui-block="card-020"] [data-part="dismiss"] svg{width:0.875rem;height:0.875rem}
[data-vibeui-block="card-020"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-020"] *{animation:none!important;transition:none!important}}
`

const SEVERITY_TEXT: Record<string, string> = {
  info: "Сообщение",
  success: "Успешно",
  warning: "Предупреждение",
  error: "Ошибка",
}

const SEVERITY_PATH = {
  info: "M8 7.2v4.3M8 4.6h.01",
  success: "M4.6 8.3 6.9 10.6 11.4 5.6",
  warning: "M8 4.8v3.9M8 11.3h.01",
  error: "M5.4 5.4l5.2 5.2M10.6 5.4l-5.2 5.2",
}

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
 * Карточка уведомления: важность, метка времени в <time> и одно действие.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card020({
  title = "Сборка каталога завершена",
  message = "354 компонента собраны, реестр обновлён. Изменения уже на витрине.",
  severity = "success",
  time = "12 мин назад",
  dateTime = "2026-03-18T09:41:00+03:00",
  actionLabel = "Открыть отчёт",
  href = "#",
  dismissLabel = "Скрыть уведомление",
  severityText = SEVERITY_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Card020Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-020-tone": accent } : null),
    ...(background
      ? {
          "--vibeui-card-020-bg": background,
          "--vibeui-card-020-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-020" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-020"
        data-severity={severity}
        className={className}
        style={palette}
      >
        <span data-part="icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none">
            {severity === "info" || severity === "warning" ? (
              <circle
                cx="8"
                cy="8"
                r="6.2"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            ) : null}
            <path
              d={SEVERITY_PATH[severity]}
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div data-part="body">
          <div data-part="head">
            <h3 data-part="title">
              <span data-part="sr">
                {severityText[severity] ?? SEVERITY_TEXT[severity]}.{" "}
              </span>
              {title}
            </h3>
            {time ? (
              <time data-part="time" dateTime={dateTime}>
                {time}
              </time>
            ) : null}
          </div>
          {message ? <p data-part="message">{message}</p> : null}
          {actionLabel && href ? (
            <a data-part="action" href={href}>
              {actionLabel}
            </a>
          ) : null}
        </div>
        <button data-part="dismiss" type="button" aria-label={dismissLabel}>
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M3.5 3.5l7 7M10.5 3.5l-7 7"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </article>
    </>
  )
}
