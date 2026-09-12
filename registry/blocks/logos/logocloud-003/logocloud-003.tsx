import type { CSSProperties } from "react"

type Logocloud003Item = {
  name: string
  /** Типографический характер wordmark: sans | serif | mono | wide | slab. */
  style?: "sans" | "serif" | "mono" | "wide" | "slab"
}

export type Logocloud003Props = {
  eyebrow?: string
  title?: string
  items?: Logocloud003Item[]
  /** Последняя плитка сетки: счётчик остальных клиентов. */
  moreText?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Сетка логотипов с числом: пять wordmark-плиток и шестая плитка-счётчик
// «и ещё 200+». Счётчик — главная плитка: пять логотипов сами по себе не
// доказательство, а число превращает короткий список в верхушку айсберга.
// Поэтому он набран акцентом и стоит в сетке на правах логотипа, а не
// подписью под ней — подпись под сеткой никто не читает.
const STYLES = `
:where([data-vibeui-block="logocloud-003"]){
--vibeui-logocloud-003-bg:transparent;
--vibeui-logocloud-003-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-logocloud-003-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-logocloud-003-muted:light-dark(oklch(0.52 0 0),oklch(0.68 0 0));
--vibeui-logocloud-003-logo:light-dark(oklch(0.45 0 0),oklch(0.64 0 0));
--vibeui-logocloud-003-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-logocloud-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-logocloud-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="logocloud-003"]{color-scheme:dark}
[data-vibeui-block="logocloud-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-logocloud-003-bg);color:var(--vibeui-logocloud-003-ink);
font-family:var(--vibeui-logocloud-003-font);
}
[data-vibeui-block="logocloud-003"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:3rem 1.25rem;
display:grid;gap:2rem;justify-items:center;text-align:center;
}
[data-vibeui-block="logocloud-003"] [data-part="head"]{display:grid;gap:0.625rem;justify-items:center}
[data-vibeui-block="logocloud-003"] [data-part="eyebrow"]{
margin:0;color:var(--vibeui-logocloud-003-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-003"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.375rem,4cqi,2rem);line-height:1.15;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="logocloud-003"] [data-part="grid"]{
list-style:none;margin:0;padding:0;width:100%;
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem;
}
[data-vibeui-block="logocloud-003"] [data-part="tile"]{
min-inline-size:0;min-height:5.5rem;
display:grid;place-items:center;padding:1rem;
border:1px solid var(--vibeui-logocloud-003-border);border-radius:1rem;
background:var(--vibeui-logocloud-003-card);
transition:border-color .18s ease,background-color .18s ease;
}
[data-vibeui-block="logocloud-003"] [data-part="tile"]:hover{
border-color:color-mix(in oklab,var(--vibeui-logocloud-003-accent) 45%,var(--vibeui-logocloud-003-border));
background:color-mix(in oklab,var(--vibeui-logocloud-003-accent) 8%,var(--vibeui-logocloud-003-card));
}
[data-vibeui-block="logocloud-003"] [data-part="logo"]{
color:var(--vibeui-logocloud-003-logo);
font-size:1.25rem;line-height:1;white-space:nowrap;
transition:color .18s ease;
font-weight:750;letter-spacing:-0.035em;
}
[data-vibeui-block="logocloud-003"] [data-part="tile"]:hover [data-part="logo"]{
color:var(--vibeui-logocloud-003-accent);
}
[data-vibeui-block="logocloud-003"] [data-part="logo"][data-style="serif"]{
font-family:ui-serif,Georgia,"Times New Roman",serif;font-weight:650;letter-spacing:0;
}
[data-vibeui-block="logocloud-003"] [data-part="logo"][data-style="mono"]{
font-family:ui-monospace,"Cascadia Code",Consolas,monospace;font-weight:600;letter-spacing:-0.02em;
}
[data-vibeui-block="logocloud-003"] [data-part="logo"][data-style="wide"]{
font-size:1rem;font-weight:650;letter-spacing:0.28em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-003"] [data-part="logo"][data-style="slab"]{
font-weight:850;letter-spacing:-0.01em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-003"] [data-part="more"]{
color:var(--vibeui-logocloud-003-accent);
font-size:1rem;font-weight:700;letter-spacing:-0.01em;line-height:1.3;
}
@container (min-width: 40rem){
[data-vibeui-block="logocloud-003"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="logocloud-003"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="logocloud-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Logocloud003Item[] = [
  { name: "Nordwind", style: "wide" },
  { name: "Sturm", style: "slab" },
  { name: "Plot", style: "serif" },
  { name: "Vetra", style: "sans" },
  { name: "Fjord", style: "mono" },
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

/** Сетка логотипов 3×2, где шестая плитка — акцентный счётчик «и ещё 200+». */
export function Logocloud003({
  eyebrow = "Клиенты",
  title = "Эти команды уже собирают сайты быстрее",
  items = DEFAULT_ITEMS,
  moreText = "и ещё 200+ команд",
  background = "",
  accent,
  className,
  style,
}: Logocloud003Props) {
  const palette = {
    ...(accent ? { "--vibeui-logocloud-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-logocloud-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-logocloud-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="logocloud-003"
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
              <li key={item.name} data-part="tile">
                <span data-part="logo" data-style={item.style ?? "sans"}>
                  {item.name}
                </span>
              </li>
            ))}
            <li data-part="tile">
              <span data-part="more">{moreText}</span>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
