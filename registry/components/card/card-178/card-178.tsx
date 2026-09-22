import type { ComponentProps, CSSProperties } from "react"

export type Card178Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  scrollHint?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока datagrid-031, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-178"]){
--vibeui-card-178-border:light-dark(oklch(0.92 0 250),oklch(0.34 0 250));
--vibeui-card-178-muted:color-mix(in oklab,var(--vibeui-card-178-fg) 68%,transparent);
--vibeui-card-178-fg:light-dark(oklch(0.23 0 250),oklch(0.93 0 250));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-178"]{color-scheme:dark}
[data-vibeui-block="card-178"]{box-sizing:border-box}
[data-vibeui-block="card-178"] *{box-sizing:border-box}
[data-vibeui-block="card-178"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;
padding:0.875rem;border-bottom:1px solid var(--vibeui-card-178-border);}
[data-vibeui-block="card-178"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="card-178"] [data-part="hint"]{margin:0 0 0 auto;font-size:0.75rem;color:var(--vibeui-card-178-muted);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-178"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Замороженный угол»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card178({
  heading = "Остатки на сегодня",
  scrollHint = "Прокрутите в любую сторону — шапка и позиция остаются на месте",
  accent,
  className,
  style,
  ...props
}: Card178Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-178-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-178" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-178"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="hint">{scrollHint}</p>
      </div>
    </>
  )
}
