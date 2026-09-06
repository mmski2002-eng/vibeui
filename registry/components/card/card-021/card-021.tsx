import type { ComponentProps, CSSProperties } from "react"

export type Card021Props = Omit<ComponentProps<"div">, "children"> & {
  /** Что именно грузится. Читается вслух, на экране не показывается. */
  label?: string
  /** Сколько строк ленты изобразить. Столько же, сколько придёт данных. */
  rows?: number
  /** Кружок аватара слева у каждой строки. */
  avatar?: boolean
  /** Пусто — подложки нет, заглушка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: заглушка ленты, а не карточки. Метрики повторяют строку
// комментария: кружок аватара, имя, две строки текста и подпись. Блик —
// один @keyframes с задержкой по строкам, чтобы движение читалось как волна,
// а не как мигание. В prefers-reduced-motion блик снимается насовсем, и
// фигуры остаются ровной заливкой: пульсация — частая причина недомогания.
const STYLES = `
:where([data-vibeui-block="card-021"]){
--vibeui-card-021-bg:transparent;
--vibeui-card-021-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-021-bone:light-dark(oklch(0.93 0 265),oklch(0.33 0 265));
--vibeui-card-021-shine:light-dark(oklch(0.97 0 265),oklch(0.41 0 265));
--vibeui-card-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-021"]{color-scheme:dark}
[data-vibeui-block="card-021"]{
position:relative;display:flex;flex-direction:column;gap:1rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-card-021-bg);
border:1px solid var(--vibeui-card-021-border);border-radius:0.9375rem;
font-family:var(--vibeui-card-021-font);
}
[data-vibeui-block="card-021"] [data-part="row"]{
display:flex;align-items:flex-start;gap:0.6875rem;
}
[data-vibeui-block="card-021"] [data-part="lines"]{
flex:1;min-width:0;display:flex;flex-direction:column;gap:0.4375rem;
}
[data-vibeui-block="card-021"] [data-part="face"],
[data-vibeui-block="card-021"] [data-part="name"],
[data-vibeui-block="card-021"] [data-part="text"]{
border-radius:0.375rem;
background:linear-gradient(100deg,
var(--vibeui-card-021-bone) 30%,
var(--vibeui-card-021-shine) 48%,
var(--vibeui-card-021-bone) 66%) 0 0 / 300% 100%;
animation:vibeui-card-021-sweep 1.5s linear infinite;
}
[data-vibeui-block="card-021"] [data-part="face"]{
flex:none;width:2.25rem;height:2.25rem;border-radius:9999px;
}
[data-vibeui-block="card-021"] [data-part="name"]{height:0.6875rem;width:42%}
[data-vibeui-block="card-021"] [data-part="text"]{height:0.5625rem;width:100%}
[data-vibeui-block="card-021"] [data-part="text"]:last-child{width:68%}
/* Задержка по строкам: волна вместо синхронного мигания всей ленты.
   Первый ребёнок — подпись для скринридера, поэтому строки начинаются с 2. */
[data-vibeui-block="card-021"] [data-part="row"]:nth-child(3) span{animation-delay:.12s}
[data-vibeui-block="card-021"] [data-part="row"]:nth-child(4) span{animation-delay:.24s}
[data-vibeui-block="card-021"] [data-part="row"]:nth-child(5) span{animation-delay:.36s}
[data-vibeui-block="card-021"] [data-part="row"]:nth-child(6) span{animation-delay:.48s}
[data-vibeui-block="card-021"] [data-part="row"]:nth-child(7) span{animation-delay:.6s}
[data-vibeui-block="card-021"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@keyframes vibeui-card-021-sweep{from{background-position:100% 0}to{background-position:-100% 0}}
/* Блик снимается целиком, а не замедляется: пульсация на экране — частая
   причина недомогания, и половинчатое движение тут не помогает. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-021"] *{animation:none!important;transition:none!important}
[data-vibeui-block="card-021"] [data-part="face"],
[data-vibeui-block="card-021"] [data-part="name"],
[data-vibeui-block="card-021"] [data-part="text"]{background:var(--vibeui-card-021-bone)}
}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы фигурам
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
 * Заглушка ленты: строки с аватаром, именем и двумя строками текста.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card021({
  label = "Загружаются комментарии",
  rows = 3,
  avatar = true,
  background = "",
  accent,
  className,
  style,
  ...props
}: Card021Props) {
  const count = Math.max(1, Math.min(6, Math.round(rows)))

  const palette = {
    ...(accent ? { "--vibeui-card-021-bone": accent } : null),
    ...(background
      ? {
          "--vibeui-card-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-021" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-021"
        role="status"
        aria-busy="true"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="sr">{label}</span>
        {Array.from({ length: count }, (_, index) => (
          <div key={index} data-part="row" aria-hidden="true">
            {avatar ? <span data-part="face" /> : null}
            <div data-part="lines">
              <span data-part="name" />
              <span data-part="text" />
              <span data-part="text" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
