"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  target?: string
  hint?: string
  confirm?: string
  cancel?: string
}

// Идея компонента: удаление с подтверждением вводом имени. Ввод — не
// бюрократия, а единственный способ отличить осознанное удаление от промаха
// по кнопке: набрать имя проекта случайно нельзя. Кнопка выключена, пока имя
// не совпало, и остаётся выключенной при опечатке — сравнение точное, без
// приведения регистра, потому что имя показано рядом и его копируют глазами.
// Последствия перечислены до кнопки, а не после: после уже поздно.
const STYLES = `
:where([data-vibeui-block="alertdialog-002"]){
--vibeui-alertdialog-002-bg:oklch(1 0 0);
--vibeui-alertdialog-002-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-002-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-002-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-002-danger:oklch(0.55 0.19 25);
--vibeui-alertdialog-002-danger-bg:oklch(0.55 0.19 25 / 8%);
--vibeui-alertdialog-002-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-alertdialog-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alertdialog-002"]{
font-family:var(--vibeui-alertdialog-002-font);color:var(--vibeui-alertdialog-002-fg);
}
[data-vibeui-block="alertdialog-002"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-002"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-002-danger);border-radius:0.625rem;
background:none;color:var(--vibeui-alertdialog-002-danger);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-002"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-002-danger);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-002"] dialog{
margin:auto;width:min(24rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-002-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-002-bg);color:var(--vibeui-alertdialog-002-fg);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-002-font);
}
[data-vibeui-block="alertdialog-002"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="alertdialog-002"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-002"] [data-part="text"]{margin:0 0 0.75rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-002-muted)}
/* Последствия перечислены до кнопки: после неё перечислять уже поздно. */
[data-vibeui-block="alertdialog-002"] ul{
list-style:none;margin:0 0 0.875rem;padding:0.625rem 0.75rem;
border-radius:0.625rem;background:var(--vibeui-alertdialog-002-danger-bg);
display:flex;flex-direction:column;gap:0.25rem;
font-size:0.75rem;line-height:1.45;color:var(--vibeui-alertdialog-002-fg);
}
[data-vibeui-block="alertdialog-002"] li{display:flex;gap:0.375rem}
[data-vibeui-block="alertdialog-002"] [data-part="dash"]{color:var(--vibeui-alertdialog-002-danger);font-weight:700}
[data-vibeui-block="alertdialog-002"] label{display:block;margin-bottom:0.3125rem;font-size:0.75rem;font-weight:600}
/* Имя показано моноширинным: его сверяют посимвольно перед вводом. */
[data-vibeui-block="alertdialog-002"] [data-part="target"]{
font-family:var(--vibeui-alertdialog-002-mono);
padding:0.0625rem 0.25rem;border-radius:0.25rem;
background:oklch(0.55 0.02 265 / 10%);
}
[data-vibeui-block="alertdialog-002"] input{
width:100%;height:2.375rem;padding:0 0.75rem;margin-bottom:0.875rem;
border:1px solid var(--vibeui-alertdialog-002-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-002-bg);color:inherit;
font-family:var(--vibeui-alertdialog-002-mono);font-size:0.875rem;
}
[data-vibeui-block="alertdialog-002"] input:focus-visible{outline:2px solid var(--vibeui-alertdialog-002-danger);outline-offset:1px;border-color:var(--vibeui-alertdialog-002-danger)}
[data-vibeui-block="alertdialog-002"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-002"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-002"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-002-danger);color:oklch(1 0 0)}
/* Кнопка выключена, пока имя не совпало точно: промах по кнопке не пройдёт. */
[data-vibeui-block="alertdialog-002"] [data-part="confirm"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="alertdialog-002"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-002-border);background:var(--vibeui-alertdialog-002-bg);color:inherit;
}
[data-vibeui-block="alertdialog-002"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-002-danger);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LOSSES = [
  "248 компонентов и вся история установок",
  "ключи доступа и приглашения участников",
  "адрес проекта освободится через сутки",
]

/**
 * Удаление с подтверждением вводом имени: случайно набрать имя нельзя.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog002({
  triggerLabel = "Удалить проект",
  title = "Удалить проект без возможности отмены?",
  text = "Вместе с проектом исчезнет:",
  target = "vibeui-catalog",
  hint = "Введите имя проекта, чтобы подтвердить",
  confirm = "Удалить навсегда",
  cancel = "Отменить",
  className,
  style,
  ...props
}: Alertdialog002Props) {
  const box = useRef<HTMLDialogElement>(null)
  const [typed, setTyped] = useState("")

  return (
    <>
      <style href="vibeui-alertdialog-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-002"
        className={className}
        style={style as CSSProperties}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => {
            setTyped("")
            box.current?.showModal()
          }}
        >
          {triggerLabel}
        </button>

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-002-title">
          <h2 id="vibeui-alertdialog-002-title">{title}</h2>
          <p data-part="text">{text}</p>
          <ul>
            {DEFAULT_LOSSES.map((loss) => (
              <li key={loss}>
                <span data-part="dash" aria-hidden="true">
                  —
                </span>
                {loss}
              </li>
            ))}
          </ul>

          <label htmlFor="vibeui-alertdialog-002-input">
            {hint}: <span data-part="target">{target}</span>
          </label>
          <input
            id="vibeui-alertdialog-002-input"
            type="text"
            value={typed}
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setTyped(event.target.value)}
          />

          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              disabled={typed !== target}
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
