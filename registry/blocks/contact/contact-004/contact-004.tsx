import type { CSSProperties } from "react"

export type Contact004Question = {
  question: string
  answer: string
}

export type Contact004Props = {
  eyebrow?: string
  title?: string
  description?: string
  questions?: Contact004Question[]
  formTitle?: string
  formHint?: string
  submitLabel?: string
  responseNote?: string
  /** Подписи полей: компонент несёт русские, проект подставляет свои. */
  fieldText?: Record<string, string>
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: половина обращений в поддержку — это вопросы с готовым
// ответом. Поэтому форма стоит не вместо списка вопросов, а после него, в
// узкой колонке: сначала человек видит ответы, и только если своего не
// нашёл, пишет.
//
// Раскрытие держат нативные details/summary: браузер сам раскрывает раздел,
// найденный поиском по странице, и всё работает до гидратации. Разделы
// независимы намеренно — сравнивая два условия, их открывают одновременно.
//
// Форма короткая на три поля: длинная форма после списка вопросов читается
// как наказание за то, что ответа не нашлось. Отправку реализует
// вызывающий код, блок несёт разметку и нативную проверку.
const STYLES = `
:where([data-vibeui-block="contact-004"]){
--vibeui-contact-004-bg:transparent;
--vibeui-contact-004-card:light-dark(oklch(1 0 0),oklch(0.23 0.012 265));
--vibeui-contact-004-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.01 265));
--vibeui-contact-004-fg:light-dark(oklch(0.2 0.014 265),oklch(0.94 0.005 265));
--vibeui-contact-004-muted:light-dark(oklch(0.52 0.014 265),oklch(0.72 0.012 265));
--vibeui-contact-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-contact-004-accent:light-dark(oklch(0.5 0.15 200),oklch(0.76 0.12 200));
--vibeui-contact-004-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 200));
--vibeui-contact-004-alarm:light-dark(oklch(0.55 0.19 25),oklch(0.73 0.16 25));
--vibeui-contact-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-004"]{color-scheme:dark}
[data-vibeui-block="contact-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-contact-004-bg);color:var(--vibeui-contact-004-fg);
font-family:var(--vibeui-contact-004-sans);
}
[data-vibeui-block="contact-004"] *{box-sizing:border-box}
[data-vibeui-block="contact-004"] [data-part="frame"]{
max-width:72rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:1.75rem;align-items:start;
}
[data-vibeui-block="contact-004"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-contact-004-accent);
}
[data-vibeui-block="contact-004"] h2{
margin:0.5rem 0 0;max-width:18ch;font-weight:680;letter-spacing:-0.02em;
font-size:clamp(1.5rem,3.6cqi,2.25rem);line-height:1.14;
}
[data-vibeui-block="contact-004"] [data-part="lede"]{
margin:0.5rem 0 1.25rem;max-width:46ch;font-size:0.9375rem;line-height:1.65;color:var(--vibeui-contact-004-muted);
}
[data-vibeui-block="contact-004"] [data-part="list"]{display:grid;gap:0.5rem}
[data-vibeui-block="contact-004"] details{
border:1px solid var(--vibeui-contact-004-border);border-radius:0.875rem;
background:var(--vibeui-contact-004-card);
transition:border-color .16s ease;
}
[data-vibeui-block="contact-004"] details[open]{border-color:color-mix(in oklab,var(--vibeui-contact-004-accent) 40%,var(--vibeui-contact-004-border))}
[data-vibeui-block="contact-004"] summary{
display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;
padding:0.875rem 1rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:600;line-height:1.4;
}
[data-vibeui-block="contact-004"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="contact-004"] [data-part="sign"]{
position:relative;flex:none;width:0.8125rem;height:0.8125rem;margin-top:0.3125rem;
}
[data-vibeui-block="contact-004"] [data-part="sign"]::before,
[data-vibeui-block="contact-004"] [data-part="sign"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;margin-top:-0.75px;
background:var(--vibeui-contact-004-muted);
transition:transform .18s ease,opacity .18s ease;
}
[data-vibeui-block="contact-004"] [data-part="sign"]::after{transform:rotate(90deg)}
[data-vibeui-block="contact-004"] details[open] [data-part="sign"]::after{opacity:0}
[data-vibeui-block="contact-004"] details[open] [data-part="sign"]::before{background:var(--vibeui-contact-004-accent)}
[data-vibeui-block="contact-004"] [data-part="answer"]{
margin:0;padding:0 1rem 1rem;max-width:60ch;
font-size:0.875rem;line-height:1.65;color:var(--vibeui-contact-004-muted);
}
/* Форма короткая: длинная после списка вопросов читается как наказание. */
[data-vibeui-block="contact-004"] form{
display:grid;gap:0.75rem;padding:1.25rem;border-radius:1.125rem;
background:var(--vibeui-contact-004-soft);border:1px solid var(--vibeui-contact-004-border);
}
[data-vibeui-block="contact-004"] h3{margin:0;font-size:1rem;font-weight:660;line-height:1.3}
[data-vibeui-block="contact-004"] [data-part="form-hint"]{
margin:0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-contact-004-muted);
}
[data-vibeui-block="contact-004"] [data-part="field"]{display:grid;gap:0.3125rem}
[data-vibeui-block="contact-004"] label{font-size:0.8125rem;font-weight:640}
[data-vibeui-block="contact-004"] input,
[data-vibeui-block="contact-004"] textarea{
width:100%;padding:0.5625rem 0.75rem;border-radius:0.6875rem;
border:1px solid var(--vibeui-contact-004-border);
background:var(--vibeui-contact-004-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="contact-004"] textarea{min-height:5rem;resize:vertical;line-height:1.55}
[data-vibeui-block="contact-004"] input:user-invalid,
[data-vibeui-block="contact-004"] textarea:user-invalid{border-color:var(--vibeui-contact-004-alarm)}
[data-vibeui-block="contact-004"] [data-part="error"]{
font-size:0.75rem;line-height:1.4;color:var(--vibeui-contact-004-alarm);
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="contact-004"] input:user-invalid ~ [data-part="error"],
[data-vibeui-block="contact-004"] textarea:user-invalid ~ [data-part="error"]{
position:static;width:auto;height:auto;clip-path:none;
}
[data-vibeui-block="contact-004"] button{
appearance:none;cursor:pointer;border:0;
height:2.625rem;padding:0 1.125rem;border-radius:0.6875rem;
background:var(--vibeui-contact-004-accent);color:var(--vibeui-contact-004-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="contact-004"] [data-part="response"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-contact-004-muted);
}
[data-vibeui-block="contact-004"] :focus-visible{outline:2px solid var(--vibeui-contact-004-accent);outline-offset:2px;border-radius:0.375rem}
@container (min-width: 50rem){
[data-vibeui-block="contact-004"] [data-part="frame"]{padding:4rem 2rem;grid-template-columns:1fr 21rem;column-gap:3rem}
[data-vibeui-block="contact-004"] form{position:sticky;top:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_QUESTIONS: Contact004Question[] = [
  {
    question: "Сколько времени занимает подключение?",
    answer:
      "Обычно два-три рабочих дня: день на доступы, день на перенос данных и полдня на проверку. Если у вас нестандартная выгрузка, срок обсуждаем отдельно и называем его до начала работ.",
  },
  {
    question: "Можно ли перенести данные из другой системы?",
    answer:
      "Да, если выгрузка есть в CSV или доступен API. Мы переносим справочники, историю заказов и пользователей. Файлы больше двух гигабайт переносим по частям, чтобы не ронять сервис.",
  },
  {
    question: "Что входит в поддержку после запуска?",
    answer:
      "Ответы на вопросы в рабочие часы, исправление ошибок и обновления без доплаты. Доработки под ваш процесс считаем отдельно и всегда согласуем смету заранее.",
  },
  {
    question: "Как устроена оплата?",
    answer:
      "По счёту раз в месяц или за год со скидкой. Первый месяц можно оплатить после запуска: если не подошло, счёт не выставляем.",
  },
  {
    question: "Где хранятся данные?",
    answer:
      "На серверах в России. Резервные копии делаются ежедневно и хранятся тридцать дней. По запросу выгружаем всё, что у нас есть по вашей организации, в машиночитаемом виде.",
  },
]

const FIELD_TEXT: Record<string, string> = {
  email: "Почта для ответа",
  emailPlaceholder: "you@company.ru",
  emailError: "Проверьте адрес: нужен символ @ и домен.",
  question: "Вопрос",
  questionPlaceholder:
    "Например: как перенести историю заказов из старой системы?",
  questionError: "Одного слова мало — напишите вопрос целиком.",
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
 * Частые вопросы и короткая форма для тех, кто ответа не нашёл.
 * Один файл, ноль зависимостей, отправку реализует вызывающий код.
 */
export function Contact004({
  eyebrow = "Поддержка",
  title = "Сначала посмотрите здесь",
  description = "Половина обращений — вопросы из этого списка. Если своего не нашли, напишите нам справа.",
  questions = DEFAULT_QUESTIONS,
  formTitle = "Не нашли ответ?",
  formHint = "Опишите вопрос своими словами — ответим на почту.",
  submitLabel = "Отправить вопрос",
  responseNote = "Отвечаем в рабочие дни, обычно за несколько часов.",
  fieldText,
  background = "",
  accent,
  className,
  style,
}: Contact004Props) {
  const labels = { ...FIELD_TEXT, ...fieldText }
  const palette = {
    ...(accent ? { "--vibeui-contact-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contact-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-004"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <div>
            <span data-part="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p data-part="lede">{description}</p>

            <div data-part="list">
              {questions.map((item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                    <span data-part="sign" aria-hidden="true" />
                  </summary>
                  <p data-part="answer">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <form>
            <h3>{formTitle}</h3>
            <p data-part="form-hint">{formHint}</p>

            <div data-part="field">
              <label htmlFor="contact-004-email">{labels.email}</label>
              <input
                id="contact-004-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder={labels.emailPlaceholder}
                aria-describedby="contact-004-email-error"
              />
              <span id="contact-004-email-error" data-part="error">
                {labels.emailError}
              </span>
            </div>

            <div data-part="field">
              <label htmlFor="contact-004-question">{labels.question}</label>
              <textarea
                id="contact-004-question"
                name="question"
                required
                minLength={10}
                placeholder={labels.questionPlaceholder}
                aria-describedby="contact-004-question-error"
              />
              <span id="contact-004-question-error" data-part="error">
                {labels.questionError}
              </span>
            </div>

            <button type="submit">{submitLabel}</button>
            <p data-part="response">{responseNote}</p>
          </form>
        </div>
      </section>
    </>
  )
}
