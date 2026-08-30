import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge012Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  label?: string
  /** Сколько осталось: без оценки ожидание выглядит зависанием. */
  hint?: string
}

// Идея компонента: плашка процесса. Кольцо крутится, но текст обязателен:
// один спиннер не отвечает, что именно происходит и стоит ли ждать. При
// prefers-reduced-motion вращение сменяется ровной точкой — состояние
// остаётся видимым, движение уходит.
const STYLES = `
:where([data-vibeui-block="badge-012"]){
--vibeui-badge-012-bg:oklch(0.96 0.004 265);
--vibeui-badge-012-fg:oklch(0.32 0.014 265);
--vibeui-badge-012-muted:oklch(0.55 0.014 265);
--vibeui-badge-012-track:oklch(0.86 0.008 265);
--vibeui-badge-012-accent:oklch(0.58 0.16 265);
--vibeui-badge-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-012"]{
display:inline-flex;align-items:center;gap:0.4375rem;
height:1.625rem;padding:0 0.6875rem 0 0.5625rem;
border-radius:9999px;
background:var(--vibeui-badge-012-bg);color:var(--vibeui-badge-012-fg);
font-family:var(--vibeui-badge-012-font);font-size:0.75rem;font-weight:600;
line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-012"] [data-part="spinner"]{
flex:none;width:0.6875rem;height:0.6875rem;box-sizing:border-box;
border:2px solid var(--vibeui-badge-012-track);
border-top-color:var(--vibeui-badge-012-accent);
border-radius:9999px;
animation:vibeui-badge-012-spin .7s linear infinite;
}
@keyframes vibeui-badge-012-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="badge-012"] [data-part="hint"]{font-weight:500;color:var(--vibeui-badge-012-muted)}
/* Без движения состояние остаётся видимым: кольцо превращается в точку. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="badge-012"] *{animation:none!important;transition:none!important}
[data-vibeui-block="badge-012"] [data-part="spinner"]{
border-color:var(--vibeui-badge-012-accent);background:var(--vibeui-badge-012-accent);
}
}
`

/**
 * Плашка процесса: кольцо и обязательный текст, что происходит.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge012({
  label = "Отправляем",
  hint = "осталось ~20 с",
  className,
  style,
  ...props
}: Badge012Props) {
  return (
    <>
      <style href="vibeui-badge-012" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-012"
        className={className}
        style={style as CSSProperties}
        role="status"
        aria-live="polite"
      >
        <span data-part="spinner" aria-hidden="true" />
        {label}
        {hint ? <span data-part="hint">{hint}</span> : null}
      </span>
    </>
  )
}
