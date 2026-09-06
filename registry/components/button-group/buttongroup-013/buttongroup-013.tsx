import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup013Option = {
  id: string
  label: string
}

export type Buttongroup013Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  options?: Buttongroup013Option[]
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — подложки нет, сегменты лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сегмент, у которого значок и подпись стоят столбиком.
// Значок отвечает за узнавание с расстояния, подпись — за точность, поэтому
// они не конкурируют за одну строку, а делят высоту. Сегменты равной ширины
// (grid с 1fr), иначе «Диаграмма» растянула бы свою колонку вдвое против
// «Лист». Границы схлопнуты, скругления только у крайних, фокусный сегмент
// поднимается z-index — иначе обводку срезает соседняя рамка.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-013"]){
--vibeui-buttongroup-013-surface:transparent;
--vibeui-buttongroup-013-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-013-muted:color-mix(in oklab,var(--vibeui-buttongroup-013-fg) 68%,transparent);
--vibeui-buttongroup-013-border:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-buttongroup-013-on:light-dark(oklch(0.965 0 265),oklch(0.31 0.045 265));
--vibeui-buttongroup-013-accent:light-dark(oklch(0.53 0.17 265),oklch(0.74 0.14 265));
--vibeui-buttongroup-013-radius:0.75rem;
--vibeui-buttongroup-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-013"]{color-scheme:dark}
[data-vibeui-block="buttongroup-013"]{
box-sizing:border-box;display:block;width:100%;max-width:26rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-013-font);
}
[data-vibeui-block="buttongroup-013"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-013"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-013"] [data-part="track"]{
display:grid;grid-auto-flow:column;grid-auto-columns:1fr;isolation:isolate;
}
[data-vibeui-block="buttongroup-013"] [data-part="segment"]{
position:relative;z-index:0;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.375rem;
min-height:4.25rem;padding:0.625rem 0.5rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-013-border);
background:var(--vibeui-buttongroup-013-surface);
color:var(--vibeui-buttongroup-013-muted);
font-size:0.75rem;font-weight:600;line-height:1.2;text-align:center;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-013"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-013-radius);
border-end-start-radius:var(--vibeui-buttongroup-013-radius);
}
[data-vibeui-block="buttongroup-013"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-013-radius);
border-end-end-radius:var(--vibeui-buttongroup-013-radius);
}
[data-vibeui-block="buttongroup-013"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-013-fg)}
[data-vibeui-block="buttongroup-013"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-013"] svg{
width:1.25rem;height:1.25rem;flex:none;
stroke:currentColor;fill:none;stroke-width:1.6;
stroke-linecap:round;stroke-linejoin:round;
}
/* Выбранный сегмент поднят: его акцентная рамка иначе уходит под соседнюю. */
[data-vibeui-block="buttongroup-013"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-013-on);
border-color:var(--vibeui-buttongroup-013-accent);
color:var(--vibeui-buttongroup-013-accent);
}
[data-vibeui-block="buttongroup-013"] [data-part="segment"]:has(input:focus-visible){
z-index:2;
outline:2px solid var(--vibeui-buttongroup-013-accent);outline-offset:1px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-013"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<string, string> = {
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
}

const DEFAULT_OPTIONS: Buttongroup013Option[] = [
  { id: "list", label: "Лист" },
  { id: "grid", label: "Плитка" },
  { id: "chart", label: "Диаграмма" },
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
 * Сегменты со значком над подписью: узнавание значком, точность подписью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup013({
  options = DEFAULT_OPTIONS,
  defaultValue = "grid",
  label = "Представление данных",
  name = "buttongroup-013",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup013Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-013-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-013" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-013"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
          {options.map((option) => (
            <label key={option.id} data-part="segment">
              <input
                type="radio"
                name={name}
                value={option.id}
                defaultChecked={option.id === defaultValue}
              />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={ICONS[option.id] ?? ICONS.list} />
              </svg>
              <span>{option.label}</span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}
