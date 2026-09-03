import type { CSSProperties } from "react"

type Footer004Link = {
  label: string
  href: string
}

export type Footer004Props = {
  brand?: string
  legal?: string
  links?: Footer004Link[]
  /** Подпись группы служебных ссылок для скринридера. */
  linksLabel?: string
  backLabel?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Минимальный подвал в одну строку. Нужен там, где страница короткая:
// подвал на четыре колонки под лендингом из двух экранов выглядит как
// чужая деталь. Ссылка «наверх» стоит справа и на узкой раскладке не
// прячется — на длинной странице она единственный быстрый путь обратно.
//
// Тема берётся из color-scheme окружения через light-dark(): подвал темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="footer-004"]){
--vibeui-footer-004-bg:transparent;
--vibeui-footer-004-ink:light-dark(oklch(0.22 0.012 255),oklch(0.94 0.006 255));
--vibeui-footer-004-muted:light-dark(oklch(0.52 0.012 255),oklch(0.7 0.012 255));
--vibeui-footer-004-border:light-dark(oklch(0.91 0.006 255),oklch(0.34 0.012 255));
--vibeui-footer-004-accent:light-dark(oklch(0.5 0.16 258),oklch(0.74 0.14 258));
--vibeui-footer-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-004"]{color-scheme:dark}
[data-vibeui-block="footer-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-footer-004-bg);color:var(--vibeui-footer-004-ink);
border-top:1px solid var(--vibeui-footer-004-border);
font-family:var(--vibeui-footer-004-font);
}
[data-vibeui-block="footer-004"] [data-part="shell"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.25rem;
max-width:76rem;margin:0 auto;padding:1.25rem;
}
[data-vibeui-block="footer-004"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;font-size:0.9375rem;font-weight:700;letter-spacing:-0.02em;
}
[data-vibeui-block="footer-004"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:999px;flex:none;background:var(--vibeui-footer-004-accent);
}
[data-vibeui-block="footer-004"] [data-part="legal"]{
margin:0;color:var(--vibeui-footer-004-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-004"] [data-part="links"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 1rem;
}
[data-vibeui-block="footer-004"] [data-part="links"] a{
color:var(--vibeui-footer-004-muted);text-decoration:none;font-size:0.8125rem;
transition:color .16s ease;
}
[data-vibeui-block="footer-004"] [data-part="links"] a:hover{color:var(--vibeui-footer-004-ink)}
[data-vibeui-block="footer-004"] [data-part="top"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-left:auto;flex:none;
color:var(--vibeui-footer-004-accent);text-decoration:none;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="footer-004"] [data-part="arrow"]{
width:0.5rem;height:0.5rem;flex:none;
border-left:1.5px solid currentColor;border-top:1.5px solid currentColor;
transform:rotate(45deg) translate(1px,1px);
}
[data-vibeui-block="footer-004"] a:focus-visible{outline:2px solid var(--vibeui-footer-004-accent);outline-offset:3px}
@container (min-width: 40rem){
[data-vibeui-block="footer-004"] [data-part="shell"]{padding:1.375rem 2rem;flex-wrap:nowrap}
[data-vibeui-block="footer-004"] [data-part="links"]{margin-left:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Footer004Link[] = [
  { label: "Условия", href: "#terms" },
  { label: "Конфиденциальность", href: "#privacy" },
  { label: "Контакты", href: "#contacts" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

/** Минимальный подвал в одну строку: бренд, копирайт, три ссылки и «наверх». */
export function Footer004({
  brand = "Полёт",
  legal = "© 2026",
  links = DEFAULT_LINKS,
  linksLabel = "Служебные ссылки",
  backLabel = "Наверх",
  background = "",
  accent,
  className,
  style,
}: Footer004Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-footer-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-004" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="dot" aria-hidden="true" />
            {brand}
          </a>
          <p data-part="legal">{legal}</p>
          <nav data-part="links" aria-label={linksLabel}>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a data-part="top" href="#top">
            <span data-part="arrow" aria-hidden="true" />
            {backLabel}
          </a>
        </div>
      </footer>
    </>
  )
}
