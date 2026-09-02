import type { CSSProperties } from "react"

export type Commerce055Fit = "yes" | "partial" | "no"

export type Commerce055Model = {
  id: string
  brand: string
  model: string
  years: string
  fit: Commerce055Fit
  comment: string
}

export type Commerce055Props = {
  title?: string
  product?: string
  lead?: string
  models?: Commerce055Model[]
  legendTitle?: string
  columnModel?: string
  columnYears?: string
  columnFit?: string
  columnComment?: string
  vinTitle?: string
  vinHint?: string
  vinPlaceholder?: string
  vinCta?: string
  /** Названия состояний: компонент несёт русские, проект подставляет свои. */
  fitText?: Record<Commerce055Fit, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: таблица совместимости аксессуара с моделями. Состояние
// названо словом и формой значка, а не только цветом: «частично» — самая
// важная строка, и она обязана читаться без различения оттенков. Первая
// колонка залипает при горизонтальной прокрутке, иначе на телефоне
// непонятно, к какой модели относится ячейка.
const STYLES = `
:where([data-vibeui-block="commerce-055"]){
--vibeui-commerce-055-bg:transparent;
--vibeui-commerce-055-surface:light-dark(oklch(1 0 0),oklch(0.21 0.01 250));
--vibeui-commerce-055-fg:light-dark(oklch(0.21 0.012 250),oklch(0.94 0.006 250));
--vibeui-commerce-055-muted:light-dark(oklch(0.53 0.014 250),oklch(0.73 0.012 250));
--vibeui-commerce-055-border:light-dark(oklch(0.9 0.006 250),oklch(0.38 0.012 250));
--vibeui-commerce-055-soft:light-dark(oklch(0.972 0.004 250),oklch(0.27 0.01 250));
--vibeui-commerce-055-accent:light-dark(oklch(0.48 0.14 250),oklch(0.74 0.13 250));
--vibeui-commerce-055-yes:light-dark(oklch(0.5 0.13 150),oklch(0.74 0.14 152));
--vibeui-commerce-055-partial:light-dark(oklch(0.6 0.14 75),oklch(0.8 0.13 80));
--vibeui-commerce-055-no:light-dark(oklch(0.55 0.17 25),oklch(0.72 0.16 27));
--vibeui-commerce-055-onmark:light-dark(oklch(0.99 0 0),oklch(0.18 0.02 250));
--vibeui-commerce-055-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-055"]{
box-sizing:border-box;background:var(--vibeui-commerce-055-bg);
color:var(--vibeui-commerce-055-fg);font-family:var(--vibeui-commerce-055-sans);
}
[data-vibeui-block="commerce-055"] *{box-sizing:border-box}
[data-vibeui-block="commerce-055"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-055"] [data-part="product"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-055-accent)}
[data-vibeui-block="commerce-055"] h2{margin:0.375rem 0 0.5rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-055"] [data-part="lead"]{margin:0 0 1rem;max-width:58ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-055-muted)}
[data-vibeui-block="commerce-055"] [data-part="legend"]{list-style:none;display:flex;flex-wrap:wrap;gap:0.375rem 1rem;margin:0 0 0.875rem;padding:0;font-size:0.75rem;color:var(--vibeui-commerce-055-muted)}
[data-vibeui-block="commerce-055"] [data-part="legend"] li{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="commerce-055"] [data-part="mark"]{
flex:none;width:1.125rem;height:1.125rem;border-radius:9999px;display:inline-flex;align-items:center;justify-content:center;
font-size:0.6875rem;font-weight:800;color:var(--vibeui-commerce-055-onmark);
}
[data-vibeui-block="commerce-055"] [data-part="mark"][data-fit="yes"]{background:var(--vibeui-commerce-055-yes)}
[data-vibeui-block="commerce-055"] [data-part="mark"][data-fit="partial"]{
background:var(--vibeui-commerce-055-partial);border-radius:0;clip-path:polygon(50% 4%,100% 100%,0 100%);
align-items:flex-end;padding-bottom:1px;font-size:0.625rem;
}
[data-vibeui-block="commerce-055"] [data-part="mark"][data-fit="no"]{background:var(--vibeui-commerce-055-no);border-radius:0.1875rem}
[data-vibeui-block="commerce-055"] [data-part="scroll"]{overflow-x:auto;border:1px solid var(--vibeui-commerce-055-border);border-radius:0.875rem}
[data-vibeui-block="commerce-055"] table{border-collapse:collapse;width:100%;min-width:34rem;font-size:0.8125rem}
[data-vibeui-block="commerce-055"] caption{
caption-side:top;text-align:left;padding:0.625rem 0.875rem;font-size:0.75rem;color:var(--vibeui-commerce-055-muted);
background:var(--vibeui-commerce-055-soft);border-bottom:1px solid var(--vibeui-commerce-055-border);
}
[data-vibeui-block="commerce-055"] th,
[data-vibeui-block="commerce-055"] td{padding:0.625rem 0.75rem;text-align:left;vertical-align:top;border-bottom:1px solid var(--vibeui-commerce-055-border)}
[data-vibeui-block="commerce-055"] thead th{
position:sticky;top:0;background:var(--vibeui-commerce-055-soft);font-size:0.6875rem;letter-spacing:0.05em;
text-transform:uppercase;color:var(--vibeui-commerce-055-muted);font-weight:700;
}
[data-vibeui-block="commerce-055"] tbody th{
position:sticky;left:0;background:var(--vibeui-commerce-055-surface);font-weight:650;min-width:11rem;
box-shadow:1px 0 0 var(--vibeui-commerce-055-border);
}
[data-vibeui-block="commerce-055"] tbody th span{display:block;font-weight:400;font-size:0.75rem;color:var(--vibeui-commerce-055-muted)}
[data-vibeui-block="commerce-055"] tbody tr:last-child th,
[data-vibeui-block="commerce-055"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="commerce-055"] [data-part="fit"]{display:flex;align-items:center;gap:0.375rem;font-weight:650;white-space:nowrap}
[data-vibeui-block="commerce-055"] [data-part="fit"][data-fit="yes"]{color:var(--vibeui-commerce-055-yes)}
[data-vibeui-block="commerce-055"] [data-part="fit"][data-fit="partial"]{color:var(--vibeui-commerce-055-partial)}
[data-vibeui-block="commerce-055"] [data-part="fit"][data-fit="no"]{color:var(--vibeui-commerce-055-no)}
[data-vibeui-block="commerce-055"] [data-part="comment"]{color:var(--vibeui-commerce-055-muted);line-height:1.5;min-width:14rem}
[data-vibeui-block="commerce-055"] [data-part="vin"]{
margin-top:1rem;border:1px solid var(--vibeui-commerce-055-border);border-radius:0.875rem;
padding:0.875rem 1rem;background:var(--vibeui-commerce-055-soft);
}
[data-vibeui-block="commerce-055"] h3{margin:0 0 0.25rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-055"] [data-part="vin"] p{margin:0 0 0.625rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-commerce-055-muted)}
[data-vibeui-block="commerce-055"] [data-part="vinrow"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="commerce-055"] input{
flex:1 1 12rem;height:2.5rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-055-border);background:var(--vibeui-commerce-055-surface);
font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="commerce-055"] input:focus-visible,
[data-vibeui-block="commerce-055"] [data-part="check"]:focus-visible{outline:2px solid var(--vibeui-commerce-055-accent);outline-offset:2px}
[data-vibeui-block="commerce-055"] [data-part="check"]{
appearance:none;border:0;cursor:pointer;height:2.5rem;padding:0 1.125rem;border-radius:0.625rem;
background:var(--vibeui-commerce-055-accent);color:var(--vibeui-commerce-055-onmark);font:inherit;font-size:0.875rem;font-weight:650;
}
@container (min-width: 44rem){
[data-vibeui-block="commerce-055"] [data-part="shell"]{padding:2rem 2rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-055"] *{animation:none!important;transition:none!important}}
`

const FIT_MARK: Record<Commerce055Fit, string> = {
  yes: "✓",
  partial: "!",
  no: "×",
}

const FIT_WORD: Record<Commerce055Fit, string> = {
  yes: "Подходит",
  partial: "С доработкой",
  no: "Не подходит",
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

const DEFAULT_MODELS: Commerce055Model[] = [
  {
    id: "1",
    brand: "Ладога",
    model: "Каскад 2.0",
    years: "2018–2024",
    fit: "yes",
    comment: "Штатные крепления, установка без сверления за 10 минут.",
  },
  {
    id: "2",
    brand: "Ладога",
    model: "Каскад Кросс",
    years: "2021–2024",
    fit: "partial",
    comment:
      "Нужна проставка 8 мм из комплекта: у версии Кросс рейлинги выше на сантиметр.",
  },
  {
    id: "3",
    brand: "Вымпел",
    model: "Штиль 1.6",
    years: "2016–2022",
    fit: "yes",
    comment:
      "Совпадает по ширине и шагу отверстий, дополнительных деталей нет.",
  },
  {
    id: "4",
    brand: "Вымпел",
    model: "Штиль универсал",
    years: "2019–2024",
    fit: "partial",
    comment: "Задняя дверь упирается при полном открытии — сместите на 4 см.",
  },
  {
    id: "5",
    brand: "Пороша",
    model: "Тракт 3.0",
    years: "2020–2024",
    fit: "no",
    comment: "Панорамная крыша, штатных точек крепления нет. Нужна модель XT.",
  },
]

/**
 * Таблица совместимости товара с моделями: состояние названо словом и
 * формой значка. Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce055({
  title = "С какими моделями подходит",
  product = "Багажник «Кряж» на рейлинги",
  lead = "Список собран по замерам в сервисе, а не по каталогу производителя. Если вашей модели нет — проверьте по VIN, ответ придёт в течение дня.",
  models = DEFAULT_MODELS,
  legendTitle = "Совместимость с моделями",
  columnModel = "Модель",
  columnYears = "Годы выпуска",
  columnFit = "Совместимость",
  columnComment = "Что учесть",
  vinTitle = "Модели нет в списке?",
  vinHint = "Пришлите VIN — сверим крышу и рейлинги по заводской спецификации.",
  vinPlaceholder = "VIN, 17 символов",
  vinCta = "Проверить",
  fitText = FIT_WORD,
  accent,
  background = "",
  className,
  style,
}: Commerce055Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-055-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-055-bg": background,
          // Залипающая колонка обязана быть непрозрачной: под ней проезжает
          // остальная таблица, поэтому она красится в ту же подложку.
          "--vibeui-commerce-055-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-055" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-055"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <p data-part="product">{product}</p>
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <ul data-part="legend">
            {(["yes", "partial", "no"] as Commerce055Fit[]).map((fit) => (
              <li key={fit}>
                <span data-part="mark" data-fit={fit} aria-hidden="true">
                  {FIT_MARK[fit]}
                </span>
                {fitText[fit] ?? FIT_WORD[fit]}
              </li>
            ))}
          </ul>

          <div data-part="scroll" tabIndex={0} role="group" aria-label={title}>
            <table>
              <caption>{legendTitle}</caption>
              <thead>
                <tr>
                  <th scope="col">{columnModel}</th>
                  <th scope="col">{columnYears}</th>
                  <th scope="col">{columnFit}</th>
                  <th scope="col">{columnComment}</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id}>
                    <th scope="row">
                      {model.model}
                      <span>{model.brand}</span>
                    </th>
                    <td>{model.years}</td>
                    <td>
                      <span data-part="fit" data-fit={model.fit}>
                        <span
                          data-part="mark"
                          data-fit={model.fit}
                          aria-hidden="true"
                        >
                          {FIT_MARK[model.fit]}
                        </span>
                        {fitText[model.fit] ?? FIT_WORD[model.fit]}
                      </span>
                    </td>
                    <td data-part="comment">{model.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div data-part="vin">
            <h3>{vinTitle}</h3>
            <p>{vinHint}</p>
            <div data-part="vinrow">
              <label htmlFor="commerce-055-vin" hidden>
                {vinPlaceholder}
              </label>
              <input
                id="commerce-055-vin"
                name="vin"
                type="text"
                placeholder={vinPlaceholder}
                maxLength={17}
              />
              <button type="button" data-part="check">
                {vinCta}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
