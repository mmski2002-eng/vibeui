import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup046Period = {
  label: string
  range: string
}

export type Buttongroup046Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  periods?: Buttongroup046Period[]
  customLabel?: string
  defaultValue?: string
  label?: string
  name?: string
  accent?: string
}

// Идея компонента: пресеты периода, которые не заставляют считать в уме.
// Под названием каждого сегмента стоит конкретный диапазон дат — «Последние
// 7 дней» и «6–12 мая» отвечают на разные вопросы, и без второй строки
// пользователь идёт сверять с календарём. Даты набраны табличными цифрами,
// сегменты равной ширины (grid 1fr), поэтому строки диапазонов выстраиваются
// в общую линию. Последний сегмент — «Свой период»: у него нет диапазона,
// и вместо него стоит значок календаря, а не пустая строка.
const STYLES = `
:where([data-vibeui-block="buttongroup-046"]){
--vibeui-buttongroup-046-surface:oklch(1 0 0);
--vibeui-buttongroup-046-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-046-muted:oklch(0.58 0.014 265);
--vibeui-buttongroup-046-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-046-on:oklch(0.965 0.03 265);
--vibeui-buttongroup-046-accent:oklch(0.5 0.16 265);
--vibeui-buttongroup-046-radius:0.75rem;
--vibeui-buttongroup-046-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-046"]{
box-sizing:border-box;display:block;width:100%;max-width:30rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-046-font);
}
[data-vibeui-block="buttongroup-046"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-046"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-046"] [data-part="track"]{
display:grid;grid-auto-flow:column;grid-auto-columns:1fr;isolation:isolate;
}
[data-vibeui-block="buttongroup-046"] [data-part="segment"]{
position:relative;z-index:0;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.1875rem;
min-height:3.375rem;padding:0.5rem 0.375rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-046-border);
background:var(--vibeui-buttongroup-046-surface);
cursor:pointer;text-align:center;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-046"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-046-radius);
border-end-start-radius:var(--vibeui-buttongroup-046-radius);
}
[data-vibeui-block="buttongroup-046"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-046-radius);
border-end-end-radius:var(--vibeui-buttongroup-046-radius);
}
[data-vibeui-block="buttongroup-046"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-046"] [data-part="name"]{
color:var(--vibeui-buttongroup-046-fg);
font-size:0.75rem;font-weight:650;line-height:1.2;
}
[data-vibeui-block="buttongroup-046"] [data-part="range"]{
color:var(--vibeui-buttongroup-046-muted);
font-size:0.6875rem;line-height:1.2;
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="buttongroup-046"] svg{
width:0.875rem;height:0.875rem;
stroke:var(--vibeui-buttongroup-046-muted);fill:none;stroke-width:1.8;
stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-046"] [data-part="segment"]:hover{background:oklch(0.985 0.003 265)}
[data-vibeui-block="buttongroup-046"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-046-on);
border-color:var(--vibeui-buttongroup-046-accent);
}
[data-vibeui-block="buttongroup-046"] [data-part="segment"]:has(input:checked) [data-part="name"]{
color:var(--vibeui-buttongroup-046-accent);
}
[data-vibeui-block="buttongroup-046"] [data-part="segment"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-046-accent);outline-offset:1px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-046"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PERIODS: Buttongroup046Period[] = [
  { label: "Неделя", range: "6–12 мая" },
  { label: "Месяц", range: "13.04 – 12.05" },
  { label: "Квартал", range: "13.02 – 12.05" },
]

/**
 * Пресеты периода, каждый со своим конкретным диапазоном дат под названием.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup046({
  periods = DEFAULT_PERIODS,
  customLabel = "Свой период",
  defaultValue = "Месяц",
  label = "Период отчёта",
  name = "buttongroup-046",
  accent,
  className,
  style,
  ...props
}: Buttongroup046Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-046-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-046" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-046"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {periods.map((period) => (
            <label key={period.label} data-part="segment">
              <input
                type="radio"
                name={name}
                value={period.label}
                defaultChecked={period.label === defaultValue}
              />
              <span data-part="name">{period.label}</span>
              <span data-part="range">{period.range}</span>
            </label>
          ))}
          <label data-part="segment">
            <input
              type="radio"
              name={name}
              value="custom"
              defaultChecked={customLabel === defaultValue}
            />
            <span data-part="name">{customLabel}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16v14H4zM4 10h16M9 3v4M15 3v4" />
            </svg>
          </label>
        </div>
      </fieldset>
    </>
  )
}
