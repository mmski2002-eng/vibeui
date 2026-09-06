import type { ComponentProps, CSSProperties } from "react"

export type Sidebar007Item = {
  label: string
  href?: string
  count?: number
  /** Тон бейджа: обычный счётчик, требующий внимания или просто «новое». */
  tone?: "muted" | "alert" | "new"
}

export type Sidebar007Props = Omit<ComponentProps<"nav">, "children"> & {
  items?: Sidebar007Item[]
  activeLabel?: string
  /** Число, выше которого счётчик показывается как «99+». */
  cap?: number
  /** Подпись всей навигации для скринридера. */
  navLabel?: string
  /** Что скринридер читает после числа в счётчике. */
  countText?: string
  /** Что скринридер читает у точки «есть новое». */
  newText?: string
  /** Срочность залитой плашки видна только цветом — здесь она словами. */
  alertText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: счётчики в меню разного веса. Обычный — серая цифра,
// требующий внимания — залитая плашка, «новое без числа» — точка. Один
// одинаковый бейдж на всё превращает меню в рябь из цифр, и срочное в нём
// теряется. Большие числа обрезаются до «99+»: точное значение всё равно
// никто не читает, а ширина колонки от него уезжает.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="sidebar-007"]){
--vibeui-sidebar-007-bg:transparent;
--vibeui-sidebar-007-fg:light-dark(oklch(0.25 0 265),oklch(0.93 0 265));
--vibeui-sidebar-007-muted:color-mix(in oklab,var(--vibeui-sidebar-007-fg) 68%,transparent);
--vibeui-sidebar-007-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-sidebar-007-hover:light-dark(oklch(0.55 0 265 / 7%),oklch(0.85 0 265 / 10%));
--vibeui-sidebar-007-chip:light-dark(oklch(0.55 0 265 / 10%),oklch(0.85 0 265 / 14%));
--vibeui-sidebar-007-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.16 262));
--vibeui-sidebar-007-alert:light-dark(oklch(0.57 0.2 25),oklch(0.65 0.19 25));
--vibeui-sidebar-007-alert-fg:light-dark(oklch(1 0 0),oklch(0.16 0.02 25));
--vibeui-sidebar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sidebar-007"]{color-scheme:dark}
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
font-size:0.9375rem;line-height:1.3;
}
[data-vibeui-block="sidebar-007"] a:hover{background:var(--vibeui-sidebar-007-hover);color:var(--vibeui-sidebar-007-fg)}
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
min-width:1.375rem;box-sizing:border-box;padding:0 0.375rem;
border-radius:9999px;text-align:center;
font-size:0.75rem;font-weight:700;line-height:1.25rem;
font-variant-numeric:tabular-nums;
background:var(--vibeui-sidebar-007-chip);color:var(--vibeui-sidebar-007-muted);
}
[data-vibeui-block="sidebar-007"] [data-tone="alert"] [data-part="badge"]{
background:var(--vibeui-sidebar-007-alert);color:var(--vibeui-sidebar-007-alert-fg);
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
 * Меню со счётчиками трёх весов: серая цифра, срочная плашка и точка «новое».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar007({
  items = DEFAULT_ITEMS,
  activeLabel = "Требуют ответа",
  cap = 99,
  navLabel = "Почта",
  countText = " непрочитанных",
  newText = "есть новое",
  alertText = "требуют внимания",
  background = "",
  accent,
  className,
  style,
  ...props
}: Sidebar007Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sidebar-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sidebar-007" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="sidebar"
        data-vibeui-block="sidebar-007"
        aria-label={navLabel}
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
                    <span data-part="hint">
                      {countText}
                      {item.tone === "alert" ? `, ${alertText}` : null}
                    </span>
                  </span>
                ) : null}
                {item.count === undefined && item.tone === "new" ? (
                  <>
                    <span data-part="dot" aria-hidden="true" />
                    <span data-part="hint">{newText}</span>
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
