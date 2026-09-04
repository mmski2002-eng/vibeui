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
  /** Подпись полосы сегмента, {name} — его название. */
  shareLabelText?: string
  /** Строка под полосой: {share} и {open} — проценты. */
  openText?: string
  /** Заголовок таблицы подписок. */
  recentTitle?: string
  /** Шапка таблицы: ключи email, segment, source, joined. */
  columnText?: Record<string, string>
  /** Пометка неподтверждённого адреса. */
  pendingLabel?: string
  /** Локаль для разрядов в числах. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-solutions-024-bg:transparent;
--vibeui-solutions-024-panel:light-dark(oklch(0.975 0.004 160),oklch(0.27 0.012 170));
--vibeui-solutions-024-fg:light-dark(oklch(0.21 0.014 170),oklch(0.94 0.005 170));
--vibeui-solutions-024-muted:light-dark(oklch(0.53 0.013 170),oklch(0.7 0.012 170));
--vibeui-solutions-024-border:light-dark(oklch(0.9 0.006 170),oklch(0.36 0.012 170));
--vibeui-solutions-024-accent:light-dark(oklch(0.53 0.14 170),oklch(0.74 0.13 170));
--vibeui-solutions-024-pending:light-dark(oklch(0.65 0.16 55),oklch(0.62 0.15 55));
--vibeui-solutions-024-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-024-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-024"]{color-scheme:dark}
[data-vibeui-block="solutions-024"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
/* Колонка «when» не переносится (white-space:nowrap) — на узком экране
   таблица должна прокручиваться сама, а не раздвигать страницу. */
[data-vibeui-block="solutions-024"] [data-part="scroll"]{max-inline-size:100%;overflow-x:auto}
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

const DEFAULT_COLUMN_TEXT: Record<string, string> = {
  email: "Почта",
  segment: "Сегмент",
  source: "Источник",
  joined: "Дата",
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
  shareLabelText = "Доля сегмента «{name}» от базы",
  openText = "{share}% базы · открываемость {open}%",
  recentTitle = "Последние подписки",
  columnText = DEFAULT_COLUMN_TEXT,
  pendingLabel = "не подтверждён",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions024Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-024-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
            {baseSize.toLocaleString(locale)}
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
                  {segment.people.toLocaleString(locale)}
                </span>
              </p>
              <div
                data-part="track"
                role="progressbar"
                aria-valuenow={segment.people}
                aria-valuemin={0}
                aria-valuemax={baseSize}
                aria-label={shareLabelText.replace("{name}", segment.name)}
              >
                <span
                  data-part="fill"
                  style={{
                    width: `${Math.round((segment.people / baseSize) * 100)}%`,
                  }}
                />
              </div>
              <span data-part="open">
                {openText
                  .replace(
                    "{share}",
                    String(Math.round((segment.people / baseSize) * 100)),
                  )
                  .replace("{open}", String(segment.openRate))}
              </span>
            </li>
          ))}
        </ul>

        <p data-part="overlap">{overlapNote}</p>

        <h3>{recentTitle}</h3>
        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                {["email", "segment", "source", "joined"].map((column) => (
                  <th scope="col" key={column}>
                    {columnText[column] ?? DEFAULT_COLUMN_TEXT[column]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.email}>
                  <td>
                    <span data-part="email">{subscriber.email}</span>
                    {subscriber.confirmed === false ? (
                      <span data-part="pending">{pendingLabel}</span>
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
        </div>
      </section>
    </>
  )
}
