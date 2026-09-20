import type { ComponentProps, CSSProperties } from "react"

export type Radio020Props = Omit<ComponentProps<"div">, "children"> & {
  /** Имя набора: выводится над свотчами и озвучивается скринридером. */
  label?: string
  /** Выбранный свотч: идентификатор из набора. */
  defaultValue?: string
  /** Названия цветов по идентификатору: компонент несёт русские. */
  optionText?: Record<string, string>
  /** Диаметр свотча в пикселях. */
  size?: number
  /** Имя группы радиокнопок: разным экземплярам нужны разные имена. */
  name?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: выбор цвета, где выбранное состояние показывает не
// галочка сбоку, а сам кружок — он пружинно раздувается, обводится кольцом
// в собственном цвете, и соседи расступаются, освобождая ему место. Выбор
// держат радиокнопки, поэтому набор работает в форме и без сценариев.
//
// Тема берётся из color-scheme окружения через light-dark(): галочка внутри
// кружка сама выбирает чёрный или белый по светлоте свотча.
const STYLES = `
:where([data-vibeui-block="radio-020"]){
--vibeui-radio-020-bg:transparent;
--vibeui-radio-020-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-radio-020-muted:color-mix(in oklab,var(--vibeui-radio-020-fg) 62%,transparent);
--vibeui-radio-020-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-radio-020-accent:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-radio-020-size:34px;
--vibeui-radio-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-020"]{color-scheme:dark}
[data-vibeui-block="radio-020"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-radio-020-bg);color:var(--vibeui-radio-020-fg);
font-family:var(--vibeui-radio-020-font);
}
[data-vibeui-block="radio-020"] *{box-sizing:border-box}
[data-vibeui-block="radio-020"] [data-part="group"]{
display:flex;flex-direction:column;gap:0.75rem;
margin:0;padding:0;border:0;min-inline-size:0;
}
[data-vibeui-block="radio-020"] [data-part="legend"]{
padding:0;font-size:0.75rem;font-weight:600;letter-spacing:0.02em;
text-transform:uppercase;color:var(--vibeui-radio-020-muted);
}
[data-vibeui-block="radio-020"] [data-part="swatches"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;
}
[data-vibeui-block="radio-020"] [data-part="swatch"]{
position:relative;display:inline-flex;cursor:pointer;
padding:0.1875rem;border-radius:50%;
transition:transform .5s cubic-bezier(.22,1.2,.36,1),box-shadow .3s ease;
transition:transform .5s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),box-shadow .3s ease;
}
/* Радиокнопка остаётся настоящей: она держит выбор, уезжает в форму и
   переключается стрелками, а видимый кружок рисует её подпись. */
[data-vibeui-block="radio-020"] [data-part="swatch"] input{
position:absolute;width:1px;height:1px;margin:0;padding:0;
opacity:0;pointer-events:none;
}
[data-vibeui-block="radio-020"] [data-part="name"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="radio-020"] [data-part="dot"]{
display:grid;place-items:center;
width:var(--vibeui-radio-020-size);height:var(--vibeui-radio-020-size);
border-radius:50%;background:var(--vibeui-radio-020-dot);
box-shadow:inset 0 0 0 1px var(--vibeui-radio-020-border);
transition:transform .5s cubic-bezier(.22,1.2,.36,1);
transition:transform .5s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
/* Кольцо рисует подпись, а не сам кружок: её отступ и есть зазор между
   кружком и кольцом, поэтому фон под компонентом остаётся любым. */
[data-vibeui-block="radio-020"] [data-part="swatch"]:has(input:checked){
box-shadow:0 0 0 2px var(--vibeui-radio-020-dot);
}
[data-vibeui-block="radio-020"] [data-part="swatch"]:has(input:checked) [data-part="dot"]{
transform:scale(1.18);
}
/* Соседи расступаются: следующий отходит вправо, предыдущий — влево.
   Разворот на предыдущий возможен только через :has(). */
[data-vibeui-block="radio-020"] [data-part="swatch"]:has(input:checked) + [data-part="swatch"]{
transform:translateX(0.1875rem);
}
[data-vibeui-block="radio-020"] [data-part="swatch"]:has(+ [data-part="swatch"] input:checked){
transform:translateX(-0.1875rem);
}
[data-vibeui-block="radio-020"] [data-part="swatch"]:has(input:focus-visible){
outline:2px solid var(--vibeui-radio-020-accent);outline-offset:3px;
}
[data-vibeui-block="radio-020"] [data-part="swatch"]:hover [data-part="dot"]{transform:scale(1.08)}
/* Галочка вырастает из центра и сама выбирает чёрный или белый: светлота
   свотча заранее неизвестна, её задаёт пользователь. */
[data-vibeui-block="radio-020"] [data-part="check"]{
display:block;width:55%;height:55%;opacity:0;transform:scale(0.4);
color:oklch(from var(--vibeui-radio-020-dot) clamp(0,(0.62 - l) * 100,1) 0 0);
transition:transform .4s cubic-bezier(.22,1.2,.36,1),opacity .2s ease;
transition:transform .4s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),opacity .2s ease;
}
[data-vibeui-block="radio-020"] [data-part="swatch"]:has(input:checked) [data-part="check"]{
opacity:1;transform:scale(1);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-020"] *{animation:none!important;transition:none!important}}
`

const SWATCHES = [
  { id: "amber", color: "light-dark(#1a1a1a,#f2f2f2)" },
  { id: "graphite", color: "#17181A" },
  { id: "paper", color: "#FFFFFF" },
  { id: "stone", color: "#9A9A96" },
  { id: "sand", color: "#D9CFC0" },
  { id: "slate", color: "#4A5058" },
]

const OPTION_TEXT: Record<string, string> = {
  amber: "Оранжевый",
  graphite: "Графит",
  paper: "Белый",
  stone: "Камень",
  sand: "Песок",
  slate: "Сланец",
}

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
 * Ряд цветовых свотчей на радиокнопках: выбранный раздувается с кольцом,
 * соседи расступаются. Один файл, ноль зависимостей.
 */
export function Radio020({
  label = "Цвет акцента",
  defaultValue = "amber",
  optionText = OPTION_TEXT,
  size = 34,
  name = "radio-020",
  accent,
  background = "",
  className,
  style,
  ...props
}: Radio020Props) {
  const palette = {
    "--vibeui-radio-020-size": `${size}px`,
    ...(accent ? { "--vibeui-radio-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-020"
        className={className}
        style={palette}
      >
        <fieldset data-part="group">
          <legend data-part="legend">{label}</legend>
          <div data-part="swatches">
            {SWATCHES.map((swatch) => (
              <label
                key={swatch.id}
                data-part="swatch"
                style={
                  { "--vibeui-radio-020-dot": swatch.color } as CSSProperties
                }
              >
                <input
                  type="radio"
                  name={name}
                  value={swatch.id}
                  defaultChecked={swatch.id === defaultValue}
                />
                <span data-part="dot">
                  <svg data-part="check" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 4.5"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span data-part="name">
                  {optionText[swatch.id] ?? OPTION_TEXT[swatch.id]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </>
  )
}
