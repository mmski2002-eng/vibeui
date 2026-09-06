"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Alertdialog002Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  target?: string
  hint?: string
  confirm?: string
  cancel?: string
  /** Что исчезнет вместе с целью: список перед кнопками. */
  losses?: string[]
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  danger?: string
  /** Подложка окна. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: удаление с подтверждением вводом имени. Ввод — не
// бюрократия, а единственный способ отличить осознанное удаление от промаха
// по кнопке: набрать имя проекта случайно нельзя. Кнопка выключена, пока имя
// не совпало, и остаётся выключенной при опечатке — сравнение точное, без
// приведения регистра, потому что имя показано рядом и его копируют глазами.
// Последствия перечислены до кнопки, а не после: после уже поздно.
const STYLES = `
:where([data-vibeui-block="alertdialog-002"]){
--vibeui-alertdialog-002-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-alertdialog-002-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-alertdialog-002-muted:color-mix(in oklab,var(--vibeui-alertdialog-002-fg) 68%,transparent);
--vibeui-alertdialog-002-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-alertdialog-002-danger:light-dark(oklch(0.55 0.19 25),oklch(0.72 0.17 25));
--vibeui-alertdialog-002-danger-bg:light-dark(oklch(0.55 0.19 25 / 8%),oklch(0.72 0.17 25 / 15%));
--vibeui-alertdialog-002-on-danger:light-dark(oklch(1 0 0),oklch(0.17 0.03 25));
--vibeui-alertdialog-002-chip:light-dark(oklch(0.55 0 265 / 10%),oklch(0.85 0 265 / 14%));
--vibeui-alertdialog-002-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0.02 0 265 / 70%));
--vibeui-alertdialog-002-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-alertdialog-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alertdialog-002"]{color-scheme:dark}
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
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-002-shadow);
font-family:var(--vibeui-alertdialog-002-font);
}
[data-vibeui-block="alertdialog-002"] dialog::backdrop{background:light-dark(oklch(0.2 0 265 / 45%),oklch(0.08 0 265 / 62%))}
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
background:var(--vibeui-alertdialog-002-chip);
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
[data-vibeui-block="alertdialog-002"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-002-danger);color:var(--vibeui-alertdialog-002-on-danger)}
/* Кнопка выключена, пока имя не совпало точно: промах по кнопке не пройдёт. */
[data-vibeui-block="alertdialog-002"] [data-part="confirm"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="alertdialog-002"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-002-border);background:var(--vibeui-alertdialog-002-bg);color:inherit;
}
[data-vibeui-block="alertdialog-002"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-002-danger);outline-offset:2px}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="alertdialog-002"] dialog[open]:modal){overflow:hidden}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="alertdialog-002"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="alertdialog-002"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="alertdialog-002"]:has(dialog:not(:modal)[open]) [data-part="open"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LOSSES = [
  "248 компонентов и вся история установок",
  "ключи доступа и приглашения участников",
  "адрес проекта освободится через сутки",
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
  losses = DEFAULT_LOSSES,
  defaultOpen = false,
  danger,
  background = "",
  className,
  style,
  ...props
}: Alertdialog002Props) {
  const box = useRef<HTMLDialogElement>(null)
  const uid = useId()
  const [typed, setTyped] = useState("")

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
    ...(danger ? { "--vibeui-alertdialog-002-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert-dialog"
        data-vibeui-block="alertdialog-002"
        className={className}
        style={palette}
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

        <dialog
          ref={box}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={`${uid}-title`}
          aria-describedby={`${uid}-text`}
        >
          <h2 id={`${uid}-title`}>{title}</h2>
          <p id={`${uid}-text`} data-part="text">
            {text}
          </p>
          <ul>
            {losses.map((loss) => (
              <li key={loss}>
                <span data-part="dash" aria-hidden="true">
                  —
                </span>
                {loss}
              </li>
            ))}
          </ul>

          <label htmlFor={`${uid}-input`}>
            {hint}: <span data-part="target">{target}</span>
          </label>
          <input
            id={`${uid}-input`}
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
