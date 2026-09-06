import type { CSSProperties } from "react"

type Contact013Question = {
  question: string
  answer: string
}

type Contact013FieldText = {
  question: string
  questionPlaceholder: string
  questionError: string
  email: string
  emailPlaceholder: string
  emailError: string
}

export type Contact013Props = {
  eyebrow?: string
  title?: string
  description?: string
  questions?: Contact013Question[]
  formTitle?: string
  submitLabel?: string
  responseNote?: string
  fieldText?: Contact013FieldText
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Узкий столбец «сначала ответы»: три самых частых вопроса нативными
// details с CSS-нумерацией, форма — ниже и короче списка. Порядок
// принципиален: форма вместо ответов возвращает те же три вопроса в
// поддержку. Details раскрывает и поиск по странице.
const STYLES = `
:where([data-vibeui-block="contact-013"]){
--vibeui-contact-013-bg:transparent;
--vibeui-contact-013-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-contact-013-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-contact-013-muted:light-dark(oklch(0.5 0 0),oklch(0.71 0 0));
--vibeui-contact-013-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-contact-013-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-013-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-013-on-accent:oklch(0.15 0.02 39.8);
--vibeui-contact-013-error:light-dark(oklch(0.55 0.19 27),oklch(0.7 0.17 27));
--vibeui-contact-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-013"]{color-scheme:dark}
[data-vibeui-block="contact-013"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-contact-013-bg);color:var(--vibeui-contact-013-ink);
font-family:var(--vibeui-contact-013-font);
}
[data-vibeui-block="contact-013"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="contact-013"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-contact-013-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="contact-013"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="contact-013"] [data-part="description"]{
margin:0.875rem 0 0;max-width:52ch;color:var(--vibeui-contact-013-muted);
font-size:1rem;line-height:1.6;
}
[data-vibeui-block="contact-013"] [data-part="faq"]{
counter-reset:vibeui-contact-013-q;
margin-top:2rem;display:grid;gap:0.75rem;
}
[data-vibeui-block="contact-013"] [data-part="item"]{
counter-increment:vibeui-contact-013-q;
border:1px solid var(--vibeui-contact-013-border);border-radius:1rem;
background:var(--vibeui-contact-013-card);
}
[data-vibeui-block="contact-013"] [data-part="question"]{
display:flex;align-items:baseline;gap:0.875rem;
padding:1.125rem 1.25rem;cursor:pointer;list-style:none;
font-size:1rem;font-weight:650;line-height:1.4;
}
[data-vibeui-block="contact-013"] [data-part="question"]::-webkit-details-marker{display:none}
[data-vibeui-block="contact-013"] [data-part="question"]::before{
content:counter(vibeui-contact-013-q,decimal-leading-zero);
flex:none;color:var(--vibeui-contact-013-accent);
font-size:0.8125rem;font-weight:700;letter-spacing:0.06em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="contact-013"] [data-part="question"]::after{
content:"";margin-left:auto;align-self:center;flex:none;
width:0.5rem;height:0.5rem;translate:0 -25%;rotate:45deg;
border-right:2px solid var(--vibeui-contact-013-muted);
border-bottom:2px solid var(--vibeui-contact-013-muted);
transition:rotate 0.18s ease,translate 0.18s ease;
}
[data-vibeui-block="contact-013"] [data-part="item"][open] [data-part="question"]::after{
rotate:225deg;translate:0 25%;
}
[data-vibeui-block="contact-013"] [data-part="question"]:focus-visible{
outline:2px solid var(--vibeui-contact-013-accent);outline-offset:2px;border-radius:1rem;
}
[data-vibeui-block="contact-013"] [data-part="answer"]{
margin:0;padding:0 1.25rem 1.25rem 3rem;
color:var(--vibeui-contact-013-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="contact-013"] [data-part="ask"]{
margin-top:1.5rem;padding:1.5rem;border-radius:1.25rem;display:grid;gap:1rem;
border:1px solid color-mix(in oklab,var(--vibeui-contact-013-accent) 30%,var(--vibeui-contact-013-border));
background:color-mix(in oklab,var(--vibeui-contact-013-accent) 8%,var(--vibeui-contact-013-card));
}
[data-vibeui-block="contact-013"] [data-part="ask-title"]{
margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em;
}
[data-vibeui-block="contact-013"] [data-part="field"]{display:grid;gap:0.4375rem;min-inline-size:0}
[data-vibeui-block="contact-013"] [data-part="label"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="contact-013"] [data-part="input"]{
width:100%;padding:0.6875rem 0.875rem;margin:0;
border:1px solid var(--vibeui-contact-013-border);border-radius:0.625rem;
background:var(--vibeui-contact-013-card);color:inherit;
font:inherit;font-size:0.9375rem;line-height:1.45;
}
[data-vibeui-block="contact-013"] textarea[data-part="input"]{resize:vertical;min-height:5.5rem}
[data-vibeui-block="contact-013"] [data-part="input"]::placeholder{color:var(--vibeui-contact-013-muted)}
[data-vibeui-block="contact-013"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-contact-013-accent);outline-offset:2px;
}
/* Текст ошибки всегда в разметке: узел, появившийся из ниоткуда,
   скринридер не найдёт. Визуально скрыт до :user-invalid. */
[data-vibeui-block="contact-013"] [data-part="error"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
color:var(--vibeui-contact-013-error);font-style:normal;font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="contact-013"] [data-part="field"]:has(:user-invalid) [data-part="error"]{
position:static;width:auto;height:auto;clip-path:none;
}
[data-vibeui-block="contact-013"] [data-part="field"] :user-invalid{
border-color:var(--vibeui-contact-013-error);
}
[data-vibeui-block="contact-013"] [data-part="row"]{display:grid;gap:1rem}
[data-vibeui-block="contact-013"] [data-part="submit"]{
padding:0.75rem 1.375rem;border:0;border-radius:0.75rem;cursor:pointer;
background:var(--vibeui-contact-013-accent-fill);color:var(--vibeui-contact-013-on-accent);
font:inherit;font-size:0.9375rem;font-weight:700;letter-spacing:0.01em;
transition:filter 0.18s ease,transform 0.18s ease;
}
[data-vibeui-block="contact-013"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="contact-013"] [data-part="submit"]:active{transform:translateY(1px)}
[data-vibeui-block="contact-013"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-contact-013-accent);outline-offset:3px;
}
[data-vibeui-block="contact-013"] [data-part="note"]{
margin:0;color:var(--vibeui-contact-013-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 34rem){
[data-vibeui-block="contact-013"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="contact-013"] [data-part="row"]{grid-template-columns:minmax(0,1fr) auto;align-items:end}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_QUESTIONS: Contact013Question[] = [
  {
    question: "Чем блоки VibeUI отличаются от обычного шаблона?",
    answer:
      "Каждый блок — один самодостаточный файл без зависимостей: он копируется в проект командой shadcn и дальше живёт как ваш код. Обновлять и «отвязывать» ничего не нужно.",
  },
  {
    question: "Можно ли поменять палитру блока под свой бренд?",
    answer:
      "Да. Все цвета блока лежат в его локальных CSS-переменных, а акцент передаётся пропсом accent. Достаточно заменить пару значений — раскладку и типографику трогать не придётся.",
  },
  {
    question: "Нужен ли для установки собственный бэкенд?",
    answer:
      "Нет. Блоки ставятся из статического registry командой npx shadcn add с адресом компонента. Формы внутри блоков — разметка с браузерной валидацией, отправку подключаете к любому своему обработчику.",
  },
]

const DEFAULT_FIELD_TEXT: Contact013FieldText = {
  question: "Ваш вопрос",
  questionPlaceholder:
    "Например: как подключить блоки к проекту на старом Next?",
  questionError: "Одного слова мало — напишите вопрос целиком.",
  email: "Почта для ответа",
  emailPlaceholder: "you@company.com",
  emailError: "Проверьте адрес: нужна @ и домен.",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Mini-FAQ из трёх details и короткая форма «не нашли — спросите» ниже. */
export function Contact013({
  eyebrow = "Вопросы",
  title = "Сначала ответы",
  description = "Три вопроса, с которых начинается почти каждое письмо. Если вашего здесь нет — форма сразу под списком.",
  questions = DEFAULT_QUESTIONS,
  formTitle = "Не нашли — спросите",
  submitLabel = "Спросить",
  responseNote = "Отвечаем на почту в течение рабочего дня. Хорошие вопросы попадают в этот список.",
  fieldText = DEFAULT_FIELD_TEXT,
  background = "",
  accent,
  className,
  style,
}: Contact013Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-contact-013-accent": accent,
          "--vibeui-contact-013-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-contact-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <div data-part="faq">
            {questions.map((item) => (
              <details key={item.question} data-part="item">
                <summary data-part="question">{item.question}</summary>
                <p data-part="answer">{item.answer}</p>
              </details>
            ))}
          </div>
          <form data-part="ask">
            <h3 data-part="ask-title">{formTitle}</h3>
            <div data-part="field">
              <label data-part="label" htmlFor="vibeui-contact-013-question">
                {fieldText.question}
              </label>
              <textarea
                data-part="input"
                id="vibeui-contact-013-question"
                name="question"
                required
                minLength={15}
                placeholder={fieldText.questionPlaceholder}
                aria-describedby="vibeui-contact-013-question-error"
              />
              <em data-part="error" id="vibeui-contact-013-question-error">
                {fieldText.questionError}
              </em>
            </div>
            <div data-part="row">
              <div data-part="field">
                <label data-part="label" htmlFor="vibeui-contact-013-email">
                  {fieldText.email}
                </label>
                <input
                  data-part="input"
                  id="vibeui-contact-013-email"
                  name="email"
                  type="email"
                  required
                  placeholder={fieldText.emailPlaceholder}
                  aria-describedby="vibeui-contact-013-email-error"
                />
                <em data-part="error" id="vibeui-contact-013-email-error">
                  {fieldText.emailError}
                </em>
              </div>
              <button data-part="submit" type="submit">
                {submitLabel}
              </button>
            </div>
            <p data-part="note">{responseNote}</p>
          </form>
        </div>
      </section>
    </>
  )
}
