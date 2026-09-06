import type { ComponentProps, CSSProperties } from "react"

export type Table015Row = {
  title: string
  value: string
  share: string
  /** Номер сноски, считая с единицы: 0 или пропуск — без маркера. */
  note?: number
}

export type Table015Props = Omit<ComponentProps<"div">, "children"> & {
  rows?: Table015Row[]
  notes?: string[]
  notesTitle?: string
  caption?: string
  /** Заголовки колонок: ключи title, value и share. */
  columnText?: Record<string, string>
  /** Подпись маркера сноски для озвучки; {n} — номер сноски. */
  noteLabel?: string
  /** Подпись обратной ссылки; {n} — номер сноски. */
  backLabel?: string
  /** Префикс id: два экземпляра на странице не должны делить якоря сносок. */
  idPrefix?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: таблица со сносками, которые не теряются. Маркер в ячейке
// — настоящая ссылка на пункт списка под таблицей, у пункта есть обратная
// ссылка, а ячейка связана со сноской через aria-describedby: скринридер
// прочитает пояснение сразу, не уводя пользователя из строки.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-015"]){
--vibeui-table-015-bg:transparent;
--vibeui-table-015-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-015-muted:color-mix(in oklab,var(--vibeui-table-015-fg) 68%,transparent);
--vibeui-table-015-border:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-table-015-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-015-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-table-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-015"]{color-scheme:dark}
[data-vibeui-block="table-015"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-015-font);color:var(--vibeui-table-015-fg);
}
[data-vibeui-block="table-015"] [data-part="shell"]{
background:var(--vibeui-table-015-bg);
border:1px solid var(--vibeui-table-015-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="table-015"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="table-015"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-015-accent);outline-offset:-2px;
}
[data-vibeui-block="table-015"] table{width:100%;border-collapse:collapse;font-size:0.8125rem;min-width:22rem}
[data-vibeui-block="table-015"] caption{
padding:0.875rem 1rem 0.5rem;text-align:left;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="table-015"] th,
[data-vibeui-block="table-015"] td{
padding:0.5rem 0.875rem;text-align:left;
border-top:1px solid var(--vibeui-table-015-border);
}
[data-vibeui-block="table-015"] thead th{background:var(--vibeui-table-015-head);font-weight:600;white-space:nowrap}
[data-vibeui-block="table-015"] tbody th{font-weight:500}
[data-vibeui-block="table-015"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Маркер сноски мельче и выше строки, но остаётся полноценной целью нажатия. */
[data-vibeui-block="table-015"] [data-part="marker"]{
font-size:0.6875rem;line-height:0;
}
[data-vibeui-block="table-015"] [data-part="marker"] a{
color:var(--vibeui-table-015-accent);text-decoration:none;font-weight:650;
padding:0 0.125rem;border-radius:0.25rem;
}
[data-vibeui-block="table-015"] [data-part="marker"] a:hover{text-decoration:underline}
[data-vibeui-block="table-015"] a:focus-visible{
outline:2px solid var(--vibeui-table-015-accent);outline-offset:2px;
}
[data-vibeui-block="table-015"] [data-part="notes"]{
margin:0;padding:0.75rem 1rem 0.875rem 2.125rem;
border-top:1px solid var(--vibeui-table-015-border);
background:var(--vibeui-table-015-head);
font-size:0.75rem;line-height:1.5;color:var(--vibeui-table-015-muted);
}
[data-vibeui-block="table-015"] [data-part="notes-title"]{
margin:0;padding:0.75rem 1rem 0;
border-top:1px solid var(--vibeui-table-015-border);
background:var(--vibeui-table-015-head);
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-table-015-muted);
}
[data-vibeui-block="table-015"] [data-part="notes-title"] + [data-part="notes"]{border-top:0;padding-top:0.375rem}
[data-vibeui-block="table-015"] [data-part="notes"] li{margin:0.25rem 0}
[data-vibeui-block="table-015"] [data-part="notes"] li:target{color:var(--vibeui-table-015-fg)}
[data-vibeui-block="table-015"] [data-part="back"]{
margin-left:0.375rem;color:var(--vibeui-table-015-accent);text-decoration:none;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Table015Row[] = [
  { title: "Активные команды", value: "1 284", share: "+12%" },
  { title: "Платящие команды", value: "417", share: "+6%", note: 1 },
  { title: "Средний чек", value: "4 100 ₽", share: "−2%", note: 2 },
  { title: "Отток за квартал", value: "3,4%", share: "−0,6 п. п.", note: 3 },
]

const DEFAULT_COLUMNS: Record<string, string> = {
  title: "Показатель",
  value: "Значение",
  share: "К прошлому",
}

const DEFAULT_NOTES = [
  "Учитываются команды хотя бы с одной оплатой за последние 90 дней.",
  "Без учёта разовых продлений и партнёрских скидок.",
  "Пункты процента, а не проценты: сравнение с прошлым кварталом.",
]

/**
 * Ветка темы для заданного фона: light-dark() смотрит на color-scheme, а не
 * на цвет подложки, поэтому светлую плашку приходится объявлять светлой.
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
 * Таблица со сносками под ней: маркеры — якорные ссылки, у пунктов есть возврат.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table015({
  rows = DEFAULT_ROWS,
  notes = DEFAULT_NOTES,
  notesTitle = "Примечания",
  caption = "Показатели за III квартал",
  columnText = DEFAULT_COLUMNS,
  noteLabel = "Сноска {n}",
  backLabel = "Вернуться к строке со сноской {n}",
  idPrefix = "table-015",
  background = "",
  accent,
  className,
  style,
  ...props
}: Table015Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div
            data-part="scroll"
            role="region"
            aria-label={caption}
            tabIndex={0}
          >
            <table>
              <caption>{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">
                    {columnText.title ?? DEFAULT_COLUMNS.title}
                  </th>
                  <th scope="col" data-align="end">
                    {columnText.value ?? DEFAULT_COLUMNS.value}
                  </th>
                  <th scope="col" data-align="end">
                    {columnText.share ?? DEFAULT_COLUMNS.share}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.title}>
                    <th
                      scope="row"
                      aria-describedby={
                        row.note ? `${idPrefix}-note-${row.note}` : undefined
                      }
                    >
                      {row.title}
                      {row.note ? (
                        <sup data-part="marker">
                          <a
                            id={`${idPrefix}-ref-${row.note}`}
                            href={`#${idPrefix}-note-${row.note}`}
                            aria-label={noteLabel.replace(
                              "{n}",
                              String(row.note),
                            )}
                          >
                            {row.note}
                          </a>
                        </sup>
                      ) : null}
                    </th>
                    <td data-align="end">{row.value}</td>
                    <td data-align="end">{row.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p data-part="notes-title">{notesTitle}</p>
          <ol data-part="notes">
            {notes.map((note, index) => (
              <li key={note} id={`${idPrefix}-note-${index + 1}`}>
                {note}
                <a
                  data-part="back"
                  href={`#${idPrefix}-ref-${index + 1}`}
                  aria-label={backLabel.replace("{n}", String(index + 1))}
                >
                  ↩
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}
