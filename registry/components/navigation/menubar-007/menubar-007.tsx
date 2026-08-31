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
--vibeui-menubar-007-bg:oklch(1 0 0);
--vibeui-menubar-007-fg:oklch(0.24 0.014 265);
--vibeui-menubar-007-muted:oklch(0.58 0.014 265);
--vibeui-menubar-007-border:oklch(0.9 0.006 265);
--vibeui-menubar-007-hover:oklch(0.55 0.02 265 / 10%);
--vibeui-menubar-007-accent:oklch(0.55 0.2 262);
--vibeui-menubar-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:var(--vibeui-menubar-007-bg);
border:1px solid var(--vibeui-menubar-007-border);border-radius:0.625rem;
box-shadow:0 16px 36px -18px oklch(0.2 0.03 265 / 45%);
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
background:var(--vibeui-menubar-007-bg);
border:1px solid var(--vibeui-menubar-007-border);border-radius:0.625rem;
box-shadow:0 16px 36px -18px oklch(0.2 0.03 265 / 45%);
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
 * Строка меню с вложенными подменю, раскрывающимися вбок без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menubar007({
  menus = DEFAULT_MENUS,
  accent,
  className,
  style,
}: Menubar007Props) {
  const palette = {
    ...(accent ? { "--vibeui-menubar-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menubar-007" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="menubar-007"
        role="menubar"
        aria-label="Меню приложения"
        className={className}
        style={palette}
      >
        {menus.map((menu) => (
          <details key={menu.label} data-part="slot" name="vibeui-menubar-007">
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
