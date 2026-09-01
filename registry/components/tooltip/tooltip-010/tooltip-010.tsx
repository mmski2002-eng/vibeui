import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Пункты меню: значок, подпись и сочетание клавиш одной строкой. */
  items?: { glyph: string; label: string; shortcut: string }[]
}

// Идея компонента: компактное меню значков, где полная подпись действия и
// его горячая клавиша живут внутри одной подсказки — единым чипом в конце
// строки, а не отдельными раскиданными <kbd>, как в подсказке-справочнике.
const STYLES = `
:where([data-vibeui-block="tooltip-010"]){
--vibeui-tooltip-010-bg:oklch(1 0 0);
--vibeui-tooltip-010-fg:oklch(0.25 0.014 265);
--vibeui-tooltip-010-border:oklch(0.9 0.006 265);
--vibeui-tooltip-010-tip:oklch(0.22 0.014 265);
--vibeui-tooltip-010-chip:oklch(1 0 0 / 16%);
--vibeui-tooltip-010-accent:oklch(0.6 0.16 265);
--vibeui-tooltip-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-010"]{
position:relative;
display:inline-flex;flex-direction:column;gap:0.125rem;
width:100%;max-width:15rem;box-sizing:border-box;
padding:0.375rem;border:1px solid var(--vibeui-tooltip-010-border);border-radius:0.875rem;
background:var(--vibeui-tooltip-010-bg);color:var(--vibeui-tooltip-010-fg);
font-family:var(--vibeui-tooltip-010-font);
}
[data-vibeui-block="tooltip-010"] [data-part="row"]{position:relative;display:flex}
[data-vibeui-block="tooltip-010"] [data-part="button"]{
appearance:none;cursor:pointer;width:100%;
display:flex;align-items:center;gap:0.625rem;
height:2.25rem;padding:0 0.625rem;border-radius:0.625rem;border:none;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;text-align:left;
}
[data-vibeui-block="tooltip-010"] [data-part="button"]:hover{background:oklch(0.96 0.004 265)}
[data-vibeui-block="tooltip-010"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-tooltip-010-accent);outline-offset:-2px}
[data-vibeui-block="tooltip-010"] [data-part="glyph"]{flex:none;width:1.125rem;text-align:center;opacity:0.75}
/* Подсказка выезжает вправо от пункта, чип с клавишей — внутри неё же. */
[data-vibeui-block="tooltip-010"] [data-part="tip"]{
position:absolute;left:calc(100% + 0.5rem);top:50%;z-index:20;
display:flex;align-items:center;gap:0.5rem;width:max-content;
padding:0.375rem 0.4375rem 0.375rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-tooltip-010-tip);color:oklch(0.98 0.002 265);
font-size:0.75rem;line-height:1.4;
pointer-events:none;opacity:0;
transform:translate(-0.25rem,-50%);
transition:opacity .13s ease,transform .13s ease;
}
[data-vibeui-block="tooltip-010"] [data-part="tip"]::before{
content:"";position:absolute;left:-0.1875rem;top:50%;
width:0.5rem;height:0.5rem;margin-top:-0.25rem;
background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-010"] [data-part="row"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-010"] [data-part="row"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(0,-50%);
}
/* Чип сочетания — одна строка целиком, а не клавиша за клавишей. */
[data-vibeui-block="tooltip-010"] [data-part="chip"]{
flex:none;padding:0.09375rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-tooltip-010-chip);
font-family:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
font-size:0.6875rem;font-weight:600;letter-spacing:0.02em;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  { glyph: "↩", label: "Отменить", shortcut: "⌘Z" },
  { glyph: "⧉", label: "Дублировать строку", shortcut: "⌘D" },
  { glyph: "⌦", label: "Удалить выделенное", shortcut: "⌫" },
]

/**
 * Меню значков, где подсказка на пункте несёт и подпись, и чип горячей
 * клавиши в одной строке. Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip010({
  items = DEFAULT_ITEMS,
  className,
  style,
  ...props
}: Tooltip010Props) {
  return (
    <>
      <style href="vibeui-tooltip-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tooltip-010"
        className={className}
        style={style as CSSProperties}
      >
        {items.map((item, index) => {
          const id = `vibeui-tooltip-010-${index}`

          return (
            <span data-part="row" key={item.label}>
              <button data-part="button" type="button" aria-describedby={id}>
                <span data-part="glyph" aria-hidden="true">
                  {item.glyph}
                </span>
                {item.label}
              </button>
              <span data-part="tip" role="tooltip" id={id}>
                <span>Сочетание клавиш</span>
                <span data-part="chip">{item.shortcut}</span>
              </span>
            </span>
          )
        })}
      </div>
    </>
  )
}
