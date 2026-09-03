import type { CSSProperties } from "react"

export type Menubar007Item = {
  label: string
  keys?: string
  items?: { label: string; keys?: string }[]
}

export type Menubar007Menu = {
  label: string
  items: Menubar007Item[]
}

export type Menubar007Props = {
  menus?: Menubar007Menu[]
  /** Имя строки меню для скринридера. */
  menubarLabel?: string
  /**
   * Имя радиогруппы <details>. Двум строкам меню на одной странице нужны
   * разные имена, иначе открытый раздел одной закрывает раздел другой.
   */
  group?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: меню с вложенными подменю, которые раскрываются вбок и без
// JS. Подменю показывает :focus-within у своего пункта — значит, оно доступно и
// мышью, и с клавиатуры: фокус на родительском пункте уже раскрывает список, и
// в него можно уйти табуляцией. Стрелка справа помечает пункт с продолжением.
const STYLES = `
:where([data-vibeui-block="menubar-007"]){
--vibeui-menubar-007-bg:transparent;
--vibeui-menubar-007-panel:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-menubar-007-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-menubar-007-muted:color-mix(in oklab,var(--vibeui-menubar-007-fg) 68%,transparent);
--vibeui-menubar-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-menubar-007-hover:light-dark(oklch(0.55 0.02 265 / 10%),oklch(0.88 0.02 265 / 14%));
--vibeui-menubar-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-menubar-007-shadow:light-dark(oklch(0.2 0.03 265 / 45%),oklch(0 0 0 / 62%));
--vibeui-menubar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="menubar-007"]{color-scheme:dark}
[data-vibeui-block="menubar-007"]{
box-sizing:border-box;width:100%;max-width:30rem;padding:0.25rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-menubar-007-bg);color:var(--vibeui-menubar-007-fg);
border:1px solid var(--vibeui-menubar-007-border);border-radius:0.625rem;
font-family:var(--vibeui-menubar-007-font);
}
[data-vibeui-block="menubar-007"] [data-part="slot"]{position:relative}
[data-vibeui-block="menubar-007"] [data-part="trigger"]{
list-style:none;cursor:pointer;display:flex;align-items:center;
height:1.875rem;padding:0 0.625rem;border-radius:0.4375rem;font-size:0.8125rem;
}
[data-vibeui-block="menubar-007"] [data-part="trigger"]::-webkit-details-marker{display:none}
[data-vibeui-block="menubar-007"] [data-part="trigger"]:hover{background:var(--vibeui-menubar-007-hover)}
[data-vibeui-block="menubar-007"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-menubar-007-accent);outline-offset:-2px}
[data-vibeui-block="menubar-007"] [data-part="slot"][open] > [data-part="trigger"]{background:var(--vibeui-menubar-007-hover)}
[data-vibeui-block="menubar-007"] [data-part="menu"]{
position:absolute;top:calc(100% + 0.375rem);left:0;z-index:30;
min-width:12.5rem;padding:0.25rem;box-sizing:border-box;margin:0;list-style:none;
background:var(--vibeui-menubar-007-panel);
border:1px solid var(--vibeui-menubar-007-border);border-radius:0.625rem;
box-shadow:0 16px 36px -18px var(--vibeui-menubar-007-shadow);
}
[data-vibeui-block="menubar-007"] [data-part="row"]{position:relative}
[data-vibeui-block="menubar-007"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:1.25rem;
width:100%;min-height:1.875rem;padding:0 0.5rem;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="menubar-007"] [data-part="item"]:hover{background:var(--vibeui-menubar-007-hover)}
[data-vibeui-block="menubar-007"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menubar-007-accent);outline-offset:-2px}
[data-vibeui-block="menubar-007"] [data-part="keys"]{font-size:0.6875rem;color:var(--vibeui-menubar-007-muted)}
/* Стрелка-«галочка» из бордюров: пункт с продолжением видно без иконочного шрифта. */
[data-vibeui-block="menubar-007"] [data-part="more"]{
width:0.375rem;height:0.375rem;border:1.5px solid var(--vibeui-menubar-007-muted);
border-left:0;border-bottom:0;transform:rotate(45deg);
}
/* Подменю открывает наведение или фокус внутри строки: состояния и JS не нужно. */
[data-vibeui-block="menubar-007"] [data-part="sub"]{
display:none;position:absolute;top:-0.25rem;left:100%;z-index:40;
min-width:11rem;padding:0.25rem;box-sizing:border-box;margin:0 0 0 0.25rem;list-style:none;
background:var(--vibeui-menubar-007-panel);
border:1px solid var(--vibeui-menubar-007-border);border-radius:0.625rem;
box-shadow:0 16px 36px -18px var(--vibeui-menubar-007-shadow);
}
[data-vibeui-block="menubar-007"] [data-part="row"]:hover > [data-part="sub"],
[data-vibeui-block="menubar-007"] [data-part="row"]:focus-within > [data-part="sub"]{display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menubar-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MENUS: Menubar007Menu[] = [
  {
    label: "Файл",
    items: [
      { label: "Новый проект", keys: "⌘N" },
      {
        label: "Открыть недавние",
        items: [
          { label: "Лендинг студии" },
          { label: "Документация" },
          { label: "Магазин пряжи" },
        ],
      },
      {
        label: "Экспорт",
        items: [
          { label: "В PDF" },
          { label: "В PNG", keys: "⌘E" },
          { label: "В архив" },
        ],
      },
      { label: "Сохранить", keys: "⌘S" },
    ],
  },
  {
    label: "Правка",
    items: [
      { label: "Отменить", keys: "⌘Z" },
      {
        label: "Преобразовать",
        items: [{ label: "В заглавные" }, { label: "В строчные" }],
      },
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
 * Строка меню с вложенными подменю, раскрывающимися вбок без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menubar007({
  menus = DEFAULT_MENUS,
  menubarLabel = "Меню приложения",
  group = "vibeui-menubar-007",
  background = "",
  accent,
  className,
  style,
}: Menubar007Props) {
  const palette = {
    ...(accent ? { "--vibeui-menubar-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-menubar-007-bg": background,
          "--vibeui-menubar-007-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menubar-007" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="menubar"
        data-vibeui-block="menubar-007"
        role="menubar"
        aria-label={menubarLabel}
        className={className}
        style={palette}
      >
        {menus.map((menu) => (
          <details key={menu.label} data-part="slot" name={group}>
            <summary data-part="trigger" role="menuitem">
              {menu.label}
            </summary>
            <ul data-part="menu" role="menu" aria-label={menu.label}>
              {menu.items.map((item) => (
                <li key={item.label} data-part="row" role="none">
                  <button
                    type="button"
                    data-part="item"
                    role="menuitem"
                    aria-haspopup={item.items ? "menu" : undefined}
                    aria-expanded={item.items ? false : undefined}
                  >
                    {item.label}
                    {item.items ? (
                      <span data-part="more" aria-hidden="true" />
                    ) : item.keys ? (
                      <span data-part="keys">{item.keys}</span>
                    ) : null}
                  </button>
                  {item.items ? (
                    <ul data-part="sub" role="menu" aria-label={item.label}>
                      {item.items.map((child) => (
                        <li key={child.label} role="none">
                          <button
                            type="button"
                            data-part="item"
                            role="menuitem"
                          >
                            {child.label}
                            {child.keys ? (
                              <span data-part="keys">{child.keys}</span>
                            ) : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </>
  )
}
