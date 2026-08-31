import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table011Plan = {
  name: string
  price: string
}

export type Table011Feature = {
  title: string
  values: (boolean | string)[]
}

export type Table011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  plans?: Table011Plan[]
  features?: Table011Feature[]
  /** Имя тарифа, чью колонку подсвечиваем как рекомендованную. */
  featured?: string
  caption?: string
  accent?: string
}

// Идея компонента: матрица тарифов, где ответ «есть/нет» несёт не только
// галочка, но и слово для скринридера. Названия возможностей — заголовки
// строк (th scope="row"), поэтому ячейка «✓» всегда читается как пара
// «возможность — тариф», а не как одинокий символ.
const STYLES = `
:where([data-vibeui-block="table-011"]){
--vibeui-table-011-bg:oklch(1 0 0);
--vibeui-table-011-fg:oklch(0.24 0.014 265);
--vibeui-table-011-muted:oklch(0.56 0.014 265);
--vibeui-table-011-border:oklch(0.92 0.006 265);
--vibeui-table-011-head:oklch(0.975 0.003 265);
--vibeui-table-011-accent:oklch(0.55 0.2 262);
--vibeui-table-011-accent-soft:oklch(0.55 0.2 262 / 8%);
--vibeui-table-011-yes:oklch(0.52 0.15 155);
--vibeui-table-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="table-011"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-011-font);color:var(--vibeui-table-011-fg);
}
[data-vibeui-block="table-011"] [data-part="shell"]{
background:var(--vibeui-table-011-bg);
border:1px solid var(--vibeui-table-011-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="table-011"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="table-011"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-011-accent);outline-offset:-2px;
}
[data-vibeui-block="table-011"] table{width:100%;border-collapse:collapse;font-size:0.8125rem;min-width:26rem}
[data-vibeui-block="table-011"] caption{
padding:0.875rem 1rem 0.5rem;text-align:left;
font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="table-011"] th,
[data-vibeui-block="table-011"] td{
padding:0.625rem 0.875rem;text-align:center;vertical-align:middle;
border-top:1px solid var(--vibeui-table-011-border);
}
[data-vibeui-block="table-011"] thead th{
background:var(--vibeui-table-011-head);vertical-align:bottom;
}
[data-vibeui-block="table-011"] tbody th{
text-align:left;font-weight:500;
}
[data-vibeui-block="table-011"] [data-part="plan"]{
display:flex;flex-direction:column;align-items:center;gap:0.125rem;
}
[data-vibeui-block="table-011"] [data-part="name"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="table-011"] [data-part="price"]{
font-size:0.75rem;font-weight:400;color:var(--vibeui-table-011-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="table-011"] [data-part="badge"]{
margin-bottom:0.25rem;padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-table-011-accent);color:oklch(1 0 0);
font-size:0.625rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
}
[data-vibeui-block="table-011"] [data-featured="true"]{background:var(--vibeui-table-011-accent-soft)}
[data-vibeui-block="table-011"] thead [data-featured="true"]{
background:color-mix(in oklab,var(--vibeui-table-011-accent) 14%,var(--vibeui-table-011-head));
}
[data-vibeui-block="table-011"] [data-mark]{font-size:1rem;line-height:1}
[data-vibeui-block="table-011"] [data-mark="yes"]{color:var(--vibeui-table-011-yes)}
[data-vibeui-block="table-011"] [data-mark="no"]{color:var(--vibeui-table-011-muted)}
[data-vibeui-block="table-011"] [data-part="text"]{font-variant-numeric:tabular-nums}
[data-vibeui-block="table-011"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS: Table011Plan[] = [
  { name: "Старт", price: "0 ₽" },
  { name: "Команда", price: "1 200 ₽" },
  { name: "Бизнес", price: "3 900 ₽" },
]

const DEFAULT_FEATURES: Table011Feature[] = [
  { title: "Проектов", values: ["3", "50", "без лимита"] },
  { title: "Совместная работа", values: [false, true, true] },
  { title: "История версий", values: [false, true, true] },
  { title: "Свой домен", values: [false, true, true] },
  { title: "Единый вход SSO", values: [false, false, true] },
  { title: "Поддержка по телефону", values: [false, false, true] },
]

/**
 * Матрица сравнения тарифов: галочки продублированы словом для скринридера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table011({
  plans = DEFAULT_PLANS,
  features = DEFAULT_FEATURES,
  featured = "Команда",
  caption = "Что входит в тариф",
  accent,
  className,
  style,
  ...props
}: Table011Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-011"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div
            data-part="scroll"
            role="region"
            aria-label={caption}
            tabIndex={0}
          >
            <table>
              <caption>{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">Возможность</th>
                  {plans.map((plan) => (
                    <th
                      key={plan.name}
                      scope="col"
                      data-featured={
                        plan.name === featured ? "true" : undefined
                      }
                    >
                      <span data-part="plan">
                        {plan.name === featured ? (
                          <span data-part="badge">Рекомендуем</span>
                        ) : null}
                        <span data-part="name">{plan.name}</span>
                        <span data-part="price">{plan.price}</span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.title}>
                    <th scope="row">{feature.title}</th>
                    {plans.map((plan, index) => {
                      const value = feature.values[index]

                      return (
                        <td
                          key={plan.name}
                          data-featured={
                            plan.name === featured ? "true" : undefined
                          }
                        >
                          {typeof value === "string" ? (
                            <span data-part="text">{value}</span>
                          ) : (
                            <>
                              <span
                                data-mark={value ? "yes" : "no"}
                                aria-hidden="true"
                              >
                                {value ? "✓" : "—"}
                              </span>
                              <span data-part="sr">
                                {value ? "есть" : "нет"}
                              </span>
                            </>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
