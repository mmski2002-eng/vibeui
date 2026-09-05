import type { ComponentProps, CSSProperties } from "react"

export type Email001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  to?: string
  subject?: string
  /** Тело письма построчно — каждая строка въезжает своей задержкой. */
  body?: string[]
  sendLabel?: string
  accent?: string
  /** Строки печатаются по очереди и мигает курсор после последней. */
  typing?: boolean
  /** Окно разворачивается масштабом и прозрачностью при появлении. */
  unfold?: boolean
  /** Пульсирующее кольцо вокруг кнопки отправки. */
  pulse?: boolean
}

// Идея: окно письма — поля «Кому» и «Тема», ниже тело письма. Само окно
// разворачивается (scale+fade) при появлении, следом строки тела печатаются
// одна за другой (stagger rise), после последней строки мигает курсор —
// эффект «письмо ещё дописывается». Кнопка отправки держит лёгкое
// пульсирующее кольцо, зовущее нажать.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="email-001"]){
--vibeui-email-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-email-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-email-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-email-001-muted:color-mix(in oklab,var(--vibeui-email-001-fg) 58%,transparent);
--vibeui-email-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-email-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-email-001-accent-fg:oklch(from var(--vibeui-email-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-email-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="email-001"]{color-scheme:dark}
[data-vibeui-block="email-001"]{
display:block;box-sizing:border-box;width:100%;max-width:21rem;margin:0;
color:var(--vibeui-email-001-fg);font-family:var(--vibeui-email-001-font);
}
[data-vibeui-block="email-001"] *{box-sizing:border-box}
[data-vibeui-block="email-001"] [data-part="frame"]{
transform-origin:center;
animation:vibeui-email-001-unfold 0.55s cubic-bezier(0.22,1,0.36,1) both;
}
[data-vibeui-block="email-001"][data-unfold="false"] [data-part="frame"]{animation:none}
[data-vibeui-block="email-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-email-001-border);
background:var(--vibeui-email-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
overflow:hidden;
}
[data-vibeui-block="email-001"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.625rem 0.75rem;border-bottom:1px solid var(--vibeui-email-001-border);
background:var(--vibeui-email-001-frame);
}
[data-vibeui-block="email-001"] [data-part="head"] svg{width:0.8125rem;height:0.8125rem;flex:none}
[data-vibeui-block="email-001"] [data-part="htitle"]{
margin:0;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;color:var(--vibeui-email-001-fg);
}
[data-vibeui-block="email-001"] [data-part="head"] svg:first-child{color:var(--vibeui-email-001-accent)}
[data-vibeui-block="email-001"] [data-part="close"]{color:var(--vibeui-email-001-muted)}
[data-vibeui-block="email-001"] [data-part="fields"]{
display:flex;flex-direction:column;padding:0 0.75rem;
}
[data-vibeui-block="email-001"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0;
border-bottom:1px solid var(--vibeui-email-001-border);
}
[data-vibeui-block="email-001"] [data-part="field"]:last-child{border-bottom:none}
[data-vibeui-block="email-001"] [data-part="flabel"]{
flex:none;width:3.25rem;font-size:0.625rem;font-weight:600;
color:var(--vibeui-email-001-muted);text-transform:uppercase;letter-spacing:0.02em;
}
[data-vibeui-block="email-001"] [data-part="fvalue"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;color:var(--vibeui-email-001-fg);
}
[data-vibeui-block="email-001"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.375rem;padding:0.75rem;
font-size:0.75rem;line-height:1.55;color:var(--vibeui-email-001-fg);
}
[data-vibeui-block="email-001"] [data-part="line"]{
animation:vibeui-email-001-rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
[data-vibeui-block="email-001"] [data-part="line"]:nth-child(1){animation-delay:0.1s}
[data-vibeui-block="email-001"] [data-part="line"]:nth-child(2){animation-delay:0.42s}
[data-vibeui-block="email-001"] [data-part="line"]:nth-child(3){animation-delay:0.74s}
[data-vibeui-block="email-001"] [data-part="line"]:nth-child(4){animation-delay:1.06s}
[data-vibeui-block="email-001"] [data-part="line"]:nth-child(5){animation-delay:1.38s}
[data-vibeui-block="email-001"][data-typing="false"] [data-part="line"]{animation:none;opacity:1}
[data-vibeui-block="email-001"] [data-part="caret"]{
display:inline-block;width:0.1rem;height:0.8em;margin-left:0.125rem;
vertical-align:-0.1em;background:var(--vibeui-email-001-accent);
animation:vibeui-email-001-blink 1s steps(1) infinite;
}
[data-vibeui-block="email-001"][data-typing="false"] [data-part="caret"]{display:none}
[data-vibeui-block="email-001"] [data-part="footer"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.625rem 0.75rem;border-top:1px solid var(--vibeui-email-001-border);
}
[data-vibeui-block="email-001"] [data-part="tools"]{color:var(--vibeui-email-001-muted)}
[data-vibeui-block="email-001"] [data-part="tools"] svg{width:0.9375rem;height:0.9375rem}
[data-vibeui-block="email-001"] [data-part="send"]{
position:relative;display:inline-flex;align-items:center;gap:0.375rem;
padding:0.375rem 0.75rem;border-radius:9999px;border:none;
background:var(--vibeui-email-001-accent);color:var(--vibeui-email-001-accent-fg);
font-size:0.6875rem;font-weight:650;font-family:inherit;
}
[data-vibeui-block="email-001"] [data-part="send"] svg{width:0.75rem;height:0.75rem}
[data-vibeui-block="email-001"] [data-part="ring"]{
position:absolute;inset:0;border-radius:inherit;
background:var(--vibeui-email-001-accent);z-index:-1;
animation:vibeui-email-001-ping 1.8s ease-out infinite;
}
[data-vibeui-block="email-001"][data-pulse="false"] [data-part="ring"]{display:none}
@keyframes vibeui-email-001-unfold{from{opacity:0;transform:scale(0.94) translateY(6px)}to{opacity:1;transform:none}}
@keyframes vibeui-email-001-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes vibeui-email-001-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes vibeui-email-001-ping{0%{transform:scale(1);opacity:0.45}100%{transform:scale(1.35);opacity:0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="email-001"] [data-part="frame"]{animation:none}
[data-vibeui-block="email-001"] [data-part="line"]{animation:none;opacity:1}
[data-vibeui-block="email-001"] [data-part="caret"]{animation:none;opacity:1}
[data-vibeui-block="email-001"] [data-part="ring"]{animation:none;opacity:0}
}
`

const PENCIL_ICON = (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
)

const CLOSE_ICON = (
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

const PAPERCLIP_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21.44 11.05 12.25 20.2a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

const SEND_ICON = (
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
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4Z" />
  </svg>
)

const DEFAULT_BODY = [
  "Привет! Обновил композицию по последним правкам.",
  "Приложил файлы, гляньте до пятницы.",
  "Спасибо!",
]

/**
 * Окно письма с полями «Кому»/«Тема» и телом. Окно разворачивается при
 * появлении, строки тела печатаются построчно, курсор мигает в конце,
 * кнопка отправки держит пульсирующее кольцо. Один файл, ноль зависимостей.
 */
export function Email001({
  to = "design-team@vibeui.dev",
  subject = "Правки макета для ревью",
  body = DEFAULT_BODY,
  sendLabel = "Отправить",
  accent,
  typing = true,
  unfold = true,
  pulse = true,
  className,
  style,
  ...props
}: Email001Props) {
  const palette = {
    ...(accent ? { "--vibeui-email-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-email-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="email-001"
        data-slot="email-compose"
        data-unfold={unfold ? undefined : "false"}
        data-typing={typing ? undefined : "false"}
        data-pulse={pulse ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="card">
            <div data-part="head">
              {PENCIL_ICON}
              <p data-part="htitle">Новое сообщение</p>
              <span data-part="close">{CLOSE_ICON}</span>
            </div>
            <div data-part="fields">
              <div data-part="field">
                <span data-part="flabel">Кому</span>
                <span data-part="fvalue">{to}</span>
              </div>
              <div data-part="field">
                <span data-part="flabel">Тема</span>
                <span data-part="fvalue">{subject}</span>
              </div>
            </div>
            <div data-part="body">
              {body.map((line, index) => {
                const last = index === body.length - 1

                return (
                  <span data-part="line" key={line}>
                    {line}
                    {last ? <span data-part="caret" aria-hidden="true" /> : null}
                  </span>
                )
              })}
            </div>
            <div data-part="footer">
              <span data-part="tools" aria-hidden="true">
                {PAPERCLIP_ICON}
              </span>
              <span data-part="send">
                <span data-part="ring" aria-hidden="true" />
                {SEND_ICON}
                {sendLabel}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
