"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sheet004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  fileName?: string
  fileKind?: string
  facts?: { label: string; value: string }[]
  downloadLabel?: string
  accent?: string
}

// Идея компонента: лист предпросмотра файла. Главное здесь — большая область
// самого файла, а не список свойств: сначала человек узнаёт документ глазами
// и только потом читает размер и дату. Область предпросмотра нарисована
// градиентом с расширением файла, поэтому компонент не тащит картинок.
const STYLES = `
:where([data-vibeui-block="sheet-004"]){
--vibeui-sheet-004-bg:oklch(1 0 0);
--vibeui-sheet-004-fg:oklch(0.21 0.014 265);
--vibeui-sheet-004-muted:oklch(0.55 0.014 265);
--vibeui-sheet-004-border:oklch(0.91 0.006 265);
--vibeui-sheet-004-accent:oklch(0.55 0.17 265);
--vibeui-sheet-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sheet-004"]{
display:inline-block;font-family:var(--vibeui-sheet-004-font);color:var(--vibeui-sheet-004-fg);
}
[data-vibeui-block="sheet-004"] [data-part="trigger"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-sheet-004-border);border-radius:0.625rem;
background:var(--vibeui-sheet-004-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-004"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-004-accent);outline-offset:2px}
[data-vibeui-block="sheet-004"] dialog{
position:fixed;inset:auto 0 0 0;margin:0;
width:100%;max-width:100vw;max-height:92dvh;
padding:0;border:0;border-radius:1.25rem 1.25rem 0 0;overflow:hidden;
background:var(--vibeui-sheet-004-bg);color:inherit;
box-shadow:0 -26px 60px -32px oklch(0.2 0.02 265 / 60%);
translate:0 100%;transition:translate .24s ease,overlay .24s allow-discrete,display .24s allow-discrete;
}
[data-vibeui-block="sheet-004"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-004"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="sheet-004"] dialog::backdrop{background:oklch(0.16 0.02 265 / 60%)}
[data-vibeui-block="sheet-004"] [data-part="panel"]{display:flex;flex-direction:column;max-height:92dvh}
[data-vibeui-block="sheet-004"] [data-part="grabber"]{
align-self:center;width:2.5rem;height:0.25rem;margin:0.5rem 0 0.375rem;
border-radius:9999px;background:var(--vibeui-sheet-004-border);flex:none;
}
/* Предпросмотр — самая крупная часть листа: файл узнают по нему. */
[data-vibeui-block="sheet-004"] [data-part="canvas"]{
display:flex;align-items:center;justify-content:center;
margin:0 0.75rem;height:11rem;border-radius:1rem;
background:
radial-gradient(120% 90% at 25% 15%,color-mix(in oklab,var(--vibeui-sheet-004-accent) 30%,transparent),transparent 60%),
linear-gradient(160deg,oklch(0.97 0.006 265),oklch(0.93 0.01 265));
border:1px solid var(--vibeui-sheet-004-border);
}
[data-vibeui-block="sheet-004"] [data-part="chip"]{
padding:0.375rem 0.75rem;border-radius:0.625rem;
background:oklch(1 0 0 / 78%);color:var(--vibeui-sheet-004-fg);
font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="sheet-004"] [data-part="body"]{flex:1;min-height:0;overflow-y:auto;padding:0.875rem 1rem 0}
[data-vibeui-block="sheet-004"] [data-part="name"]{
margin:0;font-size:1rem;font-weight:680;line-height:1.3;overflow-wrap:anywhere;
}
[data-vibeui-block="sheet-004"] [data-part="kind"]{margin:0.1875rem 0 0.75rem;font-size:0.8125rem;color:var(--vibeui-sheet-004-muted)}
[data-vibeui-block="sheet-004"] dl{
display:grid;grid-template-columns:repeat(auto-fit,minmax(7rem,1fr));gap:0.625rem;margin:0;
}
[data-vibeui-block="sheet-004"] [data-part="fact"]{
display:flex;flex-direction:column;gap:0.125rem;
padding:0.5rem 0.625rem;border:1px solid var(--vibeui-sheet-004-border);border-radius:0.75rem;
}
[data-vibeui-block="sheet-004"] dt{font-size:0.6875rem;color:var(--vibeui-sheet-004-muted)}
[data-vibeui-block="sheet-004"] dd{margin:0;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="sheet-004"] [data-part="foot"]{
display:flex;gap:0.5rem;padding:0.875rem 1rem calc(0.875rem + env(safe-area-inset-bottom,0px));
}
[data-vibeui-block="sheet-004"] [data-part="foot"] button{
appearance:none;cursor:pointer;height:2.75rem;border-radius:0.75rem;padding:0 1rem;
border:1px solid var(--vibeui-sheet-004-border);background:transparent;color:inherit;
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="sheet-004"] [data-part="foot"] button[data-primary="true"]{
flex:1;border-color:transparent;background:var(--vibeui-sheet-004-accent);color:oklch(0.99 0.01 265);
}
[data-vibeui-block="sheet-004"] [data-part="foot"] button:focus-visible{outline:2px solid var(--vibeui-sheet-004-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-004"] *{animation:none!important;transition:none!important}
[data-vibeui-block="sheet-004"] dialog{translate:0 0}
}
`

const DEFAULT_FACTS = [
  { label: "Размер", value: "3,8 МБ" },
  { label: "Страниц", value: "24" },
  { label: "Изменён", value: "12 марта" },
  { label: "Автор", value: "А. Ковалёва" },
]

function extension(name: string) {
  const parts = name.split(".")
  return parts.length > 1 ? parts[parts.length - 1] : "файл"
}

/**
 * Лист предпросмотра файла: крупная область файла, факты и скачивание.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet004({
  triggerLabel = "Открыть файл",
  fileName = "Договор-подряда-2024.pdf",
  fileKind = "Документ PDF · загружен 12 марта",
  facts = DEFAULT_FACTS,
  downloadLabel = "Скачать",
  accent,
  className,
  style,
  ...props
}: Sheet004Props) {
  const sheet = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-sheet-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sheet-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sheet-004"
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
          aria-label={fileName}
          onClick={(event) => {
            if (event.target === sheet.current) {
              sheet.current.close()
            }
          }}
        >
          <div data-part="panel">
            <span data-part="grabber" aria-hidden="true" />
            <div data-part="canvas" aria-hidden="true">
              <span data-part="chip">{extension(fileName)}</span>
            </div>
            <div data-part="body">
              <h2 data-part="name">{fileName}</h2>
              <p data-part="kind">{fileKind}</p>
              <dl>
                {facts.map((fact) => (
                  <div key={fact.label} data-part="fact">
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div data-part="foot">
              <button type="button" onClick={() => sheet.current?.close()}>
                Закрыть
              </button>
              <button type="button" data-primary="true">
                {downloadLabel}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
