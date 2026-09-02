import type { CSSProperties } from "react"

export type Solutions013Doc = {
  code: string
  partner: string
  gate: string
  done: number
  total: number
  time: string
  note?: string
}

export type Solutions013Props = {
  title?: string
  day?: string
  inboundTitle?: string
  outboundTitle?: string
  inbound?: Solutions013Doc[]
  outbound?: Solutions013Doc[]
  /** Счётчик в шапке, {count} — сколько документов в работе. */
  docsCountText?: string
  /** Счётчик потока, {count} — сколько документов в колонке. */
  flowCountText?: string
  /** Готовность строкой, {done} и {total} — позиции. */
  ratioText?: string
  /** Подпись полосы для скринридера, {code} — номер документа. */
  progressLabelText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: смена на складе — приёмка и отгрузка рядом. Два потока стоят в
// двух колонках, а не в одном списке с фильтром: кладовщик смотрит на них
// одновременно, а фильтр прячет половину работы. Готовность документа —
// дробь «собрано из позиций» и полоса: процент без знаменателя не говорит,
// сколько ещё коробок. Ворота подписаны у каждой строки, потому что задача
// склада — не «какой документ», а «куда идти».
const STYLES = `
:where([data-vibeui-block="solutions-013"]){
--vibeui-solutions-013-bg:transparent;
--vibeui-solutions-013-panel:light-dark(oklch(0.975 0.004 235),oklch(0.26 0.012 250));
--vibeui-solutions-013-chip:light-dark(oklch(1 0 0),oklch(0.21 0.012 250));
--vibeui-solutions-013-fg:light-dark(oklch(0.21 0.014 250),oklch(0.94 0.005 250));
--vibeui-solutions-013-muted:light-dark(oklch(0.54 0.014 250),oklch(0.7 0.012 250));
--vibeui-solutions-013-border:light-dark(oklch(0.9 0.006 250),oklch(0.36 0.012 250));
--vibeui-solutions-013-in:light-dark(oklch(0.55 0.15 200),oklch(0.74 0.13 200));
--vibeui-solutions-013-out:light-dark(oklch(0.6 0.16 60),oklch(0.78 0.14 60));
--vibeui-solutions-013-on-flow:light-dark(oklch(1 0 0),oklch(0.2 0.012 250));
--vibeui-solutions-013-accent:light-dark(oklch(0.5 0.17 265),oklch(0.72 0.16 265));
--vibeui-solutions-013-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-013-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-013"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-013-bg);
border:1px solid var(--vibeui-solutions-013-border);border-radius:1rem;
font-family:var(--vibeui-solutions-013-sans);color:var(--vibeui-solutions-013-fg);
}
[data-vibeui-block="solutions-013"] *{box-sizing:border-box}
[data-vibeui-block="solutions-013"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;margin-bottom:0.875rem;
}
[data-vibeui-block="solutions-013"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-013"] [data-part="day"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-013-muted)}
/* Два потока рядом: фильтр «приёмка/отгрузка» прячет половину смены. */
[data-vibeui-block="solutions-013"] [data-part="shell"]{display:grid;gap:0.875rem}
@container (min-width: 44rem){
[data-vibeui-block="solutions-013"] [data-part="shell"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
}
[data-vibeui-block="solutions-013"] h3{
display:flex;align-items:center;gap:0.5rem;margin:0 0 0.5rem;
font-size:0.75rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
}
[data-vibeui-block="solutions-013"] [data-part="arrow"]{
width:1.25rem;height:1.25rem;border-radius:0.375rem;display:grid;place-items:center;
font-size:0.75rem;line-height:1;color:var(--vibeui-solutions-013-on-flow);background:var(--vibeui-solutions-013-in);
}
[data-vibeui-block="solutions-013"] [data-flow="out"] [data-part="arrow"]{background:var(--vibeui-solutions-013-out)}
[data-vibeui-block="solutions-013"] [data-part="count"]{
margin-left:auto;font-size:0.6875rem;font-weight:600;color:var(--vibeui-solutions-013-muted);
}
[data-vibeui-block="solutions-013"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="solutions-013"] li{
padding:0.625rem 0.75rem;border-radius:0.875rem;
background:var(--vibeui-solutions-013-panel);
border:1px solid var(--vibeui-solutions-013-border);
border-left:3px solid var(--vibeui-solutions-013-in);
}
[data-vibeui-block="solutions-013"] [data-flow="out"] li{border-left-color:var(--vibeui-solutions-013-out)}
[data-vibeui-block="solutions-013"] [data-part="top"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="solutions-013"] [data-part="code"]{
font-family:var(--vibeui-solutions-013-mono);font-size:0.6875rem;color:var(--vibeui-solutions-013-muted);
}
[data-vibeui-block="solutions-013"] [data-part="time"]{
font-size:0.6875rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-013"] [data-part="partner"]{
display:block;margin-top:0.125rem;font-size:0.875rem;font-weight:650;line-height:1.3;
}
/* Ворота у каждой строки: задача склада — «куда идти», а не «какой документ». */
[data-vibeui-block="solutions-013"] [data-part="gate"]{
display:inline-block;margin-top:0.25rem;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-solutions-013-chip);border:1px solid var(--vibeui-solutions-013-border);
font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="solutions-013"] [data-part="note"]{
display:block;margin-top:0.25rem;font-size:0.6875rem;color:var(--vibeui-solutions-013-muted);
}
[data-vibeui-block="solutions-013"] [data-part="progress"]{
display:flex;align-items:center;gap:0.5rem;margin-top:0.4375rem;
}
[data-vibeui-block="solutions-013"] [data-part="track"]{
flex:1;height:0.375rem;border-radius:9999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-solutions-013-fg) 10%,transparent);
}
[data-vibeui-block="solutions-013"] [data-part="fill"]{display:block;height:100%;background:var(--vibeui-solutions-013-in)}
[data-vibeui-block="solutions-013"] [data-flow="out"] [data-part="fill"]{background:var(--vibeui-solutions-013-out)}
/* Дробь, а не процент: «82%» не говорит, сколько коробок ещё осталось. */
[data-vibeui-block="solutions-013"] [data-part="ratio"]{
font-size:0.6875rem;font-weight:650;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="solutions-013"] [data-done="true"] [data-part="ratio"]{color:var(--vibeui-solutions-013-in)}
[data-vibeui-block="solutions-013"] [data-flow="out"] [data-done="true"] [data-part="ratio"]{color:var(--vibeui-solutions-013-out)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_INBOUND: Solutions013Doc[] = [
  {
    code: "ПР-4471",
    partner: "Мебельная фабрика «Дуб»",
    gate: "Ворота 2",
    done: 18,
    total: 24,
    time: "09:40",
    note: "две паллеты с браком на пересчёт",
  },
  {
    code: "ПР-4472",
    partner: "Свет-Импорт",
    gate: "Ворота 1",
    done: 40,
    total: 40,
    time: "11:15",
  },
  {
    code: "ПР-4475",
    partner: "Текстиль-Юг",
    gate: "Ворота 3",
    done: 0,
    total: 62,
    time: "14:00",
    note: "машина в пути",
  },
]

const DEFAULT_OUTBOUND: Solutions013Doc[] = [
  {
    code: "ОТ-9910",
    partner: "Кофейня «Мера»",
    gate: "Рампа B",
    done: 12,
    total: 12,
    time: "10:05",
  },
  {
    code: "ОТ-9913",
    partner: "Логистика «Верста»",
    gate: "Рампа A",
    done: 31,
    total: 48,
    time: "12:30",
    note: "ждём подтверждение по трём позициям",
  },
  {
    code: "ОТ-9915",
    partner: "Ателье «Нить»",
    gate: "Рампа B",
    done: 4,
    total: 9,
    time: "16:20",
  },
]

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
 * Смена склада: приёмка и отгрузка двумя потоками, готовность — дробью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions013({
  title = "Смена на складе",
  day = "Четверг, 14 марта · склад А",
  inboundTitle = "Приёмка",
  outboundTitle = "Отгрузка",
  inbound = DEFAULT_INBOUND,
  outbound = DEFAULT_OUTBOUND,
  docsCountText = "Документов в работе: {count}",
  flowCountText = "{count} документа",
  ratioText = "{done} из {total} поз.",
  progressLabelText = "{code}: обработано позиций",
  accent,
  background = "",
  className,
  style,
}: Solutions013Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const flows = [
    { key: "in" as const, title: inboundTitle, docs: inbound, sign: "↓" },
    { key: "out" as const, title: outboundTitle, docs: outbound, sign: "↑" },
  ]

  return (
    <>
      <style href="vibeui-solutions-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-013"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="day">{day}</p>
          </div>
          <p data-part="day">
            {docsCountText.replace(
              "{count}",
              String(inbound.length + outbound.length),
            )}
          </p>
        </header>

        <div data-part="shell">
          {flows.map((flow) => (
            <section key={flow.key} data-flow={flow.key}>
              <h3>
                <span data-part="arrow" aria-hidden="true">
                  {flow.sign}
                </span>
                {flow.title}
                <span data-part="count">
                  {flowCountText.replace("{count}", String(flow.docs.length))}
                </span>
              </h3>

              <ul>
                {flow.docs.map((doc) => {
                  const share = Math.round((doc.done / doc.total) * 100)

                  return (
                    <li
                      key={doc.code}
                      data-done={doc.done === doc.total ? "true" : "false"}
                    >
                      <p data-part="top">
                        <span data-part="code">{doc.code}</span>
                        <span data-part="time">{doc.time}</span>
                      </p>
                      <span data-part="partner">{doc.partner}</span>
                      <span data-part="gate">{doc.gate}</span>
                      {doc.note ? (
                        <span data-part="note">{doc.note}</span>
                      ) : null}

                      <p data-part="progress">
                        <span
                          data-part="track"
                          role="progressbar"
                          aria-valuenow={doc.done}
                          aria-valuemin={0}
                          aria-valuemax={doc.total}
                          aria-label={progressLabelText.replace(
                            "{code}",
                            doc.code,
                          )}
                        >
                          <span
                            data-part="fill"
                            style={{ width: `${share}%` }}
                          />
                        </span>
                        <span data-part="ratio">
                          {ratioText
                            .replace("{done}", String(doc.done))
                            .replace("{total}", String(doc.total))}
                        </span>
                      </p>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}
