import type { CSSProperties } from "react"

export type Pricing005Props = {
  eyebrow?: string
  title?: string
  lede?: string
  price?: string
  period?: string
  oldPrice?: string
  includedTitle?: string
  included?: string[]
  action?: { label: string; href: string }
  secondary?: { label: string; href: string }
  guarantee?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: один тариф и всё, что в него входит. Выбирать не из чего, и
// секция этим пользуется: цена стоит крупно слева, перечень занимает правые
// две трети в две колонки, а не прячется под «показать ещё». Старая цена
// набрана в <s> — это не оформление, а семантика: скринридер объявит её как
// удалённую. Перечень длинный намеренно: у одного тарифа список входящего
// заменяет собой сравнение с соседями.
const STYLES = `
:where([data-vibeui-block="pricing-005"]){
--vibeui-pricing-005-bg:light-dark(oklch(0.985 0 275),oklch(0.21 0 275));
--vibeui-pricing-005-fg:light-dark(oklch(0.22 0 275),oklch(0.98 0 275));
--vibeui-pricing-005-muted:light-dark(oklch(0.5 0 275),oklch(0.75 0 275));
--vibeui-pricing-005-panel:light-dark(oklch(0.965 0.012 39.8),oklch(0.26 0.035 39.8));
--vibeui-pricing-005-line:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 14%));
--vibeui-pricing-005-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.82 0.15 39.8));
--vibeui-pricing-005-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.2 0.04 39.8));
--vibeui-pricing-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-005"]{color-scheme:dark}
[data-vibeui-block="pricing-005"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-005-bg);color:var(--vibeui-pricing-005-fg);
font-family:var(--vibeui-pricing-005-sans);
}
[data-vibeui-block="pricing-005"] *{box-sizing:border-box}
[data-vibeui-block="pricing-005"] [data-part="shell"]{max-width:64rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-005"] [data-part="card"]{
display:grid;grid-template-columns:1fr;gap:2rem;padding:1.75rem;border-radius:1.25rem;
border:1px solid var(--vibeui-pricing-005-line);background:var(--vibeui-pricing-005-panel);
}
[data-vibeui-block="pricing-005"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-005-accent);
}
[data-vibeui-block="pricing-005"] h2{margin:0;font-size:clamp(1.375rem,3.6cqi,2rem);line-height:1.14;letter-spacing:-0.025em;font-weight:700;text-wrap:balance}
[data-vibeui-block="pricing-005"] [data-part="lede"]{margin:0.75rem 0 0;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-pricing-005-muted);text-wrap:pretty}
[data-vibeui-block="pricing-005"] [data-part="prices"]{
display:flex;align-items:baseline;flex-wrap:wrap;gap:0.5rem;margin:1.5rem 0 0;
}
[data-vibeui-block="pricing-005"] [data-part="price"]{
font-size:clamp(2.5rem,7cqi,3.5rem);line-height:1;font-weight:700;letter-spacing:-0.045em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-005"] s{font-size:1.125rem;color:var(--vibeui-pricing-005-muted)}
[data-vibeui-block="pricing-005"] [data-part="period"]{font-size:0.875rem;color:var(--vibeui-pricing-005-muted)}
[data-vibeui-block="pricing-005"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.625rem;margin:1.5rem 0 0}
[data-vibeui-block="pricing-005"] a{
display:inline-flex;align-items:center;justify-content:center;height:2.875rem;padding:0 1.5rem;border-radius:0.75rem;
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:opacity .16s ease,border-color .16s ease;
}
[data-vibeui-block="pricing-005"] [data-part="primary"]{background:var(--vibeui-pricing-005-accent);color:var(--vibeui-pricing-005-accent-fg);border:1px solid transparent}
[data-vibeui-block="pricing-005"] [data-part="secondary"]{border:1px solid var(--vibeui-pricing-005-line);color:var(--vibeui-pricing-005-fg)}
[data-vibeui-block="pricing-005"] a:hover{opacity:.88}
[data-vibeui-block="pricing-005"] a:focus-visible{outline:2px solid var(--vibeui-pricing-005-accent);outline-offset:3px}
[data-vibeui-block="pricing-005"] [data-part="guarantee"]{margin:1rem 0 0;font-size:0.8125rem;color:var(--vibeui-pricing-005-muted)}
[data-vibeui-block="pricing-005"] h3{
margin:0 0 1rem;padding-bottom:0.625rem;border-bottom:1px solid var(--vibeui-pricing-005-line);
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--vibeui-pricing-005-muted);
}
[data-vibeui-block="pricing-005"] ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:0.625rem}
[data-vibeui-block="pricing-005"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="pricing-005"] [data-part="tick"]{flex:0 0 auto;margin-top:0.25rem;color:var(--vibeui-pricing-005-accent)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-005"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-005"] [data-part="card"]{padding:2.25rem}
[data-vibeui-block="pricing-005"] ul{grid-template-columns:repeat(2,minmax(0,1fr));gap:0.625rem 1.5rem}
[data-vibeui-block="pricing-005"] [data-part="actions"]{flex-direction:row}
}
@container (min-width: 56rem){
[data-vibeui-block="pricing-005"] [data-part="card"]{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:3rem;padding:2.75rem}
[data-vibeui-block="pricing-005"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_INCLUDED = [
  "Все 1 080 секций каталога",
  "Неограниченное число проектов",
  "Инструкция для ИИ-агента к каждой секции",
  "Обновления и новые секции каждую неделю",
  "Приватные пресеты палитры",
  "Экспорт в shadcn-совместимый реестр",
  "Поддержка по почте за один рабочий день",
  "Коммерческое использование без ограничений",
]

/** Один тариф с полным перечнем входящего: цена слева, список в две колонки справа. */
export function Pricing005({
  eyebrow = "Один тариф",
  title = "Всё включено — выбирать не из чего",
  lede = "Мы не режем каталог на уровни и не прячем секции за апгрейдом. Один платёж открывает всё сразу.",
  price = "9 900 ₽",
  period = "в год",
  oldPrice = "14 900 ₽",
  includedTitle = "Что входит",
  included = DEFAULT_INCLUDED,
  action = { label: "Оформить доступ", href: "#" },
  secondary = { label: "Задать вопрос", href: "#" },
  guarantee = "Возврат в течение 30 дней без объяснения причин.",
  accent,
  className,
  style,
}: Pricing005Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2>{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}

              <p data-part="prices">
                <span data-part="price">{price}</span>
                {oldPrice ? <s>{oldPrice}</s> : null}
                <span data-part="period">{period}</span>
              </p>

              <div data-part="actions">
                <a data-part="primary" href={action.href}>
                  {action.label}
                </a>
                <a data-part="secondary" href={secondary.href}>
                  {secondary.label}
                </a>
              </div>

              {guarantee ? <p data-part="guarantee">{guarantee}</p> : null}
            </div>

            <div>
              <h3>{includedTitle}</h3>
              <ul>
                {included.slice(0, 10).map((item) => (
                  <li key={item}>
                    <span data-part="tick" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="12" height="12">
                        <path
                          d="M3.5 8.5 6.5 11.5 12.5 4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
