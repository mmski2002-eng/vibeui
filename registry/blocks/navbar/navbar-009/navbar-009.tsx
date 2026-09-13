"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

type Navbar009Branch = {
  label: string
  address: string
  href: string
}

export type Navbar009Props = {
  name?: string
  /** Короткое описание услуги под названием. */
  tagline?: string
  /** Буква в знаке. */
  markLabel?: string
  phone?: string
  phoneHref?: string
  callLabel?: string
  hours?: string
  /** Подпись состояния рядом с часами: «Открыто», «Закрыто до 9:00». */
  status?: string
  /** Заведение сейчас работает: точка состояния горит акцентом. */
  open?: boolean
  branchLabel?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  branches?: Navbar009Branch[]
  actionLabel?: string
  actionHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка локального бизнеса. Человек приходит сюда за тремя вещами:
// позвонить, узнать часы и записаться — поэтому телефон набран крупно
// настоящей ссылкой tel:, рядом честное состояние «открыто / закрыто», а
// запись вынесена в единственную заметную кнопку. Филиал выбирается
// раскрытием с адресом, потому что «Филиал 2» ни о чём не говорит.
//
// Онлайн-запись не изображается подключённой: кнопка ведёт по переданной
// ссылке, реальную запись обслуживает принимающий проект. Клиентский JS
// нужен только для панели филиалов: Escape и нажатие снаружи закрывают её.
const STYLES = `
:where([data-vibeui-block="navbar-009"]){
--vibeui-navbar-009-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-009-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-009-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-009-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-009-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-009-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-009-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-009-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-009-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-009-on-accent:oklch(from var(--vibeui-navbar-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-009-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-009-dur-1:130ms;
--vibeui-navbar-009-dur-2:180ms;
--vibeui-navbar-009-dur-3:240ms;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-009"]{color-scheme:dark}
:where([data-vibeui-block="navbar-009"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-009"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-009"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-009-bg);color:var(--vibeui-navbar-009-ink);
border-bottom:1px solid var(--vibeui-navbar-009-line);
font-family:var(--vibeui-navbar-009-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-009"] *{box-sizing:border-box}
[data-vibeui-block="navbar-009"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.75rem 1.25rem;
max-width:82rem;margin:0 auto;padding:0.875rem 1rem;
}

[data-vibeui-block="navbar-009"] [data-part="ident"]{
display:flex;align-items:center;gap:0.6875rem;flex:1 1 12rem;min-width:0;
color:inherit;text-decoration:none;
}
[data-vibeui-block="navbar-009"] [data-part="mark"]{
width:2.5rem;height:2.5rem;flex:none;display:grid;place-items:center;border-radius:0.875rem;
background:var(--vibeui-navbar-009-accent);color:oklch(from var(--vibeui-navbar-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:1.0625rem;font-weight:800;
box-shadow:0 0.375rem 1rem color-mix(in oklab,var(--vibeui-navbar-009-accent) 44%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-009-dur-3) var(--vibeui-navbar-009-ease);
}
[data-vibeui-block="navbar-009"] [data-part="ident"]:hover [data-part="mark"]{transform:rotate(-6deg) scale(1.05)}
[data-vibeui-block="navbar-009"] [data-part="titles"]{
display:flex;flex-direction:column;gap:0.0625rem;min-width:0;
}
[data-vibeui-block="navbar-009"] [data-part="name"]{
font-size:1.1875rem;font-weight:700;letter-spacing:-0.025em;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="navbar-009"] [data-part="tagline"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-navbar-009-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}

[data-vibeui-block="navbar-009"] [data-part="branch"]{position:relative;flex:none}
[data-vibeui-block="navbar-009"] [data-part="branch-button"]{
cursor:pointer;background:transparent;
display:inline-flex;align-items:center;gap:0.4375rem;max-width:17rem;
padding:0.4375rem 0.75rem;border-radius:999px;
border:1px solid var(--vibeui-navbar-009-line);
font:inherit;font-size:0.8125rem;color:var(--vibeui-navbar-009-muted);
transition:background-color var(--vibeui-navbar-009-dur-2) ease,border-color var(--vibeui-navbar-009-dur-2) ease,color var(--vibeui-navbar-009-dur-1) ease;
}
[data-vibeui-block="navbar-009"] [data-part="branch-button"]:hover,
[data-vibeui-block="navbar-009"] [data-part="branch-button"][aria-expanded="true"]{
background:var(--vibeui-navbar-009-hover);color:var(--vibeui-navbar-009-ink);
border-color:color-mix(in oklab,var(--vibeui-navbar-009-accent) 45%,transparent);
}
[data-vibeui-block="navbar-009"] [data-part="pin"]{
width:0.875rem;height:0.875rem;flex:none;color:var(--vibeui-navbar-009-accent);
}
[data-vibeui-block="navbar-009"] [data-part="branch-button"] span{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"]{
position:absolute;left:0;top:calc(100% + 0.4375rem);z-index:60;min-width:17rem;
background:var(--vibeui-navbar-009-bg);
border:1px solid var(--vibeui-navbar-009-line);border-radius:1rem;
box-shadow:var(--vibeui-navbar-009-shadow);
display:flex;flex-direction:column;padding:0.3125rem;
transform-origin:top left;
transition:opacity var(--vibeui-navbar-009-dur-2) ease,transform var(--vibeui-navbar-009-dur-3) var(--vibeui-navbar-009-ease);
}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"][data-open="false"]{
opacity:0;transform:translateY(-0.375rem) scale(.98);pointer-events:none;
}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"] a{
display:flex;flex-direction:column;gap:0.0625rem;
padding:0.625rem 0.75rem;border-radius:0.75rem;
color:var(--vibeui-navbar-009-ink);text-decoration:none;
transition:background-color var(--vibeui-navbar-009-dur-1) ease;
}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"] a:hover{background:var(--vibeui-navbar-009-hover)}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"] strong{font-size:0.875rem;font-weight:620}
[data-vibeui-block="navbar-009"] [data-part="branch-panel"] span{
font-size:0.8125rem;color:var(--vibeui-navbar-009-muted);
}

[data-vibeui-block="navbar-009"] [data-part="contact"]{
display:flex;flex-direction:column;align-items:flex-end;gap:0.125rem;
margin-left:auto;flex:none;
}
[data-vibeui-block="navbar-009"] [data-part="phone"]{
color:inherit;text-decoration:none;
font-size:1.125rem;font-weight:700;letter-spacing:-0.02em;white-space:nowrap;
font-variant-numeric:tabular-nums;
transition:color var(--vibeui-navbar-009-dur-1) ease;
}
[data-vibeui-block="navbar-009"] [data-part="phone"]:hover{color:var(--vibeui-navbar-009-accent)}
[data-vibeui-block="navbar-009"] [data-part="hours"]{
margin:0;display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.75rem;color:var(--vibeui-navbar-009-muted);white-space:nowrap;
}
[data-vibeui-block="navbar-009"] [data-part="state"]{
width:0.4375rem;height:0.4375rem;flex:none;border-radius:999px;
background:var(--vibeui-navbar-009-muted);
}
[data-vibeui-block="navbar-009"][data-open="yes"] [data-part="state"]{
background:var(--vibeui-navbar-009-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-navbar-009-accent) 22%,transparent);color:oklch(from var(--vibeui-navbar-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}

[data-vibeui-block="navbar-009"] [data-part="actions"]{
display:flex;gap:0.5rem;flex:1 1 100%;
}
[data-vibeui-block="navbar-009"] [data-part="call"]{display:none}
[data-vibeui-block="navbar-009"] [data-part="book"]{
flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-height:2.875rem;padding:0.25rem 1.375rem;border-radius:0.875rem;
background:var(--vibeui-navbar-009-accent);color:oklch(from var(--vibeui-navbar-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;font-size:1rem;font-weight:660;white-space:nowrap;letter-spacing:-0.01em;
box-shadow:0 0.375rem 1.25rem color-mix(in oklab,var(--vibeui-navbar-009-accent) 40%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-009-dur-2) var(--vibeui-navbar-009-ease),box-shadow var(--vibeui-navbar-009-dur-3) ease;
}
[data-vibeui-block="navbar-009"] [data-part="book"] svg{width:1.0625rem;height:1.0625rem}
[data-vibeui-block="navbar-009"] [data-part="book"]:hover{
transform:translateY(-1px);
box-shadow:0 0.625rem 1.75rem color-mix(in oklab,var(--vibeui-navbar-009-accent) 50%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 52%,transparent);
}

[data-vibeui-block="navbar-009"] a:focus-visible,
[data-vibeui-block="navbar-009"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-009-accent);outline-offset:3px;
}
@container (max-width: 47.9375rem){
[data-vibeui-block="navbar-009"] [data-part="contact"]{display:none}
[data-vibeui-block="navbar-009"] [data-part="call"]{
flex:1 1 auto;display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-height:2.875rem;padding:0.25rem 1.25rem;border-radius:0.875rem;
border:1.5px solid var(--vibeui-navbar-009-ink);color:var(--vibeui-navbar-009-ink);
text-decoration:none;font-size:1rem;font-weight:620;white-space:nowrap;
}
[data-vibeui-block="navbar-009"] [data-part="call"] svg{width:1.0625rem;height:1.0625rem}
}
@container (min-width: 48rem){
[data-vibeui-block="navbar-009"] [data-part="shell"]{padding:1rem 2rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-009"] [data-part="actions"]{flex:none}
[data-vibeui-block="navbar-009"] [data-part="book"]{flex:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BRANCHES: Navbar009Branch[] = [
  { label: "На Ленина", address: "пр. Ленина, 52", href: "#lenina" },
  { label: "На Малышева", address: "ул. Малышева, 18", href: "#malysheva" },
]

function PinIcon() {
  return (
    <svg data-part="pin" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14.5s5-4.4 5-8a5 5 0 0 0-10 0c0 3.6 5 8 5 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.4" r="1.7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.2 3h2.1l1.2 3-1.6 1.2a9.4 9.4 0 0 0 4.9 4.9L13 10.5l3 1.2v2.1c0 .9-.8 1.6-1.7 1.5C8.1 14.8 5.2 11.9 4.7 5.7 4.6 4.8 5.3 3 5.2 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="4.5"
        width="14"
        height="12.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3 8.5h14M7 2.8v3M13 2.8v3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Шапка бизнеса: название, телефон, часы с состоянием, филиал и запись. */
export function Navbar009({
  name = "Клиника «Ясно»",
  tagline = "Стоматология для всей семьи",
  markLabel = "Я",
  phone = "+7 343 222-14-08",
  phoneHref = "tel:+73432221408",
  callLabel = "Позвонить",
  hours = "Ежедневно 9:00–21:00",
  status = "Открыто",
  open = true,
  branchLabel = "Филиал",
  tone = "auto",
  branches = DEFAULT_BRANCHES,
  actionLabel = "Записаться",
  actionHref = "#appointment",
  accent,
  className,
  style,
}: Navbar009Props) {
  const branchRef = useRef<HTMLDivElement>(null)
  const [branchOpen, setBranchOpen] = useState(false)

  useEffect(() => {
    if (!branchOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBranchOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!branchRef.current?.contains(event.target as Node)) {
        setBranchOpen(false)
      }
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [branchOpen])

  const palette = {
    ...(accent ? { "--vibeui-navbar-009-accent": accent } : null),
    ...style,
  } as CSSProperties
  const current = branches[0]

  return (
    <>
      <style href="vibeui-navbar-009" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-009"
        data-tone={tone === "auto" ? undefined : tone}
        data-open={open ? "yes" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="ident" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            <span data-part="titles">
              <span data-part="name">{name}</span>
              <span data-part="tagline">{tagline}</span>
            </span>
          </a>

          {branches.length > 0 ? (
            <div ref={branchRef} data-part="branch">
              <button
                type="button"
                data-part="branch-button"
                aria-expanded={branchOpen}
                aria-label={`${branchLabel}: ${current.label}, ${current.address}`}
                onClick={() => setBranchOpen((value) => !value)}
              >
                <PinIcon />
                <span>
                  {current.label} · {current.address}
                </span>
              </button>
              <nav
                data-part="branch-panel"
                data-open={branchOpen}
                aria-label={branchLabel}
                aria-hidden={!branchOpen}
              >
                {branches.map((branch) => (
                  <a
                    key={branch.href}
                    href={branch.href}
                    tabIndex={branchOpen ? undefined : -1}
                    onClick={() => setBranchOpen(false)}
                  >
                    <strong>{branch.label}</strong>
                    <span>{branch.address}</span>
                  </a>
                ))}
              </nav>
            </div>
          ) : null}

          <div data-part="contact">
            <a data-part="phone" href={phoneHref}>
              {phone}
            </a>
            <p data-part="hours">
              <span data-part="state" aria-hidden="true" />
              {status ? `${status} · ` : ""}
              {hours}
            </p>
          </div>

          <div data-part="actions">
            <a data-part="call" href={phoneHref}>
              <PhoneIcon />
              {callLabel}
            </a>
            <a data-part="book" href={actionHref}>
              <CalendarIcon />
              {actionLabel}
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
