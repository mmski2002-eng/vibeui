import type { CSSProperties } from "react"

export type Dashboard041Step = {
  who: string
  state: "Подписал" | "Ваш ход" | "Ожидает"
}

export type Dashboard041Paper = {
  code: string
  title: string
  author: string
  sum: string
  due: string
  urgent?: boolean
  route: Dashboard041Step[]
}

export type Dashboard041Props = {
  title?: string
  hint?: string
  papers?: Dashboard041Paper[]
  signLabel?: string
  rejectLabel?: string
  bulkLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: очередь на подпись, где вместе с документом виден весь маршрут
// согласования. Маршрут нарисован цепочкой: пройденные шаги закрашены,
// текущий обведён кольцом, будущие — пунктиром, поэтому «кто уже подписал и
// кто следующий» читается без раскрытия карточки. Состояние шага подписано
// словом в title и в тексте под цепочкой: одной формой точки различие не
// объяснить. Кнопка возврата на доработку оформлена тише подписи, потому что
// эти два действия стоят рядом и путать их дорого.
const STYLES = `
:where([data-vibeui-block="dashboard-041"]){
--vibeui-dashboard-041-bg:oklch(0.985 0.003 265);
--vibeui-dashboard-041-card:oklch(1 0 0);
--vibeui-dashboard-041-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-041-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-041-border:oklch(0.91 0.006 265);
--vibeui-dashboard-041-accent:oklch(0.5 0.14 200);
--vibeui-dashboard-041-soft:oklch(0.95 0.03 200);
--vibeui-dashboard-041-urgent:oklch(0.58 0.19 25);
--vibeui-dashboard-041-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-041"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-041-bg);
color:var(--vibeui-dashboard-041-fg);
font-family:var(--vibeui-dashboard-041-sans);
border:1px solid var(--vibeui-dashboard-041-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-041"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-041"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-041"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.75rem}
[data-vibeui-block="dashboard-041"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-041"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-041-muted)}
[data-vibeui-block="dashboard-041"] [data-part="bulk"]{
appearance:none;cursor:pointer;font:inherit;margin-left:auto;
font-size:0.75rem;font-weight:650;padding:0.4375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-041-border);background:var(--vibeui-dashboard-041-card);color:inherit;
}
[data-vibeui-block="dashboard-041"] [data-part="list"]{display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="dashboard-041"] article{
display:grid;gap:0.5rem;padding:0.875rem;
background:var(--vibeui-dashboard-041-card);
border:1px solid var(--vibeui-dashboard-041-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-041"] article[data-urgent="yes"]{
border-left:0.1875rem solid var(--vibeui-dashboard-041-urgent);
}
[data-vibeui-block="dashboard-041"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.625rem}
[data-vibeui-block="dashboard-041"] h3{margin:0;font-size:0.875rem;font-weight:750;flex:1 1 14rem}
[data-vibeui-block="dashboard-041"] [data-part="code"]{
font-size:0.6875rem;color:var(--vibeui-dashboard-041-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-041"] [data-part="sum"]{
font-size:0.9375rem;font-weight:800;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="dashboard-041"] [data-part="meta"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-041-muted);
}
[data-vibeui-block="dashboard-041"] [data-part="due"]{font-weight:750}
[data-vibeui-block="dashboard-041"] article[data-urgent="yes"] [data-part="due"]{color:var(--vibeui-dashboard-041-urgent)}
[data-vibeui-block="dashboard-041"] [data-part="route"]{
display:flex;flex-wrap:wrap;gap:0 0.25rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-041"] [data-part="step"]{
display:flex;flex-direction:column;align-items:center;gap:0.25rem;
flex:1 1 4.5rem;min-width:4.5rem;position:relative;padding-top:0.125rem;
}
/* Соединительная линия рисуется псевдоэлементом шага, а не отдельным узлом. */
[data-vibeui-block="dashboard-041"] [data-part="step"] + [data-part="step"]::before{
content:"";position:absolute;left:-50%;right:50%;top:0.6875rem;height:1px;
background:var(--vibeui-dashboard-041-border);
}
[data-vibeui-block="dashboard-041"] [data-part="node"]{
position:relative;z-index:1;width:1.125rem;height:1.125rem;border-radius:50%;
display:grid;place-items:center;font-size:0.5625rem;font-weight:800;
background:var(--vibeui-dashboard-041-card);
border:1.5px dashed var(--vibeui-dashboard-041-border);
color:var(--vibeui-dashboard-041-muted);
}
[data-vibeui-block="dashboard-041"] [data-part="step"][data-state="Подписал"] [data-part="node"]{
background:var(--vibeui-dashboard-041-accent);border:1.5px solid var(--vibeui-dashboard-041-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-041"] [data-part="step"][data-state="Ваш ход"] [data-part="node"]{
border:1.5px solid var(--vibeui-dashboard-041-accent);color:var(--vibeui-dashboard-041-accent);
box-shadow:0 0 0 0.1875rem var(--vibeui-dashboard-041-soft);
}
[data-vibeui-block="dashboard-041"] [data-part="who"]{
font-size:0.625rem;line-height:1.3;text-align:center;color:var(--vibeui-dashboard-041-muted);
}
[data-vibeui-block="dashboard-041"] [data-part="step"][data-state="Ваш ход"] [data-part="who"]{
color:var(--vibeui-dashboard-041-accent);font-weight:750;
}
[data-vibeui-block="dashboard-041"] [data-part="acts"]{
display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;
padding-top:0.5rem;border-top:1px solid var(--vibeui-dashboard-041-border);
}
[data-vibeui-block="dashboard-041"] [data-part="stage"]{
font-size:0.6875rem;color:var(--vibeui-dashboard-041-muted);margin-right:auto;
}
[data-vibeui-block="dashboard-041"] [data-part="sign"]{
appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.8125rem;font-weight:700;padding:0.5rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-041-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-041"] [data-part="back"]{
appearance:none;cursor:pointer;font:inherit;
font-size:0.8125rem;font-weight:650;padding:0.5rem 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-dashboard-041-border);background:var(--vibeui-dashboard-041-card);color:inherit;
}
[data-vibeui-block="dashboard-041"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-041-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-041"] article{
grid-template-columns:1fr 16rem;grid-template-areas:"top route" "meta route" "acts acts";align-items:start;
column-gap:1.25rem;
}
[data-vibeui-block="dashboard-041"] [data-part="top"]{grid-area:top}
[data-vibeui-block="dashboard-041"] [data-part="meta"]{grid-area:meta}
[data-vibeui-block="dashboard-041"] [data-part="route"]{grid-area:route}
[data-vibeui-block="dashboard-041"] [data-part="acts"]{grid-area:acts}
}
`

const DEFAULT_PAPERS: Dashboard041Paper[] = [
  {
    code: "СЧ-2270",
    title: "Счёт на закупку фанеры и бруса",
    author: "Игорь Панов, снабжение",
    sum: "340 000 ₽",
    due: "подписать до 18:00 сегодня",
    urgent: true,
    route: [
      { who: "Снабжение", state: "Подписал" },
      { who: "Бухгалтерия", state: "Подписал" },
      { who: "Вы", state: "Ваш ход" },
      { who: "Директор", state: "Ожидает" },
    ],
  },
  {
    code: "ДГ-131",
    title: "Договор на фирменный стиль со студией «Полдень»",
    author: "Анна Реброва, маркетинг",
    sum: "640 000 ₽",
    due: "подписать до 20 марта",
    route: [
      { who: "Маркетинг", state: "Подписал" },
      { who: "Вы", state: "Ваш ход" },
      { who: "Юрист", state: "Ожидает" },
      { who: "Директор", state: "Ожидает" },
    ],
  },
  {
    code: "ЗЯ-0412",
    title: "Заявка на отпуск, 5 дней в апреле",
    author: "Пётр Хромов, поддержка",
    sum: "без суммы",
    due: "подписать до 24 марта",
    route: [
      { who: "Сотрудник", state: "Подписал" },
      { who: "Вы", state: "Ваш ход" },
      { who: "Кадры", state: "Ожидает" },
    ],
  },
]

/**
 * Экран согласований: очередь документов на подпись, маршрут согласования
 * цепочкой и действия подписи или возврата. Один файл, ноль зависимостей,
 * клиентского JS нет.
 */
export function Dashboard041({
  title = "На подпись",
  hint = "3 документа ждут вашего решения",
  papers = DEFAULT_PAPERS,
  signLabel = "Подписать",
  rejectLabel = "Вернуть на доработку",
  bulkLabel = "Подписать все без замечаний",
  accent,
  className,
  style,
}: Dashboard041Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-041-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-041" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-041"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
            <button type="button" data-part="bulk">
              {bulkLabel}
            </button>
          </div>

          <div data-part="list">
            {papers.map((paper) => {
              const signed = paper.route.filter(
                (step) => step.state === "Подписал",
              ).length

              return (
                <article
                  key={paper.code}
                  data-urgent={paper.urgent ? "yes" : "no"}
                >
                  <div data-part="top">
                    <h3>{paper.title}</h3>
                    <span data-part="code">{paper.code}</span>
                    <span data-part="sum">{paper.sum}</span>
                  </div>

                  <p data-part="meta">
                    {paper.author} · <span data-part="due">{paper.due}</span>
                  </p>

                  <ol data-part="route" aria-label="Маршрут согласования">
                    {paper.route.map((step) => (
                      <li
                        key={step.who}
                        data-part="step"
                        data-state={step.state}
                      >
                        <span data-part="node" title={step.state}>
                          {step.state === "Подписал" ? "✓" : ""}
                        </span>
                        <span data-part="who">
                          {step.who}
                          <br />
                          {step.state}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div data-part="acts">
                    <span data-part="stage">
                      Подписали {signed} из {paper.route.length}
                    </span>
                    <button type="button" data-part="sign">
                      {signLabel}
                    </button>
                    <button type="button" data-part="back">
                      {rejectLabel}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
