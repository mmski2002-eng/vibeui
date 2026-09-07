import type { ComponentProps, CSSProperties } from "react"

export type Togglegroup019Props = Omit<ComponentProps<"div">, "children"> & {
  /** Имя рельса: выводится над ним и озвучивается скринридером. */
  label?: string
  /** Выбранный отрезок: day, week или month. */
  defaultValue?: string
  /** Подписи отрезков по идентификатору: компонент несёт русские. */
  optionText?: Record<string, string>
  /** Имя группы радиокнопок: разным экземплярам нужны разные имена. */
  name?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: сегментированный переключатель, где пилюля равна ровно
// одной трети дорожки, а не ширине подписи. Поэтому она не дёргается при
// переводе и не мельтешит на длинных словах — только едет на шаг ячейки,
// с лёгким перелётом. Номер ячейки CSS вычисляет сам через :has(), так что
// сценариев в компоненте нет: состояние держат радиокнопки.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте дорожка темнеет, а её граница светлеет.
const STYLES = `
:where([data-vibeui-block="togglegroup-019"]){
--vibeui-togglegroup-019-bg:transparent;
--vibeui-togglegroup-019-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-togglegroup-019-muted:color-mix(in oklab,var(--vibeui-togglegroup-019-fg) 62%,transparent);
--vibeui-togglegroup-019-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-togglegroup-019-track:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-togglegroup-019-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-togglegroup-019-accent-text:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-togglegroup-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-019"]{color-scheme:dark}
[data-vibeui-block="togglegroup-019"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-togglegroup-019-bg);color:var(--vibeui-togglegroup-019-fg);
font-family:var(--vibeui-togglegroup-019-font);
}
[data-vibeui-block="togglegroup-019"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-019"] [data-part="group"]{
display:flex;flex-direction:column;gap:0.625rem;
margin:0;padding:0;border:0;min-inline-size:0;
}
[data-vibeui-block="togglegroup-019"] [data-part="legend"]{
padding:0;font-size:0.75rem;font-weight:600;letter-spacing:0.02em;
text-transform:uppercase;color:var(--vibeui-togglegroup-019-muted);
}
[data-vibeui-block="togglegroup-019"] [data-part="rail"]{
--vibeui-togglegroup-019-i:0;
position:relative;display:flex;align-items:stretch;
width:100%;max-width:17rem;height:2.75rem;padding:0.25rem;
border:1px solid var(--vibeui-togglegroup-019-border);border-radius:999px;
background:var(--vibeui-togglegroup-019-track);
}
/* Пилюля ровно в треть дорожки: ширину задаёт ячейка, а не подпись,
   поэтому шаг всегда равен 100% её собственной ширины. */
[data-vibeui-block="togglegroup-019"] [data-part="rail"]::before{
content:"";position:absolute;z-index:0;
top:0.25rem;bottom:0.25rem;left:0.25rem;
width:calc((100% - 0.5rem) / 3);
border-radius:999px;
background:color-mix(in oklab,var(--vibeui-togglegroup-019-accent) 18%,transparent);
border:1px solid color-mix(in oklab,var(--vibeui-togglegroup-019-accent) 55%,transparent);
transform:translateX(calc(var(--vibeui-togglegroup-019-i) * 100%));
pointer-events:none;
transition:transform .45s cubic-bezier(.22,1.2,.36,1);
transition:transform .45s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
/* Номер ячейки считает сам CSS: сначала по отмеченной радиокнопке… */
[data-vibeui-block="togglegroup-019"] [data-part="rail"]:has([data-part="cell"]:nth-child(2) input:checked){--vibeui-togglegroup-019-i:1}
[data-vibeui-block="togglegroup-019"] [data-part="rail"]:has([data-part="cell"]:nth-child(3) input:checked){--vibeui-togglegroup-019-i:2}
/* …а под курсором пилюля уезжает к наведённой ячейке и возвращается,
   когда курсор ушёл: правила ниже перебивают выбор. */
[data-vibeui-block="togglegroup-019"] [data-part="rail"]:has([data-part="cell"]:nth-child(1):hover input){--vibeui-togglegroup-019-i:0}
[data-vibeui-block="togglegroup-019"] [data-part="rail"]:has([data-part="cell"]:nth-child(2):hover input){--vibeui-togglegroup-019-i:1}
[data-vibeui-block="togglegroup-019"] [data-part="rail"]:has([data-part="cell"]:nth-child(3):hover input){--vibeui-togglegroup-019-i:2}
[data-vibeui-block="togglegroup-019"] [data-part="cell"]{
position:relative;z-index:1;flex:1 1 0;min-width:0;
display:flex;align-items:center;justify-content:center;
border-radius:999px;cursor:pointer;
font-size:0.8125rem;font-weight:600;line-height:1;
white-space:nowrap;color:var(--vibeui-togglegroup-019-muted);
transition:color .25s ease;
}
/* Радиокнопка остаётся настоящей: она держит выбор, уезжает в форму и
   переключается стрелками, а видимую ячейку рисует её подпись. */
[data-vibeui-block="togglegroup-019"] [data-part="cell"] input{
position:absolute;width:1px;height:1px;margin:0;padding:0;
opacity:0;pointer-events:none;
}
/* Подсвечена ровно одна подпись: под курсором — наведённая, иначе
   выбранная. Иначе на рельсе горели бы сразу две. */
[data-vibeui-block="togglegroup-019"] [data-part="rail"]:not(:has([data-part="cell"]:hover)) [data-part="cell"]:has(input:checked),
[data-vibeui-block="togglegroup-019"] [data-part="cell"]:hover{
color:var(--vibeui-togglegroup-019-accent-text);
}
[data-vibeui-block="togglegroup-019"] [data-part="cell"]:has(input:focus-visible){
outline:2px solid var(--vibeui-togglegroup-019-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-019"] *{animation:none!important;transition:none!important}}
`

const OPTIONS = ["day", "week", "month"]

const OPTION_TEXT: Record<string, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
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
 * Сегментированный рельс на три отрезка: пилюля в треть дорожки едет к
 * наведённой или выбранной ячейке. Один файл, ноль зависимостей.
 */
export function Togglegroup019({
  label = "Период",
  defaultValue = "week",
  optionText = OPTION_TEXT,
  name = "togglegroup-019",
  accent,
  background = "",
  className,
  style,
  ...props
}: Togglegroup019Props) {
  const palette = {
    ...(accent ? { "--vibeui-togglegroup-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-togglegroup-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-019"
        className={className}
        style={palette}
      >
        <fieldset data-part="group">
          <legend data-part="legend">{label}</legend>
          <div data-part="rail">
            {OPTIONS.map((option) => (
              <label key={option} data-part="cell">
                <input
                  type="radio"
                  name={name}
                  value={option}
                  defaultChecked={option === defaultValue}
                />
                {optionText[option] ?? OPTION_TEXT[option]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </>
  )
}
