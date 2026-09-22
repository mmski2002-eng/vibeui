import type { CSSProperties, ComponentProps } from "react"

export type Testimonials015Props = {
  quote?: string
  name?: string
  role?: string
  company?: string
  logosLabel?: string
  logos?: string[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Крупная цитата с плашкой компании и строкой логотипов клиентов. Один
// голос убеждает, строка логотипов показывает, что он не единственный.
// Логотипы набраны текстом: чужие SVG в registry-блоке — это обещание
// прав на чужие знаки, а словесные метки заменяются своими за минуту.
const STYLES = `
:where([data-vibeui-block="testimonials-015"]){
--vibeui-testimonials-015-bg:transparent;
--vibeui-testimonials-015-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-testimonials-015-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-015-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-015-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-testimonials-015-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-testimonials-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-015"]{color-scheme:dark}
[data-vibeui-block="testimonials-015"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-015-bg);color:var(--vibeui-testimonials-015-ink);
font-family:var(--vibeui-testimonials-015-font);
}
[data-vibeui-block="testimonials-015"] [data-part="shell"]{
max-width:60rem;margin:0 auto;padding:3.5rem 1.25rem;text-align:center;
}
[data-vibeui-block="testimonials-015"] [data-part="figure"]{margin:0;display:grid;gap:1.75rem;justify-items:center}
[data-vibeui-block="testimonials-015"] [data-part="quote"]{
margin:0;max-width:36ch;
font-size:clamp(1.375rem,4.2cqi,2.25rem);line-height:1.3;letter-spacing:-0.02em;font-weight:600;
text-wrap:balance;
}
[data-vibeui-block="testimonials-015"] [data-part="quote"]::before{content:"«";color:var(--vibeui-testimonials-015-accent)}
[data-vibeui-block="testimonials-015"] [data-part="quote"]::after{content:"»";color:var(--vibeui-testimonials-015-accent)}
[data-vibeui-block="testimonials-015"] [data-part="company"]{
display:inline-flex;align-items:center;gap:0.75rem;
padding:0.625rem 1.125rem 0.625rem 0.625rem;border-radius:999px;
border:1px solid var(--vibeui-testimonials-015-border);
background:var(--vibeui-testimonials-015-card);
}
[data-vibeui-block="testimonials-015"] [data-part="company-mark"]{
width:2.25rem;height:2.25rem;flex:none;border-radius:999px;
display:grid;place-items:center;
background:color-mix(in oklab,var(--vibeui-testimonials-015-accent) 14%,var(--vibeui-testimonials-015-card));
color:var(--vibeui-testimonials-015-accent);
font-size:0.8125rem;font-weight:750;letter-spacing:0.02em;
}
[data-vibeui-block="testimonials-015"] [data-part="company-who"]{display:grid;gap:0.0625rem;text-align:left}
[data-vibeui-block="testimonials-015"] [data-part="name"]{font-size:0.9375rem;font-weight:640}
[data-vibeui-block="testimonials-015"] [data-part="role"]{color:var(--vibeui-testimonials-015-muted);font-size:0.8125rem;line-height:1.35}
[data-vibeui-block="testimonials-015"] [data-part="clients"]{
margin-top:2.75rem;padding-top:1.75rem;
border-top:1px solid var(--vibeui-testimonials-015-border);
}
[data-vibeui-block="testimonials-015"] [data-part="clients-label"]{
margin:0 0 1.25rem;color:var(--vibeui-testimonials-015-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="testimonials-015"] [data-part="logos"]{
margin:0;padding:0;list-style:none;
display:flex;flex-wrap:wrap;justify-content:center;
column-gap:2.5rem;row-gap:1rem;
}
@container (min-width: 44rem){
[data-vibeui-block="testimonials-015"] [data-part="shell"]{padding:5.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-015"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="testimonials-015"] [data-part="logo"]{color:var(--vibeui-testimonials-015-muted);
font-size:1.0625rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
opacity:0.85;white-space:nowrap;}
`

const DEFAULT_LOGOS = [
  "Северный путь",
  "Sturm",
  "Плот",
  "Remark",
  "Верстак",
  "Слой",
]

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

function initials(text: string) {
  return text
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
}

type LogoProps = Omit<ComponentProps<"li">, "title" | "children"> & {
  logo?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Logo({
  logo = "Северный путь",
  accent,
  className,
  style,
  ...props
}: LogoProps) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <li
        {...props}
        className={className}
        style={palette}
      >
        {logo}
      </li>
  )
}

/** Крупная цитата с плашкой компании и строкой логотипов клиентов снизу. */
export function Testimonials015({
  quote = "Мы собрали новый маркетинговый сайт за спринт. Блоки легли в проект как родные, и агент ни разу не изобрёл ничего от себя.",
  name = "Дмитрий Хан",
  role = "Основатель",
  company = "Студия «Плот»",
  logosLabel = "Нам доверяют",
  logos = DEFAULT_LOGOS,
  background = "",
  accent,
  className,
  style,
}: Testimonials015Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <figure data-part="figure">
            <blockquote data-part="quote">{quote}</blockquote>
            <figcaption data-part="company">
              <span data-part="company-mark" aria-hidden="true">
                {initials(company)}
              </span>
              <span data-part="company-who">
                <span data-part="name">{name}</span>
                <span data-part="role">
                  {role}, {company}
                </span>
              </span>
            </figcaption>
          </figure>
          <div data-part="clients">
            <p data-part="clients-label">{logosLabel}</p>
            <ul data-part="logos">
              {logos.map((logo) => (
                <Logo key={logo} data-part="logo" logo={logo} accent={accent} />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
