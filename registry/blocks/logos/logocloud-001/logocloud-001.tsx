import type { CSSProperties } from "react"
import { Badge029 } from "@/registry/components/badge/badge-029/badge-029"

type Logocloud001Item = {
  name: string
  /** Типографический характер wordmark: sans | serif | mono | wide | slab. */
  style?: "sans" | "serif" | "mono" | "wide" | "slab"
}

export type Logocloud001Props = {
  eyebrow?: string
  items?: Logocloud001Item[]
  /** Пусто — подложки нет, полоса лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Полоса доверия: подпись и ряд текстовых wordmark. Логотипы приглушены,
// чтобы не спорить с контентом страницы, и оживают акцентом только под
// курсором — так полоса читается фоном, но остаётся живой. Wordmark набраны
// разными гарнитурами: одинаковый шрифт выдал бы, что логотипы ненастоящие.
const STYLES = `
:where([data-vibeui-block="logocloud-001"]){
--vibeui-logocloud-001-bg:transparent;
--vibeui-logocloud-001-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-logocloud-001-muted:light-dark(oklch(0.52 0 0),oklch(0.68 0 0));
--vibeui-logocloud-001-logo:light-dark(oklch(0.45 0 0),oklch(0.64 0 0));
--vibeui-logocloud-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-logocloud-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-logocloud-001-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="logocloud-001"]{color-scheme:dark}
[data-vibeui-block="logocloud-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-logocloud-001-bg);color:var(--vibeui-logocloud-001-ink);
font-family:var(--vibeui-logocloud-001-font);
}
[data-vibeui-block="logocloud-001"] [data-part="shell"]{
max-width:72rem;margin:0 auto;padding:2.5rem 1.25rem;
display:grid;gap:1.5rem;justify-items:center;text-align:center;
}
[data-vibeui-block="logocloud-001"] [data-part="eyebrow"]{
margin:0;color:var(--vibeui-logocloud-001-muted);
font-size:0.8125rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;white-space:nowrap;
}
[data-vibeui-block="logocloud-001"] [data-part="row"]{
list-style:none;margin:0;padding:0;min-width:0;
display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1.25rem 2.5rem;
}
[data-vibeui-block="logocloud-001"] [data-part="row"] li:hover [data-vibeui-block="badge-029"]{
color:var(--vibeui-logocloud-001-accent);
}
@container (min-width: 52rem){
[data-vibeui-block="logocloud-001"] [data-part="shell"]{
grid-template-columns:auto 1fr;align-items:center;gap:2.5rem;text-align:left;padding:3rem 2rem;
}
[data-vibeui-block="logocloud-001"] [data-part="row"]{justify-content:space-between}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="logocloud-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Logocloud001Item[] = [
  { name: "Nordwind", style: "wide" },
  { name: "Sturm", style: "slab" },
  { name: "Plot", style: "serif" },
  { name: "Vetra", style: "sans" },
  { name: "Oktava", style: "serif" },
  { name: "Kupol", style: "sans" },
  { name: "Fjord", style: "mono" },
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

/** Полоса доверия: подпись и ряд приглушённых wordmark, оранжевых под курсором. */
export function Logocloud001({
  eyebrow = "Нам доверяют",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Logocloud001Props) {
  const palette = {
    ...(accent ? { "--vibeui-logocloud-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-logocloud-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-logocloud-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="logocloud-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <ul data-part="row">
            {items.map((item) => (
              <li key={item.name}>
                <Badge029 data-part="logo" styleKey={item.style} name={item.name} accent={accent} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
