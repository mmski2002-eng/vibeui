import type { CSSProperties } from "react"

export type Dashboard010Props = {
  name?: string
  role?: string
  place?: string
  since?: string
  stats?: { label: string; value: string }[]
  tabs?: string[]
  activeTab?: string
  cta?: string
  secondary?: string
  facts?: { label: string; value: string }[]
  /** Подпись шапки для скринридера: {name} — имя из профиля. */
  profileText?: string
  /** Название полосы вкладок для скринридера. */
  tabsText?: string
  /** Пусто — подложки нет, шапка ложится на фон страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: шапка профиля. Обложка нарисована градиентом по оттенку, который
// считается хешем имени: сумма кодов символов сводит целый алфавит в один цвет,
// и все русские имена выходят одинаковыми. Аватар вынесен из потока
// отрицательным отступом, а не абсолютным позиционированием — тогда высота
// шапки остаётся предсказуемой на любом кегле. Вкладки сделаны ссылками:
// раздел профиля должен открываться по адресу и в новой вкладке.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// подложки у шапки нет, кольцу вокруг аватара оставлена своя поверхность.
const STYLES = `
:where([data-vibeui-block="dashboard-010"]){
--vibeui-dashboard-010-bg:transparent;
--vibeui-dashboard-010-surface:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-dashboard-010-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-dashboard-010-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-dashboard-010-border:light-dark(oklch(0.91 0 265),oklch(0.37 0 265));
--vibeui-dashboard-010-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-dashboard-010-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-dashboard-010-cover:light-dark(oklch(0.95 0.03 var(--vibeui-dashboard-010-hue,262)),oklch(0.3 0.045 var(--vibeui-dashboard-010-hue,262)));
--vibeui-dashboard-010-glow:light-dark(oklch(0.9 0.09 var(--vibeui-dashboard-010-hue,262)),oklch(0.42 0.09 var(--vibeui-dashboard-010-hue,262)));
--vibeui-dashboard-010-avatar:light-dark(oklch(0.9 0.07 var(--vibeui-dashboard-010-hue,262)),oklch(0.4 0.08 var(--vibeui-dashboard-010-hue,262)));
--vibeui-dashboard-010-avatar-fg:light-dark(oklch(0.35 0.12 var(--vibeui-dashboard-010-hue,262)),oklch(0.94 0.04 var(--vibeui-dashboard-010-hue,262)));
--vibeui-dashboard-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-010"]{color-scheme:dark}
[data-vibeui-block="dashboard-010"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-dashboard-010-bg);
border:1px solid var(--vibeui-dashboard-010-border);border-radius:1rem;
font-family:var(--vibeui-dashboard-010-sans);color:var(--vibeui-dashboard-010-fg);
}
[data-vibeui-block="dashboard-010"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-010"] [data-part="cover"]{
height:5.5rem;
background:
radial-gradient(120% 140% at 20% 0%, var(--vibeui-dashboard-010-glow), transparent 70%),
var(--vibeui-dashboard-010-cover);
}
[data-vibeui-block="dashboard-010"] [data-part="body"]{padding:0 1rem 0.875rem}
/* Аватар вынесен отступом, а не абсолютом: высота шапки остаётся предсказуемой. */
[data-vibeui-block="dashboard-010"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;
width:4rem;height:4rem;margin:-2rem 0 0.5rem;
border-radius:9999px;border:3px solid var(--vibeui-dashboard-010-surface);
background:var(--vibeui-dashboard-010-avatar);
color:var(--vibeui-dashboard-010-avatar-fg);
font-size:1.125rem;font-weight:700;
}
[data-vibeui-block="dashboard-010"] [data-part="top"]{
display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:0.625rem;
}
[data-vibeui-block="dashboard-010"] h2{margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-010"] [data-part="role"]{margin:0.125rem 0 0;font-size:0.8125rem;color:var(--vibeui-dashboard-010-muted)}
[data-vibeui-block="dashboard-010"] [data-part="meta"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;margin:0.375rem 0 0;
font-size:0.75rem;color:var(--vibeui-dashboard-010-muted);
}
[data-vibeui-block="dashboard-010"] [data-part="actions"]{display:flex;gap:0.5rem}
[data-vibeui-block="dashboard-010"] button{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-010"] [data-part="primary"]{border:0;background:var(--vibeui-dashboard-010-accent);color:var(--vibeui-dashboard-010-on-accent)}
[data-vibeui-block="dashboard-010"] [data-part="secondary"]{
border:1px solid var(--vibeui-dashboard-010-border);background:none;color:inherit;
}
[data-vibeui-block="dashboard-010"] button:focus-visible{outline:2px solid var(--vibeui-dashboard-010-accent);outline-offset:2px}
[data-vibeui-block="dashboard-010"] [data-part="stats"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin:0.875rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-010"] [data-part="stat"]{
padding:0.5rem 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-dashboard-010-border);
}
[data-vibeui-block="dashboard-010"] [data-part="value"]{margin:0;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-010"] [data-part="label"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-010-muted)}
/* Вкладки ссылками: раздел профиля должен открываться по адресу. */
[data-vibeui-block="dashboard-010"] [data-part="tabs"]{
display:flex;gap:0.25rem;margin-top:0.875rem;padding:0 1rem;overflow-x:auto;scrollbar-width:none;
border-top:1px solid var(--vibeui-dashboard-010-border);
}
[data-vibeui-block="dashboard-010"] [data-part="tabs"]::-webkit-scrollbar{display:none}
[data-vibeui-block="dashboard-010"] [data-part="tab"]{
position:relative;white-space:nowrap;padding:0.625rem 0.5rem;
color:var(--vibeui-dashboard-010-muted);text-decoration:none;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-010"] [data-part="tab"][aria-current="page"]{color:var(--vibeui-dashboard-010-fg);font-weight:650}
[data-vibeui-block="dashboard-010"] [data-part="tab"][aria-current="page"]::after{
content:"";position:absolute;left:0.25rem;right:0.25rem;top:-1px;height:2px;
background:var(--vibeui-dashboard-010-accent);
}
[data-vibeui-block="dashboard-010"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-dashboard-010-accent);outline-offset:-2px;border-radius:0.375rem}
[data-vibeui-block="dashboard-010"] dl{
display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.75rem;margin:0;padding:0.75rem 1rem 0.875rem;
font-size:0.75rem;
}
[data-vibeui-block="dashboard-010"] [data-part="row"]{display:contents}
[data-vibeui-block="dashboard-010"] dt{color:var(--vibeui-dashboard-010-muted)}
[data-vibeui-block="dashboard-010"] dd{margin:0}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS = [
  { label: "Установок", value: "412" },
  { label: "Проектов", value: "9" },
  { label: "В команде", value: "4" },
]

const DEFAULT_FACTS = [
  { label: "Почта", value: "anna@vibeui.ru" },
  { label: "Часовой пояс", value: "UTC+3, Москва" },
  { label: "Права", value: "Владелец проекта" },
]

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Шапка профиля: обложка, аватар, показатели и вкладки-ссылки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard010({
  name = "Анна Реброва",
  role = "Дизайнер интерфейсов",
  place = "Москва",
  since = "В проекте с марта 2025",
  stats = DEFAULT_STATS,
  tabs = ["Обзор", "Активность", "Проекты", "Настройки"],
  activeTab = "Обзор",
  cta = "Написать",
  secondary = "Профиль",
  facts = DEFAULT_FACTS,
  profileText = "Профиль: {name}",
  tabsText = "Разделы профиля",
  background = "",
  accent,
  className,
  style,
}: Dashboard010Props) {
  const palette = {
    "--vibeui-dashboard-010-hue": hue(name),
    ...(accent ? { "--vibeui-dashboard-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-010-bg": background,
          "--vibeui-dashboard-010-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-010"
        className={className}
        style={palette}
        aria-label={profileText.replace("{name}", name)}
      >
        <div data-part="cover" aria-hidden="true" />
        <div data-part="body">
          <span data-part="avatar" aria-hidden="true">
            {initials(name)}
          </span>
          <div data-part="top">
            <div>
              <h2>{name}</h2>
              <p data-part="role">{role}</p>
              <p data-part="meta">
                <span>{place}</span>
                <span>{since}</span>
              </p>
            </div>
            <div data-part="actions">
              <button type="button" data-part="primary">
                {cta}
              </button>
              <button type="button" data-part="secondary">
                {secondary}
              </button>
            </div>
          </div>

          <ul data-part="stats">
            {stats.map((stat) => (
              <li key={stat.label} data-part="stat">
                <p data-part="value">{stat.value}</p>
                <p data-part="label">{stat.label}</p>
              </li>
            ))}
          </ul>
        </div>

        <nav data-part="tabs" aria-label={tabsText}>
          {tabs.map((tab) => (
            <a
              key={tab}
              data-part="tab"
              href="#"
              aria-current={tab === activeTab ? "page" : undefined}
            >
              {tab}
            </a>
          ))}
        </nav>

        <dl>
          {facts.map((fact) => (
            <div key={fact.label} data-part="row">
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
