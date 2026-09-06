"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button027Props = Omit<
  ComponentProps<"button">,
  "children" | "onClick"
> & {
  label?: string
  /** Подпись во время ожидания: время подставляется после неё. */
  waitingLabel?: string
  /** Пауза до разблокировки, секунды. */
  seconds?: number
  onResend?: () => void
  /** Пусто — подложки нет, кнопка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: кнопка, которую нельзя нажать прямо сейчас. Повторная
// отправка кода упирается в паузу на стороне сервера, и вместо ошибки после
// клика кнопка честно показывает остаток: кольцо убывает, время идёт
// моноширинными цифрами. По нулю кнопка сама разблокируется, а следующее
// нажатие запускает отсчёт заново.
const STYLES = `
:where([data-vibeui-block="button-027"]){
--vibeui-button-027-bg:transparent;
--vibeui-button-027-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-button-027-muted:color-mix(in oklab,var(--vibeui-button-027-fg) 68%,transparent);
--vibeui-button-027-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-button-027-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-027-left:1;
--vibeui-button-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-027"]{color-scheme:dark}
[data-vibeui-block="button-027"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-width:14rem;height:2.5rem;padding:0 1rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-027-border);border-radius:0.625rem;
background:var(--vibeui-button-027-bg);color:var(--vibeui-button-027-accent);
font-family:var(--vibeui-button-027-font);font-size:0.875rem;font-weight:650;line-height:1;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-027"]:hover:not([aria-disabled="true"]){border-color:var(--vibeui-button-027-accent)}
[data-vibeui-block="button-027"]:focus-visible{outline:2px solid var(--vibeui-button-027-accent);outline-offset:2px}
[data-vibeui-block="button-027"][aria-disabled="true"]{cursor:not-allowed;color:var(--vibeui-button-027-muted)}
/* Кольцо остатка: доля времени видна раньше, чем прочитаны цифры. */
[data-vibeui-block="button-027"] [data-part="ring"]{
flex:none;width:1rem;height:1rem;border-radius:9999px;
background:conic-gradient(currentColor calc(var(--vibeui-button-027-left) * 360deg),color-mix(in oklab,currentColor 18%,transparent) 0);
-webkit-mask:radial-gradient(closest-side,transparent 58%,#000 60%);
mask:radial-gradient(closest-side,transparent 58%,#000 60%);
}
[data-vibeui-block="button-027"] [data-part="time"]{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-027"] *{animation:none!important;transition:none!important}}
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

function clock(total: number) {
  const minutes = Math.floor(total / 60)
  const rest = total % 60

  return `${minutes}:${String(rest).padStart(2, "0")}`
}

/**
 * Кнопка повторной отправки с обратным отсчётом до разблокировки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button027({
  label = "Отправить код ещё раз",
  waitingLabel = "Повторно через",
  seconds = 30,
  onResend,
  background = "",
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button027Props) {
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    if (left <= 0) return

    const id = setTimeout(() => setLeft(left - 1), 1000)

    return () => clearTimeout(id)
  }, [left])

  const locked = left > 0

  const palette = {
    "--vibeui-button-027-left": String(seconds > 0 ? left / seconds : 0),
    ...(accent ? { "--vibeui-button-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-027-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-027" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-027"
        className={className}
        style={palette}
        // Пока идёт отсчёт, кнопка помечена aria-disabled, а не disabled:
        // иначе она молча выпадает из обхода на все тридцать секунд и
        // причина ожидания остаётся только на экране.
        aria-disabled={locked || undefined}
        onClick={() => {
          if (locked) return
          onResend?.()
          setLeft(seconds)
        }}
      >
        {locked ? <span data-part="ring" aria-hidden="true" /> : null}
        {/* Пока идёт отсчёт, живой области нет: секунды не стоит зачитывать
            каждую секунду. Объявляется только момент разблокировки. */}
        {locked ? (
          <span>
            {waitingLabel} <span data-part="time">{clock(left)}</span>
          </span>
        ) : (
          <span aria-live="polite">{label}</span>
        )}
      </button>
    </>
  )
}
