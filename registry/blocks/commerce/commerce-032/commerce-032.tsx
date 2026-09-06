import type { CSSProperties } from "react"

export type Commerce032Step = {
  id: string
  title: string
  done: string
}

export type Commerce032Row = {
  label: string
  value: string
}

export type Commerce032Props = {
  title?: string
  current?: number
  steps?: Commerce032Step[]
  total?: string
  cta?: string
  back?: string
  note?: string
  /** Подпись открытого шага: {number} и {total} подставляют номера. */
  stepOfText?: string
  /** Подпись и заголовок кнопки возврата к пройденному шагу. */
  editText?: string
  editLabel?: string
  /** Подписи и значения полей открытого шага. */
  fieldLabels?: Record<string, string>
  fieldValues?: Record<string, string>
  /** Колонка итога: заголовок, подпись для скринридера и строки сводки. */
  summaryTitle?: string
  summaryLabel?: string
  summaryRows?: Commerce032Row[]
  totalLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: оформление в три шага, где пройденные шаги не исчезают, а
// сворачиваются в строку с готовым ответом и кнопкой «Изменить». Текущий шаг
// открыт, будущие закрыты и помечены — так экран остаётся коротким, но
// человек видит, что уже сказал системе. Открытый шаг задаётся числом current,
// поэтому блок серверный: состояние живёт в маршруте, а не в компоненте.
const STYLES = `
:where([data-vibeui-block="commerce-032"]){
--vibeui-commerce-032-bg:transparent;
--vibeui-commerce-032-radius:0;
--vibeui-commerce-032-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-032-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-commerce-032-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-commerce-032-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-032-card:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-commerce-032-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.76 0.14 39.8));
--vibeui-commerce-032-on-accent:oklch(0.15 0.02 39.8);
--vibeui-commerce-032-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-032"]{color-scheme:dark}
[data-vibeui-block="commerce-032"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-032-bg);
border-radius:var(--vibeui-commerce-032-radius);
color:var(--vibeui-commerce-032-fg);font-family:var(--vibeui-commerce-032-sans);
}
[data-vibeui-block="commerce-032"] *{box-sizing:border-box}
[data-vibeui-block="commerce-032"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-032"] h2{margin:0 0 0.875rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-032"] [data-part="grid"]{display:grid;gap:1rem}
@container (min-width: 46rem){
[data-vibeui-block="commerce-032"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) 17rem;align-items:start}
}
[data-vibeui-block="commerce-032"] ol{list-style:none;margin:0;padding:0;display:grid;gap:0.625rem}
[data-vibeui-block="commerce-032"] [data-part="step"]{
border:1px solid var(--vibeui-commerce-032-border);border-radius:1.125rem;overflow:hidden;
background:var(--vibeui-commerce-032-bg);
}
[data-vibeui-block="commerce-032"] [data-part="step"][data-state="open"]{border-color:var(--vibeui-commerce-032-accent)}
[data-vibeui-block="commerce-032"] [data-part="bar"]{
display:flex;align-items:center;gap:0.625rem;padding:0.75rem 0.875rem;
}
/* Форма значка, а не только цвет: состояние шага должно читаться без цвета. */
[data-vibeui-block="commerce-032"] [data-part="mark"]{
flex:0 0 auto;width:1.625rem;height:1.625rem;border-radius:9999px;display:grid;place-items:center;
font-size:0.75rem;font-weight:700;
border:2px solid var(--vibeui-commerce-032-border);color:var(--vibeui-commerce-032-muted);
}
[data-vibeui-block="commerce-032"] [data-part="step"][data-state="done"] [data-part="mark"]{
border-color:var(--vibeui-commerce-032-accent);background:var(--vibeui-commerce-032-accent);color:var(--vibeui-commerce-032-on-accent);
}
[data-vibeui-block="commerce-032"] [data-part="step"][data-state="open"] [data-part="mark"]{
border-color:var(--vibeui-commerce-032-accent);color:var(--vibeui-commerce-032-accent);
box-shadow:inset 0 0 0 3px var(--vibeui-commerce-032-card),inset 0 0 0 6px color-mix(in oklab,var(--vibeui-commerce-032-accent) 35%,transparent);
}
[data-vibeui-block="commerce-032"] [data-part="bar"] h3{margin:0;font-size:0.9375rem;font-weight:650;flex:1 1 auto}
[data-vibeui-block="commerce-032"] [data-part="answer"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-commerce-032-muted);
}
[data-vibeui-block="commerce-032"] [data-part="edit"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0.25rem 0.375rem;border-radius:0.5rem;
color:var(--vibeui-commerce-032-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-032"] [data-part="edit"]:focus-visible{outline:2px solid var(--vibeui-commerce-032-accent);outline-offset:2px}
[data-vibeui-block="commerce-032"] [data-part="summary"]{
padding:0 0.875rem 0.75rem 3.125rem;margin:0;font-size:0.8125rem;color:var(--vibeui-commerce-032-muted);
}
[data-vibeui-block="commerce-032"] [data-part="body"]{
padding:0.25rem 0.875rem 0.875rem;border-top:1px solid var(--vibeui-commerce-032-border);
}
[data-vibeui-block="commerce-032"] [data-part="fields"]{display:grid;gap:0.625rem;margin-top:0.75rem}
@container (min-width: 34rem){
[data-vibeui-block="commerce-032"] [data-part="fields"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="commerce-032"] [data-part="field"]{display:grid;gap:0.25rem}
[data-vibeui-block="commerce-032"] [data-part="field"] span{font-size:0.75rem;font-weight:600;color:var(--vibeui-commerce-032-muted)}
[data-vibeui-block="commerce-032"] input{
width:100%;height:2.5rem;padding:0 0.75rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-032-border);background:var(--vibeui-commerce-032-bg);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="commerce-032"] input:focus-visible{outline:2px solid var(--vibeui-commerce-032-accent);outline-offset:1px}
[data-vibeui-block="commerce-032"] [data-part="aside"]{
border:1px solid var(--vibeui-commerce-032-border);border-radius:1.125rem;padding:0.875rem;
background:var(--vibeui-commerce-032-soft);
}
@container (min-width: 46rem){
[data-vibeui-block="commerce-032"] [data-part="aside"]{position:sticky;top:1rem}
}
[data-vibeui-block="commerce-032"] [data-part="aside"] h3{margin:0 0 0.5rem;font-size:0.8125rem;font-weight:700}
[data-vibeui-block="commerce-032"] dl{margin:0;display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.5rem;font-size:0.8125rem}
[data-vibeui-block="commerce-032"] dl [data-part="row"]{display:contents}
[data-vibeui-block="commerce-032"] dt{color:var(--vibeui-commerce-032-muted)}
[data-vibeui-block="commerce-032"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-032"] [data-part="total"]{
display:flex;justify-content:space-between;align-items:baseline;gap:0.5rem;
margin-top:0.625rem;padding-top:0.625rem;border-top:1px solid var(--vibeui-commerce-032-border);
font-size:1.125rem;font-weight:750;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-032"] [data-part="go"]{
margin-top:0.75rem;width:100%;appearance:none;border:0;cursor:pointer;height:2.875rem;border-radius:0.875rem;
background:var(--vibeui-commerce-032-accent);color:var(--vibeui-commerce-032-on-accent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-032"] [data-part="back"]{
margin-top:0.5rem;width:100%;appearance:none;cursor:pointer;height:2.5rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-032-border);background:var(--vibeui-commerce-032-bg);
color:inherit;font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="commerce-032"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-032"] [data-part="back"]:focus-visible{outline:2px solid var(--vibeui-commerce-032-accent);outline-offset:2px}
[data-vibeui-block="commerce-032"] [data-part="note"]{margin:0.625rem 0 0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-commerce-032-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-032"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Commerce032Step[] = [
  {
    id: "contacts",
    title: "Контакты",
    done: "Анна Смирнова · anna@example.com · +7 921 000-11-22",
  },
  {
    id: "delivery",
    title: "Доставка",
    done: "Курьером 12 марта, 12:00–18:00 · ул. Кирова, 12, кв. 47",
  },
  {
    id: "payment",
    title: "Оплата",
    done: "Картой на сайте",
  },
]

const DEFAULT_FIELD_LABELS: Record<string, string> = {
  street: "Улица и дом",
  flat: "Квартира",
  date: "Дата доставки",
  slot: "Интервал",
}

const DEFAULT_FIELD_VALUES: Record<string, string> = {
  street: "ул. Кирова, 12",
  flat: "47",
  date: "12 марта",
  slot: "12:00–18:00",
}

const DEFAULT_ROWS: Commerce032Row[] = [
  { label: "Товары, 3 шт.", value: "51 015 ₽" },
  { label: "Доставка", value: "490 ₽" },
  { label: "Скидка по промокоду", value: "−0 ₽" },
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
 * Оформление в три шага: пройденные свёрнуты с ответом, открыт только текущий.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce032({
  title = "Оформление заказа",
  current = 2,
  steps = DEFAULT_STEPS,
  total = "51 505 ₽",
  cta = "Дальше к оплате",
  back = "Вернуться в корзину",
  note = "Нажимая кнопку, вы соглашаетесь с условиями продажи и обработкой персональных данных.",
  stepOfText = "— шаг {number} из {total}",
  editText = "Изменить",
  editLabel = "Изменить шаг «{title}»",
  fieldLabels = DEFAULT_FIELD_LABELS,
  fieldValues = DEFAULT_FIELD_VALUES,
  summaryTitle = "Заказ",
  summaryLabel = "Итог заказа",
  summaryRows = DEFAULT_ROWS,
  totalLabel = "К оплате",
  accent,
  background = "",
  className,
  style,
}: Commerce032Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-032-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-032-bg": background,
          "--vibeui-commerce-032-card": background,
          "--vibeui-commerce-032-radius": "1.25rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-032" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-032"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <div data-part="grid">
            <ol>
              {steps.map((step, index) => {
                const number = index + 1
                const state =
                  number < current
                    ? "done"
                    : number === current
                      ? "open"
                      : "wait"

                return (
                  <li key={step.id} data-part="step" data-state={state}>
                    <div data-part="bar">
                      <span data-part="mark" aria-hidden="true">
                        {state === "done" ? "✓" : number}
                      </span>
                      <h3>
                        {step.title}
                        {state === "open" ? (
                          <span data-part="answer">
                            {" "}
                            {stepOfText
                              .replace("{number}", String(number))
                              .replace("{total}", String(steps.length))}
                          </span>
                        ) : null}
                      </h3>
                      {state === "done" ? (
                        <button
                          type="button"
                          data-part="edit"
                          aria-label={editLabel.replace("{title}", step.title)}
                        >
                          {editText}
                        </button>
                      ) : null}
                    </div>

                    {state === "done" ? (
                      <p data-part="summary">{step.done}</p>
                    ) : null}

                    {state === "open" ? (
                      <div data-part="body">
                        <div data-part="fields">
                          {["street", "flat", "date", "slot"].map((key) => (
                            <label data-part="field" key={key}>
                              <span>
                                {fieldLabels[key] ?? DEFAULT_FIELD_LABELS[key]}
                              </span>
                              <input
                                type="text"
                                defaultValue={
                                  fieldValues[key] ?? DEFAULT_FIELD_VALUES[key]
                                }
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ol>

            <aside data-part="aside" aria-label={summaryLabel}>
              <h3>{summaryTitle}</h3>
              <dl>
                {summaryRows.map((row) => (
                  <div key={row.label} data-part="row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p data-part="total">
                <span>{totalLabel}</span>
                <span>{total}</span>
              </p>
              <button type="button" data-part="go">
                {cta}
              </button>
              <button type="button" data-part="back">
                {back}
              </button>
              <p data-part="note">{note}</p>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
