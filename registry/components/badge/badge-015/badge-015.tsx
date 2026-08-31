import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge015Props = ComponentPropsWithoutRef<"span"> & {
  size?: "sm" | "md" | "lg"
  count?: number
}

// Идея компонента: размерная шкала из одной переменной. Атрибут size меняет
// только шаг сетки --unit, а высота, кегль, отступы, радиус, точка и зазор
// считаются от него через calc. Поэтому маленькая плашка не выглядит просто
// уменьшенной копией: пропорции сохраняются, а не масштабируются на глаз.
const STYLES = `
:where([data-vibeui-block="badge-015"]){
--vibeui-badge-015-unit:0.3125rem;
--vibeui-badge-015-bg:oklch(0.97 0.004 265);
--vibeui-badge-015-fg:oklch(0.3 0.014 265);
--vibeui-badge-015-border:oklch(0.9 0.006 265);
--vibeui-badge-015-accent:oklch(0.55 0.16 265);
--vibeui-badge-015-muted:oklch(0.55 0.014 265);
--vibeui-badge-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-015"][data-size="sm"]{--vibeui-badge-015-unit:0.25rem}
[data-vibeui-block="badge-015"][data-size="md"]{--vibeui-badge-015-unit:0.3125rem}
[data-vibeui-block="badge-015"][data-size="lg"]{--vibeui-badge-015-unit:0.375rem}
[data-vibeui-block="badge-015"]{
display:inline-flex;align-items:center;box-sizing:border-box;
/* Всё до единого размера — производные шага, никаких отдельных таблиц. */
gap:calc(var(--vibeui-badge-015-unit) * 1.6);
height:calc(var(--vibeui-badge-015-unit) * 6);
padding:0 calc(var(--vibeui-badge-015-unit) * 2.4);
border:1px solid var(--vibeui-badge-015-border);
border-radius:calc(var(--vibeui-badge-015-unit) * 3);
background:var(--vibeui-badge-015-bg);color:var(--vibeui-badge-015-fg);
font-family:var(--vibeui-badge-015-font);
font-size:calc(var(--vibeui-badge-015-unit) * 3);
font-weight:600;line-height:1;vertical-align:middle;
}
[data-vibeui-block="badge-015"] [data-part="dot"]{
flex:none;border-radius:9999px;background:var(--vibeui-badge-015-accent);
width:calc(var(--vibeui-badge-015-unit) * 1.6);
height:calc(var(--vibeui-badge-015-unit) * 1.6);
}
[data-vibeui-block="badge-015"] [data-part="count"]{
color:var(--vibeui-badge-015-muted);font-variant-numeric:tabular-nums;font-weight:500;
padding-left:calc(var(--vibeui-badge-015-unit) * 1.2);
margin-left:calc(var(--vibeui-badge-015-unit) * 0.4);
border-left:1px solid var(--vibeui-badge-015-border);
align-self:stretch;display:inline-flex;align-items:center;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-015"] *{animation:none!important;transition:none!important}}
`

/**
 * Плашка с размерной шкалой sm/md/lg: всё считается от одного шага.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge015({
  size = "md",
  count = 8,
  className,
  style,
  children = "В работе",
  ...props
}: Badge015Props) {
  const safe = Math.max(0, Math.round(count))

  return (
    <>
      <style href="vibeui-badge-015" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-015"
        data-size={size}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="dot" aria-hidden="true" />
        {children}
        {safe > 0 ? <span data-part="count">{safe}</span> : null}
      </span>
    </>
  )
}
