import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Stepper012Step = { title: string }

export type Stepper012Line = { label: string; value: string }

export type Stepper012Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  steps?: Stepper012Step[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  summary?: Stepper012Line[]
  summaryTitle?: string
  totalLabel?: string
  total?: string
  label?: string
  accent?: string
}

// Идея компонента: во время оформления заказа сумма должна быть на виду
// постоянно, а не только в конце пути. Шаги и сводка стоят рядом в двух
// колонках; на узкой ширине сводка спускается под ленту, а не сжимает её
// до нечитаемого столбца.
const STYLES = `
:where([data-vibeui-block="stepper-012"]){
--vibeui-stepper-012-bg:oklch(1 0 0);
--vibeui-stepper-012-fg:oklch(0.24 0.016 265);
--vibeui-stepper-012-muted:oklch(0.56 0.014 265);
--vibeui-stepper-012-border:oklch(0.92 0.006 265);
--vibeui-stepper-012-line:oklch(0.9 0.006 265);
--vibeui-stepper-012-accent:oklch(0.55 0.2 262);
--vibeui-stepper-012-accent-fg:oklch(1 0 0);
--vibeui-stepper-012-panel:oklch(0.97 0.006 265);
--vibeui-stepper-012-dot:1.5rem;
--vibeui-stepper-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="stepper-012"]{
container-type:inline-size;width:100%;max-width:40rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-012-font);color:var(--vibeui-stepper-012-fg);
}
[data-vibeui-block="stepper-012"] [data-part="shell"]{
background:var(--vibeui-stepper-012-bg);
border:1px solid var(--vibeui-stepper-012-border);
border-radius:1rem;padding:1.125rem;
}
[data-vibeui-block="stepper-012"] [data-part="layout"]{
display:grid;grid-template-columns:1fr 15rem;gap:1.25rem;align-items:start;
}
[data-vibeui-block="stepper-012"] ol{margin:0;padding:0;list-style:none}
[data-vibeui-block="stepper-012"] [data-part="layout"] > ol{
display:grid;grid-template-columns:var(--vibeui-stepper-012-dot) 1fr;
}
[data-vibeui-block="stepper-012"] [data-part="layout"] > ol li{
position:relative;grid-column:1 / -1;display:grid;
grid-template-columns:var(--vibeui-stepper-012-dot) 1fr;
gap:0 0.75rem;align-items:center;padding-bottom:0.875rem;
}
[data-vibeui-block="stepper-012"] [data-part="layout"] > ol li:last-child{padding-bottom:0}
[data-vibeui-block="stepper-012"] [data-part="layout"] > ol li:not(:last-child)::before{
content:"";position:absolute;left:calc(var(--vibeui-stepper-012-dot) / 2 - 1px);
top:var(--vibeui-stepper-012-dot);bottom:-0.125rem;width:2px;
background:var(--vibeui-stepper-012-line);
}
[data-vibeui-block="stepper-012"] [data-part="layout"] > ol li[data-state="done"]::before{background:var(--vibeui-stepper-012-accent)}
[data-vibeui-block="stepper-012"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-012-dot);height:var(--vibeui-stepper-012-dot);
border-radius:9999px;border:2px solid var(--vibeui-stepper-012-line);
background:var(--vibeui-stepper-012-bg);color:var(--vibeui-stepper-012-muted);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-012"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-012-accent);border-color:var(--vibeui-stepper-012-accent);
color:var(--vibeui-stepper-012-accent-fg);
}
[data-vibeui-block="stepper-012"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-stepper-012-accent);color:var(--vibeui-stepper-012-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-stepper-012-accent) 18%,transparent);
}
[data-vibeui-block="stepper-012"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="stepper-012"] li[data-state="todo"] [data-part="title"]{
font-weight:500;color:var(--vibeui-stepper-012-muted);
}
[data-vibeui-block="stepper-012"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="stepper-012"] [data-part="summary"]{
background:var(--vibeui-stepper-012-panel);
border:1px solid var(--vibeui-stepper-012-border);
border-radius:0.875rem;padding:1rem;
}
[data-vibeui-block="stepper-012"] [data-part="summary-title"]{
margin:0 0 0.625rem;font-size:0.75rem;font-weight:650;letter-spacing:0.02em;
text-transform:uppercase;color:var(--vibeui-stepper-012-muted);
}
[data-vibeui-block="stepper-012"] [data-part="line"]{
display:flex;justify-content:space-between;gap:0.75rem;
margin:0;padding:0.3125rem 0;font-size:0.8125rem;color:var(--vibeui-stepper-012-muted);
}
[data-vibeui-block="stepper-012"] [data-part="line"] span:last-child{
color:var(--vibeui-stepper-012-fg);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="stepper-012"] [data-part="total"]{
display:flex;justify-content:space-between;gap:0.75rem;
margin:0.5rem 0 0;padding-top:0.625rem;border-top:1px solid var(--vibeui-stepper-012-border);
font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="stepper-012"] [data-part="total"] span:last-child{font-variant-numeric:tabular-nums}
@container (max-width: 28rem){
[data-vibeui-block="stepper-012"] [data-part="layout"]{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-012"] *{animation:none!important;transition:none!important}}
`

const STATES = { done: "Готово", current: "Сейчас", todo: "Впереди" } as const

const DEFAULT_STEPS: Stepper012Step[] = [
  { title: "Корзина" },
  { title: "Доставка" },
  { title: "Оплата" },
  { title: "Подтверждение" },
]

const DEFAULT_SUMMARY: Stepper012Line[] = [
  { label: "Товары (3)", value: "7 940 ₽" },
  { label: "Доставка", value: "290 ₽" },
  { label: "Скидка", value: "−500 ₽" },
]

/**
 * Шаги оформления заказа с итогом справа. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Stepper012({
  steps = DEFAULT_STEPS,
  current = 1,
  summary = DEFAULT_SUMMARY,
  summaryTitle = "Ваш заказ",
  totalLabel = "Итого",
  total = "7 730 ₽",
  label = "Оформление заказа",
  accent,
  className,
  style,
  ...props
}: Stepper012Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-012" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="stepper-012"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="layout">
            <ol>
              {steps.map((step, index) => {
                const state =
                  index < current
                    ? "done"
                    : index === current
                      ? "current"
                      : "todo"

                return (
                  <li
                    key={step.title}
                    data-state={state}
                    aria-current={state === "current" ? "step" : undefined}
                  >
                    <span data-part="mark" aria-hidden="true">
                      {state === "done" ? "✓" : index + 1}
                    </span>
                    <span data-part="title">
                      {step.title}
                      <span data-part="sr"> — {STATES[state]}</span>
                    </span>
                  </li>
                )
              })}
            </ol>
            <aside data-part="summary" aria-label={summaryTitle}>
              <p data-part="summary-title">{summaryTitle}</p>
              {summary.map((line) => (
                <p data-part="line" key={line.label}>
                  <span>{line.label}</span>
                  <span>{line.value}</span>
                </p>
              ))}
              <p data-part="total">
                <span>{totalLabel}</span>
                <span>{total}</span>
              </p>
            </aside>
          </div>
        </div>
      </nav>
    </>
  )
}
