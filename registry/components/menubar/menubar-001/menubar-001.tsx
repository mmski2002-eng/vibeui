import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Menubar001Menu = {
  label: string
  items: { label: string; keys?: string; disabled?: boolean }[]
}

export type Menubar001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  menus?: Menubar001Menu[]
  accent?: string
}

// Идея компонента: строка меню приложения на HTML popover. Открытие, закрытие
// по Escape и по клику мимо, а также взаимное закрытие соседних меню достаются
// от браузера — своя реализация потребовала бы состояния и глобального
// слушателя. Положение меню под своей кнопкой держит CSS anchor positioning:
// у каждой пары кнопка-меню собственное имя якоря.
const STYLES = `
:where([data-vibeui-block="menubar-001"]){
--vibeui-menubar-001-bg:oklch(1 0 0);
--vibeui-menubar-001-fg:oklch(0.24 0.014 265);
--vibeui-menubar-001-muted:oklch(0.58 0.014 265);
--vibeui-menubar-001-border:oklch(0.9 0.006 265);
--vibeui-menubar-001-hover:oklch(0.55 0.02 265 / 9%);
--vibeui-menubar-001-accent:oklch(0.55 0.2 262);
--vibeui-menubar-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:var(--vibeui-menubar-001-bg);color:var(--vibeui-menubar-001-fg);
border:1px solid var(--vibeui-menubar-001-border);border-radius:0.625rem;
font-family:var(--vibeui-menubar-001-font);
box-shadow:0 16px 36px -18px oklch(0.2 0.03 265 / 45%);
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
 * Строка меню приложения на HTML popover: открытие и закрытие от браузера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menubar001({
  menus = DEFAULT_MENUS,
  accent,
  className,
  style,
  ...props
}: Menubar001Props) {
  const palette = {
    ...(accent ? { "--vibeui-menubar-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menubar-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="menubar-001"
        role="menubar"
        className={className}
        style={palette}
      >
        {menus.map((menu, index) => {
          const id = `vibeui-menubar-001-${index}`
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
