"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Banner009Props = Omit<ComponentProps<"div">, "children"> & {
  email?: string
  message?: string
  actionLabel?: string
  /** Сколько секунд ждать до следующей отправки. */
  cooldown?: number
  /** Подпись обратного отсчёта. {seconds} — сколько осталось. */
  waitTemplate?: string
  sentLabel?: string
  onResend?: () => void
  accent?: string
  /** Пусто — подложки нет, полоса лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: полоса «подтвердите адрес» с честным ожиданием. Обычная
// реализация даёт кнопку «отправить снова», и человек жмёт её пять раз подряд,
// потому что письмо идёт медленнее нажатий — а сервер после этого молчит уже
// по своей воле. Здесь кнопка после нажатия становится обратным отсчётом:
// видно, что письмо ушло и когда можно повторить. Отсчёт идёт в самой кнопке,
// поэтому строка не прыгает по высоте, а адрес всегда на виду — с ошибкой в
// адресе повторная отправка бессмысленна.
const STYLES = `
:where([data-vibeui-block="banner-009"]){
--vibeui-banner-009-bg:transparent;
--vibeui-banner-009-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-banner-009-muted:color-mix(in oklab,var(--vibeui-banner-009-fg) 68%,transparent);
--vibeui-banner-009-surface:light-dark(oklch(0.98 0.012 85),oklch(0.28 0.026 85));
--vibeui-banner-009-border:light-dark(oklch(0.88 0 0),oklch(0.42 0 0));
--vibeui-banner-009-accent:light-dark(oklch(0.28 0 0),oklch(0.917 0 0));
/* Текст на акценте считается из его светлоты: проект задаёт один цвет на обе
   ветки темы, и фиксированный однажды окажется тёмным на тёмном. */
--vibeui-banner-009-on-accent:oklch(from var(--vibeui-banner-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-banner-009-radius:0.625rem;
--vibeui-banner-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-009"]{color-scheme:dark}
[data-vibeui-block="banner-009"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);padding:0.75rem 1rem;
background:var(--vibeui-banner-009-surface);
border:1px solid var(--vibeui-banner-009-border);
border-radius:var(--vibeui-banner-009-radius);
color:var(--vibeui-banner-009-fg);
font-family:var(--vibeui-banner-009-font);
}
[data-vibeui-block="banner-009"] *{box-sizing:border-box}
/* Конверт нарисован рамкой: иконочный пакет ради одного прямоугольника —
   лишняя зависимость. */
[data-vibeui-block="banner-009"] [data-part="mark"]{
position:relative;flex:none;width:1.125rem;height:0.875rem;
border:1.5px solid var(--vibeui-banner-009-accent);border-radius:0.1875rem;
}
[data-vibeui-block="banner-009"] [data-part="mark"]::after{
content:"";position:absolute;inset:0.0625rem 0.125rem auto;height:0.5rem;
border-top:1.5px solid var(--vibeui-banner-009-accent);
rotate:-8deg;transform-origin:left top;
}
[data-vibeui-block="banner-009"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;flex:1;
}
[data-vibeui-block="banner-009"] [data-part="message"]{
font-size:0.875rem;line-height:1.35;
}
[data-vibeui-block="banner-009"] [data-part="email"]{
font-size:0.8125rem;color:var(--vibeui-banner-009-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="banner-009"] [data-part="action"]{
flex:none;appearance:none;cursor:pointer;
min-width:9.5rem;min-height:2.125rem;padding:0.25rem 0.875rem;display:inline-flex;align-items:center;justify-content:center;
border:1px solid color-mix(in oklab,var(--vibeui-banner-009-accent) 65%,var(--vibeui-banner-009-fg) 35%);
border-radius:0.5rem;
background:var(--vibeui-banner-009-accent);color:oklch(from var(--vibeui-banner-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
font-variant-numeric:tabular-nums;
}
/* Ожидание живёт в той же кнопке: отдельная строка отсчёта дёргала бы высоту
   полосы каждую секунду. */
[data-vibeui-block="banner-009"] [data-part="action"]:disabled{
cursor:not-allowed;background:transparent;color:var(--vibeui-banner-009-muted);
border-color:var(--vibeui-banner-009-border);
}
[data-vibeui-block="banner-009"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-banner-009-accent);outline-offset:2px;
}
@container (max-width: 30rem){
[data-vibeui-block="banner-009"] [data-part="action"]{width:calc(100% - 1.875rem);min-width:0;margin-left:1.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Полоса подтверждения адреса: повтор с обратным отсчётом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner009({
  email = "anna@vibeui.ru",
  message = "Подтвердите адрес — письмо со ссылкой уже отправлено.",
  actionLabel = "Отправить снова",
  cooldown = 45,
  waitTemplate = "Можно через {seconds} с",
  sentLabel = "Письмо отправлено",
  onResend,
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner009Props) {
  const [left, setLeft] = useState(0)
  const [sent, setSent] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (left <= 0) {
      return
    }

    timer.current = setInterval(() => {
      setLeft((value) => (value <= 1 ? 0 : value - 1))
    }, 1000)

    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [left])

  const palette = {
    ...(accent ? { "--vibeui-banner-009-accent": accent } : null),
    ...(background ? { "--vibeui-banner-009-surface": background } : null),
    ...style,
  } as CSSProperties

  const waiting = left > 0

  return (
    <>
      <style href="vibeui-banner-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-009"
        role="region"
        aria-label={message}
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <span data-part="text">
          <span data-part="message">{message}</span>
          <span data-part="email">{email}</span>
        </span>
        {/* Состояние читается вслух: без aria-live отсчёт видно только глазами. */}
        <button
          type="button"
          data-part="action"
          disabled={waiting}
          aria-live="polite"
          onClick={() => {
            setLeft(cooldown)
            setSent(true)
            onResend?.()
          }}
        >
          {waiting
            ? waitTemplate.replace("{seconds}", String(left))
            : sent
              ? sentLabel
              : actionLabel}
        </button>
      </div>
    </>
  )
}
