import type { ComponentProps, CSSProperties } from "react"

export type Badge017Props = ComponentProps<"span"> & {
  tone?: "accent" | "positive" | "danger"
  waves?: number
  /** Пусто — плашка держит собственную заливку тона. */
  background?: string
}

// Идея компонента: метка «новое» с расходящейся волной. Волна — отдельный
// слой поверх точки, а не сама точка: анимируется только он, поэтому при
// выключенной анимации точка остаётся на месте и метка не исчезает. Волн
// может быть несколько, каждая уходит со своей задержкой — сигнал читается
// боковым зрением, но не мигает.
const STYLES = `
:where([data-vibeui-block="badge-017"]){
--vibeui-badge-017-hue:265;
--vibeui-badge-017-chroma:0.16;
--vibeui-badge-017-mark:light-dark(oklch(0.58 var(--vibeui-badge-017-chroma) var(--vibeui-badge-017-hue)),oklch(0.74 calc(var(--vibeui-badge-017-chroma) * 0.85) var(--vibeui-badge-017-hue)));
--vibeui-badge-017-bg:light-dark(oklch(0.97 calc(var(--vibeui-badge-017-chroma) * 0.1) var(--vibeui-badge-017-hue)),oklch(0.28 calc(var(--vibeui-badge-017-chroma) * 0.2) var(--vibeui-badge-017-hue)));
--vibeui-badge-017-fg:light-dark(oklch(0.36 calc(var(--vibeui-badge-017-chroma) * 0.55) var(--vibeui-badge-017-hue)),oklch(0.92 calc(var(--vibeui-badge-017-chroma) * 0.25) var(--vibeui-badge-017-hue)));
--vibeui-badge-017-border:light-dark(oklch(0.9 calc(var(--vibeui-badge-017-chroma) * 0.2) var(--vibeui-badge-017-hue)),oklch(0.42 calc(var(--vibeui-badge-017-chroma) * 0.3) var(--vibeui-badge-017-hue)));
--vibeui-badge-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-017"]{color-scheme:dark}
[data-vibeui-block="badge-017"]{
display:inline-flex;align-items:center;gap:0.4375rem;
box-sizing:border-box;height:1.75rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-badge-017-border);border-radius:9999px;
background:var(--vibeui-badge-017-bg);color:var(--vibeui-badge-017-fg);
font-family:var(--vibeui-badge-017-font);font-size:0.6875rem;font-weight:700;line-height:1;
letter-spacing:0.06em;text-transform:uppercase;vertical-align:middle;
}
[data-vibeui-block="badge-017"][data-tone="positive"]{--vibeui-badge-017-hue:150;--vibeui-badge-017-chroma:0.13}
[data-vibeui-block="badge-017"][data-tone="danger"]{--vibeui-badge-017-hue:25;--vibeui-badge-017-chroma:0.19}
[data-vibeui-block="badge-017"] [data-part="beacon"]{
position:relative;flex:none;width:0.4375rem;height:0.4375rem;
}
[data-vibeui-block="badge-017"] [data-part="core"]{
position:absolute;inset:0;border-radius:9999px;
background:var(--vibeui-badge-017-mark);
}
[data-vibeui-block="badge-017"] [data-part="wave"]{
position:absolute;inset:0;border-radius:9999px;
border:1.5px solid var(--vibeui-badge-017-mark);
animation:vibeui-badge-017-ripple 2.4s ease-out infinite;
animation-delay:var(--vibeui-badge-017-delay,0s);
}
@keyframes vibeui-badge-017-ripple{
0%{transform:scale(1);opacity:.6}
70%{transform:scale(2.6);opacity:0}
100%{transform:scale(2.6);opacity:0}
}
/* Волна отключается целиком, а не замирает раскрытой: застывшее кольцо
   вокруг точки читается как ошибка вёрстки. Сама точка остаётся. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="badge-017"] *{animation:none!important;transition:none!important}
[data-vibeui-block="badge-017"] [data-part="wave"]{display:none}
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
 * Метка «новое» с расходящейся волной поверх точки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge017({
  tone = "accent",
  waves = 2,
  background = "",
  className,
  style,
  children = "Новое",
  ...props
}: Badge017Props) {
  const count = Math.min(3, Math.max(0, Math.round(waves)))

  const palette = {
    ...(background
      ? {
          "--vibeui-badge-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-017" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-017"
        data-tone={tone}
        className={className}
        style={palette}
      >
        <span data-part="beacon" aria-hidden="true">
          {Array.from({ length: count }, (_, index) => (
            <span
              key={index}
              data-part="wave"
              style={
                {
                  "--vibeui-badge-017-delay": `${index * 0.8}s`,
                } as CSSProperties
              }
            />
          ))}
          <span data-part="core" />
        </span>
        {children}
      </span>
    </>
  )
}
