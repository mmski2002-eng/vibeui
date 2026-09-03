import type { ComponentProps, CSSProperties } from "react"

export type Badge014Props = ComponentProps<"span"> & {
  hue?: number
  dashed?: boolean
  /** Пусто — плашка держит собственную подложку того же оттенка. */
  background?: string
}

// Идея компонента: плашка на обводке, а не на заливке. Весь набор цветов
// считается из одного числа — оттенка: рамка насыщенная, текст тёмный,
// подложка того же тона в восьми процентах. Пунктирная рамка отдана
// предварительным состояниям: «черновик» отличается от «опубликовано»
// формой линии, а не только цветом.
const STYLES = `
:where([data-vibeui-block="badge-014"]){
--vibeui-badge-014-hue:265;
--vibeui-badge-014-line:light-dark(oklch(0.62 0.13 var(--vibeui-badge-014-hue)),oklch(0.7 0.12 var(--vibeui-badge-014-hue)));
--vibeui-badge-014-fg:light-dark(oklch(0.42 0.12 var(--vibeui-badge-014-hue)),oklch(0.9 0.06 var(--vibeui-badge-014-hue)));
/* Подложка своя в обеих ветках: контур обязан лежать на тоне, а не на
   случайном фоне страницы. В тёмной ветке она темнее рамки, а не светлее. */
--vibeui-badge-014-bg:light-dark(oklch(0.98 0.012 var(--vibeui-badge-014-hue)),oklch(0.26 0.03 var(--vibeui-badge-014-hue)));
--vibeui-badge-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-014"]{color-scheme:dark}
[data-vibeui-block="badge-014"]{
display:inline-flex;align-items:center;gap:0.375rem;
box-sizing:border-box;height:1.75rem;padding:0 0.6875rem;
border:1.5px solid var(--vibeui-badge-014-line);border-radius:9999px;
background:var(--vibeui-badge-014-bg);color:var(--vibeui-badge-014-fg);
font-family:var(--vibeui-badge-014-font);font-size:0.75rem;font-weight:600;line-height:1;
letter-spacing:0.005em;vertical-align:middle;
}
[data-vibeui-block="badge-014"][data-dashed="true"]{
border-style:dashed;
/* У черновика тон приглушён: рамка кричит меньше, чем у финального. */
--vibeui-badge-014-line:light-dark(oklch(0.72 0.06 var(--vibeui-badge-014-hue)),oklch(0.58 0.05 var(--vibeui-badge-014-hue)));
--vibeui-badge-014-fg:light-dark(oklch(0.5 0.05 var(--vibeui-badge-014-hue)),oklch(0.78 0.03 var(--vibeui-badge-014-hue)));
}
[data-vibeui-block="badge-014"] [data-part="dot"]{
width:0.375rem;height:0.375rem;flex:none;border-radius:9999px;
background:var(--vibeui-badge-014-line);
}
[data-vibeui-block="badge-014"][data-dashed="true"] [data-part="dot"]{
background:transparent;box-shadow:inset 0 0 0 1.5px var(--vibeui-badge-014-line);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-014"] *{animation:none!important;transition:none!important}}
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
 * Плашка на обводке: вся палитра выводится из одного оттенка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge014({
  hue = 265,
  dashed = false,
  background = "",
  className,
  style,
  children = "Опубликовано",
  ...props
}: Badge014Props) {
  const palette = {
    "--vibeui-badge-014-hue": String(Math.round(hue) % 360),
    ...(background
      ? {
          "--vibeui-badge-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-014" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-014"
        data-dashed={dashed}
        className={className}
        style={palette}
      >
        <span data-part="dot" aria-hidden="true" />
        {children}
      </span>
    </>
  )
}
