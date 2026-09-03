import type { ComponentProps, CSSProperties } from "react"

export type Sidebar008Space = {
  name: string
  plan?: string
  href?: string
}

export type Sidebar008Item = {
  label: string
  href?: string
}

export type Sidebar008Props = Omit<ComponentProps<"div">, "children"> & {
  spaces?: Sidebar008Space[]
  current?: string
  items?: Sidebar008Item[]
  activeLabel?: string
  /** Подпись списка разделов для скринридера. */
  navLabel?: string
  /** Подпись переключателя: {name} — имя текущего пространства. */
  switcherLabel?: string
  /** Последняя строка списка пространств. */
  addLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переключатель пространства стоит над меню и всегда
// показывает, где вы работаете. Это защита от дорогой ошибки: одинаковые
// разделы в двух пространствах выглядят одинаково, и без подписи сверху
// правку легко внести не туда. Список раскрывается на <details>, текущее
// пространство помечено галочкой, а не только заливкой строки.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
// Выпадающий список — исключение: у него подложка непрозрачная, иначе сквозь
// него просвечивают разделы.
const STYLES = `
:where([data-vibeui-block="sidebar-008"]){
--vibeui-sidebar-008-bg:transparent;
--vibeui-sidebar-008-panel:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-sidebar-008-field:light-dark(oklch(0.985 0.002 265),oklch(0.29 0.012 265));
--vibeui-sidebar-008-field-hover:light-dark(oklch(0.96 0.004 265),oklch(0.33 0.012 265));
--vibeui-sidebar-008-fg:light-dark(oklch(0.25 0.016 265),oklch(0.93 0.006 265));
--vibeui-sidebar-008-muted:color-mix(in oklab,var(--vibeui-sidebar-008-fg) 68%,transparent);
--vibeui-sidebar-008-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-sidebar-008-hover:light-dark(oklch(0.55 0.02 265 / 7%),oklch(0.85 0.02 265 / 10%));
--vibeui-sidebar-008-shadow:light-dark(oklch(0.2 0.02 265 / 14%),oklch(0 0 0 / 55%));
--vibeui-sidebar-008-accent:light-dark(oklch(0.55 0.17 155),oklch(0.74 0.15 155));
--vibeui-sidebar-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sidebar-008"]{color-scheme:dark}
[data-vibeui-block="sidebar-008"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-sidebar-008-bg);color:var(--vibeui-sidebar-008-fg);
border:1px solid var(--vibeui-sidebar-008-border);border-radius:0.875rem;
font-family:var(--vibeui-sidebar-008-font);
}
[data-vibeui-block="sidebar-008"] [data-part="switcher"]{position:relative}
[data-vibeui-block="sidebar-008"] summary{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;list-style:none;
padding:0.4375rem 0.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-sidebar-008-border);
background:var(--vibeui-sidebar-008-field);
}
[data-vibeui-block="sidebar-008"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="sidebar-008"] summary:hover{background:var(--vibeui-sidebar-008-field-hover)}
[data-vibeui-block="sidebar-008"] summary:focus-visible{outline:2px solid var(--vibeui-sidebar-008-accent);outline-offset:2px}
[data-vibeui-block="sidebar-008"] [data-part="tile"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.625rem;height:1.625rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-sidebar-008-accent) 20%,transparent);
color:var(--vibeui-sidebar-008-fg);font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="sidebar-008"] [data-part="who"]{display:flex;flex-direction:column;min-width:0}
[data-vibeui-block="sidebar-008"] [data-part="name"]{font-size:0.875rem;font-weight:650;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="sidebar-008"] [data-part="plan"]{font-size:0.8125rem;color:var(--vibeui-sidebar-008-muted)}
[data-vibeui-block="sidebar-008"] [data-part="chevron"]{
margin-left:auto;flex:none;width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-sidebar-008-muted);
border-bottom:1.5px solid var(--vibeui-sidebar-008-muted);
transform:rotate(45deg) translateY(-0.0625rem);transition:transform .16s ease;
}
[data-vibeui-block="sidebar-008"] details[open] [data-part="chevron"]{transform:rotate(-135deg) translateY(-0.0625rem)}
/* Список поверх меню, а не в потоке: раскрытие не должно двигать разделы. */
[data-vibeui-block="sidebar-008"] [data-part="spaces"]{
position:absolute;top:calc(100% + 0.25rem);left:0;right:0;z-index:2;
margin:0;padding:0.25rem;list-style:none;
background:var(--vibeui-sidebar-008-panel);
border:1px solid var(--vibeui-sidebar-008-border);border-radius:0.625rem;
box-shadow:0 10px 26px var(--vibeui-sidebar-008-shadow);
}
[data-vibeui-block="sidebar-008"] [data-part="spaces"] a{
display:flex;align-items:center;gap:0.5rem;
padding:0.375rem 0.5rem;border-radius:0.375rem;
color:var(--vibeui-sidebar-008-fg);text-decoration:none;font-size:0.875rem;
}
[data-vibeui-block="sidebar-008"] [data-part="spaces"] a:hover{background:var(--vibeui-sidebar-008-hover)}
[data-vibeui-block="sidebar-008"] [data-part="spaces"] a:focus-visible{outline:2px solid var(--vibeui-sidebar-008-accent);outline-offset:-2px}
/* Галочка у текущего: заливки строки мало, её путают с наведением. */
[data-vibeui-block="sidebar-008"] [data-part="check"]{
margin-left:auto;flex:none;width:0.4375rem;height:0.75rem;
border:solid var(--vibeui-sidebar-008-accent);border-width:0 2px 2px 0;
transform:rotate(45deg) translate(-0.0625rem,-0.125rem);
}
[data-vibeui-block="sidebar-008"] [data-part="add"]{
display:block;margin-top:0.125rem;padding:0.375rem 0.5rem;border-radius:0.375rem;
border-top:1px solid var(--vibeui-sidebar-008-border);
color:var(--vibeui-sidebar-008-muted);text-decoration:none;font-size:0.875rem;
}
[data-vibeui-block="sidebar-008"] [data-part="nav"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-008"] [data-part="nav"] a{
display:block;padding:0.4375rem 0.5rem;border-radius:0.5rem;
color:var(--vibeui-sidebar-008-muted);text-decoration:none;font-size:0.9375rem;line-height:1.3;
}
[data-vibeui-block="sidebar-008"] [data-part="nav"] a:hover{background:var(--vibeui-sidebar-008-hover);color:var(--vibeui-sidebar-008-fg)}
[data-vibeui-block="sidebar-008"] [data-part="nav"] a:focus-visible{outline:2px solid var(--vibeui-sidebar-008-accent);outline-offset:-2px}
[data-vibeui-block="sidebar-008"] [data-part="nav"] a[aria-current="page"]{
background:color-mix(in oklab,var(--vibeui-sidebar-008-accent) 14%,transparent);
color:var(--vibeui-sidebar-008-fg);font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SPACES: Sidebar008Space[] = [
  { name: "Студия Восход", plan: "Команда · 8 человек", href: "#" },
  { name: "Личное", plan: "Бесплатный", href: "#" },
  { name: "Клиент: Северный порт", plan: "Гость", href: "#" },
]

const DEFAULT_ITEMS: Sidebar008Item[] = [
  { label: "Дашборд", href: "#" },
  { label: "Проекты", href: "#" },
  { label: "Счета", href: "#" },
  { label: "Участники", href: "#" },
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
 * Меню с переключателем рабочего пространства сверху: текущее помечено галочкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar008({
  spaces = DEFAULT_SPACES,
  current = "Студия Восход",
  items = DEFAULT_ITEMS,
  activeLabel = "Проекты",
  navLabel = "Разделы пространства",
  switcherLabel = "Рабочее пространство: {name}",
  addLabel = "+ Создать пространство",
  background = "",
  accent,
  className,
  style,
  ...props
}: Sidebar008Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sidebar-008-bg": background,
          "--vibeui-sidebar-008-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const active = spaces.find((space) => space.name === current) ?? spaces[0]

  return (
    <>
      <style href="vibeui-sidebar-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sidebar"
        data-vibeui-block="sidebar-008"
        className={className}
        style={palette}
      >
        <div data-part="switcher">
          <details>
            <summary
              aria-label={switcherLabel.replace("{name}", active?.name ?? "")}
            >
              <span data-part="tile" aria-hidden="true">
                {active?.name.charAt(0)}
              </span>
              <span data-part="who">
                <span data-part="name">{active?.name}</span>
                <span data-part="plan">{active?.plan}</span>
              </span>
              <span data-part="chevron" aria-hidden="true" />
            </summary>
            <ul data-part="spaces">
              {spaces.map((space) => (
                <li key={space.name}>
                  <a
                    href={space.href}
                    aria-current={space.name === current ? "true" : undefined}
                  >
                    <span data-part="tile" aria-hidden="true">
                      {space.name.charAt(0)}
                    </span>
                    {space.name}
                    {space.name === current ? (
                      <span data-part="check" aria-hidden="true" />
                    ) : null}
                  </a>
                </li>
              ))}
              <li>
                <a data-part="add" href="#">
                  {addLabel}
                </a>
              </li>
            </ul>
          </details>
        </div>
        <nav data-part="nav" aria-label={navLabel}>
          <ul>
            {items.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-current={item.label === activeLabel ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
