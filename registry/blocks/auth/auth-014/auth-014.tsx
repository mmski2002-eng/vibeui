"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth014Props = {
  title?: string
  lead?: string
  submit?: string
  app?: string
  trustDays?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: второй шаг входа кодом из приложения. Ключевое отличие от
// обычного ввода кода — запасные пути. Телефон теряют, приложение переносят
// на новый аппарат и забывают перенести секрет; если на экране нет ничего,
// кроме поля, человек оказывается заперт снаружи собственного аккаунта.
// Поэтому альтернативы («резервный код», «ключ безопасности», «написать
// администратору») выведены прямо под формой, а не спрятаны в подвал.
// Галочка «доверять устройству» имеет явный срок: «запомнить» без срока —
// это обещание, которое интерфейс не выполняет.
//
// Демонстрация интерфейса: код не сверяется, вторая проверка — на сервере.
const STYLES = `
:where([data-vibeui-block="auth-014"]){
--vibeui-auth-014-bg:oklch(0.22 0.02 265);
--vibeui-auth-014-card:oklch(1 0 0);
--vibeui-auth-014-fg:oklch(0.22 0.014 265);
--vibeui-auth-014-muted:oklch(0.54 0.014 265);
--vibeui-auth-014-border:oklch(0.9 0.006 265);
--vibeui-auth-014-accent:oklch(0.5 0.18 285);
--vibeui-auth-014-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-auth-014-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="auth-014"]{
box-sizing:border-box;padding:1.75rem 1rem;
background:
radial-gradient(90% 70% at 50% 0%, oklch(0.3 0.06 285), transparent 70%),
var(--vibeui-auth-014-bg);
color:var(--vibeui-auth-014-fg);
font-family:var(--vibeui-auth-014-sans);
}
[data-vibeui-block="auth-014"] *{box-sizing:border-box}
[data-vibeui-block="auth-014"] [data-part="shell"]{
width:100%;max-width:23rem;margin:0 auto;padding:1.75rem 1.5rem;
background:var(--vibeui-auth-014-card);border-radius:1.125rem;
box-shadow:0 1.25rem 3rem oklch(0.15 0.03 285 / 35%);
}
@container (min-width: 40rem){
[data-vibeui-block="auth-014"] [data-part="shell"]{max-width:25rem;padding:2.25rem 2rem}
[data-vibeui-block="auth-014"] [data-part="fallbacks"]{grid-template-columns:1fr 1fr}
}
[data-vibeui-block="auth-014"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.375rem;
margin-bottom:0.875rem;padding:0.25rem 0.5rem;border-radius:9999px;
background:oklch(0.5 0.18 285 / 12%);color:var(--vibeui-auth-014-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="auth-014"] h2{margin:0 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-014"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-014-muted)}
[data-vibeui-block="auth-014"] [data-part="app"]{font-weight:650;color:var(--vibeui-auth-014-fg)}
[data-vibeui-block="auth-014"] label{display:block;margin-bottom:0.3125rem;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-014"] [data-part="code"]{
width:100%;height:3rem;padding:0 0.5rem;
border:1px solid var(--vibeui-auth-014-border);border-radius:0.75rem;
background:var(--vibeui-auth-014-card);color:inherit;
font-family:var(--vibeui-auth-014-mono);font-size:1.375rem;font-weight:700;
letter-spacing:0.35em;text-align:center;text-indent:0.35em;
}
[data-vibeui-block="auth-014"] [data-part="code"]:focus-visible{outline:2px solid var(--vibeui-auth-014-accent);outline-offset:2px;border-color:var(--vibeui-auth-014-accent)}
[data-vibeui-block="auth-014"] [data-part="trust"]{display:flex;align-items:flex-start;gap:0.5rem;margin:0.875rem 0;font-size:0.8125rem;line-height:1.4}
[data-vibeui-block="auth-014"] [data-part="trust"] input{flex:none;width:1.0625rem;height:1.0625rem;margin-top:0.0625rem;accent-color:var(--vibeui-auth-014-accent)}
[data-vibeui-block="auth-014"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.75rem;
border:0;border-radius:0.75rem;
background:var(--vibeui-auth-014-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-014"] [data-part="submit"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="auth-014"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-014-accent);outline-offset:2px}
[data-vibeui-block="auth-014"] [data-part="stuck"]{margin:1.25rem 0 0.625rem;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--vibeui-auth-014-muted)}
[data-vibeui-block="auth-014"] [data-part="fallbacks"]{display:grid;grid-template-columns:1fr;gap:0.5rem;list-style:none;margin:0;padding:0}
[data-vibeui-block="auth-014"] [data-part="fallback"]{
display:flex;flex-direction:column;gap:0.125rem;width:100%;
padding:0.625rem 0.75rem;appearance:none;cursor:pointer;text-align:left;
border:1px solid var(--vibeui-auth-014-border);border-radius:0.625rem;
background:none;color:inherit;font:inherit;
transition:border-color .16s ease;
}
[data-vibeui-block="auth-014"] [data-part="fallback"]:hover{border-color:var(--vibeui-auth-014-accent)}
[data-vibeui-block="auth-014"] [data-part="fallback"]:focus-visible{outline:2px solid var(--vibeui-auth-014-accent);outline-offset:2px}
[data-vibeui-block="auth-014"] [data-part="ftitle"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="auth-014"] [data-part="ftext"]{font-size:0.6875rem;line-height:1.4;color:var(--vibeui-auth-014-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-014"] *{animation:none!important;transition:none!important}}
`

const FALLBACKS = [
  {
    title: "Резервный код",
    text: "Один из десяти, выданных при подключении.",
  },
  {
    title: "Ключ безопасности",
    text: "Физический ключ, если вы его регистрировали.",
  },
  {
    title: "Написать администратору",
    text: "Сброс второго фактора вручную, до суток.",
  },
]

/**
 * Второй фактор кодом из приложения: поле кода, доверие устройству
 * на срок и запасные пути входа. Один файл, ноль зависимостей.
 */
export function Auth014({
  title = "Код из приложения",
  lead = "Откройте приложение и введите шестизначный код. Он меняется каждые 30 секунд.",
  submit = "Подтвердить вход",
  app = "Authenticator",
  trustDays = 30,
  accent,
  className,
  style,
}: Auth014Props) {
  const [code, setCode] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-auth-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-014"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <span data-part="badge">Шаг 2 из 2</span>
          <h2>{title}</h2>
          <p data-part="lead">
            {lead} Приложение: <span data-part="app">{app}</span>.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <label htmlFor="vibeui-auth-014-code">Код подтверждения</label>
            <input
              id="vibeui-auth-014-code"
              data-part="code"
              name="one-time-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />

            <label data-part="trust">
              <input type="checkbox" name="trust" />
              <span>
                Доверять этому браузеру {trustDays} дней — код спросят снова
                после этого срока или при смене устройства
              </span>
            </label>

            <button type="submit" data-part="submit" disabled={code.length < 6}>
              {submit}
            </button>
          </form>

          <p data-part="stuck">Нет доступа к приложению</p>
          <ul data-part="fallbacks">
            {FALLBACKS.map((item) => (
              <li key={item.title}>
                <button type="button" data-part="fallback">
                  <span data-part="ftitle">{item.title}</span>
                  <span data-part="ftext">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
