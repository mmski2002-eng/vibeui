import type { ComponentProps, CSSProperties } from "react"

export type Card016Props = Omit<ComponentProps<"article">, "children"> & {
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
  /** Слово типа в подписи: ключи те же, что у kind. */
  kindText?: Record<string, string>
  /** Что написать на значке, когда у имени нет расширения. */
  extensionFallback?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка файлового списка. Значок — не иконка формата,
// а «уголок листа», нарисованный градиентом с вырезом: одна фигура на все
// типы, цвет и три буквы делают остальное. Длинное имя обрезается с конца
// первой строки, но расширение вынесено в значок и не теряется.
const STYLES = `
:where([data-vibeui-block="card-016"]){
--vibeui-card-016-bg:transparent;
--vibeui-card-016-surface:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-card-016-ink:light-dark(oklch(0.2 0 265),oklch(0.97 0 265));
--vibeui-card-016-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-card-016-muted:color-mix(in oklab,var(--vibeui-card-016-fg) 68%,transparent);
--vibeui-card-016-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-016-kind:light-dark(oklch(0.295 0 0),oklch(0.903 0 0));
--vibeui-card-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-016"]{color-scheme:dark}
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
[data-vibeui-block="card-016"][data-kind="pdf"]{--vibeui-card-016-kind:light-dark(oklch(0.58 0.19 27),oklch(0.73 0.16 27))}
[data-vibeui-block="card-016"][data-kind="doc"]{--vibeui-card-016-kind:light-dark(oklch(0.55 0.16 255),oklch(0.73 0.14 255))}
[data-vibeui-block="card-016"][data-kind="sheet"]{--vibeui-card-016-kind:light-dark(oklch(0.55 0.15 152),oklch(0.74 0.14 152))}
[data-vibeui-block="card-016"][data-kind="image"]{--vibeui-card-016-kind:light-dark(oklch(0.6 0.16 320),oklch(0.76 0.14 320))}
[data-vibeui-block="card-016"][data-kind="archive"]{--vibeui-card-016-kind:light-dark(oklch(0.66 0.15 78),oklch(0.8 0.14 78))}
[data-vibeui-block="card-016"][data-kind="code"]{--vibeui-card-016-kind:light-dark(oklch(0.56 0.13 200),oklch(0.75 0.12 200))}
/* Уголок листа вырезан clip-path: одна фигура на все типы файлов. */
[data-vibeui-block="card-016"] [data-part="glyph"]{
position:relative;display:flex;align-items:flex-end;justify-content:center;flex:none;
width:2.375rem;height:2.875rem;padding-bottom:0.375rem;box-sizing:border-box;
clip-path:polygon(0 0,68% 0,100% 26%,100% 100%,0 100%);
background:linear-gradient(160deg,
color-mix(in oklab,var(--vibeui-card-016-kind) 16%,var(--vibeui-card-016-surface)),
color-mix(in oklab,var(--vibeui-card-016-kind) 30%,var(--vibeui-card-016-surface)));
color:color-mix(in oklab,var(--vibeui-card-016-kind) 82%,var(--vibeui-card-016-ink));
font-size:0.5625rem;font-weight:750;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="card-016"] [data-part="glyph"]::before{
content:"";position:absolute;inset-block-start:0;inset-inline-end:0;
width:32%;height:26%;
background:color-mix(in oklab,var(--vibeui-card-016-kind) 45%,var(--vibeui-card-016-surface));
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
border:1px solid var(--vibeui-card-016-border);background:var(--vibeui-card-016-surface);
color:var(--vibeui-card-016-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="card-016"] [data-part="action"]:hover{
background:color-mix(in oklab,var(--vibeui-card-016-kind) 10%,var(--vibeui-card-016-surface));
color:color-mix(in oklab,var(--vibeui-card-016-kind) 80%,var(--vibeui-card-016-ink));
}
[data-vibeui-block="card-016"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-card-016-kind);outline-offset:2px;
}
[data-vibeui-block="card-016"] [data-part="action"] svg{width:1rem;height:1rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-016"] *{animation:none!important;transition:none!important}}
`

const KIND_TEXT: Record<string, string> = {
  pdf: "Документ PDF",
  doc: "Текстовый документ",
  sheet: "Таблица",
  image: "Изображение",
  archive: "Архив",
  code: "Исходный код",
}

function extension(name: string, fallback: string) {
  const tail = name.split(".").pop()

  return tail && tail !== name ? tail.slice(0, 4) : fallback
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
  kindText = KIND_TEXT,
  extensionFallback = "файл",
  background = "",
  accent,
  className,
  style,
  ...props
}: Card016Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-016-kind": accent } : null),
    ...(background
      ? {
          "--vibeui-card-016-bg": background,
          "--vibeui-card-016-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-016" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-016"
        data-kind={kind}
        className={className}
        style={palette}
      >
        <span data-part="glyph" aria-hidden="true">
          {extension(name, extensionFallback)}
        </span>
        <div data-part="body">
          <p data-part="name" title={name}>
            {href ? <a href={href}>{name}</a> : name}
          </p>
          <p data-part="facts">
            <span>{kindText[kind] ?? KIND_TEXT[kind]}</span>
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
