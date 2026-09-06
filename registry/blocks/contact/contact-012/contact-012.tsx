import type { CSSProperties } from "react"

type Contact012FieldText = {
  email: string
  emailPlaceholder: string
  emailError: string
  message: string
  messagePlaceholder: string
  messageError: string
}

export type Contact012Props = {
  eyebrow?: string
  title?: string
  description?: string
  dropTitle?: string
  dropHint?: string
  submitLabel?: string
  responseNote?: string
  fieldText?: Contact012FieldText
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Форма обращения с вложением на нативном input type="file": label
// растягивает зону клика на всю пунктирную область, а сам input остаётся
// видимым — его нативный контрол показывает имя выбранного файла, что без
// JS иначе не сделать. Кнопка выбора стилизована через ::file-selector-button.
const STYLES = `
:where([data-vibeui-block="contact-012"]){
--vibeui-contact-012-bg:transparent;
--vibeui-contact-012-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-contact-012-field:light-dark(oklch(0.985 0 0),oklch(0.26 0 0));
--vibeui-contact-012-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-contact-012-muted:light-dark(oklch(0.5 0 0),oklch(0.71 0 0));
--vibeui-contact-012-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-contact-012-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-012-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-012-on-accent:oklch(0.15 0.02 39.8);
--vibeui-contact-012-error:light-dark(oklch(0.55 0.19 27),oklch(0.7 0.17 27));
--vibeui-contact-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-012"]{color-scheme:dark}
[data-vibeui-block="contact-012"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-contact-012-bg);color:var(--vibeui-contact-012-ink);
font-family:var(--vibeui-contact-012-font);
}
[data-vibeui-block="contact-012"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="contact-012"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-contact-012-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="contact-012"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="contact-012"] [data-part="description"]{
margin:0.875rem 0 0;max-width:52ch;color:var(--vibeui-contact-012-muted);
font-size:1rem;line-height:1.6;
}
[data-vibeui-block="contact-012"] [data-part="form"]{margin-top:2rem;display:grid;gap:1.125rem}
[data-vibeui-block="contact-012"] [data-part="field"]{display:grid;gap:0.4375rem;min-inline-size:0}
[data-vibeui-block="contact-012"] [data-part="label"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="contact-012"] [data-part="input"]{
width:100%;padding:0.6875rem 0.875rem;margin:0;
border:1px solid var(--vibeui-contact-012-border);border-radius:0.625rem;
background:var(--vibeui-contact-012-field);color:inherit;
font:inherit;font-size:0.9375rem;line-height:1.45;
}
[data-vibeui-block="contact-012"] textarea[data-part="input"]{resize:vertical;min-height:6.5rem}
[data-vibeui-block="contact-012"] [data-part="input"]::placeholder{color:var(--vibeui-contact-012-muted)}
[data-vibeui-block="contact-012"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-contact-012-accent);outline-offset:2px;
}
/* Текст ошибки всегда в разметке: узел, появившийся из ниоткуда,
   скринридер не найдёт. Визуально скрыт до :user-invalid. */
[data-vibeui-block="contact-012"] [data-part="error"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
color:var(--vibeui-contact-012-error);font-style:normal;font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="contact-012"] [data-part="field"]:has(:user-invalid) [data-part="error"]{
position:static;width:auto;height:auto;clip-path:none;
}
[data-vibeui-block="contact-012"] [data-part="field"] :user-invalid{
border-color:var(--vibeui-contact-012-error);
}
[data-vibeui-block="contact-012"] [data-part="drop"]{
display:grid;justify-items:center;gap:0.5rem;text-align:center;
padding:1.75rem 1.25rem;border:1.5px dashed var(--vibeui-contact-012-border);border-radius:1rem;
background:var(--vibeui-contact-012-card);cursor:pointer;
transition:border-color 0.18s ease,background 0.18s ease;
}
[data-vibeui-block="contact-012"] [data-part="drop"]:hover{
border-color:color-mix(in oklab,var(--vibeui-contact-012-accent) 55%,var(--vibeui-contact-012-border));
background:color-mix(in oklab,var(--vibeui-contact-012-accent) 5%,var(--vibeui-contact-012-card));
}
[data-vibeui-block="contact-012"] [data-part="drop"]:has(input:focus-visible){
outline:2px solid var(--vibeui-contact-012-accent);outline-offset:2px;
}
[data-vibeui-block="contact-012"] [data-part="dropicon"]{
width:2.75rem;height:2.75rem;border-radius:0.875rem;display:grid;place-items:center;
background:color-mix(in oklab,var(--vibeui-contact-012-accent) 12%,var(--vibeui-contact-012-card));
color:var(--vibeui-contact-012-accent);
}
[data-vibeui-block="contact-012"] [data-part="dropicon"] svg{width:1.375rem;height:1.375rem}
[data-vibeui-block="contact-012"] [data-part="droptitle"]{font-size:0.9375rem;font-weight:650}
[data-vibeui-block="contact-012"] [data-part="drophint"]{
color:var(--vibeui-contact-012-muted);font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="contact-012"] [data-part="file"]{
margin-top:0.375rem;max-width:100%;color:var(--vibeui-contact-012-muted);
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="contact-012"] [data-part="file"]::file-selector-button{
margin-right:0.75rem;padding:0.5rem 0.875rem;cursor:pointer;
border:1px solid var(--vibeui-contact-012-border);border-radius:0.625rem;
background:var(--vibeui-contact-012-card);color:var(--vibeui-contact-012-ink);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:border-color 0.18s ease;
}
[data-vibeui-block="contact-012"] [data-part="file"]::file-selector-button:hover{
border-color:color-mix(in oklab,var(--vibeui-contact-012-accent) 55%,var(--vibeui-contact-012-border));
}
[data-vibeui-block="contact-012"] [data-part="submit"]{
padding:0.8125rem 1.5rem;border:0;border-radius:0.75rem;cursor:pointer;
background:var(--vibeui-contact-012-accent-fill);color:var(--vibeui-contact-012-on-accent);
font:inherit;font-size:0.9375rem;font-weight:700;letter-spacing:0.01em;
transition:filter 0.18s ease,transform 0.18s ease;
}
[data-vibeui-block="contact-012"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="contact-012"] [data-part="submit"]:active{transform:translateY(1px)}
[data-vibeui-block="contact-012"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-contact-012-accent);outline-offset:3px;
}
[data-vibeui-block="contact-012"] [data-part="note"]{
margin:0;color:var(--vibeui-contact-012-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 34rem){
[data-vibeui-block="contact-012"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="contact-012"] [data-part="drop"]{padding:2.25rem 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FIELD_TEXT: Contact012FieldText = {
  email: "Почта",
  emailPlaceholder: "you@company.com",
  emailError: "Проверьте адрес: нужна @ и домен.",
  message: "Опишите вопрос",
  messagePlaceholder:
    "Кастомизировали блок hero из каталога, и палитра поехала. Скриншот прикладываю.",
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

/** Форма обращения с пунктирной зоной вложения на нативном input file. */
export function Contact012({
  eyebrow = "Поддержка",
  title = "Покажите проблему файлом",
  description = "Скриншот или архив проекта ускоряют ответ вдвое: не придётся выспрашивать детали перепиской.",
  dropTitle = "Выберите файл или перетащите его на кнопку",
  dropHint = "PNG, PDF или ZIP до 10 МБ. Один файл на обращение.",
  submitLabel = "Отправить обращение",
  responseNote = "Файл уходит вместе с формой, отдельной загрузки нет. Отвечаем в течение рабочего дня.",
  fieldText = DEFAULT_FIELD_TEXT,
  background = "",
  accent,
  className,
  style,
}: Contact012Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-contact-012-accent": accent,
          "--vibeui-contact-012-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-contact-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-012"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <form data-part="form">
            <div data-part="field">
              <label data-part="label" htmlFor="vibeui-contact-012-email">
                {fieldText.email}
              </label>
              <input
                data-part="input"
                id="vibeui-contact-012-email"
                name="email"
                type="email"
                required
                placeholder={fieldText.emailPlaceholder}
                aria-describedby="vibeui-contact-012-email-error"
              />
              <em data-part="error" id="vibeui-contact-012-email-error">
                {fieldText.emailError}
              </em>
            </div>
            <div data-part="field">
              <label data-part="label" htmlFor="vibeui-contact-012-message">
                {fieldText.message}
              </label>
              <textarea
                data-part="input"
                id="vibeui-contact-012-message"
                name="message"
                required
                minLength={20}
                placeholder={fieldText.messagePlaceholder}
                aria-describedby="vibeui-contact-012-message-error"
              />
              <em data-part="error" id="vibeui-contact-012-message-error">
                {fieldText.messageError}
              </em>
            </div>
            <label data-part="drop">
              <span data-part="dropicon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 16V4" />
                  <path d="m7 9 5-5 5 5" />
                  <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                </svg>
              </span>
              <span data-part="droptitle">{dropTitle}</span>
              <span data-part="drophint">{dropHint}</span>
              <input
                data-part="file"
                type="file"
                name="attachment"
                accept=".png,.jpg,.jpeg,.pdf,.zip"
              />
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
