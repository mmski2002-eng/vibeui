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
  tone?: "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Продуктовая шапка с мега-меню: 3–5 групп верхнего уровня, раскрытие
// показывает колонки ссылок с пояснениями и одну акцентную промокарточку.
// Открытие — нажатием и клавиатурой (disclosure на <details>); атрибут
// name делает группы взаимоисключающими без единой строки JS. Главное
// действие живёт вне раскрываемой области. В узкой колонке те же группы
// складываются в вертикальный аккордеон с тем же содержимым.
const STYLES = `
:where([data-vibeui-block="navbar-004"]){
--vibeui-navbar-004-bg:#ffffff;
--vibeui-navbar-004-ink:#000000;
--vibeui-navbar-004-muted:color-mix(in oklab,#000000 58%,#ffffff);
--vibeui-navbar-004-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-navbar-004-panel:#ffffff;
--vibeui-navbar-004-promo:#f2f2f2;
--vibeui-navbar-004-accent:#ff5900;
--vibeui-navbar-004-on-accent:#000000;
--vibeui-navbar-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="navbar-004"][data-tone="dark"]){
--vibeui-navbar-004-bg:#1a1a1a;
--vibeui-navbar-004-ink:#ffffff;
--vibeui-navbar-004-muted:color-mix(in oklab,#ffffff 64%,#1a1a1a);
--vibeui-navbar-004-line:color-mix(in oklab,#ffffff 14%,transparent);
--vibeui-navbar-004-panel:#1a1a1a;
--vibeui-navbar-004-promo:#000000;
}
[data-vibeui-block="navbar-004"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-navbar-004-bg);color:var(--vibeui-navbar-004-ink);
border-bottom:1px solid var(--vibeui-navbar-004-line);
font-family:var(--vibeui-navbar-004-font);
}
[data-vibeui-block="navbar-004"] *{box-sizing:border-box}
[data-vibeui-block="navbar-004"] [data-part="shell"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.5rem 1rem;
max-width:82rem;margin:0 auto;padding:0.75rem 1rem;min-height:3.5rem;
}
[data-vibeui-block="navbar-004"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5625rem;flex:none;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-004"] [data-part="mark"]{
width:1.75rem;height:1.75rem;flex:none;display:grid;place-items:center;
background:var(--vibeui-navbar-004-accent);color:var(--vibeui-navbar-004-on-accent);
font-size:0.8125rem;font-weight:800;
}
[data-vibeui-block="navbar-004"] [data-part="action"]{
display:inline-flex;align-items:center;min-height:2.375rem;padding:0.25rem 1.0625rem;
margin-left:auto;flex:none;order:2;
background:var(--vibeui-navbar-004-accent);color:var(--vibeui-navbar-004-on-accent);
text-decoration:none;font-size:0.9375rem;font-weight:640;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="navbar-004"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="navbar-004"] [data-part="nav"]{
order:3;flex:1 1 100%;display:flex;flex-direction:column;
}
[data-vibeui-block="navbar-004"] [data-part="group"]{border-top:1px solid var(--vibeui-navbar-004-line)}
[data-vibeui-block="navbar-004"] [data-part="group"] summary{
list-style:none;cursor:pointer;user-select:none;
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.8125rem 0.25rem;
font-size:0.9375rem;font-weight:560;color:var(--vibeui-navbar-004-ink);
}
[data-vibeui-block="navbar-004"] [data-part="group"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="navbar-004"] [data-part="group"] summary::after{
content:"";width:0.5rem;height:0.5rem;flex:none;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="navbar-004"] [data-part="group"][open] summary::after{transform:rotate(225deg)}
[data-vibeui-block="navbar-004"] [data-part="sheet"]{
display:flex;flex-direction:column;gap:1.25rem;padding:0.25rem 0.25rem 1.25rem;
}
[data-vibeui-block="navbar-004"] [data-part="column"] h3{
margin:0 0 0.375rem;font-size:0.75rem;font-weight:640;letter-spacing:0.08em;
text-transform:uppercase;color:var(--vibeui-navbar-004-muted);
}
[data-vibeui-block="navbar-004"] [data-part="column"] a{
display:block;padding:0.4375rem 0;color:var(--vibeui-navbar-004-ink);
text-decoration:none;font-size:0.9375rem;font-weight:540;
}
[data-vibeui-block="navbar-004"] [data-part="column"] a:hover{color:var(--vibeui-navbar-004-accent)}
[data-vibeui-block="navbar-004"] [data-part="column"] a span{
display:block;font-size:0.8125rem;font-weight:400;line-height:1.45;
color:var(--vibeui-navbar-004-muted);
}
[data-vibeui-block="navbar-004"] [data-part="promo"]{
display:flex;flex-direction:column;gap:0.375rem;align-items:flex-start;
padding:1.125rem;background:var(--vibeui-navbar-004-promo);
border-top:2px solid var(--vibeui-navbar-004-accent);
}
[data-vibeui-block="navbar-004"] [data-part="promo"] strong{
font-size:0.9375rem;font-weight:640;letter-spacing:-0.01em;
}
[data-vibeui-block="navbar-004"] [data-part="promo"] p{
margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-navbar-004-muted);
}
[data-vibeui-block="navbar-004"] [data-part="promo"] a{
margin-top:0.25rem;color:var(--vibeui-navbar-004-accent);
text-decoration:none;font-size:0.875rem;font-weight:620;
}
[data-vibeui-block="navbar-004"] [data-part="plain"]{
display:block;padding:0.8125rem 0.25rem;border-top:1px solid var(--vibeui-navbar-004-line);
color:var(--vibeui-navbar-004-ink);text-decoration:none;
font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="navbar-004"] [data-part="plain"]:hover{color:var(--vibeui-navbar-004-accent)}
[data-vibeui-block="navbar-004"] a:focus-visible,
[data-vibeui-block="navbar-004"] summary:focus-visible{
outline:2px solid var(--vibeui-navbar-004-accent);outline-offset:2px;
}
@container (min-width: 56rem){
[data-vibeui-block="navbar-004"] [data-part="shell"]{padding:0.75rem 2rem;gap:0.25rem 1.5rem;flex-wrap:nowrap}
[data-vibeui-block="navbar-004"] [data-part="nav"]{
order:0;flex:0 1 auto;flex-direction:row;align-items:center;gap:0.25rem;
}
[data-vibeui-block="navbar-004"] [data-part="group"]{border-top:0;position:static}
[data-vibeui-block="navbar-004"] [data-part="group"] summary{
padding:0.5rem 0.75rem;color:var(--vibeui-navbar-004-muted);
transition:color .16s ease;
}
[data-vibeui-block="navbar-004"] [data-part="group"] summary:hover{color:var(--vibeui-navbar-004-ink)}
[data-vibeui-block="navbar-004"] [data-part="group"][open] summary{color:var(--vibeui-navbar-004-ink)}
[data-vibeui-block="navbar-004"] [data-part="sheet"]{
position:absolute;left:0;right:0;top:100%;z-index:20;
flex-direction:row;gap:2.5rem;
background:var(--vibeui-navbar-004-panel);
border-bottom:1px solid var(--vibeui-navbar-004-line);
padding:1.5rem 2rem 1.75rem;
}
[data-vibeui-block="navbar-004"] [data-part="column"]{min-width:11rem}
[data-vibeui-block="navbar-004"] [data-part="promo"]{margin-left:auto;max-width:16rem}
[data-vibeui-block="navbar-004"] [data-part="plain"]{
border-top:0;padding:0.5rem 0.75rem;color:var(--vibeui-navbar-004-muted);
transition:color .16s ease;
}
[data-vibeui-block="navbar-004"] [data-part="plain"]:hover{color:var(--vibeui-navbar-004-ink)}
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

/** Продуктовая шапка с мега-меню на <details name>: колонки и промокарточка без JS. */
export function Navbar004({
  brand = "Платформа",
  markLabel = "П",
  navLabel = "Разделы сайта",
  groups = DEFAULT_GROUPS,
  links = DEFAULT_LINKS,
  actionLabel = "Запросить демо",
  actionHref = "#demo",
  tone = "light",
  accent,
  className,
  style,
}: Navbar004Props) {
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
        data-vibeui-block="navbar-004"
        data-tone={tone === "dark" ? "dark" : undefined}
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
          <nav data-part="nav" aria-label={navLabel}>
            {groups.map((group) => (
              <details data-part="group" name="vibeui-navbar-004" key={group.label}>
                <summary>{group.label}</summary>
                <div data-part="sheet">
                  {group.columns.map((column) => (
                    <div data-part="column" key={column.title}>
                      <h3>{column.title}</h3>
                      {column.links.map((link) => (
                        <a key={link.href} href={link.href}>
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
                      <a href={group.promo.href}>{group.promo.actionLabel} →</a>
                    </div>
                  ) : null}
                </div>
              </details>
            ))}
            {links.map((link) => (
              <a data-part="plain" key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
      </header>
    </>
  )
}
