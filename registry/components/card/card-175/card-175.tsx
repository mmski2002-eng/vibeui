import type { ComponentProps, CSSProperties } from "react"

export type Card175Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  emptyLogText?: string
  log?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока datagrid-028, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-175"]){
--vibeui-card-175-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-175-muted:color-mix(in oklab,var(--vibeui-card-175-fg) 68%,transparent);
--vibeui-card-175-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-175"]{color-scheme:dark}
[data-vibeui-block="card-175"]{box-sizing:border-box}
[data-vibeui-block="card-175"] *{box-sizing:border-box}
[data-vibeui-block="card-175"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;min-height:3rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-card-175-border);}
[data-vibeui-block="card-175"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-175"] [data-part="log"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-175-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-175"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Меню действий строки»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card175({
  heading = "Заказы в работе",
  emptyLogText = "Действие ещё не выбрано",
  log = "",
  accent,
  className,
  style,
  ...props
}: Card175Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-175-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-175" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-175"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="log" role="status" aria-live="polite">
          {log || emptyLogText}
        </p>
      </div>
    </>
  )
}
