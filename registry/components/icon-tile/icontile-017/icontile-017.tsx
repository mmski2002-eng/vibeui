import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile017Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  itemCount?: number
  modifiedLabel?: string
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
}

function pluralizeFiles(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod100 >= 11 && mod100 <= 14) return "файлов"
  if (mod10 === 1) return "файл"
  if (mod10 >= 2 && mod10 <= 4) return "файла"
  return "файлов"
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  )
}

// Идея компонента: число вложений склоняется по русским правилам
// (1 файл / 3 файла / 12 файлов) в рантайме функцией pluralizeFiles, а не
// зашито строкой — иначе плитка с любым count, кроме единицы, звучала бы
// неграмотно. Дата изменения — отдельная часть строки, а не общий текст:
// на узком контейнере она уходит первой через @container, счётчик вложений
// остаётся всегда, потому что он важнее конкретной даты.
const STYLES = `
:where([data-vibeui-block="icontile-017"]){
container-type:inline-size;
--vibeui-icontile-017-hue:262;
--vibeui-icontile-017-chroma:0.05;
--vibeui-icontile-017-size:2.75rem;
--vibeui-icontile-017-fg:oklch(0.26 0.014 265);
--vibeui-icontile-017-muted:oklch(0.52 0.014 265);
--vibeui-icontile-017-border:oklch(0.9 0.006 265);
--vibeui-icontile-017-surface:oklch(1 0 0);
--vibeui-icontile-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="icontile-017"]{
display:flex;align-items:center;gap:0.875rem;min-width:0;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-icontile-017-surface);
border:1px solid var(--vibeui-icontile-017-border);border-radius:0.875rem;
font-family:var(--vibeui-icontile-017-font);
}
[data-vibeui-block="icontile-017"] [data-part="tile"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-017-size);height:var(--vibeui-icontile-017-size);
border-radius:0.75rem;
background:oklch(0.93 var(--vibeui-icontile-017-chroma) var(--vibeui-icontile-017-hue));
color:oklch(0.44 calc(var(--vibeui-icontile-017-chroma) * 4) var(--vibeui-icontile-017-hue));
}
[data-vibeui-block="icontile-017"] [data-part="tile"] > svg{width:54%;height:54%}
[data-vibeui-block="icontile-017"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.1875rem;min-width:0;flex:1 1 auto;
}
[data-vibeui-block="icontile-017"] [data-part="name"]{
display:block;margin:0;font-size:0.9375rem;font-weight:650;
color:var(--vibeui-icontile-017-fg);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-017"] [data-part="meta"]{
display:flex;align-items:center;gap:0.375rem;min-width:0;
font-size:0.8125rem;color:var(--vibeui-icontile-017-muted);
white-space:nowrap;overflow:hidden;
}
[data-vibeui-block="icontile-017"] [data-part="count"]{flex:none}
[data-vibeui-block="icontile-017"] [data-part="dot"]{flex:none}
[data-vibeui-block="icontile-017"] [data-part="modified"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-017"][data-tone="neutral"]{--vibeui-icontile-017-chroma:0.015}
[data-vibeui-block="icontile-017"][data-tone="success"]{--vibeui-icontile-017-hue:152}
[data-vibeui-block="icontile-017"][data-tone="warning"]{--vibeui-icontile-017-hue:75}
[data-vibeui-block="icontile-017"][data-tone="danger"]{--vibeui-icontile-017-hue:25}
@container (max-width: 220px){
[data-vibeui-block="icontile-017"] [data-part="dot"],
[data-vibeui-block="icontile-017"] [data-part="modified"]{display:none}
}
`

/**
 * Плитка папки: иконка, название, число вложений со склонением и дата
 * изменения. Дата уходит первой на узком контейнере, счётчик остаётся.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Icontile017({
  name = "Дизайн-макеты",
  itemCount = 12,
  modifiedLabel = "Изменено 3 дня назад",
  tone = "accent",
  className,
  style,
  ...props
}: Icontile017Props) {
  const clamped = Math.max(0, itemCount)

  return (
    <>
      <style href="vibeui-icontile-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="icontile-017"
        data-tone={tone}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="tile">
          <FolderIcon />
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="meta">
            <span data-part="count">
              {clamped} {pluralizeFiles(clamped)}
            </span>
            <span data-part="dot" aria-hidden="true">
              ·
            </span>
            <span data-part="modified">{modifiedLabel}</span>
          </span>
        </span>
      </div>
    </>
  )
}
