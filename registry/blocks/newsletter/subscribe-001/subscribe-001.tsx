"use client"

import { useState } from "react"
import type { CSSProperties, FormEvent } from "react"

export type Subscribe001Props = {
  title?: string
  lead?: string
  emailLabel?: string
  placeholder?: string
  buttonLabel?: string
  note?: string
  success?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Классическая центрированная подписка: заголовок, одно поле, одна кнопка.
// Ничего лишнего — конверсия формы падает с каждым дополнительным элементом.
// Строка «раз в неделю, без спама» стоит под формой не для красоты: это
// ответ на главный страх подписчика, и без неё поле оставляют пустым.
// Бэкенда нет: submit гасится заглушкой и показывает строку успеха.
const STYLES = `
:where([data-vibeui-block="subscribe-001"]){
--vibeui-subscribe-001-bg:transparent;
--vibeui-subscribe-001-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-subscribe-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-subscribe-001-border:light-dark(oklch(0.89 0 0),oklch(0.36 0 0));
--vibeui-subscribe-001-field:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-subscribe-001-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-subscribe-001-accent-ink:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-subscribe-001-on-accent:oklch(0.15 0.02 39.8);
--vibeui-subscribe-001-ok:light-dark(oklch(0.52 0.14 150),oklch(0.76 0.14 150));
--vibeui-subscribe-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-001"]{color-scheme:dark}
[data-vibeui-block="subscribe-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-subscribe-001-bg);color:var(--vibeui-subscribe-001-ink);
font-family:var(--vibeui-subscribe-001-font);
}
[data-vibeui-block="subscribe-001"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-001"] [data-part="shell"]{
max-width:38rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="subscribe-001"] [data-part="title"]{
margin:0 0 0.75rem;
font-size:clamp(1.5rem,4.5cqi,2.25rem);line-height:1.12;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="subscribe-001"] [data-part="lead"]{
margin:0 auto 1.5rem;max-width:46ch;
color:var(--vibeui-subscribe-001-muted);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="subscribe-001"] [data-part="form"]{
display:flex;flex-direction:column;gap:0.625rem;max-width:26rem;margin:0 auto;
}
[data-vibeui-block="subscribe-001"] [data-part="field"]{flex:1 1 auto;display:block}
[data-vibeui-block="subscribe-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="subscribe-001"] [data-part="input"]{
width:100%;height:2.75rem;padding:0 0.875rem;
border:1px solid var(--vibeui-subscribe-001-border);border-radius:0.625rem;
background:var(--vibeui-subscribe-001-field);color:inherit;
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="subscribe-001"] [data-part="input"]::placeholder{color:var(--vibeui-subscribe-001-muted)}
[data-vibeui-block="subscribe-001"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-001-accent);outline-offset:1px;
}
[data-vibeui-block="subscribe-001"] [data-part="button"]{
height:2.75rem;padding:0 1.375rem;border:0;border-radius:0.625rem;
background:var(--vibeui-subscribe-001-accent);color:var(--vibeui-subscribe-001-on-accent);
font:inherit;font-size:0.9375rem;font-weight:650;cursor:pointer;
transition:background .15s ease,transform .15s ease;
}
[data-vibeui-block="subscribe-001"] [data-part="button"]:hover{
background:color-mix(in oklab,var(--vibeui-subscribe-001-accent) 90%,black);
}
[data-vibeui-block="subscribe-001"] [data-part="button"]:active{transform:translateY(1px)}
[data-vibeui-block="subscribe-001"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-001-accent-ink);outline-offset:2px;
}
[data-vibeui-block="subscribe-001"] [data-part="done"]{
margin:0 auto;max-width:26rem;min-height:2.75rem;
display:flex;align-items:center;justify-content:center;gap:0.5rem;
color:var(--vibeui-subscribe-001-ok);font-size:0.9375rem;font-weight:600;
}
[data-vibeui-block="subscribe-001"] [data-part="done"]::before{content:"✓";font-weight:700}
[data-vibeui-block="subscribe-001"] [data-part="note"]{
margin:0.875rem 0 0;color:var(--vibeui-subscribe-001-muted);font-size:0.8125rem;
}
@container (min-width: 30rem){
[data-vibeui-block="subscribe-001"] [data-part="form"]{flex-direction:row}
}
@container (min-width: 48rem){
[data-vibeui-block="subscribe-001"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-001"] *{animation:none!important;transition:none!important}}
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

/** Классическая подписка: заголовок, e-mail, оранжевая кнопка и строка «без спама». */
export function Subscribe001({
  title = "Дайджест VibeUI — раз в неделю",
  lead = "Новые блоки каталога, приёмы вёрстки и короткие разборы: как собрать сайт из готовых секций и не увязнуть в правках.",
  emailLabel = "Электронная почта",
  placeholder = "you@company.ru",
  buttonLabel = "Подписаться",
  note = "Раз в неделю, без спама. Отписка в один клик.",
  success = "Готово! Проверьте почту — там письмо-подтверждение.",
  background = "",
  accent,
  className,
  style,
}: Subscribe001Props) {
  const [done, setDone] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent
      ? {
          "--vibeui-subscribe-001-accent": accent,
          "--vibeui-subscribe-001-accent-ink": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-subscribe-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-subscribe-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="subscribe-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <p data-part="lead">{lead}</p>
          <div aria-live="polite">
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
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
