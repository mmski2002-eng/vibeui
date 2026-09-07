import type { ComponentProps, CSSProperties } from "react"

export type Togglegroup018Props = Omit<ComponentProps<"div">, "children"> & {
  /** Имя группы: выводится над фишками и озвучивается скринридером. */
  label?: string
  /** Фишка, отмеченная изначально; остальные включаются щелчком. */
  defaultValue?: string
  /** Подписи фишек по идентификатору: компонент несёт русские. */
  optionText?: Record<string, string>
  /** Галочка у выбранной фишки. */
  showCheck?: boolean
  /** Имя поля формы: у каждой фишки свой checkbox с этим именем. */
  name?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: фильтр-фишки с множественным выбором, где отметка — это
// не галочка сбоку, а состояние самой фишки: она наливается акцентом,
// пружинно «садится» на новый размер, и из её левого края вырастает галочка.
// Состояние держат обычные checkbox'ы, поэтому JS не нужен вовсе — фишки
// работают и в форме без сценариев.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте фишка темнеет, а её граница светлеет.
const STYLES = `
:where([data-vibeui-block="togglegroup-018"]){
--vibeui-togglegroup-018-bg:transparent;
--vibeui-togglegroup-018-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-togglegroup-018-muted:color-mix(in oklab,var(--vibeui-togglegroup-018-fg) 62%,transparent);
--vibeui-togglegroup-018-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-togglegroup-018-surface:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-togglegroup-018-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-togglegroup-018-on-accent:oklch(0.15 0.02 39.8);
--vibeui-togglegroup-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-018"]{color-scheme:dark}
[data-vibeui-block="togglegroup-018"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-togglegroup-018-bg);color:var(--vibeui-togglegroup-018-fg);
font-family:var(--vibeui-togglegroup-018-font);
}
[data-vibeui-block="togglegroup-018"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-018"] [data-part="group"]{
display:flex;flex-direction:column;gap:0.625rem;
margin:0;padding:0;border:0;min-inline-size:0;
}
[data-vibeui-block="togglegroup-018"] [data-part="legend"]{
padding:0;font-size:0.75rem;font-weight:600;letter-spacing:0.02em;
text-transform:uppercase;color:var(--vibeui-togglegroup-018-muted);
}
[data-vibeui-block="togglegroup-018"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.5rem;
}
[data-vibeui-block="togglegroup-018"] [data-part="chip"]{
position:relative;display:inline-flex;align-items:center;cursor:pointer;
padding:0.4375rem 0.9375rem;border-radius:999px;
border:1px solid var(--vibeui-togglegroup-018-border);
background:var(--vibeui-togglegroup-018-surface);
color:var(--vibeui-togglegroup-018-muted);
font-size:0.8125rem;font-weight:600;line-height:1.2;
transition:transform .3s cubic-bezier(.22,1.2,.36,1),background-color .2s ease,color .2s ease,border-color .2s ease;
transition:transform .3s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),background-color .2s ease,color .2s ease,border-color .2s ease;
}
/* Checkbox остаётся настоящим: он держит состояние, попадает в форму и
   ловит клавиатуру, а видимую фишку рисует его подпись. */
[data-vibeui-block="togglegroup-018"] [data-part="chip"] input{
position:absolute;width:1px;height:1px;margin:0;padding:0;
opacity:0;pointer-events:none;
}
[data-vibeui-block="togglegroup-018"] [data-part="chip"]:hover{
color:var(--vibeui-togglegroup-018-fg);
border-color:color-mix(in oklab,var(--vibeui-togglegroup-018-fg) 30%,transparent);
}
[data-vibeui-block="togglegroup-018"] [data-part="chip"]:has(input:focus-visible){
outline:2px solid var(--vibeui-togglegroup-018-accent);outline-offset:2px;
}
/* Вид отмеченной фишки берётся прямо из :checked: подменить его классом,
   не тронув checkbox, не выйдет — расхождение видно сразу. */
[data-vibeui-block="togglegroup-018"] [data-part="chip"]:has(input:checked){
transform:scale(1.06);
background:var(--vibeui-togglegroup-018-accent);
border-color:var(--vibeui-togglegroup-018-accent);
color:var(--vibeui-togglegroup-018-on-accent);
}
[data-vibeui-block="togglegroup-018"] [data-part="chip"]:active{transform:scale(0.97)}
/* Галочка вырастает из нулевой ширины, поэтому фишка раздаётся вместе с
   ней, а не дёргается скачком. */
[data-vibeui-block="togglegroup-018"] [data-part="check"]{
display:grid;place-items:center;flex:none;
width:0;overflow:hidden;opacity:0;transform:scale(0.4);
transition:width .3s cubic-bezier(.22,1.2,.36,1),transform .3s cubic-bezier(.22,1.2,.36,1),opacity .2s ease;
transition:width .3s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),transform .3s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),opacity .2s ease;
}
[data-vibeui-block="togglegroup-018"] [data-part="check"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="togglegroup-018"] [data-part="chip"]:has(input:checked) [data-part="check"]{
width:1.125rem;opacity:1;transform:scale(1);
}
[data-vibeui-block="togglegroup-018"][data-check="off"] [data-part="check"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-018"] *{animation:none!important;transition:none!important}}
`

const OPTIONS = ["spring", "glide", "bounce", "decay"]

const OPTION_TEXT: Record<string, string> = {
  spring: "Пружина",
  glide: "Скольжение",
  bounce: "Отскок",
  decay: "Затухание",
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
 * Фишки-фильтры с множественным выбором: отмеченная пружинно садится на
 * акцент, из её края вырастает галочка. Один файл, ноль зависимостей.
 */
export function Togglegroup018({
  label = "Тип движения",
  defaultValue = "glide",
  optionText = OPTION_TEXT,
  showCheck = true,
  name = "togglegroup-018",
  accent,
  background = "",
  className,
  style,
  ...props
}: Togglegroup018Props) {
  const palette = {
    ...(accent ? { "--vibeui-togglegroup-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-togglegroup-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-018"
        data-check={showCheck ? "on" : "off"}
        className={className}
        style={palette}
      >
        <fieldset data-part="group">
          <legend data-part="legend">{label}</legend>
          <div data-part="chips">
            {OPTIONS.map((option) => (
              <label key={option} data-part="chip">
                <input
                  type="checkbox"
                  name={name}
                  value={option}
                  defaultChecked={option === defaultValue}
                />
                <span data-part="check" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {optionText[option] ?? OPTION_TEXT[option]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </>
  )
}
