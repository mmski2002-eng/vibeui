import type { CSSProperties } from "react"

export type Dashboard036Link = {
  label: string
  badge?: string
  children?: string[]
}

export type Dashboard036Group = {
  title: string
  links: Dashboard036Link[]
}

export type Dashboard036Props = {
  product?: string
  groups?: Dashboard036Group[]
  activeLabel?: string
  collapseLabel?: string
  planTitle?: string
  planHint?: string
  planCta?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись всего меню для скринридера. */
  navLabel?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: левое меню, которое действительно сворачивается в узкую рейку,
// и делает это без JS. Состояние держит скрытый чекбокс, а ширина и видимость
// подписей меняются через :has() на корне списка. Подразделы лежат в <details>:
// открытая ветка переживает перезагрузку раздела, потому что состояние
// хранит браузер. Каждая иконка — квадрат с буквой, поэтому в свёрнутом виде
// пункты остаются различимы, а не превращаются в ряд одинаковых точек.
const STYLES = `
:where([data-vibeui-block="dashboard-036"]){
--vibeui-dashboard-036-bg:transparent;
--vibeui-dashboard-036-panel:light-dark(oklch(1 0 0),oklch(0.26 0 265));
/* Наведение и мелкие плашки: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-036-hover:light-dark(oklch(0.97 0 265),oklch(0.31 0 265));
--vibeui-dashboard-036-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dashboard-036-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-dashboard-036-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-dashboard-036-accent:light-dark(oklch(0.52 0.17 262),oklch(0.74 0.16 262));
--vibeui-dashboard-036-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-dashboard-036-soft:light-dark(oklch(0.96 0 262),oklch(0.32 0.05 262));
--vibeui-dashboard-036-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-036"]{color-scheme:dark}
[data-vibeui-block="dashboard-036"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-036-bg);
color:var(--vibeui-dashboard-036-fg);
font-family:var(--vibeui-dashboard-036-sans);
border:1px solid var(--vibeui-dashboard-036-border);border-radius:1rem;padding:0.75rem;
}
[data-vibeui-block="dashboard-036"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-036"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:19rem;
background:var(--vibeui-dashboard-036-panel);
border:1px solid var(--vibeui-dashboard-036-border);border-radius:0.875rem;
padding:0.75rem;transition:max-width .18s ease;
}
[data-vibeui-block="dashboard-036"] [data-part="shell"]:has([data-part="switch"]:checked){max-width:4.5rem}
[data-vibeui-block="dashboard-036"] [data-part="shell"]:has([data-part="switch"]:checked) :is([data-part="text"],[data-part="brand"]){display:none}
[data-vibeui-block="dashboard-036"] [data-part="shell"]:has([data-part="switch"]:checked) [data-part="cap"]{
overflow:hidden;height:0.0625rem;margin:0.375rem 0;padding:0;color:transparent;
background:var(--vibeui-dashboard-036-border);
}
[data-vibeui-block="dashboard-036"] [data-part="shell"]:has([data-part="switch"]:checked) [data-part="plan"]{display:none}
[data-vibeui-block="dashboard-036"] [data-part="shell"]:has([data-part="switch"]:checked) summary::after{display:none}
[data-vibeui-block="dashboard-036"] [data-part="shell"]:has([data-part="switch"]:checked) [data-part="sub"]{display:none}
[data-vibeui-block="dashboard-036"] [data-part="head"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="dashboard-036"] [data-part="mark"]{
width:1.875rem;height:1.875rem;border-radius:0.625rem;flex:none;display:grid;place-items:center;
background:var(--vibeui-dashboard-036-accent);color:var(--vibeui-dashboard-036-on-accent);font-size:0.8125rem;font-weight:800;
}
[data-vibeui-block="dashboard-036"] [data-part="brand"]{font-size:0.9375rem;font-weight:750;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-036"] [data-part="toggle"]{
margin-left:auto;display:grid;place-items:center;cursor:pointer;flex:none;
width:1.75rem;height:1.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-036-border);
}
[data-vibeui-block="dashboard-036"] [data-part="switch"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="dashboard-036"] [data-part="bars"]{
width:0.75rem;height:0.625rem;border-left:2px solid currentColor;border-right:6px solid currentColor;
}
[data-vibeui-block="dashboard-036"] [data-part="shell"]:has([data-part="switch"]:focus-visible) [data-part="toggle"]{
outline:2px solid var(--vibeui-dashboard-036-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-036"] nav{display:flex;flex-direction:column;gap:0.125rem;min-height:0}
[data-vibeui-block="dashboard-036"] [data-part="cap"]{
font-size:0.5625rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-dashboard-036-muted);padding:0.5rem 0.5rem 0.25rem;
}
[data-vibeui-block="dashboard-036"] [data-part="row"],
[data-vibeui-block="dashboard-036"] summary{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;list-style:none;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font-size:0.8125rem;font-weight:600;color:inherit;text-decoration:none;
}
[data-vibeui-block="dashboard-036"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-036"] [data-part="row"]:hover,
[data-vibeui-block="dashboard-036"] summary:hover{background:var(--vibeui-dashboard-036-hover)}
[data-vibeui-block="dashboard-036"] [data-part="row"][aria-current]{
background:var(--vibeui-dashboard-036-soft);color:var(--vibeui-dashboard-036-accent);
box-shadow:inset 0.1875rem 0 0 var(--vibeui-dashboard-036-accent);
}
[data-vibeui-block="dashboard-036"] [data-part="ico"]{
width:1.375rem;height:1.375rem;border-radius:0.4375rem;flex:none;display:grid;place-items:center;
font-size:0.625rem;font-weight:800;
border:1px solid var(--vibeui-dashboard-036-border);
background:var(--vibeui-dashboard-036-hover);color:var(--vibeui-dashboard-036-muted);
}
[data-vibeui-block="dashboard-036"] [data-part="row"][aria-current] [data-part="ico"]{
background:var(--vibeui-dashboard-036-accent);color:var(--vibeui-dashboard-036-on-accent);border-color:transparent;
}
[data-vibeui-block="dashboard-036"] [data-part="text"]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="dashboard-036"] [data-part="badge"]{
font-size:0.625rem;font-weight:750;padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-dashboard-036-soft);color:var(--vibeui-dashboard-036-accent);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-036"] summary::after{
content:"";width:0.375rem;height:0.375rem;flex:none;
border-right:1.5px solid var(--vibeui-dashboard-036-muted);
border-bottom:1.5px solid var(--vibeui-dashboard-036-muted);
transform:rotate(-45deg);transition:transform .16s ease;
}
[data-vibeui-block="dashboard-036"] details[open] summary::after{transform:rotate(45deg)}
[data-vibeui-block="dashboard-036"] [data-part="sub"]{
display:flex;flex-direction:column;gap:0.0625rem;
margin:0.125rem 0 0.25rem 1.4375rem;padding-left:0.625rem;
border-left:1px solid var(--vibeui-dashboard-036-border);
}
[data-vibeui-block="dashboard-036"] [data-part="sub"] a{
padding:0.3125rem 0.5rem;border-radius:0.4375rem;
font-size:0.75rem;color:var(--vibeui-dashboard-036-muted);text-decoration:none;
}
[data-vibeui-block="dashboard-036"] [data-part="sub"] a:hover{
background:var(--vibeui-dashboard-036-hover);color:var(--vibeui-dashboard-036-fg);
}
[data-vibeui-block="dashboard-036"] [data-part="plan"]{
margin-top:auto;padding:0.6875rem;border-radius:0.75rem;
border:1px solid var(--vibeui-dashboard-036-border);background:var(--vibeui-dashboard-036-hover);
}
[data-vibeui-block="dashboard-036"] [data-part="plan"] strong{display:block;font-size:0.8125rem}
[data-vibeui-block="dashboard-036"] [data-part="plan"] span{
display:block;margin:0.1875rem 0 0.5rem;font-size:0.6875rem;line-height:1.45;
color:var(--vibeui-dashboard-036-muted);
}
[data-vibeui-block="dashboard-036"] [data-part="plan"] button{
appearance:none;border:0;cursor:pointer;font:inherit;width:100%;
font-size:0.75rem;font-weight:700;padding:0.4375rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-036-accent);color:var(--vibeui-dashboard-036-on-accent);
}
[data-vibeui-block="dashboard-036"] :is(a,button,summary):focus-visible{
outline:2px solid var(--vibeui-dashboard-036-accent);outline-offset:2px;
}
@container (min-width: 30rem){
[data-vibeui-block="dashboard-036"] [data-part="shell"]{min-height:29rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-036"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Dashboard036Group[] = [
  {
    title: "Работа",
    links: [
      { label: "Обзор" },
      { label: "Заявки", badge: "12" },
      { label: "Клиенты" },
      {
        label: "Документы",
        children: ["Договоры", "Счета", "Акты"],
      },
    ],
  },
  {
    title: "Аналитика",
    links: [
      { label: "Отчёты" },
      { label: "Показатели" },
      { label: "Выгрузки", badge: "2" },
    ],
  },
  {
    title: "Управление",
    links: [
      {
        label: "Команда",
        children: ["Участники", "Роли и права", "Приглашения"],
      },
      { label: "Настройки" },
    ],
  },
]

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Левое меню приложения: группы разделов, вложенные ветки на details и
 * свёртка в узкую рейку через скрытый чекбокс. Один файл, ноль зависимостей,
 * клиентского JS нет.
 */
export function Dashboard036({
  product = "Контур",
  groups = DEFAULT_GROUPS,
  activeLabel = "Заявки",
  collapseLabel = "Свернуть меню",
  planTitle = "Тариф «Команда»",
  planHint = "Осталось 9 дней пробного периода.",
  planCta = "Продлить",
  accent,
  background = "",
  navLabel = "Навигация приложения",
  className,
  style,
}: Dashboard036Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-036-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-036-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-036" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-036"
        className={className}
        style={palette}
        aria-label={navLabel}
      >
        <div data-part="shell">
          <div data-part="head">
            <span data-part="mark" aria-hidden="true">
              {product.charAt(0)}
            </span>
            <span data-part="brand">{product}</span>
            <label data-part="toggle" title={collapseLabel}>
              <input
                data-part="switch"
                type="checkbox"
                aria-label={collapseLabel}
              />
              <span data-part="bars" aria-hidden="true" />
            </label>
          </div>

          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <span data-part="cap">{group.title}</span>
              {group.links.map((link) =>
                link.children ? (
                  <details key={link.label}>
                    <summary>
                      <span data-part="ico" aria-hidden="true">
                        {link.label.charAt(0)}
                      </span>
                      <span data-part="text">{link.label}</span>
                    </summary>
                    <div data-part="sub">
                      {link.children.map((child) => (
                        <a key={child} href="#dashboard-036">
                          {child}
                        </a>
                      ))}
                    </div>
                  </details>
                ) : (
                  <a
                    key={link.label}
                    href="#dashboard-036"
                    data-part="row"
                    aria-current={
                      link.label === activeLabel ? "page" : undefined
                    }
                  >
                    <span data-part="ico" aria-hidden="true">
                      {link.label.charAt(0)}
                    </span>
                    <span data-part="text">{link.label}</span>
                    {link.badge ? (
                      <span data-part="badge">{link.badge}</span>
                    ) : null}
                  </a>
                ),
              )}
            </nav>
          ))}

          <div data-part="plan">
            <strong>{planTitle}</strong>
            <span>{planHint}</span>
            <button type="button">{planCta}</button>
          </div>
        </div>
      </section>
    </>
  )
}
