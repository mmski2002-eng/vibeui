"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sheet007Section = {
  label: string
  hint: string
  options: string[]
}

export type Sheet007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  sections?: Sheet007Section[]
  accent?: string
}

// Идея компонента: лист с двумя уровнями вместо второго диалога поверх
// первого. Уровни лежат в одной дорожке и сдвигаются вбок, поэтому переход
// читается как «вглубь», а не как новое окно. Кнопка «Назад» возвращает на
// уровень, крестик закрывает лист целиком — это разные операции.
const STYLES = `
:where([data-vibeui-block="sheet-007"]){
--vibeui-sheet-007-bg:oklch(1 0 0);
--vibeui-sheet-007-fg:oklch(0.21 0.014 265);
--vibeui-sheet-007-muted:oklch(0.55 0.014 265);
--vibeui-sheet-007-border:oklch(0.91 0.006 265);
--vibeui-sheet-007-accent:oklch(0.55 0.17 265);
--vibeui-sheet-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sheet-007"]{
display:inline-block;font-family:var(--vibeui-sheet-007-font);color:var(--vibeui-sheet-007-fg);
}
[data-vibeui-block="sheet-007"] [data-part="trigger"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-sheet-007-border);border-radius:0.625rem;
background:var(--vibeui-sheet-007-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-007"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-007-accent);outline-offset:2px}
[data-vibeui-block="sheet-007"] dialog{
position:fixed;inset:auto 0 0 0;margin:0;
width:100%;max-width:100vw;height:min(26rem,82dvh);
padding:0;border:0;border-radius:1.25rem 1.25rem 0 0;overflow:hidden;
background:var(--vibeui-sheet-007-bg);color:inherit;
box-shadow:0 -26px 60px -32px oklch(0.2 0.02 265 / 60%);
translate:0 100%;transition:translate .24s ease,overlay .24s allow-discrete,display .24s allow-discrete;
}
[data-vibeui-block="sheet-007"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-007"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="sheet-007"] dialog::backdrop{background:oklch(0.19 0.02 265 / 45%)}
[data-vibeui-block="sheet-007"] [data-part="panel"]{display:flex;flex-direction:column;height:100%;box-sizing:border-box}
[data-vibeui-block="sheet-007"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;padding:0.75rem 0.75rem 0.625rem;
border-bottom:1px solid var(--vibeui-sheet-007-border);
}
[data-vibeui-block="sheet-007"] [data-part="back"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;color:var(--vibeui-sheet-007-muted);
}
[data-vibeui-block="sheet-007"] [data-part="back"]:hover{background:oklch(0.96 0.004 265);color:var(--vibeui-sheet-007-fg)}
[data-vibeui-block="sheet-007"] [data-part="back"]:focus-visible{outline:2px solid var(--vibeui-sheet-007-accent);outline-offset:2px}
/* Стрелка — половина повёрнутого квадрата: рисуем бордюрами, без иконок. */
[data-vibeui-block="sheet-007"] [data-part="arrow"]{
width:0.5rem;height:0.5rem;margin-left:0.1875rem;
border:solid currentColor;border-width:0 0 1.75px 1.75px;transform:rotate(45deg);
}
[data-vibeui-block="sheet-007"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;flex:1;min-width:0}
[data-vibeui-block="sheet-007"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;color:var(--vibeui-sheet-007-muted);
}
[data-vibeui-block="sheet-007"] [data-part="close"]:hover{background:oklch(0.96 0.004 265);color:var(--vibeui-sheet-007-fg)}
[data-vibeui-block="sheet-007"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-sheet-007-accent);outline-offset:2px}
[data-vibeui-block="sheet-007"] [data-part="cross"]{position:relative;width:0.625rem;height:0.625rem}
[data-vibeui-block="sheet-007"] [data-part="cross"]::before,
[data-vibeui-block="sheet-007"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="sheet-007"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="sheet-007"] [data-part="cross"]::after{transform:rotate(-45deg)}
[data-vibeui-block="sheet-007"] [data-part="viewport"]{flex:1;min-height:0;overflow:hidden}
/* Оба уровня лежат в одной дорожке: переход читается как «вглубь». */
[data-vibeui-block="sheet-007"] [data-part="track"]{
display:flex;width:200%;height:100%;
transition:translate .24s ease;
}
[data-vibeui-block="sheet-007"] [data-part="track"][data-level="1"]{translate:-50% 0}
[data-vibeui-block="sheet-007"] [data-part="level"]{width:50%;height:100%;overflow-y:auto;box-sizing:border-box;padding:0 1rem 1rem}
[data-vibeui-block="sheet-007"] [data-part="rows"]{list-style:none;margin:0;padding:0}
[data-vibeui-block="sheet-007"] [data-part="row"]{
appearance:none;border:0;cursor:pointer;width:100%;
display:flex;align-items:center;gap:0.75rem;
padding:0.75rem 0;border-bottom:1px solid var(--vibeui-sheet-007-border);
background:transparent;color:inherit;font:inherit;text-align:left;
}
[data-vibeui-block="sheet-007"] [data-part="row"]:focus-visible{outline:2px solid var(--vibeui-sheet-007-accent);outline-offset:-2px}
[data-vibeui-block="sheet-007"] [data-part="labels"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="sheet-007"] [data-part="label"]{font-size:0.9375rem;font-weight:600}
[data-vibeui-block="sheet-007"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-sheet-007-muted)}
[data-vibeui-block="sheet-007"] [data-part="chevron"]{
margin-left:auto;flex:none;width:0.5rem;height:0.5rem;
border:solid var(--vibeui-sheet-007-muted);border-width:1.75px 1.75px 0 0;transform:rotate(45deg);
}
[data-vibeui-block="sheet-007"] [data-part="option"]{
display:flex;align-items:center;gap:0.75rem;cursor:pointer;
padding:0.75rem 0;border-bottom:1px solid var(--vibeui-sheet-007-border);font-size:0.9375rem;
}
[data-vibeui-block="sheet-007"] [data-part="option"] input{
appearance:none;flex:none;width:1.125rem;height:1.125rem;margin:0;
border:1.5px solid var(--vibeui-sheet-007-border);border-radius:9999px;cursor:pointer;position:relative;
}
[data-vibeui-block="sheet-007"] [data-part="option"] input:checked{border-color:var(--vibeui-sheet-007-accent)}
[data-vibeui-block="sheet-007"] [data-part="option"] input:checked::after{
content:"";position:absolute;inset:0.1875rem;border-radius:9999px;background:var(--vibeui-sheet-007-accent);
}
[data-vibeui-block="sheet-007"] [data-part="option"] input:focus-visible{outline:2px solid var(--vibeui-sheet-007-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-007"] *{animation:none!important;transition:none!important}
[data-vibeui-block="sheet-007"] dialog{translate:0 0}
}
`

const DEFAULT_SECTIONS: Sheet007Section[] = [
  {
    label: "Язык интерфейса",
    hint: "Русский",
    options: ["Русский", "English", "Қазақша"],
  },
  {
    label: "Тема оформления",
    hint: "Как в системе",
    options: ["Как в системе", "Светлая", "Тёмная"],
  },
  {
    label: "Часовой пояс",
    hint: "Москва, UTC+3",
    options: ["Москва, UTC+3", "Екатеринбург, UTC+5", "Новосибирск, UTC+7"],
  },
]

/**
 * Лист с двумя уровнями: список разделов и раздел с возвратом назад.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet007({
  triggerLabel = "Настройки приложения",
  title = "Настройки",
  sections = DEFAULT_SECTIONS,
  accent,
  className,
  style,
  ...props
}: Sheet007Props) {
  const sheet = useRef<HTMLDialogElement>(null)
  const [openedSection, setOpenedSection] = useState<number | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-sheet-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  const current = openedSection === null ? null : sections[openedSection]

  function open() {
    setOpenedSection(null)
    sheet.current?.showModal()
  }

  return (
    <>
      <style href="vibeui-sheet-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sheet-007"
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" onClick={open}>
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
              {current ? (
                <button
                  type="button"
                  data-part="back"
                  aria-label="Назад к списку настроек"
                  onClick={() => setOpenedSection(null)}
                >
                  <span data-part="arrow" aria-hidden="true" />
                </button>
              ) : null}
              <h2 data-part="title">{current ? current.label : title}</h2>
              <button
                type="button"
                data-part="close"
                aria-label="Закрыть настройки"
                onClick={() => sheet.current?.close()}
              >
                <span data-part="cross" aria-hidden="true" />
              </button>
            </div>
            <div data-part="viewport">
              <div data-part="track" data-level={current ? 1 : 0}>
                <div data-part="level" inert={Boolean(current)}>
                  <ul data-part="rows">
                    {sections.map((section, index) => (
                      <li key={section.label}>
                        <button
                          type="button"
                          data-part="row"
                          onClick={() => setOpenedSection(index)}
                        >
                          <span data-part="labels">
                            <span data-part="label">{section.label}</span>
                            <span data-part="hint">{section.hint}</span>
                          </span>
                          <span data-part="chevron" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div data-part="level" inert={!current}>
                  {current
                    ? current.options.map((option, index) => (
                        <label key={option} data-part="option">
                          <input
                            type="radio"
                            name={`vibeui-sheet-007-${openedSection}`}
                            defaultChecked={index === 0}
                          />
                          <span>{option}</span>
                        </label>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
