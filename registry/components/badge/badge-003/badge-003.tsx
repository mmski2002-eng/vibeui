import type { ComponentProps, CSSProperties } from "react"

export type Badge003Props = Omit<ComponentProps<"span">, "children"> & {
  value?: number
  /** Порог, после которого печатается «99+». */
  max?: number
  label?: string
  tone?: "neutral" | "accent" | "danger"
  /** Пусто — счётчик держит фон своего тона. */
  background?: string
}

// Идея компонента: счётчик, который не растягивает соседей. Ширина задана
// минимумом в высоту плашки, цифры табличные, а всё, что больше порога,
// печатается как «99+»: настоящая тысяча уведомлений разорвала бы вёрстку и
// всё равно ничего не сообщила бы точнее.
const STYLES = `
:where([data-vibeui-block="badge-003"]){
--vibeui-badge-003-size:1.25rem;
--vibeui-badge-003-bg:light-dark(oklch(0.93 0.006 265),oklch(0.33 0.012 265));
--vibeui-badge-003-fg:light-dark(oklch(0.3 0.014 265),oklch(0.93 0.006 265));
--vibeui-badge-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-003"]{color-scheme:dark}
[data-vibeui-block="badge-003"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:var(--vibeui-badge-003-size);height:var(--vibeui-badge-003-size);
padding:0 0.375rem;box-sizing:border-box;
border-radius:9999px;
background:var(--vibeui-badge-003-bg);color:var(--vibeui-badge-003-fg);
font-family:var(--vibeui-badge-003-font);font-size:0.6875rem;font-weight:700;
/* Табличные цифры: иначе счётчик дёргается при каждом изменении. */
font-variant-numeric:tabular-nums;line-height:1;vertical-align:middle;
}
[data-vibeui-block="badge-003"][data-tone="accent"]{--vibeui-badge-003-bg:light-dark(oklch(0.58 0.16 265),oklch(0.63 0.17 265));--vibeui-badge-003-fg:oklch(0.99 0.01 265)}
/* Тёмная ветка не светлее светлой: текст на счётчике почти белый, а с ним
   красная заливка держит 4.5:1 только до L≈0.58. */
[data-vibeui-block="badge-003"][data-tone="danger"]{--vibeui-badge-003-bg:light-dark(oklch(0.58 0.2 25),oklch(0.57 0.2 25));--vibeui-badge-003-fg:oklch(0.99 0.01 25)}
[data-vibeui-block="badge-003"][data-zero="true"]{opacity:.45}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-003"] *{animation:none!important;transition:none!important}}
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
 * Счётчик с порогом «99+» и табличными цифрами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge003({
  value = 128,
  max = 99,
  label = "непрочитанных",
  tone = "danger",
  background = "",
  className,
  style,
  ...props
}: Badge003Props) {
  const safe = Math.max(0, Math.round(value))
  const text = safe > max ? `${max}+` : String(safe)
  const palette = {
    ...(background
      ? {
          "--vibeui-badge-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-003" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-003"
        data-tone={tone}
        data-zero={safe === 0}
        className={className}
        style={palette}
        aria-label={`${safe} ${label}`}
      >
        <span aria-hidden="true">{text}</span>
      </span>
    </>
  )
}
