import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  hint?: string
  size?: "sm" | "md" | "lg"
  accent?: string
}

// Идея компонента: ожидание с подписью. Крутящееся кольцо само по себе не
// сообщает ничего — ни что происходит, ни сколько ждать; подпись обязательна,
// а не опциональна. При prefers-reduced-motion вращение сменяется пульсацией
// прозрачности: движение уходит, состояние остаётся.
const STYLES = `
:where([data-vibeui-block="spinner-001"]){
--vibeui-spinner-001-size:1.5rem;
--vibeui-spinner-001-bg:oklch(1 0 0);
--vibeui-spinner-001-border:oklch(0.9 0.006 265);
--vibeui-spinner-001-fg:oklch(0.28 0.014 265);
--vibeui-spinner-001-muted:oklch(0.56 0.014 265);
--vibeui-spinner-001-track:oklch(0.9 0.006 265);
--vibeui-spinner-001-accent:oklch(0.55 0.17 265);
--vibeui-spinner-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: ожидание показывают поверх любого фона. */
[data-vibeui-block="spinner-001"]{
display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-spinner-001-bg);
border:1px solid var(--vibeui-spinner-001-border);border-radius:0.875rem;
font-family:var(--vibeui-spinner-001-font);color:var(--vibeui-spinner-001-fg);
}
[data-vibeui-block="spinner-001"][data-size="sm"]{--vibeui-spinner-001-size:1rem}
[data-vibeui-block="spinner-001"][data-size="lg"]{--vibeui-spinner-001-size:2rem}
[data-vibeui-block="spinner-001"] [data-part="ring"]{
flex:none;box-sizing:border-box;
width:var(--vibeui-spinner-001-size);height:var(--vibeui-spinner-001-size);
border:2px solid var(--vibeui-spinner-001-track);
border-top-color:var(--vibeui-spinner-001-accent);
border-radius:9999px;
animation:vibeui-spinner-001-spin .7s linear infinite;
}
@keyframes vibeui-spinner-001-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-spinner-001-pulse{0%,100%{opacity:.35}50%{opacity:1}}
[data-vibeui-block="spinner-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="spinner-001"] [data-part="label"]{font-size:0.875rem;font-weight:650;line-height:1.2}
[data-vibeui-block="spinner-001"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-spinner-001-muted)}
/* Без движения состояние остаётся: кольцо не крутится, а пульсирует. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-001"] [data-part="ring"]{
animation:vibeui-spinner-001-pulse 1.6s ease-in-out infinite;
border-color:var(--vibeui-spinner-001-accent);
}
}
`

/**
 * Ожидание с обязательной подписью: кольцо без слов ничего не сообщает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner001({
  label = "Собираем каталог",
  hint = "Обычно занимает меньше минуты",
  size = "md",
  accent,
  className,
  style,
  ...props
}: Spinner001Props) {
  const palette = {
    ...(accent ? { "--vibeui-spinner-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-001"
        data-size={size}
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="ring" aria-hidden="true" />
        <span data-part="text">
          <span data-part="label">{label}</span>
          {hint ? <span data-part="hint">{hint}</span> : null}
        </span>
      </div>
    </>
  )
}
