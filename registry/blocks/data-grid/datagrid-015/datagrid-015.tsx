"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid015Row = {
  id: string
  step: string
  owner: string
  duration: string
}

export type Datagrid015Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid015Row[]
  caption?: string
  /** Объявление о перемещении. {step}, {position}, {total} — подстановки. */
  liveTemplate?: string
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Строка панели до первого перемещения. {count} — число шагов. */
  stepsTemplate?: string
  /** Подпись ручки захвата. {step}, {position}, {total} — подстановки. */
  moveLabel?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Подсказка о клавишах под таблицей. */
  hintText?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: порядок строк задаётся перетаскиванием, но мышь —
// не единственный способ. Ручка захвата это кнопка: стрелки вверх и вниз
// двигают строку на шаг, Home и End отправляют её в начало и конец.
// Каждое перемещение объявляется через aria-live, иначе для скринридера
// строка просто исчезает с прежнего места.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-015"]){
--vibeui-datagrid-015-bg:transparent;
--vibeui-datagrid-015-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-015-muted:color-mix(in oklab,var(--vibeui-datagrid-015-fg) 68%,transparent);
--vibeui-datagrid-015-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-015-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-015-accent:light-dark(oklch(0.282 0 0),oklch(0.91 0 0));
--vibeui-datagrid-015-drop:light-dark(oklch(0.96 0 300),oklch(0.31 0 0));
--vibeui-datagrid-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-datagrid-015-dur-2:180ms;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-015"]{color-scheme:dark}
[data-vibeui-block="datagrid-015"]{
box-sizing:border-box;width:100%;max-width:48rem;margin:0 auto;
background:var(--vibeui-datagrid-015-bg);color:var(--vibeui-datagrid-015-fg);
border:1px solid var(--vibeui-datagrid-015-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-015-font);overflow:hidden;
}
[data-vibeui-block="datagrid-015"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-015"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-015-border);
}
[data-vibeui-block="datagrid-015"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-015"] [data-part="live"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-015-muted)}
[data-vibeui-block="datagrid-015"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-015"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-015-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-015"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-015"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-015-muted);caption-side:top;
}
[data-vibeui-block="datagrid-015"] th,
[data-vibeui-block="datagrid-015"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-015-border);
}
[data-vibeui-block="datagrid-015"] thead th{background:var(--vibeui-datagrid-015-head);font-weight:600}
[data-vibeui-block="datagrid-015"] [data-part="rank"]{
width:2.5rem;text-align:center;font-variant-numeric:tabular-nums;color:var(--vibeui-datagrid-015-muted);
}
[data-vibeui-block="datagrid-015"] [data-part="handle-cell"]{width:2.75rem;padding-inline:0.5rem}
[data-vibeui-block="datagrid-015"] [data-part="handle"]{
appearance:none;cursor:grab;font:inherit;line-height:1;
width:1.75rem;height:1.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-015-border);
background:transparent;color:var(--vibeui-datagrid-015-muted);
transition:color var(--vibeui-datagrid-015-dur-2) ease,border-color var(--vibeui-datagrid-015-dur-2) ease;
}
[data-vibeui-block="datagrid-015"] [data-part="handle"]:hover{color:var(--vibeui-datagrid-015-accent);border-color:var(--vibeui-datagrid-015-accent)}
[data-vibeui-block="datagrid-015"] [data-part="handle"]:focus-visible{outline:2px solid var(--vibeui-datagrid-015-accent);outline-offset:2px}
[data-vibeui-block="datagrid-015"] tbody tr[data-dragging="true"]{opacity:.45}
[data-vibeui-block="datagrid-015"] tbody tr[data-over="true"] td,
[data-vibeui-block="datagrid-015"] tbody tr[data-over="true"] th{
background:var(--vibeui-datagrid-015-drop);box-shadow:inset 0 2px 0 var(--vibeui-datagrid-015-accent);
}
[data-vibeui-block="datagrid-015"] [data-part="owner"]{color:var(--vibeui-datagrid-015-muted)}
[data-vibeui-block="datagrid-015"] [data-part="hint"]{
margin:0;padding:0.5rem 0.875rem 0.75rem;font-size:0.6875rem;color:var(--vibeui-datagrid-015-muted);
border-top:1px solid var(--vibeui-datagrid-015-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-015"] *{animation:none!important;transition:none!important}}
`

const COLUMN_TEXT: Record<string, string> = {
  handle: "Перемещение",
  rank: "№",
  step: "Шаг",
  owner: "Ответственный",
  duration: "Срок",
}

const DEFAULT_ROWS: Datagrid015Row[] = [
  { id: "s1", step: "Заявка принята", owner: "Приёмка", duration: "10 мин" },
  { id: "s2", step: "Проверка комплектности", owner: "Склад", duration: "1 ч" },
  { id: "s3", step: "Оценка стоимости", owner: "Сервис", duration: "2 ч" },
  {
    id: "s4",
    step: "Согласование с клиентом",
    owner: "Менеджер",
    duration: "4 ч",
  },
  { id: "s5", step: "Ремонт", owner: "Мастерская", duration: "2 дня" },
  { id: "s6", step: "Выдача", owner: "Приёмка", duration: "20 мин" },
]

function moveItem<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length || from === to) {
    return list
  }

  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)

  return next
}

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
 * Сетка с перестановкой строк перетаскиванием и стрелками с клавиатуры:
 * порядок шагов задаёт сам читатель. Один файл, ноль зависимостей.
 */
export function Datagrid015({
  rows = DEFAULT_ROWS,
  caption = "Тяните ручку слева или наведите на неё фокус и жмите стрелки",
  liveTemplate = "«{step}» теперь на позиции {position} из {total}",
  heading = "Маршрут обработки заявки",
  stepsTemplate = "Шагов в маршруте: {count}",
  moveLabel = "Переместить шаг «{step}», сейчас позиция {position} из {total}",
  columnText = COLUMN_TEXT,
  scrollLabel = "Таблица шагов маршрута, прокручивается вбок",
  hintText = "Стрелки — на шаг, Home и End — в начало и конец списка.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid015Props) {
  const [order, setOrder] = useState(rows)
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-datagrid-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function announce(list: Datagrid015Row[], id: string) {
    const index = list.findIndex((row) => row.id === id)

    setMessage(
      liveTemplate
        .replace("{step}", list[index].step)
        .replace("{position}", String(index + 1))
        .replace("{total}", String(list.length)),
    )
  }

  function relocate(id: string, to: number) {
    setOrder((current) => {
      const from = current.findIndex((row) => row.id === id)
      const next = moveItem(current, from, to)
      announce(next, id)

      return next
    })
  }

  return (
    <>
      <style href="vibeui-datagrid-015" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-015"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">{heading}</h3>
          <p data-part="live" role="status" aria-live="polite">
            {message || stepsTemplate.replace("{count}", String(order.length))}
          </p>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label={scrollLabel}
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col" data-part="handle-cell">
                  <span aria-hidden="true">⇅</span>
                  <span hidden>{columnText.handle ?? COLUMN_TEXT.handle}</span>
                </th>
                <th scope="col" data-part="rank">
                  {columnText.rank ?? COLUMN_TEXT.rank}
                </th>
                <th scope="col">{columnText.step ?? COLUMN_TEXT.step}</th>
                <th scope="col">{columnText.owner ?? COLUMN_TEXT.owner}</th>
                <th scope="col">
                  {columnText.duration ?? COLUMN_TEXT.duration}
                </th>
              </tr>
            </thead>
            <tbody>
              {order.map((row, index) => (
                <tr
                  key={row.id}
                  data-dragging={dragging === row.id ? "true" : undefined}
                  data-over={
                    over === row.id && dragging !== row.id ? "true" : undefined
                  }
                  onDragOver={(event) => {
                    event.preventDefault()
                    setOver(row.id)
                  }}
                  onDrop={(event) => {
                    event.preventDefault()

                    if (dragging) {
                      relocate(dragging, index)
                    }

                    setDragging(null)
                    setOver(null)
                  }}
                >
                  <td data-part="handle-cell">
                    <button
                      type="button"
                      data-part="handle"
                      draggable
                      aria-label={moveLabel
                        .replace("{step}", row.step)
                        .replace("{position}", String(index + 1))
                        .replace("{total}", String(order.length))}
                      onDragStart={() => setDragging(row.id)}
                      onDragEnd={() => {
                        setDragging(null)
                        setOver(null)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowUp") {
                          event.preventDefault()
                          relocate(row.id, index - 1)
                        }

                        if (event.key === "ArrowDown") {
                          event.preventDefault()
                          relocate(row.id, index + 1)
                        }

                        if (event.key === "Home") {
                          event.preventDefault()
                          relocate(row.id, 0)
                        }

                        if (event.key === "End") {
                          event.preventDefault()
                          relocate(row.id, order.length - 1)
                        }
                      }}
                    >
                      <span aria-hidden="true">⣿</span>
                    </button>
                  </td>
                  <td data-part="rank">{index + 1}</td>
                  <th scope="row">{row.step}</th>
                  <td data-part="owner">{row.owner}</td>
                  <td>{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p data-part="hint">{hintText}</p>
      </section>
    </>
  )
}
