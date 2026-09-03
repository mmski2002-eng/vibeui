import type { ComponentProps, CSSProperties } from "react"

export type Badge009Props = Omit<ComponentProps<"span">, "children"> & {
  items?: string[]
  visible?: number
  label?: string
  /** Пусто — плашки держат собственный нейтральный фон. */
  background?: string
}

// Идея компонента: ряд плашек, который не переносится на вторую строку. Хвост
// сворачивается в «+3», а полный список уходит в title и в подпись для
// скринридера: в строке таблицы место одно, а тегов у записи бывает десять.
const STYLES = `
:where([data-vibeui-block="badge-009"]){
--vibeui-badge-009-bg:light-dark(oklch(0.96 0.004 265),oklch(0.27 0.009 265));
--vibeui-badge-009-fg:light-dark(oklch(0.32 0.014 265),oklch(0.93 0.006 265));
--vibeui-badge-009-border:light-dark(oklch(0.89 0.006 265),oklch(0.39 0.011 265));
--vibeui-badge-009-muted:color-mix(in oklab,var(--vibeui-badge-009-fg) 68%,transparent);
--vibeui-badge-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-009"]{color-scheme:dark}
[data-vibeui-block="badge-009"]{
display:inline-flex;align-items:center;gap:0.3125rem;
max-width:100%;vertical-align:middle;
font-family:var(--vibeui-badge-009-font);
}
[data-vibeui-block="badge-009"] [data-part="item"]{
display:inline-flex;align-items:center;flex:0 1 auto;min-width:0;
height:1.5rem;padding:0 0.5625rem;
border:1px solid var(--vibeui-badge-009-border);border-radius:9999px;
background:var(--vibeui-badge-009-bg);color:var(--vibeui-badge-009-fg);
font-size:0.75rem;line-height:1;
/* Плашка режется многоточием, а не переносится: ряд обязан остаться рядом. */
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="badge-009"] [data-part="more"]{
display:inline-flex;align-items:center;flex:none;
height:1.5rem;padding:0 0.5rem;border-radius:9999px;
background:transparent;color:var(--vibeui-badge-009-muted);
font-size:0.75rem;font-weight:600;font-variant-numeric:tabular-nums;line-height:1;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "дизайн",
  "фронтенд",
  "каталог",
  "срочно",
  "релиз",
  "документация",
]

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
 * Ряд плашек в одну строку: хвост сворачивается в счётчик.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge009({
  items = DEFAULT_ITEMS,
  visible = 3,
  label = "Метки",
  background = "",
  className,
  style,
  ...props
}: Badge009Props) {
  const shown = items.slice(0, Math.max(1, visible))
  const rest = items.length - shown.length
  const palette = {
    ...(background
      ? {
          "--vibeui-badge-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-009" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-009"
        className={className}
        style={palette}
        role="group"
        aria-label={`${label}: ${items.join(", ")}`}
      >
        {shown.map((item) => (
          <span key={item} data-part="item" aria-hidden="true">
            {item}
          </span>
        ))}
        {rest > 0 ? (
          <span
            data-part="more"
            aria-hidden="true"
            title={items.slice(shown.length).join(", ")}
          >
            +{rest}
          </span>
        ) : null}
      </span>
    </>
  )
}
