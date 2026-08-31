import type { CSSProperties } from "react"

export type Dashboard078Issue = {
  id: string
  title: string
  frame: string
  events: number
  users: number
  spark: number[]
  status: "new" | "triaged" | "muted" | "fixed"
  since: string
  release: string
}

export type Dashboard078Props = {
  title?: string
  period?: string
  issues?: Dashboard078Issue[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: список ошибок сортируют не по числу событий, а по числу людей,
// которых зацепило: одна ошибка в цикле даёт десять тысяч событий и одного
// пострадавшего. Поэтому в строке стоят обе цифры, и «людей» набрано крупнее.
// Спарклайн частоты собран из span-столбиков без SVG: он отвечает на вопрос
// «это росло или всегда так было», а точная форма тут не важна. Первая строка
// стека набрана моноширинным и обрезается по ширине — по ней ошибку узнают
// в лицо. Версия, в которой ошибка появилась, стоит рядом со статусом: это
// первое, что спрашивают на разборе.
const STYLES = `
:where([data-vibeui-block="dashboard-078"]){
--vibeui-dashboard-078-bg:oklch(0.985 0.003 30);
--vibeui-dashboard-078-card:oklch(1 0 0);
--vibeui-dashboard-078-fg:oklch(0.21 0.014 30);
--vibeui-dashboard-078-muted:oklch(0.54 0.014 30);
--vibeui-dashboard-078-border:oklch(0.91 0.006 30);
--vibeui-dashboard-078-accent:oklch(0.55 0.18 28);
--vibeui-dashboard-078-soft:oklch(0.965 0.02 30);
--vibeui-dashboard-078-new:oklch(0.57 0.19 25);
--vibeui-dashboard-078-fixed:oklch(0.58 0.13 155);
--vibeui-dashboard-078-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-078-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-078"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-078-bg);
color:var(--vibeui-dashboard-078-fg);
font-family:var(--vibeui-dashboard-078-sans);
border:1px solid var(--vibeui-dashboard-078-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-078"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-078"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-078"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-078"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-078"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-078-muted)}
[data-vibeui-block="dashboard-078"] [data-part="list"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="dashboard-078"] [data-part="issue"]{
display:grid;grid-template-columns:1fr;gap:0.375rem 0.875rem;align-items:center;
padding:0.6875rem 0.8125rem;border-radius:0.8125rem;
background:var(--vibeui-dashboard-078-card);border:1px solid var(--vibeui-dashboard-078-border);
}
[data-vibeui-block="dashboard-078"] [data-status="new"]{
border-left:0.1875rem solid var(--vibeui-dashboard-078-new);
}
[data-vibeui-block="dashboard-078"] [data-status="muted"]{opacity:0.62}
[data-vibeui-block="dashboard-078"] [data-part="what"]{min-width:0}
[data-vibeui-block="dashboard-078"] [data-part="what"] b{display:block;font-size:0.8125rem;font-weight:750;line-height:1.35}
[data-vibeui-block="dashboard-078"] [data-part="frame"]{
display:block;font-family:var(--vibeui-dashboard-078-mono);font-size:0.6875rem;
color:var(--vibeui-dashboard-078-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
margin-top:0.125rem;
}
[data-vibeui-block="dashboard-078"] [data-part="meta"]{
margin:0.1875rem 0 0;display:flex;flex-wrap:wrap;gap:0.25rem 0.625rem;font-size:0.625rem;
color:var(--vibeui-dashboard-078-muted);
}
[data-vibeui-block="dashboard-078"] [data-part="status"]{
font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;background:var(--vibeui-dashboard-078-soft);
}
[data-vibeui-block="dashboard-078"] [data-status="new"] [data-part="status"]{
color:var(--vibeui-dashboard-078-new);background:color-mix(in oklab,var(--vibeui-dashboard-078-new) 12%,white);
}
[data-vibeui-block="dashboard-078"] [data-status="fixed"] [data-part="status"]{
color:var(--vibeui-dashboard-078-fixed);background:color-mix(in oklab,var(--vibeui-dashboard-078-fixed) 12%,white);
}
/* Спарклайн из столбиков: важна форма тренда, а не точные значения. */
[data-vibeui-block="dashboard-078"] [data-part="spark"]{
display:flex;align-items:flex-end;gap:0.0625rem;height:1.75rem;min-width:5rem;
}
[data-vibeui-block="dashboard-078"] [data-part="spark"] span{
flex:1 1 0;border-radius:0.0625rem;background:color-mix(in oklab,var(--vibeui-dashboard-078-accent) 45%,white);
}
[data-vibeui-block="dashboard-078"] [data-part="spark"] span:last-child{background:var(--vibeui-dashboard-078-accent)}
[data-vibeui-block="dashboard-078"] [data-part="nums"]{
display:flex;gap:0.875rem;align-items:baseline;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="dashboard-078"] [data-part="users"]{display:flex;flex-direction:column}
[data-vibeui-block="dashboard-078"] [data-part="users"] b{font-size:1.0625rem;font-weight:750;letter-spacing:-0.02em}
[data-vibeui-block="dashboard-078"] [data-part="users"] span{font-size:0.625rem;color:var(--vibeui-dashboard-078-muted)}
[data-vibeui-block="dashboard-078"] [data-part="events"]{display:flex;flex-direction:column}
[data-vibeui-block="dashboard-078"] [data-part="events"] b{font-size:0.8125rem;font-weight:700;color:var(--vibeui-dashboard-078-muted)}
[data-vibeui-block="dashboard-078"] [data-part="events"] span{font-size:0.625rem;color:var(--vibeui-dashboard-078-muted)}
[data-vibeui-block="dashboard-078"] [data-part="acts"]{display:flex;gap:0.3125rem;flex-wrap:wrap}
[data-vibeui-block="dashboard-078"] [data-part="acts"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:700;
padding:0.3125rem 0.625rem;border-radius:0.4375rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-078-border);white-space:nowrap;
}
[data-vibeui-block="dashboard-078"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-078-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="dashboard-078"] [data-part="issue"]{grid-template-columns:minmax(0,1fr) 7rem 9rem auto}
}
`

const DEFAULT_ISSUES: Dashboard078Issue[] = [
  {
    id: "e-9041",
    title: "TypeError: cannot read properties of undefined (reading «rows»)",
    frame: "app/components/[slug]/grid.tsx:184 → renderRows",
    events: 24810,
    users: 412,
    spark: [3, 4, 6, 5, 9, 14, 22, 31, 44, 61],
    status: "new",
    since: "появилась в 4.12.0",
    release: "бета, 12 % выката",
  },
  {
    id: "e-8874",
    title: "TimeoutError: отчёт не собрался за 30 секунд",
    frame: "server/reports/build.ts:66 → collect",
    events: 1840,
    users: 96,
    spark: [22, 19, 24, 21, 18, 20, 17, 16, 14, 13],
    status: "triaged",
    since: "с 4.10.2",
    release: "стабильный",
  },
  {
    id: "e-8712",
    title: "AbortError: пользователь ушёл со страницы во время загрузки",
    frame: "app/hooks/use-stream.ts:41 → fetchChunk",
    events: 9120,
    users: 1204,
    spark: [12, 13, 11, 14, 12, 13, 12, 14, 13, 12],
    status: "muted",
    since: "с 4.6.0",
    release: "заглушена: это не ошибка приложения",
  },
  {
    id: "e-8690",
    title: "RangeError: недопустимая дата при импорте CSV",
    frame: "server/import/parse-date.ts:28 → toISO",
    events: 640,
    users: 58,
    spark: [18, 16, 12, 9, 6, 4, 2, 1, 0, 0],
    status: "fixed",
    since: "исправлена в 4.11.2",
    release: "стабильный",
  },
]

const STATUS_LABELS: Record<Dashboard078Issue["status"], string> = {
  new: "новая",
  triaged: "в работе",
  muted: "заглушена",
  fixed: "исправлена",
}

/**
 * Экран обработки ошибок приложения: число затронутых людей крупнее числа
 * событий, спарклайн частоты из столбиков без SVG, первая строка стека
 * моноширинным. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard078({
  title = "Ошибки приложения",
  period = "за последние 24 часа, группировка по месту падения",
  issues = DEFAULT_ISSUES,
  accent,
  className,
  style,
}: Dashboard078Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-078-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-078" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-078"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="period">{period}</p>
          </div>

          <ul data-part="list">
            {issues.map((issue) => {
              const peak = Math.max(1, ...issue.spark)

              return (
                <li key={issue.id} data-part="issue" data-status={issue.status}>
                  <div data-part="what">
                    <b>{issue.title}</b>
                    <code data-part="frame">{issue.frame}</code>
                    <p data-part="meta">
                      <span data-part="status">
                        {STATUS_LABELS[issue.status]}
                      </span>
                      <span>{issue.since}</span>
                      <span>{issue.release}</span>
                    </p>
                  </div>

                  <div
                    data-part="spark"
                    role="img"
                    aria-label="Частота за последние часы"
                  >
                    {issue.spark.map((value, index) => (
                      <span
                        key={`${issue.id}-${index}`}
                        style={{
                          height: `${Math.max(6, (value / peak) * 100)}%`,
                        }}
                      />
                    ))}
                  </div>

                  <div data-part="nums">
                    <span data-part="users">
                      <b>{issue.users.toLocaleString("ru-RU")}</b>
                      <span>человек задело</span>
                    </span>
                    <span data-part="events">
                      <b>{issue.events.toLocaleString("ru-RU")}</b>
                      <span>событий</span>
                    </span>
                  </div>

                  <div data-part="acts">
                    <button type="button">Взять</button>
                    <button type="button">Заглушить</button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
