import type { CSSProperties } from "react"

export type Dashboard020Session = {
  device: string
  place: string
  seen: string
  current?: boolean
}

export type Dashboard020Props = {
  title?: string
  hint?: string
  twoFactorOn?: boolean
  twoFactorHint?: string
  recoveryLeft?: number
  sessions?: Dashboard020Session[]
  passwordChanged?: string
  saveLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: безопасность одним экраном — пароль, двухфакторка и сеансы.
// Двухфакторка вынесена наверх и подписана состоянием словом, потому что это
// единственная настройка, которую действительно смотрят. У сеансов текущее
// устройство помечено значком и лишено кнопки «завершить»: выкинуть себя
// одним промахом — обычный сценарий на этом экране. Кнопка «завершить все
// остальные» стоит отдельно и оформлена как опасное действие.
const STYLES = `
:where([data-vibeui-block="dashboard-020"]){
--vibeui-dashboard-020-bg:oklch(1 0 0);
--vibeui-dashboard-020-panel:oklch(0.985 0.003 265);
--vibeui-dashboard-020-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-020-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-020-border:oklch(0.91 0.006 265);
--vibeui-dashboard-020-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-020-ok:oklch(0.53 0.14 152);
--vibeui-dashboard-020-risk:oklch(0.55 0.18 25);
--vibeui-dashboard-020-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dashboard-020-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-020"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-020-bg);
color:var(--vibeui-dashboard-020-fg);
font-family:var(--vibeui-dashboard-020-sans);
border:1px solid var(--vibeui-dashboard-020-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-020"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-020"] [data-part="shell"]{display:grid;gap:1rem;padding:1.125rem}
[data-vibeui-block="dashboard-020"] h2{margin:0 0 0.125rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-020"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-020-muted)}
[data-vibeui-block="dashboard-020"] [data-part="card"]{
background:var(--vibeui-dashboard-020-panel);
border:1px solid var(--vibeui-dashboard-020-border);border-radius:0.875rem;
padding:0.875rem;
}
[data-vibeui-block="dashboard-020"] h3{margin:0 0 0.5rem;font-size:0.8125rem;font-weight:700}
[data-vibeui-block="dashboard-020"] [data-part="tworow"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;
}
[data-vibeui-block="dashboard-020"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="dashboard-020"] [data-part="lamp"]{
width:0.625rem;height:0.625rem;border-radius:9999px;
background:var(--vibeui-dashboard-020-ok);
}
[data-vibeui-block="dashboard-020"] [data-on="false"] [data-part="lamp"]{
background:none;border-radius:0.125rem;
box-shadow:inset 0 0 0 2px var(--vibeui-dashboard-020-risk);
}
[data-vibeui-block="dashboard-020"] [data-on="false"] [data-part="state"]{color:var(--vibeui-dashboard-020-risk)}
[data-vibeui-block="dashboard-020"] [data-part="twohint"]{
margin:0.375rem 0 0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-dashboard-020-muted);
}
[data-vibeui-block="dashboard-020"] [data-part="codes"]{
margin:0.5rem 0 0;font-family:var(--vibeui-dashboard-020-mono);font-size:0.6875rem;
color:var(--vibeui-dashboard-020-muted);
}
[data-vibeui-block="dashboard-020"] [data-part="field"]{display:block;margin-bottom:0.625rem}
[data-vibeui-block="dashboard-020"] [data-part="fieldlabel"]{
display:block;margin-bottom:0.25rem;font-size:0.6875rem;font-weight:650;
color:var(--vibeui-dashboard-020-muted);
}
[data-vibeui-block="dashboard-020"] input{
appearance:none;font:inherit;font-size:0.8125rem;color:inherit;width:100%;
padding:0.5rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-020-border);
background:var(--vibeui-dashboard-020-bg);
}
[data-vibeui-block="dashboard-020"] [data-part="rule"]{
margin:0 0 0.625rem;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-dashboard-020-muted);
}
[data-vibeui-block="dashboard-020"] [data-part="rule"] li{padding-left:0.875rem;position:relative;line-height:1.6}
[data-vibeui-block="dashboard-020"] [data-part="rule"] li::before{
content:"";position:absolute;left:0;top:0.5rem;
width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-dashboard-020-border);
}
[data-vibeui-block="dashboard-020"] [data-part="grid"]{display:grid;grid-template-columns:1fr;gap:1rem}
[data-vibeui-block="dashboard-020"] ul[data-part="sessions"]{margin:0;padding:0;list-style:none}
[data-vibeui-block="dashboard-020"] [data-part="session"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.25rem 0.625rem;
padding:0.5625rem 0;border-top:1px solid var(--vibeui-dashboard-020-border);
}
[data-vibeui-block="dashboard-020"] [data-part="session"]:first-child{border-top:0;padding-top:0}
[data-vibeui-block="dashboard-020"] [data-part="device"]{margin:0;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="dashboard-020"] [data-part="where"]{
margin:0;width:100%;font-size:0.6875rem;color:var(--vibeui-dashboard-020-muted);
}
[data-vibeui-block="dashboard-020"] [data-part="now"]{
font-size:0.625rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
padding:0.0625rem 0.375rem;border-radius:0.375rem;
color:var(--vibeui-dashboard-020-ok);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-020-ok);
}
[data-vibeui-block="dashboard-020"] [data-part="drop"]{
margin-left:auto;appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:650;
padding:0.25rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-dashboard-020-border);
background:var(--vibeui-dashboard-020-bg);color:inherit;
}
[data-vibeui-block="dashboard-020"] [data-part="primary"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:650;
padding:0.5rem 0.875rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-020-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-020"] [data-part="dropall"]{
margin-top:0.75rem;
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:650;
padding:0.4375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-020-risk);
background:var(--vibeui-dashboard-020-bg);color:var(--vibeui-dashboard-020-risk);
}
[data-vibeui-block="dashboard-020"] :is(input,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-020-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-020"] [data-part="shell"]{padding:1.375rem}
[data-vibeui-block="dashboard-020"] [data-part="grid"]{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-020"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SESSIONS: Dashboard020Session[] = [
  {
    device: "MacBook Pro · Chrome",
    place: "Казань, Россия · 91.203.14.8",
    seen: "сейчас",
    current: true,
  },
  {
    device: "iPhone 14 · Safari",
    place: "Казань, Россия · мобильная сеть",
    seen: "2 часа назад",
  },
  {
    device: "Windows 11 · Firefox",
    place: "Белград, Сербия · 178.220.4.51",
    seen: "12 марта",
  },
]

/**
 * Безопасность аккаунта: смена пароля, двухфакторка и список сеансов
 * с завершением. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard020({
  title = "Безопасность",
  hint = "Пароль, второй фактор и устройства, которые вошли в аккаунт",
  twoFactorOn = true,
  twoFactorHint = "Код запрашивается при входе с нового устройства. Приложение-аутентификатор привязано 4 февраля.",
  recoveryLeft = 6,
  sessions = DEFAULT_SESSIONS,
  passwordChanged = "Пароль менялся 21 января",
  saveLabel = "Сменить пароль",
  accent,
  className,
  style,
}: Dashboard020Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-020" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-020"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </header>

          <section
            data-part="card"
            data-on={twoFactorOn ? "true" : "false"}
            aria-label="Двухфакторная защита"
          >
            <div data-part="tworow">
              <h3>Двухфакторная защита</h3>
              <span data-part="state">
                <span data-part="lamp" aria-hidden="true" />
                {twoFactorOn ? "включена" : "выключена"}
              </span>
              <button type="button" data-part="drop">
                {twoFactorOn ? "Настроить" : "Включить"}
              </button>
            </div>
            <p data-part="twohint">{twoFactorHint}</p>
            <p data-part="codes">
              Запасных кодов осталось: {recoveryLeft} из 10
            </p>
          </section>

          <div data-part="grid">
            <section data-part="card" aria-label="Смена пароля">
              <h3>Пароль</h3>
              <label data-part="field">
                <span data-part="fieldlabel">Текущий пароль</span>
                <input type="password" autoComplete="current-password" />
              </label>
              <label data-part="field">
                <span data-part="fieldlabel">Новый пароль</span>
                <input type="password" autoComplete="new-password" />
              </label>
              <ul data-part="rule">
                <li>не короче 12 символов;</li>
                <li>не совпадает с прошлыми тремя;</li>
                <li>не содержит адрес почты.</li>
              </ul>
              <button type="button" data-part="primary">
                {saveLabel}
              </button>
              <p data-part="codes">{passwordChanged}</p>
            </section>

            <section data-part="card" aria-label="Активные сеансы">
              <h3>Активные сеансы</h3>
              <ul data-part="sessions">
                {sessions.map((session) => (
                  <li key={session.device} data-part="session">
                    <p data-part="device">{session.device}</p>
                    {session.current ? (
                      <span data-part="now">это устройство</span>
                    ) : (
                      <button type="button" data-part="drop">
                        Завершить
                      </button>
                    )}
                    <p data-part="where">
                      {session.place} · {session.seen}
                    </p>
                  </li>
                ))}
              </ul>
              <button type="button" data-part="dropall">
                Завершить все, кроме текущего
              </button>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
