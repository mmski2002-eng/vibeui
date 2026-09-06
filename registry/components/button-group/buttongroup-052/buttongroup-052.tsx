import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup052Option = {
  id: string
  label: string
}

export type Buttongroup052Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  options?: Buttongroup052Option[]
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — заливки нет, сцепка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у выбранного сегмента значок подменяется галочкой.
// Оба значка лежат в разметке в одной ячейке grid, поэтому подмена не двигает
// подпись ни на пиксель — при появлении галочки «сбоку» вся строка ехала бы.
// Переход сделан по opacity и небольшому масштабу: галочка приходит на место
// значка, а не вспыхивает рядом. Приём стоит применять только там, где выбор
// действительно один: галочка — универсальный знак «сделано», и в
// множественном выборе она соврёт.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-052"]){
--vibeui-buttongroup-052-surface:transparent;
--vibeui-buttongroup-052-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-052-muted:color-mix(in oklab,var(--vibeui-buttongroup-052-fg) 68%,transparent);
--vibeui-buttongroup-052-border:light-dark(oklch(0.89 0 265),oklch(0.41 0 265));
--vibeui-buttongroup-052-accent:light-dark(oklch(0.46 0.14 160),oklch(0.79 0.13 160));
--vibeui-buttongroup-052-on:light-dark(oklch(0.96 0.04 160),oklch(0.3 0.05 160));
--vibeui-buttongroup-052-radius:0.625rem;
--vibeui-buttongroup-052-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-052"]{color-scheme:dark}
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
height:2.25rem;padding:0 0.875rem;margin-inline-start:-1px;
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
 * Сегменты, у которых на выбранном значок сменяется галочкой без сдвига подписи.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup052({
  options = DEFAULT_OPTIONS,
  defaultValue = "push",
  label = "Канал уведомлений",
  name = "buttongroup-052",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup052Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-052-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-052-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-052" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-052"
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
        </form>
      </fieldset>
    </>
  )
}
