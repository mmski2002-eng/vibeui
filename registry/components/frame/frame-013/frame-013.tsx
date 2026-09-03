import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame013Props = Omit<ComponentProps<"figure">, "title"> & {
  appName?: string
  pageTitle?: string
  navItems?: string[]
  activeIndex?: number
  /** Подпись навигации для вспомогательных технологий: компонент несёт русскую. */
  navLabel?: string
  accent?: string
  /** Пусто — подложки нет, кадр ложится на фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: кадр приложения — боковая панель навигации плюс шапка
// над рабочей областью, приём для скриншотов дашбордов и SaaS-интерфейсов.
// Панель и шапка — неизменная часть каркаса, слот children отвечает только
// за рабочую область, чтобы скриншот не приходилось перерисовывать вместе
// с навигацией. На узкой ширине название приложения и пункты меню
// сжимаются многоточием, а не прячутся — иначе список превращается в
// столбец точек без смысла.
const STYLES = `
:where([data-vibeui-block="frame-013"]){
--vibeui-frame-013-bg:transparent;
--vibeui-frame-013-panel:light-dark(oklch(0.97 0.004 265),oklch(0.27 0.012 265));
--vibeui-frame-013-surface:light-dark(oklch(1 0 0),oklch(0.34 0.013 265));
--vibeui-frame-013-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-frame-013-muted:color-mix(in oklab,var(--vibeui-frame-013-fg) 68%,transparent);
--vibeui-frame-013-border:light-dark(oklch(0.89 0.006 265),oklch(0.4 0.011 265));
--vibeui-frame-013-accent:light-dark(oklch(0.55 0.14 260),oklch(0.72 0.14 260));
--vibeui-frame-013-radius:0.875rem;
--vibeui-frame-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-013"]{color-scheme:dark}
[data-vibeui-block="frame-013"]{
display:block;margin:0;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:36rem;box-sizing:border-box;
font-family:var(--vibeui-frame-013-font);color:var(--vibeui-frame-013-fg);
}
[data-vibeui-block="frame-013"] *{box-sizing:border-box}
[data-vibeui-block="frame-013"] [data-part="shell"]{
display:flex;overflow:hidden;min-height:16rem;
background:var(--vibeui-frame-013-bg);
border:1px solid var(--vibeui-frame-013-border);
border-radius:var(--vibeui-frame-013-radius);
}
[data-vibeui-block="frame-013"] [data-part="sidebar"]{
display:flex;flex-direction:column;
flex:none;width:9.5rem;padding:0.875rem 0.625rem;
background:var(--vibeui-frame-013-panel);
border-right:1px solid var(--vibeui-frame-013-border);
}
[data-vibeui-block="frame-013"] [data-part="brand"]{
display:flex;align-items:center;gap:0.5rem;
margin-bottom:0.625rem;padding:0 0.375rem;min-width:0;
font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="frame-013"] [data-part="mark"]{
flex:none;width:1.25rem;height:1.25rem;border-radius:0.375rem;
background:var(--vibeui-frame-013-accent);
}
[data-vibeui-block="frame-013"] [data-part="brand-name"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="frame-013"] [data-part="nav"]{
display:flex;flex-direction:column;gap:0.125rem;
list-style:none;margin:0;padding:0;
}
[data-vibeui-block="frame-013"] [data-part="item"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;color:var(--vibeui-frame-013-muted);
}
[data-vibeui-block="frame-013"] [data-part="item"] i{
flex:none;width:0.5rem;height:0.5rem;border-radius:9999px;background:currentColor;opacity:0.5;
}
[data-vibeui-block="frame-013"] [data-part="item"][aria-current="page"]{
background:var(--vibeui-frame-013-surface);color:var(--vibeui-frame-013-fg);font-weight:600;
box-shadow:inset 0 0 0 1px var(--vibeui-frame-013-border);
}
[data-vibeui-block="frame-013"] [data-part="item"][aria-current="page"] i{background:var(--vibeui-frame-013-accent);opacity:1}
[data-vibeui-block="frame-013"] [data-part="main"]{display:flex;flex-direction:column;flex:1 1 auto;min-width:0}
[data-vibeui-block="frame-013"] [data-part="header"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.75rem 1rem;border-bottom:1px solid var(--vibeui-frame-013-border);
}
[data-vibeui-block="frame-013"] [data-part="header"] h2{
margin:0;font-size:0.875rem;font-weight:700;min-width:0;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="frame-013"] [data-part="actions"]{display:flex;gap:0.375rem;flex:none}
[data-vibeui-block="frame-013"] [data-part="actions"] span{
width:1.375rem;height:1.375rem;border-radius:9999px;
background:var(--vibeui-frame-013-panel);
border:1px solid var(--vibeui-frame-013-border);
}
[data-vibeui-block="frame-013"] [data-part="body"]{flex:1 1 auto;min-height:0;padding:1rem;overflow:auto}
[data-vibeui-block="frame-013"] [data-part="body"] > *{display:block;width:100%}
[data-vibeui-block="frame-013"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.625rem;
}
[data-vibeui-block="frame-013"] [data-part="card"]{
height:3.5rem;border-radius:0.625rem;
background:var(--vibeui-frame-013-panel);
border:1px solid var(--vibeui-frame-013-border);
}
@container (max-width: 24rem){
[data-vibeui-block="frame-013"] [data-part="sidebar"]{width:6.5rem;padding:0.75rem 0.5rem}
[data-vibeui-block="frame-013"] [data-part="item"]{font-size:0.6875rem}
[data-vibeui-block="frame-013"] [data-part="grid"]{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAV_ITEMS = ["Обзор", "Проекты", "Команда", "Настройки"]

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
 * Кадр приложения: боковая панель навигации и шапка над рабочей областью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame013({
  appName = "Vibe",
  pageTitle = "Обзор",
  navItems = DEFAULT_NAV_ITEMS,
  activeIndex = 0,
  navLabel = "Основная навигация",
  accent,
  background = "",
  children,
  className,
  style,
  ...props
}: Frame013Props) {
  const palette = {
    ...(accent ? { "--vibeui-frame-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-frame-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-013" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <aside data-part="sidebar">
            <div data-part="brand">
              <span data-part="mark" aria-hidden="true" />
              <span data-part="brand-name">{appName}</span>
            </div>
            <nav aria-label={navLabel}>
              <ul data-part="nav">
                {navItems.map((item, index) => (
                  <li
                    data-part="item"
                    aria-current={index === activeIndex ? "page" : undefined}
                    key={item}
                  >
                    <i aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div data-part="main">
            <header data-part="header">
              <h2>{pageTitle}</h2>
              <span data-part="actions" aria-hidden="true">
                <span />
                <span />
              </span>
            </header>
            <div data-part="body">
              {children ?? (
                <div data-part="grid">
                  <span data-part="card" />
                  <span data-part="card" />
                  <span data-part="card" />
                  <span data-part="card" />
                </div>
              )}
            </div>
          </div>
        </div>
      </figure>
    </>
  )
}
