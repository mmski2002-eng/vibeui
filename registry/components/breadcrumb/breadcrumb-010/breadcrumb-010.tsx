import type { ComponentProps, CSSProperties } from "react"

export type Breadcrumb010Item = {
  label: string
  href?: string
  count?: number
}

export type Breadcrumb010Props = Omit<ComponentProps<"nav">, "children"> & {
  items?: Breadcrumb010Item[]
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Подпись счётчика для скринридера; {count} заменяется числом. */
  countLabel?: string
  /** Пусто — подложки нет, крошки лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: путь с числом записей на каждом уровне. Число отвечает
// на вопрос «стоит ли туда возвращаться»: раздел с тремя товарами и раздел
// с тысячей — разные решения. Оно приписано к уровню, а не висит отдельной
// плашкой, и уходит скринридеру словами, а не голой цифрой.
//
// Тема берётся из color-scheme окружения через light-dark(): крошки темнеют
// вместе со страницей и не выкладывают под себя плашку.
const STYLES = `
:where([data-vibeui-block="breadcrumb-010"]){
--vibeui-breadcrumb-010-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-breadcrumb-010-muted:color-mix(in oklab,var(--vibeui-breadcrumb-010-fg) 68%,transparent);
--vibeui-breadcrumb-010-line:light-dark(oklch(0.78 0 265),oklch(0.5 0 265));
--vibeui-breadcrumb-010-chip:light-dark(oklch(0.95 0 265),oklch(0.32 0 265));
--vibeui-breadcrumb-010-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-breadcrumb-010-bg:transparent;
--vibeui-breadcrumb-010-pad:0;
--vibeui-breadcrumb-010-radius:0;
--vibeui-breadcrumb-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="breadcrumb-010"]{color-scheme:dark}
[data-vibeui-block="breadcrumb-010"]{
box-sizing:border-box;padding:var(--vibeui-breadcrumb-010-pad);
background:var(--vibeui-breadcrumb-010-bg);
border-radius:var(--vibeui-breadcrumb-010-radius);
font-family:var(--vibeui-breadcrumb-010-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-010-muted);
}
[data-vibeui-block="breadcrumb-010"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.4375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-010"] li{display:inline-flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="breadcrumb-010"] li + li::before{
content:"";width:0.3125rem;height:0.3125rem;
border-top:1.5px solid var(--vibeui-breadcrumb-010-line);
border-right:1.5px solid var(--vibeui-breadcrumb-010-line);
transform:rotate(45deg);
}
[data-vibeui-block="breadcrumb-010"] a,
[data-vibeui-block="breadcrumb-010"] [aria-current="page"]{
display:inline-flex;align-items:center;gap:0.3125rem;
color:inherit;text-decoration:none;border-radius:0.25rem;
}
[data-vibeui-block="breadcrumb-010"] a:hover{color:var(--vibeui-breadcrumb-010-fg)}
[data-vibeui-block="breadcrumb-010"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-010-accent);outline-offset:2px}
[data-vibeui-block="breadcrumb-010"] [aria-current="page"]{color:var(--vibeui-breadcrumb-010-fg);font-weight:600}
/* Число приписано к уровню: отдельная плашка оторвалась бы от названия. */
[data-vibeui-block="breadcrumb-010"] [data-part="count"]{
display:inline-flex;align-items:center;height:1.0625rem;padding:0 0.3125rem;
border-radius:9999px;background:var(--vibeui-breadcrumb-010-chip);
font-size:0.6875rem;font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-breadcrumb-010-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb010Item[] = [
  { label: "Каталог", href: "#", count: 1280 },
  { label: "Электроника", href: "#", count: 342 },
  { label: "Наушники", count: 27 },
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
 * Путь с числом записей на каждом уровне.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb010({
  items = DEFAULT_ITEMS,
  navLabel = "Хлебные крошки",
  countLabel = "{count} записей в разделе",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb010Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-010-bg": background,
          "--vibeui-breadcrumb-010-pad": "0.5rem 0.75rem",
          "--vibeui-breadcrumb-010-radius": "0.625rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-010" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="breadcrumb"
        data-vibeui-block="breadcrumb-010"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <ol>
          {items.map((item, index) => {
            const last = index === items.length - 1
            const count =
              item.count === undefined ? null : (
                <span
                  data-part="count"
                  aria-label={countLabel.replace("{count}", String(item.count))}
                >
                  {item.count}
                </span>
              )

            return (
              <li key={item.label}>
                {item.href && !last ? (
                  <a href={item.href}>
                    {item.label}
                    {count}
                  </a>
                ) : (
                  <span aria-current={last ? "page" : undefined}>
                    {item.label}
                    {count}
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
