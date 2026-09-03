"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Drawer009Section = {
  id: string
  label: string
  /** Сколько записей в разделе: счётчик стоит прямо на вкладке. */
  count?: number
  rows: { term: string; value: string }[]
}

export type Drawer009Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  subtitle?: string
  sections?: Drawer009Section[]
  currentId?: string
  closeLabel?: string
  /** Открыть шторку сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: у записи несколько сторон — свойства, история, файлы, — и
// вываливать их одной простынёй значит заставлять прокручивать мимо ненужного.
// Вкладки внутри панели делят содержимое, а счётчик на вкладке говорит, есть
// ли там вообще что смотреть: пустая «История» и «История, 12» — разные
// поводы туда заходить. Прокручивается только тело раздела: шапка с именем
// записи и полоса вкладок остаются на месте, иначе на длинном списке
// непонятно, к чему всё это относится.
const STYLES = `
:where([data-vibeui-block="drawer-009"]){
--vibeui-drawer-009-bg:light-dark(oklch(0.99 0.002 265),oklch(0.22 0.014 265));
--vibeui-drawer-009-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-drawer-009-muted:color-mix(in oklab,var(--vibeui-drawer-009-fg) 62%,transparent);
--vibeui-drawer-009-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 13%));
--vibeui-drawer-009-head:light-dark(oklch(0 0 0 / 3%),oklch(1 0 0 / 4%));
--vibeui-drawer-009-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-drawer-009-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-drawer-009-scrim:light-dark(oklch(0.2 0.02 265 / 42%),oklch(0 0 0 / 62%));
--vibeui-drawer-009-shadow:light-dark(oklch(0.2 0.02 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-drawer-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="drawer-009"]{color-scheme:dark}
[data-vibeui-block="drawer-009"]{
display:inline-block;font-family:var(--vibeui-drawer-009-font);color:var(--vibeui-drawer-009-fg);
}
[data-vibeui-block="drawer-009"] *{box-sizing:border-box}
[data-vibeui-block="drawer-009"] [data-part="trigger"]{
appearance:none;cursor:pointer;
min-height:2.25rem;padding:0.375rem 0.875rem;
border:1px solid var(--vibeui-drawer-009-border);border-radius:0.625rem;
background:var(--vibeui-drawer-009-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-009"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-009-accent);outline-offset:2px}
[data-vibeui-block="drawer-009"] dialog{
position:fixed;inset:0 0 0 auto;
width:min(26rem,100vw);max-width:100vw;height:100%;
margin:0;padding:0;border:0;
background:var(--vibeui-drawer-009-bg);color:var(--vibeui-drawer-009-fg);
box-shadow:-24px 0 60px -30px var(--vibeui-drawer-009-shadow);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-009"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-009"] dialog[open]{translate:100% 0}
}
[data-vibeui-block="drawer-009"] dialog::backdrop{background:var(--vibeui-drawer-009-scrim)}
[data-vibeui-block="drawer-009"] [data-part="panel"]{display:flex;flex-direction:column;height:100%}
/* Шапка и полоса вкладок не прокручиваются: на длинном списке иначе
   непонятно, к какой записи всё это относится. */
[data-vibeui-block="drawer-009"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;
padding:0.875rem 1rem 0.625rem;
background:var(--vibeui-drawer-009-head);
}
[data-vibeui-block="drawer-009"] [data-part="title"]{margin:0;font-size:1rem;font-weight:650}
[data-vibeui-block="drawer-009"] [data-part="subtitle"]{
margin:0.125rem 0 0;font-size:0.8125rem;color:var(--vibeui-drawer-009-muted);
}
[data-vibeui-block="drawer-009"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;
background:transparent;color:var(--vibeui-drawer-009-muted);font:inherit;
}
[data-vibeui-block="drawer-009"] [data-part="close"]:hover{background:var(--vibeui-drawer-009-hover);color:var(--vibeui-drawer-009-fg)}
[data-vibeui-block="drawer-009"] [data-part="tabs"]{
display:flex;gap:0.25rem;padding:0 1rem;
background:var(--vibeui-drawer-009-head);
border-bottom:1px solid var(--vibeui-drawer-009-border);
}
[data-vibeui-block="drawer-009"] [data-part="tab"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.4375rem 0.5rem;margin-bottom:-1px;
border-bottom:2px solid transparent;background:transparent;
color:var(--vibeui-drawer-009-muted);
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-009"] [data-part="tab"]:hover{color:var(--vibeui-drawer-009-fg)}
[data-vibeui-block="drawer-009"] [data-part="tab"][aria-selected="true"]{
color:var(--vibeui-drawer-009-fg);border-bottom-color:var(--vibeui-drawer-009-accent);
}
[data-vibeui-block="drawer-009"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-drawer-009-accent);outline-offset:-2px;border-radius:0.375rem}
/* Счётчик на вкладке: пустая «История» и «История, 12» — разные поводы
   туда заходить. */
[data-vibeui-block="drawer-009"] [data-part="count"]{
min-width:1.125rem;padding:0 0.3125rem;border-radius:999px;
background:var(--vibeui-drawer-009-hover);
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="drawer-009"] [data-part="body"]{
flex:1;min-height:0;overflow-y:auto;padding:0.875rem 1rem;
scrollbar-width:thin;scrollbar-color:var(--vibeui-drawer-009-border) transparent;
}
[data-vibeui-block="drawer-009"] dl{
display:grid;grid-template-columns:auto 1fr;gap:0.4375rem 0.875rem;margin:0;
font-size:0.8125rem;
}
[data-vibeui-block="drawer-009"] dt{color:var(--vibeui-drawer-009-muted)}
[data-vibeui-block="drawer-009"] dd{margin:0;font-weight:600;overflow-wrap:anywhere}
[data-vibeui-block="drawer-009"] [data-part="empty"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-drawer-009-muted);
}
/* Немодальный показ: шторка остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="drawer-009"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="drawer-009"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="drawer-009"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-009"] dialog{transition:none!important;translate:0 0}
[data-vibeui-block="drawer-009"] *{animation:none!important}
}
`

const DEFAULT_SECTIONS: Drawer009Section[] = [
  {
    id: "about",
    label: "Свойства",
    rows: [
      { term: "Номер", value: "ORD-2481" },
      { term: "Покупатель", value: "Анна Ковалёва" },
      { term: "Сумма", value: "11 670 ₽" },
      { term: "Оплата", value: "Карта •• 4417" },
    ],
  },
  {
    id: "history",
    label: "История",
    count: 3,
    rows: [
      { term: "12 марта, 14:08", value: "Заказ создан" },
      { term: "12 марта, 14:11", value: "Оплата прошла" },
      { term: "13 марта, 09:30", value: "Передан в доставку" },
    ],
  },
  {
    id: "files",
    label: "Файлы",
    count: 2,
    rows: [
      { term: "Чек.pdf", value: "148 КБ" },
      { term: "Накладная.pdf", value: "212 КБ" },
    ],
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
 * Шторка с вкладками: разделы записи внутри панели, шапка не уезжает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer009({
  triggerLabel = "Открыть заказ",
  title = "Заказ ORD-2481",
  subtitle = "Оплачен · 12 марта",
  sections = DEFAULT_SECTIONS,
  currentId = "about",
  closeLabel = "Закрыть",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Drawer009Props) {
  const id = useId().replace(/:/g, "")
  const panel = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState(currentId)

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная шторка живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    panel.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к шторке просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])

  const palette = {
    ...(accent ? { "--vibeui-drawer-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const open = sections.find((section) => section.id === current) ?? sections[0]

  return (
    <>
      <style href="vibeui-drawer-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="drawer"
        data-vibeui-block="drawer-009"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          onClick={() => panel.current?.showModal()}
        >
          {triggerLabel}
        </button>

        <dialog ref={panel} aria-label={title}>
          <div data-part="panel">
            <div data-part="head">
              <div>
                <h2 data-part="title">{title}</h2>
                <p data-part="subtitle">{subtitle}</p>
              </div>
              <button
                type="button"
                data-part="close"
                aria-label={closeLabel}
                onClick={() => panel.current?.close()}
              >
                ×
              </button>
            </div>

            <div data-part="tabs" role="tablist" aria-label={title}>
              {sections.map((section) => {
                const selected = section.id === current

                return (
                  <button
                    key={section.id}
                    type="button"
                    data-part="tab"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${id}-${section.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setCurrent(section.id)}
                  >
                    {section.label}
                    {section.count !== undefined ? (
                      <span data-part="count">{section.count}</span>
                    ) : null}
                  </button>
                )
              })}
            </div>

            <div
              data-part="body"
              id={`${id}-${open.id}`}
              role="tabpanel"
              tabIndex={0}
            >
              {open.rows.length > 0 ? (
                <dl>
                  {open.rows.map((row) => (
                    <div key={row.term} style={{ display: "contents" }}>
                      <dt>{row.term}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p data-part="empty">В этом разделе пока пусто.</p>
              )}
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
