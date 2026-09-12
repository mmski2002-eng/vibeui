"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Dropdown022Props = Omit<ComponentProps<"div">, "children"> & {
  /** Подпись под кнопкой; она же уходит в aria-label самой кнопки. */
  label?: string
  /** Действия на орбите: 4–5 штук. Иконки берутся по порядку. */
  actions?: string[]
  /** Открыть меню сразу: так его снимают для витрины и документации. */
  defaultOpen?: boolean
  /** Радиус разлёта в rem. Меньше 2.5 действия налезают на кнопку. */
  radius?: number
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: меню действий не падает списком вниз, а разлетается по
// дуге вокруг кнопки. Такому меню не нужно место под собой — оно живёт в
// кадре карточки, на панели инструментов, в углу редактора. Дуга берёт верх,
// а не полный круг: снизу кнопку обычно подпирает край панели.
//
// Раскрытие держится на кликах, а не на :hover: hover-меню недоступно с
// клавиатуры и не работает на тач-экранах, а aria-expanded нечему объявить.
const STYLES = `
:where([data-vibeui-block="dropdown-022"]){
--vibeui-dropdown-022-bg:transparent;
--vibeui-dropdown-022-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-dropdown-022-muted:color-mix(in oklab,var(--vibeui-dropdown-022-fg) 62%,transparent);
--vibeui-dropdown-022-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-dropdown-022-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-dropdown-022-accent:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-dropdown-022-on-accent:oklch(0.15 0 0);
--vibeui-dropdown-022-ease:linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
--vibeui-dropdown-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-022"]{color-scheme:dark}
[data-vibeui-block="dropdown-022"]{
display:flex;flex-direction:column;align-items:center;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;
background:var(--vibeui-dropdown-022-bg);color:var(--vibeui-dropdown-022-fg);
font-family:var(--vibeui-dropdown-022-font);
}
[data-vibeui-block="dropdown-022"] *{box-sizing:border-box}
/* Размер площадки считается от радиуса разлёта: иначе при большом radius
   действия уезжают за край кадра и обрезаются. */
[data-vibeui-block="dropdown-022"] [data-part="orbit"]{
position:relative;
width:var(--vibeui-dropdown-022-width);
height:var(--vibeui-dropdown-022-height);
max-width:100%;
}
[data-vibeui-block="dropdown-022"] [data-part="menu"]{list-style:none;margin:0;padding:0}
/* Действия стоят в той же точке, что и кнопка, и уезжают трансформом.
   Позиция левого края — половина собственного размера, поэтому центры
   совпадают точно, без магических чисел в JS. */
[data-vibeui-block="dropdown-022"] [data-part="action"]{
position:absolute;left:50%;bottom:1.75rem;margin:0 0 -1.125rem -1.125rem;
width:2.25rem;height:2.25rem;display:grid;place-items:center;
appearance:none;cursor:pointer;border-radius:50%;
border:1px solid var(--vibeui-dropdown-022-border);
background:var(--vibeui-dropdown-022-card);color:var(--vibeui-dropdown-022-fg);
opacity:0;visibility:hidden;transform:translate(0,0) scale(0.4);
transition:transform .46s cubic-bezier(.22,1.2,.36,1),opacity .2s ease,visibility 0s linear .46s;
transition:transform .46s var(--vibeui-dropdown-022-ease),opacity .2s ease,visibility 0s linear .46s;
}
[data-vibeui-block="dropdown-022"] [data-part="action"] svg{width:1.0625rem;height:1.0625rem}
[data-vibeui-block="dropdown-022"] [data-part="action"]:hover{border-color:var(--vibeui-dropdown-022-accent)}
[data-vibeui-block="dropdown-022"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-dropdown-022-accent);outline-offset:2px}
[data-vibeui-block="dropdown-022"][data-open="true"] [data-part="action"]{
opacity:1;visibility:visible;
transform:translate(var(--vibeui-dropdown-022-x),var(--vibeui-dropdown-022-y)) scale(1);
transition:transform .46s cubic-bezier(.22,1.2,.36,1),opacity .22s ease,visibility 0s;
transition:transform .46s var(--vibeui-dropdown-022-ease),opacity .22s ease,visibility 0s;
transition-delay:calc(var(--vibeui-dropdown-022-index) * 40ms);
}
[data-vibeui-block="dropdown-022"] [data-part="core"]{
position:absolute;left:50%;bottom:0.25rem;margin-left:-1.5rem;z-index:2;
width:3rem;height:3rem;display:grid;place-items:center;
appearance:none;border:0;border-radius:50%;cursor:pointer;
background:var(--vibeui-dropdown-022-accent);color:oklch(from var(--vibeui-dropdown-022-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
transition:transform .42s cubic-bezier(.22,1.2,.36,1);
transition:transform .42s var(--vibeui-dropdown-022-ease);
}
[data-vibeui-block="dropdown-022"] [data-part="core"] svg{width:1.5rem;height:1.5rem}
[data-vibeui-block="dropdown-022"] [data-part="core"]:focus-visible{outline:2px solid var(--vibeui-dropdown-022-accent);outline-offset:3px}
/* Плюс доворачивается в крестик: одна кнопка честно показывает оба
   состояния, и второй иконки для закрытия не нужно. */
[data-vibeui-block="dropdown-022"][data-open="true"] [data-part="core"]{transform:rotate(45deg) scale(0.92)}
[data-vibeui-block="dropdown-022"] [data-part="caption"]{
margin:0;font-size:0.75rem;line-height:1.3;text-align:center;
color:var(--vibeui-dropdown-022-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-022"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS = [
  "Поделиться",
  "Дублировать",
  "Скопировать ссылку",
  "В избранное",
]

/** Иконки действий по порядку. Пятое действие получает круг с точкой. */
const ACTION_ICONS = [
  "M12 15V4m0 0 3.5 3.5M12 4 8.5 7.5M5 14v3.5A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5V14",
  "M9.5 8.5h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1ZM5.5 15.5h-1a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1",
  "M10.5 13.5a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 0 0-5.7-5.7l-1.1 1.1M13.5 10.5a4 4 0 0 0-5.7 0l-2.3 2.3a4 4 0 0 0 5.7 5.7l1.1-1.1",
  "m12 4 2.5 5.1 5.5.8-4 3.9.9 5.6L12 16.7 7.1 19.4l.9-5.6-4-3.9 5.5-.8Z",
  "M12 4v16M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",
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
 * Орбитальное меню действий: кнопка в центре, действия по дуге над ней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown022({
  label = "Действия",
  actions = DEFAULT_ACTIONS,
  defaultOpen = false,
  radius = 3.75,
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown022Props) {
  const [open, setOpen] = useState(defaultOpen)
  const root = useRef<HTMLDivElement>(null)
  const core = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  // Escape и клик мимо закрывают меню: без них раскрытое меню остаётся висеть
  // поверх страницы, и закрыть его можно только повторным попаданием в кнопку.
  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        core.current?.focus()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
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

  const spread = Math.min(radius, 5)
  // Дуга идёт от 168° до 12°: верхняя половина без самых горизонтальных
  // направлений, где действия упирались бы в края кадра.
  const step = actions.length > 1 ? 156 / (actions.length - 1) : 0
  const points = actions.map((_, index) => {
    const angle = ((168 - index * step) * Math.PI) / 180

    return { x: spread * Math.cos(angle), y: -spread * Math.sin(angle) }
  })
  const reach = points.reduce(
    (box, point) => ({
      side: Math.max(box.side, Math.abs(point.x)),
      top: Math.max(box.top, -point.y),
    }),
    { side: 0, top: 0 },
  )

  const palette = {
    "--vibeui-dropdown-022-width": `${(reach.side + 1.375) * 2}rem`,
    "--vibeui-dropdown-022-height": `${reach.top + 3.125}rem`,
    ...(accent ? { "--vibeui-dropdown-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-022" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={root}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-022"
        data-open={open}
        className={className}
        style={palette}
      >
        <div data-part="orbit">
          <ul data-part="menu" id={menuId} role="menu" aria-label={label}>
            {actions.map((action, index) => (
              <li key={action} role="none">
                <button
                  type="button"
                  role="menuitem"
                  data-part="action"
                  aria-label={action}
                  title={action}
                  tabIndex={open ? 0 : -1}
                  onClick={() => {
                    setOpen(false)
                    core.current?.focus()
                  }}
                  style={
                    {
                      "--vibeui-dropdown-022-x": `${points[index].x.toFixed(3)}rem`,
                      "--vibeui-dropdown-022-y": `${points[index].y.toFixed(3)}rem`,
                      "--vibeui-dropdown-022-index": String(index),
                    } as CSSProperties
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={ACTION_ICONS[index % ACTION_ICONS.length]} />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            ref={core}
            data-part="core"
            aria-label={label}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-controls={menuId}
            onClick={() => setOpen((previous) => !previous)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <p data-part="caption">{label}</p>
      </div>
    </>
  )
}
