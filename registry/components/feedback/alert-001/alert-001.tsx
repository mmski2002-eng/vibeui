import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Alert001Tone = "info" | "success" | "warning" | "danger"

export type Alert001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  tone?: Alert001Tone
  title?: string
  description?: string
  /** Действие справа: ссылка «Подробнее», кнопка «Повторить». */
  action?: ReactNode
}

// Идея компонента: тон несёт полоса слева и значок, а не заливка во всю
// ширину. Уведомление остаётся частью страницы, а не куском чужого интерфейса,
// и три сообщения подряд не превращают экран в светофор.
const STYLES = `
:where([data-vibeui-block="alert-001"]){
--vibeui-alert-001-fg:oklch(0.26 0.016 265);
--vibeui-alert-001-muted:oklch(0.48 0.014 265);
--vibeui-alert-001-bg:oklch(0.985 0.002 265);
--vibeui-alert-001-border:oklch(0.9 0.006 265);
--vibeui-alert-001-tone:oklch(0.58 0.18 262);
--vibeui-alert-001-radius:0.75rem;
--vibeui-alert-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="alert-001"]{
position:relative;display:flex;align-items:flex-start;gap:0.75rem;
width:100%;box-sizing:border-box;overflow:hidden;
padding:0.875rem 1rem 0.875rem 1.125rem;
border:1px solid var(--vibeui-alert-001-border);
border-radius:var(--vibeui-alert-001-radius);
background:var(--vibeui-alert-001-bg);color:var(--vibeui-alert-001-fg);
font-family:var(--vibeui-alert-001-font);
}
/* Полоса слева — единственное место, где виден тон. */
[data-vibeui-block="alert-001"]::before{
content:"";position:absolute;left:0;top:0;bottom:0;width:3px;
background:var(--vibeui-alert-001-tone);
}
[data-vibeui-block="alert-001"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.25rem;height:1.25rem;margin-top:0.0625rem;
border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-alert-001-tone) 18%,transparent);
color:var(--vibeui-alert-001-tone);
font-size:0.75rem;font-weight:700;line-height:1;
}
[data-vibeui-block="alert-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-001"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.4}
[data-vibeui-block="alert-001"] [data-part="description"]{font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-001-muted)}
[data-vibeui-block="alert-001"] [data-part="action"]{
display:flex;align-items:center;flex:none;gap:0.5rem;
font-size:0.8125rem;font-weight:500;color:var(--vibeui-alert-001-tone);
}
[data-vibeui-block="alert-001"][data-tone="success"]{--vibeui-alert-001-tone:oklch(0.58 0.15 152)}
[data-vibeui-block="alert-001"][data-tone="warning"]{--vibeui-alert-001-tone:oklch(0.68 0.15 70)}
[data-vibeui-block="alert-001"][data-tone="danger"]{--vibeui-alert-001-tone:oklch(0.56 0.19 25)}
/* В узкой колонке действие уходит под текст, а не сжимает его. */
@container (max-width: 26rem){
[data-vibeui-block="alert-001"]{flex-wrap:wrap}
[data-vibeui-block="alert-001"] [data-part="action"]{width:100%;padding-left:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-001"] *{animation:none!important;transition:none!important}}
`

const GLYPHS: Record<Alert001Tone, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  danger: "!",
}

/**
 * Встроенное уведомление: тон несёт полоса слева, а не заливка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert001({
  tone = "warning",
  title = "Домен ещё не подключён",
  description = "Сайт открывается по временному адресу. Подключите домен, чтобы им можно было делиться.",
  action = "Подключить",
  className,
  style,
  ...props
}: Alert001Props) {
  return (
    <>
      <style href="vibeui-alert-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-001"
        data-tone={tone}
        role={tone === "danger" ? "alert" : "status"}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="icon" aria-hidden="true">
          {GLYPHS[tone]}
        </span>
        <span data-part="text">
          {title ? <span data-part="title">{title}</span> : null}
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        {action ? <span data-part="action">{action}</span> : null}
      </div>
    </>
  )
}
