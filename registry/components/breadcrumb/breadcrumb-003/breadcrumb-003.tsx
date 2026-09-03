import type { ComponentProps, CSSProperties } from "react"

export type Breadcrumb003Item = {
  label: string
  href?: string
}

export type Breadcrumb003Props = Omit<ComponentProps<"nav">, "children"> & {
  items?: Breadcrumb003Item[]
  homeLabel?: string
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Пусто — подложки нет, крошки лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: путь с домиком в начале и шевронами между уровнями.
// Домик — не картинка: домик и шеврон нарисованы бордюрами, поэтому путь
// весит столько же, сколько текст. У домика есть подпись для скринридера:
// иконка без имени в навигации — тупик.
//
// Тема берётся из color-scheme окружения через light-dark(): крошки темнеют
// вместе со страницей и не выкладывают под себя плашку.
const STYLES = `
:where([data-vibeui-block="breadcrumb-003"]){
--vibeui-breadcrumb-003-fg:light-dark(oklch(0.28 0.016 265),oklch(0.93 0.008 265));
--vibeui-breadcrumb-003-muted:color-mix(in oklab,var(--vibeui-breadcrumb-003-fg) 68%,transparent);
--vibeui-breadcrumb-003-line:light-dark(oklch(0.78 0.01 265),oklch(0.52 0.012 265));
--vibeui-breadcrumb-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-breadcrumb-003-bg:transparent;
--vibeui-breadcrumb-003-pad:0;
--vibeui-breadcrumb-003-radius:0;
--vibeui-breadcrumb-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="breadcrumb-003"]{color-scheme:dark}
[data-vibeui-block="breadcrumb-003"]{
box-sizing:border-box;padding:var(--vibeui-breadcrumb-003-pad);
background:var(--vibeui-breadcrumb-003-bg);
border-radius:var(--vibeui-breadcrumb-003-radius);
font-family:var(--vibeui-breadcrumb-003-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-003-muted);
}
[data-vibeui-block="breadcrumb-003"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.4375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-003"] li{display:inline-flex;align-items:center;gap:0.4375rem}
/* Шеврон — два бордюра: иконочный шрифт ради галочки не нужен. */
[data-vibeui-block="breadcrumb-003"] li + li::before{
content:"";width:0.3125rem;height:0.3125rem;
border-top:1.5px solid var(--vibeui-breadcrumb-003-line);
border-right:1.5px solid var(--vibeui-breadcrumb-003-line);
transform:rotate(45deg);
}
[data-vibeui-block="breadcrumb-003"] a{color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:0.3125rem;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-003"] a:hover{color:var(--vibeui-breadcrumb-003-fg)}
[data-vibeui-block="breadcrumb-003"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-003-accent);outline-offset:2px}
[data-vibeui-block="breadcrumb-003"] [aria-current="page"]{color:var(--vibeui-breadcrumb-003-fg);font-weight:600}
/* Домик: крыша повёрнутым квадратом, стена прямоугольником. */
[data-vibeui-block="breadcrumb-003"] [data-part="home"]{
position:relative;display:inline-block;width:0.875rem;height:0.8125rem;
}
[data-vibeui-block="breadcrumb-003"] [data-part="home"]::before{
content:"";position:absolute;left:50%;top:0;width:0.5625rem;height:0.5625rem;
margin-left:-0.28125rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
transform:rotate(-45deg);
}
[data-vibeui-block="breadcrumb-003"] [data-part="home"]::after{
content:"";position:absolute;left:50%;bottom:0;width:0.625rem;height:0.4375rem;
margin-left:-0.3125rem;
border:1.5px solid currentColor;border-top:0;border-radius:0 0 0.125rem 0.125rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb003Item[] = [
  { label: "Проекты", href: "#" },
  { label: "Каталог", href: "#" },
  { label: "Настройки" },
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
 * Путь с домиком и шевронами, нарисованными бордюрами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb003({
  items = DEFAULT_ITEMS,
  homeLabel = "На главную",
  navLabel = "Хлебные крошки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb003Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-003-bg": background,
          "--vibeui-breadcrumb-003-pad": "0.5rem 0.75rem",
          "--vibeui-breadcrumb-003-radius": "0.625rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-003" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="breadcrumb"
        data-vibeui-block="breadcrumb-003"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <ol>
          <li>
            <a href="#" aria-label={homeLabel}>
              <span data-part="home" aria-hidden="true" />
            </a>
          </li>
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
