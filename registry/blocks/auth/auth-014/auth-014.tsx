"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth014Fallback = {
  title: string
  text: string
}

export type Auth014Props = {
  title?: string
  lead?: string
  submit?: string
  app?: string
  trustDays?: number
  /** Метка шага над заголовком: блок несёт русскую. */
  badgeText?: string
  /** Строка с названием приложения; {app} подставляется из пропа app. */
  appText?: string
  /** Подпись поля кода. */
  codeLabel?: string
  /** Подпись галочки доверия; {days} подставляется из trustDays. */
  trustText?: string
  /** Заголовок списка запасных путей. */
  stuckText?: string
  /** Запасные пути входа: блок несёт русские. */
  fallbacks?: Auth014Fallback[]
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
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
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки, а свечение под
// карточкой остаётся акцентным пятном в обеих темах.
//
// Демонстрация интерфейса: код не сверяется, вторая проверка — на сервере.
const STYLES = `
:where([data-vibeui-block="auth-014"]){
--vibeui-auth-014-bg:transparent;
--vibeui-auth-014-card:light-dark(oklch(1 0 0),oklch(0.23 0.014 285));
--vibeui-auth-014-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-auth-014-muted:light-dark(oklch(0.54 0.014 265),oklch(0.7 0.012 265));
--vibeui-auth-014-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.014 285));
--vibeui-auth-014-accent:light-dark(oklch(0.5 0.18 285),oklch(0.76 0.14 285));
--vibeui-auth-014-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.02 285));
--vibeui-auth-014-glow:light-dark(oklch(0.5 0.18 285 / 12%),oklch(0.72 0.16 285 / 20%));
--vibeui-auth-014-tint:light-dark(oklch(0.5 0.18 285 / 12%),oklch(0.76 0.14 285 / 18%));
--vibeui-auth-014-shadow:light-dark(oklch(0.15 0.03 285 / 14%),oklch(0 0 0 / 45%));
--vibeui-auth-014-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-auth-014-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-014"]{color-scheme:dark}
[data-vibeui-block="auth-014"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.75rem 1rem;
background:
radial-gradient(90% 70% at 50% 0%, var(--vibeui-auth-014-glow), transparent 70%),
var(--vibeui-auth-014-bg);
color:var(--vibeui-auth-014-fg);
font-family:var(--vibeui-auth-014-sans);
}
[data-vibeui-block="auth-014"] *{box-sizing:border-box}
[data-vibeui-block="auth-014"] [data-part="shell"]{
width:100%;max-width:23rem;margin:0 auto;padding:1.75rem 1.5rem;
background:var(--vibeui-auth-014-card);border-radius:1.125rem;
border:1px solid var(--vibeui-auth-014-border);
box-shadow:0 1.25rem 3rem var(--vibeui-auth-014-shadow);
}
@container (min-width: 40rem){
[data-vibeui-block="auth-014"] [data-part="shell"]{max-width:25rem;padding:2.25rem 2rem}
[data-vibeui-block="auth-014"] [data-part="fallbacks"]{grid-template-columns:1fr 1fr}
}
[data-vibeui-block="auth-014"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.375rem;
margin-bottom:0.875rem;padding:0.25rem 0.5rem;border-radius:9999px;
background:var(--vibeui-auth-014-tint);color:var(--vibeui-auth-014-accent);
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
width:100%;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.375rem 1rem;
border:0;border-radius:0.75rem;
background:var(--vibeui-auth-014-accent);color:var(--vibeui-auth-014-on-accent);
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

const FALLBACKS: Auth014Fallback[] = [
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
 * Второй фактор кодом из приложения: поле кода, доверие устройству
 * на срок и запасные пути входа. Один файл, ноль зависимостей.
 */
export function Auth014({
  title = "Код из приложения",
  lead = "Откройте приложение и введите шестизначный код. Он меняется каждые 30 секунд.",
  submit = "Подтвердить вход",
  app = "Authenticator",
  trustDays = 30,
  badgeText = "Шаг 2 из 2",
  appText = "Приложение: {app}.",
  codeLabel = "Код подтверждения",
  trustText = "Доверять этому браузеру {days} дней — код спросят снова после этого срока или при смене устройства",
  stuckText = "Нет доступа к приложению",
  fallbacks = FALLBACKS,
  background = "",
  accent,
  className,
  style,
}: Auth014Props) {
  const [code, setCode] = useState("")

  const [appBefore, appAfter = ""] = appText.split("{app}")

  const palette = {
    ...(accent ? { "--vibeui-auth-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
          <span data-part="badge">{badgeText}</span>
          <h2>{title}</h2>
          <p data-part="lead">
            {lead} {appBefore}
            <span data-part="app">{app}</span>
            {appAfter}
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <label htmlFor="vibeui-auth-014-code">{codeLabel}</label>
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
              <span>{trustText.replace("{days}", String(trustDays))}</span>
            </label>

            <button type="submit" data-part="submit" disabled={code.length < 6}>
              {submit}
            </button>
          </form>

          <p data-part="stuck">{stuckText}</p>
          <ul data-part="fallbacks">
            {fallbacks.map((item) => (
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
