import type { CSSProperties, ReactNode } from "react"

export type Auth032Props = {
  brand?: string
  helpText?: string
  title?: string
  lead?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  forgotText?: string
  rememberText?: string
  submit?: string
  dividerText?: string
  providers?: string[]
  switchText?: string
  switchLink?: string
  legal?: string[]
  accent?: string
  /** Цвет светлой подложки страницы: от него строится градиент и точки. */
  surface?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: светлый экран входа целиком, а не тёмная карточка на пустоте.
// Кадр держат три горизонтали — шапка с брендом, белая карточка на мягком
// градиенте и строка правовых ссылок внизу, — поэтому блок занимает всю
// ширину, а не стоит колонкой посередине.
//
// Палитра задана явно светлой и не переворачивается по теме: color-scheme
// зафиксирован, функция выбора ветки не используется. Это не забытая тёмная
// ветка, а суть блока — светлый вход остаётся светлым и на тёмной странице.
const STYLES = `
:where([data-vibeui-block="auth-032"]){
--vibeui-auth-032-accent:#3538cd;
--vibeui-auth-032-surface:#f4f6fb;
--vibeui-auth-032-card:#ffffff;
--vibeui-auth-032-fg:#141a2e;
--vibeui-auth-032-dim:#5b6478;
--vibeui-auth-032-line:#e3e7f0;
--vibeui-auth-032-field:#fbfcfe;
--vibeui-auth-032-on-accent:#ffffff;
--vibeui-auth-032-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
/* Блок светлый по замыслу: поля и полосы прокрутки внутри него обязаны
   остаться светлыми даже на тёмной странице-хозяине. */
color-scheme:light;
}
[data-vibeui-block="auth-032"]{
min-width:min(100%,17rem);
box-sizing:border-box;
font-family:var(--vibeui-auth-032-font);
color:var(--vibeui-auth-032-fg);
background:
radial-gradient(58% 42% at 50% 0%,#ffffff,transparent 70%),
radial-gradient(40% 34% at 12% 100%,color-mix(in oklab,var(--vibeui-auth-032-accent) 9%,transparent),transparent 72%),
var(--vibeui-auth-032-surface);
}
[data-vibeui-block="auth-032"] *{box-sizing:border-box}
[data-vibeui-block="auth-032"] [data-part="frame"]{
display:flex;flex-direction:column;gap:1.5rem;
padding:1.5rem 1.25rem;
}
[data-vibeui-block="auth-032"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
width:100%;max-width:72rem;margin:0 auto;
}
[data-vibeui-block="auth-032"] [data-part="mark"]{
display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="auth-032"] [data-part="chip"]{
display:inline-block;width:1.375rem;height:1.375rem;border-radius:0.5rem;
background:linear-gradient(135deg,var(--vibeui-auth-032-accent),color-mix(in oklab,var(--vibeui-auth-032-accent) 45%,#ffffff));
}
[data-vibeui-block="auth-032"] [data-part="help"]{
font-size:0.8125rem;font-weight:600;color:var(--vibeui-auth-032-dim);
}
[data-vibeui-block="auth-032"] [data-part="card"]{
width:100%;max-width:46rem;margin:0 auto;
padding:1.75rem 1.5rem;
background:var(--vibeui-auth-032-card);
border:1px solid var(--vibeui-auth-032-line);border-radius:1.25rem;
/* Аккуратные тени вместо рамки-обводки: светлая карточка держится
   на глубине, а не на контрасте линий. */
box-shadow:
0 1px 2px rgb(20 26 46 / 5%),
0 14px 28px -18px rgb(20 26 46 / 22%),
0 44px 64px -48px rgb(20 26 46 / 28%);
}
[data-vibeui-block="auth-032"] h2{
margin:0 0 0.375rem;font-size:1.5rem;font-weight:700;letter-spacing:-0.025em;line-height:1.15;
color:var(--vibeui-auth-032-fg);
}
[data-vibeui-block="auth-032"] [data-part="lead"]{
margin:0 0 1.5rem;font-size:0.875rem;line-height:1.5;color:var(--vibeui-auth-032-dim);
}
/* Поля стоят в две колонки: карточка широкая, и растянутая на всю её ширину
   строка ввода выглядела бы пустой. */
[data-vibeui-block="auth-032"] [data-part="fields"]{
display:grid;grid-template-columns:1fr;gap:0.875rem 1rem;
}
[data-vibeui-block="auth-032"] [data-part="field"]{
display:flex;flex-direction:column;gap:0.375rem;min-inline-size:0;
}
[data-vibeui-block="auth-032"] [data-part="row"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="auth-032"] label{
font-size:0.8125rem;font-weight:600;color:var(--vibeui-auth-032-fg);
}
[data-vibeui-block="auth-032"] [data-part="forgot"]{
font-size:0.75rem;font-weight:600;color:var(--vibeui-auth-032-accent);
}
[data-vibeui-block="auth-032"] input[type="email"],
[data-vibeui-block="auth-032"] input[type="password"]{
width:100%;min-inline-size:0;min-height:2.75rem;padding:0.5rem 0.875rem;
border:1px solid var(--vibeui-auth-032-line);border-radius:0.75rem;
background:var(--vibeui-auth-032-field);color:var(--vibeui-auth-032-fg);
font:inherit;font-size:0.875rem;
box-shadow:0 1px 1px rgb(20 26 46 / 4%) inset;
transition:border-color 120ms ease,box-shadow 120ms ease;
}
[data-vibeui-block="auth-032"] input::placeholder{color:#98a1b4}
[data-vibeui-block="auth-032"] input:focus-visible{
outline:2px solid var(--vibeui-auth-032-accent);outline-offset:1px;
border-color:var(--vibeui-auth-032-accent);
}
[data-vibeui-block="auth-032"] [data-part="remember"]{
display:flex;align-items:center;gap:0.5rem;margin-top:1rem;
font-size:0.8125rem;color:var(--vibeui-auth-032-dim);
}
[data-vibeui-block="auth-032"] [data-part="remember"] input{
width:1rem;height:1rem;margin:0;accent-color:var(--vibeui-auth-032-accent);
}
[data-vibeui-block="auth-032"] [data-part="submit"]{
width:100%;margin-top:1rem;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.875rem;padding:0.5rem 1rem;
border:0;border-radius:0.75rem;
background:var(--vibeui-auth-032-accent);color:var(--vibeui-auth-032-on-accent);
font:inherit;font-size:0.9375rem;font-weight:650;
box-shadow:0 6px 16px -8px color-mix(in oklab,var(--vibeui-auth-032-accent) 70%,transparent);
transition:filter 120ms ease;
}
[data-vibeui-block="auth-032"] [data-part="submit"]:hover{filter:brightness(1.08)}
[data-vibeui-block="auth-032"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-auth-032-accent);outline-offset:2px;
}
[data-vibeui-block="auth-032"] [data-part="divider"]{
display:flex;align-items:center;gap:0.75rem;
margin:1.25rem 0 1rem;font-size:0.75rem;color:var(--vibeui-auth-032-dim);
}
[data-vibeui-block="auth-032"] [data-part="divider"]::before,
[data-vibeui-block="auth-032"] [data-part="divider"]::after{
content:"";flex:1;height:1px;background:var(--vibeui-auth-032-line);
}
/* Ряд сервисов тоже работает на ширину карточки: три кнопки в строку. */
[data-vibeui-block="auth-032"] [data-part="providers"]{
display:grid;grid-template-columns:1fr;gap:0.625rem;
}
[data-vibeui-block="auth-032"] [data-part="provider"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-height:2.625rem;padding:0.5rem 0.875rem;min-inline-size:0;
border:1px solid var(--vibeui-auth-032-line);border-radius:0.75rem;
background:var(--vibeui-auth-032-card);color:var(--vibeui-auth-032-fg);
font:inherit;font-size:0.8125rem;font-weight:600;
transition:background-color 120ms ease;
}
[data-vibeui-block="auth-032"] [data-part="provider"]:hover{background:var(--vibeui-auth-032-field)}
[data-vibeui-block="auth-032"] [data-part="provider"]:focus-visible{
outline:2px solid var(--vibeui-auth-032-accent);outline-offset:2px;
}
[data-vibeui-block="auth-032"] [data-part="switch"]{
margin:1.25rem 0 0;text-align:center;font-size:0.8125rem;color:var(--vibeui-auth-032-dim);
}
[data-vibeui-block="auth-032"] [data-part="provider"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="auth-032"] [data-part="switch"] a{
color:var(--vibeui-auth-032-accent);font-weight:650;
}
[data-vibeui-block="auth-032"] [data-part="legal"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.375rem 1.25rem;
list-style:none;margin:0;padding:0;
font-size:0.75rem;color:var(--vibeui-auth-032-dim);
}
[data-vibeui-block="auth-032"] [data-part="legal"] a{color:inherit}
[data-vibeui-block="auth-032"] a:focus-visible{
outline:2px solid var(--vibeui-auth-032-accent);outline-offset:2px;border-radius:0.25rem;
}
@container (min-width: 34rem){
[data-vibeui-block="auth-032"] [data-part="frame"]{padding:2.5rem 2rem;gap:2.5rem;min-height:26rem;justify-content:space-between}
[data-vibeui-block="auth-032"] [data-part="card"]{padding:2.5rem 2.75rem}
[data-vibeui-block="auth-032"] [data-part="fields"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="auth-032"] [data-part="providers"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-032"] *{animation:none!important;transition:none!important}}
`

// Фирменные значки провайдеров подбираются по тексту кнопки: список
// провайдеров приходит строками, а значок без подписи бесполезен. Google —
// в своих цветах (логотип не перекрашивают), GitHub и Apple — currentColor.
const PROVIDER_ICONS: Record<string, ReactNode> = {
  google: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.55-5.17 3.55-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
      />
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
}

function providerIcon(label: string): ReactNode {
  const key = label.toLowerCase()
  const known = ["google", "github", "apple"].find((name) => key.includes(name))
  return known ? PROVIDER_ICONS[known] : null
}

const DEFAULT_PROVIDERS = ["Google", "Apple", "GitHub"]
const DEFAULT_LEGAL = ["Условия", "Приватность", "Поддержка"]

/**
 * Светлый экран входа: белая карточка с мягкими тенями на светлой странице
 * с шапкой и правовой строкой. Один файл, ноль зависимостей.
 */
export function Auth032({
  brand = "VibeUI",
  helpText = "Нужна помощь?",
  title = "Вход в рабочее пространство",
  lead = "Введите рабочую почту и пароль — остальное подтянется само.",
  emailLabel = "Рабочая почта",
  emailPlaceholder = "name@company.ru",
  passwordLabel = "Пароль",
  forgotText = "Забыли пароль?",
  rememberText = "Не выходить на этом устройстве",
  submit = "Войти",
  dividerText = "или продолжить через",
  providers = DEFAULT_PROVIDERS,
  switchText = "Впервые здесь?",
  switchLink = "Создать аккаунт",
  legal = DEFAULT_LEGAL,
  accent,
  surface,
  className,
  style,
}: Auth032Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-032-accent": accent } : null),
    ...(surface ? { "--vibeui-auth-032-surface": surface } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-032" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-032"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <header data-part="bar">
            <span data-part="mark">
              <span data-part="chip" aria-hidden="true" />
              {brand}
            </span>
            <a href="#" data-part="help">
              {helpText}
            </a>
          </header>

          <div data-part="card">
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
            <form>
              <div data-part="fields">
                <div data-part="field">
                  <label htmlFor="vibeui-auth-032-email">{emailLabel}</label>
                  <input
                    id="vibeui-auth-032-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder={emailPlaceholder}
                    required
                  />
                </div>
                <div data-part="field">
                  <span data-part="row">
                    <label htmlFor="vibeui-auth-032-password">
                      {passwordLabel}
                    </label>
                    <a href="#" data-part="forgot">
                      {forgotText}
                    </a>
                  </span>
                  <input
                    id="vibeui-auth-032-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              <label data-part="remember" htmlFor="vibeui-auth-032-remember">
                <input
                  id="vibeui-auth-032-remember"
                  name="remember"
                  type="checkbox"
                  defaultChecked
                />
                {rememberText}
              </label>
              <button type="submit" data-part="submit">
                {submit}
              </button>
            </form>

            <p data-part="divider">
              <span>{dividerText}</span>
            </p>
            <div data-part="providers">
              {providers.map((provider) => (
                <button key={provider} type="button" data-part="provider">
                  {providerIcon(provider)}
                  <span>{provider}</span>
                </button>
              ))}
            </div>

            <p data-part="switch">
              {switchText} <a href="#">{switchLink}</a>
            </p>
          </div>

          <ul data-part="legal">
            {legal.map((entry) => (
              <li key={entry}>
                <a href="#">{entry}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
