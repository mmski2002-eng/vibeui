import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup048Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  barsLabel?: string
  lineLabel?: string
  pieLabel?: string
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — заливки нет, сегменты ложатся на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор вида графика, где каждый сегмент — маленький
// график, а не значок. Столбики собраны из трёх div разной высоты, линия —
// polyline в SVG, доля — conic-gradient с круглой маской: три разных приёма,
// потому что три разные фигуры честнее рисовать по-разному, чем сводить к
// одному набору путей. Образцы серые в покое и окрашиваются в акцент у
// выбранного, поэтому активный сегмент читается формой и цветом сразу.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-048"]){
--vibeui-buttongroup-048-surface:transparent;
--vibeui-buttongroup-048-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-048-muted:color-mix(in oklab,var(--vibeui-buttongroup-048-fg) 68%,transparent);
--vibeui-buttongroup-048-glyph:light-dark(oklch(0.78 0 265),oklch(0.56 0 265));
--vibeui-buttongroup-048-rest:light-dark(oklch(0.91 0 265),oklch(0.38 0 265));
--vibeui-buttongroup-048-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-buttongroup-048-on:light-dark(oklch(0.97 0.025 195),oklch(0.31 0.035 39.8));
--vibeui-buttongroup-048-accent:light-dark(oklch(0.5 0.13 39.8),oklch(0.8 0.11 39.8));
--vibeui-buttongroup-048-radius:0.75rem;
--vibeui-buttongroup-048-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-048"]{color-scheme:dark}
[data-vibeui-block="buttongroup-048"]{
box-sizing:border-box;display:block;width:100%;max-width:21rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-048-font);
}
[data-vibeui-block="buttongroup-048"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-048"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-048"] [data-part="track"]{
display:grid;grid-template-columns:repeat(3,1fr);isolation:isolate;
}
[data-vibeui-block="buttongroup-048"] [data-part="segment"]{
position:relative;z-index:0;
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
padding:0.75rem 0.5rem 0.625rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-048-border);
background:var(--vibeui-buttongroup-048-surface);
color:var(--vibeui-buttongroup-048-muted);
font-size:0.75rem;font-weight:650;line-height:1;cursor:pointer;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-048"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-048-radius);
border-end-start-radius:var(--vibeui-buttongroup-048-radius);
}
[data-vibeui-block="buttongroup-048"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-048-radius);
border-end-end-radius:var(--vibeui-buttongroup-048-radius);
}
[data-vibeui-block="buttongroup-048"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
/* Столбики: три полосы разной высоты, выровненные по низу. */
[data-vibeui-block="buttongroup-048"] [data-part="bars"]{
display:flex;align-items:flex-end;gap:3px;height:1.5rem;
}
[data-vibeui-block="buttongroup-048"] [data-part="bars"] i{
width:5px;border-radius:1.5px;background:var(--vibeui-buttongroup-048-glyph);
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-048"] [data-part="bars"] i:nth-child(1){height:45%}
[data-vibeui-block="buttongroup-048"] [data-part="bars"] i:nth-child(2){height:100%}
[data-vibeui-block="buttongroup-048"] [data-part="bars"] i:nth-child(3){height:70%}
[data-vibeui-block="buttongroup-048"] [data-part="line"]{
width:1.75rem;height:1.5rem;
stroke:var(--vibeui-buttongroup-048-glyph);fill:none;stroke-width:2.2;
stroke-linecap:round;stroke-linejoin:round;
transition:stroke .16s ease;
}
/* Доля: conic-gradient с круглой маской вместо дуги в SVG. */
[data-vibeui-block="buttongroup-048"] [data-part="pie"]{
width:1.5rem;height:1.5rem;border-radius:9999px;
background:conic-gradient(var(--vibeui-buttongroup-048-glyph) 0 0.62turn,var(--vibeui-buttongroup-048-rest) 0);
transition:background .16s ease;
}
[data-vibeui-block="buttongroup-048"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-048-fg)}
[data-vibeui-block="buttongroup-048"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-048-on);
border-color:var(--vibeui-buttongroup-048-accent);
color:var(--vibeui-buttongroup-048-accent);
--vibeui-buttongroup-048-glyph:var(--vibeui-buttongroup-048-accent);
}
[data-vibeui-block="buttongroup-048"] [data-part="segment"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-048-accent);outline-offset:1px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-048"] *{animation:none!important;transition:none!important}}
`

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
 * Вид графика: каждый сегмент нарисован как маленький график своего типа.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup048({
  barsLabel = "Столбики",
  lineLabel = "Линия",
  pieLabel = "Доли",
  defaultValue = "bars",
  label = "Вид графика",
  name = "buttongroup-048",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup048Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-048-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-048-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-048" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-048"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
          <label data-part="segment">
            <input
              type="radio"
              name={name}
              value="bars"
              defaultChecked={defaultValue === "bars"}
            />
            <span data-part="bars" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>{barsLabel}</span>
          </label>
          <label data-part="segment">
            <input
              type="radio"
              name={name}
              value="line"
              defaultChecked={defaultValue === "line"}
            />
            <svg data-part="line" viewBox="0 0 28 24" aria-hidden="true">
              <polyline points="2,19 9,11 16,15 26,4" />
            </svg>
            <span>{lineLabel}</span>
          </label>
          <label data-part="segment">
            <input
              type="radio"
              name={name}
              value="pie"
              defaultChecked={defaultValue === "pie"}
            />
            <span data-part="pie" aria-hidden="true" />
            <span>{pieLabel}</span>
          </label>
        </form>
      </fieldset>
    </>
  )
}
