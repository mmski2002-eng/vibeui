import type { CSSProperties } from "react"

export type Solutions046Filing = {
  form: string
  period: string
  dueInDays: number
  submitted: boolean
  accepted: boolean
  amended: boolean
  amount: string
}

export type Solutions046Props = {
  title?: string
  subtitle?: string
  soonInDays?: number
  filings?: Solutions046Filing[]
  foot?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: календарь налоговой отчётности. Статус не приходит готовой
// меткой — считается в компоненте из трёх флагов (сдана, принята, уточнёнка)
// и числа дней до срока: «просрочена» и «сдана, ждём приёма» не могут
// разъехаться со сроком, потому что берутся из одних и тех же чисел, что и
// обратный отсчёт. Статус несёт форму метки и подпись словом, не только цвет.
const STYLES = `
:where([data-vibeui-block="solutions-046"]){
--vibeui-solutions-046-bg:oklch(1 0 0);
--vibeui-solutions-046-panel:oklch(0.977 0.004 250);
--vibeui-solutions-046-fg:oklch(0.21 0.014 265);
--vibeui-solutions-046-muted:oklch(0.55 0.014 265);
--vibeui-solutions-046-border:oklch(0.9 0.006 265);
--vibeui-solutions-046-accent:oklch(0.5 0.16 265);
--vibeui-solutions-046-ok:oklch(0.55 0.14 152);
--vibeui-solutions-046-wait:oklch(0.6 0.14 255);
--vibeui-solutions-046-warn:oklch(0.65 0.15 75);
--vibeui-solutions-046-late:oklch(0.57 0.19 25);
--vibeui-solutions-046-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-046-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-046"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-046-bg);
border:1px solid var(--vibeui-solutions-046-border);border-radius:1rem;
font-family:var(--vibeui-solutions-046-sans);color:var(--vibeui-solutions-046-fg);
}
[data-vibeui-block="solutions-046"] *{box-sizing:border-box}
[data-vibeui-block="solutions-046"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-046"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-046"] [data-part="subtitle"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-046-muted)}
[data-vibeui-block="solutions-046"] [data-part="stats"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-046"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-046-panel);border:1px solid var(--vibeui-solutions-046-border);
}
[data-vibeui-block="solutions-046"] [data-tile="late"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-046-late) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-046-late) 8%,var(--vibeui-solutions-046-bg));
}
[data-vibeui-block="solutions-046"] [data-part="tile"] b{
display:block;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-046"] [data-tile="late"] b{color:var(--vibeui-solutions-046-late)}
[data-vibeui-block="solutions-046"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-046-muted);
}
[data-vibeui-block="solutions-046"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-046"] table{width:100%;min-width:38rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-046"] th,
[data-vibeui-block="solutions-046"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-046-border);
}
[data-vibeui-block="solutions-046"] th:first-child,
[data-vibeui-block="solutions-046"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-046"] th:last-child,
[data-vibeui-block="solutions-046"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-046"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-046-muted);background:var(--vibeui-solutions-046-panel);
}
[data-vibeui-block="solutions-046"] [data-part="form"]{font-weight:650}
[data-vibeui-block="solutions-046"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-046"] [data-part="countdown"]{
display:block;font-size:0.6875rem;color:var(--vibeui-solutions-046-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-046"] [data-status="overdue"] [data-part="countdown"]{color:var(--vibeui-solutions-046-late);font-weight:650}
[data-vibeui-block="solutions-046"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.125rem 0.5rem 0.125rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-046-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-046-muted);
}
[data-vibeui-block="solutions-046"] [data-part="letter"]{
width:1rem;height:1rem;border-radius:9999px;display:grid;place-items:center;
background:var(--vibeui-solutions-046-panel);font-size:0.5625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="solutions-046"] [data-status="accepted"] [data-part="status"]{color:var(--vibeui-solutions-046-ok);border-color:color-mix(in oklab,var(--vibeui-solutions-046-ok) 50%,transparent)}
[data-vibeui-block="solutions-046"] [data-status="accepted"] [data-part="letter"]{background:var(--vibeui-solutions-046-ok);color:oklch(1 0 0)}
[data-vibeui-block="solutions-046"] [data-status="submitted"] [data-part="status"]{color:var(--vibeui-solutions-046-wait);border-color:color-mix(in oklab,var(--vibeui-solutions-046-wait) 50%,transparent)}
[data-vibeui-block="solutions-046"] [data-status="submitted"] [data-part="letter"]{background:var(--vibeui-solutions-046-wait);color:oklch(1 0 0)}
[data-vibeui-block="solutions-046"] [data-status="amended"] [data-part="status"]{color:var(--vibeui-solutions-046-warn);border-color:color-mix(in oklab,var(--vibeui-solutions-046-warn) 50%,transparent)}
[data-vibeui-block="solutions-046"] [data-status="amended"] [data-part="letter"]{background:var(--vibeui-solutions-046-warn);color:oklch(1 0 0)}
[data-vibeui-block="solutions-046"] [data-status="overdue"] [data-part="status"]{color:var(--vibeui-solutions-046-late);border-color:color-mix(in oklab,var(--vibeui-solutions-046-late) 50%,transparent)}
[data-vibeui-block="solutions-046"] [data-status="overdue"] [data-part="letter"]{background:var(--vibeui-solutions-046-late);color:oklch(1 0 0)}
[data-vibeui-block="solutions-046"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-046-muted);
}
@container (min-width: 32rem){
[data-vibeui-block="solutions-046"] [data-part="stats"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-046"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILINGS: Solutions046Filing[] = [
  {
    form: "НДС",
    period: "1 квартал 2024",
    dueInDays: 4,
    submitted: false,
    accepted: false,
    amended: false,
    amount: "412 000 ₽",
  },
  {
    form: "6-НДФЛ",
    period: "1 квартал 2024",
    dueInDays: -2,
    submitted: false,
    accepted: false,
    amended: false,
    amount: "0 ₽",
  },
  {
    form: "РСВ",
    period: "1 квартал 2024",
    dueInDays: 9,
    submitted: true,
    accepted: false,
    amended: false,
    amount: "214 300 ₽",
  },
  {
    form: "Налог на прибыль",
    period: "2023 год",
    dueInDays: 26,
    submitted: true,
    accepted: true,
    amended: false,
    amount: "1 180 000 ₽",
  },
  {
    form: "НДС",
    period: "4 квартал 2023",
    dueInDays: -18,
    submitted: true,
    accepted: true,
    amended: true,
    amount: "58 400 ₽",
  },
]

type StatusKey = "accepted" | "submitted" | "amended" | "overdue" | "pending"

const STATUS_META: Record<StatusKey, { letter: string; label: string }> = {
  accepted: { letter: "П", label: "принята" },
  submitted: { letter: "С", label: "сдана, ждём приёма" },
  amended: { letter: "У", label: "уточнёнка" },
  overdue: { letter: "!", label: "просрочена" },
  pending: { letter: "К", label: "к сдаче" },
}

function statusOf(filing: Solutions046Filing): StatusKey {
  if (filing.amended) return "amended"
  if (filing.submitted && filing.accepted) return "accepted"
  if (filing.submitted) return "submitted"
  if (filing.dueInDays < 0) return "overdue"
  return "pending"
}

/**
 * Календарь налоговой отчётности: статус посчитан из флагов сдачи/приёма и
 * дней до срока, а не передан меткой. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Solutions046({
  title = "Налоговая отчётность",
  subtitle = "Бухгалтерия · 2024 год",
  soonInDays = 7,
  filings = DEFAULT_FILINGS,
  foot = "Уточнёнка перекрывает статус сдачи: пока по периоду идёт корректировка, остальные отметки не в счёт.",
  accent,
  className,
  style,
}: Solutions046Props) {
  const withStatus = filings.map((filing) => ({
    filing,
    status: statusOf(filing),
  }))
  const overdue = withStatus.filter((row) => row.status === "overdue").length
  const dueSoon = filings.filter(
    (filing) =>
      !filing.submitted &&
      filing.dueInDays >= 0 &&
      filing.dueInDays <= soonInDays,
  ).length
  const toPay = withStatus
    .filter((row) => row.status !== "accepted")
    .reduce((sum, row) => {
      const value = Number(row.filing.amount.replace(/[^\d]/g, ""))
      return sum + (Number.isFinite(value) ? value : 0)
    }, 0)

  const palette = {
    ...(accent ? { "--vibeui-solutions-046-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-046" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-046"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="subtitle">{subtitle}</p>
          </div>
        </header>

        <div data-part="stats">
          <p data-part="tile" data-tile="late">
            <b>{overdue}</b>
            <span>просрочено</span>
          </p>
          <p data-part="tile">
            <b>{dueSoon}</b>
            <span>срок в ближайшие {soonInDays} дн.</span>
          </p>
          <p data-part="tile">
            <b>{toPay.toLocaleString("ru-RU")} ₽</b>
            <span>к уплате без принятых</span>
          </p>
          <p data-part="tile">
            <b>{filings.length}</b>
            <span>форм в календаре</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Форма</th>
                <th scope="col">Период</th>
                <th scope="col">Срок сдачи</th>
                <th scope="col">Статус</th>
                <th scope="col" data-align="end">
                  К уплате
                </th>
              </tr>
            </thead>
            <tbody>
              {withStatus.map(({ filing, status }) => (
                <tr
                  key={`${filing.form}-${filing.period}`}
                  data-status={status}
                >
                  <td data-part="form">{filing.form}</td>
                  <td>{filing.period}</td>
                  <td>
                    <span data-part="countdown">
                      {filing.dueInDays >= 0
                        ? `через ${filing.dueInDays} дн.`
                        : `просрочено на ${Math.abs(filing.dueInDays)} дн.`}
                    </span>
                  </td>
                  <td>
                    <span data-part="status">
                      <span data-part="letter" aria-hidden="true">
                        {STATUS_META[status].letter}
                      </span>
                      {STATUS_META[status].label}
                    </span>
                  </td>
                  <td data-align="end">{filing.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p data-part="foot">{foot}</p>
      </section>
    </>
  )
}
