import type { ComponentProps, CSSProperties } from "react"

export type Chart017Step = {
  label: string
  value: number
}

export type Chart017Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  steps?: Chart017Step[]
  unit?: string
  /** Подпись между ступенями: {rate} и {loss}. */
  dropLabel?: string
  /** Подпись под воронкой: {unit}. */
  unitLabel?: string
  /** Доля в скрытой таблице: {share}. */
  shareLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: симметричная воронка настоящей формы. Каждая ступень —
// трапеция на clip-path: верх шире низа ровно настолько, насколько упало
// значение, поэтому скос между шагами и есть потеря. Между ступенями
// подписан процент перехода — цифра, ради которой воронку и рисуют.
//
// Тема берётся из color-scheme окружения через light-dark(): воронка темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-017"]){
--vibeui-chart-017-bg:transparent;
--vibeui-chart-017-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-chart-017-muted:color-mix(in oklab,var(--vibeui-chart-017-fg) 68%,transparent);
--vibeui-chart-017-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-chart-017-accent:light-dark(oklch(0.55 0.17 285),oklch(0.62 0.17 285));
--vibeui-chart-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-017"]{color-scheme:dark}
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
box-sizing:border-box;padding-inline:var(--vibeui-chart-017-inset);
height:2.75rem;color:oklch(1 0 0);font-size:0.8125rem;font-weight:600;
background:var(--vibeui-chart-017-slab);
clip-path:polygon(var(--vibeui-chart-017-tl) 0%,var(--vibeui-chart-017-tr) 0%,var(--vibeui-chart-017-br) 100%,var(--vibeui-chart-017-bl) 100%);
}
/* Подпись живёт внутри узкой части трапеции: за её краем clip-path режет
   текст посреди буквы. Ширину задаёт padding по узкой стороне, лишнее
   уходит в многоточие, а число не сжимается — цифры не усекают. */
[data-vibeui-block="chart-017"] [data-part="label"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="chart-017"] [data-part="count"]{flex:none;font-variant-numeric:tabular-nums;opacity:0.85}
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

const MIN_SHARE = 0.34

// Подписи короткие намеренно: ступень тем уже, чем меньше её доля, и длинное
// название в нижних ступенях не помещается ни при какой вёрстке.
const DEFAULT_STEPS: Chart017Step[] = [
  { label: "Каталог", value: 12_400 },
  { label: "Компонент", value: 7_150 },
  { label: "Copy for AI", value: 3_020 },
  { label: "Установка", value: 1_260 },
  { label: "Возврат", value: 540 },
]

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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Воронка конверсии симметричными трапециями с процентом перехода.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart017({
  title = "Воронка установки",
  steps = DEFAULT_STEPS,
  unit = "человек за неделю",
  dropLabel = "↓ переход {rate}% · потеря {loss}",
  unitLabel = "Единица измерения: {unit}. Ширина ступени — доля от первого шага.",
  shareLabel = "{share}% от первого шага",
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart017Props) {
  const first = steps[0]?.value || 1

  const palette = {
    ...(accent ? { "--vibeui-chart-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-017" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-017"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <ol>
          {steps.map((step, index) => {
            const next = steps[index + 1]
            // Минимум в 34 % ширины: ступень не должна схлопываться в линию,
            // а в узкой части обязаны помещаться число и хвост подписи.
            const topShare = Math.max(step.value / first, MIN_SHARE)
            const bottomShare = Math.max(
              (next?.value ?? step.value) / first,
              MIN_SHARE,
            )
            // Ширина трапеции на высоте строки: середина минус запас на скос,
            // потому что подпись стоит по центру, а не по краю ступени.
            const narrow =
              (topShare + bottomShare) / 2 -
              0.2 * Math.abs(topShare - bottomShare)
            const edges = {
              "--vibeui-chart-017-inset": `calc(${((1 - narrow) / 2) * 100}% + 0.375rem)`,
              "--vibeui-chart-017-tl": `${((1 - topShare) / 2) * 100}%`,
              "--vibeui-chart-017-tr": `${((1 + topShare) / 2) * 100}%`,
              "--vibeui-chart-017-bl": `${((1 - bottomShare) / 2) * 100}%`,
              "--vibeui-chart-017-br": `${((1 + bottomShare) / 2) * 100}%`,
              "--vibeui-chart-017-slab": `color-mix(in oklab,var(--vibeui-chart-017-accent) ${100 - index * 13}%,oklch(0.72 0.05 285))`,
            } as CSSProperties

            return (
              <li key={step.label} data-part="step">
                <div data-part="slab" style={edges}>
                  <span data-part="label">{step.label}</span>
                  <span data-part="count">{step.value}</span>
                </div>
                {next ? (
                  <p data-part="drop">
                    {fillTemplate(dropLabel, {
                      rate: Math.round((next.value / step.value) * 100),
                      loss: step.value - next.value,
                    })}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ol>
        <p data-part="unit">{fillTemplate(unitLabel, { unit })}</p>
        <div data-part="data">
          <table>
            <caption>
              {title}, {unit}
            </caption>
            <tbody>
              {steps.map((step) => (
                <tr key={step.label}>
                  <th scope="row">{step.label}</th>
                  <td>{step.value}</td>
                  <td>
                    {fillTemplate(shareLabel, {
                      share: Math.round((step.value / first) * 100),
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </>
  )
}
