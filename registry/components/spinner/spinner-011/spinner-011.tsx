import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  value?: number
  label?: string
  segments?: number
  size?: "sm" | "md" | "lg"
}

// Идея компонента: круговой индикатор процента, собранный из отдельных
// делений-«тиков», а не из сплошной дуги. Каждое деление — свой элемент,
// повёрнутый на свой угол; доля определяет, сколько делений закрашено.
// Такой циферблат читается как измерительный прибор, а не как заливка —
// это осознанная альтернатива гладкой дуге conic-gradient.
const STYLES = `
:where([data-vibeui-block="spinner-011"]){
--vibeui-spinner-011-size:4.5rem;
--vibeui-spinner-011-surface:oklch(1 0 0);
--vibeui-spinner-011-border:oklch(0.9 0.006 265);
--vibeui-spinner-011-fg:oklch(0.24 0.014 265);
--vibeui-spinner-011-muted:oklch(0.55 0.014 265);
--vibeui-spinner-011-track:oklch(0.85 0.006 265);
--vibeui-spinner-011-accent:oklch(0.55 0.17 262);
--vibeui-spinner-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: число и подписи тёмные. */
[data-vibeui-block="spinner-011"]{
display:inline-flex;align-items:center;gap:0.875rem;
box-sizing:border-box;padding:0.875rem 1.125rem 0.875rem 0.875rem;
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
[data-vibeui-block="spinner-011"] [data-part="label"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="spinner-011"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-spinner-011-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="spinner-011"] *{animation:none!important;transition:none!important}}
`

/**
 * Сегментированный циферблат с процентом внутри: деления вместо дуги.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner011({
  value = 42,
  label = "Обрабатываем видео",
  segments = 24,
  size = "md",
  className,
  style,
  ...props
}: Spinner011Props) {
  const safe = Math.min(100, Math.max(0, Math.round(value)))
  const total = Math.min(60, Math.max(8, Math.round(segments)))
  const activeCount = Math.round((safe / 100) * total)

  return (
    <>
      <style href="vibeui-spinner-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-011"
        data-size={size}
        className={className}
        style={style as CSSProperties}
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
          <span data-part="hint">Готово {safe} из 100</span>
        </span>
      </div>
    </>
  )
}
