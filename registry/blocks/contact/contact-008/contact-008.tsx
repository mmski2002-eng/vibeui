import type { CSSProperties } from "react"

type Contact008FieldText = {
  topic: string
  name: string
  namePlaceholder: string
  nameError: string
  email: string
  emailPlaceholder: string
  emailError: string
  message: string
  messagePlaceholder: string
  messageError: string
}

export type Contact008Props = {
  eyebrow?: string
  title?: string
  description?: string
  topics?: string[]
  submitLabel?: string
  consentLabel?: string
  responseNote?: string
  fieldText?: Contact008FieldText
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Узкая центрированная форма, где тема обращения — первый и самый заметный
// элемент: выбранная тема маршрутизирует письмо без пересылок между
// отделами. Ошибки показываются по :user-invalid, а не :invalid — пустое
// поле не должно краснеть до первого ввода.
const STYLES = `
:where([data-vibeui-block="contact-008"]){
--vibeui-contact-008-bg:transparent;
--vibeui-contact-008-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-contact-008-field:light-dark(oklch(0.985 0 0),oklch(0.26 0 0));
--vibeui-contact-008-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-contact-008-muted:light-dark(oklch(0.5 0 0),oklch(0.71 0 0));
--vibeui-contact-008-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-contact-008-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-008-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-008-on-accent:oklch(0.15 0.02 39.8);
--vibeui-contact-008-error:light-dark(oklch(0.55 0.19 27),oklch(0.7 0.17 27));
--vibeui-contact-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-008"]{color-scheme:dark}
[data-vibeui-block="contact-008"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-contact-008-bg);color:var(--vibeui-contact-008-ink);
font-family:var(--vibeui-contact-008-font);
}
[data-vibeui-block="contact-008"] [data-part="shell"]{max-width:42rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="contact-008"] [data-part="head"]{text-align:center}
[data-vibeui-block="contact-008"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-contact-008-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="contact-008"] [data-part="title"]{
margin:0;font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="contact-008"] [data-part="description"]{
margin:0.875rem auto 0;max-width:44ch;color:var(--vibeui-contact-008-muted);
font-size:1rem;line-height:1.6;
}
[data-vibeui-block="contact-008"] [data-part="form"]{
margin-top:2rem;display:grid;gap:1.125rem;
padding:1.5rem;border:1px solid var(--vibeui-contact-008-border);border-radius:1.25rem;
background:var(--vibeui-contact-008-card);
}
[data-vibeui-block="contact-008"] [data-part="pair"]{display:grid;gap:1.125rem}
[data-vibeui-block="contact-008"] [data-part="field"]{display:grid;gap:0.4375rem;min-inline-size:0}
[data-vibeui-block="contact-008"] [data-part="label"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="contact-008"] [data-part="input"]{
width:100%;padding:0.6875rem 0.875rem;margin:0;
border:1px solid var(--vibeui-contact-008-border);border-radius:0.625rem;
background:var(--vibeui-contact-008-field);color:inherit;
font:inherit;font-size:0.9375rem;line-height:1.45;
}
[data-vibeui-block="contact-008"] textarea[data-part="input"]{resize:vertical;min-height:7rem}
[data-vibeui-block="contact-008"] [data-part="input"]::placeholder{color:var(--vibeui-contact-008-muted)}
[data-vibeui-block="contact-008"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-contact-008-accent);outline-offset:2px;
}
[data-vibeui-block="contact-008"] [data-part="selectwrap"]{position:relative}
[data-vibeui-block="contact-008"] select[data-part="input"]{appearance:none;padding-right:2.5rem;cursor:pointer}
[data-vibeui-block="contact-008"] [data-part="selectwrap"]::after{
content:"";position:absolute;right:1rem;top:50%;width:0.5rem;height:0.5rem;
translate:0 -70%;rotate:45deg;pointer-events:none;
border-right:2px solid var(--vibeui-contact-008-muted);
border-bottom:2px solid var(--vibeui-contact-008-muted);
}
/* Текст ошибки всегда в разметке: узел, появившийся из ниоткуда,
   скринридер не найдёт. Визуально скрыт до :user-invalid. */
[data-vibeui-block="contact-008"] [data-part="error"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
color:var(--vibeui-contact-008-error);font-style:normal;font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="contact-008"] [data-part="field"]:has(:user-invalid) [data-part="error"]{
position:static;width:auto;height:auto;clip-path:none;
}
[data-vibeui-block="contact-008"] [data-part="field"] :user-invalid{
border-color:var(--vibeui-contact-008-error);
}
[data-vibeui-block="contact-008"] [data-part="consent"]{
display:flex;gap:0.625rem;align-items:flex-start;
color:var(--vibeui-contact-008-muted);font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="contact-008"] [data-part="consent"] input{
width:1rem;height:1rem;margin:0.125rem 0 0;flex:none;
accent-color:var(--vibeui-contact-008-accent-fill);
}
[data-vibeui-block="contact-008"] [data-part="consent"] input:focus-visible{
outline:2px solid var(--vibeui-contact-008-accent);outline-offset:2px;
}
[data-vibeui-block="contact-008"] [data-part="submit"]{
padding:0.8125rem 1.5rem;border:0;border-radius:0.75rem;cursor:pointer;
background:var(--vibeui-contact-008-accent-fill);color:var(--vibeui-contact-008-on-accent);
font:inherit;font-size:0.9375rem;font-weight:700;letter-spacing:0.01em;
transition:filter 0.18s ease,transform 0.18s ease;
}
[data-vibeui-block="contact-008"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="contact-008"] [data-part="submit"]:active{transform:translateY(1px)}
[data-vibeui-block="contact-008"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-contact-008-accent);outline-offset:3px;
}
[data-vibeui-block="contact-008"] [data-part="note"]{
margin:0;text-align:center;color:var(--vibeui-contact-008-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 34rem){
[data-vibeui-block="contact-008"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="contact-008"] [data-part="form"]{padding:2rem}
[data-vibeui-block="contact-008"] [data-part="pair"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TOPICS = [
  "Вопрос по установке блока",
  "Лицензия и оплата",
  "Не работает превью",
  "Партнёрство",
  "Другое",
]

const DEFAULT_FIELD_TEXT: Contact008FieldText = {
  topic: "Тема обращения",
  name: "Как к вам обращаться",
  namePlaceholder: "Имя",
  nameError: "Напишите имя — ответ придёт живому человеку.",
  email: "Почта",
  emailPlaceholder: "you@company.com",
  emailError: "Проверьте адрес: нужна @ и домен.",
  message: "Сообщение",
  messagePlaceholder:
    "Собираем лендинг из блоков VibeUI, вопрос про адаптацию палитры под бренд…",
  messageError: "Пары предложений достаточно — пока слишком коротко.",
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

/** Центрированная форма связи: тема обращения первым полем, согласие и кнопка. */
export function Contact008({
  eyebrow = "Свяжитесь с нами",
  title = "Напишите нам",
  description = "Выберите тему — обращение сразу попадёт к тому, кто за неё отвечает, без пересылок между отделами.",
  topics = DEFAULT_TOPICS,
  submitLabel = "Отправить",
  consentLabel = "Согласен на обработку персональных данных ради ответа на это обращение.",
  responseNote = "Отвечаем в течение рабочего дня. Тема определяет, кому уйдёт письмо.",
  fieldText = DEFAULT_FIELD_TEXT,
  background = "",
  accent,
  className,
  style,
}: Contact008Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-contact-008-accent": accent,
          "--vibeui-contact-008-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-contact-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <header data-part="head">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            <p data-part="description">{description}</p>
          </header>
          <form data-part="form">
            <div data-part="field">
              <label data-part="label" htmlFor="vibeui-contact-008-topic">
                {fieldText.topic}
              </label>
              <span data-part="selectwrap">
                <select
                  data-part="input"
                  id="vibeui-contact-008-topic"
                  name="topic"
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </span>
            </div>
            <div data-part="pair">
              <div data-part="field">
                <label data-part="label" htmlFor="vibeui-contact-008-name">
                  {fieldText.name}
                </label>
                <input
                  data-part="input"
                  id="vibeui-contact-008-name"
                  name="name"
                  type="text"
                  required
                  placeholder={fieldText.namePlaceholder}
                  aria-describedby="vibeui-contact-008-name-error"
                />
                <em data-part="error" id="vibeui-contact-008-name-error">
                  {fieldText.nameError}
                </em>
              </div>
              <div data-part="field">
                <label data-part="label" htmlFor="vibeui-contact-008-email">
                  {fieldText.email}
                </label>
                <input
                  data-part="input"
                  id="vibeui-contact-008-email"
                  name="email"
                  type="email"
                  required
                  placeholder={fieldText.emailPlaceholder}
                  aria-describedby="vibeui-contact-008-email-error"
                />
                <em data-part="error" id="vibeui-contact-008-email-error">
                  {fieldText.emailError}
                </em>
              </div>
            </div>
            <div data-part="field">
              <label data-part="label" htmlFor="vibeui-contact-008-message">
                {fieldText.message}
              </label>
              <textarea
                data-part="input"
                id="vibeui-contact-008-message"
                name="message"
                required
                minLength={20}
                placeholder={fieldText.messagePlaceholder}
                aria-describedby="vibeui-contact-008-message-error"
              />
              <em data-part="error" id="vibeui-contact-008-message-error">
                {fieldText.messageError}
              </em>
            </div>
            <label data-part="consent">
              <input type="checkbox" name="consent" required />
              <span>{consentLabel}</span>
            </label>
            <button data-part="submit" type="submit">
              {submitLabel}
            </button>
            <p data-part="note">{responseNote}</p>
          </form>
        </div>
      </section>
    </>
  )
}
