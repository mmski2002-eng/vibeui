import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb012Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  parentLabel?: string
  parentHref?: string
  currentLabel?: string
  accent?: string
}

// Идея компонента: крошки для телефона — одна ссылка «назад к родителю».
// Полный путь на узком экране всё равно не читают: он занимает две строки и
// тянет вниз содержимое. Родитель назван словами, а не безымянной стрелкой:
// «Назад» не отвечает, куда именно вернёт.
const STYLES = `
:where([data-vibeui-block="breadcrumb-012"]){
--vibeui-breadcrumb-012-surface:oklch(1 0 0);
--vibeui-breadcrumb-012-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-012-fg:oklch(0.26 0.016 265);
--vibeui-breadcrumb-012-muted:oklch(0.56 0.014 265);
--vibeui-breadcrumb-012-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: крошки — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="breadcrumb-012"]{
box-sizing:border-box;padding:0.5rem 0.75rem;
background:var(--vibeui-breadcrumb-012-surface);
border:1px solid var(--vibeui-breadcrumb-012-surface-border);border-radius:0.625rem;
display:flex;align-items:center;gap:0.5rem;min-width:0;
font-family:var(--vibeui-breadcrumb-012-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-012-muted);
}
[data-vibeui-block="breadcrumb-012"] a{
display:inline-flex;align-items:center;gap:0.375rem;flex:none;
color:inherit;text-decoration:none;
/* Высота под палец: ссылка «назад» на телефоне нажимается чаще всего. */
min-height:2rem;padding:0 0.375rem 0 0.25rem;border-radius:0.4375rem;
}
[data-vibeui-block="breadcrumb-012"] a:hover{color:var(--vibeui-breadcrumb-012-fg);background:oklch(0.96 0.004 265)}
[data-vibeui-block="breadcrumb-012"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-012-accent);outline-offset:2px}
/* Стрелка влево из двух бордюров. */
[data-vibeui-block="breadcrumb-012"] [data-part="arrow"]{
width:0.4375rem;height:0.4375rem;flex:none;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);
}
[data-vibeui-block="breadcrumb-012"] [data-part="current"]{
min-width:0;color:var(--vibeui-breadcrumb-012-fg);font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="breadcrumb-012"] [data-part="dot"]{flex:none;color:oklch(0.78 0.01 265)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Крошки для телефона: одна названная ссылка на родителя и текущий уровень.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb012({
  parentLabel = "Компоненты",
  parentHref = "#",
  currentLabel = "Хлебные крошки для телефона",
  accent,
  className,
  style,
  ...props
}: Breadcrumb012Props) {
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-012" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-012"
        aria-label="Хлебные крошки"
        className={className}
        style={palette}
      >
        <a href={parentHref}>
          <span data-part="arrow" aria-hidden="true" />
          {parentLabel}
        </a>
        <span data-part="dot" aria-hidden="true">
          /
        </span>
        <span data-part="current" aria-current="page">
          {currentLabel}
        </span>
      </nav>
    </>
  )
}
