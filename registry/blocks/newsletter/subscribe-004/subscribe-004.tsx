"use client"

import { useState } from "react"
import type { CSSProperties, FormEvent } from "react"

type Subscribe004Topic = {
  label: string
  on?: boolean
}

export type Subscribe004Props = {
  title?: string
  lead?: string
  topicsLabel?: string
  topics?: Subscribe004Topic[]
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

// Подписка с выбором тем: чипы-чекбоксы над формой. Выбор тем — обещание
// присылать только нужное, оно снимает страх «завалят письмами» лучше
// любых клятв. Чекбоксы одеты в чипы, но остаются настоящими инпутами:
// клавиатура и скринридер работают как с обычной формой, состояние рисует
// :has() без единой строки JS. Бэкенда нет: submit гасится заглушкой.
const STYLES = `
:where([data-vibeui-block="subscribe-004"]){
--vibeui-subscribe-004-bg:transparent;
--vibeui-subscribe-004-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-subscribe-004-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-subscribe-004-border:light-dark(oklch(0.89 0 0),oklch(0.36 0 0));
--vibeui-subscribe-004-field:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-subscribe-004-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-subscribe-004-accent-ink:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-subscribe-004-on-accent:oklch(0.15 0.02 39.8);
--vibeui-subscribe-004-ok:light-dark(oklch(0.52 0.14 150),oklch(0.76 0.14 150));
--vibeui-subscribe-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-004"]{color-scheme:dark}
[data-vibeui-block="subscribe-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-subscribe-004-bg);color:var(--vibeui-subscribe-004-ink);
font-family:var(--vibeui-subscribe-004-font);
}
[data-vibeui-block="subscribe-004"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-004"] [data-part="shell"]{
max-width:38rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="subscribe-004"] [data-part="title"]{
margin:0 0 0.75rem;
font-size:clamp(1.5rem,4.5cqi,2.25rem);line-height:1.12;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="subscribe-004"] [data-part="lead"]{
margin:0 auto 1.5rem;max-width:46ch;
color:var(--vibeui-subscribe-004-muted);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="subscribe-004"] [data-part="topics"]{
border:0;padding:0;margin:0 0 1.25rem;
}
[data-vibeui-block="subscribe-004"] [data-part="topics-label"]{
display:block;margin:0 auto 0.625rem;padding:0;
color:var(--vibeui-subscribe-004-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="subscribe-004"] [data-part="chips"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;
}
[data-vibeui-block="subscribe-004"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.5rem 0.875rem;border-radius:999px;
border:1px solid var(--vibeui-subscribe-004-border);
background:var(--vibeui-subscribe-004-field);
font-size:0.875rem;font-weight:500;cursor:pointer;user-select:none;
transition:background .15s ease,border-color .15s ease,color .15s ease;
}
[data-vibeui-block="subscribe-004"] [data-part="chip"]:hover{
border-color:color-mix(in oklab,var(--vibeui-subscribe-004-accent) 40%,var(--vibeui-subscribe-004-border));
}
[data-vibeui-block="subscribe-004"] [data-part="chip"]:has(input:checked){
background:color-mix(in oklab,var(--vibeui-subscribe-004-accent) 12%,var(--vibeui-subscribe-004-field));
border-color:color-mix(in oklab,var(--vibeui-subscribe-004-accent) 55%,var(--vibeui-subscribe-004-border));
color:var(--vibeui-subscribe-004-accent-ink);
}
[data-vibeui-block="subscribe-004"] [data-part="chip"]:has(input:focus-visible){
outline:2px solid var(--vibeui-subscribe-004-accent);outline-offset:2px;
}
[data-vibeui-block="subscribe-004"] [data-part="tick"]{
width:1em;text-align:center;opacity:0;transform:scale(0.5);
transition:opacity .15s ease,transform .15s ease;
}
[data-vibeui-block="subscribe-004"] [data-part="chip"]:has(input:checked) [data-part="tick"]{
opacity:1;transform:none;
}
[data-vibeui-block="subscribe-004"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="subscribe-004"] [data-part="form"]{
display:flex;flex-direction:column;gap:0.625rem;max-width:26rem;margin:0 auto;
}
[data-vibeui-block="subscribe-004"] [data-part="field"]{flex:1 1 auto;display:block}
[data-vibeui-block="subscribe-004"] [data-part="input"]{
width:100%;height:2.75rem;padding:0 0.875rem;
border:1px solid var(--vibeui-subscribe-004-border);border-radius:0.625rem;
background:var(--vibeui-subscribe-004-field);color:inherit;
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="subscribe-004"] [data-part="input"]::placeholder{color:var(--vibeui-subscribe-004-muted)}
[data-vibeui-block="subscribe-004"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-004-accent);outline-offset:1px;
}
[data-vibeui-block="subscribe-004"] [data-part="button"]{
height:2.75rem;padding:0 1.375rem;border:0;border-radius:0.625rem;
background:var(--vibeui-subscribe-004-accent);color:var(--vibeui-subscribe-004-on-accent);
font:inherit;font-size:0.9375rem;font-weight:650;cursor:pointer;
transition:background .15s ease,transform .15s ease;
}
[data-vibeui-block="subscribe-004"] [data-part="button"]:hover{
background:color-mix(in oklab,var(--vibeui-subscribe-004-accent) 90%,black);
}
[data-vibeui-block="subscribe-004"] [data-part="button"]:active{transform:translateY(1px)}
[data-vibeui-block="subscribe-004"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-004-accent-ink);outline-offset:2px;
}
[data-vibeui-block="subscribe-004"] [data-part="done"]{
margin:0 auto;max-width:26rem;min-height:2.75rem;
display:flex;align-items:center;justify-content:center;gap:0.5rem;
color:var(--vibeui-subscribe-004-ok);font-size:0.9375rem;font-weight:600;
}
[data-vibeui-block="subscribe-004"] [data-part="done"]::before{content:"✓";font-weight:700}
[data-vibeui-block="subscribe-004"] [data-part="note"]{
margin:0.875rem 0 0;color:var(--vibeui-subscribe-004-muted);font-size:0.8125rem;
}
@container (min-width: 30rem){
[data-vibeui-block="subscribe-004"] [data-part="form"]{flex-direction:row}
}
@container (min-width: 48rem){
[data-vibeui-block="subscribe-004"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-004"] *{animation:none!important;transition:none!important}}
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

const DEFAULT_TOPICS: Subscribe004Topic[] = [
  { label: "Продукт", on: true },
  { label: "Дизайн" },
  { label: "Релизы", on: true },
]

/** Подписка с выбором тем: чипы-чекбоксы, e-mail и оранжевая кнопка. */
export function Subscribe004({
  title = "Соберите свой дайджест",
  lead = "Отметьте, о чём писать: про продукт, про дизайн или только про релизы. Присылаем ровно то, что выбрали, — и ничего сверх.",
  topicsLabel = "Что присылать",
  topics = DEFAULT_TOPICS,
  emailLabel = "Электронная почта",
  placeholder = "you@company.ru",
  buttonLabel = "Подписаться",
  note = "Темы можно поменять в любом письме, отписка в один клик.",
  success = "Готово! Дайджест собран под ваши темы.",
  background = "",
  accent,
  className,
  style,
}: Subscribe004Props) {
  const [done, setDone] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent
      ? {
          "--vibeui-subscribe-004-accent": accent,
          "--vibeui-subscribe-004-accent-ink": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-subscribe-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-subscribe-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="subscribe-004"
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
              <form onSubmit={handleSubmit}>
                <fieldset data-part="topics">
                  <legend data-part="topics-label">{topicsLabel}</legend>
                  <div data-part="chips">
                    {topics.map((topic) => (
                      <label key={topic.label} data-part="chip">
                        <input
                          data-part="sr"
                          type="checkbox"
                          name="topics"
                          value={topic.label}
                          defaultChecked={topic.on}
                        />
                        <span data-part="tick" aria-hidden="true">
                          ✓
                        </span>
                        {topic.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div data-part="form">
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
                </div>
              </form>
            )}
          </div>
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
