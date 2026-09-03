"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth007Props = {
  title?: string
  lead?: string
  submit?: string
  forgot?: string
  switchText?: string
  switchLink?: string
  alertText?: string
  emailLabel?: string
  emailPlaceholder?: string
  emailHint?: string
  passwordLabel?: string
  passwordHint?: string
  showLabel?: string
  hideLabel?: string
  capsLabel?: string
  keepLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: вход почтой и паролем, где вся диагностика видна до отправки.
// Проверка запускается на blur, а не по каждой букве: подчёркивать «неверная
// почта» человеку, который набрал две буквы, — раздражение без пользы. Общая
// плашка ошибки над формой намеренно не говорит, что именно не подошло:
// разделение «нет такой почты» и «пароль неверен» превращает форму в перебор
// адресов. Caps Lock ловится на нажатии клавиши — самая частая причина
// «пароль не работает», которую человек не видит в точках.
//
// Демонстрация интерфейса: блок ничего не отправляет и никуда не ходит.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не выкладывает под себя плашку — подложка приходит
// пропом background.
const STYLES = `
:where([data-vibeui-block="auth-007"]){
--vibeui-auth-007-bg:transparent;
--vibeui-auth-007-card:light-dark(oklch(1 0 0),oklch(0.22 0.013 265));
--vibeui-auth-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-auth-007-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.013 265));
--vibeui-auth-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.011 265));
--vibeui-auth-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-auth-007-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-auth-007-danger:light-dark(oklch(0.55 0.19 25),oklch(0.75 0.15 25));
--vibeui-auth-007-danger-line:light-dark(oklch(0.55 0.19 25 / 30%),oklch(0.75 0.15 25 / 38%));
--vibeui-auth-007-danger-soft:light-dark(oklch(0.55 0.19 25 / 8%),oklch(0.75 0.15 25 / 14%));
--vibeui-auth-007-warn:light-dark(oklch(0.62 0.15 75),oklch(0.8 0.13 75));
--vibeui-auth-007-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-007"]{color-scheme:dark}
[data-vibeui-block="auth-007"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-007-bg);color:var(--vibeui-auth-007-fg);
font-family:var(--vibeui-auth-007-sans);
}
[data-vibeui-block="auth-007"] *{box-sizing:border-box}
[data-vibeui-block="auth-007"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-007-card);
border:1px solid var(--vibeui-auth-007-border);border-radius:1rem;
}
@container (min-width: 40rem){
[data-vibeui-block="auth-007"] [data-part="shell"]{padding:2rem;max-width:26rem}
}
[data-vibeui-block="auth-007"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-007"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-007-muted)}
[data-vibeui-block="auth-007"] [data-part="alert"]{
display:flex;gap:0.5rem;margin:0 0 1rem;padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-auth-007-danger-line);border-radius:0.625rem;
background:var(--vibeui-auth-007-danger-soft);
color:var(--vibeui-auth-007-danger);font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="auth-007"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.875rem}
[data-vibeui-block="auth-007"] [data-part="row"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="auth-007"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-007"] [data-part="forgot"]{font-size:0.75rem;color:var(--vibeui-auth-007-accent);text-decoration:none}
[data-vibeui-block="auth-007"] [data-part="forgot"]:hover{text-decoration:underline}
[data-vibeui-block="auth-007"] [data-part="wrap"]{position:relative;display:flex}
[data-vibeui-block="auth-007"] input{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-007-border);border-radius:0.625rem;
background:var(--vibeui-auth-007-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-007"] [data-part="wrap"] input{padding-right:4rem}
[data-vibeui-block="auth-007"] input:focus-visible{outline:2px solid var(--vibeui-auth-007-accent);outline-offset:1px;border-color:var(--vibeui-auth-007-accent)}
[data-vibeui-block="auth-007"] input[aria-invalid="true"]{border-color:var(--vibeui-auth-007-danger)}
[data-vibeui-block="auth-007"] [data-part="reveal"]{
position:absolute;top:0;right:0;height:2.5rem;padding:0 0.75rem;
appearance:none;border:0;background:none;cursor:pointer;
color:var(--vibeui-auth-007-accent);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="auth-007"] [data-part="reveal"]:focus-visible{outline:2px solid var(--vibeui-auth-007-accent);outline-offset:-2px;border-radius:0.5rem}
[data-vibeui-block="auth-007"] [data-part="hint"]{margin:0.3125rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-auth-007-danger)}
[data-vibeui-block="auth-007"] [data-part="caps"]{margin:0.3125rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-auth-007-warn)}
[data-vibeui-block="auth-007"] [data-part="keep"]{display:flex;align-items:center;gap:0.5rem;margin:0.25rem 0 1rem;font-size:0.8125rem}
[data-vibeui-block="auth-007"] [data-part="keep"] input{width:1rem;height:1rem;accent-color:var(--vibeui-auth-007-accent)}
[data-vibeui-block="auth-007"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.625rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-007-accent);color:var(--vibeui-auth-007-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="auth-007"] [data-part="submit"]:hover{filter:brightness(1.08)}
[data-vibeui-block="auth-007"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-007-accent);outline-offset:2px}
[data-vibeui-block="auth-007"] [data-part="switch"]{margin:1rem 0 0;font-size:0.8125rem;color:var(--vibeui-auth-007-muted);text-align:center}
[data-vibeui-block="auth-007"] [data-part="switch"] a{color:var(--vibeui-auth-007-accent);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-007"] *{animation:none!important;transition:none!important}}
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
 * Вход почтой и паролем с проверкой на blur, подсказкой Caps Lock
 * и одной общей плашкой ошибки. Один файл, ноль зависимостей.
 */
export function Auth007({
  title = "Вход в аккаунт",
  lead = "Почта и пароль — те же, что при регистрации.",
  submit = "Войти",
  forgot = "Забыли пароль?",
  switchText = "Ещё нет аккаунта?",
  switchLink = "Зарегистрироваться",
  alertText = "Почта или пароль не подходят. Проверьте раскладку и попробуйте ещё раз.",
  emailLabel = "Рабочая почта",
  emailPlaceholder = "name@company.ru",
  emailHint = "Похоже на опечатку: адрес выглядит как name@company.ru.",
  passwordLabel = "Пароль",
  passwordHint = "Пароль короче восьми знаков.",
  showLabel = "Показать",
  hideLabel = "Скрыть",
  capsLabel = "Включён Caps Lock.",
  keepLabel = "Не выходить на этом устройстве",
  background = "",
  accent,
  className,
  style,
}: Auth007Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [caps, setCaps] = useState(false)
  const [failed, setFailed] = useState(false)

  const emailBad = emailTouched && !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)
  const passwordBad = passwordTouched && password.length < 8

  const palette = {
    ...(accent ? { "--vibeui-auth-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-007"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          {failed ? (
            <p data-part="alert" role="alert">
              <span aria-hidden="true">!</span>
              <span>{alertText}</span>
            </p>
          ) : null}

          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              setEmailTouched(true)
              setPasswordTouched(true)
              setFailed(email.length > 0 && password.length > 0)
            }}
          >
            <div data-part="field">
              <label htmlFor="vibeui-auth-007-email">{emailLabel}</label>
              <input
                id="vibeui-auth-007-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder={emailPlaceholder}
                value={email}
                aria-invalid={emailBad || undefined}
                aria-describedby={
                  emailBad ? "vibeui-auth-007-email-hint" : undefined
                }
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setEmailTouched(true)}
              />
              {emailBad ? (
                <p data-part="hint" id="vibeui-auth-007-email-hint">
                  {emailHint}
                </p>
              ) : null}
            </div>

            <div data-part="field">
              <span data-part="row">
                <label htmlFor="vibeui-auth-007-password">
                  {passwordLabel}
                </label>
                <a data-part="forgot" href="#">
                  {forgot}
                </a>
              </span>
              <span data-part="wrap">
                <input
                  id="vibeui-auth-007-password"
                  name="password"
                  type={revealed ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  aria-invalid={passwordBad || undefined}
                  onChange={(event) => setPassword(event.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  onKeyUp={(event) =>
                    setCaps(event.getModifierState("CapsLock"))
                  }
                />
                <button
                  type="button"
                  data-part="reveal"
                  aria-pressed={revealed}
                  onClick={() => setRevealed((shown) => !shown)}
                >
                  {revealed ? hideLabel : showLabel}
                </button>
              </span>
              {passwordBad ? <p data-part="hint">{passwordHint}</p> : null}
              {caps ? (
                <p data-part="caps" role="status">
                  {capsLabel}
                </p>
              ) : null}
            </div>

            <label data-part="keep">
              <input type="checkbox" name="remember" defaultChecked />
              {keepLabel}
            </label>

            <button type="submit" data-part="submit">
              {submit}
            </button>
          </form>

          <p data-part="switch">
            {switchText} <a href="#">{switchLink}</a>
          </p>
        </div>
      </section>
    </>
  )
}
