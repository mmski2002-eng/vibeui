"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth020Session = {
  device: string
  client: string
  place: string
  seen: string
  current?: boolean
}

export type Auth020Props = {
  title?: string
  lead?: string
  sessions?: Auth020Session[]
  submit?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: выход со всех устройств как список, а не как одна кнопка.
// Кнопка «выйти везде» без списка не даёт человеку ответить на вопрос,
// ради которого он сюда пришёл: «а есть ли вообще чужой сеанс». Поэтому
// сначала перечислены сеансы с городом и временем — по ним и опознаётся
// лишний, — и только потом идёт общее действие. Текущий сеанс помечен и
// не выключается: выкинуть себя из настроек безопасности означает потерять
// экран, на котором человек как раз разбирается с угрозой.
// Опасное действие спрятано за вторым нажатием: список длинный, промах по
// кнопке стоит всем открытым вкладкам в команде.
//
// Демонстрация интерфейса: сеансы завершает сервер, здесь только разметка.
const STYLES = `
:where([data-vibeui-block="auth-020"]){
--vibeui-auth-020-bg:oklch(0.96 0.005 240);
--vibeui-auth-020-card:oklch(1 0 0);
--vibeui-auth-020-fg:oklch(0.22 0.014 240);
--vibeui-auth-020-muted:oklch(0.54 0.014 240);
--vibeui-auth-020-border:oklch(0.9 0.006 240);
--vibeui-auth-020-accent:oklch(0.52 0.15 250);
--vibeui-auth-020-danger:oklch(0.55 0.19 25);
--vibeui-auth-020-ok:oklch(0.55 0.13 152);
--vibeui-auth-020-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-020"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-020-bg);color:var(--vibeui-auth-020-fg);
font-family:var(--vibeui-auth-020-sans);
}
[data-vibeui-block="auth-020"] *{box-sizing:border-box}
[data-vibeui-block="auth-020"] [data-part="shell"]{
width:100%;max-width:25rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-020-card);
border:1px solid var(--vibeui-auth-020-border);border-radius:1rem;
}
@container (min-width: 46rem){
[data-vibeui-block="auth-020"] [data-part="shell"]{max-width:36rem;padding:2rem}
[data-vibeui-block="auth-020"] [data-part="session"]{align-items:center}
[data-vibeui-block="auth-020"] [data-part="seen"]{margin-left:auto;text-align:right;padding-left:1rem}
[data-vibeui-block="auth-020"] [data-part="danger"]{flex-direction:row;align-items:center}
}
[data-vibeui-block="auth-020"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-020"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-020-muted)}
[data-vibeui-block="auth-020"] ul{list-style:none;margin:0 0 1.25rem;padding:0;display:flex;flex-direction:column}
[data-vibeui-block="auth-020"] [data-part="session"]{
display:flex;gap:0.75rem;padding:0.75rem 0;
border-bottom:1px solid var(--vibeui-auth-020-border);
}
[data-vibeui-block="auth-020"] li:last-child [data-part="session"]{border-bottom:0}
[data-vibeui-block="auth-020"] [data-part="dot"]{
flex:none;width:0.5rem;height:0.5rem;margin-top:0.4375rem;border-radius:9999px;
background:var(--vibeui-auth-020-border);
}
[data-vibeui-block="auth-020"] [data-part="session"][data-current="true"] [data-part="dot"]{background:var(--vibeui-auth-020-ok)}
[data-vibeui-block="auth-020"] [data-part="info"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="auth-020"] [data-part="device"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="auth-020"] [data-part="here"]{
padding:0.0625rem 0.375rem;border-radius:9999px;
background:oklch(0.55 0.13 152 / 14%);color:var(--vibeui-auth-020-ok);
font-size:0.625rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;
}
[data-vibeui-block="auth-020"] [data-part="where"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-auth-020-muted)}
[data-vibeui-block="auth-020"] [data-part="seen"]{font-size:0.75rem;color:var(--vibeui-auth-020-muted);white-space:nowrap}
[data-vibeui-block="auth-020"] [data-part="danger"]{
display:flex;flex-direction:column;gap:0.75rem;
padding:0.875rem;border-radius:0.75rem;
border:1px solid oklch(0.55 0.19 25 / 25%);background:oklch(0.55 0.19 25 / 6%);
}
[data-vibeui-block="auth-020"] [data-part="dangertext"]{margin:0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-auth-020-muted)}
[data-vibeui-block="auth-020"] [data-part="dangertext"] b{color:var(--vibeui-auth-020-danger)}
[data-vibeui-block="auth-020"] [data-part="kill"]{
flex:none;appearance:none;cursor:pointer;height:2.5rem;padding:0 1rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-020-danger);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;white-space:nowrap;
}
[data-vibeui-block="auth-020"] [data-part="kill"]:focus-visible{outline:2px solid var(--vibeui-auth-020-danger);outline-offset:2px}
[data-vibeui-block="auth-020"] [data-part="cancel"]{
flex:none;appearance:none;cursor:pointer;height:2.5rem;padding:0 0.875rem;
border:1px solid var(--vibeui-auth-020-border);border-radius:0.625rem;
background:var(--vibeui-auth-020-card);color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="auth-020"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-auth-020-accent);outline-offset:2px}
[data-vibeui-block="auth-020"] [data-part="row"]{display:flex;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="auth-020"] [data-part="done"]{
margin:0;padding:0.75rem 0.875rem;border-radius:0.75rem;
background:oklch(0.55 0.13 152 / 10%);color:var(--vibeui-auth-020-ok);
font-size:0.8125rem;line-height:1.45;font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-020"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SESSIONS: Auth020Session[] = [
  {
    device: "MacBook Pro",
    client: "Chrome 141",
    place: "Москва",
    seen: "сейчас",
    current: true,
  },
  {
    device: "iPhone 15",
    client: "Safari",
    place: "Москва",
    seen: "2 часа назад",
  },
  {
    device: "Windows 11",
    client: "Firefox 133",
    place: "Казань",
    seen: "вчера, 21:40",
  },
  {
    device: "Неизвестное устройство",
    client: "Chrome 118",
    place: "Амстердам",
    seen: "4 дня назад",
  },
]

/**
 * Выход со всех устройств: список сеансов с местом и временем,
 * общий выход за вторым нажатием. Один файл, ноль зависимостей.
 */
export function Auth020({
  title = "Активные сеансы",
  lead = "Здесь всё, где сейчас открыт ваш аккаунт. Незнакомый город или устройство — повод завершить всё разом и сменить пароль.",
  sessions = DEFAULT_SESSIONS,
  submit = "Завершить все, кроме текущего",
  accent,
  className,
  style,
}: Auth020Props) {
  const [asking, setAsking] = useState(false)
  const [done, setDone] = useState(false)

  const others = sessions.filter((session) => !session.current).length
  const shown = done ? sessions.filter((session) => session.current) : sessions

  const palette = {
    ...(accent ? { "--vibeui-auth-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-020" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-020"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <ul>
            {shown.map((session) => (
              <li key={`${session.device}-${session.seen}`}>
                <div data-part="session" data-current={session.current}>
                  <span data-part="dot" aria-hidden="true" />
                  <span data-part="info">
                    <span data-part="device">
                      {session.device}
                      {session.current ? (
                        <span data-part="here">это устройство</span>
                      ) : null}
                    </span>
                    <span data-part="where">
                      {session.client} · {session.place}
                    </span>
                  </span>
                  <span data-part="seen">{session.seen}</span>
                </div>
              </li>
            ))}
          </ul>

          {done ? (
            <p data-part="done" role="status">
              Остальные сеансы завершены. На тех устройствах попросят войти
              заново.
            </p>
          ) : (
            <div data-part="danger">
              <p data-part="dangertext">
                <b>Осторожно:</b> завершатся {others} сеанса на других
                устройствах. Несохранённые черновики там пропадут.
              </p>
              {asking ? (
                <span data-part="row">
                  <button
                    type="button"
                    data-part="kill"
                    onClick={() => setDone(true)}
                  >
                    Да, завершить {others}
                  </button>
                  <button
                    type="button"
                    data-part="cancel"
                    onClick={() => setAsking(false)}
                  >
                    Отмена
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  data-part="kill"
                  onClick={() => setAsking(true)}
                >
                  {submit}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
