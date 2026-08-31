import type { CSSProperties } from "react"

export type Auth018Props = {
  project?: string
  email?: string
  title?: string
  submit?: string
  inviter?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: регистрация по приглашению, где почта уже известна. Поле адреса
// показано, но заблокировано — и рядом написано почему: приглашение выписано
// на конкретный адрес, и смена почты здесь просто отвязала бы человека от
// приглашения. Скрывать поле нельзя: человек должен видеть, под каким адресом
// заводит аккаунт, иначе через месяц он не вспомнит, какую почту вводить
// при входе. Полей ровно два — имя и пароль: всё остальное про него уже
// знает тот, кто приглашал, а длинная форма на этом шаге теряет людей.
//
// Демонстрация интерфейса: форма ничего не отправляет, приглашение
// обязан проверять сервер по токену из ссылки.
const STYLES = `
:where([data-vibeui-block="auth-018"]){
--vibeui-auth-018-bg:oklch(0.96 0.008 320);
--vibeui-auth-018-card:oklch(1 0 0);
--vibeui-auth-018-fg:oklch(0.22 0.016 320);
--vibeui-auth-018-muted:oklch(0.54 0.014 320);
--vibeui-auth-018-border:oklch(0.9 0.008 320);
--vibeui-auth-018-accent:oklch(0.52 0.18 330);
--vibeui-auth-018-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-018"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-018-bg);color:var(--vibeui-auth-018-fg);
font-family:var(--vibeui-auth-018-sans);
}
[data-vibeui-block="auth-018"] *{box-sizing:border-box}
[data-vibeui-block="auth-018"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;overflow:hidden;
background:var(--vibeui-auth-018-card);
border:1px solid var(--vibeui-auth-018-border);border-radius:1rem;
}
[data-vibeui-block="auth-018"] [data-part="banner"]{
display:flex;align-items:center;gap:0.625rem;padding:0.875rem 1.25rem;
background:oklch(0.52 0.18 330 / 9%);
border-bottom:1px solid var(--vibeui-auth-018-border);
}
[data-vibeui-block="auth-018"] [data-part="body"]{padding:1.5rem 1.25rem}
@container (min-width: 40rem){
[data-vibeui-block="auth-018"] [data-part="shell"]{max-width:26rem}
[data-vibeui-block="auth-018"] [data-part="body"]{padding:2rem}
[data-vibeui-block="auth-018"] [data-part="banner"]{padding:1rem 2rem}
}
[data-vibeui-block="auth-018"] [data-part="logo"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:2.125rem;height:2.125rem;border-radius:0.625rem;
background:var(--vibeui-auth-018-accent);color:oklch(1 0 0);
font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="auth-018"] [data-part="bannertext"]{font-size:0.75rem;line-height:1.35;color:var(--vibeui-auth-018-muted)}
[data-vibeui-block="auth-018"] [data-part="bannertext"] b{display:block;font-size:0.875rem;color:var(--vibeui-auth-018-fg);font-weight:650}
[data-vibeui-block="auth-018"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-018"] [data-part="lead"]{margin:0 0 1.25rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-018-muted)}
[data-vibeui-block="auth-018"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.875rem}
[data-vibeui-block="auth-018"] label,
[data-vibeui-block="auth-018"] [data-part="fieldtitle"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-018"] input{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-018-border);border-radius:0.625rem;
background:var(--vibeui-auth-018-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-018"] input:focus-visible{outline:2px solid var(--vibeui-auth-018-accent);outline-offset:1px;border-color:var(--vibeui-auth-018-accent)}
[data-vibeui-block="auth-018"] [data-part="locked"]{
display:flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-018-border);border-radius:0.625rem;
background:oklch(0.55 0.02 320 / 6%);
font-size:0.875rem;font-weight:600;color:var(--vibeui-auth-018-muted);
}
[data-vibeui-block="auth-018"] [data-part="lock"]{font-size:0.75rem}
[data-vibeui-block="auth-018"] [data-part="mailvalue"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="auth-018"] [data-part="hint"]{margin:0.3125rem 0 0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-auth-018-muted)}
[data-vibeui-block="auth-018"] [data-part="hint"] a{color:var(--vibeui-auth-018-accent);font-weight:600}
[data-vibeui-block="auth-018"] [data-part="submit"]{
width:100%;margin-top:0.25rem;appearance:none;cursor:pointer;height:2.75rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-018-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-018"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-018-accent);outline-offset:2px}
[data-vibeui-block="auth-018"] [data-part="legal"]{margin:0.875rem 0 0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-auth-018-muted);text-align:center}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-018"] *{animation:none!important;transition:none!important}}
`

/**
 * Регистрация по приглашению: почта подставлена и заблокирована,
 * остаются имя и пароль. Один файл, ноль зависимостей.
 */
export function Auth018({
  project = "Каталог «Мера»",
  email = "anna@vibeui.ru",
  title = "Осталось два поля",
  submit = "Завести аккаунт и войти",
  inviter = "Пётр Гай",
  accent,
  className,
  style,
}: Auth018Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-018" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-018"
        className={className}
        style={palette}
        aria-label={`Регистрация по приглашению в ${project}`}
      >
        <div data-part="shell">
          <p data-part="banner">
            <span data-part="logo" aria-hidden="true">
              {project.slice(0, 2).toUpperCase()}
            </span>
            <span data-part="bannertext">
              <b>{project}</b>
              {inviter} пригласил вас в проект
            </span>
          </p>

          <div data-part="body">
            <h2>{title}</h2>
            <p data-part="lead">
              Аккаунт заведётся сразу на приглашённый адрес — вводить его не
              нужно.
            </p>

            <form>
              <div data-part="field">
                <span data-part="fieldtitle" id="vibeui-auth-018-mail-label">
                  Почта
                </span>
                <output
                  data-part="locked"
                  aria-labelledby="vibeui-auth-018-mail-label"
                >
                  <span data-part="lock" aria-hidden="true">
                    🔒
                  </span>
                  <span data-part="mailvalue">{email}</span>
                </output>
                <p data-part="hint">
                  Приглашение выписано на этот адрес. Нужен другой —{" "}
                  <a href="#">попросите новое приглашение</a>.
                </p>
              </div>

              <div data-part="field">
                <label htmlFor="vibeui-auth-018-name">Как вас звать</label>
                <input
                  id="vibeui-auth-018-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Анна Соколова"
                  required
                />
              </div>

              <div data-part="field">
                <label htmlFor="vibeui-auth-018-password">Пароль</label>
                <input
                  id="vibeui-auth-018-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  required
                />
                <p data-part="hint">
                  От 10 знаков. Менеджер паролей подставит свой — это надёжнее
                  придуманного.
                </p>
              </div>

              <button type="submit" data-part="submit">
                {submit}
              </button>
            </form>

            <p data-part="legal">
              Создавая аккаунт, вы принимаете условия использования и политику
              конфиденциальности.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
