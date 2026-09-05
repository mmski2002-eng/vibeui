import type { ComponentProps, CSSProperties } from "react"

export type Notifications003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  message?: string
  description?: string
  tone?: "success" | "warning" | "info"
  accent?: string
  /** false — скрывает декоративную кнопку закрытия. */
  dismissible?: boolean
  /** false — тост один раз въезжает и остаётся на экране. */
  loop?: boolean
}

// Идея: карточка тоста внутри рамки мини-экрана выезжает справа, задерживается
// на виду и уезжает обратно — бесконечный демонстрационный цикл на чистом
// CSS с несколькими процентными шагами (въезд → пауза → выезд). Цвет иконки
// и левого края берётся из --vibeui-notifications-003-tone, который
// переключается атрибутом data-tone, а проп accent перекрывает его инлайн-
// стилем — тот же приём переопределения, что и в activity-001.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="notifications-003"]){
--vibeui-notifications-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-notifications-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-notifications-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-notifications-003-muted:color-mix(in oklab,var(--vibeui-notifications-003-fg) 60%,transparent);
--vibeui-notifications-003-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-notifications-003-success:light-dark(oklch(0.6 0.16 150),oklch(0.75 0.16 150));
--vibeui-notifications-003-warning:light-dark(oklch(0.68 0.16 75),oklch(0.78 0.15 75));
--vibeui-notifications-003-info:light-dark(oklch(0.55 0.17 250),oklch(0.75 0.15 250));
--vibeui-notifications-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="notifications-003"]{color-scheme:dark}
[data-vibeui-block="notifications-003"]{
display:block;box-sizing:border-box;width:100%;max-width:21rem;margin:0;
color:var(--vibeui-notifications-003-fg);font-family:var(--vibeui-notifications-003-font);
}
[data-vibeui-block="notifications-003"] *{box-sizing:border-box}
[data-vibeui-block="notifications-003"][data-tone="success"]{--vibeui-notifications-003-tone:var(--vibeui-notifications-003-success)}
[data-vibeui-block="notifications-003"][data-tone="warning"]{--vibeui-notifications-003-tone:var(--vibeui-notifications-003-warning)}
[data-vibeui-block="notifications-003"][data-tone="info"]{--vibeui-notifications-003-tone:var(--vibeui-notifications-003-info)}
[data-vibeui-block="notifications-003"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-notifications-003-border);
background:var(--vibeui-notifications-003-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="notifications-003"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-notifications-003-border);
}
[data-vibeui-block="notifications-003"] [data-part="live"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;flex:none;
background:var(--vibeui-notifications-003-tone);
}
[data-vibeui-block="notifications-003"] [data-part="head-title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="notifications-003"] [data-part="stage"]{
position:relative;overflow:hidden;height:7.5rem;margin:0.75rem;
border-radius:0.875rem;border:1px dashed var(--vibeui-notifications-003-border);
background:var(--vibeui-notifications-003-frame);
}
[data-vibeui-block="notifications-003"] [data-part="toast"]{
position:absolute;right:0.75rem;bottom:0.75rem;left:0.75rem;
display:flex;align-items:flex-start;gap:0.625rem;
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-notifications-003-card);
border:1px solid var(--vibeui-notifications-003-border);
border-left:3px solid var(--vibeui-notifications-003-tone);
box-shadow:0 8px 20px -8px oklch(0 0 0 / 0.25);
animation:vibeui-notifications-003-cycle 5s cubic-bezier(.16,1,.3,1) infinite;
}
[data-vibeui-block="notifications-003"][data-loop="false"] [data-part="toast"]{
animation:vibeui-notifications-003-enter 0.55s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="notifications-003"] [data-part="icon"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:9999px;margin-top:0.0625rem;
color:var(--vibeui-notifications-003-tone);
background:color-mix(in oklab,var(--vibeui-notifications-003-tone) 16%,transparent);
}
[data-vibeui-block="notifications-003"] [data-part="icon"] svg{width:0.75rem;height:0.75rem}
[data-vibeui-block="notifications-003"] [data-part="body"]{flex:1;min-width:0}
[data-vibeui-block="notifications-003"] [data-part="message"]{
margin:0;font-size:0.75rem;font-weight:650;line-height:1.4;
}
[data-vibeui-block="notifications-003"] [data-part="desc"]{
margin:0.125rem 0 0;font-size:0.6875rem;line-height:1.4;
color:var(--vibeui-notifications-003-muted);
}
[data-vibeui-block="notifications-003"] [data-part="close"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:0.375rem;
color:var(--vibeui-notifications-003-muted);
}
[data-vibeui-block="notifications-003"] [data-part="close"] svg{width:0.75rem;height:0.75rem}
@keyframes vibeui-notifications-003-cycle{
0%{transform:translateX(120%);opacity:0}
14%{transform:translateX(0);opacity:1}
50%{transform:translateX(0);opacity:1}
64%{transform:translateX(120%);opacity:0}
100%{transform:translateX(120%);opacity:0}
}
@keyframes vibeui-notifications-003-enter{
from{transform:translateX(120%);opacity:0}
to{transform:translateX(0);opacity:1}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="notifications-003"] [data-part="toast"]{animation:none;transform:none;opacity:1}
}
`

const SUCCESS = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const WARNING = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)

const INFO = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

const CLOSE = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const ICONS = {
  success: SUCCESS,
  warning: WARNING,
  info: INFO,
}

/**
 * Тост-уведомление внутри рамки мини-экрана: карточка с иконкой, текстом и
 * кнопкой закрытия выезжает справа, задерживается и уезжает обратно —
 * бесконечный цикл на чистом CSS. Один файл, ноль зависимостей.
 */
export function Notifications003({
  title = "Демо тоста",
  message = "Изменения сохранены",
  description = "Все правки синхронизированы с облаком",
  tone = "success",
  accent,
  dismissible = true,
  loop = true,
  className,
  style,
  ...props
}: Notifications003Props) {
  const palette = {
    ...(accent ? { "--vibeui-notifications-003-tone": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-notifications-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="notifications-003"
        data-slot="notifications-toast"
        data-tone={tone}
        data-loop={loop ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <span data-part="live" aria-hidden="true" />
            <p data-part="head-title">{title}</p>
          </div>
          <div data-part="stage">
            <div data-part="toast">
              <span data-part="icon" aria-hidden="true">
                {ICONS[tone]}
              </span>
              <div data-part="body">
                <p data-part="message">{message}</p>
                {description ? (
                  <p data-part="desc">{description}</p>
                ) : null}
              </div>
              {dismissible ? (
                <span data-part="close" aria-hidden="true">
                  {CLOSE}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
