import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart008Step = {
  label: string
  value: number
}

export type Chart008Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  steps?: Chart008Step[]
  unit?: string
  accent?: string
}

// Идея компонента: воронка с переходами между шагами. Главное в ней — не
// ширина полос, а процент перехода от предыдущего шага: именно он показывает,
// где теряются люди. Абсолютные числа остаются рядом, потому что «падение на
// 40%» с базы в двадцать человек ничего не значит.
const STYLES = `
:where([data-vibeui-block="chart-008"]){
--vibeui-chart-008-bg:oklch(1 0 0);
--vibeui-chart-008-fg:oklch(0.22 0.014 265);
--vibeui-chart-008-muted:oklch(0.56 0.014 265);
--vibeui-chart-008-border:oklch(0.91 0.006 265);
--vibeui-chart-008-accent:oklch(0.55 0.17 265);
--vibeui-chart-008-drop:oklch(0.58 0.16 25);
--vibeui-chart-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-008-bg);
border:1px solid var(--vibeui-chart-008-border);border-radius:0.875rem;
color:var(--vibeui-chart-008-fg);font-family:var(--vibeui-chart-008-font);
}
[data-vibeui-block="chart-008"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-008"] ol{display:flex;flex-direction:column;gap:0.375rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="chart-008"] [data-part="row"]{display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="chart-008"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;font-size:0.8125rem;
}
[data-vibeui-block="chart-008"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-008"] [data-part="bar"]{
height:1.25rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-chart-008-accent) var(--vibeui-chart-008-mix,80%),oklch(0.94 0.005 265));
}
/* Переход между шагами: именно он показывает, где теряются люди. */
[data-vibeui-block="chart-008"] [data-part="drop"]{
display:flex;align-items:center;gap:0.375rem;padding-left:0.25rem;
font-size:0.75rem;color:var(--vibeui-chart-008-muted);
}
[data-vibeui-block="chart-008"] [data-part="drop"] b{color:var(--vibeui-chart-008-drop);font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-008"] [data-part="drop"]::before{
content:"";width:0.375rem;height:0.375rem;
border-left:1.5px solid var(--vibeui-chart-008-muted);
border-bottom:1.5px solid var(--vibeui-chart-008-muted);
transform:rotate(-45deg) translateY(-0.0625rem);
}
[data-vibeui-block="chart-008"] [data-part="unit"]{font-size:0.75rem;color:var(--vibeui-chart-008-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Chart008Step[] = [
  { label: "Открыли каталог", value: 4820 },
  { label: "Открыли компонент", value: 2140 },
  { label: "Скопировали команду", value: 860 },
  { label: "Поставили компонент", value: 412 },
]

/**
 * Воронка с процентами перехода между шагами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart008({
  title = "Путь до установки",
  steps = DEFAULT_STEPS,
  unit = "человек за неделю",
  accent,
  className,
  style,
  ...props
}: Chart008Props) {
  const first = steps[0]?.value || 1

  const palette = {
    ...(accent ? { "--vibeui-chart-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-008" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-008"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <ol>
          {steps.map((step, index) => {
            const previous = steps[index - 1]
            const share = Math.round((step.value / first) * 100)
            const drop = previous
              ? Math.round((1 - step.value / previous.value) * 100)
              : 0

            return (
              <li key={step.label}>
                {previous ? (
                  <p data-part="drop">
                    ушли <b>{drop}%</b> от предыдущего шага
                  </p>
                ) : null}
                <div data-part="row">
                  <p data-part="head">
                    <span>{step.label}</span>
                    <span data-part="value">
                      {step.value} · {share}%
                    </span>
                  </p>
                  <div
                    data-part="bar"
                    role="img"
                    aria-label={`${step.label}: ${step.value} ${unit}, ${share}% от первого шага`}
                    style={
                      {
                        width: `${Math.max(12, share)}%`,
                        "--vibeui-chart-008-mix": `${Math.max(35, share)}%`,
                      } as CSSProperties
                    }
                  />
                </div>
              </li>
            )
          })}
        </ol>
        <figcaption data-part="unit">{unit}</figcaption>
      </figure>
    </>
  )
}
