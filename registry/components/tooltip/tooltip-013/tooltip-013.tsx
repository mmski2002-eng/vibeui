import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  tip?: string
  /** Подписи двух пунктов: верхнего и нижнего в списке. */
  labels?: [string, string]
}

// Идея компонента: подсказка меняет сторону по месту на экране, а не по
// горизонтали, как выравнивание у края области. У пункта возле верхнего края
// она раскрывается вниз, у пункта возле нижнего края — вверх, и стрелка
// каждый раз указывает на свой триггер, а не в одну сторону по умолчанию.
const STYLES = `
:where([data-vibeui-block="tooltip-013"]){
--vibeui-tooltip-013-bg:oklch(1 0 0);
--vibeui-tooltip-013-fg:oklch(0.25 0.014 265);
--vibeui-tooltip-013-muted:oklch(0.55 0.014 265);
--vibeui-tooltip-013-border:oklch(0.9 0.006 265);
--vibeui-tooltip-013-tip:oklch(0.24 0.014 265);
--vibeui-tooltip-013-accent:oklch(0.57 0.17 265);
--vibeui-tooltip-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-013"]{
display:flex;flex-direction:column;justify-content:space-between;gap:1.5rem;
width:100%;max-width:20rem;height:9rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-tooltip-013-border);border-radius:1rem;
background:var(--vibeui-tooltip-013-bg);color:var(--vibeui-tooltip-013-fg);
font-family:var(--vibeui-tooltip-013-font);
}
[data-vibeui-block="tooltip-013"] [data-part="item"]{position:relative;display:inline-flex}
[data-vibeui-block="tooltip-013"] [data-part="button"]{
appearance:none;cursor:pointer;
height:2.125rem;padding:0 0.8125rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-013-border);
background:oklch(0.98 0.003 265);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:620;
}
[data-vibeui-block="tooltip-013"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-tooltip-013-accent);outline-offset:2px}
[data-vibeui-block="tooltip-013"] [data-part="tip"]{
position:absolute;left:50%;z-index:20;
width:max-content;max-width:11rem;
padding:0.375rem 0.5625rem;border-radius:0.5rem;
background:var(--vibeui-tooltip-013-tip);color:oklch(0.98 0.002 265);
font-size:0.75rem;line-height:1.4;text-align:center;
pointer-events:none;opacity:0;
transition:opacity .13s ease,transform .13s ease;
}
[data-vibeui-block="tooltip-013"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;width:0.5rem;height:0.5rem;
margin-left:-0.25rem;background:inherit;transform:rotate(45deg);
}
/* Пункт у верхнего края: подсказке некуда открыться вверх — раскрывается вниз. */
[data-vibeui-block="tooltip-013"] [data-part="item"][data-side="bottom"] [data-part="tip"]{
top:calc(100% + 0.5rem);transform:translate(-50%,-0.25rem);
}
[data-vibeui-block="tooltip-013"] [data-part="item"][data-side="bottom"] [data-part="tip"]::after{top:-0.1875rem}
/* Пункт у нижнего края: раскрывается вверх, чтобы не срезаться о низ области. */
[data-vibeui-block="tooltip-013"] [data-part="item"][data-side="top"] [data-part="tip"]{
bottom:calc(100% + 0.5rem);transform:translate(-50%,0.25rem);
}
[data-vibeui-block="tooltip-013"] [data-part="item"][data-side="top"] [data-part="tip"]::after{bottom:-0.1875rem}
[data-vibeui-block="tooltip-013"] [data-part="item"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-013"] [data-part="item"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
[data-vibeui-block="tooltip-013"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-tooltip-013-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LABELS: [string, string] = ["У верхнего края", "У нижнего края"]

/**
 * Подсказка со стрелкой, которая переключает сторону всплытия по месту на
 * экране: сверху раскрывается вниз, снизу — вверх. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Tooltip013({
  tip = "Добавить в закладки",
  labels = DEFAULT_LABELS,
  className,
  style,
  ...props
}: Tooltip013Props) {
  return (
    <>
      <style href="vibeui-tooltip-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tooltip-013"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="item" data-side="bottom">
          <button
            data-part="button"
            type="button"
            aria-describedby="vibeui-tooltip-013-0"
          >
            {labels[0]}
          </button>
          <span data-part="tip" role="tooltip" id="vibeui-tooltip-013-0">
            {tip}
          </span>
        </span>
        <span data-part="item" data-side="top">
          <button
            data-part="button"
            type="button"
            aria-describedby="vibeui-tooltip-013-1"
          >
            {labels[1]}
          </button>
          <span data-part="tip" role="tooltip" id="vibeui-tooltip-013-1">
            {tip}
          </span>
        </span>
        <p data-part="note">
          Верхний пункт раскрывает подсказку вниз, нижний — вверх: сторону
          задаёт data-side, а не автоматический замер места.
        </p>
      </div>
    </>
  )
}
