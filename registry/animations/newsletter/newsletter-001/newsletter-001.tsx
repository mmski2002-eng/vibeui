import type { ComponentProps, CSSProperties } from "react"

export type Newsletter001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Мелкая строка под формой. */
  fineText?: string
  title?: string
  description?: string
  placeholder?: string
  buttonLabel?: string
  accent?: string
}

// Идея: полноширинная секция подписки на рассылку — заголовок, подтекст и
// строка «поле email + кнопка». Кнопка сама зацикленно проигрывает демо
// отправки: подпись гаснет, вместо неё проступает галочка успеха и фон
// кнопки на мгновение зеленеет, затем всё возвращается в исходное
// состояние. Подпись и галочка — два слоя друг на друге с одним общим
// таймингом keyframes, поэтому переход не дёргает раскладку кнопки.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит секцию в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
//
// container-type делает секцию собственным query-контейнером: строка формы
// переключается со столбца на ряд по ширине секции, а не по ширине окна.
const STYLES = `
:where([data-vibeui-block="newsletter-001"]){
--vibeui-newsletter-001-bg:transparent;
--vibeui-newsletter-001-fg:light-dark(oklch(0.2 0 266),oklch(0.97 0 266));
--vibeui-newsletter-001-muted:light-dark(oklch(0.48 0 266),oklch(0.74 0 266));
--vibeui-newsletter-001-border:light-dark(oklch(0.16 0 266 / 16%),oklch(1 0 0 / 18%));
--vibeui-newsletter-001-field:light-dark(oklch(1 0 0),oklch(0.24 0 266));
--vibeui-newsletter-001-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.163 264));
--vibeui-newsletter-001-accent-fg:light-dark(oklch(0.99 0 266),oklch(0.17 0 266));
--vibeui-newsletter-001-success:light-dark(oklch(0.62 0.16 152),oklch(0.68 0.15 152));
--vibeui-newsletter-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="newsletter-001"]{color-scheme:dark}
[data-vibeui-block="newsletter-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);
background:var(--vibeui-newsletter-001-bg);color:var(--vibeui-newsletter-001-fg);
font-family:var(--vibeui-newsletter-001-font);
container-type:inline-size;
}
[data-vibeui-block="newsletter-001"] *{box-sizing:border-box}
[data-vibeui-block="newsletter-001"] [data-part="frame"]{
display:flex;flex-direction:column;align-items:center;text-align:center;
padding:clamp(2.5rem,10cqi,5rem) clamp(1.25rem,6cqi,2.5rem);
}
[data-vibeui-block="newsletter-001"] [data-part="title"]{
margin:0;max-width:34rem;font-size:clamp(1.625rem,5.5cqi,2.5rem);
line-height:1.15;font-weight:650;letter-spacing:-0.015em;text-wrap:balance;
}
[data-vibeui-block="newsletter-001"] [data-part="desc"]{
margin:0.75rem 0 0;max-width:30rem;font-size:clamp(0.9375rem,2cqi,1.0625rem);
line-height:1.6;color:var(--vibeui-newsletter-001-muted);text-wrap:pretty;
}
[data-vibeui-block="newsletter-001"] [data-part="form"]{
display:flex;flex-direction:column;width:100%;max-width:24rem;gap:0.625rem;margin-top:1.75rem;
}
@container (min-width:30rem){
[data-vibeui-block="newsletter-001"] [data-part="form"]{
flex-direction:row;max-width:28rem;padding:0.3125rem;border-radius:9999px;
border:1px solid var(--vibeui-newsletter-001-border);background:var(--vibeui-newsletter-001-field);
}
[data-vibeui-block="newsletter-001"] [data-part="input"]{border:0;border-radius:9999px;padding-left:1rem}
}
[data-vibeui-block="newsletter-001"] [data-part="input"]{
height:2.875rem;padding:0 1.125rem;border-radius:9999px;
border:1px solid var(--vibeui-newsletter-001-border);background:var(--vibeui-newsletter-001-field);
color:var(--vibeui-newsletter-001-fg);font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="newsletter-001"] [data-part="input"]::placeholder{color:var(--vibeui-newsletter-001-muted)}
[data-vibeui-block="newsletter-001"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-newsletter-001-accent);outline-offset:2px;
}
[data-vibeui-block="newsletter-001"] [data-part="button"]{
position:relative;flex:none;appearance:none;border:0;cursor:default;
height:2.875rem;min-width:9.5rem;padding:0 1.5rem;border-radius:9999px;
font:inherit;font-size:0.9375rem;font-weight:600;color:var(--vibeui-newsletter-001-accent-fg);
background:var(--vibeui-newsletter-001-accent);
animation:vibeui-newsletter-001-btnbg 6s ease-in-out infinite;
}
[data-vibeui-block="newsletter-001"] [data-part="btn-label"],
[data-vibeui-block="newsletter-001"] [data-part="btn-check"]{
position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:0.375rem;
}
[data-vibeui-block="newsletter-001"] [data-part="btn-label"]{
animation:vibeui-newsletter-001-label 6s ease-in-out infinite;
}
[data-vibeui-block="newsletter-001"] [data-part="btn-check"]{
animation:vibeui-newsletter-001-check 6s ease-in-out infinite;
}
[data-vibeui-block="newsletter-001"] [data-part="btn-check"] svg{width:1.125rem;height:1.125rem}
[data-vibeui-block="newsletter-001"] [data-part="fine"]{
margin-top:0.75rem;font-size:0.75rem;color:var(--vibeui-newsletter-001-muted);
}
[data-vibeui-block="newsletter-001"] [data-part="sr-only"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@keyframes vibeui-newsletter-001-label{
0%,60%{opacity:1;transform:scale(1)}
68%,88%{opacity:0;transform:scale(0.6)}
96%,100%{opacity:1;transform:scale(1)}
}
@keyframes vibeui-newsletter-001-check{
0%,60%{opacity:0;transform:scale(0.6)}
68%,88%{opacity:1;transform:scale(1)}
96%,100%{opacity:0;transform:scale(0.6)}
}
@keyframes vibeui-newsletter-001-btnbg{
0%,60%{background:var(--vibeui-newsletter-001-accent)}
70%,86%{background:var(--vibeui-newsletter-001-success)}
96%,100%{background:var(--vibeui-newsletter-001-accent)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="newsletter-001"] [data-part="button"],
[data-vibeui-block="newsletter-001"] [data-part="btn-label"],
[data-vibeui-block="newsletter-001"] [data-part="btn-check"]{animation:none}
[data-vibeui-block="newsletter-001"] [data-part="btn-check"]{opacity:0}
}
`

const CHECK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

/**
 * Секция подписки на рассылку: заголовок, поле email и кнопка, которая
 * зацикленно проигрывает демо отправки — подпись сменяется галочкой успеха
 * и обратно. Один файл, ноль зависимостей, собственная палитра.
 */
export function Newsletter001({
  fineText = "Отписаться можно в любой момент.",
  title = "Будьте в курсе обновлений",
  description = "Раз в две недели — главное о продукте, без спама и рассылок «на всякий случай».",
  placeholder = "you@company.com",
  buttonLabel = "Подписаться",
  accent,
  className,
  style,
  ...props
}: Newsletter001Props) {
  const palette = {
    ...(accent ? { "--vibeui-newsletter-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-newsletter-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="newsletter-001"
        data-slot="newsletter"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <h2 data-part="title">{title}</h2>
          {description ? <p data-part="desc">{description}</p> : null}
          <div data-part="form">
            <label data-part="sr-only" htmlFor="newsletter-001-email">
              Email
            </label>
            <input
              data-part="input"
              id="newsletter-001-email"
              type="email"
              placeholder={placeholder}
              autoComplete="email"
            />
            <button data-part="button" type="button">
              <span data-part="btn-label" aria-hidden="true">
                {buttonLabel}
              </span>
              <span data-part="btn-check" aria-hidden="true">
                {CHECK}
              </span>
            </button>
          </div>
          <p data-part="fine">{fineText}</p>
        </div>
      </section>
    </>
  )
}
