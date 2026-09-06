import type { ComponentProps, CSSProperties } from "react"

export type Breadcrumb005Item = {
  label: string
  href?: string
}

export type Breadcrumb005Props = Omit<ComponentProps<"nav">, "children"> & {
  items?: Breadcrumb005Item[]
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Пусто — подложки нет, крошки лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: путь не переносится и не сворачивается, а прокручивается
// вбок. Такой вариант нужен там, где важен каждый уровень: в файловом
// менеджере и в админке. Край подтёрт градиентом-маской — обрубленная
// строка иначе выглядит поломкой, а не продолжением.
//
// Тема берётся из color-scheme окружения через light-dark(): крошки темнеют
// вместе со страницей и не выкладывают под себя плашку.
const STYLES = `
:where([data-vibeui-block="breadcrumb-005"]){
--vibeui-breadcrumb-005-fg:light-dark(oklch(0.28 0 265),oklch(0.93 0 265));
--vibeui-breadcrumb-005-muted:color-mix(in oklab,var(--vibeui-breadcrumb-005-fg) 68%,transparent);
--vibeui-breadcrumb-005-sep:light-dark(oklch(0.75 0 265),oklch(0.5 0 265));
--vibeui-breadcrumb-005-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-breadcrumb-005-bg:transparent;
--vibeui-breadcrumb-005-pad:0;
--vibeui-breadcrumb-005-radius:0;
--vibeui-breadcrumb-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="breadcrumb-005"]{color-scheme:dark}
[data-vibeui-block="breadcrumb-005"]{
display:block;width:100%;box-sizing:border-box;
padding:var(--vibeui-breadcrumb-005-pad);
background:var(--vibeui-breadcrumb-005-bg);
border-radius:var(--vibeui-breadcrumb-005-radius);
font-family:var(--vibeui-breadcrumb-005-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-005-muted);
}
/* Прокрутка вбок вместо переноса: каждый уровень остаётся на месте. */
[data-vibeui-block="breadcrumb-005"] ol{
display:flex;align-items:center;gap:0.375rem;
margin:0;padding:0.125rem 1.25rem 0.375rem 0;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scrollbar-width:thin;
/* Маска у правого края: обрубленная строка читается как продолжение. */
mask:linear-gradient(to right,oklch(0 0 0) calc(100% - 1.25rem),transparent);
}
[data-vibeui-block="breadcrumb-005"] li{display:inline-flex;align-items:center;gap:0.375rem;flex:none;white-space:nowrap}
[data-vibeui-block="breadcrumb-005"] li + li::before{content:"/";color:var(--vibeui-breadcrumb-005-sep)}
[data-vibeui-block="breadcrumb-005"] a{color:inherit;text-decoration:none;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-005"] a:hover{color:var(--vibeui-breadcrumb-005-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-005"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-005-accent);outline-offset:2px}
/* Текущий уровень прилипает к правому краю: он важнее всех остальных. */
[data-vibeui-block="breadcrumb-005"] [aria-current="page"]{
position:sticky;right:0;color:var(--vibeui-breadcrumb-005-fg);font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb005Item[] = [
  { label: "Диск", href: "#" },
  { label: "Проекты", href: "#" },
  { label: "VibeUI", href: "#" },
  { label: "registry", href: "#" },
  { label: "components", href: "#" },
  { label: "breadcrumb", href: "#" },
  { label: "breadcrumb-005.tsx" },
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
 * Путь с прокруткой вбок: уровни не сворачиваются и не переносятся.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb005({
  items = DEFAULT_ITEMS,
  navLabel = "Хлебные крошки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb005Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-005-bg": background,
          "--vibeui-breadcrumb-005-pad": "0.5rem 0.75rem",
          "--vibeui-breadcrumb-005-radius": "0.625rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-005" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="breadcrumb"
        data-vibeui-block="breadcrumb-005"
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
