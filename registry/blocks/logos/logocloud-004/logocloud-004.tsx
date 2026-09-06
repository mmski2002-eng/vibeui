import type { CSSProperties } from "react"

type Logocloud004Item = {
  name: string
  /** Типографический характер wordmark: sans | serif | mono | wide | slab. */
  style?: "sans" | "serif" | "mono" | "wide" | "slab"
  /** Компания, чья цитата стоит выше: её wordmark подсвечен акцентом. */
  highlight?: boolean
}

export type Logocloud004Props = {
  eyebrow?: string
  quote?: string
  author?: string
  role?: string
  items?: Logocloud004Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Логотипы с цитатой: по центру одна живая цитата клиента, под ней — ряд
// wordmark. Логотип цитируемой компании подсвечен акцентом: так ряд и цитата
// связываются в одну историю, а не лежат двумя несвязанными блоками.
// Одна цитата вместо трёх — сознательно: ряд логотипов отвечает за «сколько»,
// цитата за «почему», и второй голос здесь ничего не добавляет.
const STYLES = `
:where([data-vibeui-block="logocloud-004"]){
--vibeui-logocloud-004-bg:transparent;
--vibeui-logocloud-004-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-logocloud-004-muted:light-dark(oklch(0.52 0 0),oklch(0.68 0 0));
--vibeui-logocloud-004-logo:light-dark(oklch(0.45 0 0),oklch(0.64 0 0));
--vibeui-logocloud-004-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-logocloud-004-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-logocloud-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="logocloud-004"]{color-scheme:dark}
[data-vibeui-block="logocloud-004"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-logocloud-004-bg);color:var(--vibeui-logocloud-004-ink);
font-family:var(--vibeui-logocloud-004-font);
}
[data-vibeui-block="logocloud-004"] [data-part="shell"]{
max-width:56rem;margin:0 auto;padding:3rem 1.25rem;
display:grid;gap:2rem;justify-items:center;text-align:center;
}
[data-vibeui-block="logocloud-004"] [data-part="eyebrow"]{
margin:0;color:var(--vibeui-logocloud-004-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-004"] [data-part="figure"]{
margin:0;display:grid;gap:1.25rem;justify-items:center;
}
[data-vibeui-block="logocloud-004"] [data-part="quote"]{
margin:0;max-width:36ch;
font-size:clamp(1.25rem,3.5cqi,1.75rem);line-height:1.35;letter-spacing:-0.015em;font-weight:550;
}
[data-vibeui-block="logocloud-004"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="logocloud-004"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="logocloud-004"] [data-part="caption"]{
display:grid;gap:0.125rem;
}
[data-vibeui-block="logocloud-004"] [data-part="author"]{font-size:0.9375rem;font-weight:650}
[data-vibeui-block="logocloud-004"] [data-part="role"]{
color:var(--vibeui-logocloud-004-muted);font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="logocloud-004"] [data-part="row"]{
list-style:none;margin:0;padding:1.75rem 0 0;width:100%;
border-top:1px solid var(--vibeui-logocloud-004-border);
display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1.25rem 2.5rem;
}
[data-vibeui-block="logocloud-004"] [data-part="logo"]{
color:var(--vibeui-logocloud-004-logo);
font-size:1.1875rem;line-height:1;white-space:nowrap;
transition:color .18s ease;
font-weight:750;letter-spacing:-0.035em;
}
[data-vibeui-block="logocloud-004"] [data-part="logo"][data-style="serif"]{
font-family:ui-serif,Georgia,"Times New Roman",serif;font-weight:650;letter-spacing:0;
}
[data-vibeui-block="logocloud-004"] [data-part="logo"][data-style="mono"]{
font-family:ui-monospace,"Cascadia Code",Consolas,monospace;font-weight:600;letter-spacing:-0.02em;
}
[data-vibeui-block="logocloud-004"] [data-part="logo"][data-style="wide"]{
font-size:0.9375rem;font-weight:650;letter-spacing:0.28em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-004"] [data-part="logo"][data-style="slab"]{
font-weight:850;letter-spacing:-0.01em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-004"] [data-part="row"] li:hover [data-part="logo"]{
color:var(--vibeui-logocloud-004-accent);
}
[data-vibeui-block="logocloud-004"] [data-part="logo"][data-highlight]{
color:var(--vibeui-logocloud-004-accent);
}
@container (min-width: 48rem){
[data-vibeui-block="logocloud-004"] [data-part="shell"]{padding:4.5rem 2rem;gap:2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="logocloud-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Logocloud004Item[] = [
  { name: "Nordwind", style: "wide" },
  { name: "Sturm", style: "slab", highlight: true },
  { name: "Plot", style: "serif" },
  { name: "Vetra", style: "sans" },
  { name: "Kupol", style: "sans" },
  { name: "Umbra", style: "wide" },
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

/** Цитата клиента по центру и ряд логотипов под ней; цитируемый подсвечен. */
export function Logocloud004({
  eyebrow = "Нам доверяют",
  quote = "Компоненты приходят обычными файлами в проект. Ничего не ломается при обновлении, потому что обновлять нечего.",
  author = "Игорь Демидов",
  role = "Технический директор, Sturm",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Logocloud004Props) {
  const palette = {
    ...(accent ? { "--vibeui-logocloud-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-logocloud-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-logocloud-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="logocloud-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <figure data-part="figure">
            <blockquote data-part="quote">{quote}</blockquote>
            <figcaption data-part="caption">
              <span data-part="author">{author}</span>
              <span data-part="role">{role}</span>
            </figcaption>
          </figure>
          <ul data-part="row">
            {items.map((item) => (
              <li key={item.name}>
                <span
                  data-part="logo"
                  data-style={item.style ?? "sans"}
                  data-highlight={item.highlight || undefined}
                >
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
