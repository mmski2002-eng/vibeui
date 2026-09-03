import type { CSSProperties } from "react"

export type Solutions029Order = {
  number: string
  product: string
  shop: string
  planQty: number
  producedQty: number
  stage: number
  dueDate: string
  lineLoad: number
}

export type Solutions029Props = {
  title?: string
  hint?: string
  stages?: string[]
  orders?: Solutions029Order[]
  /** Подписи плиток сводки: orders, load, behind. */
  summaryText?: Record<string, string>
  progressLabel?: string
  /** Строка справа от «Выполнено». {done}, {plan} и {left} — числа. */
  progressValue?: string
  loadLabel?: string
  /** Скрытая подпись полосы плана. {number} — номер заказа. */
  progressAriaLabel?: string
  /** Скрытая подпись полосы загрузки. {number} — номер заказа. */
  loadAriaLabel?: string
  /** Строка отгрузки. {date} — дата. */
  dueText?: string
  footNote?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: производственные заказы по цехам. Процент выполнения плана и
// остаток к выпуску считаются из planQty/producedQty в компоненте, а не
// приходят готовой строкой — план и факт легко разойдутся, если их писать
// руками отдельно. Стадия обработки — не текст, а горизонтальный степпер из
// точек: видно не только «где заказ сейчас», но и сколько шагов осталось.
// Загрузка линии — вторая, отдельная полоса: путать её с выполнением плана
// нельзя, они про разные вещи и могут расходиться в любую сторону.
const STYLES = `
:where([data-vibeui-block="solutions-029"]){
--vibeui-solutions-029-bg:transparent;
--vibeui-solutions-029-panel:light-dark(oklch(0.977 0.004 255),oklch(0.27 0.011 265));
--vibeui-solutions-029-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-029-muted:light-dark(oklch(0.54 0.014 265),oklch(0.69 0.012 265));
--vibeui-solutions-029-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-solutions-029-accent:light-dark(oklch(0.52 0.16 255),oklch(0.74 0.14 255));
--vibeui-solutions-029-behind:light-dark(oklch(0.6 0.18 40),oklch(0.74 0.16 40));
--vibeui-solutions-029-load:light-dark(oklch(0.6 0.14 300),oklch(0.75 0.13 300));
--vibeui-solutions-029-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-029"]{color-scheme:dark}
[data-vibeui-block="solutions-029"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-029-bg);
border:1px solid var(--vibeui-solutions-029-border);border-radius:1rem;
font-family:var(--vibeui-solutions-029-sans);color:var(--vibeui-solutions-029-fg);
}
[data-vibeui-block="solutions-029"] *{box-sizing:border-box}
[data-vibeui-block="solutions-029"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-029"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-029"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-029-muted)}
[data-vibeui-block="solutions-029"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-029"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-029-panel);border:1px solid var(--vibeui-solutions-029-border);
}
[data-vibeui-block="solutions-029"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-029"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-029-muted);
}
[data-vibeui-block="solutions-029"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-029"] [data-part="cards"]{
display:flex;flex-direction:column;gap:0.625rem;padding:0 1rem 1rem;min-width:38rem;
margin:0;list-style:none;
}
[data-vibeui-block="solutions-029"] [data-part="card"]{
display:grid;gap:0.5rem 1rem;padding:0.75rem 0.875rem;border-radius:0.75rem;
border:1px solid var(--vibeui-solutions-029-border);
grid-template-columns:minmax(11rem,1fr) minmax(12rem,1.2fr) minmax(9rem,1fr);
}
[data-vibeui-block="solutions-029"] [data-behind="true"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-029-behind) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-029-behind) 6%,var(--vibeui-solutions-029-bg));
}
[data-vibeui-block="solutions-029"] [data-part="number"]{
display:block;font-size:0.625rem;color:var(--vibeui-solutions-029-muted);
}
[data-vibeui-block="solutions-029"] [data-part="product"]{display:block;font-weight:650;font-size:0.875rem}
[data-vibeui-block="solutions-029"] [data-part="shop"]{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-029-muted);
}
/* Степпер стадий: точки, а не слово — видно, сколько шагов осталось. */
[data-vibeui-block="solutions-029"] [data-part="stages"]{
display:flex;align-items:center;gap:0.25rem;margin:0.375rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="solutions-029"] [data-part="stages"] li{
display:flex;align-items:center;gap:0.25rem;flex:1;font-size:0.5625rem;color:var(--vibeui-solutions-029-muted);
}
[data-vibeui-block="solutions-029"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:9999px;flex:none;
background:var(--vibeui-solutions-029-border);
}
[data-vibeui-block="solutions-029"] [data-part="stages"] li[data-done="true"] [data-part="dot"]{
background:var(--vibeui-solutions-029-accent);
}
[data-vibeui-block="solutions-029"] [data-part="stages"] li[data-current="true"]{
color:var(--vibeui-solutions-029-fg);font-weight:650;
}
[data-vibeui-block="solutions-029"] [data-part="stages"] li[data-current="true"] [data-part="dot"]{
outline:2px solid color-mix(in oklab,var(--vibeui-solutions-029-accent) 45%,transparent);outline-offset:2px;
}
[data-vibeui-block="solutions-029"] [data-part="stages"] li + li::before{
content:"";flex:1;height:1px;background:var(--vibeui-solutions-029-border);
}
[data-vibeui-block="solutions-029"] [data-part="meter"]{
display:flex;flex-direction:column;gap:0.25rem;
}
[data-vibeui-block="solutions-029"] [data-part="meter"] span[data-part="label"]{
display:flex;justify-content:space-between;font-size:0.6875rem;color:var(--vibeui-solutions-029-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-029"] [data-part="track"]{
position:relative;height:0.4375rem;border-radius:9999px;background:var(--vibeui-solutions-029-panel);
border:1px solid var(--vibeui-solutions-029-border);overflow:hidden;
}
[data-vibeui-block="solutions-029"] [data-part="fill"]{
position:absolute;inset:0;width:var(--vibeui-solutions-029-fill,0%);
border-radius:9999px;background:var(--vibeui-solutions-029-accent);
}
[data-vibeui-block="solutions-029"] [data-part="fill"][data-part-kind="load"]{
background:var(--vibeui-solutions-029-load);
}
[data-vibeui-block="solutions-029"] [data-part="due"]{
font-size:0.75rem;color:var(--vibeui-solutions-029-muted);
}
[data-vibeui-block="solutions-029"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-029-muted);
}
@container (min-width: 46rem){
[data-vibeui-block="solutions-029"] [data-part="card"]{
grid-template-columns:minmax(11rem,0.9fr) minmax(14rem,1.3fr) minmax(9rem,0.8fr) auto;align-items:center;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-029"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STAGES = [
  "Заготовка",
  "Обработка",
  "Сборка",
  "Контроль",
  "Готово",
]

const DEFAULT_ORDERS: Solutions029Order[] = [
  {
    number: "ПЗ-3141",
    product: "Редуктор РЦД-250, партия 40 шт",
    shop: "Цех механообработки №1",
    planQty: 40,
    producedQty: 34,
    stage: 3,
    dueDate: "6 марта",
    lineLoad: 88,
  },
  {
    number: "ПЗ-3147",
    product: "Вал приводной ВП-12, партия 60 шт",
    shop: "Цех механообработки №2",
    planQty: 60,
    producedQty: 12,
    stage: 1,
    dueDate: "9 марта",
    lineLoad: 64,
  },
  {
    number: "ПЗ-3152",
    product: "Корпус насоса КН-08, партия 25 шт",
    shop: "Литейный цех",
    planQty: 25,
    producedQty: 25,
    stage: 4,
    dueDate: "4 марта",
    lineLoad: 40,
  },
  {
    number: "ПЗ-3156",
    product: "Муфта соединительная МС-40, партия 100 шт",
    shop: "Цех сборки",
    planQty: 100,
    producedQty: 22,
    stage: 2,
    dueDate: "7 марта",
    lineLoad: 96,
  },
  {
    number: "ПЗ-3160",
    product: "Крышка защитная КЗ-19, партия 80 шт",
    shop: "Цех штамповки",
    planQty: 80,
    producedQty: 5,
    stage: 0,
    dueDate: "11 марта",
    lineLoad: 52,
  },
]

const SUMMARY_LABEL: Record<string, string> = {
  orders: "заказов в цехах",
  load: "средняя загрузка линий",
  behind: "отстают от плана",
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
 * Производственные заказы: процент выполнения плана считается из плана и
 * факта, стадия — степпер точек, загрузка линии — отдельная полоса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions029({
  title = "Заказы в производстве",
  hint = "Механосборочный участок · смена сегодня",
  stages = DEFAULT_STAGES,
  orders = DEFAULT_ORDERS,
  summaryText = SUMMARY_LABEL,
  progressLabel = "Выполнено",
  progressValue = "{done} из {plan} шт · осталось {left}",
  loadLabel = "Загрузка линии",
  progressAriaLabel = "Выполнение плана по заказу {number}",
  loadAriaLabel = "Загрузка линии заказа {number}",
  dueText = "Отгрузка: {date}",
  footNote = "Выполнение плана и загрузка линии — разные полосы: заказ может идти по графику при перегруженной линии и наоборот.",
  accent,
  background = "",
  className,
  style,
}: Solutions029Props) {
  const avgLoad = Math.round(
    orders.reduce((sum, order) => sum + order.lineLoad, 0) /
      (orders.length || 1),
  )
  const behindCount = orders.filter((order) => {
    const progress = order.planQty ? order.producedQty / order.planQty : 1
    const stageShare = stages.length > 1 ? order.stage / (stages.length - 1) : 1
    return progress + 0.15 < stageShare
  }).length

  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]

  const palette = {
    ...(accent ? { "--vibeui-solutions-029-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-029-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-029" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-029"
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
            <b>{orders.length}</b>
            <span>{summary("orders")}</span>
          </p>
          <p data-part="tile">
            <b>{avgLoad}%</b>
            <span>{summary("load")}</span>
          </p>
          <p data-part="tile">
            <b>{behindCount}</b>
            <span>{summary("behind")}</span>
          </p>
        </div>

        <div data-part="scroll">
          <ul data-part="cards">
            {orders.map((order) => {
              const remaining = Math.max(0, order.planQty - order.producedQty)
              const progress = order.planQty
                ? Math.min(
                    100,
                    Math.round((order.producedQty / order.planQty) * 100),
                  )
                : 0
              const stageShare =
                stages.length > 1 ? order.stage / (stages.length - 1) : 1
              const behind = progress / 100 + 0.15 < stageShare

              return (
                <li
                  data-part="card"
                  key={order.number}
                  data-behind={behind ? "true" : "false"}
                >
                  <div>
                    <span data-part="number">{order.number}</span>
                    <span data-part="product">{order.product}</span>
                    <span data-part="shop">{order.shop}</span>
                    <ol data-part="stages">
                      {stages.map((stage, index) => (
                        <li
                          key={stage}
                          data-done={index <= order.stage ? "true" : "false"}
                          data-current={
                            index === order.stage ? "true" : "false"
                          }
                        >
                          <span data-part="dot" aria-hidden="true" />
                          {index === order.stage ? stage : null}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div data-part="meter">
                    <span data-part="label">
                      <span>{progressLabel}</span>
                      <span>
                        {progressValue
                          .replace("{done}", String(order.producedQty))
                          .replace("{plan}", String(order.planQty))
                          .replace("{left}", String(remaining))}
                      </span>
                    </span>
                    <span
                      data-part="track"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={progressAriaLabel.replace(
                        "{number}",
                        order.number,
                      )}
                    >
                      <span
                        data-part="fill"
                        style={{
                          ["--vibeui-solutions-029-fill" as string]: `${progress}%`,
                        }}
                      />
                    </span>
                    <span data-part="label">
                      <span>{loadLabel}</span>
                      <span>{order.lineLoad}%</span>
                    </span>
                    <span
                      data-part="track"
                      role="progressbar"
                      aria-valuenow={order.lineLoad}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={loadAriaLabel.replace(
                        "{number}",
                        order.number,
                      )}
                    >
                      <span
                        data-part="fill"
                        data-part-kind="load"
                        style={{
                          ["--vibeui-solutions-029-fill" as string]: `${order.lineLoad}%`,
                        }}
                      />
                    </span>
                  </div>

                  <p data-part="due">
                    {dueText.replace("{date}", order.dueDate)}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>

        <p data-part="foot">{footNote}</p>
      </section>
    </>
  )
}
