"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Sheet009Group = {
  name: string
  label: string
  options: { value: string; label: string; count?: number }[]
}

export type Sheet009Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  triggerLabel?: string
  title?: string
  groups?: Sheet009Group[]
  /** Сколько найдено при текущем наборе фильтров. */
  found?: number
  /** Подпись кнопки применения. {count} — сколько найдено. */
  applyTemplate?: string
  resetLabel?: string
  /** Подпись счётчика выбранного. {count} — сколько отмечено. */
  chosenTemplate?: string
  /** Открыть лист сразу и без модального режима: он остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: фильтры каталога на телефоне. Главное здесь — не сами
// галочки, а две вещи по краям: счётчик найденного в кнопке применения и
// сброс, который виден сразу, а не спрятан внизу списка. Человек должен
// понимать, сколько останется товаров, ещё до нажатия, и уметь вернуться к
// исходному состоянию одним движением. Число у каждой галочки говорит,
// сколько всего в этой ветке: пустой фильтр выбирать бессмысленно.
const STYLES = `
:where([data-vibeui-block="sheet-009"]){
--vibeui-sheet-009-bg:light-dark(oklch(0.99 0.002 265),oklch(0.22 0.014 265));
--vibeui-sheet-009-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-sheet-009-muted:color-mix(in oklab,var(--vibeui-sheet-009-fg) 60%,transparent);
--vibeui-sheet-009-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 13%));
--vibeui-sheet-009-head:light-dark(oklch(0 0 0 / 3%),oklch(1 0 0 / 4%));
--vibeui-sheet-009-hover:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 6%));
--vibeui-sheet-009-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-sheet-009-on-accent:oklch(from var(--vibeui-sheet-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sheet-009-scrim:light-dark(oklch(0.2 0.02 265 / 42%),oklch(0 0 0 / 62%));
--vibeui-sheet-009-shadow:light-dark(oklch(0.2 0.02 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-sheet-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sheet-009"]{color-scheme:dark}
[data-vibeui-block="sheet-009"]{
display:inline-block;font-family:var(--vibeui-sheet-009-font);color:var(--vibeui-sheet-009-fg);
}
[data-vibeui-block="sheet-009"] *{box-sizing:border-box}
[data-vibeui-block="sheet-009"] [data-part="trigger"]{
appearance:none;cursor:pointer;
min-height:2.25rem;padding:0.375rem 0.875rem;
border:1px solid var(--vibeui-sheet-009-border);border-radius:0.625rem;
background:var(--vibeui-sheet-009-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-009"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-009-accent);outline-offset:2px}
[data-vibeui-block="sheet-009"] dialog{
position:fixed;inset:auto 0 0 0;
width:100%;max-width:100vw;max-height:min(30rem,88dvh);
margin:0;padding:0;border:0;
border-radius:1.125rem 1.125rem 0 0;
background:var(--vibeui-sheet-009-bg);color:var(--vibeui-sheet-009-fg);
box-shadow:0 -24px 60px -30px var(--vibeui-sheet-009-shadow);
translate:0 100%;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="sheet-009"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-009"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="sheet-009"] dialog::backdrop{background:var(--vibeui-sheet-009-scrim)}
[data-vibeui-block="sheet-009"] [data-part="panel"]{display:flex;flex-direction:column;max-height:inherit}
[data-vibeui-block="sheet-009"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem;
background:var(--vibeui-sheet-009-head);
border-bottom:1px solid var(--vibeui-sheet-009-border);
}
[data-vibeui-block="sheet-009"] [data-part="title"]{margin:0;font-size:1rem;font-weight:650}
[data-vibeui-block="sheet-009"] [data-part="chosen"]{
font-size:0.75rem;color:var(--vibeui-sheet-009-muted);font-variant-numeric:tabular-nums;
}
/* Сброс стоит в шапке, а не в конце списка: вернуться к исходному человек
   должен из любого места, не докручивая до низа. */
[data-vibeui-block="sheet-009"] [data-part="reset"]{
appearance:none;border:0;cursor:pointer;background:transparent;
padding:0.25rem 0.375rem;border-radius:0.375rem;
color:var(--vibeui-sheet-009-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="sheet-009"] [data-part="reset"]:disabled{color:var(--vibeui-sheet-009-muted);cursor:default}
[data-vibeui-block="sheet-009"] [data-part="body"]{
flex:1;min-height:0;overflow-y:auto;padding:0.5rem 0.5rem 0.75rem;
scrollbar-width:thin;scrollbar-color:var(--vibeui-sheet-009-border) transparent;
}
[data-vibeui-block="sheet-009"] fieldset{margin:0 0 0.5rem;padding:0;border:0}
[data-vibeui-block="sheet-009"] legend{
padding:0.375rem 0.5rem 0.25rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-sheet-009-muted);
}
[data-vibeui-block="sheet-009"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;cursor:pointer;
font-size:0.875rem;
}
[data-vibeui-block="sheet-009"] [data-part="option"]:hover{background:var(--vibeui-sheet-009-hover)}
[data-vibeui-block="sheet-009"] [data-part="option"] input{
width:1rem;height:1rem;margin:0;flex:none;accent-color:var(--vibeui-sheet-009-accent);
}
[data-vibeui-block="sheet-009"] [data-part="option"]:has(input:focus-visible){
outline:2px solid var(--vibeui-sheet-009-accent);outline-offset:2px;
}
[data-vibeui-block="sheet-009"] [data-part="name"]{flex:1;min-width:0}
[data-vibeui-block="sheet-009"] [data-part="count"]{
flex:none;font-size:0.75rem;color:var(--vibeui-sheet-009-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sheet-009"] [data-part="foot"]{
padding:0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-sheet-009-border);
background:var(--vibeui-sheet-009-head);
}
/* Счётчик найденного живёт в самой кнопке: он отвечает на вопрос «что будет,
   если нажать», ровно там, где нажимают. */
[data-vibeui-block="sheet-009"] [data-part="apply"]{
appearance:none;cursor:pointer;width:100%;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.375rem 0.875rem;border:0;border-radius:0.625rem;
background:var(--vibeui-sheet-009-accent);color:var(--vibeui-sheet-009-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="sheet-009"] [data-part="apply"]:focus-visible,
[data-vibeui-block="sheet-009"] [data-part="reset"]:focus-visible{
outline:2px solid var(--vibeui-sheet-009-accent);outline-offset:2px;
}
/* Немодальный показ: лист остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так его показывают на витрине и в документации. */
[data-vibeui-block="sheet-009"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:28rem;
}
[data-vibeui-block="sheet-009"] dialog:not(:modal){position:absolute;max-height:100%;z-index:1}
[data-vibeui-block="sheet-009"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-009"] dialog{transition:none!important;translate:0 0}
[data-vibeui-block="sheet-009"] *{animation:none!important}
}
`

const DEFAULT_GROUPS: Sheet009Group[] = [
  {
    name: "brand",
    label: "Производитель",
    options: [
      { value: "nord", label: "Норд", count: 48 },
      { value: "vega", label: "Вега", count: 31 },
      { value: "kompas", label: "Компас", count: 12 },
    ],
  },
  {
    name: "status",
    label: "Наличие",
    options: [
      { value: "now", label: "Сегодня на складе", count: 64 },
      { value: "order", label: "Под заказ", count: 27 },
    ],
  },
  {
    name: "extra",
    label: "Дополнительно",
    options: [
      { value: "sale", label: "Со скидкой", count: 18 },
      { value: "new", label: "Новинки", count: 9 },
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
 * Лист фильтров: счётчик найденного в кнопке, сброс в шапке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet009({
  triggerLabel = "Фильтры",
  title = "Подбор товаров",
  groups = DEFAULT_GROUPS,
  found = 91,
  applyTemplate = "Показать {count}",
  resetLabel = "Сбросить",
  chosenTemplate = "Выбрано: {count}",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Sheet009Props) {
  const sheet = useRef<HTMLDialogElement>(null)
  const [chosen, setChosen] = useState<string[]>(["now"])

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальный лист живёт внутри своего блока и
    // не уводит страницу в верхний слой. Витрине нужен именно такой.
    sheet.current?.show()

    // show() уводит фокус внутрь листа. Для немодального показа это лишнее:
    // страница не должна прыгать к панели просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])

  const toggle = (value: string) =>
    setChosen((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    )

  const palette = {
    ...(accent ? { "--vibeui-sheet-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sheet-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sheet-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sheet"
        data-vibeui-block="sheet-009"
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

        <dialog ref={sheet} aria-label={title}>
          <div data-part="panel">
            <div data-part="head">
              <h2 data-part="title">{title}</h2>
              <span data-part="chosen" aria-live="polite">
                {chosenTemplate.replace("{count}", String(chosen.length))}
              </span>
              <button
                type="button"
                data-part="reset"
                disabled={chosen.length === 0}
                onClick={() => setChosen([])}
              >
                {resetLabel}
              </button>
            </div>

            <div data-part="body">
              {groups.map((group) => (
                <fieldset key={group.name}>
                  <legend>{group.label}</legend>
                  {group.options.map((option) => (
                    <label key={option.value} data-part="option">
                      <input
                        type="checkbox"
                        name={group.name}
                        value={option.value}
                        checked={chosen.includes(option.value)}
                        onChange={() => toggle(option.value)}
                      />
                      <span data-part="name">{option.label}</span>
                      {option.count !== undefined ? (
                        // Число у галочки: пустую ветку выбирать незачем, и
                        // это видно до нажатия.
                        <span data-part="count">{option.count}</span>
                      ) : null}
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>

            <div data-part="foot">
              <button
                type="button"
                data-part="apply"
                onClick={() => sheet.current?.close()}
              >
                {applyTemplate.replace("{count}", String(found))}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
