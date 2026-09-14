import type { CSSProperties } from "react"

type Navbar013Link = {
  label: string
  href: string
  /** Короткая подпись справа от пункта. */
  note?: string
}

export type Navbar013Props = {
  brand?: string
  menuLabel?: string
  closeLabel?: string
  links?: Navbar013Link[]
  navLabel?: string
  /** Контакт внизу меню. */
  contactLabel?: string
  contactHref?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Плоскость меню: чёрная или оранжевая. */
  surface?: "black" | "orange"
  /** Показать плоскость меню развёрнутой под шапкой: витрина и скриншоты. */
  demo?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Полноэкранное типографическое меню: в закрытом виде минимум — знак и
// кнопка. Открытие через Popover API (атрибуты popover/popovertarget):
// нативный top layer, Escape, light-dismiss и возврат фокуса без единой
// строки JS. Плоскость проявляется, а строки въезжают каскадом — это
// тоже без JS, на @starting-style и transition-behavior: allow-discrete;
// там, где их нет, меню просто появляется, и ничего не ломается.
//
// Внутри — крупные названия разделов с номерами и контакт. Чёрная или
// оранжевая плоскость. Всё движение снимается в prefers-reduced-motion.
const STYLES = `
:where([data-vibeui-block="navbar-013"]){
--vibeui-navbar-013-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-013-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-013-muted:light-dark(color-mix(in oklab,#000000 58%,#ffffff),color-mix(in oklab,#ffffff 66%,#1a1a1a));
--vibeui-navbar-013-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-013-button:light-dark(#000000,#ffffff);
--vibeui-navbar-013-button-ink:light-dark(#ffffff,#000000);
--vibeui-navbar-013-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-013-menu-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-013-menu-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-013-menu-muted:light-dark(color-mix(in oklab,#000000 58%,#ffffff),color-mix(in oklab,#ffffff 66%,#1a1a1a));
--vibeui-navbar-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-013-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-013-dur-2:180ms;
--vibeui-navbar-013-dur-3:240ms;
--vibeui-navbar-013-dur-4:340ms;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-013"]{color-scheme:dark}
:where([data-vibeui-block="navbar-013"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-013"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="navbar-013"][data-surface="orange"]){
--vibeui-navbar-013-menu-bg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-013-menu-ink:light-dark(#ffffff,#111111);
--vibeui-navbar-013-menu-muted:light-dark(color-mix(in oklab,#ffffff 60%,#1a1a1a),color-mix(in oklab,#111111 56%,#f2f2f2));
}
[data-vibeui-block="navbar-013"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-013-bg);
color:var(--vibeui-navbar-013-ink);
border-bottom:1px solid var(--vibeui-navbar-013-line);
font-family:var(--vibeui-navbar-013-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-013"] *{box-sizing:border-box}
[data-vibeui-block="navbar-013"] [data-part="shell"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
max-width:82rem;margin:0 auto;padding:1.125rem 1rem;
}
[data-vibeui-block="navbar-013"] [data-part="brand"]{
color:inherit;text-decoration:none;
font-size:1.125rem;font-weight:740;letter-spacing:-0.03em;
}
[data-vibeui-block="navbar-013"] [data-part="open"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;gap:0.625rem;
min-height:2.625rem;padding:0.25rem 1.25rem;border-radius:999px;
background:var(--vibeui-navbar-013-button);color:var(--vibeui-navbar-013-button-ink);
font:inherit;font-size:0.9375rem;font-weight:620;letter-spacing:-0.01em;
box-shadow:0 0.375rem 1.25rem color-mix(in oklab,#000000 22%,transparent);
transition:background-color var(--vibeui-navbar-013-dur-3) ease,color var(--vibeui-navbar-013-dur-3) ease,transform var(--vibeui-navbar-013-dur-2) var(--vibeui-navbar-013-ease);
}
[data-vibeui-block="navbar-013"] [data-part="open"]:hover{
background:var(--vibeui-navbar-013-accent);color:oklch(from var(--vibeui-navbar-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);transform:translateY(-1px);
}
[data-vibeui-block="navbar-013"] [data-part="stage"]{
background:var(--vibeui-navbar-013-menu-bg);color:var(--vibeui-navbar-013-menu-ink);
}
[data-vibeui-block="navbar-013"] [data-part="stage"] [data-part="sheet-shell"]{
min-height:0;padding-top:1.75rem;
}
[data-vibeui-block="navbar-013"] [data-part="stage"] [data-part="list"]{padding:0 0 1.25rem}
[data-vibeui-block="navbar-013"] [data-part="bars"]{
position:relative;width:1.0625rem;height:0.6875rem;flex:none;
}
[data-vibeui-block="navbar-013"] [data-part="bars"]::before,
[data-vibeui-block="navbar-013"] [data-part="bars"]::after{
content:"";position:absolute;left:0;height:1.75px;border-radius:2px;background:currentColor;
transition:width var(--vibeui-navbar-013-dur-3) var(--vibeui-navbar-013-ease);
}
[data-vibeui-block="navbar-013"] [data-part="bars"]::before{top:0;width:100%}
[data-vibeui-block="navbar-013"] [data-part="bars"]::after{bottom:0;width:62%}
[data-vibeui-block="navbar-013"] [data-part="open"]:hover [data-part="bars"]::after{width:100%}

[data-vibeui-block="navbar-013"] [data-part="sheet"]{
border:0;padding:0;width:100%;height:100%;max-width:none;max-height:none;
inset:0;position:fixed;
background:var(--vibeui-navbar-013-menu-bg);color:var(--vibeui-navbar-013-menu-ink);
font-family:var(--vibeui-navbar-013-font);
overflow:auto;
opacity:0;
transition:opacity var(--vibeui-navbar-013-dur-4) ease,overlay var(--vibeui-navbar-013-dur-4) allow-discrete,display var(--vibeui-navbar-013-dur-4) allow-discrete;
}
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open{opacity:1}
@starting-style{
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open{opacity:0}
}
[data-vibeui-block="navbar-013"] [data-part="sheet"]::backdrop{background:transparent}
[data-vibeui-block="navbar-013"] [data-part="sheet-shell"]{
max-width:82rem;margin:0 auto;min-height:100%;
padding:1.125rem 1rem 1rem;display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-013"] [data-part="sheet-top"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
}
[data-vibeui-block="navbar-013"] [data-part="sheet-brand"]{
font-size:1.125rem;font-weight:740;letter-spacing:-0.03em;
}
[data-vibeui-block="navbar-013"] [data-part="close"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.625rem;padding:0.25rem 1.25rem;border-radius:999px;
background:transparent;color:inherit;
border:1.5px solid color-mix(in oklab,currentColor 36%,transparent);
font:inherit;font-size:0.9375rem;font-weight:620;
transition:border-color var(--vibeui-navbar-013-dur-2) ease,background-color var(--vibeui-navbar-013-dur-2) ease;
}
[data-vibeui-block="navbar-013"] [data-part="close"]:hover{
border-color:currentColor;background:color-mix(in oklab,currentColor 10%,transparent);
}
[data-vibeui-block="navbar-013"] [data-part="cross"]{
position:relative;width:0.75rem;height:0.75rem;flex:none;
}
[data-vibeui-block="navbar-013"] [data-part="cross"]::before,
[data-vibeui-block="navbar-013"] [data-part="cross"]::after{
content:"";position:absolute;top:50%;left:0;right:0;height:1.75px;border-radius:2px;
background:currentColor;
}
[data-vibeui-block="navbar-013"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="navbar-013"] [data-part="cross"]::after{transform:rotate(-45deg)}

[data-vibeui-block="navbar-013"] [data-part="list"]{
display:flex;flex-direction:column;justify-content:center;flex:1 1 auto;
padding:2.5rem 0;
}
[data-vibeui-block="navbar-013"] [data-part="list"] a,
[data-vibeui-block="navbar-013"] [data-part="list"] > span{
position:relative;display:flex;align-items:baseline;gap:1.25rem;
padding:0.625rem 0;color:inherit;text-decoration:none;
border-bottom:1px solid color-mix(in oklab,currentColor 16%,transparent);
transition:color var(--vibeui-navbar-013-dur-2) ease;
}
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open [data-part="list"] a{
animation:vibeui-navbar-013-rise .55s var(--vibeui-navbar-013-ease) both;
}
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open [data-part="list"] a:nth-child(1){animation-delay:.06s}
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open [data-part="list"] a:nth-child(2){animation-delay:.12s}
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open [data-part="list"] a:nth-child(3){animation-delay:.18s}
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open [data-part="list"] a:nth-child(4){animation-delay:.24s}
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open [data-part="list"] a:nth-child(5){animation-delay:.3s}
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open [data-part="list"] a:nth-child(6){animation-delay:.36s}
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open [data-part="list"] a:nth-child(7){animation-delay:.42s}
[data-vibeui-block="navbar-013"] [data-part="sheet"]:popover-open [data-part="list"] a:nth-child(8){animation-delay:.48s}
@keyframes vibeui-navbar-013-rise{
from{opacity:0;transform:translateY(1.25rem)}
to{opacity:1;transform:none}
}
[data-vibeui-block="navbar-013"][data-surface="orange"] [data-part="list"] a:hover{color:#ffffff}
[data-vibeui-block="navbar-013"]:not([data-surface="orange"]) [data-part="list"] a:hover{color:var(--vibeui-navbar-013-accent)}
[data-vibeui-block="navbar-013"] [data-part="index"]{
flex:none;font-size:0.875rem;font-weight:620;
color:var(--vibeui-navbar-013-menu-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="navbar-013"] [data-part="word"]{
font-size:clamp(2rem,7cqi,4.5rem);line-height:1.06;
letter-spacing:-0.035em;font-weight:740;
transition:transform var(--vibeui-navbar-013-dur-4) var(--vibeui-navbar-013-ease);
}
[data-vibeui-block="navbar-013"] [data-part="list"] a:hover [data-part="word"]{transform:translateX(0.75rem)}
[data-vibeui-block="navbar-013"] [data-part="note"]{
margin-left:auto;font-size:0.875rem;color:var(--vibeui-navbar-013-menu-muted);
white-space:nowrap;
}
[data-vibeui-block="navbar-013"] [data-part="contact"]{
align-self:flex-start;color:inherit;text-decoration:none;
font-size:1.0625rem;font-weight:620;
border-bottom:2px solid currentColor;padding-bottom:0.125rem;
margin-bottom:1rem;
transition:opacity var(--vibeui-navbar-013-dur-2) ease;
}
[data-vibeui-block="navbar-013"] [data-part="contact"]:hover{opacity:.66}

[data-vibeui-block="navbar-013"] a:focus-visible,
[data-vibeui-block="navbar-013"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-013-accent);outline-offset:3px;
}
[data-vibeui-block="navbar-013"][data-surface="orange"] a:focus-visible,
[data-vibeui-block="navbar-013"][data-surface="orange"] button:focus-visible{
outline-color:#000000;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="navbar-013"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_LINKS: Navbar013Link[] = [
  { label: "Работы", href: "#works", note: "24 проекта" },
  { label: "Студия", href: "#studio", note: "О нас" },
  { label: "Услуги", href: "#services" },
  { label: "Журнал", href: "#journal" },
  { label: "Контакт", href: "#contact" },
]

/** Минимальная шапка с полноэкранным типографическим меню на Popover API. */
export function Navbar013({
  brand = "Бюро Тон",
  menuLabel = "Меню",
  closeLabel = "Закрыть",
  links = DEFAULT_LINKS,
  navLabel = "Разделы сайта",
  contactLabel = "hello@ton.studio",
  contactHref = "mailto:hello@ton.studio",
  tone = "auto",
  surface = "black",
  demo = false,
  accent,
  className,
  style,
}: Navbar013Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-013" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-013"
        data-tone={tone === "auto" ? undefined : tone}
        data-surface={surface === "orange" ? "orange" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            {brand}
          </a>
          <button
            data-part="open"
            type="button"
            popoverTarget="vibeui-navbar-013-sheet"
          >
            <span data-part="bars" aria-hidden="true" />
            {menuLabel}
          </button>
        </div>

        {demo ? (
          <div data-part="stage" aria-hidden="true">
            <div data-part="sheet-shell">
              <div data-part="list">
                {links.map((link, index) => (
                  <span key={link.href}>
                    <span data-part="index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span data-part="word">{link.label}</span>
                    {link.note ? <span data-part="note">{link.note}</span> : null}
                  </span>
                ))}
              </div>
              <span data-part="contact">{contactLabel}</span>
            </div>
          </div>
        ) : null}

        <div data-part="sheet" id="vibeui-navbar-013-sheet" popover="auto">
          <div data-part="sheet-shell">
            <div data-part="sheet-top">
              <span data-part="sheet-brand">{brand}</span>
              <button
                data-part="close"
                type="button"
                popoverTarget="vibeui-navbar-013-sheet"
                popoverTargetAction="hide"
              >
                <span data-part="cross" aria-hidden="true" />
                {closeLabel}
              </button>
            </div>

            <nav data-part="list" aria-label={navLabel}>
              {links.map((link, index) => (
                <a key={link.href} href={link.href}>
                  <span data-part="index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span data-part="word">{link.label}</span>
                  {link.note ? <span data-part="note">{link.note}</span> : null}
                </a>
              ))}
            </nav>

            <a data-part="contact" href={contactHref}>
              {contactLabel}
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
