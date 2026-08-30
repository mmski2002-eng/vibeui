import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button020Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  price?: string
  hint?: string
  accent?: string
}

// Идея компонента: кнопка нижней панели телефона. Она во всю ширину, высотой
// 3rem и с отступом на домашнюю полоску через safe-area — иначе на iPhone
// нижний край кнопки уходит под системную черту. Цена стоит в самой кнопке:
// на этом шаге решение принимают по сумме, а не по слову «оплатить».
const STYLES = `
:where([data-vibeui-block="button-020"]){
--vibeui-button-020-accent:oklch(0.55 0.17 265);
--vibeui-button-020-fg:oklch(0.99 0.01 265);
--vibeui-button-020-muted:oklch(0.55 0.014 265);
--vibeui-button-020-bg:oklch(1 0 0);
--vibeui-button-020-border:oklch(0.92 0.005 265);
--vibeui-button-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-020"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;
padding:0.75rem 0.875rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-button-020-border);
background:var(--vibeui-button-020-bg);
font-family:var(--vibeui-button-020-font);
}
[data-vibeui-block="button-020"] button{
appearance:none;border:0;cursor:pointer;
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
width:100%;height:3rem;padding:0 1rem;box-sizing:border-box;
border-radius:0.75rem;
background:var(--vibeui-button-020-accent);color:var(--vibeui-button-020-fg);
font:inherit;font-size:0.9375rem;font-weight:650;line-height:1;
}
[data-vibeui-block="button-020"] button:hover{filter:brightness(0.96)}
[data-vibeui-block="button-020"] button:focus-visible{outline:2px solid var(--vibeui-button-020-accent);outline-offset:2px}
/* Цена в самой кнопке: решение принимают по сумме, а не по глаголу. */
[data-vibeui-block="button-020"] [data-part="price"]{font-variant-numeric:tabular-nums}
[data-vibeui-block="button-020"] [data-part="hint"]{
text-align:center;font-size:0.75rem;line-height:1.35;color:var(--vibeui-button-020-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-020"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка нижней панели телефона: во всю ширину, с ценой и safe-area.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button020({
  label = "Оформить заказ",
  price = "4 900 ₽",
  hint = "Доставка завтра, оплата при получении",
  accent,
  className,
  style,
  ...props
}: Button020Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="button-020"
        className={className}
        style={palette}
      >
        <button type="button">
          {label}
          {price ? <span data-part="price">{price}</span> : null}
        </button>
        {hint ? <p data-part="hint">{hint}</p> : null}
      </div>
    </>
  )
}
