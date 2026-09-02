import type { CSSProperties } from "react"

export type Solutions010Month = {
  label: string
  parts: number[]
}

export type Solutions010Segment = {
  name: string
  total: string
  share: number
}

export type Solutions010Props = {
  title?: string
  period?: string
  total?: string
  delta?: string
  segments?: Solutions010Segment[]
  months?: Solutions010Month[]
  unit?: string
  /** Шапка таблицы: ключи segment, revenue, share. */
  columnText?: Record<string, string>
  /** Подпись графика, {period} и {total} — период и итог. */
  chartLabelText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: отчёт по выручке с разбивкой. Столбик каждого месяца собран из
// сегментов, а высота считается от самого большого месяца, поэтому сравниваются
// и итог, и состав одновременно — двух графиков для этого не нужно.
// Сегменты различаются не только оттенком: у каждого своя штриховка через
// repeating-linear-gradient, иначе на печати и при дальтонизме стек — одна
// серая колонка. Таблица под графиком повторяет те же сегменты цифрами:
// столбик отвечает на «как менялось», таблица — на «сколько именно».
const STYLES = `
:where([data-vibeui-block="solutions-010"]){
--vibeui-solutions-010-bg:transparent;
--vibeui-solutions-010-panel:light-dark(oklch(0.98 0.003 250),oklch(0.27 0.011 255));
--vibeui-solutions-010-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-010-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-solutions-010-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-solutions-010-accent:light-dark(oklch(0.5 0.19 275),oklch(0.68 0.17 275));
--vibeui-solutions-010-s2:light-dark(oklch(0.63 0.15 200),oklch(0.7 0.13 200));
--vibeui-solutions-010-s3:light-dark(oklch(0.72 0.13 145),oklch(0.76 0.12 145));
--vibeui-solutions-010-s4:light-dark(oklch(0.8 0.07 265),oklch(0.66 0.07 265));
--vibeui-solutions-010-hatch-a:light-dark(oklch(1 0 0 / 22%),oklch(0.16 0.012 265 / 30%));
--vibeui-solutions-010-hatch-b:light-dark(oklch(1 0 0 / 30%),oklch(0.16 0.012 265 / 34%));
--vibeui-solutions-010-hatch-c:light-dark(oklch(1 0 0 / 40%),oklch(0.16 0.012 265 / 40%));
--vibeui-solutions-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-010"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-010-bg);
border:1px solid var(--vibeui-solutions-010-border);border-radius:1rem;
font-family:var(--vibeui-solutions-010-sans);color:var(--vibeui-solutions-010-fg);
}
[data-vibeui-block="solutions-010"] *{box-sizing:border-box}
[data-vibeui-block="solutions-010"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="solutions-010"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-010"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-010-muted)}
[data-vibeui-block="solutions-010"] [data-part="total"]{
margin:0;font-size:1.75rem;font-weight:700;letter-spacing:-0.025em;
font-variant-numeric:tabular-nums;line-height:1.05;
}
[data-vibeui-block="solutions-010"] [data-part="delta"]{
display:block;text-align:right;font-size:0.6875rem;font-weight:600;color:var(--vibeui-solutions-010-s3);
}
[data-vibeui-block="solutions-010"] [data-part="chart"]{
display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:0.375rem;
align-items:end;height:9rem;margin:1rem 0 0.5rem;
}
@container (min-width: 44rem){
[data-vibeui-block="solutions-010"] [data-part="chart"]{height:12rem;gap:0.625rem}
}
[data-vibeui-block="solutions-010"] [data-part="col"]{
display:flex;flex-direction:column;justify-content:flex-end;height:100%;gap:0.3125rem;
}
/* Высота столбика — от самого большого месяца: итог и состав видно разом. */
[data-vibeui-block="solutions-010"] [data-part="bar"]{
display:flex;flex-direction:column-reverse;
border-radius:0.375rem;overflow:hidden;background:var(--vibeui-solutions-010-panel);
}
[data-vibeui-block="solutions-010"] [data-part="seg"]{display:block;background:var(--vibeui-solutions-010-accent)}
/* Штриховка вместо одного цвета: стек обязан читаться и в чёрно-белой печати. */
[data-vibeui-block="solutions-010"] [data-seg="1"]{
background:var(--vibeui-solutions-010-s2);
background-image:repeating-linear-gradient(45deg,var(--vibeui-solutions-010-hatch-a) 0 3px,transparent 3px 6px);
}
[data-vibeui-block="solutions-010"] [data-seg="2"]{
background:var(--vibeui-solutions-010-s3);
background-image:repeating-linear-gradient(-45deg,var(--vibeui-solutions-010-hatch-b) 0 2px,transparent 2px 5px);
}
[data-vibeui-block="solutions-010"] [data-seg="3"]{
background:var(--vibeui-solutions-010-s4);
background-image:repeating-linear-gradient(90deg,var(--vibeui-solutions-010-hatch-c) 0 1px,transparent 1px 4px);
}
[data-vibeui-block="solutions-010"] [data-part="tick"]{
text-align:center;font-size:0.625rem;color:var(--vibeui-solutions-010-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-010"] table{
width:100%;border-collapse:collapse;margin-top:0.75rem;font-size:0.8125rem;
}
[data-vibeui-block="solutions-010"] th,
[data-vibeui-block="solutions-010"] td{
padding:0.4375rem 0.25rem;text-align:left;border-top:1px solid var(--vibeui-solutions-010-border);
}
[data-vibeui-block="solutions-010"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-010-muted);border-top:0;
}
[data-vibeui-block="solutions-010"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-010"] [data-part="key"]{
display:inline-block;width:0.625rem;height:0.625rem;margin-right:0.4375rem;border-radius:0.1875rem;
vertical-align:-0.0625rem;background:var(--vibeui-solutions-010-accent);
}
[data-vibeui-block="solutions-010"] [data-key="1"]{background:var(--vibeui-solutions-010-s2)}
[data-vibeui-block="solutions-010"] [data-key="2"]{background:var(--vibeui-solutions-010-s3)}
[data-vibeui-block="solutions-010"] [data-key="3"]{background:var(--vibeui-solutions-010-s4)}
[data-vibeui-block="solutions-010"] [data-part="share"]{
display:inline-block;min-width:2.75rem;padding:0.0625rem 0.375rem;border-radius:0.375rem;
text-align:right;background:var(--vibeui-solutions-010-panel);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MONTHS: Solutions010Month[] = [
  { label: "окт", parts: [1420, 640, 380, 210] },
  { label: "ноя", parts: [1580, 690, 410, 260] },
  { label: "дек", parts: [2110, 880, 520, 340] },
  { label: "янв", parts: [1490, 700, 460, 280] },
  { label: "фев", parts: [1760, 820, 540, 300] },
  { label: "мар", parts: [2040, 960, 610, 380] },
]

const DEFAULT_SEGMENTS: Solutions010Segment[] = [
  { name: "Подписки", total: "10,4 млн ₽", share: 51 },
  { name: "Внедрение", total: "4,7 млн ₽", share: 23 },
  { name: "Поддержка", total: "2,9 млн ₽", share: 14 },
  { name: "Обучение", total: "2,4 млн ₽", share: 12 },
]

const DEFAULT_COLUMN_TEXT: Record<string, string> = {
  segment: "Направление",
  revenue: "Выручка",
  share: "Доля",
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
 * Отчёт по выручке: столбики месяцев собраны из сегментов, разбивка — таблицей.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions010({
  title = "Выручка по направлениям",
  period = "Октябрь — март, помесячно",
  total = "20,4 млн ₽",
  delta = "+16% к прошлому полугодию",
  segments = DEFAULT_SEGMENTS,
  months = DEFAULT_MONTHS,
  unit = "тыс. ₽",
  columnText = DEFAULT_COLUMN_TEXT,
  chartLabelText = "Выручка по месяцам за период {period}: итог {total}",
  accent,
  background = "",
  className,
  style,
}: Solutions010Props) {
  const sums = months.map((month) =>
    month.parts.reduce((acc, part) => acc + part, 0),
  )
  const peak = Math.max(...sums, 1)

  const palette = {
    ...(accent ? { "--vibeui-solutions-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-010"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="period">
              {period} · {unit}
            </p>
          </div>
          <div>
            <p data-part="total">{total}</p>
            <span data-part="delta">{delta}</span>
          </div>
        </header>

        <div
          data-part="chart"
          role="img"
          aria-label={chartLabelText
            .replace("{period}", period)
            .replace("{total}", total)}
        >
          {months.map((month, index) => {
            const sum = sums[index]

            return (
              <div data-part="col" key={month.label}>
                <div
                  data-part="bar"
                  style={{ height: `${Math.round((sum / peak) * 100)}%` }}
                >
                  {month.parts.map((part, seg) => (
                    <span
                      data-part="seg"
                      data-seg={seg}
                      key={`${month.label}-${seg}`}
                      style={{ height: `${(part / sum) * 100}%` }}
                    />
                  ))}
                </div>
                <span data-part="tick">{month.label}</span>
              </div>
            )
          })}
        </div>

        <table>
          <thead>
            <tr>
              <th scope="col">
                {columnText.segment ?? DEFAULT_COLUMN_TEXT.segment}
              </th>
              <th scope="col" data-align="end">
                {columnText.revenue ?? DEFAULT_COLUMN_TEXT.revenue}
              </th>
              <th scope="col" data-align="end">
                {columnText.share ?? DEFAULT_COLUMN_TEXT.share}
              </th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment, index) => (
              <tr key={segment.name}>
                <td>
                  <span data-part="key" data-key={index} aria-hidden="true" />
                  {segment.name}
                </td>
                <td data-align="end">{segment.total}</td>
                <td data-align="end">
                  <span data-part="share">{segment.share}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
