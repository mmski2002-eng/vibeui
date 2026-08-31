"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  person?: string
  reasons?: string[]
  noteLabel?: string
  notePlaceholder?: string
  confirm?: string
  cancel?: string
}

// Идея компонента: блокировка участника с причиной. Причина обязательна не
// ради формы: заблокированный спросит «за что», и ответ должен быть записан в
// момент решения, а не восстановлен по памяти через месяц. Список причин —
// нативный select с пустым первым пунктом, поэтому случайно выбрать первую из
// списка нельзя. Кнопка ждёт причину. Комментарий необязателен, но его видно
// в истории — об этом сказано под полем, а не в документации.
const STYLES = `
:where([data-vibeui-block="alertdialog-013"]){
--vibeui-alertdialog-013-bg:oklch(1 0 0);
--vibeui-alertdialog-013-panel:oklch(0.97 0.003 265);
--vibeui-alertdialog-013-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-013-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-013-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-013-danger:oklch(0.55 0.19 25);
--vibeui-alertdialog-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-013-font);
}
[data-vibeui-block="alertdialog-013"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="alertdialog-013"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-013"] [data-part="who"]{
display:flex;align-items:center;gap:0.5rem;margin:0 0 0.875rem;
padding:0.5rem 0.625rem;border-radius:0.625rem;
background:var(--vibeui-alertdialog-013-panel);font-size:0.8125rem;
}
[data-vibeui-block="alertdialog-013"] [data-part="avatar"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:oklch(0.9 0.06 25);color:oklch(0.38 0.12 25);
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
[data-vibeui-block="alertdialog-013"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-013-danger);color:oklch(1 0 0)}
[data-vibeui-block="alertdialog-013"] [data-part="confirm"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="alertdialog-013"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-013-border);background:var(--vibeui-alertdialog-013-bg);color:inherit;
}
[data-vibeui-block="alertdialog-013"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-013-danger);outline-offset:2px}
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
 * Блокировка участника: причина обязательна и попадает в историю.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog013({
  triggerLabel = "Заблокировать",
  title = "Заблокировать участника?",
  person = "Ким Сон",
  reasons = DEFAULT_REASONS,
  noteLabel = "Комментарий",
  notePlaceholder = "Что случилось и когда",
  confirm = "Заблокировать",
  cancel = "Отменить",
  className,
  style,
  ...props
}: Alertdialog013Props) {
  const box = useRef<HTMLDialogElement>(null)
  const [reason, setReason] = useState("")

  return (
    <>
      <style href="vibeui-alertdialog-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-013"
        className={className}
        style={style as CSSProperties}
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

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-013-title">
          <h2 id="vibeui-alertdialog-013-title">{title}</h2>
          <p data-part="who">
            <span data-part="avatar" aria-hidden="true">
              {initials(person)}
            </span>
            {person} потеряет доступ к проекту сразу
          </p>

          <label htmlFor="vibeui-alertdialog-013-reason">Причина</label>
          <select
            id="vibeui-alertdialog-013-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          >
            <option value="">Выберите причину…</option>
            {reasons.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label htmlFor="vibeui-alertdialog-013-note">{noteLabel}</label>
          <textarea
            id="vibeui-alertdialog-013-note"
            placeholder={notePlaceholder}
            aria-describedby="vibeui-alertdialog-013-hint"
          />
          <p id="vibeui-alertdialog-013-hint" data-part="note">
            Причина и комментарий попадут в историю проекта — их увидят
            владельцы, когда участник спросит, за что его отключили.
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
