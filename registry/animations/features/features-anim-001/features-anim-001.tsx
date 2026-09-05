import type { CSSProperties } from "react"

export type FeaturesAnim001Item = {
  icon: "bolt" | "shield" | "layers" | "chat" | "chart" | "plug"
  title: string
  description: string
}

export type FeaturesAnim001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: FeaturesAnim001Item[]
  accent?: string
  /** false — иконки остаются статичными, карточки продолжают въезжать. */
  bounce?: boolean
  className?: string
  style?: CSSProperties
}

// Полноценная секция возможностей: сетка карточек с иконкой, заголовком и
// описанием. Иконки нарисованы inline-путями и берут цвет из currentColor —
// ни библиотеки иконок, ни шрифта. При появлении секции карточки въезжают
// по очереди с масштабом и лёгким подъёмом (stagger scale+fade), а иконка
// внутри каждой довешивает лёгкий одноразовый bounce чуть позже — так взгляд
// сперва ловит карточку целиком, а потом акцент на значке.
//
// container-type делает блок собственным query-контейнером: сетка от 34rem
// становится двухколоночной, от 60rem — трёхколоночной, независимо от
// ширины окна браузера.
const STYLES = `
:where([data-vibeui-block="features-anim-001"]){
--vibeui-features-anim-001-bg:transparent;
--vibeui-features-anim-001-cell:light-dark(oklch(1 0 0),oklch(0.25 0.011 255));
--vibeui-features-anim-001-fg:light-dark(oklch(0.2 0.012 255),oklch(0.95 0.005 255));
--vibeui-features-anim-001-muted:light-dark(oklch(0.51 0.012 255),oklch(0.72 0.012 255));
--vibeui-features-anim-001-line:light-dark(oklch(0.88 0.008 255),oklch(0.36 0.012 255));
--vibeui-features-anim-001-accent:light-dark(oklch(0.53 0.16 258),oklch(0.76 0.14 258));
--vibeui-features-anim-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-anim-001"]{color-scheme:dark}
[data-vibeui-block="features-anim-001"]{
min-width:min(100%,18rem);
box-sizing:border-box;background:var(--vibeui-features-anim-001-bg);color:var(--vibeui-features-anim-001-fg);
font-family:var(--vibeui-features-anim-001-sans);
}
[data-vibeui-block="features-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="features-anim-001"] [data-part="shell"]{
max-width:72rem;width:100%;margin:0 auto;
padding:clamp(3rem,10cqi,5rem) clamp(1.25rem,5cqi,2rem);
}
[data-vibeui-block="features-anim-001"] [data-part="head"]{max-width:38rem;margin:0 auto 2.25rem;text-align:center}
[data-vibeui-block="features-anim-001"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-anim-001-accent);
}
[data-vibeui-block="features-anim-001"] h2{
margin:0;font-size:clamp(1.625rem,4.6cqi,2.5rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-anim-001"] [data-part="lede"]{
margin:0.875rem 0 0;font-size:clamp(0.9375rem,1.5cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-features-anim-001-muted);text-wrap:pretty;
}
[data-vibeui-block="features-anim-001"] [data-part="grid"]{
list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:1px;
background:var(--vibeui-features-anim-001-line);
border:1px solid var(--vibeui-features-anim-001-line);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="features-anim-001"] [data-part="cell"]{
background:var(--vibeui-features-anim-001-cell);padding:1.5rem;
animation:vibeui-features-anim-001-cell-in .55s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="features-anim-001"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border-radius:0.75rem;
background:color-mix(in oklab,var(--vibeui-features-anim-001-accent) 12%,transparent);
color:var(--vibeui-features-anim-001-accent);
animation:vibeui-features-anim-001-bounce .6s cubic-bezier(.34,1.56,.64,1) both;
}
[data-vibeui-block="features-anim-001"] h3{margin:1rem 0 0;font-size:1rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="features-anim-001"] [data-part="cell"] p{
margin:0.5rem 0 0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-features-anim-001-muted);text-wrap:pretty;
}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(1) [data-part="cell"]{animation-delay:0ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(1) [data-part="icon"]{animation-delay:340ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(2) [data-part="cell"]{animation-delay:70ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(2) [data-part="icon"]{animation-delay:410ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(3) [data-part="cell"]{animation-delay:140ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(3) [data-part="icon"]{animation-delay:480ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(4) [data-part="cell"]{animation-delay:210ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(4) [data-part="icon"]{animation-delay:550ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(5) [data-part="cell"]{animation-delay:280ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(5) [data-part="icon"]{animation-delay:620ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(6) [data-part="cell"]{animation-delay:350ms}
[data-vibeui-block="features-anim-001"] [data-part="grid"] li:nth-child(6) [data-part="icon"]{animation-delay:690ms}
[data-vibeui-block="features-anim-001"][data-bounce="false"] [data-part="icon"]{animation:none}
@keyframes vibeui-features-anim-001-cell-in{from{opacity:0;transform:scale(0.92) translateY(12px)}to{opacity:1;transform:none}}
@keyframes vibeui-features-anim-001-bounce{0%{transform:scale(1)}35%{transform:scale(1.22)}60%{transform:scale(0.92)}80%{transform:scale(1.06)}100%{transform:scale(1)}}
@container (min-width: 34rem){
[data-vibeui-block="features-anim-001"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 60rem){
[data-vibeui-block="features-anim-001"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="features-anim-001"] [data-part="cell"]{padding:2rem}
[data-vibeui-block="features-anim-001"] [data-part="head"]{margin-bottom:3rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="features-anim-001"] [data-part="cell"],
[data-vibeui-block="features-anim-001"] [data-part="icon"]{animation:none}
}
`

const PATHS: Record<FeaturesAnim001Item["icon"], string> = {
  bolt: "M11 2 4 12h5l-1 8 7-10h-5z",
  shield: "M12 3 5 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6z",
  layers: "M12 3 3 8l9 5 9-5zM3 13l9 5 9-5",
  chat: "M4 5h16v10H9l-5 4z",
  chart: "M4 20V9M10 20V4M16 20v-7M22 20H2",
  plug: "M9 3v6M15 3v6M6 9h12v3a6 6 0 0 1-12 0zM12 18v3",
}

const DEFAULT_ITEMS: FeaturesAnim001Item[] = [
  {
    icon: "bolt",
    title: "Мгновенная установка",
    description:
      "Одна команда — и секция лежит в проекте вместе со стилями, без правок конфигов.",
  },
  {
    icon: "shield",
    title: "Своя палитра",
    description:
      "Секция не читает вашу тему и не ломается от чужих токенов: цвета живут внутри файла.",
  },
  {
    icon: "layers",
    title: "Один файл",
    description:
      "Ни соседних компонентов, ни утилит: переносится копированием в любой проект.",
  },
  {
    icon: "chat",
    title: "Инструкция для агента",
    description:
      "Copy for AI отдаёт список того, что нельзя ломать, и того, что можно менять.",
  },
  {
    icon: "chart",
    title: "Раскладка от блока",
    description:
      "Container queries считают ширину секции, а не окна: в сайдбаре вёрстка честная.",
  },
  {
    icon: "plug",
    title: "Ноль зависимостей",
    description:
      "Никаких иконочных пакетов и motion-библиотек — только React и CSS.",
  },
]

/**
 * Сетка возможностей: карточки появляются stagger scale+fade, иконка внутри
 * каждой довешивает лёгкий одноразовый bounce чуть позже. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function FeaturesAnim001({
  eyebrow = "Возможности",
  title = "Шесть причин не верстать секции руками",
  lede = "Каждая возможность работает сама по себе — включать их по очереди не нужно.",
  items = DEFAULT_ITEMS,
  accent,
  bounce = true,
  className,
  style,
}: FeaturesAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-anim-001"
        data-bounce={bounce ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>

          <ul data-part="grid">
            {items.slice(0, 6).map((item) => (
              <li key={item.title}>
                <div data-part="cell">
                  <span data-part="icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path
                        d={PATHS[item.icon]}
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
