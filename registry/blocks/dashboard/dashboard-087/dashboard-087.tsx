import type { CSSProperties } from "react"

export type Dashboard087Report = {
  name: string
  scope: string
  schedule: string
  nextRun: string
  lastRun: string
  lastSize: string
  format: string
  recipients: string[]
  state: "on" | "off" | "failed"
  failure?: string
}

export type Dashboard087Props = {
  title?: string
  subtitle?: string
  reports?: Dashboard087Report[]
  newLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись под временем следующего запуска. */
  nextLabel?: string
  /** Подпись кнопки ручного запуска. */
  runLabel?: string
  /** Подписи кнопки переключения: выключенный отчёт включают. */
  enableLabel?: string
  disableLabel?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: расписание выгрузки нужно читать словами — «каждый понедельник в
// 09:00», а не расшифровывать «0 9 * * 1». Поэтому cron-строка тут не
// показывается вовсе, а рядом стоит абсолютное время следующего запуска: оно
// снимает вопрос про часовой пояс. Получатели перечислены поимённо, потому что
// главная беда таких отчётов — рассылка человеку, который уволился полгода
// назад. Последняя выгрузка подписана размером и временем: пустой файл на 2 КБ
// виден по одной этой цифре. Упавшая выгрузка помечается и несёт причину прямо
// в строке — иначе о ней узнают через месяц, когда придут за цифрами.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-087"]){
--vibeui-dashboard-087-bg:transparent;
/* Строка отчёта и чип получателя: подложка самого блока прозрачна. */
--vibeui-dashboard-087-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 130));
--vibeui-dashboard-087-inset:light-dark(oklch(0.985 0.003 130),oklch(0.22 0.012 130));
--vibeui-dashboard-087-fg:light-dark(oklch(0.21 0.014 130),oklch(0.94 0.005 130));
--vibeui-dashboard-087-muted:light-dark(oklch(0.54 0.014 130),oklch(0.72 0.012 130));
--vibeui-dashboard-087-border:light-dark(oklch(0.91 0.006 130),oklch(0.36 0.012 130));
--vibeui-dashboard-087-accent:light-dark(oklch(0.5 0.13 145),oklch(0.75 0.13 145));
--vibeui-dashboard-087-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 145));
--vibeui-dashboard-087-soft:light-dark(oklch(0.965 0.02 145),oklch(0.3 0.03 145));
--vibeui-dashboard-087-fail:light-dark(oklch(0.57 0.19 25),oklch(0.72 0.16 25));
--vibeui-dashboard-087-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-087"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-087-bg);
color:var(--vibeui-dashboard-087-fg);
font-family:var(--vibeui-dashboard-087-sans);
border:1px solid var(--vibeui-dashboard-087-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-087"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-087"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-087"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-087"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-087"] [data-part="sub"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-087-muted);max-width:48ch}
[data-vibeui-block="dashboard-087"] [data-part="new"]{
margin-left:auto;appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:700;padding:0.4375rem 0.875rem;border-radius:0.5625rem;
background:var(--vibeui-dashboard-087-accent);color:var(--vibeui-dashboard-087-on-accent);
}
[data-vibeui-block="dashboard-087"] [data-part="list"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="dashboard-087"] [data-part="report"]{
display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.875rem;align-items:start;
padding:0.75rem 0.8125rem;border-radius:0.8125rem;
background:var(--vibeui-dashboard-087-card);border:1px solid var(--vibeui-dashboard-087-border);
}
[data-vibeui-block="dashboard-087"] [data-state="failed"]{border-color:color-mix(in oklab,var(--vibeui-dashboard-087-fail) 42%,light-dark(white,black))}
[data-vibeui-block="dashboard-087"] [data-state="off"]{opacity:0.68}
[data-vibeui-block="dashboard-087"] [data-part="name"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="dashboard-087"] [data-part="name"] b{font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-087"] [data-part="name"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-087-muted)}
[data-vibeui-block="dashboard-087"] [data-part="when"]{
display:flex;flex-direction:column;align-items:flex-end;gap:0.0625rem;text-align:right;white-space:nowrap;
}
[data-vibeui-block="dashboard-087"] [data-part="when"] b{
font-size:0.8125rem;font-weight:750;
}
[data-vibeui-block="dashboard-087"] [data-part="when"] span{font-size:0.625rem;color:var(--vibeui-dashboard-087-muted)}
[data-vibeui-block="dashboard-087"] [data-part="to"]{
grid-column:1 / -1;margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:0.25rem;
}
[data-vibeui-block="dashboard-087"] [data-part="to"] li{
font-size:0.625rem;font-weight:650;padding:0.0625rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-087-inset);border:1px solid var(--vibeui-dashboard-087-border);
}
[data-vibeui-block="dashboard-087"] [data-part="to"] li[data-lead="true"]{
background:var(--vibeui-dashboard-087-soft);
border-color:color-mix(in oklab,var(--vibeui-dashboard-087-accent) 30%,light-dark(white,black));
}
[data-vibeui-block="dashboard-087"] [data-part="foot"]{
grid-column:1 / -1;margin:0;display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-087-muted);align-items:center;
}
[data-vibeui-block="dashboard-087"] [data-part="fmt"]{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;background:var(--vibeui-dashboard-087-soft);
color:color-mix(in oklab,var(--vibeui-dashboard-087-accent) 85%,light-dark(black,white));
}
[data-vibeui-block="dashboard-087"] [data-part="fail"]{color:var(--vibeui-dashboard-087-fail);font-weight:700}
[data-vibeui-block="dashboard-087"] [data-part="acts"]{margin-left:auto;display:flex;gap:0.3125rem;flex-wrap:wrap}
[data-vibeui-block="dashboard-087"] [data-part="acts"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:700;
padding:0.25rem 0.5625rem;border-radius:0.4375rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-087-border);white-space:nowrap;
}
[data-vibeui-block="dashboard-087"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-087-accent);outline-offset:2px;
}
`

const DEFAULT_REPORTS: Dashboard087Report[] = [
  {
    name: "Выручка по филиалам",
    scope: "все филиалы, разбивка по неделям",
    schedule: "каждый понедельник в 09:00",
    nextRun: "16 июня, 09:00 (МСК)",
    lastRun: "выгружен 9 июня, 09:00",
    lastSize: "1,8 МБ",
    format: "XLSX",
    state: "on",
    recipients: [
      "Ирина Кузнецова",
      "финансовый отдел",
      "директора филиалов (5)",
    ],
  },
  {
    name: "Заявки без движения",
    scope: "заявки старше 5 дней без смены этапа",
    schedule: "каждый рабочий день в 08:30",
    nextRun: "завтра, 08:30 (МСК)",
    lastRun: "выгружен сегодня, 08:30",
    lastSize: "84 КБ",
    format: "CSV",
    state: "on",
    recipients: ["руководители отделов продаж"],
  },
  {
    name: "Сверка с бухгалтерией",
    scope: "счета и оплаты за закрытый месяц",
    schedule: "1-го числа каждого месяца в 06:00",
    nextRun: "1 июля, 06:00 (МСК)",
    lastRun: "упал 1 июня, 06:04",
    lastSize: "—",
    format: "XLSX",
    state: "failed",
    failure: "нет доступа к выгрузке бухгалтерии: ключ отозван 28 мая",
    recipients: ["Марина Тюрина", "бухгалтерия"],
  },
  {
    name: "Нагрузка поддержки по часам",
    scope: "обращения за сутки, разбивка по часам",
    schedule: "выключен с 12 мая",
    nextRun: "—",
    lastRun: "выгружен 11 мая, 07:00",
    lastSize: "42 КБ",
    format: "CSV",
    state: "off",
    recipients: ["Марина Тюрина"],
  },
]

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
 * Страница отчётов с расписанием выгрузки: расписание написано словами,
 * следующий запуск — абсолютным временем с поясом, получатели перечислены
 * поимённо, упавшая выгрузка несёт причину. Один файл, ноль зависимостей.
 */
export function Dashboard087({
  title = "Отчёты по расписанию",
  subtitle = "Файлы уходят письмом и лежат в разделе выгрузок 30 дней",
  reports = DEFAULT_REPORTS,
  newLabel = "Новый отчёт",
  accent,
  background = "",
  nextLabel = "следующий запуск",
  runLabel = "Запустить сейчас",
  enableLabel = "Включить",
  disableLabel = "Выключить",
  className,
  style,
}: Dashboard087Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-087-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-087-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-087" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-087"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="sub">{subtitle}</p>
            <button type="button" data-part="new">
              {newLabel}
            </button>
          </div>

          <ul data-part="list">
            {reports.map((report) => (
              <li
                key={report.name}
                data-part="report"
                data-state={report.state}
              >
                <div data-part="name">
                  <b>{report.name}</b>
                  <span>{report.scope}</span>
                  <span>{report.schedule}</span>
                </div>

                <div data-part="when">
                  <b>{report.nextRun}</b>
                  <span>{nextLabel}</span>
                </div>

                <ul data-part="to">
                  {report.recipients.map((recipient, index) => (
                    <li key={recipient} data-lead={index === 0}>
                      {recipient}
                    </li>
                  ))}
                </ul>

                <p data-part="foot">
                  <span data-part="fmt">{report.format}</span>
                  <span>
                    {report.lastRun}
                    {report.lastSize !== "—" ? `, ${report.lastSize}` : null}
                  </span>
                  {report.failure ? (
                    <span data-part="fail">{report.failure}</span>
                  ) : null}
                  <span data-part="acts">
                    <button type="button">{runLabel}</button>
                    <button type="button">
                      {report.state === "off" ? enableLabel : disableLabel}
                    </button>
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
