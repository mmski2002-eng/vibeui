import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  extension?: "pdf" | "doc" | "xls" | "img" | "zip"
  name?: string
  fileSize?: string
}

// Идея компонента: цвет плитки не выбирается вручную под каждое расширение —
// он переключается атрибутом data-extension на одну переменную оттенка,
// поэтому пять типов файлов остаются согласованной палитрой, а не случайным
// набором цветов. Форма файла с загнутым уголком — один инлайновый svg-путь,
// а сокращение расширения печатается поверх него текстом: так добавление
// шестого типа не требует рисовать новую иконку, достаточно новой строки CSS.
const STYLES = `
:where([data-vibeui-block="icontile-012"]){
container-type:inline-size;
--vibeui-icontile-012-hue:258;
--vibeui-icontile-012-size:2.75rem;
--vibeui-icontile-012-fg:oklch(0.26 0.014 265);
--vibeui-icontile-012-muted:oklch(0.52 0.014 265);
--vibeui-icontile-012-border:oklch(0.9 0.006 265);
--vibeui-icontile-012-surface:oklch(1 0 0);
--vibeui-icontile-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="icontile-012"]{
display:flex;align-items:center;gap:0.875rem;min-width:0;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-icontile-012-surface);
border:1px solid var(--vibeui-icontile-012-border);border-radius:0.875rem;
font-family:var(--vibeui-icontile-012-font);
}
[data-vibeui-block="icontile-012"] [data-part="tile"]{
position:relative;display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-012-size);height:var(--vibeui-icontile-012-size);
border-radius:0.75rem;
background:oklch(0.93 0.05 var(--vibeui-icontile-012-hue));
color:oklch(0.44 0.2 var(--vibeui-icontile-012-hue));
}
[data-vibeui-block="icontile-012"] [data-part="tile"] svg{width:56%;height:56%}
[data-vibeui-block="icontile-012"] [data-part="ext"]{
position:absolute;left:50%;bottom:22%;transform:translateX(-50%);
font-size:0.5rem;font-weight:750;letter-spacing:0.02em;
}
[data-vibeui-block="icontile-012"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.125rem;min-width:0;flex:1 1 auto;
}
[data-vibeui-block="icontile-012"] [data-part="name"]{
display:block;margin:0;font-size:0.9375rem;font-weight:650;
color:var(--vibeui-icontile-012-fg);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-012"] [data-part="size"]{
display:block;margin:0;font-size:0.8125rem;color:var(--vibeui-icontile-012-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-012"][data-extension="pdf"]{--vibeui-icontile-012-hue:25}
[data-vibeui-block="icontile-012"][data-extension="doc"]{--vibeui-icontile-012-hue:258}
[data-vibeui-block="icontile-012"][data-extension="xls"]{--vibeui-icontile-012-hue:152}
[data-vibeui-block="icontile-012"][data-extension="img"]{--vibeui-icontile-012-hue:300}
[data-vibeui-block="icontile-012"][data-extension="zip"]{--vibeui-icontile-012-hue:75}
@container (max-width: 220px){
[data-vibeui-block="icontile-012"] [data-part="size"]{display:none}
}
`

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2.5h8l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" />
      <path d="M14 2.5V6a1 1 0 0 0 1 1h3.5" />
    </svg>
  )
}

/**
 * Плитка типа файла: цвет переключается атрибутом data-extension,
 * форма файла — один инлайновый svg с загнутым уголком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile012({
  extension = "pdf",
  name = "Отчёт-Q3.pdf",
  fileSize = "2.4 МБ",
  className,
  style,
  ...props
}: Icontile012Props) {
  return (
    <>
      <style href="vibeui-icontile-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="icontile-012"
        data-extension={extension}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="tile">
          <FileIcon />
          <span data-part="ext">{extension.toUpperCase()}</span>
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="size">{fileSize}</span>
        </span>
      </div>
    </>
  )
}
