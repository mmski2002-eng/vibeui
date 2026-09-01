import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip002Props = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  /** Текст, который показывают обе подсказки: разница только в механике. */
  tip?: string
  nativeLabel?: string
  customLabel?: string
}

// Идея компонента: наглядное сравнение. Слева кнопка с атрибутом title —
// подсказка появляется через секунду с лишним, в системном стиле, без стрелки
// и не читается с клавиатуры. Справа своя: мгновенная, со стрелкой, по фокусу.
const STYLES = `
:where([data-vibeui-block="tooltip-002"]){
--vibeui-tooltip-002-bg:oklch(1 0 0);
--vibeui-tooltip-002-fg:oklch(0.24 0.014 265);
--vibeui-tooltip-002-muted:oklch(0.55 0.014 265);
--vibeui-tooltip-002-border:oklch(0.9 0.006 265);
--vibeui-tooltip-002-tip:oklch(0.26 0.014 265);
--vibeui-tooltip-002-accent:oklch(0.57 0.17 265);
--vibeui-tooltip-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-002"]{
display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;
padding:1.125rem;
border:1px solid var(--vibeui-tooltip-002-border);border-radius:1rem;
background:var(--vibeui-tooltip-002-bg);color:var(--vibeui-tooltip-002-fg);
font-family:var(--vibeui-tooltip-002-font);
}
[data-vibeui-block="tooltip-002"] [data-part="cell"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
padding:1.25rem 0.75rem 0.875rem;box-sizing:border-box;
border:1px dashed var(--vibeui-tooltip-002-border);border-radius:0.875rem;
text-align:center;
}
[data-vibeui-block="tooltip-002"] [data-part="caption"]{
margin:0;font-size:0.6875rem;line-height:1.4;letter-spacing:0.03em;
text-transform:uppercase;color:var(--vibeui-tooltip-002-muted);
}
[data-vibeui-block="tooltip-002"] [data-part="button"]{
appearance:none;cursor:pointer;
height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-002-border);
background:oklch(0.98 0.003 265);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:620;
}
[data-vibeui-block="tooltip-002"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-tooltip-002-accent);outline-offset:2px}
/* Своя подсказка: мгновенная, со стрелкой, открывается и по фокусу. */
[data-vibeui-block="tooltip-002"] [data-part="own"]{position:relative;display:inline-flex}
[data-vibeui-block="tooltip-002"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);left:50%;z-index:20;
width:max-content;max-width:11rem;
padding:0.375rem 0.5625rem;border-radius:0.4375rem;
background:var(--vibeui-tooltip-002-tip);color:oklch(0.98 0.002 265);
font-size:0.75rem;line-height:1.4;
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .12s ease,transform .12s ease;
}
[data-vibeui-block="tooltip-002"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-002"] [data-part="own"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-002"] [data-part="own"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
[data-vibeui-block="tooltip-002"] [data-part="note"]{
grid-column:1 / -1;margin:0;
font-size:0.75rem;line-height:1.5;color:var(--vibeui-tooltip-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Сравнение нативного title и собственной подсказки на одном экране.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip002({
  tip = "Скопировать ссылку",
  nativeLabel = "Нативный title",
  customLabel = "Своя подсказка",
  className,
  style,
  ...props
}: Tooltip002Props) {
  return (
    <>
      <style href="vibeui-tooltip-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tooltip-002"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="cell">
          <button data-part="button" type="button" title={tip}>
            {nativeLabel}
          </button>
          <p data-part="caption">задержка ~1 с, стиль системы</p>
        </div>
        <div data-part="cell">
          <span data-part="own">
            <button
              data-part="button"
              type="button"
              aria-describedby="vibeui-tooltip-002-tip"
            >
              {customLabel}
            </button>
            <span data-part="tip" role="tooltip" id="vibeui-tooltip-002-tip">
              {tip}
            </span>
          </span>
          <p data-part="caption">сразу, со стрелкой, по фокусу</p>
        </div>
        <p data-part="note">
          Нативная подсказка не появляется по Tab и не читается на телефоне.
          Своя открывается и по наведению, и по фокусу — и выглядит одинаково во
          всех системах.
        </p>
      </div>
    </>
  )
}
