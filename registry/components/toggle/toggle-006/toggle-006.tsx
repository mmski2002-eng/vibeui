"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toggle006Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  delay?: number
  /** Строка под кнопкой по ключам busy, savedOn, savedOff и idle. */
  statusText?: Record<string, string>
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: toggle, за которым стоит запрос. Состояние переключается
// только после ответа: пока идёт сохранение, кнопка держит старое aria-pressed
// и добавляет aria-busy, поэтому она не врёт о том, что уже сохранено.
const STYLES = `
:where([data-vibeui-block="toggle-006"]){
--vibeui-toggle-006-bg:transparent;
--vibeui-toggle-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-toggle-006-muted:color-mix(in oklab,var(--vibeui-toggle-006-fg) 68%,transparent);
--vibeui-toggle-006-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-toggle-006-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.75 0.13 39.8));
--vibeui-toggle-006-soft:light-dark(oklch(0.95 0.04 39.8),oklch(0.3 0.05 39.8));
--vibeui-toggle-006-strong:light-dark(oklch(0.36 0.09 39.8),oklch(0.88 0.1 39.8));
--vibeui-toggle-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toggle-006"]{color-scheme:dark}
[data-vibeui-block="toggle-006"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;align-items:flex-start;
width:100%;max-width:19rem;padding:0.875rem;
border:1px solid var(--vibeui-toggle-006-border);border-radius:0.875rem;
background:var(--vibeui-toggle-006-bg);color:var(--vibeui-toggle-006-fg);
font-family:var(--vibeui-toggle-006-font);
}
[data-vibeui-block="toggle-006"] *{box-sizing:border-box}
[data-vibeui-block="toggle-006"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-width:11rem;height:2.375rem;padding:0 1rem;
border:1px solid var(--vibeui-toggle-006-border);border-radius:0.625rem;
background:var(--vibeui-toggle-006-bg);color:var(--vibeui-toggle-006-fg);
font-size:0.875rem;font-weight:600;line-height:1;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="toggle-006"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-006-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-006"] button[aria-pressed="true"]{
background:var(--vibeui-toggle-006-soft);
border-color:var(--vibeui-toggle-006-accent);
color:var(--vibeui-toggle-006-strong);
}
/* Ширина кнопки зафиксирована: значок меняется с галочки на волчок, и без
   min-width кнопка дёргалась бы на каждое сохранение. */
[data-vibeui-block="toggle-006"] button[aria-busy="true"]{cursor:progress;color:var(--vibeui-toggle-006-muted)}
[data-vibeui-block="toggle-006"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="toggle-006"] [data-part="spinner"]{
width:1rem;height:1rem;flex:none;border-radius:50%;
border:2px solid var(--vibeui-toggle-006-border);
border-top-color:var(--vibeui-toggle-006-accent);
animation:vibeui-toggle-006-spin .7s linear infinite;
}
@keyframes vibeui-toggle-006-spin{to{transform:rotate(1turn)}}
[data-vibeui-block="toggle-006"] [data-part="status"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-toggle-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-006"] *{animation:none!important;transition:none!important}}
`

const STATUS_TEXT: Record<string, string> = {
  busy: "Сохраняем…",
  savedOn: "Сохранено: страница видна всем",
  savedOff: "Сохранено: страница снята с публикации",
  idle: "Изменение уходит на сервер сразу",
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
 * Toggle с сохранением на сервере: пока идёт запрос, кнопка помечена
 * aria-busy и не меняет состояние. Один файл, ноль зависимостей.
 */
export function Toggle006({
  label = "Опубликовано",
  delay = 1200,
  statusText = STATUS_TEXT,
  defaultPressed = false,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Toggle006Props) {
  const [pressed, setPressed] = useState(defaultPressed)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
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
    ...(accent ? { "--vibeui-toggle-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toggle-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const statusKey = busy
    ? "busy"
    : saved
      ? pressed
        ? "savedOn"
        : "savedOff"
      : "idle"

  const save = () => {
    if (busy) {
      return
    }

    setBusy(true)
    setSaved(false)

    timer.current = setTimeout(() => {
      const next = !pressed

      setPressed(next)
      setBusy(false)
      setSaved(true)
      onChange?.(next)
    }, delay)
  }

  return (
    <>
      <style href="vibeui-toggle-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toggle"
        data-vibeui-block="toggle-006"
        className={className}
        style={palette}
      >
        <button
          type="button"
          aria-pressed={pressed}
          aria-busy={busy}
          onClick={save}
        >
          {busy ? (
            <span data-part="spinner" aria-hidden="true" />
          ) : (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d={pressed ? "M3 8.4l3.2 3.2L13 5" : "M8 3.2v9.6M3.2 8h9.6"}
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {label}
        </button>
        <p data-part="status" role="status">
          {statusText[statusKey] ?? STATUS_TEXT[statusKey]}
        </p>
      </div>
    </>
  )
}
