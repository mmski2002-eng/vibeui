import type { ComponentProps, CSSProperties } from "react"

export type Card010Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  lines?: number
  media?: boolean
  /** Пусто — подложки нет, заглушка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: заглушка карточки под настоящую. Пропорции повторяют
// card-004: обложка квадратом, две строки заголовка, короткая строка цены.
// Совпадение метрик и есть смысл заглушки — иначе при загрузке содержимое
// прыгает, и это раздражает сильнее, чем пустое место.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка и плашки светлее фона, а не темнее.
const STYLES = `
:where([data-vibeui-block="card-010"]){
--vibeui-card-010-bg:transparent;
--vibeui-card-010-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-card-010-base:light-dark(oklch(0.93 0.005 265),oklch(0.33 0.01 265));
--vibeui-card-010-shine:light-dark(oklch(0.97 0.003 265),oklch(0.41 0.012 265));
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-010"]{color-scheme:dark}
[data-vibeui-block="card-010"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-card-010-bg);
border:1px solid var(--vibeui-card-010-border);border-radius:0.875rem;
}
[data-vibeui-block="card-010"] [data-part="media"],
[data-vibeui-block="card-010"] [data-part="line"]{
background:
linear-gradient(90deg,var(--vibeui-card-010-base) 0%,var(--vibeui-card-010-shine) 50%,var(--vibeui-card-010-base) 100%)
0 0 / 200% 100%;
animation:vibeui-card-010-sweep 1.4s ease-in-out infinite;
}
/* Обложка квадратом: те же метрики, что у настоящей карточки товара. */
[data-vibeui-block="card-010"] [data-part="media"]{aspect-ratio:1 / 1;border-radius:0.625rem}
[data-vibeui-block="card-010"] [data-part="line"]{height:0.6875rem;border-radius:9999px}
[data-vibeui-block="card-010"] [data-part="line"]:nth-of-type(1){width:92%}
[data-vibeui-block="card-010"] [data-part="line"]:nth-of-type(2){width:64%}
[data-vibeui-block="card-010"] [data-part="line"]:nth-of-type(3){width:40%;height:0.875rem;margin-top:0.125rem}
[data-vibeui-block="card-010"] [data-part="line"]:nth-of-type(2){animation-delay:.12s}
[data-vibeui-block="card-010"] [data-part="line"]:nth-of-type(3){animation-delay:.24s}
@keyframes vibeui-card-010-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-010"] *{animation:none!important;transition:none!important}
[data-vibeui-block="card-010"] [data-part="media"],
[data-vibeui-block="card-010"] [data-part="line"]{background:var(--vibeui-card-010-base)}
}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * плашкам тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Заглушка карточки: обложка и строки повторяют метрики настоящей.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card010({
  label = "Загружается карточка товара",
  lines = 3,
  media = true,
  background = "",
  className,
  style,
  ...props
}: Card010Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-card-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-010"
        className={className}
        style={palette}
        role="status"
        aria-busy="true"
        aria-label={label}
      >
        {media ? <span data-part="media" /> : null}
        {Array.from({ length: Math.max(1, lines) }, (_, index) => (
          <span key={index} data-part="line" />
        ))}
      </div>
    </>
  )
}
