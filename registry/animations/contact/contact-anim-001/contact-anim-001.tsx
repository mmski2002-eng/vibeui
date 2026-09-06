import type { CSSProperties, ReactElement } from "react"

export type ContactAnim001Detail = {
  icon: "address" | "phone" | "email"
  label: string
  value: string
}

export type ContactAnim001Props = {
  eyebrow?: string
  title?: string
  description?: string
  nameLabel?: string
  emailLabel?: string
  messageLabel?: string
  submitLabel?: string
  details?: ContactAnim001Detail[]
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Полноширинная секция «Контакты»: слева настоящая форма, справа способы
// связи. Раскладка и типографика считаются от ширины секции (container-type),
// поэтому блок одинаков и на странице, и в узкой колонке чужого проекта.
// Форма настоящая (<form> с <label>, type="email", required) — обработчика
// отправки нет, его подключает проект-хозяин. Анимация въезда живёт на чистом
// CSS: поля формы всплывают со сдвигом, плитки-иконки выскакивают с лёгким
// перелётом; всё гаснет при prefers-reduced-motion.
const STYLES = `
:where([data-vibeui-block="contact-anim-001"]){
--vibeui-contact-anim-001-bg:transparent;
--vibeui-contact-anim-001-fg:light-dark(oklch(0.2 0 275),oklch(0.96 0 275));
--vibeui-contact-anim-001-muted:light-dark(oklch(0.5 0 275),oklch(0.72 0 275));
--vibeui-contact-anim-001-border:light-dark(oklch(0.16 0 275 / 14%),oklch(1 0 0 / 16%));
--vibeui-contact-anim-001-card:light-dark(oklch(1 0 0),oklch(0.24 0 275));
--vibeui-contact-anim-001-accent:light-dark(oklch(0.54 0.17 275),oklch(0.72 0.15 275));
--vibeui-contact-anim-001-accent-fg:light-dark(oklch(0.99 0 275),oklch(0.18 0 275));
--vibeui-contact-anim-001-accent-soft:color-mix(in oklab,var(--vibeui-contact-anim-001-accent) 14%,transparent);
--vibeui-contact-anim-001-ring:color-mix(in oklab,var(--vibeui-contact-anim-001-accent) 24%,transparent);
--vibeui-contact-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-anim-001"]{color-scheme:dark}
[data-vibeui-block="contact-anim-001"]{
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-contact-anim-001-bg);
color:var(--vibeui-contact-anim-001-fg);
font-family:var(--vibeui-contact-anim-001-font);
}
[data-vibeui-block="contact-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="contact-anim-001"] [data-part="shell"]{
width:100%;max-width:64rem;margin:0 auto;padding:clamp(2.5rem,6cqi,5rem) clamp(1.25rem,5cqi,3rem);
}
[data-vibeui-block="contact-anim-001"] [data-part="head"]{margin:0 0 clamp(1.75rem,4cqi,2.75rem)}
[data-vibeui-block="contact-anim-001"] [data-part="eyebrow"]{
display:inline-flex;align-items:center;gap:0.4375rem;margin:0 0 0.875rem;padding:0.3125rem 0.75rem;
border-radius:9999px;border:1px solid var(--vibeui-contact-anim-001-border);
font-size:0.75rem;font-weight:600;letter-spacing:0.01em;color:var(--vibeui-contact-anim-001-muted);
}
[data-vibeui-block="contact-anim-001"] [data-part="pip"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-contact-anim-001-accent);
}
[data-vibeui-block="contact-anim-001"] h2{
margin:0;font-size:clamp(1.625rem,4.5cqi,2.75rem);line-height:1.08;letter-spacing:-0.02em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="contact-anim-001"] [data-part="lede"]{
margin:0.875rem 0 0;max-width:38rem;font-size:clamp(0.9375rem,1.5cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-contact-anim-001-muted);text-wrap:pretty;
}
[data-vibeui-block="contact-anim-001"] [data-part="grid"]{
display:grid;grid-template-columns:1fr;gap:clamp(2rem,5cqi,3.5rem);align-items:start;
}
[data-vibeui-block="contact-anim-001"] form{display:flex;flex-direction:column;gap:1.125rem;margin:0}
[data-vibeui-block="contact-anim-001"] [data-part="field"]{display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="contact-anim-001"] label{
font-size:0.8125rem;font-weight:600;color:var(--vibeui-contact-anim-001-fg);
}
[data-vibeui-block="contact-anim-001"] input,
[data-vibeui-block="contact-anim-001"] textarea{
width:100%;font:inherit;font-size:0.9375rem;color:inherit;
padding:0.6875rem 0.8125rem;border-radius:0.75rem;
border:1px solid var(--vibeui-contact-anim-001-border);
background:var(--vibeui-contact-anim-001-card);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="contact-anim-001"] textarea{min-height:7rem;resize:vertical}
[data-vibeui-block="contact-anim-001"] input::placeholder,
[data-vibeui-block="contact-anim-001"] textarea::placeholder{color:var(--vibeui-contact-anim-001-muted)}
[data-vibeui-block="contact-anim-001"] input:focus,
[data-vibeui-block="contact-anim-001"] textarea:focus{
outline:none;border-color:var(--vibeui-contact-anim-001-accent);
box-shadow:0 0 0 3px var(--vibeui-contact-anim-001-ring);
}
[data-vibeui-block="contact-anim-001"] [data-part="submit"]{
appearance:none;cursor:pointer;align-self:flex-start;
height:2.875rem;padding:0 1.5rem;border:0;border-radius:0.75rem;
background:var(--vibeui-contact-anim-001-accent);color:var(--vibeui-contact-anim-001-accent-fg);
font:inherit;font-size:0.9375rem;font-weight:650;
transition:background-color .16s ease,transform .16s ease;
}
[data-vibeui-block="contact-anim-001"] [data-part="submit"]:hover{
background:color-mix(in oklab,var(--vibeui-contact-anim-001-accent) 88%,black);transform:translateY(-1px);
}
[data-vibeui-block="contact-anim-001"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-contact-anim-001-accent);outline-offset:3px;
}
[data-vibeui-block="contact-anim-001"] [data-part="details"]{
list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1.375rem;
}
[data-vibeui-block="contact-anim-001"] [data-part="detail"]{display:flex;align-items:flex-start;gap:0.9375rem}
[data-vibeui-block="contact-anim-001"] [data-part="tile"]{
flex:none;width:2.75rem;height:2.75rem;border-radius:0.875rem;
display:flex;align-items:center;justify-content:center;
color:var(--vibeui-contact-anim-001-accent);
background:var(--vibeui-contact-anim-001-accent-soft);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-contact-anim-001-accent) 22%,transparent);
transform-origin:center;
}
[data-vibeui-block="contact-anim-001"] [data-part="tile"] svg{width:1.25rem;height:1.25rem}
[data-vibeui-block="contact-anim-001"] [data-part="dlabel"]{
margin:0.1875rem 0 0.1875rem;font-size:0.75rem;font-weight:600;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-contact-anim-001-muted);
}
[data-vibeui-block="contact-anim-001"] [data-part="dvalue"]{
margin:0;font-size:0.9375rem;font-weight:600;line-height:1.4;color:var(--vibeui-contact-anim-001-fg);
}
/* Въезд формы: заголовок и поля всплывают со сдвигом, стаггер — задержкой. */
[data-vibeui-block="contact-anim-001"] [data-part="head"],
[data-vibeui-block="contact-anim-001"] [data-part="field"],
[data-vibeui-block="contact-anim-001"] [data-part="submit"]{
animation:vibeui-contact-anim-001-rise .55s cubic-bezier(0.16,1,0.3,1) both;
}
[data-vibeui-block="contact-anim-001"] [data-part="field"]:nth-of-type(1){animation-delay:.1s}
[data-vibeui-block="contact-anim-001"] [data-part="field"]:nth-of-type(2){animation-delay:.17s}
[data-vibeui-block="contact-anim-001"] [data-part="field"]:nth-of-type(3){animation-delay:.24s}
[data-vibeui-block="contact-anim-001"] [data-part="submit"]{animation-delay:.31s}
/* Плитки-иконки выскакивают с лёгким перелётом, стаггер после формы. */
[data-vibeui-block="contact-anim-001"] [data-part="tile"]{
animation:vibeui-contact-anim-001-pop .5s cubic-bezier(0.34,1.56,0.64,1) both;
}
[data-vibeui-block="contact-anim-001"] [data-part="detail"]:nth-child(1) [data-part="tile"]{animation-delay:.4s}
[data-vibeui-block="contact-anim-001"] [data-part="detail"]:nth-child(2) [data-part="tile"]{animation-delay:.5s}
[data-vibeui-block="contact-anim-001"] [data-part="detail"]:nth-child(3) [data-part="tile"]{animation-delay:.6s}
[data-vibeui-block="contact-anim-001"] [data-part="detail"]:nth-child(4) [data-part="tile"]{animation-delay:.7s}
@keyframes vibeui-contact-anim-001-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes vibeui-contact-anim-001-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
@container (min-width:48rem){
[data-vibeui-block="contact-anim-001"] [data-part="grid"]{grid-template-columns:1.1fr 0.9fr}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="contact-anim-001"] *{animation:none!important;transition:none!important}
}
`

const ICONS: Record<ContactAnim001Detail["icon"], ReactElement> = {
  address: (
    <>
      <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </>
  ),
  phone: (
    <path d="M6.5 3h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2Z" />
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
}

const DEFAULT_DETAILS: ContactAnim001Detail[] = [
  { icon: "address", label: "Адрес", value: "Москва, ул. Примерная, 12" },
  { icon: "phone", label: "Телефон", value: "+7 999 123-45-67" },
  { icon: "email", label: "Email", value: "hello@example.com" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
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
 * Секция «Контакты»: форма слева, способы связи справа. Один файл, ноль
 * зависимостей, собственная палитра. Обработчика отправки нет — форма чисто
 * разметочная, экшен подключает проект-хозяин.
 */
export function ContactAnim001({
  eyebrow = "Связаться",
  title = "Расскажите о вашем проекте",
  description = "Заполните форму — ответим в течение рабочего дня. Или напишите нам напрямую по контактам справа.",
  nameLabel = "Имя",
  emailLabel = "Email",
  messageLabel = "Сообщение",
  submitLabel = "Отправить",
  details = DEFAULT_DETAILS,
  accent,
  background = "",
  className,
  style,
}: ContactAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-contact-anim-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contact-anim-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-anim-001"
        data-slot="contact"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <header data-part="head">
            {eyebrow ? (
              <p data-part="eyebrow">
                <span data-part="pip" aria-hidden="true" />
                {eyebrow}
              </p>
            ) : null}
            <h2>{title}</h2>
            {description ? <p data-part="lede">{description}</p> : null}
          </header>

          <div data-part="grid">
            <form aria-label={title}>
              <div data-part="field">
                <label htmlFor="vibeui-contact-anim-001-name">{nameLabel}</label>
                <input
                  id="vibeui-contact-anim-001-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                />
              </div>
              <div data-part="field">
                <label htmlFor="vibeui-contact-anim-001-email">
                  {emailLabel}
                </label>
                <input
                  id="vibeui-contact-anim-001-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                />
              </div>
              <div data-part="field">
                <label htmlFor="vibeui-contact-anim-001-message">
                  {messageLabel}
                </label>
                <textarea
                  id="vibeui-contact-anim-001-message"
                  name="message"
                  rows={4}
                />
              </div>
              <button data-part="submit" type="submit">
                {submitLabel}
              </button>
            </form>

            <ul data-part="details">
              {details.map((detail) => (
                <li data-part="detail" key={`${detail.icon}-${detail.label}`}>
                  <span data-part="tile" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {ICONS[detail.icon]}
                    </svg>
                  </span>
                  <div>
                    <p data-part="dlabel">{detail.label}</p>
                    <p data-part="dvalue">{detail.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
