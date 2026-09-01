"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sheet005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  options?: string[]
  searchLabel?: string
  confirmLabel?: string
  accent?: string
}

// Идея компонента: лист выбора из длинного списка. Выпадающий список на
// сотню строк на телефоне неработоспособен, поэтому выбор переезжает в лист
// с полем поиска: строка сужает список, выбранное остаётся видимым, а
// подтверждение стоит внизу и не уезжает вместе с прокруткой.
const STYLES = `
:where([data-vibeui-block="sheet-005"]){
--vibeui-sheet-005-bg:oklch(1 0 0);
--vibeui-sheet-005-fg:oklch(0.21 0.014 265);
--vibeui-sheet-005-muted:oklch(0.55 0.014 265);
--vibeui-sheet-005-border:oklch(0.91 0.006 265);
--vibeui-sheet-005-field:oklch(0.97 0.004 265);
--vibeui-sheet-005-accent:oklch(0.55 0.17 265);
--vibeui-sheet-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sheet-005"]{
display:inline-block;font-family:var(--vibeui-sheet-005-font);color:var(--vibeui-sheet-005-fg);
}
[data-vibeui-block="sheet-005"] [data-part="trigger"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-sheet-005-border);border-radius:0.625rem;
background:var(--vibeui-sheet-005-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-005"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-005-accent);outline-offset:2px}
[data-vibeui-block="sheet-005"] dialog{
position:fixed;inset:auto 0 0 0;margin:0;
width:100%;max-width:100vw;height:min(32rem,90dvh);
padding:0;border:0;border-radius:1.25rem 1.25rem 0 0;overflow:hidden;
background:var(--vibeui-sheet-005-bg);color:inherit;
box-shadow:0 -26px 60px -32px oklch(0.2 0.02 265 / 60%);
translate:0 100%;transition:translate .24s ease,overlay .24s allow-discrete,display .24s allow-discrete;
}
[data-vibeui-block="sheet-005"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-005"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="sheet-005"] dialog::backdrop{background:oklch(0.19 0.02 265 / 45%)}
[data-vibeui-block="sheet-005"] [data-part="panel"]{display:flex;flex-direction:column;height:100%;box-sizing:border-box}
[data-vibeui-block="sheet-005"] [data-part="grabber"]{
align-self:center;width:2.5rem;height:0.25rem;margin:0.5rem 0 0.25rem;
border-radius:9999px;background:var(--vibeui-sheet-005-border);flex:none;
}
[data-vibeui-block="sheet-005"] [data-part="title"]{margin:0;padding:0.25rem 1rem 0.5rem;font-size:1rem;font-weight:680}
/* Поле поиска — часть шапки: список под ним прокручивается, оно нет. */
[data-vibeui-block="sheet-005"] [data-part="search"]{margin:0 1rem 0.625rem}
[data-vibeui-block="sheet-005"] [data-part="search"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid transparent;border-radius:0.75rem;
background:var(--vibeui-sheet-005-field);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="sheet-005"] [data-part="search"] input:focus-visible{outline:2px solid var(--vibeui-sheet-005-accent);outline-offset:1px}
[data-vibeui-block="sheet-005"] [data-part="list"]{
flex:1;min-height:0;overflow-y:auto;margin:0;padding:0 1rem;border:0;
}
[data-vibeui-block="sheet-005"] [data-part="option"]{
display:flex;align-items:center;gap:0.75rem;cursor:pointer;
padding:0.6875rem 0;border-bottom:1px solid var(--vibeui-sheet-005-border);
font-size:0.9375rem;
}
[data-vibeui-block="sheet-005"] [data-part="option"] input{
appearance:none;flex:none;width:1.125rem;height:1.125rem;margin:0;
border:1.5px solid var(--vibeui-sheet-005-border);border-radius:9999px;cursor:pointer;position:relative;
}
[data-vibeui-block="sheet-005"] [data-part="option"] input:checked{border-color:var(--vibeui-sheet-005-accent)}
[data-vibeui-block="sheet-005"] [data-part="option"] input:checked::after{
content:"";position:absolute;inset:0.1875rem;border-radius:9999px;background:var(--vibeui-sheet-005-accent);
}
[data-vibeui-block="sheet-005"] [data-part="option"] input:focus-visible{outline:2px solid var(--vibeui-sheet-005-accent);outline-offset:2px}
[data-vibeui-block="sheet-005"] [data-part="empty"]{padding:1.25rem 0;font-size:0.875rem;color:var(--vibeui-sheet-005-muted)}
[data-vibeui-block="sheet-005"] [data-part="foot"]{
padding:0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-sheet-005-border);background:var(--vibeui-sheet-005-bg);
}
[data-vibeui-block="sheet-005"] [data-part="confirm"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.75rem;border-radius:0.75rem;
background:var(--vibeui-sheet-005-accent);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="sheet-005"] [data-part="confirm"]:focus-visible{outline:2px solid var(--vibeui-sheet-005-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-005"] *{animation:none!important;transition:none!important}
[data-vibeui-block="sheet-005"] dialog{translate:0 0}
}
`

const DEFAULT_OPTIONS = [
  "Алтайский край",
  "Архангельская область",
  "Владимирская область",
  "Вологодская область",
  "Иркутская область",
  "Калининградская область",
  "Краснодарский край",
  "Ленинградская область",
  "Московская область",
  "Нижегородская область",
  "Новосибирская область",
  "Приморский край",
  "Ростовская область",
  "Свердловская область",
  "Томская область",
]

/**
 * Лист выбора из длинного списка: поиск сверху, подтверждение внизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet005({
  triggerLabel = "Выбрать регион",
  title = "Регион доставки",
  options = DEFAULT_OPTIONS,
  searchLabel = "Найти регион",
  confirmLabel = "Выбрать",
  accent,
  className,
  style,
  ...props
}: Sheet005Props) {
  const sheet = useRef<HTMLDialogElement>(null)
  const group = useId()
  const [query, setQuery] = useState("")
  const [picked, setPicked] = useState(options[0])

  const palette = {
    ...(accent ? { "--vibeui-sheet-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  const found = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <>
      <style href="vibeui-sheet-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sheet-005"
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
            <div data-part="search">
              <input
                type="search"
                value={query}
                aria-label={searchLabel}
                placeholder={searchLabel}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <fieldset data-part="list">
              <legend hidden>{title}</legend>
              {found.map((option) => (
                <label key={option} data-part="option">
                  <input
                    type="radio"
                    name={group}
                    checked={picked === option}
                    onChange={() => setPicked(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
              {found.length === 0 ? (
                <p data-part="empty">Ничего не нашлось. Уточните запрос.</p>
              ) : null}
            </fieldset>
            <div data-part="foot">
              <button
                type="button"
                data-part="confirm"
                onClick={() => sheet.current?.close()}
              >
                {confirmLabel}: {picked}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
