import { Fragment } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Separator003Item = { value: string; caption: string }

export type Separator003Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Separator003Item[]
  gap?: number
  dividerHeight?: "text" | "full"
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: вертикальные разделители между блоками одной строки.
// Линия не задаёт высоту строки, а берёт её у соседей: при dividerHeight
// "full" ряд растянут align-items:stretch, и линия сама вытягивается до
// высоты самого высокого блока. Вариант "text" ограничивает её строкой
// значения — так делают в шапках, где полная линия выглядит как граница
// таблицы. Разделители помечены role="separator" с вертикальной ориентацией.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, а рамка и линии в тёмном контексте светлее фона.
const STYLES = `
:where([data-vibeui-block="separator-003"]){
--vibeui-separator-003-gap:20px;
--vibeui-separator-003-line:light-dark(oklch(0.88 0.006 265),oklch(0.38 0.012 265));
--vibeui-separator-003-surface:transparent;
--vibeui-separator-003-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-separator-003-fg:light-dark(oklch(0.24 0.014 265),oklch(0.95 0.006 265));
--vibeui-separator-003-muted:color-mix(in oklab,var(--vibeui-separator-003-fg) 68%,transparent);
--vibeui-separator-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="separator-003"]{color-scheme:dark}
[data-vibeui-block="separator-003"]{
display:inline-flex;align-items:stretch;
gap:var(--vibeui-separator-003-gap);
box-sizing:border-box;padding:0.875rem 1.125rem;
background:var(--vibeui-separator-003-surface);
border:1px solid var(--vibeui-separator-003-border);border-radius:0.875rem;
font-family:var(--vibeui-separator-003-font);color:var(--vibeui-separator-003-fg);
}
[data-vibeui-block="separator-003"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;
}
[data-vibeui-block="separator-003"] [data-part="value"]{
font-size:1.125rem;font-weight:700;line-height:1.2;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="separator-003"] [data-part="caption"]{
font-size:0.75rem;color:var(--vibeui-separator-003-muted);white-space:nowrap;
}
/* Линия берёт высоту у соседей, а не задаёт её: строка не растёт от линии. */
[data-vibeui-block="separator-003"] [data-part="rule"]{
flex:none;width:1px;background:var(--vibeui-separator-003-line);
}
[data-vibeui-block="separator-003"][data-height="text"] [data-part="rule"]{
align-self:flex-start;height:1.375rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="separator-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Separator003Item[] = [
  { value: "128", caption: "компонентов" },
  { value: "24", caption: "категории" },
  { value: "0", caption: "зависимостей" },
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
 * Строка показателей с вертикальными разделителями между блоками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Separator003({
  items = DEFAULT_ITEMS,
  gap = 20,
  dividerHeight = "full",
  background = "",
  className,
  style,
  ...props
}: Separator003Props) {
  const palette = {
    "--vibeui-separator-003-gap": `${gap}px`,
    ...(background
      ? {
          "--vibeui-separator-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-separator-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="separator"
        data-vibeui-block="separator-003"
        data-height={dividerHeight}
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <Fragment key={item.caption}>
            {index > 0 ? (
              <span
                data-part="rule"
                role="separator"
                aria-orientation="vertical"
              />
            ) : null}
            <div data-part="cell">
              <span data-part="value">{item.value}</span>
              <span data-part="caption">{item.caption}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </>
  )
}
