import type { CSSProperties } from "react"

export type Cta003Props = {
  title?: string
  description?: string
  /** Видимая подпись поля почты. */
  emailLabel?: string
  placeholder?: string
  submitLabel?: string
  consent?: string
  frequency?: string
  subscribers?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв с формой почты. Форма настоящая, неуправляемая: работает до
// гидратации и не требует состояния, поэтому блок остаётся серверным.
// Подпись поля видимая, а не placeholder-заглушка: подпись внутри поля
// исчезает ровно тогда, когда она нужнее всего — при заполнении.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, поле и линейки темнеют вместе со страницей.
const STYLES = `
:where([data-vibeui-block="cta-003"]){
--vibeui-cta-003-bg:transparent;
--vibeui-cta-003-ink:light-dark(oklch(0.24 0.03 70),oklch(0.94 0.012 80));
--vibeui-cta-003-muted:light-dark(oklch(0.5 0.025 70),oklch(0.74 0.018 80));
--vibeui-cta-003-border:light-dark(oklch(0.87 0.02 90),oklch(0.37 0.018 80));
--vibeui-cta-003-field:light-dark(oklch(1 0 0),oklch(0.25 0.014 80));
--vibeui-cta-003-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-cta-003-accent-fg:oklch(from var(--vibeui-cta-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-003-serif:ui-serif,Georgia,"Times New Roman",serif;
--vibeui-cta-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-003"]{color-scheme:dark}
[data-vibeui-block="cta-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
display:inline-flex;align-items:center;justify-content:center;
min-height:3rem;padding:0.25rem 1.5rem;border-radius:0.75rem;
background:var(--vibeui-cta-003-accent);color:oklch(from var(--vibeui-cta-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
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

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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

/** Призыв с формой почты: настоящая форма с видимой подписью поля. */
export function Cta003({
  title = "Письмо о том, как делают интерфейсы",
  description = "Раз в две недели присылаем разбор одного экрана: что решили, что выкинули и почему. Без новостей отрасли и без «10 трендов года».",
  emailLabel = "Электронная почта",
  placeholder = "you@example.com",
  submitLabel = "Подписаться",
  consent = "Нажимая «Подписаться», вы соглашаетесь с политикой обработки данных. Отписка — одной ссылкой в любом письме.",
  frequency = "Два письма в месяц",
  subscribers = "6 400 читателей",
  background = "",
  accent,
  className,
  style,
}: Cta003Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cta-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
              {emailLabel}
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
