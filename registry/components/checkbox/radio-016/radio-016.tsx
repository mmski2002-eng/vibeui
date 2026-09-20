import { Fragment } from "react"
import type { ComponentProps, CSSProperties } from "react"

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
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  plans?: Radio016Plan[]
  features?: Radio016Feature[]
  name?: string
  defaultValue?: string
  recommendedLabel?: string
  /** Подпись угловой ячейки над списком возможностей. */
  cornerLabel?: string
  /** Подписи ячеек сравнения для скринридера: ключи included и excluded. */
  valueText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор варианта не карточками, а таблицей сравнения —
// решение принимают по разнице в возможностях, а не по названию плана.
// Одна CSS-сетка без вложенных строк: ячейки шапки и тела идут одним
// списком, поэтому колонки совпадают без subgrid и без ручной верстки строк.
// Число колонок зависит от количества планов, а не выражается классом —
// поэтому ширина колонок передаётся инлайн-стилем на сам грид-контейнер.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-016"]){
--vibeui-radio-016-bg:transparent;
--vibeui-radio-016-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-radio-016-muted:color-mix(in oklab,var(--vibeui-radio-016-fg) 68%,transparent);
--vibeui-radio-016-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-radio-016-ring:light-dark(oklch(0.74 0 265),oklch(0.5 0 265));
--vibeui-radio-016-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-radio-016-on-accent:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-radio-016-tint:light-dark(oklch(0.24 0.015 265 / 6%),oklch(0.93 0.006 265 / 12%));
--vibeui-radio-016-dash:light-dark(oklch(0.78 0 265),oklch(0.48 0 265));
--vibeui-radio-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-016"]{color-scheme:dark}
[data-vibeui-block="radio-016"]{
display:flex;flex-direction:column;
width:100%;max-width:26rem;min-inline-size:0;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-016-bg);
border:1px solid var(--vibeui-radio-016-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-016-font);color:var(--vibeui-radio-016-fg);
}
[data-vibeui-block="radio-016"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="radio-016"] [data-part="grid"]{clear:both;display:grid;row-gap:0;max-inline-size:100%;overflow-x:auto}
[data-vibeui-block="radio-016"] [data-part="cell"]{
box-sizing:border-box;display:flex;align-items:center;
padding:0.5rem 0.375rem;font-size:0.75rem;
}
[data-vibeui-block="radio-016"] [data-part="cell"][data-role="corner"]{
align-items:flex-end;color:var(--vibeui-radio-016-muted);font-size:0.6875rem;
border-bottom:1px solid var(--vibeui-radio-016-border);
}
/* Столбцу плана нужна своя минимальная ширина: в узкой карточке ячейки
   схлопывались, и «1 590 ₽» разрывалось по пробелу. Не влезло — таблица
   прокручивается вбок, это честнее сломанной вёрстки. */
[data-vibeui-block="radio-016"] [data-part="cell"][data-role="plan"]{
position:relative;flex-direction:column;align-items:center;text-align:center;gap:0.25rem;
padding-top:1.5rem;
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
border:1.5px solid var(--vibeui-radio-016-ring);background:transparent;
}
/* Точка — градиент, а не внутренняя тень: тени пришлось бы закрашивать
   зазор цветом подложки, а подложки у компонента по умолчанию нет. */
[data-vibeui-block="radio-016"] input:checked{
border-color:var(--vibeui-radio-016-accent);
background:radial-gradient(circle at 50% 50%,var(--vibeui-radio-016-accent) 0 0.1875rem,transparent 0.1875rem);
}
/* Плашка стоит над кружком, а не рядом с ним: в узкой колонке они
   перекрывались. */
[data-vibeui-block="radio-016"] [data-part="badge"]{
position:absolute;top:0.1875rem;left:50%;transform:translateX(-50%);
padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-radio-016-accent);color:oklch(from var(--vibeui-radio-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.5625rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="radio-016"] [data-part="plan-name"]{font-weight:650}
[data-vibeui-block="radio-016"] [data-part="plan-price"]{font-weight:750;white-space:nowrap;font-variant-numeric:tabular-nums}
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

const DEFAULT_VALUE_TEXT: Record<string, string> = {
  included: "Включено",
  excluded: "Не включено",
}

const DEFAULT_FEATURES: Radio016Feature[] = [
  { label: "До 5 проектов", values: [true, true] },
  { label: "Совместная работа", values: [false, true] },
  { label: "Экспорт в PDF", values: [false, true] },
  { label: "Приоритетная поддержка", values: [false, true] },
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
  cornerLabel = "Что входит",
  valueText = DEFAULT_VALUE_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio016Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const gridStyle: CSSProperties = {
    gridTemplateColumns: `minmax(7rem,1.2fr) repeat(${plans.length}, minmax(6.75rem,1fr))`,
  }

  return (
    <>
      <style href="vibeui-radio-016" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-016"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="grid" style={gridStyle}>
          <div data-part="cell" data-role="corner">
            {cornerLabel}
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
                    <span
                      data-part="yes"
                      aria-label={
                        valueText.included ?? DEFAULT_VALUE_TEXT.included
                      }
                    >
                      ✓
                    </span>
                  ) : (
                    <span
                      data-part="no"
                      aria-label={
                        valueText.excluded ?? DEFAULT_VALUE_TEXT.excluded
                      }
                    >
                      –
                    </span>
                  )}
                </div>
              ))}
            </Fragment>
          ))}
        </form>
      </fieldset>
    </>
  )
}
