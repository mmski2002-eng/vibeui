import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Item010Row = {
  code: string
  title: string
  value: string
}

export type Item010Props = Omit<ComponentPropsWithoutRef<"ul">, "children"> & {
  rows?: Item010Row[]
  density?: "tight" | "compact" | "cozy"
  accent?: string
}

// Идея компонента: строка для плотного списка, где на экран должно попасть
// сорок записей, а не восемь. Высота задана одной переменной шага, поэтому
// плотность меняется целиком, а не подкруткой отступов у каждого узла. Строки
// разделены внутренней линией, а не рамкой каждой строки: рамки удваивались бы
// на стыках и давали двойную черту. Числа набраны табличными цифрами и выровнены
// вправо — в плотном списке колонку сравнивают взглядом сверху вниз.
const STYLES = `
:where([data-vibeui-block="item-010"]){
--vibeui-item-010-bg:oklch(1 0 0);
--vibeui-item-010-fg:oklch(0.23 0.014 265);
--vibeui-item-010-muted:oklch(0.56 0.014 265);
--vibeui-item-010-border:oklch(0.91 0.006 265);
--vibeui-item-010-hover:oklch(0.97 0.003 265);
--vibeui-item-010-accent:oklch(0.55 0.19 262);
--vibeui-item-010-step:1.625rem;
--vibeui-item-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="item-010"]{
list-style:none;margin:0;padding:0;overflow:hidden;
width:100%;max-width:24rem;box-sizing:border-box;
background:var(--vibeui-item-010-bg);
border:1px solid var(--vibeui-item-010-border);border-radius:0.625rem;
font-family:var(--vibeui-item-010-font);color:var(--vibeui-item-010-fg);
}
[data-vibeui-block="item-010"] *{box-sizing:border-box}
[data-vibeui-block="item-010"][data-density="tight"]{--vibeui-item-010-step:1.5rem}
[data-vibeui-block="item-010"][data-density="compact"]{--vibeui-item-010-step:1.875rem}
[data-vibeui-block="item-010"][data-density="cozy"]{--vibeui-item-010-step:2.375rem}
/* Высота строки — один шаг: плотность меняется целиком, а не по отступам. */
[data-vibeui-block="item-010"] [data-part="row"]{
display:grid;grid-template-columns:3.5rem minmax(0,1fr) auto;align-items:center;gap:0.625rem;
min-height:var(--vibeui-item-010-step);padding:0 0.625rem;
font-size:0.75rem;line-height:1.25;
}
/* Линия внутри строки, а не рамка у каждой: иначе на стыках двойная черта. */
[data-vibeui-block="item-010"] [data-part="row"] + [data-part="row"]{
box-shadow:inset 0 1px 0 var(--vibeui-item-010-border);
}
[data-vibeui-block="item-010"] [data-part="row"]:hover{background:var(--vibeui-item-010-hover)}
[data-vibeui-block="item-010"] [data-part="code"]{
color:var(--vibeui-item-010-accent);font-weight:650;font-variant-numeric:tabular-nums;
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.6875rem;
}
[data-vibeui-block="item-010"] [data-part="title"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="item-010"] [data-part="value"]{
justify-self:end;color:var(--vibeui-item-010-muted);
font-variant-numeric:tabular-nums;font-feature-settings:"tnum";
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Item010Row[] = [
  { code: "AL-118", title: "Кабель питания, 2 м", value: "412" },
  { code: "AL-119", title: "Кабель питания, 5 м", value: "96" },
  { code: "BR-204", title: "Кронштейн настенный", value: "1 240" },
  { code: "BR-207", title: "Кронштейн потолочный", value: "38" },
  { code: "CM-330", title: "Модуль связи RS-485", value: "7" },
  { code: "CM-331", title: "Модуль связи Ethernet", value: "0" },
  { code: "DX-402", title: "Датчик протечки", value: "615" },
]

/**
 * Плотный список: строка ростом в один шаг, три колонки, табличные цифры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item010({
  rows = DEFAULT_ROWS,
  density = "tight",
  accent,
  className,
  style,
  ...props
}: Item010Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-010" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-vibeui-block="item-010"
        data-density={density}
        className={className}
        style={palette}
      >
        {rows.map((row) => (
          <li key={row.code} data-part="row">
            <span data-part="code">{row.code}</span>
            <span data-part="title">{row.title}</span>
            <span data-part="value">{row.value}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
