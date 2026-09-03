import type { ComponentProps, CSSProperties } from "react"

export type Button040Props = ComponentProps<"button"> & {
  /** Вторая строка под подписью: условие, срок, цена. */
  hint?: string
  /** Раскладка: подпись по центру или подпись слева, стрелка справа. */
  align?: "center" | "between"
  accent?: string
}

// Идея компонента: кнопка во всю ширину колонки. Проблема таких кнопок —
// пустота посередине, поэтому здесь две раскладки: центрированная для
// коротких подписей и разнесённая, где подпись с уточнением прижата влево,
// а стрелка — вправо. Ширину задаёт родитель, кнопка её только занимает.
const STYLES = `
:where([data-vibeui-block="button-040"]){
--vibeui-button-040-accent:light-dark(oklch(0.48 0.15 258),oklch(0.62 0.17 258));
--vibeui-button-040-fg:light-dark(oklch(0.99 0.01 258),oklch(0.98 0.012 258));
--vibeui-button-040-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-040"]{color-scheme:dark}
[data-vibeui-block="button-040"]{
appearance:none;border:0;cursor:pointer;box-sizing:border-box;
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:26rem;min-height:3.25rem;
padding:0.625rem 1.125rem;border-radius:0.875rem;
background:var(--vibeui-button-040-accent);color:var(--vibeui-button-040-fg);
font-family:var(--vibeui-button-040-font);font-size:0.9375rem;font-weight:650;line-height:1.25;
text-align:left;
transition:filter .16s ease,transform .12s ease;
}
[data-vibeui-block="button-040"][data-align="center"]{justify-content:center;text-align:center}
[data-vibeui-block="button-040"][data-align="between"]{justify-content:space-between}
[data-vibeui-block="button-040"]:hover:not(:disabled){filter:brightness(1.07)}
[data-vibeui-block="button-040"]:active:not(:disabled){transform:scale(.995)}
[data-vibeui-block="button-040"]:focus-visible{outline:2px solid var(--vibeui-button-040-accent);outline-offset:3px}
[data-vibeui-block="button-040"]:disabled{cursor:not-allowed;opacity:.55}
[data-vibeui-block="button-040"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0}
[data-vibeui-block="button-040"] [data-part="hint"]{
font-size:0.75rem;font-weight:500;opacity:.78;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="button-040"] [data-part="arrow"]{position:relative;flex:none;width:1rem;height:1rem}
[data-vibeui-block="button-040"] [data-part="arrow"]::before{
content:"";position:absolute;left:0;top:50%;width:0.875rem;height:1.75px;
margin-top:-0.875px;background:currentColor;border-radius:1px;
}
[data-vibeui-block="button-040"] [data-part="arrow"]::after{
content:"";position:absolute;right:0.125rem;top:50%;width:0.4375rem;height:0.4375rem;
box-sizing:border-box;border:1.75px solid currentColor;border-left:0;border-bottom:0;
transform:translateY(-50%) rotate(45deg);
}
[data-vibeui-block="button-040"] [data-part="arrow"]{transition:transform .18s cubic-bezier(0.16,1,0.3,1)}
[data-vibeui-block="button-040"]:hover:not(:disabled) [data-part="arrow"]{transform:translateX(3px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-040"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка во всю ширину колонки с двумя раскладками и второй строкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button040({
  hint = "Бесплатно 14 дней, карта не нужна",
  align = "between",
  accent,
  type = "button",
  className,
  style,
  children = "Оформить подписку",
  ...props
}: Button040Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-040-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-040" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-040"
        data-align={align}
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="label">{children}</span>
          {hint ? <span data-part="hint">{hint}</span> : null}
        </span>
        {align === "between" ? (
          <span data-part="arrow" aria-hidden="true" />
        ) : null}
      </button>
    </>
  )
}
