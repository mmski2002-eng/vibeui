import type { CSSProperties } from "react"

export type Auth030Props = {
  title?: string
  lead?: string
  passkeyText?: string
  hint?: string
  or?: string
  email?: string
  emailLabel?: string
  emailPlaceholder?: string
  submit?: string
  switchText?: string
  switchAction?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: вход ключом доступа — кнопка вызывает системный биометрический
// диалог, а не форму. Ключ стоит первым и один, потому что это желаемый путь;
// почта с паролем — свёрнутый запасной вариант под разделителем, а не
// равноправная альтернатива. Рядом с кнопкой ключа — пояснение, откуда он
// возьмётся (отпечаток, лицо или код устройства): без него кнопка неясна тому,
// кто не заводил ключ раньше.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
//
// Демонстрация интерфейса: вызов WebAuthn/passkey обязан реализовать вызывающий код.
const STYLES = `
:where([data-vibeui-block="auth-030"]){
--vibeui-auth-030-bg:transparent;
--vibeui-auth-030-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-auth-030-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-auth-030-muted:light-dark(oklch(0.53 0 265),oklch(0.71 0 265));
--vibeui-auth-030-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-auth-030-accent:light-dark(oklch(0.52 0.18 39.8),oklch(0.76 0.15 39.8));
--vibeui-auth-030-on-accent:oklch(0.15 0.02 39.8);
--vibeui-auth-030-soft:light-dark(oklch(0.52 0.18 39.8 / 8%),oklch(0.76 0.15 39.8 / 14%));
--vibeui-auth-030-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-030"]{color-scheme:dark}
[data-vibeui-block="auth-030"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-030-bg);color:var(--vibeui-auth-030-fg);
font-family:var(--vibeui-auth-030-sans);
}
[data-vibeui-block="auth-030"] *{box-sizing:border-box}
[data-vibeui-block="auth-030"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;padding:1.75rem 1.5rem;
background:var(--vibeui-auth-030-card);
border:1px solid var(--vibeui-auth-030-border);border-radius:1.125rem;
}
@container (min-width: 40rem){
[data-vibeui-block="auth-030"] [data-part="shell"]{max-width:26rem;padding:2.25rem 2rem}
}
[data-vibeui-block="auth-030"] h2{margin:0 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-030"] [data-part="lead"]{margin:0 0 1.25rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-030-muted)}
[data-vibeui-block="auth-030"] [data-part="passkey"]{
width:100%;appearance:none;cursor:pointer;
display:flex;align-items:center;gap:0.75rem;
min-height:3.25rem;padding:0.5rem 1rem;
border:0;border-radius:0.875rem;
background:var(--vibeui-auth-030-accent);color:var(--vibeui-auth-030-on-accent);
font:inherit;text-align:left;
}
[data-vibeui-block="auth-030"] [data-part="passkey"]:focus-visible{outline:2px solid var(--vibeui-auth-030-accent);outline-offset:2px}
[data-vibeui-block="auth-030"] [data-part="glyph"]{
flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:0.625rem;
background:color-mix(in oklab,var(--vibeui-auth-030-on-accent) 20%,transparent);
font-size:1.125rem;line-height:1;
}
[data-vibeui-block="auth-030"] [data-part="passkeytext"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="auth-030"] [data-part="passkeytitle"]{font-size:0.9375rem;font-weight:650}
[data-vibeui-block="auth-030"] [data-part="hint"]{margin:0.625rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-auth-030-muted)}
[data-vibeui-block="auth-030"] [data-part="or"]{
display:flex;align-items:center;gap:0.625rem;
margin:1.25rem 0;font-size:0.75rem;color:var(--vibeui-auth-030-muted);
}
[data-vibeui-block="auth-030"] [data-part="or"]::before,
[data-vibeui-block="auth-030"] [data-part="or"]::after{content:"";flex:1;height:1px;background:var(--vibeui-auth-030-border)}
[data-vibeui-block="auth-030"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.875rem}
[data-vibeui-block="auth-030"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-030"] input{
width:100%;height:2.625rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-030-border);border-radius:0.625rem;
background:var(--vibeui-auth-030-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-030"] input:focus-visible{outline:2px solid var(--vibeui-auth-030-accent);outline-offset:1px;border-color:var(--vibeui-auth-030-accent)}
[data-vibeui-block="auth-030"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.375rem 1rem;
border:1px solid var(--vibeui-auth-030-border);border-radius:0.625rem;
background:none;color:inherit;
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-030"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-030-accent);outline-offset:2px}
[data-vibeui-block="auth-030"] [data-part="switch"]{margin:1.125rem 0 0;font-size:0.8125rem;color:var(--vibeui-auth-030-muted);text-align:center}
[data-vibeui-block="auth-030"] [data-part="switch"] button{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-auth-030-accent);font:inherit;font-weight:650;text-decoration:underline;
}
[data-vibeui-block="auth-030"] [data-part="switch"] button:focus-visible{outline:2px solid var(--vibeui-auth-030-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-030"] *{animation:none!important;transition:none!important}}
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
 * Вход ключом доступа: кнопка вызова биометрии первой и почта с паролем
 * запасным путём под разделителем. Один файл, ноль зависимостей.
 */
export function Auth030({
  title = "Вход",
  lead = "Войдите ключом доступа, привязанным к этому устройству.",
  passkeyText = "Продолжить с ключом доступа",
  hint = "Устройство попросит отпечаток, лицо или код экрана блокировки — пароль вводить не придётся.",
  or = "или",
  email = "",
  emailLabel = "Почта",
  emailPlaceholder = "name@company.ru",
  submit = "Войти почтой и паролем",
  switchText = "Ключа пока нет?",
  switchAction = "Создать при следующем входе",
  background = "",
  accent,
  className,
  style,
}: Auth030Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-030-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-030-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-030" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-030"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <button type="button" data-part="passkey">
            <span data-part="glyph" aria-hidden="true">
              ⚿
            </span>
            <span data-part="passkeytext">
              <span data-part="passkeytitle">{passkeyText}</span>
            </span>
          </button>
          <p data-part="hint">{hint}</p>

          <p data-part="or">{or}</p>

          <form>
            <div data-part="field">
              <label htmlFor="vibeui-auth-030-email">{emailLabel}</label>
              <input
                id="vibeui-auth-030-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder={emailPlaceholder}
                defaultValue={email}
                required
              />
            </div>
            <button type="submit" data-part="submit">
              {submit}
            </button>
          </form>

          <p data-part="switch">
            {switchText} <button type="button">{switchAction}</button>
          </p>
        </div>
      </section>
    </>
  )
}
