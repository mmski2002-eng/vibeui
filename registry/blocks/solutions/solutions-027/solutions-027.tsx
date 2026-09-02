import type { CSSProperties } from "react"

export type Solutions027Asset = {
  code: string
  name: string
  group: string
  commissioned: string
  usefulLifeYears: number
  balanceValue: number
  accumulatedDepreciation: number
}

export type Solutions027Props = {
  title?: string
  hint?: string
  assets?: Solutions027Asset[]
  /** Подписи плиток сводки: balance, depreciation, residual. */
  summaryText?: Record<string, string>
  /** Заголовки колонок таблицы. */
  columnText?: Record<string, string>
  /** Срок полезного использования. {years} — число лет. */
  yearsText?: string
  /** Подписи состояний: ok, warn, risk. */
  stateText?: Record<string, string>
  /** Скрытая подпись полосы износа. {name} — название объекта. */
  wearLabel?: string
  footNote?: string
  currency?: string
  /** Локаль форматирования чисел. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: реестр основных средств. Остаточная стоимость и процент износа
// не приходят готовыми метками — считаются из баланса и накопленной
// амортизации прямо в компоненте, чтобы цифры в реестре не могли разойтись
// между собой. Износ нарисован полосой в самой строке, а не отдельным
// столбцом: сравнивать объекты по длине полосы быстрее, чем по числу. Три
// уровня состояния (в работе / высокий износ / к списанию) различаются не
// только цветом полосы, но и формой метки и словом рядом с ней.
const STYLES = `
:where([data-vibeui-block="solutions-027"]){
--vibeui-solutions-027-bg:transparent;
--vibeui-solutions-027-panel:light-dark(oklch(0.977 0.004 255),oklch(0.27 0.011 265));
--vibeui-solutions-027-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-027-muted:light-dark(oklch(0.54 0.014 265),oklch(0.69 0.012 265));
--vibeui-solutions-027-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-solutions-027-accent:light-dark(oklch(0.5 0.15 250),oklch(0.73 0.13 250));
--vibeui-solutions-027-ok:light-dark(oklch(0.55 0.14 152),oklch(0.7 0.14 152));
--vibeui-solutions-027-warn:light-dark(oklch(0.64 0.15 75),oklch(0.79 0.14 75));
--vibeui-solutions-027-risk:light-dark(oklch(0.57 0.19 25),oklch(0.71 0.17 25));
--vibeui-solutions-027-mark-fg:light-dark(oklch(1 0 0),oklch(0.19 0.014 265));
--vibeui-solutions-027-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-027-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-027"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-027-bg);
border:1px solid var(--vibeui-solutions-027-border);border-radius:1rem;
font-family:var(--vibeui-solutions-027-sans);color:var(--vibeui-solutions-027-fg);
}
[data-vibeui-block="solutions-027"] *{box-sizing:border-box}
[data-vibeui-block="solutions-027"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-027"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-027"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-027-muted)}
[data-vibeui-block="solutions-027"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-027"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-027-panel);
border:1px solid var(--vibeui-solutions-027-border);
}
[data-vibeui-block="solutions-027"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-027"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-027-muted);
}
[data-vibeui-block="solutions-027"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-027"] table{width:100%;min-width:44rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-027"] th,
[data-vibeui-block="solutions-027"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;vertical-align:middle;
border-top:1px solid var(--vibeui-solutions-027-border);
}
[data-vibeui-block="solutions-027"] th:first-child,
[data-vibeui-block="solutions-027"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-027"] th:last-child,
[data-vibeui-block="solutions-027"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-027"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-027-muted);background:var(--vibeui-solutions-027-panel);
}
[data-vibeui-block="solutions-027"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-027"] [data-part="code"]{
font-family:var(--vibeui-solutions-027-mono);font-size:0.75rem;color:var(--vibeui-solutions-027-muted);
}
[data-vibeui-block="solutions-027"] [data-part="name"]{display:block;font-weight:650}
[data-vibeui-block="solutions-027"] [data-part="group"]{display:block;font-size:0.6875rem;color:var(--vibeui-solutions-027-muted)}
/* Полоса износа считается из баланса и амортизации, а не приходит меткой. */
[data-vibeui-block="solutions-027"] [data-part="wear"]{
display:flex;align-items:center;gap:0.5rem;min-width:9rem;
}
[data-vibeui-block="solutions-027"] [data-part="meter"]{
position:relative;flex:1;height:0.5rem;border-radius:9999px;
background:var(--vibeui-solutions-027-panel);border:1px solid var(--vibeui-solutions-027-border);
overflow:hidden;
}
[data-vibeui-block="solutions-027"] [data-part="fill"]{
position:absolute;inset:0;width:var(--vibeui-solutions-027-fill,0%);
border-radius:9999px;background:var(--vibeui-solutions-027-ok);
}
[data-vibeui-block="solutions-027"] [data-state="warn"] [data-part="fill"]{background:var(--vibeui-solutions-027-warn)}
[data-vibeui-block="solutions-027"] [data-state="risk"] [data-part="fill"]{background:var(--vibeui-solutions-027-risk)}
[data-vibeui-block="solutions-027"] [data-part="wear-value"]{
flex:none;font-size:0.6875rem;font-variant-numeric:tabular-nums;color:var(--vibeui-solutions-027-muted);
}
/* Состояние: форма и слово различают уровень, не только цвет заливки. */
[data-vibeui-block="solutions-027"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-027-ok);
}
[data-vibeui-block="solutions-027"] [data-part="mark"]{
width:0.875rem;height:0.875rem;flex:none;display:grid;place-items:center;
border-radius:9999px;background:var(--vibeui-solutions-027-ok);
color:var(--vibeui-solutions-027-mark-fg);
font-size:0.5625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="solutions-027"] [data-state="warn"] [data-part="state"]{color:var(--vibeui-solutions-027-warn)}
[data-vibeui-block="solutions-027"] [data-state="warn"] [data-part="mark"]{
background:var(--vibeui-solutions-027-warn);border-radius:0.25rem;
}
[data-vibeui-block="solutions-027"] [data-state="risk"] [data-part="state"]{color:var(--vibeui-solutions-027-risk)}
[data-vibeui-block="solutions-027"] [data-state="risk"] [data-part="mark"]{
background:var(--vibeui-solutions-027-risk);border-radius:0.1875rem;transform:rotate(45deg);
}
[data-vibeui-block="solutions-027"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-027-muted);
}
/* Сводка от собственной ширины: в узкой карточке три колонки нечитаемы. */
@container (max-width: 30rem){
[data-vibeui-block="solutions-027"] [data-part="summary"]{grid-template-columns:minmax(0,1fr);gap:0.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-027"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ASSETS: Solutions027Asset[] = [
  {
    code: "ОС-00114",
    name: "Погрузчик Toyota 8FG25",
    group: "Транспорт и погрузочная техника",
    commissioned: "12.04.2019",
    usefulLifeYears: 8,
    balanceValue: 2_450_000,
    accumulatedDepreciation: 2_180_000,
  },
  {
    code: "ОС-00126",
    name: "Линия упаковки Bosch Sigma",
    group: "Производственное оборудование",
    commissioned: "03.09.2021",
    usefulLifeYears: 12,
    balanceValue: 8_900_000,
    accumulatedDepreciation: 2_670_000,
  },
  {
    code: "ОС-00133",
    name: "Сервер Dell PowerEdge R740",
    group: "Вычислительная техника",
    commissioned: "22.01.2022",
    usefulLifeYears: 5,
    balanceValue: 620_000,
    accumulatedDepreciation: 372_000,
  },
  {
    code: "ОС-00098",
    name: "Станок токарный ДИП-500",
    group: "Производственное оборудование",
    commissioned: "17.06.2015",
    usefulLifeYears: 15,
    balanceValue: 3_100_000,
    accumulatedDepreciation: 2_945_000,
  },
  {
    code: "ОС-00141",
    name: "Автомобиль Ford Transit",
    group: "Транспорт и погрузочная техника",
    commissioned: "05.11.2023",
    usefulLifeYears: 7,
    balanceValue: 3_350_000,
    accumulatedDepreciation: 478_000,
  },
]

const SUMMARY_LABEL: Record<string, string> = {
  balance: "балансовая стоимость",
  depreciation: "накопленная амортизация",
  residual: "остаточная стоимость",
}

const COLUMN_LABEL: Record<string, string> = {
  asset: "Объект",
  group: "Группа",
  commissioned: "Введён в эксплуатацию",
  life: "Срок ПИ",
  balance: "Баланс",
  wear: "Износ",
  residual: "Остаточная",
  state: "Состояние",
}

const STATE_LABEL: Record<string, string> = {
  ok: "в работе",
  warn: "высокий износ",
  risk: "к списанию",
}

function wearState(percent: number): { key: "ok" | "warn" | "risk"; mark: string } {
  if (percent >= 90) return { key: "risk", mark: "!" }
  if (percent >= 65) return { key: "warn", mark: "▲" }
  return { key: "ok", mark: "•" }
}

const money = (value: number, currency: string, locale: string) =>
  `${Math.round(value).toLocaleString(locale)} ${currency}`

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
 * Реестр основных средств: остаточная стоимость и износ считаются из баланса
 * и накопленной амортизации, а не приходят готовыми числами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions027({
  title = "Основные средства",
  hint = "Склад №2 · инвентаризация на 1 марта 2026",
  assets = DEFAULT_ASSETS,
  summaryText = SUMMARY_LABEL,
  columnText = COLUMN_LABEL,
  yearsText = "{years} лет",
  stateText = STATE_LABEL,
  wearLabel = "Износ {name}",
  footNote = "Остаточная стоимость и износ пересчитываются из баланса и накопленной амортизации построчно — сумма реестра не может разойтись с таблицей.",
  currency = "₽",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions027Props) {
  const totalBalance = assets.reduce(
    (sum, asset) => sum + asset.balanceValue,
    0,
  )
  const totalDepreciation = assets.reduce(
    (sum, asset) => sum + asset.accumulatedDepreciation,
    0,
  )
  const totalResidual = totalBalance - totalDepreciation
  const column = (key: string) => columnText[key] ?? COLUMN_LABEL[key]
  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]

  const palette = {
    ...(accent ? { "--vibeui-solutions-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-027-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-027" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-027"
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
            <b>{money(totalBalance, currency, locale)}</b>
            <span>{summary("balance")}</span>
          </p>
          <p data-part="tile">
            <b>{money(totalDepreciation, currency, locale)}</b>
            <span>{summary("depreciation")}</span>
          </p>
          <p data-part="tile">
            <b>{money(totalResidual, currency, locale)}</b>
            <span>{summary("residual")}</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">{column("asset")}</th>
                <th scope="col">{column("group")}</th>
                <th scope="col">{column("commissioned")}</th>
                <th scope="col" data-align="end">
                  {column("life")}
                </th>
                <th scope="col" data-align="end">
                  {column("balance")}
                </th>
                <th scope="col">{column("wear")}</th>
                <th scope="col" data-align="end">
                  {column("residual")}
                </th>
                <th scope="col">{column("state")}</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const residual =
                  asset.balanceValue - asset.accumulatedDepreciation
                const percent = asset.balanceValue
                  ? Math.min(
                      100,
                      Math.round(
                        (asset.accumulatedDepreciation / asset.balanceValue) *
                          100,
                      ),
                    )
                  : 0
                const state = wearState(percent)

                return (
                  <tr key={asset.code} data-state={state.key}>
                    <td>
                      <span data-part="code">{asset.code}</span>
                      <span data-part="name">{asset.name}</span>
                    </td>
                    <td>
                      <span data-part="group">{asset.group}</span>
                    </td>
                    <td>{asset.commissioned}</td>
                    <td data-align="end">
                      {yearsText.replace(
                        "{years}",
                        String(asset.usefulLifeYears),
                      )}
                    </td>
                    <td data-align="end">
                      {money(asset.balanceValue, currency, locale)}
                    </td>
                    <td>
                      <span data-part="wear">
                        <span
                          data-part="meter"
                          role="progressbar"
                          aria-valuenow={percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={wearLabel.replace("{name}", asset.name)}
                        >
                          <span
                            data-part="fill"
                            style={{
                              ["--vibeui-solutions-027-fill" as string]: `${percent}%`,
                            }}
                          />
                        </span>
                        <span data-part="wear-value">{percent}%</span>
                      </span>
                    </td>
                    <td data-align="end">
                      {money(residual, currency, locale)}
                    </td>
                    <td>
                      <span data-part="state">
                        <span data-part="mark" aria-hidden="true">
                          {state.mark}
                        </span>
                        {stateText[state.key] ?? STATE_LABEL[state.key]}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p data-part="foot">{footNote}</p>
      </section>
    </>
  )
}
