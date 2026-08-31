import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge023Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  children?: string
  width?: number
  truncate?: "end" | "middle"
}

// Идея компонента: плашка для текста, длину которого никто не гарантирует —
// имени ветки, названия файла, адреса. Два режима обрезки: с конца отрезает
// CSS, а по середине — код, потому что у ветки и у файла значимы оба края,
// и «feature/very-long-…» неотличимо от десятка соседей. Полный текст в
// title и в доступном имени: обрезка не должна терять содержание.
const STYLES = `
:where([data-vibeui-block="badge-023"]){
--vibeui-badge-023-width:16ch;
--vibeui-badge-023-bg:oklch(0.96 0.005 265);
--vibeui-badge-023-fg:oklch(0.32 0.014 265);
--vibeui-badge-023-border:oklch(0.89 0.006 265);
--vibeui-badge-023-font:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="badge-023"]{
position:relative;
display:inline-flex;align-items:center;box-sizing:border-box;
max-width:var(--vibeui-badge-023-width);
height:1.625rem;padding:0 0.625rem;
border:1px solid var(--vibeui-badge-023-border);border-radius:0.4375rem;
background:var(--vibeui-badge-023-bg);color:var(--vibeui-badge-023-fg);
font-family:var(--vibeui-badge-023-font);font-size:0.75rem;font-weight:500;line-height:1;
white-space:nowrap;vertical-align:middle;
}
/* Многоточие живёт на самом тексте: у flex-контейнера text-overflow не
   срабатывает, он просто отрезал бы строку без знака. */
[data-vibeui-block="badge-023"] [data-part="text"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="badge-023"][data-truncate="end"]{overflow:hidden}
/* Обрезка по середине CSS не умеет, поэтому строку режет код. Запас в
   четыре знака — на то, что ch считается по нулю, а буквы шире. */
[data-vibeui-block="badge-023"][data-truncate="middle"]{
overflow:hidden;max-width:calc(var(--vibeui-badge-023-width) + 4ch);
}
[data-vibeui-block="badge-023"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-023"] *{animation:none!important;transition:none!important}}
`

function shorten(text: string, width: number) {
  if (text.length <= width) {
    return text
  }

  const head = Math.ceil((width - 1) / 2)
  const tail = Math.max(1, width - 1 - head)

  return `${text.slice(0, head)}…${text.slice(text.length - tail)}`
}

/**
 * Плашка с усечением длинного текста: с конца или по середине.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge023({
  children = "feature/registry-badge-overflow",
  width = 16,
  truncate = "middle",
  className,
  style,
  ...props
}: Badge023Props) {
  const limit = Math.max(4, Math.round(width))
  const text = truncate === "middle" ? shorten(children, limit) : children
  const clipped = text !== children

  const palette = {
    "--vibeui-badge-023-width": `${limit}ch`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-023" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-023"
        data-truncate={truncate}
        className={className}
        style={palette}
        title={children}
      >
        <span data-part="text" aria-hidden={clipped || undefined}>
          {text}
        </span>
        {clipped ? <span data-part="sr">{children}</span> : null}
      </span>
    </>
  )
}
