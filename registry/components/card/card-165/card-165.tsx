import type { ComponentProps, CSSProperties } from "react"

export type Card165Row = {
  id: string
  step: string
  owner: string
  duration: string
}

export type Card165Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  stepsTemplate?: string
  message?: string
  order?: Card165Row[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока datagrid-015, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-165"]){
--vibeui-card-165-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-165-muted:color-mix(in oklab,var(--vibeui-card-165-fg) 68%,transparent);
--vibeui-card-165-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-165"]{color-scheme:dark}
[data-vibeui-block="card-165"]{box-sizing:border-box}
[data-vibeui-block="card-165"] *{box-sizing:border-box}
[data-vibeui-block="card-165"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-165-border);}
[data-vibeui-block="card-165"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-165"] [data-part="live"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-165-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-165"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Перестановка строк»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card165({
  heading = "Маршрут обработки заявки",
  stepsTemplate = "Шагов в маршруте: {count}",
  message = "",
  order = [],
  accent,
  className,
  style,
  ...props
}: Card165Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-165-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-165" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-165"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="live" role="status" aria-live="polite">
          {message || stepsTemplate.replace("{count}", String(order.length))}
        </p>
      </div>
    </>
  )
}
