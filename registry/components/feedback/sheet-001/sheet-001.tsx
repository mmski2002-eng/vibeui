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
  accent?: string
}

// Идея компонента: лист, выезжающий снизу, на нативном dialog. Он занимает
// не весь экран: за верхним краем видно страницу, и это единственное, что
// отличает лист от полноэкранного окна. Ручка сверху — не декор: за неё
// тянут, и она обещает, что лист можно закрыть жестом.
const STYLES = `
:where([data-vibeui-block="sheet-001"]){
--vibeui-sheet-001-bg:oklch(1 0 0);
--vibeui-sheet-001-fg:oklch(0.22 0.014 265);
--vibeui-sheet-001-muted:oklch(0.56 0.014 265);
--vibeui-sheet-001-border:oklch(0.9 0.006 265);
--vibeui-sheet-001-accent:oklch(0.55 0.17 265);
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
background:var(--vibeui-sheet-001-bg);color:inherit;
box-shadow:0 -24px 60px -30px oklch(0.2 0.02 265 / 55%);
translate:0 100%;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="sheet-001"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-001"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="sheet-001"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
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
border-color:transparent;background:var(--vibeui-sheet-001-accent);color:oklch(0.99 0.01 265);
}
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
 * Лист снизу на нативном dialog: ручка, сводка и крупные кнопки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet001({
  triggerLabel = "Показать заказ",
  title = "Ваш заказ",
  rows = DEFAULT_ROWS,
  primaryLabel = "Оформить",
  accent,
  className,
  style,
  ...props
}: Sheet001Props) {
  const sheet = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-sheet-001-accent": accent } : null),
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
                Закрыть
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
