"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  reason?: string
  uses?: string[]
  later?: string
  allow?: string
  deny?: string
  accent?: string
}

// Идея компонента: запрос разрешения. Системное окно браузера показывают
// только после этого: если нажать «Заблокировать» в системном, вернуть доступ
// можно лишь через настройки сайта, и второго шанса спросить не будет.
// Поэтому здесь сначала объясняют, зачем нужен доступ и что будет без него,
// а «Не сейчас» — полноценная кнопка: отказ должен быть лёгким, иначе люди
// запрещают навсегда, лишь бы окно исчезло.
const STYLES = `
:where([data-vibeui-block="alertdialog-008"]){
--vibeui-alertdialog-008-bg:oklch(1 0 0);
--vibeui-alertdialog-008-panel:oklch(0.97 0.003 265);
--vibeui-alertdialog-008-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-008-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-008-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-008-accent:oklch(0.55 0.2 262);
--vibeui-alertdialog-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alertdialog-008"]{
font-family:var(--vibeui-alertdialog-008-font);color:var(--vibeui-alertdialog-008-fg);
}
[data-vibeui-block="alertdialog-008"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-008"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-008-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-008-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-008"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-008-accent);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-008"] dialog{
margin:auto;width:min(23rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-008-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-008-bg);color:var(--vibeui-alertdialog-008-fg);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-008-font);
}
[data-vibeui-block="alertdialog-008"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="alertdialog-008"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;margin-bottom:0.75rem;border-radius:0.75rem;
background:oklch(0.55 0.2 262 / 12%);color:var(--vibeui-alertdialog-008-accent);
font-size:1.125rem;line-height:1;
}
[data-vibeui-block="alertdialog-008"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-008"] [data-part="reason"]{margin:0 0 0.75rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-008-muted)}
/* Зачем именно доступ: без списка разрешение выпрашивают вслепую. */
[data-vibeui-block="alertdialog-008"] ul{
list-style:none;margin:0 0 0.875rem;padding:0.625rem 0.75rem;
border-radius:0.625rem;background:var(--vibeui-alertdialog-008-panel);
display:flex;flex-direction:column;gap:0.375rem;
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="alertdialog-008"] li{display:flex;gap:0.4375rem}
[data-vibeui-block="alertdialog-008"] [data-part="dot"]{
flex:none;width:0.375rem;height:0.375rem;margin-top:0.4375rem;
border-radius:9999px;background:var(--vibeui-alertdialog-008-accent);
}
[data-vibeui-block="alertdialog-008"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="alertdialog-008"] [data-part="actions"] button{
width:100%;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-008"] [data-part="allow"]{border:0;background:var(--vibeui-alertdialog-008-accent);color:oklch(1 0 0)}
/* Отказ — полноценная кнопка: тяжёлый отказ приводит к запрету навсегда. */
[data-vibeui-block="alertdialog-008"] [data-part="later"]{
border:1px solid var(--vibeui-alertdialog-008-border);background:var(--vibeui-alertdialog-008-bg);color:inherit;
}
[data-vibeui-block="alertdialog-008"] [data-part="deny"]{
border:0;background:none;color:var(--vibeui-alertdialog-008-muted);font-weight:500;
}
[data-vibeui-block="alertdialog-008"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-008-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_USES = [
  "письмо, когда сборка проекта упала",
  "напоминание об истечении ключа доступа",
  "ответ на комментарий в вашем блоке",
]

/**
 * Запрос разрешения: объяснение до системного окна и лёгкий отказ.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog008({
  triggerLabel = "Включить уведомления",
  title = "Присылать уведомления?",
  reason = "Разрешение спрашивает браузер, и запретить его можно только один раз — вернуть доступ потом получится лишь в настройках сайта.",
  uses = DEFAULT_USES,
  later = "Не сейчас",
  allow = "Разрешить",
  deny = "Никогда не спрашивать",
  accent,
  className,
  style,
  ...props
}: Alertdialog008Props) {
  const box = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-alertdialog-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-008"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => box.current?.showModal()}
        >
          {triggerLabel}
        </button>

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-008-title">
          <span data-part="mark" aria-hidden="true">
            ✽
          </span>
          <h2 id="vibeui-alertdialog-008-title">{title}</h2>
          <p data-part="reason">{reason}</p>
          <ul>
            {uses.map((use) => (
              <li key={use}>
                <span data-part="dot" aria-hidden="true" />
                {use}
              </li>
            ))}
          </ul>
          <div data-part="actions">
            <button
              type="button"
              data-part="allow"
              onClick={() => box.current?.close()}
            >
              {allow}
            </button>
            <button
              type="button"
              data-part="later"
              autoFocus
              onClick={() => box.current?.close()}
            >
              {later}
            </button>
            <button
              type="button"
              data-part="deny"
              onClick={() => box.current?.close()}
            >
              {deny}
            </button>
          </div>
        </dialog>
      </div>
    </>
  )
}
