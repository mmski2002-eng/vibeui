import type { CSSProperties } from "react"

export type Commerce062Point = {
  value: string
  name: string
  address: string
  distance: string
  hours: string
  price: string
  eta: string
  perks: string[]
  limit?: string
}

export type Commerce062Props = {
  step?: string
  title?: string
  lead?: string
  searchLabel?: string
  searchPlaceholder?: string
  searchCta?: string
  legend?: string
  points?: Commerce062Point[]
  /** Подписи строки фактов: price, eta. */
  factLabels?: Record<string, string>
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
// Идея блока: выбор пункта выдачи списком, отсортированным по расстоянию.
// У каждой точки написано то, из-за чего к ней едут или не едут: часы
// работы, срок хранения, примерочная и ограничение по габаритам. Список
// не заменяет карту, но работает без неё — и на медленном интернете это
// единственный способ выбрать пункт.
const STYLES = `
:where([data-vibeui-block="commerce-062"]){
--vibeui-commerce-062-bg:transparent;
--vibeui-commerce-062-surface:light-dark(oklch(1 0 0),oklch(0.22 0.012 165));
--vibeui-commerce-062-fg:light-dark(oklch(0.21 0.012 165),oklch(0.94 0.006 165));
--vibeui-commerce-062-muted:light-dark(oklch(0.52 0.014 165),oklch(0.73 0.012 165));
--vibeui-commerce-062-border:light-dark(oklch(0.9 0.008 165),oklch(0.38 0.014 165));
--vibeui-commerce-062-soft:light-dark(oklch(0.972 0.006 165),oklch(0.28 0.014 165));
--vibeui-commerce-062-accent:light-dark(oklch(0.55 0.11 39.8),oklch(0.77 0.12 39.8));
--vibeui-commerce-062-onaccent:oklch(0.15 0.02 39.8);
--vibeui-commerce-062-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-062"]{color-scheme:dark}
[data-vibeui-block="commerce-062"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-062-bg);
color:var(--vibeui-commerce-062-fg);font-family:var(--vibeui-commerce-062-sans);
}
[data-vibeui-block="commerce-062"] *{box-sizing:border-box}
[data-vibeui-block="commerce-062"] form{display:contents}
[data-vibeui-block="commerce-062"] [data-part="shell"]{max-width:50rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-062"] [data-part="step"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-062-accent)}
[data-vibeui-block="commerce-062"] h2{margin:0.375rem 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-062"] [data-part="lead"]{margin:0 0 1rem;max-width:54ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-062-muted)}
[data-vibeui-block="commerce-062"] [data-part="search"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.25rem}
[data-vibeui-block="commerce-062"] [data-part="search"] input{
flex:1 1 14rem;height:2.625rem;padding:0 0.875rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-062-border);background:var(--vibeui-commerce-062-surface);
font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="commerce-062"] [data-part="find"]{
appearance:none;cursor:pointer;height:2.625rem;padding:0 1.125rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-062-border);background:var(--vibeui-commerce-062-soft);
color:inherit;font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-062"] [data-part="search"] input:focus-visible,
[data-vibeui-block="commerce-062"] [data-part="find"]:focus-visible,
[data-vibeui-block="commerce-062"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-062-accent);outline-offset:2px}
[data-vibeui-block="commerce-062"] fieldset{border:0;margin:0;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-062"] legend{
padding:0;margin:0 0 0.5rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-commerce-062-muted);
}
[data-vibeui-block="commerce-062"] [data-part="points"]{display:grid;gap:0.5rem;clear:both}
[data-vibeui-block="commerce-062"] [data-part="point"]{position:relative}
[data-vibeui-block="commerce-062"] [data-part="point"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-062"] [data-part="face"]{
display:block;cursor:pointer;border:1px solid var(--vibeui-commerce-062-border);border-radius:0.875rem;
padding:0.75rem 0.875rem;transition:border-color .14s ease,background-color .14s ease;
}
[data-vibeui-block="commerce-062"] [data-part="point"] input:checked+[data-part="face"]{
border-color:var(--vibeui-commerce-062-accent);background:var(--vibeui-commerce-062-soft);
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-062-accent);
}
[data-vibeui-block="commerce-062"] [data-part="point"] input:focus-visible+[data-part="face"]{outline:2px solid var(--vibeui-commerce-062-accent);outline-offset:2px}
[data-vibeui-block="commerce-062"] [data-part="top"]{display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;align-items:baseline;justify-content:space-between}
[data-vibeui-block="commerce-062"] [data-part="name"]{font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-062"] [data-part="distance"]{
font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums;color:var(--vibeui-commerce-062-accent);
}
[data-vibeui-block="commerce-062"] [data-part="address"]{display:block;margin-top:0.1875rem;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-commerce-062-muted)}
[data-vibeui-block="commerce-062"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:0.25rem 1rem;margin-top:0.4375rem;font-size:0.75rem}
[data-vibeui-block="commerce-062"] [data-part="facts"] strong{font-weight:700}
[data-vibeui-block="commerce-062"] [data-part="perks"]{display:flex;flex-wrap:wrap;gap:0.3125rem;margin-top:0.5rem;list-style:none;padding:0}
[data-vibeui-block="commerce-062"] [data-part="perk"]{
display:inline-flex;align-items:center;height:1.5rem;padding:0 0.5rem;border-radius:0.5rem;
background:var(--vibeui-commerce-062-surface);border:1px solid var(--vibeui-commerce-062-border);font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="commerce-062"] [data-part="limit"]{display:block;margin-top:0.4375rem;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-commerce-062-muted)}
[data-vibeui-block="commerce-062"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;margin-top:1.25rem;height:2.875rem;padding:0 1.75rem;border-radius:0.875rem;
background:var(--vibeui-commerce-062-accent);color:var(--vibeui-commerce-062-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-062"] [data-part="note"]{margin:0.875rem 0 0;max-width:54ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-062-muted)}
@container (min-width: 44rem){
[data-vibeui-block="commerce-062"] [data-part="shell"]{padding:2rem 2rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-062"] *{animation:none!important;transition:none!important}}
`

const FACT_LABEL: Record<string, string> = {
  price: "Доставка",
  eta: "Будет",
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

const DEFAULT_POINTS: Commerce062Point[] = [
  {
    value: "karpovka",
    name: "Пункт выдачи на Карповке",
    address: "наб. реки Карповки, 12, вход со двора",
    distance: "350 м",
    hours: "Ежедневно 09:00–22:00",
    price: "0 ₽",
    eta: "12 марта",
    perks: ["Примерочная", "Оплата картой", "Хранение 7 дней"],
  },
  {
    value: "bolshoy",
    name: "Постамат в супермаркете",
    address: "Большой пр. П.С., 44, первый этаж у касс",
    distance: "1,1 км",
    hours: "Круглосуточно",
    price: "0 ₽",
    eta: "12 марта",
    perks: ["Хранение 3 дня"],
    limit: "Только посылки до 40×35×25 см и 15 кг: кресло сюда не поместится.",
  },
  {
    value: "kozhevennaya",
    name: "Склад самовывоза",
    address: "Кожевенная линия, 40, корпус 3, ворота 2",
    distance: "3,4 км",
    hours: "Пн–Пт 10:00–19:00",
    price: "0 ₽",
    eta: "11 марта",
    perks: ["Крупногабарит", "Погрузчик", "Хранение 14 дней"],
    limit: "Выдают только по паспорту, доверенность оформляется заранее.",
  },
]

/**
 * Выбор пункта выдачи списком по расстоянию: часы, срок хранения и
 * ограничения видны до выбора. Один файл, ноль зависимостей.
 */
export function Commerce062({
  step = "Шаг 2 из 3",
  title = "Где забрать заказ",
  lead = "Пункты отсортированы по расстоянию от адреса доставки. Габариты заказа уже учтены: там, где он не поместится, стоит предупреждение.",
  searchLabel = "Адрес или станция метро",
  searchPlaceholder = "Например, Петроградская",
  searchCta = "Найти рядом",
  legend = "Пункт выдачи",
  points = DEFAULT_POINTS,
  factLabels = FACT_LABEL,
  cta = "Продолжить к оплате",
  note = "Заказ можно забрать после SMS о поступлении. Если не успеваете за срок хранения — продлите его в личном кабинете один раз бесплатно.",
  accent,
  background = "",
  className,
  style,
}: Commerce062Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-062-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-062-bg": background,
          // Поле поиска и чипы возможностей не должны просвечивать: им нужна
          // непрозрачная подложка, а она задана тем же цветом.
          "--vibeui-commerce-062-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-062" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-062"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <p data-part="step">{step}</p>
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <div data-part="search">
            <label htmlFor="commerce-062-search" hidden>
              {searchLabel}
            </label>
            <input
              id="commerce-062-search"
              name="near"
              type="search"
              placeholder={searchPlaceholder}
            />
            <button type="button" data-part="find">
              {searchCta}
            </button>
          </div>

          <form>
            <fieldset>
              <legend>{legend}</legend>
              <div data-part="points">
                {points.map((point, index) => (
                  <div key={point.value} data-part="point">
                    <input
                      type="radio"
                      id={`commerce-062-${point.value}`}
                      name="commerce-062-point"
                      defaultChecked={index === 0}
                    />
                    <label
                      data-part="face"
                      htmlFor={`commerce-062-${point.value}`}
                    >
                      <span data-part="top">
                        <span data-part="name">{point.name}</span>
                        <span data-part="distance">{point.distance}</span>
                      </span>
                      <span data-part="address">{point.address}</span>
                      <span data-part="facts">
                        <span>{point.hours}</span>
                        <span>
                          {factLabels.price ?? FACT_LABEL.price}{" "}
                          <strong>{point.price}</strong>
                        </span>
                        <span>
                          {factLabels.eta ?? FACT_LABEL.eta}{" "}
                          <strong>{point.eta}</strong>
                        </span>
                      </span>
                      <span data-part="perks">
                        {point.perks.map((perk) => (
                          <span key={perk} data-part="perk">
                            {perk}
                          </span>
                        ))}
                      </span>
                      {point.limit ? (
                        <span data-part="limit">{point.limit}</span>
                      ) : null}
                    </label>
                  </div>
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
