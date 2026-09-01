"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid015Row = {
  id: string
  step: string
  owner: string
  duration: string
}

export type Datagrid015Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid015Row[]
  caption?: string
  liveTemplate?: string
  accent?: string
}

// Идея компонента: порядок строк задаётся перетаскиванием, но мышь —
// не единственный способ. Ручка захвата это кнопка: стрелки вверх и вниз
// двигают строку на шаг, Home и End отправляют её в начало и конец.
// Каждое перемещение объявляется через aria-live, иначе для скринридера
// строка просто исчезает с прежнего места.
const STYLES = `
:where([data-vibeui-block="datagrid-015"]){
--vibeui-datagrid-015-bg:oklch(1 0 0);
--vibeui-datagrid-015-fg:oklch(0.23 0.014 285);
--vibeui-datagrid-015-muted:oklch(0.55 0.014 285);
--vibeui-datagrid-015-border:oklch(0.92 0.006 285);
--vibeui-datagrid-015-head:oklch(0.975 0.003 285);
--vibeui-datagrid-015-accent:oklch(0.53 0.16 300);
--vibeui-datagrid-015-drop:oklch(0.96 0.03 300);
--vibeui-datagrid-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:var(--vibeui-datagrid-015-bg);color:var(--vibeui-datagrid-015-muted);
transition:color .15s ease,border-color .15s ease;
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
 * Сетка с перестановкой строк перетаскиванием и стрелками с клавиатуры:
 * порядок шагов задаёт сам читатель. Один файл, ноль зависимостей.
 */
export function Datagrid015({
  rows = DEFAULT_ROWS,
  caption = "Тяните ручку слева или наведите на неё фокус и жмите стрелки",
  liveTemplate = "«{шаг}» теперь на позиции {позиция} из {всего}",
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
    ...style,
  } as CSSProperties

  function announce(list: Datagrid015Row[], id: string) {
    const index = list.findIndex((row) => row.id === id)

    setMessage(
      liveTemplate
        .replace("{шаг}", list[index].step)
        .replace("{позиция}", String(index + 1))
        .replace("{всего}", String(list.length)),
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
        data-vibeui-block="datagrid-015"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">Маршрут обработки заявки</h3>
          <p data-part="live" role="status" aria-live="polite">
            {message || `Шагов в маршруте: ${order.length}`}
          </p>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица шагов маршрута, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col" data-part="handle-cell">
                  <span aria-hidden="true">⇅</span>
                  <span hidden>Перемещение</span>
                </th>
                <th scope="col" data-part="rank">
                  №
                </th>
                <th scope="col">Шаг</th>
                <th scope="col">Ответственный</th>
                <th scope="col">Срок</th>
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
                      aria-label={`Переместить шаг «${row.step}», сейчас позиция ${index + 1} из ${order.length}`}
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
        <p data-part="hint">
          Стрелки — на шаг, Home и End — в начало и конец списка.
        </p>
      </section>
    </>
  )
}
