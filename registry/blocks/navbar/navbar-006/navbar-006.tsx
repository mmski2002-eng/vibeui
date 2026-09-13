"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import type { CSSProperties } from "react"

type Navbar006Link = {
  label: string
  href: string
  current?: boolean
}

export type Navbar006Props = {
  brand?: string
  markLabel?: string
  /** Название документации рядом с брендом. */
  section?: string
  /** Текущая версия. */
  version?: string
  /** Прошлые версии в раскрытии. */
  versions?: Navbar006Link[]
  links?: Navbar006Link[]
  searchPlaceholder?: string
  searchLabel?: string
  /** Адрес обработчика поиска: форму обслуживает принимающий проект. */
  searchAction?: string
  productLabel?: string
  productHref?: string
  navLabel?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Показать переключатель светлой и тёмной поверхности. */
  themeToggle?: boolean
  themeLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка документации: компактный бренд с названием раздела, версия
// раскрытием, поиск капсулой и ссылка обратно к продукту. Поиск открыт
// всегда, а сочетание клавиш — ускорение, а не условие доступа: работают
// и «/», и Cmd/Ctrl+K, подпись клавиши подставляется под платформу
// читателя, а не пишется «⌘K» всем подряд.
//
// Переключатель поверхности меняет тему самого блока: в проекте его
// обработчик подключают к своему провайдеру темы. Клиентский JS нужен для
// раскрытия версий, горячих клавиш и этого переключателя.
const STYLES = `
:where([data-vibeui-block="navbar-006"]){
--vibeui-navbar-006-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-006-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-006-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-006-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-006-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-006-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-006-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-006-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-006-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-006-on-accent:oklch(from var(--vibeui-navbar-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-006-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-006-dur-1:130ms;
--vibeui-navbar-006-dur-2:180ms;
--vibeui-navbar-006-dur-3:240ms;
--vibeui-navbar-006-dur-4:340ms;
--vibeui-navbar-006-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-006"]{color-scheme:dark}
:where([data-vibeui-block="navbar-006"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-006"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-006"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-006-bg);color:var(--vibeui-navbar-006-ink);
border-bottom:1px solid var(--vibeui-navbar-006-line);
font-family:var(--vibeui-navbar-006-font);
font-feature-settings:"cv11","ss01";
transition:background-color var(--vibeui-navbar-006-dur-4) ease,color var(--vibeui-navbar-006-dur-4) ease;
}
[data-vibeui-block="navbar-006"] *{box-sizing:border-box}
[data-vibeui-block="navbar-006"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.625rem 0.875rem;
max-width:90rem;margin:0 auto;padding:0.6875rem 1rem;
}

[data-vibeui-block="navbar-006"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:inherit;text-decoration:none;font-size:1rem;font-weight:680;letter-spacing:-0.025em;
}
[data-vibeui-block="navbar-006"] [data-part="mark"]{
width:1.625rem;height:1.625rem;flex:none;display:grid;place-items:center;border-radius:0.4375rem;
background:var(--vibeui-navbar-006-accent);color:oklch(from var(--vibeui-navbar-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.75rem;font-weight:800;
box-shadow:0 0.1875rem 0.625rem color-mix(in oklab,var(--vibeui-navbar-006-accent) 44%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-006-dur-3) var(--vibeui-navbar-006-ease);
}
[data-vibeui-block="navbar-006"] [data-part="brand"]:hover [data-part="mark"]{transform:rotate(-6deg) scale(1.06)}
[data-vibeui-block="navbar-006"] [data-part="section"]{
padding-left:0.5rem;margin-left:0.125rem;
border-left:1px solid var(--vibeui-navbar-006-line);
color:var(--vibeui-navbar-006-muted);font-weight:480;
}

[data-vibeui-block="navbar-006"] [data-part="version"]{position:relative;flex:none}
[data-vibeui-block="navbar-006"] [data-part="version-button"]{
cursor:pointer;display:inline-flex;align-items:center;gap:0.375rem;
padding:0.3125rem 0.625rem;border-radius:999px;
background:var(--vibeui-navbar-006-field);border:1px solid var(--vibeui-navbar-006-line);
font-family:var(--vibeui-navbar-006-mono);font-size:0.75rem;
color:var(--vibeui-navbar-006-muted);
transition:color var(--vibeui-navbar-006-dur-1) ease,border-color var(--vibeui-navbar-006-dur-2) ease;
}
[data-vibeui-block="navbar-006"] [data-part="version-button"]:hover{
color:var(--vibeui-navbar-006-ink);border-color:var(--vibeui-navbar-006-accent);
}
[data-vibeui-block="navbar-006"] [data-part="version-button"] span{
width:0.3125rem;height:0.3125rem;flex:none;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translateY(-0.0625rem);
transition:transform var(--vibeui-navbar-006-dur-3) var(--vibeui-navbar-006-ease);
}
[data-vibeui-block="navbar-006"] [data-part="version-button"][aria-expanded="true"] span{
transform:rotate(225deg) translateY(-0.0625rem);
}
[data-vibeui-block="navbar-006"] [data-part="versions"]{
position:absolute;left:0;top:calc(100% + 0.375rem);z-index:60;min-width:10rem;
background:var(--vibeui-navbar-006-bg);
border:1px solid var(--vibeui-navbar-006-line);border-radius:0.875rem;
box-shadow:var(--vibeui-navbar-006-shadow);
display:flex;flex-direction:column;padding:0.3125rem;
transform-origin:top left;
transition:opacity var(--vibeui-navbar-006-dur-2) ease,transform var(--vibeui-navbar-006-dur-3) var(--vibeui-navbar-006-ease);
}
[data-vibeui-block="navbar-006"] [data-part="versions"][data-open="false"]{
opacity:0;transform:translateY(-0.375rem) scale(.98);pointer-events:none;
}
[data-vibeui-block="navbar-006"] [data-part="versions"] a{
padding:0.4375rem 0.625rem;border-radius:0.5rem;
color:var(--vibeui-navbar-006-ink);text-decoration:none;
font-family:var(--vibeui-navbar-006-mono);font-size:0.75rem;
transition:background-color var(--vibeui-navbar-006-dur-1) ease,color var(--vibeui-navbar-006-dur-1) ease;
}
[data-vibeui-block="navbar-006"] [data-part="versions"] a:hover{
background:var(--vibeui-navbar-006-hover);color:var(--vibeui-navbar-006-accent);
}

[data-vibeui-block="navbar-006"] [data-part="search"]{
order:3;flex:1 1 100%;display:flex;align-items:center;gap:0.5rem;min-width:0;
padding:0.25rem 0.4375rem 0.25rem 0.8125rem;border-radius:999px;
background:var(--vibeui-navbar-006-field);
border:1px solid var(--vibeui-navbar-006-line);
transition:border-color var(--vibeui-navbar-006-dur-2) ease,box-shadow var(--vibeui-navbar-006-dur-2) ease,background-color var(--vibeui-navbar-006-dur-2) ease;
}
[data-vibeui-block="navbar-006"] [data-part="search"]:focus-within{
background:var(--vibeui-navbar-006-bg);
border-color:var(--vibeui-navbar-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-navbar-006-accent) 20%,transparent);
}
[data-vibeui-block="navbar-006"] [data-part="search"] svg{
width:1rem;height:1rem;flex:none;color:var(--vibeui-navbar-006-muted);
}
[data-vibeui-block="navbar-006"] [data-part="search"] input{
flex:1 1 auto;min-width:0;min-height:2rem;padding:0;
background:transparent;color:var(--vibeui-navbar-006-ink);
border:0;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="navbar-006"] [data-part="search"] input:focus{outline:none}
[data-vibeui-block="navbar-006"] [data-part="search"] input::placeholder{color:var(--vibeui-navbar-006-muted)}
[data-vibeui-block="navbar-006"] [data-part="search"] kbd{
flex:none;pointer-events:none;
padding:0.125rem 0.4375rem;border-radius:0.375rem;
border:1px solid var(--vibeui-navbar-006-line);
background:var(--vibeui-navbar-006-bg);
font-family:var(--vibeui-navbar-006-mono);font-size:0.6875rem;
color:var(--vibeui-navbar-006-muted);
}

[data-vibeui-block="navbar-006"] [data-part="nav"]{
display:flex;align-items:center;gap:0.125rem;margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-006"] [data-part="nav"] a{
padding:0.4375rem 0.6875rem;border-radius:0.5rem;
color:var(--vibeui-navbar-006-muted);text-decoration:none;
font-size:0.875rem;font-weight:530;white-space:nowrap;
transition:color var(--vibeui-navbar-006-dur-1) ease,background-color var(--vibeui-navbar-006-dur-2) ease;
}
[data-vibeui-block="navbar-006"] [data-part="nav"] a:hover{
color:var(--vibeui-navbar-006-ink);background:var(--vibeui-navbar-006-hover);
}
[data-vibeui-block="navbar-006"] [data-part="nav"] a[aria-current="page"]{
color:var(--vibeui-navbar-006-accent);font-weight:620;
background:color-mix(in oklab,var(--vibeui-navbar-006-accent) 12%,transparent);
}

[data-vibeui-block="navbar-006"] [data-part="theme"]{
flex:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:0.625rem;
background:transparent;border:1px solid var(--vibeui-navbar-006-line);
color:var(--vibeui-navbar-006-muted);
transition:color var(--vibeui-navbar-006-dur-1) ease,background-color var(--vibeui-navbar-006-dur-2) ease;
}
[data-vibeui-block="navbar-006"] [data-part="theme"]:hover{
color:var(--vibeui-navbar-006-ink);background:var(--vibeui-navbar-006-hover);
}
[data-vibeui-block="navbar-006"] [data-part="theme"] svg{width:1.0625rem;height:1.0625rem}

[data-vibeui-block="navbar-006"] [data-part="product"]{
flex:none;display:inline-flex;align-items:center;gap:0.375rem;
min-height:2.25rem;padding:0.25rem 0.875rem;border-radius:0.625rem;
background:var(--vibeui-navbar-006-ink);color:var(--vibeui-navbar-006-bg);
text-decoration:none;font-size:0.875rem;font-weight:580;white-space:nowrap;
transition:transform var(--vibeui-navbar-006-dur-2) var(--vibeui-navbar-006-ease),box-shadow var(--vibeui-navbar-006-dur-3) ease;
}
[data-vibeui-block="navbar-006"] [data-part="product"] svg{
width:0.8125rem;height:0.8125rem;transition:transform var(--vibeui-navbar-006-dur-3) var(--vibeui-navbar-006-ease);
}
[data-vibeui-block="navbar-006"] [data-part="product"]:hover{transform:translateY(-1px)}
[data-vibeui-block="navbar-006"] [data-part="product"]:hover svg{transform:translateX(0.1875rem)}

[data-vibeui-block="navbar-006"] a:focus-visible,
[data-vibeui-block="navbar-006"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-006-accent);outline-offset:3px;
}
@container (min-width: 58rem){
[data-vibeui-block="navbar-006"] [data-part="shell"]{padding:0.6875rem 1.5rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-006"] [data-part="search"]{order:0;flex:0 1 26rem;margin:0 1rem}
[data-vibeui-block="navbar-006"] [data-part="nav"]{margin-left:auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINKS: Navbar006Link[] = [
  { label: "Руководство", href: "#guide", current: true },
  { label: "API", href: "#api" },
  { label: "Примеры", href: "#examples" },
]

const DEFAULT_VERSIONS: Navbar006Link[] = [
  { label: "v3 (текущая)", href: "#v3" },
  { label: "v2", href: "#v2" },
  { label: "v1", href: "#v1" },
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

/** Шапка документации: бренд, версия, поиск с горячей клавишей и ссылка к продукту. */
/** Платформа за время жизни страницы не меняется: подписка пустая. */
function subscribeNever() {
  return () => {}
}

export function Navbar006({
  brand = "Прибор",
  markLabel = "П",
  section = "Документация",
  version = "v3.2",
  versions = DEFAULT_VERSIONS,
  links = DEFAULT_LINKS,
  searchPlaceholder = "Искать в документации",
  searchLabel = "Поиск по документации",
  searchAction = "#search",
  productLabel = "К продукту",
  productHref = "#product",
  navLabel = "Разделы документации",
  tone = "auto",
  themeToggle = true,
  themeLabel = "Сменить тему",
  accent,
  className,
  style,
}: Navbar006Props) {
  const versionRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [versionsOpen, setVersionsOpen] = useState(false)
  // null — тема следует странице; строка — читатель зафиксировал её сам.
  const [override, setOverride] = useState<"light" | "dark" | null>(
    tone === "auto" ? null : tone,
  )
  const rootRef = useRef<HTMLElement>(null)
  // Подпись клавиши зависит от платформы читателя, поэтому известна только
  // на клиенте: на сервере и до гидратации показываем нейтральное «/».
  const hint = useSyncExternalStore(
    subscribeNever,
    () =>
      /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)
        ? "⌘K"
        : "Ctrl K",
    () => "/",
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable

      const hotkey =
        (event.key === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey)

      if (!hotkey) return

      event.preventDefault()
      inputRef.current?.focus()
    }

    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!versionsOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVersionsOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!versionRef.current?.contains(event.target as Node)) {
        setVersionsOpen(false)
      }
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [versionsOpen])

  const palette = {
    ...(accent ? { "--vibeui-navbar-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-006" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-006"
        ref={rootRef}
        data-tone={override ?? undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            {brand}
            <span data-part="section">{section}</span>
          </a>

          <div ref={versionRef} data-part="version">
            <button
              type="button"
              data-part="version-button"
              aria-expanded={versionsOpen}
              aria-label={`Версия ${version}`}
              onClick={() => setVersionsOpen((open) => !open)}
            >
              {version}
              <span aria-hidden="true" />
            </button>
            <nav
              data-part="versions"
              data-open={versionsOpen}
              aria-label="Версии документации"
              aria-hidden={!versionsOpen}
            >
              {versions.map((entry) => (
                <a
                  key={entry.href}
                  href={entry.href}
                  tabIndex={versionsOpen ? undefined : -1}
                  onClick={() => setVersionsOpen(false)}
                >
                  {entry.label}
                </a>
              ))}
            </nav>
          </div>

          <form data-part="search" action={searchAction} role="search">
            <SearchIcon />
            <input
              ref={inputRef}
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              aria-label={searchLabel}
            />
            <kbd aria-hidden="true">{hint}</kbd>
          </form>

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

          {themeToggle ? (
            <button
              type="button"
              data-part="theme"
              aria-label={themeLabel}
              aria-pressed={override === "dark"}
              onClick={() => {
                // Из режима «как на странице» первый щелчок уводит в
                // противоположную сторону от того, что читатель видит сейчас.
                const current =
                  override ??
                  (rootRef.current &&
                  getComputedStyle(rootRef.current).colorScheme === "dark"
                    ? "dark"
                    : "light")
                setOverride(current === "dark" ? "light" : "dark")
              }}
            >
              {override === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M20 14.4A8.5 8.5 0 0 1 9.6 4 8.5 8.5 0 1 0 20 14.4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ) : null}

          <a data-part="product" href={productHref}>
            {productLabel}
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </header>
    </>
  )
}
