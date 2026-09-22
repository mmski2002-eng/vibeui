"use client"

import { useId, useRef, useState } from "react"
import { Card175 } from "@/registry/components/card/card-175/card-175"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid028Row = {
  id: string
  order: string
  customer: string
  status: string
  amount: number
}

export type Datagrid028Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid028Row[]
  caption?: string
  triggerLabel?: string
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Строка состояния, пока действие не выбрано. */
  emptyLogText?: string
  /** Строка состояния после выбора. {action} и {order} — подстановки. */
  logText?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подписи пунктов меню по ключу: компонент несёт русские. */
  actionText?: Record<string, string>
  /** Подпись кнопки меню строки. {label} и {order} — подстановки. */
  triggerRowLabel?: string
  /** Подпись самого меню. {order} — номер заказа. */
  menuLabel?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: действия строки убраны в меню, а не разложены кнопками
// по последней колонке — иначе на пяти действиях таблица превращается в
// панель инструментов. Меню собрано по клавиатурной модели: стрелки водят
// по пунктам, Escape закрывает и возвращает фокус на кнопку, Home и End
// прыгают к краям. Разрушительный пункт отделён линией и помечен цветом
// вместе со словом «Удалить» — один цвет предупреждением не является.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной подложки. Непрозрачный фон
// остаётся только у меню: всплывающий слой обязан перекрывать строки.
const STYLES = `
:where([data-vibeui-block="datagrid-028"]){
--vibeui-datagrid-028-bg:transparent;
--vibeui-datagrid-028-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-028-muted:color-mix(in oklab,var(--vibeui-datagrid-028-fg) 68%,transparent);
--vibeui-datagrid-028-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-028-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-028-menu:light-dark(oklch(1 0 0),oklch(0.24 0 285));
--vibeui-datagrid-028-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-datagrid-028-danger:light-dark(oklch(0.53 0.19 27),oklch(0.73 0.17 27));
--vibeui-datagrid-028-shadow:light-dark(oklch(0.23 0 285 / 16%),oklch(0 0 0 / 55%));
--vibeui-datagrid-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-028"]{color-scheme:dark}
[data-vibeui-block="datagrid-028"]{
box-sizing:border-box;width:100%;max-width:50rem;margin:0 auto;
background:var(--vibeui-datagrid-028-bg);color:var(--vibeui-datagrid-028-fg);
border:1px solid var(--vibeui-datagrid-028-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-028-font);
}
[data-vibeui-block="datagrid-028"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-028"] [data-part="scroll"]{overflow-x:auto;overflow-y:visible}
[data-vibeui-block="datagrid-028"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-028-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-028"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-028"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-028-muted);caption-side:top;
}
[data-vibeui-block="datagrid-028"] th,
[data-vibeui-block="datagrid-028"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-028-border);
}
[data-vibeui-block="datagrid-028"] thead th{background:var(--vibeui-datagrid-028-head);font-weight:600}
[data-vibeui-block="datagrid-028"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-028"] [data-part="code"]{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem}
[data-vibeui-block="datagrid-028"] [data-part="status"]{color:var(--vibeui-datagrid-028-muted)}
[data-vibeui-block="datagrid-028"] [data-part="actions-cell"]{width:3rem;position:relative;text-align:right}
[data-vibeui-block="datagrid-028"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;line-height:1;letter-spacing:0.08em;
width:1.75rem;height:1.75rem;border-radius:0.4375rem;
border:1px solid transparent;background:transparent;color:var(--vibeui-datagrid-028-muted);
}
[data-vibeui-block="datagrid-028"] [data-part="trigger"]:hover{border-color:var(--vibeui-datagrid-028-border);color:var(--vibeui-datagrid-028-fg)}
[data-vibeui-block="datagrid-028"] [data-part="trigger"][aria-expanded="true"]{border-color:var(--vibeui-datagrid-028-accent);color:var(--vibeui-datagrid-028-accent)}
[data-vibeui-block="datagrid-028"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-datagrid-028-accent);outline-offset:2px}
[data-vibeui-block="datagrid-028"] [data-part="menu"]{
position:absolute;inset-inline-end:0.5rem;inset-block-start:2.125rem;z-index:6;
min-width:11rem;padding:0.25rem;margin:0;list-style:none;text-align:start;
border:1px solid var(--vibeui-datagrid-028-border);border-radius:0.625rem;
background:var(--vibeui-datagrid-028-menu);box-shadow:0 14px 32px var(--vibeui-datagrid-028-shadow);
}
[data-vibeui-block="datagrid-028"] [data-part="item"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;text-align:start;
display:block;width:100%;padding:0.375rem 0.5rem;border-radius:0.4375rem;
border:0;background:transparent;color:var(--vibeui-datagrid-028-fg);
}
[data-vibeui-block="datagrid-028"] [data-part="item"]:hover,
[data-vibeui-block="datagrid-028"] [data-part="item"]:focus-visible{background:var(--vibeui-datagrid-028-head);outline:none}
[data-vibeui-block="datagrid-028"] [data-part="item"]:focus-visible{box-shadow:inset 0 0 0 2px var(--vibeui-datagrid-028-accent)}
[data-vibeui-block="datagrid-028"] [data-danger="true"]{color:var(--vibeui-datagrid-028-danger);font-weight:600}
[data-vibeui-block="datagrid-028"] [data-part="sep"]{margin:0.25rem 0.25rem;border-top:1px solid var(--vibeui-datagrid-028-border)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-028"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid028Row[] = [
  {
    id: "o1",
    order: "ЗК-7710",
    customer: "Артель «Кама»",
    status: "Собирается",
    amount: 184300,
  },
  {
    id: "o2",
    order: "ЗК-7711",
    customer: "Северный Порт",
    status: "Оплачен",
    amount: 92100,
  },
  {
    id: "o3",
    order: "ЗК-7712",
    customer: "Мостовик",
    status: "В доставке",
    amount: 461000,
  },
  {
    id: "o4",
    order: "ЗК-7713",
    customer: "Гранд-Сервис",
    status: "Черновик",
    amount: 15700,
  },
]

const ACTIONS = [
  { key: "open", danger: false },
  { key: "copy", danger: false },
  { key: "print", danger: false },
  { key: "hold", danger: false },
  { key: "delete", danger: true },
]

const ACTION_TEXT: Record<string, string> = {
  open: "Открыть заказ",
  copy: "Дублировать",
  print: "Печать накладной",
  hold: "Поставить на паузу",
  delete: "Удалить заказ",
}

const COLUMN_TEXT: Record<string, string> = {
  order: "Заказ",
  customer: "Заказчик",
  status: "Статус",
  amount: "Сумма, ₽",
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
 * Сетка с колонкой действий и меню: клавиатурная навигация по пунктам,
 * Escape возвращает фокус на кнопку. Один файл, ноль зависимостей.
 */
export function Datagrid028({
  rows = DEFAULT_ROWS,
  caption = "Действия строки убраны в меню, оно управляется стрелками",
  triggerLabel = "Действия",
  heading = "Заказы в работе",
  emptyLogText = "Действие ещё не выбрано",
  logText = "{action} — заказ {order}",
  scrollLabel = "Таблица заказов, прокручивается вбок",
  columnText = COLUMN_TEXT,
  actionText = ACTION_TEXT,
  triggerRowLabel = "{label} для заказа {order}",
  menuLabel = "Действия для заказа {order}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid028Props) {
  const [openRow, setOpenRow] = useState<string | null>(null)
  const [log, setLog] = useState("")
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({})
  const base = useId()

  const palette = {
    ...(accent ? { "--vibeui-datagrid-028-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-028-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function close(rowId: string) {
    setOpenRow(null)
    triggers.current[rowId]?.focus()
  }

  function moveFocus(list: HTMLElement, step: number | "first" | "last") {
    const items = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[data-part="item"]'),
    )
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    const next =
      step === "first"
        ? 0
        : step === "last"
          ? items.length - 1
          : (index + step + items.length) % items.length

    items[next]?.focus()
  }

  return (
    <>
      <style href="vibeui-datagrid-028" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-028"
        className={className}
        style={palette}
      >
        <Card175 data-part="bar" heading={heading} emptyLogText={emptyLogText} log={log} accent={accent} />
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
                <th scope="col">{columnText.order ?? COLUMN_TEXT.order}</th>
                <th scope="col">
                  {columnText.customer ?? COLUMN_TEXT.customer}
                </th>
                <th scope="col">{columnText.status ?? COLUMN_TEXT.status}</th>
                <th scope="col" data-align="end">
                  {columnText.amount ?? COLUMN_TEXT.amount}
                </th>
                <th scope="col" data-part="actions-cell">
                  <span hidden>{triggerLabel}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const menuId = `${base}-${row.id}`
                const open = openRow === row.id

                return (
                  <tr key={row.id}>
                    <th scope="row" data-part="code">
                      {row.order}
                    </th>
                    <td>{row.customer}</td>
                    <td data-part="status">{row.status}</td>
                    <td data-align="end">
                      {row.amount.toLocaleString("ru-RU")}
                    </td>
                    <td data-part="actions-cell">
                      <button
                        type="button"
                        data-part="trigger"
                        ref={(node) => {
                          triggers.current[row.id] = node
                        }}
                        aria-haspopup="menu"
                        aria-expanded={open}
                        aria-controls={open ? menuId : undefined}
                        aria-label={triggerRowLabel
                          .replace("{label}", triggerLabel)
                          .replace("{order}", row.order)}
                        onClick={() => setOpenRow(open ? null : row.id)}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault()
                            setOpenRow(row.id)
                          }
                        }}
                      >
                        <span aria-hidden="true">···</span>
                      </button>
                      {open ? (
                        <ul
                          data-part="menu"
                          id={menuId}
                          role="menu"
                          aria-label={menuLabel.replace("{order}", row.order)}
                          onKeyDown={(event) => {
                            const list = event.currentTarget

                            if (event.key === "Escape") {
                              event.preventDefault()
                              close(row.id)
                            }

                            if (event.key === "ArrowDown") {
                              event.preventDefault()
                              moveFocus(list, 1)
                            }

                            if (event.key === "ArrowUp") {
                              event.preventDefault()
                              moveFocus(list, -1)
                            }

                            if (event.key === "Home") {
                              event.preventDefault()
                              moveFocus(list, "first")
                            }

                            if (event.key === "End") {
                              event.preventDefault()
                              moveFocus(list, "last")
                            }
                          }}
                        >
                          {ACTIONS.map((action, index) => {
                            const label =
                              actionText[action.key] ?? ACTION_TEXT[action.key]

                            return (
                              <li key={action.key} role="none">
                                {action.danger ? <p data-part="sep" /> : null}
                                <button
                                  type="button"
                                  role="menuitem"
                                  data-part="item"
                                  data-danger={
                                    action.danger ? "true" : undefined
                                  }
                                  autoFocus={index === 0}
                                  onClick={() => {
                                    setLog(
                                      logText
                                        .replace("{action}", label)
                                        .replace("{order}", row.order),
                                    )
                                    close(row.id)
                                  }}
                                >
                                  {label}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
