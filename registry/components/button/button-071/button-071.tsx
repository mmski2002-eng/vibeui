"use client"

import { useRef } from "react"
import type { ComponentProps, CSSProperties, PointerEvent } from "react"

export type Button071Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  /** Подпись под кнопкой: объясняет, зачем в кадре пунктирная рамка. */
  hint?: string
  /** Доля смещения курсора, на которую сдвигается кнопка. 0 — магнита нет. */
  pull?: number
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: зона притяжения больше самой кнопки. Пока курсор идёт к
// цели, кнопка выходит навстречу — попасть в неё проще, а движение сообщает,
// что она живая, ещё до нажатия. Пунктирная рамка показывает границу зоны:
// без неё человек не понимает, откуда начинается притяжение.
//
// Смещение пишется прямо в DOM, а не через состояние: pointermove идёт
// десятками событий в секунду, и рендер React на каждое из них — это кадры,
// потраченные впустую. Отпускание возвращает кнопку по пружине, слежение
// идёт короткой ease-out: пружина на каждом кадре ощущалась бы как задержка.
const STYLES = `
:where([data-vibeui-block="button-071"]){
--vibeui-button-071-bg:transparent;
--vibeui-button-071-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-button-071-muted:color-mix(in oklab,var(--vibeui-button-071-fg) 62%,transparent);
--vibeui-button-071-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-button-071-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-071-ring:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-071-on-accent:oklch(0.15 0.02 39.8);
--vibeui-button-071-radius:9999px;
--vibeui-button-071-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-071"]{color-scheme:dark}
[data-vibeui-block="button-071"]{
box-sizing:border-box;display:grid;place-items:center;gap:0.75rem;
width:100%;max-width:22rem;min-height:9rem;padding:1.25rem;
border:1px dashed var(--vibeui-button-071-border);border-radius:1.25rem;
background:var(--vibeui-button-071-bg);color:var(--vibeui-button-071-fg);
font-family:var(--vibeui-button-071-font);
}
[data-vibeui-block="button-071"] *{box-sizing:border-box}
/* Подпись кнопки настраивается и переводится, поэтому высота набирается
   содержимым: фиксированная обрезала бы длинный вариант. */
[data-vibeui-block="button-071"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-height:2.75rem;padding:0.625rem 1.5rem;
border-radius:var(--vibeui-button-071-radius);
background:var(--vibeui-button-071-accent);color:var(--vibeui-button-071-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;line-height:1;letter-spacing:-0.01em;
box-shadow:0 12px 26px -16px var(--vibeui-button-071-accent);
translate:0 0;
}
[data-vibeui-block="button-071"] [data-part="action"] svg{
width:1rem;height:1rem;display:block;flex:none;
}
/* Слежение — короткий ease-out: кнопка не отстаёт от курсора. */
[data-vibeui-block="button-071"] [data-part="action"][data-magnet="pulled"]{
transition:translate .15s ease-out;
}
/* Возврат — пружина с лёгким перелётом: кнопка «отпружинивает» на место.
   Первая строка остаётся браузерам без linear(). */
[data-vibeui-block="button-071"] [data-part="action"][data-magnet="rest"]{
transition:translate .55s cubic-bezier(.22,1.2,.36,1);
transition:translate .55s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
[data-vibeui-block="button-071"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-button-071-ring);outline-offset:3px;
}
[data-vibeui-block="button-071"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;text-align:center;
color:var(--vibeui-button-071-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-071"] *{animation:none!important;transition:none!important}}
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
 * Кнопка, которая тянется к курсору внутри своей зоны и возвращается на
 * место по пружине. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button071({
  label = "Наведите ближе",
  hint = "Кнопка выйдет навстречу курсору",
  pull = 0.35,
  accent,
  background = "",
  className,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: Button071Props) {
  const actionRef = useRef<HTMLButtonElement>(null)

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event)

    const action = actionRef.current

    // Магнит — украшение для мыши: на тач-вводе точка касания и есть цель,
    // а при отключённой анимации кнопка обязана стоять на месте.
    if (
      !action ||
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion:reduce)").matches
    ) {
      return
    }

    const box = action.getBoundingClientRect()
    const offsetX = event.clientX - (box.left + box.width / 2)
    const offsetY = event.clientY - (box.top + box.height / 2)

    action.dataset.magnet = "pulled"
    action.style.translate = `${(offsetX * pull).toFixed(2)}px ${(offsetY * pull).toFixed(2)}px`
  }

  const release = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event)

    const action = actionRef.current

    if (!action) {
      return
    }

    action.dataset.magnet = "rest"
    action.style.translate = "0 0"
  }

  const palette = {
    ...(accent ? { "--vibeui-button-071-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-071-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-071" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-071"
        className={className}
        style={palette}
        onPointerMove={follow}
        onPointerLeave={release}
      >
        <button
          ref={actionRef}
          type="button"
          data-part="action"
          data-magnet="rest"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3 13V7a5 5 0 0 1 10 0v6M3 13h3.2V9.5M13 13H9.8V9.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {label}
        </button>
        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}
