"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Alertdialog013Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  person?: string
  /** Последствие блокировки. {person} подставляется именем участника. */
  personNote?: string
  reasons?: string[]
  reasonLabel?: string
  reasonPlaceholder?: string
  noteLabel?: string
  notePlaceholder?: string
  /** Пояснение под комментарием: куда попадёт запись. */
  historyNote?: string
  confirm?: string
  cancel?: string
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  danger?: string
  /** Подложка окна и полей. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: блокировка участника с причиной. Причина обязательна не
// ради формы: заблокированный спросит «за что», и ответ должен быть записан в
// момент решения, а не восстановлен по памяти через месяц. Список причин —
// нативный select с пустым первым пунктом, поэтому случайно выбрать первую из
// списка нельзя. Кнопка ждёт причину. Комментарий необязателен, но его видно
// в истории — об этом сказано под полем, а не в документации.
const STYLES = `
:where([data-vibeui-block="alertdialog-013"]){
--vibeui-alertdialog-013-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-alertdialog-013-panel:light-dark(oklch(0.97 0.003 265),oklch(0.27 0.014 265));
--vibeui-alertdialog-013-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-alertdialog-013-muted:color-mix(in oklab,var(--vibeui-alertdialog-013-fg) 68%,transparent);
--vibeui-alertdialog-013-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-alertdialog-013-danger:light-dark(oklch(0.55 0.19 25),oklch(0.73 0.16 25));
--vibeui-alertdialog-013-on-danger:light-dark(oklch(1 0 0),oklch(0.19 0.04 25));
--vibeui-alertdialog-013-avatar-bg:light-dark(oklch(0.9 0.06 25),oklch(0.36 0.07 25));
--vibeui-alertdialog-013-avatar-fg:light-dark(oklch(0.38 0.12 25),oklch(0.91 0.06 25));
--vibeui-alertdialog-013-shadow:light-dark(oklch(0.2 0.03 265 / 55%),oklch(0.02 0.01 265 / 70%));
--vibeui-alertdialog-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alertdialog-013"]{color-scheme:dark}
[data-vibeui-block="alertdialog-013"]{
font-family:var(--vibeui-alertdialog-013-font);color:var(--vibeui-alertdialog-013-fg);
}
[data-vibeui-block="alertdialog-013"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-013"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-013-danger);border-radius:0.625rem;
background:none;color:var(--vibeui-alertdialog-013-danger);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-013"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-013-danger);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-013"] dialog{
margin:auto;width:min(24rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-013-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-013-bg);color:var(--vibeui-alertdialog-013-fg);
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-013-shadow);
font-family:var(--vibeui-alertdialog-013-font);
}
[data-vibeui-block="alertdialog-013"] dialog::backdrop{background:light-dark(oklch(0.2 0.02 265 / 45%),oklch(0.08 0.014 265 / 62%))}
[data-vibeui-block="alertdialog-013"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-013"] [data-part="who"]{
display:flex;align-items:center;gap:0.5rem;margin:0 0 0.875rem;
padding:0.5rem 0.625rem;border-radius:0.625rem;
background:var(--vibeui-alertdialog-013-panel);font-size:0.8125rem;
}
[data-vibeui-block="alertdialog-013"] [data-part="avatar"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:var(--vibeui-alertdialog-013-avatar-bg);color:var(--vibeui-alertdialog-013-avatar-fg);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="alertdialog-013"] label{display:block;margin-bottom:0.3125rem;font-size:0.75rem;font-weight:600}
/* Пустой первый пункт: случайно выбрать первую причину из списка нельзя. */
[data-vibeui-block="alertdialog-013"] select,
[data-vibeui-block="alertdialog-013"] textarea{
width:100%;padding:0.5rem 0.625rem;margin-bottom:0.75rem;
border:1px solid var(--vibeui-alertdialog-013-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-013-bg);color:inherit;
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="alertdialog-013"] select{height:2.375rem;padding-right:0.5rem}
[data-vibeui-block="alertdialog-013"] textarea{min-height:4rem;resize:vertical;margin-bottom:0.25rem}
[data-vibeui-block="alertdialog-013"] select:focus-visible,
[data-vibeui-block="alertdialog-013"] textarea:focus-visible{outline:2px solid var(--vibeui-alertdialog-013-danger);outline-offset:1px;border-color:var(--vibeui-alertdialog-013-danger)}
[data-vibeui-block="alertdialog-013"] [data-part="note"]{
margin:0 0 0.875rem;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-alertdialog-013-muted);
}
[data-vibeui-block="alertdialog-013"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-013"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-013"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-013-danger);color:var(--vibeui-alertdialog-013-on-danger)}
[data-vibeui-block="alertdialog-013"] [data-part="confirm"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="alertdialog-013"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-013-border);background:var(--vibeui-alertdialog-013-bg);color:inherit;
}
[data-vibeui-block="alertdialog-013"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-013-danger);outline-offset:2px}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="alertdialog-013"] dialog[open]:modal){overflow:hidden}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="alertdialog-013"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:26rem;
}
[data-vibeui-block="alertdialog-013"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="alertdialog-013"]:has(dialog:not(:modal)[open]) [data-part="open"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_REASONS = [
  "Нарушение правил проекта",
  "Подозрение на компрометацию доступа",
  "Уволен или сменил роль",
  "Просьба самого участника",
]

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

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
 * Блокировка участника: причина обязательна и попадает в историю.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog013({
  triggerLabel = "Заблокировать",
  title = "Заблокировать участника?",
  person = "Ким Сон",
  personNote = "{person} потеряет доступ к проекту сразу",
  reasons = DEFAULT_REASONS,
  reasonLabel = "Причина",
  reasonPlaceholder = "Выберите причину…",
  noteLabel = "Комментарий",
  notePlaceholder = "Что случилось и когда",
  historyNote = "Причина и комментарий попадут в историю проекта — их увидят владельцы, когда участник спросит, за что его отключили.",
  confirm = "Заблокировать",
  cancel = "Отменить",
  defaultOpen = false,
  danger,
  background = "",
  className,
  style,
  ...props
}: Alertdialog013Props) {
  const box = useRef<HTMLDialogElement>(null)
  const uid = useId()
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная панель живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    box.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к панели просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])

  const palette = {
    ...(danger ? { "--vibeui-alertdialog-013-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert-dialog"
        data-vibeui-block="alertdialog-013"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => {
            setReason("")
            box.current?.showModal()
          }}
        >
          {triggerLabel}
        </button>

        <dialog
          ref={box}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={`${uid}-title`}
        >
          <h2 id={`${uid}-title`}>{title}</h2>
          <p data-part="who">
            <span data-part="avatar" aria-hidden="true">
              {initials(person)}
            </span>
            {personNote.replace("{person}", person)}
          </p>

          <label htmlFor={`${uid}-reason`}>{reasonLabel}</label>
          <select
            id={`${uid}-reason`}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          >
            <option value="">{reasonPlaceholder}</option>
            {reasons.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label htmlFor={`${uid}-note`}>{noteLabel}</label>
          <textarea
            id={`${uid}-note`}
            placeholder={notePlaceholder}
            aria-describedby={`${uid}-hint`}
          />
          <p id={`${uid}-hint`} data-part="note">
            {historyNote}
          </p>

          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              disabled={reason === ""}
              onClick={() => box.current?.close()}
            >
              {confirm}
            </button>
            <button
              type="button"
              data-part="cancel"
              autoFocus
              onClick={() => box.current?.close()}
            >
              {cancel}
            </button>
          </div>
        </dialog>
      </div>
    </>
  )
}
