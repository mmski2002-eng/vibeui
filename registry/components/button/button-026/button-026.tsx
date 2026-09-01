import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button026Props = Omit<
  ComponentPropsWithoutRef<"a">,
  "children" | "download"
> & {
  label?: string
  /** Имя файла: из него берутся значок формата и атрибут download. */
  fileName?: string
  /** Размер строкой — его считает сервер, а не кнопка. */
  size?: string
  accent?: string
}

// Идея компонента: перед скачиванием человек хочет знать, что именно
// прилетит. Это настоящая ссылка с атрибутом download, а не button: работают
// средняя кнопка мыши, «сохранить как» и копирование адреса. Формат берётся
// из расширения имени файла и рисуется плашкой, вес стоит рядом — по этой
// паре решают, качать ли сейчас или с вайфая.
const STYLES = `
:where([data-vibeui-block="button-026"]){
--vibeui-button-026-bg:oklch(1 0 0);
--vibeui-button-026-fg:oklch(0.26 0.016 265);
--vibeui-button-026-muted:oklch(0.55 0.014 265);
--vibeui-button-026-border:oklch(0.9 0.006 265);
--vibeui-button-026-accent:oklch(0.55 0.17 265);
--vibeui-button-026-badge:oklch(0.55 0.19 25);
--vibeui-button-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-026"]{
display:flex;align-items:center;gap:0.75rem;text-decoration:none;
width:100%;max-width:20rem;padding:0.625rem 0.875rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-026-border);border-radius:0.75rem;
background:var(--vibeui-button-026-bg);color:var(--vibeui-button-026-fg);
font-family:var(--vibeui-button-026-font);
transition:border-color .16s ease,transform .16s ease;
}
[data-vibeui-block="button-026"]:hover{border-color:var(--vibeui-button-026-accent)}
[data-vibeui-block="button-026"]:focus-visible{outline:2px solid var(--vibeui-button-026-accent);outline-offset:2px}
/* Плашка формата: расширение читается быстрее, чем хвост имени файла. */
[data-vibeui-block="button-026"] [data-part="badge"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.5rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-button-026-badge) 12%,transparent);
color:var(--vibeui-button-026-badge);
font-size:0.625rem;font-weight:750;letter-spacing:0.04em;
}
[data-vibeui-block="button-026"][data-format="zip"]{--vibeui-button-026-badge:oklch(0.6 0.14 75)}
[data-vibeui-block="button-026"][data-format="csv"]{--vibeui-button-026-badge:oklch(0.52 0.14 152)}
[data-vibeui-block="button-026"][data-format="png"]{--vibeui-button-026-badge:oklch(0.55 0.15 300)}
[data-vibeui-block="button-026"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0}
[data-vibeui-block="button-026"] [data-part="title"]{
font-size:0.875rem;font-weight:650;line-height:1.2;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="button-026"] [data-part="meta"]{
color:var(--vibeui-button-026-muted);font-size:0.75rem;line-height:1.2;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="button-026"] [data-part="arrow"]{
flex:none;margin-left:auto;position:relative;width:0.875rem;height:1rem;
color:var(--vibeui-button-026-accent);
transition:transform .16s ease;
}
[data-vibeui-block="button-026"] [data-part="arrow"]::before{
content:"";position:absolute;left:50%;top:0;width:2px;height:0.6875rem;
margin-left:-1px;border-radius:1px;background:currentColor;
}
[data-vibeui-block="button-026"] [data-part="arrow"]::after{
content:"";position:absolute;left:50%;top:0.3125rem;width:0.5rem;height:0.5rem;
margin-left:-0.25rem;box-sizing:border-box;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(45deg);
}
[data-vibeui-block="button-026"]:hover [data-part="arrow"]{transform:translateY(2px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-026"] *{animation:none!important;transition:none!important}}
`

function formatOf(fileName: string) {
  const dot = fileName.lastIndexOf(".")
  return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : "file"
}

/**
 * Ссылка-кнопка скачивания: формат, имя и вес файла видны до клика.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button026({
  label = "Отчёт за март",
  fileName = "vibeui-report-march.pdf",
  size = "2,4 МБ",
  accent,
  href = "#",
  className,
  style,
  ...props
}: Button026Props) {
  const format = formatOf(fileName)

  const palette = {
    ...(accent ? { "--vibeui-button-026-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-026" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        href={href}
        download={fileName}
        data-vibeui-block="button-026"
        data-format={format}
        className={className}
        style={palette}
        aria-label={`${label}, ${format.toUpperCase()}, ${size}`}
      >
        <span data-part="badge" aria-hidden="true">
          {format.toUpperCase()}
        </span>
        <span data-part="text">
          <span data-part="title">{label}</span>
          <span data-part="meta" aria-hidden="true">
            {format.toUpperCase()} · {size}
          </span>
        </span>
        <span data-part="arrow" aria-hidden="true" />
      </a>
    </>
  )
}
