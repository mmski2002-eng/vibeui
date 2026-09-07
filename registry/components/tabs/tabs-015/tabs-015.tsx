"use client"

import { useEffect, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
  ReactNode,
} from "react"

export type Tabs015Item = {
  id: string
  label: string
  content?: ReactNode
}

export type Tabs015Props = Omit<ComponentProps<"div">, "children"> & {
  /** Имя списка вкладок для скринридера. */
  label?: string
  items?: Tabs015Item[]
  /** Вкладка, открытая изначально. */
  defaultId?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: пилюля под активной вкладкой не рисуется у каждой кнопки
// по отдельности, а одна на весь список — она измеряет цель и переезжает к
// ней с лёгким перелётом. Ширина берётся из offsetWidth кнопки, поэтому
// пилюля садится ровно по тексту, каким бы длинным ни оказался перевод.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте дорожка темнеет, а не светлеет.
const STYLES = `
:where([data-vibeui-block="tabs-015"]){
--vibeui-tabs-015-bg:transparent;
--vibeui-tabs-015-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-tabs-015-muted:color-mix(in oklab,var(--vibeui-tabs-015-fg) 62%,transparent);
--vibeui-tabs-015-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-tabs-015-track:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-tabs-015-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-tabs-015-on-accent:oklch(0.15 0.02 39.8);
--vibeui-tabs-015-x:0px;
--vibeui-tabs-015-w:0px;
--vibeui-tabs-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-015"]{color-scheme:dark}
[data-vibeui-block="tabs-015"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-tabs-015-bg);color:var(--vibeui-tabs-015-fg);
font-family:var(--vibeui-tabs-015-font);
}
[data-vibeui-block="tabs-015"] *{box-sizing:border-box}
/* Дорожка прокручивается по горизонтали: пилюля позиционируется от неё,
   поэтому offsetLeft кнопки остаётся верным и при прокрутке. */
[data-vibeui-block="tabs-015"] [data-part="list"]{
position:relative;display:inline-flex;align-self:flex-start;max-width:100%;
gap:0.25rem;padding:0.3125rem;overflow-x:auto;scrollbar-width:none;
border:1px solid var(--vibeui-tabs-015-border);border-radius:999px;
background:var(--vibeui-tabs-015-track);
}
[data-vibeui-block="tabs-015"] [data-part="list"]::-webkit-scrollbar{display:none}
/* Пилюля одна на весь список: её ширину и сдвиг задают переменные, которые
   компонент пишет после замера активной кнопки. */
[data-vibeui-block="tabs-015"] [data-part="list"]::before{
content:"";position:absolute;z-index:0;
top:0.3125rem;bottom:0.3125rem;left:0;
width:var(--vibeui-tabs-015-w);
transform:translateX(var(--vibeui-tabs-015-x));
border-radius:999px;background:var(--vibeui-tabs-015-accent);
opacity:0;pointer-events:none;
transition:transform .4s cubic-bezier(.22,1.2,.36,1),width .4s cubic-bezier(.22,1.2,.36,1),opacity .2s ease;
transition:transform .4s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),width .4s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1),opacity .2s ease;
}
[data-vibeui-block="tabs-015"] [data-part="list"][data-ready="true"]::before{opacity:1}
[data-vibeui-block="tabs-015"] [data-part="tab"]{
position:relative;z-index:1;appearance:none;border:0;background:transparent;
cursor:pointer;white-space:nowrap;
padding:0.4375rem 1rem;border-radius:999px;
font:inherit;font-size:0.8125rem;font-weight:600;line-height:1.2;
color:var(--vibeui-tabs-015-muted);
transition:color .3s ease;
}
[data-vibeui-block="tabs-015"] [data-part="tab"]:hover{color:var(--vibeui-tabs-015-fg)}
[data-vibeui-block="tabs-015"] [data-part="tab"]:focus-visible{
outline:2px solid var(--vibeui-tabs-015-accent);outline-offset:2px;
}
/* Цвет подписи привязан к aria-selected: если состояние поменяют мимо
   атрибута, подпись просто не перекрасится — расхождение видно сразу. */
[data-vibeui-block="tabs-015"] [data-part="tab"][aria-selected="true"]{
color:var(--vibeui-tabs-015-on-accent);
}
/* До замера пилюли (SSR, ещё нет JS) активная подпись остаётся в цвете
   текста: тёмная подпись на тёмной дорожке иначе пропадала бы. */
[data-vibeui-block="tabs-015"] [data-part="list"]:not([data-ready="true"]) [data-part="tab"][aria-selected="true"]{
color:var(--vibeui-tabs-015-fg);
}
[data-vibeui-block="tabs-015"] [data-part="panel"]{
margin:0;padding:0 0.25rem;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-tabs-015-muted);
}
[data-vibeui-block="tabs-015"] [data-part="panel"]:focus-visible{
outline:2px solid var(--vibeui-tabs-015-accent);outline-offset:4px;border-radius:0.5rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Tabs015Item[] = [
  {
    id: "plan",
    label: "План",
    content: "Сроки, ответственные и объём работ на ближайшую итерацию.",
  },
  {
    id: "build",
    label: "Сборка",
    content: "Статус сборки, тесты и последние изменения в ветке.",
  },
  {
    id: "ship",
    label: "Отгрузка",
    content: "Чек-лист выпуска: релизные заметки, миграции и откат.",
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
 * Вкладки, под которыми скользит пилюля: она измеряет активную кнопку и
 * переезжает к ней с пружиной. Один файл, ноль зависимостей.
 */
export function Tabs015({
  label = "Этапы работы",
  items = DEFAULT_ITEMS,
  defaultId,
  accent,
  background = "",
  className,
  style,
  ...props
}: Tabs015Props) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id)
  const [pill, setPill] = useState({ x: 0, w: 0 })
  const listRef = useRef<HTMLDivElement>(null)

  // Пилюля садится по offsetLeft и offsetWidth активной кнопки. Замер
  // повторяется на изменение размера списка: подписи переносятся и
  // растягиваются вместе с колонкой, а пилюля обязана оставаться на месте.
  useEffect(() => {
    const list = listRef.current

    if (!list) {
      return
    }

    const measure = () => {
      const tab = list.querySelector<HTMLElement>(
        '[data-part="tab"][aria-selected="true"]',
      )

      if (!tab) {
        return
      }

      setPill((previous) =>
        previous.x === tab.offsetLeft && previous.w === tab.offsetWidth
          ? previous
          : { x: tab.offsetLeft, w: tab.offsetWidth },
      )
    }

    measure()

    const observer = new ResizeObserver(measure)

    observer.observe(list)

    return () => observer.disconnect()
  }, [active, items])

  const palette = {
    ...(accent ? { "--vibeui-tabs-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const track = {
    "--vibeui-tabs-015-x": `${pill.x}px`,
    "--vibeui-tabs-015-w": `${pill.w}px`,
  } as CSSProperties

  // Стрелки двигают выбор по кругу и переносят фокус: так ведут себя вкладки
  // в системных интерфейсах, и это часть паттерна tabs в WAI-ARIA.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"]

    if (!keys.includes(event.key)) {
      return
    }

    event.preventDefault()

    const index = items.findIndex((item) => item.id === active)
    const last = items.length - 1
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowLeft"
            ? (index - 1 + items.length) % items.length
            : (index + 1) % items.length

    setActive(items[next].id)
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>('[data-part="tab"]')
      [next]?.focus()
  }

  const current = items.find((item) => item.id === active) ?? items[0]

  return (
    <>
      <style href="vibeui-tabs-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-015"
        className={className}
        style={palette}
      >
        <div
          data-part="list"
          data-ready={pill.w > 0}
          role="tablist"
          aria-label={label}
          ref={listRef}
          style={track}
          onKeyDown={onKeyDown}
        >
          {items.map((item) => (
            <button
              key={item.id}
              data-part="tab"
              type="button"
              role="tab"
              id={`vibeui-tabs-015-${item.id}-tab`}
              aria-selected={item.id === active}
              aria-controls={`vibeui-tabs-015-${item.id}-panel`}
              tabIndex={item.id === active ? 0 : -1}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {current ? (
          <p
            data-part="panel"
            role="tabpanel"
            id={`vibeui-tabs-015-${current.id}-panel`}
            aria-labelledby={`vibeui-tabs-015-${current.id}-tab`}
            tabIndex={0}
          >
            {current.content}
          </p>
        ) : null}
      </div>
    </>
  )
}
