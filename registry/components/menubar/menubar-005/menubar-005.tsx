import type { CSSProperties } from "react"

export type Menubar005Menu = {
  label: string
  items: string[]
}

export type Menubar005Props = {
  menus?: Menubar005Menu[]
  burgerLabel?: string
  /** Имя строки меню для скринридера. */
  menubarLabel?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: строка меню, которая на узкой ширине сворачивается в одну
// кнопку-бургер. Порог считается от собственной ширины блока (@container), а не
// от окна: тот же компонент в узкой колонке ведёт себя как на телефоне. Оба вида
// живут в разметке одновременно, и лишний убирается display:none — так он не
// попадает ни в порядок табуляции, ни в дерево доступности.
const STYLES = `
:where([data-vibeui-block="menubar-005"]){
--vibeui-menubar-005-bg:transparent;
--vibeui-menubar-005-panel:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-menubar-005-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-menubar-005-muted:light-dark(oklch(0.58 0.014 265),oklch(0.68 0.012 265));
--vibeui-menubar-005-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-menubar-005-hover:light-dark(oklch(0.55 0.02 265 / 10%),oklch(0.88 0.02 265 / 14%));
--vibeui-menubar-005-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-menubar-005-shadow:light-dark(oklch(0.2 0.03 265 / 45%),oklch(0 0 0 / 62%));
--vibeui-menubar-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="menubar-005"]{
width:100%;max-width:36rem;box-sizing:border-box;
font-family:var(--vibeui-menubar-005-font);color:var(--vibeui-menubar-005-fg);
}
[data-vibeui-block="menubar-005"] [data-part="shell"]{
box-sizing:border-box;padding:0.25rem;
background:var(--vibeui-menubar-005-bg);
border:1px solid var(--vibeui-menubar-005-border);border-radius:0.625rem;
}
[data-vibeui-block="menubar-005"] [data-part="wide"]{display:none;align-items:center;gap:0.125rem}
[data-vibeui-block="menubar-005"] [data-part="narrow"]{display:block}
/* Порог берётся от ширины блока: в узкой колонке остаётся бургер. */
@container (min-width: 30rem){
[data-vibeui-block="menubar-005"] [data-part="wide"]{display:flex}
[data-vibeui-block="menubar-005"] [data-part="narrow"]{display:none}
}
[data-vibeui-block="menubar-005"] [data-part="slot"]{position:relative}
[data-vibeui-block="menubar-005"] [data-part="trigger"]{
list-style:none;cursor:pointer;display:flex;align-items:center;gap:0.5rem;
height:1.875rem;padding:0 0.625rem;border-radius:0.4375rem;font-size:0.8125rem;
}
[data-vibeui-block="menubar-005"] [data-part="trigger"]::-webkit-details-marker{display:none}
[data-vibeui-block="menubar-005"] [data-part="trigger"]:hover{background:var(--vibeui-menubar-005-hover)}
[data-vibeui-block="menubar-005"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-menubar-005-accent);outline-offset:-2px}
[data-vibeui-block="menubar-005"] [data-part="slot"][open] > [data-part="trigger"]{background:var(--vibeui-menubar-005-hover)}
[data-vibeui-block="menubar-005"] [data-part="menu"]{
position:absolute;top:calc(100% + 0.375rem);left:0;z-index:30;
min-width:12rem;padding:0.25rem;box-sizing:border-box;margin:0;list-style:none;
background:var(--vibeui-menubar-005-panel);
border:1px solid var(--vibeui-menubar-005-border);border-radius:0.625rem;
box-shadow:0 16px 36px -18px var(--vibeui-menubar-005-shadow);
}
[data-vibeui-block="menubar-005"] [data-part="item"]{
display:block;width:100%;min-height:1.875rem;padding:0.3125rem 0.5rem;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="menubar-005"] [data-part="item"]:hover{background:var(--vibeui-menubar-005-hover)}
[data-vibeui-block="menubar-005"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menubar-005-accent);outline-offset:-2px}
/* Бургер: три полоски, которые складываются в крест при раскрытии. */
[data-vibeui-block="menubar-005"] [data-part="bars"]{
display:grid;gap:0.1875rem;width:1rem;
}
[data-vibeui-block="menubar-005"] [data-part="bars"] i{
display:block;height:1.5px;background:currentColor;border-radius:1px;
transition:transform .18s ease,opacity .18s ease;
}
[data-vibeui-block="menubar-005"] [data-part="narrow"][open] [data-part="bars"] i:first-child{transform:translateY(0.3125rem) rotate(45deg)}
[data-vibeui-block="menubar-005"] [data-part="narrow"][open] [data-part="bars"] i:nth-child(2){opacity:0}
[data-vibeui-block="menubar-005"] [data-part="narrow"][open] [data-part="bars"] i:last-child{transform:translateY(-0.3125rem) rotate(-45deg)}
[data-vibeui-block="menubar-005"] [data-part="sheet"]{
margin:0.375rem 0 0;padding:0.25rem 0 0;list-style:none;
border-top:1px solid var(--vibeui-menubar-005-border);
}
[data-vibeui-block="menubar-005"] [data-part="subsheet"]{margin:0;padding:0;list-style:none}
[data-vibeui-block="menubar-005"] [data-part="section"]{
padding:0.5rem 0.5rem 0.1875rem;font-size:0.6875rem;letter-spacing:0.04em;
text-transform:uppercase;color:var(--vibeui-menubar-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menubar-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MENUS: Menubar005Menu[] = [
  {
    label: "Файл",
    items: ["Новый проект", "Открыть…", "Сохранить", "Экспорт"],
  },
  {
    label: "Правка",
    items: ["Отменить", "Повторить", "Найти в проекте"],
  },
  {
    label: "Вид",
    items: ["Сетка", "Боковая панель", "Во весь экран"],
  },
  {
    label: "Справка",
    items: ["Горячие клавиши", "Документация"],
  },
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
 * Строка меню, сворачивающаяся в бургер на узкой ширине блока.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Menubar005({
  menus = DEFAULT_MENUS,
  burgerLabel = "Меню",
  menubarLabel = "Меню приложения",
  background = "",
  accent,
  className,
  style,
}: Menubar005Props) {
  const palette = {
    ...(accent ? { "--vibeui-menubar-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-menubar-005-bg": background,
          "--vibeui-menubar-005-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menubar-005" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="menubar-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="wide" role="menubar" aria-label={menubarLabel}>
            {menus.map((menu) => (
              <details
                key={menu.label}
                data-part="slot"
                name="vibeui-menubar-005"
              >
                <summary data-part="trigger" role="menuitem">
                  {menu.label}
                </summary>
                <ul data-part="menu" role="menu" aria-label={menu.label}>
                  {menu.items.map((item) => (
                    <li key={item} role="none">
                      <button type="button" data-part="item" role="menuitem">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <details data-part="narrow">
            <summary data-part="trigger">
              <span data-part="bars" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              {burgerLabel}
            </summary>
            <ul data-part="sheet">
              {menus.map((menu) => (
                <li key={menu.label}>
                  <p data-part="section">{menu.label}</p>
                  <ul data-part="subsheet">
                    {menu.items.map((item) => (
                      <li key={item}>
                        <button type="button" data-part="item">
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </>
  )
}
