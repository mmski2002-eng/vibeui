import type { ComponentProps, CSSProperties } from "react"

export type Breadcrumb007Item = {
  label: string
  href?: string
}

export type Breadcrumb007Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Breadcrumb007Item[]
  actionLabel?: string
  secondaryLabel?: string
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Пусто — заливки нет, панель держится одной рамкой на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка пути с действиями справа. Путь и кнопки живут в
// одной строке, потому что обе отвечают на вопрос «что я могу сделать здесь»;
// на узкой ширине строка переносится, и кнопки уходят под путь, а не
// сжимаются до нечитаемых иконок.
//
// Тема берётся из color-scheme окружения через light-dark(): панель темнеет
// вместе со страницей, а рамка в тёмной теме светлее фона, а не темнее.
const STYLES = `
:where([data-vibeui-block="breadcrumb-007"]){
--vibeui-breadcrumb-007-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-breadcrumb-007-muted:color-mix(in oklab,var(--vibeui-breadcrumb-007-fg) 68%,transparent);
--vibeui-breadcrumb-007-sep:light-dark(oklch(0.78 0 265),oklch(0.5 0 265));
--vibeui-breadcrumb-007-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-breadcrumb-007-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-breadcrumb-007-on-accent:light-dark(oklch(0.99 0 265),oklch(0.18 0 265));
--vibeui-breadcrumb-007-bg:transparent;
--vibeui-breadcrumb-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="breadcrumb-007"]{color-scheme:dark}
[data-vibeui-block="breadcrumb-007"]{
display:block;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
font-family:var(--vibeui-breadcrumb-007-font);color:var(--vibeui-breadcrumb-007-fg);
}
[data-vibeui-block="breadcrumb-007"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;
box-sizing:border-box;padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-breadcrumb-007-border);border-radius:0.75rem;
background:var(--vibeui-breadcrumb-007-bg);
}
[data-vibeui-block="breadcrumb-007"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;flex:1;min-width:0;
margin:0;padding:0;list-style:none;
font-size:0.8125rem;line-height:1.4;color:var(--vibeui-breadcrumb-007-muted);
}
[data-vibeui-block="breadcrumb-007"] li{display:inline-flex;align-items:center;gap:0.375rem;min-width:0}
[data-vibeui-block="breadcrumb-007"] li + li::before{content:"/";color:var(--vibeui-breadcrumb-007-sep)}
[data-vibeui-block="breadcrumb-007"] a{color:inherit;text-decoration:none;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-007"] a:hover{color:var(--vibeui-breadcrumb-007-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-007"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-007-accent);outline-offset:2px}
[data-vibeui-block="breadcrumb-007"] [aria-current="page"]{
color:var(--vibeui-breadcrumb-007-fg);font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="breadcrumb-007"] [data-part="actions"]{display:flex;align-items:center;gap:0.375rem;flex:none}
[data-vibeui-block="breadcrumb-007"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;height:2rem;padding:0 0.75rem;
border:1px solid var(--vibeui-breadcrumb-007-border);border-radius:0.5rem;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;font-weight:500;
}
[data-vibeui-block="breadcrumb-007"] button[data-primary="true"]{
border-color:transparent;background:var(--vibeui-breadcrumb-007-accent);
color:oklch(from var(--vibeui-breadcrumb-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);font-weight:600;
}
[data-vibeui-block="breadcrumb-007"] button:focus-visible{outline:2px solid var(--vibeui-breadcrumb-007-accent);outline-offset:2px}
/* На узкой ширине кнопки уходят под путь и остаются подписанными словами. */
@container (max-width: 26rem){
[data-vibeui-block="breadcrumb-007"] [data-part="actions"]{width:100%}
[data-vibeui-block="breadcrumb-007"] [data-part="actions"] button{flex:1;justify-content:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Breadcrumb007Item[] = [
  { label: "Проекты", href: "#" },
  { label: "VibeUI", href: "#" },
  { label: "Компонент breadcrumb-007" },
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
 * Строка пути с действиями справа: на узкой ширине кнопки уходят вниз.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb007({
  items = DEFAULT_ITEMS,
  actionLabel = "Опубликовать",
  secondaryLabel = "Настройки",
  navLabel = "Хлебные крошки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb007Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="breadcrumb"
        data-vibeui-block="breadcrumb-007"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <nav aria-label={navLabel}>
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
          <div data-part="actions">
            {secondaryLabel ? (
              <button type="button">{secondaryLabel}</button>
            ) : null}
            {actionLabel ? (
              <button type="button" data-primary="true">
                {actionLabel}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
