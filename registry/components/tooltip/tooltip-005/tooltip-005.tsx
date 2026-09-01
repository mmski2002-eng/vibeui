import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip005Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  label?: string
  /** Длинный текст: подсказка рассчитана на два-четыре предложения. */
  tip?: string
  /** Предельная ширина подсказки. Строка длиннее 60 знаков не читается. */
  tipWidth?: string
}

// Идея компонента: подсказка для длинного объяснения. Ширина ограничена, текст
// выключен по левому краю и переносится по словам с балансировкой строк —
// однострочная подсказка на 400 пикселей нечитаема, а обрезать текст нельзя.
const STYLES = `
:where([data-vibeui-block="tooltip-005"]){
--vibeui-tooltip-005-bg:oklch(0.25 0.014 265);
--vibeui-tooltip-005-fg:oklch(0.96 0.002 265);
--vibeui-tooltip-005-accent:oklch(0.6 0.16 265);
--vibeui-tooltip-005-width:17rem;
--vibeui-tooltip-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-005"]{
position:relative;display:inline-flex;font-family:var(--vibeui-tooltip-005-font);
}
/* Своя светлая подложка: на тёмной витрине тёмный текст иначе пропадает. */
[data-vibeui-block="tooltip-005"] [data-part="trigger"]{
appearance:none;cursor:help;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid oklch(0.9 0.006 265);
background:oklch(1 0 0);color:oklch(0.3 0.014 265);
font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="tooltip-005"] [data-part="trigger"]::after{
content:"?";display:inline-flex;align-items:center;justify-content:center;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
background:oklch(0.9 0.008 265);color:oklch(0.42 0.014 265);
font-size:0.6875rem;font-weight:800;
}
[data-vibeui-block="tooltip-005"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-tooltip-005-accent);outline-offset:2px}
/* Ширина ограничена переменной, текст переносится по словам и балансируется. */
[data-vibeui-block="tooltip-005"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5625rem);left:50%;z-index:20;
width:var(--vibeui-tooltip-005-width);max-width:calc(100vw - 2rem);
box-sizing:border-box;padding:0.5625rem 0.6875rem;border-radius:0.625rem;
background:var(--vibeui-tooltip-005-bg);color:var(--vibeui-tooltip-005-fg);
font-size:0.75rem;line-height:1.5;text-align:left;
white-space:normal;overflow-wrap:anywhere;text-wrap:pretty;hyphens:auto;
box-shadow:0 18px 38px -26px oklch(0.15 0.02 265 / 70%);
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .14s ease,transform .14s ease;
}
[data-vibeui-block="tooltip-005"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:var(--vibeui-tooltip-005-bg);transform:rotate(45deg);
}
[data-vibeui-block="tooltip-005"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-005"]:focus-within [data-part="tip"]{opacity:1;transform:translate(-50%,0)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Подсказка с длинным текстом: ограниченная ширина и перенос по словам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip005({
  label = "Как считается остаток",
  tip = "Остаток — это оплаченный объём минус израсходованный за текущий период. Перерасход не блокирует работу: он переносится в следующий счёт отдельной строкой.",
  tipWidth = "17rem",
  className,
  style,
  ...props
}: Tooltip005Props) {
  const palette = {
    "--vibeui-tooltip-005-width": tipWidth,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-005" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="tooltip-005"
        className={className}
        style={palette}
      >
        <button
          data-part="trigger"
          type="button"
          aria-describedby="vibeui-tooltip-005-tip"
        >
          {label}
        </button>
        <span data-part="tip" role="tooltip" id="vibeui-tooltip-005-tip">
          {tip}
        </span>
      </span>
    </>
  )
}
