import type { CSSProperties } from "react"

export type Commerce017Product = {
  id: string
  title: string
  price: string
  hue?: number
  best?: boolean
}

export type Commerce017Row = {
  label: string
  values: string[]
  best?: number
}

export type Commerce017Props = {
  title?: string
  products?: Commerce017Product[]
  rows?: Commerce017Row[]
  toggle?: string
  cta?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: сравнение таблицей, где одинаковые строки можно спрятать одной
// галочкой. В сравнении трёх товаров половина характеристик совпадает и
// глушит различия — переключатель убирает их без JS, через :has(). Первая
// колонка залипает при горизонтальной прокрутке, иначе на телефоне значения
// теряют подписи. Лучшее значение помечено словом «лучшее», а не только цветом.
const STYLES = `
:where([data-vibeui-block="commerce-017"]){
--vibeui-commerce-017-bg:oklch(1 0 0);
--vibeui-commerce-017-fg:oklch(0.21 0.014 265);
--vibeui-commerce-017-muted:oklch(0.55 0.014 265);
--vibeui-commerce-017-border:oklch(0.91 0.006 265);
--vibeui-commerce-017-soft:oklch(0.975 0.004 265);
--vibeui-commerce-017-accent:oklch(0.55 0.2 262);
--vibeui-commerce-017-ok:oklch(0.58 0.14 152);
--vibeui-commerce-017-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-017"]{
box-sizing:border-box;
background:var(--vibeui-commerce-017-bg);
font-family:var(--vibeui-commerce-017-sans);color:var(--vibeui-commerce-017-fg);
}
[data-vibeui-block="commerce-017"] *{box-sizing:border-box}
[data-vibeui-block="commerce-017"] [data-part="shell"]{padding:1rem;max-width:64rem;margin:0 auto}
[data-vibeui-block="commerce-017"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 1rem;margin-bottom:0.75rem}
[data-vibeui-block="commerce-017"] h2{margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.02em}
/* Переключатель «только различия» работает на :has() — таблица остаётся серверной. */
[data-vibeui-block="commerce-017"] [data-part="only"]{
margin-left:auto;display:inline-flex;align-items:center;gap:0.5rem;cursor:pointer;
font-size:0.75rem;color:var(--vibeui-commerce-017-muted);
}
[data-vibeui-block="commerce-017"] [data-part="only"] input{accent-color:var(--vibeui-commerce-017-accent);width:1rem;height:1rem;margin:0}
[data-vibeui-block="commerce-017"] [data-part="only"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-017-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="commerce-017"] [data-part="vh"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-017"] [data-part="scroll"]{overflow-x:auto;border:1px solid var(--vibeui-commerce-017-border);border-radius:1rem}
[data-vibeui-block="commerce-017"] table{border-collapse:collapse;width:100%;min-width:34rem;font-size:0.8125rem}
[data-vibeui-block="commerce-017"] th,
[data-vibeui-block="commerce-017"] td{padding:0.625rem 0.75rem;text-align:left;vertical-align:top;border-bottom:1px solid var(--vibeui-commerce-017-border)}
[data-vibeui-block="commerce-017"] tbody tr:last-child th,
[data-vibeui-block="commerce-017"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="commerce-017"] [data-part="rowhead"]{
position:sticky;left:0;z-index:1;width:9rem;
background:var(--vibeui-commerce-017-soft);color:var(--vibeui-commerce-017-muted);
font-weight:600;font-size:0.75rem;
}
[data-vibeui-block="commerce-017"] thead th{background:var(--vibeui-commerce-017-bg);vertical-align:bottom}
[data-vibeui-block="commerce-017"] thead [data-part="rowhead"]{background:var(--vibeui-commerce-017-soft)}
[data-vibeui-block="commerce-017"] [data-part="shot"]{
display:block;width:100%;max-width:5rem;aspect-ratio:4/3;border-radius:0.5rem;margin-bottom:0.375rem;
background:linear-gradient(145deg,oklch(0.94 0.05 var(--vibeui-commerce-017-hue,262)),oklch(0.86 0.09 var(--vibeui-commerce-017-hue,262)));
}
[data-vibeui-block="commerce-017"] [data-part="name"]{display:block;font-size:0.8125rem;font-weight:650;line-height:1.25}
[data-vibeui-block="commerce-017"] [data-part="price"]{display:block;margin-top:0.125rem;font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-017"] [data-part="pick"]{
display:inline-block;margin-top:0.375rem;padding:0.1875rem 0.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-commerce-017-accent) 14%,transparent);
color:var(--vibeui-commerce-017-accent);font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="commerce-017"] [data-best="true"]{font-weight:650}
[data-vibeui-block="commerce-017"] [data-part="best"]{
display:block;font-size:0.625rem;font-weight:700;color:var(--vibeui-commerce-017-ok);letter-spacing:0.02em;
}
[data-vibeui-block="commerce-017"] [data-part="table"]:has([data-part="only"] input:checked) [data-same="true"]{display:none}
[data-vibeui-block="commerce-017"] [data-part="buy"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.25rem;border-radius:0.625rem;
background:var(--vibeui-commerce-017-accent);color:oklch(1 0 0);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="commerce-017"] [data-part="buy"]:focus-visible{outline:2px solid var(--vibeui-commerce-017-accent);outline-offset:2px}
@container (min-width: 40rem){
[data-vibeui-block="commerce-017"] table{font-size:0.875rem}
[data-vibeui-block="commerce-017"] [data-part="rowhead"]{width:12rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRODUCTS: Commerce017Product[] = [
  { id: "a", title: "Кресло «Хмарь»", price: "38 900 ₽", hue: 75, best: true },
  { id: "b", title: "Кресло «Полдень»", price: "44 200 ₽", hue: 150 },
  { id: "c", title: "Кресло «Туман»", price: "29 700 ₽", hue: 262 },
]

const DEFAULT_ROWS: Commerce017Row[] = [
  { label: "Каркас", values: ["Дуб", "Дуб", "Дуб"] },
  { label: "Обивка", values: ["Шерсть", "Лён", "Рогожка"] },
  { label: "Гарантия", values: ["12 лет", "5 лет", "3 года"], best: 0 },
  { label: "Вес", values: ["18 кг", "23 кг", "16 кг"], best: 2 },
  { label: "Сборка", values: ["Не нужна", "Не нужна", "Не нужна"] },
  { label: "Доставка", values: ["Завтра", "5 дней", "Завтра"] },
]

/**
 * Сравнение товаров таблицей: одинаковые строки прячутся галочкой без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce017({
  title = "Сравнение кресел",
  products = DEFAULT_PRODUCTS,
  rows = DEFAULT_ROWS,
  toggle = "Только различия",
  cta = "В корзину",
  accent,
  className,
  style,
}: Commerce017Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-017" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-017"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="table">
            <div data-part="top">
              <h2>{title}</h2>
              <label data-part="only">
                <input type="checkbox" />
                {toggle}
              </label>
            </div>

            <div data-part="scroll" tabIndex={0}>
              <table>
                <caption data-part="vh">
                  Характеристики трёх кресел по строкам
                </caption>
                <thead>
                  <tr>
                    <th scope="col" data-part="rowhead">
                      Характеристика
                    </th>
                    {products.map((product) => (
                      <th
                        key={product.id}
                        scope="col"
                        style={
                          {
                            "--vibeui-commerce-017-hue": product.hue ?? 262,
                          } as CSSProperties
                        }
                      >
                        <span data-part="shot" aria-hidden="true" />
                        <span data-part="name">{product.title}</span>
                        <span data-part="price">{product.price}</span>
                        {product.best ? (
                          <span data-part="pick">Наш выбор</span>
                        ) : null}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const same = new Set(row.values).size === 1

                    return (
                      <tr key={row.label} data-same={same ? "true" : undefined}>
                        <th scope="row" data-part="rowhead">
                          {row.label}
                        </th>
                        {row.values.map((value, index) => (
                          <td
                            key={`${row.label}-${index}`}
                            data-best={row.best === index ? "true" : undefined}
                          >
                            {value}
                            {row.best === index ? (
                              <span data-part="best">лучшее</span>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                  <tr>
                    <th scope="row" data-part="rowhead">
                      Покупка
                    </th>
                    {products.map((product) => (
                      <td key={`buy-${product.id}`}>
                        <button type="button" data-part="buy">
                          {cta}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
