"use client"

import { useEffect, useRef, useState } from "react"
import { Button105 } from "@/registry/components/button/button-105/button-105"
import type { CSSProperties } from "react"

type Navbar005Link = {
  label: string
  href: string
}

export type Navbar005Props = {
  brand?: string
  markLabel?: string
  /** Служебная строка о доставке. Пустая строка убирает полосу. */
  notice?: string
  searchPlaceholder?: string
  searchLabel?: string
  /** Адрес обработчика поиска: форму обслуживает принимающий проект. */
  searchAction?: string
  catalogLabel?: string
  catalogLinks?: Navbar005Link[]
  favoritesLabel?: string
  favoritesHref?: string
  cartLabel?: string
  cartHref?: string
  /** Количество товаров в корзине. Ноль скрывает счётчик. */
  cartCount?: number
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка магазина: поиск занимает центральное место капсулой с иконкой и
// оранжевой кнопкой внутри, рядом каталог по группам, избранное и корзина
// со счётчиком. Поле поиска — главный объект шапки, поэтому на фокусе оно
// подсвечивается кольцом, а не тонкой рамкой. Служебная строка про
// доставку визуально тише навигации.
//
// Форму поиска и состояние корзины обслуживает принимающий проект — здесь
// только доступная разметка. Клиентский JS нужен для панели каталога:
// закрытие по Escape и по нажатию снаружи. В узкой колонке поиск
// переезжает на отдельную строку.
const STYLES = `
:where([data-vibeui-block="navbar-005"]){
--vibeui-navbar-005-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-005-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-005-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-005-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-005-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-005-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-005-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-005-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-005-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-005-on-accent:oklch(from var(--vibeui-navbar-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-005-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-005-dur-1:130ms;
--vibeui-navbar-005-dur-2:180ms;
--vibeui-navbar-005-dur-3:240ms;
--vibeui-navbar-005-dur-4:340ms;
--vibeui-navbar-005-notice:light-dark(#1a1a1a,#000000);
--vibeui-navbar-005-notice-ink:#ffffff;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-005"]{color-scheme:dark}
:where([data-vibeui-block="navbar-005"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-005"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-005"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-005-bg);color:var(--vibeui-navbar-005-ink);
border-bottom:1px solid var(--vibeui-navbar-005-line);
font-family:var(--vibeui-navbar-005-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-005"] *{box-sizing:border-box}
[data-vibeui-block="navbar-005"] [data-part="iconlink"]{min-width:3.25rem}

[data-vibeui-block="navbar-005"] [data-part="notice"]{
margin:0;background:var(--vibeui-navbar-005-notice);color:var(--vibeui-navbar-005-notice-ink);
font-size:0.75rem;font-weight:480;letter-spacing:0.01em;text-align:center;padding:0.4375rem 1rem;
}
[data-vibeui-block="navbar-005"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.625rem 1rem;
max-width:82rem;margin:0 auto;padding:0.875rem 1rem;
}

[data-vibeui-block="navbar-005"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:680;letter-spacing:-0.025em;
}
[data-vibeui-block="navbar-005"] [data-part="mark"]{
width:1.875rem;height:1.875rem;flex:none;display:grid;place-items:center;border-radius:0.625rem;
background:var(--vibeui-navbar-005-accent);color:oklch(from var(--vibeui-navbar-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.8125rem;font-weight:800;
box-shadow:0 0.25rem 0.75rem color-mix(in oklab,var(--vibeui-navbar-005-accent) 44%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-005-dur-3) var(--vibeui-navbar-005-ease);
}
[data-vibeui-block="navbar-005"] [data-part="brand"]:hover [data-part="mark"]{transform:rotate(-6deg) scale(1.06)}

[data-vibeui-block="navbar-005"] [data-part="catalog"]{position:relative;flex:none}
[data-vibeui-block="navbar-005"] [data-part="catalog-button"]{
cursor:pointer;border:0;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.625rem;padding:0.25rem 1.0625rem 0.25rem 0.875rem;border-radius:0.75rem;
background:var(--vibeui-navbar-005-accent);color:oklch(from var(--vibeui-navbar-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font:inherit;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em;
box-shadow:0 0.3125rem 1rem color-mix(in oklab,var(--vibeui-navbar-005-accent) 38%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-005-dur-2) var(--vibeui-navbar-005-ease),box-shadow var(--vibeui-navbar-005-dur-3) ease;
}
[data-vibeui-block="navbar-005"] [data-part="catalog-button"]:hover{
transform:translateY(-1px);
box-shadow:0 0.5rem 1.5rem color-mix(in oklab,var(--vibeui-navbar-005-accent) 48%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 52%,transparent);
}
[data-vibeui-block="navbar-005"] [data-part="bars"]{position:relative;width:0.9375rem;height:0.6875rem;flex:none}
[data-vibeui-block="navbar-005"] [data-part="bars"]::before,
[data-vibeui-block="navbar-005"] [data-part="bars"]::after{
content:"";position:absolute;left:0;right:0;height:1.75px;border-radius:2px;background:currentColor;
transition:transform var(--vibeui-navbar-005-dur-4) var(--vibeui-navbar-005-ease);
}
[data-vibeui-block="navbar-005"] [data-part="bars"]::before{top:0}
[data-vibeui-block="navbar-005"] [data-part="bars"]::after{bottom:0}
[data-vibeui-block="navbar-005"] [data-part="catalog-button"][aria-expanded="true"] [data-part="bars"]::before{transform:translateY(0.3125rem) rotate(45deg)}
[data-vibeui-block="navbar-005"] [data-part="catalog-button"][aria-expanded="true"] [data-part="bars"]::after{transform:translateY(-0.3125rem) rotate(-45deg)}

[data-vibeui-block="navbar-005"] [data-part="catalog-panel"]{
position:absolute;left:0;top:calc(100% + 0.5rem);z-index:60;min-width:15rem;
background:var(--vibeui-navbar-005-bg);
border:1px solid var(--vibeui-navbar-005-line);border-radius:1rem;
box-shadow:var(--vibeui-navbar-005-shadow);
padding:0.375rem;display:flex;flex-direction:column;
transform-origin:top left;
transition:opacity var(--vibeui-navbar-005-dur-2) ease,transform var(--vibeui-navbar-005-dur-3) var(--vibeui-navbar-005-ease);
}
[data-vibeui-block="navbar-005"] [data-part="catalog-panel"][data-open="false"]{
opacity:0;transform:translateY(-0.375rem) scale(.98);pointer-events:none;
}
[data-vibeui-block="navbar-005"] [data-part="catalog-panel"] a{
padding:0.625rem 0.75rem;border-radius:0.625rem;
color:var(--vibeui-navbar-005-ink);text-decoration:none;
font-size:0.9375rem;font-weight:540;
transition:background-color var(--vibeui-navbar-005-dur-1) ease,color var(--vibeui-navbar-005-dur-1) ease;
}
[data-vibeui-block="navbar-005"] [data-part="catalog-panel"] a:hover{
background:var(--vibeui-navbar-005-hover);color:var(--vibeui-navbar-005-accent);
}

[data-vibeui-block="navbar-005"] [data-part="search"]{
order:3;flex:1 1 100%;display:flex;align-items:center;gap:0.5rem;min-width:0;
padding:0.1875rem 0.1875rem 0.1875rem 0.9375rem;border-radius:999px;
background:var(--vibeui-navbar-005-field);
border:1px solid transparent;
box-shadow:inset 0 1px 2px color-mix(in oklab,#000000 7%,transparent);
transition:border-color var(--vibeui-navbar-005-dur-2) ease,box-shadow var(--vibeui-navbar-005-dur-2) ease,background-color var(--vibeui-navbar-005-dur-2) ease;
}
[data-vibeui-block="navbar-005"] [data-part="search"]:focus-within{
background:var(--vibeui-navbar-005-bg);
border-color:var(--vibeui-navbar-005-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-navbar-005-accent) 22%,transparent);
}
[data-vibeui-block="navbar-005"] [data-part="search"] [data-part="glass"]{
width:1.0625rem;height:1.0625rem;flex:none;color:var(--vibeui-navbar-005-muted);
}
[data-vibeui-block="navbar-005"] [data-part="search"] input{
flex:1 1 auto;min-width:0;min-height:2.25rem;padding:0;
background:transparent;color:var(--vibeui-navbar-005-ink);
border:0;font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="navbar-005"] [data-part="search"] input:focus{outline:none}
[data-vibeui-block="navbar-005"] [data-part="search"] input::placeholder{color:var(--vibeui-navbar-005-muted)}
[data-vibeui-block="navbar-005"] [data-part="search"] button{
appearance:none;border:0;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:999px;
background:var(--vibeui-navbar-005-accent);color:oklch(from var(--vibeui-navbar-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
box-shadow:inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-005-dur-2) var(--vibeui-navbar-005-ease),box-shadow var(--vibeui-navbar-005-dur-3) ease;
}
[data-vibeui-block="navbar-005"] [data-part="search"] button:hover{
transform:scale(1.06);
box-shadow:0 0.375rem 1rem color-mix(in oklab,var(--vibeui-navbar-005-accent) 50%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 52%,transparent);
}

[data-vibeui-block="navbar-005"] [data-part="actions"]{
display:flex;align-items:center;gap:0.125rem;margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-005"] [data-part="count"]{
position:absolute;top:0.125rem;right:0.5rem;
min-width:1.125rem;height:1.125rem;padding:0 0.25rem;
display:inline-flex;align-items:center;justify-content:center;
background:var(--vibeui-navbar-005-accent);color:oklch(from var(--vibeui-navbar-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
border-radius:999px;font-size:0.6875rem;font-weight:700;
box-shadow:0 0 0 2px var(--vibeui-navbar-005-bg);
}

[data-vibeui-block="navbar-005"] a:focus-visible,
[data-vibeui-block="navbar-005"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-005-accent);outline-offset:3px;
}
@container (min-width: 56rem){
[data-vibeui-block="navbar-005"] [data-part="shell"]{padding:0.875rem 2rem;gap:0.625rem 1.25rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-005"] [data-part="search"]{order:0;flex:1 1 auto;max-width:38rem;margin:0 auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CATALOG: Navbar005Link[] = [
  { label: "Новинки", href: "#new" },
  { label: "Одежда", href: "#clothes" },
  { label: "Обувь", href: "#shoes" },
  { label: "Аксессуары", href: "#accessories" },
  { label: "Распродажа", href: "#sale" },
]

function SearchIcon({ part }: { part?: string }) {
  return (
    <svg
      data-part={part}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m16.5 16.5 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}


function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 8h14l-1 12H6L5 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 10V6.5A3 3 0 0 1 12 3.5a3 3 0 0 1 3 3V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Шапка магазина: каталог, капсула поиска, избранное и корзина со счётчиком. */
export function Navbar005({
  brand = "Лавка",
  markLabel = "Л",
  notice = "Доставка по России от 2 дней · бесплатно от 5 000 ₽",
  searchPlaceholder = "Искать товары",
  searchLabel = "Поиск по магазину",
  searchAction = "#search",
  catalogLabel = "Каталог",
  catalogLinks = DEFAULT_CATALOG,
  favoritesLabel = "Избранное",
  favoritesHref = "#favorites",
  cartLabel = "Корзина",
  cartHref = "#cart",
  cartCount = 2,
  tone = "auto",
  accent,
  className,
  style,
}: Navbar005Props) {
  const catalogRef = useRef<HTMLDivElement>(null)
  const [catalogOpen, setCatalogOpen] = useState(false)

  useEffect(() => {
    if (!catalogOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCatalogOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!catalogRef.current?.contains(event.target as Node)) {
        setCatalogOpen(false)
      }
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [catalogOpen])

  const palette = {
    ...(accent ? { "--vibeui-navbar-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-005" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-005"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        {notice ? <p data-part="notice">{notice}</p> : null}
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            {brand}
          </a>

          <div ref={catalogRef} data-part="catalog">
            <button
              type="button"
              data-part="catalog-button"
              aria-expanded={catalogOpen}
              aria-controls="vibeui-navbar-005-catalog"
              onClick={() => setCatalogOpen((open) => !open)}
            >
              <span data-part="bars" aria-hidden="true" />
              {catalogLabel}
            </button>
            <nav
              id="vibeui-navbar-005-catalog"
              data-part="catalog-panel"
              data-open={catalogOpen}
              aria-label={catalogLabel}
              aria-hidden={!catalogOpen}
            >
              {catalogLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  tabIndex={catalogOpen ? undefined : -1}
                  onClick={() => setCatalogOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <form data-part="search" action={searchAction} role="search">
            <SearchIcon part="glass" />
            <input
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              aria-label={searchLabel}
            />
            <button type="submit" aria-label={searchLabel}>
              <SearchIcon />
            </button>
          </form>

          <div data-part="actions">
            <Button105 data-part="iconlink" favoritesHref={favoritesHref} favoritesLabel={favoritesLabel} accent={accent} />
            <Button105 data-part="iconlink" favoritesHref={favoritesHref} favoritesLabel={favoritesLabel} accent={accent} />
          </div>
        </div>
      </header>
    </>
  )
}
