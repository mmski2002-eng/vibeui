"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Banner012Props = Omit<ComponentProps<"div">, "children"> & {
  message?: string
  code?: string
  actionLabel?: string
  actionHref?: string
  /** Сколько секунд осталось до конца акции. */
  seconds?: number
  /** Подписи единиц под цифрами. */
  unitText?: Record<string, string>
  endedLabel?: string
  accent?: string
  /** Пусто — подложки нет, полоса лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: акция, у которой видно, сколько осталось. Обычное «только
// сегодня» ничего не говорит: сегодня — это ещё десять часов или сорок минут.
// Отсчёт разложен на группы с подписями, цифры набраны моноширинными и не
// прыгают при смене секунды. Полоса сдержанная: у срочности и так есть
// собственный голос — таймер, — и заливать её градиентом поверх этого значит
// спорить с самим собой. Когда время вышло, полоса не исчезает молча, а
// говорит об этом: исчезнувшая скидка выглядит как ошибка сайта.
const STYLES = `
:where([data-vibeui-block="banner-012"]){
--vibeui-banner-012-bg:transparent;
--vibeui-banner-012-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.005 265));
--vibeui-banner-012-muted:color-mix(in oklab,var(--vibeui-banner-012-fg) 66%,transparent);
--vibeui-banner-012-surface:light-dark(oklch(0.98 0.008 300),oklch(0.26 0.024 300));
--vibeui-banner-012-border:light-dark(oklch(0.9 0.02 300),oklch(0.38 0.03 300));
--vibeui-banner-012-accent:light-dark(oklch(0.5 0.19 300),oklch(0.8 0.14 300));
/* Текст на акценте считается из его светлоты: проект передаёт один цвет на
   обе ветки темы, и фиксированный однажды окажется тёмным на тёмном. */
--vibeui-banner-012-on-accent:oklch(from var(--vibeui-banner-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-banner-012-radius:0.75rem;
--vibeui-banner-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-banner-012-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-012"]{color-scheme:dark}
[data-vibeui-block="banner-012"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.875rem;
box-sizing:border-box;width:100%;padding:0.75rem 1rem;
background:var(--vibeui-banner-012-surface);
border:1px solid var(--vibeui-banner-012-border);
border-radius:var(--vibeui-banner-012-radius);
color:var(--vibeui-banner-012-fg);
font-family:var(--vibeui-banner-012-font);
}
[data-vibeui-block="banner-012"] *{box-sizing:border-box}
[data-vibeui-block="banner-012"] [data-part="text"]{
flex:1;min-width:12rem;display:flex;flex-direction:column;gap:0.1875rem;
}
[data-vibeui-block="banner-012"] [data-part="message"]{font-size:0.875rem;line-height:1.35}
[data-vibeui-block="banner-012"] [data-part="code"]{
align-self:flex-start;padding:0.0625rem 0.375rem;border-radius:0.375rem;
border:1px dashed var(--vibeui-banner-012-accent);
color:var(--vibeui-banner-012-accent);
font-family:var(--vibeui-banner-012-mono);font-size:0.75rem;letter-spacing:0.04em;
}
/* Группы отсчёта: цифра сверху, единица под ней. Строка «02:14:37» без
   подписей читается как время, а не как остаток. */
[data-vibeui-block="banner-012"] [data-part="clock"]{
display:flex;align-items:flex-start;gap:0.375rem;flex:none;
}
[data-vibeui-block="banner-012"] [data-part="unit"]{
display:flex;flex-direction:column;align-items:center;gap:0.125rem;
min-width:2.5rem;padding:0.25rem 0.375rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-banner-012-accent) 12%,transparent);
}
[data-vibeui-block="banner-012"] [data-part="value"]{
font-family:var(--vibeui-banner-012-mono);
font-size:1.0625rem;font-weight:650;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="banner-012"] [data-part="caption"]{
font-size:0.625rem;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-banner-012-muted);
}
[data-vibeui-block="banner-012"] [data-part="action"]{
flex:none;display:inline-flex;align-items:center;
height:2.125rem;padding:0 0.875rem;border-radius:0.5rem;
border:1px solid color-mix(in oklab,var(--vibeui-banner-012-accent) 65%,var(--vibeui-banner-012-fg) 35%);
background:var(--vibeui-banner-012-accent);color:var(--vibeui-banner-012-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;text-decoration:none;
}
[data-vibeui-block="banner-012"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-banner-012-accent);outline-offset:2px;
}
[data-vibeui-block="banner-012"] [data-part="ended"]{
flex:none;font-size:0.8125rem;font-weight:600;color:var(--vibeui-banner-012-muted);
}
@container (max-width: 30rem){
[data-vibeui-block="banner-012"] [data-part="action"]{width:100%;justify-content:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-012"] *{animation:none!important;transition:none!important}}
`

const UNIT_TEXT: Record<string, string> = {
  days: "дн",
  hours: "час",
  minutes: "мин",
  seconds: "сек",
}

/** Раскладывает остаток на группы. Дни показываются, только если они есть. */
function split(total: number) {
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60

  const groups: { key: string; value: string }[] = []

  if (days > 0) {
    groups.push({ key: "days", value: String(days) })
  }

  groups.push(
    { key: "hours", value: String(hours).padStart(2, "0") },
    { key: "minutes", value: String(minutes).padStart(2, "0") },
  )

  // Секунды прячутся, пока остаются сутки: бегущая цифра на таком сроке
  // только отвлекает.
  if (days === 0) {
    groups.push({ key: "seconds", value: String(seconds).padStart(2, "0") })
  }

  return groups
}

/**
 * Полоса акции с обратным отсчётом: видно, сколько осталось на самом деле.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner012({
  message = "Годовая подписка на 30% дешевле",
  code = "AUTUMN30",
  actionLabel = "Забрать скидку",
  actionHref = "#",
  seconds = 8130,
  unitText = UNIT_TEXT,
  endedLabel = "Время вышло",
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner012Props) {
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    if (left <= 0) {
      return
    }

    const timer = setInterval(() => {
      setLeft((value) => (value <= 1 ? 0 : value - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [left])

  const palette = {
    ...(accent ? { "--vibeui-banner-012-accent": accent } : null),
    ...(background ? { "--vibeui-banner-012-surface": background } : null),
    ...style,
  } as CSSProperties

  const groups = split(left)

  return (
    <>
      <style href="vibeui-banner-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-012"
        role="region"
        aria-label={message}
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="message">{message}</span>
          {code ? <span data-part="code">{code}</span> : null}
        </span>

        {left > 0 ? (
          // Отсчёт не объявляется вслух каждую секунду: aria-live здесь
          // превратил бы полосу в непрерывную речь.
          <span data-part="clock" aria-hidden="true">
            {groups.map((group) => (
              <span key={group.key} data-part="unit">
                <span data-part="value">{group.value}</span>
                <span data-part="caption">
                  {unitText[group.key] ?? UNIT_TEXT[group.key]}
                </span>
              </span>
            ))}
          </span>
        ) : (
          <span data-part="ended">{endedLabel}</span>
        )}

        {left > 0 ? (
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        ) : null}
      </div>
    </>
  )
}
