import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup027Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  compactLabel?: string
  regularLabel?: string
  roomyLabel?: string
  defaultValue?: string
  label?: string
  name?: string
  accent?: string
}

// Идея компонента: переключатель плотности, который показывает результат
// на месте. Под сцепкой лежат три строки-образца, и высота их ячеек берётся
// из переменной --vibeui-buttongroup-027-row; выбранный radio меняет эту
// переменную на корне через :has, поэтому образец перестраивается без единой
// строки JS. Значок каждого сегмента — те же три полосы с тем же просветом,
// что и в образце: подпись, образец и значок говорят об одном.
const STYLES = `
:where([data-vibeui-block="buttongroup-027"]){
--vibeui-buttongroup-027-surface:oklch(1 0 0);
--vibeui-buttongroup-027-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-027-muted:oklch(0.57 0.014 265);
--vibeui-buttongroup-027-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-027-on:oklch(0.96 0.03 215);
--vibeui-buttongroup-027-accent:oklch(0.48 0.13 215);
--vibeui-buttongroup-027-radius:0.625rem;
--vibeui-buttongroup-027-row:1.75rem;
--vibeui-buttongroup-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-027"]{
box-sizing:border-box;display:block;width:100%;max-width:22rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-027-font);
}
[data-vibeui-block="buttongroup-027"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-027"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-027"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]{
position:relative;z-index:0;flex:1 1 0;min-width:0;
display:inline-flex;align-items:center;justify-content:center;gap:0.375rem;
height:2.375rem;padding:0 0.5rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-027-border);
background:var(--vibeui-buttongroup-027-surface);
color:var(--vibeui-buttongroup-027-muted);
font-size:0.75rem;font-weight:650;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-027-radius);
border-end-start-radius:var(--vibeui-buttongroup-027-radius);
}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-027-radius);
border-end-end-radius:var(--vibeui-buttongroup-027-radius);
}
[data-vibeui-block="buttongroup-027"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-027"] [data-part="glyph"]{
display:flex;flex-direction:column;justify-content:center;
width:0.9375rem;height:0.9375rem;flex:none;
}
[data-vibeui-block="buttongroup-027"] [data-part="glyph"] i{
display:block;height:2px;border-radius:1px;background:currentColor;
}
[data-vibeui-block="buttongroup-027"] [data-density="compact"] i + i{margin-top:1px}
[data-vibeui-block="buttongroup-027"] [data-density="regular"] i + i{margin-top:3px}
[data-vibeui-block="buttongroup-027"] [data-density="roomy"] i + i{margin-top:5px}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-027-fg)}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-027-on);
border-color:var(--vibeui-buttongroup-027-accent);
color:var(--vibeui-buttongroup-027-accent);
}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-027-accent);outline-offset:1px;
}
/* Выбор меняет переменную на корне — образец перестраивается сам. */
[data-vibeui-block="buttongroup-027"]:has([data-part="segment"]:nth-of-type(1) input:checked){--vibeui-buttongroup-027-row:1.375rem}
[data-vibeui-block="buttongroup-027"]:has([data-part="segment"]:nth-of-type(2) input:checked){--vibeui-buttongroup-027-row:1.875rem}
[data-vibeui-block="buttongroup-027"]:has([data-part="segment"]:nth-of-type(3) input:checked){--vibeui-buttongroup-027-row:2.5rem}
[data-vibeui-block="buttongroup-027"] [data-part="sample"]{
margin-top:0.625rem;padding:0 0.75rem;
border:1px solid var(--vibeui-buttongroup-027-border);
border-radius:var(--vibeui-buttongroup-027-radius);
background:var(--vibeui-buttongroup-027-surface);
}
[data-vibeui-block="buttongroup-027"] [data-part="line"]{
display:flex;align-items:center;gap:0.5rem;
height:var(--vibeui-buttongroup-027-row);
color:var(--vibeui-buttongroup-027-muted);
font-size:0.75rem;line-height:1;
transition:height .2s ease;
}
[data-vibeui-block="buttongroup-027"] [data-part="line"] + [data-part="line"]{
border-top:1px solid oklch(0.94 0.005 265);
}
[data-vibeui-block="buttongroup-027"] [data-part="line"] span:first-child{
flex:1 1 auto;color:var(--vibeui-buttongroup-027-fg);font-weight:600;
}
[data-vibeui-block="buttongroup-027"] [data-part="line"] span:last-child{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-027"] *{animation:none!important;transition:none!important}}
`

const SAMPLE = [
  ["Договор № 118", "12.04"],
  ["Акт сверки", "09.04"],
  ["Счёт на оплату", "02.04"],
]

/**
 * Плотность таблицы с живым образцом строк под сцепкой, без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup027({
  compactLabel = "Плотно",
  regularLabel = "Обычно",
  roomyLabel = "Свободно",
  defaultValue = "regular",
  label = "Плотность таблицы",
  name = "buttongroup-027",
  accent,
  className,
  style,
  ...props
}: Buttongroup027Props) {
  const options = [
    { id: "compact", label: compactLabel },
    { id: "regular", label: regularLabel },
    { id: "roomy", label: roomyLabel },
  ]

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-027-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-027" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-027"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {options.map((option) => (
            <label key={option.id} data-part="segment">
              <input
                type="radio"
                name={name}
                value={option.id}
                defaultChecked={option.id === defaultValue}
              />
              <span
                data-part="glyph"
                data-density={option.id}
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
              </span>
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <div data-part="sample" aria-hidden="true">
          {SAMPLE.map(([title, date]) => (
            <div key={title} data-part="line">
              <span>{title}</span>
              <span>{date}</span>
            </div>
          ))}
        </div>
      </fieldset>
    </>
  )
}
