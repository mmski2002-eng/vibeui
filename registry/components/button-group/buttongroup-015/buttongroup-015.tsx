import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup015Option = {
  label: string
  count: number
}

export type Buttongroup015Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  options?: Buttongroup015Option[]
  defaultValue?: string
  label?: string
  unit?: string
  name?: string
  accent?: string
}

// Идея компонента: фильтр, который сразу отвечает «сколько там». Счётчик
// живёт внутри сегмента отдельной пилюлей: у неё табличные цифры и
// фиксированная минимальная ширина, поэтому обновление 9 → 128 не съезжает
// раскладку. Число сопровождается спрятанным словом («записей»), иначе
// вслух сегмент звучит как «Новые 12» без объяснения, что это за 12.
const STYLES = `
:where([data-vibeui-block="buttongroup-015"]){
--vibeui-buttongroup-015-surface:oklch(1 0 0);
--vibeui-buttongroup-015-fg:oklch(0.26 0.016 265);
--vibeui-buttongroup-015-muted:oklch(0.56 0.014 265);
--vibeui-buttongroup-015-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-015-badge:oklch(0.95 0.006 265);
--vibeui-buttongroup-015-accent:oklch(0.5 0.15 165);
--vibeui-buttongroup-015-on:oklch(0.96 0.04 165);
--vibeui-buttongroup-015-radius:0.625rem;
--vibeui-buttongroup-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-015"]{
box-sizing:border-box;display:inline-block;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-015-font);
}
[data-vibeui-block="buttongroup-015"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-015"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-015"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-015"] [data-part="segment"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.375rem;padding:0 0.75rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-015-border);
background:var(--vibeui-buttongroup-015-surface);
color:var(--vibeui-buttongroup-015-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-015"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-015-radius);
border-end-start-radius:var(--vibeui-buttongroup-015-radius);
}
[data-vibeui-block="buttongroup-015"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-015-radius);
border-end-end-radius:var(--vibeui-buttongroup-015-radius);
}
[data-vibeui-block="buttongroup-015"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-015-fg)}
[data-vibeui-block="buttongroup-015"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
/* Табличные цифры и минимальная ширина: 9 и 128 занимают одно место. */
[data-vibeui-block="buttongroup-015"] [data-part="count"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.5rem;height:1.25rem;padding:0 0.3125rem;
border-radius:9999px;
background:var(--vibeui-buttongroup-015-badge);
color:var(--vibeui-buttongroup-015-fg);
font-size:0.6875rem;font-weight:700;
font-variant-numeric:tabular-nums;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-015"] [data-part="unit"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="buttongroup-015"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-015-on);
border-color:var(--vibeui-buttongroup-015-accent);
color:var(--vibeui-buttongroup-015-accent);
}
[data-vibeui-block="buttongroup-015"] [data-part="segment"]:has(input:checked) [data-part="count"]{
background:var(--vibeui-buttongroup-015-accent);
color:oklch(0.99 0.004 165);
}
[data-vibeui-block="buttongroup-015"] [data-part="segment"]:has(input:focus-visible){
z-index:2;
outline:2px solid var(--vibeui-buttongroup-015-accent);outline-offset:1px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Buttongroup015Option[] = [
  { label: "Все", count: 128 },
  { label: "Новые", count: 12 },
  { label: "В работе", count: 7 },
  { label: "Готово", count: 109 },
]

/**
 * Сегментированный фильтр со счётчиком в каждом сегменте.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup015({
  options = DEFAULT_OPTIONS,
  defaultValue = "Новые",
  label = "Фильтр заявок",
  unit = "заявок",
  name = "buttongroup-015",
  accent,
  className,
  style,
  ...props
}: Buttongroup015Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-015" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-015"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {options.map((option) => (
            <label key={option.label} data-part="segment">
              <input
                type="radio"
                name={name}
                value={option.label}
                defaultChecked={option.label === defaultValue}
              />
              <span>{option.label}</span>
              <span data-part="count">
                {option.count}
                <span data-part="unit"> {unit}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
