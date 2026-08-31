import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart017Step = {
  label: string
  value: number
}

export type Chart017Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  steps?: Chart017Step[]
  unit?: string
  accent?: string
}

// Идея компонента: симметричная воронка настоящей формы. Каждая ступень —
// трапеция на clip-path: верх шире низа ровно настолько, насколько упало
// значение, поэтому скос между шагами и есть потеря. Между ступенями
// подписан процент перехода — цифра, ради которой воронку и рисуют.
const STYLES = `
:where([data-vibeui-block="chart-017"]){
--vibeui-chart-017-bg:oklch(1 0 0);
--vibeui-chart-017-fg:oklch(0.22 0.014 265);
--vibeui-chart-017-muted:oklch(0.55 0.014 265);
--vibeui-chart-017-border:oklch(0.91 0.006 265);
--vibeui-chart-017-accent:oklch(0.55 0.17 285);
--vibeui-chart-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-017"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-017-bg);
border:1px solid var(--vibeui-chart-017-border);border-radius:0.875rem;
color:var(--vibeui-chart-017-fg);font-family:var(--vibeui-chart-017-font);
}
[data-vibeui-block="chart-017"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="chart-017"] ol{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}
[data-vibeui-block="chart-017"] [data-part="step"]{display:flex;flex-direction:column}
/* Трапеция целиком живёт в clip-path: никакого SVG и никаких псевдоэлементов
   с бордерами, поэтому фигура тянется вместе с контейнером. */
[data-vibeui-block="chart-017"] [data-part="slab"]{
display:flex;align-items:center;justify-content:center;gap:0.5rem;
height:2.75rem;color:oklch(1 0 0);font-size:0.8125rem;font-weight:600;
background:var(--vibeui-chart-017-slab);
clip-path:polygon(var(--vibeui-chart-017-tl) 0%,var(--vibeui-chart-017-tr) 0%,var(--vibeui-chart-017-br) 100%,var(--vibeui-chart-017-bl) 100%);
}
[data-vibeui-block="chart-017"] [data-part="count"]{font-variant-numeric:tabular-nums;opacity:0.85}
[data-vibeui-block="chart-017"] [data-part="drop"]{
display:flex;align-items:center;justify-content:center;gap:0.375rem;
padding:0.1875rem 0;font-size:0.6875rem;color:var(--vibeui-chart-017-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-017"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-chart-017-muted)}
[data-vibeui-block="chart-017"] [data-part="data"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Chart017Step[] = [
  { label: "Открыли каталог", value: 12_400 },
  { label: "Открыли компонент", value: 7_150 },
  { label: "Нажали Copy for AI", value: 3_020 },
  { label: "Установили", value: 1_260 },
  { label: "Вернулись за вторым", value: 540 },
]

/**
 * Воронка конверсии симметричными трапециями с процентом перехода.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart017({
  title = "Воронка установки",
  steps = DEFAULT_STEPS,
  unit = "человек за неделю",
  accent,
  className,
  style,
  ...props
}: Chart017Props) {
  const first = steps[0]?.value || 1

  const palette = {
    ...(accent ? { "--vibeui-chart-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-017" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-017"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <ol>
          {steps.map((step, index) => {
            const next = steps[index + 1]
            // Минимум в 12 % ширины: нулевая ступень не должна схлопываться
            // в линию, иначе последний шаг исчезает с картинки.
            const topShare = Math.max(step.value / first, 0.12)
            const bottomShare = Math.max(
              (next?.value ?? step.value) / first,
              0.12,
            )
            const edges = {
              "--vibeui-chart-017-tl": `${((1 - topShare) / 2) * 100}%`,
              "--vibeui-chart-017-tr": `${((1 + topShare) / 2) * 100}%`,
              "--vibeui-chart-017-bl": `${((1 - bottomShare) / 2) * 100}%`,
              "--vibeui-chart-017-br": `${((1 + bottomShare) / 2) * 100}%`,
              "--vibeui-chart-017-slab": `color-mix(in oklab,var(--vibeui-chart-017-accent) ${100 - index * 13}%,oklch(0.72 0.05 285))`,
            } as CSSProperties

            return (
              <li key={step.label} data-part="step">
                <div data-part="slab" style={edges}>
                  <span>{step.label}</span>
                  <span data-part="count">{step.value}</span>
                </div>
                {next ? (
                  <p data-part="drop">
                    ↓ переход {Math.round((next.value / step.value) * 100)}% ·
                    потеря {step.value - next.value}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ol>
        <p data-part="unit">
          Единица измерения: {unit}. Ширина ступени — доля от первого шага.
        </p>
        <table data-part="data">
          <caption>
            {title}, {unit}
          </caption>
          <tbody>
            {steps.map((step) => (
              <tr key={step.label}>
                <th scope="row">{step.label}</th>
                <td>{step.value}</td>
                <td>
                  {Math.round((step.value / first) * 100)}% от первого шага
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </>
  )
}
