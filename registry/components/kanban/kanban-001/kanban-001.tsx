"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, DragEvent } from "react"

export type Kanban001Card = {
  id: string
  title: string
  tag?: string
  /** Оттенок метки и полосы карточки в градусах oklch: 0 — красный, 150 — зелёный. */
  hue?: number
  column: string
}

export type Kanban001Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  columns?: string[]
  cards?: Kanban001Card[]
  onChange?: (cards: Kanban001Card[]) => void
  /** Подпись списка выбора колонки: {title} подставляет заголовок карточки. */
  columnPickerLabel?: string
  /** Пусто — подложки нет, доска лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: доска задач по колонкам. Перенос — нативный drag and drop,
// без библиотеки. Второй путь обязателен: у карточки есть ряд чипов-колонок,
// потому что перетаскивание недоступно с клавиатуры и тяжело даётся на
// телефоне. Чипы — обычные кнопки с aria-pressed, а не список: список внутри
// карточки выглядит формой и уводит внимание с самой задачи. Метка карточки
// красится оттенком из данных, поэтому доска читается по цвету, а не только
// по тексту. Счётчик в шапке колонки считается из карточек, а не хранится
// отдельно, — иначе после переноса цифра начинает врать.
//
// Тема берётся из color-scheme окружения через light-dark(): доска темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="kanban-001"]){
--vibeui-kanban-001-bg:transparent;
--vibeui-kanban-001-card:light-dark(oklch(1 0 0),oklch(0.27 0.012 265));
--vibeui-kanban-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-kanban-001-muted:color-mix(in oklab,var(--vibeui-kanban-001-fg) 68%,transparent);
--vibeui-kanban-001-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-kanban-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.15 262));
--vibeui-kanban-001-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 262));
--vibeui-kanban-001-shadow:light-dark(oklch(0.2 0.02 265 / 6%),oklch(0 0 0 / 32%));
--vibeui-kanban-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="kanban-001"]{color-scheme:dark}
[data-vibeui-block="kanban-001"]{
display:grid;grid-auto-flow:column;grid-auto-columns:minmax(11rem,1fr);gap:0.625rem;
width:100%;box-sizing:border-box;padding:0.75rem;overflow-x:auto;
background:var(--vibeui-kanban-001-bg);
border:1px solid var(--vibeui-kanban-001-border);border-radius:0.875rem;
font-family:var(--vibeui-kanban-001-font);color:var(--vibeui-kanban-001-fg);
}
[data-vibeui-block="kanban-001"] *{box-sizing:border-box}
[data-vibeui-block="kanban-001"] [data-part="column"]{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.5rem;border-radius:0.75rem;
border:1px dashed transparent;
}
/* Цель переноса подсвечивается рамкой: заливка спорит с карточками внутри. */
[data-vibeui-block="kanban-001"] [data-part="column"][data-over="true"]{
border-color:var(--vibeui-kanban-001-accent);
background:color-mix(in oklab,var(--vibeui-kanban-001-accent) 7%,transparent);
}
[data-vibeui-block="kanban-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;font-weight:650;
}
/* Счётчик считается из карточек: отдельное число начинает врать после переноса. */
[data-vibeui-block="kanban-001"] [data-part="count"]{
color:var(--vibeui-kanban-001-muted);font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="kanban-001"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="kanban-001"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.375rem;
padding:0.5rem;border-radius:0.625rem;cursor:grab;
background:var(--vibeui-kanban-001-card);
border:1px solid var(--vibeui-kanban-001-border);
box-shadow:0 1px 2px var(--vibeui-kanban-001-shadow);
font-size:0.75rem;line-height:1.35;
}
[data-vibeui-block="kanban-001"] [data-part="card"][data-dragging="true"]{opacity:.45}
/* Цвет метки приходит из данных: доска должна читаться по цвету, а не только
   по тексту, и оттенок задаётся одним числом, а не новой переменной темы. */
[data-vibeui-block="kanban-001"] [data-part="card"]{
--vibeui-kanban-001-mark:light-dark(oklch(0.5 0.16 var(--vibeui-kanban-001-hue,262)),oklch(0.78 0.14 var(--vibeui-kanban-001-hue,262)));
border-left:3px solid var(--vibeui-kanban-001-mark);
}
[data-vibeui-block="kanban-001"] [data-part="tag"]{
align-self:flex-start;padding:0 0.375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-kanban-001-mark) 16%,transparent);
color:var(--vibeui-kanban-001-mark);
font-size:0.625rem;font-weight:650;
}
/* Второй путь переноса: drag недоступен с клавиатуры и труден на телефоне.
   Чипы — кнопки с aria-pressed: нажатие переносит карточку, текущая колонка
   залита акцентом. Список выбора превращал бы карточку в форму. */
[data-vibeui-block="kanban-001"] [data-part="move"]{
display:flex;flex-wrap:wrap;gap:0.25rem;
}
[data-vibeui-block="kanban-001"] [data-part="chip"]{
appearance:none;cursor:pointer;
padding:0.0625rem 0.4375rem;border-radius:9999px;
border:1px solid var(--vibeui-kanban-001-border);
background:none;color:var(--vibeui-kanban-001-muted);
font:inherit;font-size:0.625rem;font-weight:600;line-height:1.5;
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="kanban-001"] [data-part="chip"]:hover{
border-color:var(--vibeui-kanban-001-accent);color:var(--vibeui-kanban-001-fg);
}
[data-vibeui-block="kanban-001"] [data-part="chip"][aria-pressed="true"]{
background:var(--vibeui-kanban-001-accent);
border-color:var(--vibeui-kanban-001-accent);
color:var(--vibeui-kanban-001-on-accent);cursor:default;
}
[data-vibeui-block="kanban-001"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-kanban-001-accent);outline-offset:1px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kanban-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = ["Очередь", "В работе", "Готово"]

const DEFAULT_CARDS: Kanban001Card[] = [
  {
    id: "1",
    title: "Вторая волна таблиц",
    tag: "каталог",
    hue: 262,
    column: "Очередь",
  },
  {
    id: "2",
    title: "Блоки витрины товара",
    tag: "срочно",
    hue: 25,
    column: "Очередь",
  },
  {
    id: "3",
    title: "Панель фильтров",
    tag: "блоки",
    hue: 60,
    column: "В работе",
  },
  {
    id: "4",
    title: "Недельное расписание",
    tag: "готово",
    hue: 150,
    column: "Готово",
  },
]

const DEFAULT_PICKER_LABEL = "Колонка задачи «{title}»"

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Доска задач: нативный drag и выбор колонки списком для клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kanban001({
  columns = DEFAULT_COLUMNS,
  cards = DEFAULT_CARDS,
  onChange,
  columnPickerLabel = DEFAULT_PICKER_LABEL,
  background = "",
  accent,
  className,
  style,
  ...props
}: Kanban001Props) {
  const [board, setBoard] = useState(cards)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)

  const put = (id: string, column: string) => {
    const next = board.map((card) =>
      card.id === id ? { ...card, column } : card,
    )
    setBoard(next)
    onChange?.(next)
  }

  const drop = (event: DragEvent<HTMLElement>, column: string) => {
    event.preventDefault()
    setOver(null)
    if (dragged) put(dragged, column)
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-kanban-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-kanban-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kanban-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="kanban"
        data-vibeui-block="kanban-001"
        className={className}
        style={palette}
      >
        {columns.map((column) => {
          const rows = board.filter((card) => card.column === column)
          return (
            <section
              key={column}
              data-part="column"
              data-over={column === over}
              aria-label={`${column}: ${rows.length}`}
              onDragOver={(event) => {
                event.preventDefault()
                setOver(column)
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(event) => drop(event, column)}
            >
              <p data-part="head">
                {column}
                <span data-part="count">{rows.length}</span>
              </p>
              <ul>
                {rows.map((card) => (
                  <li key={card.id}>
                    <article
                      data-part="card"
                      data-dragging={card.id === dragged}
                      draggable
                      style={
                        card.hue === undefined
                          ? undefined
                          : ({
                              "--vibeui-kanban-001-hue": card.hue,
                            } as CSSProperties)
                      }
                      onDragStart={() => setDragged(card.id)}
                      onDragEnd={() => {
                        setDragged(null)
                        setOver(null)
                      }}
                    >
                      {card.tag ? (
                        <span data-part="tag">{card.tag}</span>
                      ) : null}
                      {card.title}
                      <div
                        data-part="move"
                        role="group"
                        aria-label={columnPickerLabel.replace(
                          "{title}",
                          card.title,
                        )}
                      >
                        {columns.map((option) => (
                          <button
                            key={option}
                            type="button"
                            data-part="chip"
                            aria-pressed={option === card.column}
                            onClick={() => put(card.id, option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
