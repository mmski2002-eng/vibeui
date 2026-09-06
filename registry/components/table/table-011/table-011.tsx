import type { ComponentProps, CSSProperties } from "react"

export type Table011Plan = {
  name: string
  price: string
}

export type Table011Feature = {
  title: string
  values: (boolean | string)[]
}

export type Table011Props = Omit<ComponentProps<"div">, "children"> & {
  plans?: Table011Plan[]
  features?: Table011Feature[]
  /** Имя тарифа, чью колонку подсвечиваем как рекомендованную. */
  featured?: string
  caption?: string
  /** Заголовок первой колонки. */
  featureLabel?: string
  /** Подпись на рекомендованном тарифе. */
  featuredText?: string
  /** Подписи для скринридера: ключи yes и no. */
  valueText?: Record<string, string>
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: матрица тарифов, где ответ «есть/нет» несёт не только
// галочка, но и слово для скринридера. Названия возможностей — заголовки
// строк (th scope="row"), поэтому ячейка «✓» всегда читается как пара
// «возможность — тариф», а не как одинокий символ.
//
// Тема берётся из color-scheme окружения через light-dark(): матрица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-011"]){
--vibeui-table-011-bg:transparent;
--vibeui-table-011-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-011-muted:color-mix(in oklab,var(--vibeui-table-011-fg) 68%,transparent);
--vibeui-table-011-border:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-table-011-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-011-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-table-011-accent-soft:color-mix(in oklab,var(--vibeui-table-011-accent) 8%,transparent);
--vibeui-table-011-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0 265));
--vibeui-table-011-yes:light-dark(oklch(0.52 0.15 155),oklch(0.76 0.14 155));
--vibeui-table-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-011"]{color-scheme:dark}
[data-vibeui-block="table-011"]{
width:100%;box-sizing:border-box;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопнется внутри flex-контейнера. */
min-width:min(100%,16rem);
font-family:var(--vibeui-table-011-font);color:var(--vibeui-table-011-fg);
/* Поля ячеек считаются от собственной ширины блока, а не от окна. */
container-type:inline-size;
}
[data-vibeui-block="table-011"] [data-part="shell"]{
background:var(--vibeui-table-011-bg);
border:1px solid var(--vibeui-table-011-border);border-radius:1rem;overflow:hidden;
}
/* position:relative — контейнер для скрытых от глаз, но не от скринридера,
   подписей внутри (position:absolute): без своего контейнера их статическая
   позиция считается от viewport и вылезает за пределы прокрутки на странице. */
[data-vibeui-block="table-011"] [data-part="scroll"]{position:relative;overflow-x:auto}
[data-vibeui-block="table-011"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-011-accent);outline-offset:-2px;
}
/* min() вместо min-width:26rem: желаемая ширина остаётся, но никогда не
   перерастает контейнер — иначе матрица уезжает под правый край. */
[data-vibeui-block="table-011"] table{
width:100%;border-collapse:collapse;font-size:0.8125rem;
min-width:min(100%,26rem);
}
/* В узком блоке место забирают поля ячеек, а не текст: сжимаем их, чтобы
   названия возможностей и цены остались целыми. */
@container (max-width:28rem){
[data-vibeui-block="table-011"] th,
[data-vibeui-block="table-011"] td{padding:0.5rem 0.375rem}
[data-vibeui-block="table-011"] caption{padding:0.75rem 0.625rem 0.375rem}
}
@container (max-width:22rem){
[data-vibeui-block="table-011"] table{font-size:0.75rem}
[data-vibeui-block="table-011"] th,
[data-vibeui-block="table-011"] td{padding:0.4375rem 0.25rem}
[data-vibeui-block="table-011"] [data-part="name"]{font-size:0.75rem}
[data-vibeui-block="table-011"] [data-part="price"]{font-size:0.6875rem}
[data-vibeui-block="table-011"] [data-part="badge"]{
padding:0.0625rem 0.25rem;font-size:0.5rem;letter-spacing:normal;
}
}
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
background:var(--vibeui-table-011-accent);color:var(--vibeui-table-011-on-accent);
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

const VALUE_TEXT: Record<string, string> = { yes: "есть", no: "нет" }

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
 * Матрица сравнения тарифов: галочки продублированы словом для скринридера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table011({
  plans = DEFAULT_PLANS,
  features = DEFAULT_FEATURES,
  featured = "Команда",
  caption = "Что входит в тариф",
  featureLabel = "Возможность",
  featuredText = "Рекомендуем",
  valueText = VALUE_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Table011Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
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
                  <th scope="col">{featureLabel}</th>
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
                          <span data-part="badge">{featuredText}</span>
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
                                {value
                                  ? (valueText.yes ?? VALUE_TEXT.yes)
                                  : (valueText.no ?? VALUE_TEXT.no)}
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
