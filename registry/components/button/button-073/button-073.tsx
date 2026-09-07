"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Button073Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  /** Подпись после успешного удержания. */
  doneLabel?: string
  /** Пояснение под кнопкой: без него удержание не угадать. */
  hint?: string
  /** Сколько миллисекунд нужно держать кнопку. */
  duration?: number
  /** Вызывается один раз, когда удержание дошло до конца. */
  onConfirm?: () => void
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: подтверждение без диалога. Опасное действие требует не
// второго клика в модальном окне, а осознанного удержания — заливка ползёт
// по кнопке и показывает, сколько осталось. Отпустил раньше — заливка
// отскочила назад, ничего не произошло, извиняться не за что.
//
// Заливка — отдельный слой со scale по оси X: анимировать width значит
// перекладывать раскладку каждый кадр. Длительность приходит переменной
// --vibeui-button-073-hold, поэтому CSS и таймер JS не могут разъехаться.
//
// Клавиатура работает так же, как указатель: keydown начинает удержание,
// keyup отменяет. Без этого кнопка была бы доступна только мышью.
const STYLES = `
:where([data-vibeui-block="button-073"]){
--vibeui-button-073-bg:transparent;
--vibeui-button-073-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-button-073-muted:color-mix(in oklab,var(--vibeui-button-073-fg) 62%,transparent);
--vibeui-button-073-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-button-073-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-button-073-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-073-ring:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-073-on-accent:oklch(0.15 0.02 39.8);
--vibeui-button-073-hold:800ms;
--vibeui-button-073-radius:0.75rem;
--vibeui-button-073-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-073"]{color-scheme:dark}
[data-vibeui-block="button-073"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;
background:var(--vibeui-button-073-bg);color:var(--vibeui-button-073-fg);
font-family:var(--vibeui-button-073-font);
}
[data-vibeui-block="button-073"] *{box-sizing:border-box}
/* Подпись кнопки настраивается и переводится, поэтому высота набирается
   содержимым: фиксированная обрезала бы длинный вариант. */
[data-vibeui-block="button-073"] [data-part="action"]{
position:relative;overflow:hidden;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
width:100%;min-height:2.875rem;padding:0.625rem 1.25rem;
border:1px solid var(--vibeui-button-073-border);
border-radius:var(--vibeui-button-073-radius);
background:var(--vibeui-button-073-card);color:var(--vibeui-button-073-fg);
font:inherit;font-size:0.875rem;font-weight:650;line-height:1;letter-spacing:-0.01em;
touch-action:none;user-select:none;-webkit-user-select:none;
transition:background-color .3s ease,color .3s ease,border-color .3s ease;
}
[data-vibeui-block="button-073"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-button-073-ring);outline-offset:2px;
}
/* Отскок заливки при раннем отпускании — пружина с лёгким перелётом. Первая
   строка остаётся браузерам без linear(). */
[data-vibeui-block="button-073"] [data-part="fill"]{
position:absolute;inset:0;transform-origin:left center;
background:color-mix(in oklab,var(--vibeui-button-073-accent) 45%,transparent);
scale:0 1;
transition:scale .35s cubic-bezier(.22,1.2,.36,1);
transition:scale .35s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
/* Само удержание идёт линейно: заливка обязана честно показывать время. */
[data-vibeui-block="button-073"] [data-part="action"][data-state="holding"] [data-part="fill"]{
scale:1 1;transition:scale var(--vibeui-button-073-hold) linear;
}
[data-vibeui-block="button-073"] [data-part="action"][data-state="done"]{
background:var(--vibeui-button-073-accent);color:var(--vibeui-button-073-on-accent);
border-color:var(--vibeui-button-073-accent);
}
[data-vibeui-block="button-073"] [data-part="action"][data-state="done"] [data-part="fill"]{
scale:1 1;transition:none;background:transparent;
}
[data-vibeui-block="button-073"] [data-part="label"]{
position:relative;display:inline-flex;align-items:center;gap:0.4375rem;
}
[data-vibeui-block="button-073"] [data-part="label"] svg{
width:0.9375rem;height:0.9375rem;display:block;flex:none;
}
[data-vibeui-block="button-073"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-button-073-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-073"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Кнопка, которую нужно удержать: заливка ползёт по ней, раннее отпускание
 * откатывает. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button073({
  label = "Удерживайте для удаления",
  doneLabel = "Готово",
  hint = "Отпустите раньше времени — ничего не произойдёт",
  duration = 800,
  onConfirm,
  accent,
  background = "",
  className,
  style,
  ...props
}: Button073Props) {
  const [state, setState] = useState<"idle" | "holding" | "done">("idle")
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hintId = useId()

  useEffect(
    () => () => {
      if (holdTimer.current) {
        clearTimeout(holdTimer.current)
      }

      if (resetTimer.current) {
        clearTimeout(resetTimer.current)
      }
    },
    [],
  )

  const start = () => {
    if (state !== "idle") {
      return
    }

    setState("holding")
    holdTimer.current = setTimeout(() => {
      setState("done")
      onConfirm?.()
      resetTimer.current = setTimeout(() => setState("idle"), 1400)
    }, duration)
  }

  const cancel = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }

    setState((current) => (current === "holding" ? "idle" : current))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // repeat отсеивает автоповтор: браузер шлёт keydown десятками, пока
    // пробел зажат, и каждый второй начинал бы удержание заново.
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault()
      start()
    }
  }

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()
      cancel()
    }
  }

  const palette = {
    "--vibeui-button-073-hold": `${duration}ms`,
    ...(accent ? { "--vibeui-button-073-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-073-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-073" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-073"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="action"
          data-state={state}
          aria-describedby={hintId}
          onPointerDown={start}
          onPointerUp={cancel}
          onPointerLeave={cancel}
          onPointerCancel={cancel}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        >
          <span data-part="fill" aria-hidden="true" />
          <span data-part="label">
            {state === "done" ? (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="m3 8.5 3.5 3.5L13 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
            {state === "done" ? doneLabel : label}
          </span>
        </button>
        <p data-part="hint" id={hintId}>
          {hint}
        </p>
      </div>
    </>
  )
}
