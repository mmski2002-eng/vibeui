import type { CSSProperties, ComponentProps } from "react"

type Footer013Link = {
  label: string
  href: string
}

export type Footer013Props = {
  brand?: string
  links?: Footer013Link[]
  social?: Footer013Link[]
  copyright?: string
  /** Пусто — подложки нет, подвал лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Минимальный подвал по центру: знак, имя, одна строка ссылок, соцсети и
// копирайт — всё в узкой центральной колонке. Такой подвал ставят на
// лендинги и продуктовые страницы, где карта сайта не нужна: пять ссылок
// в столбик выглядели бы претензией на масштаб, которого нет. Ссылки
// собраны в один <nav> — это одна навигация, а не пять групп.
const STYLES = `[data-vibeui-block="footer-013"] [data-part="social"]{margin:0}

:where([data-vibeui-block="footer-013"]){
--vibeui-footer-013-bg:transparent;
--vibeui-footer-013-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-footer-013-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-footer-013-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-footer-013-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-footer-013-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-footer-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-footer-013-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="footer-013"]{color-scheme:dark}
[data-vibeui-block="footer-013"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-footer-013-bg);color:var(--vibeui-footer-013-ink);
font-family:var(--vibeui-footer-013-font);
}
[data-vibeui-block="footer-013"] [data-part="shell"]{
max-width:44rem;margin:0 auto;padding:3rem 1.25rem;
display:grid;justify-items:center;gap:1.25rem;text-align:center;
}
[data-vibeui-block="footer-013"] [data-part="brand"]{
display:inline-flex;flex-direction:column;align-items:center;gap:0.625rem;
color:inherit;text-decoration:none;
font-size:1.125rem;font-weight:720;letter-spacing:-0.02em;
}
[data-vibeui-block="footer-013"] [data-part="mark"]{
width:2rem;height:2rem;border-radius:0.625rem;
background:var(--vibeui-footer-013-accent-fill);
mask-image:radial-gradient(circle at 50% 50%,transparent 28%,black 29%);
}
[data-vibeui-block="footer-013"] [data-part="copyright"]{
margin:0.5rem 0 0;padding-top:1.25rem;justify-self:stretch;
border-top:1px solid var(--vibeui-footer-013-border);
color:var(--vibeui-footer-013-muted);font-size:0.8125rem;
}
[data-vibeui-block="footer-013"] a:focus-visible{
outline:2px solid var(--vibeui-footer-013-accent);outline-offset:3px;
}
@container (min-width: 40rem){
[data-vibeui-block="footer-013"] [data-part="shell"]{padding:4rem 2rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-013"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="footer-013"] [data-part="links"] ul{margin:0;padding:0;list-style:none;
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem 1.5rem;}
[data-vibeui-block="footer-013"] [data-part="links"] a{color:var(--vibeui-footer-013-muted);text-decoration:none;font-size:0.9375rem;
transition:color var(--vibeui-footer-013-dur-2) ease;}
[data-vibeui-block="footer-013"] [data-part="links"] a:hover{color:var(--vibeui-footer-013-accent)}
[data-vibeui-block="footer-013"] [data-part="social"]{margin:0;padding:0;list-style:none;
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;}
[data-vibeui-block="footer-013"] [data-part="social"] a{display:inline-block;padding:0.3125rem 0.75rem;border-radius:999px;
border:1px solid var(--vibeui-footer-013-border);
color:var(--vibeui-footer-013-muted);text-decoration:none;
font-size:0.8125rem;font-weight:600;
transition:color var(--vibeui-footer-013-dur-2) ease,border-color var(--vibeui-footer-013-dur-2) ease;}
[data-vibeui-block="footer-013"] [data-part="social"] a:hover{color:var(--vibeui-footer-013-accent);
border-color:color-mix(in oklab,var(--vibeui-footer-013-accent) 45%,var(--vibeui-footer-013-border));}
`

const DEFAULT_LINKS: Footer013Link[] = [
  { label: "Возможности", href: "#features" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Документация", href: "#docs" },
  { label: "Блог", href: "#blog" },
  { label: "Контакты", href: "#contacts" },
]

const DEFAULT_SOCIAL: Footer013Link[] = [
  { label: "Telegram", href: "#telegram" },
  { label: "YouTube", href: "#youtube" },
  { label: "GitHub", href: "#github" },
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

export type LinksLink = {
  label: string
  href: string
}

const LinksDEFAULT_LINKS: LinksLink[] = [
  { label: "Возможности", href: "#features" },
  { label: "Тарифы", href: "#pricing" },
  { label: "Документация", href: "#docs" },
  { label: "Блог", href: "#blog" },
  { label: "Контакты", href: "#contacts" },
]

type LinksProps = Omit<ComponentProps<"nav">, "title" | "children"> & {
  links?: LinksLink[]
  accent?: string
  className?: string
  style?: CSSProperties
}

function Links({
  links = LinksDEFAULT_LINKS,
  accent,
  className,
  style,
  ...props
}: LinksProps) {
  const palette = {
    ...(accent ? { "--vibeui-footer-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <nav
        {...props} aria-label="Подвал"
        className={className}
        style={palette}
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
  )
}

export type SocialLink = {
  label: string
  href: string
}

const SocialDEFAULT_SOCIAL: SocialLink[] = [
  { label: "Telegram", href: "#telegram" },
  { label: "YouTube", href: "#youtube" },
  { label: "GitHub", href: "#github" },
]

type SocialProps = Omit<ComponentProps<"ul">, "title" | "children"> & {
  social?: SocialLink[]
  accent?: string
  className?: string
  style?: CSSProperties
}

function Social({
  social = SocialDEFAULT_SOCIAL,
  accent,
  className,
  style,
  ...props
}: SocialProps) {
  const palette = {
    ...(accent ? { "--vibeui-footer-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <ul
        {...props}
        className={className}
        style={palette}
      >
        {social.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
  )
}

/** Минимальный подвал по центру: знак, строка ссылок, соцсети, копирайт. */
export function Footer013({
  brand = "Точка",
  links = DEFAULT_LINKS,
  social = DEFAULT_SOCIAL,
  copyright = "© 2026 ООО «Точка». Все права защищены.",
  background = "",
  accent,
  className,
  style,
}: Footer013Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-footer-013-accent": accent,
          "--vibeui-footer-013-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-footer-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-013" precedence="medium">
        {STYLES}
      </style>
      <footer
        data-vibeui-block="footer-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true" />
            {brand}
          </a>
          <Links data-part="links" links={links} accent={accent} />
          <Social data-part="social" social={social} accent={accent} />
          <p data-part="copyright">{copyright}</p>
        </div>
      </footer>
    </>
  )
}
