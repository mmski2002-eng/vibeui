import type { ComponentProps, CSSProperties } from "react"

export type Badge018Position =
  "top-right" | "top-left" | "bottom-right" | "bottom-left"

export type Badge018Props = ComponentProps<"span"> & {
  content?: string
  position?: Badge018Position
  label?: string
  /** Подпись демонстрационного хоста: показывается, когда детей нет. */
  hostLabel?: string
  /** Пусто — плашка держит собственную сигнальную заливку. */
  background?: string
}

// Идея компонента: слот, который вешает плашку на чужой элемент. Обёртка
// сжимается по содержимому и не добавляет отступов, плашка абсолютная и
// вылетает наружу ровно на долю своей высоты, а pointer-events:none снимает
// с неё перехват нажатия: под слотом обычно кнопка, и клик обязан доходить
// до неё, а не до счётчика.
const STYLES = `
:where([data-vibeui-block="badge-018"]){
--vibeui-badge-018-offset:38%;
--vibeui-badge-018-size:1.125rem;
/* Сигнальная заливка держится в обеих ветках: счётчик уведомлений обязан
   оставаться самым громким пятном и на тёмной странице. */
--vibeui-badge-018-bg:light-dark(oklch(0.58 0.2 25),oklch(0.72 0.19 25));
--vibeui-badge-018-fg:light-dark(oklch(0.99 0.01 25),oklch(0.17 0.03 25));
/* Кольцо повторяет фон страницы, а не белый лист: иначе в тёмной теме
   вокруг плашки светится ободок. */
--vibeui-badge-018-ring:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-badge-018-host-bg:light-dark(oklch(0.93 0 265),oklch(0.31 0 265));
--vibeui-badge-018-host-fg:light-dark(oklch(0.34 0 265),oklch(0.92 0 265));
--vibeui-badge-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-018"]{color-scheme:dark}
[data-vibeui-block="badge-018"]{
position:relative;display:inline-flex;
font-family:var(--vibeui-badge-018-font);vertical-align:middle;
}
[data-vibeui-block="badge-018"] [data-part="badge"]{
position:absolute;z-index:1;
display:inline-flex;align-items:center;justify-content:center;
box-sizing:border-box;
min-width:var(--vibeui-badge-018-size);height:var(--vibeui-badge-018-size);
padding:0 0.3125rem;border-radius:9999px;
background:var(--vibeui-badge-018-bg);color:var(--vibeui-badge-018-fg);
font-size:0.625rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;
/* Кольцо цвета подложки отделяет плашку от хоста без выреза в хосте. */
box-shadow:0 0 0 2px var(--vibeui-badge-018-ring);
/* Плашка декоративная: нажатие обязано доходить до элемента под ней. */
pointer-events:none;
}
[data-vibeui-block="badge-018"][data-position="top-right"] [data-part="badge"]{top:0;right:0;transform:translate(var(--vibeui-badge-018-offset),calc(var(--vibeui-badge-018-offset) * -1))}
[data-vibeui-block="badge-018"][data-position="top-left"] [data-part="badge"]{top:0;left:0;transform:translate(calc(var(--vibeui-badge-018-offset) * -1),calc(var(--vibeui-badge-018-offset) * -1))}
[data-vibeui-block="badge-018"][data-position="bottom-right"] [data-part="badge"]{bottom:0;right:0;transform:translate(var(--vibeui-badge-018-offset),var(--vibeui-badge-018-offset))}
[data-vibeui-block="badge-018"][data-position="bottom-left"] [data-part="badge"]{bottom:0;left:0;transform:translate(calc(var(--vibeui-badge-018-offset) * -1),var(--vibeui-badge-018-offset))}
[data-vibeui-block="badge-018"] [data-part="host"]{
display:inline-flex;align-items:center;justify-content:center;
width:2.75rem;height:2.75rem;border-radius:0.875rem;
background:var(--vibeui-badge-018-host-bg);color:var(--vibeui-badge-018-host-fg);
font-size:0.9375rem;font-weight:700;line-height:1;letter-spacing:0.02em;
}
[data-vibeui-block="badge-018"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-018"] *{animation:none!important;transition:none!important}}
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
 * Слот: сажает плашку в угол чужого элемента, не ломая раскладку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge018({
  content = "3",
  position = "top-right",
  label = "новых уведомления",
  hostLabel = "ЕК",
  background = "",
  className,
  style,
  children,
  ...props
}: Badge018Props) {
  // Цифры на плашке контрастны заливке, а не странице, поэтому свой фон
  // меняет только их цвет: color-scheme остаётся тем, что задало окружение.
  const palette = {
    ...(background
      ? {
          "--vibeui-badge-018-bg": background,
          "--vibeui-badge-018-fg":
            schemeForBackground(background) === "light"
              ? "oklch(0.2 0.03 25)"
              : "oklch(0.99 0.01 25)",
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-018" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-018"
        data-position={position}
        className={className}
        style={palette}
      >
        {children ?? <span data-part="host">{hostLabel}</span>}
        <span data-part="badge" aria-hidden="true">
          {content}
        </span>
        <span data-part="sr">
          {content} {label}
        </span>
      </span>
    </>
  )
}
