"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog009Session = {
  device: string
  place: string
  seen: string
  current?: boolean
}

export type Alertdialog009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  sessions?: Alertdialog009Session[]
  confirm?: string
  cancel?: string
}

// Идея компонента: выход со всех устройств. Список сессий обязателен: без него
// человек не знает, потеряет ли он рабочий ноутбук вместе с чужим телефоном.
// Текущая сессия помечена и названа явно — «Выйти везде» без этой пометки
// звучит так, будто текущее окно уцелеет. Последний вход указан по каждой
// сессии: подозрительный вход опознают по времени и месту, а не по названию
// браузера.
const STYLES = `
:where([data-vibeui-block="alertdialog-009"]){
--vibeui-alertdialog-009-bg:oklch(1 0 0);
--vibeui-alertdialog-009-panel:oklch(0.97 0.003 265);
--vibeui-alertdialog-009-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-009-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-009-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-009-accent:oklch(0.55 0.2 262);
--vibeui-alertdialog-009-danger:oklch(0.55 0.19 25);
--vibeui-alertdialog-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-009-font);
}
[data-vibeui-block="alertdialog-009"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
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
background:oklch(0.55 0.2 262 / 12%);color:var(--vibeui-alertdialog-009-accent);
font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="alertdialog-009"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-009"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-009"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-009-danger);color:oklch(1 0 0)}
[data-vibeui-block="alertdialog-009"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-009-border);background:var(--vibeui-alertdialog-009-bg);color:inherit;
}
[data-vibeui-block="alertdialog-009"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-009-danger);outline-offset:2px}
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
  className,
  style,
  ...props
}: Alertdialog009Props) {
  const box = useRef<HTMLDialogElement>(null)

  return (
    <>
      <style href="vibeui-alertdialog-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-009"
        className={className}
        style={style as CSSProperties}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => box.current?.showModal()}
        >
          {triggerLabel}
        </button>

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-009-title">
          <h2 id="vibeui-alertdialog-009-title">{title}</h2>
          <p data-part="text">{text}</p>
          <ul>
            {sessions.map((session) => (
              <li
                key={session.device + session.place}
                data-current={session.current ? "true" : "false"}
              >
                <span data-part="device">
                  {session.device}
                  {session.current ? (
                    <span data-part="badge">это устройство</span>
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
