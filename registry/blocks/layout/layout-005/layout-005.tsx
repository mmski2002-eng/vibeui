import type { CSSProperties, ReactNode } from "react"

type Layout005Item = {
  label: string
  href: string
  current?: boolean
}

export type Layout005Props = {
  /** Своя рабочая область вместо демонстрационной. */
  children?: ReactNode
  appName?: string
  nav?: Layout005Item[]
  navLabel?: string
  /** Заголовок текущего экрана в верхней строке. */
  screenTitle?: string
  actionLabel?: string
  tone?: "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Рабочее пространство с боковой панелью: слева навигация приложения,
// сверху контекстная строка с действием, в центре рабочая область.
// Владелец прокрутки — документ: блок переносим и не навязывает 100vh.
// Принимающее приложение при желании делает оболочку фиксированной,
// задав блоку высоту снаружи (например, height:100dvh на родителе) —
// тогда прокручивается data-part="work". Боковая панель sticky. Без JS.
const STYLES = `
:where([data-vibeui-block="layout-005"]){
--vibeui-layout-005-bg:#f2f2f2;
--vibeui-layout-005-surface:#ffffff;
--vibeui-layout-005-side:#1a1a1a;
--vibeui-layout-005-side-ink:#ffffff;
--vibeui-layout-005-ink:#000000;
--vibeui-layout-005-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-005-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-005-accent:#ff5900;
--vibeui-layout-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="layout-005"][data-tone="dark"]){
--vibeui-layout-005-bg:#000000;
--vibeui-layout-005-surface:#1a1a1a;
--vibeui-layout-005-ink:#ffffff;
--vibeui-layout-005-muted:color-mix(in oklab,#ffffff 62%,#1a1a1a);
--vibeui-layout-005-line:color-mix(in oklab,#ffffff 13%,transparent);
}
[data-vibeui-block="layout-005"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-005-bg);color:var(--vibeui-layout-005-ink);
font-family:var(--vibeui-layout-005-font);
}
[data-vibeui-block="layout-005"] *{box-sizing:border-box}
[data-vibeui-block="layout-005"] [data-part="frame"]{
display:flex;flex-direction:column;min-width:0;
}
[data-vibeui-block="layout-005"] [data-part="side"]{
flex:none;background:var(--vibeui-layout-005-side);color:var(--vibeui-layout-005-side-ink);
display:flex;flex-direction:column;gap:0.25rem;padding:0.75rem;
}
[data-vibeui-block="layout-005"] [data-part="app"]{
display:flex;align-items:center;gap:0.5625rem;
padding:0.375rem 0.5rem 0.875rem;
font-size:1rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="layout-005"] [data-part="app-mark"]{
width:1.625rem;height:1.625rem;flex:none;display:grid;place-items:center;
background:var(--vibeui-layout-005-accent);color:#000000;
font-size:0.75rem;font-weight:800;
}
[data-vibeui-block="layout-005"] [data-part="nav"]{
display:flex;flex-direction:row;flex-wrap:wrap;gap:0.125rem;
}
[data-vibeui-block="layout-005"] [data-part="nav"] a{
display:flex;align-items:center;gap:0.625rem;
padding:0.5625rem 0.625rem;border-radius:0.375rem;flex:1 1 auto;
color:color-mix(in oklab,#ffffff 72%,#1a1a1a);text-decoration:none;
font-size:0.9375rem;font-weight:520;white-space:nowrap;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="layout-005"] [data-part="nav"] a:hover{
background:color-mix(in oklab,#ffffff 8%,transparent);color:#ffffff;
}
[data-vibeui-block="layout-005"] [data-part="nav"] a[aria-current="page"]{
background:color-mix(in oklab,var(--vibeui-layout-005-accent) 22%,transparent);
color:#ffffff;font-weight:580;
}
[data-vibeui-block="layout-005"] [data-part="nav"] a::before{
content:"";width:0.375rem;height:0.375rem;flex:none;border-radius:999px;
background:currentColor;opacity:0.5;
}
[data-vibeui-block="layout-005"] [data-part="nav"] a[aria-current="page"]::before{
background:var(--vibeui-layout-005-accent);opacity:1;
}
[data-vibeui-block="layout-005"] [data-part="body"]{
flex:1 1 auto;min-width:0;display:flex;flex-direction:column;
}
[data-vibeui-block="layout-005"] [data-part="topbar"]{
display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;
padding:0.75rem 1rem;background:var(--vibeui-layout-005-surface);
border-bottom:1px solid var(--vibeui-layout-005-line);
}
[data-vibeui-block="layout-005"] [data-part="screen"]{
margin:0;font-size:1.0625rem;font-weight:650;letter-spacing:-0.015em;
}
[data-vibeui-block="layout-005"] [data-part="action"]{
margin-left:auto;display:inline-flex;align-items:center;
min-height:2.25rem;padding:0.25rem 0.9375rem;
background:var(--vibeui-layout-005-accent);color:#000000;
text-decoration:none;font-size:0.875rem;font-weight:640;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="layout-005"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="layout-005"] [data-part="work"]{
flex:1 1 auto;min-width:0;padding:1rem;
display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-005"] [data-part="stats"]{
display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:0.75rem;
}
[data-vibeui-block="layout-005"] [data-part="stat"]{
background:var(--vibeui-layout-005-surface);border:1px solid var(--vibeui-layout-005-line);
padding:1rem;display:flex;flex-direction:column;gap:0.25rem;
}
[data-vibeui-block="layout-005"] [data-part="stat"] span{
font-size:0.8125rem;color:var(--vibeui-layout-005-muted);
}
[data-vibeui-block="layout-005"] [data-part="stat"] strong{
font-size:1.5rem;font-weight:700;letter-spacing:-0.02em;
}
[data-vibeui-block="layout-005"] [data-part="stat"] em{
font-style:normal;font-size:0.8125rem;font-weight:600;color:var(--vibeui-layout-005-accent);
}
[data-vibeui-block="layout-005"] [data-part="panel"]{
background:var(--vibeui-layout-005-surface);border:1px solid var(--vibeui-layout-005-line);
overflow-x:auto;
}
[data-vibeui-block="layout-005"] [data-part="panel"] h2{
margin:0;padding:0.875rem 1rem;font-size:0.9375rem;font-weight:640;
border-bottom:1px solid var(--vibeui-layout-005-line);
}
[data-vibeui-block="layout-005"] table{
width:100%;border-collapse:collapse;font-size:0.875rem;min-width:36rem;
}
[data-vibeui-block="layout-005"] th{
text-align:left;padding:0.5625rem 1rem;font-weight:600;
color:var(--vibeui-layout-005-muted);font-size:0.8125rem;
border-bottom:1px solid var(--vibeui-layout-005-line);
}
[data-vibeui-block="layout-005"] td{
padding:0.625rem 1rem;border-bottom:1px solid var(--vibeui-layout-005-line);
}
[data-vibeui-block="layout-005"] tr:last-child td{border-bottom:0}
[data-vibeui-block="layout-005"] [data-part="tag"]{
display:inline-flex;padding:0.125rem 0.5rem;border-radius:999px;
font-size:0.75rem;font-weight:600;
background:color-mix(in oklab,var(--vibeui-layout-005-accent) 16%,transparent);
color:color-mix(in oklab,var(--vibeui-layout-005-accent) 72%,#000000);
}
[data-vibeui-block="layout-005"][data-tone="dark"] [data-part="tag"]{
color:color-mix(in oklab,var(--vibeui-layout-005-accent) 80%,#ffffff);
}
[data-vibeui-block="layout-005"] a:focus-visible{
outline:2px solid var(--vibeui-layout-005-accent);outline-offset:2px;
}
@container (min-width: 56rem){
[data-vibeui-block="layout-005"] [data-part="frame"]{flex-direction:row;align-items:stretch}
[data-vibeui-block="layout-005"] [data-part="side"]{
width:14rem;position:sticky;top:0;align-self:flex-start;
padding:1rem 0.75rem;min-height:36rem;
}
[data-vibeui-block="layout-005"] [data-part="nav"]{flex-direction:column;flex-wrap:nowrap}
[data-vibeui-block="layout-005"] [data-part="work"]{padding:1.25rem 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAV: Layout005Item[] = [
  { label: "Обзор", href: "#overview", current: true },
  { label: "Заказы", href: "#orders" },
  { label: "Клиенты", href: "#customers" },
  { label: "Отчёты", href: "#reports" },
  { label: "Настройки", href: "#settings" },
]

const DEMO_ROWS = [
  ["№ 1042", "Марина К.", "42 900 ₽", "Оплачен"],
  ["№ 1041", "Сергей П.", "12 400 ₽", "Собирается"],
  ["№ 1040", "Ольга В.", "74 900 ₽", "Доставлен"],
  ["№ 1039", "Иван Д.", "27 300 ₽", "Оплачен"],
] as const

function DemoWork() {
  return (
    <>
      <div data-part="stats">
        <div data-part="stat">
          <span>Выручка за месяц</span>
          <strong>1,84 млн ₽</strong>
          <em>+12% к прошлому</em>
        </div>
        <div data-part="stat">
          <span>Заказы</span>
          <strong>316</strong>
          <em>+8%</em>
        </div>
        <div data-part="stat">
          <span>Средний чек</span>
          <strong>5 820 ₽</strong>
          <em>+3%</em>
        </div>
      </div>
      <div data-part="panel">
        <h2>Последние заказы</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Заказ</th>
              <th scope="col">Клиент</th>
              <th scope="col">Сумма</th>
              <th scope="col">Статус</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ROWS.map(([id, client, total, status]) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{client}</td>
                <td>{total}</td>
                <td>
                  <span data-part="tag">{status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/** Каркас кабинета: графитовая боковая навигация, контекстная строка, рабочая область. */
export function Layout005({
  children,
  appName = "Пульт",
  nav = DEFAULT_NAV,
  navLabel = "Разделы приложения",
  screenTitle = "Обзор",
  actionLabel = "Новый заказ",
  tone = "light",
  accent,
  className,
  style,
}: Layout005Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-005" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="layout-005"
        data-tone={tone === "dark" ? "dark" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">
        <aside data-part="side">
          <p data-part="app">
            <span data-part="app-mark" aria-hidden="true">
              {appName.slice(0, 1)}
            </span>
            {appName}
          </p>
          <nav data-part="nav" aria-label={navLabel}>
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <div data-part="body">
          <div data-part="topbar">
            <h1 data-part="screen">{screenTitle}</h1>
            <a data-part="action" href="#action">
              {actionLabel}
            </a>
          </div>
          <main data-part="work">{children ?? <DemoWork />}</main>
        </div>
        </div>
      </div>
    </>
  )
}
