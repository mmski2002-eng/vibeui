import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Progress001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Значение 0–100. `null` — процесс идёт, но длительность неизвестна. */
  value?: number | null
  label?: string
  /** Правая подпись: по умолчанию проценты. */
  hint?: string
  size?: "sm" | "md"
  accent?: string
}

// Идея компонента: у полосы два честных состояния. Известен прогресс — она
// показывает долю и число; неизвестен — по дорожке ходит отрезок, и никакой
// выдуманный процент не рисуется.
const STYLES = `
:where([data-vibeui-block="progress-001"]){
--vibeui-progress-001-fg:oklch(0.28 0.016 265);
--vibeui-progress-001-muted:oklch(0.54 0.014 265);
--vibeui-progress-001-track:oklch(0.92 0.006 265);
--vibeui-progress-001-accent:oklch(0.55 0.2 262);
--vibeui-progress-001-height:0.5rem;
--vibeui-progress-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="progress-001"]{
display:flex;flex-direction:column;gap:0.5rem;width:100%;
font-family:var(--vibeui-progress-001-font);color:var(--vibeui-progress-001-fg);
}
[data-vibeui-block="progress-001"][data-size="sm"]{--vibeui-progress-001-height:0.25rem}
[data-vibeui-block="progress-001"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
font-size:0.8125rem;
}
[data-vibeui-block="progress-001"] [data-part="hint"]{
color:var(--vibeui-progress-001-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-001"] [data-part="track"]{
position:relative;overflow:hidden;
height:var(--vibeui-progress-001-height);
border-radius:9999px;background:var(--vibeui-progress-001-track);
}
[data-vibeui-block="progress-001"] [data-part="bar"]{
height:100%;border-radius:inherit;
background:var(--vibeui-progress-001-accent);
width:calc(var(--vibeui-progress-001-value,0) * 1%);
transition:width .3s cubic-bezier(.32,.72,0,1);
}
/* Неизвестная длительность: отрезок ходит по дорожке, процент не выдумываем. */
[data-vibeui-block="progress-001"][data-indeterminate="true"] [data-part="bar"]{
width:35%;transition:none;
animation:vibeui-progress-001-slide 1.4s ease-in-out infinite;
}
@keyframes vibeui-progress-001-slide{
0%{transform:translateX(-110%)}
100%{transform:translateX(320%)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="progress-001"][data-indeterminate="true"] [data-part="bar"]{width:100%;opacity:.5}
}
`

/**
 * Индикатор выполнения с честным состоянием неизвестной длительности.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress001({
  value = 64,
  label = "Сборка проекта",
  hint,
  size = "md",
  accent,
  className,
  style,
  ...props
}: Progress001Props) {
  const indeterminate = value === null || value === undefined
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value))
  const palette = {
    "--vibeui-progress-001-value": clamped,
    ...(accent ? { "--vibeui-progress-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const note = hint ?? (indeterminate ? "идёт" : `${Math.round(clamped)}%`)

  return (
    <>
      <style href="vibeui-progress-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="progress-001"
        data-size={size}
        data-indeterminate={indeterminate || undefined}
        className={className}
        style={palette}
      >
        {label || note ? (
          <div data-part="head">
            <span data-part="label">{label}</span>
            {note ? <span data-part="hint">{note}</span> : null}
          </div>
        ) : null}
        <div
          data-part="track"
          role="progressbar"
          aria-label={label || undefined}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
        >
          <div data-part="bar" />
        </div>
      </div>
    </>
  )
}
