"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button068Props = Omit<
  ComponentProps<"button">,
  "children" | "onClick"
> & {
  label?: string
  /** Подпись во время сохранения. */
  savingLabel?: string
  /** Подпись после успеха: она держится savedFor миллисекунд. */
  savedLabel?: string
  /** Строка о последнем сохранении под кнопкой. */
  hint?: string
  /** Сколько миллисекунд держать «Сохранено» перед возвратом в покой. */
  savedFor?: number
  /** Сколько миллисекунд занимает демонстрационное сохранение. */
  savingFor?: number
  onSave?: () => void
  accent?: string
  /** Поверхность страницы. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: кнопка сохранения, которая отвечает. Три состояния в одном
// пятне — «Сохранить», «Сохранение…», «Сохранено» с галочкой, — и человеку не
// нужен ни тост, ни отдельная строка статуса. Ширина держится по самой длинной
// подписи, поэтому соседи не прыгают при смене состояния.
//
// Компонент ничего не сохраняет: он показывает цикл и зовёт onSave. Реальный
// запрос, ошибки и повтор — забота приложения.
const STYLES = `
:where([data-vibeui-block="button-068"]){
--vibeui-button-068-bg:transparent;
--vibeui-button-068-fg:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-068-on-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-068-muted:color-mix(in oklab,var(--vibeui-button-068-fg) 60%,transparent);
--vibeui-button-068-done:light-dark(oklch(0.5 0.14 152),oklch(0.74 0.14 152));
--vibeui-button-068-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-068-radius:0.625rem;
--vibeui-button-068-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-068"]{color-scheme:dark}
[data-vibeui-block="button-068"]{
display:inline-flex;flex-direction:column;align-items:flex-start;gap:0.375rem;
box-sizing:border-box;background:var(--vibeui-button-068-bg);
font-family:var(--vibeui-button-068-font);color:var(--vibeui-button-068-fg);
}
[data-vibeui-block="button-068"] *{box-sizing:border-box}
[data-vibeui-block="button-068"] [data-part="save"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.4375rem;
min-height:2.25rem;padding:0.375rem 0.9375rem;
border-radius:var(--vibeui-button-068-radius);
background:var(--vibeui-button-068-fg);color:var(--vibeui-button-068-on-fg);
font:inherit;font-size:0.875rem;font-weight:650;letter-spacing:-0.01em;line-height:1;
transition:background-color .18s ease,filter .16s ease;
}
[data-vibeui-block="button-068"] [data-part="save"]:hover:not(:disabled){
filter:light-dark(brightness(1.45),brightness(0.9));
}
[data-vibeui-block="button-068"] [data-part="save"]:disabled{cursor:default}
[data-vibeui-block="button-068"] [data-part="save"]:focus-visible{
outline:2px solid var(--vibeui-button-068-accent);outline-offset:2px;
}
/* Успех красится в зелёный один раз и ненадолго: постоянная зелёная кнопка
   перестаёт значить «только что сохранили». */
[data-vibeui-block="button-068"][data-state="saved"] [data-part="save"]{
background:var(--vibeui-button-068-done);color:oklch(0.99 0.01 152);
}
[data-vibeui-block="button-068"] [data-part="mark"]{
width:0.875rem;height:0.875rem;flex:none;
}
[data-vibeui-block="button-068"] [data-part="mark"] svg{width:100%;height:100%;fill:currentColor}
[data-vibeui-block="button-068"][data-state="saving"] [data-part="mark"]{
border:2px solid color-mix(in oklab,currentColor 35%,transparent);
border-top-color:currentColor;border-radius:9999px;
animation:vibeui-button-068-spin .7s linear infinite;
}
[data-vibeui-block="button-068"][data-state="saving"] [data-part="mark"] svg{display:none}
@keyframes vibeui-button-068-spin{to{rotate:360deg}}
[data-vibeui-block="button-068"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.3;color:var(--vibeui-button-068-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-068"] *{animation:none!important;transition:none!important}}
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

/**
 * Кнопка сохранения с ответом: «Сохранить» → «Сохранение…» → «Сохранено».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button068({
  label = "Сохранить",
  savingLabel = "Сохранение…",
  savedLabel = "Сохранено",
  hint = "Последнее сохранение — минуту назад",
  savedFor = 1800,
  savingFor = 700,
  onSave,
  accent,
  background = "",
  className,
  style,
  type = "button",
  ...props
}: Button068Props) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle")
  const timers = useRef<number[]>([])

  // Таймеры снимаются при размонтировании: иначе setState прилетит в уже
  // убранный компонент, если человек ушёл со страницы во время сохранения.
  useEffect(() => {
    const list = timers.current

    return () => {
      for (const timer of list) {
        window.clearTimeout(timer)
      }
    }
  }, [])

  // Ширина держится по самой длинной подписи: иначе кнопка дёргается на
  // каждом переходе, а рядом стоящие элементы уезжают.
  const widest = [label, savingLabel, savedLabel].reduce((a, b) =>
    a.length >= b.length ? a : b,
  )

  const palette = {
    ...(accent ? { "--vibeui-button-068-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-068-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-068" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="button"
        data-vibeui-block="button-068"
        data-state={state}
        className={className}
        style={palette}
      >
        <button
          {...props}
          type={type}
          data-part="save"
          disabled={state !== "idle"}
          onClick={() => {
            if (state !== "idle") {
              return
            }

            setState("saving")
            onSave?.()

            timers.current.push(
              window.setTimeout(() => {
                setState("saved")

                timers.current.push(
                  window.setTimeout(() => setState("idle"), savedFor),
                )
              }, savingFor),
            )
          }}
        >
          <span data-part="mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              {state === "saved" ? (
                <path d="m9.6 16.2-3.8-3.8 1.4-1.4 2.4 2.4 6.8-6.8 1.4 1.4z" />
              ) : (
                <path d="M6 4h9l3 3v13H6zm3 1v4h6V5zm-1 9h8v5H8z" />
              )}
            </svg>
          </span>
          <span style={{ display: "grid" }}>
            {/* Невидимая самая длинная подпись держит ширину, видимая лежит
                поверх неё в той же ячейке грида. */}
            <span
              aria-hidden="true"
              style={{ gridArea: "1 / 1", visibility: "hidden" }}
            >
              {widest}
            </span>
            <span style={{ gridArea: "1 / 1" }}>
              {state === "saving"
                ? savingLabel
                : state === "saved"
                  ? savedLabel
                  : label}
            </span>
          </span>
        </button>

        {hint ? (
          <p data-part="hint" role="status">
            {hint}
          </p>
        ) : null}
      </div>
    </>
  )
}
