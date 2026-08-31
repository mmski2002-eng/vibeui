import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb014Kind =
  "space" | "folder" | "database" | "table" | "record"

export type Breadcrumb014Item = {
  label: string
  href?: string
  kind?: Breadcrumb014Kind
}

export type Breadcrumb014Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  items?: Breadcrumb014Item[]
  currentLabel?: string
  currentKind?: Breadcrumb014Kind
  accent?: string
}

// Идея компонента: каждый уровень пути несёт тип узла, и тип различает
// ФОРМА значка, а не только цвет — пространство, папка, база, таблица,
// запись. В админках путь состоит из разнородных сущностей, и цепочка
// «Продажи / Продажи / Продажи» без типа читается как ошибка. Значки —
// инлайновый SVG в один контур: пакет иконок компоненту не нужен.
const STYLES = `
:where([data-vibeui-block="breadcrumb-014"]){
--vibeui-breadcrumb-014-surface:oklch(1 0 0);
--vibeui-breadcrumb-014-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-014-fg:oklch(0.26 0.016 265);
--vibeui-breadcrumb-014-muted:oklch(0.55 0.014 265);
--vibeui-breadcrumb-014-faint:oklch(0.78 0.01 265);
--vibeui-breadcrumb-014-chip:oklch(0.97 0.003 265);
--vibeui-breadcrumb-014-chip-border:oklch(0.92 0.005 265);
--vibeui-breadcrumb-014-space:oklch(0.55 0.15 285);
--vibeui-breadcrumb-014-folder:oklch(0.6 0.13 75);
--vibeui-breadcrumb-014-database:oklch(0.55 0.12 195);
--vibeui-breadcrumb-014-table:oklch(0.52 0.13 150);
--vibeui-breadcrumb-014-record:oklch(0.52 0.02 265);
--vibeui-breadcrumb-014-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная светлая подложка: путь — это тёмный текст, и на тёмной
   карточке каталога он обязан читаться без правки темы проекта. */
[data-vibeui-block="breadcrumb-014"]{
box-sizing:border-box;width:100%;max-width:38rem;
padding:0.5rem 0.625rem;
background:var(--vibeui-breadcrumb-014-surface);
border:1px solid var(--vibeui-breadcrumb-014-surface-border);border-radius:0.625rem;
font-family:var(--vibeui-breadcrumb-014-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-014-muted);
}
[data-vibeui-block="breadcrumb-014"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.25rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-014"] li{display:inline-flex;align-items:center;gap:0.25rem}
[data-vibeui-block="breadcrumb-014"] li + li::before{
content:"";flex:none;width:0.3125rem;height:0.3125rem;
border-right:1.5px solid var(--vibeui-breadcrumb-014-faint);
border-top:1.5px solid var(--vibeui-breadcrumb-014-faint);
transform:rotate(45deg);
}
[data-vibeui-block="breadcrumb-014"] [data-part="crumb"]{
position:relative;display:inline-flex;align-items:center;gap:0.375rem;
padding:0.1875rem 0.4375rem;border:1px solid transparent;border-radius:0.4375rem;
color:inherit;text-decoration:none;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="breadcrumb-014"] a[data-part="crumb"]:hover{
color:var(--vibeui-breadcrumb-014-fg);
background:var(--vibeui-breadcrumb-014-chip);
border-color:var(--vibeui-breadcrumb-014-chip-border);
}
[data-vibeui-block="breadcrumb-014"] a[data-part="crumb"]:focus-visible{outline:2px solid var(--vibeui-breadcrumb-014-accent);outline-offset:2px}
[data-vibeui-block="breadcrumb-014"] [aria-current="page"]{
color:var(--vibeui-breadcrumb-014-fg);font-weight:600;
background:var(--vibeui-breadcrumb-014-chip);
border-color:var(--vibeui-breadcrumb-014-chip-border);
}
/* Значок несёт тип формой контура, цвет — только вторая подсказка:
   в монохроме и при дальтонизме форма остаётся различимой. */
[data-vibeui-block="breadcrumb-014"] svg{
flex:none;width:0.875rem;height:0.875rem;
fill:none;stroke:currentColor;stroke-width:1.4;
stroke-linejoin:round;stroke-linecap:round;
color:var(--vibeui-breadcrumb-014-record);
}
[data-vibeui-block="breadcrumb-014"] [data-kind="space"] svg{color:var(--vibeui-breadcrumb-014-space)}
[data-vibeui-block="breadcrumb-014"] [data-kind="folder"] svg{color:var(--vibeui-breadcrumb-014-folder)}
[data-vibeui-block="breadcrumb-014"] [data-kind="database"] svg{color:var(--vibeui-breadcrumb-014-database)}
[data-vibeui-block="breadcrumb-014"] [data-kind="table"] svg{color:var(--vibeui-breadcrumb-014-table)}
/* Тип узла произносится вслух: значок для скринридера пустой. */
[data-vibeui-block="breadcrumb-014"] [data-part="kind"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-014"] *{animation:none!important;transition:none!important}}
`

// Пять контуров, различимых по силуэту: круг, язычок папки, цилиндр,
// сетка, лист со скосом. Все рисуются штрихом одной толщины.
const PATHS: Record<Breadcrumb014Kind, string> = {
  space:
    "M8 2.6a5.4 5.4 0 1 0 0 10.8a5.4 5.4 0 1 0 0-10.8ZM8 5.9a2.1 2.1 0 1 0 0 4.2a2.1 2.1 0 1 0 0-4.2Z",
  folder: "M2.2 12.4V4a1 1 0 0 1 1-1h2.6l1.5 1.7h5.5a1 1 0 0 1 1 1v6.7Z",
  database:
    "M12.6 4.1c0 1-2 1.7-4.6 1.7S3.4 5.1 3.4 4.1S5.4 2.4 8 2.4S12.6 3.1 12.6 4.1ZM3.4 4.1v7.8c0 1 2 1.7 4.6 1.7s4.6-.7 4.6-1.7V4.1M3.4 8c0 1 2 1.7 4.6 1.7s4.6-.7 4.6-1.7",
  table: "M2.6 3.2h10.8v9.6H2.6ZM2.6 6.4h10.8M2.6 9.6h10.8M6.6 6.4v6.4",
  record: "M8.6 2.6H4.4v10.8h7.2V5.6ZM8.6 2.6v3h3",
}

const KIND_NAMES: Record<Breadcrumb014Kind, string> = {
  space: "Пространство",
  folder: "Папка",
  database: "База данных",
  table: "Таблица",
  record: "Запись",
}

const DEFAULT_ITEMS: Breadcrumb014Item[] = [
  { label: "Аналитика", href: "#", kind: "space" },
  { label: "Продажи", href: "#", kind: "folder" },
  { label: "CRM", href: "#", kind: "database" },
  { label: "Сделки", href: "#", kind: "table" },
  { label: "Сделка №4471", kind: "record" },
]

/**
 * Путь, где тип каждого узла различается формой значка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb014({
  items = DEFAULT_ITEMS,
  currentLabel = "Сделка №4471",
  currentKind = "record",
  accent,
  className,
  style,
  ...props
}: Breadcrumb014Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-014" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-014"
        aria-label="Хлебные крошки"
        className={className}
        style={palette}
      >
        <ol>
          {items.map((item, index) => {
            const last = index === items.length - 1
            const kind = last ? currentKind : (item.kind ?? "folder")
            const label = last ? currentLabel : item.label
            const body = (
              <>
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d={PATHS[kind]} />
                </svg>
                <span data-part="kind">{KIND_NAMES[kind]}: </span>
                <span>{label}</span>
              </>
            )

            return (
              <li key={`${item.label}-${index}`} data-kind={kind}>
                {item.href && !last ? (
                  <a href={item.href} data-part="crumb">
                    {body}
                  </a>
                ) : (
                  <span data-part="crumb" aria-current="page">
                    {body}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
