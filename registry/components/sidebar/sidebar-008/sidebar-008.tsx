import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Sidebar008Space = {
  name: string
  plan?: string
  href?: string
}

export type Sidebar008Item = {
  label: string
  href?: string
}

export type Sidebar008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  spaces?: Sidebar008Space[]
  current?: string
  items?: Sidebar008Item[]
  activeLabel?: string
  accent?: string
}

// Идея компонента: переключатель пространства стоит над меню и всегда
// показывает, где вы работаете. Это защита от дорогой ошибки: одинаковые
// разделы в двух пространствах выглядят одинаково, и без подписи сверху
// правку легко внести не туда. Список раскрывается на <details>, текущее
// пространство помечено галочкой, а не только заливкой строки.
const STYLES = `
:where([data-vibeui-block="sidebar-008"]){
--vibeui-sidebar-008-bg:oklch(1 0 0);
--vibeui-sidebar-008-fg:oklch(0.25 0.016 265);
--vibeui-sidebar-008-muted:oklch(0.55 0.014 265);
--vibeui-sidebar-008-border:oklch(0.91 0.006 265);
--vibeui-sidebar-008-accent:oklch(0.55 0.17 155);
--vibeui-sidebar-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:oklch(0.985 0.002 265);
}
[data-vibeui-block="sidebar-008"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="sidebar-008"] summary:hover{background:oklch(0.96 0.004 265)}
[data-vibeui-block="sidebar-008"] summary:focus-visible{outline:2px solid var(--vibeui-sidebar-008-accent);outline-offset:2px}
[data-vibeui-block="sidebar-008"] [data-part="tile"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.625rem;height:1.625rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-sidebar-008-accent) 20%,transparent);
color:var(--vibeui-sidebar-008-fg);font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="sidebar-008"] [data-part="who"]{display:flex;flex-direction:column;min-width:0}
[data-vibeui-block="sidebar-008"] [data-part="name"]{font-size:0.8125rem;font-weight:650;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="sidebar-008"] [data-part="plan"]{font-size:0.6875rem;color:var(--vibeui-sidebar-008-muted)}
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
background:var(--vibeui-sidebar-008-bg);
border:1px solid var(--vibeui-sidebar-008-border);border-radius:0.625rem;
box-shadow:0 10px 26px oklch(0.2 0.02 265 / 14%);
}
[data-vibeui-block="sidebar-008"] [data-part="spaces"] a{
display:flex;align-items:center;gap:0.5rem;
padding:0.375rem 0.5rem;border-radius:0.375rem;
color:var(--vibeui-sidebar-008-fg);text-decoration:none;font-size:0.8125rem;
}
[data-vibeui-block="sidebar-008"] [data-part="spaces"] a:hover{background:oklch(0.55 0.02 265 / 8%)}
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
color:var(--vibeui-sidebar-008-muted);text-decoration:none;font-size:0.8125rem;
}
[data-vibeui-block="sidebar-008"] [data-part="nav"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-008"] [data-part="nav"] a{
display:block;padding:0.4375rem 0.5rem;border-radius:0.5rem;
color:var(--vibeui-sidebar-008-muted);text-decoration:none;font-size:0.875rem;line-height:1.3;
}
[data-vibeui-block="sidebar-008"] [data-part="nav"] a:hover{background:oklch(0.55 0.02 265 / 7%);color:var(--vibeui-sidebar-008-fg)}
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
 * Меню с переключателем рабочего пространства сверху: текущее помечено галочкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar008({
  spaces = DEFAULT_SPACES,
  current = "Студия Восход",
  items = DEFAULT_ITEMS,
  activeLabel = "Проекты",
  accent,
  className,
  style,
  ...props
}: Sidebar008Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-008-accent": accent } : null),
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
        data-vibeui-block="sidebar-008"
        className={className}
        style={palette}
      >
        <div data-part="switcher">
          <details>
            <summary aria-label={`Рабочее пространство: ${active?.name}`}>
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
                  + Создать пространство
                </a>
              </li>
            </ul>
          </details>
        </div>
        <nav data-part="nav" aria-label="Разделы пространства">
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
