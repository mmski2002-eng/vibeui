import type { CSSProperties } from "react"

export type Commerce060Line = {
  id: string
  title: string
  spec: string
  price: string
  hue?: number
}

export type Commerce060Parcel = {
  id: string
  label: string
  eta: string
  reason: string
  lines: Commerce060Line[]
}

export type Commerce060Plan = {
  value: string
  label: string
  detail: string
  shipping: string
  total: string
}

export type Commerce060Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  avatarImage?: string
  title?: string
  lead?: string
  parcels?: Commerce060Parcel[]
  planLegend?: string
  plans?: Commerce060Plan[]
  shippingLabel?: string
  totalLabel?: string
  cta?: string
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: корзина, которая честно разложена по посылкам. Товар «под
// заказ» задерживает всю корзину, поэтому вместо одной строки срока показаны
// две посылки с причиной задержки у каждой. Выбор «ждать всё» или «слать
// частями» — радиогруппа, и обе цены написаны прямо в вариантах: без JS
// пересчитать итог нечем, а спрятать разницу — значит соврать.
const STYLES = `
:where([data-vibeui-block="commerce-060"]){
--vibeui-commerce-060-bg:transparent;
--vibeui-commerce-060-fg:light-dark(oklch(0.21 0.014 200),oklch(0.94 0.006 200));
--vibeui-commerce-060-muted:light-dark(oklch(0.53 0.016 200),oklch(0.73 0.013 200));
--vibeui-commerce-060-border:light-dark(oklch(0.9 0.008 200),oklch(0.38 0.014 200));
--vibeui-commerce-060-soft:light-dark(oklch(0.972 0.006 200),oklch(0.27 0.012 200));
--vibeui-commerce-060-accent:light-dark(oklch(0.55 0.12 39.8),oklch(0.74 0.12 39.8));
--vibeui-commerce-060-onaccent:oklch(0.15 0.02 39.8);
--vibeui-commerce-060-late:light-dark(oklch(0.56 0.13 60),oklch(0.81 0.12 70));
--vibeui-commerce-060-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-060"]{color-scheme:dark}
[data-vibeui-block="commerce-060"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-060-bg);
color:var(--vibeui-commerce-060-fg);font-family:var(--vibeui-commerce-060-sans);
}
[data-vibeui-block="commerce-060"] *{box-sizing:border-box}
[data-vibeui-block="commerce-060"] form{display:contents}
[data-vibeui-block="commerce-060"] [data-part="shell"]{max-width:62rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-060"] h2{margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-060"] [data-part="lead"]{margin:0 0 1.25rem;max-width:56ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-060-muted)}
[data-vibeui-block="commerce-060"] [data-part="parcels"]{list-style:none;margin:0 0 1.25rem;padding:0;display:grid;gap:0.875rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-060"] [data-part="parcel"]{border:1px solid var(--vibeui-commerce-060-border);border-radius:1rem;overflow:hidden}
[data-vibeui-block="commerce-060"] [data-part="head"]{padding:0.75rem 0.875rem;background:var(--vibeui-commerce-060-soft);border-bottom:1px solid var(--vibeui-commerce-060-border)}
[data-vibeui-block="commerce-060"] h3{margin:0;font-size:0.8125rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--vibeui-commerce-060-muted)}
[data-vibeui-block="commerce-060"] [data-part="eta"]{margin:0.1875rem 0 0;font-size:1rem;font-weight:700}
[data-vibeui-block="commerce-060"] [data-part="reason"]{margin:0.25rem 0 0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-060-late)}
[data-vibeui-block="commerce-060"] [data-part="lines"]{list-style:none;margin:0;padding:0}
[data-vibeui-block="commerce-060"] [data-part="line"]{display:flex;gap:0.75rem;align-items:center;padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-commerce-060-border)}
[data-vibeui-block="commerce-060"] [data-part="line"]:last-child{border-bottom:0}
[data-vibeui-block="commerce-060"] [data-part="thumb"]{
flex:none;width:2.75rem;height:2.75rem;border-radius:0.5rem;
background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-060-hue,200)),oklch(0.85 0.09 var(--vibeui-commerce-060-hue,200)));
}
[data-vibeui-block="commerce-060"] [data-part="ltexts"]{flex:1;min-width:0}
[data-vibeui-block="commerce-060"] [data-part="lname"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="commerce-060"] [data-part="lspec"]{margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-060-muted)}
[data-vibeui-block="commerce-060"] [data-part="lprice"]{margin:0;flex:none;font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-060"] fieldset{border:0;margin:0 0 1rem;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-060"] legend{
padding:0;margin:0 0 0.5rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-commerce-060-muted);
}
[data-vibeui-block="commerce-060"] [data-part="plans"]{display:grid;gap:0.5rem;grid-template-columns:1fr;clear:both}
[data-vibeui-block="commerce-060"] [data-part="plan"]{position:relative;display:block}
[data-vibeui-block="commerce-060"] [data-part="plan"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-060"] [data-part="face"]{
position:relative;display:block;cursor:pointer;border:1px solid var(--vibeui-commerce-060-border);border-radius:0.875rem;padding:0.75rem 0.875rem;
transition:border-color .14s ease,background-color .14s ease;overflow:hidden;
}
[data-vibeui-block="commerce-060"] [data-part="face"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="commerce-060"] [data-part="plan"] input:checked+[data-part="face"]{
border-color:var(--vibeui-commerce-060-accent);background:var(--vibeui-commerce-060-soft);
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-060-accent);
}
[data-vibeui-block="commerce-060"] [data-part="plan"] input:focus-visible+[data-part="face"]{outline:2px solid var(--vibeui-commerce-060-accent);outline-offset:2px}
[data-vibeui-block="commerce-060"] [data-part="plabel"]{display:block;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-060"] [data-part="pdetail"]{display:block;margin-top:0.1875rem;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-commerce-060-muted)}
[data-vibeui-block="commerce-060"] [data-part="prices"]{display:flex;flex-wrap:wrap;gap:0.25rem 1rem;margin-top:0.5rem;font-size:0.8125rem}
[data-vibeui-block="commerce-060"] [data-part="prices"] strong{font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-060"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.875rem;padding:0 1.75rem;border-radius:0.875rem;
background:var(--vibeui-commerce-060-accent);color:var(--vibeui-commerce-060-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-060"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-060-accent);outline-offset:2px}
[data-vibeui-block="commerce-060"] [data-part="note"]{margin:0.875rem 0 0;max-width:56ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-060-muted)}
@container (min-width: 44rem){
[data-vibeui-block="commerce-060"] [data-part="shell"]{padding:2rem 2rem 3rem}
[data-vibeui-block="commerce-060"] [data-part="parcels"]{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="commerce-060"] [data-part="plans"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-060"] *{animation:none!important;transition:none!important}}
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

const DEFAULT_PARCELS: Commerce060Parcel[] = [
  {
    id: "1",
    label: "Посылка 1 из 2",
    eta: "Завтра, 12 марта",
    reason: "Товары лежат на городском складе, собираются сегодня вечером.",
    lines: [
      {
        id: "1",
        title: "Торшер «Сумерки»",
        spec: "Тёплый свет 2700 K",
        price: "16 200 ₽",
        hue: 150,
      },
      {
        id: "2",
        title: "Плед «Пасмурно»",
        spec: "Шерсть, 140×200 см",
        price: "6 900 ₽",
        hue: 265,
      },
    ],
  },
  {
    id: "2",
    label: "Посылка 2 из 2",
    eta: "27 марта",
    reason: "Кресло шьют под заказ: обивка выбранного цвета приходит партиями.",
    lines: [
      {
        id: "1",
        title: "Кресло «Хмарь»",
        spec: "Букле, песочный",
        price: "38 900 ₽",
        hue: 75,
      },
    ],
  },
]

const DEFAULT_PLANS: Commerce060Plan[] = [
  {
    value: "together",
    label: "Одной посылкой",
    detail:
      "Ждём кресло и везём всё вместе 27 марта. Одна доставка, один курьер, одна подпись.",
    shipping: "0 ₽",
    total: "62 000 ₽",
  },
  {
    value: "split",
    label: "По мере готовности",
    detail:
      "Свет и плед приедут завтра, кресло — 27 марта. Две доставки, два визита курьера.",
    shipping: "580 ₽",
    total: "62 580 ₽",
  },
]

/**
 * Корзина с раздельной доставкой: две посылки с причинами задержки и выбор
 * между ожиданием и частями. Один файл, ноль зависимостей, палитра своя.
 */
export function Commerce060({
  title = "Заказ приедет двумя посылками",
  avatarImage = "",
  lead = "Часть товаров лежит на складе, кресло шьют под заказ. Ниже видно, что и когда приедет, и во что обойдётся каждый вариант.",
  parcels = DEFAULT_PARCELS,
  planLegend = "Как доставить",
  plans = DEFAULT_PLANS,
  shippingLabel = "Доставка",
  totalLabel = "Итого",
  cta = "Перейти к оплате",
  note = "Сумма товаров одинаковая в обоих вариантах: различается только доставка. Разделение посылок нельзя отменить после оформления — курьерская служба забирает груз сразу.",
  accent,
  background = "",
  className,
  style,
}: Commerce060Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-060-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-060-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-060" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-060"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <ul data-part="parcels">
            {parcels.map((parcel) => (
              <li key={parcel.id} data-part="parcel">
                <div data-part="head">
                  <h3>{parcel.label}</h3>
                  <p data-part="eta">{parcel.eta}</p>
                  <p data-part="reason">{parcel.reason}</p>
                </div>
                <ul data-part="lines">
                  {parcel.lines.map((line) => (
                    <li
                      key={line.id}
                      data-part="line"
                      style={
                        {
                          "--vibeui-commerce-060-hue": line.hue ?? 200,
                        } as CSSProperties
                      }
                    >
                      <span data-part="thumb" aria-hidden="true" />
                      <div data-part="ltexts">
                        <p data-part="lname">{line.title}</p>
                        <p data-part="lspec">{line.spec}</p>
                      </div>
                      <p data-part="lprice">{line.price}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <form>
            <fieldset>
              <legend>{planLegend}</legend>
              <div data-part="plans">
                {plans.map((plan, index) => (
                  <label
                    key={plan.value}
                    data-part="plan"
                    htmlFor={`commerce-060-plan-${plan.value}`}
                  >
                    <input
                      type="radio"
                      id={`commerce-060-plan-${plan.value}`}
                      name="commerce-060-plan"
                      defaultChecked={index === 0}
                    />
                    <span
                      data-part="face"
                      data-empty={avatarImage ? undefined : "true"}
                    >
                      {avatarImage ? (
                        <img
                          src={avatarImage}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                      <span data-part="plabel">{plan.label}</span>
                      <span data-part="pdetail">{plan.detail}</span>
                      <span data-part="prices">
                        <span>
                          {shippingLabel}: <strong>{plan.shipping}</strong>
                        </span>
                        <span>
                          {totalLabel}: <strong>{plan.total}</strong>
                        </span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </form>

          <button type="button" data-part="go">
            {cta}
          </button>
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
