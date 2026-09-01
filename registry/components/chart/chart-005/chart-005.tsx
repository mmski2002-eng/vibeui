import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart005Part = {
  label: string
  value: number
  hue?: number
}

export type Chart005Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  parts?: Chart005Part[]
  total?: string
  accent?: string
}

// Идея компонента: одна полоса, разложенная на доли. Она отвечает на вопрос
// «из чего состоит целое» и занимает одну строку — там, где кольцо съело бы
// треть карточки. Доли меньше пяти процентов не подписываются внутри: текст
// в них всё равно не помещается, для них есть легенда.
const STYLES = `
:where([data-vibeui-block="chart-005"]){
--vibeui-chart-005-bg:oklch(1 0 0);
--vibeui-chart-005-fg:oklch(0.22 0.014 265);
--vibeui-chart-005-muted:oklch(0.56 0.014 265);
--vibeui-chart-005-border:oklch(0.91 0.006 265);
--vibeui-chart-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-005"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-005-bg);
border:1px solid var(--vibeui-chart-005-border);border-radius:0.875rem;
color:var(--vibeui-chart-005-fg);font-family:var(--vibeui-chart-005-font);
}
[data-vibeui-block="chart-005"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="chart-005"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-005"] [data-part="total"]{font-size:0.875rem;font-weight:680;font-variant-numeric:tabular-nums}
/* Полоса — флекс с долями: ширина каждой части задаётся её значением. */
[data-vibeui-block="chart-005"] [data-part="bar"]{
display:flex;height:1.5rem;overflow:hidden;border-radius:0.5rem;
}
[data-vibeui-block="chart-005"] [data-part="part"]{
display:flex;align-items:center;justify-content:center;min-width:0;
background:oklch(0.62 0.15 var(--vibeui-chart-005-hue,250));
color:oklch(0.99 0.01 265);
font-size:0.6875rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-005"] [data-part="part"] + [data-part="part"]{box-shadow:inset 1px 0 0 oklch(1 0 0 / 55%)}
/* Доля меньше пяти процентов не подписывается: текст в неё не влезает. */
[data-vibeui-block="chart-005"] [data-part="part"][data-narrow="true"] span{display:none}
[data-vibeui-block="chart-005"] ul{display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="chart-005"] li{display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-chart-005-muted)}
[data-vibeui-block="chart-005"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:0.1875rem;
background:oklch(0.62 0.15 var(--vibeui-chart-005-hue,250));
}
[data-vibeui-block="chart-005"] [data-part="legend-value"]{color:var(--vibeui-chart-005-fg);font-weight:650;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PARTS: Chart005Part[] = [
  { label: "Разработка", value: 46, hue: 250 },
  { label: "Дизайн", value: 24, hue: 150 },
  { label: "Поддержка", value: 18, hue: 30 },
  { label: "Инфраструктура", value: 8, hue: 300 },
  { label: "Прочее", value: 4, hue: 200 },
]

/**
 * Полоса, разложенная на доли: «из чего состоит целое» в одну строку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart005({
  title = "Расходы месяца",
  parts = DEFAULT_PARTS,
  total = "1 240 000 ₽",
  accent,
  className,
  style,
  ...props
}: Chart005Props) {
  const sum = parts.reduce((value, part) => value + part.value, 0) || 1

  const palette = {
    ...(accent ? { "--vibeui-chart-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-005" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-005"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <figcaption data-part="title">{title}</figcaption>
          <span data-part="total">{total}</span>
        </div>
        <div data-part="bar">
          {parts.map((part) => {
            const percent = Math.round((part.value / sum) * 100)

            return (
              <span
                key={part.label}
                data-part="part"
                data-narrow={percent < 8}
                role="img"
                aria-label={`${part.label}: ${percent}%`}
                style={
                  {
                    "--vibeui-chart-005-hue": part.hue ?? 250,
                    flexBasis: `${percent}%`,
                  } as CSSProperties
                }
              >
                <span>{percent}%</span>
              </span>
            )
          })}
        </div>
        <ul>
          {parts.map((part) => (
            <li key={part.label}>
              <span
                data-part="dot"
                aria-hidden="true"
                style={
                  { "--vibeui-chart-005-hue": part.hue ?? 250 } as CSSProperties
                }
              />
              {part.label}
              <span data-part="legend-value">
                {Math.round((part.value / sum) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </figure>
    </>
  )
}
