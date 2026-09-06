"use client"

import { useEffect, useId, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Alertdialog009Session = {
  device: string
  place: string
  seen: string
  current?: boolean
}

export type Alertdialog009Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  sessions?: Alertdialog009Session[]
  confirm?: string
  cancel?: string
  /** Пометка текущей сессии рядом с названием устройства. */
  currentLabel?: string
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  danger?: string
  /** Подложка окна и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: выход со всех устройств. Список сессий обязателен: без него
// человек не знает, потеряет ли он рабочий ноутбук вместе с чужим телефоном.
// Текущая сессия помечена и названа явно — «Выйти везде» без этой пометки
// звучит так, будто текущее окно уцелеет. Последний вход указан по каждой
// сессии: подозрительный вход опознают по времени и месту, а не по названию
// браузера.
const STYLES = `
:where([data-vibeui-block="alertdialog-009"]){
--vibeui-alertdialog-009-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-alertdialog-009-panel:light-dark(oklch(0.97 0 265),oklch(0.27 0 265));
--vibeui-alertdialog-009-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-alertdialog-009-muted:color-mix(in oklab,var(--vibeui-alertdialog-009-fg) 68%,transparent);
--vibeui-alertdialog-009-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-alertdialog-009-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-alertdialog-009-badge-bg:light-dark(oklch(0.55 0.2 262 / 12%),oklch(0.72 0.18 262 / 18%));
--vibeui-alertdialog-009-danger:light-dark(oklch(0.55 0.19 25),oklch(0.72 0.17 25));
--vibeui-alertdialog-009-on-danger:light-dark(oklch(1 0 0),oklch(0.17 0.03 25));
--vibeui-alertdialog-009-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0.02 0 265 / 70%));
--vibeui-alertdialog-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alertdialog-009"]{color-scheme:dark}
[data-vibeui-block="alertdialog-009"]{
font-family:var(--vibeui-alertdialog-009-font);color:var(--vibeui-alertdialog-009-fg);
}
[data-vibeui-block="alertdialog-009"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-009"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-009-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-009-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-009"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-009-accent);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-009"] dialog{
margin:auto;width:min(24rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-009-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-009-bg);color:var(--vibeui-alertdialog-009-fg);
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-009-shadow);
font-family:var(--vibeui-alertdialog-009-font);
}
[data-vibeui-block="alertdialog-009"] dialog::backdrop{background:light-dark(oklch(0.2 0 265 / 45%),oklch(0.08 0 265 / 62%))}
[data-vibeui-block="alertdialog-009"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-009"] [data-part="text"]{margin:0 0 0.75rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-009-muted)}
/* Список сессий: без него неясно, что именно потеряется вместе с чужим входом. */
[data-vibeui-block="alertdialog-009"] ul{
list-style:none;margin:0 0 0.875rem;padding:0;
max-height:11rem;overflow-y:auto;overscroll-behavior:contain;
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="alertdialog-009"] li{
display:grid;grid-template-columns:1fr auto;gap:0.25rem 0.75rem;
padding:0.5rem 0.625rem;border-radius:0.625rem;
background:var(--vibeui-alertdialog-009-panel);
font-size:0.75rem;
}
[data-vibeui-block="alertdialog-009"] [data-part="device"]{font-weight:650}
[data-vibeui-block="alertdialog-009"] [data-part="place"]{color:var(--vibeui-alertdialog-009-muted)}
[data-vibeui-block="alertdialog-009"] [data-part="seen"]{
grid-column:2;grid-row:1 / span 2;align-self:center;
color:var(--vibeui-alertdialog-009-muted);font-variant-numeric:tabular-nums;
}
/* Текущая сессия помечена: «выйти везде» иначе читается как «кроме этой». */
[data-vibeui-block="alertdialog-009"] [data-current="true"]{
box-shadow:inset 0 0 0 1px var(--vibeui-alertdialog-009-accent);
}
[data-vibeui-block="alertdialog-009"] [data-part="badge"]{
margin-left:0.375rem;padding:0 0.3125rem;border-radius:0.3125rem;
background:var(--vibeui-alertdialog-009-badge-bg);color:var(--vibeui-alertdialog-009-accent);
font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="alertdialog-009"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-009"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-009"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-009-danger);color:var(--vibeui-alertdialog-009-on-danger)}
[data-vibeui-block="alertdialog-009"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-009-border);background:var(--vibeui-alertdialog-009-bg);color:inherit;
}
[data-vibeui-block="alertdialog-009"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-009-danger);outline-offset:2px}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="alertdialog-009"] dialog[open]:modal){overflow:hidden}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="alertdialog-009"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:26rem;
}
[data-vibeui-block="alertdialog-009"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="alertdialog-009"]:has(dialog:not(:modal)[open]) [data-part="open"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SESSIONS: Alertdialog009Session[] = [
  {
    device: "Chrome, Windows",
    place: "Москва · 178.44.12.9",
    seen: "сейчас",
    current: true,
  },
  {
    device: "Safari, iPhone",
    place: "Москва · мобильная сеть",
    seen: "2 часа назад",
  },
  {
    device: "Firefox, Ubuntu",
    place: "Казань · 95.31.7.140",
    seen: "6 дней назад",
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
 * Выход со всех устройств: список сессий и явная пометка текущей.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog009({
  triggerLabel = "Выйти на всех устройствах",
  title = "Завершить все сеансы?",
  text = "Придётся войти заново на каждом устройстве, включая это. Ключи доступа проектов продолжат работать.",
  sessions = DEFAULT_SESSIONS,
  confirm = "Завершить все",
  cancel = "Отменить",
  currentLabel = "это устройство",
  defaultOpen = false,
  danger,
  background = "",
  className,
  style,
  ...props
}: Alertdialog009Props) {
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
    ...(danger ? { "--vibeui-alertdialog-009-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert-dialog"
        data-vibeui-block="alertdialog-009"
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
          aria-describedby={`${uid}-text`}
        >
          <h2 id={`${uid}-title`}>{title}</h2>
          <p id={`${uid}-text`} data-part="text">
            {text}
          </p>
          <ul>
            {sessions.map((session) => (
              <li
                key={session.device + session.place}
                data-current={session.current ? "true" : "false"}
              >
                <span data-part="device">
                  {session.device}
                  {session.current ? (
                    <span data-part="badge">{currentLabel}</span>
                  ) : null}
                </span>
                <span data-part="seen">{session.seen}</span>
                <span data-part="place">{session.place}</span>
              </li>
            ))}
          </ul>
          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              onClick={() => box.current?.close()}
            >
              {confirm} · {sessions.length}
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
