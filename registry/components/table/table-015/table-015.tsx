import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table015Row = {
  title: string
  value: string
  share: string
  /** Номер сноски, считая с единицы: 0 или пропуск — без маркера. */
  note?: number
}

export type Table015Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  rows?: Table015Row[]
  notes?: string[]
  notesTitle?: string
  caption?: string
  /** Префикс id: два экземпляра на странице не должны делить якоря сносок. */
  idPrefix?: string
  accent?: string
}

// Идея компонента: таблица со сносками, которые не теряются. Маркер в ячейке
// — настоящая ссылка на пункт списка под таблицей, у пункта есть обратная
// ссылка, а ячейка связана со сноской через aria-describedby: скринридер
// прочитает пояснение сразу, не уводя пользователя из строки.
const STYLES = `
:where([data-vibeui-block="table-015"]){
--vibeui-table-015-bg:oklch(1 0 0);
--vibeui-table-015-fg:oklch(0.24 0.014 265);
--vibeui-table-015-muted:oklch(0.56 0.014 265);
--vibeui-table-015-border:oklch(0.92 0.006 265);
--vibeui-table-015-head:oklch(0.975 0.003 265);
--vibeui-table-015-accent:oklch(0.55 0.2 262);
--vibeui-table-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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

const DEFAULT_NOTES = [
  "Учитываются команды хотя бы с одной оплатой за последние 90 дней.",
  "Без учёта разовых продлений и партнёрских скидок.",
  "Пункты процента, а не проценты: сравнение с прошлым кварталом.",
]

/**
 * Таблица со сносками под ней: маркеры — якорные ссылки, у пунктов есть возврат.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table015({
  rows = DEFAULT_ROWS,
  notes = DEFAULT_NOTES,
  notesTitle = "Примечания",
  caption = "Показатели за III квартал",
  idPrefix = "table-015",
  accent,
  className,
  style,
  ...props
}: Table015Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
                  <th scope="col">Показатель</th>
                  <th scope="col" data-align="end">
                    Значение
                  </th>
                  <th scope="col" data-align="end">
                    К прошлому
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
                            aria-label={`Сноска ${row.note}`}
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
                  aria-label={`Вернуться к строке со сноской ${index + 1}`}
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
