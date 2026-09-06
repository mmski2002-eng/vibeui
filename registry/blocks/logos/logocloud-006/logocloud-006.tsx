import type { CSSProperties } from "react"

type Logocloud006Item = {
  name: string
  /** Типографический характер wordmark: sans | serif | mono | wide | slab. */
  style?: "sans" | "serif" | "mono" | "wide" | "slab"
  href?: string
}

export type Logocloud006Props = {
  eyebrow?: string
  title?: string
  /** Подпись, всплывающая на плитке при наведении и фокусе. */
  ctaText?: string
  items?: Logocloud006Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Плитки кейс-ссылок: каждый логотип — ссылка на кейс, и это видно только
// при взаимодействии. В покое секция читается как тихая стена логотипов,
// под курсором или с клавиатуры плитка раскрывает оранжевое «читать кейс →».
// Подпись всплывает и по :focus-visible: клавиатурный пользователь должен
// узнать о ссылке не хуже мышиного. Подпись лежит в потоке DOM всегда —
// скринридер читает её вместе с именем, ссылка не остаётся безымянной.
const STYLES = `
:where([data-vibeui-block="logocloud-006"]){
--vibeui-logocloud-006-bg:transparent;
--vibeui-logocloud-006-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-logocloud-006-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-logocloud-006-muted:light-dark(oklch(0.52 0 0),oklch(0.68 0 0));
--vibeui-logocloud-006-logo:light-dark(oklch(0.45 0 0),oklch(0.64 0 0));
--vibeui-logocloud-006-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-logocloud-006-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-logocloud-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="logocloud-006"]{color-scheme:dark}
[data-vibeui-block="logocloud-006"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-logocloud-006-bg);color:var(--vibeui-logocloud-006-ink);
font-family:var(--vibeui-logocloud-006-font);
}
[data-vibeui-block="logocloud-006"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:3rem 1.25rem;
display:grid;gap:2rem;justify-items:center;text-align:center;
}
[data-vibeui-block="logocloud-006"] [data-part="head"]{display:grid;gap:0.625rem;justify-items:center}
[data-vibeui-block="logocloud-006"] [data-part="eyebrow"]{
margin:0;color:var(--vibeui-logocloud-006-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-006"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.375rem,4cqi,2rem);line-height:1.15;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="logocloud-006"] [data-part="grid"]{
list-style:none;margin:0;padding:0;width:100%;
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem;
}
[data-vibeui-block="logocloud-006"] [data-part="grid"]>li{min-inline-size:0;display:grid}
[data-vibeui-block="logocloud-006"] [data-part="tile"]{
min-inline-size:0;min-height:6.5rem;
display:grid;place-items:center;align-content:center;gap:0.375rem;padding:1rem;
border:1px solid var(--vibeui-logocloud-006-border);border-radius:1rem;
background:var(--vibeui-logocloud-006-card);
text-decoration:none;color:inherit;
transition:border-color .18s ease,background-color .18s ease;
}
[data-vibeui-block="logocloud-006"] [data-part="tile"]:hover,
[data-vibeui-block="logocloud-006"] [data-part="tile"]:focus-visible{
border-color:color-mix(in oklab,var(--vibeui-logocloud-006-accent) 45%,var(--vibeui-logocloud-006-border));
background:color-mix(in oklab,var(--vibeui-logocloud-006-accent) 8%,var(--vibeui-logocloud-006-card));
}
[data-vibeui-block="logocloud-006"] [data-part="tile"]:focus-visible{
outline:2px solid var(--vibeui-logocloud-006-accent);outline-offset:2px;
}
[data-vibeui-block="logocloud-006"] [data-part="logo"]{
color:var(--vibeui-logocloud-006-logo);
font-size:1.25rem;line-height:1;white-space:nowrap;
transition:color .18s ease,transform .18s ease;
font-weight:750;letter-spacing:-0.035em;
}
[data-vibeui-block="logocloud-006"] [data-part="logo"][data-style="serif"]{
font-family:ui-serif,Georgia,"Times New Roman",serif;font-weight:650;letter-spacing:0;
}
[data-vibeui-block="logocloud-006"] [data-part="logo"][data-style="mono"]{
font-family:ui-monospace,"Cascadia Code",Consolas,monospace;font-weight:600;letter-spacing:-0.02em;
}
[data-vibeui-block="logocloud-006"] [data-part="logo"][data-style="wide"]{
font-size:1rem;font-weight:650;letter-spacing:0.28em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-006"] [data-part="logo"][data-style="slab"]{
font-weight:850;letter-spacing:-0.01em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-006"] [data-part="cta"]{
color:var(--vibeui-logocloud-006-accent);
font-size:0.8125rem;font-weight:650;line-height:1;white-space:nowrap;
opacity:0;transform:translateY(0.25rem);
transition:opacity .18s ease,transform .18s ease;
}
[data-vibeui-block="logocloud-006"] [data-part="tile"]:hover [data-part="cta"],
[data-vibeui-block="logocloud-006"] [data-part="tile"]:focus-visible [data-part="cta"]{
opacity:1;transform:none;
}
[data-vibeui-block="logocloud-006"] [data-part="tile"]:hover [data-part="logo"],
[data-vibeui-block="logocloud-006"] [data-part="tile"]:focus-visible [data-part="logo"]{
color:var(--vibeui-logocloud-006-ink);
}
@container (min-width: 40rem){
[data-vibeui-block="logocloud-006"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="logocloud-006"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="logocloud-006"] *{animation:none!important;transition:none!important}
/* Без анимации подпись не прячем: всплытие было единственным способом её увидеть. */
[data-vibeui-block="logocloud-006"] [data-part="cta"]{opacity:1;transform:none}
}
`

const DEFAULT_ITEMS: Logocloud006Item[] = [
  { name: "Nordwind", style: "wide", href: "#" },
  { name: "Sturm", style: "slab", href: "#" },
  { name: "Plot", style: "serif", href: "#" },
  { name: "Vetra", style: "sans", href: "#" },
  { name: "Oktava", style: "serif", href: "#" },
  { name: "Fjord", style: "mono", href: "#" },
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

/** Плитки логотипов-ссылок: при наведении и фокусе всплывает «читать кейс →». */
export function Logocloud006({
  eyebrow = "Кейсы",
  title = "Как команды переезжают на VibeUI",
  ctaText = "читать кейс →",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Logocloud006Props) {
  const palette = {
    ...(accent ? { "--vibeui-logocloud-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-logocloud-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-logocloud-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="logocloud-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
          </div>
          <ul data-part="grid">
            {items.map((item) => (
              <li key={item.name}>
                <a data-part="tile" href={item.href ?? "#"}>
                  <span data-part="logo" data-style={item.style ?? "sans"}>
                    {item.name}
                  </span>
                  <span data-part="cta">{ctaText}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
