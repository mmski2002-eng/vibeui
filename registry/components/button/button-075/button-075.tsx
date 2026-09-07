"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Button075Action = {
  label: string
  icon?: ReactNode
  onSelect?: () => void
}

export type Button075Props = Omit<ComponentProps<"div">, "children"> & {
  /** Подпись главной кнопки: у плюса нет текста. */
  label?: string
  /** Действия веера. Больше четырёх в кадр не помещается. */
  actions?: Button075Action[]
  /** Подписи действий по порядку — для перевода без пересборки иконок. */
  actionLabels?: string[]
  /** Столбиком вверх или строкой влево. */
  direction?: "up" | "row"
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: одна кнопка вместо панели. Пока действия не нужны, в углу
// лежит плюс; по нажатию над ним столбиком всплывают подписанные кнопки с
// задержкой в несколько кадров между ними — глаз успевает пересчитать их по
// одной, а не получает три штуки разом. Нажатие на действие список не
// закрывает: закрывают плюс, Escape или клик мимо.
//
// Открытое состояние объявлено через aria-expanded, а не только нарисовано
// поворотом плюса. Закрытые действия выключены: сдвинутая прозрачная кнопка
// иначе осталась бы в обходе Tab и ловила бы нажатия мимо цели.
//
// Escape и нажатие мимо закрывают веер — оба обработчика живут на документе
// и снимаются, как только веер закрыт: слушать документ впустую незачем.
const STYLES = `
:where([data-vibeui-block="button-075"]){
--vibeui-button-075-bg:transparent;
--vibeui-button-075-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-button-075-muted:color-mix(in oklab,var(--vibeui-button-075-fg) 62%,transparent);
--vibeui-button-075-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-button-075-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-button-075-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-075-ring:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-075-on-accent:oklch(0.15 0.02 39.8);
--vibeui-button-075-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-075"]{color-scheme:dark}
[data-vibeui-block="button-075"]{
position:relative;box-sizing:border-box;
display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;
width:100%;max-width:22rem;padding:0.5rem;border-radius:1.25rem;
background:var(--vibeui-button-075-bg);color:var(--vibeui-button-075-fg);
font-family:var(--vibeui-button-075-font);
}
/* Место под столбик зарезервировано: раскрытие не должно двигать соседей. */
[data-vibeui-block="button-075"][data-direction="up"]{min-height:16.5rem}
[data-vibeui-block="button-075"] *{box-sizing:border-box}
[data-vibeui-block="button-075"] [data-part="main"]{
position:relative;z-index:1;flex:none;
appearance:none;border:0;cursor:pointer;
display:grid;place-items:center;
width:3.25rem;height:3.25rem;padding:0;border-radius:50%;
background:var(--vibeui-button-075-accent);color:var(--vibeui-button-075-on-accent);
box-shadow:0 12px 26px -14px var(--vibeui-button-075-accent);
}
[data-vibeui-block="button-075"] [data-part="main"] svg{
width:1.375rem;height:1.375rem;display:block;
transition:rotate .45s cubic-bezier(.22,1.2,.36,1);
transition:rotate .45s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
[data-vibeui-block="button-075"][data-open="true"] [data-part="main"] svg{rotate:135deg}
[data-vibeui-block="button-075"] [data-part="main"]:focus-visible,
[data-vibeui-block="button-075"] [data-part="item"]:focus-visible{
outline:2px solid var(--vibeui-button-075-ring);outline-offset:3px;
}
/* Столбик действий стоит над главной кнопкой и не занимает места в потоке:
   пока он закрыт, клики проходят сквозь него. */
[data-vibeui-block="button-075"] [data-part="items"]{
position:absolute;right:0.5rem;bottom:4.25rem;z-index:2;
display:flex;flex-direction:column-reverse;align-items:flex-end;gap:0.5rem;
pointer-events:none;
}
[data-vibeui-block="button-075"][data-direction="row"] [data-part="items"]{
right:4.25rem;bottom:0.875rem;flex-direction:row-reverse;align-items:center;
}
[data-vibeui-block="button-075"][data-open="true"] [data-part="items"]{pointer-events:auto}
[data-vibeui-block="button-075"] [data-part="item"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.875rem 0 0.625rem;border-radius:999px;
border:1px solid var(--vibeui-button-075-border);
background:var(--vibeui-button-075-card);color:var(--vibeui-button-075-fg);
font:inherit;font-size:0.8125rem;font-weight:600;white-space:nowrap;
box-shadow:0 10px 24px -16px oklch(0 0 0 / 45%);
opacity:0;translate:0 1.25rem;scale:0.6;
transition:translate .5s cubic-bezier(.22,1.2,.36,1),scale .5s cubic-bezier(.22,1.2,.36,1),opacity .3s ease;
transition:translate .5s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),scale .5s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),opacity .3s ease;
}
[data-vibeui-block="button-075"][data-direction="row"] [data-part="item"]{translate:1.25rem 0}
[data-vibeui-block="button-075"] [data-part="item"]:hover{border-color:var(--vibeui-button-075-accent)}
[data-vibeui-block="button-075"] [data-part="item"] svg{
width:1.125rem;height:1.125rem;display:block;
fill:none;stroke:currentColor;stroke-width:1.8;
stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="button-075"] [data-part="item"]:disabled{cursor:default}
[data-vibeui-block="button-075"][data-open="true"] [data-part="item"]{opacity:1;scale:1;translate:0 0}
/* Стаггер только на раскрытии: складываются кнопки разом, иначе закрытие
   тянется дольше, чем длится решение уйти. */
[data-vibeui-block="button-075"][data-open="true"] [data-part="item"][data-index="1"]{transition-delay:.02s}
[data-vibeui-block="button-075"][data-open="true"] [data-part="item"][data-index="2"]{transition-delay:.07s}
[data-vibeui-block="button-075"][data-open="true"] [data-part="item"][data-index="3"]{transition-delay:.12s}
[data-vibeui-block="button-075"][data-open="true"] [data-part="item"][data-index="4"]{transition-delay:.17s}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-075"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS: Button075Action[] = [
  {
    label: "Поделиться",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
      </svg>
    ),
  },
  {
    label: "Изменить",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    label: "В избранное",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 2.6 5.6 6 .6-4.5 4 1.4 5.9L12 16l-5.5 3.1L7.9 13l-4.5-4 6-.6Z" />
      </svg>
    ),
  },
]

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
 * Плавающая кнопка, раскрывающая веер действий со стаггером и пружиной.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button075({
  label = "Действия",
  actions = DEFAULT_ACTIONS,
  actionLabels,
  direction = "up",
  accent,
  background = "",
  className,
  style,
  ...props
}: Button075Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        mainRef.current?.focus()
      }
    }

    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  const palette = {
    ...(accent ? { "--vibeui-button-075-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-075-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-075" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-slot="button"
        data-vibeui-block="button-075"
        data-open={open}
        data-direction={direction}
        className={className}
        style={palette}
      >
        <div data-part="items" role="group" aria-label={label}>
          {actions.slice(0, 4).map((action, index) => (
            <button
              key={action.label}
              type="button"
              data-part="item"
              data-index={index + 1}
              disabled={!open}
              onClick={() => action.onSelect?.()}
            >
              {action.icon}
              <span>{actionLabels?.[index] ?? action.label}</span>
            </button>
          ))}
        </div>
        <button
          ref={mainRef}
          type="button"
          data-part="main"
          aria-label={label}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </>
  )
}
