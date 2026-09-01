import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip014Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  label?: string
  /** Причина недоступности: показывается вместо обычной подписи действия. */
  reason?: string
}

// Идея компонента: подсказка на визуально отключённой кнопке. Настоящий
// disabled не получает ни наведения, ни фокуса, поэтому кнопка остаётся
// фокусируемой и помечена aria-disabled — а подсказка объясняет, чего не
// хватает, вместо того чтобы кнопка молча ничего не делала.
const STYLES = `
:where([data-vibeui-block="tooltip-014"]){
--vibeui-tooltip-014-bg:oklch(0.24 0.014 265);
--vibeui-tooltip-014-fg:oklch(0.97 0.002 265);
--vibeui-tooltip-014-accent:oklch(0.6 0.16 265);
--vibeui-tooltip-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-014"]{
position:relative;display:inline-flex;font-family:var(--vibeui-tooltip-014-font);
}
/* Не настоящий disabled: кнопка остаётся в фокусе, поведение выключено смыслом. */
[data-vibeui-block="tooltip-014"] [data-part="trigger"]{
appearance:none;cursor:not-allowed;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.375rem;padding:0 0.9375rem;border-radius:0.625rem;
border:1px solid oklch(0.88 0.006 265);
background:oklch(0.94 0.003 265);color:oklch(0.58 0.01 265);
font:inherit;font-size:0.875rem;font-weight:620;
}
[data-vibeui-block="tooltip-014"] [data-part="lock"]{opacity:0.7}
[data-vibeui-block="tooltip-014"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-tooltip-014-accent);outline-offset:2px}
[data-vibeui-block="tooltip-014"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5625rem);left:50%;z-index:20;
max-width:15rem;width:max-content;
padding:0.375rem 0.5625rem;border-radius:0.5rem;
background:var(--vibeui-tooltip-014-bg);color:var(--vibeui-tooltip-014-fg);
font-size:0.75rem;line-height:1.4;text-align:center;
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .14s ease,transform .14s ease;
}
[data-vibeui-block="tooltip-014"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-014"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-014"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-014"] *{animation:none!important;transition:none!important}}
`

/**
 * Подсказка на визуально отключённой кнопке: aria-disabled вместо disabled
 * оставляет кнопку доступной наведению и фокусу. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Tooltip014({
  label = "Опубликовать",
  reason = "Сначала заполните обязательные поля: заголовок и хотя бы одну картинку.",
  className,
  style,
  ...props
}: Tooltip014Props) {
  return (
    <>
      <style href="vibeui-tooltip-014" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="tooltip-014"
        className={className}
        style={style as CSSProperties}
      >
        <button
          data-part="trigger"
          type="button"
          aria-disabled="true"
          aria-describedby="vibeui-tooltip-014-tip"
        >
          {label}
          <span data-part="lock" aria-hidden="true">
            🔒
          </span>
        </button>
        <span data-part="tip" role="tooltip" id="vibeui-tooltip-014-tip">
          {reason}
        </span>
      </span>
    </>
  )
}
