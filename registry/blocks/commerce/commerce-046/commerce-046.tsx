import type { CSSProperties } from "react"

export type Commerce046Line = {
  id: string
  title: string
  spec: string
  price: string
  count: number
  hue?: number
  gift?: boolean
}

export type Commerce046Props = {
  title?: string
  lines?: Commerce046Line[]
  goods?: string
  shipping?: string
  discount?: string
  total?: string
  promo?: string
  cta?: string
  safe?: string
  /** Хвост строки промо после выделенного текста. */
  promoNote?: string
  /** Число товаров в шапке: {count} — сколько их. */
  countText?: string
  /** Ярлык подарочной упаковки. */
  giftText?: string
  /** Подписи кнопок количества для читалки: {title} — товар. */
  qtyAriaText?: Record<string, string>
  /** Подпись кнопки «назад» для читалки. */
  backAriaText?: string
  /** Подписи итога: ключи goods (с {count}), shipping, discount и total. */
  summaryText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: корзина под узкий экран, где итог с кнопкой прилипает к нижнему
// краю. На телефоне список товаров длиннее экрана, и кнопка «оформить» внизу
// страницы не видна — до неё нужно долистать через весь список. Липкая панель
// держит сумму и кнопку в поле зрения, а под неё в списке оставлен отступ,
// чтобы последняя строка не пряталась под панелью.
const STYLES = `
:where([data-vibeui-block="commerce-046"]){
--vibeui-commerce-046-bg:transparent;
--vibeui-commerce-046-fg:light-dark(oklch(0.21 0 265),oklch(0.93 0 265));
--vibeui-commerce-046-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-commerce-046-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-commerce-046-card:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-commerce-046-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.17 262));
--vibeui-commerce-046-onaccent:light-dark(oklch(1 0 0),oklch(0.17 0 262));
--vibeui-commerce-046-save:light-dark(oklch(0.5 0.13 150),oklch(0.76 0.13 155));
--vibeui-commerce-046-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-046"]{color-scheme:dark}
[data-vibeui-block="commerce-046"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-046-bg);
color:var(--vibeui-commerce-046-fg);font-family:var(--vibeui-commerce-046-sans);
}
[data-vibeui-block="commerce-046"] *{box-sizing:border-box}
[data-vibeui-block="commerce-046"] [data-part="shell"]{
position:relative;max-width:26rem;margin:0 auto;min-height:32rem;
display:flex;flex-direction:column;
}
[data-vibeui-block="commerce-046"] [data-part="top"]{
position:sticky;top:0;z-index:2;padding:0.75rem 1rem;
background:var(--vibeui-commerce-046-card);border-bottom:1px solid var(--vibeui-commerce-046-border);
display:flex;align-items:center;gap:0.625rem;
}
[data-vibeui-block="commerce-046"] [data-part="back"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0.25rem;border-radius:0.5rem;
font:inherit;font-size:1.125rem;line-height:1;color:inherit;
}
[data-vibeui-block="commerce-046"] h2{margin:0;font-size:1rem;font-weight:700;flex:1 1 auto}
[data-vibeui-block="commerce-046"] [data-part="count"]{font-size:0.75rem;color:var(--vibeui-commerce-046-muted)}
[data-vibeui-block="commerce-046"] ul{
list-style:none;margin:0;padding:0.75rem 1rem 1rem;display:grid;gap:0.5rem;flex:1 1 auto;
}
[data-vibeui-block="commerce-046"] [data-part="line"]{
display:grid;grid-template-columns:3.5rem minmax(0,1fr);gap:0.75rem;
padding:0.625rem;border-radius:1rem;background:var(--vibeui-commerce-046-card);
border:1px solid var(--vibeui-commerce-046-border);
}
[data-vibeui-block="commerce-046"] [data-part="thumb"]{
aspect-ratio:1;border-radius:0.75rem;
background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-046-hue,262)),oklch(0.85 0.09 var(--vibeui-commerce-046-hue,262)));
}
[data-vibeui-block="commerce-046"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.32}
[data-vibeui-block="commerce-046"] [data-part="spec"]{margin:0.125rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-046-muted)}
[data-vibeui-block="commerce-046"] [data-part="gift"]{
display:inline-block;margin-top:0.25rem;padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-commerce-046-accent) 12%,transparent);
color:var(--vibeui-commerce-046-accent);font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="commerce-046"] [data-part="row"]{
margin-top:0.4375rem;display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="commerce-046"] [data-part="qty"]{
display:inline-flex;align-items:center;border-radius:0.625rem;border:1px solid var(--vibeui-commerce-046-border);
overflow:hidden;
}
[data-vibeui-block="commerce-046"] [data-part="qty"] button{
appearance:none;border:0;cursor:pointer;width:1.875rem;height:1.875rem;
background:var(--vibeui-commerce-046-card);color:inherit;font:inherit;font-size:0.9375rem;line-height:1;
}
[data-vibeui-block="commerce-046"] [data-part="qty"] span{
min-width:1.75rem;text-align:center;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-046"] [data-part="qty"] button:focus-visible{outline:2px solid var(--vibeui-commerce-046-accent);outline-offset:-2px}
[data-vibeui-block="commerce-046"] [data-part="cost"]{margin:0;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-046"] [data-part="promo"]{
margin:0 1rem;padding:0.625rem 0.75rem;border-radius:0.875rem;
border:1px dashed var(--vibeui-commerce-046-border);background:var(--vibeui-commerce-046-card);
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="commerce-046"] [data-part="promo"] b{color:var(--vibeui-commerce-046-accent)}
/* Отступ под липкой панелью: без него последняя строка прячется под кнопкой. */
[data-vibeui-block="commerce-046"] [data-part="gap"]{height:1rem}
[data-vibeui-block="commerce-046"] [data-part="bottom"]{
position:sticky;bottom:0;z-index:2;padding:0.75rem 1rem 1rem;
background:var(--vibeui-commerce-046-card);border-top:1px solid var(--vibeui-commerce-046-border);
border-radius:1.25rem 1.25rem 0 0;box-shadow:0 -8px 24px oklch(0.2 0 265 / 8%);
}
[data-vibeui-block="commerce-046"] dl{margin:0;display:grid;grid-template-columns:1fr auto;gap:0.25rem 0.5rem;font-size:0.8125rem}
[data-vibeui-block="commerce-046"] dt{color:var(--vibeui-commerce-046-muted)}
[data-vibeui-block="commerce-046"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-046"] [data-part="minus"]{color:var(--vibeui-commerce-046-save)}
[data-vibeui-block="commerce-046"] [data-part="total"]{
margin:0.5rem 0 0;padding-top:0.5rem;border-top:1px solid var(--vibeui-commerce-046-border);
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="commerce-046"] [data-part="total"] span:first-child{font-size:0.8125rem;color:var(--vibeui-commerce-046-muted)}
[data-vibeui-block="commerce-046"] [data-part="total"] span:last-child{font-size:1.375rem;font-weight:800;letter-spacing:-0.025em;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-046"] [data-part="cta"]{
margin-top:0.625rem;width:100%;appearance:none;border:0;cursor:pointer;height:3rem;border-radius:0.875rem;
background:var(--vibeui-commerce-046-accent);color:var(--vibeui-commerce-046-onaccent);font:inherit;font-size:1rem;font-weight:700;
}
[data-vibeui-block="commerce-046"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-046-accent);outline-offset:2px}
[data-vibeui-block="commerce-046"] [data-part="safe"]{margin:0.5rem 0 0;text-align:center;font-size:0.6875rem;color:var(--vibeui-commerce-046-muted)}
@container (min-width: 34rem){
[data-vibeui-block="commerce-046"] [data-part="shell"]{border:1px solid var(--vibeui-commerce-046-border);border-radius:1.75rem;overflow:hidden;margin:1rem auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-046"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Commerce046Line[] = [
  {
    id: "1",
    title: "Торшер «Сумерки»",
    spec: "Ясень, тканый абажур",
    price: "16 200 ₽",
    count: 1,
    hue: 75,
  },
  {
    id: "2",
    title: "Плед «Пасмурно»",
    spec: "Шерсть, 140×200, серый",
    price: "14 800 ₽",
    count: 2,
    hue: 150,
  },
  {
    id: "3",
    title: "Свеча «Отмель»",
    spec: "Инжир и кедр, 200 г",
    price: "1 900 ₽",
    count: 1,
    hue: 262,
    gift: true,
  },
]

const DEFAULT_QTY_ARIA: Record<string, string> = {
  decrease: "Убрать одну штуку: {title}",
  increase: "Добавить одну штуку: {title}",
}

const DEFAULT_SUMMARY: Record<string, string> = {
  goods: "Товары, {count} шт.",
  shipping: "Доставка",
  discount: "Скидка",
  total: "Итого",
}

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
 * Корзина под узкий экран: итог и кнопка прилипают к нижнему краю списка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce046({
  title = "Корзина",
  lines = DEFAULT_LINES,
  goods = "32 900 ₽",
  shipping = "490 ₽",
  discount = "−1 200 ₽",
  total = "32 190 ₽",
  promo = "До бесплатной доставки не хватает 2 100 ₽",
  cta = "Оформить за 32 190 ₽",
  safe = "Оплата картой, СБП или при получении",
  promoNote = "— добавьте что-нибудь небольшое или заберите заказ из пункта выдачи бесплатно.",
  countText = "{count} товара",
  giftText = "подарочная упаковка",
  qtyAriaText = DEFAULT_QTY_ARIA,
  backAriaText = "Назад в каталог",
  summaryText = DEFAULT_SUMMARY,
  accent,
  background = "",
  className,
  style,
}: Commerce046Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-046-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-046-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const count = lines.reduce((sum, line) => sum + line.count, 0)

  return (
    <>
      <style href="vibeui-commerce-046" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-046"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="top">
            <button type="button" data-part="back" aria-label={backAriaText}>
              ←
            </button>
            <h2>{title}</h2>
            <span data-part="count">
              {countText.replace("{count}", String(count))}
            </span>
          </header>

          <ul>
            {lines.map((line) => (
              <li
                key={line.id}
                data-part="line"
                style={
                  {
                    "--vibeui-commerce-046-hue": line.hue ?? 262,
                  } as CSSProperties
                }
              >
                <span data-part="thumb" aria-hidden="true" />
                <div>
                  <p data-part="name">{line.title}</p>
                  <p data-part="spec">{line.spec}</p>
                  {line.gift ? <span data-part="gift">{giftText}</span> : null}
                  <div data-part="row">
                    <span data-part="qty">
                      <button
                        type="button"
                        aria-label={(
                          qtyAriaText.decrease ?? DEFAULT_QTY_ARIA.decrease
                        ).replace("{title}", line.title)}
                      >
                        −
                      </button>
                      <span>{line.count}</span>
                      <button
                        type="button"
                        aria-label={(
                          qtyAriaText.increase ?? DEFAULT_QTY_ARIA.increase
                        ).replace("{title}", line.title)}
                      >
                        +
                      </button>
                    </span>
                    <p data-part="cost">{line.price}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p data-part="promo">
            <b>{promo}</b> {promoNote}
          </p>
          <div data-part="gap" aria-hidden="true" />

          <div data-part="bottom">
            <dl>
              <dt>
                {(summaryText.goods ?? DEFAULT_SUMMARY.goods).replace(
                  "{count}",
                  String(count),
                )}
              </dt>
              <dd>{goods}</dd>
              <dt>{summaryText.shipping ?? DEFAULT_SUMMARY.shipping}</dt>
              <dd>{shipping}</dd>
              <dt>{summaryText.discount ?? DEFAULT_SUMMARY.discount}</dt>
              <dd data-part="minus">{discount}</dd>
            </dl>
            <p data-part="total">
              <span>{summaryText.total ?? DEFAULT_SUMMARY.total}</span>
              <span>{total}</span>
            </p>
            <button type="button" data-part="cta">
              {cta}
            </button>
            <p data-part="safe">{safe}</p>
          </div>
        </div>
      </section>
    </>
  )
}
