import type { CSSProperties } from "react"

type Contact010FieldText = {
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

export type Contact010Props = {
  eyebrow?: string
  title?: string
  description?: string
  slaTitle?: string
  slaText?: string
  slaPoints?: string[]
  submitLabel?: string
  fieldText?: Contact010FieldText
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Форма и обещание срока ответа как равные половины: SLA-плашка с молнией —
// не декор, а аргумент оставить контакты. Обещание подкреплено фактами
// списком, потому что голая цифра «за 4 часа» читается как маркетинг.
const STYLES = `
:where([data-vibeui-block="contact-010"]){
--vibeui-contact-010-bg:transparent;
--vibeui-contact-010-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-contact-010-field:light-dark(oklch(0.985 0 0),oklch(0.26 0 0));
--vibeui-contact-010-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-contact-010-muted:light-dark(oklch(0.5 0 0),oklch(0.71 0 0));
--vibeui-contact-010-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-contact-010-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-010-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-010-on-accent:oklch(0.15 0.02 39.8);
--vibeui-contact-010-error:light-dark(oklch(0.55 0.19 27),oklch(0.7 0.17 27));
--vibeui-contact-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-010"]{color-scheme:dark}
[data-vibeui-block="contact-010"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-contact-010-bg);color:var(--vibeui-contact-010-ink);
font-family:var(--vibeui-contact-010-font);
}
[data-vibeui-block="contact-010"] [data-part="shell"]{max-width:70rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="contact-010"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-contact-010-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="contact-010"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="contact-010"] [data-part="description"]{
margin:0.875rem 0 0;max-width:52ch;color:var(--vibeui-contact-010-muted);
font-size:1rem;line-height:1.6;
}
[data-vibeui-block="contact-010"] [data-part="columns"]{display:grid;gap:1.25rem;margin-top:2rem}
[data-vibeui-block="contact-010"] [data-part="sla"]{
display:flex;flex-direction:column;gap:0.875rem;padding:1.75rem;border-radius:1.25rem;
border:1px solid color-mix(in oklab,var(--vibeui-contact-010-accent) 35%,var(--vibeui-contact-010-border));
background:color-mix(in oklab,var(--vibeui-contact-010-accent) 10%,var(--vibeui-contact-010-card));
}
[data-vibeui-block="contact-010"] [data-part="bolt"]{
width:3rem;height:3rem;border-radius:1rem;display:grid;place-items:center;
background:color-mix(in oklab,var(--vibeui-contact-010-accent) 16%,var(--vibeui-contact-010-card));
color:var(--vibeui-contact-010-accent);
}
[data-vibeui-block="contact-010"] [data-part="bolt"] svg{width:1.5rem;height:1.5rem}
[data-vibeui-block="contact-010"] [data-part="sla-title"]{
margin:0;font-size:1.375rem;font-weight:700;letter-spacing:-0.015em;
}
[data-vibeui-block="contact-010"] [data-part="sla-text"]{
margin:0;color:var(--vibeui-contact-010-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="contact-010"] [data-part="sla-points"]{
margin:0.25rem 0 0;padding:0;list-style:none;display:grid;gap:0.625rem;
}
[data-vibeui-block="contact-010"] [data-part="sla-points"] li{
display:flex;gap:0.625rem;align-items:baseline;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="contact-010"] [data-part="sla-points"] li::before{
content:"✓";flex:none;color:var(--vibeui-contact-010-accent);font-weight:700;
}
[data-vibeui-block="contact-010"] [data-part="form"]{
display:grid;gap:1.125rem;align-content:start;
padding:1.75rem;border:1px solid var(--vibeui-contact-010-border);border-radius:1.25rem;
background:var(--vibeui-contact-010-card);
}
[data-vibeui-block="contact-010"] [data-part="field"]{display:grid;gap:0.4375rem;min-inline-size:0}
[data-vibeui-block="contact-010"] [data-part="label"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="contact-010"] [data-part="input"]{
width:100%;padding:0.6875rem 0.875rem;margin:0;
border:1px solid var(--vibeui-contact-010-border);border-radius:0.625rem;
background:var(--vibeui-contact-010-field);color:inherit;
font:inherit;font-size:0.9375rem;line-height:1.45;
}
[data-vibeui-block="contact-010"] textarea[data-part="input"]{resize:vertical;min-height:6.5rem}
[data-vibeui-block="contact-010"] [data-part="input"]::placeholder{color:var(--vibeui-contact-010-muted)}
[data-vibeui-block="contact-010"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-contact-010-accent);outline-offset:2px;
}
/* Текст ошибки всегда в разметке: узел, появившийся из ниоткуда,
   скринридер не найдёт. Визуально скрыт до :user-invalid. */
[data-vibeui-block="contact-010"] [data-part="error"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
color:var(--vibeui-contact-010-error);font-style:normal;font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="contact-010"] [data-part="field"]:has(:user-invalid) [data-part="error"]{
position:static;width:auto;height:auto;clip-path:none;
}
[data-vibeui-block="contact-010"] [data-part="field"] :user-invalid{
border-color:var(--vibeui-contact-010-error);
}
[data-vibeui-block="contact-010"] [data-part="submit"]{
padding:0.8125rem 1.5rem;border:0;border-radius:0.75rem;cursor:pointer;
background:var(--vibeui-contact-010-accent-fill);color:var(--vibeui-contact-010-on-accent);
font:inherit;font-size:0.9375rem;font-weight:700;letter-spacing:0.01em;
transition:filter 0.18s ease,transform 0.18s ease;
}
[data-vibeui-block="contact-010"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="contact-010"] [data-part="submit"]:active{transform:translateY(1px)}
[data-vibeui-block="contact-010"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-contact-010-accent);outline-offset:3px;
}
@container (min-width: 44rem){
[data-vibeui-block="contact-010"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="contact-010"] [data-part="columns"]{grid-template-columns:2fr 3fr;gap:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SLA_POINTS = [
  "Среднее время ответа за последний месяц — 2 часа 40 минут",
  "Не уложились в срок — продлеваем подписку на месяц бесплатно",
  "Номер обращения приходит на почту сразу после отправки",
]

const DEFAULT_FIELD_TEXT: Contact010FieldText = {
  name: "Имя",
  namePlaceholder: "Как к вам обращаться",
  nameError: "Напишите имя — ответ придёт живому человеку.",
  email: "Почта",
  emailPlaceholder: "you@company.com",
  emailError: "Проверьте адрес: нужна @ и домен.",
  message: "Что случилось",
  messagePlaceholder:
    "Блок каталога не встаёт в проект: shadcn ругается на registry. Прикладываю текст ошибки…",
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

/** Форма поддержки рядом с SLA-плашкой «отвечаем за 4 часа». */
export function Contact010({
  eyebrow = "Поддержка",
  title = "Напишите — ответим быстро",
  description = "Мы меряем скорость ответа и показываем её здесь же. Обещание слева — публичное обязательство, а не слоган.",
  slaTitle = "Отвечаем за 4 часа",
  slaText = "Обещание действует в рабочие часы: Пн–Пт с 10:00 до 19:00 по Москве. Ночные письма получают ответ утром, первыми в очереди.",
  slaPoints = DEFAULT_SLA_POINTS,
  submitLabel = "Написать в поддержку",
  fieldText = DEFAULT_FIELD_TEXT,
  background = "",
  accent,
  className,
  style,
}: Contact010Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-contact-010-accent": accent,
          "--vibeui-contact-010-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-contact-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-010"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <div data-part="columns">
            <aside data-part="sla">
              <span data-part="bolt" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
                </svg>
              </span>
              <h3 data-part="sla-title">{slaTitle}</h3>
              <p data-part="sla-text">{slaText}</p>
              <ul data-part="sla-points">
                {slaPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </aside>
            <form data-part="form">
              <div data-part="field">
                <label data-part="label" htmlFor="vibeui-contact-010-name">
                  {fieldText.name}
                </label>
                <input
                  data-part="input"
                  id="vibeui-contact-010-name"
                  name="name"
                  type="text"
                  required
                  placeholder={fieldText.namePlaceholder}
                  aria-describedby="vibeui-contact-010-name-error"
                />
                <em data-part="error" id="vibeui-contact-010-name-error">
                  {fieldText.nameError}
                </em>
              </div>
              <div data-part="field">
                <label data-part="label" htmlFor="vibeui-contact-010-email">
                  {fieldText.email}
                </label>
                <input
                  data-part="input"
                  id="vibeui-contact-010-email"
                  name="email"
                  type="email"
                  required
                  placeholder={fieldText.emailPlaceholder}
                  aria-describedby="vibeui-contact-010-email-error"
                />
                <em data-part="error" id="vibeui-contact-010-email-error">
                  {fieldText.emailError}
                </em>
              </div>
              <div data-part="field">
                <label data-part="label" htmlFor="vibeui-contact-010-message">
                  {fieldText.message}
                </label>
                <textarea
                  data-part="input"
                  id="vibeui-contact-010-message"
                  name="message"
                  required
                  minLength={20}
                  placeholder={fieldText.messagePlaceholder}
                  aria-describedby="vibeui-contact-010-message-error"
                />
                <em data-part="error" id="vibeui-contact-010-message-error">
                  {fieldText.messageError}
                </em>
              </div>
              <button data-part="submit" type="submit">
                {submitLabel}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
