import type { CSSProperties } from "react"

export type Commerce023Line = {
  title: string
  count: number
  price: number
  vat?: number
}

export type Commerce023Props = {
  title?: string
  shop?: string
  number?: string
  when?: string
  lines?: Commerce023Line[]
  discount?: number
  shipping?: number
  paid?: string
  cta?: string
  fiscal?: string
  /** Подпись таблицы позиций. */
  linesLabel?: string
  /** Шаблон ставки налога у позиции, {rate} — процент. */
  vatRateText?: string
  /** Подписи строк итога. */
  goodsLabel?: string
  discountLabel?: string
  shippingLabel?: string
  totalLabel?: string
  paidLabel?: string
  /** Подпись разбивки включённого налога. */
  vatText?: string
  /** Локаль для разрядов в суммах. */
  locale?: string
  /** Шаблон суммы, {value} — число с разрядами. */
  priceText?: string
  accent?: string
  /** Пусто — подложки нет, чек лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: чек, где налог показан по ставкам и подписан «в том числе».
// Строка «НДС» без пояснения читается как приписка сверху, и итог перестают
// понимать. Суммы считаются из позиций, включая налог по каждой ставке,
// поэтому чек сходится после любой правки данных. Нижний край вырезан маской,
// чтобы карточка читалась чеком без единой картинки.
const STYLES = `
:where([data-vibeui-block="commerce-023"]){
--vibeui-commerce-023-bg:transparent;
--vibeui-commerce-023-paper:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-commerce-023-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-023-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-023-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-commerce-023-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-commerce-023-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-commerce-023-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-023"]{color-scheme:dark}
[data-vibeui-block="commerce-023"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.25rem 1rem;
background:var(--vibeui-commerce-023-bg);
font-family:var(--vibeui-commerce-023-sans);color:var(--vibeui-commerce-023-fg);
}
[data-vibeui-block="commerce-023"] *{box-sizing:border-box}
[data-vibeui-block="commerce-023"] [data-part="shell"]{max-width:26rem;margin:0 auto}
/* Нижний край вырезан маской: чек узнаётся формой, без картинки. */
[data-vibeui-block="commerce-023"] [data-part="paper"]{
padding:1rem 1rem 1.5rem;background:var(--vibeui-commerce-023-paper);
border-radius:0.75rem 0.75rem 0 0;
box-shadow:0 1px 2px oklch(0 0 0 / 6%),0 8px 24px oklch(0 0 0 / 6%);
mask-image:linear-gradient(#000 calc(100% - 0.5rem),transparent 0),radial-gradient(0.5rem 0.5rem at 0.5rem 100%,transparent 98%,#000 100%);
mask-size:100% 100%,1rem 1rem;
mask-repeat:no-repeat,repeat-x;
mask-position:top left,bottom left;
}
[data-vibeui-block="commerce-023"] [data-part="head"]{text-align:center;padding-bottom:0.75rem;border-bottom:1px dashed var(--vibeui-commerce-023-border)}
[data-vibeui-block="commerce-023"] h2{margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase}
[data-vibeui-block="commerce-023"] [data-part="shop"]{margin:0.1875rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-023-muted);line-height:1.45}
[data-vibeui-block="commerce-023"] table{width:100%;border-collapse:collapse;margin:0.75rem 0;font-size:0.75rem}
[data-vibeui-block="commerce-023"] caption{
caption-side:top;text-align:left;font-size:0.625rem;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-commerce-023-muted);padding-bottom:0.375rem;
}
[data-vibeui-block="commerce-023"] th,
[data-vibeui-block="commerce-023"] td{padding:0.25rem 0;text-align:left;vertical-align:top}
[data-vibeui-block="commerce-023"] [data-col="sum"]{text-align:right;font-family:var(--vibeui-commerce-023-mono);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="commerce-023"] [data-part="mult"]{display:block;font-size:0.6875rem;color:var(--vibeui-commerce-023-muted);font-family:var(--vibeui-commerce-023-mono)}
[data-vibeui-block="commerce-023"] [data-part="rate"]{font-size:0.625rem;color:var(--vibeui-commerce-023-muted)}
[data-vibeui-block="commerce-023"] dl{
margin:0;padding-top:0.625rem;border-top:1px dashed var(--vibeui-commerce-023-border);
display:grid;grid-template-columns:1fr auto;gap:0.3125rem 0.75rem;font-size:0.75rem;
}
[data-vibeui-block="commerce-023"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-023"] dt{color:var(--vibeui-commerce-023-muted)}
[data-vibeui-block="commerce-023"] dd{margin:0;text-align:right;font-family:var(--vibeui-commerce-023-mono);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-023"] [data-total="true"] dt,
[data-vibeui-block="commerce-023"] [data-total="true"] dd{
font-size:1rem;font-weight:700;color:var(--vibeui-commerce-023-fg);padding-top:0.375rem;
}
/* «В том числе НДС» — иначе налог читают как приписку сверх итога. */
[data-vibeui-block="commerce-023"] [data-part="vat"]{
margin:0.5rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-023-muted);line-height:1.5;
}
[data-vibeui-block="commerce-023"] [data-part="foot"]{
margin-top:0.75rem;padding-top:0.625rem;border-top:1px dashed var(--vibeui-commerce-023-border);
display:flex;gap:0.75rem;align-items:center;
}
[data-vibeui-block="commerce-023"] [data-part="qr"]{
width:3.25rem;height:3.25rem;flex:none;border-radius:0.25rem;
background:
conic-gradient(from 0deg at 50% 50%,var(--vibeui-commerce-023-fg) 0 25%,transparent 0 50%,var(--vibeui-commerce-023-fg) 0 75%,transparent 0);
background-size:0.5rem 0.5rem;
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-023-border);
}
[data-vibeui-block="commerce-023"] [data-part="fiscal"]{margin:0;font-size:0.625rem;line-height:1.5;color:var(--vibeui-commerce-023-muted);font-family:var(--vibeui-commerce-023-mono)}
[data-vibeui-block="commerce-023"] [data-part="save"]{
display:block;width:100%;margin-top:0.75rem;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-023-border);background:var(--vibeui-commerce-023-paper);
color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-023"] [data-part="save"]:focus-visible{outline:2px solid var(--vibeui-commerce-023-accent);outline-offset:2px}
@container (min-width: 30rem){
[data-vibeui-block="commerce-023"] [data-part="paper"]{padding:1.25rem 1.25rem 1.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-023"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Commerce023Line[] = [
  { title: "Кресло «Хмарь», песочный", count: 1, price: 38900, vat: 20 },
  { title: "Плед «Пасмурно»", count: 2, price: 7400, vat: 20 },
  { title: "Набор для ухода", count: 1, price: 1900, vat: 10 },
]

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

/**
 * Чек с позициями и налогом: НДС посчитан по ставкам и подписан «в том числе».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce023({
  title = "Кассовый чек",
  shop = "ООО «Хмарь» · ИНН 7712345678 · Москва, Пушкина 12",
  number = "№ 2024-1187",
  when = "10 марта, 14:02",
  lines = DEFAULT_LINES,
  discount = 2685,
  shipping = 490,
  paid = "Картой •• 4417",
  cta = "Скачать PDF",
  fiscal = "ФН 9960440301234567 · ФД 4417 · ФПД 2837451190",
  linesLabel = "Позиции",
  vatRateText = "НДС {rate}%",
  goodsLabel = "Товары",
  discountLabel = "Скидка",
  shippingLabel = "Доставка",
  totalLabel = "Итого",
  paidLabel = "Оплата",
  vatText = "В том числе НДС:",
  locale = "ru-RU",
  priceText = "{value} ₽",
  accent,
  background = "",
  className,
  style,
}: Commerce023Props) {
  const money = (value: number) =>
    priceText.replace(
      "{value}",
      (Math.round(value * 100) / 100).toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    )

  // Суммы считаются из позиций, поэтому чек сходится после любой правки.
  const goods = lines.reduce((sum, line) => sum + line.price * line.count, 0)
  const total = goods - discount + shipping

  const rates = Array.from(new Set(lines.map((line) => line.vat ?? 20))).sort(
    (first, second) => second - first,
  )

  const vatOf = (rate: number) =>
    lines
      .filter((line) => (line.vat ?? 20) === rate)
      .reduce(
        (sum, line) => sum + (line.price * line.count * rate) / (100 + rate),
        0,
      )

  const palette = {
    ...(accent ? { "--vibeui-commerce-023-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-023-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-023" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-023"
        className={className}
        style={palette}
        aria-label={`${title} ${number}`}
      >
        <div data-part="shell">
          <div data-part="paper">
            <div data-part="head">
              <h2>{title}</h2>
              <p data-part="shop">{shop}</p>
              <p data-part="shop">
                {number} · {when}
              </p>
            </div>

            <table>
              <caption>{linesLabel}</caption>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.title}>
                    <td>
                      {line.title}
                      <span data-part="mult">
                        {line.count} × {money(line.price)}
                        <span data-part="rate">
                          {" · "}
                          {vatRateText.replace(
                            "{rate}",
                            String(line.vat ?? 20),
                          )}
                        </span>
                      </span>
                    </td>
                    <td data-col="sum">{money(line.price * line.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <dl>
              <div data-part="pair">
                <dt>{goodsLabel}</dt>
                <dd>{money(goods)}</dd>
              </div>
              <div data-part="pair">
                <dt>{discountLabel}</dt>
                <dd>−{money(discount)}</dd>
              </div>
              <div data-part="pair">
                <dt>{shippingLabel}</dt>
                <dd>{money(shipping)}</dd>
              </div>
              <div data-part="pair" data-total="true">
                <dt>{totalLabel}</dt>
                <dd>{money(total)}</dd>
              </div>
              <div data-part="pair">
                <dt>{paidLabel}</dt>
                <dd>{paid}</dd>
              </div>
            </dl>

            <p data-part="vat">
              {vatText}{" "}
              {rates.map((rate, index) => (
                <span key={rate}>
                  {index > 0 ? " · " : ""}
                  {rate}% — {money(vatOf(rate))}
                </span>
              ))}
            </p>

            <div data-part="foot">
              <span data-part="qr" aria-hidden="true" />
              <p data-part="fiscal">{fiscal}</p>
            </div>
          </div>

          <button type="button" data-part="save">
            {cta}
          </button>
        </div>
      </section>
    </>
  )
}
