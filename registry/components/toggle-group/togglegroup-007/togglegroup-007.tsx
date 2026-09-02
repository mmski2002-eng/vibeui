"use client"

import { Fragment, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Togglegroup007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  defaultAlign?: string
  defaultMarks?: string[]
  /** Имена групп панели по идентификатору. */
  sectionText?: Record<string, string>
  /** Имена кнопок по идентификатору. */
  itemText?: Record<string, string>
  onChange?: (value: { align: string; marks: string[] }) => void
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: панель форматирования из двух групп-тумблеров, разделённых
// настоящими separator'ами. Слева множественный выбор начертаний, справа
// одиночный выбор выравнивания — разное поведение внутри одной панели, поэтому
// каждая группа несёт своё имя, а фокус ходит по всей панели стрелками.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель темнеет, а границы становятся светлее фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-007"]){
--vibeui-togglegroup-007-bg:transparent;
--vibeui-togglegroup-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-togglegroup-007-muted:light-dark(oklch(0.55 0.014 265),oklch(0.68 0.012 265));
--vibeui-togglegroup-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-togglegroup-007-surface:light-dark(oklch(0.975 0.004 265),oklch(0.28 0.01 265));
--vibeui-togglegroup-007-shadow:light-dark(oklch(0.2 0.02 265 / 8%),oklch(0 0 0 / 35%));
--vibeui-togglegroup-007-accent:light-dark(oklch(0.54 0.17 255),oklch(0.76 0.14 255));
--vibeui-togglegroup-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-007"]{
box-sizing:border-box;display:inline-flex;align-items:center;gap:0.375rem;
max-width:100%;padding:0.3125rem;
border:1px solid var(--vibeui-togglegroup-007-border);border-radius:0.75rem;
background:var(--vibeui-togglegroup-007-bg);color:var(--vibeui-togglegroup-007-fg);
font-family:var(--vibeui-togglegroup-007-font);
box-shadow:0 1px 2px var(--vibeui-togglegroup-007-shadow);
}
[data-vibeui-block="togglegroup-007"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-007"] [data-part="set"]{display:inline-flex;gap:0.125rem}
[data-vibeui-block="togglegroup-007"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:var(--vibeui-togglegroup-007-muted);
transition:background-color .15s ease,color .15s ease;
}
[data-vibeui-block="togglegroup-007"] button svg{width:1rem;height:1rem}
[data-vibeui-block="togglegroup-007"] button:hover{background:var(--vibeui-togglegroup-007-surface);color:var(--vibeui-togglegroup-007-fg)}
[data-vibeui-block="togglegroup-007"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-007-accent);outline-offset:1px;
}
[data-vibeui-block="togglegroup-007"] button[aria-pressed="true"]{
background:color-mix(in oklab,var(--vibeui-togglegroup-007-accent) 12%,var(--vibeui-togglegroup-007-surface));
color:var(--vibeui-togglegroup-007-accent);
}
/* Разделитель объявлен ролью, а не просто нарисован: панель из девяти
   значков подряд неразличима на слух, а separator режет её на группы. */
[data-vibeui-block="togglegroup-007"] [data-part="sep"]{
flex:none;width:1px;height:1.25rem;margin:0 0.1875rem;
background:var(--vibeui-togglegroup-007-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-007"] *{animation:none!important;transition:none!important}}
`

type Section = {
  id: string
  mode: "multi" | "single"
  items: { id: string; d: string }[]
}

const SECTIONS: Section[] = [
  {
    id: "marks",
    mode: "multi",
    items: [
      {
        id: "bold",
        d: "M5.4 3h4a2.6 2.6 0 0 1 0 5.2h-4zm0 5.2h4.6a2.8 2.8 0 0 1 0 5.6H5.4z",
      },
      {
        id: "italic",
        d: "M11.4 3.2H7.6M8.8 12.8H5M9.8 3.2 7 12.8",
      },
      {
        id: "strike",
        d: "M3.2 8h9.6M11 4.6C10.4 3.6 9.3 3 8 3 6.3 3 5 3.9 5 5.3 5 6.4 5.8 7 7 7.5M5 11.4c.6 1 1.7 1.6 3 1.6 1.7 0 3-.9 3-2.3",
      },
    ],
  },
  {
    id: "align",
    mode: "single",
    items: [
      { id: "left", d: "M2.5 4h11M2.5 8h7M2.5 12h11" },
      { id: "center", d: "M2.5 4h11M4.5 8h7M2.5 12h11" },
      {
        id: "right",
        d: "M2.5 4h11M6.5 8h7M2.5 12h11",
      },
    ],
  },
  {
    id: "blocks",
    mode: "multi",
    items: [
      {
        id: "list",
        d: "M6 4h7.5M6 8h7.5M6 12h7.5M3 4h.01M3 8h.01M3 12h.01",
      },
      {
        id: "quote",
        d: "M3.5 12V8.5C3.5 5.8 4.9 4.3 7 4M9 12V8.5C9 5.8 10.4 4.3 12.5 4",
      },
    ],
  },
]

const SECTION_TEXT: Record<string, string> = {
  marks: "Начертание",
  align: "Выравнивание",
  blocks: "Блоки",
}

const ITEM_TEXT: Record<string, string> = {
  bold: "Полужирный",
  italic: "Курсив",
  strike: "Зачёркнутый",
  left: "По левому краю",
  center: "По центру",
  right: "По правому краю",
  list: "Маркированный список",
  quote: "Цитата",
}

const FLAT = SECTIONS.flatMap((section) =>
  section.items.map((item) => ({ section, item })),
)

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
 * Панель форматирования с разделителями: множественный и одиночный выбор
 * в одной панели, фокус ходит стрелками. Один файл, ноль зависимостей.
 */
export function Togglegroup007({
  label = "Форматирование",
  defaultAlign = "left",
  defaultMarks = ["bold"],
  sectionText = SECTION_TEXT,
  itemText = ITEM_TEXT,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup007Props) {
  const [align, setAlign] = useState(defaultAlign)
  const [marks, setMarks] = useState<string[]>(defaultMarks)
  const [active, setActive] = useState(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const focusAt = (index: number) => {
    const last = FLAT.length - 1
    const target = index < 0 ? last : index > last ? 0 : index

    setActive(target)
    buttons.current[target]?.focus()
  }

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      focusAt(index + 1)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      focusAt(index - 1)
    } else if (event.key === "Home") {
      event.preventDefault()
      focusAt(0)
    } else if (event.key === "End") {
      event.preventDefault()
      focusAt(FLAT.length - 1)
    }
  }

  const press = (section: Section, id: string) => {
    if (section.mode === "single") {
      setAlign(id)
      onChange?.({ align: id, marks })
      return
    }

    const next = marks.includes(id)
      ? marks.filter((mark) => mark !== id)
      : [...marks, id]

    setMarks(next)
    onChange?.({ align, marks: next })
  }

  return (
    <>
      <style href="vibeui-togglegroup-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="togglegroup-007"
        role="toolbar"
        aria-label={label}
        aria-orientation="horizontal"
        className={className}
        style={palette}
      >
        {SECTIONS.map((section, sectionIndex) => (
          <Fragment key={section.id}>
            {sectionIndex > 0 ? (
              <span
                data-part="sep"
                role="separator"
                aria-orientation="vertical"
              />
            ) : null}
            <span
              data-part="set"
              role="group"
              aria-label={sectionText[section.id] ?? SECTION_TEXT[section.id]}
            >
              {section.items.map((item) => {
                const index = FLAT.findIndex(
                  (entry) => entry.item.id === item.id,
                )
                const pressed =
                  section.mode === "single"
                    ? align === item.id
                    : marks.includes(item.id)

                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      buttons.current[index] = node
                    }}
                    type="button"
                    aria-pressed={pressed}
                    aria-label={itemText[item.id] ?? ITEM_TEXT[item.id]}
                    title={itemText[item.id] ?? ITEM_TEXT[item.id]}
                    tabIndex={index === active ? 0 : -1}
                    onKeyDown={(event) => onKeyDown(event, index)}
                    onFocus={() => setActive(index)}
                    onClick={() => press(section, item.id)}
                  >
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d={item.d}
                        fill={item.id === "bold" ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={item.id === "bold" ? 0 : 1.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )
              })}
            </span>
          </Fragment>
        ))}
      </div>
    </>
  )
}
