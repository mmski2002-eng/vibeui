"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Sheet003Tab = {
  label: string
  rows: { label: string; value: string }[]
}

export type Sheet003Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  tabs?: Sheet003Tab[]
  /** Имя группы разделов для скринридера: русское по умолчанию. */
  tabsLabel?: string
  /** Подпись кнопки закрытия: русская по умолчанию. */
  closeLabel?: string
  /** Открыть лист сразу и без модального режима: он остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка листа и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: лист, внутри которого несколько разделов. Переключатель
// собран на группе радиокнопок, а не на кастомных вкладках: стрелки, Home и
// End работают от браузера, состояние читается скринридером само. Высота
// листа зафиксирована, поэтому смена раздела не дёргает страницу под ним.
//
// Тема берётся из color-scheme окружения через light-dark(): лист темнеет
// там, где тёмный контекст, и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="sheet-003"]){
--vibeui-sheet-003-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-sheet-003-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.006 265));
--vibeui-sheet-003-muted:color-mix(in oklab,var(--vibeui-sheet-003-fg) 68%,transparent);
--vibeui-sheet-003-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-sheet-003-track:light-dark(oklch(0.96 0.004 265),oklch(0.28 0.012 265));
--vibeui-sheet-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.16 265));
--vibeui-sheet-003-on-accent:light-dark(oklch(0.99 0.01 265),oklch(0.17 0.03 265));
--vibeui-sheet-003-shadow:light-dark(oklch(0.2 0.02 265 / 60%),oklch(0.02 0.01 265 / 75%));
--vibeui-sheet-003-lift:light-dark(oklch(0.2 0.02 265 / 18%),oklch(0.02 0.01 265 / 50%));
--vibeui-sheet-003-scrim:light-dark(oklch(0.19 0.02 265 / 45%),oklch(0.08 0.014 265 / 60%));
--vibeui-sheet-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sheet-003"]{color-scheme:dark}
[data-vibeui-block="sheet-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:inline-block;font-family:var(--vibeui-sheet-003-font);color:var(--vibeui-sheet-003-fg);
}
[data-vibeui-block="sheet-003"] [data-part="trigger"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-sheet-003-border);border-radius:0.625rem;
background:var(--vibeui-sheet-003-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-003"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-003-accent);outline-offset:2px}
[data-vibeui-block="sheet-003"] dialog{
position:fixed;inset:auto 0 0 0;margin:0;container-type:inline-size;
width:100%;max-width:100vw;height:min(30rem,88dvh);
padding:0;border:0;border-radius:1.25rem 1.25rem 0 0;overflow:hidden;
background:var(--vibeui-sheet-003-bg);color:var(--vibeui-sheet-003-fg);
box-shadow:0 -26px 60px -32px var(--vibeui-sheet-003-shadow);
translate:0 100%;transition:translate .24s ease,overlay .24s allow-discrete,display .24s allow-discrete;
}
[data-vibeui-block="sheet-003"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-003"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="sheet-003"] dialog::backdrop{background:var(--vibeui-sheet-003-scrim)}
[data-vibeui-block="sheet-003"] [data-part="panel"]{display:flex;flex-direction:column;height:100%;box-sizing:border-box}
[data-vibeui-block="sheet-003"] [data-part="grabber"]{
align-self:center;width:2.5rem;height:0.25rem;margin:0.5rem 0 0.25rem;
border-radius:9999px;background:var(--vibeui-sheet-003-border);flex:none;
}
[data-vibeui-block="sheet-003"] [data-part="title"]{margin:0;padding:0.25rem 1rem 0.625rem;font-size:1rem;font-weight:680}
/* Сегментированный переключатель — это radiogroup: стрелки работают сами. */
[data-vibeui-block="sheet-003"] [data-part="tabs"]{
display:flex;gap:0.125rem;margin:0 1rem;padding:0.1875rem;border:0;
background:var(--vibeui-sheet-003-track);border-radius:0.75rem;
}
[data-vibeui-block="sheet-003"] [data-part="tab"]{
flex:1;display:flex;align-items:center;justify-content:center;cursor:pointer;
height:2rem;border-radius:0.625rem;
font-size:0.8125rem;font-weight:650;color:var(--vibeui-sheet-003-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="sheet-003"] [data-part="tab"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="sheet-003"] [data-part="tab"]:has(input:checked){
background:var(--vibeui-sheet-003-bg);color:var(--vibeui-sheet-003-fg);
box-shadow:0 1px 3px var(--vibeui-sheet-003-lift);
}
[data-vibeui-block="sheet-003"] [data-part="tab"]:has(input:focus-visible){outline:2px solid var(--vibeui-sheet-003-accent);outline-offset:2px}
[data-vibeui-block="sheet-003"] [data-part="body"]{flex:1;min-height:0;overflow-y:auto;padding:0.9375rem 1rem}
[data-vibeui-block="sheet-003"] dl{display:grid;grid-template-columns:1fr auto;gap:0;margin:0;font-size:0.9375rem}
[data-vibeui-block="sheet-003"] [data-part="row"]{display:contents}
[data-vibeui-block="sheet-003"] dt,
[data-vibeui-block="sheet-003"] dd{padding:0.5625rem 0;border-bottom:1px solid var(--vibeui-sheet-003-border)}
[data-vibeui-block="sheet-003"] dt{color:var(--vibeui-sheet-003-muted)}
[data-vibeui-block="sheet-003"] dd{margin:0;text-align:right;font-weight:600;font-variant-numeric:tabular-nums}
[data-vibeui-block="sheet-003"] [data-part="foot"]{
padding:0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-sheet-003-border);
}
[data-vibeui-block="sheet-003"] [data-part="done"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.75rem;border-radius:0.75rem;
background:var(--vibeui-sheet-003-accent);color:var(--vibeui-sheet-003-on-accent);
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="sheet-003"] [data-part="done"]:focus-visible{outline:2px solid var(--vibeui-sheet-003-accent);outline-offset:2px}
/* Шкала категории: на планшете и шире лист получает крупный кегль и воздух. */
@container (min-width: 32rem){
[data-vibeui-block="sheet-003"] dl{font-size:1rem}
[data-vibeui-block="sheet-003"] [data-part="body"]{padding:1.0625rem 1rem}
[data-vibeui-block="sheet-003"] [data-part="tab"]{font-size:0.875rem}
}
/* Немодальный показ: лист остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так его показывают на витрине и в документации. */
[data-vibeui-block="sheet-003"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="sheet-003"] dialog:not(:modal){position:absolute;max-height:100%;z-index:1}
[data-vibeui-block="sheet-003"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-003"] *{animation:none!important;transition:none!important}
[data-vibeui-block="sheet-003"] dialog{translate:0 0}
}
`

const DEFAULT_TABS: Sheet003Tab[] = [
  {
    label: "Обзор",
    rows: [
      { label: "Статус", value: "Опубликован" },
      { label: "Адрес", value: "vitrina.ru" },
      { label: "Последняя сборка", value: "12 марта, 14:08" },
      { label: "Размер", value: "4,2 МБ" },
    ],
  },
  {
    label: "Трафик",
    rows: [
      { label: "Визиты за неделю", value: "8 412" },
      { label: "Уникальные", value: "5 190" },
      { label: "Средняя глубина", value: "3,4 страницы" },
      { label: "Отказы", value: "31 %" },
    ],
  },
  {
    label: "Сборки",
    rows: [
      { label: "Успешных", value: "48" },
      { label: "С ошибкой", value: "3" },
      { label: "Среднее время", value: "51 с" },
      { label: "Кэш", value: "Включён" },
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
 * Лист с разделами внутри: переключатель собран на радиокнопках.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet003({
  triggerLabel = "Показатели проекта",
  title = "Проект «Витрина»",
  tabs = DEFAULT_TABS,
  tabsLabel = "Раздел",
  closeLabel = "Закрыть",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Sheet003Props) {
  const sheet = useRef<HTMLDialogElement>(null)

  // show() вместо showModal(): немодальный лист живёт внутри своего блока и
  // не уводит страницу в верхний слой. Витрине нужен именно такой.
  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    sheet.current?.show()

    // show() уводит фокус внутрь листа. Для немодального показа это лишнее:
    // страница не должна прыгать к панели просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])
  const group = useId()
  const [active, setActive] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-sheet-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sheet-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const current = tabs[Math.min(active, tabs.length - 1)]

  return (
    <>
      <style href="vibeui-sheet-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sheet"
        data-vibeui-block="sheet-003"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          onClick={() => sheet.current?.showModal()}
        >
          {triggerLabel}
        </button>
        <dialog
          ref={sheet}
          aria-label={title}
          onClick={(event) => {
            if (event.target === sheet.current) {
              sheet.current.close()
            }
          }}
        >
          <div data-part="panel">
            <span data-part="grabber" aria-hidden="true" />
            <h2 data-part="title">{title}</h2>
            <fieldset data-part="tabs">
              <legend hidden>{tabsLabel}</legend>
              {tabs.map((tab, index) => (
                <label key={tab.label} data-part="tab">
                  <input
                    type="radio"
                    name={group}
                    checked={index === active}
                    onChange={() => setActive(index)}
                  />
                  <span>{tab.label}</span>
                </label>
              ))}
            </fieldset>
            <div data-part="body">
              <dl>
                {current.rows.map((row) => (
                  <div key={row.label} data-part="row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div data-part="foot">
              <button
                type="button"
                data-part="done"
                onClick={() => sheet.current?.close()}
              >
                {closeLabel}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
