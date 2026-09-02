import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge015Props = ComponentPropsWithoutRef<"span"> & {
  size?: "sm" | "md" | "lg"
  count?: number
  accent?: string
  /** Пусто — плашка держит собственный нейтральный фон. */
  background?: string
}

// Идея компонента: размерная шкала из одной переменной. Атрибут size меняет
// только шаг сетки --unit, а высота, кегль, отступы, радиус, точка и зазор
// считаются от него через calc. Поэтому маленькая плашка не выглядит просто
// уменьшенной копией: пропорции сохраняются, а не масштабируются на глаз.
const STYLES = `
:where([data-vibeui-block="badge-015"]){
--vibeui-badge-015-unit:0.3125rem;
--vibeui-badge-015-bg:light-dark(oklch(0.97 0.004 265),oklch(0.27 0.009 265));
--vibeui-badge-015-fg:light-dark(oklch(0.3 0.014 265),oklch(0.93 0.006 265));
--vibeui-badge-015-border:light-dark(oklch(0.9 0.006 265),oklch(0.4 0.011 265));
--vibeui-badge-015-accent:light-dark(oklch(0.55 0.16 265),oklch(0.74 0.15 265));
--vibeui-badge-015-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
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
 * Плашка с размерной шкалой sm/md/lg: всё считается от одного шага.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge015({
  size = "md",
  count = 8,
  accent,
  background = "",
  className,
  style,
  children = "В работе",
  ...props
}: Badge015Props) {
  const safe = Math.max(0, Math.round(count))

  const palette = {
    ...(accent ? { "--vibeui-badge-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-badge-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

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
        style={palette}
      >
        <span data-part="dot" aria-hidden="true" />
        {children}
        {safe > 0 ? <span data-part="count">{safe}</span> : null}
      </span>
    </>
  )
}
