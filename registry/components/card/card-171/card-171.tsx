"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card171Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  collapseAllText?: string
  expandAllText?: string
  branches?: string[]
  open?: string[]
  setOpen?: (value: string[]) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока datagrid-024, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-171"]){
--vibeui-card-171-accent:light-dark(oklch(0.27 0 0),oklch(0.906 0 0));
--vibeui-card-171-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-171-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-171"]{color-scheme:dark}
[data-vibeui-block="card-171"]{box-sizing:border-box}
[data-vibeui-block="card-171"] *{box-sizing:border-box}
[data-vibeui-block="card-171"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-171-border);}
[data-vibeui-block="card-171"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-171"] [data-part="all"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-171-border);
background:transparent;color:var(--vibeui-card-171-fg);}
[data-vibeui-block="card-171"] [data-part="all"]:focus-visible{outline:2px solid var(--vibeui-card-171-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-171"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Таблица-дерево»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card171({
  heading = "Смета проекта",
  collapseAllText = "Свернуть всё",
  expandAllText = "Развернуть всё",
  branches = [],
  open = [],
  setOpen = () => {},
  accent,
  className,
  style,
  ...props
}: Card171Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-171-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-171" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-171"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <button
          type="button"
          data-part="all"
          onClick={() =>
            setOpen((current) =>
              current.length === branches.length ? [] : branches,
            )
          }
        >
          {open.length === branches.length ? collapseAllText : expandAllText}
        </button>
      </div>
    </>
  )
}
