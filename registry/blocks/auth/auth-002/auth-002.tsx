"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth002Props = {
  title?: string
  lead?: string
  submit?: string
  terms?: string
  switchText?: string
  switchLink?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: регистрация с честной оценкой пароля. Оценка считается по длине
// и разнообразию символов и показывается полосой и словом — полоса без слова
// не говорит, что именно исправить. Требования перечислены заранее, а не
// выскакивают после ошибки: список видно до первого нажатия. Поле повтора
// пароля намеренно отсутствует — оно не ловит опечатки, а мешает менеджерам
// паролей; вместо него есть показ введённого.
const STYLES = `
:where([data-vibeui-block="auth-002"]){
--vibeui-auth-002-bg:oklch(1 0 0);
--vibeui-auth-002-fg:oklch(0.22 0.014 265);
--vibeui-auth-002-muted:oklch(0.55 0.014 265);
--vibeui-auth-002-border:oklch(0.9 0.006 265);
--vibeui-auth-002-track:oklch(0.93 0.005 265);
--vibeui-auth-002-accent:oklch(0.55 0.2 262);
--vibeui-auth-002-weak:oklch(0.6 0.19 25);
--vibeui-auth-002-mid:oklch(0.72 0.15 75);
--vibeui-auth-002-good:oklch(0.58 0.14 152);
--vibeui-auth-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-002"]{
width:100%;max-width:23rem;box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-auth-002-bg);
border:1px solid var(--vibeui-auth-002-border);border-radius:1rem;
font-family:var(--vibeui-auth-002-sans);color:var(--vibeui-auth-002-fg);
}
[data-vibeui-block="auth-002"] *{box-sizing:border-box}
[data-vibeui-block="auth-002"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="auth-002"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-auth-002-muted)}
[data-vibeui-block="auth-002"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.75rem}
[data-vibeui-block="auth-002"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-002"] input[type="text"],
[data-vibeui-block="auth-002"] input[type="email"],
[data-vibeui-block="auth-002"] input[type="password"]{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-002-border);border-radius:0.625rem;
background:var(--vibeui-auth-002-bg);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-002"] input:focus-visible{outline:2px solid var(--vibeui-auth-002-accent);outline-offset:1px;border-color:var(--vibeui-auth-002-accent)}
[data-vibeui-block="auth-002"] [data-part="pass"]{position:relative;display:flex}
[data-vibeui-block="auth-002"] [data-part="pass"] input{padding-right:5rem}
[data-vibeui-block="auth-002"] [data-part="peek"]{
position:absolute;right:0.3125rem;top:0.3125rem;
appearance:none;border:0;background:none;cursor:pointer;
height:1.875rem;padding:0 0.5rem;border-radius:0.4375rem;
color:var(--vibeui-auth-002-accent);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="auth-002"] [data-part="peek"]:focus-visible{outline:2px solid var(--vibeui-auth-002-accent);outline-offset:1px}
/* Оценка полосой и словом: полоса без слова не говорит, что исправить. */
[data-vibeui-block="auth-002"] [data-part="meter"]{
display:flex;gap:0.25rem;margin-top:0.375rem;
}
[data-vibeui-block="auth-002"] [data-part="seg"]{
flex:1 1 0;height:0.25rem;border-radius:9999px;background:var(--vibeui-auth-002-track);
}
[data-vibeui-block="auth-002"] [data-score="1"] [data-part="seg"]:nth-child(1){background:var(--vibeui-auth-002-weak)}
[data-vibeui-block="auth-002"] [data-score="2"] [data-part="seg"]:nth-child(-n+2){background:var(--vibeui-auth-002-mid)}
[data-vibeui-block="auth-002"] [data-score="3"] [data-part="seg"]:nth-child(-n+3){background:var(--vibeui-auth-002-good)}
[data-vibeui-block="auth-002"] [data-part="verdict"]{
margin:0.3125rem 0 0;font-size:0.6875rem;font-weight:650;color:var(--vibeui-auth-002-muted);
}
/* Требования показаны заранее, а не после ошибки. */
[data-vibeui-block="auth-002"] ul{
list-style:none;margin:0.375rem 0 0;padding:0;
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-auth-002-muted);
}
[data-vibeui-block="auth-002"] li{display:flex;align-items:center;gap:0.25rem}
[data-vibeui-block="auth-002"] [data-part="mark"]{
display:inline-flex;align-items:center;justify-content:center;
width:0.875rem;height:0.875rem;border-radius:9999px;
box-shadow:inset 0 0 0 1.5px var(--vibeui-auth-002-border);
font-size:0.5625rem;line-height:1;
}
[data-vibeui-block="auth-002"] [data-ok="true"] [data-part="mark"]{
background:var(--vibeui-auth-002-good);color:oklch(1 0 0);box-shadow:none;
}
[data-vibeui-block="auth-002"] [data-ok="true"]{color:var(--vibeui-auth-002-fg)}
[data-vibeui-block="auth-002"] [data-part="submit"]{
width:100%;margin-top:0.875rem;appearance:none;cursor:pointer;height:2.625rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-002-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-002"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-002-accent);outline-offset:2px}
[data-vibeui-block="auth-002"] [data-part="terms"]{
margin:0.625rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-auth-002-muted);text-align:center;
}
[data-vibeui-block="auth-002"] [data-part="switch"]{
margin:0.75rem 0 0;text-align:center;font-size:0.8125rem;color:var(--vibeui-auth-002-muted);
}
[data-vibeui-block="auth-002"] a{color:var(--vibeui-auth-002-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-002"] *{animation:none!important;transition:none!important}}
`

const VERDICTS = ["слишком простой", "простой", "сойдёт", "надёжный"]

function score(value: string) {
  let points = 0
  if (value.length >= 10) points += 1
  if (/[a-zа-яё]/i.test(value) && /\d/.test(value)) points += 1
  if (/[^\wа-яё]/i.test(value) || value.length >= 16) points += 1
  return points
}

/**
 * Регистрация: честная оценка пароля словом и требования, показанные заранее.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth002({
  title = "Создать аккаунт",
  lead = "Одна учётная запись на все проекты команды.",
  submit = "Создать аккаунт",
  terms = "Создавая аккаунт, вы соглашаетесь с условиями сервиса и политикой обработки данных.",
  switchText = "Уже есть аккаунт?",
  switchLink = "Войти",
  accent,
  className,
  style,
}: Auth002Props) {
  const [password, setPassword] = useState("vibeui2026")
  const [shown, setShown] = useState(false)
  const points = score(password)

  const rules = [
    { text: "от 10 символов", ok: password.length >= 10 },
    {
      text: "буквы и цифры",
      ok: /[a-zа-яё]/i.test(password) && /\d/.test(password),
    },
    {
      text: "знак или 16+",
      ok: /[^\wа-яё]/i.test(password) || password.length >= 16,
    },
  ]

  const palette = {
    ...(accent ? { "--vibeui-auth-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-002"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <p data-part="lead">{lead}</p>

        <form>
          <div data-part="field">
            <label htmlFor="vibeui-auth-002-name">Имя</label>
            <input
              id="vibeui-auth-002-name"
              name="name"
              type="text"
              autoComplete="name"
              defaultValue="Анна Реброва"
            />
          </div>

          <div data-part="field">
            <label htmlFor="vibeui-auth-002-email">Рабочая почта</label>
            <input
              id="vibeui-auth-002-email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="name@company.ru"
              required
            />
          </div>

          <div data-part="field" data-score={points}>
            <label htmlFor="vibeui-auth-002-password">Пароль</label>
            <span data-part="pass">
              <input
                id="vibeui-auth-002-password"
                name="password"
                type={shown ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-describedby="vibeui-auth-002-verdict"
                required
              />
              <button
                type="button"
                data-part="peek"
                onClick={() => setShown((current) => !current)}
              >
                {shown ? "Скрыть" : "Показать"}
              </button>
            </span>

            <span data-part="meter" aria-hidden="true">
              <span data-part="seg" />
              <span data-part="seg" />
              <span data-part="seg" />
            </span>
            <p
              id="vibeui-auth-002-verdict"
              data-part="verdict"
              aria-live="polite"
            >
              Пароль {VERDICTS[points]}
            </p>

            <ul>
              {rules.map((rule) => (
                <li key={rule.text} data-ok={rule.ok ? "true" : "false"}>
                  <span data-part="mark" aria-hidden="true">
                    {rule.ok ? "✓" : null}
                  </span>
                  {rule.text}
                </li>
              ))}
            </ul>
          </div>

          <button type="submit" data-part="submit">
            {submit}
          </button>
        </form>

        <p data-part="terms">{terms}</p>
        <p data-part="switch">
          {switchText} <a href="#">{switchLink}</a>
        </p>
      </section>
    </>
  )
}
