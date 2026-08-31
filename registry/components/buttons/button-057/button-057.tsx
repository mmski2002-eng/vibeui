import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button057Props = ComponentPropsWithoutRef<"button"> & {
  /** Число просмотров: большие значения сокращаются до «тыс.» и «млн». */
  count?: number
  /** Динамика за период: столбики рисуются из этих значений. */
  trend?: number[]
  accent?: string
}

// Идея компонента: кнопка-показатель. Она открывает подробную статистику,
// но уже в свёрнутом виде несёт число и форму динамики — столбики нормируются
// по максимуму массива, поэтому одинаково читаются и на десятках, и на
// миллионах. Полное число остаётся в title и aria-label: сокращение врёт.
const STYLES = `
:where([data-vibeui-block="button-057"]){
--vibeui-button-057-surface:oklch(1 0 0);
--vibeui-button-057-border:oklch(0.9 0.006 265);
--vibeui-button-057-fg:oklch(0.25 0.02 265);
--vibeui-button-057-muted:oklch(0.57 0.014 265);
--vibeui-button-057-accent:oklch(0.55 0.16 210);
--vibeui-button-057-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-057"]{
appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.625rem;
height:2.75rem;padding:0 0.875rem;border-radius:0.75rem;
border:1px solid var(--vibeui-button-057-border);
background:var(--vibeui-button-057-surface);color:var(--vibeui-button-057-fg);
font-family:var(--vibeui-button-057-font);font-size:0.875rem;font-weight:600;line-height:1;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="button-057"]:hover:not(:disabled){
border-color:var(--vibeui-button-057-accent);
background:color-mix(in oklab,var(--vibeui-button-057-accent) 5%,var(--vibeui-button-057-surface));
}
[data-vibeui-block="button-057"]:focus-visible{outline:2px solid var(--vibeui-button-057-accent);outline-offset:2px}
[data-vibeui-block="button-057"]:disabled{cursor:not-allowed;opacity:.55}
/* Глаз: окружность-веко и зрачок. */
[data-vibeui-block="button-057"] [data-part="eye"]{position:relative;flex:none;width:1.125rem;height:1.125rem}
[data-vibeui-block="button-057"] [data-part="eye"]::before{
content:"";position:absolute;left:0;top:50%;width:1.125rem;height:0.75rem;
margin-top:-0.375rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-button-057-accent);border-radius:0.5625rem 0.5625rem;
}
[data-vibeui-block="button-057"] [data-part="eye"]::after{
content:"";position:absolute;left:50%;top:50%;width:0.375rem;height:0.375rem;
margin:-0.1875rem 0 0 -0.1875rem;border-radius:50%;
background:var(--vibeui-button-057-accent);
}
[data-vibeui-block="button-057"] [data-part="count"]{
font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="button-057"] [data-part="unit"]{
color:var(--vibeui-button-057-muted);font-size:0.75rem;font-weight:500;
}
/* Столбики динамики: высота приходит из данных, ширина общая. */
[data-vibeui-block="button-057"] [data-part="spark"]{
display:flex;align-items:flex-end;gap:2px;height:1.125rem;margin-left:0.125rem;
}
[data-vibeui-block="button-057"] [data-part="spark"] i{
display:block;width:3px;border-radius:1.5px;
background:color-mix(in oklab,var(--vibeui-button-057-accent) 45%,transparent);
transition:background-color .16s ease;
}
[data-vibeui-block="button-057"] [data-part="spark"] i:last-child{background:var(--vibeui-button-057-accent)}
[data-vibeui-block="button-057"]:hover [data-part="spark"] i{background:var(--vibeui-button-057-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-057"] *{animation:none!important;transition:none!important}}
`

function compact(value: number) {
  if (value >= 1_000_000)
    return {
      text: (value / 1_000_000).toFixed(1).replace(".", ","),
      unit: "млн",
    }
  if (value >= 1000)
    return { text: (value / 1000).toFixed(1).replace(".", ","), unit: "тыс." }

  return { text: String(value), unit: "" }
}

/**
 * Кнопка со счётчиком просмотров и столбиками динамики.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button057({
  count = 12400,
  trend = [3, 5, 4, 7, 6, 9, 8, 12],
  accent,
  type = "button",
  className,
  style,
  children = "Просмотры",
  ...props
}: Button057Props) {
  const short = compact(count)
  const peak = Math.max(1, ...trend)

  const palette = {
    ...(accent ? { "--vibeui-button-057-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-057" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-057"
        className={className}
        style={palette}
        title={`${count.toLocaleString("ru-RU")} просмотров`}
        aria-label={`${children}: ${count.toLocaleString("ru-RU")}`}
      >
        <span data-part="eye" aria-hidden="true" />
        <span data-part="count" aria-hidden="true">
          {short.text}
        </span>
        {short.unit ? (
          <span data-part="unit" aria-hidden="true">
            {short.unit}
          </span>
        ) : null}
        <span data-part="spark" aria-hidden="true">
          {trend.map((value, index) => (
            <i
              key={index}
              style={{ height: `${Math.max(12, (value / peak) * 100)}%` }}
            />
          ))}
        </span>
      </button>
    </>
  )
}
