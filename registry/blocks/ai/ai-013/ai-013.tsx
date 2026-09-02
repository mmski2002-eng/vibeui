import type { CSSProperties } from "react"

export type Ai013Props = {
  title?: string
  answer?: string
  question?: string
  /** Вопрос над парой кнопок оценки. */
  voteLegend?: string
  upLabel?: string
  downLabel?: string
  reasons?: string[]
  /** Заголовок списка причин. */
  reasonsLegend?: string
  commentLabel?: string
  commentPlaceholder?: string
  submitLabel?: string
  privacyNote?: string
  name?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: оценка ответа, которая не заканчивается на пальце вниз.
// Голая пара «нравится / не нравится» даёт цифру и ноль пользы: непонятно,
// что именно сломалось. Поэтому отрицательная оценка раскрывает причины
// списком и поле для двух фраз.
//
// Раскрытие сделано на :has() без JS: подробности показываются, когда в
// группе выбран вариант с data-vote="down". Скрытая часть убрана
// display:none, а не прозрачностью, — иначе её поля остаются в порядке
// обхода Tab и ловят фокус в пустоту. Причины — чекбоксы, а не радио:
// у плохого ответа обычно несколько бед сразу.
const STYLES = `
:where([data-vibeui-block="ai-013"]){
--vibeui-ai-013-bg:transparent;
--vibeui-ai-013-soft:light-dark(oklch(0.975 0.004 265),oklch(0.26 0.012 265));
--vibeui-ai-013-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-ai-013-muted:light-dark(oklch(0.53 0.014 265),oklch(0.7 0.012 265));
--vibeui-ai-013-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-ai-013-accent:light-dark(oklch(0.52 0.17 268),oklch(0.74 0.14 268));
--vibeui-ai-013-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.03 268));
--vibeui-ai-013-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-013"]{
background:var(--vibeui-ai-013-bg);color:var(--vibeui-ai-013-fg);
font-family:var(--vibeui-ai-013-sans);
border:1px solid var(--vibeui-ai-013-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-013"] *{box-sizing:border-box}
[data-vibeui-block="ai-013"] [data-part="shell"]{padding:1.25rem;display:grid;gap:0.9375rem}
[data-vibeui-block="ai-013"] h2{margin:0;font-size:0.75rem;font-weight:650;letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-ai-013-muted)}
[data-vibeui-block="ai-013"] [data-part="question"]{
margin:0.375rem 0 0.5rem;font-size:0.75rem;color:var(--vibeui-ai-013-muted);
}
[data-vibeui-block="ai-013"] [data-part="answer"]{
margin:0;padding:0.875rem 1rem;border-radius:0.9375rem;
background:var(--vibeui-ai-013-soft);border:1px solid var(--vibeui-ai-013-border);
font-size:0.875rem;line-height:1.65;max-width:66ch;
}
[data-vibeui-block="ai-013"] form{display:grid;gap:0.875rem}
[data-vibeui-block="ai-013"] fieldset{margin:0;padding:0;border:0;display:grid;gap:0.5rem}
[data-vibeui-block="ai-013"] legend{padding:0;font-size:0.8125rem;font-weight:640}
[data-vibeui-block="ai-013"] [data-part="votes"]{display:flex;flex-wrap:wrap;gap:0.5rem;clear:both}
[data-vibeui-block="ai-013"] [data-part="vote"]{
display:inline-flex;align-items:center;gap:0.4375rem;cursor:pointer;
height:2.25rem;padding:0 0.875rem;border-radius:0.75rem;
border:1px solid var(--vibeui-ai-013-border);background:var(--vibeui-ai-013-soft);
font-size:0.8125rem;font-weight:620;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="ai-013"] [data-part="vote"]:has(input:checked){
color:var(--vibeui-ai-013-accent);
border-color:var(--vibeui-ai-013-accent);
background:color-mix(in oklab,var(--vibeui-ai-013-accent) 9%,var(--vibeui-ai-013-bg));
}
[data-vibeui-block="ai-013"] [data-part="vote"]:has(input:focus-visible){outline:2px solid var(--vibeui-ai-013-accent);outline-offset:2px}
[data-vibeui-block="ai-013"] input[type="radio"],
[data-vibeui-block="ai-013"] input[type="checkbox"]{
width:0.875rem;height:0.875rem;margin:0;accent-color:var(--vibeui-ai-013-accent);
}
/* Подробности убраны display:none: прозрачные поля ловили бы Tab в пустоту. */
[data-vibeui-block="ai-013"] [data-part="detail"]{display:none}
[data-vibeui-block="ai-013"] form:has([data-vote="down"]:checked) [data-part="detail"]{display:grid;gap:0.75rem}
[data-vibeui-block="ai-013"] [data-part="reasons"]{display:grid;gap:0.375rem;clear:both}
[data-vibeui-block="ai-013"] [data-part="reason"]{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.4375rem 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-ai-013-border);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="ai-013"] [data-part="reason"]:has(input:checked){
border-color:color-mix(in oklab,var(--vibeui-ai-013-accent) 50%,var(--vibeui-ai-013-border));
background:color-mix(in oklab,var(--vibeui-ai-013-accent) 6%,var(--vibeui-ai-013-bg));
}
[data-vibeui-block="ai-013"] label[for]{display:block;font-size:0.8125rem;font-weight:640;margin-bottom:0.375rem}
[data-vibeui-block="ai-013"] textarea{
width:100%;min-height:4.5rem;resize:vertical;padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-ai-013-border);border-radius:0.75rem;
background:var(--vibeui-ai-013-soft);color:inherit;
font:inherit;font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="ai-013"] [data-part="foot"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem}
[data-vibeui-block="ai-013"] button{
appearance:none;cursor:pointer;border:0;
height:2.25rem;padding:0 1rem;border-radius:0.75rem;
background:var(--vibeui-ai-013-accent);color:var(--vibeui-ai-013-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="ai-013"] [data-part="privacy"]{
margin:0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-ai-013-muted);max-width:46ch;
}
[data-vibeui-block="ai-013"] :focus-visible{outline:2px solid var(--vibeui-ai-013-accent);outline-offset:2px}
@container (min-width: 40rem){
[data-vibeui-block="ai-013"] [data-part="shell"]{padding:1.5rem 1.75rem}
[data-vibeui-block="ai-013"] [data-part="reasons"]{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_REASONS = [
  "Ответ не по вопросу",
  "Есть выдуманные факты",
  "Слишком длинно",
  "Не хватает деталей",
  "Плохой русский язык",
  "Нарушает правила",
]

const DEFAULT_ANSWER =
  "Для трёх планов с годовой скидкой подойдёт pricing-001: переключатель периода стоит над карточками, поэтому обе цены видно сразу. Блок ставится одной командой и не тянет зависимостей."

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
 * Оценка ответа: отрицательная раскрывает причины и поле комментария.
 * Один файл, ноль зависимостей, раскрытие на :has() без JS.
 */
export function Ai013({
  title = "Оценка ответа",
  answer = DEFAULT_ANSWER,
  question = "Вопрос: какой блок взять для страницы тарифов?",
  voteLegend = "Ответ оказался полезным?",
  upLabel = "Помог",
  downLabel = "Не помог",
  reasons = DEFAULT_REASONS,
  reasonsLegend = "Что именно не так",
  commentLabel = "Что пошло не так",
  commentPlaceholder = "Одной-двумя фразами: чего не хватило в ответе",
  submitLabel = "Отправить оценку",
  privacyNote = "Оценка уходит вместе с этим ответом. Текст запроса и файлы не передаются.",
  name = "ai-013-vote",
  accent,
  background = "",
  className,
  style,
}: Ai013Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-013"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="question">{question}</p>
            <p data-part="answer">{answer}</p>
          </div>

          <form>
            <fieldset>
              <legend>{voteLegend}</legend>
              <div data-part="votes">
                <label data-part="vote">
                  <input type="radio" name={name} value="up" data-vote="up" />
                  {upLabel}
                </label>
                <label data-part="vote">
                  <input
                    type="radio"
                    name={name}
                    value="down"
                    data-vote="down"
                  />
                  {downLabel}
                </label>
              </div>
            </fieldset>

            <div data-part="detail">
              <fieldset>
                <legend>{reasonsLegend}</legend>
                <div data-part="reasons">
                  {reasons.map((reason) => (
                    <label key={reason} data-part="reason">
                      <input
                        type="checkbox"
                        name="ai-013-reason"
                        value={reason}
                      />
                      {reason}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="ai-013-comment">{commentLabel}</label>
                <textarea
                  id="ai-013-comment"
                  name="ai-013-comment"
                  placeholder={commentPlaceholder}
                />
              </div>
            </div>

            <div data-part="foot">
              <button type="submit">{submitLabel}</button>
              <p data-part="privacy">{privacyNote}</p>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
