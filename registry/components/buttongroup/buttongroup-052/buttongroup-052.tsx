import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup052Option = {
  id: string
  label: string
}

export type Buttongroup052Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  options?: Buttongroup052Option[]
  defaultValue?: string
  label?: string
  name?: string
  accent?: string
}

// Идея компонента: у выбранного сегмента значок подменяется галочкой.
// Оба значка лежат в разметке в одной ячейке grid, поэтому подмена не двигает
// подпись ни на пиксель — при появлении галочки «сбоку» вся строка ехала бы.
// Переход сделан по opacity и небольшому масштабу: галочка приходит на место
// значка, а не вспыхивает рядом. Приём стоит применять только там, где выбор
// действительно один: галочка — универсальный знак «сделано», и в
// множественном выборе она соврёт.
const STYLES = `
:where([data-vibeui-block="buttongroup-052"]){
--vibeui-buttongroup-052-surface:oklch(1 0 0);
--vibeui-buttongroup-052-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-052-muted:oklch(0.57 0.014 265);
--vibeui-buttongroup-052-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-052-accent:oklch(0.46 0.14 160);
--vibeui-buttongroup-052-on:oklch(0.96 0.04 160);
--vibeui-buttongroup-052-radius:0.625rem;
--vibeui-buttongroup-052-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-052"]{
box-sizing:border-box;display:inline-block;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-052-font);
}
[data-vibeui-block="buttongroup-052"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-052"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-052"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-052"] [data-part="segment"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.375rem;padding:0 0.875rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-052-border);
background:var(--vibeui-buttongroup-052-surface);
color:var(--vibeui-buttongroup-052-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-052"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-052-radius);
border-end-start-radius:var(--vibeui-buttongroup-052-radius);
}
[data-vibeui-block="buttongroup-052"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-052-radius);
border-end-end-radius:var(--vibeui-buttongroup-052-radius);
}
[data-vibeui-block="buttongroup-052"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
/* Два значка в одной ячейке grid: подмена не двигает подпись. */
[data-vibeui-block="buttongroup-052"] [data-part="icons"]{
display:grid;place-items:center;width:1.0625rem;height:1.0625rem;flex:none;
}
[data-vibeui-block="buttongroup-052"] [data-part="icons"] svg{
grid-area:1 / 1;width:1.0625rem;height:1.0625rem;
stroke:currentColor;fill:none;stroke-width:1.9;
stroke-linecap:round;stroke-linejoin:round;
transition:opacity .16s ease,scale .16s ease;
}
[data-vibeui-block="buttongroup-052"] [data-icon="check"]{opacity:0;scale:.7}
[data-vibeui-block="buttongroup-052"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-052-fg)}
[data-vibeui-block="buttongroup-052"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-052-on);
border-color:var(--vibeui-buttongroup-052-accent);
color:var(--vibeui-buttongroup-052-accent);
}
[data-vibeui-block="buttongroup-052"] [data-part="segment"]:has(input:checked) [data-icon="base"]{opacity:0;scale:.7}
[data-vibeui-block="buttongroup-052"] [data-part="segment"]:has(input:checked) [data-icon="check"]{opacity:1;scale:1}
[data-vibeui-block="buttongroup-052"] [data-part="segment"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-052-accent);outline-offset:1px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-052"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<string, string> = {
  email: "M3 6h18v12H3zM3 7l9 6 9-6",
  sms: "M4 5h16v10H8l-4 4z",
  push: "M6 16V10a6 6 0 0 1 12 0v6l2 2H4zM10 20a2 2 0 0 0 4 0",
}

const DEFAULT_OPTIONS: Buttongroup052Option[] = [
  { id: "email", label: "Почта" },
  { id: "sms", label: "СМС" },
  { id: "push", label: "Пуш" },
]

/**
 * Сегменты, у которых на выбранном значок сменяется галочкой без сдвига подписи.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup052({
  options = DEFAULT_OPTIONS,
  defaultValue = "push",
  label = "Канал уведомлений",
  name = "buttongroup-052",
  accent,
  className,
  style,
  ...props
}: Buttongroup052Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-052-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-052" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-052"
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
              <span data-part="icons" aria-hidden="true">
                <svg data-icon="base" viewBox="0 0 24 24">
                  <path d={ICONS[option.id] ?? ICONS.email} />
                </svg>
                <svg data-icon="check" viewBox="0 0 24 24">
                  <path d="m5 13 4.5 4.5L19 7" />
                </svg>
              </span>
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
