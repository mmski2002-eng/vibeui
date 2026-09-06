import type { CSSProperties } from "react"

export type Dashboard027Fact = {
  label: string
  value: string
}

export type Dashboard027Event = {
  time: string
  who: string
  what: string
}

export type Dashboard027Props = {
  project?: string
  status?: string
  lead?: string
  summary?: string
  tabs?: string[]
  activeTab?: string
  team?: string[]
  facts?: Dashboard027Fact[]
  events?: Dashboard027Event[]
  progress?: number
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Заголовки разделов: facts, progress, activity. */
  sectionsText?: Record<string, string>
  /** Шаблон строки ответственного: {name}. */
  leadText?: string
  /** Шаблон подписи стопки участников: {list}. */
  teamAriaText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: страница проекта, где шапка отвечает «что это и как идёт», а
// правая колонка — «что произошло последним». Вкладки сделаны ссылками:
// раздел проекта обязан открываться по адресу, иначе на него нельзя дать
// ссылку в переписке. Стопка аватаров собрана отрицательным отступом и
// заканчивается счётчиком остатка, а не обрывается молча. Полоса готовности
// объявлена progressbar и подписана числом — процент без цифры не сравнить.
const STYLES = `
:where([data-vibeui-block="dashboard-027"]){
--vibeui-dashboard-027-bg:transparent;
/* Просвет между аватарами: подложка бывает прозрачной, и вырезать стопку
   собственным фоном тогда нечем. */
--vibeui-dashboard-027-cut:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-dashboard-027-panel:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-dashboard-027-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dashboard-027-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-dashboard-027-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-dashboard-027-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.17 39.8));
--vibeui-dashboard-027-ok:light-dark(oklch(0.53 0.14 152),oklch(0.76 0.14 152));
--vibeui-dashboard-027-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-027"]{color-scheme:dark}
[data-vibeui-block="dashboard-027"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-dashboard-027-bg);
color:var(--vibeui-dashboard-027-fg);
font-family:var(--vibeui-dashboard-027-sans);
border:1px solid var(--vibeui-dashboard-027-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-027"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-027"] [data-part="top"]{padding:1.125rem 1.125rem 0}
[data-vibeui-block="dashboard-027"] [data-part="titlerow"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.625rem;
}
[data-vibeui-block="dashboard-027"] h2{margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="dashboard-027"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
padding:0.125rem 0.5rem;border-radius:9999px;
color:var(--vibeui-dashboard-027-ok);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-027-ok);
}
[data-vibeui-block="dashboard-027"] [data-part="team"]{
display:flex;margin:0 0 0 auto;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-027"] [data-part="team"] li{
width:1.75rem;height:1.75rem;margin-left:-0.4375rem;border-radius:9999px;
display:grid;place-items:center;font-size:0.625rem;font-weight:700;
border:2px solid var(--vibeui-dashboard-027-cut);
background:oklch(0.93 0.04 var(--vibeui-dashboard-027-hue));
color:oklch(0.36 0.1 var(--vibeui-dashboard-027-hue));
}
[data-vibeui-block="dashboard-027"] [data-part="team"] li:first-child{margin-left:0}
[data-vibeui-block="dashboard-027"] [data-part="rest"]{
background:var(--vibeui-dashboard-027-panel);color:var(--vibeui-dashboard-027-muted);
}
[data-vibeui-block="dashboard-027"] [data-part="summary"]{
margin:0.5rem 0 0;max-width:44rem;font-size:0.8125rem;line-height:1.55;
color:var(--vibeui-dashboard-027-muted);
}
[data-vibeui-block="dashboard-027"] [data-part="tabs"]{
display:flex;gap:0.25rem;margin:0.875rem 0 0;padding:0;list-style:none;overflow-x:auto;
border-bottom:1px solid var(--vibeui-dashboard-027-border);
}
[data-vibeui-block="dashboard-027"] [data-part="tabs"] a{
display:block;padding:0.4375rem 0.625rem;white-space:nowrap;
font-size:0.8125rem;font-weight:600;text-decoration:none;
color:var(--vibeui-dashboard-027-muted);
border-bottom:2px solid transparent;margin-bottom:-1px;
}
[data-vibeui-block="dashboard-027"] [data-part="tabs"] a[aria-current="page"]{
color:var(--vibeui-dashboard-027-fg);border-bottom-color:var(--vibeui-dashboard-027-accent);
}
[data-vibeui-block="dashboard-027"] [data-part="tabs"] a:focus-visible{
outline:2px solid var(--vibeui-dashboard-027-accent);outline-offset:-2px;
}
[data-vibeui-block="dashboard-027"] [data-part="body"]{
display:grid;grid-template-columns:1fr;gap:1.125rem;padding:1.125rem;
}
[data-vibeui-block="dashboard-027"] h3{
margin:0 0 0.5rem;font-size:0.6875rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-dashboard-027-muted);
}
[data-vibeui-block="dashboard-027"] [data-part="facts"]{
display:grid;grid-template-columns:repeat(2,1fr);gap:0.625rem;margin:0 0 1rem;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-027"] [data-part="fact"]{
background:var(--vibeui-dashboard-027-panel);
border:1px solid var(--vibeui-dashboard-027-border);border-radius:0.75rem;
padding:0.625rem 0.75rem;
}
[data-vibeui-block="dashboard-027"] [data-part="factlabel"]{
display:block;font-size:0.625rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-dashboard-027-muted);
}
[data-vibeui-block="dashboard-027"] [data-part="factvalue"]{
display:block;margin-top:0.1875rem;font-size:0.9375rem;font-weight:700;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-027"] [data-part="progressline"]{
display:flex;align-items:baseline;gap:0.5rem;margin:0 0 0.3125rem;font-size:0.75rem;
}
[data-vibeui-block="dashboard-027"] [data-part="pct"]{
margin-left:auto;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-027"] [data-part="track"]{
display:block;height:0.5rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-027-panel);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-027-border);
}
[data-vibeui-block="dashboard-027"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
width:var(--vibeui-dashboard-027-w);
background:var(--vibeui-dashboard-027-accent);
}
[data-vibeui-block="dashboard-027"] [data-part="feed"]{
margin:0;padding:0;list-style:none;
border-left:2px solid var(--vibeui-dashboard-027-border);padding-left:0.875rem;
}
[data-vibeui-block="dashboard-027"] [data-part="feed"] li{position:relative;padding-bottom:0.75rem}
[data-vibeui-block="dashboard-027"] [data-part="feed"] li:last-child{padding-bottom:0}
[data-vibeui-block="dashboard-027"] [data-part="dot"]{
position:absolute;left:-1.1875rem;top:0.3125rem;
width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-dashboard-027-accent);
}
[data-vibeui-block="dashboard-027"] [data-part="what"]{margin:0;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="dashboard-027"] [data-part="who"]{font-weight:650}
[data-vibeui-block="dashboard-027"] [data-part="when"]{
margin:0.0625rem 0 0;font-size:0.6875rem;color:var(--vibeui-dashboard-027-muted);
font-variant-numeric:tabular-nums;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-027"] [data-part="body"]{grid-template-columns:1fr 17rem;padding:1.375rem}
[data-vibeui-block="dashboard-027"] [data-part="top"]{padding:1.375rem 1.375rem 0}
[data-vibeui-block="dashboard-027"] [data-part="facts"]{grid-template-columns:repeat(4,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-027"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FACTS: Dashboard027Fact[] = [
  { label: "Блоков", value: "34" },
  { label: "Открытых задач", value: "11" },
  { label: "Установок за месяц", value: "4 820" },
  { label: "Релиз", value: "2 апреля" },
]

const DEFAULT_EVENTS: Dashboard027Event[] = [
  {
    time: "сегодня, 14:22",
    who: "Сборка",
    what: "упала на проверке метаданных dashboard-016",
  },
  {
    time: "сегодня, 11:04",
    who: "Анна Реброва",
    what: "переписала промпт установки для категории dashboard",
  },
  {
    time: "вчера, 18:40",
    who: "Илья Мохов",
    what: "добавил четыре блока отчётов и обновил индексы",
  },
  {
    time: "13 марта",
    who: "Ким Сон",
    what: "перевёл описания категории на английский",
  },
]

const DEFAULT_TEAM = ["Анна Реброва", "Илья Мохов", "Ким Сон", "Пётр Гай"]

const DEFAULT_SECTIONS: Record<string, string> = {
  facts: "Показатели",
  progress: "Готовность к релизу",
  activity: "Активность",
}

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

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/**
 * Страница проекта: шапка с составом команды, вкладки-ссылки, показатели
 * и лента активности. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard027({
  project = "Витрина мебели",
  status = "в работе",
  lead = "Анна Реброва",
  summary = "Каталог блоков для мебельного магазина: карточки товара, фильтры и корзина. Собирается из реестра VibeUI, дизайн-токены приходят из библиотеки макетов.",
  tabs = ["Обзор", "Блоки", "Задачи", "Файлы", "Настройки"],
  activeTab = "Обзор",
  team = DEFAULT_TEAM,
  facts = DEFAULT_FACTS,
  events = DEFAULT_EVENTS,
  progress = 68,
  accent,
  background = "",
  sectionsText = DEFAULT_SECTIONS,
  leadText = "Ведёт {name}",
  teamAriaText = "Команда: {list}",
  className,
  style,
}: Dashboard027Props) {
  const section = (key: string) => sectionsText[key] ?? DEFAULT_SECTIONS[key]
  const palette = {
    ...(accent ? { "--vibeui-dashboard-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-027-bg": background,
          "--vibeui-dashboard-027-cut": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const shown = team.slice(0, 3)
  const rest = team.length - shown.length

  return (
    <>
      <style href="vibeui-dashboard-027" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-027"
        className={className}
        style={palette}
        aria-label={project}
      >
        <header data-part="top">
          <div data-part="titlerow">
            <h2>{project}</h2>
            <span data-part="status">{status}</span>
            <ul
              data-part="team"
              aria-label={teamAriaText.replace("{list}", team.join(", "))}
            >
              {shown.map((member) => (
                <li
                  key={member}
                  style={
                    {
                      "--vibeui-dashboard-027-hue": `${hue(member)}`,
                    } as CSSProperties
                  }
                >
                  <span aria-hidden="true">{initials(member)}</span>
                </li>
              ))}
              {rest > 0 ? (
                <li data-part="rest">
                  <span aria-hidden="true">+{rest}</span>
                </li>
              ) : null}
            </ul>
          </div>
          <p data-part="summary">{summary}</p>
          <ul data-part="tabs">
            {tabs.map((tab) => (
              <li key={tab}>
                <a
                  href="#dashboard-027"
                  aria-current={tab === activeTab ? "page" : undefined}
                >
                  {tab}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <div data-part="body">
          <div>
            <h3>{section("facts")}</h3>
            <ul data-part="facts">
              {facts.map((fact) => (
                <li key={fact.label} data-part="fact">
                  <span data-part="factlabel">{fact.label}</span>
                  <span data-part="factvalue">{fact.value}</span>
                </li>
              ))}
            </ul>

            <h3>{section("progress")}</h3>
            <p data-part="progressline">
              <span>{leadText.replace("{name}", lead)}</span>
              <span data-part="pct">{progress} %</span>
            </p>
            <span
              data-part="track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={section("progress")}
            >
              <span
                data-part="fill"
                style={
                  {
                    "--vibeui-dashboard-027-w": `${progress}%`,
                  } as CSSProperties
                }
              />
            </span>
          </div>

          <aside>
            <h3>{section("activity")}</h3>
            <ul data-part="feed">
              {events.map((event) => (
                <li key={`${event.time}-${event.what}`}>
                  <span data-part="dot" aria-hidden="true" />
                  <p data-part="what">
                    <span data-part="who">{event.who}</span> {event.what}
                  </p>
                  <p data-part="when">{event.time}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
