import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Menu001Item = {
  label: string
  hint?: string
  danger?: boolean
}

export type Menu001Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  label?: string
  groups?: Menu001Item[][]
  accent?: string
}

// Идея компонента: меню с разделами и подсказками клавиш на HTML popover.
// Открытие, закрытие по Escape и клику вне, слой поверх всего и позиция у
// кнопки — всё это даёт браузер: popover плюс CSS anchor positioning. Опасное
// действие стоит в отдельной группе и красится только текстом.
const STYLES = `
:where([data-vibeui-block="menu-001"]){
--vibeui-menu-001-bg:oklch(1 0 0);
--vibeui-menu-001-fg:oklch(0.24 0.014 265);
--vibeui-menu-001-muted:oklch(0.56 0.014 265);
--vibeui-menu-001-border:oklch(0.9 0.006 265);
--vibeui-menu-001-hover:oklch(0.96 0.004 265);
--vibeui-menu-001-danger:oklch(0.56 0.19 25);
--vibeui-menu-001-accent:oklch(0.55 0.17 265);
--vibeui-menu-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="menu-001"]{
display:inline-block;font-family:var(--vibeui-menu-001-font);color:var(--vibeui-menu-001-fg);
}
[data-vibeui-block="menu-001"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-menu-001-border);border-radius:0.625rem;
background:var(--vibeui-menu-001-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-menu-001-anchor;
}
[data-vibeui-block="menu-001"] [data-part="trigger"]:hover{background:var(--vibeui-menu-001-hover)}
[data-vibeui-block="menu-001"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-menu-001-accent);outline-offset:2px}
[data-vibeui-block="menu-001"] [data-part="caret"]{
width:0.375rem;height:0.375rem;margin-top:-0.125rem;
border-right:1.5px solid var(--vibeui-menu-001-muted);
border-bottom:1.5px solid var(--vibeui-menu-001-muted);
transform:rotate(45deg);
}
/* Слой, Escape и клик вне — от браузера: popover вместо своего состояния. */
[data-vibeui-block="menu-001"] [popover]{
position:fixed;margin:0;padding:0.3125rem;
min-width:13rem;max-width:min(18rem,100vw - 2rem);
border:1px solid var(--vibeui-menu-001-border);border-radius:0.75rem;
background:var(--vibeui-menu-001-bg);color:inherit;
box-shadow:0 18px 40px -22px oklch(0.2 0.02 265 / 55%);
position-anchor:--vibeui-menu-001-anchor;
top:anchor(bottom);left:anchor(left);margin-top:0.375rem;
}
/* Запасная позиция для браузеров без anchor positioning. */
@supports not (anchor-name: --a){
[data-vibeui-block="menu-001"]{position:relative}
[data-vibeui-block="menu-001"] [popover]{position:absolute;top:calc(100% + 0.375rem);left:0;inset:auto}
}
[data-vibeui-block="menu-001"] [data-part="group"] + [data-part="group"]{
margin-top:0.3125rem;padding-top:0.3125rem;border-top:1px solid var(--vibeui-menu-001-border);
}
[data-vibeui-block="menu-001"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
width:100%;min-height:2rem;padding:0 0.5rem;
appearance:none;border:0;border-radius:0.5rem;background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;text-align:left;cursor:pointer;
}
[data-vibeui-block="menu-001"] [data-part="item"]:hover{background:var(--vibeui-menu-001-hover)}
[data-vibeui-block="menu-001"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menu-001-accent);outline-offset:-2px}
/* Опасное действие красится текстом, а не заливкой всей строки. */
[data-vibeui-block="menu-001"] [data-part="item"][data-danger="true"]{color:var(--vibeui-menu-001-danger)}
[data-vibeui-block="menu-001"] kbd{
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
border:1px solid var(--vibeui-menu-001-border);
font-family:inherit;font-size:0.6875rem;color:var(--vibeui-menu-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menu-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Menu001Item[][] = [
  [
    { label: "Переименовать", hint: "F2" },
    { label: "Дублировать", hint: "⌘D" },
    { label: "Переместить" },
  ],
  [{ label: "Поделиться ссылкой" }, { label: "Скачать копию" }],
  [{ label: "Удалить проект", hint: "⌫", danger: true }],
]

/**
 * Меню на HTML popover с разделами и подсказками клавиш.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menu001({
  label = "Действия",
  groups = DEFAULT_GROUPS,
  accent,
  className,
  style,
  ...props
}: Menu001Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    ...(accent ? { "--vibeui-menu-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menu-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="menu-001"
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" popoverTarget={`${id}-menu`}>
          {label}
          <span data-part="caret" aria-hidden="true" />
        </button>
        <div id={`${id}-menu`} popover="auto" role="menu" aria-label={label}>
          {groups.map((group, index) => (
            <div key={index} data-part="group" role="group">
              {group.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  data-part="item"
                  data-danger={item.danger}
                >
                  {item.label}
                  {item.hint ? <kbd>{item.hint}</kbd> : null}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
