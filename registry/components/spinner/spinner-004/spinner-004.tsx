import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  value?: number
  label?: string
  size?: "sm" | "md" | "lg"
}

// Идея компонента: кольцо с числом внутри. Дуга нарисована conic-gradient и
// вырезана радиальной маской, поэтому кольцо остаётся одним элементом без
// svg и без второго круга-заглушки в центре. Число набрано моноширинными
// цифрами: при обычных цифрах ширина «11 %» и «88 %» разная, и подпись
// дёргается на каждом обновлении. Значение зажато в 0–100 внутри компонента.
const STYLES = `
:where([data-vibeui-block="spinner-004"]){
--vibeui-spinner-004-size:4.5rem;
--vibeui-spinner-004-thickness:0.5rem;
--vibeui-spinner-004-value:0;
--vibeui-spinner-004-surface:oklch(1 0 0);
--vibeui-spinner-004-border:oklch(0.9 0.006 265);
--vibeui-spinner-004-fg:oklch(0.24 0.014 265);
--vibeui-spinner-004-muted:oklch(0.55 0.014 265);
--vibeui-spinner-004-track:oklch(0.93 0.006 265);
--vibeui-spinner-004-accent:oklch(0.55 0.17 262);
--vibeui-spinner-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: число и подпись тёмные. */
[data-vibeui-block="spinner-004"]{
display:inline-flex;align-items:center;gap:0.875rem;
box-sizing:border-box;padding:0.875rem 1.125rem 0.875rem 0.875rem;
background:var(--vibeui-spinner-004-surface);
border:1px solid var(--vibeui-spinner-004-border);border-radius:1rem;
font-family:var(--vibeui-spinner-004-font);color:var(--vibeui-spinner-004-fg);
}
[data-vibeui-block="spinner-004"][data-size="sm"]{--vibeui-spinner-004-size:3.25rem;--vibeui-spinner-004-thickness:0.375rem}
[data-vibeui-block="spinner-004"][data-size="lg"]{--vibeui-spinner-004-size:6rem;--vibeui-spinner-004-thickness:0.625rem}
[data-vibeui-block="spinner-004"] [data-part="dial"]{
position:relative;display:grid;place-items:center;flex:none;
width:var(--vibeui-spinner-004-size);height:var(--vibeui-spinner-004-size);
}
/* Дуга — conic-gradient с радиальной маской: одно кольцо без svg и заглушек. */
[data-vibeui-block="spinner-004"] [data-part="ring"]{
position:absolute;inset:0;border-radius:9999px;
background:conic-gradient(
var(--vibeui-spinner-004-accent) calc(var(--vibeui-spinner-004-value) * 1%),
var(--vibeui-spinner-004-track) 0);
mask:radial-gradient(farthest-side,transparent calc(100% - var(--vibeui-spinner-004-thickness)),#000 calc(100% - var(--vibeui-spinner-004-thickness)));
}
/* Число лежит поверх кольца, а не внутри него: маска вырезала бы и цифры. */
[data-vibeui-block="spinner-004"] [data-part="value"]{
position:relative;
font-size:calc(var(--vibeui-spinner-004-size) * 0.24);
font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="spinner-004"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;
}
[data-vibeui-block="spinner-004"] [data-part="label"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="spinner-004"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-spinner-004-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="spinner-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Кольцо прогресса с процентом внутри на conic-gradient и маске.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner004({
  value = 68,
  label = "Загружаем компоненты",
  size = "md",
  className,
  style,
  ...props
}: Spinner004Props) {
  const safe = Math.min(100, Math.max(0, Math.round(value)))
  const palette = {
    "--vibeui-spinner-004-value": safe,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-004"
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
          <span data-part="ring" aria-hidden="true" />
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
