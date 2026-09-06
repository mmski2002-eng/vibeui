"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button070Props = Omit<
  ComponentProps<"button">,
  "children" | "onChange"
> & {
  label?: string
  /** Подпись, когда человек уже подписан. */
  activeLabel?: string
  /** Подпись, которая подменяет предыдущую под курсором и в фокусе. */
  leaveLabel?: string
  defaultFollowing?: boolean
  onChange?: (following: boolean) => void
  accent?: string
  /** Поверхность кнопки. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: отписка не прячется в меню, но и не кричит. Пока на кнопку
// не навели, она говорит «Вы подписаны» — это статус. Под курсором и в фокусе
// подпись меняется на «Отписаться» и краснеет: человек видит, что произойдёт,
// до нажатия, а не после.
//
// Ширина считается по самой длинной подписи и не меняется при наведении:
// прыгающая кнопка уводит курсор мимо цели ровно в момент решения.
const STYLES = `
:where([data-vibeui-block="button-070"]){
--vibeui-button-070-fg:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-070-on-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-070-surface:light-dark(oklch(1 0 0),oklch(0.24 0.01 265));
--vibeui-button-070-border:light-dark(oklch(0.88 0 265),oklch(0.36 0 265));
--vibeui-button-070-danger:light-dark(oklch(0.55 0.19 25),oklch(0.7 0.17 25));
--vibeui-button-070-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-070-radius:9999px;
--vibeui-button-070-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-070"]{color-scheme:dark}
[data-vibeui-block="button-070"]{
appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-grid;place-items:center;
min-height:2.25rem;padding:0.375rem 1.125rem;
border:1px solid transparent;border-radius:var(--vibeui-button-070-radius);
background:var(--vibeui-button-070-fg);color:var(--vibeui-button-070-on-fg);
font-family:var(--vibeui-button-070-font);font-size:0.875rem;font-weight:650;
letter-spacing:-0.01em;line-height:1;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-070"] *{box-sizing:border-box}
/* Подписан — кнопка становится тихой: статус не должен спорить с главным
   действием страницы. */
[data-vibeui-block="button-070"][aria-pressed="true"]{
background:var(--vibeui-button-070-surface);color:var(--vibeui-button-070-fg);
border-color:var(--vibeui-button-070-border);
}
[data-vibeui-block="button-070"][aria-pressed="true"]:hover,
[data-vibeui-block="button-070"][aria-pressed="true"]:focus-visible{
color:var(--vibeui-button-070-danger);
border-color:var(--vibeui-button-070-danger);
background:color-mix(in oklab,var(--vibeui-button-070-danger) 10%,var(--vibeui-button-070-surface));
}
[data-vibeui-block="button-070"]:not([aria-pressed="true"]):hover{
filter:light-dark(brightness(1.45),brightness(0.9));
}
[data-vibeui-block="button-070"]:focus-visible{
outline:2px solid var(--vibeui-button-070-accent);outline-offset:2px;
}
/* Все подписи лежат в одной ячейке грида: ширина берётся по самой длинной,
   поэтому смена текста под курсором не двигает кнопку. */
[data-vibeui-block="button-070"] [data-part="label"]{grid-area:1 / 1}
[data-vibeui-block="button-070"] [data-part="ghost"]{
grid-area:1 / 1;visibility:hidden;pointer-events:none;
}
[data-vibeui-block="button-070"] [data-part="leave"]{grid-area:1 / 1;display:none}
[data-vibeui-block="button-070"][aria-pressed="true"]:hover [data-part="label"],
[data-vibeui-block="button-070"][aria-pressed="true"]:focus-visible [data-part="label"]{display:none}
[data-vibeui-block="button-070"][aria-pressed="true"]:hover [data-part="leave"],
[data-vibeui-block="button-070"][aria-pressed="true"]:focus-visible [data-part="leave"]{display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-070"]{transition:none!important}}
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
 * Кнопка подписки с отпиской под курсором: статус в покое, предупреждение
 * при наведении. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button070({
  label = "Подписаться",
  activeLabel = "Вы подписаны",
  leaveLabel = "Отписаться",
  defaultFollowing = true,
  onChange,
  accent,
  background = "",
  className,
  style,
  type = "button",
  ...props
}: Button070Props) {
  const [following, setFollowing] = useState(defaultFollowing)

  const widest = [label, activeLabel, leaveLabel].reduce((a, b) =>
    a.length >= b.length ? a : b,
  )

  const palette = {
    ...(accent ? { "--vibeui-button-070-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-070-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-070" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-070"
        aria-pressed={following}
        aria-label={following ? `${activeLabel}. ${leaveLabel}` : label}
        className={className}
        style={palette}
        onClick={() => {
          const next = !following

          setFollowing(next)
          onChange?.(next)
        }}
      >
        <span data-part="ghost" aria-hidden="true">
          {widest}
        </span>
        <span data-part="label">{following ? activeLabel : label}</span>
        {following ? (
          <span data-part="leave" aria-hidden="true">
            {leaveLabel}
          </span>
        ) : null}
      </button>
    </>
  )
}
