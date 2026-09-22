"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Key = "file" | "owner" | "changed" | "size"

export type Card159Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  resetLabel?: string
  setWidths?: (value: Record<Key, number>) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока datagrid-009, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const START: Record<Key, number> = {
  file: 260,
  owner: 130,
  changed: 160,
  size: 100,
}

const STYLES = `
:where([data-vibeui-block="card-159"]){
--vibeui-card-159-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-card-159-border:light-dark(oklch(0.92 0 240),oklch(0.34 0 240));
--vibeui-card-159-fg:light-dark(oklch(0.23 0 240),oklch(0.93 0 240));
--vibeui-card-159-field:light-dark(oklch(1 0 0),oklch(0.22 0 240));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-159"]{color-scheme:dark}
[data-vibeui-block="card-159"]{box-sizing:border-box}
[data-vibeui-block="card-159"] *{box-sizing:border-box}
[data-vibeui-block="card-159"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-159-border);}
[data-vibeui-block="card-159"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-159"] button{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-159-border);
background:var(--vibeui-card-159-field);color:var(--vibeui-card-159-fg);}
[data-vibeui-block="card-159"] button:focus-visible{outline:2px solid var(--vibeui-card-159-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-159"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Колонки с изменением ширины»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card159({
  heading = "Файлы проекта",
  resetLabel = "Вернуть ширины",
  setWidths = () => {},
  accent,
  className,
  style,
  ...props
}: Card159Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-159-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-159" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-159"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <button type="button" onClick={() => setWidths(START)}>
          {resetLabel}
        </button>
      </div>
    </>
  )
}
