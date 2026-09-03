import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Badge013Icon = "check" | "clock" | "alert" | "spark"

export type Badge013Props = ComponentProps<"span"> & {
  icon?: Badge013Icon
  tone?: "neutral" | "positive" | "warning" | "accent"
  /** Пусто — плашка держит собственную заливку тона. */
  background?: string
}

// Идея компонента: плашка, у которой слева стоит знак. Иконка живёт в тех же
// единицах, что и текст: размер в em, оптический сдвиг вверх на пол-пикселя,
// flex:none — поэтому она не разъезжается при смене размера шрифта и не
// сжимается, когда подпись длинная.
const STYLES = `
:where([data-vibeui-block="badge-013"]){
--vibeui-badge-013-hue:265;
--vibeui-badge-013-chroma:0.014;
--vibeui-badge-013-bg:light-dark(oklch(0.96 calc(var(--vibeui-badge-013-chroma) * 0.5) var(--vibeui-badge-013-hue)),oklch(0.28 calc(var(--vibeui-badge-013-chroma) * 0.9) var(--vibeui-badge-013-hue)));
--vibeui-badge-013-fg:light-dark(oklch(0.34 var(--vibeui-badge-013-chroma) var(--vibeui-badge-013-hue)),oklch(0.91 calc(var(--vibeui-badge-013-chroma) * 0.6) var(--vibeui-badge-013-hue)));
--vibeui-badge-013-mark:light-dark(oklch(0.52 calc(var(--vibeui-badge-013-chroma) * 1.6) var(--vibeui-badge-013-hue)),oklch(0.76 calc(var(--vibeui-badge-013-chroma) * 1.3) var(--vibeui-badge-013-hue)));
--vibeui-badge-013-border:light-dark(oklch(0.89 calc(var(--vibeui-badge-013-chroma) * 0.8) var(--vibeui-badge-013-hue)),oklch(0.41 var(--vibeui-badge-013-chroma) var(--vibeui-badge-013-hue)));
--vibeui-badge-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-013"]{color-scheme:dark}
[data-vibeui-block="badge-013"]{
display:inline-flex;align-items:center;gap:0.375em;
max-width:100%;box-sizing:border-box;
height:1.75rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-badge-013-border);border-radius:9999px;
background:var(--vibeui-badge-013-bg);color:var(--vibeui-badge-013-fg);
font-family:var(--vibeui-badge-013-font);font-size:0.75rem;font-weight:600;line-height:1;
vertical-align:middle;
}
[data-vibeui-block="badge-013"] [data-part="icon"]{
/* Размер в em, а не в rem: знак обязан ехать вместе с подписью. */
width:1em;height:1em;flex:none;
margin-top:-0.0625em;
color:var(--vibeui-badge-013-mark);
}
[data-vibeui-block="badge-013"] [data-part="text"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="badge-013"][data-tone="positive"]{--vibeui-badge-013-hue:150;--vibeui-badge-013-chroma:0.05}
[data-vibeui-block="badge-013"][data-tone="warning"]{--vibeui-badge-013-hue:75;--vibeui-badge-013-chroma:0.07}
[data-vibeui-block="badge-013"][data-tone="accent"]{--vibeui-badge-013-hue:265;--vibeui-badge-013-chroma:0.06}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-013"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<Badge013Icon, ReactNode> = {
  check: <path d="M4 12.5 9 17.5 20 6.5" />,
  clock: <path d="M12 6.5V12l4 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  alert: <path d="M12 4.5v9m0 4.5v.5M12 4.5 12 4.5" />,
  spark: <path d="M12 3.5 14 10l6.5 2-6.5 2-2 6.5-2-6.5L3.5 12l6.5-2 2-6.5Z" />,
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
 * Плашка со знаком слева: иконка масштабируется вместе с текстом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge013({
  icon = "check",
  tone = "positive",
  background = "",
  className,
  style,
  children = "Оплачено",
  ...props
}: Badge013Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-badge-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-013" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-013"
        data-tone={tone}
        className={className}
        style={palette}
      >
        <svg
          data-part="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          {ICONS[icon]}
        </svg>
        <span data-part="text">{children}</span>
      </span>
    </>
  )
}
