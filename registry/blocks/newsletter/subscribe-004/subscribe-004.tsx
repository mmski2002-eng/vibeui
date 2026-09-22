"use client"

import { useState } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
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
--vibeui-subscribe-004-accent:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-subscribe-004-accent-ink:oklch(from var(--vibeui-subscribe-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-004-on-accent:oklch(from var(--vibeui-subscribe-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-004-ok:light-dark(oklch(0.52 0.14 150),oklch(0.76 0.14 150));
--vibeui-subscribe-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-subscribe-004-dur-2:180ms;
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
[data-vibeui-block="subscribe-004"] [data-part="heading"]{margin-bottom:0.75rem}
[data-vibeui-block="subscribe-004"] [data-part="shell"]{
max-width:38rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
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
transition:background var(--vibeui-subscribe-004-dur-2) ease,border-color var(--vibeui-subscribe-004-dur-2) ease,color var(--vibeui-subscribe-004-dur-2) ease;
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
transition:opacity var(--vibeui-subscribe-004-dur-2) ease,transform var(--vibeui-subscribe-004-dur-2) ease;
}
[data-vibeui-block="subscribe-004"] [data-part="chip"]:has(input:checked) [data-part="tick"]{
opacity:1;transform:none;
}
[data-vibeui-block="subscribe-004"] [data-part="visually-hidden"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="subscribe-004"] [data-part="form"]{
display:flex;flex-direction:column;gap:0.625rem;max-width:26rem;margin:0 auto;
}
/* Поле input-001 растягивается на остаток строки, кнопка — button-001. */
[data-vibeui-block="subscribe-004"] [data-part="form"] > [data-vibeui-block="input-001"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="subscribe-004"] [data-part="form"] > [data-vibeui-block="button-001"]{align-self:center}
[data-vibeui-block="subscribe-004"] [data-part="done"]{
margin:0 auto;max-width:26rem;min-height:2.75rem;
display:flex;align-items:center;justify-content:center;gap:0.5rem;
color:var(--vibeui-subscribe-004-ok);font-size:0.9375rem;font-weight:600;
}
[data-vibeui-block="subscribe-004"] [data-part="done"]::before{content:"✓";font-weight:700}
[data-vibeui-block="subscribe-004"] [data-part="footnote"]{
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
          <Heading001
            data-part="heading"
            title={title}
            align="center"
            accent={accent}
            lede={lead}
          />
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
                          data-part="visually-hidden"
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
                  <Input001
                    type="email"
                    name="email"
                    required
                    label={emailLabel}
                    autoComplete="email"
                    accent={accent}
                  />
                  <Button001 type="submit" size="lg" accent={accent}>
                    {buttonLabel}
                  </Button001>
                </div>
              </form>
            )}
          </div>
          <p data-part="footnote">{note}</p>
        </div>
      </section>
    </>
  )
}
