import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup027Row = {
  title: string
  date: string
}

export type Buttongroup027Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  compactLabel?: string
  regularLabel?: string
  roomyLabel?: string
  defaultValue?: string
  label?: string
  /** Строки образца: компонент несёт русские, проект подставляет свои. */
  sample?: Buttongroup027Row[]
  name?: string
  /** Пусто — заливки нет, сегменты ложатся на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переключатель плотности, который показывает результат
// на месте. Под сцепкой лежат три строки-образца, и высота их ячеек берётся
// из переменной --vibeui-buttongroup-027-row; выбранный radio меняет эту
// переменную на корне через :has, поэтому образец перестраивается без единой
// строки JS. Значок каждого сегмента — те же три полосы с тем же просветом,
// что и в образце: подпись, образец и значок говорят об одном.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-027"]){
--vibeui-buttongroup-027-surface:transparent;
--vibeui-buttongroup-027-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-027-muted:color-mix(in oklab,var(--vibeui-buttongroup-027-fg) 68%,transparent);
--vibeui-buttongroup-027-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-buttongroup-027-rule:light-dark(oklch(0.94 0 265),oklch(0.35 0 265));
--vibeui-buttongroup-027-on:light-dark(oklch(0.96 0 215),oklch(0.36 0 0));
--vibeui-buttongroup-027-accent:light-dark(oklch(0.27 0 0),oklch(0.914 0 0));
--vibeui-buttongroup-027-radius:0.625rem;
--vibeui-buttongroup-027-row:1.75rem;
--vibeui-buttongroup-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-027"]{color-scheme:dark}
[data-vibeui-block="buttongroup-027"]{
box-sizing:border-box;display:block;width:100%;max-width:22rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-027-font);
}
[data-vibeui-block="buttongroup-027"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-027"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-027"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]{
position:relative;z-index:0;flex:1 1 0;min-width:0;
display:inline-flex;align-items:center;justify-content:center;gap:0.375rem;
height:2.25rem;padding:0 0.5rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-027-border);
background:var(--vibeui-buttongroup-027-surface);
color:var(--vibeui-buttongroup-027-muted);
font-size:0.75rem;font-weight:650;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-027-radius);
border-end-start-radius:var(--vibeui-buttongroup-027-radius);
}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-027-radius);
border-end-end-radius:var(--vibeui-buttongroup-027-radius);
}
[data-vibeui-block="buttongroup-027"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-027"] [data-part="glyph"]{
display:flex;flex-direction:column;justify-content:center;
width:0.9375rem;height:0.9375rem;flex:none;
}
[data-vibeui-block="buttongroup-027"] [data-part="glyph"] i{
display:block;height:2px;border-radius:1px;background:currentColor;
}
[data-vibeui-block="buttongroup-027"] [data-density="compact"] i + i{margin-top:1px}
[data-vibeui-block="buttongroup-027"] [data-density="regular"] i + i{margin-top:3px}
[data-vibeui-block="buttongroup-027"] [data-density="roomy"] i + i{margin-top:5px}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-027-fg)}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-027-on);
border-color:var(--vibeui-buttongroup-027-accent);
color:var(--vibeui-buttongroup-027-accent);
}
[data-vibeui-block="buttongroup-027"] [data-part="segment"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-027-accent);outline-offset:1px;
}
/* Выбор меняет переменную на корне — образец перестраивается сам. */
[data-vibeui-block="buttongroup-027"]:has([data-part="segment"]:nth-of-type(1) input:checked){--vibeui-buttongroup-027-row:1.375rem}
[data-vibeui-block="buttongroup-027"]:has([data-part="segment"]:nth-of-type(2) input:checked){--vibeui-buttongroup-027-row:1.875rem}
[data-vibeui-block="buttongroup-027"]:has([data-part="segment"]:nth-of-type(3) input:checked){--vibeui-buttongroup-027-row:2.5rem}
[data-vibeui-block="buttongroup-027"] [data-part="sample"]{
margin-top:0.625rem;padding:0 0.75rem;
border:1px solid var(--vibeui-buttongroup-027-border);
border-radius:var(--vibeui-buttongroup-027-radius);
background:var(--vibeui-buttongroup-027-surface);
}
[data-vibeui-block="buttongroup-027"] [data-part="line"]{
display:flex;align-items:center;gap:0.5rem;
height:var(--vibeui-buttongroup-027-row);
color:var(--vibeui-buttongroup-027-muted);
font-size:0.75rem;line-height:1;
transition:height .2s ease;
}
[data-vibeui-block="buttongroup-027"] [data-part="line"] + [data-part="line"]{
border-top:1px solid var(--vibeui-buttongroup-027-rule);
}
[data-vibeui-block="buttongroup-027"] [data-part="line"] span:first-child{
flex:1 1 auto;color:var(--vibeui-buttongroup-027-fg);font-weight:600;
}
[data-vibeui-block="buttongroup-027"] [data-part="line"] span:last-child{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-027"] *{animation:none!important;transition:none!important}}
`

const SAMPLE: Buttongroup027Row[] = [
  { title: "Договор № 118", date: "12.04" },
  { title: "Акт сверки", date: "09.04" },
  { title: "Счёт на оплату", date: "02.04" },
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
 * Плотность таблицы с живым образцом строк под сцепкой, без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup027({
  compactLabel = "Плотно",
  regularLabel = "Обычно",
  roomyLabel = "Свободно",
  defaultValue = "regular",
  label = "Плотность таблицы",
  sample = SAMPLE,
  name = "buttongroup-027",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup027Props) {
  const options = [
    { id: "compact", label: compactLabel },
    { id: "regular", label: regularLabel },
    { id: "roomy", label: roomyLabel },
  ]

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-027-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-027" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-027"
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
              <span
                data-part="glyph"
                data-density={option.id}
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
              </span>
              <span>{option.label}</span>
            </label>
          ))}
        </form>
        <div data-part="sample" aria-hidden="true">
          {sample.map((row) => (
            <div key={row.title} data-part="line">
              <span>{row.title}</span>
              <span>{row.date}</span>
            </div>
          ))}
        </div>
      </fieldset>
    </>
  )
}
