"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toggle012Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  delay?: number
  /** Строка состояния по ключам busy, confirmedOn, confirmedOff, on и off. */
  statusText?: Record<string, string>
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: подписка на уведомления — это настройка на будущее, а не
// мгновенное действие над объектом, поэтому здесь switch (role="switch",
// aria-checked), а не aria-pressed. Запрос идёт по тому же принципу, что и
// сохранение: до ответа переключатель держит старое состояние и aria-busy.
const STYLES = `
:where([data-vibeui-block="toggle-012"]){
--vibeui-toggle-012-bg:transparent;
--vibeui-toggle-012-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-toggle-012-muted:color-mix(in oklab,var(--vibeui-toggle-012-fg) 68%,transparent);
--vibeui-toggle-012-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-toggle-012-accent:light-dark(oklch(0.58 0.17 250),oklch(0.72 0.15 250));
--vibeui-toggle-012-track-off:light-dark(oklch(0.88 0.006 265),oklch(0.38 0.012 265));
--vibeui-toggle-012-thumb:light-dark(oklch(1 0 0),oklch(0.96 0.004 265));
--vibeui-toggle-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toggle-012"]{color-scheme:dark}
[data-vibeui-block="toggle-012"]{
box-sizing:border-box;display:flex;align-items:center;gap:0.875rem;
width:100%;max-width:21rem;padding:0.875rem;
border:1px solid var(--vibeui-toggle-012-border);border-radius:0.875rem;
background:var(--vibeui-toggle-012-bg);color:var(--vibeui-toggle-012-fg);
font-family:var(--vibeui-toggle-012-font);
}
[data-vibeui-block="toggle-012"] *{box-sizing:border-box}
[data-vibeui-block="toggle-012"] svg{width:1.125rem;height:1.125rem;flex:none}
[data-vibeui-block="toggle-012"] svg path{
fill:none;stroke:currentColor;stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round;
}
[data-vibeui-block="toggle-012"] [data-part="bell"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:2.25rem;height:2.25rem;border-radius:9999px;
background:var(--vibeui-toggle-012-track-off);color:var(--vibeui-toggle-012-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toggle-012"][data-checked="true"] [data-part="bell"]{
background:color-mix(in oklch, var(--vibeui-toggle-012-accent) 18%, transparent);
color:var(--vibeui-toggle-012-accent);
}
[data-vibeui-block="toggle-012"] [data-part="text"]{flex:1;min-width:0}
[data-vibeui-block="toggle-012"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="toggle-012"] [data-part="status"]{
margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-toggle-012-muted);
}
[data-vibeui-block="toggle-012"] button{
appearance:none;cursor:pointer;font:inherit;flex:none;position:relative;padding:0;
width:2.75rem;height:1.5rem;border-radius:9999px;
border:1px solid var(--vibeui-toggle-012-border);
background:var(--vibeui-toggle-012-track-off);
transition:background-color .18s ease,border-color .18s ease;
}
[data-vibeui-block="toggle-012"] button[aria-checked="true"]{
background:var(--vibeui-toggle-012-accent);border-color:var(--vibeui-toggle-012-accent);
}
[data-vibeui-block="toggle-012"] button[aria-busy="true"]{cursor:progress}
[data-vibeui-block="toggle-012"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-012-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-012"] [data-part="thumb"]{
position:absolute;top:0.125rem;left:0.125rem;width:1.125rem;height:1.125rem;
border-radius:9999px;background:var(--vibeui-toggle-012-thumb);
display:flex;align-items:center;justify-content:center;
transition:transform .18s ease;
}
[data-vibeui-block="toggle-012"] button[aria-checked="true"] [data-part="thumb"]{
transform:translateX(1.25rem);
}
[data-vibeui-block="toggle-012"] [data-part="spinner"]{
width:0.625rem;height:0.625rem;border-radius:50%;
border:1.5px solid var(--vibeui-toggle-012-track-off);
border-top-color:var(--vibeui-toggle-012-accent);
animation:vibeui-toggle-012-spin .7s linear infinite;
}
@keyframes vibeui-toggle-012-spin{to{transform:rotate(1turn)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-012"] *{animation:none!important;transition:none!important}}
`

const STATUS_TEXT: Record<string, string> = {
  busy: "Сохраняем…",
  confirmedOn: "Подписка оформлена",
  confirmedOff: "Подписка отменена",
  on: "Вы подписаны",
  off: "Вы не подписаны",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

/**
 * Переключатель подписки на уведомления: role="switch" с запросом на сервер,
 * во время которого включён aria-busy. Один файл, ноль зависимостей.
 */
export function Toggle012({
  label = "Уведомления о новых комментариях",
  delay = 1000,
  statusText = STATUS_TEXT,
  defaultPressed = false,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Toggle012Props) {
  const [checked, setChecked] = useState(defaultPressed)
  const [busy, setBusy] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    [],
  )

  const palette = {
    ...(accent ? { "--vibeui-toggle-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toggle-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const statusKey = busy
    ? "busy"
    : confirmed
      ? checked
        ? "confirmedOn"
        : "confirmedOff"
      : checked
        ? "on"
        : "off"

  const subscribe = () => {
    if (busy) {
      return
    }

    setBusy(true)
    setConfirmed(false)

    timer.current = setTimeout(() => {
      const next = !checked

      setChecked(next)
      setBusy(false)
      setConfirmed(true)
      onChange?.(next)
    }, delay)
  }

  return (
    <>
      <style href="vibeui-toggle-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toggle"
        data-vibeui-block="toggle-012"
        data-checked={checked}
        className={className}
        style={palette}
      >
        <span data-part="bell" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path d="M5 15h10l-1.2-1.8a3 3 0 0 1-.5-1.7V8.5a3.3 3.3 0 0 0-6.6 0v3a3 3 0 0 1-.5 1.7z" />
            <path d="M8.4 17a1.6 1.6 0 0 0 3.2 0" />
          </svg>
        </span>
        <div data-part="text">
          <p data-part="title">{label}</p>
          <p data-part="status" role="status">
            {statusText[statusKey] ?? STATUS_TEXT[statusKey]}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-busy={busy}
          aria-label={label}
          onClick={subscribe}
        >
          <span data-part="thumb">
            {busy && <span data-part="spinner" aria-hidden="true" />}
          </span>
        </button>
      </div>
    </>
  )
}
