import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Item003Props = Omit<
  ComponentPropsWithoutRef<"li">,
  "children" | "title"
> & {
  title?: string
  meta?: string
  action?: string
  accent?: string
}

// Идея компонента: строка с действием справа. Здесь нельзя растягивать ссылку
// на всю площадь, как в item-001: у строки две цели — сама запись и кнопка,
// и растянутая ссылка перекрыла бы кнопку. Поэтому кнопка остаётся отдельной
// целью, а её подпись несёт название записи для скринридера: десять кнопок
// «Пригласить» подряд неразличимы на слух.
const STYLES = `
:where([data-vibeui-block="item-003"]){
--vibeui-item-003-bg:oklch(1 0 0);
--vibeui-item-003-fg:oklch(0.23 0.014 265);
--vibeui-item-003-muted:oklch(0.56 0.014 265);
--vibeui-item-003-border:oklch(0.9 0.006 265);
--vibeui-item-003-accent:oklch(0.55 0.19 262);
--vibeui-item-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="item-003"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.625rem 0.625rem 0.625rem 0.875rem;
list-style:none;
background:var(--vibeui-item-003-bg);
border:1px solid var(--vibeui-item-003-border);border-radius:0.75rem;
font-family:var(--vibeui-item-003-font);color:var(--vibeui-item-003-fg);
}
[data-vibeui-block="item-003"] *{box-sizing:border-box}
[data-vibeui-block="item-003"] [data-part="text"]{flex:1 1 auto;min-width:0;display:grid;gap:0.125rem}
[data-vibeui-block="item-003"] [data-part="title"]{
font-size:0.875rem;font-weight:650;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="item-003"] [data-part="meta"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-item-003-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Кнопка не сжимается: её подпись важнее подробностей строки. */
[data-vibeui-block="item-003"] [data-part="action"]{
flex:none;appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.75rem;border-radius:0.5rem;
border:1px solid color-mix(in oklab,var(--vibeui-item-003-accent) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-item-003-accent) 10%,transparent);
color:var(--vibeui-item-003-accent);
font:inherit;font-size:0.75rem;font-weight:650;line-height:1;
transition:background-color .15s ease;
}
[data-vibeui-block="item-003"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-item-003-accent) 18%,transparent)}
[data-vibeui-block="item-003"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-item-003-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Строка списка с отдельной кнопкой действия справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item003({
  title = "Мария Ковалёва",
  meta = "maria@studio.ru · читатель",
  action = "Пригласить",
  accent,
  className,
  style,
  ...props
}: Item003Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-003" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-vibeui-block="item-003"
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="title">{title}</span>
          {meta ? <span data-part="meta">{meta}</span> : null}
        </span>
        <button
          type="button"
          data-part="action"
          aria-label={`${action}: ${title}`}
        >
          {action}
        </button>
      </li>
    </>
  )
}
