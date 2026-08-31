import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Scrollarea005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  items?: string[]
  /** Сколько строк видно без прокрутки: из них и считается высота области. */
  rows?: number
}

// Идея компонента: высота области задана не пикселями, а числом видимых
// строк — высота строки и число строк перемножаются в одной переменной.
// Поэтому обрезка всегда приходится на границу строки, а не на её середину,
// и подпись «видно 6 из 18» не врёт. Номера рисует CSS-счётчик: в разметке
// их нет, и при смене порядка список не надо перенумеровывать руками.
const STYLES = `
:where([data-vibeui-block="scrollarea-005"]){
--vibeui-scrollarea-005-bg:oklch(1 0 0);
--vibeui-scrollarea-005-fg:oklch(0.24 0.014 265);
--vibeui-scrollarea-005-muted:oklch(0.55 0.014 265);
--vibeui-scrollarea-005-border:oklch(0.9 0.006 265);
--vibeui-scrollarea-005-accent:oklch(0.55 0.17 265);
--vibeui-scrollarea-005-row:2.25rem;
--vibeui-scrollarea-005-rows:6;
--vibeui-scrollarea-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="scrollarea-005"]{
display:flex;flex-direction:column;
width:100%;max-width:21rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-scrollarea-005-bg);
border:1px solid var(--vibeui-scrollarea-005-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollarea-005-font);color:var(--vibeui-scrollarea-005-fg);
}
[data-vibeui-block="scrollarea-005"] [data-part="head"],
[data-vibeui-block="scrollarea-005"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5625rem 0.875rem;font-size:0.75rem;
}
[data-vibeui-block="scrollarea-005"] [data-part="head"]{
border-bottom:1px solid var(--vibeui-scrollarea-005-border);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="scrollarea-005"] [data-part="foot"]{
border-top:1px solid var(--vibeui-scrollarea-005-border);
color:var(--vibeui-scrollarea-005-muted);font-variant-numeric:tabular-nums;
}
/* Высота = строка × число строк: обрезка всегда на границе строки. */
[data-vibeui-block="scrollarea-005"] [data-part="area"]{
height:calc(var(--vibeui-scrollarea-005-row) * var(--vibeui-scrollarea-005-rows));
overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;
}
[data-vibeui-block="scrollarea-005"] [data-part="area"]:focus-visible{
outline:2px solid var(--vibeui-scrollarea-005-accent);outline-offset:-2px;
}
[data-vibeui-block="scrollarea-005"] ol{
margin:0;padding:0;list-style:none;counter-reset:vibeui-scrollarea-005-row;
}
[data-vibeui-block="scrollarea-005"] li{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;height:var(--vibeui-scrollarea-005-row);
padding:0 0.875rem;font-size:0.8125rem;
counter-increment:vibeui-scrollarea-005-row;
}
[data-vibeui-block="scrollarea-005"] li + li{border-top:1px solid oklch(0.955 0.004 265)}
/* Номера рисует счётчик: в разметке их нет и перенумеровывать нечего. */
[data-vibeui-block="scrollarea-005"] li::before{
content:counter(vibeui-scrollarea-005-row);
flex:none;min-width:1.25rem;
color:var(--vibeui-scrollarea-005-muted);
font-size:0.6875rem;font-variant-numeric:tabular-nums;text-align:right;
}
[data-vibeui-block="scrollarea-005"] li span{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollarea-005"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_ITEMS = [
  "Сборка 4821 · успешно",
  "Сборка 4820 · успешно",
  "Сборка 4819 · упала на тестах",
  "Сборка 4818 · успешно",
  "Сборка 4817 · отменена",
  "Сборка 4816 · успешно",
  "Сборка 4815 · успешно",
  "Сборка 4814 · упала на линтере",
  "Сборка 4813 · успешно",
  "Сборка 4812 · успешно",
  "Сборка 4811 · успешно",
  "Сборка 4810 · отменена",
]

/**
 * Область фиксированной высоты в строках, с нумерацией от CSS-счётчика.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollarea005({
  title = "История сборок",
  items = DEFAULT_ITEMS,
  rows = 6,
  className,
  style,
  ...props
}: Scrollarea005Props) {
  const visible = Math.min(items.length, Math.max(1, rows))
  const palette = {
    "--vibeui-scrollarea-005-rows": visible,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollarea-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="scrollarea-005"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span>{title}</span>
          <span>{items.length}</span>
        </div>
        <div data-part="area" tabIndex={0} role="region" aria-label={title}>
          <ol>
            {items.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div data-part="foot">
          <span>
            видно {visible} из {items.length}
          </span>
          <span>прокрутите список</span>
        </div>
      </div>
    </>
  )
}
