"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sheet002Group = {
  title: string
  rows: { label: string; hint: string; on?: boolean }[]
}

export type Sheet002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  groups?: Sheet002Group[]
  accent?: string
}

// Идея компонента: лист настроек, который не отрывается от края экрана, а
// висит рядом с ним карточкой с отступом — так видно, что страница под ним
// на месте. Переключатели применяются сразу и кнопки «Сохранить» здесь нет:
// у настроек-тумблеров подтверждение только мешает.
const STYLES = `
:where([data-vibeui-block="sheet-002"]){
--vibeui-sheet-002-bg:oklch(1 0 0);
--vibeui-sheet-002-fg:oklch(0.21 0.014 265);
--vibeui-sheet-002-muted:oklch(0.55 0.014 265);
--vibeui-sheet-002-border:oklch(0.91 0.006 265);
--vibeui-sheet-002-accent:oklch(0.55 0.17 265);
--vibeui-sheet-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sheet-002"]{
display:inline-block;font-family:var(--vibeui-sheet-002-font);color:var(--vibeui-sheet-002-fg);
}
[data-vibeui-block="sheet-002"] [data-part="trigger"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-sheet-002-border);border-radius:0.625rem;
background:var(--vibeui-sheet-002-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-002"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-002-accent);outline-offset:2px}
/* Лист отстоит от края: между ним и окном остаётся полоска страницы. */
[data-vibeui-block="sheet-002"] dialog{
position:fixed;inset:0.625rem 0.625rem 0.625rem auto;margin:0;
width:min(23rem,calc(100vw - 1.25rem));max-width:100vw;
height:auto;max-height:calc(100dvh - 1.25rem);
padding:0;border:0;border-radius:1.125rem;overflow:hidden;
background:var(--vibeui-sheet-002-bg);color:inherit;
box-shadow:0 30px 70px -35px oklch(0.2 0.02 265 / 65%);
translate:calc(100% + 0.625rem) 0;
transition:translate .24s ease,overlay .24s allow-discrete,display .24s allow-discrete;
}
[data-vibeui-block="sheet-002"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-002"] dialog[open]{translate:calc(100% + 0.625rem) 0}
}
[data-vibeui-block="sheet-002"] dialog::backdrop{background:oklch(0.19 0.02 265 / 40%)}
[data-vibeui-block="sheet-002"] [data-part="panel"]{display:flex;flex-direction:column;max-height:calc(100dvh - 1.25rem)}
[data-vibeui-block="sheet-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.875rem 1rem 0.75rem;border-bottom:1px solid var(--vibeui-sheet-002-border);
}
[data-vibeui-block="sheet-002"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680}
[data-vibeui-block="sheet-002"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;color:var(--vibeui-sheet-002-muted);
}
[data-vibeui-block="sheet-002"] [data-part="close"]:hover{background:oklch(0.96 0.004 265);color:var(--vibeui-sheet-002-fg)}
[data-vibeui-block="sheet-002"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-sheet-002-accent);outline-offset:2px}
[data-vibeui-block="sheet-002"] [data-part="cross"]{position:relative;width:0.625rem;height:0.625rem}
[data-vibeui-block="sheet-002"] [data-part="cross"]::before,
[data-vibeui-block="sheet-002"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="sheet-002"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="sheet-002"] [data-part="cross"]::after{transform:rotate(-45deg)}
[data-vibeui-block="sheet-002"] [data-part="body"]{flex:1;min-height:0;overflow-y:auto;padding:0.25rem 1rem 1rem}
[data-vibeui-block="sheet-002"] [data-part="group"]{
margin:0.875rem 0 0.375rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-sheet-002-muted);
}
[data-vibeui-block="sheet-002"] [data-part="row"]{
display:flex;align-items:flex-start;gap:0.75rem;cursor:pointer;
padding:0.625rem 0;border-bottom:1px solid var(--vibeui-sheet-002-border);
}
[data-vibeui-block="sheet-002"] [data-part="row"]:last-child{border-bottom:0}
[data-vibeui-block="sheet-002"] [data-part="labels"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="sheet-002"] [data-part="label"]{font-size:0.875rem;font-weight:600}
[data-vibeui-block="sheet-002"] [data-part="hint"]{font-size:0.75rem;line-height:1.35;color:var(--vibeui-sheet-002-muted)}
/* Тумблер целиком на checkbox: состояние читается скринридером само. */
[data-vibeui-block="sheet-002"] [data-part="row"] input{
appearance:none;flex:none;margin:0.125rem 0 0 auto;position:relative;cursor:pointer;
width:2.25rem;height:1.3125rem;border-radius:9999px;
background:var(--vibeui-sheet-002-border);
transition:background-color .16s ease;
}
[data-vibeui-block="sheet-002"] [data-part="row"] input::after{
content:"";position:absolute;top:0.1875rem;left:0.1875rem;
width:0.9375rem;height:0.9375rem;border-radius:9999px;background:oklch(1 0 0);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 35%);
transition:translate .16s ease;
}
[data-vibeui-block="sheet-002"] [data-part="row"] input:checked{background:var(--vibeui-sheet-002-accent)}
[data-vibeui-block="sheet-002"] [data-part="row"] input:checked::after{translate:0.9375rem 0}
[data-vibeui-block="sheet-002"] [data-part="row"] input:focus-visible{outline:2px solid var(--vibeui-sheet-002-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-002"] *{animation:none!important;transition:none!important}
[data-vibeui-block="sheet-002"] dialog{translate:0 0}
}
`

const DEFAULT_GROUPS: Sheet002Group[] = [
  {
    title: "Уведомления",
    rows: [
      {
        label: "Сборка завершилась",
        hint: "Письмо после каждой публикации",
        on: true,
      },
      { label: "Ошибка сборки", hint: "Придёт даже ночью", on: true },
      { label: "Дайджест за неделю", hint: "По понедельникам" },
    ],
  },
  {
    title: "Каталог",
    rows: [
      { label: "Плотный список", hint: "Больше строк на экране" },
      {
        label: "Показывать черновики",
        hint: "Видно только вам и команде",
        on: true,
      },
    ],
  },
]

/**
 * Лист настроек справа: тумблеры применяются сразу, кнопки сохранения нет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet002({
  triggerLabel = "Настройки",
  title = "Настройки",
  groups = DEFAULT_GROUPS,
  accent,
  className,
  style,
  ...props
}: Sheet002Props) {
  const sheet = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-sheet-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sheet-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sheet-002"
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
            <div data-part="head">
              <h2 data-part="title">{title}</h2>
              <button
                type="button"
                data-part="close"
                aria-label="Закрыть настройки"
                onClick={() => sheet.current?.close()}
              >
                <span data-part="cross" aria-hidden="true" />
              </button>
            </div>
            <div data-part="body">
              {groups.map((group) => (
                <section key={group.title}>
                  <h3 data-part="group">{group.title}</h3>
                  {group.rows.map((row) => (
                    <label key={row.label} data-part="row">
                      <span data-part="labels">
                        <span data-part="label">{row.label}</span>
                        <span data-part="hint">{row.hint}</span>
                      </span>
                      <input
                        type="checkbox"
                        role="switch"
                        defaultChecked={row.on ?? false}
                      />
                    </label>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
