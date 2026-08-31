import type { CSSProperties } from "react"

export type Dashboard080Span = {
  name: string
  service: string
  depth: number
  start: number
  duration: number
  kind: "http" | "db" | "cache" | "queue" | "code"
  error?: string
}

export type Dashboard080Props = {
  title?: string
  traceId?: string
  total?: number
  spans?: Dashboard080Span[]
  summary?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: трассировка отвечает на вопрос «куда ушло время», и ответ даёт
// не список, а водопад: каждый спан стоит на общей временной шкале, его
// смещение — начало, ширина — длительность. Вложенность показана отступом
// имени, а не линиями: линии съедают ширину, которая нужна самим полосам.
// Доля от общего времени подписана процентом рядом с миллисекундами — «412 мс»
// в запросе на 3 секунды и в запросе на 500 мс значат разное. Вид спана
// подписан меткой (запрос, база, кэш): по нему решают, к кому идти. Спан с
// ошибкой несёт штриховку и текст ошибки — искать её в другой вкладке незачем.
const STYLES = `
:where([data-vibeui-block="dashboard-080"]){
--vibeui-dashboard-080-bg:oklch(0.985 0.003 290);
--vibeui-dashboard-080-card:oklch(1 0 0);
--vibeui-dashboard-080-fg:oklch(0.21 0.014 290);
--vibeui-dashboard-080-muted:oklch(0.54 0.014 290);
--vibeui-dashboard-080-border:oklch(0.91 0.006 290);
--vibeui-dashboard-080-accent:oklch(0.52 0.16 290);
--vibeui-dashboard-080-soft:oklch(0.965 0.02 290);
--vibeui-dashboard-080-db:oklch(0.55 0.14 225);
--vibeui-dashboard-080-cache:oklch(0.6 0.13 165);
--vibeui-dashboard-080-queue:oklch(0.66 0.13 85);
--vibeui-dashboard-080-error:oklch(0.57 0.19 25);
--vibeui-dashboard-080-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-080-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-080"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-080-bg);
color:var(--vibeui-dashboard-080-fg);
font-family:var(--vibeui-dashboard-080-sans);
border:1px solid var(--vibeui-dashboard-080-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-080"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-080"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-080"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-080"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-080"] [data-part="id"]{
margin:0;font-family:var(--vibeui-dashboard-080-mono);font-size:0.6875rem;
color:var(--vibeui-dashboard-080-muted);overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-080"] [data-part="total"]{
margin-left:auto;font-size:0.8125rem;font-weight:750;font-variant-numeric:tabular-nums;
padding:0.25rem 0.5625rem;border-radius:0.5rem;background:var(--vibeui-dashboard-080-soft);
}
[data-vibeui-block="dashboard-080"] [data-part="scroll"]{
overflow-x:auto;padding:0.75rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-080-card);border:1px solid var(--vibeui-dashboard-080-border);
}
[data-vibeui-block="dashboard-080"] [data-part="rows"]{list-style:none;margin:0;padding:0;min-width:34rem;display:flex;flex-direction:column;gap:0.1875rem}
[data-vibeui-block="dashboard-080"] [data-part="row"]{
display:grid;grid-template-columns:minmax(11rem,1.1fr) minmax(0,2fr) 6.5rem;gap:0.625rem;align-items:center;
padding:0.1875rem 0;
}
[data-vibeui-block="dashboard-080"] [data-part="name"]{min-width:0}
[data-vibeui-block="dashboard-080"] [data-part="name"] b{
display:block;font-size:0.75rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="dashboard-080"] [data-part="name"] span{
display:block;font-size:0.625rem;color:var(--vibeui-dashboard-080-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="dashboard-080"] [data-part="lane"]{
position:relative;height:1rem;border-radius:0.25rem;
background:var(--vibeui-dashboard-080-bg);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-080-border);
}
[data-vibeui-block="dashboard-080"] [data-part="bar"]{
position:absolute;top:0.1875rem;bottom:0.1875rem;border-radius:0.1875rem;
background:var(--vibeui-dashboard-080-accent);min-width:0.125rem;
}
[data-vibeui-block="dashboard-080"] [data-kind="db"] [data-part="bar"]{background:var(--vibeui-dashboard-080-db)}
[data-vibeui-block="dashboard-080"] [data-kind="cache"] [data-part="bar"]{background:var(--vibeui-dashboard-080-cache)}
[data-vibeui-block="dashboard-080"] [data-kind="queue"] [data-part="bar"]{background:var(--vibeui-dashboard-080-queue)}
[data-vibeui-block="dashboard-080"] [data-error="true"] [data-part="bar"]{
background:repeating-linear-gradient(135deg,var(--vibeui-dashboard-080-error) 0 0.25rem,color-mix(in oklab,var(--vibeui-dashboard-080-error) 70%,black) 0.25rem 0.5rem);
}
[data-vibeui-block="dashboard-080"] [data-part="ms"]{
font-size:0.6875rem;font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap;
}
[data-vibeui-block="dashboard-080"] [data-part="ms"] b{font-weight:750}
[data-vibeui-block="dashboard-080"] [data-part="ms"] span{display:block;font-size:0.5625rem;color:var(--vibeui-dashboard-080-muted)}
[data-vibeui-block="dashboard-080"] [data-part="kind"]{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0 0.25rem;border-radius:0.1875rem;background:var(--vibeui-dashboard-080-soft);
color:var(--vibeui-dashboard-080-muted);margin-right:0.3125rem;
}
[data-vibeui-block="dashboard-080"] [data-part="err"]{
grid-column:1 / -1;margin:0;font-size:0.625rem;font-weight:700;color:var(--vibeui-dashboard-080-error);
}
[data-vibeui-block="dashboard-080"] [data-part="ruler"]{
display:flex;justify-content:space-between;min-width:34rem;font-size:0.5625rem;
color:var(--vibeui-dashboard-080-muted);font-variant-numeric:tabular-nums;
border-top:1px solid var(--vibeui-dashboard-080-border);margin-top:0.375rem;padding-top:0.25rem;
}
[data-vibeui-block="dashboard-080"] [data-part="summary"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-080-muted);max-width:68ch}
`

const DEFAULT_SPANS: Dashboard080Span[] = [
  {
    name: "GET /api/reports/revenue",
    service: "web",
    depth: 0,
    start: 0,
    duration: 1840,
    kind: "http",
  },
  {
    name: "auth.verify_token",
    service: "web",
    depth: 1,
    start: 4,
    duration: 12,
    kind: "cache",
  },
  {
    name: "reports.build",
    service: "reports",
    depth: 1,
    start: 20,
    duration: 1790,
    kind: "code",
  },
  {
    name: "SELECT deals JOIN customers",
    service: "postgres",
    depth: 2,
    start: 32,
    duration: 940,
    kind: "db",
  },
  {
    name: "SELECT payments WHERE period",
    service: "postgres",
    depth: 2,
    start: 980,
    duration: 610,
    kind: "db",
  },
  {
    name: "currency.rates",
    service: "external",
    depth: 2,
    start: 1600,
    duration: 180,
    kind: "http",
    error: "тайм-аут 180 мс, взят вчерашний курс из кэша",
  },
  {
    name: "report.render_xlsx",
    service: "reports",
    depth: 2,
    start: 1790,
    duration: 40,
    kind: "code",
  },
]

const KIND_LABELS: Record<Dashboard080Span["kind"], string> = {
  http: "запрос",
  db: "база",
  cache: "кэш",
  queue: "очередь",
  code: "код",
}

/**
 * Экран трассировки запроса: спаны на общей временной шкале, вложенность
 * отступом имени, доля от общего времени процентом, спан с ошибкой помечен
 * штриховкой. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard080({
  title = "Трассировка запроса",
  traceId = "trace 8f31c0a4-2e7b-4d19-9a55-c0d81e4f7b22 · 14 июня, 11:42:07",
  total = 1840,
  spans = DEFAULT_SPANS,
  summary = "Две трети времени ушло в базу: запрос по сделкам не использует индекс по периоду. Внешний курс валют отвалился по тайм-ауту, но отчёт собрался на вчерашних данных — в отчёте это не помечено.",
  accent,
  className,
  style,
}: Dashboard080Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-080-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-080" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-080"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="id">{traceId}</p>
            <p data-part="total">{total} мс всего</p>
          </div>

          <div data-part="scroll">
            <ul data-part="rows">
              {spans.map((span) => (
                <li
                  key={`${span.name}-${span.start}`}
                  data-part="row"
                  data-kind={span.kind}
                  data-error={Boolean(span.error)}
                >
                  <div
                    data-part="name"
                    style={{ paddingLeft: `${span.depth * 0.875}rem` }}
                  >
                    <b>{span.name}</b>
                    <span>
                      <span data-part="kind">{KIND_LABELS[span.kind]}</span>
                      {span.service}
                    </span>
                  </div>

                  <div
                    data-part="lane"
                    role="img"
                    aria-label={`${span.name}: начало ${span.start} мс, длительность ${span.duration} мс`}
                  >
                    <span
                      data-part="bar"
                      style={{
                        left: `${(span.start / total) * 100}%`,
                        width: `${(span.duration / total) * 100}%`,
                      }}
                    />
                  </div>

                  <p data-part="ms">
                    <b>{span.duration} мс</b>
                    <span>
                      {Math.round((span.duration / total) * 100)} % запроса
                    </span>
                  </p>

                  {span.error ? <p data-part="err">{span.error}</p> : null}
                </li>
              ))}
            </ul>

            <div data-part="ruler">
              <span>0 мс</span>
              <span>{Math.round(total / 4)}</span>
              <span>{Math.round(total / 2)}</span>
              <span>{Math.round((total * 3) / 4)}</span>
              <span>{total} мс</span>
            </div>
          </div>

          <p data-part="summary">{summary}</p>
        </div>
      </section>
    </>
  )
}
