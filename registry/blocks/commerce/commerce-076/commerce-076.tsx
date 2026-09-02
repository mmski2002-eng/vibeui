import type { CSSProperties } from "react"

export type Commerce076Tier = {
  id: string
  from: string
  price: string
  save: string
  perPack: string
  current?: boolean
}

export type Commerce076Term = {
  id: string
  term: string
  value: string
}

export type Commerce076Props = {
  kicker?: string
  title?: string
  lead?: string
  tiers?: Commerce076Tier[]
  columnFrom?: string
  columnPrice?: string
  columnSave?: string
  columnPack?: string
  currentLabel?: string
  tableCaption?: string
  nextTitle?: string
  nextStep?: string
  termsTitle?: string
  terms?: Commerce076Term[]
  cta?: string
  secondary?: string
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: оптовый прайс по количеству, где видно не только цены, но и
// расстояние до следующего порога. Строка «добавьте ещё N штук» делает
// таблицу действием: без неё покупатель считает разницу в уме и обычно
// не считает. Текущий уровень помечен словом и рамкой, а не только фоном.
const STYLES = `
:where([data-vibeui-block="commerce-076"]){
--vibeui-commerce-076-bg:transparent;
--vibeui-commerce-076-surface:light-dark(oklch(1 0 0),oklch(0.22 0.012 230));
--vibeui-commerce-076-fg:light-dark(oklch(0.21 0.012 230),oklch(0.94 0.006 230));
--vibeui-commerce-076-muted:light-dark(oklch(0.53 0.014 230),oklch(0.73 0.012 230));
--vibeui-commerce-076-border:light-dark(oklch(0.9 0.008 230),oklch(0.38 0.014 230));
--vibeui-commerce-076-soft:light-dark(oklch(0.972 0.006 230),oklch(0.27 0.016 230));
--vibeui-commerce-076-accent:light-dark(oklch(0.44 0.13 230),oklch(0.76 0.13 230));
--vibeui-commerce-076-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.04 230));
--vibeui-commerce-076-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-076"]{
box-sizing:border-box;background:var(--vibeui-commerce-076-bg);
color:var(--vibeui-commerce-076-fg);font-family:var(--vibeui-commerce-076-sans);
}
[data-vibeui-block="commerce-076"] *{box-sizing:border-box}
[data-vibeui-block="commerce-076"] [data-part="shell"]{max-width:58rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-076"] [data-part="kicker"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-076-accent)}
[data-vibeui-block="commerce-076"] h2{margin:0.375rem 0 0.5rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-076"] [data-part="lead"]{margin:0 0 1.25rem;max-width:56ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-076-muted)}
[data-vibeui-block="commerce-076"] [data-part="scroll"]{overflow-x:auto;border:1px solid var(--vibeui-commerce-076-border);border-radius:0.875rem}
[data-vibeui-block="commerce-076"] table{border-collapse:collapse;width:100%;min-width:32rem;font-size:0.875rem}
[data-vibeui-block="commerce-076"] caption{
caption-side:top;text-align:left;padding:0.625rem 0.875rem;font-size:0.75rem;color:var(--vibeui-commerce-076-muted);
background:var(--vibeui-commerce-076-soft);border-bottom:1px solid var(--vibeui-commerce-076-border);
}
[data-vibeui-block="commerce-076"] th,
[data-vibeui-block="commerce-076"] td{padding:0.6875rem 0.75rem;text-align:right;border-bottom:1px solid var(--vibeui-commerce-076-border);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-076"] thead th{
text-align:right;background:var(--vibeui-commerce-076-soft);font-size:0.6875rem;letter-spacing:0.05em;
text-transform:uppercase;color:var(--vibeui-commerce-076-muted);font-weight:700;
}
[data-vibeui-block="commerce-076"] tbody th{text-align:left;font-weight:700}
[data-vibeui-block="commerce-076"] thead th:first-child{text-align:left}
[data-vibeui-block="commerce-076"] tbody tr:last-child th,
[data-vibeui-block="commerce-076"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="commerce-076"] [data-part="row"][data-current]{background:var(--vibeui-commerce-076-soft);box-shadow:inset 3px 0 0 var(--vibeui-commerce-076-accent)}
[data-vibeui-block="commerce-076"] [data-part="now"]{
display:inline-block;margin-left:0.4375rem;padding:0.0625rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-commerce-076-accent);color:var(--vibeui-commerce-076-onaccent);font-size:0.625rem;font-weight:700;
letter-spacing:0.04em;text-transform:uppercase;vertical-align:1px;
}
[data-vibeui-block="commerce-076"] [data-part="price"]{font-weight:750}
[data-vibeui-block="commerce-076"] [data-part="next"]{
margin:0.875rem 0 1.25rem;padding:0.75rem 0.875rem;border-radius:0.875rem;
border:1px dashed var(--vibeui-commerce-076-accent);font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="commerce-076"] [data-part="next"] strong{font-weight:750}
[data-vibeui-block="commerce-076"] h3{margin:0 0 0.625rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-commerce-076-muted)}
[data-vibeui-block="commerce-076"] dl{
margin:0 0 1.25rem;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0.4375rem 0.75rem;font-size:0.8125rem;
padding:0.875rem 1rem;border-radius:0.875rem;background:var(--vibeui-commerce-076-soft);
}
[data-vibeui-block="commerce-076"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-076"] dt{color:var(--vibeui-commerce-076-muted);min-width:0}
[data-vibeui-block="commerce-076"] dd{margin:0;text-align:right;font-weight:650}
[data-vibeui-block="commerce-076"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="commerce-076"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.875rem;padding:0 1.625rem;border-radius:0.875rem;
background:var(--vibeui-commerce-076-accent);color:var(--vibeui-commerce-076-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-076"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.875rem;padding:0 1.25rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-076-border);background:var(--vibeui-commerce-076-surface);
color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-076"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-076"] [data-part="alt"]:focus-visible{outline:2px solid var(--vibeui-commerce-076-accent);outline-offset:2px}
[data-vibeui-block="commerce-076"] [data-part="note"]{margin:0.875rem 0 0;max-width:58ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-076-muted)}
@container (min-width: 44rem){
[data-vibeui-block="commerce-076"] [data-part="shell"]{padding:2rem 2rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-076"] *{animation:none!important;transition:none!important}}
`

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

const DEFAULT_TIERS: Commerce076Tier[] = [
  {
    id: "1",
    from: "от 1 шт.",
    price: "1 690 ₽",
    save: "—",
    perPack: "1 690 ₽",
  },
  {
    id: "2",
    from: "от 10 шт.",
    price: "1 490 ₽",
    save: "−12%",
    perPack: "14 900 ₽",
    current: true,
  },
  {
    id: "3",
    from: "от 50 шт.",
    price: "1 290 ₽",
    save: "−24%",
    perPack: "64 500 ₽",
  },
  {
    id: "4",
    from: "от 200 шт.",
    price: "1 090 ₽",
    save: "−36%",
    perPack: "218 000 ₽",
  },
]

const DEFAULT_TERMS: Commerce076Term[] = [
  { id: "1", term: "Минимальная партия", value: "10 шт." },
  { id: "2", term: "НДС", value: "Включён в цену, 20%" },
  { id: "3", term: "Отсрочка платежа", value: "До 30 дней со второго заказа" },
  {
    id: "4",
    term: "Срок поставки",
    value: "3–5 дней со склада, до 21 под заказ",
  },
  { id: "5", term: "Документы", value: "УПД и счёт-фактура в день отгрузки" },
]

/**
 * Оптовый прайс по количеству: пороги таблицей, текущий уровень помечен,
 * до следующего посчитан шаг. Один файл, ноль зависимостей.
 */
export function Commerce076({
  kicker = "Оптовые цены",
  title = "Зерно «Плёс», обжарка под фильтр",
  lead = "Цена за штуку падает с объёмом партии. Уровень определяется количеством в одном заказе, накопительной скидки нет.",
  tiers = DEFAULT_TIERS,
  columnFrom = "Количество",
  columnPrice = "Цена за штуку",
  columnSave = "Выгода",
  columnPack = "Стоимость партии",
  currentLabel = "Ваш уровень",
  tableCaption = "Оптовый прайс по количеству в одном заказе",
  nextTitle = "Следующий уровень ближе, чем кажется.",
  nextStep = "Добавьте ещё 38 штук — цена упадёт до 1 290 ₽, и партия из 50 штук выйдет на 5 100 ₽ дешевле, чем 48 штук по текущей цене.",
  termsTitle = "Условия работы",
  terms = DEFAULT_TERMS,
  cta = "Добавить партию в заказ",
  secondary = "Запросить коммерческое предложение",
  note = "Цены действуют для заказов с оплатой по счёту от юридического лица. Для розничного заказа применяется обычная цена каталога.",
  accent,
  background = "",
  className,
  style,
}: Commerce076Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-076-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-076-bg": background,
          // Кнопка запроса не должна просвечивать: ей нужна непрозрачная
          // подложка, и это тот же цвет.
          "--vibeui-commerce-076-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-076" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-076"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <p data-part="kicker">{kicker}</p>
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <div data-part="scroll" tabIndex={0} role="group" aria-label={title}>
            <table>
              <caption>{tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{columnFrom}</th>
                  <th scope="col">{columnPrice}</th>
                  <th scope="col">{columnSave}</th>
                  <th scope="col">{columnPack}</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => (
                  <tr
                    key={tier.id}
                    data-part="row"
                    data-current={tier.current ? "true" : undefined}
                  >
                    <th scope="row">
                      {tier.from}
                      {tier.current ? (
                        <span data-part="now">{currentLabel}</span>
                      ) : null}
                    </th>
                    <td data-part="price">{tier.price}</td>
                    <td>{tier.save}</td>
                    <td>{tier.perPack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p data-part="next">
            <strong>{nextTitle}</strong> {nextStep}
          </p>

          <h3>{termsTitle}</h3>
          <dl>
            {terms.map((term) => (
              <div key={term.id} data-part="pair">
                <dt>{term.term}</dt>
                <dd>{term.value}</dd>
              </div>
            ))}
          </dl>

          <div data-part="actions">
            <button type="button" data-part="go">
              {cta}
            </button>
            <button type="button" data-part="alt">
              {secondary}
            </button>
          </div>
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
