"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Tabs012Tab = {
  id: string
  /** Подпись: она же уходит скринридеру и во всплывающую подсказку. */
  label: string
  /** Значок: две буквы или один знак, без иконочного пакета. */
  mark: string
  text: string
}

export type Tabs012Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  tabs?: Tabs012Tab[]
  currentId?: string
  groupLabel?: string
  /** Показывать подписи рядом со значками, а не только подсказкой. */
  withLabels?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: узкая полоса вкладок, где на месте подписей — значки.
// Так делают в панелях и редакторах, где ширины нет, и так же теряют
// доступность: значок без имени опознаётся не всеми и не сразу. Здесь подпись
// не исчезает, а переезжает: она лежит в aria-label и во всплывающей
// подсказке, а переключателем её можно вернуть на полосу целиком. Активная
// вкладка помечена не только цветом, но и заливкой: цвет один не переживает
// ни печать, ни дальтонизм.
const STYLES = `
:where([data-vibeui-block="tabs-012"]){
--vibeui-tabs-012-bg:transparent;
--vibeui-tabs-012-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-tabs-012-muted:color-mix(in oklab,var(--vibeui-tabs-012-fg) 60%,transparent);
--vibeui-tabs-012-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-tabs-012-strip:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 6%));
--vibeui-tabs-012-hover:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 9%));
--vibeui-tabs-012-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-tabs-012-on-accent:oklch(from var(--vibeui-tabs-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-tabs-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-012"]{color-scheme:dark}
[data-vibeui-block="tabs-012"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;box-sizing:border-box;
font-family:var(--vibeui-tabs-012-font);color:var(--vibeui-tabs-012-fg);
}
[data-vibeui-block="tabs-012"] *{box-sizing:border-box}
[data-vibeui-block="tabs-012"] [data-part="strip"]{
display:inline-flex;align-self:flex-start;gap:0.1875rem;
padding:0.1875rem;border-radius:0.625rem;
background:var(--vibeui-tabs-012-strip);
}
[data-vibeui-block="tabs-012"] [data-part="tab"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
min-height:2rem;padding:0.25rem 0.5rem;border-radius:0.5rem;
background:transparent;color:var(--vibeui-tabs-012-muted);
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="tabs-012"] [data-part="tab"]:hover{background:var(--vibeui-tabs-012-hover);color:var(--vibeui-tabs-012-fg)}
[data-vibeui-block="tabs-012"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-tabs-012-accent);outline-offset:2px}
/* Активная вкладка помечена заливкой, а не одним цветом текста: цвет сам по
   себе не переживает ни печать, ни дальтонизм. */
[data-vibeui-block="tabs-012"] [data-part="tab"][aria-selected="true"]{
background:var(--vibeui-tabs-012-accent);color:var(--vibeui-tabs-012-on-accent);
}
[data-vibeui-block="tabs-012"] [data-part="mark"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.25rem;font-size:0.8125rem;font-weight:700;letter-spacing:0.01em;
}
[data-vibeui-block="tabs-012"] [data-part="text"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:8rem;
}
[data-vibeui-block="tabs-012"] [data-part="panel"]{
margin:0;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="tabs-012"] [data-part="switch"]{
appearance:none;border:0;cursor:pointer;align-self:flex-start;
padding:0.1875rem 0.375rem;border-radius:0.375rem;
background:transparent;color:var(--vibeui-tabs-012-muted);
font:inherit;font-size:0.75rem;text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="tabs-012"] [data-part="switch"]:hover{color:var(--vibeui-tabs-012-fg)}
[data-vibeui-block="tabs-012"] [data-part="switch"]:focus-visible{outline:2px solid var(--vibeui-tabs-012-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TABS: Tabs012Tab[] = [
  {
    id: "grid",
    label: "Таблица",
    mark: "Тб",
    text: "Строки и столбцы: удобно сравнивать значения по одному признаку.",
  },
  {
    id: "board",
    label: "Доска",
    mark: "Дс",
    text: "Карточки по колонкам: видно, на каком шаге застряла работа.",
  },
  {
    id: "chart",
    label: "График",
    mark: "Гр",
    text: "Одна кривая на метрику: смотрят на форму, а не на точные числа.",
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
 * Вкладки-значки: подпись не исчезает, а переезжает в подсказку и метку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs012({
  tabs = DEFAULT_TABS,
  currentId = "board",
  groupLabel = "Вид данных",
  withLabels = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Tabs012Props) {
  const [current, setCurrent] = useState(currentId)
  const [labels, setLabels] = useState(withLabels)
  const strip = useRef<HTMLDivElement>(null)

  // Стрелки, Home и End: у вкладок это ожидаемое поведение, и без него
  // полоса значков остаётся недоступной с клавиатуры.
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    const order = tabs.map((tab) => tab.id)
    const index = order.indexOf(current)

    const next =
      event.key === "ArrowRight"
        ? (index + 1) % order.length
        : event.key === "ArrowLeft"
          ? (index - 1 + order.length) % order.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? order.length - 1
              : -1

    if (next === -1) {
      return
    }

    event.preventDefault()
    setCurrent(order[next])

    const buttons = strip.current?.querySelectorAll("[data-part='tab']")
    ;(buttons?.[next] as HTMLElement | undefined)?.focus()
  }

  const palette = {
    ...(accent ? { "--vibeui-tabs-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const open = tabs.find((tab) => tab.id === current) ?? tabs[0]

  return (
    <>
      <style href="vibeui-tabs-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-012"
        className={className}
        style={palette}
      >
        <div
          ref={strip}
          data-part="strip"
          role="tablist"
          aria-label={groupLabel}
          onKeyDown={keys}
        >
          {tabs.map((tab) => {
            const selected = tab.id === current

            return (
              <button
                key={tab.id}
                type="button"
                data-part="tab"
                role="tab"
                aria-selected={selected}
                aria-controls={`vibeui-tabs-012-${tab.id}`}
                // Подпись остаётся у вкладки даже без текста на полосе:
                // значок без имени опознаётся не всеми и не сразу.
                aria-label={labels ? undefined : tab.label}
                title={labels ? undefined : tab.label}
                tabIndex={selected ? 0 : -1}
                onClick={() => setCurrent(tab.id)}
              >
                <span data-part="mark" aria-hidden="true">
                  {tab.mark}
                </span>
                {labels ? <span data-part="text">{tab.label}</span> : null}
              </button>
            )
          })}
        </div>

        <p
          id={`vibeui-tabs-012-${open.id}`}
          data-part="panel"
          role="tabpanel"
          tabIndex={0}
        >
          {open.text}
        </p>

        <button
          type="button"
          data-part="switch"
          aria-pressed={labels}
          onClick={() => setLabels((value) => !value)}
        >
          {labels ? "Только значки" : "Показать подписи"}
        </button>
      </div>
    </>
  )
}
