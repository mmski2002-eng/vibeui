import type { CSSProperties } from "react"

export type Hero004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  note?: string
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: самый спокойный вариант hero — только слова. Ни мокапа, ни
// картинки, ни свечения: воздух, волосяные линии сверху и снизу и одна пара
// кнопок по центру. Раскладка считается от собственной ширины блока, поэтому
// в узкой карточке каталога кнопки встают столбиком, а не расползаются.
const STYLES = `
:where([data-vibeui-block="hero-004"]){
--vibeui-hero-004-bg:transparent;
--vibeui-hero-004-fg:light-dark(oklch(0.21 0.012 95),oklch(0.95 0.006 95));
--vibeui-hero-004-muted:light-dark(oklch(0.52 0.012 95),oklch(0.73 0.01 95));
--vibeui-hero-004-line:light-dark(oklch(0.89 0.008 95),oklch(0.37 0.01 95));
--vibeui-hero-004-accent:light-dark(oklch(0.55 0.14 39.8),oklch(0.7 0.15 39.8));
--vibeui-hero-004-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-hero-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-004"]{color-scheme:dark}
[data-vibeui-block="hero-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-hero-004-bg);color:var(--vibeui-hero-004-fg);
font-family:var(--vibeui-hero-004-sans);
}
[data-vibeui-block="hero-004"] *{box-sizing:border-box}
[data-vibeui-block="hero-004"] [data-part="shell"]{
max-width:56rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;text-align:center;
}
[data-vibeui-block="hero-004"] [data-part="rule"]{height:1px;background:var(--vibeui-hero-004-line);margin:0 auto 2.25rem;width:100%;max-width:4rem}
[data-vibeui-block="hero-004"] [data-part="eyebrow"]{
margin:0 0 1.25rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-hero-004-accent);
}
[data-vibeui-block="hero-004"] h1{
margin:0;font-size:clamp(2rem,6.4cqi,3.75rem);line-height:1.06;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-004"] [data-part="lede"]{
margin:1.25rem auto 0;max-width:38rem;font-size:clamp(0.9375rem,1.6cqi,1.125rem);line-height:1.6;
color:var(--vibeui-hero-004-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-004"] [data-part="actions"]{
display:flex;flex-direction:column;align-items:stretch;gap:0.625rem;margin:2rem auto 0;max-width:22rem;
}
[data-vibeui-block="hero-004"] a{
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
height:2.875rem;padding:0 1.5rem;border-radius:0.625rem;
font-size:0.9375rem;font-weight:600;text-decoration:none;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="hero-004"] [data-part="primary"]{background:var(--vibeui-hero-004-accent);color:var(--vibeui-hero-004-accent-fg);border:1px solid transparent}
[data-vibeui-block="hero-004"] [data-part="primary"]:hover{background:color-mix(in oklab,var(--vibeui-hero-004-accent) 86%,black)}
[data-vibeui-block="hero-004"] [data-part="secondary"]{border:1px solid var(--vibeui-hero-004-line);color:var(--vibeui-hero-004-fg);background:transparent}
[data-vibeui-block="hero-004"] [data-part="secondary"]:hover{border-color:var(--vibeui-hero-004-fg)}
[data-vibeui-block="hero-004"] a:focus-visible{outline:2px solid var(--vibeui-hero-004-accent);outline-offset:3px}
[data-vibeui-block="hero-004"] [data-part="note"]{
margin:1.25rem 0 0;font-size:0.8125rem;color:var(--vibeui-hero-004-muted);
}
[data-vibeui-block="hero-004"] [data-part="foot"]{height:1px;background:var(--vibeui-hero-004-line);margin:2.5rem auto 0;width:100%;max-width:4rem}
@container (min-width: 34rem){
[data-vibeui-block="hero-004"] [data-part="actions"]{flex-direction:row;justify-content:center;max-width:none}
[data-vibeui-block="hero-004"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-004"] [data-part="shell"]{padding:7rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
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

/** Спокойный текстовый hero: заголовок, подзаголовок и пара кнопок по центру. */
export function Hero004({
  eyebrow = "Запуск открыт",
  title = "Соберите лендинг за вечер, а не за спринт",
  lede = "Готовые секции, которые понимает ваш ИИ-агент. Выбираете дизайн, отдаёте инструкцию — получаете страницу, а не заготовку.",
  primary = { label: "Начать бесплатно", href: "#" },
  secondary = { label: "Смотреть каталог", href: "#" },
  note = "Без карты. Первые десять секций — навсегда бесплатно.",
  accent,
  background = "",
  className,
  style,
}: Hero004Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="rule" aria-hidden="true" />
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="actions">
            <a data-part="primary" href={primary.href}>
              {primary.label}
            </a>
            <a data-part="secondary" href={secondary.href}>
              {secondary.label}
            </a>
          </div>
          {note ? <p data-part="note">{note}</p> : null}
          <div data-part="foot" aria-hidden="true" />
        </div>
      </section>
    </>
  )
}
