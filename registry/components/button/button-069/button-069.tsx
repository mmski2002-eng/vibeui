"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button069Props = Omit<
  ComponentProps<"button">,
  "children" | "onChange"
> & {
  label?: string
  /** Подпись, когда напоминание уже включено. */
  activeLabel?: string
  /** О чём напомним и когда. */
  hint?: string
  /** Подсказка во включённом состоянии: как отписаться. */
  activeHint?: string
  defaultSubscribed?: boolean
  onChange?: (subscribed: boolean) => void
  accent?: string
  /** Поверхность страницы. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: подписка на одно событие, а не на рассылку. Колокольчик
// включается нажатием и сразу говорит, о чём именно напомнят: «за час до
// начала» честнее, чем «Вы подписаны». Включённое состояние держится рамкой и
// заполненным колокольчиком — цвет тут второстепенен, его может не быть в теме.
//
// Никаких уведомлений компонент не шлёт: он держит состояние и зовёт onChange.
// Разрешение браузера, расписание и отправку делает приложение.
const STYLES = `
:where([data-vibeui-block="button-069"]){
--vibeui-button-069-bg:transparent;
--vibeui-button-069-fg:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-069-muted:color-mix(in oklab,var(--vibeui-button-069-fg) 60%,transparent);
--vibeui-button-069-border:light-dark(oklch(0.88 0 265),oklch(0.36 0 265));
--vibeui-button-069-surface:light-dark(oklch(1 0 0),oklch(0.24 0.01 265));
--vibeui-button-069-accent:light-dark(oklch(0.55 0.16 60),oklch(0.78 0.14 70));
--vibeui-button-069-radius:9999px;
--vibeui-button-069-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-069"]{color-scheme:dark}
[data-vibeui-block="button-069"]{
display:inline-flex;flex-direction:column;align-items:flex-start;gap:0.375rem;
box-sizing:border-box;background:var(--vibeui-button-069-bg);
font-family:var(--vibeui-button-069-font);color:var(--vibeui-button-069-fg);
}
[data-vibeui-block="button-069"] *{box-sizing:border-box}
[data-vibeui-block="button-069"] [data-part="bell"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.25rem;padding:0.375rem 0.9375rem;
border:1px solid var(--vibeui-button-069-border);
border-radius:var(--vibeui-button-069-radius);
background:var(--vibeui-button-069-surface);color:inherit;
font:inherit;font-size:0.875rem;font-weight:650;letter-spacing:-0.01em;line-height:1;
transition:border-color .16s ease,background-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-069"] [data-part="bell"]:hover{
border-color:var(--vibeui-button-069-fg);
}
[data-vibeui-block="button-069"] [data-part="bell"]:focus-visible{
outline:2px solid var(--vibeui-button-069-accent);outline-offset:2px;
}
/* Включено — рамка и знак берут акцент, колокольчик заливается. Заливать всю
   кнопку не за что: напоминание не главное действие на экране. */
[data-vibeui-block="button-069"][data-on="true"] [data-part="bell"]{
border-color:var(--vibeui-button-069-accent);
color:var(--vibeui-button-069-accent);
background:color-mix(in oklab,var(--vibeui-button-069-accent) 10%,var(--vibeui-button-069-surface));
}
[data-vibeui-block="button-069"] [data-part="icon"]{
width:1rem;height:1rem;flex:none;fill:none;stroke:currentColor;stroke-width:1.7;
stroke-linecap:round;stroke-linejoin:round;
transition:fill .16s ease;
}
[data-vibeui-block="button-069"][data-on="true"] [data-part="icon"]{fill:currentColor}
/* Подпись и пояснение лежат в гриде вместе с невидимой самой длинной
   строкой: иначе кнопка меняет ширину, а пояснение — высоту, и весь блок
   прыгает под курсором ровно в момент нажатия. */
[data-vibeui-block="button-069"] [data-part="text"]{display:grid}
[data-vibeui-block="button-069"] [data-part="text"] > span{grid-area:1 / 1}
[data-vibeui-block="button-069"] [data-part="hintbox"]{display:grid;max-width:20rem}
[data-vibeui-block="button-069"] [data-part="hintbox"] > *{grid-area:1 / 1}
[data-vibeui-block="button-069"] [data-part="ghost"],
[data-vibeui-block="button-069"] [data-ghost="true"]{visibility:hidden;pointer-events:none}
[data-vibeui-block="button-069"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.3;color:var(--vibeui-button-069-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-069"] *{animation:none!important;transition:none!important}}
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

function widest(first: string, second: string) {
  return first.length >= second.length ? first : second
}

/**
 * Кнопка напоминания: колокольчик включает подписку на одно событие и
 * говорит, когда напомнят. Один файл, ноль зависимостей, своя палитра.
 */
export function Button069({
  label = "Уведомить меня",
  activeLabel = "Напомним",
  hint = "Пришлём письмо, когда откроется запись",
  activeHint = "Напомним за час до начала. Нажмите ещё раз, чтобы отменить",
  defaultSubscribed = false,
  onChange,
  accent,
  background = "",
  className,
  style,
  type = "button",
  ...props
}: Button069Props) {
  const [subscribed, setSubscribed] = useState(defaultSubscribed)

  const palette = {
    ...(accent ? { "--vibeui-button-069-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-069-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-069" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="button"
        data-vibeui-block="button-069"
        data-on={subscribed}
        className={className}
        style={palette}
      >
        <button
          {...props}
          type={type}
          data-part="bell"
          aria-pressed={subscribed}
          onClick={() => {
            const next = !subscribed

            setSubscribed(next)
            onChange?.(next)
          }}
        >
          <svg data-part="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
            <path d="M13.7 20a2 2 0 0 1-3.4 0" fill="none" />
          </svg>
          <span data-part="text">
            <span data-part="ghost" aria-hidden="true">
              {widest(label, activeLabel)}
            </span>
            <span>{subscribed ? activeLabel : label}</span>
          </span>
        </button>

        <span data-part="hintbox">
          <span data-part="hint" data-ghost="true" aria-hidden="true">
            {widest(hint, activeHint)}
          </span>
          <p data-part="hint" role="status">
            {subscribed ? activeHint : hint}
          </p>
        </span>
      </div>
    </>
  )
}
