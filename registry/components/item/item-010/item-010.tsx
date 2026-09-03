import type { ComponentProps, CSSProperties } from "react"

export type Item010Row = {
  code: string
  title: string
  value: string
}

export type Item010Props = Omit<ComponentProps<"ul">, "children"> & {
  rows?: Item010Row[]
  density?: "tight" | "compact" | "cozy"
  /** Пусто — подложки нет, список лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка для плотного списка, где на экран должно попасть
// сорок записей, а не восемь. Высота задана одной переменной шага, поэтому
// плотность меняется целиком, а не подкруткой отступов у каждого узла. Строки
// разделены внутренней линией, а не рамкой каждой строки: рамки удваивались бы
// на стыках и давали двойную черту. Числа набраны табличными цифрами и выровнены
// вправо — в плотном списке колонку сравнивают взглядом сверху вниз.
//
// Тема берётся из color-scheme окружения через light-dark(): список темнеет
// там, где тёмный контекст, и не выкладывает под себя белую плашку.
const STYLES = `
:where([data-vibeui-block="item-010"]){
--vibeui-item-010-bg:transparent;
--vibeui-item-010-fg:light-dark(oklch(0.23 0.014 265),oklch(0.93 0.006 265));
--vibeui-item-010-muted:color-mix(in oklab,var(--vibeui-item-010-fg) 68%,transparent);
--vibeui-item-010-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-item-010-hover:color-mix(in oklab,var(--vibeui-item-010-fg) 6%,var(--vibeui-item-010-bg));
--vibeui-item-010-accent:light-dark(oklch(0.55 0.19 262),oklch(0.75 0.16 262));
--vibeui-item-010-step:1.625rem;
--vibeui-item-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="item-010"]{color-scheme:dark}
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
 * Плотный список: строка ростом в один шаг, три колонки, табличные цифры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item010({
  rows = DEFAULT_ROWS,
  density = "tight",
  background = "",
  accent,
  className,
  style,
  ...props
}: Item010Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-item-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-010" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="item"
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
