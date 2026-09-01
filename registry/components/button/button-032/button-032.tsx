import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button032Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> & {
  /** Имя кнопки: подписи у неё нет, только три точки. */
  label?: string
  items?: string[]
  /** Опасный пункт снизу, за разделителем. Пустая строка убирает его. */
  dangerLabel?: string
  /** К какому краю кнопки прижимается меню. */
  align?: "start" | "end"
  /** id всплывающего слоя: на странице он обязан быть уникальным. */
  menuId?: string
  accent?: string
}

// Идея компонента: меню «ещё» без единой строчки JS. Слой открывается
// нативным popover, закрывается по Esc и по клику мимо силами браузера,
// а встаёт под кнопкой через CSS anchor positioning. Где anchor ещё не
// поддержан, popover остаётся по центру экрана — это рабочий запасной
// вариант, а не поломка. Появление сделано на @starting-style, поэтому
// анимация тоже обходится без скриптов.
const STYLES = `
:where([data-vibeui-block="button-032"]){
--vibeui-button-032-bg:oklch(1 0 0);
--vibeui-button-032-fg:oklch(0.28 0.016 265);
--vibeui-button-032-muted:oklch(0.55 0.014 265);
--vibeui-button-032-border:oklch(0.9 0.006 265);
--vibeui-button-032-accent:oklch(0.55 0.17 265);
--vibeui-button-032-danger:oklch(0.55 0.19 25);
--vibeui-button-032-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-032"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;padding:0;box-sizing:border-box;
border:1px solid var(--vibeui-button-032-border);border-radius:0.625rem;
background:var(--vibeui-button-032-bg);color:var(--vibeui-button-032-fg);
font-family:var(--vibeui-button-032-font);
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-032"]:hover{border-color:var(--vibeui-button-032-accent);color:var(--vibeui-button-032-accent)}
[data-vibeui-block="button-032"]:focus-visible{outline:2px solid var(--vibeui-button-032-accent);outline-offset:2px}
[data-vibeui-block="button-032"] [data-part="dots"]{
position:relative;width:3px;height:3px;border-radius:9999px;background:currentColor;
box-shadow:0 -6px 0 currentColor,0 6px 0 currentColor;
}
[data-vibeui-menu="button-032"]{
margin:auto;padding:0.3125rem;box-sizing:border-box;
min-width:11rem;
border:1px solid var(--vibeui-button-032-border);border-radius:0.75rem;
background:var(--vibeui-button-032-bg);color:var(--vibeui-button-032-fg);
box-shadow:0 12px 32px -12px oklch(0.2 0.02 265 / 35%);
font-family:var(--vibeui-button-032-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,overlay .14s allow-discrete,display .14s allow-discrete;
}
[data-vibeui-menu="button-032"]:popover-open{opacity:1;transform:translateY(0)}
@starting-style{
[data-vibeui-menu="button-032"]:popover-open{opacity:0;transform:translateY(-0.25rem)}
}
[data-vibeui-menu="button-032"] button{
appearance:none;border:0;cursor:pointer;
display:flex;align-items:center;width:100%;
height:2.125rem;padding:0 0.625rem;box-sizing:border-box;
border-radius:0.5rem;background:none;color:inherit;
font:inherit;font-size:0.875rem;text-align:left;
transition:background-color .12s ease;
}
[data-vibeui-menu="button-032"] button:hover{background:color-mix(in oklab,var(--vibeui-button-032-accent) 10%,transparent)}
[data-vibeui-menu="button-032"] button:focus-visible{outline:2px solid var(--vibeui-button-032-accent);outline-offset:-2px}
[data-vibeui-menu="button-032"] [data-part="danger"]{
color:var(--vibeui-button-032-danger);
margin-top:0.3125rem;border-top:1px solid var(--vibeui-button-032-border);border-radius:0 0 0.5rem 0.5rem;
}
[data-vibeui-menu="button-032"] [data-part="danger"]:hover{background:color-mix(in oklab,var(--vibeui-button-032-danger) 10%,transparent)}
/* Где anchor поддержан — меню висит под кнопкой; где нет — остаётся
   по центру экрана силами самого popover. */
@supports (anchor-name: --vibeui-button-032-anchor){
[data-vibeui-block="button-032"]{anchor-name:--vibeui-button-032-anchor}
[data-vibeui-menu="button-032"]{
position-anchor:--vibeui-button-032-anchor;
position-area:block-end span-inline-end;
margin:0.375rem 0 0;
position-try-fallbacks:flip-block;
}
[data-vibeui-menu="button-032"][data-align="start"]{position-area:block-end span-inline-start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-menu="button-032"],[data-vibeui-menu="button-032"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка «ещё» с меню на нативном popover и CSS anchor positioning.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button032({
  label = "Ещё действия",
  items = ["Переименовать", "Дублировать", "Поделиться ссылкой"],
  dangerLabel = "Удалить",
  align = "end",
  menuId = "vibeui-button-032-menu",
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button032Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-032-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-032" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-032"
        className={className}
        style={palette}
        aria-label={label}
        popoverTarget={menuId}
      >
        <span data-part="dots" aria-hidden="true" />
      </button>
      {/* Список обычных кнопок, а не role="menu": роль меню требует
          собственной навигации стрелками, а её без JS не сделать. */}
      <div
        id={menuId}
        popover="auto"
        data-vibeui-menu="button-032"
        data-align={align}
        style={palette}
      >
        {items.map((item) => (
          <button
            key={item}
            type="button"
            popoverTarget={menuId}
            popoverTargetAction="hide"
          >
            {item}
          </button>
        ))}
        {dangerLabel ? (
          <button
            type="button"
            data-part="danger"
            popoverTarget={menuId}
            popoverTargetAction="hide"
          >
            {dangerLabel}
          </button>
        ) : null}
      </div>
    </>
  )
}
