import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Item006Cell = {
  label: string
  value: string
}

export type Item006Props = Omit<
  ComponentPropsWithoutRef<"li">,
  "children" | "title"
> & {
  title?: string
  cells?: Item006Cell[]
  accent?: string
}

// Идея компонента: строка, где подробности разложены по трём подписанным
// колонкам, а не слиты в одну серую фразу через точки. Каждая ячейка — пара
// dt/dd, поэтому «Владелец» и «Ирина» связаны разметкой, а не соседством.
// Раскладка считается от ширины самой строки через контейнерный запрос: в узкой
// колонке три ячейки встают друг под друга, в широкой — в ряд. Правило запроса
// целит во внутреннюю обёртку, потому что на сам контейнер оно не действует.
const STYLES = `
:where([data-vibeui-block="item-006"]){
--vibeui-item-006-bg:oklch(1 0 0);
--vibeui-item-006-fg:oklch(0.23 0.014 265);
--vibeui-item-006-muted:oklch(0.56 0.014 265);
--vibeui-item-006-border:oklch(0.9 0.006 265);
--vibeui-item-006-accent:oklch(0.55 0.19 262);
--vibeui-item-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="item-006"]{
container-type:inline-size;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.75rem 0.875rem;
list-style:none;
background:var(--vibeui-item-006-bg);
border:1px solid var(--vibeui-item-006-border);border-radius:0.75rem;
font-family:var(--vibeui-item-006-font);color:var(--vibeui-item-006-fg);
}
[data-vibeui-block="item-006"] *{box-sizing:border-box}
[data-vibeui-block="item-006"] [data-part="shell"]{display:grid;gap:0.625rem}
[data-vibeui-block="item-006"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:650;line-height:1.3;
border-left:2px solid var(--vibeui-item-006-accent);padding-left:0.5rem;
}
[data-vibeui-block="item-006"] [data-part="cells"]{
display:grid;gap:0.5rem;margin:0;
}
[data-vibeui-block="item-006"] [data-part="cell"]{display:grid;gap:0.0625rem;min-width:0}
[data-vibeui-block="item-006"] dt{
font-size:0.625rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-item-006-muted);
}
[data-vibeui-block="item-006"] dd{
margin:0;font-size:0.8125rem;line-height:1.3;font-variant-numeric:tabular-nums;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@container (min-width: 22rem){
[data-vibeui-block="item-006"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);align-items:center;gap:0.875rem}
[data-vibeui-block="item-006"] [data-part="cells"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CELLS: Item006Cell[] = [
  { label: "Владелец", value: "Ирина Лаптева" },
  { label: "Обновлён", value: "14 марта" },
  { label: "Размер", value: "2,4 МБ" },
]

/**
 * Строка списка с подробностями в трёх подписанных колонках.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item006({
  title = "Смета на второй этап",
  cells = DEFAULT_CELLS,
  accent,
  className,
  style,
  ...props
}: Item006Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-006" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-vibeui-block="item-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="title">{title}</p>
          <dl data-part="cells">
            {cells.map((cell) => (
              <div key={cell.label} data-part="cell">
                <dt>{cell.label}</dt>
                <dd>{cell.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </li>
    </>
  )
}
