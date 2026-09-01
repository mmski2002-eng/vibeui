import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sidebar007Item = {
  label: string
  href?: string
  count?: number
  /** Тон бейджа: обычный счётчик, требующий внимания или просто «новое». */
  tone?: "muted" | "alert" | "new"
}

export type Sidebar007Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  items?: Sidebar007Item[]
  activeLabel?: string
  /** Число, выше которого счётчик показывается как «99+». */
  cap?: number
  accent?: string
}

// Идея компонента: счётчики в меню разного веса. Обычный — серая цифра,
// требующий внимания — залитая плашка, «новое без числа» — точка. Один
// одинаковый бейдж на всё превращает меню в рябь из цифр, и срочное в нём
// теряется. Большие числа обрезаются до «99+»: точное значение всё равно
// никто не читает, а ширина колонки от него уезжает.
const STYLES = `
:where([data-vibeui-block="sidebar-007"]){
--vibeui-sidebar-007-bg:oklch(1 0 0);
--vibeui-sidebar-007-fg:oklch(0.25 0.016 265);
--vibeui-sidebar-007-muted:oklch(0.55 0.014 265);
--vibeui-sidebar-007-border:oklch(0.91 0.006 265);
--vibeui-sidebar-007-accent:oklch(0.55 0.19 262);
--vibeui-sidebar-007-alert:oklch(0.57 0.2 25);
--vibeui-sidebar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sidebar-007"]{
display:flex;flex-direction:column;gap:0.125rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-sidebar-007-bg);color:var(--vibeui-sidebar-007-fg);
border:1px solid var(--vibeui-sidebar-007-border);border-radius:0.875rem;
font-family:var(--vibeui-sidebar-007-font);
}
[data-vibeui-block="sidebar-007"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-007"] a{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
color:var(--vibeui-sidebar-007-muted);text-decoration:none;
font-size:0.875rem;line-height:1.3;
}
[data-vibeui-block="sidebar-007"] a:hover{background:oklch(0.55 0.02 265 / 7%);color:var(--vibeui-sidebar-007-fg)}
[data-vibeui-block="sidebar-007"] a:focus-visible{outline:2px solid var(--vibeui-sidebar-007-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-007"] a[aria-current="page"]{
background:color-mix(in oklab,var(--vibeui-sidebar-007-accent) 12%,transparent);
color:var(--vibeui-sidebar-007-fg);font-weight:600;
}
[data-vibeui-block="sidebar-007"] [data-part="label"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* Счётчик прижат к правому краю распоркой: подписи разной длины, а цифры
   обязаны стоять по одной вертикали. */
[data-vibeui-block="sidebar-007"] [data-part="badge"]{
margin-left:auto;flex:none;
min-width:1.25rem;box-sizing:border-box;padding:0 0.3125rem;
border-radius:9999px;text-align:center;
font-size:0.6875rem;font-weight:700;line-height:1.125rem;
font-variant-numeric:tabular-nums;
background:oklch(0.55 0.02 265 / 10%);color:var(--vibeui-sidebar-007-muted);
}
[data-vibeui-block="sidebar-007"] [data-tone="alert"] [data-part="badge"]{
background:var(--vibeui-sidebar-007-alert);color:oklch(1 0 0);
}
/* Точка вместо числа: «есть новое» — это не количество. */
[data-vibeui-block="sidebar-007"] [data-part="dot"]{
margin-left:auto;flex:none;width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-sidebar-007-accent);
}
[data-vibeui-block="sidebar-007"] [data-part="hint"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Sidebar007Item[] = [
  { label: "Входящие", href: "#", count: 128, tone: "muted" },
  { label: "Требуют ответа", href: "#", count: 7, tone: "alert" },
  { label: "Черновики", href: "#", count: 2, tone: "muted" },
  { label: "Обновления", href: "#", tone: "new" },
  { label: "Архив", href: "#" },
]

/**
 * Меню со счётчиками трёх весов: серая цифра, срочная плашка и точка «новое».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar007({
  items = DEFAULT_ITEMS,
  activeLabel = "Требуют ответа",
  cap = 99,
  accent,
  className,
  style,
  ...props
}: Sidebar007Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sidebar-007" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="sidebar-007"
        aria-label="Почта"
        className={className}
        style={palette}
      >
        <ul>
          {items.map((item) => (
            <li key={item.label} data-tone={item.tone ?? "muted"}>
              <a
                href={item.href}
                aria-current={item.label === activeLabel ? "page" : undefined}
              >
                <span data-part="label">{item.label}</span>
                {item.count !== undefined ? (
                  <span data-part="badge">
                    {item.count > cap ? `${cap}+` : item.count}
                    <span data-part="hint"> непрочитанных</span>
                  </span>
                ) : null}
                {item.count === undefined && item.tone === "new" ? (
                  <>
                    <span data-part="dot" aria-hidden="true" />
                    <span data-part="hint">есть новое</span>
                  </>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
