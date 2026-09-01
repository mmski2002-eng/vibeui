import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup031Status = {
  id: string
  label: string
  color: string
  shape: "dot" | "ring" | "square"
}

export type Buttongroup031Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  statuses?: Buttongroup031Status[]
  defaultValue?: string[]
  label?: string
  name?: string
  accent?: string
}

// Идея компонента: фильтр статусов, где метка несёт два признака сразу —
// цвет и форму. Кружок, кольцо и квадрат различаются при любой форме
// дальтонизма и в чёрно-белой печати, а цвет остаётся быстрым каналом для
// тех, кто его видит. Цвет приходит данными и подставляется инлайновой
// переменной --vibeui-buttongroup-031-mark: это единственный случай, когда
// значение нельзя выразить классом. Выбор множественный, поэтому внутри
// checkbox: статусы складываются, а не заменяют друг друга.
const STYLES = `
:where([data-vibeui-block="buttongroup-031"]){
--vibeui-buttongroup-031-surface:oklch(1 0 0);
--vibeui-buttongroup-031-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-031-muted:oklch(0.57 0.014 265);
--vibeui-buttongroup-031-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-031-accent:oklch(0.45 0.02 265);
--vibeui-buttongroup-031-mark:oklch(0.6 0.02 265);
--vibeui-buttongroup-031-radius:0.625rem;
--vibeui-buttongroup-031-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-031"]{
box-sizing:border-box;display:inline-block;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-031-font);
}
[data-vibeui-block="buttongroup-031"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-031"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-031"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-031"] [data-part="chip"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.8125rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-031-border);
background:var(--vibeui-buttongroup-031-surface);
color:var(--vibeui-buttongroup-031-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-031"] [data-part="chip"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-031-radius);
border-end-start-radius:var(--vibeui-buttongroup-031-radius);
}
[data-vibeui-block="buttongroup-031"] [data-part="chip"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-031-radius);
border-end-end-radius:var(--vibeui-buttongroup-031-radius);
}
[data-vibeui-block="buttongroup-031"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
/* Форма метки — второй, не цветовой признак статуса. */
[data-vibeui-block="buttongroup-031"] [data-part="mark"]{
width:0.625rem;height:0.625rem;flex:none;
background:var(--vibeui-buttongroup-031-mark);
}
[data-vibeui-block="buttongroup-031"] [data-shape="dot"]{border-radius:9999px}
[data-vibeui-block="buttongroup-031"] [data-shape="ring"]{
border-radius:9999px;background:transparent;
box-shadow:inset 0 0 0 2.5px var(--vibeui-buttongroup-031-mark);
}
[data-vibeui-block="buttongroup-031"] [data-shape="square"]{border-radius:0.1875rem}
[data-vibeui-block="buttongroup-031"] [data-part="chip"]:hover{color:var(--vibeui-buttongroup-031-fg)}
[data-vibeui-block="buttongroup-031"] [data-part="chip"]:has(input:checked){
z-index:1;
background:oklch(0.965 0.004 265);
border-color:var(--vibeui-buttongroup-031-accent);
color:var(--vibeui-buttongroup-031-fg);
}
[data-vibeui-block="buttongroup-031"] [data-part="chip"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-031-accent);outline-offset:1px;
}
[data-vibeui-block="buttongroup-031"] [data-part="state"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-031"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATUSES: Buttongroup031Status[] = [
  { id: "new", label: "Новые", color: "oklch(0.6 0.17 250)", shape: "dot" },
  {
    id: "work",
    label: "В работе",
    color: "oklch(0.72 0.15 85)",
    shape: "ring",
  },
  {
    id: "done",
    label: "Готово",
    color: "oklch(0.6 0.14 150)",
    shape: "square",
  },
]

/**
 * Фильтр статусов, где метка различается формой, а не только цветом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup031({
  statuses = DEFAULT_STATUSES,
  defaultValue = ["new", "work"],
  label = "Статусы задач",
  name = "buttongroup-031",
  accent,
  className,
  style,
  ...props
}: Buttongroup031Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-031-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-031" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="buttongroup-031"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {statuses.map((status) => (
            <label key={status.id} data-part="chip">
              <input
                type="checkbox"
                name={`${name}-${status.id}`}
                value={status.id}
                defaultChecked={defaultValue.includes(status.id)}
              />
              <span
                data-part="mark"
                data-shape={status.shape}
                aria-hidden="true"
                style={
                  {
                    "--vibeui-buttongroup-031-mark": status.color,
                  } as CSSProperties
                }
              />
              <span>{status.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
