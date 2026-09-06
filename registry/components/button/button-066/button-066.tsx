"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, PointerEvent } from "react"

export type Button066Props = Omit<
  ComponentProps<"div">,
  "children" | "onSubmit"
> & {
  /** Подпись кнопки в покое: она уходит в aria-label. */
  label?: string
  /** Что показать, пока палец держит кнопку. */
  recordingLabel?: string
  /** Подсказка в покое. */
  hint?: string
  /** Подсказка во время записи: как отменить. */
  cancelHint?: string
  /** Сколько секунд можно писать. По достижении запись сама завершается. */
  limit?: number
  onRecorded?: (seconds: number) => void
  onCancel?: () => void
  accent?: string
  /** Поверхность строки. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: голос записывается, пока кнопку держат. Нажал — пошла
// запись, отпустил — отправилась, увёл палец в сторону — отменилась. Это
// единственный способ не заводить второе «стоп»: рука уже на кнопке, и
// отмена должна стоить одного движения, а не поиска крестика.
//
// Запись здесь не ведётся: компонент считает секунды и зовёт onRecorded
// или onCancel. MediaRecorder, разрешения и загрузка — забота приложения.
const STYLES = `
:where([data-vibeui-block="button-066"]){
--vibeui-button-066-surface:light-dark(oklch(1 0 0),oklch(0.24 0.01 265));
--vibeui-button-066-fg:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-066-on-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-066-muted:color-mix(in oklab,var(--vibeui-button-066-fg) 60%,transparent);
--vibeui-button-066-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-button-066-live:light-dark(oklch(0.58 0.2 25),oklch(0.7 0.18 25));
--vibeui-button-066-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-066-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-066"]{color-scheme:dark}
[data-vibeui-block="button-066"]{
display:inline-flex;align-items:center;gap:0.75rem;
box-sizing:border-box;padding:0.5rem 0.875rem 0.5rem 0.5rem;
border:1px solid var(--vibeui-button-066-border);border-radius:9999px;
background:var(--vibeui-button-066-surface);
font-family:var(--vibeui-button-066-font);color:var(--vibeui-button-066-fg);
}
[data-vibeui-block="button-066"] *{box-sizing:border-box}
[data-vibeui-block="button-066"] [data-part="mic"]{
appearance:none;border:0;cursor:pointer;flex:none;touch-action:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.75rem;height:2.75rem;border-radius:9999px;
background:var(--vibeui-button-066-fg);color:var(--vibeui-button-066-on-fg);
transition:transform .16s ease,background-color .16s ease;
}
[data-vibeui-block="button-066"] [data-part="mic"] svg{width:1.125rem;height:1.125rem;fill:currentColor}
[data-vibeui-block="button-066"] [data-part="mic"]:focus-visible{
outline:2px solid var(--vibeui-button-066-accent);outline-offset:3px;
}
/* Во время записи кнопка краснеет и слегка растёт: это единственный сигнал,
   который виден краем глаза, когда смотришь не на экран, а на собеседника. */
[data-vibeui-block="button-066"][data-recording="true"] [data-part="mic"]{
background:var(--vibeui-button-066-live);color:oklch(0.99 0 25);transform:scale(1.06);
}
[data-vibeui-block="button-066"] [data-part="body"]{display:flex;flex-direction:column;gap:0.125rem;min-width:8.5rem}
[data-vibeui-block="button-066"] [data-part="status"]{
display:flex;align-items:center;gap:0.375rem;
font-size:0.875rem;font-weight:650;line-height:1.1;
}
[data-vibeui-block="button-066"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:9999px;flex:none;
background:var(--vibeui-button-066-live);opacity:0;
}
[data-vibeui-block="button-066"][data-recording="true"] [data-part="dot"]{
opacity:1;animation:vibeui-button-066-pulse 1s ease-in-out infinite;
}
@keyframes vibeui-button-066-pulse{
0%,100%{opacity:1}
50%{opacity:.25}
}
[data-vibeui-block="button-066"] [data-part="time"]{font-variant-numeric:tabular-nums}
/* Отступ равен точке записи и её зазору: без него нижняя строка стоит
   левее верхней, потому что точка держит место даже погашенной. */
[data-vibeui-block="button-066"] [data-part="hint"]{
margin:0;padding-left:0.875rem;
font-size:0.6875rem;line-height:1.3;color:var(--vibeui-button-066-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-066"] *{animation:none!important;transition:none!important}
}
`

function clock(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60

  return `${minutes}:${String(rest).padStart(2, "0")}`
}

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

/**
 * Кнопка голосовой записи: держат — пишет, отпускают — отправляет, уводят
 * палец — отменяет. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button066({
  label = "Записать голосовое",
  recordingLabel = "Идёт запись",
  hint = "Нажмите и держите",
  cancelHint = "Уведите палец, чтобы отменить",
  limit = 60,
  onRecorded,
  onCancel,
  accent,
  background = "",
  className,
  style,
  ...props
}: Button066Props) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const cancelled = useRef(false)
  const elapsed = useRef(0)

  useEffect(() => {
    if (!recording) {
      return
    }

    // Предел останавливает запись сам: держать кнопку минутами человек не
    // будет, а бесконечный счётчик врёт про то, что запись ещё влезет.
    const timer = window.setInterval(() => {
      const next = elapsed.current + 1

      elapsed.current = next
      setSeconds(next)

      if (next >= limit) {
        setRecording(false)
        onRecorded?.(next)
      }
    }, 1000)

    return () => window.clearInterval(timer)
  }, [recording, limit, onRecorded])

  const start = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    cancelled.current = false
    elapsed.current = 0
    setSeconds(0)
    setRecording(true)
  }

  const stop = () => {
    if (!recording) {
      return
    }

    setRecording(false)

    if (cancelled.current) {
      onCancel?.()
    } else {
      onRecorded?.(elapsed.current)
    }
  }

  // Палец ушёл с кнопки — запись отменяется, как в мессенджерах.
  const drift = (event: PointerEvent<HTMLButtonElement>) => {
    if (!recording) {
      return
    }

    const box = event.currentTarget.getBoundingClientRect()
    const outside =
      event.clientX < box.left - 24 ||
      event.clientX > box.right + 24 ||
      event.clientY < box.top - 24 ||
      event.clientY > box.bottom + 24

    cancelled.current = outside
  }

  const palette = {
    ...(accent ? { "--vibeui-button-066-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-066-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-066" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-066"
        data-recording={recording}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="mic"
          aria-label={label}
          aria-pressed={recording}
          onPointerDown={start}
          onPointerMove={drift}
          onPointerUp={stop}
          onPointerCancel={stop}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2Z" />
          </svg>
        </button>

        <span data-part="body">
          <span data-part="status">
            <span data-part="dot" aria-hidden="true" />
            <span>{recording ? recordingLabel : label}</span>
            {recording ? (
              <span data-part="time" role="timer">
                {clock(seconds)}
              </span>
            ) : null}
          </span>
          <p data-part="hint">{recording ? cancelHint : hint}</p>
        </span>
      </div>
    </>
  )
}
