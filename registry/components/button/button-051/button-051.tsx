"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button051Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onChange"
> & {
  followLabel?: string
  followingLabel?: string
  /** Подпись, которая подменяет «Вы подписаны» при наведении. */
  unfollowLabel?: string
  defaultFollowing?: boolean
  onChange?: (following: boolean) => void
  accent?: string
  /** Поверхность состояния «подписан». Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: три подписи на два состояния. Подписан — «Вы подписаны»,
// и только под курсором или фокусом подпись честно превращается в «Отписаться»
// с тревожной палитрой. Подмена сделана двумя слоями в grid-ячейке: обе
// подписи всегда в разметке, ширина берётся по длинной, кнопка не прыгает.
const STYLES = `
:where([data-vibeui-block="button-051"]){
--vibeui-button-051-accent:light-dark(oklch(0.5 0.16 265),oklch(0.63 0.16 265));
--vibeui-button-051-fg:light-dark(oklch(0.99 0.01 265),oklch(0.98 0.012 265));
--vibeui-button-051-surface:light-dark(oklch(1 0 0),oklch(0.25 0.014 265));
--vibeui-button-051-border:light-dark(oklch(0.87 0.006 265),oklch(0.42 0.014 265));
--vibeui-button-051-ink:light-dark(oklch(0.26 0.02 265),oklch(0.93 0.008 265));
--vibeui-button-051-danger:light-dark(oklch(0.55 0.19 22),oklch(0.71 0.17 22));
--vibeui-button-051-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-051"]{
appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
height:2.5rem;padding:0 1.125rem;border-radius:9999px;
border:1px solid transparent;
background:var(--vibeui-button-051-accent);color:var(--vibeui-button-051-fg);
font-family:var(--vibeui-button-051-font);font-size:0.875rem;font-weight:650;line-height:1;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-051"][data-following="true"]{
background:var(--vibeui-button-051-surface);color:var(--vibeui-button-051-ink);
border-color:var(--vibeui-button-051-border);
}
[data-vibeui-block="button-051"][data-following="true"]:hover,
[data-vibeui-block="button-051"][data-following="true"]:focus-visible{
background:color-mix(in oklab,var(--vibeui-button-051-danger) 10%,var(--vibeui-button-051-surface));
border-color:var(--vibeui-button-051-danger);color:var(--vibeui-button-051-danger);
}
[data-vibeui-block="button-051"][data-following="false"]:hover{
background:color-mix(in oklab,var(--vibeui-button-051-accent) 88%,black);
}
[data-vibeui-block="button-051"]:focus-visible{outline:2px solid var(--vibeui-button-051-accent);outline-offset:3px}
[data-vibeui-block="button-051"][data-following="true"]:focus-visible{outline-color:var(--vibeui-button-051-danger)}
/* Обе подписи лежат в одной ячейке: ширина считается по длинной. */
[data-vibeui-block="button-051"] [data-part="slot"]{display:grid}
[data-vibeui-block="button-051"] [data-part="slot"] > span{grid-area:1/1;transition:opacity .14s ease}
[data-vibeui-block="button-051"] [data-part="off"]{opacity:0}
[data-vibeui-block="button-051"][data-following="true"]:hover [data-part="on"],
[data-vibeui-block="button-051"][data-following="true"]:focus-visible [data-part="on"]{opacity:0}
[data-vibeui-block="button-051"][data-following="true"]:hover [data-part="off"],
[data-vibeui-block="button-051"][data-following="true"]:focus-visible [data-part="off"]{opacity:1}
[data-vibeui-block="button-051"] [data-part="tick"]{position:relative;flex:none;width:0.875rem;height:0.875rem}
[data-vibeui-block="button-051"] [data-part="tick"]::after{
content:"";position:absolute;left:0.25rem;top:0.0625rem;width:0.3125rem;height:0.625rem;
box-sizing:border-box;border:1.75px solid currentColor;border-top:0;border-left:0;
transform:rotate(42deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-051"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной поверхности. Без неё светлая заливка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Кнопка подписки с состоянием «вы подписаны» и подменой на «Отписаться».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button051({
  followLabel = "Подписаться",
  followingLabel = "Вы подписаны",
  unfollowLabel = "Отписаться",
  defaultFollowing = false,
  onChange,
  accent,
  background = "",
  type = "button",
  className,
  style,
  ...props
}: Button051Props) {
  const [following, setFollowing] = useState(defaultFollowing)

  const palette = {
    ...(accent ? { "--vibeui-button-051-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-051-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-051" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-051"
        data-following={String(following)}
        className={className}
        style={palette}
        aria-pressed={following}
        onClick={() => {
          const next = !following

          setFollowing(next)
          onChange?.(next)
        }}
      >
        {following ? <span data-part="tick" aria-hidden="true" /> : null}
        {following ? (
          <span data-part="slot">
            <span data-part="on">{followingLabel}</span>
            <span data-part="off" aria-hidden="true">
              {unfollowLabel}
            </span>
          </span>
        ) : (
          followLabel
        )}
      </button>
    </>
  )
}
