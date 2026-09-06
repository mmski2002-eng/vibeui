import type { ComponentProps, CSSProperties } from "react"

export type Breadcrumb012Props = Omit<ComponentProps<"nav">, "children"> & {
  parentLabel?: string
  parentHref?: string
  currentLabel?: string
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: крошки для телефона — одна ссылка «назад к родителю».
// Полный путь на узком экране всё равно не читают: он занимает две строки и
// тянет вниз содержимое. Родитель назван словами, а не безымянной стрелкой:
// «Назад» не отвечает, куда именно вернёт.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// вместе со страницей и не выкладывает под себя плашку.
const STYLES = `
:where([data-vibeui-block="breadcrumb-012"]){
--vibeui-breadcrumb-012-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-breadcrumb-012-muted:color-mix(in oklab,var(--vibeui-breadcrumb-012-fg) 68%,transparent);
--vibeui-breadcrumb-012-sep:light-dark(oklch(0.78 0 265),oklch(0.5 0 265));
--vibeui-breadcrumb-012-hover:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-breadcrumb-012-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-breadcrumb-012-bg:transparent;
--vibeui-breadcrumb-012-pad:0;
--vibeui-breadcrumb-012-radius:0;
--vibeui-breadcrumb-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="breadcrumb-012"]{color-scheme:dark}
[data-vibeui-block="breadcrumb-012"]{
box-sizing:border-box;padding:var(--vibeui-breadcrumb-012-pad);
background:var(--vibeui-breadcrumb-012-bg);
border-radius:var(--vibeui-breadcrumb-012-radius);
min-width:0;
font-family:var(--vibeui-breadcrumb-012-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-012-muted);
}
[data-vibeui-block="breadcrumb-012"] ol{
display:flex;align-items:center;gap:0.5rem;min-width:0;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-012"] li{display:inline-flex;align-items:center;gap:0.5rem;min-width:0}
[data-vibeui-block="breadcrumb-012"] a{
display:inline-flex;align-items:center;gap:0.375rem;flex:none;
color:inherit;text-decoration:none;
/* Высота под палец: ссылка «назад» на телефоне нажимается чаще всего. */
min-height:2rem;padding:0 0.375rem 0 0.25rem;border-radius:0.4375rem;
}
[data-vibeui-block="breadcrumb-012"] a:hover{color:var(--vibeui-breadcrumb-012-fg);background:var(--vibeui-breadcrumb-012-hover)}
[data-vibeui-block="breadcrumb-012"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-012-accent);outline-offset:2px}
/* Стрелка влево из двух бордюров. */
[data-vibeui-block="breadcrumb-012"] [data-part="arrow"]{
width:0.4375rem;height:0.4375rem;flex:none;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);
}
[data-vibeui-block="breadcrumb-012"] [data-part="current"]{
min-width:0;color:var(--vibeui-breadcrumb-012-fg);font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="breadcrumb-012"] [data-part="dot"]{flex:none;color:var(--vibeui-breadcrumb-012-sep)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-012"] *{animation:none!important;transition:none!important}}
`

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
 * Крошки для телефона: одна названная ссылка на родителя и текущий уровень.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb012({
  parentLabel = "Компоненты",
  parentHref = "#",
  currentLabel = "Хлебные крошки для телефона",
  navLabel = "Хлебные крошки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb012Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-012-bg": background,
          "--vibeui-breadcrumb-012-pad": "0.25rem 0.5rem",
          "--vibeui-breadcrumb-012-radius": "0.625rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-012" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="breadcrumb"
        data-vibeui-block="breadcrumb-012"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <ol>
          <li>
            <a href={parentHref}>
              <span data-part="arrow" aria-hidden="true" />
              {parentLabel}
            </a>
          </li>
          <li>
            <span data-part="dot" aria-hidden="true">
              /
            </span>
            <span data-part="current" aria-current="page">
              {currentLabel}
            </span>
          </li>
        </ol>
      </nav>
    </>
  )
}
