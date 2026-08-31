import type { CSSProperties } from "react"

export type Cta003Props = {
  title?: string
  description?: string
  placeholder?: string
  submitLabel?: string
  consent?: string
  frequency?: string
  subscribers?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв с формой почты. Форма настоящая, неуправляемая: работает до
// гидратации и не требует состояния, поэтому блок остаётся серверным.
// Подпись поля видимая, а не placeholder-заглушка: подпись внутри поля
// исчезает ровно тогда, когда она нужнее всего — при заполнении.
const STYLES = `
:where([data-vibeui-block="cta-003"]){
--vibeui-cta-003-bg:oklch(0.97 0.012 96);
--vibeui-cta-003-ink:oklch(0.24 0.03 70);
--vibeui-cta-003-muted:oklch(0.5 0.025 70);
--vibeui-cta-003-border:oklch(0.87 0.02 90);
--vibeui-cta-003-field:oklch(1 0 0);
--vibeui-cta-003-accent:oklch(0.48 0.13 42);
--vibeui-cta-003-accent-fg:oklch(0.99 0 0);
--vibeui-cta-003-serif:ui-serif,Georgia,"Times New Roman",serif;
--vibeui-cta-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="cta-003"]{
display:block;background:var(--vibeui-cta-003-bg);color:var(--vibeui-cta-003-ink);
font-family:var(--vibeui-cta-003-font);
border-top:1px solid var(--vibeui-cta-003-border);
border-bottom:1px solid var(--vibeui-cta-003-border);
}
[data-vibeui-block="cta-003"] [data-part="shell"]{
max-width:56rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="cta-003"] [data-part="title"]{
margin:0;max-width:20ch;
font-family:var(--vibeui-cta-003-serif);
font-size:clamp(1.625rem,5.4cqi,2.75rem);line-height:1.12;letter-spacing:-0.02em;font-weight:600;
}
[data-vibeui-block="cta-003"] [data-part="text"]{
margin:0.75rem 0 0;max-width:56ch;
color:var(--vibeui-cta-003-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="cta-003"] [data-part="form"]{
display:grid;gap:0.625rem;margin-top:1.75rem;
}
[data-vibeui-block="cta-003"] [data-part="label"]{
font-size:0.8125rem;font-weight:620;letter-spacing:0.01em;
}
[data-vibeui-block="cta-003"] [data-part="row"]{display:grid;gap:0.5rem}
[data-vibeui-block="cta-003"] [data-part="input"]{
height:3rem;padding:0 1rem;min-width:0;
border:1px solid var(--vibeui-cta-003-border);border-radius:0.75rem;
background:var(--vibeui-cta-003-field);color:inherit;
font:inherit;font-size:1rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="cta-003"] [data-part="input"]::placeholder{color:color-mix(in oklab,var(--vibeui-cta-003-muted) 70%,transparent)}
[data-vibeui-block="cta-003"] [data-part="input"]:focus{
outline:none;border-color:var(--vibeui-cta-003-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-cta-003-accent) 20%,transparent);
}
[data-vibeui-block="cta-003"] [data-part="submit"]{
appearance:none;cursor:pointer;border:0;
height:3rem;padding:0 1.5rem;border-radius:0.75rem;
background:var(--vibeui-cta-003-accent);color:var(--vibeui-cta-003-accent-fg);
font:inherit;font-size:1rem;font-weight:640;white-space:nowrap;
transition:background-color .18s ease;
}
[data-vibeui-block="cta-003"] [data-part="submit"]:hover{background:color-mix(in oklab,var(--vibeui-cta-003-accent) 86%,black)}
[data-vibeui-block="cta-003"] [data-part="consent"]{
margin:0;color:var(--vibeui-cta-003-muted);font-size:0.75rem;line-height:1.5;max-width:52ch;
}
[data-vibeui-block="cta-003"] [data-part="meta"]{
display:flex;flex-wrap:wrap;gap:0.375rem 1rem;margin:1.25rem 0 0;padding:1rem 0 0;
border-top:1px solid var(--vibeui-cta-003-border);
color:var(--vibeui-cta-003-muted);font-size:0.8125rem;
}
[data-vibeui-block="cta-003"] [data-part="meta"] strong{color:var(--vibeui-cta-003-ink);font-weight:640}
[data-vibeui-block="cta-003"] input:focus-visible,
[data-vibeui-block="cta-003"] button:focus-visible{outline:2px solid var(--vibeui-cta-003-accent);outline-offset:2px}
@container (min-width: 38rem){
[data-vibeui-block="cta-003"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="cta-003"] [data-part="row"]{grid-template-columns:1fr auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-003"] *{animation:none!important;transition:none!important}}
`

/** Призыв с формой почты: настоящая форма с видимой подписью поля. */
export function Cta003({
  title = "Письмо о том, как делают интерфейсы",
  description = "Раз в две недели присылаем разбор одного экрана: что решили, что выкинули и почему. Без новостей отрасли и без «10 трендов года».",
  placeholder = "you@example.com",
  submitLabel = "Подписаться",
  consent = "Нажимая «Подписаться», вы соглашаетесь с политикой обработки данных. Отписка — одной ссылкой в любом письме.",
  frequency = "Два письма в месяц",
  subscribers = "6 400 читателей",
  accent,
  className,
  style,
}: Cta003Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <p data-part="text">{description}</p>
          <form data-part="form" action="#subscribe" method="post">
            <label data-part="label" htmlFor="vibeui-cta-003-email">
              Электронная почта
            </label>
            <div data-part="row">
              <input
                data-part="input"
                id="vibeui-cta-003-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder={placeholder}
              />
              <button data-part="submit" type="submit">
                {submitLabel}
              </button>
            </div>
            <p data-part="consent">{consent}</p>
          </form>
          <p data-part="meta">
            <strong>{frequency}</strong>
            <span>{subscribers}</span>
          </p>
        </div>
      </section>
    </>
  )
}
