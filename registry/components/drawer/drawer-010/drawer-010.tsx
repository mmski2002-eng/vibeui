"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Drawer010Option = {
  id: string
  label: string
  /** Вторая строка: чем этот вариант отличается от похожих. */
  note?: string
}

export type Drawer010Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  placeholder?: string
  options?: Drawer010Option[]
  /** Что выбрано при первом показе. */
  defaultValue?: string
  confirmLabel?: string
  /** Подпись счётчика найденного. {count} подставляется. */
  foundTemplate?: string
  emptyText?: string
  closeLabel?: string
  /** Открыть шторку сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: выбор одной записи из длинного списка. Выпадающий список
// на триста строк неработоспособен: в нём нет поиска, он закрывается от
// случайного движения и не показывает, чем «Иванов И.» отличается от
// «Иванов И.». Здесь выбор переезжает в панель — с полем поиска сверху,
// второй строкой у каждого варианта и подтверждением внизу. Выбранное не
// теряется при наборе: список сужается, но отметка остаётся, потому что
// человек часто ищет второго кандидата, а потом возвращается к первому.
const STYLES = `
:where([data-vibeui-block="drawer-010"]){
--vibeui-drawer-010-bg:light-dark(oklch(0.99 0 265),oklch(0.22 0 265));
--vibeui-drawer-010-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-drawer-010-muted:color-mix(in oklab,var(--vibeui-drawer-010-fg) 62%,transparent);
--vibeui-drawer-010-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 13%));
--vibeui-drawer-010-field:light-dark(oklch(1 0 0),oklch(1 0 0 / 6%));
--vibeui-drawer-010-head:light-dark(oklch(0 0 0 / 3%),oklch(1 0 0 / 4%));
--vibeui-drawer-010-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-drawer-010-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-drawer-010-on-accent:oklch(from var(--vibeui-drawer-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-drawer-010-chosen:color-mix(in oklab,var(--vibeui-drawer-010-accent) 14%,transparent);
--vibeui-drawer-010-scrim:light-dark(oklch(0.2 0 265 / 42%),oklch(0 0 0 / 62%));
--vibeui-drawer-010-shadow:light-dark(oklch(0.2 0 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-drawer-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="drawer-010"]{color-scheme:dark}
[data-vibeui-block="drawer-010"]{
display:inline-block;font-family:var(--vibeui-drawer-010-font);color:var(--vibeui-drawer-010-fg);
}
[data-vibeui-block="drawer-010"] *{box-sizing:border-box}
[data-vibeui-block="drawer-010"] [data-part="trigger"]{
appearance:none;cursor:pointer;
min-height:2.25rem;padding:0.375rem 0.875rem;
border:1px solid var(--vibeui-drawer-010-border);border-radius:0.625rem;
background:var(--vibeui-drawer-010-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-010"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-010-accent);outline-offset:2px}
[data-vibeui-block="drawer-010"] dialog{
position:fixed;inset:0 0 0 auto;
width:min(24rem,100vw);max-width:100vw;height:100%;
margin:0;padding:0;border:0;
background:var(--vibeui-drawer-010-bg);color:var(--vibeui-drawer-010-fg);
box-shadow:-24px 0 60px -30px var(--vibeui-drawer-010-shadow);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-010"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-010"] dialog[open]{translate:100% 0}
}
[data-vibeui-block="drawer-010"] dialog::backdrop{background:var(--vibeui-drawer-010-scrim)}
[data-vibeui-block="drawer-010"] [data-part="panel"]{display:flex;flex-direction:column;height:100%}
[data-vibeui-block="drawer-010"] [data-part="head"]{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.875rem 1rem;
background:var(--vibeui-drawer-010-head);
border-bottom:1px solid var(--vibeui-drawer-010-border);
}
[data-vibeui-block="drawer-010"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="drawer-010"] [data-part="title"]{margin:0;font-size:1rem;font-weight:650}
[data-vibeui-block="drawer-010"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;
background:transparent;color:var(--vibeui-drawer-010-muted);font:inherit;
}
[data-vibeui-block="drawer-010"] [data-part="close"]:hover{background:var(--vibeui-drawer-010-hover);color:var(--vibeui-drawer-010-fg)}
[data-vibeui-block="drawer-010"] input[type="search"]{
width:100%;min-height:2.25rem;padding:0.375rem 0.625rem;
border:1px solid var(--vibeui-drawer-010-border);border-radius:0.5rem;
background:var(--vibeui-drawer-010-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="drawer-010"] input[type="search"]:focus-visible{
outline:2px solid var(--vibeui-drawer-010-accent);outline-offset:1px;
border-color:var(--vibeui-drawer-010-accent);
}
[data-vibeui-block="drawer-010"] [data-part="found"]{
margin:0;font-size:0.75rem;color:var(--vibeui-drawer-010-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="drawer-010"] [data-part="list"]{
flex:1;min-height:0;overflow-y:auto;margin:0;padding:0.375rem;list-style:none;
scrollbar-width:thin;scrollbar-color:var(--vibeui-drawer-010-border) transparent;
}
[data-vibeui-block="drawer-010"] [data-part="option"]{
display:flex;align-items:flex-start;gap:0.625rem;cursor:pointer;
padding:0.5rem 0.625rem;border-radius:0.625rem;
}
[data-vibeui-block="drawer-010"] [data-part="option"]:hover{background:var(--vibeui-drawer-010-hover)}
[data-vibeui-block="drawer-010"] [data-part="option"]:has(input:focus-visible){
outline:2px solid var(--vibeui-drawer-010-accent);outline-offset:1px;
}
/* Отметка не теряется при наборе: список сужается, а выбранное остаётся —
   человек часто смотрит второго кандидата и возвращается к первому. */
[data-vibeui-block="drawer-010"] [data-part="option"]:has(input:checked){
background:var(--vibeui-drawer-010-chosen);
}
[data-vibeui-block="drawer-010"] [data-part="option"] input{
margin:0.1875rem 0 0;width:0.9375rem;height:0.9375rem;flex:none;
accent-color:var(--vibeui-drawer-010-accent);
}
[data-vibeui-block="drawer-010"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="drawer-010"] [data-part="label"]{font-size:0.875rem;font-weight:600}
[data-vibeui-block="drawer-010"] [data-part="note"]{
font-size:0.75rem;color:var(--vibeui-drawer-010-muted);overflow-wrap:anywhere;
}
[data-vibeui-block="drawer-010"] [data-part="empty"]{
margin:0;padding:0.75rem 0.625rem;font-size:0.8125rem;color:var(--vibeui-drawer-010-muted);
}
[data-vibeui-block="drawer-010"] [data-part="foot"]{
padding:0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-drawer-010-border);
background:var(--vibeui-drawer-010-head);
}
[data-vibeui-block="drawer-010"] [data-part="confirm"]{
appearance:none;border:0;cursor:pointer;width:100%;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.375rem;padding:0.375rem 0.875rem;border-radius:0.625rem;
background:var(--vibeui-drawer-010-accent);color:var(--vibeui-drawer-010-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="drawer-010"] [data-part="confirm"]:disabled{opacity:.55;cursor:default}
[data-vibeui-block="drawer-010"] [data-part="confirm"]:focus-visible{outline:2px solid var(--vibeui-drawer-010-accent);outline-offset:2px}
/* Немодальный показ: шторка остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="drawer-010"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="drawer-010"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="drawer-010"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-010"] dialog{transition:none!important;translate:0 0}
[data-vibeui-block="drawer-010"] *{animation:none!important}
}
`

const DEFAULT_OPTIONS: Drawer010Option[] = [
  { id: "nord", label: "ООО «Северный порт»", note: "ИНН 7801234567 · Санкт-Петербург" },
  { id: "vega", label: "ИП Вегин А. С.", note: "ИНН 780987654321 · Москва" },
  { id: "kompas", label: "ООО «Компас»", note: "ИНН 7709876543 · Москва" },
  { id: "delta", label: "ООО «Дельта Плюс»", note: "ИНН 7723456789 · Казань" },
  { id: "orion", label: "ООО «Орион»", note: "ИНН 7812345678 · Пермь" },
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
 * Шторка выбора из списка: поиск сверху, вторая строка у варианта, подтверждение внизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer010({
  triggerLabel = "Выбрать контрагента",
  title = "Контрагент",
  placeholder = "Название или ИНН",
  options = DEFAULT_OPTIONS,
  defaultValue = "vega",
  confirmLabel = "Выбрать",
  foundTemplate = "Найдено: {count}",
  emptyText = "Ничего не нашлось. Проверьте написание или очистите поиск.",
  closeLabel = "Закрыть",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Drawer010Props) {
  const id = useId().replace(/:/g, "")
  const panel = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState("")
  const [chosen, setChosen] = useState(defaultValue)

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
    ...(accent ? { "--vibeui-drawer-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const needle = query.trim().toLowerCase()
  const found = options.filter(
    (option) =>
      needle === "" ||
      option.label.toLowerCase().includes(needle) ||
      (option.note ?? "").toLowerCase().includes(needle),
  )

  return (
    <>
      <style href="vibeui-drawer-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="drawer"
        data-vibeui-block="drawer-010"
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
              <div data-part="row">
                <h2 data-part="title">{title}</h2>
                <button
                  type="button"
                  data-part="close"
                  aria-label={closeLabel}
                  onClick={() => panel.current?.close()}
                >
                  ×
                </button>
              </div>

              <input
                type="search"
                value={query}
                placeholder={placeholder}
                aria-label={placeholder}
                onChange={(event) => setQuery(event.target.value)}
              />

              <p data-part="found" aria-live="polite">
                {foundTemplate.replace("{count}", String(found.length))}
              </p>
            </div>

            <ul data-part="list">
              {found.length === 0 ? (
                <li data-part="empty">{emptyText}</li>
              ) : (
                found.map((option) => (
                  <li key={option.id}>
                    <label data-part="option">
                      <input
                        type="radio"
                        name={`${id}-choice`}
                        checked={chosen === option.id}
                        onChange={() => setChosen(option.id)}
                      />
                      <span data-part="text">
                        <span data-part="label">{option.label}</span>
                        {option.note ? (
                          // Вторая строка отличает похожие записи: «Иванов И.»
                          // и «Иванов И.» без неё выбирают наугад.
                          <span data-part="note">{option.note}</span>
                        ) : null}
                      </span>
                    </label>
                  </li>
                ))
              )}
            </ul>

            <div data-part="foot">
              <button
                type="button"
                data-part="confirm"
                disabled={chosen === ""}
                onClick={() => panel.current?.close()}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
