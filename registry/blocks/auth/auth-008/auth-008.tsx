import type { CSSProperties } from "react"

export type Auth008Provider = {
  name: string
  mark: string
  last?: boolean
}

export type Auth008Props = {
  title?: string
  lead?: string
  providers?: Auth008Provider[]
  divider?: string
  submit?: string
  legal?: string
  /** Подпись у сервиса, которым заходили в прошлый раз. */
  lastLabel?: string
  legalLink?: string
  emailLabel?: string
  emailPlaceholder?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: вход через сервисы стоит первым, а почта — запасным путём.
// Так делают там, где почти все заходят через рабочий аккаунт: длинный список
// кнопок под формой человек пролистывает и заводит третий пароль. Один
// провайдер помечен подписью «в прошлый раз» — без неё люди регулярно
// создают второй аккаунт на той же почте через другой сервис. Разделитель
// собран гридом из двух линий, а не фоном под словом: фон рвётся на тёмной
// подложке и не тянется по ширине.
//
// Демонстрация интерфейса: кнопки никуда не ведут, редиректы за вызывающим кодом.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не выкладывает под себя плашку — подложка приходит
// пропом background.
const STYLES = `
:where([data-vibeui-block="auth-008"]){
--vibeui-auth-008-bg:transparent;
--vibeui-auth-008-card:light-dark(oklch(1 0 0),oklch(0.22 0.013 265));
--vibeui-auth-008-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-auth-008-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.013 265));
--vibeui-auth-008-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.011 265));
--vibeui-auth-008-accent:light-dark(oklch(0.52 0.16 275),oklch(0.74 0.14 275));
--vibeui-auth-008-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-auth-008-accent-wash:light-dark(oklch(0.52 0.16 275 / 5%),oklch(0.74 0.14 275 / 12%));
--vibeui-auth-008-accent-chip:light-dark(oklch(0.52 0.16 275 / 12%),oklch(0.74 0.14 275 / 20%));
--vibeui-auth-008-chip:light-dark(oklch(0.55 0.02 265 / 10%),oklch(0.85 0.02 265 / 14%));
--vibeui-auth-008-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-008"]{color-scheme:dark}
[data-vibeui-block="auth-008"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-008-bg);color:var(--vibeui-auth-008-fg);
font-family:var(--vibeui-auth-008-sans);
}
[data-vibeui-block="auth-008"] *{box-sizing:border-box}
[data-vibeui-block="auth-008"] [data-part="shell"]{
width:100%;max-width:23rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-008-card);
border:1px solid var(--vibeui-auth-008-border);border-radius:1rem;
}
@container (min-width: 40rem){
[data-vibeui-block="auth-008"] [data-part="shell"]{max-width:25rem;padding:2rem}
[data-vibeui-block="auth-008"] [data-part="providers"]{gap:0.625rem}
}
[data-vibeui-block="auth-008"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em;text-align:center}
[data-vibeui-block="auth-008"] [data-part="lead"]{margin:0 0 1.25rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-008-muted);text-align:center}
[data-vibeui-block="auth-008"] [data-part="providers"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="auth-008"] [data-part="provider"]{
position:relative;display:flex;align-items:center;gap:0.625rem;
width:100%;height:2.75rem;padding:0 0.875rem;
appearance:none;cursor:pointer;
border:1px solid var(--vibeui-auth-008-border);border-radius:0.75rem;
background:var(--vibeui-auth-008-card);color:inherit;
font:inherit;font-size:0.875rem;font-weight:600;text-align:left;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="auth-008"] [data-part="provider"]:hover{border-color:var(--vibeui-auth-008-accent);background:var(--vibeui-auth-008-accent-wash)}
[data-vibeui-block="auth-008"] [data-part="provider"]:focus-visible{outline:2px solid var(--vibeui-auth-008-accent);outline-offset:2px}
[data-vibeui-block="auth-008"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:0.5rem;
background:var(--vibeui-auth-008-chip);font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="auth-008"] [data-part="last"]{
margin-left:auto;padding:0.125rem 0.4375rem;border-radius:9999px;
background:var(--vibeui-auth-008-accent-chip);color:var(--vibeui-auth-008-accent);
font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="auth-008"] [data-part="divider"]{
display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:0.75rem;
margin:1.125rem 0;font-size:0.75rem;color:var(--vibeui-auth-008-muted);
}
[data-vibeui-block="auth-008"] [data-part="divider"]::before,
[data-vibeui-block="auth-008"] [data-part="divider"]::after{
content:"";height:1px;background:var(--vibeui-auth-008-border);
}
[data-vibeui-block="auth-008"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.75rem}
[data-vibeui-block="auth-008"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-008"] input{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-008-border);border-radius:0.625rem;
background:var(--vibeui-auth-008-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-008"] input:focus-visible{outline:2px solid var(--vibeui-auth-008-accent);outline-offset:1px;border-color:var(--vibeui-auth-008-accent)}
[data-vibeui-block="auth-008"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.625rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-008-accent);color:var(--vibeui-auth-008-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-008"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-008-accent);outline-offset:2px}
[data-vibeui-block="auth-008"] [data-part="legal"]{
margin:1rem 0 0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-auth-008-muted);text-align:center;
}
[data-vibeui-block="auth-008"] [data-part="legal"] a{color:var(--vibeui-auth-008-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PROVIDERS: Auth008Provider[] = [
  { name: "Продолжить с Google", mark: "G", last: true },
  { name: "Продолжить с GitHub", mark: "GH" },
  { name: "Продолжить с рабочим SSO", mark: "SSO" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Вход через сервисы первым экраном, почта — под разделителем «или».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth008({
  title = "Войти в VibeUI",
  lead = "Через рабочий аккаунт — быстрее и без нового пароля.",
  providers = DEFAULT_PROVIDERS,
  divider = "или по почте",
  submit = "Прислать ссылку для входа",
  legal = "Продолжая, вы соглашаетесь с условиями и политикой конфиденциальности.",
  lastLabel = "в прошлый раз",
  legalLink = "Подробнее",
  emailLabel = "Почта",
  emailPlaceholder = "name@company.ru",
  background = "",
  accent,
  className,
  style,
}: Auth008Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-008"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <div data-part="providers">
            {providers.map((provider) => (
              <button
                key={provider.name}
                type="button"
                data-part="provider"
                aria-describedby={
                  provider.last ? "vibeui-auth-008-last" : undefined
                }
              >
                <span data-part="mark" aria-hidden="true">
                  {provider.mark}
                </span>
                <span>{provider.name}</span>
                {provider.last ? (
                  <span data-part="last" id="vibeui-auth-008-last">
                    {lastLabel}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <p data-part="divider">
            <span>{divider}</span>
          </p>

          <form>
            <div data-part="field">
              <label htmlFor="vibeui-auth-008-email">{emailLabel}</label>
              <input
                id="vibeui-auth-008-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder={emailPlaceholder}
                required
              />
            </div>
            <button type="submit" data-part="submit">
              {submit}
            </button>
          </form>

          <p data-part="legal">
            {legal} <a href="#">{legalLink}</a>
          </p>
        </div>
      </section>
    </>
  )
}
