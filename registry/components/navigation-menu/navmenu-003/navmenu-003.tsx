import type { CSSProperties } from "react"

export type Navmenu003Group = {
  label: string
  items?: string[]
  href?: string
}

export type Navmenu003Props = {
  groups?: Navmenu003Group[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: самое простое выпадающее меню разделов — один столбик ссылок
// без описаний, картинок и колонок. Открытие и взаимное закрытие держит атрибут
// name у <details>: браузер сам следит, что раскрыт только один раздел. JS нет,
// значит меню работает и до гидратации, и при отключённых скриптах.
const STYLES = `
:where([data-vibeui-block="navmenu-003"]){
--vibeui-navmenu-003-bg:oklch(1 0 0);
--vibeui-navmenu-003-fg:oklch(0.22 0.014 265);
--vibeui-navmenu-003-muted:oklch(0.55 0.014 265);
--vibeui-navmenu-003-border:oklch(0.91 0.006 265);
--vibeui-navmenu-003-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-navmenu-003-accent:oklch(0.55 0.2 262);
--vibeui-navmenu-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="navmenu-003"]{
box-sizing:border-box;width:100%;max-width:32rem;padding:0.375rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-navmenu-003-bg);color:var(--vibeui-navmenu-003-fg);
border:1px solid var(--vibeui-navmenu-003-border);border-radius:0.75rem;
font-family:var(--vibeui-navmenu-003-font);
}
[data-vibeui-block="navmenu-003"] [data-part="slot"]{position:relative}
[data-vibeui-block="navmenu-003"] [data-part="trigger"],
[data-vibeui-block="navmenu-003"] [data-part="plain"]{
list-style:none;cursor:pointer;text-decoration:none;color:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;font-size:0.875rem;
}
[data-vibeui-block="navmenu-003"] [data-part="trigger"]::-webkit-details-marker{display:none}
[data-vibeui-block="navmenu-003"] [data-part="trigger"]:hover,
[data-vibeui-block="navmenu-003"] [data-part="plain"]:hover{background:var(--vibeui-navmenu-003-hover)}
[data-vibeui-block="navmenu-003"] [data-part="trigger"]:focus-visible,
[data-vibeui-block="navmenu-003"] [data-part="plain"]:focus-visible{outline:2px solid var(--vibeui-navmenu-003-accent);outline-offset:-2px}
[data-vibeui-block="navmenu-003"] [data-part="slot"][open] > [data-part="trigger"]{background:var(--vibeui-navmenu-003-hover)}
/* Галочка переворачивается вместе с раскрытием: состояние видно на самой кнопке. */
[data-vibeui-block="navmenu-003"] [data-part="caret"]{
width:0.375rem;height:0.375rem;margin-top:-0.1875rem;
border:1.5px solid var(--vibeui-navmenu-003-muted);border-left:0;border-top:0;
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="navmenu-003"] [data-part="slot"][open] [data-part="caret"]{transform:rotate(-135deg);margin-top:0.125rem}
[data-vibeui-block="navmenu-003"] [data-part="menu"]{
position:absolute;top:calc(100% + 0.5rem);left:0;z-index:30;
min-width:12rem;margin:0;padding:0.25rem;box-sizing:border-box;list-style:none;
background:var(--vibeui-navmenu-003-bg);
border:1px solid var(--vibeui-navmenu-003-border);border-radius:0.75rem;
box-shadow:0 20px 40px -22px oklch(0.2 0.03 265 / 42%);
}
[data-vibeui-block="navmenu-003"] [data-part="link"]{
display:block;padding:0.4375rem 0.5rem;border-radius:0.5rem;
text-decoration:none;color:inherit;font-size:0.875rem;
}
[data-vibeui-block="navmenu-003"] [data-part="link"]:hover{background:var(--vibeui-navmenu-003-hover)}
[data-vibeui-block="navmenu-003"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-navmenu-003-accent);outline-offset:-2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navmenu-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Navmenu003Group[] = [
  {
    label: "Продукт",
    items: ["Редактор", "Шаблоны", "Аналитика", "Интеграции"],
  },
  {
    label: "Компания",
    items: ["О нас", "Вакансии", "Контакты"],
  },
  { label: "Цены", href: "#" },
  { label: "Блог", href: "#" },
]

/**
 * Простое выпадающее меню разделов: один столбик ссылок, без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Navmenu003({
  groups = DEFAULT_GROUPS,
  accent,
  className,
  style,
}: Navmenu003Props) {
  const palette = {
    ...(accent ? { "--vibeui-navmenu-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navmenu-003" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="navmenu-003"
        aria-label="Основная навигация"
        className={className}
        style={palette}
      >
        {groups.map((group) =>
          group.items ? (
            <details
              key={group.label}
              data-part="slot"
              name="vibeui-navmenu-003"
            >
              <summary data-part="trigger">
                {group.label}
                <span data-part="caret" aria-hidden="true" />
              </summary>
              <ul data-part="menu" aria-label={group.label}>
                {group.items.map((item) => (
                  <li key={item}>
                    <a data-part="link" href="#">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <a key={group.label} data-part="plain" href={group.href ?? "#"}>
              {group.label}
            </a>
          ),
        )}
      </nav>
    </>
  )
}
