import type { CSSProperties } from "react"

export type Auth003Props = {
  title?: string
  lead?: string
  submit?: string
  sentTitle?: string
  sentText?: string
  resend?: string
  back?: string
  emailLabel?: string
  emailPlaceholder?: string
  /** Адрес на экране отправки: его показывают, чтобы заметить опечатку. */
  email?: string
  state?: "form" | "sent"
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: восстановление пароля с честным ответом. Текст после отправки
// намеренно не говорит, существует ли такая почта: иначе форма превращается в
// проверку чужих адресов. Отсюда же формулировка «если адрес зарегистрирован».
// Экран «письмо отправлено» показывает адрес, чтобы человек заметил опечатку,
// и даёт кнопку повторной отправки — без неё остаётся только перезагружать
// страницу. Оба состояния живут в одном блоке и переключаются пропом.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="auth-003"]){
--vibeui-auth-003-bg:transparent;
--vibeui-auth-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-auth-003-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-auth-003-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-auth-003-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.16 39.8));
--vibeui-auth-003-on-accent:oklch(0.15 0.02 39.8);
--vibeui-auth-003-ok:light-dark(oklch(0.58 0.14 152),oklch(0.74 0.13 152));
--vibeui-auth-003-ok-soft:light-dark(oklch(0.58 0.14 152 / 14%),oklch(0.74 0.13 152 / 20%));
--vibeui-auth-003-chip:light-dark(oklch(0.55 0 265 / 8%),oklch(0.85 0 265 / 12%));
--vibeui-auth-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-003"]{color-scheme:dark}
[data-vibeui-block="auth-003"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:23rem;box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-auth-003-bg);
border:1px solid var(--vibeui-auth-003-border);border-radius:1rem;
font-family:var(--vibeui-auth-003-sans);color:var(--vibeui-auth-003-fg);
}
[data-vibeui-block="auth-003"] *{box-sizing:border-box}
[data-vibeui-block="auth-003"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="auth-003"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-003-muted)}
[data-vibeui-block="auth-003"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.875rem}
[data-vibeui-block="auth-003"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-003"] input{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-003-border);border-radius:0.625rem;
background:var(--vibeui-auth-003-bg);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-003"] input:focus-visible{outline:2px solid var(--vibeui-auth-003-accent);outline-offset:1px;border-color:var(--vibeui-auth-003-accent)}
[data-vibeui-block="auth-003"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.625rem;padding:0.375rem 1rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-003-accent);color:var(--vibeui-auth-003-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-003"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-003-accent);outline-offset:2px}
/* Экран отправки: значок подтверждает действие, а адрес ловит опечатку. */
[data-vibeui-block="auth-003"] [data-part="badge"]{
display:flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;margin-bottom:0.75rem;
border-radius:9999px;background:var(--vibeui-auth-003-ok-soft);
color:var(--vibeui-auth-003-ok);font-size:1.125rem;line-height:1;
}
[data-vibeui-block="auth-003"] [data-part="mail"]{
display:inline-block;margin:0 0 0.875rem;padding:0.25rem 0.5rem;
border-radius:0.5rem;background:var(--vibeui-auth-003-chip);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="auth-003"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="auth-003"] [data-part="resend"]{
appearance:none;cursor:pointer;height:2.375rem;padding:0 0.875rem;
border:1px solid var(--vibeui-auth-003-border);border-radius:0.625rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="auth-003"] [data-part="resend"]:focus-visible{outline:2px solid var(--vibeui-auth-003-accent);outline-offset:2px}
[data-vibeui-block="auth-003"] [data-part="back"]{
display:inline-block;margin-top:0.875rem;font-size:0.8125rem;color:var(--vibeui-auth-003-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-003"] *{animation:none!important;transition:none!important}}
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
 * Восстановление пароля: ответ не раскрывает, существует ли адрес.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth003({
  title = "Восстановление доступа",
  lead = "Введите почту — пришлём ссылку для смены пароля. Ссылка живёт час.",
  submit = "Прислать ссылку",
  sentTitle = "Проверьте почту",
  sentText = "Если адрес зарегистрирован, письмо со ссылкой уже отправлено. Ссылка действует час.",
  resend = "Отправить ещё раз",
  back = "Вернуться ко входу",
  emailLabel = "Почта",
  emailPlaceholder = "name@company.ru",
  email = "anna@vibeui.ru",
  state = "form",
  background = "",
  accent,
  className,
  style,
}: Auth003Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-003"
        className={className}
        style={palette}
        aria-label={state === "sent" ? sentTitle : title}
      >
        {state === "sent" ? (
          <>
            <span data-part="badge" aria-hidden="true">
              ✓
            </span>
            <h2>{sentTitle}</h2>
            <p data-part="mail">{email}</p>
            <p data-part="lead">{sentText}</p>
            <div data-part="actions">
              <button type="button" data-part="resend">
                {resend}
              </button>
            </div>
            <a data-part="back" href="#">
              {back}
            </a>
          </>
        ) : (
          <>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
            <form>
              <div data-part="field">
                <label htmlFor="vibeui-auth-003-email">{emailLabel}</label>
                <input
                  id="vibeui-auth-003-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder={emailPlaceholder}
                  required
                />
              </div>
              <button type="submit" data-part="submit">
                {submit}
              </button>
            </form>
            <a data-part="back" href="#">
              {back}
            </a>
          </>
        )}
      </section>
    </>
  )
}
