import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card020Props = Omit<
  ComponentPropsWithoutRef<"article">,
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
  accent?: string
}

// Идея компонента: системное уведомление, у которого важность и время —
// не украшение, а содержание. Время лежит в <time datetime>, поэтому
// «12 мин назад» остаётся точной датой для машин. Важность несут рельс,
// значок и слово: цветной полоски одной мало на монохромном экране.
const STYLES = `
:where([data-vibeui-block="card-020"]){
--vibeui-card-020-bg:oklch(1 0 0);
--vibeui-card-020-fg:oklch(0.22 0.015 265);
--vibeui-card-020-muted:oklch(0.55 0.013 265);
--vibeui-card-020-border:oklch(0.91 0.006 265);
--vibeui-card-020-tone:oklch(0.56 0.15 255);
--vibeui-card-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
[data-vibeui-block="card-020"][data-severity="success"]{--vibeui-card-020-tone:oklch(0.56 0.15 152)}
[data-vibeui-block="card-020"][data-severity="warning"]{--vibeui-card-020-tone:oklch(0.68 0.15 75)}
[data-vibeui-block="card-020"][data-severity="error"]{--vibeui-card-020-tone:oklch(0.57 0.19 27)}
[data-vibeui-block="card-020"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.625rem;height:1.625rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-card-020-tone) 14%,oklch(1 0 0));
color:color-mix(in oklab,var(--vibeui-card-020-tone) 85%,oklch(0.2 0.02 265));
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
color:color-mix(in oklab,var(--vibeui-card-020-tone) 78%,oklch(0.2 0.02 265));
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
background:oklch(0.95 0.005 265);color:var(--vibeui-card-020-fg);
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

const SEVERITY_TEXT = {
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
  accent,
  className,
  style,
  ...props
}: Card020Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-020-tone": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-020" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
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
              <span data-part="sr">{SEVERITY_TEXT[severity]}. </span>
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
