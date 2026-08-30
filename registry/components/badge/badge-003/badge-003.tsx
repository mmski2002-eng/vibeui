import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge003Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  value?: number
  /** Порог, после которого печатается «99+». */
  max?: number
  label?: string
  tone?: "neutral" | "accent" | "danger"
}

// Идея компонента: счётчик, который не растягивает соседей. Ширина задана
// минимумом в высоту плашки, цифры табличные, а всё, что больше порога,
// печатается как «99+»: настоящая тысяча уведомлений разорвала бы вёрстку и
// всё равно ничего не сообщила бы точнее.
const STYLES = `
:where([data-vibeui-block="badge-003"]){
--vibeui-badge-003-size:1.25rem;
--vibeui-badge-003-bg:oklch(0.93 0.006 265);
--vibeui-badge-003-fg:oklch(0.3 0.014 265);
--vibeui-badge-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
[data-vibeui-block="badge-003"][data-tone="accent"]{--vibeui-badge-003-bg:oklch(0.58 0.16 265);--vibeui-badge-003-fg:oklch(0.99 0.01 265)}
[data-vibeui-block="badge-003"][data-tone="danger"]{--vibeui-badge-003-bg:oklch(0.58 0.2 25);--vibeui-badge-003-fg:oklch(0.99 0.01 25)}
[data-vibeui-block="badge-003"][data-zero="true"]{opacity:.45}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Счётчик с порогом «99+» и табличными цифрами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge003({
  value = 128,
  max = 99,
  label = "непрочитанных",
  tone = "danger",
  className,
  style,
  ...props
}: Badge003Props) {
  const safe = Math.max(0, Math.round(value))
  const text = safe > max ? `${max}+` : String(safe)

  return (
    <>
      <style href="vibeui-badge-003" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-003"
        data-tone={tone}
        data-zero={safe === 0}
        className={className}
        style={style as CSSProperties}
        aria-label={`${safe} ${label}`}
      >
        <span aria-hidden="true">{text}</span>
      </span>
    </>
  )
}
