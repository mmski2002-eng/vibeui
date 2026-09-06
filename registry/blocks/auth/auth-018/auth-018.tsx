import type { CSSProperties } from "react"

export type Auth018Props = {
  project?: string
  email?: string
  title?: string
  submit?: string
  inviter?: string
  /** Строка под названием проекта; {inviter} подставляется из пропа inviter. */
  inviterText?: string
  /** Пояснение под заголовком: блок несёт русское. */
  leadText?: string
  /** Подпись заблокированного поля почты. */
  emailLabel?: string
  /** Подсказка под почтой; {link} — место ссылки. */
  emailHint?: string
  /** Подпись ссылки в подсказке под почтой. */
  emailHintLink?: string
  /** Подпись поля имени и подсказка в нём. */
  nameLabel?: string
  namePlaceholder?: string
  /** Подпись поля пароля и подсказка под ним; {min} — минимум знаков. */
  passwordLabel?: string
  passwordHint?: string
  /** Минимальная длина пароля. */
  minPassword?: number
  /** Правовая строка под кнопкой. */
  legalText?: string
  /** Заголовок области для скринридера; {project} — название проекта. */
  ariaLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
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
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
//
// Демонстрация интерфейса: форма ничего не отправляет, приглашение
// обязан проверять сервер по токену из ссылки.
const STYLES = `
:where([data-vibeui-block="auth-018"]){
--vibeui-auth-018-bg:transparent;
--vibeui-auth-018-card:light-dark(oklch(1 0 0),oklch(0.22 0.014 320));
--vibeui-auth-018-fg:light-dark(oklch(0.22 0.016 320),oklch(0.94 0.006 320));
--vibeui-auth-018-muted:light-dark(oklch(0.54 0.014 320),oklch(0.7 0.012 320));
--vibeui-auth-018-border:light-dark(oklch(0.9 0.008 320),oklch(0.35 0.014 320));
--vibeui-auth-018-accent:light-dark(oklch(0.52 0.18 39.8),oklch(0.76 0.15 39.8));
--vibeui-auth-018-on-accent:oklch(0.15 0.02 39.8);
--vibeui-auth-018-tint:light-dark(oklch(0.52 0.18 39.8 / 9%),oklch(0.76 0.15 39.8 / 14%));
--vibeui-auth-018-sheet:light-dark(oklch(0.55 0.02 320 / 6%),oklch(0.85 0.02 320 / 8%));
--vibeui-auth-018-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-018"]{color-scheme:dark}
[data-vibeui-block="auth-018"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
background:var(--vibeui-auth-018-tint);
border-bottom:1px solid var(--vibeui-auth-018-border);
}
[data-vibeui-block="auth-018"] [data-part="body"]{padding:1.5rem 1.25rem}
@container (min-width: 40rem){
[data-vibeui-block="auth-018"] [data-part="shell"]{max-width:26rem}
[data-vibeui-block="auth-018"] [data-part="body"]{padding:2rem}
[data-vibeui-block="auth-018"] [data-part="banner"]{padding:1rem 2rem}
}
[data-vibeui-block="auth-018"] [data-part="logo"]{
flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.125rem;height:2.125rem;border-radius:0.625rem;
background:var(--vibeui-auth-018-accent);color:var(--vibeui-auth-018-on-accent);
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
background:var(--vibeui-auth-018-sheet);
font-size:0.875rem;font-weight:600;color:var(--vibeui-auth-018-muted);
}
[data-vibeui-block="auth-018"] [data-part="lock"]{font-size:0.75rem}
[data-vibeui-block="auth-018"] [data-part="mailvalue"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="auth-018"] [data-part="hint"]{margin:0.3125rem 0 0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-auth-018-muted)}
[data-vibeui-block="auth-018"] [data-part="hint"] a{color:var(--vibeui-auth-018-accent);font-weight:600}
[data-vibeui-block="auth-018"] [data-part="submit"]{
width:100%;margin-top:0.25rem;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.375rem 1rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-018-accent);color:var(--vibeui-auth-018-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-018"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-018-accent);outline-offset:2px}
[data-vibeui-block="auth-018"] [data-part="legal"]{margin:0.875rem 0 0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-auth-018-muted);text-align:center}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-018"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Регистрация по приглашению: почта подставлена и заблокирована,
 * остаются имя и пароль. Один файл, ноль зависимостей.
 */
export function Auth018({
  project = "Каталог «Мера»",
  email = "anna@vibeui.ru",
  title = "Осталось два поля",
  submit = "Завести аккаунт и войти",
  inviter = "Пётр Гай",
  inviterText = "{inviter} пригласил вас в проект",
  leadText = "Аккаунт заведётся сразу на приглашённый адрес — вводить его не нужно.",
  emailLabel = "Почта",
  emailHint = "Приглашение выписано на этот адрес. Нужен другой — {link}.",
  emailHintLink = "попросите новое приглашение",
  nameLabel = "Как вас звать",
  namePlaceholder = "Анна Соколова",
  passwordLabel = "Пароль",
  passwordHint = "От {min} знаков. Менеджер паролей подставит свой — это надёжнее придуманного.",
  minPassword = 10,
  legalText = "Создавая аккаунт, вы принимаете условия использования и политику конфиденциальности.",
  ariaLabel = "Регистрация по приглашению в {project}",
  background = "",
  accent,
  className,
  style,
}: Auth018Props) {
  const [hintBefore, hintAfter = ""] = emailHint.split("{link}")

  const palette = {
    ...(accent ? { "--vibeui-auth-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        aria-label={ariaLabel.replace("{project}", project)}
      >
        <div data-part="shell">
          <p data-part="banner">
            <span data-part="logo" aria-hidden="true">
              {project.slice(0, 2).toUpperCase()}
            </span>
            <span data-part="bannertext">
              <b>{project}</b>
              {inviterText.replace("{inviter}", inviter)}
            </span>
          </p>

          <div data-part="body">
            <h2>{title}</h2>
            <p data-part="lead">{leadText}</p>

            <form>
              <div data-part="field">
                <span data-part="fieldtitle" id="vibeui-auth-018-mail-label">
                  {emailLabel}
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
                  {hintBefore}
                  <a href="#">{emailHintLink}</a>
                  {hintAfter}
                </p>
              </div>

              <div data-part="field">
                <label htmlFor="vibeui-auth-018-name">{nameLabel}</label>
                <input
                  id="vibeui-auth-018-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder={namePlaceholder}
                  required
                />
              </div>

              <div data-part="field">
                <label htmlFor="vibeui-auth-018-password">
                  {passwordLabel}
                </label>
                <input
                  id="vibeui-auth-018-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={minPassword}
                  required
                />
                <p data-part="hint">
                  {passwordHint.replace("{min}", String(minPassword))}
                </p>
              </div>

              <button type="submit" data-part="submit">
                {submit}
              </button>
            </form>

            <p data-part="legal">{legalText}</p>
          </div>
        </div>
      </section>
    </>
  )
}
