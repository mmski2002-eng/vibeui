"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button055Props = Omit<ComponentProps<"button">, "children"> & {
  children?: string
  /** Клавиша-предохранитель: без неё кнопка заблокирована. */
  modifier?: "Alt" | "Shift" | "Control"
  /** Подпись в заблокированном состоянии: она объясняет, что делать. */
  lockedLabel?: string
  onConfirm?: () => void
  /** Цвет взведённого состояния. */
  danger?: string
  /** Поверхность кнопки в покое. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: предохранитель на клавише. Опасное действие остаётся
// недоступным, пока пользователь не удерживает модификатор — это дешевле
// модального подтверждения и не крадёт фокус. Слушатели висят на window,
// а blur окна сбрасывает состояние: иначе отпущенная вне вкладки клавиша
// оставила бы кнопку взведённой.
const STYLES = `
:where([data-vibeui-block="button-055"]){
--vibeui-button-055-locked:light-dark(oklch(0.93 0.004 265),oklch(0.27 0.012 265));
--vibeui-button-055-locked-fg:light-dark(oklch(0.52 0.014 265),oklch(0.73 0.012 265));
--vibeui-button-055-border:light-dark(oklch(0.86 0.006 265),oklch(0.43 0.014 265));
--vibeui-button-055-danger:light-dark(oklch(0.55 0.2 25),oklch(0.63 0.19 25));
--vibeui-button-055-fg:oklch(0.99 0.02 25);
--vibeui-button-055-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-button-055-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-055"]{color-scheme:dark}
[data-vibeui-block="button-055"]{
appearance:none;cursor:not-allowed;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.625rem;
height:2.75rem;padding:0 0.75rem 0 1rem;border-radius:0.625rem;
border:1px solid var(--vibeui-button-055-border);
background:var(--vibeui-button-055-locked);color:var(--vibeui-button-055-locked-fg);
font-family:var(--vibeui-button-055-font);font-size:0.875rem;font-weight:650;line-height:1;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-055"][data-armed="true"]{
cursor:pointer;
background:var(--vibeui-button-055-danger);color:var(--vibeui-button-055-fg);
border-color:color-mix(in oklab,var(--vibeui-button-055-danger) 75%,black);
}
[data-vibeui-block="button-055"]:focus-visible{outline:2px solid var(--vibeui-button-055-danger);outline-offset:3px}
[data-vibeui-block="button-055"] kbd{
font-family:var(--vibeui-button-055-mono);font-size:0.6875rem;font-weight:600;line-height:1;
padding:0.3125rem 0.4375rem;border-radius:0.3125rem;
border:1px solid currentColor;
background:transparent;color:inherit;opacity:.8;
transition:opacity .16s ease,transform .12s ease;
}
[data-vibeui-block="button-055"][data-armed="true"] kbd{opacity:1;transform:translateY(1px)}
[data-vibeui-block="button-055"] [data-part="lock"]{position:relative;flex:none;width:0.875rem;height:1rem}
[data-vibeui-block="button-055"] [data-part="lock"]::before{
content:"";position:absolute;left:0;bottom:0;width:0.875rem;height:0.5625rem;
box-sizing:border-box;border:1.5px solid currentColor;border-radius:0.1875rem;
}
[data-vibeui-block="button-055"] [data-part="lock"]::after{
content:"";position:absolute;left:0.1875rem;top:0;width:0.5rem;height:0.5rem;
box-sizing:border-box;border:1.5px solid currentColor;border-bottom:0;
border-radius:0.25rem 0.25rem 0 0;
transition:transform .18s ease;
}
[data-vibeui-block="button-055"][data-armed="true"] [data-part="lock"]::after{transform:translateX(0.1875rem) rotate(12deg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-055"] *{animation:none!important;transition:none!important}}
`

const FLAG = {
  Alt: "altKey",
  Shift: "shiftKey",
  Control: "ctrlKey",
} as const

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
 * Опасное действие с предохранителем: доступно, только пока держат клавишу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button055({
  children = "Стереть все данные",
  modifier = "Alt",
  lockedLabel = "Удерживайте, чтобы стереть",
  onConfirm,
  danger,
  background = "",
  type = "button",
  className,
  style,
  ...props
}: Button055Props) {
  const [armed, setArmed] = useState(false)

  const palette = {
    ...(danger ? { "--vibeui-button-055-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-button-055-locked": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    const flag = FLAG[modifier]
    const sync = (event: KeyboardEvent) => setArmed(event[flag])
    const drop = () => setArmed(false)

    window.addEventListener("keydown", sync)
    window.addEventListener("keyup", sync)
    window.addEventListener("blur", drop)

    return () => {
      window.removeEventListener("keydown", sync)
      window.removeEventListener("keyup", sync)
      window.removeEventListener("blur", drop)
    }
  }, [modifier])

  return (
    <>
      <style href="vibeui-button-055" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-055"
        data-armed={String(armed)}
        className={className}
        style={palette}
        aria-disabled={!armed}
        onClick={(event) => {
          if (!armed) {
            event.preventDefault()
            return
          }

          onConfirm?.()
        }}
      >
        <span data-part="lock" aria-hidden="true" />
        {armed ? children : lockedLabel}
        <kbd>{modifier}</kbd>
      </button>
    </>
  )
}
