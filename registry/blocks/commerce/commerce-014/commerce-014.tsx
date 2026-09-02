import type { CSSProperties } from "react"

export type Commerce014Item = {
  id: string
  title: string
  option?: string
  price: string
  hue?: number
}

export type Commerce014Props = {
  title?: string
  order?: string
  deadline?: string
  items?: Commerce014Item[]
  reasons?: string[]
  refunds?: { value: string; label: string; hint: string }[]
  cta?: string
  policy?: string
  /** Что стоит после срока: почему дату нельзя пропустить. */
  deadlineNote?: string
  /** Подписи разделов формы. */
  itemsLabel?: string
  reasonLabel?: string
  refundLabel?: string
  /** Подпись поля подробностей у причины «другое». */
  detailsLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: заявка на возврат, где причина — закрытый список, а не пустое
// поле. Свободный текст читает человек и отвечает через сутки; выбранная
// причина уходит в правило и решается сразу. Поле для подробностей появляется
// только у причины «другое» — на :has(), без клиентского состояния. Срок
// возврата стоит вверху: если он истёк, вся остальная форма бессмысленна.
const STYLES = `
:where([data-vibeui-block="commerce-014"]){
--vibeui-commerce-014-bg:transparent;
--vibeui-commerce-014-paper:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-commerce-014-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-014-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-014-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-commerce-014-soft:light-dark(oklch(0.975 0.004 265),oklch(0.26 0.01 265));
--vibeui-commerce-014-accent:light-dark(oklch(0.55 0.2 262),oklch(0.68 0.17 262));
--vibeui-commerce-014-on-accent:light-dark(oklch(1 0 0),oklch(0.16 0.02 265));
--vibeui-commerce-014-warn:light-dark(oklch(0.62 0.16 45),oklch(0.78 0.14 45));
--vibeui-commerce-014-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-014"]{
box-sizing:border-box;
background:var(--vibeui-commerce-014-bg);
font-family:var(--vibeui-commerce-014-sans);color:var(--vibeui-commerce-014-fg);
}
[data-vibeui-block="commerce-014"] *{box-sizing:border-box}
[data-vibeui-block="commerce-014"] [data-part="shell"]{padding:1rem;max-width:40rem;margin:0 auto}
[data-vibeui-block="commerce-014"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-014"] [data-part="order"]{margin:0 0 0.75rem;font-size:0.75rem;color:var(--vibeui-commerce-014-muted);font-variant-numeric:tabular-nums}
/* Срок вверху: если он истёк, остальная форма не имеет смысла. */
[data-vibeui-block="commerce-014"] [data-part="deadline"]{
display:flex;gap:0.5rem;align-items:flex-start;margin:0 0 1rem;padding:0.625rem 0.75rem;
border-radius:0.75rem;border:1px solid color-mix(in oklab,var(--vibeui-commerce-014-warn) 35%,transparent);
background:color-mix(in oklab,var(--vibeui-commerce-014-warn) 10%,transparent);
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="commerce-014"] [data-part="deadline"] b{color:var(--vibeui-commerce-014-warn)}
[data-vibeui-block="commerce-014"] fieldset{margin:0 0 0.875rem;padding:0;border:0}
[data-vibeui-block="commerce-014"] legend{padding:0;margin:0 0 0.5rem;font-size:0.75rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;color:var(--vibeui-commerce-014-muted)}
[data-vibeui-block="commerce-014"] [data-part="rows"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="commerce-014"] [data-part="item"]{
display:grid;grid-template-columns:auto 2.5rem minmax(0,1fr) auto;gap:0.625rem;align-items:center;
padding:0.5rem 0.625rem;border-radius:0.75rem;cursor:pointer;
border:1px solid var(--vibeui-commerce-014-border);
}
[data-vibeui-block="commerce-014"] [data-part="item"]:has(input:checked){border-color:var(--vibeui-commerce-014-accent);background:var(--vibeui-commerce-014-soft)}
[data-vibeui-block="commerce-014"] [data-part="item"]:has(input:focus-visible),
[data-vibeui-block="commerce-014"] [data-part="pick"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-014-accent);outline-offset:2px}
[data-vibeui-block="commerce-014"] input[type="checkbox"],
[data-vibeui-block="commerce-014"] input[type="radio"]{accent-color:var(--vibeui-commerce-014-accent);width:1rem;height:1rem;margin:0}
[data-vibeui-block="commerce-014"] [data-part="shot"]{
width:2.5rem;height:2.5rem;border-radius:0.5rem;
background:linear-gradient(145deg,oklch(0.94 0.05 var(--vibeui-commerce-014-hue,262)),oklch(0.86 0.09 var(--vibeui-commerce-014-hue,262)));
}
[data-vibeui-block="commerce-014"] [data-part="name"]{display:block;font-size:0.8125rem;font-weight:650;line-height:1.3}
[data-vibeui-block="commerce-014"] [data-part="option"]{display:block;font-size:0.6875rem;color:var(--vibeui-commerce-014-muted)}
[data-vibeui-block="commerce-014"] [data-part="price"]{font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-014"] [data-part="pick"]{
display:flex;align-items:flex-start;gap:0.5rem;padding:0.4375rem 0.625rem;border-radius:0.625rem;cursor:pointer;
border:1px solid transparent;font-size:0.8125rem;line-height:1.35;
}
[data-vibeui-block="commerce-014"] [data-part="pick"]:has(input:checked){border-color:var(--vibeui-commerce-014-border);background:var(--vibeui-commerce-014-soft)}
[data-vibeui-block="commerce-014"] [data-part="hint"]{display:block;font-size:0.6875rem;color:var(--vibeui-commerce-014-muted)}
/* Подробности просим только у причины «другое»: остальные решаются правилом. */
[data-vibeui-block="commerce-014"] [data-part="why"]{display:none;margin-top:0.5rem}
[data-vibeui-block="commerce-014"] [data-part="reasons"]:has(#commerce-014-other:checked) [data-part="why"]{display:block}
[data-vibeui-block="commerce-014"] textarea{
width:100%;min-height:4.5rem;resize:vertical;font:inherit;font-size:0.8125rem;color:inherit;padding:0.5rem 0.625rem;
border:1px solid var(--vibeui-commerce-014-border);border-radius:0.625rem;background:var(--vibeui-commerce-014-paper);
}
[data-vibeui-block="commerce-014"] textarea:focus-visible{outline:2px solid var(--vibeui-commerce-014-accent);outline-offset:1px}
[data-vibeui-block="commerce-014"] [data-part="send"]{
width:100%;appearance:none;border:0;cursor:pointer;height:2.625rem;border-radius:0.75rem;
background:var(--vibeui-commerce-014-accent);color:var(--vibeui-commerce-014-on-accent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-014"] [data-part="send"]:focus-visible{outline:2px solid var(--vibeui-commerce-014-accent);outline-offset:2px}
[data-vibeui-block="commerce-014"] [data-part="policy"]{margin:0.625rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-014-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Commerce014Item[] = [
  {
    id: "1",
    title: "Кресло «Хмарь»",
    option: "Песочный, дуб",
    price: "38 900 ₽",
    hue: 75,
  },
  {
    id: "2",
    title: "Плед «Пасмурно»",
    option: "Шерсть, 140 × 200",
    price: "7 400 ₽",
    hue: 262,
  },
]

const DEFAULT_REASONS = [
  "Не подошёл размер",
  "Отличается от описания",
  "Пришёл повреждённым",
  "Передумал",
  "Другое",
]

const DEFAULT_REFUNDS = [
  {
    value: "card",
    label: "На карту •• 4417",
    hint: "3–5 рабочих дней после приёмки",
  },
  {
    value: "bonus",
    label: "Бонусами на счёт",
    hint: "Сразу после приёмки, +5% к сумме",
  },
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
 * Заявка на возврат: причина из списка, подробности — только у «другого».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce014({
  title = "Оформление возврата",
  order = "Заказ № 2024-1187 от 10 марта",
  deadline = "Вернуть можно до 26 марта — осталось 9 дней",
  items = DEFAULT_ITEMS,
  reasons = DEFAULT_REASONS,
  refunds = DEFAULT_REFUNDS,
  cta = "Отправить заявку",
  policy = "Товар примем в исходной комплектации. Курьер заберёт бесплатно, если причина — брак или ошибка магазина.",
  deadlineNote = "После этой даты заявку примет только поддержка.",
  itemsLabel = "Что возвращаем",
  reasonLabel = "Почему",
  refundLabel = "Куда вернуть деньги",
  detailsLabel = "Расскажите подробнее — так заявку решат без переписки",
  accent,
  background = "",
  className,
  style,
}: Commerce014Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-014-bg": background,
          "--vibeui-commerce-014-paper": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-014"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="order">{order}</p>

          <p data-part="deadline">
            <span aria-hidden="true">⏳</span>
            <span>
              <b>{deadline}</b>. {deadlineNote}
            </span>
          </p>

          <form>
            <fieldset>
              <legend>{itemsLabel}</legend>
              <div data-part="rows">
                {items.map((item, index) => (
                  <label
                    key={item.id}
                    data-part="item"
                    style={
                      {
                        "--vibeui-commerce-014-hue": item.hue ?? 262,
                      } as CSSProperties
                    }
                  >
                    <input
                      type="checkbox"
                      name="commerce-014-item"
                      value={item.id}
                      defaultChecked={index === 0}
                    />
                    <span data-part="shot" aria-hidden="true" />
                    <span>
                      <span data-part="name">{item.title}</span>
                      {item.option ? (
                        <span data-part="option">{item.option}</span>
                      ) : null}
                    </span>
                    <span data-part="price">{item.price}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset data-part="reasons">
              <legend>{reasonLabel}</legend>
              <div>
                {reasons.map((reason, index) => (
                  <label key={reason} data-part="pick">
                    <input
                      type="radio"
                      name="commerce-014-reason"
                      value={reason}
                      id={
                        index === reasons.length - 1
                          ? "commerce-014-other"
                          : undefined
                      }
                      defaultChecked={index === 0}
                    />
                    {reason}
                  </label>
                ))}
              </div>
              <div data-part="why">
                <label htmlFor="commerce-014-text" data-part="hint">
                  {detailsLabel}
                </label>
                <textarea id="commerce-014-text" />
              </div>
            </fieldset>

            <fieldset>
              <legend>{refundLabel}</legend>
              <div>
                {refunds.map((refund, index) => (
                  <label key={refund.value} data-part="pick">
                    <input
                      type="radio"
                      name="commerce-014-refund"
                      value={refund.value}
                      defaultChecked={index === 0}
                    />
                    <span>
                      {refund.label}
                      <span data-part="hint">{refund.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button type="submit" data-part="send">
              {cta}
            </button>
          </form>

          <p data-part="policy">{policy}</p>
        </div>
      </section>
    </>
  )
}
