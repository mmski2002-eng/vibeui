import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  state?: "loading" | "empty"
  caption?: string
  columns?: string[]
  rows?: number
  emptyTitle?: string
  emptyText?: string
  actionLabel?: string
  accent?: string
}

// Идея компонента: два состояния таблицы до данных — ожидание и пустота.
// Шапка остаётся на месте в обоих: она объясняет, что здесь будет, и не даёт
// макету прыгнуть при появлении строк. Полосы-заглушки разной ширины, потому
// что одинаковые читаются как элемент оформления, а не как будущий текст.
const STYLES = `
:where([data-vibeui-block="table-009"]){
--vibeui-table-009-bg:oklch(1 0 0);
--vibeui-table-009-fg:oklch(0.24 0.014 265);
--vibeui-table-009-muted:oklch(0.56 0.014 265);
--vibeui-table-009-border:oklch(0.92 0.006 265);
--vibeui-table-009-head:oklch(0.975 0.003 265);
--vibeui-table-009-bar:oklch(0.93 0.005 265);
--vibeui-table-009-accent:oklch(0.55 0.2 262);
--vibeui-table-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="table-009"]{
width:100%;box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-table-009-bg);
border:1px solid var(--vibeui-table-009-border);border-radius:0.875rem;
font-family:var(--vibeui-table-009-font);color:var(--vibeui-table-009-fg);
}
[data-vibeui-block="table-009"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="table-009"] caption{padding:0.75rem 0.875rem;text-align:left;font-size:0.875rem;font-weight:650}
[data-vibeui-block="table-009"] th,
[data-vibeui-block="table-009"] td{
padding:0.5rem 0.875rem;text-align:left;
border-top:1px solid var(--vibeui-table-009-border);
}
[data-vibeui-block="table-009"] thead th{background:var(--vibeui-table-009-head);font-weight:600;white-space:nowrap}
/* Полосы разной ширины: одинаковые читаются как узор, а не как будущий текст. */
[data-vibeui-block="table-009"] [data-part="bar"]{
display:block;height:0.625rem;border-radius:9999px;
background:var(--vibeui-table-009-bar);
animation:vibeui-table-009-pulse 1.4s ease-in-out infinite;
}
[data-vibeui-block="table-009"] tr:nth-child(2n) [data-part="bar"]{animation-delay:.2s}
[data-vibeui-block="table-009"] td:nth-child(1) [data-part="bar"]{width:62%}
[data-vibeui-block="table-009"] td:nth-child(2) [data-part="bar"]{width:84%}
[data-vibeui-block="table-009"] td:nth-child(3) [data-part="bar"]{width:48%}
[data-vibeui-block="table-009"] td:nth-child(n+4) [data-part="bar"]{width:70%}
@keyframes vibeui-table-009-pulse{0%,100%{opacity:1}50%{opacity:.45}}
[data-vibeui-block="table-009"] [data-part="empty"]{
padding:2rem 0.875rem;text-align:center;
}
[data-vibeui-block="table-009"] [data-part="title"]{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="table-009"] [data-part="text"]{
margin:0 auto 0.875rem;max-width:22rem;
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-table-009-muted);
}
[data-vibeui-block="table-009"] button{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;
border:0;border-radius:0.5rem;
background:var(--vibeui-table-009-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="table-009"] button:focus-visible{outline:2px solid var(--vibeui-table-009-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="table-009"] [data-part="bar"]{animation:none;opacity:.7}
[data-vibeui-block="table-009"] *{transition:none!important}
}
`

/**
 * Таблица до данных: ожидание полосами и пустое состояние с действием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table009({
  state = "loading",
  caption = "Счета за март",
  columns = ["Счёт", "Заказчик", "Статус", "Сумма"],
  rows = 4,
  emptyTitle = "Счетов пока нет",
  emptyText = "Выставленные счета появятся здесь. Первый можно создать прямо сейчас.",
  actionLabel = "Выставить счёт",
  accent,
  className,
  style,
  ...props
}: Table009Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-009"
        className={className}
        style={palette}
      >
        <table aria-busy={state === "loading" || undefined}>
          <caption>{caption}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state === "loading" ? (
              Array.from({ length: rows }, (_, row) => (
                <tr key={row}>
                  {columns.map((column) => (
                    <td key={column}>
                      <span data-part="bar" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} data-part="empty">
                  <p data-part="title">{emptyTitle}</p>
                  <p data-part="text">{emptyText}</p>
                  <button type="button">{actionLabel}</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
