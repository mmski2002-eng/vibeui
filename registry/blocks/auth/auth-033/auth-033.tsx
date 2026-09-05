import type { CSSProperties } from "react"

export type Auth033Props = {
  brand?: string
  badge?: string
  title?: string
  lead?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  forgotText?: string
  submit?: string
  dividerText?: string
  passkeyText?: string
  switchText?: string
  switchLink?: string
  footnote?: string
  /** Первый цвет фонового поля: от него считаются пятна и подсветка стекла. */
  hue?: string
  /** Второй цвет фонового поля. */
  hueEnd?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: цветное поле во всю ширину кадра и полупрозрачная карточка
// поверх него. Работает именно связка — размытые пятна за стеклом дают
// backdrop-filter то, что он должен размывать; на плоской заливке приём
// выглядит просто как серая плашка.
//
// Стекло собрано из трёх слоёв: backdrop-filter размывает фон, полупрозрачная
// заливка задаёт светлоту, а внутренняя светлая линия по верхней кромке
// изображает толщину. Без третьего карточка читается как дырка, а не как
// материал.
//
// Палитра задана явно тёмной и не переворачивается по теме: цветное поле —
// суть блока, а не ветка окружения. color-scheme:dark зафиксирован, чтобы
// поля ввода внутри стекла остались тёмными на светлой странице-хозяине.
const STYLES = `
:where([data-vibeui-block="auth-033"]){
--vibeui-auth-033-hue:#4c2fd6;
--vibeui-auth-033-hue-end:#0b1030;
--vibeui-auth-033-ink:#f4f5ff;
--vibeui-auth-033-dim:rgb(244 245 255 / 68%);
--vibeui-auth-033-glass:rgb(255 255 255 / 10%);
--vibeui-auth-033-edge:rgb(255 255 255 / 22%);
--vibeui-auth-033-field:rgb(255 255 255 / 12%);
--vibeui-auth-033-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
color-scheme:dark;
}
[data-vibeui-block="auth-033"]{
position:relative;isolation:isolate;overflow:hidden;
min-width:min(100%,17rem);
box-sizing:border-box;
border-radius:1.25rem;
font-family:var(--vibeui-auth-033-font);
color:var(--vibeui-auth-033-ink);
background:linear-gradient(150deg,var(--vibeui-auth-033-hue),var(--vibeui-auth-033-hue-end) 78%);
}
[data-vibeui-block="auth-033"] *{box-sizing:border-box}
/* Пятна за стеклом: без них backdrop-filter нечего размывать. */
[data-vibeui-block="auth-033"] [data-part="field-art"]{
position:absolute;inset:0;z-index:-1;pointer-events:none;
background:
radial-gradient(32% 42% at 16% 22%,color-mix(in oklab,var(--vibeui-auth-033-hue) 90%,#ffffff) ,transparent 68%),
radial-gradient(30% 40% at 86% 14%,#ff5fa2,transparent 66%),
radial-gradient(38% 46% at 74% 96%,#22d3ee,transparent 68%),
radial-gradient(26% 34% at 40% 88%,#f8b34a,transparent 70%);
filter:blur(6px);
opacity:0.85;
}
/* Тонкая сетка поверх пятен: даёт краю стекла что искажать. */
[data-vibeui-block="auth-033"] [data-part="grid"]{
position:absolute;inset:0;z-index:-1;pointer-events:none;
background-image:
linear-gradient(rgb(255 255 255 / 7%) 1px,transparent 1px),
linear-gradient(90deg,rgb(255 255 255 / 7%) 1px,transparent 1px);
background-size:3rem 3rem;
mask-image:radial-gradient(120% 90% at 50% 0%,#000 20%,transparent 80%);
}
[data-vibeui-block="auth-033"] [data-part="frame"]{
display:flex;flex-direction:column;gap:1.5rem;
padding:1.5rem 1.25rem;
}
[data-vibeui-block="auth-033"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
}
[data-vibeui-block="auth-033"] [data-part="mark"]{
display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="auth-033"] [data-part="chip"]{
display:inline-block;width:1.25rem;height:1.25rem;border-radius:0.5rem;
background:rgb(255 255 255 / 88%);
}
[data-vibeui-block="auth-033"] [data-part="badge"]{
padding:0.25rem 0.625rem;border-radius:9999px;
border:1px solid var(--vibeui-auth-033-edge);
background:rgb(255 255 255 / 10%);
font-size:0.6875rem;font-weight:600;letter-spacing:0.02em;
}
[data-vibeui-block="auth-033"] [data-part="card"]{
width:100%;max-width:24rem;margin:0 auto;
padding:1.5rem 1.375rem;
border:1px solid var(--vibeui-auth-033-edge);border-radius:1.25rem;
background:var(--vibeui-auth-033-glass);
/* Собственно стекло. -webkit- нужен Safari: без него карточка станет
   просто полупрозрачной плашкой. */
-webkit-backdrop-filter:blur(22px) saturate(180%);
backdrop-filter:blur(22px) saturate(180%);
box-shadow:
inset 0 1px 0 rgb(255 255 255 / 34%),
0 24px 48px -28px rgb(4 6 24 / 62%);
}
[data-vibeui-block="auth-033"] h2{
margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em;line-height:1.15;
color:var(--vibeui-auth-033-ink);
}
[data-vibeui-block="auth-033"] [data-part="lead"]{
margin:0 0 1.25rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-auth-033-dim);
}
[data-vibeui-block="auth-033"] [data-part="field"]{
display:flex;flex-direction:column;gap:0.375rem;margin-bottom:0.875rem;min-inline-size:0;
}
[data-vibeui-block="auth-033"] [data-part="row"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="auth-033"] label{
font-size:0.8125rem;font-weight:600;color:var(--vibeui-auth-033-ink);
}
[data-vibeui-block="auth-033"] [data-part="forgot"]{
font-size:0.75rem;font-weight:600;color:var(--vibeui-auth-033-ink);
}
[data-vibeui-block="auth-033"] input{
width:100%;min-inline-size:0;min-height:2.625rem;padding:0.5rem 0.75rem;
border:1px solid var(--vibeui-auth-033-edge);border-radius:0.75rem;
background:var(--vibeui-auth-033-field);color:var(--vibeui-auth-033-ink);
font:inherit;font-size:0.875rem;
transition:border-color 120ms ease,background-color 120ms ease;
}
[data-vibeui-block="auth-033"] input::placeholder{color:var(--vibeui-auth-033-dim)}
[data-vibeui-block="auth-033"] input:focus-visible{
outline:2px solid rgb(255 255 255 / 78%);outline-offset:1px;
border-color:rgb(255 255 255 / 60%);
}
[data-vibeui-block="auth-033"] [data-part="submit"]{
width:100%;margin-top:0.5rem;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.5rem 1rem;
border:0;border-radius:0.75rem;
background:rgb(255 255 255 / 94%);color:#171a3a;
font:inherit;font-size:0.9375rem;font-weight:650;
transition:filter 120ms ease;
}
[data-vibeui-block="auth-033"] [data-part="submit"]:hover{filter:brightness(0.94)}
[data-vibeui-block="auth-033"] [data-part="submit"]:focus-visible{
outline:2px solid rgb(255 255 255 / 88%);outline-offset:2px;
}
[data-vibeui-block="auth-033"] [data-part="divider"]{
display:flex;align-items:center;gap:0.75rem;
margin:1rem 0;font-size:0.6875rem;color:var(--vibeui-auth-033-dim);
}
[data-vibeui-block="auth-033"] [data-part="divider"]::before,
[data-vibeui-block="auth-033"] [data-part="divider"]::after{
content:"";flex:1;height:1px;background:var(--vibeui-auth-033-edge);
}
[data-vibeui-block="auth-033"] [data-part="passkey"]{
width:100%;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-height:2.625rem;padding:0.5rem 1rem;
border:1px solid var(--vibeui-auth-033-edge);border-radius:0.75rem;
background:rgb(255 255 255 / 10%);color:var(--vibeui-auth-033-ink);
font:inherit;font-size:0.8125rem;font-weight:600;
transition:background-color 120ms ease;
}
[data-vibeui-block="auth-033"] [data-part="passkey"]:hover{background:rgb(255 255 255 / 18%)}
[data-vibeui-block="auth-033"] [data-part="passkey"]:focus-visible{
outline:2px solid rgb(255 255 255 / 88%);outline-offset:2px;
}
[data-vibeui-block="auth-033"] [data-part="switch"]{
margin:1rem 0 0;text-align:center;font-size:0.8125rem;color:var(--vibeui-auth-033-dim);
}
[data-vibeui-block="auth-033"] [data-part="switch"] a{
color:var(--vibeui-auth-033-ink);font-weight:650;
}
[data-vibeui-block="auth-033"] [data-part="foot"]{
margin:0;text-align:center;font-size:0.6875rem;color:var(--vibeui-auth-033-dim);
}
[data-vibeui-block="auth-033"] a:focus-visible{
outline:2px solid rgb(255 255 255 / 88%);outline-offset:2px;border-radius:0.25rem;
}
@container (min-width: 40rem){
[data-vibeui-block="auth-033"] [data-part="frame"]{padding:2.5rem 2.25rem;gap:2.25rem;min-height:26rem}
[data-vibeui-block="auth-033"] [data-part="card"]{padding:2rem 1.875rem;max-width:25rem}
[data-vibeui-block="auth-033"] [data-part="field-art"]{filter:blur(2px)}
}
/* Размытие фона стоит дорого и на слабой машине даёт рывки при прокрутке;
   при выключенной анимации оставляем плотную заливку. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="auth-033"] *{animation:none!important;transition:none!important}
}
`

/**
 * Стеклянная карточка входа: полупрозрачная форма с backdrop-filter поверх
 * цветного поля с размытыми пятнами. Один файл, ноль зависимостей.
 */
export function Auth033({
  brand = "VibeUI",
  badge = "Бета",
  title = "Вход",
  lead = "Продолжите с того места, где остановились.",
  emailLabel = "Почта",
  emailPlaceholder = "name@company.ru",
  passwordLabel = "Пароль",
  forgotText = "Забыли?",
  submit = "Войти",
  dividerText = "или",
  passkeyText = "Войти ключом доступа",
  switchText = "Нет аккаунта?",
  switchLink = "Создать",
  footnote = "Защищено сквозным шифрованием",
  hue,
  hueEnd,
  className,
  style,
}: Auth033Props) {
  const palette = {
    ...(hue ? { "--vibeui-auth-033-hue": hue } : null),
    ...(hueEnd ? { "--vibeui-auth-033-hue-end": hueEnd } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-033" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-033"
        className={className}
        style={palette}
        aria-label={title}
      >
        <span data-part="field-art" aria-hidden="true" />
        <span data-part="grid" aria-hidden="true" />
        <div data-part="frame">
          <header data-part="bar">
            <span data-part="mark">
              <span data-part="chip" aria-hidden="true" />
              {brand}
            </span>
            <span data-part="badge">{badge}</span>
          </header>

          <div data-part="card">
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
            <form>
              <div data-part="field">
                <label htmlFor="vibeui-auth-033-email">{emailLabel}</label>
                <input
                  id="vibeui-auth-033-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder={emailPlaceholder}
                  required
                />
              </div>
              <div data-part="field">
                <span data-part="row">
                  <label htmlFor="vibeui-auth-033-password">
                    {passwordLabel}
                  </label>
                  <a href="#" data-part="forgot">
                    {forgotText}
                  </a>
                </span>
                <input
                  id="vibeui-auth-033-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" data-part="submit">
                {submit}
              </button>
            </form>

            <p data-part="divider">
              <span>{dividerText}</span>
            </p>
            <button type="button" data-part="passkey">
              {passkeyText}
            </button>

            <p data-part="switch">
              {switchText} <a href="#">{switchLink}</a>
            </p>
          </div>

          <p data-part="foot">{footnote}</p>
        </div>
      </section>
    </>
  )
}
