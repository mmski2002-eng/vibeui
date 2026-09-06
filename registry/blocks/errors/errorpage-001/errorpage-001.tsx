import type { CSSProperties } from "react"

type Errorpage001Link = {
  label: string
  href: string
}

export type Errorpage001Props = {
  code?: string
  title?: string
  description?: string
  searchAction?: string
  searchPlaceholder?: string
  searchButton?: string
  linksLabel?: string
  links?: Errorpage001Link[]
  /** Пусто — подложки нет, страница лежит прямо на фоне сайта. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Страница 404 с гигантскими контурными цифрами: код ошибки — не позор, а
// типографический плакат. Штрих вместо заливки, потому что залитые цифры
// такого размера давят на текст. Ниже — поиск и ссылки на главные разделы:
// человек попал не туда, и страница обязана предложить выход, а не тупик.
const STYLES = `
:where([data-vibeui-block="errorpage-001"]){
--vibeui-errorpage-001-bg:transparent;
--vibeui-errorpage-001-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-errorpage-001-muted:light-dark(oklch(0.48 0 0),oklch(0.7 0 0));
--vibeui-errorpage-001-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-errorpage-001-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-errorpage-001-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-errorpage-001-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-errorpage-001-accent-ink:oklch(0.15 0.02 39.8);
--vibeui-errorpage-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="errorpage-001"]{color-scheme:dark}
[data-vibeui-block="errorpage-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-errorpage-001-bg);color:var(--vibeui-errorpage-001-ink);
font-family:var(--vibeui-errorpage-001-font);
}
[data-vibeui-block="errorpage-001"] [data-part="frame"]{
max-width:44rem;margin:0 auto;padding:4rem 1.25rem;
display:flex;flex-direction:column;align-items:center;text-align:center;
}
[data-vibeui-block="errorpage-001"] [data-part="code"]{
margin:0;
font-size:clamp(6rem,30cqi,12rem);line-height:0.85;font-weight:800;letter-spacing:0.02em;
font-variant-numeric:tabular-nums;
color:var(--vibeui-errorpage-001-accent);
}
/* Оранжевый штрих вместо заливки: залитые цифры такого размера давят на
   текст. Фолбэк выше оставляет цифры залитыми там, где штриха нет. */
@supports (-webkit-text-stroke:1px black){
[data-vibeui-block="errorpage-001"] [data-part="code"]{
color:transparent;
-webkit-text-stroke:clamp(2px,0.6cqi,4px) var(--vibeui-errorpage-001-accent);
}
}
[data-vibeui-block="errorpage-001"] [data-part="title"]{
margin:1.5rem 0 0;
font-size:clamp(1.5rem,5cqi,2.125rem);line-height:1.15;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="errorpage-001"] [data-part="description"]{
margin:0.75rem 0 0;max-width:38ch;
color:var(--vibeui-errorpage-001-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="errorpage-001"] [data-part="search"]{
margin-top:2rem;width:100%;max-width:26rem;
display:flex;gap:0.5rem;
padding:0.375rem;border:1px solid var(--vibeui-errorpage-001-border);border-radius:0.875rem;
background:var(--vibeui-errorpage-001-card);
}
[data-vibeui-block="errorpage-001"] [data-part="search"]:focus-within{
border-color:color-mix(in oklab,var(--vibeui-errorpage-001-accent) 55%,var(--vibeui-errorpage-001-border));
}
[data-vibeui-block="errorpage-001"] [data-part="input"]{
flex:1 1 auto;min-width:0;
border:0;background:none;padding:0.5rem 0.625rem;
color:inherit;font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="errorpage-001"] [data-part="input"]::placeholder{color:var(--vibeui-errorpage-001-muted)}
[data-vibeui-block="errorpage-001"] [data-part="input"]:focus{outline:none}
[data-vibeui-block="errorpage-001"] [data-part="submit"]{
flex:none;cursor:pointer;
border:0;border-radius:0.625rem;padding:0.5rem 1.125rem;
background:var(--vibeui-errorpage-001-accent-fill);color:var(--vibeui-errorpage-001-accent-ink);
font:inherit;font-size:0.875rem;font-weight:650;
transition:filter .15s ease;
}
[data-vibeui-block="errorpage-001"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="errorpage-001"] [data-part="links-label"]{
margin:2.25rem 0 0;
color:var(--vibeui-errorpage-001-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="errorpage-001"] [data-part="links"]{
margin-top:0.875rem;
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;
}
[data-vibeui-block="errorpage-001"] [data-part="link"]{
display:inline-block;
padding:0.4375rem 0.875rem;border:1px solid var(--vibeui-errorpage-001-border);border-radius:999px;
color:inherit;text-decoration:none;font-size:0.875rem;font-weight:550;
background:var(--vibeui-errorpage-001-card);
transition:border-color .15s ease,color .15s ease;
}
[data-vibeui-block="errorpage-001"] [data-part="link"]:hover{
border-color:color-mix(in oklab,var(--vibeui-errorpage-001-accent) 50%,var(--vibeui-errorpage-001-border));
color:var(--vibeui-errorpage-001-accent);
}
[data-vibeui-block="errorpage-001"] :is(a,button,input):focus-visible{
outline:2px solid var(--vibeui-errorpage-001-accent);outline-offset:2px;border-radius:0.625rem;
}
@container (min-width: 48rem){
[data-vibeui-block="errorpage-001"] [data-part="frame"]{padding:6rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="errorpage-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Errorpage001Link[] = [
  { label: "Каталог компонентов", href: "/components" },
  { label: "Главная", href: "/" },
  { label: "Документация", href: "/docs" },
  { label: "Тарифы", href: "/pricing" },
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

/** Страница 404: контурные цифры-плакат, поиск и ссылки на главные разделы. */
export function Errorpage001({
  code = "404",
  title = "Такой страницы нет",
  description = "Ссылка устарела или в адресе опечатка. Попробуйте найти нужный блок поиском или начните с главных разделов.",
  searchAction = "/components",
  searchPlaceholder = "Поиск по каталогу: «навбар», «тарифы»…",
  searchButton = "Найти",
  linksLabel = "Куда дальше",
  links = DEFAULT_LINKS,
  background = "",
  accent,
  className,
  style,
}: Errorpage001Props) {
  const palette = {
    ...(accent ? { "--vibeui-errorpage-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-errorpage-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-errorpage-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="errorpage-001"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <p data-part="code" aria-hidden="true">
            {code}
          </p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <form data-part="search" role="search" action={searchAction}>
            <input
              data-part="input"
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              aria-label={searchButton}
            />
            <button data-part="submit" type="submit">
              {searchButton}
            </button>
          </form>
          <p data-part="links-label">{linksLabel}</p>
          <nav data-part="links" aria-label={linksLabel}>
            {links.map((link) => (
              <a key={link.label} data-part="link" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>
    </>
  )
}
