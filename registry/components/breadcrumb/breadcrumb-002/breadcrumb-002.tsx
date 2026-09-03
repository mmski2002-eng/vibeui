import type { ComponentProps, CSSProperties } from "react"

export type Breadcrumb002Item = {
  label: string
  href?: string
}

export type Breadcrumb002Props = Omit<ComponentProps<"nav">, "children"> & {
  items?: Breadcrumb002Item[]
  separator?: string
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Пусто — подложки нет, крошки лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: минимальные крошки без рамок и заливок. Разделитель
// нарисован псевдоэлементом, а не вставлен в разметку: символ между
// ссылками скринридер прочитал бы как «слэш» на каждом уровне. Последний
// уровень — не ссылка: вести на текущую страницу незачем.
//
// Тема берётся из color-scheme окружения через light-dark(): крошки темнеют
// вместе со страницей и не выкладывают под себя плашку.
const STYLES = `
:where([data-vibeui-block="breadcrumb-002"]){
--vibeui-breadcrumb-002-fg:light-dark(oklch(0.28 0.016 265),oklch(0.93 0.008 265));
--vibeui-breadcrumb-002-muted:color-mix(in oklab,var(--vibeui-breadcrumb-002-fg) 68%,transparent);
--vibeui-breadcrumb-002-sep:light-dark(oklch(0.75 0.01 265),oklch(0.5 0.012 265));
--vibeui-breadcrumb-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-breadcrumb-002-bg:transparent;
--vibeui-breadcrumb-002-pad:0;
--vibeui-breadcrumb-002-radius:0;
--vibeui-breadcrumb-002-separator:"/";
--vibeui-breadcrumb-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="breadcrumb-002"]{color-scheme:dark}
[data-vibeui-block="breadcrumb-002"]{
box-sizing:border-box;padding:var(--vibeui-breadcrumb-002-pad);
background:var(--vibeui-breadcrumb-002-bg);
border-radius:var(--vibeui-breadcrumb-002-radius);
font-family:var(--vibeui-breadcrumb-002-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-002-muted);
}
[data-vibeui-block="breadcrumb-002"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-002"] li{display:inline-flex;align-items:center;gap:0.375rem}
/* Разделитель в CSS, а не в разметке: иначе скринридер читает его вслух. */
[data-vibeui-block="breadcrumb-002"] li + li::before{
content:var(--vibeui-breadcrumb-002-separator);
color:var(--vibeui-breadcrumb-002-sep);
}
[data-vibeui-block="breadcrumb-002"] a{
color:inherit;text-decoration:none;border-radius:0.25rem;
}
[data-vibeui-block="breadcrumb-002"] a:hover{color:var(--vibeui-breadcrumb-002-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-002"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-002-accent);outline-offset:2px}
/* Текущий уровень — не ссылка, но выделен: он отвечает «где я». */
[data-vibeui-block="breadcrumb-002"] [aria-current="page"]{color:var(--vibeui-breadcrumb-002-fg);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb002Item[] = [
  { label: "Главная", href: "#" },
  { label: "Каталог", href: "#" },
  { label: "Компоненты", href: "#" },
  { label: "Хлебные крошки" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Минимальные крошки: разделитель в CSS, текущий уровень без ссылки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb002({
  items = DEFAULT_ITEMS,
  separator = "/",
  navLabel = "Хлебные крошки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb002Props) {
  const palette = {
    "--vibeui-breadcrumb-002-separator": `"${separator}"`,
    ...(accent ? { "--vibeui-breadcrumb-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-002-bg": background,
          "--vibeui-breadcrumb-002-pad": "0.5rem 0.75rem",
          "--vibeui-breadcrumb-002-radius": "0.625rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-002" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="breadcrumb"
        data-vibeui-block="breadcrumb-002"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <ol>
          {items.map((item, index) => {
            const last = index === items.length - 1

            return (
              <li key={item.label}>
                {item.href && !last ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <span aria-current={last ? "page" : undefined}>
                    {item.label}
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
