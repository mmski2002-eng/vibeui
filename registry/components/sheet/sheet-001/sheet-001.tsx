"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sheet001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  rows?: { label: string; value: string }[]
  primaryLabel?: string
  /** Подпись отказа: компонент несёт русскую, проект подставляет свою. */
  closeLabel?: string
  accent?: string
  /** Подложка листа и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: лист, выезжающий снизу, на нативном dialog. Он занимает
// не весь экран: за верхним краем видно страницу, и это единственное, что
// отличает лист от полноэкранного окна. Ручка сверху — не декор: за неё
// тянут, и она обещает, что лист можно закрыть жестом.
//
// Тема берётся из color-scheme окружения через light-dark(): лист темнеет
// там, где тёмный контекст, и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="sheet-001"]){
--vibeui-sheet-001-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-sheet-001-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-sheet-001-muted:light-dark(oklch(0.56 0.014 265),oklch(0.71 0.012 265));
--vibeui-sheet-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-sheet-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.16 265));
--vibeui-sheet-001-on-accent:light-dark(oklch(0.99 0.01 265),oklch(0.17 0.03 265));
--vibeui-sheet-001-shadow:light-dark(oklch(0.2 0.02 265 / 55%),oklch(0.02 0.01 265 / 72%));
--vibeui-sheet-001-scrim:light-dark(oklch(0.2 0.02 265 / 45%),oklch(0.08 0.014 265 / 62%));
--vibeui-sheet-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sheet-001"]{
display:inline-block;font-family:var(--vibeui-sheet-001-font);color:var(--vibeui-sheet-001-fg);
}
[data-vibeui-block="sheet-001"] [data-part="trigger"]{
appearance:none;cursor:pointer;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-sheet-001-border);border-radius:0.625rem;
background:var(--vibeui-sheet-001-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-001"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-001-accent);outline-offset:2px}
/* Лист не во весь экран: за верхним краем видно страницу. */
[data-vibeui-block="sheet-001"] dialog{
position:fixed;inset:auto 0 0 0;
width:100%;max-width:100vw;max-height:min(28rem,85dvh);
margin:0;padding:0;border:0;
border-radius:1.125rem 1.125rem 0 0;
background:var(--vibeui-sheet-001-bg);color:var(--vibeui-sheet-001-fg);
box-shadow:0 -24px 60px -30px var(--vibeui-sheet-001-shadow);
translate:0 100%;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="sheet-001"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-001"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="sheet-001"] dialog::backdrop{background:var(--vibeui-sheet-001-scrim)}
[data-vibeui-block="sheet-001"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.625rem;box-sizing:border-box;
padding:0.5rem 1rem calc(1rem + env(safe-area-inset-bottom,0px));
}
/* Ручка обещает жест: без неё лист выглядит окном, приклеенным к низу. */
[data-vibeui-block="sheet-001"] [data-part="grabber"]{
align-self:center;width:2.5rem;height:0.25rem;margin:0.25rem 0 0.375rem;
border-radius:9999px;background:var(--vibeui-sheet-001-border);
}
[data-vibeui-block="sheet-001"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680}
[data-vibeui-block="sheet-001"] dl{
display:grid;grid-template-columns:auto 1fr;gap:0.375rem 0.75rem;margin:0;font-size:0.875rem;
}
[data-vibeui-block="sheet-001"] [data-part="row"]{display:contents}
[data-vibeui-block="sheet-001"] dt{color:var(--vibeui-sheet-001-muted)}
[data-vibeui-block="sheet-001"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="sheet-001"] [data-part="foot"]{display:flex;gap:0.5rem;margin-top:0.25rem}
[data-vibeui-block="sheet-001"] [data-part="foot"] button{
appearance:none;cursor:pointer;flex:1;
height:2.75rem;border-radius:0.75rem;
border:1px solid var(--vibeui-sheet-001-border);
background:transparent;color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="sheet-001"] [data-part="foot"] button[data-primary="true"]{
border-color:transparent;background:var(--vibeui-sheet-001-accent);color:var(--vibeui-sheet-001-on-accent);
}
[data-vibeui-block="sheet-001"] [data-part="foot"] button:focus-visible{outline:2px solid var(--vibeui-sheet-001-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-001"] dialog{transition:none!important;translate:0 0}
}
`

const DEFAULT_ROWS = [
  { label: "Товары", value: "12 480 ₽" },
  { label: "Доставка", value: "390 ₽" },
  { label: "Скидка", value: "−1 200 ₽" },
  { label: "Итого", value: "11 670 ₽" },
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
 * Лист снизу на нативном dialog: ручка, сводка и крупные кнопки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet001({
  triggerLabel = "Показать заказ",
  title = "Ваш заказ",
  rows = DEFAULT_ROWS,
  primaryLabel = "Оформить",
  closeLabel = "Закрыть",
  accent,
  background = "",
  className,
  style,
  ...props
}: Sheet001Props) {
  const sheet = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-sheet-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sheet-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sheet-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sheet-001"
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
            <span data-part="grabber" aria-hidden="true" />
            <h2 data-part="title">{title}</h2>
            <dl>
              {rows.map((row) => (
                <div key={row.label} data-part="row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <div data-part="foot">
              <button type="button" onClick={() => sheet.current?.close()}>
                {closeLabel}
              </button>
              <button
                type="button"
                data-primary="true"
                onClick={() => sheet.current?.close()}
              >
                {primaryLabel}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
