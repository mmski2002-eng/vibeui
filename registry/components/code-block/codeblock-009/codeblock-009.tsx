import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Codeblock009Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children"
> & {
  path?: string
  status?: string
  code?: string
  /** Подпись пути для скринридера: {path} — сам путь. */
  pathLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: блок кода, у которого шапка — это путь к файлу.
// Путь разложен на сегменты: каталоги приглушены, имя файла выделено, а
// расширение вынесено в отдельный значок, поэтому файл узнаётся с одного
// взгляда даже в длинном пути.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, а область кода отделена от шапки полупрозрачной накладкой.
const STYLES = `
:where([data-vibeui-block="codeblock-009"]){
--vibeui-codeblock-009-bg:transparent;
--vibeui-codeblock-009-code-bg:light-dark(oklch(0 0 0 / 3%),oklch(1 0 0 / 4%));
--vibeui-codeblock-009-fg:light-dark(oklch(0.26 0.016 265),oklch(0.93 0.008 265));
--vibeui-codeblock-009-muted:light-dark(oklch(0.56 0.014 265),oklch(0.67 0.014 265));
--vibeui-codeblock-009-border:light-dark(oklch(0.9 0.006 265),oklch(1 0 0 / 14%));
--vibeui-codeblock-009-badge-bg:light-dark(oklch(0.93 0.04 250),oklch(0.45 0.09 250 / 48%));
--vibeui-codeblock-009-badge-fg:light-dark(oklch(0.42 0.13 255),oklch(0.86 0.09 255));
--vibeui-codeblock-009-status-bg:light-dark(oklch(0.94 0.05 85),oklch(0.47 0.08 80 / 48%));
--vibeui-codeblock-009-status-fg:light-dark(oklch(0.45 0.11 70),oklch(0.87 0.09 85));
--vibeui-codeblock-009-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-009"]{
display:flex;flex-direction:column;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-009-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-009-bg);color:var(--vibeui-codeblock-009-fg);
font-family:var(--vibeui-codeblock-009-font);
}
[data-vibeui-block="codeblock-009"] figcaption{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.75rem;border-bottom:1px solid var(--vibeui-codeblock-009-border);
}
[data-vibeui-block="codeblock-009"] [data-part="badge"]{
flex:none;padding:0.1875rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-codeblock-009-badge-bg);color:var(--vibeui-codeblock-009-badge-fg);
font-size:0.625rem;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="codeblock-009"] [data-part="crumbs"]{
display:flex;align-items:baseline;min-width:0;flex:1 1 auto;
margin:0;padding:0;list-style:none;
font-family:var(--vibeui-codeblock-009-mono);font-size:0.75rem;
}
[data-vibeui-block="codeblock-009"] [data-part="crumbs"] li{
color:var(--vibeui-codeblock-009-muted);white-space:nowrap;
overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="codeblock-009"] [data-part="crumbs"] li::after{content:"/";margin:0 0.25rem;opacity:.5}
[data-vibeui-block="codeblock-009"] [data-part="crumbs"] li:last-child{
color:var(--vibeui-codeblock-009-fg);font-weight:650;flex:0 1 auto;
}
[data-vibeui-block="codeblock-009"] [data-part="crumbs"] li:last-child::after{content:none}
[data-vibeui-block="codeblock-009"] [data-part="status"]{
flex:none;padding:0.1875rem 0.4375rem;border-radius:999px;
background:var(--vibeui-codeblock-009-status-bg);color:var(--vibeui-codeblock-009-status-fg);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="codeblock-009"] pre{
margin:0;padding:0.875rem;overflow-x:auto;
background:var(--vibeui-codeblock-009-code-bg);
}
[data-vibeui-block="codeblock-009"] code{
display:block;
font-family:var(--vibeui-codeblock-009-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
`

const CODE = `export const metadata = {
  title: "VibeUI",
  description: "Компоненты для вайбкодинга",
}`

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

/** Блок кода с шапкой: путь к файлу, расширение и статус. */
export function Codeblock009({
  path = "app/(site)/layout.tsx",
  status = "изменён",
  code = CODE,
  pathLabel = "Путь к файлу: {path}",
  background = "",
  className,
  style,
  ...props
}: Codeblock009Props) {
  const segments = path.split("/").filter(Boolean)
  const file = segments[segments.length - 1] ?? path
  const extension = file.includes(".") ? file.split(".").pop() : "txt"
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-009" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="codeblock-009"
        className={className}
        style={palette}
      >
        <figcaption>
          <span data-part="badge">{extension}</span>
          <ol data-part="crumbs" aria-label={pathLabel.replace("{path}", path)}>
            {segments.map((segment, index) => (
              <li key={index}>{segment}</li>
            ))}
          </ol>
          {status ? <span data-part="status">{status}</span> : null}
        </figcaption>
        <pre>
          <code>{code}</code>
        </pre>
      </figure>
    </>
  )
}
