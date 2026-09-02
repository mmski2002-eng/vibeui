import type { CSSProperties } from "react"

export type Commerce044Answer = {
  author: string
  role: "seller" | "buyer"
  date: string
  text: string
  helpful: number
}

export type Commerce044Question = {
  id: string
  text: string
  author: string
  date: string
  answers: Commerce044Answer[]
  open?: boolean
}

export type Commerce044Props = {
  title?: string
  lead?: string
  questions?: Commerce044Question[]
  askTitle?: string
  askPlaceholder?: string
  askHint?: string
  cta?: string
  /** Ярлык роли: ключи seller и buyer. */
  roleText?: Record<string, string>
  /** Число ответов: ключи one и many, внутри — {count}. */
  answersText?: Record<string, string>
  /** Кнопка полезности: {count} — сколько отметили. */
  voteText?: string
  /** Подпись кнопки для читалки: {author} — автор ответа. */
  voteAriaText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: вопросы о товаре, где ответ продавца и ответ покупателя
// помечены по-разному. Один и тот же текст «да, подойдёт» весит разное в
// зависимости от того, кто его написал. Ветки сложены в нативный details:
// список вопросов должен читаться целиком, а разворачивается только нужный.
// Открытым оставлен первый — иначе экран выглядит пустым списком строк.
const STYLES = `
:where([data-vibeui-block="commerce-044"]){
--vibeui-commerce-044-bg:transparent;
--vibeui-commerce-044-fg:light-dark(oklch(0.21 0.014 265),oklch(0.93 0.006 265));
--vibeui-commerce-044-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-commerce-044-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-commerce-044-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.009 265));
--vibeui-commerce-044-accent:light-dark(oklch(0.5 0.14 265),oklch(0.74 0.13 265));
--vibeui-commerce-044-onaccent:light-dark(oklch(1 0 0),oklch(0.18 0.02 265));
--vibeui-commerce-044-seller:light-dark(oklch(0.5 0.13 155),oklch(0.76 0.13 155));
--vibeui-commerce-044-onseller:light-dark(oklch(1 0 0),oklch(0.18 0.02 155));
--vibeui-commerce-044-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-044"]{
box-sizing:border-box;background:var(--vibeui-commerce-044-bg);
color:var(--vibeui-commerce-044-fg);font-family:var(--vibeui-commerce-044-sans);
}
[data-vibeui-block="commerce-044"] *{box-sizing:border-box}
[data-vibeui-block="commerce-044"] [data-part="shell"]{max-width:48rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-044"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-044"] [data-part="lead"]{margin:0 0 1rem;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-044-muted)}
[data-vibeui-block="commerce-044"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="commerce-044"] details{
border:1px solid var(--vibeui-commerce-044-border);border-radius:1rem;overflow:hidden;
background:var(--vibeui-commerce-044-bg);
}
[data-vibeui-block="commerce-044"] details[open]{border-color:color-mix(in oklab,var(--vibeui-commerce-044-accent) 40%,var(--vibeui-commerce-044-border))}
[data-vibeui-block="commerce-044"] summary{
cursor:pointer;list-style:none;padding:0.75rem 0.875rem;display:grid;gap:0.25rem;
}
[data-vibeui-block="commerce-044"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="commerce-044"] summary:focus-visible{outline:2px solid var(--vibeui-commerce-044-accent);outline-offset:-2px}
[data-vibeui-block="commerce-044"] [data-part="q"]{
font-size:0.9375rem;font-weight:650;line-height:1.4;
display:grid;grid-template-columns:1.25rem minmax(0,1fr);gap:0.5rem;
}
[data-vibeui-block="commerce-044"] [data-part="q"] i{
font-style:normal;font-weight:800;color:var(--vibeui-commerce-044-accent);
}
[data-vibeui-block="commerce-044"] [data-part="qmeta"]{
padding-left:1.75rem;font-size:0.6875rem;color:var(--vibeui-commerce-044-muted);
display:flex;flex-wrap:wrap;gap:0.5rem;
}
[data-vibeui-block="commerce-044"] [data-part="count"]{font-weight:650;color:var(--vibeui-commerce-044-accent)}
[data-vibeui-block="commerce-044"] [data-part="answers"]{
padding:0 0.875rem 0.875rem 0.875rem;display:grid;gap:0.5rem;
}
[data-vibeui-block="commerce-044"] [data-part="answer"]{
padding:0.625rem 0.75rem;border-radius:0.875rem;background:var(--vibeui-commerce-044-soft);
}
/* Ответ продавца помечен отдельно: тот же текст от продавца весит иначе. */
[data-vibeui-block="commerce-044"] [data-part="answer"][data-role="seller"]{
background:color-mix(in oklab,var(--vibeui-commerce-044-seller) 8%,transparent);
border-left:3px solid var(--vibeui-commerce-044-seller);
}
[data-vibeui-block="commerce-044"] [data-part="who"]{
margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:0.4375rem;font-size:0.75rem;
}
[data-vibeui-block="commerce-044"] [data-part="who"] b{font-weight:650}
[data-vibeui-block="commerce-044"] [data-part="badge"]{
padding:0.0625rem 0.375rem;border-radius:0.375rem;font-size:0.625rem;font-weight:700;
background:var(--vibeui-commerce-044-seller);color:var(--vibeui-commerce-044-onseller);
}
[data-vibeui-block="commerce-044"] [data-part="badge"][data-role="buyer"]{
background:var(--vibeui-commerce-044-border);color:var(--vibeui-commerce-044-muted);
}
[data-vibeui-block="commerce-044"] [data-part="when"]{color:var(--vibeui-commerce-044-muted)}
[data-vibeui-block="commerce-044"] [data-part="text"]{margin:0.3125rem 0 0;font-size:0.875rem;line-height:1.55}
[data-vibeui-block="commerce-044"] [data-part="vote"]{
margin-top:0.4375rem;appearance:none;cursor:pointer;padding:0.25rem 0.625rem;border-radius:9999px;
border:1px solid var(--vibeui-commerce-044-border);background:var(--vibeui-commerce-044-bg);
color:var(--vibeui-commerce-044-muted);font:inherit;font-size:0.6875rem;font-weight:600;
}
[data-vibeui-block="commerce-044"] [data-part="vote"]:focus-visible{outline:2px solid var(--vibeui-commerce-044-accent);outline-offset:2px}
[data-vibeui-block="commerce-044"] [data-part="ask"]{
margin-top:1rem;padding:0.875rem;border-radius:1.125rem;border:1px dashed var(--vibeui-commerce-044-border);
}
[data-vibeui-block="commerce-044"] h3{margin:0 0 0.5rem;font-size:0.875rem;font-weight:700}
[data-vibeui-block="commerce-044"] textarea{
width:100%;min-height:4.5rem;resize:vertical;padding:0.625rem 0.75rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-044-border);background:var(--vibeui-commerce-044-bg);
color:inherit;font:inherit;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="commerce-044"] textarea:focus-visible{outline:2px solid var(--vibeui-commerce-044-accent);outline-offset:1px}
[data-vibeui-block="commerce-044"] [data-part="foot"]{
margin-top:0.625rem;display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;justify-content:space-between;
}
[data-vibeui-block="commerce-044"] [data-part="hint"]{margin:0;max-width:24rem;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-commerce-044-muted)}
[data-vibeui-block="commerce-044"] [data-part="cta"]{
appearance:none;border:0;cursor:pointer;height:2.5rem;padding:0 1.25rem;border-radius:0.875rem;
background:var(--vibeui-commerce-044-accent);color:var(--vibeui-commerce-044-onaccent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-044"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-044-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-044"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_QUESTIONS: Commerce044Question[] = [
  {
    id: "q1",
    text: "Абажур снимается? Хочу постирать его отдельно.",
    author: "Игорь",
    date: "2 марта",
    open: true,
    answers: [
      {
        author: "Хмарь",
        role: "seller",
        date: "2 марта",
        text: "Да, абажур держится на кольце и снимается без инструментов. Стирать нельзя — только сухая чистка щёткой, иначе лён садится и перестаёт сидеть на каркасе.",
        helpful: 24,
      },
      {
        author: "Марина К.",
        role: "buyer",
        date: "4 марта",
        text: "Снимала, чтобы протереть. Кольцо тугое первые пару раз, дальше идёт легко.",
        helpful: 9,
      },
    ],
  },
  {
    id: "q2",
    text: "Подойдёт лампочка E27 на 10 Вт или будет греться?",
    author: "Ольга",
    date: "27 февраля",
    answers: [
      {
        author: "Хмарь",
        role: "seller",
        date: "27 февраля",
        text: "Цоколь E27, ограничение — 15 Вт для светодиодных ламп. С лампой накаливания больше 40 Вт абажур перегревается, мы такие не рекомендуем.",
        helpful: 31,
      },
    ],
  },
  {
    id: "q3",
    text: "Какая длина шнура и где выключатель?",
    author: "Дмитрий",
    date: "19 февраля",
    answers: [
      {
        author: "Хмарь",
        role: "seller",
        date: "20 февраля",
        text: "Шнур 1,8 метра, выключатель на шнуре в 40 см от вилки — до него дотягиваешься сидя в кресле.",
        helpful: 12,
      },
    ],
  },
]

const DEFAULT_ROLE: Record<string, string> = {
  seller: "продавец",
  buyer: "купил товар",
}

const DEFAULT_ANSWERS_TEXT: Record<string, string> = {
  one: "{count} ответ",
  many: "{count} ответа",
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
 * Вопросы о товаре: ответы продавца и покупателей помечены по-разному, ветки в details.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce044({
  title = "Вопросы о товаре",
  lead = "Отвечает продавец и покупатели, которые уже получили заказ. Ответ приходит на почту в течение суток.",
  questions = DEFAULT_QUESTIONS,
  askTitle = "Спросить о товаре",
  askPlaceholder = "Например: пролезет ли в дверной проём 70 см в собранном виде?",
  askHint = "Вопросы о сроках доставки и статусе заказа быстрее решает поддержка — здесь отвечают только о самом товаре.",
  cta = "Отправить вопрос",
  roleText = DEFAULT_ROLE,
  answersText = DEFAULT_ANSWERS_TEXT,
  voteText = "Полезно · {count}",
  voteAriaText = "Отметить ответ {author} полезным",
  accent,
  background = "",
  className,
  style,
}: Commerce044Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-044-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-044-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-044" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-044"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <ul>
            {questions.map((question) => (
              <li key={question.id}>
                <details open={question.open}>
                  <summary>
                    <span data-part="q">
                      <i aria-hidden="true">?</i>
                      <span>{question.text}</span>
                    </span>
                    <span data-part="qmeta">
                      <span>{question.author}</span>
                      <span>{question.date}</span>
                      <span data-part="count">
                        {(question.answers.length === 1
                          ? (answersText.one ?? DEFAULT_ANSWERS_TEXT.one)
                          : (answersText.many ?? DEFAULT_ANSWERS_TEXT.many)
                        ).replace("{count}", String(question.answers.length))}
                      </span>
                    </span>
                  </summary>
                  <div data-part="answers">
                    {question.answers.map((answer) => (
                      <div
                        data-part="answer"
                        data-role={answer.role}
                        key={`${question.id}-${answer.author}`}
                      >
                        <p data-part="who">
                          <b>{answer.author}</b>
                          <span data-part="badge" data-role={answer.role}>
                            {roleText[answer.role] ?? DEFAULT_ROLE[answer.role]}
                          </span>
                          <span data-part="when">{answer.date}</span>
                        </p>
                        <p data-part="text">{answer.text}</p>
                        <button
                          type="button"
                          data-part="vote"
                          aria-label={voteAriaText.replace(
                            "{author}",
                            answer.author,
                          )}
                        >
                          {voteText.replace("{count}", String(answer.helpful))}
                        </button>
                      </div>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ul>

          <div data-part="ask">
            <h3>{askTitle}</h3>
            <label htmlFor="commerce-044-ask" hidden>
              {askTitle}
            </label>
            <textarea id="commerce-044-ask" placeholder={askPlaceholder} />
            <div data-part="foot">
              <p data-part="hint">{askHint}</p>
              <button type="button" data-part="cta">
                {cta}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
