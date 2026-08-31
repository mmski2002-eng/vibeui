import type { CSSProperties } from "react"

type Footer007Link = {
  label: string
  href: string
}

type Footer007Column = {
  title: string
  links: Footer007Link[]
}

type Footer007Payment = {
  label: string
  short: string
}

export type Footer007Props = {
  brand?: string
  columns?: Footer007Column[]
  payments?: Footer007Payment[]
  paymentsNote?: string
  deliveryNote?: string
  legal?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Подвал магазина. Ряд способов оплаты стоит над копирайтом, а не среди
// ссылок: перед оплатой люди спускаются вниз именно за ним. Плашки — не
// картинки платёжных систем, а текстовые начертания: логотипы требуют
// лицензии и обновляются, а подвал должен пережить и то и другое.
const STYLES = `
:where([data-vibeui-block="footer-007"]){
--vibeui-footer-007-bg:oklch(0.98 0.005 60);
--vibeui-footer-007-card:oklch(1 0 0);
--vibeui-footer-007-ink:oklch(0.21 0.014 60);
--vibeui-footer-007-muted:oklch(0.51 0.014 60);
--vibeui-footer-007-border:oklch(0.89 0.008 60);
--vibeui-footer-007-accent:oklch(0.6 0.19 34);
--vibeui-footer-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="footer-007"]{
display:block;background:var(--vibeui-footer-007-bg);color:var(--vibeui-footer-007-ink);
border-top:1px solid var(--vibeui-footer-007-border);
font-family:var(--vibeui-footer-007-font);
}
[data-vibeui-block="footer-007"] [data-part="shell"]{
max-width:78rem;margin:0 auto;padding:2.75rem 1.25rem 1.5rem;
}
[data-vibeui-block="footer-007"] [data-part="columns"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.75rem 1.25rem;
}
[data-vibeui-block="footer-007"] [data-part="column-title"]{
margin:0 0 0.625rem;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-007"] [data-part="column"] ul{margin:0;padding:0;list-style:none;display:grid;gap:0.4375rem}
[data-vibeui-block="footer-007"] [data-part="column"] a{
color:var(--vibeui-footer-007-muted);text-decoration:none;font-size:0.875rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-007"] [data-part="column"] a:hover{color:var(--vibeui-footer-007-accent)}
[data-vibeui-block="footer-007"] [data-part="pay"]{
display:grid;gap:0.75rem;
margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--vibeui-footer-007-border);
}
[data-vibeui-block="footer-007"] [data-part="pay-title"]{
margin:0;color:var(--vibeui-footer-007-muted);
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="footer-007"] [data-part="methods"]{
display:flex;flex-wrap:wrap;gap:0.5rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="footer-007"] [data-part="method"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:3.25rem;height:2rem;padding:0 0.625rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-footer-007-border);background:var(--vibeui-footer-007-card);
color:var(--vibeui-footer-007-ink);
font-size:0.6875rem;font-weight:750;letter-spacing:0.04em;
}
[data-vibeui-block="footer-007"] [data-part="pay-note"]{
margin:0;max-width:60ch;color:var(--vibeui-footer-007-muted);font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="footer-007"] [data-part="delivery"]{
margin:1.25rem 0 0;padding:0.875rem 1rem;border-radius:0.875rem;
background:color-mix(in oklab,var(--vibeui-footer-007-accent) 8%,transparent);
color:var(--vibeui-footer-007-ink);font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="footer-007"] [data-part="bottom"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 1rem;
margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-footer-007-border);
color:var(--vibeui-footer-007-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-007"] [data-part="brand"]{color:var(--vibeui-footer-007-ink);font-weight:750;letter-spacing:-0.02em}
[data-vibeui-block="footer-007"] a:focus-visible{outline:2px solid var(--vibeui-footer-007-accent);outline-offset:2px}
@container (min-width: 48rem){
[data-vibeui-block="footer-007"] [data-part="shell"]{padding:3.5rem 2rem 1.75rem}
[data-vibeui-block="footer-007"] [data-part="columns"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:2rem}
[data-vibeui-block="footer-007"] [data-part="pay"]{grid-template-columns:auto 1fr;align-items:center;column-gap:1.5rem}
[data-vibeui-block="footer-007"] [data-part="pay-title"]{grid-row:1}
[data-vibeui-block="footer-007"] [data-part="pay-note"]{grid-column:1 / -1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Footer007Column[] = [
  {
    title: "Каталог",
    links: [
      { label: "Посуда", href: "#tableware" },
      { label: "Текстиль", href: "#textile" },
      { label: "Свет", href: "#light" },
      { label: "Распродажа", href: "#sale" },
    ],
  },
  {
    title: "Покупателям",
    links: [
      { label: "Доставка", href: "#delivery" },
      { label: "Оплата", href: "#payment" },
      { label: "Возврат и обмен", href: "#returns" },
      { label: "Гарантия", href: "#warranty" },
    ],
  },
  {
    title: "Магазин",
    links: [
      { label: "О нас", href: "#about" },
      { label: "Точки выдачи", href: "#pickup" },
      { label: "Оптом", href: "#wholesale" },
      { label: "Вакансии", href: "#jobs" },
    ],
  },
  {
    title: "Помощь",
    links: [
      { label: "Частые вопросы", href: "#faq" },
      { label: "Отследить заказ", href: "#track" },
      { label: "Связаться с нами", href: "#contact" },
    ],
  },
]

const DEFAULT_PAYMENTS: Footer007Payment[] = [
  { label: "Банковские карты «Мир»", short: "МИР" },
  { label: "Система быстрых платежей", short: "СБП" },
  { label: "Оплата долями", short: "ДОЛИ" },
  { label: "Наличными курьеру", short: "НАЛ" },
  { label: "Счёт для юридических лиц", short: "СЧЁТ" },
]

/** Подвал магазина: ряд способов оплаты стоит над копирайтом, а не в ссылках. */
export function Footer007({
  brand = "Дом и лад",
  columns = DEFAULT_COLUMNS,
  payments = DEFAULT_PAYMENTS,
  paymentsNote = "Оплата проходит на защищённой странице банка. Данные карты не попадают в магазин и нигде у нас не хранятся.",
  deliveryNote = "Бесплатная доставка по городу от 5 000 ₽, самовывоз из пункта выдачи — в день заказа.",
  legal = "© 2026 ООО «Дом и лад». ОГРН 1157700000000",
  accent,
  className,
  style,
}: Footer007Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-007" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="columns">
            {columns.map((column) => (
              <nav
                key={column.title}
                data-part="column"
                aria-label={column.title}
              >
                <p data-part="column-title">{column.title}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <p data-part="delivery">{deliveryNote}</p>
          <section data-part="pay" aria-label="Способы оплаты">
            <p data-part="pay-title">Принимаем к оплате</p>
            <ul data-part="methods">
              {payments.map((payment) => (
                <li
                  key={payment.short}
                  data-part="method"
                  title={payment.label}
                  aria-label={payment.label}
                >
                  {payment.short}
                </li>
              ))}
            </ul>
            <p data-part="pay-note">{paymentsNote}</p>
          </section>
          <div data-part="bottom">
            <span data-part="brand">{brand}</span>
            <span>{legal}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
