import type { CSSProperties } from "react"

export type Auth003Props = {
  title?: string
  lead?: string
  submit?: string
  sentTitle?: string
  sentText?: string
  resend?: string
  back?: string
  state?: "form" | "sent"
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
const STYLES = `
:where([data-vibeui-block="auth-003"]){
--vibeui-auth-003-bg:oklch(1 0 0);
--vibeui-auth-003-fg:oklch(0.22 0.014 265);
--vibeui-auth-003-muted:oklch(0.55 0.014 265);
--vibeui-auth-003-border:oklch(0.9 0.006 265);
--vibeui-auth-003-accent:oklch(0.55 0.2 262);
--vibeui-auth-003-ok:oklch(0.58 0.14 152);
--vibeui-auth-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-003"]{
width:100%;max-width:23rem;box-sizing:border-box;padding:1.25rem;
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
width:100%;appearance:none;cursor:pointer;height:2.625rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-003-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-003"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-003-accent);outline-offset:2px}
/* Экран отправки: значок подтверждает действие, а адрес ловит опечатку. */
[data-vibeui-block="auth-003"] [data-part="badge"]{
display:flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;margin-bottom:0.75rem;
border-radius:9999px;background:oklch(0.58 0.14 152 / 14%);
color:var(--vibeui-auth-003-ok);font-size:1.125rem;line-height:1;
}
[data-vibeui-block="auth-003"] [data-part="mail"]{
display:inline-block;margin:0 0 0.875rem;padding:0.25rem 0.5rem;
border-radius:0.5rem;background:oklch(0.55 0.02 265 / 8%);
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
  state = "form",
  accent,
  className,
  style,
}: Auth003Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-003-accent": accent } : null),
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
            <p data-part="mail">anna@vibeui.ru</p>
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
                <label htmlFor="vibeui-auth-003-email">Почта</label>
                <input
                  id="vibeui-auth-003-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@company.ru"
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
