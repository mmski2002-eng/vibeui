import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card016Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "children"
> & {
  /** Имя файла вместе с расширением: из него берётся тип и подпись значка. */
  name?: string
  /** Размер готовой строкой: «2,4 МБ». Компонент ничего не пересчитывает. */
  size?: string
  /** Тип файла. Задаёт цвет значка и слово в подписи. */
  kind?: "pdf" | "doc" | "sheet" | "image" | "archive" | "code"
  /** Когда обновлён: «вчера, 18:40». */
  updated?: string
  actionLabel?: string
  href?: string
  accent?: string
}

// Идея компонента: строка файлового списка. Значок — не иконка формата,
// а «уголок листа», нарисованный градиентом с вырезом: одна фигура на все
// типы, цвет и три буквы делают остальное. Длинное имя обрезается с конца
// первой строки, но расширение вынесено в значок и не теряется.
const STYLES = `
:where([data-vibeui-block="card-016"]){
--vibeui-card-016-bg:oklch(1 0 0);
--vibeui-card-016-fg:oklch(0.22 0.015 265);
--vibeui-card-016-muted:oklch(0.56 0.013 265);
--vibeui-card-016-border:oklch(0.91 0.006 265);
--vibeui-card-016-kind:oklch(0.58 0.16 265);
--vibeui-card-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="card-016"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.75rem 0.875rem;
background:var(--vibeui-card-016-bg);color:var(--vibeui-card-016-fg);
border:1px solid var(--vibeui-card-016-border);border-radius:0.8125rem;
font-family:var(--vibeui-card-016-font);
transition:border-color .16s ease;
}
[data-vibeui-block="card-016"]:hover{
border-color:color-mix(in oklab,var(--vibeui-card-016-kind) 35%,var(--vibeui-card-016-border));
}
[data-vibeui-block="card-016"][data-kind="pdf"]{--vibeui-card-016-kind:oklch(0.58 0.19 27)}
[data-vibeui-block="card-016"][data-kind="doc"]{--vibeui-card-016-kind:oklch(0.55 0.16 255)}
[data-vibeui-block="card-016"][data-kind="sheet"]{--vibeui-card-016-kind:oklch(0.55 0.15 152)}
[data-vibeui-block="card-016"][data-kind="image"]{--vibeui-card-016-kind:oklch(0.6 0.16 320)}
[data-vibeui-block="card-016"][data-kind="archive"]{--vibeui-card-016-kind:oklch(0.66 0.15 78)}
[data-vibeui-block="card-016"][data-kind="code"]{--vibeui-card-016-kind:oklch(0.56 0.13 200)}
/* Уголок листа вырезан clip-path: одна фигура на все типы файлов. */
[data-vibeui-block="card-016"] [data-part="glyph"]{
position:relative;display:flex;align-items:flex-end;justify-content:center;flex:none;
width:2.375rem;height:2.875rem;padding-bottom:0.375rem;box-sizing:border-box;
clip-path:polygon(0 0,68% 0,100% 26%,100% 100%,0 100%);
background:linear-gradient(160deg,
color-mix(in oklab,var(--vibeui-card-016-kind) 16%,oklch(1 0 0)),
color-mix(in oklab,var(--vibeui-card-016-kind) 30%,oklch(1 0 0)));
color:color-mix(in oklab,var(--vibeui-card-016-kind) 82%,oklch(0.2 0.02 265));
font-size:0.5625rem;font-weight:750;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="card-016"] [data-part="glyph"]::before{
content:"";position:absolute;inset-block-start:0;inset-inline-end:0;
width:32%;height:26%;
background:color-mix(in oklab,var(--vibeui-card-016-kind) 45%,oklch(1 0 0));
}
[data-vibeui-block="card-016"] [data-part="body"]{
flex:1;min-width:0;display:flex;flex-direction:column;gap:0.1875rem;
}
[data-vibeui-block="card-016"] [data-part="name"]{
margin:0;font-size:0.875rem;font-weight:620;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="card-016"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="card-016"] [data-part="name"] a:hover{text-decoration:underline}
[data-vibeui-block="card-016"] [data-part="name"] a:focus-visible{
outline:2px solid var(--vibeui-card-016-kind);outline-offset:2px;border-radius:0.25rem;
}
/* Тип, размер и дата — один ряд с точками-разделителями, а не три строки:
   в списке из сорока файлов высота строки дороже подробностей. */
[data-vibeui-block="card-016"] [data-part="facts"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.375rem;
margin:0;font-size:0.75rem;color:var(--vibeui-card-016-muted);
}
[data-vibeui-block="card-016"] [data-part="facts"] > * + *::before{
content:"·";margin-inline-end:0.375rem;color:var(--vibeui-card-016-border);
}
[data-vibeui-block="card-016"] [data-part="size"]{font-variant-numeric:tabular-nums}
[data-vibeui-block="card-016"] [data-part="action"]{
appearance:none;cursor:pointer;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-016-border);background:oklch(1 0 0);
color:var(--vibeui-card-016-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="card-016"] [data-part="action"]:hover{
background:color-mix(in oklab,var(--vibeui-card-016-kind) 10%,oklch(1 0 0));
color:color-mix(in oklab,var(--vibeui-card-016-kind) 80%,oklch(0.2 0.02 265));
}
[data-vibeui-block="card-016"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-card-016-kind);outline-offset:2px;
}
[data-vibeui-block="card-016"] [data-part="action"] svg{width:1rem;height:1rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-016"] *{animation:none!important;transition:none!important}}
`

const KIND_TEXT = {
  pdf: "Документ PDF",
  doc: "Текстовый документ",
  sheet: "Таблица",
  image: "Изображение",
  archive: "Архив",
  code: "Исходный код",
}

function extension(name: string) {
  const tail = name.split(".").pop()

  return tail && tail !== name ? tail.slice(0, 4) : "файл"
}

/**
 * Карточка файла: значок с расширением, имя, тип, размер и дата.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card016({
  name = "Каталог компонентов, версия 4.pdf",
  size = "2,4 МБ",
  kind = "pdf",
  updated = "вчера, 18:40",
  actionLabel = "Скачать файл",
  href = "#",
  accent,
  className,
  style,
  ...props
}: Card016Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-016-kind": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-016" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-vibeui-block="card-016"
        data-kind={kind}
        className={className}
        style={palette}
      >
        <span data-part="glyph" aria-hidden="true">
          {extension(name)}
        </span>
        <div data-part="body">
          <p data-part="name" title={name}>
            {href ? <a href={href}>{name}</a> : name}
          </p>
          <p data-part="facts">
            <span>{KIND_TEXT[kind]}</span>
            {size ? <span data-part="size">{size}</span> : null}
            {updated ? <span>{updated}</span> : null}
          </p>
        </div>
        <button data-part="action" type="button" aria-label={actionLabel}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 2.5v8m0 0L4.8 7.3M8 10.5l3.2-3.2M3 13h10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </article>
    </>
  )
}
