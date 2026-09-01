import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup008Props = Omit<
  ComponentPropsWithoutRef<"form">,
  "children"
> & {
  name?: string
  label?: string
  action?: string
  hint?: string
  accent?: string
}

// Идея компонента: одна и та же сцепка на телефоне — столбик во всю ширину,
// на широком месте — строка. Раскладка считается от собственной ширины блока
// через container query, а не от ширины окна: тот же компонент в узкой колонке
// сайдбара обязан сложиться так же, как на телефоне. При складывании
// схлопнутая граница переезжает с левой стороны на верхнюю, а скругления —
// с боков на верх и низ; иначе столбик распадается на три отдельные рамки.
const STYLES = `
:where([data-vibeui-block="inputgroup-008"]){
--vibeui-inputgroup-008-surface:oklch(1 0 0);
--vibeui-inputgroup-008-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-008-fg:oklch(0.23 0.014 265);
--vibeui-inputgroup-008-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-008-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-008-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-008-accent:oklch(0.5 0.16 25);
--vibeui-inputgroup-008-radius:0.75rem;
--vibeui-inputgroup-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="inputgroup-008"]{
display:block;margin:0;
width:100%;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-008-surface);
border:1px solid var(--vibeui-inputgroup-008-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-008-font);color:var(--vibeui-inputgroup-008-fg);
}
[data-vibeui-block="inputgroup-008"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-008"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="inputgroup-008"] label{font-size:0.8125rem;font-weight:600}
/* Столбик по умолчанию: схлопнутая граница сверху, скругления по краям
   всей стопки. Так выглядит форма на телефоне. */
[data-vibeui-block="inputgroup-008"] [data-part="group"]{
display:flex;flex-direction:column;
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *{
position:relative;height:2.875rem;width:100%;
border:1px solid var(--vibeui-inputgroup-008-border);
border-radius:0;margin-top:-1px;margin-left:0;
font:inherit;font-size:0.9375rem;color:inherit;
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:first-child{
margin-top:0;
border-radius:var(--vibeui-inputgroup-008-radius) var(--vibeui-inputgroup-008-radius) 0 0;
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:last-child{
border-radius:0 0 var(--vibeui-inputgroup-008-radius) var(--vibeui-inputgroup-008-radius);
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-008-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-008-accent);
}
[data-vibeui-block="inputgroup-008"] input{
padding:0 0.875rem;background:var(--vibeui-inputgroup-008-field);
}
[data-vibeui-block="inputgroup-008"] button{
appearance:none;cursor:pointer;
background:var(--vibeui-inputgroup-008-accent);
border-color:var(--vibeui-inputgroup-008-accent);
color:oklch(1 0 0);font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="inputgroup-008"] button:hover{filter:brightness(1.08)}
[data-vibeui-block="inputgroup-008"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-008-muted);
}
/* Есть место — та же сцепка становится строкой. */
@container (min-width: 30rem){
[data-vibeui-block="inputgroup-008"] [data-part="group"]{flex-direction:row}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *{
width:auto;margin-top:0;margin-left:-1px;
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-008-radius) 0 0 var(--vibeui-inputgroup-008-radius);
}
[data-vibeui-block="inputgroup-008"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-008-radius) var(--vibeui-inputgroup-008-radius) 0;
}
[data-vibeui-block="inputgroup-008"] [data-part="city"]{flex:2 1 0}
[data-vibeui-block="inputgroup-008"] [data-part="zip"]{flex:1 1 0;min-width:7rem}
[data-vibeui-block="inputgroup-008"] button{flex:none;padding:0 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Сцепка полной ширины: столбик на узком месте, строка на широком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup008({
  name = "delivery",
  label = "Куда доставить",
  action = "Рассчитать",
  hint = "Раскладка считается от ширины самого блока: в узкой колонке сцепка складывается так же, как на телефоне.",
  accent,
  className,
  style,
  ...props
}: Inputgroup008Props) {
  const palette = {
    ...(accent ? { "--vibeui-inputgroup-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-008" precedence="medium">
        {STYLES}
      </style>
      <form
        {...props}
        data-vibeui-block="inputgroup-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <label htmlFor={`${name}-city`}>{label}</label>
          <div data-part="group">
            <input
              id={`${name}-city`}
              data-part="city"
              name={`${name}-city`}
              type="text"
              autoComplete="address-level2"
              placeholder="Город"
              aria-describedby={`${name}-hint`}
            />
            <input
              data-part="zip"
              name={`${name}-zip`}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="Индекс"
              aria-label="Почтовый индекс"
            />
            <button type="submit">{action}</button>
          </div>
          <p data-part="hint" id={`${name}-hint`}>
            {hint}
          </p>
        </div>
      </form>
    </>
  )
}
