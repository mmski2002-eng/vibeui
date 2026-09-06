import type { CSSProperties } from "react"

export type Pricing015Line = {
  title: string
  detail?: string
  amount: string
}

export type Pricing015Props = {
  merchant?: string
  documentNumber?: string
  date?: string
  lines?: Pricing015Line[]
  subtotalLabel?: string
  subtotal?: string
  discountLabel?: string
  discount?: string
  taxLabel?: string
  tax?: string
  totalLabel?: string
  total?: string
  action?: { label: string; href: string }
  footer?: string
  accent?: string
  /** Пусто — подложки нет, чек лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: итог оформлен как кассовый чек. Моноширинный шрифт и
// tabular-nums выстраивают суммы в колонку по разрядам — в чеке это не
// стилизация, а способ проверить сложение глазами. Верхний и нижний края
// вырезаны маской из повторяющихся радиальных градиентов: узнаваемая
// перфорация бумаги без единой картинки. Налог и скидка стоят отдельными
// строками до итога, потому что «включая НДС» мелким шрифтом порождает споры.
const STYLES = `
:where([data-vibeui-block="pricing-015"]){
--vibeui-pricing-015-bg:transparent;
--vibeui-pricing-015-paper:light-dark(oklch(0.995 0.004 100),oklch(0.24 0.008 100));
--vibeui-pricing-015-fg:light-dark(oklch(0.2 0.01 100),oklch(0.94 0.006 100));
--vibeui-pricing-015-muted:light-dark(oklch(0.5 0.012 100),oklch(0.7 0.012 100));
--vibeui-pricing-015-line:light-dark(oklch(0.86 0.01 100),oklch(0.38 0.012 100));
--vibeui-pricing-015-accent:light-dark(oklch(0.55 0.13 39.8),oklch(0.75 0.14 39.8));
--vibeui-pricing-015-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-pricing-015-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-pricing-015-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-015"]{color-scheme:dark}
[data-vibeui-block="pricing-015"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-015-bg);color:var(--vibeui-pricing-015-fg);
font-family:var(--vibeui-pricing-015-sans);
}
[data-vibeui-block="pricing-015"] *{box-sizing:border-box}
[data-vibeui-block="pricing-015"] [data-part="shell"]{max-width:34rem;width:100%;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="pricing-015"] [data-part="receipt"]{
padding:2rem 1.5rem;background:var(--vibeui-pricing-015-paper);
font-family:var(--vibeui-pricing-015-mono);font-size:0.8125rem;
-webkit-mask-image:radial-gradient(0.5rem 0.5rem at 0.5rem 0,transparent 0.42rem,black 0.44rem),radial-gradient(0.5rem 0.5rem at 0.5rem 100%,transparent 0.42rem,black 0.44rem);
mask-image:radial-gradient(0.5rem 0.5rem at 0.5rem 0,transparent 0.42rem,black 0.44rem),radial-gradient(0.5rem 0.5rem at 0.5rem 100%,transparent 0.42rem,black 0.44rem);
-webkit-mask-size:1rem 100%;mask-size:1rem 100%;
-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;
mask-composite:intersect;
}
[data-vibeui-block="pricing-015"] [data-part="brand"]{margin:0;text-align:center;font-family:var(--vibeui-pricing-015-sans);font-size:1rem;font-weight:700;letter-spacing:0.02em}
[data-vibeui-block="pricing-015"] [data-part="meta"]{
display:flex;justify-content:space-between;gap:1rem;margin:0.75rem 0 1.25rem;padding-bottom:0.875rem;
border-bottom:1px dashed var(--vibeui-pricing-015-line);font-size:0.75rem;color:var(--vibeui-pricing-015-muted);
}
[data-vibeui-block="pricing-015"] dl{margin:0}
[data-vibeui-block="pricing-015"] [data-part="line"]{display:flex;justify-content:space-between;gap:1rem;padding:0.4375rem 0;align-items:baseline}
[data-vibeui-block="pricing-015"] dt{margin:0;flex:1 1 auto}
[data-vibeui-block="pricing-015"] dd{margin:0;flex:0 0 auto;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-015"] [data-part="detail"]{display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-pricing-015-muted)}
[data-vibeui-block="pricing-015"] [data-part="rule"]{margin:0.875rem 0;border:0;border-top:1px dashed var(--vibeui-pricing-015-line)}
[data-vibeui-block="pricing-015"] [data-part="sums"]{display:grid;gap:0.375rem;font-size:0.8125rem;color:var(--vibeui-pricing-015-muted)}
[data-vibeui-block="pricing-015"] [data-part="sumrow"]{display:flex;justify-content:space-between;gap:1rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-015"] [data-part="discount"]{color:var(--vibeui-pricing-015-accent)}
[data-vibeui-block="pricing-015"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin-top:0.875rem;padding-top:0.875rem;
border-top:2px solid var(--vibeui-pricing-015-fg);
font-family:var(--vibeui-pricing-015-sans);font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="pricing-015"] [data-part="totalsum"]{font-size:1.625rem;letter-spacing:-0.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-015"] a{
display:flex;align-items:center;justify-content:center;margin-top:1.5rem;height:2.75rem;border-radius:0.5rem;
background:var(--vibeui-pricing-015-accent);color:var(--vibeui-pricing-015-accent-fg);
font-family:var(--vibeui-pricing-015-sans);font-size:0.9375rem;font-weight:650;text-decoration:none;
transition:background-color .16s ease;
}
[data-vibeui-block="pricing-015"] a:hover{background:color-mix(in oklab,var(--vibeui-pricing-015-accent) 86%,black)}
[data-vibeui-block="pricing-015"] a:focus-visible{outline:2px solid var(--vibeui-pricing-015-accent);outline-offset:3px}
[data-vibeui-block="pricing-015"] [data-part="footer"]{
margin:1.25rem 0 0;text-align:center;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-pricing-015-muted);
}
@container (min-width: 34rem){
[data-vibeui-block="pricing-015"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="pricing-015"] [data-part="receipt"]{padding:2.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Pricing015Line[] = [
  {
    title: "Тариф «Команда»",
    detail: "12 месяцев, до 5 участников",
    amount: "14 880,00 ₽",
  },
  {
    title: "Дополнительные места",
    detail: "3 × 390 ₽ × 12",
    amount: "14 040,00 ₽",
  },
  { title: "Секции под бренд", detail: "разовая работа", amount: "4 900,00 ₽" },
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

/** Чек с итогом и налогом: моноширинные суммы, перфорация краёв нарисована маской. */
export function Pricing015({
  merchant = "VIBEUI",
  documentNumber = "Счёт № 2026-0418",
  date = "14 марта 2026",
  lines = DEFAULT_LINES,
  subtotalLabel = "Подытог",
  subtotal = "33 820,00 ₽",
  discountLabel = "Скидка за год",
  discount = "−3 382,00 ₽",
  taxLabel = "НДС 20 %",
  tax = "6 087,60 ₽",
  totalLabel = "К оплате",
  total = "36 525,60 ₽",
  action = { label: "Оплатить счёт", href: "#" },
  footer = "Закрывающие документы придут на почту в течение суток после оплаты.",
  accent,
  background = "",
  className,
  style,
}: Pricing015Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="receipt">
            <h2 data-part="brand">{merchant}</h2>
            <p data-part="meta">
              <span>{documentNumber}</span>
              <span>{date}</span>
            </p>

            <dl>
              {lines.slice(0, 8).map((line) => (
                <div key={line.title} data-part="line">
                  <dt>
                    {line.title}
                    {line.detail ? (
                      <span data-part="detail">{line.detail}</span>
                    ) : null}
                  </dt>
                  <dd>{line.amount}</dd>
                </div>
              ))}
            </dl>

            <hr data-part="rule" />

            <div data-part="sums">
              <p data-part="sumrow">
                <span>{subtotalLabel}</span>
                <span>{subtotal}</span>
              </p>
              {discount ? (
                <p data-part="sumrow">
                  <span data-part="discount">{discountLabel}</span>
                  <span data-part="discount">{discount}</span>
                </p>
              ) : null}
              <p data-part="sumrow">
                <span>{taxLabel}</span>
                <span>{tax}</span>
              </p>
            </div>

            <p data-part="total">
              <span>{totalLabel}</span>
              <span data-part="totalsum">{total}</span>
            </p>

            <a href={action.href}>{action.label}</a>

            {footer ? <p data-part="footer">{footer}</p> : null}
          </div>
        </div>
      </section>
    </>
  )
}
