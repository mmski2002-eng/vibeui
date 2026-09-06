import type { CSSProperties } from "react"

export type Ai008Variant = {
  id: string
  label: string
  model: string
  answer: string
  facts?: string[]
  latency?: string
  cost?: string
}

export type Ai008Props = {
  title?: string
  question?: string
  variants?: [Ai008Variant, Ai008Variant]
  chooseLabel?: string
  name?: string
  footnote?: string
  /** Подпись радиогруппы над колонками. */
  legend?: string
  /** Подписи метрик: {value} подставляется значением из варианта. */
  statText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: два ответа рядом и один вопрос — какой лучше. Выбор сделан
// радиокнопками внутри <label>, обёрнутого вокруг всей колонки: попасть в
// ответ можно кликом в любое место карточки, а с клавиатуры группа
// проходится стрелками, как и положено радиогруппе. Клиентского JS нет.
//
// Сама радиокнопка не спрятана display:none — так она выпала бы из фокуса.
// Она визуально уменьшена и подсвечена, а состояние колонки читается через
// :has(input:checked) на подписи.
//
// Колонки становятся рядом только на широком блоке: на узком два столбца
// текста по 30 символов сравнивать невозможно.
//
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="ai-008"]){
--vibeui-ai-008-bg:transparent;
--vibeui-ai-008-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-ai-008-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-ai-008-muted:light-dark(oklch(0.53 0 265),oklch(0.69 0 265));
--vibeui-ai-008-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-ai-008-accent:light-dark(oklch(0.52 0.18 254),oklch(0.72 0.16 254));
--vibeui-ai-008-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 254));
--vibeui-ai-008-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-008"]{color-scheme:dark}
[data-vibeui-block="ai-008"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-ai-008-bg);color:var(--vibeui-ai-008-fg);
font-family:var(--vibeui-ai-008-sans);
border:1px solid var(--vibeui-ai-008-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-008"] *{box-sizing:border-box}
[data-vibeui-block="ai-008"] [data-part="shell"]{padding:1.25rem;display:grid;gap:1rem}
[data-vibeui-block="ai-008"] h2{margin:0;font-size:0.875rem;font-weight:680}
[data-vibeui-block="ai-008"] [data-part="question"]{
margin:0.3125rem 0 0;padding:0.625rem 0.8125rem;border-radius:0.75rem;
background:var(--vibeui-ai-008-card);border:1px solid var(--vibeui-ai-008-border);
font-size:0.8125rem;line-height:1.55;
}
[data-vibeui-block="ai-008"] fieldset{margin:0;padding:0;border:0;display:grid;gap:0.75rem}
[data-vibeui-block="ai-008"] legend{
padding:0;font-size:0.6875rem;font-weight:650;
letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-ai-008-muted);
}
/* Вся колонка — подпись радиокнопки: попасть можно кликом куда угодно. */
[data-vibeui-block="ai-008"] [data-part="option"]{
display:grid;gap:0.5rem;cursor:pointer;
padding:0.875rem 0.9375rem;border-radius:1rem;
border:1px solid var(--vibeui-ai-008-border);background:var(--vibeui-ai-008-card);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="ai-008"] [data-part="option"]:has(input:checked){
border-color:var(--vibeui-ai-008-accent);
box-shadow:0 0 0 1px var(--vibeui-ai-008-accent) inset;
}
[data-vibeui-block="ai-008"] [data-part="option"]:has(input:focus-visible){
outline:2px solid var(--vibeui-ai-008-accent);outline-offset:2px;
}
[data-vibeui-block="ai-008"] [data-part="option-head"]{display:flex;align-items:center;gap:0.5rem}
/* Радиокнопка уменьшена, но не спрятана: display:none выбил бы её из фокуса. */
[data-vibeui-block="ai-008"] input[type="radio"]{
flex:none;width:0.9375rem;height:0.9375rem;margin:0;accent-color:var(--vibeui-ai-008-accent);
}
[data-vibeui-block="ai-008"] [data-part="label"]{font-size:0.8125rem;font-weight:660}
[data-vibeui-block="ai-008"] [data-part="model"]{
margin-left:auto;font-size:0.6875rem;color:var(--vibeui-ai-008-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-008"] [data-part="answer"]{
margin:0;font-size:0.8125rem;line-height:1.65;color:var(--vibeui-ai-008-fg);
}
[data-vibeui-block="ai-008"] [data-part="facts"]{
list-style:none;margin:0;padding:0;display:grid;gap:0.25rem;
}
[data-vibeui-block="ai-008"] [data-part="facts"] li{
display:flex;gap:0.4375rem;font-size:0.75rem;line-height:1.5;color:var(--vibeui-ai-008-muted);
}
[data-vibeui-block="ai-008"] [data-part="facts"] li::before{
content:"";flex:none;width:0.3125rem;height:0.3125rem;margin-top:0.4375rem;
border-radius:9999px;background:var(--vibeui-ai-008-accent);
}
[data-vibeui-block="ai-008"] [data-part="stats"]{
display:flex;flex-wrap:wrap;gap:0.75rem;padding-top:0.4375rem;
border-top:1px dashed var(--vibeui-ai-008-border);
font-size:0.6875rem;color:var(--vibeui-ai-008-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-008"] [data-part="foot"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem}
[data-vibeui-block="ai-008"] button{
appearance:none;cursor:pointer;border:0;
height:2.25rem;padding:0 1rem;border-radius:0.75rem;
background:var(--vibeui-ai-008-accent);color:var(--vibeui-ai-008-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="ai-008"] [data-part="note"]{
margin:0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-ai-008-muted);
}
[data-vibeui-block="ai-008"] button:focus-visible{outline:2px solid var(--vibeui-ai-008-accent);outline-offset:2px}
@container (min-width: 44rem){
[data-vibeui-block="ai-008"] [data-part="shell"]{padding:1.5rem 1.75rem}
[data-vibeui-block="ai-008"] [data-part="grid"]{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VARIANTS: [Ai008Variant, Ai008Variant] = [
  {
    id: "a",
    label: "Вариант A",
    model: "Быстрая модель",
    answer:
      "Возьмите pricing-001: три плана, годовая скидка переключателем и сноска про НДС. Блок без зависимостей, ставится одной командой.",
    facts: [
      "Назван конкретный блок каталога",
      "Упомянут способ установки",
      "Нет объяснения, почему именно этот блок",
    ],
    latency: "1,2 с",
    cost: "410 токенов",
  },
  {
    id: "b",
    label: "Вариант B",
    model: "Точная модель",
    answer:
      "Для трёх планов с годовой скидкой подходит pricing-001: переключатель периода стоит над карточками, поэтому обе цены видно сразу и не нужно уходить со страницы. Если планов станет больше четырёх, лучше pricing-003 с таблицей сравнения.",
    facts: [
      "Объяснено, почему блок подходит",
      "Дан запасной вариант на случай роста",
      "Ответ длиннее и читается дольше",
    ],
    latency: "3,8 с",
    cost: "980 токенов",
  },
]

const DEFAULT_STAT_TEXT: Record<string, string> = {
  latency: "Ответ: {value}",
  cost: "Расход: {value}",
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
 * Сравнение двух ответов модели с выбором лучшего радиогруппой.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Ai008({
  title = "Какой ответ лучше?",
  question = "Какой блок взять для страницы тарифов с тремя планами и годовой скидкой?",
  variants = DEFAULT_VARIANTS,
  chooseLabel = "Сохранить выбор",
  name = "ai-008-answer",
  footnote = "Выбор уходит в обучающую выборку без текста вашего запроса.",
  legend = "Ответы на один и тот же запрос",
  statText = DEFAULT_STAT_TEXT,
  accent,
  background = "",
  className,
  style,
}: Ai008Props) {
  const stat = (key: string, value: string) =>
    (statText[key] ?? DEFAULT_STAT_TEXT[key]).replace("{value}", value)

  const palette = {
    ...(accent ? { "--vibeui-ai-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-008"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header>
            <h2>{title}</h2>
            <p data-part="question">{question}</p>
          </header>

          <fieldset>
            <legend>{legend}</legend>
            <form data-part="grid">
              {variants.map((variant) => (
                <label key={variant.id} data-part="option">
                  <span data-part="option-head">
                    <input
                      type="radio"
                      name={name}
                      value={variant.id}
                      defaultChecked={variant.id === variants[0].id}
                    />
                    <span data-part="label">{variant.label}</span>
                    <span data-part="model">{variant.model}</span>
                  </span>
                  <p data-part="answer">{variant.answer}</p>
                  {variant.facts?.length ? (
                    <ul data-part="facts">
                      {variant.facts.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                  ) : null}
                  <span data-part="stats">
                    {variant.latency ? (
                      <span>{stat("latency", variant.latency)}</span>
                    ) : null}
                    {variant.cost ? (
                      <span>{stat("cost", variant.cost)}</span>
                    ) : null}
                  </span>
                </label>
              ))}
            </form>
          </fieldset>

          <div data-part="foot">
            <button type="button">{chooseLabel}</button>
            <p data-part="note">{footnote}</p>
          </div>
        </div>
      </section>
    </>
  )
}
