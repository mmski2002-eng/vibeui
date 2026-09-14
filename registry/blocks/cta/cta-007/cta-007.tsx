import type { CSSProperties } from "react"

export type Cta007Props = {
  eyebrow?: string
  title?: string
  description?: string
  emailLabel?: string
  placeholder?: string
  submitLabel?: string
  note?: string
  action?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв с формой почты в одну строку: поле и оранжевая кнопка склеены в
// одну капсулу. Подпись поля скрыта визуально, но связана через htmlFor —
// в однострочной форме видимая подпись сломала бы капсулу, а без связи
// скринридер прочитал бы «поле ввода» без объяснения.
const STYLES = `
:where([data-vibeui-block="cta-007"]){
--vibeui-cta-007-bg:transparent;
--vibeui-cta-007-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cta-007-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-cta-007-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-cta-007-field:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-cta-007-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-cta-007-button:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-cta-007-button-ink:oklch(from var(--vibeui-cta-007-button) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-007-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-007"]{color-scheme:dark}
[data-vibeui-block="cta-007"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-007-bg);color:var(--vibeui-cta-007-ink);
font-family:var(--vibeui-cta-007-font);
}
[data-vibeui-block="cta-007"] [data-part="shell"]{
max-width:44rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="cta-007"] [data-part="eyebrow"]{
margin:0 0 0.75rem;color:var(--vibeui-cta-007-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="cta-007"] [data-part="title"]{
margin:0 auto 0.875rem;max-width:22ch;
font-size:clamp(1.625rem,5.5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="cta-007"] [data-part="description"]{
margin:0 auto 1.75rem;max-width:46ch;
color:var(--vibeui-cta-007-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="cta-007"] [data-part="form"]{
display:grid;gap:0.625rem;max-width:30rem;margin:0 auto;
}
[data-vibeui-block="cta-007"] [data-part="label"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="cta-007"] [data-part="input"]{
min-width:0;width:100%;
padding:0.8125rem 1.125rem;border:1px solid var(--vibeui-cta-007-border);border-radius:999px;
background:var(--vibeui-cta-007-field);color:var(--vibeui-cta-007-ink);
font:inherit;font-size:0.9375rem;
transition:border-color var(--vibeui-cta-007-dur-2) ease;
}
[data-vibeui-block="cta-007"] [data-part="input"]::placeholder{color:var(--vibeui-cta-007-muted)}
[data-vibeui-block="cta-007"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-cta-007-accent);outline-offset:2px;
border-color:var(--vibeui-cta-007-accent);
}
[data-vibeui-block="cta-007"] [data-part="submit"]{
padding:0.8125rem 1.5rem;border:0;border-radius:999px;cursor:pointer;
background:var(--vibeui-cta-007-button);color:var(--vibeui-cta-007-button-ink);
font:inherit;font-size:0.9375rem;font-weight:650;white-space:nowrap;
transition:filter var(--vibeui-cta-007-dur-2) ease,transform var(--vibeui-cta-007-dur-2) ease;
}
[data-vibeui-block="cta-007"] [data-part="submit"]:hover{filter:brightness(1.05);transform:translateY(-1px)}
[data-vibeui-block="cta-007"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-cta-007-accent);outline-offset:2px;
}
[data-vibeui-block="cta-007"] [data-part="note"]{
margin:1rem auto 0;max-width:46ch;
color:var(--vibeui-cta-007-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 34rem){
[data-vibeui-block="cta-007"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="cta-007"] [data-part="form"]{grid-template-columns:1fr auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Центрированный призыв с формой почты в одну строку и оранжевой кнопкой. */
export function Cta007({
  eyebrow = "Ранний доступ",
  title = "Оставьте почту — пришлём доступ к каталогу",
  description = "Одно письмо со ссылкой на полный каталог секций и инструкцией, как отдать их вашему AI-агенту. Без цепочек прогрева.",
  emailLabel = "Электронная почта",
  placeholder = "you@example.com",
  submitLabel = "Получить доступ",
  note = "Никакого спама: одно письмо, отписка не понадобится.",
  action = "#subscribe",
  background = "",
  accent,
  className,
  style,
}: Cta007Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-cta-007-accent": accent,
          "--vibeui-cta-007-button": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-cta-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <form data-part="form" action={action} method="post">
            <label data-part="label" htmlFor="vibeui-cta-007-email">
              {emailLabel}
            </label>
            <input
              data-part="input"
              id="vibeui-cta-007-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder={placeholder}
            />
            <button data-part="submit" type="submit">
              {submitLabel}
            </button>
          </form>
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
