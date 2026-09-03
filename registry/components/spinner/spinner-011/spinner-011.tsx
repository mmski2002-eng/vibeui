import type { ComponentProps, CSSProperties } from "react"

export type Spinner011Props = Omit<ComponentProps<"div">, "children"> & {
  value?: number
  label?: string
  segments?: number
  size?: "sm" | "md" | "lg"
  /** Вторая строка: {value} заменяется текущим значением. */
  hintTemplate?: string
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
}

// Идея компонента: круговой индикатор процента, собранный из отдельных
// делений-«тиков», а не из сплошной дуги. Каждое деление — свой элемент,
// повёрнутый на свой угол; доля определяет, сколько делений закрашено.
// Такой циферблат читается как измерительный прибор, а не как заливка —
// это осознанная альтернатива гладкой дуге conic-gradient.
//
// Тема берётся из color-scheme окружения через light-dark(): незакрашенные
// деления в тёмной ветке светлее фона, а не темнее.
const STYLES = `
:where([data-vibeui-block="spinner-011"]){
--vibeui-spinner-011-size:4.5rem;
--vibeui-spinner-011-surface:transparent;
--vibeui-spinner-011-border:light-dark(oklch(0.9 0.006 265),oklch(0.32 0.012 265));
--vibeui-spinner-011-fg:light-dark(oklch(0.24 0.014 265),oklch(0.95 0.005 265));
--vibeui-spinner-011-muted:color-mix(in oklab,var(--vibeui-spinner-011-fg) 68%,transparent);
--vibeui-spinner-011-track:light-dark(oklch(0.85 0.006 265),oklch(0.4 0.012 265));
--vibeui-spinner-011-accent:light-dark(oklch(0.55 0.17 262),oklch(0.74 0.15 262));
--vibeui-spinner-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="spinner-011"]{color-scheme:dark}
/* Подложки нет по умолчанию: плашка появляется только пропом background. */
[data-vibeui-block="spinner-011"]{
display:inline-flex;align-items:center;gap:0.875rem;
box-sizing:border-box;padding:0.9375rem 1.0625rem 0.9375rem 0.9375rem;
background:var(--vibeui-spinner-011-surface);
border:1px solid var(--vibeui-spinner-011-border);border-radius:1rem;
font-family:var(--vibeui-spinner-011-font);color:var(--vibeui-spinner-011-fg);
}
[data-vibeui-block="spinner-011"][data-size="sm"]{--vibeui-spinner-011-size:3.25rem}
[data-vibeui-block="spinner-011"][data-size="lg"]{--vibeui-spinner-011-size:6rem}
[data-vibeui-block="spinner-011"] [data-part="dial"]{
position:relative;display:grid;place-items:center;flex:none;
width:var(--vibeui-spinner-011-size);height:var(--vibeui-spinner-011-size);
}
/* Деление стоит "на 12 часах" и поворачивается вокруг центра циферблата —
классический приём часовых делений, посчитанный через transform-origin. */
[data-vibeui-block="spinner-011"] [data-part="tick"]{
position:absolute;top:0;left:50%;
width:0.125rem;height:22%;margin-left:-0.0625rem;
border-radius:1px;background:var(--vibeui-spinner-011-track);
transform-origin:50% calc(var(--vibeui-spinner-011-size) / 2);
}
[data-vibeui-block="spinner-011"] [data-part="tick"][data-active="true"]{
background:var(--vibeui-spinner-011-accent);
}
[data-vibeui-block="spinner-011"] [data-part="value"]{
position:relative;
font-size:calc(var(--vibeui-spinner-011-size) * 0.22);
font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="spinner-011"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;
}
[data-vibeui-block="spinner-011"] [data-part="label"]{font-size:0.9375rem;font-weight:650}
[data-vibeui-block="spinner-011"] [data-part="hint"]{font-size:0.875rem;color:var(--vibeui-spinner-011-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="spinner-011"] *{animation:none!important;transition:none!important}}
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
 * Сегментированный циферблат с процентом внутри: деления вместо дуги.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner011({
  value = 42,
  label = "Обрабатываем видео",
  segments = 24,
  size = "md",
  hintTemplate = "Готово {value} из 100",
  background = "",
  className,
  style,
  ...props
}: Spinner011Props) {
  const safe = Math.min(100, Math.max(0, Math.round(value)))
  const total = Math.min(60, Math.max(8, Math.round(segments)))
  const activeCount = Math.round((safe / 100) * total)
  const palette = {
    ...(background
      ? {
          "--vibeui-spinner-011-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="spinner"
        data-vibeui-block="spinner-011"
        data-size={size}
        className={className}
        style={palette}
      >
        <div
          data-part="dial"
          role="progressbar"
          aria-valuenow={safe}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          {Array.from({ length: total }, (_, index) => {
            const deg = (360 / total) * index
            return (
              <span
                key={index}
                data-part="tick"
                data-active={index < activeCount}
                aria-hidden="true"
                style={
                  {
                    transform: `rotate(${deg}deg)`,
                  } as CSSProperties
                }
              />
            )
          })}
          <span data-part="value" aria-hidden="true">
            {safe}%
          </span>
        </div>
        <span data-part="text">
          <span data-part="label">{label}</span>
          <span data-part="hint">
            {hintTemplate.replace("{value}", String(safe))}
          </span>
        </span>
      </div>
    </>
  )
}
