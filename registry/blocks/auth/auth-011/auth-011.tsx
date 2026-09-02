"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth011Props = {
  title?: string
  lead?: string
  submit?: string
  minLength?: number
  /** Адрес, для которого меняют пароль. */
  email?: string
  passwordLabel?: string
  repeatLabel?: string
  showLabel?: string
  hideLabel?: string
  /** Четыре требования; в первом {min} подставляется из minLength. */
  ruleLabels?: string[]
  mismatchText?: string
  note?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: установка нового пароля после перехода по ссылке. Оценка
// надёжности здесь не полоска «слабый/сильный», а четыре именованных
// требования, каждое из которых человек может закрыть осознанно: полоска
// говорит «плохо», список говорит «чего не хватает». Поле повтора оставлено
// намеренно — в отличие от регистрации, ошибиться тут дороже: неверно
// набранный новый пароль отрезает от аккаунта, восстановить который только
// что пытались. Совпадение проверяется прямо в поле, а не после отправки.
//
// Демонстрация интерфейса: оценка приблизительная, пароль никуда не уходит.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не выкладывает под себя плашку — подложка приходит
// пропом background.
const STYLES = `
:where([data-vibeui-block="auth-011"]){
--vibeui-auth-011-bg:transparent;
--vibeui-auth-011-card:light-dark(oklch(1 0 0),oklch(0.22 0.013 300));
--vibeui-auth-011-fg:light-dark(oklch(0.22 0.014 300),oklch(0.94 0.006 300));
--vibeui-auth-011-muted:light-dark(oklch(0.55 0.014 300),oklch(0.69 0.013 300));
--vibeui-auth-011-border:light-dark(oklch(0.9 0.006 300),oklch(0.34 0.011 300));
--vibeui-auth-011-accent:light-dark(oklch(0.52 0.19 300),oklch(0.76 0.15 300));
--vibeui-auth-011-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 300));
--vibeui-auth-011-accent-chip:light-dark(oklch(0.52 0.19 300 / 10%),oklch(0.76 0.15 300 / 18%));
--vibeui-auth-011-well:light-dark(oklch(0.55 0.02 300 / 5%),oklch(0.85 0.02 300 / 8%));
--vibeui-auth-011-ok:light-dark(oklch(0.58 0.14 152),oklch(0.74 0.13 152));
--vibeui-auth-011-danger:light-dark(oklch(0.55 0.19 25),oklch(0.75 0.15 25));
--vibeui-auth-011-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-011"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-011-bg);color:var(--vibeui-auth-011-fg);
font-family:var(--vibeui-auth-011-sans);
}
[data-vibeui-block="auth-011"] *{box-sizing:border-box}
[data-vibeui-block="auth-011"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-011-card);
border:1px solid var(--vibeui-auth-011-border);border-radius:1rem;
}
@container (min-width: 42rem){
[data-vibeui-block="auth-011"] [data-part="shell"]{max-width:27rem;padding:2rem}
[data-vibeui-block="auth-011"] [data-part="rules"]{grid-template-columns:1fr 1fr}
}
[data-vibeui-block="auth-011"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-011"] [data-part="lead"]{margin:0 0 0.5rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-011-muted)}
[data-vibeui-block="auth-011"] [data-part="who"]{
display:inline-block;margin:0 0 1.125rem;padding:0.25rem 0.5rem;
border-radius:0.5rem;background:var(--vibeui-auth-011-accent-chip);
font-size:0.75rem;font-weight:650;color:var(--vibeui-auth-011-accent);
}
[data-vibeui-block="auth-011"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.875rem}
[data-vibeui-block="auth-011"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-011"] [data-part="wrap"]{position:relative;display:flex}
[data-vibeui-block="auth-011"] input{
width:100%;height:2.5rem;padding:0 4.25rem 0 0.75rem;
border:1px solid var(--vibeui-auth-011-border);border-radius:0.625rem;
background:var(--vibeui-auth-011-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-011"] input:focus-visible{outline:2px solid var(--vibeui-auth-011-accent);outline-offset:1px;border-color:var(--vibeui-auth-011-accent)}
[data-vibeui-block="auth-011"] input[aria-invalid="true"]{border-color:var(--vibeui-auth-011-danger)}
[data-vibeui-block="auth-011"] [data-part="reveal"]{
position:absolute;top:0;right:0;height:2.5rem;padding:0 0.75rem;
appearance:none;border:0;background:none;cursor:pointer;
color:var(--vibeui-auth-011-accent);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="auth-011"] [data-part="reveal"]:focus-visible{outline:2px solid var(--vibeui-auth-011-accent);outline-offset:-2px;border-radius:0.5rem}
[data-vibeui-block="auth-011"] [data-part="rules"]{
display:grid;grid-template-columns:1fr;gap:0.4375rem;
list-style:none;margin:0.25rem 0 1rem;padding:0.75rem;
border-radius:0.75rem;background:var(--vibeui-auth-011-well);
}
[data-vibeui-block="auth-011"] [data-part="rule"]{display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;line-height:1.4;color:var(--vibeui-auth-011-muted)}
[data-vibeui-block="auth-011"] [data-part="rule"][data-done="true"]{color:var(--vibeui-auth-011-ok);font-weight:600}
[data-vibeui-block="auth-011"] [data-part="tick"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
border:1px solid currentColor;font-size:0.625rem;line-height:1;
}
[data-vibeui-block="auth-011"] [data-part="mismatch"]{margin:0 0 0.875rem;font-size:0.75rem;color:var(--vibeui-auth-011-danger)}
[data-vibeui-block="auth-011"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.625rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-011-accent);color:var(--vibeui-auth-011-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-011"] [data-part="submit"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="auth-011"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-011-accent);outline-offset:2px}
[data-vibeui-block="auth-011"] [data-part="note"]{margin:0.875rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-auth-011-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-011"] *{animation:none!important;transition:none!important}}
`

const RULE_LABELS = [
  "Не короче {min} знаков",
  "Есть строчная и заглавная",
  "Есть цифра",
  "Есть знак или пробел",
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
 * Установка нового пароля: именованные требования вместо полоски
 * и проверка совпадения на лету. Один файл, ноль зависимостей.
 */
export function Auth011({
  title = "Новый пароль",
  lead = "Придумайте пароль, которого нет в других сервисах.",
  submit = "Сохранить и войти",
  minLength = 10,
  email = "anna@vibeui.ru",
  passwordLabel = "Пароль",
  repeatLabel = "Повторите пароль",
  showLabel = "Показать",
  hideLabel = "Скрыть",
  ruleLabels = RULE_LABELS,
  mismatchText = "Пароли пока не совпадают.",
  note = "После сохранения сессии на других устройствах завершатся, а ссылка из письма перестанет работать.",
  background = "",
  accent,
  className,
  style,
}: Auth011Props) {
  const [password, setPassword] = useState("")
  const [repeat, setRepeat] = useState("")
  const [revealed, setRevealed] = useState(false)

  const rules = [
    password.length >= minLength,
    /[a-zа-я]/.test(password) && /[A-ZА-Я]/.test(password),
    /\d/.test(password),
    /[^\p{L}\d]/u.test(password),
  ].map((done, index) => ({
    text: (ruleLabels[index] ?? RULE_LABELS[index]).replace(
      "{min}",
      String(minLength),
    ),
    done,
  }))

  const solid = rules.every((rule) => rule.done)
  const mismatch = repeat.length > 0 && repeat !== password

  const palette = {
    ...(accent ? { "--vibeui-auth-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-011"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>
          <p data-part="who">{email}</p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <div data-part="field">
              <label htmlFor="vibeui-auth-011-password">{passwordLabel}</label>
              <span data-part="wrap">
                <input
                  id="vibeui-auth-011-password"
                  name="password"
                  type={revealed ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
            </div>

            <ul data-part="rules" aria-live="polite">
              {rules.map((rule) => (
                <li key={rule.text} data-part="rule" data-done={rule.done}>
                  <span data-part="tick" aria-hidden="true">
                    {rule.done ? "✓" : ""}
                  </span>
                  <span>{rule.text}</span>
                </li>
              ))}
            </ul>

            <div data-part="field">
              <label htmlFor="vibeui-auth-011-repeat">{repeatLabel}</label>
              <span data-part="wrap">
                <input
                  id="vibeui-auth-011-repeat"
                  name="password-repeat"
                  type={revealed ? "text" : "password"}
                  autoComplete="new-password"
                  value={repeat}
                  aria-invalid={mismatch || undefined}
                  onChange={(event) => setRepeat(event.target.value)}
                />
              </span>
            </div>

            {mismatch ? (
              <p data-part="mismatch" role="alert">
                {mismatchText}
              </p>
            ) : null}

            <button
              type="submit"
              data-part="submit"
              disabled={!solid || mismatch || repeat.length === 0}
            >
              {submit}
            </button>
          </form>

          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
