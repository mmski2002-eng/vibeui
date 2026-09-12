"use client"

import { useState } from "react"
import type { CSSProperties, FormEvent } from "react"

export type Subscribe006Props = {
  eyebrow?: string
  title?: string
  lead?: string
  emailLabel?: string
  placeholder?: string
  buttonLabel?: string
  note?: string
  success?: string
  /** Пусто — фона вокруг карточки нет, она лежит прямо на странице. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Тёмная карточка подписки с оранжевым градиент-свечением. Карточка нарочно
// не следует теме страницы: собственная тёмная подложка выделяет подписку
// на любом фоне, а свечение из угла даёт бренду появиться без единой
// картинки. Внутри карточки принудительный color-scheme: dark — иначе
// нативные поля на светлой странице остались бы светлыми и разорвали
// картинку. Бэкенда нет: submit гасится заглушкой со строкой успеха.
const STYLES = `
:where([data-vibeui-block="subscribe-006"]){
--vibeui-subscribe-006-bg:transparent;
--vibeui-subscribe-006-card:oklch(0.19 0 0);
--vibeui-subscribe-006-ink:oklch(0.95 0 0);
--vibeui-subscribe-006-muted:oklch(0.95 0 0 / 62%);
--vibeui-subscribe-006-border:oklch(1 0 0 / 14%);
--vibeui-subscribe-006-field:oklch(1 0 0 / 8%);
--vibeui-subscribe-006-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-subscribe-006-on-accent:oklch(from var(--vibeui-subscribe-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-006-ok:oklch(0.76 0.14 150);
--vibeui-subscribe-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-006"]{color-scheme:dark}
[data-vibeui-block="subscribe-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-subscribe-006-bg);
font-family:var(--vibeui-subscribe-006-font);
}
[data-vibeui-block="subscribe-006"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-006"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:2.5rem 1.25rem;
display:flex;justify-content:center;
}
[data-vibeui-block="subscribe-006"] [data-part="card"]{
/* Осознанно своя тёмная подложка: карточка не следует теме страницы.
   color-scheme:dark внутри — чтобы нативные поля темнели вместе с ней. */
color-scheme:dark;
width:100%;max-width:26rem;min-inline-size:0;
padding:2rem 1.75rem;border-radius:1.25rem;
border:1px solid var(--vibeui-subscribe-006-border);
background:
radial-gradient(120% 90% at 88% -12%,color-mix(in oklab,var(--vibeui-subscribe-006-accent) 32%,transparent),transparent 58%),
radial-gradient(80% 60% at -10% 110%,color-mix(in oklab,var(--vibeui-subscribe-006-accent) 12%,transparent),transparent 55%),
var(--vibeui-subscribe-006-card);
color:var(--vibeui-subscribe-006-ink);
}
[data-vibeui-block="subscribe-006"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.375rem;margin:0 0 1rem;
padding:0.25rem 0.625rem;border-radius:999px;
border:1px solid color-mix(in oklab,var(--vibeui-subscribe-006-accent) 45%,transparent);
color:var(--vibeui-subscribe-006-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="subscribe-006"] [data-part="title"]{
margin:0 0 0.625rem;
font-size:clamp(1.25rem,4cqi,1.625rem);line-height:1.2;letter-spacing:-0.015em;font-weight:700;
}
[data-vibeui-block="subscribe-006"] [data-part="lead"]{
margin:0 0 1.375rem;color:var(--vibeui-subscribe-006-muted);
font-size:0.875rem;line-height:1.55;
}
[data-vibeui-block="subscribe-006"] [data-part="form"]{
display:flex;flex-direction:column;gap:0.625rem;
}
[data-vibeui-block="subscribe-006"] [data-part="field"]{display:block}
[data-vibeui-block="subscribe-006"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="subscribe-006"] [data-part="input"]{
width:100%;height:2.75rem;padding:0 0.875rem;
border:1px solid var(--vibeui-subscribe-006-border);border-radius:0.625rem;
background:var(--vibeui-subscribe-006-field);color:var(--vibeui-subscribe-006-ink);
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="subscribe-006"] [data-part="input"]::placeholder{color:var(--vibeui-subscribe-006-muted)}
[data-vibeui-block="subscribe-006"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-006-accent);outline-offset:1px;
}
[data-vibeui-block="subscribe-006"] [data-part="button"]{
height:2.75rem;padding:0 1.375rem;border:0;border-radius:0.625rem;
background:var(--vibeui-subscribe-006-accent);color:oklch(from var(--vibeui-subscribe-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.9375rem;font-weight:650;cursor:pointer;
transition:background .15s ease,transform .15s ease;
}
[data-vibeui-block="subscribe-006"] [data-part="button"]:hover{
background:color-mix(in oklab,var(--vibeui-subscribe-006-accent) 88%,white);
}
[data-vibeui-block="subscribe-006"] [data-part="button"]:active{transform:translateY(1px)}
[data-vibeui-block="subscribe-006"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-006-ink);outline-offset:2px;
}
[data-vibeui-block="subscribe-006"] [data-part="done"]{
margin:0;min-height:2.75rem;display:flex;align-items:center;gap:0.5rem;
color:var(--vibeui-subscribe-006-ok);font-size:0.9375rem;font-weight:600;
}
[data-vibeui-block="subscribe-006"] [data-part="done"]::before{content:"✓";font-weight:700}
[data-vibeui-block="subscribe-006"] [data-part="note"]{
margin:0.875rem 0 0;color:var(--vibeui-subscribe-006-muted);font-size:0.75rem;
}
@container (min-width: 48rem){
[data-vibeui-block="subscribe-006"] [data-part="shell"]{padding:3.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-006"] *{animation:none!important;transition:none!important}}
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

/** Компактная тёмная карточка подписки с оранжевым градиент-свечением. */
export function Subscribe006({
  eyebrow = "Рассылка",
  title = "Письма, после которых открывают редактор",
  lead = "Раз в неделю: новые блоки VibeUI, приём вёрстки и одна готовая идея для лендинга. Коротко, по делу, с кодом.",
  emailLabel = "Электронная почта",
  placeholder = "you@company.ru",
  buttonLabel = "Подписаться",
  note = "Без спама. Отписка в один клик в любом письме.",
  success = "Готово! Письмо-подтверждение уже в ящике.",
  background = "",
  accent,
  className,
  style,
}: Subscribe006Props) {
  const [done, setDone] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-subscribe-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-subscribe-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-subscribe-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="subscribe-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <p data-part="badge">{eyebrow}</p>
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
        </div>
      </section>
    </>
  )
}
