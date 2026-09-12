import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup046Period = {
  /** Независимый от языка ключ пресета: его же ждёт форма. */
  id: string
  label: string
  range: string
}

export type Buttongroup046Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  periods?: Buttongroup046Period[]
  customLabel?: string
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — заливки нет, сегменты ложатся на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пресеты периода, которые не заставляют считать в уме.
// Под названием каждого сегмента стоит конкретный диапазон дат — «Последние
// 7 дней» и «6–12 мая» отвечают на разные вопросы, и без второй строки
// пользователь идёт сверять с календарём. Даты набраны табличными цифрами,
// сегменты равной ширины (grid 1fr), поэтому строки диапазонов выстраиваются
// в общую линию. Последний сегмент — «Свой период»: у него нет диапазона,
// и вместо него стоит значок календаря, а не пустая строка.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-046"]){
--vibeui-buttongroup-046-surface:transparent;
--vibeui-buttongroup-046-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-046-muted:color-mix(in oklab,var(--vibeui-buttongroup-046-fg) 68%,transparent);
--vibeui-buttongroup-046-border:light-dark(oklch(0.89 0 265),oklch(0.41 0 265));
--vibeui-buttongroup-046-hover:light-dark(oklch(0.985 0 265),oklch(0.32 0 265));
--vibeui-buttongroup-046-on:light-dark(oklch(0.965 0 265),oklch(0.33 0 0));
--vibeui-buttongroup-046-accent:light-dark(oklch(0.275 0 0),oklch(0.912 0 0));
--vibeui-buttongroup-046-radius:0.75rem;
--vibeui-buttongroup-046-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-046"]{color-scheme:dark}
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
[data-vibeui-block="buttongroup-046"] [data-part="segment"]:hover{background:var(--vibeui-buttongroup-046-hover)}
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
  { id: "week", label: "Неделя", range: "6–12 мая" },
  { id: "month", label: "Месяц", range: "13.04 – 12.05" },
  { id: "quarter", label: "Квартал", range: "13.02 – 12.05" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Пресеты периода, каждый со своим конкретным диапазоном дат под названием.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup046({
  periods = DEFAULT_PERIODS,
  customLabel = "Свой период",
  defaultValue = "month",
  label = "Период отчёта",
  name = "buttongroup-046",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup046Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-046-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-046-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-046" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-046"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
          {periods.map((period) => (
            <label key={period.id} data-part="segment">
              <input
                type="radio"
                name={name}
                value={period.id}
                defaultChecked={period.id === defaultValue}
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
              defaultChecked={defaultValue === "custom"}
            />
            <span data-part="name">{customLabel}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16v14H4zM4 10h16M9 3v4M15 3v4" />
            </svg>
          </label>
        </form>
      </fieldset>
    </>
  )
}
