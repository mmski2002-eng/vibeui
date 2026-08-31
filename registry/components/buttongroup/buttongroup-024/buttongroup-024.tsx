import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup024Style = {
  id: string
  glyph: string
  label: string
}

export type Buttongroup024Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  styles?: Buttongroup024Style[]
  defaultValue?: string[]
  label?: string
  name?: string
  accent?: string
}

// Идея компонента: множественный выбор там, где сцепка обычно означает
// «один из». Начертания сочетаются, поэтому внутри лежат checkbox, а не
// radio: браузер сам объявит «флажок, установлен», и снять выбор можно
// повторным нажатием — с radio это было бы невозможно. Каждая буква
// нарисована тем начертанием, которое включает: Ж полужирная, К курсивная,
// П подчёркнутая — образец и есть подпись. Настоящее имя лежит рядом под
// clip-path, потому что одна буква ничего не скажет скринридеру.
const STYLES = `
:where([data-vibeui-block="buttongroup-024"]){
--vibeui-buttongroup-024-surface:oklch(1 0 0);
--vibeui-buttongroup-024-fg:oklch(0.24 0.016 265);
--vibeui-buttongroup-024-muted:oklch(0.55 0.014 265);
--vibeui-buttongroup-024-border:oklch(0.88 0.008 265);
--vibeui-buttongroup-024-accent:oklch(0.28 0.03 265);
--vibeui-buttongroup-024-on-accent:oklch(0.99 0.002 265);
--vibeui-buttongroup-024-radius:0.5rem;
--vibeui-buttongroup-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-024"]{
box-sizing:border-box;display:inline-block;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-024-font);
}
[data-vibeui-block="buttongroup-024"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-024"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-024"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-024"] [data-part="toggle"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-024-border);
background:var(--vibeui-buttongroup-024-surface);
color:var(--vibeui-buttongroup-024-muted);
cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-024"] [data-part="toggle"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-024-radius);
border-end-start-radius:var(--vibeui-buttongroup-024-radius);
}
[data-vibeui-block="buttongroup-024"] [data-part="toggle"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-024-radius);
border-end-end-radius:var(--vibeui-buttongroup-024-radius);
}
[data-vibeui-block="buttongroup-024"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-024"] [data-part="name"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
/* Буква нарисована тем начертанием, которое включает. */
[data-vibeui-block="buttongroup-024"] [data-part="glyph"]{
font-size:0.9375rem;line-height:1;
}
[data-vibeui-block="buttongroup-024"] [data-glyph="bold"]{font-weight:800}
[data-vibeui-block="buttongroup-024"] [data-glyph="italic"]{font-style:italic;font-weight:600}
[data-vibeui-block="buttongroup-024"] [data-glyph="underline"]{
font-weight:600;text-decoration:underline;text-underline-offset:0.1875rem;
}
[data-vibeui-block="buttongroup-024"] [data-glyph="strike"]{font-weight:600;text-decoration:line-through}
[data-vibeui-block="buttongroup-024"] [data-part="toggle"]:hover{color:var(--vibeui-buttongroup-024-fg)}
[data-vibeui-block="buttongroup-024"] [data-part="toggle"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-024-accent);
border-color:var(--vibeui-buttongroup-024-accent);
color:var(--vibeui-buttongroup-024-on-accent);
}
[data-vibeui-block="buttongroup-024"] [data-part="toggle"]:has(input:focus-visible){
z-index:2;
outline:2px solid var(--vibeui-buttongroup-024-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-024"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STYLES: Buttongroup024Style[] = [
  { id: "bold", glyph: "Ж", label: "Полужирный" },
  { id: "italic", glyph: "К", label: "Курсив" },
  { id: "underline", glyph: "П", label: "Подчёркнутый" },
  { id: "strike", glyph: "З", label: "Зачёркнутый" },
]

/**
 * Начертания текста множественным выбором на checkbox: буква и есть образец.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup024({
  styles = DEFAULT_STYLES,
  defaultValue = ["bold"],
  label = "Начертание",
  name = "buttongroup-024",
  accent,
  className,
  style,
  ...props
}: Buttongroup024Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-024-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-024" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-024"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {styles.map((item) => (
            <label key={item.id} data-part="toggle">
              <input
                type="checkbox"
                name={`${name}-${item.id}`}
                value={item.id}
                defaultChecked={defaultValue.includes(item.id)}
              />
              <span data-part="glyph" data-glyph={item.id} aria-hidden="true">
                {item.glyph}
              </span>
              <span data-part="name">{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
