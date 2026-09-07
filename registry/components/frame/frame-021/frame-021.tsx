import type { ComponentProps, CSSProperties } from "react"

export type Frame021Props = Omit<ComponentProps<"div">, "children"> & {
  /** Подпись в центре поля. */
  label?: string
  /** Наклон поля к зрителю в градусах. */
  tilt?: number
  /** Шаг сетки в пикселях. */
  cell?: number
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: декоративное поле, которое на наведении перестаёт быть
// плоским — оно ложится в перспективу и подъезжает к зрителю, а точка в
// центре разгорается акцентом. Сетка нарисована двумя повторяющимися
// градиентами, поэтому в разметке нет ни одной лишней ноды, а вся механика
// умещается в один transform. Клиентского кода нет вовсе.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="frame-021"]){
--vibeui-frame-021-bg:transparent;
--vibeui-frame-021-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-frame-021-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-frame-021-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-frame-021-line:light-dark(oklch(0 0 0 / 11%),oklch(1 0 0 / 12%));
--vibeui-frame-021-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-frame-021-cell:18px;
--vibeui-frame-021-tilt:37deg;
--vibeui-frame-021-radius:0.875rem;
--vibeui-frame-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-021"]{color-scheme:dark}
/* Сетка — два повторяющихся градиента, а не сотня элементов: шаг задаётся
   одной переменной, поэтому плотность настраивается пропом. */
[data-vibeui-block="frame-021"]{
position:relative;display:grid;place-items:center;overflow:hidden;
width:100%;max-width:22rem;aspect-ratio:16 / 9;box-sizing:border-box;
border:1px solid var(--vibeui-frame-021-border);
border-radius:var(--vibeui-frame-021-radius);
background-color:var(--vibeui-frame-021-bg);
background-image:
repeating-linear-gradient(0deg,var(--vibeui-frame-021-line) 0 1px,transparent 1px var(--vibeui-frame-021-cell)),
repeating-linear-gradient(90deg,var(--vibeui-frame-021-line) 0 1px,transparent 1px var(--vibeui-frame-021-cell));
background-position:center;
color:var(--vibeui-frame-021-fg);
font-family:var(--vibeui-frame-021-font);
transform-origin:50% 62%;
transform:perspective(19rem) rotateX(0deg) rotateZ(0deg) scale(1);
transition:transform .65s cubic-bezier(.22,1.2,.36,1);
transition:transform .65s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
[data-vibeui-block="frame-021"] *{box-sizing:border-box}
/* Поле ложится в перспективу и подъезжает: перелёт пружины и есть та самая
   «упругость», ради которой эффект держится на transform, а не на размерах. */
[data-vibeui-block="frame-021"]:hover,
[data-vibeui-block="frame-021"]:active{
transform:perspective(19rem) rotateX(var(--vibeui-frame-021-tilt)) rotateZ(-4deg) scale(1.09);
}
/* Фокальная точка: одна радиальная заливка поверх сетки, на наведении
   разгорается — без неё наклон читается как перекос, а не как объём. */
[data-vibeui-block="frame-021"]::after{
content:"";position:absolute;inset:0;pointer-events:none;
background:radial-gradient(circle at 50% 50%,color-mix(in oklab,var(--vibeui-frame-021-accent) 45%,transparent),transparent 38%);
opacity:.4;
transition:opacity .65s cubic-bezier(.22,1.2,.36,1);
transition:opacity .65s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
[data-vibeui-block="frame-021"]:hover::after,
[data-vibeui-block="frame-021"]:active::after{opacity:.9}
[data-vibeui-block="frame-021"] [data-part="caption"]{
position:relative;z-index:1;
padding:0.3125rem 0.5625rem;
border:1px solid var(--vibeui-frame-021-border);
border-radius:0.375rem;
background:var(--vibeui-frame-021-card);
font-size:0.6875rem;font-weight:650;letter-spacing:0.12em;text-transform:uppercase;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-021"] *{animation:none!important;transition:none!important}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="frame-021"]{transition:none}
[data-vibeui-block="frame-021"]::after{transition:none}
}
`

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
 * Поле-сетка, которое на наведении ложится в перспективу и подъезжает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame021({
  label = "Поле",
  tilt = 37,
  cell = 18,
  accent,
  background = "",
  className,
  style,
  ...props
}: Frame021Props) {
  const palette = {
    "--vibeui-frame-021-tilt": `${tilt}deg`,
    "--vibeui-frame-021-cell": `${cell}px`,
    ...(accent ? { "--vibeui-frame-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-frame-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-021" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-021"
        className={className}
        style={palette}
      >
        <span data-part="caption">{label}</span>
      </div>
    </>
  )
}
