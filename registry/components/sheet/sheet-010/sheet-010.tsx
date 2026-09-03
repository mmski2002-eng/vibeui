"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Sheet010Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  triggerLabel?: string
  title?: string
  subtitle?: string
  /** Короткая часть: видна на первой остановке. */
  summary?: string
  /** Остальное: доступно после разворота. */
  details?: string[]
  expandLabel?: string
  collapseLabel?: string
  closeLabel?: string
  /** Развернуть лист сразу на полную высоту. */
  fullByDefault?: boolean
  /** Открыть лист сразу и без модального режима: он остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: лист с двумя остановками. Первая показывает главное и
// оставляет страницу видимой, вторая разворачивает лист во весь экран для
// подробностей. Обычно такое делают перетаскиванием, и тогда управление
// существует только для указателя. Здесь остановку переключает ручка-кнопка:
// то же движение доступно с клавиатуры, читается скринридером и не требует
// обработчиков указателя. Высота меняется переменной, а не пересозданием
// разметки, поэтому прокрутка внутри листа не сбрасывается.
const STYLES = `
:where([data-vibeui-block="sheet-010"]){
--vibeui-sheet-010-bg:light-dark(oklch(0.99 0.002 265),oklch(0.22 0.014 265));
--vibeui-sheet-010-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-sheet-010-muted:color-mix(in oklab,var(--vibeui-sheet-010-fg) 62%,transparent);
--vibeui-sheet-010-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 13%));
--vibeui-sheet-010-grab:light-dark(oklch(0 0 0 / 18%),oklch(1 0 0 / 26%));
--vibeui-sheet-010-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-sheet-010-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-sheet-010-scrim:light-dark(oklch(0.2 0.02 265 / 42%),oklch(0 0 0 / 62%));
--vibeui-sheet-010-shadow:light-dark(oklch(0.2 0.02 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-sheet-010-stop:14rem;
--vibeui-sheet-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sheet-010"]{color-scheme:dark}
[data-vibeui-block="sheet-010"]{
display:inline-block;font-family:var(--vibeui-sheet-010-font);color:var(--vibeui-sheet-010-fg);
}
[data-vibeui-block="sheet-010"] *{box-sizing:border-box}
[data-vibeui-block="sheet-010"] [data-part="trigger"]{
appearance:none;cursor:pointer;
min-height:2.25rem;padding:0.375rem 0.875rem;
border:1px solid var(--vibeui-sheet-010-border);border-radius:0.625rem;
background:var(--vibeui-sheet-010-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-010"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-010-accent);outline-offset:2px}
/* Высота — переменная: остановка меняется одним значением, а не заменой
   разметки, поэтому прокрутка внутри листа переживает переключение. */
[data-vibeui-block="sheet-010"] dialog{
position:fixed;inset:auto 0 0 0;
width:100%;max-width:100vw;height:var(--vibeui-sheet-010-stop);max-height:92dvh;
margin:0;padding:0;border:0;
border-radius:1.125rem 1.125rem 0 0;
background:var(--vibeui-sheet-010-bg);color:var(--vibeui-sheet-010-fg);
box-shadow:0 -24px 60px -30px var(--vibeui-sheet-010-shadow);
translate:0 100%;
transition:translate .22s ease,height .24s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="sheet-010"] dialog[open]{translate:0 0}
[data-vibeui-block="sheet-010"][data-full="true"] dialog{--vibeui-sheet-010-stop:26rem}
@starting-style{
[data-vibeui-block="sheet-010"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="sheet-010"] dialog::backdrop{background:var(--vibeui-sheet-010-scrim)}
[data-vibeui-block="sheet-010"] [data-part="panel"]{display:flex;flex-direction:column;height:100%}
/* Ручка — настоящая кнопка: то же движение доступно с клавиатуры, а не
   только пальцем по экрану. */
[data-vibeui-block="sheet-010"] [data-part="grabber"]{
appearance:none;border:0;cursor:pointer;background:transparent;
align-self:stretch;display:flex;align-items:center;justify-content:center;
padding:0.5rem 0;
}
[data-vibeui-block="sheet-010"] [data-part="grabber"]::before{
content:"";width:2.5rem;height:0.25rem;border-radius:999px;
background:var(--vibeui-sheet-010-grab);
transition:background-color .16s ease;
}
[data-vibeui-block="sheet-010"] [data-part="grabber"]:hover::before{background:var(--vibeui-sheet-010-accent)}
[data-vibeui-block="sheet-010"] [data-part="grabber"]:focus-visible{outline:2px solid var(--vibeui-sheet-010-accent);outline-offset:-2px;border-radius:0.75rem}
[data-vibeui-block="sheet-010"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;
padding:0 1rem 0.625rem;
}
[data-vibeui-block="sheet-010"] [data-part="title"]{margin:0;font-size:1rem;font-weight:650}
[data-vibeui-block="sheet-010"] [data-part="subtitle"]{
margin:0.125rem 0 0;font-size:0.8125rem;color:var(--vibeui-sheet-010-muted);
}
[data-vibeui-block="sheet-010"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;
background:transparent;color:var(--vibeui-sheet-010-muted);
}
[data-vibeui-block="sheet-010"] [data-part="close"]:hover{background:var(--vibeui-sheet-010-hover);color:var(--vibeui-sheet-010-fg)}
[data-vibeui-block="sheet-010"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-sheet-010-accent);outline-offset:2px}
[data-vibeui-block="sheet-010"] [data-part="body"]{
flex:1;min-height:0;overflow-y:auto;
padding:0 1rem calc(0.875rem + env(safe-area-inset-bottom,0px));
scrollbar-width:thin;scrollbar-color:var(--vibeui-sheet-010-border) transparent;
}
[data-vibeui-block="sheet-010"] [data-part="summary"]{margin:0;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="sheet-010"] [data-part="details"]{
margin:0.75rem 0 0;padding:0;list-style:none;
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="sheet-010"] [data-part="details"] li{
padding:0.5rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-sheet-010-border);
font-size:0.8125rem;line-height:1.45;color:var(--vibeui-sheet-010-muted);
}
/* Немодальный показ: лист остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так его показывают на витрине и в документации. */
[data-vibeui-block="sheet-010"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:26rem;
}
[data-vibeui-block="sheet-010"] dialog:not(:modal){position:absolute;max-height:100%;z-index:1}
[data-vibeui-block="sheet-010"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-010"] dialog{transition:none!important;translate:0 0}
[data-vibeui-block="sheet-010"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_DETAILS = [
  "Курьер приедет в интервале с 14:00 до 18:00 — точное время придёт утром.",
  "Оплата картой при получении. Наличные курьер не принимает.",
  "Перенести доставку можно до 23:00 накануне, дальше заказ уходит на склад.",
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
 * Лист с двумя остановками: ручка-кнопка разворачивает его на полную высоту.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet010({
  triggerLabel = "Доставка",
  title = "Доставка завтра",
  subtitle = "Заказ 4821 · Северный порт",
  summary = "Курьер привезёт заказ 12 марта. Адрес и время можно изменить до вечера.",
  details = DEFAULT_DETAILS,
  expandLabel = "Развернуть лист",
  collapseLabel = "Свернуть лист",
  closeLabel = "Закрыть",
  fullByDefault = false,
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Sheet010Props) {
  const sheet = useRef<HTMLDialogElement>(null)
  const [full, setFull] = useState(fullByDefault)

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

  const palette = {
    ...(accent ? { "--vibeui-sheet-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sheet-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sheet-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sheet"
        data-vibeui-block="sheet-010"
        data-full={full}
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
            <button
              type="button"
              data-part="grabber"
              aria-expanded={full}
              aria-label={full ? collapseLabel : expandLabel}
              onClick={() => setFull((value) => !value)}
            />

            <div data-part="head">
              <div>
                <h2 data-part="title">{title}</h2>
                <p data-part="subtitle">{subtitle}</p>
              </div>
              <button
                type="button"
                data-part="close"
                aria-label={closeLabel}
                onClick={() => sheet.current?.close()}
              >
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                  <path
                    d="M2 2l8 8M10 2l-8 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div data-part="body">
              <p data-part="summary">{summary}</p>
              {/* Подробности лежат в разметке всегда: на первой остановке их
                  просто не видно за краем, и прокрутка добирается до них без
                  разворота. */}
              <ul data-part="details">
                {details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
