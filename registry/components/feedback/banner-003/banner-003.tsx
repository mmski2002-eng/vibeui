import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Banner003Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  title?: string
  text?: string
  acceptLabel?: string
  /** Отказ равен согласию по весу: тёмный «Принять» против серой ссылки — тёмный паттерн. */
  rejectLabel?: string
  settingsLabel?: string
}

// Идея компонента: согласие на cookie, где отказ — такая же кнопка, как и
// согласие. Обе одного размера и одного веса, разница только в заливке;
// «Настроить» стоит третьим и не притворяется отказом.
const STYLES = `
:where([data-vibeui-block="banner-003"]){
--vibeui-banner-003-bg:oklch(1 0 0);
--vibeui-banner-003-fg:oklch(0.23 0.012 265);
--vibeui-banner-003-muted:oklch(0.52 0.012 265);
--vibeui-banner-003-border:oklch(0.89 0.006 265);
--vibeui-banner-003-accent:oklch(0.28 0.02 265);
--vibeui-banner-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="banner-003"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-banner-003-font);color:var(--vibeui-banner-003-fg);
}
[data-vibeui-block="banner-003"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.875rem;
box-sizing:border-box;padding:1.125rem 1.25rem;
border:1px solid var(--vibeui-banner-003-border);border-radius:1rem;
background:var(--vibeui-banner-003-bg);
box-shadow:0 22px 48px -30px oklch(0.2 0.02 265 / 55%);
}
[data-vibeui-block="banner-003"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="banner-003"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-banner-003-muted);max-width:38rem}
[data-vibeui-block="banner-003"] [data-part="actions"]{display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center}
/* Согласие и отказ равны по размеру: разный вес кнопок — тёмный паттерн. */
[data-vibeui-block="banner-003"] [data-part="accept"],
[data-vibeui-block="banner-003"] [data-part="reject"]{
appearance:none;cursor:pointer;
height:2.125rem;padding:0 1rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="banner-003"] [data-part="accept"]{
border:1px solid var(--vibeui-banner-003-accent);
background:var(--vibeui-banner-003-accent);color:oklch(0.98 0.002 265);
}
[data-vibeui-block="banner-003"] [data-part="reject"]{
border:1px solid var(--vibeui-banner-003-accent);
background:transparent;color:var(--vibeui-banner-003-accent);
}
[data-vibeui-block="banner-003"] [data-part="reject"]:hover{background:oklch(0.95 0.004 265)}
[data-vibeui-block="banner-003"] [data-part="settings"]{
appearance:none;cursor:pointer;border:0;background:transparent;
margin-left:auto;padding:0.25rem 0.375rem;border-radius:0.375rem;
font:inherit;font-size:0.8125rem;color:var(--vibeui-banner-003-muted);
text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="banner-003"] [data-part="settings"]:hover{color:var(--vibeui-banner-003-fg)}
[data-vibeui-block="banner-003"] [data-part="accept"]:focus-visible,
[data-vibeui-block="banner-003"] [data-part="reject"]:focus-visible,
[data-vibeui-block="banner-003"] [data-part="settings"]:focus-visible{outline:2px solid var(--vibeui-banner-003-accent);outline-offset:2px}
@container (max-width: 26rem){
[data-vibeui-block="banner-003"] [data-part="accept"]{flex:1 1 100%}
[data-vibeui-block="banner-003"] [data-part="reject"]{flex:1 1 100%}
[data-vibeui-block="banner-003"] [data-part="settings"]{margin-left:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Согласие на cookie, где отказ равен согласию по весу кнопки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner003({
  title = "Cookie и статистика",
  text = "Нужные для работы файлы уже стоят. Остальные — только для статистики посещений; без них сайт работает так же.",
  acceptLabel = "Принять все",
  rejectLabel = "Только необходимые",
  settingsLabel = "Настроить",
  className,
  style,
  ...props
}: Banner003Props) {
  return (
    <>
      <style href="vibeui-banner-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="banner-003"
        aria-label={title}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <p data-part="text">{text}</p>
          <div data-part="actions">
            <button data-part="accept" type="button">
              {acceptLabel}
            </button>
            <button data-part="reject" type="button">
              {rejectLabel}
            </button>
            {settingsLabel ? (
              <button data-part="settings" type="button">
                {settingsLabel}
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
