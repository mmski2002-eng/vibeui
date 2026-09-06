import type { ComponentProps, CSSProperties } from "react"

export type Spinner008Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  /** Строка под полосой: она и объясняет, почему процента нет. */
  hint?: string
  height?: number
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
}

// Идея компонента: полоса неопределённого прогресса без отдельного бегущего
// отрезка. Вместо узкой дорожки с уезжающим сегментом вся полоса залита
// диагональными полосами и движется целиком через background-position —
// «полосатый конвейер», а не бегунок. aria-valuenow по-прежнему не ставим:
// без него скринридер не назовёт процент, которого никто не считал.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="spinner-008"]){
--vibeui-spinner-008-height:6px;
--vibeui-spinner-008-surface:transparent;
--vibeui-spinner-008-border:light-dark(oklch(0.9 0 265),oklch(0.32 0 265));
--vibeui-spinner-008-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-spinner-008-muted:color-mix(in oklab,var(--vibeui-spinner-008-fg) 68%,transparent);
--vibeui-spinner-008-track:light-dark(oklch(0.93 0 265),oklch(0.34 0 265));
--vibeui-spinner-008-accent:light-dark(oklch(0.55 0.17 262),oklch(0.72 0.16 262));
--vibeui-spinner-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="spinner-008"]{color-scheme:dark}
/* Подложки нет по умолчанию: плашка появляется только пропом background. */
[data-vibeui-block="spinner-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.9375rem 1.0625rem;
background:var(--vibeui-spinner-008-surface);
border:1px solid var(--vibeui-spinner-008-border);border-radius:0.875rem;
font-family:var(--vibeui-spinner-008-font);color:var(--vibeui-spinner-008-fg);
}
[data-vibeui-block="spinner-008"] [data-part="label"]{
font-size:0.9375rem;font-weight:600;
}
[data-vibeui-block="spinner-008"] [data-part="hint"]{
font-size:0.875rem;color:var(--vibeui-spinner-008-muted);
}
/* Вся полоса — движущийся конвейер полос, а не дорожка с бегунком. */
[data-vibeui-block="spinner-008"] [data-part="track"]{
height:var(--vibeui-spinner-008-height);border-radius:9999px;
background-color:var(--vibeui-spinner-008-track);
background-image:repeating-linear-gradient(
135deg,
var(--vibeui-spinner-008-accent) 0,
var(--vibeui-spinner-008-accent) 10px,
transparent 10px,
transparent 20px
);
background-size:200% 100%;
animation:vibeui-spinner-008-drift 1s linear infinite;
}
@keyframes vibeui-spinner-008-drift{to{background-position:-40px 0}}
/* Без движения полосы замирают на месте: узор виден, конвейер не едет. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-008"] [data-part="track"]{animation:none!important;background-position:0 0}
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
 * Полоса неопределённого прогресса из движущихся диагональных полос.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner008({
  label = "Проверяем соединение",
  hint = "Доля неизвестна, работа продолжается",
  height = 6,
  background = "",
  className,
  style,
  ...props
}: Spinner008Props) {
  const palette = {
    "--vibeui-spinner-008-height": `${height}px`,
    ...(background
      ? {
          "--vibeui-spinner-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="spinner"
        data-vibeui-block="spinner-008"
        className={className}
        style={palette}
      >
        <span data-part="label">{label}</span>
        <div
          data-part="track"
          role="progressbar"
          aria-label={label}
          aria-busy="true"
        />
        {hint ? <span data-part="hint">{hint}</span> : null}
      </div>
    </>
  )
}
