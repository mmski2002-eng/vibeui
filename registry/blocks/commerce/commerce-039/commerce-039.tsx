import type { CSSProperties } from "react"

export type Commerce039Deal = {
  id: string
  title: string
  grade: string
  defect: string
  price: string
  full: string
  cut: string
  left: number
  hue?: number
}

export type Commerce039Props = {
  title?: string
  lead?: string
  note?: string
  deals?: Commerce039Deal[]
  cta?: string
  /** Подпись перед зачёркнутой ценой, слышна только скринридеру. */
  fullPriceLabel?: string
  /** Остаток: {count} — число штук. */
  leftText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: витрина уценки, где причина скидки написана на карточке.
// «−40%» без объяснения выглядит как обман, а «витринный образец, потёртость
// на ножке» — как честная сделка, и такой товар возвращают реже. Остаток
// назван числом: у уценённой позиции он почти всегда единичный, и это часть
// предложения, а не украшение.
const STYLES = `
:where([data-vibeui-block="commerce-039"]){
--vibeui-commerce-039-bg:transparent;
--vibeui-commerce-039-fg:light-dark(oklch(0.21 0.014 265),oklch(0.93 0.006 265));
--vibeui-commerce-039-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-commerce-039-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-commerce-039-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.009 265));
--vibeui-commerce-039-accent:light-dark(oklch(0.55 0.19 25),oklch(0.72 0.17 25));
--vibeui-commerce-039-onaccent:light-dark(oklch(1 0 0),oklch(0.18 0.03 25));
--vibeui-commerce-039-onfg:light-dark(oklch(1 0 0),oklch(0.18 0.01 265));
--vibeui-commerce-039-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-039"]{
box-sizing:border-box;background:var(--vibeui-commerce-039-bg);
color:var(--vibeui-commerce-039-fg);font-family:var(--vibeui-commerce-039-sans);
}
[data-vibeui-block="commerce-039"] *{box-sizing:border-box}
[data-vibeui-block="commerce-039"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-039"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-039"] [data-part="lead"]{margin:0 0 0.75rem;max-width:44rem;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-039-muted)}
[data-vibeui-block="commerce-039"] [data-part="note"]{
margin:0 0 1rem;padding:0.625rem 0.75rem;border-radius:0.875rem;background:var(--vibeui-commerce-039-soft);
font-size:0.75rem;line-height:1.5;
}
[data-vibeui-block="commerce-039"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
@container (min-width: 34rem){
[data-vibeui-block="commerce-039"] ul{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 54rem){
[data-vibeui-block="commerce-039"] ul{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="commerce-039"] [data-part="deal"]{
position:relative;display:flex;flex-direction:column;
border:1px solid var(--vibeui-commerce-039-border);border-radius:1.125rem;overflow:hidden;
}
[data-vibeui-block="commerce-039"] [data-part="deal"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-039-accent);outline-offset:2px}
[data-vibeui-block="commerce-039"] [data-part="cover"]{
position:relative;aspect-ratio:4 / 3;
background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-039-hue,25)),oklch(0.85 0.09 var(--vibeui-commerce-039-hue,25)));
}
[data-vibeui-block="commerce-039"] [data-part="cut"]{
position:absolute;top:0.5rem;left:0.5rem;padding:0.25rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-commerce-039-accent);color:var(--vibeui-commerce-039-onaccent);font-size:0.75rem;font-weight:750;
}
[data-vibeui-block="commerce-039"] [data-part="grade"]{
position:absolute;top:0.5rem;right:0.5rem;padding:0.1875rem 0.5rem;border-radius:0.5rem;
background:oklch(1 0 0 / 90%);color:oklch(0.21 0.014 265);font-size:0.625rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="commerce-039"] [data-part="body"]{padding:0.75rem 0.875rem 0.875rem;display:flex;flex-direction:column;flex:1 1 auto}
[data-vibeui-block="commerce-039"] [data-part="name"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="commerce-039"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-039"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
/* Причина уценки написана словами: «−40%» без объяснения читается как обман. */
[data-vibeui-block="commerce-039"] [data-part="defect"]{
margin:0.375rem 0 0;padding:0.4375rem 0.5rem;border-radius:0.625rem;
background:var(--vibeui-commerce-039-soft);border-left:2px solid var(--vibeui-commerce-039-accent);
font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-039-muted);
}
[data-vibeui-block="commerce-039"] [data-part="prices"]{
margin:0.625rem 0 0;display:flex;align-items:baseline;gap:0.5rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-039"] [data-part="prices"] b{font-size:1.125rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="commerce-039"] [data-part="prices"] s{font-size:0.8125rem;color:var(--vibeui-commerce-039-muted)}
[data-vibeui-block="commerce-039"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-039"] [data-part="left"]{
margin:0.375rem 0 0;font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-039-accent);
}
[data-vibeui-block="commerce-039"] [data-part="bar"]{
margin-top:0.3125rem;height:0.25rem;border-radius:9999px;background:var(--vibeui-commerce-039-soft);overflow:hidden;
}
[data-vibeui-block="commerce-039"] [data-part="bar"] i{
display:block;height:100%;border-radius:9999px;background:var(--vibeui-commerce-039-accent);
width:var(--vibeui-commerce-039-fill,20%);
}
[data-vibeui-block="commerce-039"] [data-part="buy"]{
margin-top:auto;padding-top:0.75rem;
}
[data-vibeui-block="commerce-039"] [data-part="buy"] button{
position:relative;z-index:1;width:100%;appearance:none;border:0;cursor:pointer;height:2.5rem;border-radius:0.75rem;
background:var(--vibeui-commerce-039-fg);color:var(--vibeui-commerce-039-onfg);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-039"] [data-part="buy"] button:focus-visible{outline:2px solid var(--vibeui-commerce-039-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-039"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DEALS: Commerce039Deal[] = [
  {
    id: "1",
    title: "Кресло «Хмарь» с подлокотниками",
    grade: "Витринный образец",
    defect: "Потёртость на задней ножке, 2 см. Обивка и каркас без нареканий.",
    price: "23 300 ₽",
    full: "38 900 ₽",
    cut: "−40%",
    left: 1,
    hue: 75,
  },
  {
    id: "2",
    title: "Торшер «Сумерки»",
    grade: "Повреждена упаковка",
    defect: "Коробка помята при перевозке, сам светильник не вскрывали.",
    price: "13 800 ₽",
    full: "16 200 ₽",
    cut: "−15%",
    left: 4,
    hue: 150,
  },
  {
    id: "3",
    title: "Ковёр «Туман» 160×230",
    grade: "Возврат покупателя",
    defect: "Разложили дома, не подошёл по цвету. Проверен и вычищен.",
    price: "20 700 ₽",
    full: "27 600 ₽",
    cut: "−25%",
    left: 2,
    hue: 262,
  },
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
 * Витрина уценки: причина скидки написана на карточке, остаток назван числом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce039({
  title = "Уценённые товары",
  lead = "Товары со склада возвратов и из торгового зала. Каждый проверен мастером, у каждого написано, за что снижена цена.",
  note = "На уценённые товары действует та же гарантия, что и на новые. Вернуть их можно в течение 14 дней — кроме случаев, когда не понравился уже описанный дефект.",
  deals = DEFAULT_DEALS,
  cta = "В корзину",
  fullPriceLabel = "Цена нового ",
  leftText = "Осталось {count} шт. по этой цене",
  accent,
  background = "",
  className,
  style,
}: Commerce039Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-039-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-039-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-039" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-039"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>
          <p data-part="note">{note}</p>

          <ul>
            {deals.map((deal) => (
              <li
                key={deal.id}
                data-part="deal"
                style={
                  {
                    "--vibeui-commerce-039-hue": deal.hue ?? 25,
                    "--vibeui-commerce-039-fill": `${Math.min(100, deal.left * 20)}%`,
                  } as CSSProperties
                }
              >
                <span data-part="cover" aria-hidden="true">
                  <span data-part="cut">{deal.cut}</span>
                  <span data-part="grade">{deal.grade}</span>
                </span>
                <div data-part="body">
                  <p data-part="name">
                    <a href="#product">{deal.title}</a>
                  </p>
                  <p data-part="defect">{deal.defect}</p>
                  <p data-part="prices">
                    <b>{deal.price}</b>
                    <s>
                      <span data-part="sr">{fullPriceLabel}</span>
                      {deal.full}
                    </s>
                  </p>
                  <p data-part="left">
                    {leftText.replace("{count}", String(deal.left))}
                  </p>
                  <span data-part="bar" aria-hidden="true">
                    <i />
                  </span>
                  <div data-part="buy">
                    <button type="button" aria-label={`${cta}: ${deal.title}`}>
                      {cta}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
