import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Codeblock005Line = {
  text: string
  kind?: "add" | "del"
}

export type Codeblock005Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children"
> & {
  path?: string
  showStats?: boolean
  lines?: Codeblock005Line[]
}

// Идея компонента: диф, который читается и без цвета. Знак «+» или «−»
// рисуется псевдоэлементом рядом с каждой строкой, поэтому смысл строки
// понятен при дальтонизме и в чёрно-белой печати, а в буфер он не попадает.
const STYLES = `
:where([data-vibeui-block="codeblock-005"]){
--vibeui-codeblock-005-bg:oklch(0.2 0.01 265);
--vibeui-codeblock-005-head:oklch(0.24 0.012 265);
--vibeui-codeblock-005-fg:oklch(0.92 0.006 265);
--vibeui-codeblock-005-muted:oklch(0.67 0.014 265);
--vibeui-codeblock-005-border:oklch(1 0 0 / 13%);
--vibeui-codeblock-005-add:oklch(0.84 0.15 150);
--vibeui-codeblock-005-add-bg:oklch(0.5 0.13 150 / 22%);
--vibeui-codeblock-005-del:oklch(0.79 0.15 22);
--vibeui-codeblock-005-del-bg:oklch(0.5 0.15 22 / 22%);
--vibeui-codeblock-005-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-005"]{
display:flex;flex-direction:column;
width:100%;max-width:34rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-005-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-005-bg);color:var(--vibeui-codeblock-005-fg);
font-family:var(--vibeui-codeblock-005-font);
}
[data-vibeui-block="codeblock-005"] figcaption{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-005-head);
border-bottom:1px solid var(--vibeui-codeblock-005-border);
font-size:0.75rem;color:var(--vibeui-codeblock-005-muted);
}
[data-vibeui-block="codeblock-005"] [data-part="path"]{font-family:var(--vibeui-codeblock-005-mono)}
[data-vibeui-block="codeblock-005"] [data-part="stats"]{display:flex;gap:0.625rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="codeblock-005"] [data-part="stats"] b{font-weight:700}
[data-vibeui-block="codeblock-005"] [data-part="stats"] [data-kind="add"]{color:var(--vibeui-codeblock-005-add)}
[data-vibeui-block="codeblock-005"] [data-part="stats"] [data-kind="del"]{color:var(--vibeui-codeblock-005-del)}
[data-vibeui-block="codeblock-005"] pre{margin:0;padding:0.5rem 0;overflow-x:auto}
[data-vibeui-block="codeblock-005"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-005-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
[data-vibeui-block="codeblock-005"] [data-part="row"]{
display:block;padding:0 0.875rem 0 2rem;position:relative;
}
/* Знак строки — не текст: он объясняет диф без опоры на цвет. */
[data-vibeui-block="codeblock-005"] [data-part="row"]::before{
content:" ";position:absolute;left:0.75rem;
color:var(--vibeui-codeblock-005-muted);
user-select:none;-webkit-user-select:none;
}
[data-vibeui-block="codeblock-005"] [data-part="row"][data-kind="add"]{background:var(--vibeui-codeblock-005-add-bg)}
[data-vibeui-block="codeblock-005"] [data-part="row"][data-kind="add"]::before{content:"+";color:var(--vibeui-codeblock-005-add);font-weight:700}
[data-vibeui-block="codeblock-005"] [data-part="row"][data-kind="del"]{background:var(--vibeui-codeblock-005-del-bg)}
[data-vibeui-block="codeblock-005"] [data-part="row"][data-kind="del"]::before{content:"−";color:var(--vibeui-codeblock-005-del);font-weight:700}
[data-vibeui-block="codeblock-005"] [data-part="row"][data-kind="del"] span{opacity:.85}
`

const LINES: Codeblock005Line[] = [
  { text: "export function Price({ value }) {" },
  { text: "  const label = value + ' руб.'", kind: "del" },
  { text: "  const label = format(value)", kind: "add" },
  { text: "  const hint = 'без НДС'", kind: "add" },
  { text: "  return <span>{label}</span>" },
  { text: "}" },
]

/** Диф файла: добавленные и удалённые строки со знаком и подложкой. */
export function Codeblock005({
  path = "components/price.tsx",
  showStats = true,
  lines = LINES,
  className,
  style,
  ...props
}: Codeblock005Props) {
  const added = lines.filter((line) => line.kind === "add").length
  const deleted = lines.filter((line) => line.kind === "del").length

  return (
    <>
      <style href="vibeui-codeblock-005" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="codeblock-005"
        className={className}
        style={style as CSSProperties}
      >
        <figcaption>
          <span data-part="path">{path}</span>
          {showStats ? (
            <span data-part="stats">
              <span data-kind="add">
                <b>+{added}</b> добавлено
              </span>
              <span data-kind="del">
                <b>−{deleted}</b> удалено
              </span>
            </span>
          ) : null}
        </figcaption>
        <pre>
          <code>
            {lines.map((line, index) => (
              <span
                key={index}
                data-part="row"
                data-kind={line.kind}
                aria-label={
                  line.kind === "add"
                    ? "добавлено"
                    : line.kind === "del"
                      ? "удалено"
                      : undefined
                }
              >
                <span>{line.text}</span>
              </span>
            ))}
          </code>
        </pre>
      </figure>
    </>
  )
}
