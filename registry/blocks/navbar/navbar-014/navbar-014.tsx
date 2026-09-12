import type { CSSProperties, ReactNode } from "react"

type Navbar014Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar014Props = {
  /** Контент рядом с полосой. Без него — демонстрационные работы. */
  children?: ReactNode
  brand?: string
  markLabel?: string
  /** Строка под знаком: род занятий и город. */
  caption?: string
  links?: Navbar014Link[]
  navLabel?: string
  contactLabel?: string
  contactHref?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Вертикальная навигация студии: узкая боковая полоса со знаком,
// короткими пунктами и контактом; большая часть ширины отдана работам.
// Это альтернатива верхней навигации, а не вторая: горизонт экрана
// широкий, а список разделов у портфолио короткий — вертикаль отдаёт
// работам всю ширину и держит навигацию в поле зрения при прокрутке.
//
// Полоса sticky и остаётся на месте, пока контент прокручивается
// документом. В узкой колонке она превращается в обычную верхнюю шапку с
// горизонтальным рядом пунктов. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="navbar-014"]){
--vibeui-navbar-014-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-014-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-014-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-014-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-014-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-014-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-014-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-014-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-014-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-014-on-accent:oklch(from var(--vibeui-navbar-014-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-014-ease:cubic-bezier(.32,.72,0,1);
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-014"]{color-scheme:dark}
:where([data-vibeui-block="navbar-014"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-014"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-014"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-014-bg);color:var(--vibeui-navbar-014-ink);
font-family:var(--vibeui-navbar-014-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-014"] *{box-sizing:border-box}
[data-vibeui-block="navbar-014"] [data-part="frame"]{
display:flex;flex-direction:column;max-width:96rem;margin:0 auto;
}

[data-vibeui-block="navbar-014"] [data-part="rail"]{
display:flex;flex-direction:row;align-items:center;gap:0.75rem;
padding:0.875rem 1rem;border-bottom:1px solid var(--vibeui-navbar-014-line);
}
[data-vibeui-block="navbar-014"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.625rem;flex:none;
color:inherit;text-decoration:none;
font-size:1rem;font-weight:700;letter-spacing:-0.025em;
}
[data-vibeui-block="navbar-014"] [data-part="mark"]{
width:1.75rem;height:1.75rem;flex:none;display:grid;place-items:center;border-radius:0.4375rem;
background:var(--vibeui-navbar-014-accent);color:oklch(from var(--vibeui-navbar-014-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.75rem;font-weight:800;
box-shadow:0 0.1875rem 0.625rem color-mix(in oklab,var(--vibeui-navbar-014-accent) 44%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform .22s var(--vibeui-navbar-014-ease);
}
[data-vibeui-block="navbar-014"] [data-part="brand"]:hover [data-part="mark"]{transform:rotate(-6deg) scale(1.06)}
[data-vibeui-block="navbar-014"] [data-part="caption"]{
display:none;margin:0;font-size:0.75rem;line-height:1.5;
color:var(--vibeui-navbar-014-muted);
}

[data-vibeui-block="navbar-014"] [data-part="nav"]{
display:flex;flex-direction:row;gap:0.125rem;overflow-x:auto;scrollbar-width:none;
margin-left:auto;
}
[data-vibeui-block="navbar-014"] [data-part="nav"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-014"] [data-part="nav"] a{
position:relative;flex:none;padding:0.4375rem 0.6875rem;border-radius:0.5rem;
color:var(--vibeui-navbar-014-muted);text-decoration:none;
font-size:0.9375rem;font-weight:540;white-space:nowrap;
transition:color .13s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-014"] [data-part="nav"] a:hover{
color:var(--vibeui-navbar-014-ink);background:var(--vibeui-navbar-014-hover);
}
[data-vibeui-block="navbar-014"] [data-part="nav"] a[aria-current="page"]{
color:var(--vibeui-navbar-014-ink);font-weight:600;
box-shadow:inset 0 -2px 0 var(--vibeui-navbar-014-accent);
}
[data-vibeui-block="navbar-014"] [data-part="contact"]{
display:none;color:var(--vibeui-navbar-014-muted);text-decoration:none;
font-size:0.8125rem;
transition:color .13s ease;
}
[data-vibeui-block="navbar-014"] [data-part="contact"]:hover{color:var(--vibeui-navbar-014-accent)}

[data-vibeui-block="navbar-014"] [data-part="work"]{
flex:1 1 auto;min-width:0;padding:1rem;
display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:1.25rem;align-content:start;
}
[data-vibeui-block="navbar-014"] [data-part="piece"]{
display:flex;flex-direction:column;gap:0.5625rem;color:inherit;text-decoration:none;
}
[data-vibeui-block="navbar-014"] [data-part="shot"]{
position:relative;aspect-ratio:4/3;display:block;overflow:hidden;border-radius:0.875rem;
background:linear-gradient(158deg,#2a2a2a 0%,#000000 88%);
transition:transform .4s var(--vibeui-navbar-014-ease),box-shadow .3s ease;
}
[data-vibeui-block="navbar-014"] [data-part="shot"]::after{
content:"";position:absolute;inset:0;
}
[data-vibeui-block="navbar-014"] [data-part="piece"][data-look="paper"] [data-part="shot"]{
background:linear-gradient(158deg,#f2f2f2 0%,#d8d4cc 100%);
}
[data-vibeui-block="navbar-014"] [data-part="piece"][data-look="paper"] [data-part="shot"]::after{
background:
radial-gradient(circle at 66% 40%,var(--vibeui-navbar-014-accent) 0 2.75rem,transparent 2.75rem),
linear-gradient(#000000 0 0) 22% 74%/38% 1.5px no-repeat,
linear-gradient(#000000 0 0) 22% 82%/24% 1.5px no-repeat;
}
[data-vibeui-block="navbar-014"] [data-part="piece"][data-look="dark"] [data-part="shot"]::after{
background:
linear-gradient(transparent 62%,rgb(0 0 0 / 55%) 100%),
linear-gradient(104deg,transparent 46%,color-mix(in oklab,var(--vibeui-navbar-014-accent) 60%,transparent) 50%,transparent 54%);
}
[data-vibeui-block="navbar-014"] [data-part="piece"][data-look="warm"] [data-part="shot"]{
background:linear-gradient(158deg,#3a2a1e 0%,#6b3a16 62%,#1a1a1a 100%);
}
[data-vibeui-block="navbar-014"] [data-part="piece"][data-look="warm"] [data-part="shot"]::after{
background:
radial-gradient(10rem 7rem at 26% 18%,rgb(255 196 128 / 42%),transparent 66%),
linear-gradient(rgb(255 214 164 / 26%) 0 0) 12% 100%/26% 62% no-repeat;
}
[data-vibeui-block="navbar-014"] [data-part="piece"][data-look="night"] [data-part="shot"]{
background:linear-gradient(178deg,#1a1a1a 0%,#2a2f36 44%,#6b3a16 100%);
}
[data-vibeui-block="navbar-014"] [data-part="piece"][data-look="night"] [data-part="shot"]::after{
background:
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 120' preserveAspectRatio='none'%3E%3Cpath fill='%23000000' d='M0,86 L70,44 L128,80 L196,34 L262,78 L330,40 L400,76 L400,120 L0,120 Z'/%3E%3C/svg%3E") bottom/100% 52% no-repeat,
radial-gradient(3rem 3rem at 74% 24%,rgb(255 214 164 / 88%),transparent 70%);
}
[data-vibeui-block="navbar-014"] [data-part="piece"]:hover [data-part="shot"]{
transform:translateY(-0.25rem);
box-shadow:0 1rem 2.25rem color-mix(in oklab,#000000 22%,transparent);
}
[data-vibeui-block="navbar-014"] [data-part="meta"]{
display:flex;align-items:baseline;gap:0.5rem;
}
[data-vibeui-block="navbar-014"] [data-part="title"]{
font-size:0.9375rem;font-weight:600;letter-spacing:-0.01em;
transition:color .13s ease;
}
[data-vibeui-block="navbar-014"] [data-part="year"]{
margin-left:auto;font-size:0.75rem;color:var(--vibeui-navbar-014-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="navbar-014"] [data-part="piece"]:hover [data-part="title"]{color:var(--vibeui-navbar-014-accent)}

[data-vibeui-block="navbar-014"] a:focus-visible{
outline:2px solid var(--vibeui-navbar-014-accent);outline-offset:3px;
}
@container (min-width: 56rem){
[data-vibeui-block="navbar-014"] [data-part="frame"]{flex-direction:row;align-items:stretch}
[data-vibeui-block="navbar-014"] [data-part="rail"]{
flex-direction:column;align-items:flex-start;gap:1.75rem;
width:14rem;flex:none;
padding:2rem 1.5rem;border-bottom:0;border-right:1px solid var(--vibeui-navbar-014-line);
position:sticky;top:0;align-self:flex-start;min-height:32rem;
}
[data-vibeui-block="navbar-014"] [data-part="head"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="navbar-014"] [data-part="caption"]{display:block}
[data-vibeui-block="navbar-014"] [data-part="nav"]{
flex-direction:column;gap:0.125rem;margin-left:0;overflow:visible;align-self:stretch;
}
[data-vibeui-block="navbar-014"] [data-part="nav"] a{
padding:0.4375rem 0.625rem;border-radius:0.5rem;
}
[data-vibeui-block="navbar-014"] [data-part="nav"] a[aria-current="page"]{
box-shadow:inset 2px 0 0 var(--vibeui-navbar-014-accent);
background:var(--vibeui-navbar-014-hover);
}
[data-vibeui-block="navbar-014"] [data-part="contact"]{display:block;margin-top:auto}
[data-vibeui-block="navbar-014"] [data-part="work"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar014Link[] = [
  { label: "Работы", href: "#works", current: true },
  { label: "Студия", href: "#studio" },
  { label: "Процесс", href: "#process" },
  { label: "Контакты", href: "#contacts" },
]

const DEMO_PIECES = [
  ["Дом «Сектор»", "dark", "2026"],
  ["Айдентика «Русла»", "paper", "2025"],
  ["Интерьер бюро", "warm", "2025"],
  ["Серия «Тихий свет»", "night", "2024"],
] as const

/** Вертикальная навигация студии: боковая полоса со знаком и пунктами, работы рядом. */
export function Navbar014({
  children,
  brand = "Фотостудия Тень",
  markLabel = "Т",
  caption = "Предметная и архитектурная съёмка, Екатеринбург",
  links = DEFAULT_LINKS,
  navLabel = "Разделы сайта",
  contactLabel = "hello@ten.photo",
  contactHref = "mailto:hello@ten.photo",
  tone = "auto",
  accent,
  className,
  style,
}: Navbar014Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-014" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="navbar-014"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <header data-part="rail">
            <div data-part="head">
              <a data-part="brand" href="#top">
                <span data-part="mark" aria-hidden="true">
                  {markLabel}
                </span>
                {brand}
              </a>
              {caption ? <p data-part="caption">{caption}</p> : null}
            </div>

            <nav data-part="nav" aria-label={navLabel}>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <a data-part="contact" href={contactHref}>
              {contactLabel}
            </a>
          </header>

          <main data-part="work">
            {children ??
              DEMO_PIECES.map(([title, look, year]) => (
                <a data-part="piece" data-look={look} href="#piece" key={title}>
                  <span data-part="shot" aria-hidden="true" />
                  <span data-part="meta">
                    <span data-part="title">{title}</span>
                    <span data-part="year">{year}</span>
                  </span>
                </a>
              ))}
          </main>
        </div>
      </div>
    </>
  )
}
