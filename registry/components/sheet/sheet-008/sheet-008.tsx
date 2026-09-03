"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Sheet008Field = {
  name: string
  label: string
  /** Тип поля: строка, длинный текст, дата или выбор из списка. */
  kind?: "text" | "area" | "date" | "select"
  value?: string
  options?: string[]
  required?: boolean
  /** Пояснение под полем: чем оно станет для читателя. */
  hint?: string
}

export type Sheet008Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  triggerLabel?: string
  title?: string
  fields?: Sheet008Field[]
  saveLabel?: string
  cancelLabel?: string
  requiredNote?: string
  /** Открыть лист сразу и без модального режима: он остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: правка записи в листе, а не на отдельной странице. Список
// остаётся на месте, и после сохранения человек возвращается ровно туда, где
// был. Кнопки не уезжают с прокруткой: подвал прижат к нижнему краю листа,
// поэтому «Сохранить» видно и на длинной форме. Обязательные поля помечены
// звёздочкой и объяснены строкой над формой — знать, что значит звёздочка,
// обязан не только тот, кто заполнял такие формы раньше.
const STYLES = `
:where([data-vibeui-block="sheet-008"]){
--vibeui-sheet-008-bg:light-dark(oklch(0.99 0.002 265),oklch(0.22 0.014 265));
--vibeui-sheet-008-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-sheet-008-muted:color-mix(in oklab,var(--vibeui-sheet-008-fg) 62%,transparent);
--vibeui-sheet-008-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 13%));
--vibeui-sheet-008-field:light-dark(oklch(1 0 0),oklch(1 0 0 / 6%));
--vibeui-sheet-008-head:light-dark(oklch(0 0 0 / 3%),oklch(1 0 0 / 4%));
--vibeui-sheet-008-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-sheet-008-on-accent:oklch(from var(--vibeui-sheet-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sheet-008-required:light-dark(oklch(0.55 0.18 25),oklch(0.8 0.14 25));
--vibeui-sheet-008-scrim:light-dark(oklch(0.2 0.02 265 / 42%),oklch(0 0 0 / 62%));
--vibeui-sheet-008-shadow:light-dark(oklch(0.2 0.02 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-sheet-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sheet-008"]{color-scheme:dark}
[data-vibeui-block="sheet-008"]{
display:inline-block;font-family:var(--vibeui-sheet-008-font);color:var(--vibeui-sheet-008-fg);
}
[data-vibeui-block="sheet-008"] *{box-sizing:border-box}
[data-vibeui-block="sheet-008"] [data-part="trigger"]{
appearance:none;cursor:pointer;
min-height:2.25rem;padding:0.375rem 0.875rem;
border:1px solid var(--vibeui-sheet-008-border);border-radius:0.625rem;
background:var(--vibeui-sheet-008-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-008"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-008-accent);outline-offset:2px}
/* Лист приезжает справа: правка записи — работа за столом, а не жест
   большим пальцем, и на широком экране колонка удобнее нижнего листа. */
[data-vibeui-block="sheet-008"] dialog{
position:fixed;inset:0 0 0 auto;
width:min(24rem,100vw);max-width:100vw;height:100%;
margin:0;padding:0;border:0;
background:var(--vibeui-sheet-008-bg);color:var(--vibeui-sheet-008-fg);
box-shadow:-24px 0 60px -30px var(--vibeui-sheet-008-shadow);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="sheet-008"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-008"] dialog[open]{translate:100% 0}
}
[data-vibeui-block="sheet-008"] dialog::backdrop{background:var(--vibeui-sheet-008-scrim)}
[data-vibeui-block="sheet-008"] form{
display:flex;flex-direction:column;height:100%;
}
[data-vibeui-block="sheet-008"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.875rem 1rem;
background:var(--vibeui-sheet-008-head);
border-bottom:1px solid var(--vibeui-sheet-008-border);
}
[data-vibeui-block="sheet-008"] [data-part="title"]{margin:0;font-size:1rem;font-weight:650}
[data-vibeui-block="sheet-008"] [data-part="body"]{
flex:1;min-height:0;overflow-y:auto;
display:flex;flex-direction:column;gap:0.75rem;
padding:0.875rem 1rem;
scrollbar-width:thin;scrollbar-color:var(--vibeui-sheet-008-border) transparent;
}
[data-vibeui-block="sheet-008"] [data-part="note"]{
margin:0;font-size:0.75rem;color:var(--vibeui-sheet-008-muted);
}
[data-vibeui-block="sheet-008"] label{display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="sheet-008"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="sheet-008"] [data-part="star"]{color:var(--vibeui-sheet-008-required)}
[data-vibeui-block="sheet-008"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-sheet-008-muted)}
[data-vibeui-block="sheet-008"] input,
[data-vibeui-block="sheet-008"] textarea,
[data-vibeui-block="sheet-008"] select{
width:100%;padding:0.4375rem 0.625rem;
border:1px solid var(--vibeui-sheet-008-border);border-radius:0.5rem;
background:var(--vibeui-sheet-008-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="sheet-008"] textarea{min-height:4.5rem;resize:vertical}
[data-vibeui-block="sheet-008"] input:focus-visible,
[data-vibeui-block="sheet-008"] textarea:focus-visible,
[data-vibeui-block="sheet-008"] select:focus-visible{
outline:2px solid var(--vibeui-sheet-008-accent);outline-offset:1px;
}
/* Подвал прижат к низу листа: на длинной форме «Сохранить» не должно
   уезжать вместе с прокруткой. */
[data-vibeui-block="sheet-008"] [data-part="foot"]{
display:flex;gap:0.5rem;
padding:0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-sheet-008-border);
background:var(--vibeui-sheet-008-head);
}
[data-vibeui-block="sheet-008"] [data-part="save"],
[data-vibeui-block="sheet-008"] [data-part="cancel"]{
appearance:none;cursor:pointer;flex:1;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.375rem;padding:0.375rem 0.875rem;border-radius:0.625rem;
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="sheet-008"] [data-part="save"]{
border:1px solid transparent;
background:var(--vibeui-sheet-008-accent);color:var(--vibeui-sheet-008-on-accent);
}
[data-vibeui-block="sheet-008"] [data-part="cancel"]{
border:1px solid var(--vibeui-sheet-008-border);
background:transparent;color:inherit;
}
[data-vibeui-block="sheet-008"] [data-part="save"]:focus-visible,
[data-vibeui-block="sheet-008"] [data-part="cancel"]:focus-visible{
outline:2px solid var(--vibeui-sheet-008-accent);outline-offset:2px;
}
/* Немодальный показ: лист остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так его показывают на витрине и в документации. */
[data-vibeui-block="sheet-008"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:26rem;
}
[data-vibeui-block="sheet-008"] dialog:not(:modal){position:absolute;height:100%;z-index:1}
[data-vibeui-block="sheet-008"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-008"] dialog{transition:none!important;translate:0 0}
[data-vibeui-block="sheet-008"] *{animation:none!important}
}
`

const DEFAULT_FIELDS: Sheet008Field[] = [
  {
    name: "title",
    label: "Название",
    value: "Обновить фотографии каталога",
    required: true,
  },
  {
    name: "owner",
    label: "Ответственный",
    kind: "select",
    value: "Ольга Дорн",
    options: ["Ольга Дорн", "Пётр Иванов", "Мария Гурова"],
    required: true,
  },
  { name: "due", label: "Срок", kind: "date", value: "2026-09-18" },
  {
    name: "note",
    label: "Заметка",
    kind: "area",
    value: "Снимки со старой съёмки не подходят по фону.",
    hint: "Видна всем участникам проекта.",
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
 * Лист правки записи: форма с прижатым подвалом, кнопки не уезжают.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet008({
  triggerLabel = "Изменить задачу",
  title = "Задача",
  fields = DEFAULT_FIELDS,
  saveLabel = "Сохранить",
  cancelLabel = "Отмена",
  requiredNote = "Поля со звёздочкой обязательны.",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Sheet008Props) {
  const sheet = useRef<HTMLDialogElement>(null)

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
    ...(accent ? { "--vibeui-sheet-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sheet-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sheet-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sheet"
        data-vibeui-block="sheet-008"
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
          {/* method="dialog" закрывает лист силами браузера: обработчик
              отправки для отмены не нужен. */}
          <form method="dialog">
            <div data-part="head">
              <h2 data-part="title">{title}</h2>
            </div>

            <div data-part="body">
              <p data-part="note">{requiredNote}</p>

              {fields.map((field) => {
                const id = `vibeui-sheet-008-${field.name}`
                const kind = field.kind ?? "text"

                return (
                  <label key={field.name} htmlFor={id}>
                    <span data-part="label">
                      {field.label}
                      {field.required ? (
                        <span data-part="star" aria-hidden="true">
                          {" *"}
                        </span>
                      ) : null}
                    </span>

                    {kind === "area" ? (
                      <textarea
                        id={id}
                        name={field.name}
                        defaultValue={field.value}
                        required={field.required}
                      />
                    ) : kind === "select" ? (
                      <select
                        id={id}
                        name={field.name}
                        defaultValue={field.value}
                        required={field.required}
                      >
                        {(field.options ?? []).map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={id}
                        type={kind === "date" ? "date" : "text"}
                        name={field.name}
                        defaultValue={field.value}
                        required={field.required}
                      />
                    )}

                    {field.hint ? (
                      <span data-part="hint">{field.hint}</span>
                    ) : null}
                  </label>
                )
              })}
            </div>

            <div data-part="foot">
              {/* formNoValidate: отмена обязана срабатывать и на форме с
                  незаполненными обязательными полями. */}
              <button
                type="submit"
                value="cancel"
                data-part="cancel"
                formNoValidate
              >
                {cancelLabel}
              </button>
              <button type="submit" value="save" data-part="save">
                {saveLabel}
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </>
  )
}
