import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button038Props = ComponentPropsWithoutRef<"button"> & {
  /** Ширина кнопки в rem: за неё подпись переносится на вторую строку. */
  width?: number
  accent?: string
}

// Идея компонента: кнопка с длинной подписью, которая честно переносится.
// Обычная кнопка выравнивает содержимое по центру и растёт в строку — здесь
// задана ширина, включён перенос и balance, а значок прибит к первой строке
// через align-items:flex-start и собственную line-height, поэтому он не
// уезжает в вертикальный центр двухстрочного текста.
const STYLES = `
:where([data-vibeui-block="button-038"]){
--vibeui-button-038-bg:oklch(0.95 0.04 150);
--vibeui-button-038-border:oklch(0.85 0.07 150);
--vibeui-button-038-fg:oklch(0.32 0.07 150);
--vibeui-button-038-accent:oklch(0.5 0.13 150);
--vibeui-button-038-width:18rem;
--vibeui-button-038-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-038"]{
appearance:none;cursor:pointer;box-sizing:border-box;text-align:left;
display:inline-flex;align-items:flex-start;gap:0.625rem;
width:100%;max-width:var(--vibeui-button-038-width);
padding:0.75rem 0.875rem;border-radius:0.75rem;
border:1px solid var(--vibeui-button-038-border);
background:var(--vibeui-button-038-bg);color:var(--vibeui-button-038-fg);
font-family:var(--vibeui-button-038-font);font-size:0.875rem;font-weight:600;
/* Перенос и балансировка строк: длинная подпись не рвётся по одному слову. */
line-height:1.35;text-wrap:balance;overflow-wrap:anywhere;hyphens:auto;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-038"]:hover:not(:disabled){
background:color-mix(in oklab,var(--vibeui-button-038-accent) 14%,var(--vibeui-button-038-bg));
border-color:var(--vibeui-button-038-accent);
}
[data-vibeui-block="button-038"]:focus-visible{outline:2px solid var(--vibeui-button-038-accent);outline-offset:2px}
[data-vibeui-block="button-038"]:disabled{cursor:not-allowed;opacity:.5}
/* Значок держится первой строки: высота равна её line-height. */
[data-vibeui-block="button-038"] [data-part="mark"]{
position:relative;flex:none;width:1.125rem;height:calc(0.875rem * 1.35);
}
[data-vibeui-block="button-038"] [data-part="mark"]::before{
content:"";position:absolute;left:0;top:50%;width:1.125rem;height:1.125rem;
margin-top:-0.5625rem;box-sizing:border-box;
border:1.75px solid var(--vibeui-button-038-accent);border-radius:0.3125rem;
}
[data-vibeui-block="button-038"] [data-part="mark"]::after{
content:"";position:absolute;left:0.3125rem;top:50%;width:0.3125rem;height:0.5625rem;
margin-top:-0.375rem;box-sizing:border-box;
border:1.75px solid var(--vibeui-button-038-accent);border-top:0;border-left:0;
transform:rotate(42deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-038"]{transition:none!important}}
`

/**
 * Кнопка с длинной подписью и переносом: значок прибит к первой строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button038({
  width = 18,
  accent,
  type = "button",
  className,
  style,
  children = "Подтвердить перенос встречи на следующую неделю",
  ...props
}: Button038Props) {
  const palette = {
    "--vibeui-button-038-width": `${width}rem`,
    ...(accent ? { "--vibeui-button-038-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-038" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-038"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <span data-part="label">{children}</span>
      </button>
    </>
  )
}
