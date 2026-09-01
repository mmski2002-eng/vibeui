import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Tooltip003Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  tip?: string
  /** Клавиши сочетания: каждая рисуется отдельной клавишей. */
  keys?: string[]
  children?: ReactNode
}

// Идея компонента: подсказка, которая заодно учит горячей клавише. Название
// действия и сочетание разведены по краям, клавиши нарисованы как <kbd> —
// поэтому подсказка становится справочником, а не повтором подписи кнопки.
const STYLES = `
:where([data-vibeui-block="tooltip-003"]){
--vibeui-tooltip-003-bg:oklch(0.24 0.014 265);
--vibeui-tooltip-003-fg:oklch(0.97 0.002 265);
--vibeui-tooltip-003-key:oklch(1 0 0 / 14%);
--vibeui-tooltip-003-keyfg:oklch(0.88 0.008 265);
--vibeui-tooltip-003-accent:oklch(0.6 0.16 265);
--vibeui-tooltip-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-003"]{
position:relative;display:inline-flex;font-family:var(--vibeui-tooltip-003-font);
}
[data-vibeui-block="tooltip-003"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid oklch(0.89 0.006 265);
background:oklch(1 0 0);color:oklch(0.26 0.014 265);
font:inherit;font-size:0.8125rem;font-weight:620;
}
[data-vibeui-block="tooltip-003"] [data-part="trigger"]:hover{background:oklch(0.97 0.003 265)}
[data-vibeui-block="tooltip-003"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-tooltip-003-accent);outline-offset:2px}
/* Название и сочетание разведены по краям одной строки. */
[data-vibeui-block="tooltip-003"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);left:50%;z-index:20;
display:flex;align-items:center;gap:0.625rem;width:max-content;
padding:0.375rem 0.4375rem 0.375rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-tooltip-003-bg);color:var(--vibeui-tooltip-003-fg);
font-size:0.75rem;line-height:1.4;
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .13s ease,transform .13s ease;
}
[data-vibeui-block="tooltip-003"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-003"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-003"]:focus-within [data-part="tip"]{opacity:1;transform:translate(-50%,0)}
[data-vibeui-block="tooltip-003"] [data-part="keys"]{display:inline-flex;align-items:center;gap:0.1875rem;flex:none}
[data-vibeui-block="tooltip-003"] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.25rem;height:1.25rem;padding:0 0.3125rem;box-sizing:border-box;
border-radius:0.3125rem;background:var(--vibeui-tooltip-003-key);
color:var(--vibeui-tooltip-003-keyfg);
font-family:inherit;font-size:0.6875rem;font-weight:650;line-height:1;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_KEYS = ["Ctrl", "K"]

/**
 * Подсказка с горячей клавишей: название действия и сочетание в одной строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip003({
  tip = "Открыть поиск",
  keys = DEFAULT_KEYS,
  children,
  className,
  style,
  ...props
}: Tooltip003Props) {
  const spoken = keys.join(" + ")

  return (
    <>
      <style href="vibeui-tooltip-003" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="tooltip-003"
        className={className}
        style={style as CSSProperties}
      >
        {children ?? (
          <button
            data-part="trigger"
            type="button"
            aria-keyshortcuts={keys.join("+")}
            aria-describedby="vibeui-tooltip-003-tip"
          >
            Поиск
          </button>
        )}
        <span data-part="tip" role="tooltip" id="vibeui-tooltip-003-tip">
          <span>{tip}</span>
          <span data-part="keys" aria-label={spoken}>
            {keys.map((key) => (
              <kbd key={key}>{key}</kbd>
            ))}
          </span>
        </span>
      </span>
    </>
  )
}
