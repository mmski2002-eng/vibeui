import type { ComponentProps, CSSProperties } from "react"

export type Menubar001Menu = {
  label: string
  items: { label: string; keys?: string; disabled?: boolean }[]
}

export type Menubar001Props = Omit<ComponentProps<"div">, "children"> & {
  menus?: Menubar001Menu[]
  /** Имя строки меню для скринридера. */
  menubarLabel?: string
  /**
   * Приставка к id меню и имени якоря. Двум строкам меню на одной странице
   * нужны разные приставки, иначе кнопка одной откроет меню другой.
   */
  group?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка меню приложения на HTML popover. Открытие, закрытие
// по Escape и по клику мимо, а также взаимное закрытие соседних меню достаются
// от браузера — своя реализация потребовала бы состояния и глобального
// слушателя. Положение меню под своей кнопкой держит CSS anchor positioning:
// у каждой пары кнопка-меню собственное имя якоря.
const STYLES = `
:where([data-vibeui-block="menubar-001"]){
--vibeui-menubar-001-bg:transparent;
--vibeui-menubar-001-panel:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-menubar-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-menubar-001-muted:color-mix(in oklab,var(--vibeui-menubar-001-fg) 68%,transparent);
--vibeui-menubar-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-menubar-001-hover:light-dark(oklch(0.55 0.02 265 / 9%),oklch(0.88 0.02 265 / 14%));
--vibeui-menubar-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-menubar-001-shadow:light-dark(oklch(0.2 0.03 265 / 45%),oklch(0 0 0 / 62%));
--vibeui-menubar-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="menubar-001"]{color-scheme:dark}
[data-vibeui-block="menubar-001"]{
display:flex;align-items:center;gap:0.125rem;
box-sizing:border-box;padding:0.25rem;
background:var(--vibeui-menubar-001-bg);
border:1px solid var(--vibeui-menubar-001-border);border-radius:0.625rem;
font-family:var(--vibeui-menubar-001-font);color:var(--vibeui-menubar-001-fg);
}
[data-vibeui-block="menubar-001"] [data-part="trigger"]{
appearance:none;border:0;background:none;cursor:pointer;
height:1.875rem;padding:0 0.625rem;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;
}
[data-vibeui-block="menubar-001"] [data-part="trigger"]:hover{background:var(--vibeui-menubar-001-hover)}
[data-vibeui-block="menubar-001"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-menubar-001-accent);outline-offset:-2px}
/* Кнопка держит фон, пока её меню на экране: видно, какой раздел открыт. */
[data-vibeui-block="menubar-001"] [data-part="slot"]:has([data-part="menu"]:popover-open) [data-part="trigger"]{background:var(--vibeui-menubar-001-hover)}
[data-vibeui-block="menubar-001"] [data-part="menu"]{
position:fixed;inset:auto;margin:0;
min-width:11rem;padding:0.25rem;box-sizing:border-box;
background:var(--vibeui-menubar-001-panel);color:var(--vibeui-menubar-001-fg);
border:1px solid var(--vibeui-menubar-001-border);border-radius:0.625rem;
font-family:var(--vibeui-menubar-001-font);
box-shadow:0 16px 36px -18px var(--vibeui-menubar-001-shadow);
}
/* У каждой пары кнопка-меню своё имя якоря: меню встаёт под свою кнопку. */
@supports (anchor-name: --a){
[data-vibeui-block="menubar-001"] [data-part="trigger"]{anchor-name:var(--vibeui-menubar-001-anchor)}
[data-vibeui-block="menubar-001"] [data-part="menu"]{
position-anchor:var(--vibeui-menubar-001-anchor);
position-area:bottom span-right;margin-top:0.375rem;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="menubar-001"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:1.5rem;
width:100%;min-height:1.875rem;padding:0 0.5rem;box-sizing:border-box;
border-radius:0.4375rem;appearance:none;border:0;background:none;cursor:pointer;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="menubar-001"] [data-part="item"]:hover:not(:disabled){background:var(--vibeui-menubar-001-hover)}
[data-vibeui-block="menubar-001"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menubar-001-accent);outline-offset:-2px}
[data-vibeui-block="menubar-001"] [data-part="item"]:disabled{color:var(--vibeui-menubar-001-muted);cursor:default}
[data-vibeui-block="menubar-001"] [data-part="keys"]{font-size:0.75rem;color:var(--vibeui-menubar-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menubar-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MENUS: Menubar001Menu[] = [
  {
    label: "Файл",
    items: [
      { label: "Новый проект", keys: "⌘N" },
      { label: "Открыть…", keys: "⌘O" },
      { label: "Сохранить", keys: "⌘S" },
      { label: "Восстановить версию", disabled: true },
    ],
  },
  {
    label: "Правка",
    items: [
      { label: "Отменить", keys: "⌘Z" },
      { label: "Повторить", keys: "⇧⌘Z" },
      { label: "Найти в проекте", keys: "⌘F" },
    ],
  },
  {
    label: "Вид",
    items: [
      { label: "Показать сетку" },
      { label: "Тёмная тема" },
      { label: "Во весь экран", keys: "F11" },
    ],
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
 * Строка меню приложения на HTML popover: открытие и закрытие от браузера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menubar001({
  menus = DEFAULT_MENUS,
  menubarLabel = "Меню приложения",
  group = "vibeui-menubar-001",
  background = "",
  accent,
  className,
  style,
  ...props
}: Menubar001Props) {
  const palette = {
    ...(accent ? { "--vibeui-menubar-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-menubar-001-bg": background,
          "--vibeui-menubar-001-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menubar-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="menubar"
        data-vibeui-block="menubar-001"
        role="menubar"
        aria-label={menubarLabel}
        className={className}
        style={palette}
      >
        {menus.map((menu, index) => {
          const id = `${group}-${index}`
          const anchor = {
            "--vibeui-menubar-001-anchor": `--${id}`,
          } as CSSProperties

          return (
            <span key={menu.label} data-part="slot" style={anchor}>
              <button
                type="button"
                data-part="trigger"
                role="menuitem"
                popoverTarget={id}
              >
                {menu.label}
              </button>
              <div id={id} data-part="menu" popover="auto" role="menu">
                {menu.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    data-part="item"
                    role="menuitem"
                    disabled={item.disabled}
                  >
                    {item.label}
                    {item.keys ? (
                      <span data-part="keys">{item.keys}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </span>
          )
        })}
      </div>
    </>
  )
}
