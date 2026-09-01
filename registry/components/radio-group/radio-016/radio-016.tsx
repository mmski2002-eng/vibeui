import { Fragment } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio016Plan = {
  value: string
  name: string
  price: string
  period?: string
  recommended?: boolean
}

export type Radio016Feature = {
  label: string
  /** Признак «включено» для каждого плана — по индексу, как в `plans`. */
  values: boolean[]
}

export type Radio016Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  plans?: Radio016Plan[]
  features?: Radio016Feature[]
  name?: string
  defaultValue?: string
  recommendedLabel?: string
  accent?: string
}

// Идея компонента: выбор варианта не карточками, а таблицей сравнения —
// решение принимают по разнице в возможностях, а не по названию плана.
// Одна CSS-сетка без вложенных строк: ячейки шапки и тела идут одним
// списком, поэтому колонки совпадают без subgrid и без ручной верстки строк.
// Число колонок зависит от количества планов, а не выражается классом —
// поэтому ширина колонок передаётся инлайн-стилем на сам грид-контейнер.
const STYLES = `
:where([data-vibeui-block="radio-016"]){
--vibeui-radio-016-bg:oklch(1 0 0);
--vibeui-radio-016-fg:oklch(0.22 0.014 265);
--vibeui-radio-016-muted:oklch(0.55 0.014 265);
--vibeui-radio-016-border:oklch(0.9 0.006 265);
--vibeui-radio-016-ring:oklch(0.74 0.012 265);
--vibeui-radio-016-accent:oklch(0.55 0.18 290);
--vibeui-radio-016-tint:oklch(0.55 0.18 290 / 7%);
--vibeui-radio-016-dash:oklch(0.78 0.006 265);
--vibeui-radio-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-016"]{
display:flex;flex-direction:column;
width:100%;max-width:26rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-016-bg);
border:1px solid var(--vibeui-radio-016-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-016-font);color:var(--vibeui-radio-016-fg);
}
[data-vibeui-block="radio-016"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-016"] [data-part="grid"]{clear:both;display:grid;row-gap:0}
[data-vibeui-block="radio-016"] [data-part="cell"]{
box-sizing:border-box;display:flex;align-items:center;
padding:0.5rem 0.375rem;font-size:0.75rem;
}
[data-vibeui-block="radio-016"] [data-part="cell"][data-role="corner"]{
align-items:flex-end;color:var(--vibeui-radio-016-muted);font-size:0.6875rem;
border-bottom:1px solid var(--vibeui-radio-016-border);
}
[data-vibeui-block="radio-016"] [data-part="cell"][data-role="plan"]{
position:relative;flex-direction:column;align-items:flex-start;gap:0.25rem;
cursor:pointer;border-bottom:1px solid var(--vibeui-radio-016-border);
border-radius:0.5rem 0.5rem 0 0;
transition:background-color .16s ease;
}
[data-vibeui-block="radio-016"] [data-part="cell"][data-role="plan"]:has(input:checked){
background:var(--vibeui-radio-016-tint);border-bottom-color:var(--vibeui-radio-016-accent);
}
[data-vibeui-block="radio-016"] [data-part="cell"][data-role="plan"]:has(input:focus-visible){
outline:2px solid var(--vibeui-radio-016-accent);outline-offset:-2px;
}
[data-vibeui-block="radio-016"] [data-part="cell"][data-role="label"]{
color:var(--vibeui-radio-016-muted);border-top:1px solid var(--vibeui-radio-016-border);
}
[data-vibeui-block="radio-016"] [data-part="cell"][data-role="value"]{
justify-content:center;border-top:1px solid var(--vibeui-radio-016-border);
}
[data-vibeui-block="radio-016"] input{
appearance:none;-webkit-appearance:none;margin:0;cursor:pointer;
width:0.9375rem;height:0.9375rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-016-ring);background:var(--vibeui-radio-016-bg);
}
[data-vibeui-block="radio-016"] input:checked{
border-color:var(--vibeui-radio-016-accent);
box-shadow:inset 0 0 0 0.1875rem var(--vibeui-radio-016-bg),inset 0 0 0 1rem var(--vibeui-radio-016-accent);
}
[data-vibeui-block="radio-016"] [data-part="badge"]{
position:absolute;top:0.375rem;right:0.25rem;
padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-radio-016-accent);color:oklch(1 0 0);
font-size:0.5625rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="radio-016"] [data-part="plan-name"]{font-weight:650;padding-right:3.25rem}
[data-vibeui-block="radio-016"] [data-part="plan-price"]{font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="radio-016"] [data-part="plan-period"]{
font-weight:500;font-size:0.625rem;color:var(--vibeui-radio-016-muted);
}
[data-vibeui-block="radio-016"] [data-part="yes"]{color:var(--vibeui-radio-016-accent);font-weight:700}
[data-vibeui-block="radio-016"] [data-part="no"]{color:var(--vibeui-radio-016-dash)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS: Radio016Plan[] = [
  { value: "basic", name: "Базовый", price: "990 ₽", period: "в месяц" },
  {
    value: "pro",
    name: "Расширенный",
    price: "1 590 ₽",
    period: "в месяц",
    recommended: true,
  },
]

const DEFAULT_FEATURES: Radio016Feature[] = [
  { label: "До 5 проектов", values: [true, true] },
  { label: "Совместная работа", values: [false, true] },
  { label: "Экспорт в PDF", values: [false, true] },
  { label: "Приоритетная поддержка", values: [false, true] },
]

/**
 * Выбор варианта таблицей сравнения: рекомендованный план и общие строки
 * возможностей. Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio016({
  legend = "Выберите план",
  plans = DEFAULT_PLANS,
  features = DEFAULT_FEATURES,
  name = "vibeui-radio-016",
  defaultValue = "pro",
  recommendedLabel = "Советуем",
  accent,
  className,
  style,
  ...props
}: Radio016Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  const gridStyle: CSSProperties = {
    gridTemplateColumns: `minmax(6.5rem,1.3fr) repeat(${plans.length}, minmax(4.25rem,1fr))`,
  }

  return (
    <>
      <style href="vibeui-radio-016" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-016"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="grid" style={gridStyle}>
          <div data-part="cell" data-role="corner">
            Что входит
          </div>
          {plans.map((plan) => (
            <label key={plan.value} data-part="cell" data-role="plan">
              <input
                type="radio"
                name={name}
                value={plan.value}
                defaultChecked={plan.value === defaultValue}
              />
              {plan.recommended ? (
                <span data-part="badge">{recommendedLabel}</span>
              ) : null}
              <span data-part="plan-name">{plan.name}</span>
              <span data-part="plan-price">
                {plan.price}{" "}
                {plan.period ? (
                  <span data-part="plan-period">{plan.period}</span>
                ) : null}
              </span>
            </label>
          ))}
          {features.map((feature) => (
            <Fragment key={feature.label}>
              <div data-part="cell" data-role="label">
                {feature.label}
              </div>
              {feature.values.map((included, index) => (
                <div
                  key={plans[index]?.value ?? index}
                  data-part="cell"
                  data-role="value"
                >
                  {included ? (
                    <span data-part="yes" aria-label="Включено">
                      ✓
                    </span>
                  ) : (
                    <span data-part="no" aria-label="Не включено">
                      –
                    </span>
                  )}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </fieldset>
    </>
  )
}
