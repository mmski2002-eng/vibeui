import type { CSSProperties } from "react"

type Cta001Action = {
  label: string
  href: string
}

export type Cta001Props = {
  eyebrow?: string
  title?: string
  description?: string
  primaryAction?: Cta001Action
  secondaryAction?: Cta001Action
  /** Мелкая строка под кнопками: снимает возражение перед кликом. */
  note?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// container-type делает секцию собственным query-контейнером: кегль заголовка
// считается в cqi от ширины блока, поэтому миниатюра каталога показывает тот
// же дизайн, что и живая страница, а не мобильную вёрстку.
//
// Идея блока: тёмное пятно в конце светлой страницы. Взгляд упирается в него,
// как в точку, и там стоит ровно одно главное действие — второе намеренно
// сделано ссылкой, а не второй кнопкой.
//
// Секция остаётся тёмной в любой теме — иначе пятно перестаёт быть пятном.
// Но темнота у неё разная: на тёмной странице фон уходит глубже, а границы
// и акцент становятся светлее, чтобы блок не сливался с окружением.
const STYLES = `
:where([data-vibeui-block="cta-001"]){
--vibeui-cta-001-bg:light-dark(oklch(0.21 0 265),oklch(0.16 0 265));
--vibeui-cta-001-ink:light-dark(oklch(0.98 0 265),oklch(0.95 0 265));
--vibeui-cta-001-muted:light-dark(oklch(0.76 0 265),oklch(0.71 0 265));
--vibeui-cta-001-accent:light-dark(oklch(0.72 0.16 39.8),oklch(0.79 0.15 39.8));
--vibeui-cta-001-accent-fg:light-dark(oklch(0.16 0 265),oklch(0.14 0 265));
--vibeui-cta-001-border:light-dark(oklch(1 0 0 / 14%),oklch(1 0 0 / 22%));
--vibeui-cta-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-001"]{color-scheme:dark}
[data-vibeui-block="cta-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-cta-001-bg);color:var(--vibeui-cta-001-ink);
font-family:var(--vibeui-cta-001-sans);
}
[data-vibeui-block="cta-001"] [data-part="frame"]{
position:relative;overflow:hidden;
max-width:72rem;margin:0 auto;padding:3.5rem 1.5rem;
display:flex;flex-direction:column;align-items:center;gap:0.875rem;text-align:center;
}
/* Свет из-за горизонта: одно пятно, не заливка. */
[data-vibeui-block="cta-001"] [data-part="glow"]{
position:absolute;inset:-40% 10% auto;height:22rem;pointer-events:none;
background:radial-gradient(50% 60% at 50% 50%,color-mix(in oklab,var(--vibeui-cta-001-accent) 40%,transparent),transparent 70%);
opacity:.5;
}
[data-vibeui-block="cta-001"] [data-part="eyebrow"]{
position:relative;
display:inline-flex;align-items:center;gap:0.4375rem;
padding:0.3125rem 0.6875rem;border-radius:9999px;
border:1px solid var(--vibeui-cta-001-border);
font-size:0.75rem;font-weight:600;letter-spacing:0.04em;
color:var(--vibeui-cta-001-accent);
}
[data-vibeui-block="cta-001"] [data-part="title"]{
position:relative;margin:0;max-width:20ch;
font-size:clamp(1.75rem,4.4cqi,3rem);line-height:1.08;letter-spacing:-0.025em;font-weight:680;
}
[data-vibeui-block="cta-001"] [data-part="description"]{
position:relative;margin:0;max-width:52ch;
font-size:clamp(0.9375rem,1.35cqi,1.0625rem);line-height:1.6;color:var(--vibeui-cta-001-muted);
}
[data-vibeui-block="cta-001"] [data-part="actions"]{
position:relative;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
gap:0.75rem;margin-top:0.625rem;
}
[data-vibeui-block="cta-001"] [data-part="primary"]{
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.25rem 1.375rem;
border-radius:0.625rem;
background:var(--vibeui-cta-001-accent);color:var(--vibeui-cta-001-accent-fg);
text-decoration:none;font-size:0.9375rem;font-weight:650;
transition:transform .16s ease,background-color .16s ease;
}
[data-vibeui-block="cta-001"] [data-part="primary"]:hover{transform:translateY(-1px);background:color-mix(in oklab,var(--vibeui-cta-001-accent) 88%,white)}
/* Второе действие — ссылка, а не вторая кнопка: выбор не должен раздваиваться. */
[data-vibeui-block="cta-001"] [data-part="secondary"]{
color:var(--vibeui-cta-001-ink);text-decoration:none;
font-size:0.9375rem;font-weight:500;
border-bottom:1px solid var(--vibeui-cta-001-border);
transition:border-color .16s ease;
}
[data-vibeui-block="cta-001"] [data-part="secondary"]:hover{border-bottom-color:currentColor}
[data-vibeui-block="cta-001"] [data-part="note"]{
position:relative;margin:0;font-size:0.8125rem;color:var(--vibeui-cta-001-muted);
}
[data-vibeui-block="cta-001"] a:focus-visible{outline:2px solid var(--vibeui-cta-001-accent);outline-offset:3px}
@container (min-width: 48rem){
[data-vibeui-block="cta-001"] [data-part="frame"]{padding:5.5rem 3rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cta-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="cta-001"] [data-part="primary"]:hover{transform:none}
}
`

/**
 * Финальная секция призыва: одно главное действие в тёмном пятне.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cta001({
  eyebrow = "Свободно 5 из 5 мест на март",
  title = "Соберите первую страницу сегодня",
  description = "Выберите блоки, отдайте ссылку своему ИИ-агенту и получите страницу, которая выглядит ровно так, как в превью.",
  primaryAction = { label: "Начать бесплатно", href: "#start" },
  secondaryAction = { label: "Посмотреть примеры", href: "#cases" },
  note = "Без карты. 14 дней полного доступа.",
  accent,
  className,
  style,
}: Cta001Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-001"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <span data-part="glow" aria-hidden="true" />
          {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
          <h2 data-part="title">{title}</h2>
          {description ? <p data-part="description">{description}</p> : null}
          <div data-part="actions">
            {primaryAction ? (
              <a data-part="primary" href={primaryAction.href}>
                {primaryAction.label}
              </a>
            ) : null}
            {secondaryAction ? (
              <a data-part="secondary" href={secondaryAction.href}>
                {secondaryAction.label}
              </a>
            ) : null}
          </div>
          {note ? <p data-part="note">{note}</p> : null}
        </div>
      </section>
    </>
  )
}
