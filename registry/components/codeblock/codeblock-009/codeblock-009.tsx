import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Codeblock009Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children"
> & {
  path?: string
  status?: string
  code?: string
}

// Идея компонента: светлый блок кода, у которого шапка — это путь к файлу.
// Путь разложен на сегменты: каталоги приглушены, имя файла выделено, а
// расширение вынесено в отдельный значок, поэтому файл узнаётся с одного
// взгляда даже в длинном пути.
const STYLES = `
:where([data-vibeui-block="codeblock-009"]){
--vibeui-codeblock-009-bg:oklch(1 0 0);
--vibeui-codeblock-009-code-bg:oklch(0.975 0.003 265);
--vibeui-codeblock-009-fg:oklch(0.26 0.016 265);
--vibeui-codeblock-009-muted:oklch(0.56 0.014 265);
--vibeui-codeblock-009-border:oklch(0.9 0.006 265);
--vibeui-codeblock-009-badge-bg:oklch(0.93 0.04 250);
--vibeui-codeblock-009-badge-fg:oklch(0.42 0.13 255);
--vibeui-codeblock-009-status-bg:oklch(0.94 0.05 85);
--vibeui-codeblock-009-status-fg:oklch(0.45 0.11 70);
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

/** Светлый блок кода с шапкой: путь к файлу, расширение и статус. */
export function Codeblock009({
  path = "app/(site)/layout.tsx",
  status = "изменён",
  code = CODE,
  className,
  style,
  ...props
}: Codeblock009Props) {
  const segments = path.split("/").filter(Boolean)
  const file = segments[segments.length - 1] ?? path
  const extension = file.includes(".") ? file.split(".").pop() : "txt"

  return (
    <>
      <style href="vibeui-codeblock-009" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="codeblock-009"
        className={className}
        style={style as CSSProperties}
      >
        <figcaption>
          <span data-part="badge">{extension}</span>
          <ol data-part="crumbs" aria-label={`Путь к файлу: ${path}`}>
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
