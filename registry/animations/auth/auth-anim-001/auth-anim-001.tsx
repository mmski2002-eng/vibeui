import type { ComponentProps, CSSProperties } from "react"

export type AuthAnim001Props = Omit<ComponentProps<"section">, "children"> & {
  title?: string
  description?: string
  googleLabel?: string
  githubLabel?: string
  dividerLabel?: string
  emailLabel?: string
  passwordLabel?: string
  submitLabel?: string
  accent?: string
  /** Дышащее свечение вокруг кнопки входа. */
  glow?: boolean
}

// Идея: компактная карточка входа — не секция лендинга, а виджет размером
// с activity-001. Поля и кнопки появляются по очереди (stagger fade+rise):
// задержка задаётся не nth-child, а инлайновым --vibeui-auth-anim-001-i,
// потому что соцкнопки, разделитель и поля формы лежат на разной глубине
// вложенности. Кнопка входа отдельно дышит мягким свечением — тот же приём
// «glow», что и в activity-001, только на самой кнопке, а не под карточкой.
const STYLES = `
:where([data-vibeui-block="auth-anim-001"]){
--vibeui-auth-anim-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-auth-anim-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-auth-anim-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-auth-anim-001-muted:color-mix(in oklab,var(--vibeui-auth-anim-001-fg) 58%,transparent);
--vibeui-auth-anim-001-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-auth-anim-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-auth-anim-001-accent-fg:oklch(from var(--vibeui-auth-anim-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-auth-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-anim-001"]{color-scheme:dark}
[data-vibeui-block="auth-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-auth-anim-001-fg);font-family:var(--vibeui-auth-anim-001-font);
}
[data-vibeui-block="auth-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="auth-anim-001"] [data-part="frame"]{
padding:0.375rem;border-radius:1.5rem;border:1px solid var(--vibeui-auth-anim-001-border);
background:color-mix(in oklab,var(--vibeui-auth-anim-001-frame) 75%,transparent);
}
[data-vibeui-block="auth-anim-001"] [data-part="card"]{
border-radius:1.1875rem;border:1px solid var(--vibeui-auth-anim-001-border);
background:var(--vibeui-auth-anim-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:1.5rem 1.375rem 1.375rem;display:flex;flex-direction:column;gap:1.125rem;
}
[data-vibeui-block="auth-anim-001"] [data-part="enter"]{
opacity:0;transform:translateY(10px);
animation:vibeui-auth-anim-001-rise .5s cubic-bezier(.16,1,.3,1) both;
animation-delay:calc(var(--vibeui-auth-anim-001-i,0) * 90ms + 60ms);
}
[data-vibeui-block="auth-anim-001"] [data-part="head"]{display:flex;flex-direction:column;gap:0.25rem;text-align:center}
[data-vibeui-block="auth-anim-001"] [data-part="htitle"]{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="auth-anim-001"] [data-part="hdesc"]{margin:0;font-size:0.75rem;color:var(--vibeui-auth-anim-001-muted)}
[data-vibeui-block="auth-anim-001"] [data-part="social"]{display:flex;gap:0.5rem}
[data-vibeui-block="auth-anim-001"] [data-part="social-btn"]{
flex:1;display:inline-flex;align-items:center;justify-content:center;gap:0.4375rem;
height:2.375rem;border-radius:0.75rem;border:1px solid var(--vibeui-auth-anim-001-border);
background:transparent;color:var(--vibeui-auth-anim-001-fg);
font-size:0.8125rem;font-weight:600;cursor:pointer;
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="auth-anim-001"] [data-part="social-btn"]:hover{
background:color-mix(in oklab,var(--vibeui-auth-anim-001-fg) 5%,transparent);
border-color:color-mix(in oklab,var(--vibeui-auth-anim-001-fg) 20%,transparent);
}
[data-vibeui-block="auth-anim-001"] [data-part="social-btn"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="auth-anim-001"] [data-part="divider"]{display:flex;align-items:center;gap:0.625rem}
[data-vibeui-block="auth-anim-001"] [data-part="dline"]{flex:1;height:1px;background:var(--vibeui-auth-anim-001-border)}
[data-vibeui-block="auth-anim-001"] [data-part="dlabel"]{font-size:0.6875rem;color:var(--vibeui-auth-anim-001-muted)}
[data-vibeui-block="auth-anim-001"] [data-part="form"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="auth-anim-001"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="auth-anim-001"] [data-part="flabel"]{font-size:0.75rem;font-weight:600;color:var(--vibeui-auth-anim-001-muted)}
[data-vibeui-block="auth-anim-001"] [data-part="input"]{
height:2.375rem;border-radius:0.75rem;border:1px solid var(--vibeui-auth-anim-001-border);
background:var(--vibeui-auth-anim-001-card);color:var(--vibeui-auth-anim-001-fg);
padding:0 0.75rem;font-size:0.8125rem;font-family:inherit;width:100%;
transition:border-color .15s ease,box-shadow .15s ease;
}
[data-vibeui-block="auth-anim-001"] [data-part="input"]:focus-visible{
outline:none;border-color:var(--vibeui-auth-anim-001-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-auth-anim-001-accent) 22%,transparent);
}
[data-vibeui-block="auth-anim-001"][data-glow="false"] [data-part="submit-glow"]{display:none}
[data-vibeui-block="auth-anim-001"] [data-part="submit-wrap"]{position:relative;margin-top:0.125rem}
[data-vibeui-block="auth-anim-001"] [data-part="submit-glow"]{
position:absolute;inset:-0.375rem;z-index:0;border-radius:1rem;
background:var(--vibeui-auth-anim-001-accent);filter:blur(11px);opacity:0.35;
animation:vibeui-auth-anim-001-pulse 2.6s ease-in-out infinite;
animation-delay:calc(var(--vibeui-auth-anim-001-i,0) * 90ms + .7s);
}
[data-vibeui-block="auth-anim-001"] [data-part="submit"]{
position:relative;z-index:1;width:100%;height:2.5rem;border:none;border-radius:0.8125rem;
background:var(--vibeui-auth-anim-001-accent);color:var(--vibeui-auth-anim-001-accent-fg);
font-size:0.875rem;font-weight:650;cursor:pointer;
transition:filter .15s ease,transform .15s ease;
}
[data-vibeui-block="auth-anim-001"] [data-part="submit"]:hover{filter:brightness(1.08)}
[data-vibeui-block="auth-anim-001"] [data-part="submit"]:active{transform:translateY(1px)}
@keyframes vibeui-auth-anim-001-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes vibeui-auth-anim-001-pulse{0%,100%{opacity:0.22;transform:scale(0.94)}50%{opacity:0.5;transform:scale(1.04)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="auth-anim-001"] [data-part="enter"]{animation:none;opacity:1;transform:none}
[data-vibeui-block="auth-anim-001"] [data-part="submit-glow"]{animation:none;opacity:0.3;transform:none}
}
`

const GOOGLE_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M23.04 12.27c0-.82-.07-1.42-.22-2.05H12.24v3.72h6.19c-.12 1.02-.8 2.56-2.31 3.6l-.02.14 3.36 2.6.23.02c2.14-1.97 3.35-4.87 3.35-8.03Z"
    />
    <path
      fill="#34A853"
      d="M12.24 23.5c3.04 0 5.6-1 7.46-2.71l-3.55-2.76c-.95.66-2.23 1.13-3.91 1.13a6.78 6.78 0 0 1-6.4-4.66l-.13.01-3.5 2.71-.05.13A11.5 11.5 0 0 0 12.24 23.5Z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.5a6.9 6.9 0 0 1-.37-2.23c0-.78.14-1.53.36-2.23l-.01-.15-3.55-2.76-.12.06a11.52 11.52 0 0 0 0 10.16l3.69-2.85Z"
    />
    <path
      fill="#EA4335"
      d="M12.24 5.38c2.11 0 3.54.92 4.35 1.68l3.18-3.11C17.83 2.17 15.28 1 12.24 1a11.5 11.5 0 0 0-10.29 6.36l3.68 2.85a6.83 6.83 0 0 1 6.61-4.83Z"
    />
  </svg>
)

const GITHUB_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12.14c0 5.16 3.29 9.53 7.86 11.08.58.11.79-.26.79-.57v-2.02c-3.2.71-3.87-1.4-3.87-1.4-.53-1.36-1.28-1.73-1.28-1.73-1.05-.73.08-.71.08-.71 1.16.08 1.77 1.22 1.77 1.22 1.03 1.79 2.7 1.27 3.36.97.1-.76.4-1.27.73-1.56-2.55-.3-5.24-1.31-5.24-5.83 0-1.29.45-2.34 1.19-3.16-.12-.3-.52-1.51.11-3.15 0 0 .97-.32 3.18 1.2a10.8 10.8 0 0 1 5.8 0c2.2-1.52 3.17-1.2 3.17-1.2.64 1.64.24 2.85.12 3.15.74.82 1.19 1.87 1.19 3.16 0 4.53-2.7 5.53-5.26 5.82.42.37.78 1.1.78 2.22v3.29c0 .32.21.69.8.57A11.75 11.75 0 0 0 23.5 12.14 11.5 11.5 0 0 0 12 .5Z" />
  </svg>
)

/**
 * Компактная карточка входа: соцкнопки, разделитель, поля и кнопка входа
 * появляются по очереди, кнопка мягко дышит свечением. Один файл, ноль
 * зависимостей, клиентского JS нет — поля некотролируемые (только вид).
 */
export function AuthAnim001({
  title = "Вход в аккаунт",
  description = "Продолжите с почтой или через соцсеть",
  googleLabel = "Google",
  githubLabel = "GitHub",
  dividerLabel = "или",
  emailLabel = "Email",
  passwordLabel = "Пароль",
  submitLabel = "Войти",
  accent,
  glow = true,
  className,
  style,
  ...props
}: AuthAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-auth-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const step = (index: number) =>
    ({ "--vibeui-auth-anim-001-i": index }) as CSSProperties

  return (
    <>
      <style href="vibeui-auth-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="auth-anim-001"
        data-slot="auth-card"
        data-glow={glow ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="card">
            <div data-part="enter" style={step(0)}>
              <div data-part="head">
                <h2 data-part="htitle">{title}</h2>
                {description ? <p data-part="hdesc">{description}</p> : null}
              </div>
            </div>

            <div data-part="enter" style={step(1)}>
              <div data-part="social">
                <button type="button" data-part="social-btn">
                  {GOOGLE_ICON}
                  {googleLabel}
                </button>
                <button type="button" data-part="social-btn">
                  {GITHUB_ICON}
                  {githubLabel}
                </button>
              </div>
            </div>

            <div data-part="enter" style={step(2)}>
              <div data-part="divider">
                <span data-part="dline" aria-hidden="true" />
                <span data-part="dlabel">{dividerLabel}</span>
                <span data-part="dline" aria-hidden="true" />
              </div>
            </div>

            <form data-part="form" onSubmit={(event) => event.preventDefault()}>
              <div data-part="enter" style={step(3)}>
                <label data-part="field">
                  <span data-part="flabel">{emailLabel}</span>
                  <input
                    data-part="input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div data-part="enter" style={step(4)}>
                <label data-part="field">
                  <span data-part="flabel">{passwordLabel}</span>
                  <input
                    data-part="input"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="********"
                  />
                </label>
              </div>

              <div data-part="enter" style={step(5)}>
                <div data-part="submit-wrap">
                  <span
                    data-part="submit-glow"
                    aria-hidden="true"
                    style={step(5)}
                  />
                  <button type="submit" data-part="submit">
                    {submitLabel}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
