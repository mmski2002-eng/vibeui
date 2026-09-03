import type { CSSProperties } from "react"

export type Commerce077Shop = {
  id: string
  name: string
  address: string
  distance: string
  walk: string
  hours: string
  stock: number
  hold: string
}

export type Commerce077Props = {
  title?: string
  product?: string
  geoLabel?: string
  geoHint?: string
  shops?: Commerce077Shop[]
  inStockLabel?: string
  /** Строка наличия: {label} — подпись, {count} — число на полке. */
  stockTemplate?: string
  lastLabel?: string
  reserve?: string
  emptyTitle?: string
  emptyText?: string
  notify?: string
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: наличие в магазинах рядом — виджет на странице товара.
// Расстояние продублировано временем пешком: «1,2 км» ничего не говорит
// тому, кто решает, идти ли сейчас. Количество названо числом, а последний
// экземпляр помечен отдельно — именно за ним едут и злятся, если он ушёл.
// Внизу выход для тех, у кого рядом ничего нет: подписка вместо тупика.
const STYLES = `
:where([data-vibeui-block="commerce-077"]){
--vibeui-commerce-077-bg:transparent;
--vibeui-commerce-077-surface:light-dark(oklch(1 0 0),oklch(0.22 0.012 190));
--vibeui-commerce-077-fg:light-dark(oklch(0.21 0.012 190),oklch(0.94 0.006 190));
--vibeui-commerce-077-muted:light-dark(oklch(0.53 0.014 190),oklch(0.73 0.012 190));
--vibeui-commerce-077-border:light-dark(oklch(0.9 0.008 190),oklch(0.38 0.014 190));
--vibeui-commerce-077-soft:light-dark(oklch(0.972 0.006 190),oklch(0.27 0.016 190));
--vibeui-commerce-077-accent:light-dark(oklch(0.46 0.11 190),oklch(0.77 0.12 190));
--vibeui-commerce-077-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.035 190));
--vibeui-commerce-077-last:light-dark(oklch(0.56 0.14 55),oklch(0.8 0.13 55));
--vibeui-commerce-077-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-077"]{color-scheme:dark}
[data-vibeui-block="commerce-077"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-077-bg);
color:var(--vibeui-commerce-077-fg);font-family:var(--vibeui-commerce-077-sans);
}
[data-vibeui-block="commerce-077"] *{box-sizing:border-box}
[data-vibeui-block="commerce-077"] [data-part="shell"]{max-width:40rem;margin:0 auto;padding:1.25rem 1rem 1.75rem}
[data-vibeui-block="commerce-077"] [data-part="box"]{border:1px solid var(--vibeui-commerce-077-border);border-radius:1rem;overflow:hidden}
[data-vibeui-block="commerce-077"] [data-part="head"]{padding:0.875rem 1rem;background:var(--vibeui-commerce-077-soft);border-bottom:1px solid var(--vibeui-commerce-077-border)}
[data-vibeui-block="commerce-077"] h2{margin:0;font-size:1rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="commerce-077"] [data-part="product"]{margin:0.1875rem 0 0.625rem;font-size:0.75rem;color:var(--vibeui-commerce-077-muted)}
[data-vibeui-block="commerce-077"] [data-part="geo"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-077-border);background:var(--vibeui-commerce-077-surface);
color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-077"] [data-part="geohint"]{margin:0.4375rem 0 0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-commerce-077-muted)}
[data-vibeui-block="commerce-077"] ul{list-style:none;margin:0;padding:0}
[data-vibeui-block="commerce-077"] [data-part="shop"]{padding:0.75rem 1rem;border-bottom:1px solid var(--vibeui-commerce-077-border)}
[data-vibeui-block="commerce-077"] [data-part="top"]{display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;align-items:baseline;justify-content:space-between}
[data-vibeui-block="commerce-077"] [data-part="name"]{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-077"] [data-part="far"]{font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-077-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-077"] [data-part="address"]{margin:0.1875rem 0 0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-commerce-077-muted)}
[data-vibeui-block="commerce-077"] [data-part="hours"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-077-muted)}
[data-vibeui-block="commerce-077"] [data-part="bottom"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;justify-content:space-between;margin-top:0.5rem}
[data-vibeui-block="commerce-077"] [data-part="stock"]{display:flex;align-items:center;gap:0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="commerce-077"] [data-part="mark"]{width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-commerce-077-accent)}
[data-vibeui-block="commerce-077"] [data-part="stock"][data-last] [data-part="mark"]{background:var(--vibeui-commerce-077-last);border-radius:0.125rem}
[data-vibeui-block="commerce-077"] [data-part="stock"][data-last]{color:var(--vibeui-commerce-077-last)}
[data-vibeui-block="commerce-077"] [data-part="hold"]{display:block;margin-top:0.125rem;font-size:0.6875rem;font-weight:400;color:var(--vibeui-commerce-077-muted)}
[data-vibeui-block="commerce-077"] [data-part="book"]{
appearance:none;border:0;cursor:pointer;height:2.25rem;padding:0 1rem;border-radius:0.625rem;
background:var(--vibeui-commerce-077-accent);color:var(--vibeui-commerce-077-onaccent);font:inherit;font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="commerce-077"] [data-part="geo"]:focus-visible,
[data-vibeui-block="commerce-077"] [data-part="book"]:focus-visible,
[data-vibeui-block="commerce-077"] [data-part="notify"]:focus-visible{outline:2px solid var(--vibeui-commerce-077-accent);outline-offset:2px}
[data-vibeui-block="commerce-077"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-077"] [data-part="empty"]{padding:0.875rem 1rem;background:var(--vibeui-commerce-077-soft)}
[data-vibeui-block="commerce-077"] h3{margin:0 0 0.25rem;font-size:0.875rem;font-weight:700}
[data-vibeui-block="commerce-077"] [data-part="empty"] p{margin:0 0 0.625rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-commerce-077-muted)}
[data-vibeui-block="commerce-077"] [data-part="notify"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 1rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-077-border);background:var(--vibeui-commerce-077-surface);
color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-077"] [data-part="note"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-077-muted)}
@container (min-width: 34rem){
[data-vibeui-block="commerce-077"] [data-part="shell"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-077"] *{animation:none!important;transition:none!important}}
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

const DEFAULT_SHOPS: Commerce077Shop[] = [
  {
    id: "1",
    name: "Магазин на Карповке",
    address: "наб. реки Карповки, 12",
    distance: "350 м",
    walk: "4 минуты пешком",
    hours: "Сегодня до 22:00",
    stock: 4,
    hold: "Держим до конца дня",
  },
  {
    id: "2",
    name: "Магазин у Тучкова моста",
    address: "Средний пр. В.О., 8",
    distance: "1,9 км",
    walk: "22 минуты пешком",
    hours: "Сегодня до 21:00",
    stock: 1,
    hold: "Держим 3 часа",
  },
  {
    id: "3",
    name: "Магазин на Кожевенной",
    address: "Кожевенная линия, 40",
    distance: "3,4 км",
    walk: "16 минут на транспорте",
    hours: "Сегодня до 20:00",
    stock: 9,
    hold: "Держим до завтра, 14:00",
  },
]

/**
 * Наличие в магазинах поблизости: расстояние продублировано временем в
 * пути, последний экземпляр помечен. Один файл, ноль зависимостей.
 */
export function Commerce077({
  title = "Есть рядом с вами",
  product = "Кофемолка «Жёрнов», конические жернова",
  geoLabel = "Показать ближайшие",
  geoHint = "Список построен по адресу доставки. Разрешите доступ к местоположению, чтобы отсортировать по вашему текущему месту.",
  shops = DEFAULT_SHOPS,
  inStockLabel = "В наличии",
  stockTemplate = "{label}: {count} шт.",
  lastLabel = "Остался один",
  reserve = "Забронировать",
  emptyTitle = "Ничего рядом не нашлось?",
  emptyText = "Мы пришлём сообщение, когда товар появится в магазине ближе 3 километров от вас.",
  notify = "Сообщить о поступлении",
  note = "Бронь бесплатная и ни к чему не обязывает: если не пришли — товар просто возвращается в продажу, без штрафа и блокировок.",
  accent,
  background = "",
  className,
  style,
}: Commerce077Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-077-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-077-bg": background,
          // Кнопки поиска и подписки не должны просвечивать: им нужна
          // непрозрачная подложка, и это тот же цвет.
          "--vibeui-commerce-077-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-077" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-077"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="box">
            <div data-part="head">
              <h2>{title}</h2>
              <p data-part="product">{product}</p>
              <button type="button" data-part="geo">
                {geoLabel}
              </button>
              <p data-part="geohint">{geoHint}</p>
            </div>

            <ul>
              {shops.map((shop) => (
                <li key={shop.id} data-part="shop">
                  <div data-part="top">
                    <p data-part="name">{shop.name}</p>
                    <span data-part="far">
                      {shop.distance} · {shop.walk}
                    </span>
                  </div>
                  <p data-part="address">{shop.address}</p>
                  <p data-part="hours">{shop.hours}</p>
                  <div data-part="bottom">
                    <span
                      data-part="stock"
                      data-last={shop.stock === 1 ? "true" : undefined}
                    >
                      <span data-part="mark" aria-hidden="true" />
                      <span>
                        {shop.stock === 1
                          ? lastLabel
                          : stockTemplate
                              .replace("{label}", inStockLabel)
                              .replace("{count}", String(shop.stock))}
                        <span data-part="hold">{shop.hold}</span>
                      </span>
                    </span>
                    <button type="button" data-part="book">
                      {reserve}
                      <span data-part="sr"> — {shop.name}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div data-part="empty">
              <h3>{emptyTitle}</h3>
              <p>{emptyText}</p>
              <button type="button" data-part="notify">
                {notify}
              </button>
            </div>
          </div>
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
