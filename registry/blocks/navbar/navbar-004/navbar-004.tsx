"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"
import type { CSSProperties } from "react"

type Navbar004Link = {
  label: string
  href: string
  /** Короткое пояснение под ссылкой. */
  note?: string
}

type Navbar004Column = {
  title: string
  links: Navbar004Link[]
}

type Navbar004Promo = {
  title: string
  text: string
  href: string
  actionLabel: string
}

type Navbar004Group = {
  label: string
  columns: Navbar004Column[]
  promo?: Navbar004Promo
}

export type Navbar004Props = {
  brand?: string
  markLabel?: string
  navLabel?: string
  groups?: Navbar004Group[]
  /** Прямые ссылки без раскрытия — например «Тарифы». */
  links?: Navbar004Link[]
  actionLabel?: string
  actionHref?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Продуктовая шапка с мега-меню: 3–5 групп верхнего уровня, раскрытие
// показывает колонки ссылок с пояснениями и одну акцентную промокарточку.
// Группы взаимоисключающие: открытие второй закрывает первую. На широкой
// раскладке лист выезжает панелью под шапкой и открывается ещё и по
// наведению с задержкой намерения — курсор, проходящий мимо, ничего не
// распахивает. В узкой колонке те же группы складываются в аккордеон.
//
// Раскрытие — кнопка с aria-expanded и aria-controls, а не ссылка:
// клавиатура и скринридер получают правильный disclosure. Закрытие по
// Escape и по нажатию снаружи. Главное действие живёт вне раскрытия.
const STYLES = `
:where([data-vibeui-block="navbar-004"]){
--vibeui-navbar-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-004-ink:light-dark(#000000,#ffffff);
--vibeui-navbar-004-muted:light-dark(color-mix(in oklab,#000000 60%,#ffffff),color-mix(in oklab,#ffffff 68%,#1a1a1a));
--vibeui-navbar-004-line:light-dark(color-mix(in oklab,#000000 11%,transparent),color-mix(in oklab,#ffffff 15%,transparent));
--vibeui-navbar-004-hover:light-dark(color-mix(in oklab,#000000 5%,transparent),color-mix(in oklab,#ffffff 9%,transparent));
--vibeui-navbar-004-field:light-dark(#f2f2f2,color-mix(in oklab,#ffffff 8%,transparent));
--vibeui-navbar-004-sheen:light-dark(color-mix(in oklab,#ffffff 92%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-navbar-004-shadow:light-dark(0 1rem 2.5rem color-mix(in oklab,#000000 15%,transparent),0 1rem 2.5rem color-mix(in oklab,#000000 62%,transparent));
--vibeui-navbar-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-004-on-accent:oklch(from var(--vibeui-navbar-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-navbar-004-ease:cubic-bezier(.32,.72,0,1);
--vibeui-navbar-004-dur-1:130ms;
--vibeui-navbar-004-dur-2:180ms;
--vibeui-navbar-004-dur-3:240ms;
--vibeui-navbar-004-dur-4:340ms;
--vibeui-navbar-004-panel:light-dark(#ffffff,#1a1a1a);
--vibeui-navbar-004-promo:light-dark(#f2f2f2,#000000);
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-004"]{color-scheme:dark}
:where([data-vibeui-block="navbar-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-004"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-004-bg);color:var(--vibeui-navbar-004-ink);
border-bottom:1px solid var(--vibeui-navbar-004-line);
font-family:var(--vibeui-navbar-004-font);
font-feature-settings:"cv11","ss01";
}
[data-vibeui-block="navbar-004"] *{box-sizing:border-box}
[data-vibeui-block="navbar-004"] [data-part="action"]{margin-left:auto;flex:none;order:2}
[data-vibeui-block="navbar-004"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.5rem 1rem;
max-width:82rem;margin:0 auto;padding:0.75rem 1rem;min-height:4rem;
}

[data-vibeui-block="navbar-004"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:680;letter-spacing:-0.025em;
}
[data-vibeui-block="navbar-004"] [data-part="mark"]{
width:1.875rem;height:1.875rem;flex:none;display:grid;place-items:center;border-radius:0.5rem;
background:var(--vibeui-navbar-004-accent);color:oklch(from var(--vibeui-navbar-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.8125rem;font-weight:800;
box-shadow:0 0.25rem 0.75rem color-mix(in oklab,var(--vibeui-navbar-004-accent) 44%,transparent),
inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);
transition:transform var(--vibeui-navbar-004-dur-3) var(--vibeui-navbar-004-ease);
}
[data-vibeui-block="navbar-004"] [data-part="brand"]:hover [data-part="mark"]{transform:rotate(-6deg) scale(1.06)}

[data-vibeui-block="navbar-004"] [data-part="nav"]{
order:3;flex:1 1 100%;display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-004"] [data-part="group"]{border-top:1px solid var(--vibeui-navbar-004-line)}
[data-vibeui-block="navbar-004"] [data-part="trigger"]{
width:100%;cursor:pointer;background:transparent;border:0;
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.875rem 0.25rem;border-radius:0.625rem;
font:inherit;font-size:0.9375rem;font-weight:560;color:var(--vibeui-navbar-004-ink);
transition:color var(--vibeui-navbar-004-dur-1) ease,background-color var(--vibeui-navbar-004-dur-2) ease;
}
[data-vibeui-block="navbar-004"] [data-part="chevron"]{
width:0.5rem;height:0.5rem;flex:none;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translateY(-0.0625rem);
transition:transform var(--vibeui-navbar-004-dur-3) var(--vibeui-navbar-004-ease);
}
[data-vibeui-block="navbar-004"] [data-part="trigger"][aria-expanded="true"] [data-part="chevron"]{
transform:rotate(225deg) translateY(-0.0625rem);
}

[data-vibeui-block="navbar-004"] [data-part="drawer"]{
display:grid;grid-template-rows:0fr;
transition:grid-template-rows var(--vibeui-navbar-004-dur-4) var(--vibeui-navbar-004-ease);
}
[data-vibeui-block="navbar-004"] [data-part="drawer"][data-open="true"]{grid-template-rows:1fr}
[data-vibeui-block="navbar-004"] [data-part="clip"]{overflow:hidden;min-height:0}
[data-vibeui-block="navbar-004"] [data-part="sheet"]{
display:flex;flex-direction:column;gap:1.25rem;padding:0.25rem 0.25rem 1.25rem;
}

[data-vibeui-block="navbar-004"] [data-part="column"] h3{
margin:0 0 0.5rem;font-size:0.6875rem;font-weight:660;letter-spacing:0.1em;
text-transform:uppercase;color:var(--vibeui-navbar-004-muted);
}
[data-vibeui-block="navbar-004"] [data-part="column"] a{
display:block;padding:0.5rem 0.625rem;margin:0 -0.625rem;border-radius:0.625rem;
color:var(--vibeui-navbar-004-ink);text-decoration:none;font-size:0.9375rem;font-weight:560;
transition:background-color var(--vibeui-navbar-004-dur-2) ease,color var(--vibeui-navbar-004-dur-1) ease;
}
[data-vibeui-block="navbar-004"] [data-part="column"] a:hover{background:var(--vibeui-navbar-004-hover)}
[data-vibeui-block="navbar-004"] [data-part="column"] a span{
display:block;margin-top:0.125rem;
font-size:0.8125rem;font-weight:420;line-height:1.45;
color:var(--vibeui-navbar-004-muted);
}

[data-vibeui-block="navbar-004"] [data-part="promo"]{
display:flex;flex-direction:column;gap:0.375rem;align-items:flex-start;
padding:1.25rem;border-radius:1rem;
background:
radial-gradient(14rem 8rem at 100% 0%,color-mix(in oklab,var(--vibeui-navbar-004-accent) 26%,transparent),transparent 70%),
var(--vibeui-navbar-004-promo);
border:1px solid color-mix(in oklab,var(--vibeui-navbar-004-accent) 26%,transparent);
}
[data-vibeui-block="navbar-004"] [data-part="promo"] strong{
font-size:1rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-004"] [data-part="promo"] p{
margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-navbar-004-muted);
}
[data-vibeui-block="navbar-004"] [data-part="promo"] a{
margin-top:0.375rem;display:inline-flex;align-items:center;gap:0.3125rem;
color:var(--vibeui-navbar-004-accent);text-decoration:none;font-size:0.875rem;font-weight:640;
}
[data-vibeui-block="navbar-004"] [data-part="promo"] a svg{
width:0.75rem;height:0.75rem;transition:transform var(--vibeui-navbar-004-dur-3) var(--vibeui-navbar-004-ease);
}
[data-vibeui-block="navbar-004"] [data-part="promo"] a:hover svg{transform:translateX(0.1875rem)}

[data-vibeui-block="navbar-004"] [data-part="plain"]{
display:block;padding:0.875rem 0.25rem;border-top:1px solid var(--vibeui-navbar-004-line);
color:var(--vibeui-navbar-004-ink);text-decoration:none;
font-size:0.9375rem;font-weight:560;
transition:color var(--vibeui-navbar-004-dur-1) ease;
}
[data-vibeui-block="navbar-004"] [data-part="plain"]:hover{color:var(--vibeui-navbar-004-accent)}


[data-vibeui-block="navbar-004"] button:focus-visible{
outline:2px solid var(--vibeui-navbar-004-accent);outline-offset:3px;
}

@container (min-width: 56rem){
[data-vibeui-block="navbar-004"] [data-part="shell"]{padding:0.75rem 2rem;gap:0.25rem 1.5rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-004"] [data-part="nav"]{
order:0;flex:0 1 auto;flex-direction:row;align-items:center;gap:0.125rem;
}
[data-vibeui-block="navbar-004"] [data-part="group"]{border-top:0;position:static}
[data-vibeui-block="navbar-004"] [data-part="trigger"]{
width:auto;padding:0.5rem 0.8125rem;color:var(--vibeui-navbar-004-muted);
}
[data-vibeui-block="navbar-004"] [data-part="trigger"]:hover,
[data-vibeui-block="navbar-004"] [data-part="trigger"][aria-expanded="true"]{
color:var(--vibeui-navbar-004-ink);background:var(--vibeui-navbar-004-hover);
}
[data-vibeui-block="navbar-004"] [data-part="drawer"]{
position:absolute;left:0;right:0;top:calc(100% + 0.5rem);z-index:60;
display:block;grid-template-rows:none;padding-inline:2rem;
transform-origin:top center;
transition:opacity var(--vibeui-navbar-004-dur-2) ease,transform var(--vibeui-navbar-004-dur-4) var(--vibeui-navbar-004-ease);
}
[data-vibeui-block="navbar-004"] [data-part="drawer"][data-open="false"]{
opacity:0;transform:translateY(-0.5rem) scale(.99);pointer-events:none;
}
[data-vibeui-block="navbar-004"] [data-part="clip"]{overflow:visible}
[data-vibeui-block="navbar-004"] [data-part="sheet"]{
flex-direction:row;gap:2.5rem;max-width:82rem;margin:0 auto;
padding:1.75rem 2rem 2rem;border-radius:1.25rem;
background:var(--vibeui-navbar-004-panel);
border:1px solid var(--vibeui-navbar-004-line);
box-shadow:var(--vibeui-navbar-004-shadow),inset 0 1px 0 var(--vibeui-navbar-004-sheen);
}
[data-vibeui-block="navbar-004"] [data-part="column"]{min-width:12rem}
[data-vibeui-block="navbar-004"] [data-part="promo"]{margin-left:auto;max-width:17rem}
[data-vibeui-block="navbar-004"] [data-part="plain"]{
border-top:0;padding:0.5rem 0.8125rem;border-radius:0.625rem;
color:var(--vibeui-navbar-004-muted);
transition:color var(--vibeui-navbar-004-dur-1) ease,background-color var(--vibeui-navbar-004-dur-2) ease;
}
[data-vibeui-block="navbar-004"] [data-part="plain"]:hover{
color:var(--vibeui-navbar-004-ink);background:var(--vibeui-navbar-004-hover);
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Navbar004Group[] = [
  {
    label: "Продукт",
    columns: [
      {
        title: "Платформа",
        links: [
          {
            label: "Аналитика",
            href: "#analytics",
            note: "Показатели и отчёты в реальном времени",
          },
          {
            label: "Автоматизация",
            href: "#automation",
            note: "Сценарии без ручной рутины",
          },
          {
            label: "Интеграции",
            href: "#integrations",
            note: "Подключение к вашим сервисам",
          },
        ],
      },
      {
        title: "Инструменты",
        links: [
          { label: "API и вебхуки", href: "#api" },
          { label: "Импорт данных", href: "#import" },
          { label: "Роли и доступы", href: "#roles" },
        ],
      },
    ],
    promo: {
      title: "Осенний релиз",
      text: "Новые отчёты, быстрые фильтры и командные пространства.",
      href: "#release",
      actionLabel: "Что нового",
    },
  },
  {
    label: "Решения",
    columns: [
      {
        title: "По задачам",
        links: [
          { label: "Для продаж", href: "#sales" },
          { label: "Для маркетинга", href: "#marketing" },
          { label: "Для поддержки", href: "#support" },
        ],
      },
      {
        title: "По размеру",
        links: [
          { label: "Стартапам", href: "#startups" },
          { label: "Среднему бизнесу", href: "#smb" },
          { label: "Корпорациям", href: "#enterprise" },
        ],
      },
    ],
  },
  {
    label: "Ресурсы",
    columns: [
      {
        title: "Материалы",
        links: [
          { label: "Документация", href: "#docs" },
          { label: "Блог", href: "#blog" },
          { label: "Вебинары", href: "#webinars" },
        ],
      },
    ],
  },
]

const DEFAULT_LINKS: Navbar004Link[] = [{ label: "Тарифы", href: "#pricing" }]

const ARROW = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Продуктовая шапка с мега-меню: колонки ссылок и промокарточка в выезжающей панели. */
export function Navbar004({
  brand = "Платформа",
  markLabel = "П",
  navLabel = "Разделы сайта",
  groups = DEFAULT_GROUPS,
  links = DEFAULT_LINKS,
  actionLabel = "Запросить демо",
  actionHref = "#demo",
  tone = "auto",
  accent,
  className,
  style,
}: Navbar004Props) {
  const rootRef = useRef<HTMLElement>(null)
  const timerRef = useRef<number | undefined>(undefined)
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  // Задержка намерения: курсор, проезжающий мимо групп, ничего не открывает,
  // а уход из шапки не захлопывает панель в тот же кадр.
  const schedule = useCallback((label: string | null, delay: number) => {
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setOpenGroup(label), delay)
  }, [])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (!openGroup) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenGroup(null)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenGroup(null)
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [openGroup])

  const palette = {
    ...(accent ? { "--vibeui-navbar-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-004" precedence="medium">
        {STYLES}
      </style>
      <header
        ref={rootRef}
        data-vibeui-block="navbar-004"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true">
              {markLabel}
            </span>
            {brand}
          </a>

          <nav
            data-part="nav"
            aria-label={navLabel}
            onPointerLeave={() => schedule(null, 180)}
          >
            {groups.map((group) => {
              const open = openGroup === group.label
              const id = `vibeui-navbar-004-${group.label}`

              return (
                <div
                  data-part="group"
                  key={group.label}
                  onPointerEnter={() => schedule(group.label, 120)}
                >
                  <button
                    type="button"
                    data-part="trigger"
                    aria-expanded={open}
                    aria-controls={id}
                    onClick={() =>
                      setOpenGroup(open ? null : group.label)
                    }
                  >
                    {group.label}
                    <span data-part="chevron" aria-hidden="true" />
                  </button>

                  <div data-part="drawer" id={id} data-open={open}>
                    <div data-part="clip">
                      <div data-part="sheet">
                        {group.columns.map((column) => (
                          <div data-part="column" key={column.title}>
                            <h3>{column.title}</h3>
                            {column.links.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                tabIndex={open ? undefined : -1}
                              >
                                {link.label}
                                {link.note ? <span>{link.note}</span> : null}
                              </a>
                            ))}
                          </div>
                        ))}
                        {group.promo ? (
                          <div data-part="promo">
                            <strong>{group.promo.title}</strong>
                            <p>{group.promo.text}</p>
                            <a
                              href={group.promo.href}
                              tabIndex={open ? undefined : -1}
                            >
                              {group.promo.actionLabel}
                              {ARROW}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {links.map((link) => (
              <a data-part="plain" key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <Button016
            data-part="action"
            label={actionLabel}
            href={actionHref}
            external={false}
            size="sm"
            tone="accent"
            accent={accent}
          />
        </div>
      </header>
    </>
  )
}
