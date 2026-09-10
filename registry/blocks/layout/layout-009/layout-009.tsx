import type { CSSProperties, ReactNode } from "react"

type Layout009Card = {
  title: string
  note: string
  href: string
  look?: "dark" | "paper" | "warm"
}

export type Layout009Props = {
  /** Свои карточки вместо демонстрационных. */
  children?: ReactNode
  heading?: string
  lede?: string
  /** Подпись прокручиваемой области для скринридера. */
  railLabel?: string
  cards?: Layout009Card[]
  /** Мягкое притяжение карточек при прокрутке. */
  snap?: boolean
  allLabel?: string
  allHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Горизонтальная галерея внутри обычной страницы: вертикальная прокрутка
// остаётся нативной, лента имеет собственный горизонтальный overflow с
// необязательным scroll snap. Край следующей карточки всегда виден —
// понятно, что контент продолжается. Колесо мыши не переназначается;
// лента фокусируема (tabindex) и листается клавиатурой нативно. Ссылка
// «Все проекты» дублирует доступ к содержимому без жеста.
const STYLES = `
:where([data-vibeui-block="layout-009"]){
--vibeui-layout-009-bg:#ffffff;
--vibeui-layout-009-ink:#000000;
--vibeui-layout-009-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-009-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-layout-009-accent:#ff5900;
--vibeui-layout-009-card:17rem;
--vibeui-layout-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-009"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-009-bg);color:var(--vibeui-layout-009-ink);
font-family:var(--vibeui-layout-009-font);
}
[data-vibeui-block="layout-009"] *{box-sizing:border-box}
[data-vibeui-block="layout-009"] [data-part="shell"]{
max-width:84rem;margin:0 auto;padding:2.5rem 0 3rem;
display:flex;flex-direction:column;gap:1.25rem;
}
[data-vibeui-block="layout-009"] [data-part="head"]{
display:flex;align-items:baseline;gap:1rem;flex-wrap:wrap;
padding:0 1rem;
}
[data-vibeui-block="layout-009"] [data-part="head"] h2{
margin:0;font-size:clamp(1.5rem,3.6cqi,2.25rem);letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="layout-009"] [data-part="head"] p{
margin:0;flex:1 1 14rem;font-size:0.9375rem;color:var(--vibeui-layout-009-muted);
}
[data-vibeui-block="layout-009"] [data-part="all"]{
margin-left:auto;color:var(--vibeui-layout-009-ink);text-decoration:none;
font-size:0.9375rem;font-weight:580;white-space:nowrap;
border-bottom:2px solid var(--vibeui-layout-009-accent);padding-bottom:0.125rem;
transition:color .16s ease;
}
[data-vibeui-block="layout-009"] [data-part="all"]:hover{color:var(--vibeui-layout-009-accent)}
[data-vibeui-block="layout-009"] [data-part="rail"]{
display:flex;gap:1rem;overflow-x:auto;
padding:0.25rem 1rem 1rem;
scrollbar-width:thin;
scrollbar-color:color-mix(in oklab,#000000 26%,transparent) transparent;
}
[data-vibeui-block="layout-009"][data-snap="on"] [data-part="rail"]{
scroll-snap-type:x proximity;scroll-padding-left:1rem;
}
[data-vibeui-block="layout-009"][data-snap="on"] [data-part="card"]{scroll-snap-align:start}
[data-vibeui-block="layout-009"] [data-part="rail"]:focus-visible{
outline:2px solid var(--vibeui-layout-009-accent);outline-offset:-2px;
}
[data-vibeui-block="layout-009"] [data-part="card"]{
flex:0 0 var(--vibeui-layout-009-card);min-width:0;
display:flex;flex-direction:column;gap:0.5rem;
color:inherit;text-decoration:none;
}
[data-vibeui-block="layout-009"] [data-part="frame"]{
aspect-ratio:4/3;position:relative;
background:linear-gradient(150deg,#1a1a1a 0%,#000000 88%);
}
[data-vibeui-block="layout-009"] [data-part="frame"][data-look="paper"]{
background:linear-gradient(150deg,#ececea 0%,#d3d0c8 100%);
}
[data-vibeui-block="layout-009"] [data-part="frame"][data-look="warm"]{
background:linear-gradient(150deg,#3b3129 0%,#161210 78%);
}
[data-vibeui-block="layout-009"] [data-part="frame"][data-look="warm"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(14rem 9rem at 70% 28%,rgb(255 165 95 / 30%),transparent 64%);
}
[data-vibeui-block="layout-009"] [data-part="card"] h3{
margin:0;font-size:1.0625rem;letter-spacing:-0.01em;font-weight:640;
transition:color .16s ease;
}
[data-vibeui-block="layout-009"] [data-part="card"]:hover h3{color:var(--vibeui-layout-009-accent)}
[data-vibeui-block="layout-009"] [data-part="card"] span{
font-size:0.875rem;color:var(--vibeui-layout-009-muted);
}
[data-vibeui-block="layout-009"] a:focus-visible{
outline:2px solid var(--vibeui-layout-009-accent);outline-offset:3px;
}
@container (min-width: 52rem){
[data-vibeui-block="layout-009"] [data-part="head"]{padding:0 2rem}
[data-vibeui-block="layout-009"] [data-part="rail"]{padding:0.25rem 2rem 1rem}
[data-vibeui-block="layout-009"][data-snap="on"] [data-part="rail"]{scroll-padding-left:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-009"] *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`

const DEFAULT_CARDS: Layout009Card[] = [
  { title: "Дом у озера", note: "Карелия · 2026", href: "#c1", look: "warm" },
  { title: "Квартира-студия", note: "Москва", href: "#c2", look: "paper" },
  { title: "Гостевой флигель", note: "Суздаль", href: "#c3", look: "dark" },
  { title: "Мансарда «Свет»", note: "Казань", href: "#c4", look: "paper" },
  { title: "Баня по-белому", note: "Урал", href: "#c5", look: "warm" },
  { title: "Терраса на крыше", note: "Сочи", href: "#c6", look: "dark" },
]

/** Горизонтальная лента карточек с нативной прокруткой и мягким snap. */
export function Layout009({
  children,
  heading = "Свежие проекты",
  lede = "Лента листается пальцем, колесом по-вертикали не перехватывается, край следующей карточки виден.",
  railLabel = "Лента проектов, прокручивается горизонтально",
  cards = DEFAULT_CARDS,
  snap = true,
  allLabel = "Все проекты",
  allHref = "#all",
  accent,
  className,
  style,
}: Layout009Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-009"
        data-snap={snap ? "on" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{heading}</h2>
            <p>{lede}</p>
            <a data-part="all" href={allHref}>
              {allLabel}
            </a>
          </div>
          <div data-part="rail" tabIndex={0} role="group" aria-label={railLabel}>
            {children ??
              cards.map((card) => (
                <a data-part="card" href={card.href} key={card.href}>
                  <span
                    data-part="frame"
                    data-look={card.look === "dark" ? undefined : card.look}
                    aria-hidden="true"
                  />
                  <h3>{card.title}</h3>
                  <span>{card.note}</span>
                </a>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
