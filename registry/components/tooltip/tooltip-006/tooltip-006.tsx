import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  tip?: string
  /** Подписи трёх кнопок: у края, по центру и снова у края. */
  labels?: string[]
}

// Идея компонента: подсказка, которая не вылезает за край. У крайних кнопок
// она прижимается к своей стороне, а стрелка съезжает к триггеру — поэтому
// связь подсказки с кнопкой не теряется и обрезки нет ни справа, ни слева.
const STYLES = `
:where([data-vibeui-block="tooltip-006"]){
--vibeui-tooltip-006-bg:oklch(1 0 0);
--vibeui-tooltip-006-fg:oklch(0.25 0.014 265);
--vibeui-tooltip-006-muted:oklch(0.55 0.014 265);
--vibeui-tooltip-006-border:oklch(0.9 0.006 265);
--vibeui-tooltip-006-tip:oklch(0.24 0.014 265);
--vibeui-tooltip-006-accent:oklch(0.57 0.17 265);
--vibeui-tooltip-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-006"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;
padding:1.5rem 1rem 1.125rem;
border:1px solid var(--vibeui-tooltip-006-border);border-radius:1rem;
background:var(--vibeui-tooltip-006-bg);color:var(--vibeui-tooltip-006-fg);
font-family:var(--vibeui-tooltip-006-font);
}
[data-vibeui-block="tooltip-006"] [data-part="row"]{display:flex;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="tooltip-006"] [data-part="item"]{position:relative;display:inline-flex}
[data-vibeui-block="tooltip-006"] [data-part="button"]{
appearance:none;cursor:pointer;
height:2.125rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-006-border);
background:oklch(0.98 0.003 265);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:620;white-space:nowrap;
}
[data-vibeui-block="tooltip-006"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-tooltip-006-accent);outline-offset:2px}
[data-vibeui-block="tooltip-006"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);z-index:20;
width:max-content;max-width:12rem;
padding:0.375rem 0.5625rem;border-radius:0.5rem;
background:var(--vibeui-tooltip-006-tip);color:oklch(0.98 0.002 265);
font-size:0.75rem;line-height:1.4;
pointer-events:none;opacity:0;translate:0 0.25rem;
transition:opacity .13s ease,translate .13s ease;
}
[data-vibeui-block="tooltip-006"] [data-part="tip"]::after{
content:"";position:absolute;bottom:-0.1875rem;width:0.5rem;height:0.5rem;
background:inherit;transform:rotate(45deg);
}
/* Переворот у края: подсказка прижата к своей стороне, стрелка едет к кнопке. */
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="start"] [data-part="tip"]{left:0}
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="start"] [data-part="tip"]::after{left:1rem}
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="center"] [data-part="tip"]{left:50%;margin-left:-6rem;width:12rem;text-align:center}
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="center"] [data-part="tip"]::after{left:50%;margin-left:-0.25rem}
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="end"] [data-part="tip"]{right:0;text-align:right}
[data-vibeui-block="tooltip-006"] [data-part="item"][data-align="end"] [data-part="tip"]::after{right:1rem}
[data-vibeui-block="tooltip-006"] [data-part="item"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-006"] [data-part="item"]:focus-within [data-part="tip"]{opacity:1;translate:0 0}
[data-vibeui-block="tooltip-006"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-tooltip-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-006"] *{animation:none!important;transition:none!important}}
`

const ALIGNMENTS = ["start", "center", "end"] as const
const DEFAULT_LABELS = ["У левого края", "По центру", "У правого края"]

/**
 * Подсказка со стрелкой, которая переворачивается у края области.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip006({
  tip = "Экспорт в CSV",
  labels = DEFAULT_LABELS,
  className,
  style,
  ...props
}: Tooltip006Props) {
  return (
    <>
      <style href="vibeui-tooltip-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tooltip-006"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="row">
          {labels.slice(0, 3).map((label, index) => (
            <span
              data-part="item"
              data-align={ALIGNMENTS[index] ?? "center"}
              key={label}
            >
              <button
                data-part="button"
                type="button"
                aria-describedby={`vibeui-tooltip-006-${index}`}
              >
                {label}
              </button>
              <span
                data-part="tip"
                role="tooltip"
                id={`vibeui-tooltip-006-${index}`}
              >
                {tip}
              </span>
            </span>
          ))}
        </div>
        <p data-part="note">
          Наведите на крайние кнопки: подсказка прижимается к своей стороне, а
          стрелка съезжает к кнопке — за границу области ничего не выходит.
        </p>
      </div>
    </>
  )
}
