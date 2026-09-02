import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Codeblock001Token = {
  text: string
  kind?: "keyword" | "string" | "comment" | "number" | "entity"
}

export type Codeblock001Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  start?: number
  lines?: Codeblock001Token[][]
  /** Счётчик строк в шапке: {count} — число строк. */
  countText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: нумерация строк, которая не попадает в буфер обмена.
// Номера нарисованы счётчиком CSS в псевдоэлементе, поэтому выделение мышью
// захватывает только код — вставленный фрагмент остаётся рабочим.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, рамка и шапка держатся полупрозрачными накладками поверх страницы.
const STYLES = `
:where([data-vibeui-block="codeblock-001"]){
--vibeui-codeblock-001-bg:transparent;
--vibeui-codeblock-001-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 6%));
--vibeui-codeblock-001-hover:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-001-fg:light-dark(oklch(0.28 0.022 275),oklch(0.93 0.008 275));
--vibeui-codeblock-001-muted:light-dark(oklch(0.5 0.02 275),oklch(0.68 0.018 275));
--vibeui-codeblock-001-gutter:light-dark(oklch(0.67 0.02 275),oklch(0.52 0.03 275));
--vibeui-codeblock-001-rule:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 10%));
--vibeui-codeblock-001-border:light-dark(oklch(0 0 0 / 14%),oklch(1 0 0 / 14%));
--vibeui-codeblock-001-keyword:light-dark(oklch(0.5 0.19 305),oklch(0.78 0.13 305));
--vibeui-codeblock-001-string:light-dark(oklch(0.45 0.13 145),oklch(0.83 0.13 145));
--vibeui-codeblock-001-comment:light-dark(oklch(0.58 0.02 275),oklch(0.61 0.02 275));
--vibeui-codeblock-001-number:light-dark(oklch(0.53 0.14 62),oklch(0.84 0.12 72));
--vibeui-codeblock-001-entity:light-dark(oklch(0.5 0.15 245),oklch(0.83 0.11 235));
--vibeui-codeblock-001-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-001"]{
display:flex;flex-direction:column;
width:100%;max-width:34rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-001-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-001-bg);color:var(--vibeui-codeblock-001-fg);
font-family:var(--vibeui-codeblock-001-font);
}
[data-vibeui-block="codeblock-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-001-head);
border-bottom:1px solid var(--vibeui-codeblock-001-rule);
font-size:0.75rem;color:var(--vibeui-codeblock-001-muted);
}
[data-vibeui-block="codeblock-001"] [data-part="name"]{
font-family:var(--vibeui-codeblock-001-mono);letter-spacing:0.01em;
}
[data-vibeui-block="codeblock-001"] [data-part="count"]{
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="codeblock-001"] pre{
margin:0;padding:0.75rem 0.875rem 0.875rem 0;
overflow-x:auto;counter-reset:line var(--vibeui-codeblock-001-start,0);
}
[data-vibeui-block="codeblock-001"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-001-mono);
font-size:0.8125rem;line-height:1.7;white-space:pre;
}
[data-vibeui-block="codeblock-001"] [data-part="row"]{
display:block;padding-inline-start:3.5rem;position:relative;
}
/* Номер живёт в ::before: выделение и копирование его не захватывают. */
[data-vibeui-block="codeblock-001"] [data-part="row"]::before{
counter-increment:line;content:counter(line);
position:absolute;left:0;width:2.75rem;
text-align:right;color:var(--vibeui-codeblock-001-gutter);
font-variant-numeric:tabular-nums;
user-select:none;-webkit-user-select:none;pointer-events:none;
}
[data-vibeui-block="codeblock-001"] [data-part="row"]:hover{background:var(--vibeui-codeblock-001-hover)}
[data-vibeui-block="codeblock-001"] [data-token="keyword"]{color:var(--vibeui-codeblock-001-keyword)}
[data-vibeui-block="codeblock-001"] [data-token="string"]{color:var(--vibeui-codeblock-001-string)}
[data-vibeui-block="codeblock-001"] [data-token="comment"]{color:var(--vibeui-codeblock-001-comment);font-style:italic}
[data-vibeui-block="codeblock-001"] [data-token="number"]{color:var(--vibeui-codeblock-001-number)}
[data-vibeui-block="codeblock-001"] [data-token="entity"]{color:var(--vibeui-codeblock-001-entity)}
`

const LINES: Codeblock001Token[][] = [
  [
    { text: "export function ", kind: "keyword" },
    { text: "formatPrice", kind: "entity" },
    { text: "(value: " },
    { text: "number", kind: "entity" },
    { text: ") {" },
  ],
  [{ text: "  // цены храним в копейках", kind: "comment" }],
  [
    { text: "  const", kind: "keyword" },
    { text: " rubles = value / " },
    { text: "100", kind: "number" },
  ],
  [
    { text: "  return", kind: "keyword" },
    { text: " rubles.toFixed(" },
    { text: "2", kind: "number" },
    { text: ") + " },
    { text: '" ₽"', kind: "string" },
  ],
  [{ text: "}" }],
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

/** Блок кода с нумерацией строк, которая не копируется вместе с кодом. */
export function Codeblock001({
  title = "lib/format.ts",
  start = 1,
  lines = LINES,
  countText = "{count} строк",
  background = "",
  className,
  style,
  ...props
}: Codeblock001Props) {
  const palette = {
    "--vibeui-codeblock-001-start": start - 1,
    ...(background
      ? {
          "--vibeui-codeblock-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-001" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="codeblock-001"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">
          <span data-part="name">{title}</span>
          <span data-part="count">
            {countText.replace("{count}", String(lines.length))}
          </span>
        </figcaption>
        <pre>
          <code>
            {lines.map((line, index) => (
              <span data-part="row" key={index}>
                {line.map((token, position) => (
                  <span key={position} data-token={token.kind}>
                    {token.text}
                  </span>
                ))}
              </span>
            ))}
          </code>
        </pre>
      </figure>
    </>
  )
}
