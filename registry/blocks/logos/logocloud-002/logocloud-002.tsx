import type { CSSProperties } from "react"

type Logocloud002Item = {
  name: string
  /** Типографический характер wordmark: sans | serif | mono | wide | slab. */
  style?: "sans" | "serif" | "mono" | "wide" | "slab"
}

export type Logocloud002Props = {
  eyebrow?: string
  items?: Logocloud002Item[]
  /** Пусто — подложки нет, лента лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Бегущая строка логотипов на чистом CSS: дорожка из двух одинаковых групп
// уезжает на половину своей ширины и бесшовно зацикливается. Дубль скрыт от
// скринридеров. Под курсором лента останавливается — движущийся текст нельзя
// прочитать. При prefers-reduced-motion анимация выключается, а дорожка
// складывается в обычный ряд с переносами: без движения дубль не нужен.
const STYLES = `
:where([data-vibeui-block="logocloud-002"]){
--vibeui-logocloud-002-bg:transparent;
--vibeui-logocloud-002-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-logocloud-002-muted:light-dark(oklch(0.52 0 0),oklch(0.68 0 0));
--vibeui-logocloud-002-logo:light-dark(oklch(0.45 0 0),oklch(0.64 0 0));
--vibeui-logocloud-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-logocloud-002-speed:36s;
--vibeui-logocloud-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-logocloud-002-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="logocloud-002"]{color-scheme:dark}
[data-vibeui-block="logocloud-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-logocloud-002-bg);color:var(--vibeui-logocloud-002-ink);
font-family:var(--vibeui-logocloud-002-font);
}
[data-vibeui-block="logocloud-002"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:2.5rem 0;
display:grid;gap:1.5rem;
}
[data-vibeui-block="logocloud-002"] [data-part="eyebrow"]{
margin:0;text-align:center;color:var(--vibeui-logocloud-002-muted);
font-size:0.8125rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;
padding:0 1.25rem;
}
[data-vibeui-block="logocloud-002"] [data-part="viewport"]{
overflow:hidden;
/* Края растворяются, чтобы обрез ленты не выглядел случайным. */
mask-image:linear-gradient(to right,transparent,#000 10%,#000 90%,transparent);
}
[data-vibeui-block="logocloud-002"] [data-part="track"]{
display:flex;width:max-content;
animation:vibeui-logocloud-002-scroll var(--vibeui-logocloud-002-speed) linear infinite;
}
[data-vibeui-block="logocloud-002"] [data-part="viewport"]:hover [data-part="track"]{
animation-play-state:paused;
}
[data-vibeui-block="logocloud-002"] [data-part="group"]{
list-style:none;margin:0;padding:0 0 0 3.5rem;
display:flex;align-items:center;gap:3.5rem;flex:none;
}
[data-vibeui-block="logocloud-002"] [data-part="logo"]{
color:var(--vibeui-logocloud-002-logo);
font-size:1.375rem;line-height:1;white-space:nowrap;
transition:color var(--vibeui-logocloud-002-dur-2) ease;
font-weight:750;letter-spacing:-0.035em;
}
[data-vibeui-block="logocloud-002"] [data-part="logo"][data-style="serif"]{
font-family:ui-serif,Georgia,"Times New Roman",serif;font-weight:650;letter-spacing:0;
}
[data-vibeui-block="logocloud-002"] [data-part="logo"][data-style="mono"]{
font-family:ui-monospace,"Cascadia Code",Consolas,monospace;font-weight:600;letter-spacing:-0.02em;
}
[data-vibeui-block="logocloud-002"] [data-part="logo"][data-style="wide"]{
font-size:1.0625rem;font-weight:650;letter-spacing:0.28em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-002"] [data-part="logo"][data-style="slab"]{
font-weight:850;letter-spacing:-0.01em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-002"] [data-part="group"] li:hover [data-part="logo"]{
color:var(--vibeui-logocloud-002-accent);
}
@keyframes vibeui-logocloud-002-scroll{to{transform:translateX(-50%)}}
@container (min-width: 48rem){
[data-vibeui-block="logocloud-002"] [data-part="shell"]{padding:3.5rem 0;gap:2rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="logocloud-002"] *{animation:none!important;transition:none!important}
[data-vibeui-block="logocloud-002"] [data-part="viewport"]{mask-image:none}
[data-vibeui-block="logocloud-002"] [data-part="track"]{width:auto;justify-content:center}
[data-vibeui-block="logocloud-002"] [data-part="group"]{flex-wrap:wrap;justify-content:center;padding:0 1.25rem;gap:1.25rem 2.5rem}
[data-vibeui-block="logocloud-002"] [data-part="group"][aria-hidden="true"]{display:none}
}
`

const DEFAULT_ITEMS: Logocloud002Item[] = [
  { name: "Nordwind", style: "wide" },
  { name: "Sturm", style: "slab" },
  { name: "Plot", style: "serif" },
  { name: "Vetra", style: "sans" },
  { name: "Oktava", style: "serif" },
  { name: "Kupol", style: "sans" },
  { name: "Fjord", style: "mono" },
  { name: "Umbra", style: "wide" },
  { name: "Talvi", style: "serif" },
  { name: "Granum", style: "sans" },
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

function LogoGroup({
  items,
  hidden,
}: {
  items: Logocloud002Item[]
  hidden?: boolean
}) {
  return (
    <ul data-part="group" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.name}>
          <span data-part="logo" data-style={item.style ?? "sans"}>
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Бегущая строка wordmark: CSS-marquee с паузой на hover и стопом при reduced-motion. */
export function Logocloud002({
  eyebrow = "Каталогом пользуются",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Logocloud002Props) {
  const palette = {
    ...(accent ? { "--vibeui-logocloud-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-logocloud-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-logocloud-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="logocloud-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <div data-part="viewport">
            <div data-part="track">
              <LogoGroup items={items} />
              <LogoGroup items={items} hidden />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
