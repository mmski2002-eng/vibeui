import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card002Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "title"
> & {
  title?: string
  value?: string
  change?: number
  period?: string
  /** Ряд значений для полоски динамики: 6–12 чисел. */
  series?: number[]
  goodDirection?: "up" | "down"
  accent?: string
}

// Идея компонента: карточка показателя. Число крупно, изменение рядом со
// знаком и стрелкой, а под ними — столбики динамики: одно число без истории
// не отвечает, случайность это или тренд. Столбики нарисованы флексом с
// процентными высотами, поэтому график не тянет за собой библиотеку.
const STYLES = `
:where([data-vibeui-block="card-002"]){
--vibeui-card-002-bg:oklch(1 0 0);
--vibeui-card-002-fg:oklch(0.22 0.014 265);
--vibeui-card-002-muted:oklch(0.56 0.014 265);
--vibeui-card-002-border:oklch(0.91 0.006 265);
--vibeui-card-002-accent:oklch(0.55 0.17 265);
--vibeui-card-002-good:oklch(0.55 0.15 152);
--vibeui-card-002-bad:oklch(0.55 0.18 25);
--vibeui-card-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="card-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:16rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-card-002-bg);
border:1px solid var(--vibeui-card-002-border);border-radius:0.875rem;
color:var(--vibeui-card-002-fg);font-family:var(--vibeui-card-002-font);
}
[data-vibeui-block="card-002"] [data-part="title"]{
margin:0;font-size:0.8125rem;font-weight:600;color:var(--vibeui-card-002-muted);
}
[data-vibeui-block="card-002"] [data-part="row"]{display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="card-002"] [data-part="value"]{
font-size:1.75rem;font-weight:680;line-height:1.05;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-002"] [data-part="change"]{
display:inline-flex;align-items:center;gap:0.25rem;
font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-002"][data-mood="good"] [data-part="change"]{color:var(--vibeui-card-002-good)}
[data-vibeui-block="card-002"][data-mood="bad"] [data-part="change"]{color:var(--vibeui-card-002-bad)}
[data-vibeui-block="card-002"][data-mood="flat"] [data-part="change"]{color:var(--vibeui-card-002-muted)}
[data-vibeui-block="card-002"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
}
[data-vibeui-block="card-002"][data-direction="up"] [data-part="arrow"]{transform:rotate(-45deg)}
[data-vibeui-block="card-002"][data-direction="down"] [data-part="arrow"]{transform:rotate(135deg)}
/* Столбики на флексе с процентными высотами: история показателя без
   библиотеки графиков и без единого пикселя разметки. */
[data-vibeui-block="card-002"] [data-part="chart"]{
display:flex;align-items:flex-end;gap:0.1875rem;height:2.25rem;margin-top:0.125rem;
}
[data-vibeui-block="card-002"] [data-part="bar"]{
flex:1;border-radius:0.125rem 0.125rem 0 0;
background:color-mix(in oklab,var(--vibeui-card-002-accent) 22%,oklch(1 0 0));
}
[data-vibeui-block="card-002"] [data-part="bar"]:last-child{background:var(--vibeui-card-002-accent)}
[data-vibeui-block="card-002"] [data-part="period"]{font-size:0.75rem;color:var(--vibeui-card-002-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SERIES = [42, 55, 48, 61, 58, 72, 69, 84]

/**
 * Карточка показателя: число, изменение и столбики динамики.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card002({
  title = "Выручка за неделю",
  value = "1 284 000 ₽",
  change = 12.4,
  period = "против прошлой недели",
  series = DEFAULT_SERIES,
  goodDirection = "up",
  accent,
  className,
  style,
  ...props
}: Card002Props) {
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat"
  const mood =
    direction === "flat" ? "flat" : direction === goodDirection ? "good" : "bad"
  const max = Math.max(...series, 1)

  const palette = {
    ...(accent ? { "--vibeui-card-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-002" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-vibeui-block="card-002"
        data-direction={direction}
        data-mood={mood}
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <p data-part="row">
          <span data-part="value">{value}</span>
          <span
            data-part="change"
            aria-label={`Изменение ${change > 0 ? "плюс" : "минус"} ${Math.abs(change)} процента`}
          >
            <span data-part="arrow" aria-hidden="true" />
            {change > 0 ? "+" : change < 0 ? "−" : ""}
            {Math.abs(change)}%
          </span>
        </p>
        <div data-part="chart" aria-hidden="true">
          {series.map((point, index) => (
            <span
              key={index}
              data-part="bar"
              style={{ height: `${Math.max(8, (point / max) * 100)}%` }}
            />
          ))}
        </div>
        <p data-part="period">{period}</p>
      </article>
    </>
  )
}
