import type { CSSProperties } from "react"

export type Auth013Props = {
  state?: "request" | "sent"
  title?: string
  lead?: string
  submit?: string
  email?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: вход по одноразовой ссылке — без пароля вообще. Главная
// проблема такого входа не техническая, а объяснительная: человек, впервые
// увидевший «мы пришлём ссылку», не понимает, почему у него не спрашивают
// пароль, и подозревает фишинг. Поэтому под формой стоит короткое «как это
// работает» из трёх пунктов, а на экране отправки — предупреждение, что
// ссылку нельзя пересылать: она и есть ключ от аккаунта.
// Оба состояния живут в одном блоке и переключаются пропом.
//
// Демонстрация интерфейса: письма не отправляются, срок ссылки задаёт сервер.
const STYLES = `
:where([data-vibeui-block="auth-013"]){
--vibeui-auth-013-bg:oklch(0.97 0.01 160);
--vibeui-auth-013-card:oklch(1 0 0);
--vibeui-auth-013-fg:oklch(0.22 0.016 165);
--vibeui-auth-013-muted:oklch(0.53 0.014 165);
--vibeui-auth-013-border:oklch(0.89 0.01 165);
--vibeui-auth-013-accent:oklch(0.52 0.13 165);
--vibeui-auth-013-warn:oklch(0.58 0.16 45);
--vibeui-auth-013-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-013"]{
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-013-bg);color:var(--vibeui-auth-013-fg);
font-family:var(--vibeui-auth-013-sans);
}
[data-vibeui-block="auth-013"] *{box-sizing:border-box}
[data-vibeui-block="auth-013"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;padding:1.75rem 1.5rem;
background:var(--vibeui-auth-013-card);
border:1px solid var(--vibeui-auth-013-border);border-radius:1.125rem;
}
@container (min-width: 40rem){
[data-vibeui-block="auth-013"] [data-part="shell"]{max-width:26rem;padding:2.25rem 2rem}
[data-vibeui-block="auth-013"] [data-part="how"]{grid-template-columns:1fr 1fr 1fr;gap:0.75rem}
[data-vibeui-block="auth-013"] [data-part="step"]{flex-direction:column;gap:0.375rem}
}
[data-vibeui-block="auth-013"] h2{margin:0 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-013"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-013-muted)}
[data-vibeui-block="auth-013"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.875rem}
[data-vibeui-block="auth-013"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-013"] input{
width:100%;height:2.625rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-013-border);border-radius:0.625rem;
background:var(--vibeui-auth-013-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-013"] input:focus-visible{outline:2px solid var(--vibeui-auth-013-accent);outline-offset:1px;border-color:var(--vibeui-auth-013-accent)}
[data-vibeui-block="auth-013"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.75rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-013-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-013"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-013-accent);outline-offset:2px}
[data-vibeui-block="auth-013"] [data-part="how"]{
display:grid;grid-template-columns:1fr;gap:0.625rem;
list-style:none;margin:1.125rem 0 0;padding:0.875rem;
border-radius:0.875rem;background:oklch(0.52 0.13 165 / 7%);
}
[data-vibeui-block="auth-013"] [data-part="step"]{display:flex;gap:0.5rem;font-size:0.75rem;line-height:1.45}
[data-vibeui-block="auth-013"] [data-part="num"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:9999px;
background:var(--vibeui-auth-013-accent);color:oklch(1 0 0);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="auth-013"] [data-part="glyph"]{
display:inline-flex;align-items:center;justify-content:center;
width:3rem;height:3rem;margin-bottom:0.875rem;border-radius:0.875rem;
background:oklch(0.52 0.13 165 / 12%);color:var(--vibeui-auth-013-accent);
font-size:1.375rem;line-height:1;
}
[data-vibeui-block="auth-013"] [data-part="mail"]{
display:inline-block;margin:0 0 1rem;padding:0.3125rem 0.625rem;
border-radius:0.5rem;background:oklch(0.55 0.02 165 / 8%);
font-size:0.8125rem;font-weight:650;word-break:break-all;
}
[data-vibeui-block="auth-013"] [data-part="warn"]{
display:flex;gap:0.5rem;margin:0 0 1rem;padding:0.6875rem 0.8125rem;
border:1px solid oklch(0.58 0.16 45 / 28%);border-radius:0.625rem;
background:oklch(0.58 0.16 45 / 8%);
color:var(--vibeui-auth-013-warn);font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="auth-013"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="auth-013"] [data-part="ghost"]{
appearance:none;cursor:pointer;height:2.375rem;padding:0 0.875rem;
border:1px solid var(--vibeui-auth-013-border);border-radius:0.625rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="auth-013"] [data-part="ghost"]:focus-visible{outline:2px solid var(--vibeui-auth-013-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-013"] *{animation:none!important;transition:none!important}}
`

const HOW = [
  "Вводите почту — пароль не нужен.",
  "Открываете письмо и жмёте кнопку внутри.",
  "Возвращаетесь сюда уже внутри аккаунта.",
]

/**
 * Вход по одноразовой ссылке: форма запроса с объяснением «как это работает»
 * и экран отправки. Один файл, ноль зависимостей.
 */
export function Auth013({
  state = "request",
  title = "Вход без пароля",
  lead = "Пришлём одноразовую ссылку на почту. Пароль придумывать не нужно.",
  submit = "Прислать ссылку",
  email = "anna@vibeui.ru",
  accent,
  className,
  style,
}: Auth013Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-013"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          {state === "sent" ? (
            <>
              <span data-part="glyph" aria-hidden="true">
                →
              </span>
              <h2>Ссылка отправлена</h2>
              <p data-part="mail">{email}</p>
              <p data-part="lead">
                Откройте письмо на этом же устройстве — ссылка привязана к
                браузеру, из которого её запросили. Она живёт 15 минут и
                срабатывает один раз.
              </p>
              <p data-part="warn">
                <span aria-hidden="true">!</span>
                <span>
                  Не пересылайте письмо: ссылка внутри — это и есть ключ от
                  аккаунта.
                </span>
              </p>
              <div data-part="actions">
                <button type="button" data-part="ghost">
                  Отправить ещё раз
                </button>
                <button type="button" data-part="ghost">
                  Другой адрес
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>{title}</h2>
              <p data-part="lead">{lead}</p>
              <form>
                <div data-part="field">
                  <label htmlFor="vibeui-auth-013-email">Почта</label>
                  <input
                    id="vibeui-auth-013-email"
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
              <ol data-part="how">
                {HOW.map((step, index) => (
                  <li key={step} data-part="step">
                    <span data-part="num" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </section>
    </>
  )
}
