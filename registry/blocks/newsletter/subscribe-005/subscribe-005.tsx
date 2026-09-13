"use client"

import { useState } from "react"
import type { CSSProperties, FormEvent } from "react"

export type Subscribe005Props = {
  title?: string
  count?: string
  proof?: string
  /** Имена для аватаров-инициалов; фото в подписке — лишний вес и стоковая фальшь. */
  readers?: string[]
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

// Подписка с социальным числом: стопка аватаров-инициалов и «12 400
// подписчиков» над формой. Число снимает главный вопрос «а читает ли это
// кто-то вообще» — подписка перестаёт быть прыжком в пустоту. Инициалы
// вместо фото: стоковые лица в таком блоке считываются мгновенно и рушат
// доверие, которое число только что построило. Бэкенда нет: submit гасится
// заглушкой со строкой успеха.
const STYLES = `
:where([data-vibeui-block="subscribe-005"]){
--vibeui-subscribe-005-bg:transparent;
--vibeui-subscribe-005-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-subscribe-005-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-subscribe-005-border:light-dark(oklch(0.89 0 0),oklch(0.36 0 0));
--vibeui-subscribe-005-field:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-subscribe-005-accent:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-subscribe-005-accent-ink:oklch(from var(--vibeui-subscribe-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-005-on-accent:oklch(from var(--vibeui-subscribe-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-005-ok:light-dark(oklch(0.52 0.14 150),oklch(0.76 0.14 150));
--vibeui-subscribe-005-ring:light-dark(oklch(1 0 0),oklch(0.2 0 0));
--vibeui-subscribe-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-subscribe-005-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-005"]{color-scheme:dark}
[data-vibeui-block="subscribe-005"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-subscribe-005-bg);color:var(--vibeui-subscribe-005-ink);
font-family:var(--vibeui-subscribe-005-font);
}
[data-vibeui-block="subscribe-005"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-005"] [data-part="shell"]{
max-width:38rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="subscribe-005"] [data-part="social"]{
display:flex;flex-direction:column;align-items:center;gap:0.625rem;margin:0 0 1.25rem;
}
[data-vibeui-block="subscribe-005"] [data-part="stack"]{
display:flex;padding-left:0.625rem;
}
[data-vibeui-block="subscribe-005"] [data-part="avatar"]{
width:2.5rem;height:2.5rem;margin-left:-0.625rem;border-radius:999px;
display:grid;place-items:center;
/* Кольцо в цвет подложки визуально разрезает стопку на отдельные головы. */
box-shadow:0 0 0 2px var(--vibeui-subscribe-005-ring);
background:color-mix(in oklab,var(--vibeui-subscribe-005-accent) calc(var(--tint)*1%),var(--vibeui-subscribe-005-field));
color:var(--vibeui-subscribe-005-accent-ink);
font-size:0.75rem;font-weight:750;letter-spacing:0.02em;
}
[data-vibeui-block="subscribe-005"] [data-part="proof"]{
margin:0;color:var(--vibeui-subscribe-005-muted);font-size:0.875rem;line-height:1.45;
}
[data-vibeui-block="subscribe-005"] [data-part="count"]{
color:var(--vibeui-subscribe-005-accent-ink);font-weight:750;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="subscribe-005"] [data-part="title"]{
margin:0 0 1.5rem;
font-size:clamp(1.5rem,4.5cqi,2.25rem);line-height:1.12;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="subscribe-005"] [data-part="form"]{
display:flex;flex-direction:column;gap:0.625rem;max-width:26rem;margin:0 auto;
}
[data-vibeui-block="subscribe-005"] [data-part="field"]{flex:1 1 auto;display:block}
[data-vibeui-block="subscribe-005"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="subscribe-005"] [data-part="input"]{
width:100%;height:2.75rem;padding:0 0.875rem;
border:1px solid var(--vibeui-subscribe-005-border);border-radius:0.625rem;
background:var(--vibeui-subscribe-005-field);color:inherit;
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="subscribe-005"] [data-part="input"]::placeholder{color:var(--vibeui-subscribe-005-muted)}
[data-vibeui-block="subscribe-005"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-005-accent);outline-offset:1px;
}
[data-vibeui-block="subscribe-005"] [data-part="button"]{
height:2.75rem;padding:0 1.375rem;border:0;border-radius:0.625rem;
background:var(--vibeui-subscribe-005-accent);color:oklch(from var(--vibeui-subscribe-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.9375rem;font-weight:650;cursor:pointer;
transition:background var(--vibeui-subscribe-005-dur-2) ease,transform var(--vibeui-subscribe-005-dur-2) ease;
}
[data-vibeui-block="subscribe-005"] [data-part="button"]:hover{
background:color-mix(in oklab,var(--vibeui-subscribe-005-accent) 90%,black);
}
[data-vibeui-block="subscribe-005"] [data-part="button"]:active{transform:translateY(1px)}
[data-vibeui-block="subscribe-005"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-subscribe-005-accent-ink);outline-offset:2px;
}
[data-vibeui-block="subscribe-005"] [data-part="done"]{
margin:0 auto;max-width:26rem;min-height:2.75rem;
display:flex;align-items:center;justify-content:center;gap:0.5rem;
color:var(--vibeui-subscribe-005-ok);font-size:0.9375rem;font-weight:600;
}
[data-vibeui-block="subscribe-005"] [data-part="done"]::before{content:"✓";font-weight:700}
[data-vibeui-block="subscribe-005"] [data-part="note"]{
margin:0.875rem 0 0;color:var(--vibeui-subscribe-005-muted);font-size:0.8125rem;
}
@container (min-width: 30rem){
[data-vibeui-block="subscribe-005"] [data-part="form"]{flex-direction:row}
}
@container (min-width: 48rem){
[data-vibeui-block="subscribe-005"] [data-part="shell"]{padding:4.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-005"] *{animation:none!important;transition:none!important}}
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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

const DEFAULT_READERS = [
  "Анна Ковалёва",
  "Игорь Демидов",
  "Мария Соболева",
  "Дмитрий Хан",
  "Ольга Титова",
]

/** Подписка с социальным числом: аватары-инициалы и счётчик подписчиков над формой. */
export function Subscribe005({
  title = "Дайджест, который ждут по пятницам",
  count = "12 400",
  proof = "подписчиков уже получают письмо о новых блоках",
  readers = DEFAULT_READERS,
  emailLabel = "Электронная почта",
  placeholder = "you@company.ru",
  buttonLabel = "Присоединиться",
  note = "Раз в неделю, без спама. Отписка в один клик.",
  success = "Готово! Добро пожаловать в число читателей.",
  background = "",
  accent,
  className,
  style,
}: Subscribe005Props) {
  const [done, setDone] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent
      ? {
          "--vibeui-subscribe-005-accent": accent,
          "--vibeui-subscribe-005-accent-ink": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-subscribe-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-subscribe-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="subscribe-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="social">
            <div data-part="stack" aria-hidden="true">
              {readers.map((name, index) => (
                <span
                  key={name}
                  data-part="avatar"
                  style={{ "--tint": 8 + (index % 3) * 5 } as CSSProperties}
                >
                  {initials(name)}
                </span>
              ))}
            </div>
            <p data-part="proof">
              <span data-part="count">{count}</span> {proof}
            </p>
          </div>
          <h2 data-part="title">{title}</h2>
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
