import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup045Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  metricLabel?: string
  imperialLabel?: string
  metricValue?: string
  imperialValue?: string
  caption?: string
  /** Доступное имя группы: читается скринридером, визуально скрыто. */
  label?: string
  defaultValue?: "metric" | "imperial"
  name?: string
  /** Пусто — заливки нет, карточка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переключатель единиц, который тут же показывает результат
// пересчёта. Оба значения лежат в разметке, и выбранный radio показывает
// нужное правилом CSS — пересчёт делается на сервере при отдаче, а не в
// браузере, поэтому ни округления, ни локали не расходятся. Значение набрано
// табличными цифрами и имеет фиксированную минимальную ширину: «18 °C» и
// «64 °F» занимают одно место, и группа не дёргается при переключении.
// Сама сцепка компактная, потому что стоит рядом со значением, а не отдельно.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-045"]){
--vibeui-buttongroup-045-surface:transparent;
--vibeui-buttongroup-045-track:light-dark(oklch(0.955 0 265),oklch(0.3 0 265));
--vibeui-buttongroup-045-knob:light-dark(oklch(1 0 0),oklch(0.42 0 265));
--vibeui-buttongroup-045-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-045-muted:color-mix(in oklab,var(--vibeui-buttongroup-045-fg) 68%,transparent);
--vibeui-buttongroup-045-border:light-dark(oklch(0.9 0 265),oklch(0.4 0 265));
--vibeui-buttongroup-045-shadow:light-dark(oklch(0.2 0 265 / 16%),oklch(0 0 0 / 38%));
--vibeui-buttongroup-045-accent:light-dark(oklch(0.5 0.15 230),oklch(0.79 0.13 230));
--vibeui-buttongroup-045-radius:0.4375rem;
--vibeui-buttongroup-045-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-045"]{color-scheme:dark}
[data-vibeui-block="buttongroup-045"]{
box-sizing:border-box;display:inline-flex;align-items:center;gap:0.75rem;
margin:0;padding:0.625rem 0.875rem;
border:1px solid var(--vibeui-buttongroup-045-border);border-radius:0.875rem;
background:var(--vibeui-buttongroup-045-surface);
font-family:var(--vibeui-buttongroup-045-font);
}
[data-vibeui-block="buttongroup-045"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-045"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-045"] [data-part="readout"]{
display:flex;flex-direction:column;gap:0.0625rem;
}
[data-vibeui-block="buttongroup-045"] [data-part="value"]{
min-width:4.25rem;
color:var(--vibeui-buttongroup-045-fg);
font-size:1.25rem;font-weight:700;line-height:1.1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="buttongroup-045"] [data-part="value"] span{display:none}
[data-vibeui-block="buttongroup-045"] [data-part="caption"]{
color:var(--vibeui-buttongroup-045-muted);
font-size:0.6875rem;line-height:1.3;
}
[data-vibeui-block="buttongroup-045"] [data-part="track"]{
display:flex;gap:0.125rem;padding:0.1875rem;
border-radius:calc(var(--vibeui-buttongroup-045-radius) + 0.1875rem);
background:var(--vibeui-buttongroup-045-track);
}
[data-vibeui-block="buttongroup-045"] [data-part="unit"]{
position:relative;
display:inline-flex;align-items:center;justify-content:center;
min-width:2.25rem;height:1.75rem;padding:0 0.375rem;
border-radius:var(--vibeui-buttongroup-045-radius);
color:var(--vibeui-buttongroup-045-muted);
font-size:0.75rem;font-weight:700;line-height:1;cursor:pointer;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-045"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-045"] [data-part="unit"]:has(input:checked){
background:var(--vibeui-buttongroup-045-knob);
color:var(--vibeui-buttongroup-045-accent);
box-shadow:0 1px 2px var(--vibeui-buttongroup-045-shadow);
}
[data-vibeui-block="buttongroup-045"] [data-part="unit"]:has(input:focus-visible){
outline:2px solid var(--vibeui-buttongroup-045-accent);outline-offset:2px;
}
/* Показывается то значение, чья единица выбрана. */
[data-vibeui-block="buttongroup-045"]:has([data-unit="metric"] input:checked) [data-value="metric"]{display:inline}
[data-vibeui-block="buttongroup-045"]:has([data-unit="imperial"] input:checked) [data-value="imperial"]{display:inline}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-045"] *{animation:none!important;transition:none!important}}
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
 * Переключатель единиц, показывающий пересчитанное значение без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup045({
  metricLabel = "°C",
  imperialLabel = "°F",
  metricValue = "18 °C",
  imperialValue = "64 °F",
  caption = "средняя за неделю",
  label = "Единицы измерения",
  defaultValue = "metric",
  name = "buttongroup-045",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup045Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-045-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-045-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-045" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-045"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <p data-part="readout">
          <span data-part="value">
            <span data-value="metric">{metricValue}</span>
            <span data-value="imperial">{imperialValue}</span>
          </span>
          <span data-part="caption">{caption}</span>
        </p>
        <form data-part="track">
          <label data-part="unit" data-unit="metric">
            <input
              type="radio"
              name={name}
              value="metric"
              defaultChecked={defaultValue === "metric"}
            />
            {metricLabel}
          </label>
          <label data-part="unit" data-unit="imperial">
            <input
              type="radio"
              name={name}
              value="imperial"
              defaultChecked={defaultValue === "imperial"}
            />
            {imperialLabel}
          </label>
        </form>
      </fieldset>
    </>
  )
}
