import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup006Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  name?: string
  legend?: string
  unit?: string
  from?: number
  to?: number
  hint?: string
  accent?: string
}

// Идея компонента: два поля «от» и «до» в одной рамке с тире между ними.
// Обёртка — fieldset с legend, потому что это одна величина из двух частей:
// screen reader прочитает «Цена, от» и «Цена, до», а не два безымянных числа.
// Тире — не текст внутри поля, а отдельный неинтерактивный элемент с
// aria-hidden: озвучивать его незачем, а кликать по нему нечего.
const STYLES = `
:where([data-vibeui-block="inputgroup-006"]){
--vibeui-inputgroup-006-surface:oklch(1 0 0);
--vibeui-inputgroup-006-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-006-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-006-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-006-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-006-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-006-accent:oklch(0.52 0.16 55);
--vibeui-inputgroup-006-radius:0.75rem;
--vibeui-inputgroup-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;
margin:0;padding:0.875rem;
background:var(--vibeui-inputgroup-006-surface);
border:1px solid var(--vibeui-inputgroup-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-006-font);color:var(--vibeui-inputgroup-006-fg);
}
[data-vibeui-block="inputgroup-006"] *{box-sizing:border-box}
/* legend во flex-контейнере ведёт себя как отдельный поток: возвращаем его
   в строку, иначе следующий ребёнок обтекает подпись. */
[data-vibeui-block="inputgroup-006"] legend{
float:left;width:100%;padding:0;margin:0 0 0.5rem;
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="inputgroup-006"] legend + *{clear:both}
[data-vibeui-block="inputgroup-006"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-006"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-006-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
background:var(--vibeui-inputgroup-006-field);
}
[data-vibeui-block="inputgroup-006"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-006-radius) 0 0 var(--vibeui-inputgroup-006-radius);
}
[data-vibeui-block="inputgroup-006"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-006-radius) var(--vibeui-inputgroup-006-radius) 0;
}
[data-vibeui-block="inputgroup-006"] [data-part="group"] > *:focus{
z-index:1;outline:2px solid var(--vibeui-inputgroup-006-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-006-accent);
}
[data-vibeui-block="inputgroup-006"] [data-part="cell"]{
flex:1;min-width:0;display:flex;align-items:center;gap:0.375rem;padding:0 0.75rem;
}
[data-vibeui-block="inputgroup-006"] [data-part="cell"] span{
flex:none;font-size:0.75rem;color:var(--vibeui-inputgroup-006-muted);
}
[data-vibeui-block="inputgroup-006"] [data-part="cell"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="inputgroup-006"] [data-part="cell"] input:focus{outline:none}
[data-vibeui-block="inputgroup-006"] [data-part="cell"] input::-webkit-outer-spin-button,
[data-vibeui-block="inputgroup-006"] [data-part="cell"] input::-webkit-inner-spin-button{appearance:none;margin:0}
/* Тире — сама граница между половинами: ширина в ровно один символ. */
[data-vibeui-block="inputgroup-006"] [data-part="dash"]{
flex:none;display:grid;place-items:center;width:1.75rem;
color:var(--vibeui-inputgroup-006-muted);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-006"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Диапазон двумя полями в одной сцепке: «от» и «до» с тире между ними.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup006({
  name = "price",
  legend = "Цена, ₽",
  unit = "₽",
  from = 1500,
  to = 9000,
  hint = "Пустая половина означает «без ограничения» — так фильтр не заставляет придумывать границу.",
  accent,
  className,
  style,
  ...props
}: Inputgroup006Props) {
  const palette = {
    ...(accent ? { "--vibeui-inputgroup-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-006" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="inputgroup-006"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="group">
          <div data-part="cell">
            <span id={`${name}-from-label`}>от</span>
            <input
              name={`${name}-from`}
              type="number"
              inputMode="numeric"
              min={0}
              defaultValue={from}
              placeholder="0"
              aria-labelledby={`${name}-from-label`}
              aria-describedby={`${name}-hint`}
            />
            <span aria-hidden="true">{unit}</span>
          </div>
          <div data-part="dash" aria-hidden="true">
            —
          </div>
          <div data-part="cell">
            <span id={`${name}-to-label`}>до</span>
            <input
              name={`${name}-to`}
              type="number"
              inputMode="numeric"
              min={0}
              defaultValue={to}
              placeholder="∞"
              aria-labelledby={`${name}-to-label`}
              aria-describedby={`${name}-hint`}
            />
            <span aria-hidden="true">{unit}</span>
          </div>
        </div>
        <p data-part="hint" id={`${name}-hint`}>
          {hint}
        </p>
      </fieldset>
    </>
  )
}
