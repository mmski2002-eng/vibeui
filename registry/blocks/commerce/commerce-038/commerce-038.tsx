import type { CSSProperties } from "react"

export type Commerce038Card = {
  id: string
  value: string
  label: string
  note: string
}

export type Commerce038Case = {
  id: string
  what: string
  covered: boolean
  note: string
}

export type Commerce038Props = {
  title?: string
  lead?: string
  term?: string
  /** Подпись под сроком гарантии. */
  termNote?: string
  cards?: Commerce038Card[]
  tableTitle?: string
  cases?: Commerce038Case[]
  /** Заголовки колонок таблицы: ключи case, covered и outcome. */
  columnText?: Record<string, string>
  /** Подписи покрытия: ключи yes и no. */
  coverText?: Record<string, string>
  stepsTitle?: string
  steps?: string[]
  cta?: string
  secondary?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: гарантия, где рядом стоит то, что она НЕ покрывает. Список
// одних плюсов читается как реклама и не снимает главный страх — «а мой
// случай подойдёт?». Покрытие помечено значком и словом, а не цветом строки:
// зелёная и красная заливка неразличимы при дальтонизме и в печати.
const STYLES = `
:where([data-vibeui-block="commerce-038"]){
--vibeui-commerce-038-bg:transparent;
--vibeui-commerce-038-fg:light-dark(oklch(0.21 0.014 265),oklch(0.93 0.006 265));
--vibeui-commerce-038-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-commerce-038-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-commerce-038-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.009 265));
--vibeui-commerce-038-accent:light-dark(oklch(0.45 0.12 235),oklch(0.72 0.12 235));
--vibeui-commerce-038-onaccent:light-dark(oklch(1 0 0),oklch(0.18 0.03 250));
--vibeui-commerce-038-yes:light-dark(oklch(0.52 0.13 150),oklch(0.76 0.14 155));
--vibeui-commerce-038-no:light-dark(oklch(0.55 0.15 35),oklch(0.75 0.14 35));
--vibeui-commerce-038-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-038"]{
box-sizing:border-box;background:var(--vibeui-commerce-038-bg);
color:var(--vibeui-commerce-038-fg);font-family:var(--vibeui-commerce-038-sans);
}
[data-vibeui-block="commerce-038"] *{box-sizing:border-box}
[data-vibeui-block="commerce-038"] [data-part="shell"]{max-width:58rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-038"] [data-part="head"]{
display:grid;gap:0.75rem;padding:1rem 1.125rem;border-radius:1.25rem;margin-bottom:1rem;
background:linear-gradient(135deg,oklch(0.32 0.08 235),oklch(0.24 0.05 250));color:oklch(1 0 0);
}
@container (min-width: 42rem){
[data-vibeui-block="commerce-038"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto;align-items:center;padding:1.5rem 1.75rem}
}
[data-vibeui-block="commerce-038"] h2{margin:0;font-size:1.375rem;font-weight:750;letter-spacing:-0.025em}
[data-vibeui-block="commerce-038"] [data-part="lead"]{margin:0.3125rem 0 0;max-width:34rem;font-size:0.875rem;line-height:1.55;color:oklch(1 0 0 / 78%)}
[data-vibeui-block="commerce-038"] [data-part="term"]{
display:grid;place-items:center;min-width:6.5rem;padding:0.75rem 1rem;border-radius:1rem;
background:oklch(1 0 0 / 14%);border:1px solid oklch(1 0 0 / 22%);text-align:center;
}
[data-vibeui-block="commerce-038"] [data-part="term"] b{font-size:1.75rem;font-weight:800;letter-spacing:-0.03em;line-height:1}
[data-vibeui-block="commerce-038"] [data-part="term"] span{margin-top:0.1875rem;font-size:0.6875rem;color:oklch(1 0 0 / 75%)}
[data-vibeui-block="commerce-038"] [data-part="cards"]{
list-style:none;margin:0;padding:0;display:grid;gap:0.625rem;grid-template-columns:repeat(2,minmax(0,1fr));
}
@container (min-width: 42rem){
[data-vibeui-block="commerce-038"] [data-part="cards"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="commerce-038"] [data-part="card"]{
padding:0.75rem 0.875rem;border:1px solid var(--vibeui-commerce-038-border);border-radius:1rem;
}
[data-vibeui-block="commerce-038"] [data-part="value"]{display:block;font-size:1.25rem;font-weight:750;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-038"] [data-part="label"]{display:block;margin-top:0.125rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="commerce-038"] [data-part="note"]{display:block;margin-top:0.25rem;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-038-muted)}
[data-vibeui-block="commerce-038"] h3{margin:1.25rem 0 0.5rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-038"] [data-part="scroll"]{
overflow-x:auto;border:1px solid var(--vibeui-commerce-038-border);border-radius:1.125rem;
}
[data-vibeui-block="commerce-038"] table{border-collapse:collapse;width:100%;min-width:30rem;font-size:0.8125rem}
[data-vibeui-block="commerce-038"] th[scope="col"]{
padding:0.625rem 0.875rem;text-align:left;font-size:0.6875rem;font-weight:650;
color:var(--vibeui-commerce-038-muted);background:var(--vibeui-commerce-038-soft);
border-bottom:1px solid var(--vibeui-commerce-038-border);
}
[data-vibeui-block="commerce-038"] td{padding:0.625rem 0.875rem;vertical-align:top;line-height:1.45}
[data-vibeui-block="commerce-038"] tbody tr + tr td{border-top:1px solid var(--vibeui-commerce-038-border)}
[data-vibeui-block="commerce-038"] [data-part="what"]{font-weight:600}
/* Покрытие названо словом и формой значка: цвет строки один ничего не сообщает. */
[data-vibeui-block="commerce-038"] [data-part="flag"]{
display:inline-flex;align-items:center;gap:0.375rem;white-space:nowrap;font-weight:650;
}
[data-vibeui-block="commerce-038"] [data-part="flag"][data-yes="yes"]{color:var(--vibeui-commerce-038-yes)}
[data-vibeui-block="commerce-038"] [data-part="flag"][data-yes="no"]{color:var(--vibeui-commerce-038-no)}
[data-vibeui-block="commerce-038"] [data-part="flag"] i{
font-style:normal;display:grid;place-items:center;width:1.125rem;height:1.125rem;border-radius:9999px;
border:1.5px solid currentColor;font-size:0.6875rem;line-height:1;
}
[data-vibeui-block="commerce-038"] [data-part="flag"][data-yes="no"] i{border-radius:0.25rem}
[data-vibeui-block="commerce-038"] ol{list-style:none;counter-reset:step;margin:0;padding:0;display:grid;gap:0.5rem}
@container (min-width: 42rem){
[data-vibeui-block="commerce-038"] ol{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="commerce-038"] ol li{
counter-increment:step;position:relative;padding:0.75rem 0.875rem 0.75rem 2.5rem;
border-radius:0.875rem;background:var(--vibeui-commerce-038-soft);font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="commerce-038"] ol li::before{
content:counter(step);position:absolute;left:0.75rem;top:0.75rem;
width:1.375rem;height:1.375rem;border-radius:9999px;display:grid;place-items:center;
background:var(--vibeui-commerce-038-accent);color:var(--vibeui-commerce-038-onaccent);font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="commerce-038"] [data-part="actions"]{margin-top:1rem;display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="commerce-038"] [data-part="cta"]{
appearance:none;border:0;cursor:pointer;height:2.75rem;padding:0 1.5rem;border-radius:0.875rem;
background:var(--vibeui-commerce-038-accent);color:var(--vibeui-commerce-038-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-038"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.75rem;padding:0 1.25rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-038-border);background:var(--vibeui-commerce-038-bg);
color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-038"] [data-part="cta"]:focus-visible,
[data-vibeui-block="commerce-038"] [data-part="alt"]:focus-visible{outline:2px solid var(--vibeui-commerce-038-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-038"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CARDS: Commerce038Card[] = [
  {
    id: "c1",
    value: "40",
    label: "городов с сервисом",
    note: "Приём в любом магазине сети, курьер заберёт бесплатно.",
  },
  {
    id: "c2",
    value: "5 дней",
    label: "средний ремонт",
    note: "Если дольше 30 дней — меняем товар или возвращаем деньги.",
  },
  {
    id: "c3",
    value: "0 ₽",
    label: "диагностика",
    note: "Платить не нужно, даже если случай окажется негарантийным.",
  },
  {
    id: "c4",
    value: "14 дней",
    label: "подменный фонд",
    note: "На время ремонта выдаём похожую модель под залог документа.",
  },
]

const DEFAULT_CASES: Commerce038Case[] = [
  {
    id: "k1",
    what: "Не включается, села плата",
    covered: true,
    note: "Заводской дефект: чиним или меняем на новый.",
  },
  {
    id: "k2",
    what: "Треснул корпус при перевозке",
    covered: true,
    note: "Если заметили при получении и отметили в накладной.",
  },
  {
    id: "k3",
    what: "Залили водой, окислились контакты",
    covered: false,
    note: "Ремонт платный, оценку пришлём до начала работ.",
  },
  {
    id: "k4",
    what: "Разбирали сами или чинили в другом сервисе",
    covered: false,
    note: "Гарантия снимается, но платный ремонт остаётся доступным.",
  },
  {
    id: "k5",
    what: "Износ ткани и потёртости за год",
    covered: false,
    note: "Естественный износ не считается дефектом.",
  },
]

const DEFAULT_STEPS = [
  "Опишите поломку в заявке и приложите фото — так мастер поймёт случай заранее.",
  "Привезите товар в сервис или вызовите курьера: доставка по гарантии бесплатная.",
  "Следите за ремонтом по номеру заявки, сообщение о готовности придёт на почту.",
]

const DEFAULT_COLUMNS: Record<string, string> = {
  case: "Случай",
  covered: "По гарантии",
  outcome: "Что будет",
}

const DEFAULT_COVER: Record<string, string> = {
  yes: "Покрывается",
  no: "Не покрывается",
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
 * Гарантия и сервис: покрытые и непокрытые случаи стоят в одной таблице.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce038({
  title = "Гарантия и сервис",
  lead = "Гарантия начинается с даты покупки и не требует чека: заказ уже привязан к вашему телефону. Регистрировать товар отдельно не нужно.",
  term = "2 года",
  termNote = "гарантия производителя",
  cards = DEFAULT_CARDS,
  tableTitle = "Что покрывает гарантия, а что нет",
  cases = DEFAULT_CASES,
  columnText = DEFAULT_COLUMNS,
  coverText = DEFAULT_COVER,
  stepsTitle = "Как сдать товар в ремонт",
  steps = DEFAULT_STEPS,
  cta = "Оставить заявку в сервис",
  secondary = "Скачать условия гарантии",
  accent,
  background = "",
  className,
  style,
}: Commerce038Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-038-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-038-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-038" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-038"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <div>
              <h2>{title}</h2>
              <p data-part="lead">{lead}</p>
            </div>
            <p data-part="term">
              <b>{term}</b>
              <span>{termNote}</span>
            </p>
          </div>

          <ul data-part="cards">
            {cards.map((card) => (
              <li data-part="card" key={card.id}>
                <span data-part="value">{card.value}</span>
                <span data-part="label">{card.label}</span>
                <span data-part="note">{card.note}</span>
              </li>
            ))}
          </ul>

          <h3>{tableTitle}</h3>
          <div data-part="scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    {columnText.case ?? DEFAULT_COLUMNS.case}
                  </th>
                  <th scope="col">
                    {columnText.covered ?? DEFAULT_COLUMNS.covered}
                  </th>
                  <th scope="col">
                    {columnText.outcome ?? DEFAULT_COLUMNS.outcome}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cases.map((item) => (
                  <tr key={item.id}>
                    <td data-part="what">{item.what}</td>
                    <td>
                      <span
                        data-part="flag"
                        data-yes={item.covered ? "yes" : "no"}
                      >
                        <i aria-hidden="true">{item.covered ? "✓" : "×"}</i>
                        {item.covered
                          ? (coverText.yes ?? DEFAULT_COVER.yes)
                          : (coverText.no ?? DEFAULT_COVER.no)}
                      </span>
                    </td>
                    <td>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>{stepsTitle}</h3>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div data-part="actions">
            <button type="button" data-part="cta">
              {cta}
            </button>
            <button type="button" data-part="alt">
              {secondary}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
