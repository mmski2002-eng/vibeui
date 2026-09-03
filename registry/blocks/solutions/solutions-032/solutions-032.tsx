import type { CSSProperties } from "react"

export type Solutions032Stage =
  "initiator" | "manager" | "finance" | "procurement"

export type Solutions032Request = {
  id: string
  subject: string
  department: string
  amount: string
  stage: Solutions032Stage
  holder: string
  neededInDays: number
}

export type Solutions032Props = {
  title?: string
  hint?: string
  requests?: Solutions032Request[]
  /** Подписи плиток сводки: total, finance, late. */
  summaryText?: Record<string, string>
  /** Подписи узлов цепочки: initiator, manager, finance, procurement. */
  stageText?: Record<string, string>
  holderLabel?: string
  /** Срок потребности. {days} — число дней. */
  dueText?: string
  /** Просрочка. {days} — число дней. */
  overdueText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: заявки на закупку с цепочкой согласования. Стадия рисуется
// сегментированным степпером из 4 узлов — инициатор, руководитель, финансы,
// закупки — а не текстовой меткой: видно не только «где сейчас», но и сколько
// шагов уже пройдено и сколько осталось. Текущий узел получает акцентный цвет
// и подпись держателя под ним, пройденные — зелёный, будущие — серые. Просрочка
// по сроку потребности не хранится флагом, а считается из числа дней и
// подписывается словом «просрочено», чтобы отрицательное число не читалось
// как «ещё есть время».
const STYLES = `
:where([data-vibeui-block="solutions-032"]){
--vibeui-solutions-032-bg:transparent;
--vibeui-solutions-032-panel:light-dark(oklch(0.972 0.004 275),oklch(0.27 0.011 275));
--vibeui-solutions-032-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-032-muted:light-dark(oklch(0.54 0.014 265),oklch(0.69 0.012 265));
--vibeui-solutions-032-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-solutions-032-accent:light-dark(oklch(0.5 0.16 275),oklch(0.75 0.14 275));
--vibeui-solutions-032-late:light-dark(oklch(0.57 0.19 25),oklch(0.71 0.17 25));
--vibeui-solutions-032-done:light-dark(oklch(0.55 0.14 152),oklch(0.71 0.14 152));
--vibeui-solutions-032-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-032"]{color-scheme:dark}
[data-vibeui-block="solutions-032"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-032-bg);
border:1px solid var(--vibeui-solutions-032-border);border-radius:1rem;
font-family:var(--vibeui-solutions-032-sans);color:var(--vibeui-solutions-032-fg);
}
[data-vibeui-block="solutions-032"] *{box-sizing:border-box}
[data-vibeui-block="solutions-032"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-032"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-032"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-032-muted)}
[data-vibeui-block="solutions-032"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-032"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;background:var(--vibeui-solutions-032-panel);
border:1px solid var(--vibeui-solutions-032-border);
}
[data-vibeui-block="solutions-032"] [data-tile="late"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-032-late) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-032-late) 8%,var(--vibeui-solutions-032-bg));
}
[data-vibeui-block="solutions-032"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-032"] [data-tile="late"] b{color:var(--vibeui-solutions-032-late)}
[data-vibeui-block="solutions-032"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-032-muted);
}
[data-vibeui-block="solutions-032"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.625rem;padding:0 1rem 1rem;
}
[data-vibeui-block="solutions-032"] [data-part="card"]{
border:1px solid var(--vibeui-solutions-032-border);border-radius:0.75rem;padding:0.75rem 0.875rem;
}
[data-vibeui-block="solutions-032"] [data-part="row"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.375rem 1rem;
}
[data-vibeui-block="solutions-032"] [data-part="subject"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="solutions-032"] [data-part="dept"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-032-muted)}
[data-vibeui-block="solutions-032"] [data-part="amount"]{font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
/* Степпер из 4 узлов: пройденное и текущее видно геометрией, а не меткой. */
[data-vibeui-block="solutions-032"] [data-part="chain"]{
list-style:none;display:grid;grid-template-columns:repeat(4,1fr);gap:0.375rem;margin:0.75rem 0 0;padding:0;
}
[data-vibeui-block="solutions-032"] [data-part="step"]{display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="solutions-032"] [data-part="bullet"]{
height:0.375rem;border-radius:9999px;background:var(--vibeui-solutions-032-border);
}
[data-vibeui-block="solutions-032"] [data-status="done"] [data-part="bullet"]{background:var(--vibeui-solutions-032-done)}
[data-vibeui-block="solutions-032"] [data-status="current"] [data-part="bullet"]{background:var(--vibeui-solutions-032-accent)}
[data-vibeui-block="solutions-032"] [data-part="step"] small{
font-size:0.625rem;color:var(--vibeui-solutions-032-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="solutions-032"] [data-status="current"] small{color:var(--vibeui-solutions-032-accent);font-weight:650}
[data-vibeui-block="solutions-032"] [data-status="done"] small{color:var(--vibeui-solutions-032-fg)}
[data-vibeui-block="solutions-032"] [data-part="foot-row"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.375rem 1rem;
margin-top:0.625rem;padding-top:0.5rem;border-top:1px solid var(--vibeui-solutions-032-border);
font-size:0.75rem;color:var(--vibeui-solutions-032-muted);
}
[data-vibeui-block="solutions-032"] [data-part="holder"]{font-weight:650;color:var(--vibeui-solutions-032-fg)}
[data-vibeui-block="solutions-032"] [data-part="due"][data-late="true"]{color:var(--vibeui-solutions-032-late);font-weight:650}
@container (min-width: 34rem){
[data-vibeui-block="solutions-032"] [data-part="row"]{flex-wrap:nowrap}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-032"] *{animation:none!important;transition:none!important}}
`

const STAGES: Solutions032Stage[] = [
  "initiator",
  "manager",
  "finance",
  "procurement",
]

const STAGE_LABEL: Record<string, string> = {
  initiator: "Инициатор",
  manager: "Руководитель",
  finance: "Финансы",
  procurement: "Закупки",
}

const SUMMARY_LABEL: Record<string, string> = {
  total: "заявок в работе",
  finance: "ждут финансы",
  late: "просрочено по сроку",
}

const DEFAULT_REQUESTS: Solutions032Request[] = [
  {
    id: "З-2024-118",
    subject: "Ноутбуки для новых сотрудников (6 шт.)",
    department: "IT",
    amount: "864 000 ₽",
    stage: "finance",
    holder: "Марина Костина",
    neededInDays: 9,
  },
  {
    id: "З-2024-121",
    subject: "Запчасти для линии №3",
    department: "Производство",
    amount: "412 500 ₽",
    stage: "procurement",
    holder: "Артём Воробьёв",
    neededInDays: -2,
  },
  {
    id: "З-2024-123",
    subject: "Канцелярия и расходники на квартал",
    department: "АХО",
    amount: "96 300 ₽",
    stage: "manager",
    holder: "Олег Рябинин",
    neededInDays: 18,
  },
  {
    id: "З-2024-126",
    subject: "Наружная реклама к запуску линейки",
    department: "Маркетинг",
    amount: "540 000 ₽",
    stage: "initiator",
    holder: "Юлия Черных",
    neededInDays: 25,
  },
  {
    id: "З-2024-127",
    subject: "Паллетный погрузчик, аренда",
    department: "Логистика",
    amount: "128 000 ₽",
    stage: "finance",
    holder: "Марина Костина",
    neededInDays: -6,
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
 * Заявки на закупку: стадия согласования — степпер из 4 узлов, держатель и
 * просрочка считаются из данных. Один файл, ноль зависимостей, своя палитра.
 */
export function Solutions032({
  title = "Заявки на закупку",
  hint = "Все подразделения, текущий квартал",
  requests = DEFAULT_REQUESTS,
  summaryText = SUMMARY_LABEL,
  stageText = STAGE_LABEL,
  holderLabel = "Держит:",
  dueText = "нужна через {days} дн.",
  overdueText = "просрочено на {days} дн.",
  accent,
  background = "",
  className,
  style,
}: Solutions032Props) {
  const overdue = requests.filter((request) => request.neededInDays < 0)
  const inFinance = requests.filter((request) => request.stage === "finance")
  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]
  const stageName = (key: string) => stageText[key] ?? STAGE_LABEL[key]

  const palette = {
    ...(accent ? { "--vibeui-solutions-032-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-032-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-032" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-032"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{requests.length}</b>
            <span>{summary("total")}</span>
          </p>
          <p data-part="tile">
            <b>{inFinance.length}</b>
            <span>{summary("finance")}</span>
          </p>
          <p data-part="tile" data-tile="late">
            <b>{overdue.length}</b>
            <span>{summary("late")}</span>
          </p>
        </div>

        <div data-part="list">
          {requests.map((request) => {
            const stageIndex = STAGES.indexOf(request.stage)
            const late = request.neededInDays < 0
            const dueLabel = late
              ? overdueText.replace(
                  "{days}",
                  String(Math.abs(request.neededInDays)),
                )
              : dueText.replace("{days}", String(request.neededInDays))

            return (
              <article data-part="card" key={request.id}>
                <div data-part="row">
                  <div>
                    <p data-part="subject">{request.subject}</p>
                    <p data-part="dept">
                      {request.id} · {request.department}
                    </p>
                  </div>
                  <span data-part="amount">{request.amount}</span>
                </div>

                <ol data-part="chain">
                  {STAGES.map((stage, index) => {
                    const status =
                      index < stageIndex
                        ? "done"
                        : index === stageIndex
                          ? "current"
                          : "pending"
                    return (
                      <li data-part="step" data-status={status} key={stage}>
                        <span data-part="bullet" aria-hidden="true" />
                        <small>{stageName(stage)}</small>
                      </li>
                    )
                  })}
                </ol>

                <div data-part="foot-row">
                  <span>
                    {holderLabel}{" "}
                    <span data-part="holder">{request.holder}</span> ·{" "}
                    {stageName(STAGES[stageIndex])}
                  </span>
                  <span data-part="due" data-late={late ? "true" : "false"}>
                    {dueLabel}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
