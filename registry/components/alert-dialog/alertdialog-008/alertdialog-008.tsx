"use client"

import { useEffect, useId, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Alertdialog008Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  reason?: string
  uses?: string[]
  later?: string
  allow?: string
  deny?: string
  /** Значок в шапке окна: одна печатная фигура. */
  icon?: string
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка окна и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: запрос разрешения. Системное окно браузера показывают
// только после этого: если нажать «Заблокировать» в системном, вернуть доступ
// можно лишь через настройки сайта, и второго шанса спросить не будет.
// Поэтому здесь сначала объясняют, зачем нужен доступ и что будет без него,
// а «Не сейчас» — полноценная кнопка: отказ должен быть лёгким, иначе люди
// запрещают навсегда, лишь бы окно исчезло.
const STYLES = `
:where([data-vibeui-block="alertdialog-008"]){
--vibeui-alertdialog-008-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-alertdialog-008-panel:light-dark(oklch(0.97 0.003 265),oklch(0.27 0.01 265));
--vibeui-alertdialog-008-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-alertdialog-008-muted:color-mix(in oklab,var(--vibeui-alertdialog-008-fg) 68%,transparent);
--vibeui-alertdialog-008-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-alertdialog-008-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-alertdialog-008-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0.03 262));
--vibeui-alertdialog-008-mark-bg:light-dark(oklch(0.55 0.2 262 / 12%),oklch(0.72 0.18 262 / 18%));
--vibeui-alertdialog-008-shadow:light-dark(oklch(0.2 0.03 265 / 55%),oklch(0.02 0.01 265 / 70%));
--vibeui-alertdialog-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alertdialog-008"]{color-scheme:dark}
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
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-008-shadow);
font-family:var(--vibeui-alertdialog-008-font);
}
[data-vibeui-block="alertdialog-008"] dialog::backdrop{background:light-dark(oklch(0.2 0.02 265 / 45%),oklch(0.08 0.014 265 / 62%))}
[data-vibeui-block="alertdialog-008"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;margin-bottom:0.75rem;border-radius:0.75rem;
background:var(--vibeui-alertdialog-008-mark-bg);color:var(--vibeui-alertdialog-008-accent);
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
[data-vibeui-block="alertdialog-008"] [data-part="allow"]{border:0;background:var(--vibeui-alertdialog-008-accent);color:var(--vibeui-alertdialog-008-on-accent)}
/* Отказ — полноценная кнопка: тяжёлый отказ приводит к запрету навсегда. */
[data-vibeui-block="alertdialog-008"] [data-part="later"]{
border:1px solid var(--vibeui-alertdialog-008-border);background:var(--vibeui-alertdialog-008-bg);color:inherit;
}
[data-vibeui-block="alertdialog-008"] [data-part="deny"]{
border:0;background:none;color:var(--vibeui-alertdialog-008-muted);font-weight:500;
}
[data-vibeui-block="alertdialog-008"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-008-accent);outline-offset:2px}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="alertdialog-008"] dialog[open]:modal){overflow:hidden}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="alertdialog-008"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="alertdialog-008"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="alertdialog-008"]:has(dialog:not(:modal)[open]) [data-part="open"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_USES = [
  "письмо, когда сборка проекта упала",
  "напоминание об истечении ключа доступа",
  "ответ на комментарий в вашем блоке",
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
  icon = "✽",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alertdialog008Props) {
  const box = useRef<HTMLDialogElement>(null)
  const uid = useId()

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
    ...(accent ? { "--vibeui-alertdialog-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert-dialog"
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

        <dialog
          ref={box}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={`${uid}-title`}
        >
          <span data-part="mark" aria-hidden="true">
            {icon}
          </span>
          <h2 id={`${uid}-title`}>{title}</h2>
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
