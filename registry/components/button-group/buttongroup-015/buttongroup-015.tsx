import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup015Option = {
  label: string
  count: number
}

export type Buttongroup015Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  options?: Buttongroup015Option[]
  defaultValue?: string
  label?: string
  unit?: string
  name?: string
  /** Пусто — подложки нет, сегменты лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: фильтр, который сразу отвечает «сколько там». Счётчик
// живёт внутри сегмента отдельной пилюлей: у неё табличные цифры и
// фиксированная минимальная ширина, поэтому обновление 9 → 128 не съезжает
// раскладку. Число сопровождается спрятанным словом («записей»), иначе
// вслух сегмент звучит как «Новые 12» без объяснения, что это за 12.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-015"]){
--vibeui-buttongroup-015-surface:transparent;
--vibeui-buttongroup-015-fg:light-dark(oklch(0.26 0.016 265),oklch(0.94 0.006 265));
--vibeui-buttongroup-015-muted:color-mix(in oklab,var(--vibeui-buttongroup-015-fg) 68%,transparent);
--vibeui-buttongroup-015-border:light-dark(oklch(0.89 0.008 265),oklch(0.37 0.012 265));
--vibeui-buttongroup-015-badge:light-dark(oklch(0.95 0.006 265),oklch(0.33 0.012 265));
--vibeui-buttongroup-015-accent:light-dark(oklch(0.5 0.15 165),oklch(0.74 0.13 165));
--vibeui-buttongroup-015-on:light-dark(oklch(0.96 0.04 165),oklch(0.29 0.045 165));
--vibeui-buttongroup-015-on-accent:light-dark(oklch(0.99 0.004 165),oklch(0.19 0.03 165));
--vibeui-buttongroup-015-radius:0.625rem;
--vibeui-buttongroup-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-015"]{color-scheme:dark}
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
height:2.25rem;padding:0 0.75rem;margin-inline-start:-1px;
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
color:var(--vibeui-buttongroup-015-on-accent);
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
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Сегментированный фильтр со счётчиком в каждом сегменте.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup015({
  options = DEFAULT_OPTIONS,
  defaultValue = "Новые",
  label = "Фильтр заявок",
  unit = "заявок",
  name = "buttongroup-015",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup015Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-015-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-015" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-015"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
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
        </form>
      </fieldset>
    </>
  )
}
