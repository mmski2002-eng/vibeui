import type { CSSProperties } from "react"

export type Pricing004Row = {
  feature: string
  values: (string | boolean)[]
}

export type Pricing004Group = {
  title: string
  rows: Pricing004Row[]
}

export type Pricing004Props = {
  eyebrow?: string
  title?: string
  plans?: { name: string; price: string; href: string; featured?: boolean }[]
  groups?: Pricing004Group[]
  /** Подпись таблицы. {plans} — число тарифов, {features} — число признаков. */
  caption?: string
  /** Заголовок первой колонки. */
  featureHeading?: string
  /** Подпись ссылки в шапке колонки тарифа. */
  pickLabel?: string
  /** Подписи логических значений в ячейках. */
  valueText?: { yes: string; no: string }
  accent?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

// Идея блока: полная таблица сравнения тарифов. Настоящая <table> со
// сгруппированными строками через <tbody> и заголовками групп в <th
// colspan>: скринридер объявляет и группу, и колонку. Шапка с ценами
// залипает при прокрутке (position:sticky), иначе на длинной таблице
// пользователь забывает, какая колонка чья. На узкой ширине таблица
// прокручивается вбок внутри обёртки, а не разваливается на карточки.
const STYLES = `
:where([data-vibeui-block="pricing-004"]){
--vibeui-pricing-004-bg:transparent;
--vibeui-pricing-004-card:light-dark(oklch(1 0 0),oklch(0.195 0 265));
--vibeui-pricing-004-fg:light-dark(oklch(0.2 0 265),oklch(0.95 0 265));
--vibeui-pricing-004-muted:light-dark(oklch(0.53 0 265),oklch(0.72 0 265));
--vibeui-pricing-004-line:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-pricing-004-soft:light-dark(oklch(0.97 0 265),oklch(0.26 0 265));
--vibeui-pricing-004-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.75 0.15 39.8));
--vibeui-pricing-004-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-pricing-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-004"]{color-scheme:dark}
[data-vibeui-block="pricing-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-004-bg);color:var(--vibeui-pricing-004-fg);
font-family:var(--vibeui-pricing-004-sans);
}
[data-vibeui-block="pricing-004"] *{box-sizing:border-box}
[data-vibeui-block="pricing-004"] [data-part="shell"]{max-width:72rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-004"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-004-accent);
}
[data-vibeui-block="pricing-004"] h2{
margin:0 0 2rem;max-width:24ch;font-size:clamp(1.5rem,4.2cqi,2.25rem);line-height:1.14;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-004"] [data-part="scroll"]{overflow-x:auto;border:1px solid var(--vibeui-pricing-004-line);border-radius:1rem;background:var(--vibeui-pricing-004-card)}
[data-vibeui-block="pricing-004"] table{width:100%;min-width:40rem;border-collapse:collapse;font-size:0.875rem}
[data-vibeui-block="pricing-004"] caption{
caption-side:top;padding:1rem 1.25rem;text-align:left;font-size:0.75rem;color:var(--vibeui-pricing-004-muted);
}
[data-vibeui-block="pricing-004"] thead th{
position:sticky;top:0;z-index:1;padding:1rem;text-align:left;vertical-align:top;
background:var(--vibeui-pricing-004-card);border-bottom:1px solid var(--vibeui-pricing-004-line);
}
[data-vibeui-block="pricing-004"] [data-part="planname"]{display:block;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="pricing-004"] [data-part="planprice"]{display:block;margin-top:0.25rem;font-size:0.8125rem;font-weight:500;color:var(--vibeui-pricing-004-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-004"] [data-part="pick"]{
display:inline-flex;align-items:center;justify-content:center;margin-top:0.625rem;height:2rem;padding:0 0.75rem;
border-radius:0.5rem;border:1px solid var(--vibeui-pricing-004-line);color:var(--vibeui-pricing-004-fg);
font-size:0.75rem;font-weight:650;text-decoration:none;transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="pricing-004"] [data-featured="true"] [data-part="pick"]{background:var(--vibeui-pricing-004-accent);color:var(--vibeui-pricing-004-accent-fg);border-color:transparent}
[data-vibeui-block="pricing-004"] [data-part="pick"]:focus-visible{outline:2px solid var(--vibeui-pricing-004-accent);outline-offset:2px}
[data-vibeui-block="pricing-004"] [data-part="grouprow"] th{
padding:0.625rem 1rem;background:var(--vibeui-pricing-004-soft);text-align:left;
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--vibeui-pricing-004-muted);
border-top:1px solid var(--vibeui-pricing-004-line);border-bottom:1px solid var(--vibeui-pricing-004-line);
}
[data-vibeui-block="pricing-004"] tbody th{padding:0.75rem 1rem;text-align:left;font-weight:500}
[data-vibeui-block="pricing-004"] td{padding:0.75rem 1rem;color:var(--vibeui-pricing-004-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-004"] [data-part="datarow"] + [data-part="datarow"] th{border-top:1px solid var(--vibeui-pricing-004-line)}
[data-vibeui-block="pricing-004"] [data-part="datarow"] + [data-part="datarow"] td{border-top:1px solid var(--vibeui-pricing-004-line)}
[data-vibeui-block="pricing-004"] [data-part="yes"]{color:var(--vibeui-pricing-004-accent)}
[data-vibeui-block="pricing-004"] [data-part="no"]{color:var(--vibeui-pricing-004-muted);opacity:.65}
@container (min-width: 34rem){
[data-vibeui-block="pricing-004"] [data-part="shell"]{padding:5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS = [
  { name: "Старт", price: "0 ₽", href: "#" },
  { name: "Команда", price: "1 490 ₽ / мес", href: "#", featured: true },
  { name: "Агентство", price: "4 900 ₽ / мес", href: "#" },
]

const DEFAULT_GROUPS: Pricing004Group[] = [
  {
    title: "Каталог",
    rows: [
      { feature: "Секций доступно", values: ["10", "Все", "Все"] },
      { feature: "Проектов", values: ["1", "10", "Без ограничений"] },
      { feature: "Ранний доступ к новинкам", values: [false, true, true] },
    ],
  },
  {
    title: "Команда",
    rows: [
      { feature: "Участников", values: ["1", "5", "Без ограничений"] },
      { feature: "Общие пресеты палитры", values: [false, true, true] },
      { feature: "Передача проекта клиенту", values: [false, false, true] },
    ],
  },
  {
    title: "Поддержка",
    rows: [
      {
        feature: "Ответ на письмо",
        values: ["3 рабочих дня", "1 рабочий день", "4 часа"],
      },
      { feature: "Отдельный менеджер", values: [false, false, true] },
      { feature: "Счета и закрывающие документы", values: [false, true, true] },
    ],
  },
]

const DEFAULT_VALUE_TEXT = { yes: "Есть", no: "—" }

/** Таблица сравнения тарифов: строки сгруппированы, шапка с ценами залипает при прокрутке. */
export function Pricing004({
  eyebrow = "Сравнение",
  title = "Что именно меняется при переходе на следующий тариф",
  plans = DEFAULT_PLANS,
  groups = DEFAULT_GROUPS,
  caption = "Сравнение {plans} тарифов по {features} признакам, сгруппированным по разделам.",
  featureHeading = "Возможность",
  pickLabel = "Выбрать",
  valueText = DEFAULT_VALUE_TEXT,
  accent,
  background = "",
  className,
  style,
}: Pricing004Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-004-bg": background,
          "--vibeui-pricing-004-card": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const featureCount = groups.reduce((sum, group) => sum + group.rows.length, 0)
  const captionText = caption
    .replace("{plans}", String(plans.length))
    .replace("{features}", String(featureCount))

  return (
    <>
      <style href="vibeui-pricing-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>

          <div data-part="scroll">
            <table>
              <caption>{captionText}</caption>
              <thead>
                <tr>
                  <th scope="col">{featureHeading}</th>
                  {plans.map((plan) => (
                    <th
                      key={plan.name}
                      scope="col"
                      data-featured={plan.featured ? "true" : undefined}
                    >
                      <span data-part="planname">{plan.name}</span>
                      <span data-part="planprice">{plan.price}</span>
                      <a data-part="pick" href={plan.href}>
                        {pickLabel}
                      </a>
                    </th>
                  ))}
                </tr>
              </thead>
              {groups.map((group) => (
                <tbody key={group.title}>
                  <tr data-part="grouprow">
                    <th scope="colgroup" colSpan={plans.length + 1}>
                      {group.title}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.feature} data-part="datarow">
                      <th scope="row">{row.feature}</th>
                      {row.values.map((value, index) => (
                        <td key={plans[index]?.name ?? index}>
                          {value === true ? (
                            <span data-part="yes">{valueText.yes}</span>
                          ) : value === false ? (
                            <span data-part="no">{valueText.no}</span>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
