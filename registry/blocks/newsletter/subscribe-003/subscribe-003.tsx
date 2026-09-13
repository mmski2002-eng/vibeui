"use client"

import { useState } from "react"
import type { CSSProperties, FormEvent } from "react"

export type Subscribe003Props = {
  title?: string
  hint?: string
  emailLabel?: string
  placeholder?: string
  buttonLabel?: string
  success?: string
  /** Пусто — подложки нет, лента лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Полоса подписки для середины лендинга: узкая тёплая лента с инлайн-формой.
// Ставится между контентными секциями, где читатель уже разогрет, — там
// конверсия выше, чем в футере. Полоса нарочно низкая: она пауза в чтении,
// а не отдельная сцена. Тёплый тинт из акцента отделяет её от страницы без
// тяжёлой рамки. Бэкенда нет: submit гасится заглушкой со строкой успеха.
const STYLES = `
:where([data-vibeui-block="subscribe-003"]){
--vibeui-subscribe-003-bg:transparent;
--vibeui-subscribe-003-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-subscribe-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-subscribe-003-surface:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-subscribe-003-accent:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-subscribe-003-accent-ink:oklch(from var(--vibeui-subscribe-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-003-on-accent:oklch(from var(--vibeui-subscribe-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-003-ok:light-dark(oklch(0.52 0.14 150),oklch(0.76 0.14 150));
--vibeui-subscribe-003-band:color-mix(in oklab,var(--vibeui-subscribe-003-accent) 9%,var(--vibeui-subscribe-003-surface));
--vibeui-subscribe-003-band-border:color-mix(in oklab,var(--vibeui-subscribe-003-accent) 28%,var(--vibeui-subscribe-003-surface));
--vibeui-subscribe-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-subscribe-003-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-003"]{color-scheme:dark}
[data-vibeui-block="subscribe-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-subscribe-003-bg);color:var(--vibeui-subscribe-003-ink);
font-family:var(--vibeui-subscribe-003-font);
}
[data-vibeui-block="subscribe-003"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-003"] [data-part="shell"]{
max-width:72rem;margin:0 auto;padding:1.5rem 1.25rem;
}
[data-vibeui-block="subscribe-003"] [data-part="band"]{
display:flex;flex-direction:column;gap:1rem;
padding:1.25rem 1.5rem;border-radius:1rem;
border:1px solid var(--vibeui-subscribe-003-band-border);
background:var(--vibeui-subscribe-003-band);
}
[data-vibeui-block="subscribe-003"] [data-part="copy"]{display:grid;gap:0.25rem;min-width:0}
[data-vibeui-block="subscribe-003"] [data-part="title"]{
margin:0;font-size:1.0625rem;font-weight:700;line-height:1.3;letter-spacing:-0.01em;
}
[data-vibeui-block="subscribe-003"] [data-part="hint"]{
margin:0;color:var(--vibeui-subscribe-003-muted);font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="subscribe-003"] [data-part="form"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="subscribe-003"] [data-part="field"]{flex:1 1 auto;display:block}
[data-vibeui-block="subscribe-003"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="subscribe-003"] [data-part="input"]{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-subscribe-003-band-border);border-radius:0.5rem;
background:var(--vibeui-subscribe-003-surface);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="subscribe-003"] [data-part="input"]::placeholder{color:var(--vibeui-subscribe-003-muted)}
[data-vibeui-block="subscribe-003"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-003-accent);outline-offset:1px;
}
[data-vibeui-block="subscribe-003"] [data-part="button"]{
height:2.5rem;padding:0 1.125rem;border:0;border-radius:0.5rem;flex:none;
background:var(--vibeui-subscribe-003-accent);color:oklch(from var(--vibeui-subscribe-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.875rem;font-weight:650;cursor:pointer;white-space:nowrap;
transition:background var(--vibeui-subscribe-003-dur-2) ease,transform var(--vibeui-subscribe-003-dur-2) ease;
}
[data-vibeui-block="subscribe-003"] [data-part="button"]:hover{
background:color-mix(in oklab,var(--vibeui-subscribe-003-accent) 90%,black);
}
[data-vibeui-block="subscribe-003"] [data-part="button"]:active{transform:translateY(1px)}
[data-vibeui-block="subscribe-003"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-003-accent-ink);outline-offset:2px;
}
[data-vibeui-block="subscribe-003"] [data-part="done"]{
margin:0;min-height:2.5rem;display:flex;align-items:center;gap:0.5rem;
color:var(--vibeui-subscribe-003-ok);font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="subscribe-003"] [data-part="done"]::before{content:"✓";font-weight:700}
@container (min-width: 30rem){
[data-vibeui-block="subscribe-003"] [data-part="form"]{flex-direction:row}
[data-vibeui-block="subscribe-003"] [data-part="field"]{flex:1 1 12rem}
}
@container (min-width: 46rem){
[data-vibeui-block="subscribe-003"] [data-part="band"]{
flex-direction:row;align-items:center;justify-content:space-between;gap:2rem;
}
[data-vibeui-block="subscribe-003"] [data-part="zone"]{flex:0 1 26rem}
[data-vibeui-block="subscribe-003"] [data-part="form"]{justify-content:flex-end}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Узкая горизонтальная лента подписки для середины лендинга. */
export function Subscribe003({
  title = "Не пропустите новые блоки",
  hint = "Дайджест VibeUI приходит по пятницам: свежие секции и приёмы вёрстки.",
  emailLabel = "Электронная почта",
  placeholder = "you@company.ru",
  buttonLabel = "Подписаться",
  success = "Готово! Письмо-подтверждение уже в ящике.",
  background = "",
  accent,
  className,
  style,
}: Subscribe003Props) {
  const [done, setDone] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent
      ? {
          "--vibeui-subscribe-003-accent": accent,
          "--vibeui-subscribe-003-accent-ink": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-subscribe-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-subscribe-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="subscribe-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="band">
            <div data-part="copy">
              <h2 data-part="title">{title}</h2>
              <p data-part="hint">{hint}</p>
            </div>
            <div data-part="zone" aria-live="polite">
              {done ? (
                <p data-part="done">{success}</p>
              ) : (
                <form data-part="form" onSubmit={handleSubmit}>
                  <label data-part="field">
                    <span data-part="sr">{emailLabel}</span>
                    <input
                      data-part="input"
                      type="email"
                      name="email"
                      required
                      placeholder={placeholder}
                      autoComplete="email"
                    />
                  </label>
                  <button data-part="button" type="submit">
                    {buttonLabel}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
