import type { CSSProperties } from "react"

export type Dashboard059Row = {
  key: string
  label: string
  left: string
  right: string
  status: "match" | "diff" | "only-left" | "only-right"
  delta?: string
}

export type Dashboard059Props = {
  title?: string
  leftName?: string
  rightName?: string
  period?: string
  rows?: Dashboard059Row[]
  resolveLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: сверка двух источников — это не «две таблицы рядом», а один
// список строк с приговором посередине. Поэтому раскладка трёхколоночная:
// значение слева, приговор в центре, значение справа, и приговор написан
// словом, а не цветом. Строка «есть только слева» рисует пустую ячейку с
// прочерком, а не прячет её — пропуск и есть главная находка сверки.
// Сводка вверху считает строки по видам расхождений: с неё начинают работу.
const STYLES = `
:where([data-vibeui-block="dashboard-059"]){
--vibeui-dashboard-059-bg:oklch(0.985 0.003 250);
--vibeui-dashboard-059-card:oklch(1 0 0);
--vibeui-dashboard-059-fg:oklch(0.21 0.014 250);
--vibeui-dashboard-059-muted:oklch(0.55 0.014 250);
--vibeui-dashboard-059-border:oklch(0.91 0.006 250);
--vibeui-dashboard-059-accent:oklch(0.5 0.15 250);
--vibeui-dashboard-059-soft:oklch(0.965 0.02 250);
--vibeui-dashboard-059-ok:oklch(0.6 0.13 155);
--vibeui-dashboard-059-diff:oklch(0.68 0.15 72);
--vibeui-dashboard-059-gap:oklch(0.57 0.19 25);
--vibeui-dashboard-059-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-059-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-059"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-059-bg);
color:var(--vibeui-dashboard-059-fg);
font-family:var(--vibeui-dashboard-059-sans);
border:1px solid var(--vibeui-dashboard-059-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-059"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-059"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-059"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.75rem}
[data-vibeui-block="dashboard-059"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-059"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-059-muted)}
[data-vibeui-block="dashboard-059"] [data-part="tally"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;
}
[data-vibeui-block="dashboard-059"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.125rem;padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-059-card);border:1px solid var(--vibeui-dashboard-059-border);
}
[data-vibeui-block="dashboard-059"] [data-part="cell"] b{font-size:1.125rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-059"] [data-part="cell"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-059-muted)}
[data-vibeui-block="dashboard-059"] [data-part="cell"][data-kind="match"] b{color:var(--vibeui-dashboard-059-ok)}
[data-vibeui-block="dashboard-059"] [data-part="cell"][data-kind="diff"] b{color:var(--vibeui-dashboard-059-diff)}
[data-vibeui-block="dashboard-059"] [data-part="cell"][data-kind="gap"] b{color:var(--vibeui-dashboard-059-gap)}
[data-vibeui-block="dashboard-059"] [data-part="names"]{
display:none;font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;
color:var(--vibeui-dashboard-059-muted);
}
[data-vibeui-block="dashboard-059"] [data-part="rows"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="dashboard-059"] [data-part="row"]{
display:grid;grid-template-columns:1fr;gap:0.25rem 0.75rem;align-items:center;
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-059-card);border:1px solid var(--vibeui-dashboard-059-border);
}
[data-vibeui-block="dashboard-059"] [data-part="label"]{font-size:0.8125rem;font-weight:700}
[data-vibeui-block="dashboard-059"] [data-part="label"] span{
display:block;font-weight:400;font-size:0.6875rem;color:var(--vibeui-dashboard-059-muted);
}
[data-vibeui-block="dashboard-059"] [data-part="value"]{
font-family:var(--vibeui-dashboard-059-mono);font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-059"] [data-part="value"][data-empty="true"]{color:var(--vibeui-dashboard-059-muted)}
[data-vibeui-block="dashboard-059"] [data-part="verdict"]{
display:inline-flex;align-items:center;gap:0.375rem;justify-self:start;
font-size:0.6875rem;font-weight:750;white-space:nowrap;
padding:0.1875rem 0.4375rem;border-radius:0.375rem;background:var(--vibeui-dashboard-059-bg);
}
[data-vibeui-block="dashboard-059"] [data-part="verdict"]::before{content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;background:currentColor}
[data-vibeui-block="dashboard-059"] [data-status="match"] [data-part="verdict"]{color:var(--vibeui-dashboard-059-ok)}
[data-vibeui-block="dashboard-059"] [data-status="diff"] [data-part="verdict"]{color:var(--vibeui-dashboard-059-diff)}
[data-vibeui-block="dashboard-059"] [data-status="diff"] [data-part="verdict"]::before{border-radius:0.125rem}
[data-vibeui-block="dashboard-059"] [data-status="only-left"] [data-part="verdict"],
[data-vibeui-block="dashboard-059"] [data-status="only-right"] [data-part="verdict"]{color:var(--vibeui-dashboard-059-gap)}
[data-vibeui-block="dashboard-059"] [data-status="only-left"] [data-part="verdict"]::before,
[data-vibeui-block="dashboard-059"] [data-status="only-right"] [data-part="verdict"]::before{border-radius:0;transform:rotate(45deg)}
[data-vibeui-block="dashboard-059"] [data-status="diff"]{border-color:color-mix(in oklab,var(--vibeui-dashboard-059-diff) 40%,white)}
[data-vibeui-block="dashboard-059"] [data-status="only-left"],
[data-vibeui-block="dashboard-059"] [data-status="only-right"]{border-color:color-mix(in oklab,var(--vibeui-dashboard-059-gap) 38%,white)}
[data-vibeui-block="dashboard-059"] [data-part="delta"]{font-size:0.6875rem;color:var(--vibeui-dashboard-059-muted)}
[data-vibeui-block="dashboard-059"] [data-part="fix"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:700;
padding:0.25rem 0.5rem;border-radius:0.4375rem;justify-self:start;
background:transparent;color:inherit;border:1px solid var(--vibeui-dashboard-059-border);
}
[data-vibeui-block="dashboard-059"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-059-accent);outline-offset:2px;
}
@container (min-width: 30rem){
[data-vibeui-block="dashboard-059"] [data-part="tally"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-059"] [data-part="names"]{
display:grid;grid-template-columns:minmax(9rem,1.4fr) 1fr 8.5rem 1fr 6.5rem;gap:0.75rem;padding:0 0.75rem;
}
[data-vibeui-block="dashboard-059"] [data-part="row"]{
grid-template-columns:minmax(9rem,1.4fr) 1fr 8.5rem 1fr 6.5rem;
}
}
`

const DEFAULT_ROWS: Dashboard059Row[] = [
  {
    key: "inv-8841",
    label: "Счёт 8841",
    left: "412 000,00",
    right: "412 000,00",
    status: "match",
  },
  {
    key: "inv-8842",
    label: "Счёт 8842",
    left: "186 500,00",
    right: "186 050,00",
    status: "diff",
    delta: "расходится на 450,00",
  },
  {
    key: "inv-8843",
    label: "Счёт 8843",
    left: "930 000,00",
    right: "—",
    status: "only-left",
    delta: "не выгружен в бухгалтерию",
  },
  {
    key: "inv-8844",
    label: "Счёт 8844",
    left: "—",
    right: "74 300,00",
    status: "only-right",
    delta: "проведён вручную, минуя систему",
  },
  {
    key: "inv-8845",
    label: "Счёт 8845",
    left: "128 000,00",
    right: "128 000,00",
    status: "match",
  },
  {
    key: "inv-8846",
    label: "Счёт 8846",
    left: "54 900,00",
    right: "54 900,00",
    status: "match",
  },
  {
    key: "inv-8847",
    label: "Счёт 8847",
    left: "1 240 000,00",
    right: "1 204 000,00",
    status: "diff",
    delta: "расходится на 36 000,00",
  },
]

const VERDICTS: Record<Dashboard059Row["status"], string> = {
  match: "совпало",
  diff: "расходится",
  "only-left": "нет справа",
  "only-right": "нет слева",
}

/**
 * Экран сверки двух источников: строки с приговором посередине, пропуски
 * показаны прочерком, а не спрятаны, сводка по видам расхождений сверху.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard059({
  title = "Сверка выручки",
  leftName = "CRM",
  rightName = "Бухгалтерия",
  period = "период: 1–14 июня, сверка запущена сегодня в 06:00",
  rows = DEFAULT_ROWS,
  resolveLabel = "Разобрать",
  accent,
  className,
  style,
}: Dashboard059Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-059-accent": accent } : null),
    ...style,
  } as CSSProperties

  const count = (status: Dashboard059Row["status"]) =>
    rows.filter((row) => row.status === status).length

  return (
    <>
      <style href="vibeui-dashboard-059" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-059"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>
              {title}: {leftName} против «{rightName}»
            </h2>
            <p data-part="period">{period}</p>
          </div>

          <div data-part="tally">
            <p data-part="cell" data-kind="match">
              <b>{count("match")}</b>
              <span>строк совпало полностью</span>
            </p>
            <p data-part="cell" data-kind="diff">
              <b>{count("diff")}</b>
              <span>расходится по сумме</span>
            </p>
            <p data-part="cell" data-kind="gap">
              <b>{count("only-left")}</b>
              <span>есть только в «{leftName}»</span>
            </p>
            <p data-part="cell" data-kind="gap">
              <b>{count("only-right")}</b>
              <span>есть только в «{rightName}»</span>
            </p>
          </div>

          <div data-part="names" aria-hidden="true">
            <span>Документ</span>
            <span>{leftName}</span>
            <span>Приговор</span>
            <span>{rightName}</span>
            <span />
          </div>

          <ul data-part="rows">
            {rows.map((row) => (
              <li key={row.key} data-part="row" data-status={row.status}>
                <p data-part="label">
                  {row.label}
                  {row.delta ? <span>{row.delta}</span> : null}
                </p>
                <span data-part="value" data-empty={row.left === "—"}>
                  {row.left}
                </span>
                <span data-part="verdict">{VERDICTS[row.status]}</span>
                <span data-part="value" data-empty={row.right === "—"}>
                  {row.right}
                </span>
                {row.status === "match" ? (
                  <span data-part="delta">—</span>
                ) : (
                  <button type="button" data-part="fix">
                    {resolveLabel}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
