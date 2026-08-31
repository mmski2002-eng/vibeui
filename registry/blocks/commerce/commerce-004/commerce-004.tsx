import type { CSSProperties } from "react"

export type Commerce004Step = {
  label: string
  state?: "done" | "current" | "next"
}

export type Commerce004Props = {
  title?: string
  steps?: Commerce004Step[]
  methods?: { label: string; hint: string; value: string }[]
  summary?: { label: string; value: string }[]
  total?: string
  cta?: string
  note?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: шаг оформления заказа. Способ доставки — радиогруппа в fieldset,
// поэтому вопрос объявляется до вариантов, а выбор одного из них держит
// браузер. Итог показан рядом с формой и не уезжает вверх при заполнении:
// на этом экране пользователь сверяет сумму чаще, чем читает поля. Кнопка
// оплаты подписана суммой — «Оплатить» без числа заставляет прокручивать назад.
const STYLES = `
:where([data-vibeui-block="commerce-004"]){
--vibeui-commerce-004-bg:oklch(1 0 0);
--vibeui-commerce-004-panel:oklch(0.985 0.002 265);
--vibeui-commerce-004-fg:oklch(0.22 0.014 265);
--vibeui-commerce-004-muted:oklch(0.55 0.014 265);
--vibeui-commerce-004-border:oklch(0.91 0.006 265);
--vibeui-commerce-004-accent:oklch(0.55 0.2 262);
--vibeui-commerce-004-done:oklch(0.58 0.14 152);
--vibeui-commerce-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-004"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-commerce-004-bg);
font-family:var(--vibeui-commerce-004-sans);color:var(--vibeui-commerce-004-fg);
}
[data-vibeui-block="commerce-004"] *{box-sizing:border-box}
[data-vibeui-block="commerce-004"] h2{margin:0 0 0.75rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em}
/* Шаги: пройденное отмечено галочкой, текущее — кольцом, а не одним цветом. */
[data-vibeui-block="commerce-004"] [data-part="steps"]{
display:flex;flex-wrap:wrap;gap:0.75rem;margin:0 0 1rem;padding:0;list-style:none;
}
[data-vibeui-block="commerce-004"] [data-part="step"]{
display:flex;align-items:center;gap:0.375rem;
font-size:0.75rem;color:var(--vibeui-commerce-004-muted);
}
[data-vibeui-block="commerce-004"] [data-part="mark"]{
display:inline-flex;align-items:center;justify-content:center;
width:1.125rem;height:1.125rem;border-radius:9999px;
box-shadow:inset 0 0 0 1.5px var(--vibeui-commerce-004-border);
font-size:0.625rem;line-height:1;
}
[data-vibeui-block="commerce-004"] [data-state="done"]{color:var(--vibeui-commerce-004-fg)}
[data-vibeui-block="commerce-004"] [data-state="done"] [data-part="mark"]{
background:var(--vibeui-commerce-004-done);color:oklch(1 0 0);box-shadow:none;
}
[data-vibeui-block="commerce-004"] [data-state="current"]{color:var(--vibeui-commerce-004-fg);font-weight:650}
[data-vibeui-block="commerce-004"] [data-state="current"] [data-part="mark"]{box-shadow:inset 0 0 0 3px var(--vibeui-commerce-004-accent)}
[data-vibeui-block="commerce-004"] [data-part="layout"]{display:grid;grid-template-columns:1fr;gap:1rem;align-items:start}
@container (min-width: 42rem){
[data-vibeui-block="commerce-004"] [data-part="layout"]{grid-template-columns:1fr 15rem}
}
[data-vibeui-block="commerce-004"] fieldset{margin:0 0 0.875rem;padding:0;border:0}
[data-vibeui-block="commerce-004"] legend{padding:0;margin-bottom:0.5rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="commerce-004"] [data-part="method"]{
display:flex;align-items:flex-start;gap:0.625rem;cursor:pointer;
padding:0.625rem 0.75rem;margin-bottom:0.375rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-004-border);
}
[data-vibeui-block="commerce-004"] [data-part="method"]:has(input:checked){
border-color:var(--vibeui-commerce-004-accent);background:oklch(0.55 0.2 262 / 6%);
}
[data-vibeui-block="commerce-004"] input[type="radio"]{
appearance:none;flex:none;margin:0.125rem 0 0;cursor:pointer;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
border:1.5px solid var(--vibeui-commerce-004-muted);background:var(--vibeui-commerce-004-bg);
}
[data-vibeui-block="commerce-004"] input[type="radio"]:checked{border-color:var(--vibeui-commerce-004-accent);border-width:5px}
[data-vibeui-block="commerce-004"] input:focus-visible{outline:2px solid var(--vibeui-commerce-004-accent);outline-offset:2px}
[data-vibeui-block="commerce-004"] [data-part="mlabel"]{display:flex;flex-direction:column;gap:0.125rem;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="commerce-004"] [data-part="mhint"]{font-size:0.75rem;font-weight:400;color:var(--vibeui-commerce-004-muted)}
[data-vibeui-block="commerce-004"] [data-part="fields"]{display:grid;grid-template-columns:1fr;gap:0.5rem}
@container (min-width: 30rem){
[data-vibeui-block="commerce-004"] [data-part="fields"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="commerce-004"] [data-wide="true"]{grid-column:1 / -1}
}
[data-vibeui-block="commerce-004"] label[data-part="field"]{display:flex;flex-direction:column;gap:0.25rem;font-size:0.75rem;font-weight:600}
[data-vibeui-block="commerce-004"] input[type="text"]{
height:2.25rem;padding:0 0.625rem;
border:1px solid var(--vibeui-commerce-004-border);border-radius:0.5rem;
background:var(--vibeui-commerce-004-bg);color:inherit;font:inherit;font-size:0.8125rem;font-weight:400;
}
[data-vibeui-block="commerce-004"] input[type="text"]:focus-visible{outline:2px solid var(--vibeui-commerce-004-accent);outline-offset:1px}
/* Итог рядом с формой: на этом экране сумму сверяют чаще, чем читают поля. */
[data-vibeui-block="commerce-004"] [data-part="summary"]{
padding:0.875rem;border-radius:0.875rem;
background:var(--vibeui-commerce-004-panel);
border:1px solid var(--vibeui-commerce-004-border);
}
[data-vibeui-block="commerce-004"] dl{display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.75rem;margin:0 0 0.625rem;font-size:0.8125rem}
[data-vibeui-block="commerce-004"] [data-part="row"]{display:contents}
[data-vibeui-block="commerce-004"] dt{color:var(--vibeui-commerce-004-muted)}
[data-vibeui-block="commerce-004"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-004"] [data-part="grand"]{font-size:1.0625rem;font-weight:700}
[data-vibeui-block="commerce-004"] [data-part="pay"]{
width:100%;appearance:none;cursor:pointer;height:2.5rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-commerce-004-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-004"] [data-part="pay"]:focus-visible{outline:2px solid var(--vibeui-commerce-004-accent);outline-offset:2px}
[data-vibeui-block="commerce-004"] [data-part="note"]{margin:0.5rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-004-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Commerce004Step[] = [
  { label: "Корзина", state: "done" },
  { label: "Доставка", state: "current" },
  { label: "Оплата", state: "next" },
]

const DEFAULT_METHODS = [
  {
    value: "courier",
    label: "Курьером завтра",
    hint: "С 10:00 до 22:00, звонок за час — 490 ₽",
  },
  {
    value: "pickup",
    label: "Пункт выдачи сегодня",
    hint: "Восемь пунктов рядом, хранение 5 дней — бесплатно",
  },
  {
    value: "post",
    label: "Почтой 3–7 дней",
    hint: "Отправка в день сборки — 350 ₽",
  },
]

const DEFAULT_SUMMARY = [
  { label: "Товары, 3 шт.", value: "15 200 ₽" },
  { label: "Доставка", value: "490 ₽" },
  { label: "Скидка по купону", value: "−1 000 ₽" },
]

/**
 * Шаг оформления заказа: способ доставки радиогруппой, итог рядом с формой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce004({
  title = "Оформление заказа",
  steps = DEFAULT_STEPS,
  methods = DEFAULT_METHODS,
  summary = DEFAULT_SUMMARY,
  total = "14 690 ₽",
  cta = "Перейти к оплате",
  note = "Нажимая кнопку, вы соглашаетесь с условиями продажи и политикой обработки данных.",
  accent,
  className,
  style,
}: Commerce004Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-004"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>

        <ol data-part="steps">
          {steps.map((step) => (
            <li
              key={step.label}
              data-part="step"
              data-state={step.state ?? "next"}
              aria-current={step.state === "current" ? "step" : undefined}
            >
              <span data-part="mark" aria-hidden="true">
                {step.state === "done" ? "✓" : null}
              </span>
              {step.label}
            </li>
          ))}
        </ol>

        <div data-part="layout">
          <form>
            <fieldset>
              <legend>Способ доставки</legend>
              {methods.map((method, index) => (
                <label key={method.value} data-part="method">
                  <input
                    type="radio"
                    name="vibeui-commerce-004-method"
                    value={method.value}
                    defaultChecked={index === 0}
                  />
                  <span data-part="mlabel">
                    {method.label}
                    <span data-part="mhint">{method.hint}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>Адрес</legend>
              <div data-part="fields">
                <label data-part="field">
                  Город
                  <input type="text" defaultValue="Москва" />
                </label>
                <label data-part="field">
                  Улица и дом
                  <input type="text" defaultValue="Тверская, 12" />
                </label>
                <label data-part="field">
                  Квартира
                  <input type="text" defaultValue="48" />
                </label>
                <label data-part="field">
                  Телефон
                  <input type="text" defaultValue="+7 999 123-45-67" />
                </label>
                <label data-part="field" data-wide="true">
                  Комментарий курьеру
                  <input type="text" defaultValue="Код домофона 48В" />
                </label>
              </div>
            </fieldset>
          </form>

          <aside data-part="summary" aria-label="Итог заказа">
            <dl>
              {summary.map((row) => (
                <div key={row.label} data-part="row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
              <dt data-part="grand">К оплате</dt>
              <dd data-part="grand">{total}</dd>
            </dl>
            <button type="button" data-part="pay">
              {cta} · {total}
            </button>
            <p data-part="note">{note}</p>
          </aside>
        </div>
      </section>
    </>
  )
}
