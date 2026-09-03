import type { CSSProperties } from "react"

export type Codeblock024Row = {
  before: string | null
  after: string | null
}

export type Codeblock024Props = {
  path?: string
  beforeLabel?: string
  afterLabel?: string
  rows?: Codeblock024Row[]
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: две версии файла рядом, строка напротив строки. Пустые
// места слева и справа — это не пропуск, а явная заглушка, поэтому глаз ведёт
// по одной горизонтали; на узкой ширине панели встают друг под друга.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, оттенки удаления и добавления подобраны для каждой ветки отдельно.
const STYLES = `
:where([data-vibeui-block="codeblock-024"]){
--vibeui-codeblock-024-bg:transparent;
--vibeui-codeblock-024-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-024-fg:light-dark(oklch(0.26 0.016 265),oklch(0.93 0.008 265));
--vibeui-codeblock-024-muted:color-mix(in oklab,var(--vibeui-codeblock-024-fg) 68%,transparent);
--vibeui-codeblock-024-gutter:light-dark(oklch(0.63 0.02 265),oklch(0.5 0.02 265));
--vibeui-codeblock-024-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 12%));
--vibeui-codeblock-024-del:light-dark(oklch(0.5 0.19 25),oklch(0.78 0.16 25));
--vibeui-codeblock-024-del-bg:light-dark(oklch(0.72 0.17 25 / 22%),oklch(0.5 0.16 25 / 18%));
--vibeui-codeblock-024-add:light-dark(oklch(0.47 0.15 152),oklch(0.82 0.15 152));
--vibeui-codeblock-024-add-bg:light-dark(oklch(0.74 0.14 152 / 24%),oklch(0.5 0.14 152 / 18%));
--vibeui-codeblock-024-void:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 4%));
--vibeui-codeblock-024-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-024"]{color-scheme:dark}
[data-vibeui-block="codeblock-024"]{
display:block;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;margin:0;
overflow:hidden;border:1px solid var(--vibeui-codeblock-024-border);
border-radius:0.75rem;
background:var(--vibeui-codeblock-024-bg);color:var(--vibeui-codeblock-024-fg);
font-family:var(--vibeui-codeblock-024-font);
}
[data-vibeui-block="codeblock-024"] [data-part="head"]{
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-024-head);
border-bottom:1px solid var(--vibeui-codeblock-024-border);
font-family:var(--vibeui-codeblock-024-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-024-muted);
}
[data-vibeui-block="codeblock-024"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;
}
[data-vibeui-block="codeblock-024"] [data-part="pane"]{min-width:0}
[data-vibeui-block="codeblock-024"] [data-part="pane"] + [data-part="pane"]{
border-top:1px solid var(--vibeui-codeblock-024-border);
}
[data-vibeui-block="codeblock-024"] [data-part="label"]{
display:flex;align-items:center;gap:0.375rem;
padding:0.3125rem 0.875rem;
border-bottom:1px solid var(--vibeui-codeblock-024-border);
font-size:0.6875rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-codeblock-024-muted);
}
[data-vibeui-block="codeblock-024"] [data-part="label"]::before{
content:"−";flex:none;color:var(--vibeui-codeblock-024-del);font-weight:700;
}
[data-vibeui-block="codeblock-024"] [data-side="after"] [data-part="label"]::before{
content:"+";color:var(--vibeui-codeblock-024-add);
}
[data-vibeui-block="codeblock-024"] pre{margin:0;padding:0.5rem 0;overflow-x:auto}
[data-vibeui-block="codeblock-024"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-024-mono);
font-size:0.75rem;line-height:1.75;white-space:pre;
counter-reset:line;
}
[data-vibeui-block="codeblock-024"] [data-part="row"]{
display:block;position:relative;padding:0 0.75rem 0 2.5rem;min-height:1.75em;
}
[data-vibeui-block="codeblock-024"] [data-part="row"]:not([data-void="true"])::before{
counter-increment:line;content:counter(line);
position:absolute;left:0;width:1.75rem;text-align:right;
color:var(--vibeui-codeblock-024-gutter);font-variant-numeric:tabular-nums;
user-select:none;-webkit-user-select:none;pointer-events:none;
}
/* Заглушка вместо строки: без неё соседняя панель уехала бы вверх и
   сравнение по горизонтали перестало бы работать. */
[data-vibeui-block="codeblock-024"] [data-part="row"][data-void="true"]{
background:var(--vibeui-codeblock-024-void);
}
[data-vibeui-block="codeblock-024"] [data-side="before"] [data-part="row"][data-changed="true"]{
background:var(--vibeui-codeblock-024-del-bg);
box-shadow:inset 0.125rem 0 0 var(--vibeui-codeblock-024-del);
}
[data-vibeui-block="codeblock-024"] [data-side="after"] [data-part="row"][data-changed="true"]{
background:var(--vibeui-codeblock-024-add-bg);
box-shadow:inset 0.125rem 0 0 var(--vibeui-codeblock-024-add);
}
@container (min-width: 34rem){
[data-vibeui-block="codeblock-024"] [data-part="shell"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="codeblock-024"] [data-part="pane"] + [data-part="pane"]{
border-top:0;border-left:1px solid var(--vibeui-codeblock-024-border);
}
}
`

const ROWS: Codeblock024Row[] = [
  {
    before: "export function total(items) {",
    after: "export function total(items) {",
  },
  { before: "  let sum = 0", after: "  return items.reduce(" },
  {
    before: "  for (const item of items) {",
    after: "    (sum, item) => sum + item.price,",
  },
  { before: "    sum += item.price", after: "    0," },
  { before: "  }", after: "  )" },
  { before: "  return sum", after: null },
  { before: "}", after: "}" },
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

/** Две версии файла рядом: было слева, стало справа, строка напротив строки. */
export function Codeblock024({
  path = "lib/total.ts",
  beforeLabel = "Было",
  afterLabel = "Стало",
  rows = ROWS,
  background = "",
  className,
  style,
  ...props
}: Codeblock024Props) {
  const panes = [
    { side: "before" as const, label: beforeLabel },
    { side: "after" as const, label: afterLabel },
  ]
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-024" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-024"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">{path}</figcaption>
        <div data-part="shell">
          {panes.map((pane) => (
            <div key={pane.side} data-part="pane" data-side={pane.side}>
              <div data-part="label">{pane.label}</div>
              <pre>
                <code>
                  {rows.map((row, index) => {
                    const text = row[pane.side]
                    const changed = row.before !== row.after

                    return (
                      <span
                        key={index}
                        data-part="row"
                        data-void={text === null || undefined}
                        data-changed={(changed && text !== null) || undefined}
                      >
                        {text ?? " "}
                      </span>
                    )
                  })}
                </code>
              </pre>
            </div>
          ))}
        </div>
      </figure>
    </>
  )
}
