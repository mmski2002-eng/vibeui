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
const STYLES = `
:where([data-vibeui-block="auth-001"]){
--vibeui-auth-001-bg:oklch(1 0 0);
--vibeui-auth-001-fg:oklch(0.22 0.014 265);
--vibeui-auth-001-muted:oklch(0.55 0.014 265);
--vibeui-auth-001-border:oklch(0.9 0.006 265);
--vibeui-auth-001-accent:oklch(0.55 0.2 262);
--vibeui-auth-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-001"]{
width:100%;max-width:23rem;box-sizing:border-box;padding:1.25rem;
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
border:solid oklch(1 0 0);border-width:0 2px 2px 0;transform:rotate(45deg);
}
/* Главное действие занимает всю ширину: на этом экране оно одно. */
[data-vibeui-block="auth-001"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.625rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-001-accent);color:oklch(1 0 0);
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
  accent,
  className,
  style,
}: Auth001Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-001-accent": accent } : null),
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
              placeholder="name@company.ru"
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
            Не выходить на этом устройстве
          </label>

          <button type="submit" data-part="submit">
            {submit}
          </button>
        </form>

        <p data-part="or">или</p>

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
