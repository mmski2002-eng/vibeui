"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

export type Auth019Props = {
  title?: string
  seconds?: number
  attempts?: number
  account?: string
  /** Пояснение под заголовком; {attempts} и {account} подставляются из пропов. */
  leadText?: string
  /** Подпись под часами, пока идёт отсчёт. */
  untilText?: string
  /** Подпись под часами, когда отсчёт кончился. */
  doneText?: string
  /** Подпись полосы ожидания для скринридера. */
  barLabel?: string
  /** Подписи двух выходов: сброс пароля и «это были не вы». */
  resetText?: string
  notYouText?: string
  /** Подпись главной кнопки: до разблокировки и после. */
  waitingText?: string
  retryText?: string
  /** Сноска внизу карточки. */
  noteText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: экран временной блокировки после нескольких неудачных попыток.
// Главная задача — снять у человека ощущение, что аккаунт потерян: заметное
// время до разблокировки и слово «временно» отделяют защиту от катастрофы.
// Отсчёт идёт настоящий, с обновлением раз в секунду, и продублирован
// текстом: «ждите» без цифры провоцирует перезагрузку страницы и новую
// попытку. Рядом стоят два выхода — сброс пароля (для того, кто просто
// забыл) и «это были не вы» (для того, чьи данные подбирают): блокировка
// без этой ссылки прячет от владельца аккаунта факт атаки.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
//
// Демонстрация интерфейса: таймер локальный, настоящий счёт попыток
// и блокировку обязан вести сервер — клиентский отсчёт обходится перезагрузкой.
const STYLES = `
:where([data-vibeui-block="auth-019"]){
--vibeui-auth-019-bg:transparent;
--vibeui-auth-019-card:light-dark(oklch(1 0 0),oklch(0.23 0.016 30));
--vibeui-auth-019-fg:light-dark(oklch(0.24 0.02 30),oklch(0.94 0.008 30));
--vibeui-auth-019-muted:light-dark(oklch(0.54 0.016 30),oklch(0.71 0.014 30));
--vibeui-auth-019-border:light-dark(oklch(0.89 0.014 30),oklch(0.36 0.016 30));
--vibeui-auth-019-accent:light-dark(oklch(0.55 0.19 28),oklch(0.76 0.15 28));
--vibeui-auth-019-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.02 30));
--vibeui-auth-019-tint:light-dark(oklch(0.55 0.19 28 / 12%),oklch(0.76 0.15 28 / 18%));
--vibeui-auth-019-track:light-dark(oklch(0.55 0.02 30 / 12%),oklch(0.85 0.02 30 / 16%));
--vibeui-auth-019-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-auth-019-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="auth-019"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-019-bg);color:var(--vibeui-auth-019-fg);
font-family:var(--vibeui-auth-019-sans);
}
[data-vibeui-block="auth-019"] *{box-sizing:border-box}
[data-vibeui-block="auth-019"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;padding:1.75rem 1.5rem;
background:var(--vibeui-auth-019-card);
border:1px solid var(--vibeui-auth-019-border);border-radius:1.125rem;
text-align:center;
}
@container (min-width: 42rem){
[data-vibeui-block="auth-019"] [data-part="shell"]{max-width:27rem;padding:2.25rem 2rem}
[data-vibeui-block="auth-019"] [data-part="clock"]{font-size:2.75rem}
[data-vibeui-block="auth-019"] [data-part="exits"]{grid-template-columns:1fr 1fr}
}
[data-vibeui-block="auth-019"] [data-part="glyph"]{
display:inline-flex;align-items:center;justify-content:center;
width:3rem;height:3rem;margin-bottom:0.875rem;border-radius:0.875rem;
background:var(--vibeui-auth-019-tint);color:var(--vibeui-auth-019-accent);
font-size:1.25rem;line-height:1;
}
[data-vibeui-block="auth-019"] h2{margin:0 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-019"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-019-muted)}
[data-vibeui-block="auth-019"] [data-part="lead"] b{color:var(--vibeui-auth-019-fg);font-weight:650}
[data-vibeui-block="auth-019"] [data-part="clock"]{
margin:0;font-family:var(--vibeui-auth-019-mono);font-size:2.25rem;font-weight:700;
letter-spacing:0.02em;line-height:1;color:var(--vibeui-auth-019-accent);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="auth-019"] [data-part="until"]{margin:0.375rem 0 1.25rem;font-size:0.75rem;color:var(--vibeui-auth-019-muted)}
[data-vibeui-block="auth-019"] [data-part="bar"]{
height:0.375rem;margin-bottom:1.25rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-auth-019-track);
}
[data-vibeui-block="auth-019"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
background:var(--vibeui-auth-019-accent);
transition:width 1s linear;
}
[data-vibeui-block="auth-019"] [data-part="exits"]{display:grid;grid-template-columns:1fr;gap:0.5rem;margin-bottom:1rem}
[data-vibeui-block="auth-019"] [data-part="exit"]{
appearance:none;cursor:pointer;height:2.5rem;padding:0 0.875rem;
border:1px solid var(--vibeui-auth-019-border);border-radius:0.625rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="auth-019"] [data-part="exit"]:hover{border-color:var(--vibeui-auth-019-accent);color:var(--vibeui-auth-019-accent)}
[data-vibeui-block="auth-019"] [data-part="exit"]:focus-visible{outline:2px solid var(--vibeui-auth-019-accent);outline-offset:2px}
[data-vibeui-block="auth-019"] [data-part="retry"]{
width:100%;appearance:none;cursor:pointer;height:2.75rem;
border:0;border-radius:0.75rem;
background:var(--vibeui-auth-019-accent);color:var(--vibeui-auth-019-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-019"] [data-part="retry"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="auth-019"] [data-part="retry"]:focus-visible{outline:2px solid var(--vibeui-auth-019-accent);outline-offset:2px}
[data-vibeui-block="auth-019"] [data-part="note"]{margin:1rem 0 0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-auth-019-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-019"] *{animation:none!important;transition:none!important}}
`

function clock(total: number) {
  const minutes = Math.floor(total / 60)
  const rest = total % 60

  return `${minutes}:${String(rest).padStart(2, "0")}`
}

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
 * Временная блокировка входа: живой отсчёт до разблокировки
 * и два выхода — сброс пароля и «это были не вы». Один файл, ноль зависимостей.
 */
export function Auth019({
  title = "Вход временно закрыт",
  seconds = 300,
  attempts = 5,
  account = "anna@vibeui.ru",
  leadText = "Подряд {attempts} неудачных попыток для {account}. Аккаунт цел — вход откроется сам, ничего делать не нужно.",
  untilText = "до следующей попытки",
  doneText = "Можно пробовать снова",
  barLabel = "Время до разблокировки",
  resetText = "Сбросить пароль",
  notYouText = "Это были не вы?",
  waitingText = "Ждём разблокировки",
  retryText = "Попробовать снова",
  noteText = "Если попытки продолжатся, окно ожидания вырастет. Смена пароля снимает блокировку сразу.",
  background = "",
  accent,
  className,
  style,
}: Auth019Props) {
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    if (left <= 0) {
      return
    }

    const timer = window.setTimeout(() => setLeft(left - 1), 1000)

    return () => window.clearTimeout(timer)
  }, [left])

  const done = left <= 0
  const percent =
    seconds > 0 ? Math.round(((seconds - left) / seconds) * 100) : 100

  const [leadBefore, leadAfter = ""] = leadText.split("{account}")

  const palette = {
    ...(accent ? { "--vibeui-auth-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-019" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-019"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <span data-part="glyph" aria-hidden="true">
            ⏳
          </span>
          <h2>{title}</h2>
          <p data-part="lead">
            {leadBefore.replace("{attempts}", String(attempts))}
            <b>{account}</b>
            {leadAfter.replace("{attempts}", String(attempts))}
          </p>

          <p data-part="clock" role="timer" aria-live="off">
            {clock(Math.max(0, left))}
          </p>
          <p data-part="until">{done ? doneText : untilText}</p>

          <div
            data-part="bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label={barLabel}
          >
            <span data-part="fill" style={{ width: `${percent}%` }} />
          </div>

          <div data-part="exits">
            <button type="button" data-part="exit">
              {resetText}
            </button>
            <button type="button" data-part="exit">
              {notYouText}
            </button>
          </div>

          <button type="button" data-part="retry" disabled={!done}>
            {done ? retryText : waitingText}
          </button>

          <p data-part="note">{noteText}</p>
        </div>
      </section>
    </>
  )
}
