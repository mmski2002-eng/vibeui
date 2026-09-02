import type { CSSProperties } from "react"

export type Menubar003Item = {
  label: string
  keys?: string
  disabled?: boolean
}

export type Menubar003Menu = {
  label: string
  items: Menubar003Item[]
}

export type Menubar003Props = {
  menus?: Menubar003Menu[]
  platform?: "mac" | "windows"
  /** Имя строки меню для скринридера. */
  menubarLabel?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: строка меню, где сочетания клавиш выстроены в общую колонку,
// а не приклеены к тексту пункта — по такому списку сочетание находится взглядом
// сверху вниз. Взаимное закрытие разделов держит атрибут name у <details>:
// браузер сам следит, что открыт только один, без единой строки JS.
const STYLES = `
:where([data-vibeui-block="menubar-003"]){
--vibeui-menubar-003-bg:transparent;
--vibeui-menubar-003-panel:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-menubar-003-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-menubar-003-muted:light-dark(oklch(0.58 0.014 265),oklch(0.68 0.012 265));
--vibeui-menubar-003-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-menubar-003-hover:light-dark(oklch(0.55 0.02 265 / 10%),oklch(0.88 0.02 265 / 14%));
--vibeui-menubar-003-key:light-dark(oklch(0.96 0.004 265),oklch(0.31 0.012 265));
--vibeui-menubar-003-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-menubar-003-shadow:light-dark(oklch(0.2 0.03 265 / 45%),oklch(0 0 0 / 62%));
--vibeui-menubar-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="menubar-003"]{
box-sizing:border-box;width:100%;max-width:34rem;padding:0.25rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-menubar-003-bg);color:var(--vibeui-menubar-003-fg);
border:1px solid var(--vibeui-menubar-003-border);border-radius:0.625rem;
font-family:var(--vibeui-menubar-003-font);
}
[data-vibeui-block="menubar-003"] [data-part="slot"]{position:relative}
[data-vibeui-block="menubar-003"] [data-part="trigger"]{
list-style:none;cursor:pointer;display:flex;align-items:center;
height:1.875rem;padding:0 0.625rem;border-radius:0.4375rem;
font-size:0.8125rem;
transition:background-color .14s ease;
}
[data-vibeui-block="menubar-003"] [data-part="trigger"]::-webkit-details-marker{display:none}
[data-vibeui-block="menubar-003"] [data-part="trigger"]:hover{background:var(--vibeui-menubar-003-hover)}
[data-vibeui-block="menubar-003"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-menubar-003-accent);outline-offset:-2px}
[data-vibeui-block="menubar-003"] [data-part="slot"][open] [data-part="trigger"]{background:var(--vibeui-menubar-003-hover)}
[data-vibeui-block="menubar-003"] [data-part="menu"]{
position:absolute;top:calc(100% + 0.375rem);left:0;z-index:30;
min-width:14rem;padding:0.25rem;box-sizing:border-box;
background:var(--vibeui-menubar-003-panel);
border:1px solid var(--vibeui-menubar-003-border);border-radius:0.625rem;
box-shadow:0 16px 36px -18px var(--vibeui-menubar-003-shadow);
}
/* Пункт — сетка из двух колонок: подпись слева, сочетание всегда у правого края. */
[data-vibeui-block="menubar-003"] [data-part="item"]{
display:grid;grid-template-columns:1fr auto;align-items:center;gap:1.25rem;
width:100%;min-height:1.875rem;padding:0 0.5rem;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="menubar-003"] [data-part="item"]:hover:not(:disabled){background:var(--vibeui-menubar-003-hover)}
[data-vibeui-block="menubar-003"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menubar-003-accent);outline-offset:-2px}
[data-vibeui-block="menubar-003"] [data-part="item"]:disabled{color:var(--vibeui-menubar-003-muted);cursor:default}
[data-vibeui-block="menubar-003"] kbd{
justify-self:end;font-family:inherit;font-size:0.6875rem;line-height:1;
padding:0.1875rem 0.3125rem;border-radius:0.25rem;
background:var(--vibeui-menubar-003-key);color:var(--vibeui-menubar-003-muted);
border:1px solid var(--vibeui-menubar-003-border);
}
[data-vibeui-block="menubar-003"] kbd + kbd{margin-left:0.1875rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menubar-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MENUS: Menubar003Menu[] = [
  {
    label: "Файл",
    items: [
      { label: "Новый проект", keys: "Mod N" },
      { label: "Открыть…", keys: "Mod O" },
      { label: "Сохранить", keys: "Mod S" },
      { label: "Экспорт", keys: "Mod Shift E" },
    ],
  },
  {
    label: "Правка",
    items: [
      { label: "Отменить", keys: "Mod Z" },
      { label: "Повторить", keys: "Mod Shift Z" },
      { label: "Заменить", keys: "Mod R" },
      { label: "Вставить историю", disabled: true },
    ],
  },
  {
    label: "Вид",
    items: [
      { label: "Палитра команд", keys: "Mod K" },
      { label: "Боковая панель", keys: "Mod B" },
      { label: "Во весь экран", keys: "F11" },
    ],
  },
]

/**
 * Сочетание записывается платформонезависимо: `Mod` подставляется на ⌘ или Ctrl,
 * поэтому один и тот же список подписей работает на обеих платформах.
 */
function keysFor(keys: string, platform: "mac" | "windows") {
  return keys
    .replace("Mod", platform === "mac" ? "⌘" : "Ctrl")
    .replace("Shift", platform === "mac" ? "⇧" : "Shift")
    .split(" ")
}

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
 * Строка меню с колонкой горячих клавиш и взаимно закрывающимися разделами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menubar003({
  menus = DEFAULT_MENUS,
  platform = "mac",
  menubarLabel = "Меню приложения",
  background = "",
  accent,
  className,
  style,
}: Menubar003Props) {
  const palette = {
    ...(accent ? { "--vibeui-menubar-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-menubar-003-bg": background,
          "--vibeui-menubar-003-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menubar-003" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="menubar-003"
        role="menubar"
        aria-label={menubarLabel}
        className={className}
        style={palette}
      >
        {menus.map((menu) => (
          <details key={menu.label} data-part="slot" name="vibeui-menubar-003">
            <summary data-part="trigger" role="menuitem">
              {menu.label}
            </summary>
            <div data-part="menu" role="menu" aria-label={menu.label}>
              {menu.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  data-part="item"
                  role="menuitem"
                  disabled={item.disabled}
                >
                  <span>{item.label}</span>
                  {item.keys ? (
                    <span>
                      {keysFor(item.keys, platform).map((part) => (
                        <kbd key={part}>{part}</kbd>
                      ))}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </details>
        ))}
      </div>
    </>
  )
}
