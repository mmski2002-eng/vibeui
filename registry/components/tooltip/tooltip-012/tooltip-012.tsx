import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip012Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  /** Заголовок первой строки: короткое имя термина или поля. */
  heading?: string
  /** Вторая строка: развёрнутое пояснение в одно предложение. */
  detail?: string
}

// Идея компонента: круглая иконка-вопрос без подписи рядом. Подсказка внутри
// всегда держит две строки — жирный заголовок и обычное пояснение под ним,
// а не один сплошной абзац, как в подсказке с длинным текстом.
const STYLES = `
:where([data-vibeui-block="tooltip-012"]){
--vibeui-tooltip-012-bg:oklch(0.24 0.014 265);
--vibeui-tooltip-012-fg:oklch(0.97 0.002 265);
--vibeui-tooltip-012-muted:oklch(0.78 0.006 265);
--vibeui-tooltip-012-mark:oklch(0.55 0.014 265);
--vibeui-tooltip-012-accent:oklch(0.6 0.16 265);
--vibeui-tooltip-012-width:13.5rem;
--vibeui-tooltip-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-012"]{
position:relative;display:inline-flex;font-family:var(--vibeui-tooltip-012-font);
}
[data-vibeui-block="tooltip-012"] [data-part="trigger"]{
appearance:none;cursor:help;padding:0;
display:inline-flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:9999px;
border:1px solid oklch(0.82 0.008 265);background:oklch(0.95 0.004 265);
color:var(--vibeui-tooltip-012-mark);font:inherit;font-size:0.6875rem;font-weight:800;
}
[data-vibeui-block="tooltip-012"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-tooltip-012-accent);outline-offset:2px}
/* Ширина фиксирована узко, поэтому пояснение занимает вторую строку само. */
[data-vibeui-block="tooltip-012"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5625rem);left:50%;z-index:20;
display:flex;flex-direction:column;gap:0.1875rem;
width:var(--vibeui-tooltip-012-width);box-sizing:border-box;
padding:0.5625rem 0.6875rem;border-radius:0.625rem;
background:var(--vibeui-tooltip-012-bg);color:var(--vibeui-tooltip-012-fg);
text-align:left;
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .14s ease,transform .14s ease;
}
[data-vibeui-block="tooltip-012"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-012"] [data-part="heading"]{font-size:0.8125rem;font-weight:700;line-height:1.3}
[data-vibeui-block="tooltip-012"] [data-part="detail"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-tooltip-012-muted)}
[data-vibeui-block="tooltip-012"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-012"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Иконка-вопрос с подсказкой из двух строк: заголовок и пояснение под ним.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip012({
  heading = "Пробный период",
  detail = "14 дней с полным доступом. Карта не требуется, отменить можно в любой момент.",
  className,
  style,
  ...props
}: Tooltip012Props) {
  return (
    <>
      <style href="vibeui-tooltip-012" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="tooltip-012"
        className={className}
        style={style as CSSProperties}
      >
        <button
          data-part="trigger"
          type="button"
          aria-describedby="vibeui-tooltip-012-tip"
        >
          ?
        </button>
        <span data-part="tip" role="tooltip" id="vibeui-tooltip-012-tip">
          <span data-part="heading">{heading}</span>
          <span data-part="detail">{detail}</span>
        </span>
      </span>
    </>
  )
}
