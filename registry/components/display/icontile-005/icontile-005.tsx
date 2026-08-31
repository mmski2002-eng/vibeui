import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile005Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  glyph?: string
  count?: number
  label?: string
  max?: number
}

// Идея компонента: плитка со счётчиком в углу. Счётчик отделён от плитки
// кольцом цвета подложки, а не отступом: кольцо режет плитку и бейдж читается
// на любом фоне, не отъезжая от угла. Число обрезано порогом «99+» — трёхзначный
// счётчик растягивает бейдж и ломает угол. Ноль прячет бейдж: пустой кружок
// сообщает «непрочитанных нет» хуже, чем его отсутствие.
const STYLES = `
:where([data-vibeui-block="icontile-005"]){
--vibeui-icontile-005-size:2.5rem;
--vibeui-icontile-005-hue:262;
--vibeui-icontile-005-surface:oklch(1 0 0);
--vibeui-icontile-005-border:oklch(0.9 0.006 265);
--vibeui-icontile-005-fg:oklch(0.26 0.014 265);
--vibeui-icontile-005-badge:oklch(0.56 0.2 25);
--vibeui-icontile-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: подпись тёмная, а кольцо бейджа берёт её цвет. */
[data-vibeui-block="icontile-005"]{
display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.5rem 0.875rem 0.5rem 0.5rem;
background:var(--vibeui-icontile-005-surface);
border:1px solid var(--vibeui-icontile-005-border);border-radius:0.875rem;
font-family:var(--vibeui-icontile-005-font);color:var(--vibeui-icontile-005-fg);
font-size:0.8125rem;
}
[data-vibeui-block="icontile-005"] [data-part="tile"]{
position:relative;display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-005-size);height:var(--vibeui-icontile-005-size);
border-radius:0.75rem;
background:oklch(0.93 0.04 var(--vibeui-icontile-005-hue));
color:oklch(0.44 0.16 var(--vibeui-icontile-005-hue));
font-size:calc(var(--vibeui-icontile-005-size) * 0.44);line-height:1;
}
/* Кольцо цвета подложки режет плитку: бейдж читается на любом фоне. */
[data-vibeui-block="icontile-005"] [data-part="badge"]{
position:absolute;top:-0.3125rem;right:-0.3125rem;
display:inline-flex;align-items:center;justify-content:center;
min-width:1.125rem;height:1.125rem;padding:0 0.25rem;box-sizing:border-box;
border-radius:9999px;
background:var(--vibeui-icontile-005-badge);
color:oklch(0.99 0 0);
box-shadow:0 0 0 2px var(--vibeui-icontile-005-surface);
font-size:0.625rem;font-weight:700;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="icontile-005"] [data-part="label"]{font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="icontile-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Плитка со счётчиком в углу: кольцо подложки и порог «99+».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile005({
  glyph = "✉",
  count = 12,
  label = "Входящие",
  max = 99,
  className,
  style,
  ...props
}: Icontile005Props) {
  const shown = count > max ? `${max}+` : String(count)

  return (
    <>
      <style href="vibeui-icontile-005" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="icontile-005"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="tile">
          <span aria-hidden="true">{glyph}</span>
          {count > 0 ? (
            <span data-part="badge" aria-label={`${shown} непрочитанных`}>
              {shown}
            </span>
          ) : null}
        </span>
        <span data-part="label">{label}</span>
      </span>
    </>
  )
}
