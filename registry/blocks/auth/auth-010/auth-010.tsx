"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

export type Auth010Props = {
  title?: string
  lead?: string
  submit?: string
  cooldown?: number
  steps?: string[]
  emailLabel?: string
  emailPlaceholder?: string
  /** Заголовок колонки с шагами. */
  stepsTitle?: string
  /** Подпись кнопки во время отсчёта; {left} — секунды. */
  waitTemplate?: string
  /** Сообщение после отправки; {left} — секунды до повтора. */
  sentTemplate?: string
  back?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: запрос ссылки на смену пароля, где рядом с формой написано,
// что случится дальше. Человек, который жмёт «прислать ссылку», чаще всего
// уходит в почту и не возвращается: если он не знает, что письмо приходит
// с определённого адреса и живёт час, он трактует задержку как поломку.
// Отсюда колонка шагов справа — она исчезает на узкой ширине, а не сжимается.
// Повторная отправка закрыта обратным отсчётом: это единственная защита от
// того, что человек нажмёт кнопку пять раз и получит пять разных ссылок,
// из которых рабочей будет только последняя.
//
// Демонстрация интерфейса: письма не отправляются, лимит нужен и на сервере.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не выкладывает под себя плашку — подложка приходит
// пропом background.
const STYLES = `
:where([data-vibeui-block="auth-010"]){
--vibeui-auth-010-bg:transparent;
--vibeui-auth-010-card:light-dark(oklch(1 0 0),oklch(0.23 0.012 60));
--vibeui-auth-010-side:light-dark(oklch(0.98 0.012 90),oklch(0.27 0.014 60));
--vibeui-auth-010-fg:light-dark(oklch(0.24 0.016 60),oklch(0.94 0.006 60));
--vibeui-auth-010-muted:light-dark(oklch(0.54 0.014 60),oklch(0.7 0.013 60));
--vibeui-auth-010-border:light-dark(oklch(0.89 0.01 80),oklch(0.35 0.012 70));
--vibeui-auth-010-accent:light-dark(oklch(0.56 0.15 42),oklch(0.77 0.13 42));
--vibeui-auth-010-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.02 60));
--vibeui-auth-010-accent-wash:light-dark(oklch(0.56 0.15 42 / 9%),oklch(0.77 0.13 42 / 16%));
--vibeui-auth-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-010"]{color-scheme:dark}
[data-vibeui-block="auth-010"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-010-bg);color:var(--vibeui-auth-010-fg);
font-family:var(--vibeui-auth-010-sans);
}
[data-vibeui-block="auth-010"] *{box-sizing:border-box}
[data-vibeui-block="auth-010"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;overflow:hidden;
width:100%;max-width:24rem;margin:0 auto;
background:var(--vibeui-auth-010-card);
border:1px solid var(--vibeui-auth-010-border);border-radius:1rem;
}
[data-vibeui-block="auth-010"] [data-part="aside"]{display:none}
@container (min-width: 46rem){
[data-vibeui-block="auth-010"] [data-part="shell"]{max-width:44rem;grid-template-columns:1.15fr 1fr}
[data-vibeui-block="auth-010"] [data-part="aside"]{display:block;border-left:1px solid var(--vibeui-auth-010-border)}
}
[data-vibeui-block="auth-010"] [data-part="main"]{padding:1.75rem}
[data-vibeui-block="auth-010"] [data-part="aside"]{padding:1.75rem;background:var(--vibeui-auth-010-side)}
[data-vibeui-block="auth-010"] h2{margin:0 0 0.375rem;font-size:1.3125rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-010"] h3{margin:0 0 0.875rem;font-size:0.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--vibeui-auth-010-muted)}
[data-vibeui-block="auth-010"] [data-part="lead"]{margin:0 0 1.25rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-010-muted)}
[data-vibeui-block="auth-010"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:1rem}
[data-vibeui-block="auth-010"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-010"] input{
width:100%;height:2.625rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-010-border);border-radius:0.625rem;
background:var(--vibeui-auth-010-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-010"] input:focus-visible{outline:2px solid var(--vibeui-auth-010-accent);outline-offset:1px;border-color:var(--vibeui-auth-010-accent)}
[data-vibeui-block="auth-010"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.375rem 1rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-010-accent);color:var(--vibeui-auth-010-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-010"] [data-part="submit"]:disabled{cursor:not-allowed;opacity:.5}
[data-vibeui-block="auth-010"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-010-accent);outline-offset:2px}
[data-vibeui-block="auth-010"] [data-part="status"]{
display:flex;gap:0.5rem;margin:1rem 0 0;padding:0.6875rem 0.8125rem;
border-radius:0.625rem;background:var(--vibeui-auth-010-accent-wash);
font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="auth-010"] ol{list-style:none;counter-reset:s;margin:0;padding:0;display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="auth-010"] li{counter-increment:s;display:flex;gap:0.625rem;font-size:0.8125rem;line-height:1.5}
[data-vibeui-block="auth-010"] li::before{
content:counter(s);flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.375rem;height:1.375rem;border-radius:9999px;
background:var(--vibeui-auth-010-card);border:1px solid var(--vibeui-auth-010-border);
font-size:0.6875rem;font-weight:700;color:var(--vibeui-auth-010-accent);
}
[data-vibeui-block="auth-010"] [data-part="back"]{display:inline-block;margin-top:1rem;font-size:0.8125rem;color:var(--vibeui-auth-010-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = [
  "Письмо придёт с адреса robot@vibeui.ru — проверьте «Промоакции» и спам.",
  "Ссылка внутри одноразовая и живёт один час.",
  "Старый пароль перестанет работать сразу после смены.",
  "Все активные сессии на других устройствах завершатся.",
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
 * Запрос ссылки на смену пароля с колонкой «что будет дальше»
 * и обратным отсчётом до повторной отправки. Один файл, ноль зависимостей.
 */
export function Auth010({
  title = "Сбросить пароль",
  lead = "Пришлём ссылку на почту, с которой вы регистрировались.",
  submit = "Прислать ссылку",
  cooldown = 45,
  steps = DEFAULT_STEPS,
  emailLabel = "Почта аккаунта",
  emailPlaceholder = "name@company.ru",
  stepsTitle = "Что будет дальше",
  waitTemplate = "Повтор через {left} с",
  sentTemplate = "Если такой адрес зарегистрирован, письмо уже отправлено. Отправить ещё раз можно через {left} с.",
  back = "Вспомнил пароль — вернуться ко входу",
  background = "",
  accent,
  className,
  style,
}: Auth010Props) {
  const [left, setLeft] = useState(0)

  useEffect(() => {
    if (left <= 0) {
      return
    }

    const timer = window.setTimeout(() => setLeft(left - 1), 1000)

    return () => window.clearTimeout(timer)
  }, [left])

  const palette = {
    ...(accent ? { "--vibeui-auth-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-010"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="main">
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                setLeft(cooldown)
              }}
            >
              <div data-part="field">
                <label htmlFor="vibeui-auth-010-email">{emailLabel}</label>
                <input
                  id="vibeui-auth-010-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder={emailPlaceholder}
                  required
                />
              </div>
              <button type="submit" data-part="submit" disabled={left > 0}>
                {left > 0
                  ? waitTemplate.replace("{left}", String(left))
                  : submit}
              </button>
            </form>
            {left > 0 ? (
              <p data-part="status" role="status">
                <span aria-hidden="true">✓</span>
                <span>{sentTemplate.replace("{left}", String(left))}</span>
              </p>
            ) : null}
            <a data-part="back" href="#">
              {back}
            </a>
          </div>

          <aside data-part="aside">
            <h3>{stepsTitle}</h3>
            <ol>
              {steps.map((step) => (
                <li key={step}>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>
    </>
  )
}
