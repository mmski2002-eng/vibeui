import type { CSSProperties } from "react"

export type Dashboard067Phase = {
  name: string
  owner: string
  start: number
  span: number
  state: "done" | "active" | "planned" | "risk"
  milestone?: string
}

export type Dashboard067Props = {
  title?: string
  projectMeta?: string
  weeks?: string[]
  phases?: Dashboard067Phase[]
  todayColumn?: number
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись линии сегодняшнего дня. */
  todayLabel?: string
  /** Подписи состояний этапа по ключам done, active, planned, risk. */
  stateText?: Record<Dashboard067Phase["state"], string>
  /** Подписи легенды по тем же ключам. */
  legendText?: Record<Dashboard067Phase["state"], string>
  /** Всплывающая подпись полосы: {name} и {state}. */
  trackTitleText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: диаграмма сроков без библиотеки. Каждый этап — строка CSS-грида,
// а его полоса занимает колонки от начала до конца через grid-column: длина
// полосы и есть длительность, её не нужно подписывать числом. Сегодняшний день
// нарисован вертикальной линией поверх сетки: без него полосы висят в воздухе
// и «отстаём или нет» не читается. Состояние этапа помечено не только тоном,
// но и заливкой полосы — риск получает штриховку repeating-linear-gradient,
// чтобы отличаться в чёрно-белой печати. Вехи стоят ромбом на границе колонки,
// потому что веха — это точка, а не отрезок.
const STYLES = `
:where([data-vibeui-block="dashboard-067"]){
--vibeui-dashboard-067-bg:transparent;
/* Полотно диаграммы и полосы этапов: подложка блока прозрачна. */
--vibeui-dashboard-067-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 240));
--vibeui-dashboard-067-fg:light-dark(oklch(0.21 0.014 240),oklch(0.94 0.005 240));
--vibeui-dashboard-067-muted:light-dark(oklch(0.55 0.014 240),oklch(0.72 0.012 240));
--vibeui-dashboard-067-border:light-dark(oklch(0.91 0.006 240),oklch(0.36 0.012 240));
--vibeui-dashboard-067-accent:light-dark(oklch(0.52 0.15 240),oklch(0.7 0.13 240));
--vibeui-dashboard-067-soft:light-dark(oklch(0.965 0.02 240),oklch(0.31 0.03 240));
--vibeui-dashboard-067-done:light-dark(oklch(0.72 0.07 240),oklch(0.62 0.06 240));
--vibeui-dashboard-067-risk:light-dark(oklch(0.6 0.18 30),oklch(0.68 0.17 30));
--vibeui-dashboard-067-risk-dark:light-dark(oklch(0.47 0.14 30),oklch(0.55 0.14 30));
--vibeui-dashboard-067-today:light-dark(oklch(0.45 0.16 300),oklch(0.78 0.15 300));
--vibeui-dashboard-067-on-track:light-dark(oklch(1 0 0),oklch(0.17 0.02 240));
--vibeui-dashboard-067-today-label:"сегодня";
--vibeui-dashboard-067-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-067"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-067-bg);
color:var(--vibeui-dashboard-067-fg);
font-family:var(--vibeui-dashboard-067-sans);
border:1px solid var(--vibeui-dashboard-067-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-067"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-067"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-067"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-067"] [data-part="meta"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-067-muted)}
[data-vibeui-block="dashboard-067"] [data-part="scroll"]{
overflow-x:auto;padding:0.75rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-067-card);border:1px solid var(--vibeui-dashboard-067-border);
}
[data-vibeui-block="dashboard-067"] [data-part="chart"]{
position:relative;display:grid;gap:0.3125rem 0;align-items:center;min-width:38rem;
}
[data-vibeui-block="dashboard-067"] [data-part="week"]{
grid-row:1;font-size:0.625rem;font-weight:700;color:var(--vibeui-dashboard-067-muted);
text-align:center;padding-bottom:0.25rem;border-bottom:1px solid var(--vibeui-dashboard-067-border);
white-space:nowrap;
}
[data-vibeui-block="dashboard-067"] [data-part="corner"]{grid-row:1;grid-column:1;border-bottom:1px solid var(--vibeui-dashboard-067-border)}
[data-vibeui-block="dashboard-067"] [data-part="name"]{
grid-column:1;font-size:0.75rem;padding-right:0.75rem;
}
[data-vibeui-block="dashboard-067"] [data-part="name"] b{display:block;font-weight:750;font-size:0.8125rem}
[data-vibeui-block="dashboard-067"] [data-part="name"] span{display:block;font-size:0.6875rem;color:var(--vibeui-dashboard-067-muted)}
[data-vibeui-block="dashboard-067"] [data-part="track"]{
height:1.375rem;border-radius:0.4375rem;display:flex;align-items:center;padding:0 0.4375rem;
font-size:0.625rem;font-weight:750;color:var(--vibeui-dashboard-067-on-track);white-space:nowrap;overflow:hidden;
background:var(--vibeui-dashboard-067-accent);
}
[data-vibeui-block="dashboard-067"] [data-state="done"] > [data-part="track"],
[data-vibeui-block="dashboard-067"] [data-part="track"][data-state="done"]{background:var(--vibeui-dashboard-067-done)}
[data-vibeui-block="dashboard-067"] [data-part="track"][data-state="planned"]{
background:var(--vibeui-dashboard-067-soft);color:var(--vibeui-dashboard-067-muted);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-067-border);
}
[data-vibeui-block="dashboard-067"] [data-part="track"][data-state="risk"]{
background:repeating-linear-gradient(135deg,var(--vibeui-dashboard-067-risk) 0 0.375rem,var(--vibeui-dashboard-067-risk-dark) 0.375rem 0.75rem);
}
[data-vibeui-block="dashboard-067"] [data-part="today"]{
position:absolute;top:1.25rem;bottom:0;width:0;
border-left:2px dashed var(--vibeui-dashboard-067-today);
}
[data-vibeui-block="dashboard-067"] [data-part="today"]::after{
content:var(--vibeui-dashboard-067-today-label);position:absolute;top:-1.0625rem;left:0.25rem;
font-size:0.5625rem;font-weight:750;color:var(--vibeui-dashboard-067-today);white-space:nowrap;
}
[data-vibeui-block="dashboard-067"] [data-part="pin"]{
position:relative;width:0.5rem;height:0.5rem;background:currentColor;
transform:rotate(45deg);border-radius:0.0625rem;margin-left:0.3125rem;flex:0 0 auto;
}
[data-vibeui-block="dashboard-067"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;margin:0;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-dashboard-067-muted);
}
[data-vibeui-block="dashboard-067"] [data-part="legend"] li{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="dashboard-067"] [data-part="legend"] i{width:0.875rem;height:0.5rem;border-radius:0.1875rem;display:inline-block}
[data-vibeui-block="dashboard-067"] [data-part="miles"]{
margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.1875rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-067-muted);
}
[data-vibeui-block="dashboard-067"] [data-part="miles"] b{color:var(--vibeui-dashboard-067-fg);font-weight:700}
`

const DEFAULT_WEEKS = [
  "22 нед",
  "23 нед",
  "24 нед",
  "25 нед",
  "26 нед",
  "27 нед",
  "28 нед",
  "29 нед",
]

const DEFAULT_PHASES: Dashboard067Phase[] = [
  {
    name: "Обследование площадки",
    owner: "Марина Тюрина",
    start: 1,
    span: 2,
    state: "done",
    milestone: "Акт обследования подписан 6 июня",
  },
  {
    name: "Проектирование",
    owner: "Егор Савельев",
    start: 2,
    span: 3,
    state: "active",
  },
  {
    name: "Согласование сметы",
    owner: "Ирина Кузнецова",
    start: 4,
    span: 2,
    state: "risk",
    milestone: "Смета не согласована третью неделю",
  },
  {
    name: "Поставка оборудования",
    owner: "Павел Дорохов",
    start: 5,
    span: 2,
    state: "planned",
  },
  {
    name: "Монтаж и пусконаладка",
    owner: "подрядчик «Ремстрой»",
    start: 6,
    span: 3,
    state: "planned",
    milestone: "Сдача заказчику — 19 июля",
  },
]

const STATE_LABELS: Record<Dashboard067Phase["state"], string> = {
  done: "завершён",
  active: "идёт",
  planned: "план",
  risk: "риск срыва",
}

const LEGEND_LABELS: Record<Dashboard067Phase["state"], string> = {
  done: "завершён",
  active: "идёт сейчас",
  planned: "запланирован",
  risk: "риск срыва",
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

/**
 * Страница проекта с диаграммой сроков: этапы — строки CSS-грида, полоса
 * занимает колонки от начала до конца, сегодняшний день нарисован линией
 * поверх сетки. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard067({
  title = "Модернизация склада в Тюмени",
  projectMeta = "Заказчик: ООО «Северный лес» · бюджет 4,2 млн ₽ · сдача 19 июля",
  weeks = DEFAULT_WEEKS,
  phases = DEFAULT_PHASES,
  todayColumn = 4,
  accent,
  background = "",
  todayLabel = "сегодня",
  stateText = STATE_LABELS,
  legendText = LEGEND_LABELS,
  trackTitleText = "{name}: {state}",
  className,
  style,
}: Dashboard067Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-067-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-067-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    "--vibeui-dashboard-067-today-label": `"${todayLabel}"`,
    ...style,
  } as CSSProperties

  const states = { ...STATE_LABELS, ...stateText }
  const legend = { ...LEGEND_LABELS, ...legendText }

  const columns = weeks.length
  const todayLeft = `calc(11rem + (100% - 11rem) * ${todayColumn / columns})`

  return (
    <>
      <style href="vibeui-dashboard-067" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-067"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="meta">{projectMeta}</p>
          </div>

          <div data-part="scroll">
            <div
              data-part="chart"
              style={{
                gridTemplateColumns: `11rem repeat(${columns}, minmax(3.25rem, 1fr))`,
              }}
            >
              <div data-part="corner" />
              {weeks.map((week, index) => (
                <div
                  key={week}
                  data-part="week"
                  style={{ gridColumn: index + 2 }}
                >
                  {week}
                </div>
              ))}

              {phases.map((phase) => (
                <div key={phase.name} style={{ display: "contents" }}>
                  <div data-part="name">
                    <b>{phase.name}</b>
                    <span>{phase.owner}</span>
                  </div>
                  <div
                    data-part="track"
                    data-state={phase.state}
                    style={{
                      gridColumn: `${phase.start + 1} / span ${phase.span}`,
                    }}
                    title={trackTitleText
                      .replace("{name}", phase.name)
                      .replace("{state}", states[phase.state])}
                  >
                    {states[phase.state]}
                    {phase.milestone ? <span data-part="pin" /> : null}
                  </div>
                </div>
              ))}

              <div
                data-part="today"
                style={{ left: todayLeft }}
                aria-hidden="true"
              />
            </div>
          </div>

          <ul data-part="legend">
            <li>
              <i style={{ background: "var(--vibeui-dashboard-067-done)" }} />
              {legend.done}
            </li>
            <li>
              <i style={{ background: "var(--vibeui-dashboard-067-accent)" }} />
              {legend.active}
            </li>
            <li>
              <i
                style={{
                  background:
                    "repeating-linear-gradient(135deg,var(--vibeui-dashboard-067-risk) 0 0.25rem,var(--vibeui-dashboard-067-risk-dark) 0.25rem 0.5rem)",
                }}
              />
              {legend.risk}
            </li>
            <li>
              <i
                style={{
                  background: "var(--vibeui-dashboard-067-soft)",
                  boxShadow:
                    "inset 0 0 0 1px var(--vibeui-dashboard-067-border)",
                }}
              />
              {legend.planned}
            </li>
          </ul>

          <ul data-part="miles">
            {phases
              .filter((phase) => phase.milestone)
              .map((phase) => (
                <li key={phase.name}>
                  <b>{phase.name}:</b> {phase.milestone}
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  )
}
