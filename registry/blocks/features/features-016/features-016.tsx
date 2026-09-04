import type { CSSProperties } from "react"

export type Features016Tab = {
  id: string
  label: string
  title: string
  description: string
  points: string[]
  /** Что нарисовать в окне мокапа — три готовых сюжета, без картинок. */
  kind: "chart" | "rows" | "grid"
}

export type Features016Props = {
  eyebrow?: string
  title?: string
  tabs?: Features016Tab[]
  /** Название группы вкладок для скринридера: компонент несёт русское. */
  tablistLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: вкладки features-008 показывали текст и метрику в правой
// колонке; здесь вместо метрики — окно продукта, которое меняется вместе с
// вкладкой. Переключение по-прежнему держится на группе радиокнопок и
// селекторе :checked, JavaScript не нужен: каждая вкладка — это <article>,
// целиком показанный или скрытый вместе со своим окном, а не отдельный
// синхронизированный слой поверх общего мокапа.
//
// Окно — иллюстрация, а не интерфейс: помечено aria-hidden, содержимое
// нарисовано тремя готовыми сюжетами (chart/rows/grid) на градиентах и
// плашках, внешних картинок нет. Тема берётся из color-scheme окружения
// через light-dark(), тёмная ветка не инверсия светлой — окно и полоса
// вкладок там светлее фона страницы, а не темнее.
const STYLES = `
:where([data-vibeui-block="features-016"]){
--vibeui-features-016-bg:transparent;
--vibeui-features-016-fg:light-dark(oklch(0.2 0.014 250),oklch(0.95 0.005 250));
--vibeui-features-016-muted:light-dark(oklch(0.51 0.014 250),oklch(0.72 0.014 250));
--vibeui-features-016-card:light-dark(oklch(1 0 0),oklch(0.24 0.012 250));
--vibeui-features-016-panel:light-dark(oklch(0.97 0.006 250),oklch(0.28 0.013 250));
--vibeui-features-016-line:light-dark(oklch(0.89 0.008 250),oklch(0.35 0.012 250));
--vibeui-features-016-accent:light-dark(oklch(0.5 0.16 250),oklch(0.74 0.14 250));
--vibeui-features-016-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.17 0.03 250));
--vibeui-features-016-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-016"]{color-scheme:dark}
[data-vibeui-block="features-016"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-016-bg);color:var(--vibeui-features-016-fg);
font-family:var(--vibeui-features-016-sans);
}
[data-vibeui-block="features-016"] *{box-sizing:border-box}
[data-vibeui-block="features-016"] [data-part="shell"]{max-width:68rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-016"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-016-accent);
}
[data-vibeui-block="features-016"] h2{
margin:0 0 1.75rem;max-width:26ch;font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-016"] input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
[data-vibeui-block="features-016"] [data-part="tablist"]{
display:flex;flex-wrap:wrap;gap:0.375rem;padding:0.3125rem;border-radius:0.875rem;
border:1px solid var(--vibeui-features-016-line);background:var(--vibeui-features-016-card);
}
[data-vibeui-block="features-016"] [data-part="tab"]{
flex:1 1 8rem;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;
height:2.375rem;padding:0 0.875rem;border-radius:0.625rem;
font-size:0.875rem;font-weight:600;color:var(--vibeui-features-016-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="features-016"] [data-part="tab"]:hover{color:var(--vibeui-features-016-fg)}
[data-vibeui-block="features-016"] [data-part="panel"]{display:none;margin-top:1.5rem}
[data-vibeui-block="features-016"] [data-part="panelgrid"]{display:grid;grid-template-columns:1fr;gap:1.75rem}
[data-vibeui-block="features-016"] [data-part="panel"] h3{margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="features-016"] [data-part="panel"] p{
margin:0.625rem 0 0;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-features-016-muted);text-wrap:pretty;
}
[data-vibeui-block="features-016"] ul{list-style:none;margin:1.25rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="features-016"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="features-016"] [data-part="tick"]{flex:0 0 auto;margin-top:0.25rem;color:var(--vibeui-features-016-accent)}
[data-vibeui-block="features-016"] [data-part="window"]{
border:1px solid var(--vibeui-features-016-line);border-radius:1rem;overflow:hidden;background:var(--vibeui-features-016-card);
}
[data-vibeui-block="features-016"] [data-part="winbar"]{
display:flex;align-items:center;gap:0.5rem;padding:0.75rem 1rem;border-bottom:1px solid var(--vibeui-features-016-line);
}
[data-vibeui-block="features-016"] [data-part="dot"]{width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-features-016-line)}
[data-vibeui-block="features-016"] [data-part="wintitle"]{
margin:0 0 0 0.25rem;font-size:0.75rem;font-weight:600;color:var(--vibeui-features-016-muted);
}
[data-vibeui-block="features-016"] [data-part="winbody"]{padding:1.25rem;min-height:11rem;display:flex;align-items:flex-end}
[data-vibeui-block="features-016"] [data-part="chart"]{width:100%;display:flex;align-items:flex-end;gap:8%;height:8rem}
[data-vibeui-block="features-016"] [data-part="chart"] span{
flex:1 1 0;border-radius:0.375rem 0.375rem 0 0;background:var(--vibeui-features-016-accent);opacity:.8;
}
[data-vibeui-block="features-016"] [data-part="chart"] span:nth-child(1){height:38%}
[data-vibeui-block="features-016"] [data-part="chart"] span:nth-child(2){height:62%}
[data-vibeui-block="features-016"] [data-part="chart"] span:nth-child(3){height:48%}
[data-vibeui-block="features-016"] [data-part="chart"] span:nth-child(4){height:88%;opacity:1}
[data-vibeui-block="features-016"] [data-part="chart"] span:nth-child(5){height:70%}
[data-vibeui-block="features-016"] [data-part="rows"]{width:100%;display:grid;gap:0.75rem}
[data-vibeui-block="features-016"] [data-part="rows"] [data-part="row"]{display:flex;align-items:center;gap:0.625rem}
[data-vibeui-block="features-016"] [data-part="avatar"]{
flex:0 0 auto;width:1.75rem;height:1.75rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-features-016-accent) 30%,var(--vibeui-features-016-panel));
}
[data-vibeui-block="features-016"] [data-part="bar"]{height:0.5rem;border-radius:9999px;background:var(--vibeui-features-016-panel)}
[data-vibeui-block="features-016"] [data-part="row"] [data-part="bar"]:first-of-type{flex:0 1 60%}
[data-vibeui-block="features-016"] [data-part="row"] [data-part="bar"]:last-of-type{flex:0 1 22%;background:color-mix(in oklab,var(--vibeui-features-016-accent) 22%,var(--vibeui-features-016-panel))}
[data-vibeui-block="features-016"] [data-part="grid"]{width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:0.625rem}
[data-vibeui-block="features-016"] [data-part="tile"]{
aspect-ratio:1;border-radius:0.5rem;background:var(--vibeui-features-016-panel);
}
[data-vibeui-block="features-016"] [data-part="tile"][data-active="true"]{
background:color-mix(in oklab,var(--vibeui-features-016-accent) 24%,var(--vibeui-features-016-panel));
}
[data-vibeui-block="features-016"] [data-part="t1"]:checked ~ [data-part="tablist"] [data-part="tab"]:nth-child(1),
[data-vibeui-block="features-016"] [data-part="t2"]:checked ~ [data-part="tablist"] [data-part="tab"]:nth-child(2),
[data-vibeui-block="features-016"] [data-part="t3"]:checked ~ [data-part="tablist"] [data-part="tab"]:nth-child(3),
[data-vibeui-block="features-016"] [data-part="t4"]:checked ~ [data-part="tablist"] [data-part="tab"]:nth-child(4){
background:var(--vibeui-features-016-accent);color:var(--vibeui-features-016-accent-fg);
}
[data-vibeui-block="features-016"] [data-part="t1"]:focus-visible ~ [data-part="tablist"] [data-part="tab"]:nth-child(1),
[data-vibeui-block="features-016"] [data-part="t2"]:focus-visible ~ [data-part="tablist"] [data-part="tab"]:nth-child(2),
[data-vibeui-block="features-016"] [data-part="t3"]:focus-visible ~ [data-part="tablist"] [data-part="tab"]:nth-child(3),
[data-vibeui-block="features-016"] [data-part="t4"]:focus-visible ~ [data-part="tablist"] [data-part="tab"]:nth-child(4){
outline:2px solid var(--vibeui-features-016-accent);outline-offset:2px;
}
[data-vibeui-block="features-016"] [data-part="t1"]:checked ~ [data-part="panels"] [data-part="panel"]:nth-child(1),
[data-vibeui-block="features-016"] [data-part="t2"]:checked ~ [data-part="panels"] [data-part="panel"]:nth-child(2),
[data-vibeui-block="features-016"] [data-part="t3"]:checked ~ [data-part="panels"] [data-part="panel"]:nth-child(3),
[data-vibeui-block="features-016"] [data-part="t4"]:checked ~ [data-part="panels"] [data-part="panel"]:nth-child(4){
display:block;
}
@container (min-width: 34rem){
[data-vibeui-block="features-016"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 60rem){
[data-vibeui-block="features-016"] [data-part="panelgrid"]{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:3rem;align-items:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TABS: Features016Tab[] = [
  {
    id: "overview",
    label: "Обзор",
    title: "Все метрики на одном экране",
    description:
      "Дашборд собирает воронку, выручку и активность в одном виде — не нужно сверять три разных отчёта перед планёркой.",
    points: [
      "Обновление раз в минуту",
      "Сравнение с прошлым периодом",
      "Экспорт графика одной кнопкой",
    ],
    kind: "chart",
  },
  {
    id: "team",
    label: "Команда",
    title: "Роли и доступ без переписки в чате",
    description:
      "Каждому участнику — своя роль с понятным набором прав. Приглашение занимает одну строку, а не тикет в поддержку.",
    points: [
      "Пять готовых ролей из коробки",
      "Гостевой доступ с истекающей ссылкой",
      "Журнал изменений прав",
    ],
    kind: "rows",
  },
  {
    id: "library",
    label: "Библиотека",
    title: "Шаблоны вместо чистого листа",
    description:
      "Готовые заготовки закрывают частые сценарии: остаётся выбрать подходящую и подставить свои данные.",
    points: [
      "Фильтр по назначению шаблона",
      "Копия сохраняется в своём воркспейсе",
      "Совместная работа над заготовкой",
    ],
    kind: "grid",
  },
]

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

function WindowMock({ kind }: { kind: Features016Tab["kind"] }) {
  if (kind === "chart") {
    return (
      <span data-part="chart">
        {[0, 1, 2, 3, 4].map((bar) => (
          <span key={bar} />
        ))}
      </span>
    )
  }

  if (kind === "rows") {
    return (
      <span data-part="rows">
        {[0, 1, 2, 3].map((row) => (
          <span key={row} data-part="row">
            <span data-part="avatar" />
            <span data-part="bar" />
            <span data-part="bar" />
          </span>
        ))}
      </span>
    )
  }

  return (
    <span data-part="grid">
      {[0, 1, 2, 3, 4, 5].map((tile) => (
        <span key={tile} data-part="tile" data-active={tile === 1} />
      ))}
    </span>
  )
}

/** Вкладки по возможностям с окном мокапа, которое меняется вместе с вкладкой. */
export function Features016({
  eyebrow = "Возможности",
  title = "Один продукт, три экрана, которые вы увидите первыми",
  tabs = DEFAULT_TABS,
  tablistLabel = "Возможности",
  background = "",
  accent,
  className,
  style,
}: Features016Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-features-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const visible = tabs.slice(0, 4)

  return (
    <>
      <style href="vibeui-features-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-016"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>

          <form data-part="tabs">
            {visible.map((tab, index) => (
              <input
                key={tab.id}
                data-part={`t${index + 1}`}
                id={`vibeui-features-016-${tab.id}`}
                type="radio"
                name="vibeui-features-016"
                defaultChecked={index === 0}
              />
            ))}

            <div data-part="tablist" role="group" aria-label={tablistLabel}>
              {visible.map((tab) => (
                <label
                  key={tab.id}
                  data-part="tab"
                  htmlFor={`vibeui-features-016-${tab.id}`}
                >
                  {tab.label}
                </label>
              ))}
            </div>

            <div data-part="panels">
              {visible.map((tab) => (
                <article key={tab.id} data-part="panel">
                  <div data-part="panelgrid">
                    <div>
                      <h3>{tab.title}</h3>
                      <p>{tab.description}</p>
                      <ul>
                        {tab.points.slice(0, 4).map((point) => (
                          <li key={point}>
                            <span data-part="tick" aria-hidden="true">
                              <svg viewBox="0 0 16 16" width="12" height="12">
                                <path
                                  d="M3.5 8.5 6.5 11.5 12.5 4.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div data-part="window" aria-hidden="true">
                      <div data-part="winbar">
                        <span data-part="dot" />
                        <span data-part="dot" />
                        <span data-part="dot" />
                        <p data-part="wintitle">{tab.label}</p>
                      </div>
                      <div data-part="winbody">
                        <WindowMock kind={tab.kind} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
