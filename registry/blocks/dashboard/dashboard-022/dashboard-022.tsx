import type { CSSProperties } from "react"

export type Dashboard022Integration = {
  name: string
  group: string
  text: string
  connected?: boolean
  account?: string
  needsUpdate?: boolean
}

export type Dashboard022Props = {
  title?: string
  hint?: string
  groups?: string[]
  activeGroup?: string
  items?: Dashboard022Integration[]
  /** Состояния: ключи on, off и stale. */
  stateText?: Record<string, string>
  /** Шаблон строки категории: {group}. */
  categoryText?: string
  configureLabel?: string
  refreshLabel?: string
  disconnectLabel?: string
  connectLabel?: string
  accent?: string
  /** Подложка витрины; пусто — цвет из палитры блока. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: витрина интеграций, где подключённое видно до чтения текста.
// У подключённой карточки другая рамка, значок с галочкой и строка с именем
// аккаунта — без неё непонятно, к какому именно рабочему пространству
// прицепились. Отдельным состоянием вынесено «нужно обновить доступ»: это не
// «подключено» и не «выключено», а третье положение, которое обычно теряют.
// Значок сервиса нарисован буквой на цветном поле — блок не тянет чужие файлы.
const STYLES = `
:where([data-vibeui-block="dashboard-022"]){
--vibeui-dashboard-022-bg:light-dark(oklch(0.985 0 265),oklch(0.21 0 265));
--vibeui-dashboard-022-card:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-dashboard-022-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dashboard-022-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-dashboard-022-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-dashboard-022-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.15 262));
--vibeui-dashboard-022-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-dashboard-022-ok:light-dark(oklch(0.53 0.14 152),oklch(0.76 0.13 152));
--vibeui-dashboard-022-warn:light-dark(oklch(0.63 0.15 65),oklch(0.79 0.13 65));
--vibeui-dashboard-022-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-022"]{color-scheme:dark}
[data-vibeui-block="dashboard-022"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-022-bg);
color:var(--vibeui-dashboard-022-fg);
font-family:var(--vibeui-dashboard-022-sans);
border:1px solid var(--vibeui-dashboard-022-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-022"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-022"] [data-part="shell"]{padding:1.125rem}
[data-vibeui-block="dashboard-022"] h2{margin:0 0 0.125rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-022"] [data-part="hint"]{margin:0 0 0.875rem;font-size:0.75rem;color:var(--vibeui-dashboard-022-muted)}
[data-vibeui-block="dashboard-022"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.375rem;margin:0 0 0.875rem;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-022"] [data-part="chips"] a{
display:block;padding:0.3125rem 0.625rem;border-radius:9999px;
font-size:0.75rem;font-weight:600;text-decoration:none;
color:var(--vibeui-dashboard-022-muted);
background:var(--vibeui-dashboard-022-card);
border:1px solid var(--vibeui-dashboard-022-border);
}
[data-vibeui-block="dashboard-022"] [data-part="chips"] a[aria-current="true"]{
color:var(--vibeui-dashboard-022-on-accent);
background:var(--vibeui-dashboard-022-accent);
border-color:var(--vibeui-dashboard-022-accent);
}
[data-vibeui-block="dashboard-022"] [data-part="grid"]{
display:grid;grid-template-columns:1fr;gap:0.75rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-022"] [data-part="item"]{
display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.625rem;
background:var(--vibeui-dashboard-022-card);
border:1px solid var(--vibeui-dashboard-022-border);border-radius:0.875rem;
padding:0.875rem;
}
[data-vibeui-block="dashboard-022"] [data-state="on"]{border-color:var(--vibeui-dashboard-022-ok)}
[data-vibeui-block="dashboard-022"] [data-state="stale"]{border-color:var(--vibeui-dashboard-022-warn)}
[data-vibeui-block="dashboard-022"] [data-part="logo"]{
grid-row:span 3;align-self:start;
width:2.25rem;height:2.25rem;border-radius:0.625rem;
display:grid;place-items:center;font-size:0.9375rem;font-weight:700;
background:light-dark(oklch(0.94 0.04 var(--vibeui-dashboard-022-hue)),oklch(0.36 0.06 var(--vibeui-dashboard-022-hue)));
color:light-dark(oklch(0.36 0.1 var(--vibeui-dashboard-022-hue)),oklch(0.9 0.05 var(--vibeui-dashboard-022-hue)));
}
[data-vibeui-block="dashboard-022"] [data-part="row"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
}
[data-vibeui-block="dashboard-022"] h3{margin:0;font-size:0.875rem;font-weight:700}
[data-vibeui-block="dashboard-022"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-dashboard-022-muted);
}
[data-vibeui-block="dashboard-022"] [data-part="mark"]{
width:0.5rem;height:0.5rem;border-radius:9999px;
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-022-border);
}
[data-vibeui-block="dashboard-022"] [data-state="on"] [data-part="mark"]{
background:var(--vibeui-dashboard-022-ok);box-shadow:none;
}
[data-vibeui-block="dashboard-022"] [data-state="on"] [data-part="state"]{color:var(--vibeui-dashboard-022-ok)}
[data-vibeui-block="dashboard-022"] [data-state="stale"] [data-part="mark"]{
background:none;border-radius:0.125rem;
box-shadow:inset 0 0 0 2px var(--vibeui-dashboard-022-warn);
}
[data-vibeui-block="dashboard-022"] [data-state="stale"] [data-part="state"]{color:var(--vibeui-dashboard-022-warn)}
[data-vibeui-block="dashboard-022"] [data-part="text"]{
margin:0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-dashboard-022-muted);
}
[data-vibeui-block="dashboard-022"] [data-part="account"]{
margin:0;font-size:0.6875rem;font-weight:600;
}
[data-vibeui-block="dashboard-022"] [data-part="foot"]{
grid-column:2;display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem;
}
[data-vibeui-block="dashboard-022"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:650;
padding:0.375rem 0.6875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-022-border);
background:var(--vibeui-dashboard-022-card);color:inherit;
}
[data-vibeui-block="dashboard-022"] [data-part="connect"]{
border-color:var(--vibeui-dashboard-022-accent);
background:var(--vibeui-dashboard-022-accent);color:var(--vibeui-dashboard-022-on-accent);
}
[data-vibeui-block="dashboard-022"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-022-accent);outline-offset:2px;
}
@container (min-width: 36rem){
[data-vibeui-block="dashboard-022"] [data-part="grid"]{grid-template-columns:repeat(2,1fr)}
[data-vibeui-block="dashboard-022"] [data-part="shell"]{padding:1.375rem}
}
@container (min-width: 62rem){
[data-vibeui-block="dashboard-022"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-022"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Dashboard022Integration[] = [
  {
    name: "Slack",
    group: "Общение",
    text: "Уведомления о сборках и упоминаниях в выбранный канал.",
    connected: true,
    account: "vibeui · #catalog",
  },
  {
    name: "GitHub",
    group: "Разработка",
    text: "Синхронизация registry.json и запуск сборки на push.",
    connected: true,
    account: "vibeui-org/catalog",
  },
  {
    name: "Figma",
    group: "Дизайн",
    text: "Импорт токенов и палитр из библиотеки макетов.",
    connected: true,
    account: "Библиотека VibeUI",
    needsUpdate: true,
  },
  {
    name: "Notion",
    group: "Документы",
    text: "Выгрузка описаний блоков в базу знаний команды.",
  },
  {
    name: "Linear",
    group: "Разработка",
    text: "Создание задачи из упавшей проверки метаданных.",
  },
  {
    name: "Sentry",
    group: "Наблюдение",
    text: "Ошибки установленных блоков в проектах клиентов.",
  },
]

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function state(item: Dashboard022Integration) {
  if (!item.connected) {
    return "off"
  }

  return item.needsUpdate ? "stale" : "on"
}

const STATE_WORD: Record<string, string> = {
  on: "подключено",
  off: "не подключено",
  stale: "нужен доступ",
}

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Каталог интеграций: подключённое отличается рамкой, значком и именем
 * аккаунта. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard022({
  title = "Интеграции",
  hint = "Подключите сервисы, в которых команда уже работает",
  groups = [
    "Все",
    "Общение",
    "Разработка",
    "Дизайн",
    "Документы",
    "Наблюдение",
  ],
  activeGroup = "Все",
  items = DEFAULT_ITEMS,
  stateText = STATE_WORD,
  categoryText = "Категория: {group}",
  configureLabel = "Настроить",
  refreshLabel = "Обновить доступ",
  disconnectLabel = "Отключить",
  connectLabel = "Подключить",
  accent,
  background = "",
  className,
  style,
}: Dashboard022Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-022" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-022"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="hint">{hint}</p>

          <ul data-part="chips">
            {groups.map((group) => (
              <li key={group}>
                <a
                  href="#dashboard-022"
                  aria-current={group === activeGroup ? "true" : undefined}
                >
                  {group}
                </a>
              </li>
            ))}
          </ul>

          <ul data-part="grid">
            {items.map((item) => (
              <li
                key={item.name}
                data-part="item"
                data-state={state(item)}
                style={
                  {
                    "--vibeui-dashboard-022-hue": `${hue(item.name)}`,
                  } as CSSProperties
                }
              >
                <span data-part="logo" aria-hidden="true">
                  {item.name.charAt(0)}
                </span>
                <div data-part="row">
                  <h3>{item.name}</h3>
                  <span data-part="state">
                    <span data-part="mark" aria-hidden="true" />
                    {stateText[state(item)] ?? STATE_WORD[state(item)]}
                  </span>
                </div>
                <p data-part="text">{item.text}</p>
                <p data-part="account">
                  {item.account ?? categoryText.replace("{group}", item.group)}
                </p>
                <div data-part="foot">
                  {item.connected ? (
                    <>
                      <button type="button">
                        {item.needsUpdate ? refreshLabel : configureLabel}
                      </button>
                      <button type="button">{disconnectLabel}</button>
                    </>
                  ) : (
                    <button type="button" data-part="connect">
                      {connectLabel}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
