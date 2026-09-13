"use client"

import { useState } from "react"
import type { CSSProperties, FormEvent } from "react"

export type Subscribe002Props = {
  eyebrow?: string
  title?: string
  lead?: string
  emailLabel?: string
  placeholder?: string
  buttonLabel?: string
  note?: string
  success?: string
  letterFrom?: string
  letterSubject?: string
  letterItems?: string[]
  letterCta?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Подписка с превью письма: слева форма, справа CSS-макет дайджеста.
// Люди не подписываются на кота в мешке — макет показывает, что именно
// придёт в ящик, и снимает половину сомнений до ввода адреса. Письмо
// собрано из настоящего текста, а не серых полос: конкретные заголовки
// выпуска убеждают сильнее любой абстракции. Бэкенда нет: submit гасится
// заглушкой и показывает строку успеха.
const STYLES = `
:where([data-vibeui-block="subscribe-002"]){
--vibeui-subscribe-002-bg:transparent;
--vibeui-subscribe-002-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-subscribe-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-subscribe-002-border:light-dark(oklch(0.89 0 0),oklch(0.36 0 0));
--vibeui-subscribe-002-field:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-subscribe-002-card:light-dark(oklch(1 0 0),oklch(0.24 0 0));
--vibeui-subscribe-002-accent:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-subscribe-002-accent-ink:oklch(from var(--vibeui-subscribe-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-002-on-accent:oklch(from var(--vibeui-subscribe-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-002-ok:light-dark(oklch(0.52 0.14 150),oklch(0.76 0.14 150));
--vibeui-subscribe-002-shadow:light-dark(oklch(0.2 0 0 / 55%),oklch(0.05 0 0 / 85%));
--vibeui-subscribe-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-subscribe-002-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-002"]{color-scheme:dark}
[data-vibeui-block="subscribe-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-subscribe-002-bg);color:var(--vibeui-subscribe-002-ink);
font-family:var(--vibeui-subscribe-002-font);
}
[data-vibeui-block="subscribe-002"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-002"] [data-part="shell"]{
max-width:70rem;margin:0 auto;padding:3rem 1.25rem;
display:grid;gap:2.5rem;align-items:center;
}
[data-vibeui-block="subscribe-002"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-subscribe-002-accent-ink);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="subscribe-002"] [data-part="title"]{
margin:0 0 0.75rem;max-width:22ch;
font-size:clamp(1.5rem,4.5cqi,2.375rem);line-height:1.1;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="subscribe-002"] [data-part="lead"]{
margin:0 0 1.5rem;max-width:48ch;
color:var(--vibeui-subscribe-002-muted);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="subscribe-002"] [data-part="form"]{
display:flex;flex-direction:column;gap:0.625rem;max-width:26rem;
}
[data-vibeui-block="subscribe-002"] [data-part="field"]{flex:1 1 auto;display:block}
[data-vibeui-block="subscribe-002"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="subscribe-002"] [data-part="input"]{
width:100%;height:2.75rem;padding:0 0.875rem;
border:1px solid var(--vibeui-subscribe-002-border);border-radius:0.625rem;
background:var(--vibeui-subscribe-002-field);color:inherit;
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="subscribe-002"] [data-part="input"]::placeholder{color:var(--vibeui-subscribe-002-muted)}
[data-vibeui-block="subscribe-002"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-002-accent);outline-offset:1px;
}
[data-vibeui-block="subscribe-002"] [data-part="button"]{
height:2.75rem;padding:0 1.375rem;border:0;border-radius:0.625rem;
background:var(--vibeui-subscribe-002-accent);color:oklch(from var(--vibeui-subscribe-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.9375rem;font-weight:650;cursor:pointer;
transition:background var(--vibeui-subscribe-002-dur-2) ease,transform var(--vibeui-subscribe-002-dur-2) ease;
}
[data-vibeui-block="subscribe-002"] [data-part="button"]:hover{
background:color-mix(in oklab,var(--vibeui-subscribe-002-accent) 90%,black);
}
[data-vibeui-block="subscribe-002"] [data-part="button"]:active{transform:translateY(1px)}
[data-vibeui-block="subscribe-002"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-002-accent-ink);outline-offset:2px;
}
[data-vibeui-block="subscribe-002"] [data-part="done"]{
margin:0;max-width:26rem;min-height:2.75rem;
display:flex;align-items:center;gap:0.5rem;
color:var(--vibeui-subscribe-002-ok);font-size:0.9375rem;font-weight:600;
}
[data-vibeui-block="subscribe-002"] [data-part="done"]::before{content:"✓";font-weight:700}
[data-vibeui-block="subscribe-002"] [data-part="note"]{
margin:0.875rem 0 0;color:var(--vibeui-subscribe-002-muted);font-size:0.8125rem;
}
[data-vibeui-block="subscribe-002"] [data-part="letter"]{
min-inline-size:0;margin:0;
border:1px solid var(--vibeui-subscribe-002-border);border-radius:1rem;
background:var(--vibeui-subscribe-002-card);
box-shadow:0 30px 60px -40px var(--vibeui-subscribe-002-shadow);
overflow:hidden;
}
[data-vibeui-block="subscribe-002"] [data-part="letter-head"]{
display:flex;align-items:center;gap:0.75rem;
padding:1rem 1.25rem;border-bottom:1px solid var(--vibeui-subscribe-002-border);
}
[data-vibeui-block="subscribe-002"] [data-part="letter-avatar"]{
width:2.25rem;height:2.25rem;flex:none;border-radius:0.625rem;
display:grid;place-items:center;
background:color-mix(in oklab,var(--vibeui-subscribe-002-accent) 14%,var(--vibeui-subscribe-002-card));
color:var(--vibeui-subscribe-002-accent-ink);font-size:0.9375rem;font-weight:750;
}
[data-vibeui-block="subscribe-002"] [data-part="letter-meta"]{display:grid;gap:0.125rem;min-width:0}
[data-vibeui-block="subscribe-002"] [data-part="letter-from"]{
color:var(--vibeui-subscribe-002-muted);font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="subscribe-002"] [data-part="letter-subject"]{
font-size:0.875rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="subscribe-002"] [data-part="letter-body"]{
display:grid;gap:0.75rem;padding:1.25rem;
}
[data-vibeui-block="subscribe-002"] [data-part="letter-row"]{
display:flex;align-items:flex-start;gap:0.75rem;
padding:0.75rem;border:1px solid var(--vibeui-subscribe-002-border);border-radius:0.75rem;
}
[data-vibeui-block="subscribe-002"] [data-part="letter-thumb"]{
width:1.75rem;height:1.75rem;flex:none;border-radius:0.5rem;margin-top:0.0625rem;
background:linear-gradient(135deg,var(--vibeui-subscribe-002-accent),color-mix(in oklab,var(--vibeui-subscribe-002-accent) 55%,var(--vibeui-subscribe-002-card)));
}
[data-vibeui-block="subscribe-002"] [data-part="letter-text"]{
font-size:0.8125rem;line-height:1.45;min-width:0;
}
[data-vibeui-block="subscribe-002"] [data-part="letter-cta"]{
padding:0.25rem 0 0.125rem;
color:var(--vibeui-subscribe-002-accent-ink);font-size:0.8125rem;font-weight:650;
}
@container (min-width: 30rem){
[data-vibeui-block="subscribe-002"] [data-part="form"]{flex-direction:row}
}
@container (min-width: 52rem){
[data-vibeui-block="subscribe-002"] [data-part="shell"]{
grid-template-columns:1.1fr 1fr;gap:3.5rem;padding:4.5rem 2rem;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-002"] *{animation:none!important;transition:none!important}}
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

const DEFAULT_LETTER_ITEMS = [
  "Полоса подписки для середины лендинга — и когда она работает лучше футера",
  "Тёмная карточка с градиент-свечением: как не пересветить акцент",
  "Container queries в превью: почему миниатюра больше не врёт про дизайн",
]

/** Подписка с превью письма: форма слева, CSS-макет дайджеста справа. */
export function Subscribe002({
  eyebrow = "Рассылка",
  title = "Видно, на что подписываетесь",
  lead = "Каждую пятницу — короткий дайджест: новые блоки каталога, приёмы вёрстки и одна идея для следующего лендинга. Справа — настоящий выпуск.",
  emailLabel = "Электронная почта",
  placeholder = "you@company.ru",
  buttonLabel = "Получать дайджест",
  note = "Раз в неделю, без спама. Отписка в один клик.",
  success = "Готово! Первый выпуск придёт в пятницу.",
  letterFrom = "VibeUI · Дайджест №47",
  letterSubject = "Три новых блока и приём с container queries",
  letterItems = DEFAULT_LETTER_ITEMS,
  letterCta = "Открыть каталог →",
  background = "",
  accent,
  className,
  style,
}: Subscribe002Props) {
  const [done, setDone] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent
      ? {
          "--vibeui-subscribe-002-accent": accent,
          "--vibeui-subscribe-002-accent-ink": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-subscribe-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-subscribe-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="subscribe-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="copy">
            <p data-part="eyebrow">{eyebrow}</p>
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
          <div data-part="letter" aria-hidden="true">
            <div data-part="letter-head">
              <span data-part="letter-avatar">V</span>
              <span data-part="letter-meta">
                <span data-part="letter-from">{letterFrom}</span>
                <span data-part="letter-subject">{letterSubject}</span>
              </span>
            </div>
            <div data-part="letter-body">
              {letterItems.map((item) => (
                <div key={item} data-part="letter-row">
                  <span data-part="letter-thumb" />
                  <span data-part="letter-text">{item}</span>
                </div>
              ))}
              <span data-part="letter-cta">{letterCta}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
