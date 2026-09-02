import type { CSSProperties } from "react"

export type Solutions047Document = {
  number: string
  date: string
  /** Вид документа: печатается как есть, словарь языка живёт в данных. */
  kind: string
  ourAmount: number
  theirAmount: number
}

export type Solutions047Props = {
  title?: string
  counterparty?: string
  period?: string
  documents?: Solutions047Document[]
  /** Подписи сводных плиток: ours, theirs. */
  statsText?: Record<string, string>
  /** Подписи сальдо: even, us, them. */
  balanceText?: Record<string, string>
  /** Заголовки колонок: document, date, ours, theirs, diff, status. */
  columnText?: Record<string, string>
  /** Подписи строк: match, diff. */
  statusText?: Record<string, string>
  /** Буквы в кружке статуса: те же ключи, что и в statusText. */
  statusLetter?: Record<string, string>
  /** Итоговая строка. {mismatch} и {total} — числа документов. */
  foot?: string
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
// Идея блока: акт сверки взаиморасчётов. Расхождение и итоговое сальдо не
// приходят пропом с готовой меткой — они считаются построчно и по сумме,
// потому что источник правды — сами обороты, а не чья-то интерпретация.
// Строка с расхождением помечена левой полосой и буквой статуса, а не только
// цветом суммы: так различие видно и без цветовосприятия. В чью пользу
// итоговое сальдо — тоже вывод из чисел, а не отдельный текстовый проп.
const STYLES = `
:where([data-vibeui-block="solutions-047"]){
--vibeui-solutions-047-bg:transparent;
--vibeui-solutions-047-panel:light-dark(oklch(0.977 0.004 250),oklch(0.27 0.011 265));
--vibeui-solutions-047-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-047-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.012 265));
--vibeui-solutions-047-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-solutions-047-accent:light-dark(oklch(0.5 0.17 265),oklch(0.72 0.15 265));
--vibeui-solutions-047-match:light-dark(oklch(0.55 0.14 152),oklch(0.72 0.14 152));
--vibeui-solutions-047-diff:light-dark(oklch(0.6 0.19 40),oklch(0.76 0.16 40));
--vibeui-solutions-047-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-047-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-047"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-047-bg);
border:1px solid var(--vibeui-solutions-047-border);border-radius:1rem;
font-family:var(--vibeui-solutions-047-sans);color:var(--vibeui-solutions-047-fg);
}
[data-vibeui-block="solutions-047"] *{box-sizing:border-box}
[data-vibeui-block="solutions-047"] [data-part="head"]{
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-047"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-047"] [data-part="sub"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-047-muted)}
/* Три сводных числа: без них сальдо считают в уме по строкам таблицы. */
[data-vibeui-block="solutions-047"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-047"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-047-panel);
border:1px solid var(--vibeui-solutions-047-border);
}
[data-vibeui-block="solutions-047"] [data-tile="balance"][data-favor="us"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-047-match) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-047-match) 8%,var(--vibeui-solutions-047-bg));
}
[data-vibeui-block="solutions-047"] [data-tile="balance"][data-favor="them"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-047-diff) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-047-diff) 8%,var(--vibeui-solutions-047-bg));
}
[data-vibeui-block="solutions-047"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-047"] [data-tile="balance"][data-favor="us"] b{color:var(--vibeui-solutions-047-match)}
[data-vibeui-block="solutions-047"] [data-tile="balance"][data-favor="them"] b{color:var(--vibeui-solutions-047-diff)}
[data-vibeui-block="solutions-047"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-047-muted);
}
[data-vibeui-block="solutions-047"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-047"] table{width:100%;min-width:38rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-047"] th,
[data-vibeui-block="solutions-047"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-047-border);
}
[data-vibeui-block="solutions-047"] th:first-child,
[data-vibeui-block="solutions-047"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-047"] th:last-child,
[data-vibeui-block="solutions-047"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-047"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-047-muted);background:var(--vibeui-solutions-047-panel);
}
[data-vibeui-block="solutions-047"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-047"] [data-part="doc"]{
display:block;font-family:var(--vibeui-solutions-047-mono);font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="solutions-047"] [data-part="kind"]{
display:block;font-size:0.6875rem;color:var(--vibeui-solutions-047-muted);
}
/* Расхождение — полоса слева, не только цвет числа. */
[data-vibeui-block="solutions-047"] [data-status="diff"] td:first-child{
box-shadow:inset 3px 0 0 0 var(--vibeui-solutions-047-diff);
}
[data-vibeui-block="solutions-047"] [data-align="diff"]{
text-align:right;font-variant-numeric:tabular-nums;font-weight:650;
}
[data-vibeui-block="solutions-047"] [data-status="diff"] [data-align="diff"]{color:var(--vibeui-solutions-047-diff)}
[data-vibeui-block="solutions-047"] [data-status="match"] [data-align="diff"]{color:var(--vibeui-solutions-047-muted)}
[data-vibeui-block="solutions-047"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.125rem 0.5rem 0.125rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-047-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-047-muted);
}
[data-vibeui-block="solutions-047"] [data-part="letter"]{
width:1rem;height:1rem;border-radius:9999px;display:grid;place-items:center;
background:var(--vibeui-solutions-047-panel);font-size:0.5625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="solutions-047"] [data-status="match"] [data-part="status"]{
color:var(--vibeui-solutions-047-match);
border-color:color-mix(in oklab,var(--vibeui-solutions-047-match) 50%,transparent);
}
[data-vibeui-block="solutions-047"] [data-status="match"] [data-part="letter"]{
background:var(--vibeui-solutions-047-match);color:oklch(1 0 0);
}
[data-vibeui-block="solutions-047"] [data-status="diff"] [data-part="status"]{
color:var(--vibeui-solutions-047-diff);
border-color:color-mix(in oklab,var(--vibeui-solutions-047-diff) 50%,transparent);
}
[data-vibeui-block="solutions-047"] [data-status="diff"] [data-part="letter"]{
background:var(--vibeui-solutions-047-diff);color:oklch(1 0 0);
}
[data-vibeui-block="solutions-047"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-047-muted);
}
/* Сводка от собственной ширины: в узкой карточке три колонки нечитаемы. */
@container (max-width: 30rem){
[data-vibeui-block="solutions-047"] [data-part="summary"]{grid-template-columns:minmax(0,1fr);gap:0.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-047"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DOCUMENTS: Solutions047Document[] = [
  {
    number: "ТН-0512",
    date: "14 янв",
    kind: "накладная",
    ourAmount: 184000,
    theirAmount: 184000,
  },
  {
    number: "ТН-0518",
    date: "22 янв",
    kind: "накладная",
    ourAmount: 96500,
    theirAmount: 89500,
  },
  {
    number: "СЧ-0044",
    date: "5 фев",
    kind: "счёт",
    ourAmount: 212000,
    theirAmount: 212000,
  },
  {
    number: "ТН-0531",
    date: "11 фев",
    kind: "накладная",
    ourAmount: 58000,
    theirAmount: 58000,
  },
  {
    number: "ВЗ-0009",
    date: "19 фев",
    kind: "возврат",
    ourAmount: -14200,
    theirAmount: -14200,
  },
  {
    number: "ТН-0546",
    date: "2 мар",
    kind: "накладная",
    ourAmount: 133400,
    theirAmount: 121400,
  },
  {
    number: "СЧ-0051",
    date: "18 мар",
    kind: "счёт",
    ourAmount: 77000,
    theirAmount: 77000,
  },
  {
    number: "ТН-0559",
    date: "27 мар",
    kind: "накладная",
    ourAmount: 45900,
    theirAmount: 45900,
  },
]

const STATS_LABEL: Record<string, string> = {
  ours: "обороты по нашим данным",
  theirs: "обороты по данным контрагента",
}

const BALANCE_LABEL: Record<string, string> = {
  even: "сальдо сходится",
  us: "сальдо в нашу пользу",
  them: "сальдо в пользу контрагента",
}

const COLUMN_LABEL: Record<string, string> = {
  document: "Документ",
  date: "Дата",
  ours: "По нам",
  theirs: "По контрагенту",
  diff: "Расхождение",
  status: "Статус",
}

const STATUS_LABEL: Record<string, string> = {
  match: "совпадает",
  diff: "расхождение",
}

const STATUS_LETTER: Record<string, string> = {
  match: "С",
  diff: "Р",
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
 * Акт сверки взаиморасчётов: расхождение и итоговое сальдо считаются из
 * оборотов построчно, а не приходят готовой меткой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions047({
  title = "Акт сверки взаиморасчётов",
  counterparty = "ООО «Верста Логистика»",
  period = "I квартал 2024 · 1 января — 31 марта",
  documents = DEFAULT_DOCUMENTS,
  statsText = STATS_LABEL,
  balanceText = BALANCE_LABEL,
  columnText = COLUMN_LABEL,
  statusText = STATUS_LABEL,
  statusLetter = STATUS_LETTER,
  foot = "Расхождение найдено в {mismatch} из {total} документов. Сверьте позиции с отметкой «расхождение» до подписания акта.",
  currency = "₽",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions047Props) {
  const money = (value: number) => {
    const sign = value < 0 ? "−" : ""
    return `${sign}${Math.abs(value).toLocaleString(locale)} ${currency}`
  }
  const column = (key: string) => columnText[key] ?? COLUMN_LABEL[key]
  const ourTotal = documents.reduce((sum, doc) => sum + doc.ourAmount, 0)
  const theirTotal = documents.reduce((sum, doc) => sum + doc.theirAmount, 0)
  const balance = ourTotal - theirTotal
  const favor = balance > 0 ? "us" : balance < 0 ? "them" : "even"
  const mismatchCount = documents.filter(
    (doc) => doc.ourAmount !== doc.theirAmount,
  ).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-047-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-047-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-047" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-047"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <p data-part="sub">
            {counterparty} · {period}
          </p>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{money(ourTotal)}</b>
            <span>{statsText.ours ?? STATS_LABEL.ours}</span>
          </p>
          <p data-part="tile">
            <b>{money(theirTotal)}</b>
            <span>{statsText.theirs ?? STATS_LABEL.theirs}</span>
          </p>
          <p
            data-part="tile"
            data-tile="balance"
            data-favor={favor === "even" ? "us" : favor}
          >
            <b>{money(balance)}</b>
            <span>{balanceText[favor] ?? BALANCE_LABEL[favor]}</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">{column("document")}</th>
                <th scope="col">{column("date")}</th>
                <th scope="col" data-align="end">
                  {column("ours")}
                </th>
                <th scope="col" data-align="end">
                  {column("theirs")}
                </th>
                <th scope="col" data-align="end">
                  {column("diff")}
                </th>
                <th scope="col">{column("status")}</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => {
                const diff = doc.ourAmount - doc.theirAmount
                const status = diff === 0 ? "match" : "diff"
                return (
                  <tr key={doc.number} data-status={status}>
                    <td>
                      <span data-part="doc">{doc.number}</span>
                      <span data-part="kind">{doc.kind}</span>
                    </td>
                    <td>{doc.date}</td>
                    <td data-align="end">{money(doc.ourAmount)}</td>
                    <td data-align="end">{money(doc.theirAmount)}</td>
                    <td data-align="diff">{diff === 0 ? "—" : money(diff)}</td>
                    <td>
                      <span data-part="status">
                        <span data-part="letter" aria-hidden="true">
                          {statusLetter[status] ?? STATUS_LETTER[status]}
                        </span>
                        {statusText[status] ?? STATUS_LABEL[status]}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p data-part="foot">
          {foot
            .replace("{mismatch}", String(mismatchCount))
            .replace("{total}", String(documents.length))}
        </p>
      </section>
    </>
  )
}
