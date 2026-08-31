import type { CSSProperties } from "react"

export type Solutions024Segment = {
  name: string
  people: number
  openRate: number
  rule: string
}

export type Solutions024Subscriber = {
  email: string
  segment: string
  source: string
  joined: string
  confirmed?: boolean
}

export type Solutions024Props = {
  title?: string
  hint?: string
  baseSize?: number
  growth?: string
  segments?: Solutions024Segment[]
  subscribers?: Solutions024Subscriber[]
  overlapNote?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: база рассылки, разложенная по сегментам. Сегмент несёт правило,
// по которому в него попадают: «Активные читатели» без правила — это число,
// которому нельзя верить и которое нельзя воспроизвести. Доля от базы
// нарисована полосой, но подписана оговоркой: сегменты пересекаются, и сумма
// долей больше ста процентов — это нормально, а вот молчаливая нормализация
// врала бы. Неподтверждённая почта помечена отдельно: по ней нельзя слать, и
// в общем счётчике её видеть опасно.
const STYLES = `
:where([data-vibeui-block="solutions-024"]){
--vibeui-solutions-024-bg:oklch(1 0 0);
--vibeui-solutions-024-panel:oklch(0.975 0.004 160);
--vibeui-solutions-024-fg:oklch(0.21 0.014 170);
--vibeui-solutions-024-muted:oklch(0.53 0.013 170);
--vibeui-solutions-024-border:oklch(0.9 0.006 170);
--vibeui-solutions-024-accent:oklch(0.53 0.14 170);
--vibeui-solutions-024-pending:oklch(0.65 0.16 55);
--vibeui-solutions-024-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-024-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-024"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-024-bg);
border:1px solid var(--vibeui-solutions-024-border);border-radius:1rem;
font-family:var(--vibeui-solutions-024-sans);color:var(--vibeui-solutions-024-fg);
}
[data-vibeui-block="solutions-024"] *{box-sizing:border-box}
[data-vibeui-block="solutions-024"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="solutions-024"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-024"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-024-muted)}
[data-vibeui-block="solutions-024"] [data-part="base"]{
margin:0;text-align:right;font-size:1.5rem;font-weight:700;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;line-height:1.1;
}
[data-vibeui-block="solutions-024"] [data-part="growth"]{
display:block;font-size:0.6875rem;font-weight:600;color:var(--vibeui-solutions-024-accent);
}
[data-vibeui-block="solutions-024"] [data-part="segments"]{
list-style:none;margin:0.875rem 0 0;padding:0;display:grid;gap:0.5rem;
}
@container (min-width: 46rem){
[data-vibeui-block="solutions-024"] [data-part="segments"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="solutions-024"] [data-part="segments"] li{
padding:0.625rem 0.75rem;border-radius:0.875rem;
background:var(--vibeui-solutions-024-panel);
border:1px solid var(--vibeui-solutions-024-border);
}
[data-vibeui-block="solutions-024"] [data-part="srow"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="solutions-024"] [data-part="sname"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="solutions-024"] [data-part="people"]{
font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums;
}
/* Правило рядом с числом: сегмент без правила невозможно воспроизвести. */
[data-vibeui-block="solutions-024"] [data-part="rule"]{
display:block;margin-top:0.125rem;font-family:var(--vibeui-solutions-024-mono);
font-size:0.625rem;color:var(--vibeui-solutions-024-muted);
}
[data-vibeui-block="solutions-024"] [data-part="track"]{
height:0.3125rem;margin-top:0.4375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-solutions-024-fg) 9%,transparent);
}
[data-vibeui-block="solutions-024"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;background:var(--vibeui-solutions-024-accent);
}
[data-vibeui-block="solutions-024"] [data-part="open"]{
display:block;margin-top:0.3125rem;font-size:0.6875rem;color:var(--vibeui-solutions-024-muted);
font-variant-numeric:tabular-nums;
}
/* Пересечения названы словами: сумма долей больше 100% — это нормально. */
[data-vibeui-block="solutions-024"] [data-part="overlap"]{
margin:0.625rem 0 0;padding:0.5rem 0.625rem;border-radius:0.625rem;
background:var(--vibeui-solutions-024-panel);
font-size:0.6875rem;line-height:1.45;color:var(--vibeui-solutions-024-muted);
}
[data-vibeui-block="solutions-024"] h3{
margin:1rem 0 0.5rem;font-size:0.625rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-024-muted);
}
[data-vibeui-block="solutions-024"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-024"] th,
[data-vibeui-block="solutions-024"] td{
padding:0.4375rem 0.375rem;text-align:left;border-top:1px solid var(--vibeui-solutions-024-border);
}
[data-vibeui-block="solutions-024"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-024-muted);border-top:0;
}
[data-vibeui-block="solutions-024"] [data-part="email"]{
font-family:var(--vibeui-solutions-024-mono);font-size:0.75rem;
}
/* Неподтверждённая почта помечена: по ней нельзя слать. */
[data-vibeui-block="solutions-024"] [data-part="pending"]{
display:inline-block;margin-left:0.375rem;padding:0.0625rem 0.375rem;border-radius:0.375rem;
font-size:0.5625rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
color:oklch(1 0 0);background:var(--vibeui-solutions-024-pending);
}
[data-vibeui-block="solutions-024"] [data-part="tag"]{
padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-solutions-024-panel);font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="solutions-024"] [data-part="when"]{color:var(--vibeui-solutions-024-muted);white-space:nowrap}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-024"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SEGMENTS: Solutions024Segment[] = [
  {
    name: "Активные читатели",
    people: 8420,
    openRate: 54,
    rule: "открыл ≥3 писем за 60 дней",
  },
  {
    name: "Покупатели",
    people: 3110,
    openRate: 61,
    rule: "есть хотя бы один оплаченный заказ",
  },
  {
    name: "Спящие",
    people: 5240,
    openRate: 9,
    rule: "не открывал письма 90 дней",
  },
  {
    name: "Новые за месяц",
    people: 1180,
    openRate: 48,
    rule: "подписался ≤30 дней назад",
  },
]

const DEFAULT_SUBSCRIBERS: Solutions024Subscriber[] = [
  {
    email: "a.gavrilova@example.com",
    segment: "Новые за месяц",
    source: "форма в подвале",
    joined: "14 марта",
    confirmed: true,
  },
  {
    email: "tarasov.s@example.ru",
    segment: "Покупатели",
    source: "оформление заказа",
    joined: "13 марта",
    confirmed: true,
  },
  {
    email: "dina.sokolova@example.net",
    segment: "Новые за месяц",
    source: "вебинар «Складской учёт»",
    joined: "13 марта",
    confirmed: false,
  },
  {
    email: "i.panin@example.org",
    segment: "Активные читатели",
    source: "импорт из CRM",
    joined: "12 марта",
    confirmed: true,
  },
  {
    email: "m.luneva@example.com",
    segment: "Новые за месяц",
    source: "форма в подвале",
    joined: "11 марта",
    confirmed: false,
  },
]

/**
 * База рассылки по сегментам: у каждого сегмента правило, доли пересекаются.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions024({
  title = "Подписчики рассылки",
  hint = "Сегменты пересекаются: человек может попасть в несколько",
  baseSize = 16480,
  growth = "+1 180 за март",
  segments = DEFAULT_SEGMENTS,
  subscribers = DEFAULT_SUBSCRIBERS,
  overlapNote = "Сумма сегментов больше базы: покупатель одновременно может быть активным читателем. Для рассылки выбирайте сегменты с явным исключением, иначе один человек получит письмо дважды.",
  accent,
  className,
  style,
}: Solutions024Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-024-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-024" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-024"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
          <p data-part="base">
            {baseSize.toLocaleString("ru-RU")}
            <span data-part="growth">{growth}</span>
          </p>
        </header>

        <ul data-part="segments">
          {segments.map((segment) => (
            <li key={segment.name}>
              <p data-part="srow">
                <span data-part="sname">
                  {segment.name}
                  <span data-part="rule">{segment.rule}</span>
                </span>
                <span data-part="people">
                  {segment.people.toLocaleString("ru-RU")}
                </span>
              </p>
              <div
                data-part="track"
                role="progressbar"
                aria-valuenow={segment.people}
                aria-valuemin={0}
                aria-valuemax={baseSize}
                aria-label={`Доля сегмента «${segment.name}» от базы`}
              >
                <span
                  data-part="fill"
                  style={{
                    width: `${Math.round((segment.people / baseSize) * 100)}%`,
                  }}
                />
              </div>
              <span data-part="open">
                {Math.round((segment.people / baseSize) * 100)}% базы ·
                открываемость {segment.openRate}%
              </span>
            </li>
          ))}
        </ul>

        <p data-part="overlap">{overlapNote}</p>

        <h3>Последние подписки</h3>
        <table>
          <thead>
            <tr>
              <th scope="col">Почта</th>
              <th scope="col">Сегмент</th>
              <th scope="col">Источник</th>
              <th scope="col">Дата</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.email}>
                <td>
                  <span data-part="email">{subscriber.email}</span>
                  {subscriber.confirmed === false ? (
                    <span data-part="pending">не подтверждён</span>
                  ) : null}
                </td>
                <td>
                  <span data-part="tag">{subscriber.segment}</span>
                </td>
                <td>{subscriber.source}</td>
                <td data-part="when">{subscriber.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
