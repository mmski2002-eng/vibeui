import type { ComponentProps, CSSProperties } from "react"

export type Chart008Step = {
  label: string
  value: number
}

export type Chart008Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  steps?: Chart008Step[]
  unit?: string
  /** Строка перехода между шагами; {drop} выделяется жирным. */
  dropText?: string
  /** Подпись полосы для скринридера: {label}, {value}, {unit}, {share}. */
  stepLabel?: string
  /** Раскрывать ступени сверху вниз при появлении. */
  animate?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: воронка с переходами между шагами. Главное в ней — не
// ширина полос, а процент перехода от предыдущего шага: именно он показывает,
// где теряются люди. Абсолютные числа остаются рядом, потому что «падение на
// 40%» с базы в двадцать человек ничего не значит.
//
// Тема берётся из color-scheme окружения через light-dark(): воронка темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-008"]){
--vibeui-chart-008-bg:transparent;
--vibeui-chart-008-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-008-muted:color-mix(in oklab,var(--vibeui-chart-008-fg) 68%,transparent);
--vibeui-chart-008-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-008-track:light-dark(oklch(0.94 0 265),oklch(0.3 0 265));
--vibeui-chart-008-accent:light-dark(oklch(0.54 0.2 276),oklch(0.74 0.15 276));
--vibeui-chart-008-dur:0.9s;
--vibeui-chart-008-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-008-drop:light-dark(oklch(0.295 0 0),oklch(0.905 0 0));
--vibeui-chart-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-008"]{color-scheme:dark}
[data-vibeui-block="chart-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-008-bg);
border:1px solid var(--vibeui-chart-008-border);border-radius:0.875rem;
color:var(--vibeui-chart-008-fg);font-family:var(--vibeui-chart-008-font);
}
\[data\-vibeui\-block="chart\-008"\] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="chart-008"] ol{display:flex;flex-direction:column;gap:0.375rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="chart-008"] [data-part="row"]{display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="chart-008"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;font-size:0.8125rem;
}
[data-vibeui-block="chart-008"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="chart-008"] li{transition:opacity 0.2s}
[data-vibeui-block="chart-008"] ol:hover li:not(:hover){opacity:0.5}
[data-vibeui-block="chart-008"] li:hover [data-part="value"]{color:var(--vibeui-chart-008-accent)}
[data-vibeui-block="chart-008"] [data-part="bar"]{
height:1.375rem;border-radius:0.4rem;transform-origin:left;
background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-chart-008-accent) var(--vibeui-chart-008-mix,80%),var(--vibeui-chart-008-track)),color-mix(in oklab,var(--vibeui-chart-008-accent) calc(var(--vibeui-chart-008-mix,80%) + 12%),var(--vibeui-chart-008-track)));
box-shadow:inset 0 1px 0 color-mix(in oklab,#fff 35%,transparent);transition:filter 0.2s;
}
/* Переход между шагами: именно он показывает, где теряются люди. */
[data-vibeui-block="chart-008"] li:hover [data-part="bar"]{filter:brightness(1.08)}
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
/* Появление: ступени раскрываются сверху вниз, проценты перехода всплывают. */
[data-vibeui-block="chart-008"][data-animate] [data-part="bar"]{transform:scaleX(0);animation:vibeui-chart-008-grow 0.7s var(--vibeui-chart-008-ease) calc(var(--i) * 140ms) forwards}
[data-vibeui-block="chart-008"][data-animate] [data-part="drop"],[data-vibeui-block="chart-008"][data-animate] [data-part="value"]{opacity:0;animation:vibeui-chart-008-fade 0.4s var(--vibeui-chart-008-ease) calc(var(--i) * 140ms + 0.35s) forwards}
@keyframes vibeui-chart-008-grow{to{transform:scaleX(1)}}
@keyframes vibeui-chart-008-fade{to{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-008"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-008"][data-animate] [data-part="bar"]{transform:none}
[data-vibeui-block="chart-008"][data-animate] [data-part="drop"],[data-vibeui-block="chart-008"][data-animate] [data-part="value"]{opacity:1}
}
`

const DEFAULT_STEPS: Chart008Step[] = [
  { label: "Открыли каталог", value: 4820 },
  { label: "Открыли компонент", value: 2140 },
  { label: "Скопировали команду", value: 860 },
  { label: "Поставили компонент", value: 412 },
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
 * Воронка с процентами перехода между шагами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart008({
  title = "Путь до установки",
  steps = DEFAULT_STEPS,
  unit = "человек за неделю",
  dropText = "ушли {drop} от предыдущего шага",
  stepLabel = "{label}: {value} {unit}, {share}% от первого шага",
  animate = true,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart008Props) {
  const first = steps[0]?.value || 1
  // Число перехода выделяется жирным, поэтому строка разрезается по метке:
  // так подпись остаётся одним пропом, а вёрстка — прежней.
  const [dropBefore, dropAfter] = dropText.split("{drop}")

  const palette = {
    ...(accent ? { "--vibeui-chart-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-008" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-008"
        data-animate={animate ? "" : undefined}
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
              <li key={step.label} style={{ "--i": index } as CSSProperties}>
                {previous ? (
                  <p data-part="drop">
                    {dropBefore}
                    <b>{drop}%</b>
                    {dropAfter}
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
                    aria-label={fillTemplate(stepLabel, {
                      label: step.label,
                      value: step.value,
                      unit,
                      share,
                    })}
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
