import type { ComponentProps, CSSProperties } from "react"

export type Breadcrumb001Item = {
  label: string
  href?: string
}

export type Breadcrumb001Props = Omit<ComponentProps<"nav">, "children"> & {
  items?: Breadcrumb001Item[]
  /** Сколько уровней показывать целиком. Середина сворачивается в многоточие. */
  maxVisible?: number
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Пусто — подложки нет, крошки лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: длинный путь сворачивается посередине, а не обрезается
// с конца. Первый и последний уровни — самые нужные: откуда пришли и где
// находимся; их и оставляем, а середину прячем за многоточием.
//
// Тема берётся из color-scheme окружения через light-dark(): крошки темнеют
// вместе со страницей и не выкладывают под себя плашку.
const STYLES = `
:where([data-vibeui-block="breadcrumb-001"]){
--vibeui-breadcrumb-001-fg:light-dark(oklch(0.28 0.016 265),oklch(0.93 0.008 265));
--vibeui-breadcrumb-001-muted:color-mix(in oklab,var(--vibeui-breadcrumb-001-fg) 68%,transparent);
--vibeui-breadcrumb-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-breadcrumb-001-bg:transparent;
--vibeui-breadcrumb-001-pad:0;
--vibeui-breadcrumb-001-radius:0;
--vibeui-breadcrumb-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="breadcrumb-001"]{color-scheme:dark}
[data-vibeui-block="breadcrumb-001"]{
box-sizing:border-box;padding:var(--vibeui-breadcrumb-001-pad);
background:var(--vibeui-breadcrumb-001-bg);
border-radius:var(--vibeui-breadcrumb-001-radius);
font-family:var(--vibeui-breadcrumb-001-font);font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="breadcrumb-001"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-001"] li{display:flex;align-items:center;gap:0.375rem;min-width:0}
[data-vibeui-block="breadcrumb-001"] a{
color:var(--vibeui-breadcrumb-001-muted);text-decoration:none;
border-radius:0.25rem;
transition:color .16s ease;
}
[data-vibeui-block="breadcrumb-001"] a:hover{color:var(--vibeui-breadcrumb-001-fg)}
[data-vibeui-block="breadcrumb-001"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-001-accent);outline-offset:2px}
/* Текущий уровень — не ссылка: на страницу, где стоишь, не переходят. */
[data-vibeui-block="breadcrumb-001"] [data-part="current"]{
color:var(--vibeui-breadcrumb-001-fg);font-weight:500;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="breadcrumb-001"] [data-part="ellipsis"]{color:var(--vibeui-breadcrumb-001-muted);letter-spacing:0.05em}
/* Разделитель — грань квадрата: одна фигура вместо шрифтового символа. */
[data-vibeui-block="breadcrumb-001"] [data-part="sep"]{
width:0.3125rem;height:0.3125rem;flex:none;
border-right:1.5px solid var(--vibeui-breadcrumb-001-muted);
border-top:1.5px solid var(--vibeui-breadcrumb-001-muted);
transform:rotate(45deg);opacity:.7;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb001Item[] = [
  { label: "Проекты", href: "#" },
  { label: "Студия «Полёт»", href: "#" },
  { label: "Сайт студии", href: "#" },
  { label: "Страницы", href: "#" },
  { label: "Главная" },
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
 * Хлебные крошки, сворачивающиеся посередине.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb001({
  items = DEFAULT_ITEMS,
  maxVisible = 3,
  navLabel = "Хлебные крошки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb001Props) {
  // Подложка появляется вместе с внутренними отступами: без неё крошки лежат
  // прямо на странице и поля по бокам им только мешают.
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-001-bg": background,
          "--vibeui-breadcrumb-001-pad": "0.5rem 0.75rem",
          "--vibeui-breadcrumb-001-radius": "0.625rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const collapsed = items.length > maxVisible
  const visible = collapsed
    ? [items[0], ...items.slice(items.length - (maxVisible - 1))]
    : items
  const ellipsisAfter = collapsed ? 0 : -1

  return (
    <>
      <style href="vibeui-breadcrumb-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="breadcrumb"
        data-vibeui-block="breadcrumb-001"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <ol>
          {visible.map((item, index) => {
            const last = index === visible.length - 1

            return (
              <li key={`${item.label}-${index}`}>
                {item.href && !last ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <span
                    data-part="current"
                    aria-current={last ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
                {index === ellipsisAfter ? (
                  <>
                    <span data-part="sep" aria-hidden="true" />
                    <span data-part="ellipsis" aria-hidden="true">
                      …
                    </span>
                  </>
                ) : null}
                {last ? null : <span data-part="sep" aria-hidden="true" />}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
