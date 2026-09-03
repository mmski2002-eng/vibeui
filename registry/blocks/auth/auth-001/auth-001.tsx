import type { CSSProperties } from "react"

export type Auth001Props = {
  title?: string
  lead?: string
  emailLabel?: string
  passwordLabel?: string
  forgot?: string
  submit?: string
  providers?: string[]
  switchText?: string
  switchLink?: string
  /** Подпись флажка «не выходить»: компонент несёт русскую. */
  keepLabel?: string
  /** Слово в разделителе перед входом через сервисы. */
  orLabel?: string
  emailPlaceholder?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: вход. Поля помечены autocomplete-подсказками username и
// current-password — без них менеджеры паролей не подставляют данные, и человек
// вводит всё руками. Ссылка «забыли пароль» стоит рядом с полем пароля, а не в
// подвале: её ищут именно в момент неудачи. Вход через сервисы вынесен ниже
// формы и отделён разделителем: сверху он перехватывает внимание у тех, кто
// уже завёл пароль. Кнопка занимает всю ширину — это главное действие экрана.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="auth-001"]){
--vibeui-auth-001-bg:transparent;
--vibeui-auth-001-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-auth-001-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.013 265));
--vibeui-auth-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.011 265));
--vibeui-auth-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-auth-001-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-auth-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-001"]{color-scheme:dark}
[data-vibeui-block="auth-001"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:23rem;box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-auth-001-bg);
border:1px solid var(--vibeui-auth-001-border);border-radius:1rem;
font-family:var(--vibeui-auth-001-sans);color:var(--vibeui-auth-001-fg);
}
[data-vibeui-block="auth-001"] *{box-sizing:border-box}
[data-vibeui-block="auth-001"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="auth-001"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-auth-001-muted)}
[data-vibeui-block="auth-001"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.75rem}
[data-vibeui-block="auth-001"] [data-part="row"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="auth-001"] label{font-size:0.8125rem;font-weight:600}
/* «Забыли пароль» рядом с полем: её ищут именно в момент неудачи. */
[data-vibeui-block="auth-001"] [data-part="forgot"]{font-size:0.75rem;color:var(--vibeui-auth-001-accent)}
[data-vibeui-block="auth-001"] input{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-001-border);border-radius:0.625rem;
background:var(--vibeui-auth-001-bg);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-001"] input:focus-visible{outline:2px solid var(--vibeui-auth-001-accent);outline-offset:1px;border-color:var(--vibeui-auth-001-accent)}
[data-vibeui-block="auth-001"] [data-part="keep"]{
display:flex;align-items:center;gap:0.5rem;margin:0 0 0.875rem;
font-size:0.8125rem;
}
[data-vibeui-block="auth-001"] input[type="checkbox"]{
appearance:none;position:relative;flex:none;cursor:pointer;
width:1.0625rem;height:1.0625rem;padding:0;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-auth-001-muted);
}
[data-vibeui-block="auth-001"] input[type="checkbox"]:checked{
background:var(--vibeui-auth-001-accent);border-color:var(--vibeui-auth-001-accent);
}
[data-vibeui-block="auth-001"] input[type="checkbox"]:checked::after{
content:"";position:absolute;left:0.3rem;top:0.1rem;
width:0.2rem;height:0.45rem;
border:solid var(--vibeui-auth-001-on-accent);border-width:0 2px 2px 0;transform:rotate(45deg);
}
/* Главное действие занимает всю ширину: на этом экране оно одно. */
[data-vibeui-block="auth-001"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.625rem;padding:0.375rem 1rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-001-accent);color:var(--vibeui-auth-001-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-001"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-001-accent);outline-offset:2px}
/* Вход через сервисы ниже формы: сверху он перехватывает внимание. */
[data-vibeui-block="auth-001"] [data-part="or"]{
display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:0.625rem;
margin:0.875rem 0;font-size:0.6875rem;color:var(--vibeui-auth-001-muted);
}
[data-vibeui-block="auth-001"] [data-part="or"]::before,
[data-vibeui-block="auth-001"] [data-part="or"]::after{content:"";height:1px;background:var(--vibeui-auth-001-border)}
[data-vibeui-block="auth-001"] [data-part="providers"]{display:grid;gap:0.5rem}
[data-vibeui-block="auth-001"] [data-part="provider"]{
appearance:none;cursor:pointer;height:2.375rem;
border:1px solid var(--vibeui-auth-001-border);border-radius:0.625rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="auth-001"] [data-part="provider"]:focus-visible{outline:2px solid var(--vibeui-auth-001-accent);outline-offset:2px}
[data-vibeui-block="auth-001"] [data-part="switch"]{
margin:1rem 0 0;text-align:center;font-size:0.8125rem;color:var(--vibeui-auth-001-muted);
}
[data-vibeui-block="auth-001"] [data-part="switch"] a{color:var(--vibeui-auth-001-accent);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-001"] *{animation:none!important;transition:none!important}}
`

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
 * Вход: подсказки для менеджеров паролей и «забыли пароль» рядом с полем.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth001({
  title = "Вход в VibeUI",
  lead = "Каталог, ключи доступа и история установок вашего проекта.",
  emailLabel = "Почта",
  passwordLabel = "Пароль",
  forgot = "Забыли пароль?",
  submit = "Войти",
  providers = ["Продолжить с Google", "Продолжить с GitHub"],
  switchText = "Нет аккаунта?",
  switchLink = "Создать",
  keepLabel = "Не выходить на этом устройстве",
  orLabel = "или",
  emailPlaceholder = "name@company.ru",
  background = "",
  accent,
  className,
  style,
}: Auth001Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-001"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <p data-part="lead">{lead}</p>

        <form>
          <div data-part="field">
            <label htmlFor="vibeui-auth-001-email">{emailLabel}</label>
            <input
              id="vibeui-auth-001-email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder={emailPlaceholder}
              required
            />
          </div>

          <div data-part="field">
            <span data-part="row">
              <label htmlFor="vibeui-auth-001-password">{passwordLabel}</label>
              <a data-part="forgot" href="#">
                {forgot}
              </a>
            </span>
            <input
              id="vibeui-auth-001-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <label data-part="keep">
            <input type="checkbox" defaultChecked />
            {keepLabel}
          </label>

          <button type="submit" data-part="submit">
            {submit}
          </button>
        </form>

        <p data-part="or">{orLabel}</p>

        <div data-part="providers">
          {providers.map((provider) => (
            <button key={provider} type="button" data-part="provider">
              {provider}
            </button>
          ))}
        </div>

        <p data-part="switch">
          {switchText} <a href="#">{switchLink}</a>
        </p>
      </section>
    </>
  )
}
