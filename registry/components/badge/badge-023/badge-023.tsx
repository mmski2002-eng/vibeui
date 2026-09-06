import type { ComponentProps, CSSProperties } from "react"

export type Badge023Props = Omit<ComponentProps<"span">, "children"> & {
  children?: string
  width?: number
  truncate?: "end" | "middle"
  /** Пусто — плашка держит собственный нейтральный фон. */
  background?: string
}

// Идея компонента: плашка для текста, длину которого никто не гарантирует —
// имени ветки, названия файла, адреса. Два режима обрезки: с конца отрезает
// CSS, а по середине — код, потому что у ветки и у файла значимы оба края,
// и «feature/very-long-…» неотличимо от десятка соседей. Полный текст в
// title и в доступном имени: обрезка не должна терять содержание.
const STYLES = `
:where([data-vibeui-block="badge-023"]){
--vibeui-badge-023-width:16ch;
--vibeui-badge-023-bg:light-dark(oklch(0.96 0 265),oklch(0.26 0 265));
--vibeui-badge-023-fg:light-dark(oklch(0.32 0 265),oklch(0.91 0 265));
--vibeui-badge-023-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-badge-023-font:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-023"]{color-scheme:dark}
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
 * Плашка с усечением длинного текста: с конца или по середине.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge023({
  children = "feature/registry-badge-overflow",
  width = 16,
  truncate = "middle",
  background = "",
  className,
  style,
  ...props
}: Badge023Props) {
  const limit = Math.max(4, Math.round(width))
  const text = truncate === "middle" ? shorten(children, limit) : children
  const clipped = text !== children

  const palette = {
    "--vibeui-badge-023-width": `${limit}ch`,
    ...(background
      ? {
          "--vibeui-badge-023-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-023" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
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
