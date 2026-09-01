import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  /** Описание обрезается ровно на двух строках: третья съедает карточку. */
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
  onPrimary?: () => void
  onSecondary?: () => void
}

// Идея компонента: уведомление, которому есть что объяснить. Описание живёт
// ровно в двух строках (-webkit-line-clamp), а действия вынесены на отдельную
// строку под текстом — так они не сжимают заголовок на узком экране.
const STYLES = `
:where([data-vibeui-block="toast-007"]){
--vibeui-toast-007-bg:oklch(1 0 0);
--vibeui-toast-007-fg:oklch(0.23 0.014 265);
--vibeui-toast-007-muted:oklch(0.54 0.014 265);
--vibeui-toast-007-border:oklch(0.9 0.006 265);
--vibeui-toast-007-tone:oklch(0.58 0.15 285);
--vibeui-toast-007-soft:oklch(0.95 0.03 285);
--vibeui-toast-007-radius:1rem;
--vibeui-toast-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-007"]{
display:grid;grid-template-columns:auto 1fr auto;gap:0.25rem 0.75rem;
width:100%;max-width:25rem;box-sizing:border-box;
padding:0.9375rem;
border:1px solid var(--vibeui-toast-007-border);
border-radius:var(--vibeui-toast-007-radius);
background:var(--vibeui-toast-007-bg);color:var(--vibeui-toast-007-fg);
font-family:var(--vibeui-toast-007-font);
box-shadow:0 22px 46px -28px oklch(0.2 0.02 265 / 50%);
}
[data-vibeui-block="toast-007"] [data-part="glyph"]{
grid-row:1 / span 3;flex:none;
display:flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:0.75rem;
background:var(--vibeui-toast-007-soft);color:var(--vibeui-toast-007-tone);
font-size:1rem;line-height:1;
}
[data-vibeui-block="toast-007"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
/* Две строки — потолок: третья превращает уведомление в письмо. */
[data-vibeui-block="toast-007"] [data-part="description"]{
grid-column:2 / span 2;margin:0.1875rem 0 0;
font-size:0.8125rem;line-height:1.45;color:var(--vibeui-toast-007-muted);
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
overflow:hidden;
}
[data-vibeui-block="toast-007"] [data-part="actions"]{
grid-column:2 / span 2;display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.625rem;
}
[data-vibeui-block="toast-007"] [data-part="primary"],
[data-vibeui-block="toast-007"] [data-part="secondary"]{
appearance:none;cursor:pointer;
height:1.9375rem;padding:0 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;font-weight:640;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toast-007"] [data-part="primary"]{border:0;background:var(--vibeui-toast-007-tone);color:oklch(0.99 0.01 285)}
[data-vibeui-block="toast-007"] [data-part="primary"]:hover{background:color-mix(in oklab,var(--vibeui-toast-007-tone) 88%,black)}
[data-vibeui-block="toast-007"] [data-part="secondary"]{
border:1px solid var(--vibeui-toast-007-border);background:transparent;color:var(--vibeui-toast-007-muted);
}
[data-vibeui-block="toast-007"] [data-part="secondary"]:hover{color:var(--vibeui-toast-007-fg);background:oklch(0.96 0.004 265)}
[data-vibeui-block="toast-007"] [data-part="close"]{
appearance:none;cursor:pointer;border:0;background:transparent;
align-self:start;width:1.5rem;height:1.5rem;border-radius:0.375rem;
color:var(--vibeui-toast-007-muted);font:inherit;font-size:1rem;line-height:1;
}
[data-vibeui-block="toast-007"] [data-part="close"]:hover{background:oklch(0.95 0.004 265);color:var(--vibeui-toast-007-fg)}
[data-vibeui-block="toast-007"] [data-part="primary"]:focus-visible,
[data-vibeui-block="toast-007"] [data-part="secondary"]:focus-visible,
[data-vibeui-block="toast-007"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-007-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Уведомление с описанием на две строки и действиями отдельной строкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast007({
  title = "Приглашение в команду",
  description = "Мария Гурова зовёт вас в проект «Каталог». Доступ на запись выдаётся сразу после согласия, отозвать его можно в настройках.",
  primaryLabel = "Принять",
  secondaryLabel = "Позже",
  onPrimary,
  onSecondary,
  className,
  style,
  ...props
}: Toast007Props) {
  return (
    <>
      <style href="vibeui-toast-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-007"
        role="status"
        aria-live="polite"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="glyph" aria-hidden="true">
          ✉
        </span>
        <p data-part="title">{title}</p>
        <button
          data-part="close"
          type="button"
          aria-label="Закрыть уведомление"
        >
          ×
        </button>
        <p data-part="description">{description}</p>
        <div data-part="actions">
          <button data-part="primary" type="button" onClick={onPrimary}>
            {primaryLabel}
          </button>
          {secondaryLabel ? (
            <button data-part="secondary" type="button" onClick={onSecondary}>
              {secondaryLabel}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
