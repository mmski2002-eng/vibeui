import type { CSSProperties } from "react"

export type Commerce037Line = {
  id: string
  title: string
  spec: string
  price: string
  count: number
  hue?: number
  blocked?: string
}

export type Commerce037Props = {
  title?: string
  order?: string
  deadline?: string
  /** Условия возврата рядом со сроком. */
  deadlineNote?: string
  lines?: Commerce037Line[]
  reasons?: string[]
  refund?: string
  refundNote?: string
  cta?: string
  /** Подписи внутри строки заказа: {count} — количество, {title} — название. */
  unitText?: string
  pickLabel?: string
  quantityLabel?: string
  reasonLabel?: string
  summaryLabel?: string
  summaryTitle?: string
  summaryHint?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: возврат начинается с выбора позиций, а не с формы. Каждая
// строка заказа несёт чекбокс, количество и свою причину — возвращают чаще
// одну вещь из пяти, и общая причина на весь заказ заставляет писать её в
// комментарий. Позиция, которую вернуть нельзя, остаётся в списке с
// объяснением: удалённая строка выглядит как потерянный товар.
const STYLES = `
:where([data-vibeui-block="commerce-037"]){
--vibeui-commerce-037-bg:transparent;
--vibeui-commerce-037-fg:light-dark(oklch(0.21 0.014 265),oklch(0.93 0.006 265));
--vibeui-commerce-037-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-commerce-037-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-commerce-037-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.009 265));
--vibeui-commerce-037-accent:light-dark(oklch(0.5 0.16 30),oklch(0.72 0.15 35));
--vibeui-commerce-037-onaccent:light-dark(oklch(1 0 0),oklch(0.18 0.03 35));
--vibeui-commerce-037-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-037"]{color-scheme:dark}
[data-vibeui-block="commerce-037"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-037-bg);
color:var(--vibeui-commerce-037-fg);font-family:var(--vibeui-commerce-037-sans);
}
[data-vibeui-block="commerce-037"] *{box-sizing:border-box}
[data-vibeui-block="commerce-037"] [data-part="shell"]{max-width:54rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-037"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-037"] [data-part="order"]{margin:0;font-size:0.8125rem;color:var(--vibeui-commerce-037-muted)}
/* Срок возврата стоит выше списка: он решает, есть ли смысл заполнять заявку. */
[data-vibeui-block="commerce-037"] [data-part="deadline"]{
margin:0.75rem 0 1rem;padding:0.625rem 0.75rem;border-radius:0.875rem;
background:var(--vibeui-commerce-037-soft);font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="commerce-037"] [data-part="deadline"] b{font-weight:700}
[data-vibeui-block="commerce-037"] [data-part="grid"]{display:grid;gap:1rem}
@container (min-width: 46rem){
[data-vibeui-block="commerce-037"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) 17rem;align-items:start}
}
[data-vibeui-block="commerce-037"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="commerce-037"] [data-part="line"]{
border:1px solid var(--vibeui-commerce-037-border);border-radius:1rem;padding:0.75rem;
}
[data-vibeui-block="commerce-037"] [data-part="line"][data-blocked="yes"]{background:var(--vibeui-commerce-037-soft)}
[data-vibeui-block="commerce-037"] [data-part="top"]{
display:grid;grid-template-columns:auto 3rem minmax(0,1fr) auto;gap:0.625rem;align-items:center;
}
[data-vibeui-block="commerce-037"] [data-part="pick"]{margin:0;width:1.125rem;height:1.125rem;accent-color:var(--vibeui-commerce-037-accent)}
[data-vibeui-block="commerce-037"] [data-part="thumb"]{
aspect-ratio:1;border-radius:0.625rem;
background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-037-hue,30)),oklch(0.85 0.09 var(--vibeui-commerce-037-hue,30)));
}
[data-vibeui-block="commerce-037"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.35}
[data-vibeui-block="commerce-037"] [data-part="spec"]{margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-037-muted)}
[data-vibeui-block="commerce-037"] [data-part="cost"]{margin:0;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;text-align:right}
[data-vibeui-block="commerce-037"] [data-part="fields"]{
margin-top:0.625rem;padding-top:0.625rem;border-top:1px dashed var(--vibeui-commerce-037-border);
display:grid;gap:0.5rem;
}
@container (min-width: 34rem){
[data-vibeui-block="commerce-037"] [data-part="fields"]{grid-template-columns:6.5rem minmax(0,1fr)}
}
[data-vibeui-block="commerce-037"] label[data-part="field"]{display:grid;gap:0.25rem}
[data-vibeui-block="commerce-037"] [data-part="field"] > span{font-size:0.6875rem;font-weight:600;color:var(--vibeui-commerce-037-muted)}
[data-vibeui-block="commerce-037"] select{
width:100%;height:2.375rem;padding:0 0.625rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-037-border);background:var(--vibeui-commerce-037-bg);
color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="commerce-037"] select:focus-visible,
[data-vibeui-block="commerce-037"] [data-part="pick"]:focus-visible{outline:2px solid var(--vibeui-commerce-037-accent);outline-offset:1px}
[data-vibeui-block="commerce-037"] [data-part="why"]{
margin:0.5rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-037-muted);
}
[data-vibeui-block="commerce-037"] aside{
border:1px solid var(--vibeui-commerce-037-border);border-radius:1.125rem;padding:0.875rem;
}
@container (min-width: 46rem){
[data-vibeui-block="commerce-037"] aside{position:sticky;top:1rem}
}
[data-vibeui-block="commerce-037"] aside h3{margin:0 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-037-muted)}
[data-vibeui-block="commerce-037"] [data-part="sum"]{
margin:0;display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:1.375rem;font-weight:750;font-variant-numeric:tabular-nums;letter-spacing:-0.02em;
}
[data-vibeui-block="commerce-037"] [data-part="sum"] span:first-child{font-size:0.8125rem;font-weight:600;color:var(--vibeui-commerce-037-muted)}
[data-vibeui-block="commerce-037"] [data-part="refundnote"]{margin:0.5rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-037-muted)}
[data-vibeui-block="commerce-037"] [data-part="cta"]{
margin-top:0.875rem;width:100%;appearance:none;border:0;cursor:pointer;height:2.875rem;border-radius:0.875rem;
background:var(--vibeui-commerce-037-accent);color:var(--vibeui-commerce-037-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-037"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-037-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-037"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Commerce037Line[] = [
  {
    id: "1",
    title: "Свитшот «Тихий вечер»",
    spec: "Размер L, серый",
    price: "5 400 ₽",
    count: 2,
    hue: 262,
  },
  {
    id: "2",
    title: "Плед «Пасмурно»",
    spec: "Шерсть, 140×200",
    price: "7 400 ₽",
    count: 1,
    hue: 150,
  },
  {
    id: "3",
    title: "Свеча «Отмель»",
    spec: "Инжир и кедр, 200 г",
    price: "1 900 ₽",
    count: 1,
    hue: 75,
    blocked:
      "Товар вскрыт и относится к парфюмерии — по закону возврату не подлежит.",
  },
]

const DEFAULT_REASONS = [
  "Не подошёл размер",
  "Отличается от фото",
  "Брак или повреждение",
  "Пришло не то, что заказывал",
  "Передумал",
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
 * Возврат с выбором позиций: у каждой строки своя причина, сумма считается от отметок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce037({
  title = "Что вернуть",
  order = "Заказ № 2024-1187 от 28 февраля",
  deadline = "Вернуть можно до 14 марта — осталось 9 дней",
  deadlineNote = "Товар должен быть в исходном виде, с бирками и в упаковке.",
  lines = DEFAULT_LINES,
  reasons = DEFAULT_REASONS,
  refund = "12 800 ₽",
  refundNote = "Деньги вернутся на карту, с которой платили, за 3–10 рабочих дней после того, как склад примет посылку.",
  cta = "Оформить возврат",
  unitText = "{count} шт.",
  pickLabel = "Вернуть «{title}»",
  quantityLabel = "Сколько вернуть",
  reasonLabel = "Причина возврата",
  summaryLabel = "Сумма возврата",
  summaryTitle = "К возврату",
  summaryHint = "За отмеченные позиции",
  accent,
  background = "",
  className,
  style,
}: Commerce037Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-037-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-037-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-037" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-037"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="order">{order}</p>
          <p data-part="deadline">
            <b>{deadline}</b>. {deadlineNote}
          </p>

          <div data-part="grid">
            <ul>
              {lines.map((line, index) => (
                <li
                  key={line.id}
                  data-part="line"
                  data-blocked={line.blocked ? "yes" : "no"}
                  style={
                    {
                      "--vibeui-commerce-037-hue": line.hue ?? 30,
                    } as CSSProperties
                  }
                >
                  <div data-part="top">
                    <input
                      type="checkbox"
                      data-part="pick"
                      defaultChecked={!line.blocked && index === 0}
                      disabled={Boolean(line.blocked)}
                      aria-label={pickLabel.replace("{title}", line.title)}
                    />
                    <span data-part="thumb" aria-hidden="true" />
                    <div>
                      <p data-part="name">{line.title}</p>
                      <p data-part="spec">
                        {line.spec} ·{" "}
                        {unitText.replace("{count}", String(line.count))}
                      </p>
                    </div>
                    <p data-part="cost">{line.price}</p>
                  </div>

                  {line.blocked ? (
                    <p data-part="why">{line.blocked}</p>
                  ) : (
                    <div data-part="fields">
                      <label data-part="field">
                        <span>{quantityLabel}</span>
                        <select defaultValue={String(line.count)}>
                          {Array.from({ length: line.count }, (_, i) => (
                            <option key={i} value={String(i + 1)}>
                              {unitText.replace("{count}", String(i + 1))}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label data-part="field">
                        <span>{reasonLabel}</span>
                        <select defaultValue={reasons[0]}>
                          {reasons.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <aside aria-label={summaryLabel}>
              <h3>{summaryTitle}</h3>
              <p data-part="sum">
                <span>{summaryHint}</span>
                <span>{refund}</span>
              </p>
              <p data-part="refundnote">{refundNote}</p>
              <button type="button" data-part="cta">
                {cta}
              </button>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
