import type { CSSProperties } from "react"

export type Solutions030Operation = {
  name: string
  equipment: string
  normMinutes: number
  grade: number
}

export type Solutions030Props = {
  title?: string
  routeNumber?: string
  hint?: string
  operations?: Solutions030Operation[]
  /** Подписи плиток сводки: operations, time, grades. */
  summaryText?: Record<string, string>
  /** Подписи полей операции: equipment, norm, grade. */
  fieldText?: Record<string, string>
  /** Длительность. {minutes} — число минут. */
  minutesText?: string
  /** Нарастающий итог. {minutes} — число минут. */
  cumulativeText?: string
  footNote?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: технологическая карта маршрута изготовления. Операции — не
// таблица, а вертикальная лента с соединительной линией: маршрут читается как
// последовательность шагов, а не как строки без порядка. Накопленное время
// после каждой операции считается нарастающим итогом в компоненте — сумма по
// всему маршруту не может разойтись с суммой операций, потому что берётся из
// тех же чисел. Разряд рабочего показан отдельным значком у операции: по нему
// сразу видно, какие шаги требуют более квалифицированного исполнителя.
const STYLES = `
:where([data-vibeui-block="solutions-030"]){
--vibeui-solutions-030-bg:transparent;
--vibeui-solutions-030-panel:light-dark(oklch(0.977 0.004 255),oklch(0.27 0.011 265));
--vibeui-solutions-030-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-030-muted:light-dark(oklch(0.54 0.014 265),oklch(0.69 0.012 265));
--vibeui-solutions-030-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-solutions-030-accent:light-dark(oklch(0.52 0.16 255),oklch(0.74 0.14 255));
--vibeui-solutions-030-badge-fg:light-dark(oklch(1 0 0),oklch(0.19 0.014 265));
--vibeui-solutions-030-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-030-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-030"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-030-bg);
border:1px solid var(--vibeui-solutions-030-border);border-radius:1rem;
font-family:var(--vibeui-solutions-030-sans);color:var(--vibeui-solutions-030-fg);
}
[data-vibeui-block="solutions-030"] *{box-sizing:border-box}
[data-vibeui-block="solutions-030"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-030"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-030"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-030-muted)}
[data-vibeui-block="solutions-030"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-030"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-030-panel);border:1px solid var(--vibeui-solutions-030-border);
}
[data-vibeui-block="solutions-030"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-030"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-030-muted);
}
[data-vibeui-block="solutions-030"] [data-part="route"]{margin:0;padding:0 1rem 1.125rem;list-style:none}
/* Соединительная линия: маршрут читается как последовательность, не таблица. */
[data-vibeui-block="solutions-030"] [data-part="step"]{
position:relative;display:grid;grid-template-columns:2rem 1fr;gap:0 0.875rem;padding-bottom:1.125rem;
}
[data-vibeui-block="solutions-030"] [data-part="step"]:last-child{padding-bottom:0}
[data-vibeui-block="solutions-030"] [data-part="badge"]{
grid-row:1 / span 2;width:2rem;height:2rem;border-radius:9999px;
display:grid;place-items:center;background:var(--vibeui-solutions-030-accent);
color:var(--vibeui-solutions-030-badge-fg);
font-size:0.75rem;font-weight:700;font-variant-numeric:tabular-nums;position:relative;z-index:1;
}
[data-vibeui-block="solutions-030"] [data-part="step"]:not(:last-child)::before{
content:"";position:absolute;left:0.9375rem;top:2rem;bottom:0;width:2px;
background:var(--vibeui-solutions-030-border);
}
[data-vibeui-block="solutions-030"] [data-part="body"]{
padding:0.625rem 0.875rem;border-radius:0.75rem;border:1px solid var(--vibeui-solutions-030-border);
}
[data-vibeui-block="solutions-030"] [data-part="op-head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="solutions-030"] [data-part="op-name"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="solutions-030"] [data-part="cumulative"]{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-030-accent);
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="solutions-030"] [data-part="meta"]{
display:grid;grid-template-columns:1fr;gap:0.375rem 1rem;margin:0.5rem 0 0;padding:0;
}
[data-vibeui-block="solutions-030"] [data-part="meta"] div{display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="solutions-030"] [data-part="meta"] dt{
margin:0;font-size:0.5625rem;letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-solutions-030-muted);
}
[data-vibeui-block="solutions-030"] [data-part="meta"] dd{
margin:0;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-030"] [data-part="grade"]{
display:inline-flex;align-items:center;justify-content:center;width:1.25rem;height:1.25rem;
border-radius:0.3125rem;background:var(--vibeui-solutions-030-panel);
border:1px solid var(--vibeui-solutions-030-border);font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="solutions-030"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-030-muted);
}
@container (min-width: 40rem){
[data-vibeui-block="solutions-030"] [data-part="meta"]{grid-template-columns:repeat(3,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-030"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPERATIONS: Solutions030Operation[] = [
  {
    name: "Раскрой заготовки",
    equipment: "Гильотина Н3121",
    normMinutes: 6,
    grade: 2,
  },
  {
    name: "Токарная обработка",
    equipment: "Станок ДИП-500",
    normMinutes: 22,
    grade: 4,
  },
  {
    name: "Фрезерование паза",
    equipment: "Фрезерный 6Р13",
    normMinutes: 14,
    grade: 4,
  },
  {
    name: "Сверление отверстий",
    equipment: "Сверлильный 2Н135",
    normMinutes: 8,
    grade: 3,
  },
  {
    name: "Термообработка",
    equipment: "Печь ПН-32",
    normMinutes: 45,
    grade: 5,
  },
  {
    name: "Шлифование",
    equipment: "Круглошлифовальный 3М151",
    normMinutes: 18,
    grade: 5,
  },
  {
    name: "Контроль ОТК",
    equipment: "Стол контроля",
    normMinutes: 5,
    grade: 3,
  },
]

const SUMMARY_LABEL: Record<string, string> = {
  operations: "операций в маршруте",
  time: "суммарное нормо-время",
  grades: "разрядов задействовано",
}

const FIELD_LABEL: Record<string, string> = {
  equipment: "Оборудование",
  norm: "Норма времени",
  grade: "Разряд",
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Технологическая карта: маршрут операций лентой, накопленное время — как
 * нарастающий итог по норме времени каждой операции.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions030({
  title = "Технологическая карта",
  routeNumber = "ТК-0842 · вал приводной ВП-12",
  hint = "7 операций · маршрут утверждён технологом",
  operations = DEFAULT_OPERATIONS,
  summaryText = SUMMARY_LABEL,
  fieldText = FIELD_LABEL,
  minutesText = "{minutes} мин",
  cumulativeText = "нарастающим итогом: {minutes} мин",
  footNote = "Нарастающий итог справа от каждой операции — сумма норм времени всех предыдущих шагов маршрута, включая текущий.",
  accent,
  background = "",
  className,
  style,
}: Solutions030Props) {
  const totalMinutes = operations.reduce((sum, op) => sum + op.normMinutes, 0)
  const grades = new Set(operations.map((op) => op.grade))
  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]
  const field = (key: string) => fieldText[key] ?? FIELD_LABEL[key]
  const minutes = (value: number) =>
    minutesText.replace("{minutes}", String(value))

  const palette = {
    ...(accent ? { "--vibeui-solutions-030-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-030-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-030" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-030"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{routeNumber}</p>
          </div>
          <p data-part="hint">{hint}</p>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{operations.length}</b>
            <span>{summary("operations")}</span>
          </p>
          <p data-part="tile">
            <b>{minutes(totalMinutes)}</b>
            <span>{summary("time")}</span>
          </p>
          <p data-part="tile">
            <b>{grades.size}</b>
            <span>{summary("grades")}</span>
          </p>
        </div>

        <ol data-part="route">
          {operations.map((op, index) => {
            const cumulative = operations
              .slice(0, index + 1)
              .reduce((sum, item) => sum + item.normMinutes, 0)

            return (
              <li data-part="step" key={`${op.name}-${index}`}>
                <span data-part="badge" aria-hidden="true">
                  {index + 1}
                </span>
                <div data-part="body">
                  <div data-part="op-head">
                    <p data-part="op-name">{op.name}</p>
                    <span data-part="cumulative">
                      {cumulativeText.replace("{minutes}", String(cumulative))}
                    </span>
                  </div>
                  <dl data-part="meta">
                    <div>
                      <dt>{field("equipment")}</dt>
                      <dd>{op.equipment}</dd>
                    </div>
                    <div>
                      <dt>{field("norm")}</dt>
                      <dd>{minutes(op.normMinutes)}</dd>
                    </div>
                    <div>
                      <dt>{field("grade")}</dt>
                      <dd>
                        <span data-part="grade">{op.grade}</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </li>
            )
          })}
        </ol>

        <p data-part="foot">{footNote}</p>
      </section>
    </>
  )
}
