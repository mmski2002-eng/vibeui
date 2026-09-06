import type { ComponentProps, CSSProperties } from "react"

export type Codeblock005Line = {
  text: string
  kind?: "add" | "del"
}

export type Codeblock005Props = Omit<ComponentProps<"figure">, "children"> & {
  path?: string
  showStats?: boolean
  lines?: Codeblock005Line[]
  /** Подписи видов строки: компонент несёт русские, проект подставляет свои. */
  kindText?: Record<string, string>
  /** Пусто — подложки нет, диф лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: диф, который читается и без цвета. Знак «+» или «−»
// рисуется псевдоэлементом рядом с каждой строкой, поэтому смысл строки
// понятен при дальтонизме и в чёрно-белой печати, а в буфер он не попадает.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, подложки строк остаются полупрозрачными и работают на обеих темах.
const STYLES = `
:where([data-vibeui-block="codeblock-005"]){
--vibeui-codeblock-005-bg:transparent;
--vibeui-codeblock-005-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-005-fg:light-dark(oklch(0.27 0 265),oklch(0.92 0 265));
--vibeui-codeblock-005-muted:color-mix(in oklab,var(--vibeui-codeblock-005-fg) 68%,transparent);
--vibeui-codeblock-005-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 13%));
--vibeui-codeblock-005-add:light-dark(oklch(0.49 0.15 150),oklch(0.84 0.15 150));
--vibeui-codeblock-005-add-bg:light-dark(oklch(0.75 0.16 150 / 28%),oklch(0.5 0.13 150 / 22%));
--vibeui-codeblock-005-del:light-dark(oklch(0.5 0.18 22),oklch(0.79 0.15 22));
--vibeui-codeblock-005-del-bg:light-dark(oklch(0.75 0.17 22 / 26%),oklch(0.5 0.15 22 / 22%));
--vibeui-codeblock-005-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-005"]{color-scheme:dark}
[data-vibeui-block="codeblock-005"]{
display:flex;flex-direction:column;
width:100%;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-005-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-005-bg);color:var(--vibeui-codeblock-005-fg);
font-family:var(--vibeui-codeblock-005-font);
}
[data-vibeui-block="codeblock-005"] figcaption{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.375rem 0.75rem;
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-005-head);
border-bottom:1px solid var(--vibeui-codeblock-005-border);
font-size:0.75rem;color:var(--vibeui-codeblock-005-muted);
}
[data-vibeui-block="codeblock-005"] [data-part="path"]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--vibeui-codeblock-005-mono)}
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
/* Знак строки — псевдоэлемент, подложка — цвет: в дерево доступности не
   попадает ни то, ни другое. user-select:none держит подпись вне выделения,
   иначе она уехала бы в буфер вместе с кодом. */
[data-vibeui-block="codeblock-005"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
user-select:none;-webkit-user-select:none;
}
`

const LINES: Codeblock005Line[] = [
  { text: "export function Price({ value }) {" },
  { text: "  const label = value + ' руб.'", kind: "del" },
  { text: "  const label = format(value)", kind: "add" },
  { text: "  const hint = 'без НДС'", kind: "add" },
  { text: "  return <span>{label}</span>" },
  { text: "}" },
]

const KIND_TEXT: Record<string, string> = {
  add: "добавлено",
  del: "удалено",
}

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

/** Диф файла: добавленные и удалённые строки со знаком и подложкой. */
export function Codeblock005({
  path = "components/price.tsx",
  showStats = true,
  lines = LINES,
  kindText = KIND_TEXT,
  background = "",
  className,
  style,
  ...props
}: Codeblock005Props) {
  const added = lines.filter((line) => line.kind === "add").length
  const deleted = lines.filter((line) => line.kind === "del").length
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-005" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-005"
        className={className}
        style={palette}
      >
        <figcaption>
          <span data-part="path">{path}</span>
          {showStats ? (
            <span data-part="stats">
              <span data-kind="add">
                <b>+{added}</b> {kindText.add ?? KIND_TEXT.add}
              </span>
              <span data-kind="del">
                <b>−{deleted}</b> {kindText.del ?? KIND_TEXT.del}
              </span>
            </span>
          ) : null}
        </figcaption>
        <pre>
          <code>
            {lines.map((line, index) => (
              <span key={index} data-part="row" data-kind={line.kind}>
                {line.kind ? (
                  <span data-part="sr">
                    {kindText[line.kind] ?? KIND_TEXT[line.kind]}
                  </span>
                ) : null}
                <span>{line.text}</span>
              </span>
            ))}
          </code>
        </pre>
      </figure>
    </>
  )
}
