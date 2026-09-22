import type { CSSProperties, ReactNode } from "react"
import { Card143 } from "@/registry/components/card/card-143/card-143"

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
--vibeui-navbar-014-dur-1:130ms;
--vibeui-navbar-014-dur-2:180ms;
--vibeui-navbar-014-dur-3:240ms;
--vibeui-navbar-014-dur-4:340ms;
--vibeui-navbar-014-dur-5:460ms;
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
transition:transform var(--vibeui-navbar-014-dur-3) var(--vibeui-navbar-014-ease);
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
transition:color var(--vibeui-navbar-014-dur-1) ease,background-color var(--vibeui-navbar-014-dur-2) ease;
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
transition:color var(--vibeui-navbar-014-dur-1) ease;
}
[data-vibeui-block="navbar-014"] [data-part="contact"]:hover{color:var(--vibeui-navbar-014-accent)}

[data-vibeui-block="navbar-014"] [data-part="work"]{
flex:1 1 auto;min-width:0;padding:1rem;
display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:1.25rem;align-content:start;
}

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
              DEMO_PIECES.map((entry) => {
                const piece = { title: entry[0], look: entry[1], year: entry[2] }
                return (
                <Card143 key={piece.title} data-part="piece" look={piece.look} title={piece.title} year={piece.year} accent={accent} />
                )
              })}
          </main>
        </div>
      </div>
    </>
  )
}
