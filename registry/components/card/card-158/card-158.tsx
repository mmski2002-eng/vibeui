import type { ComponentProps, CSSProperties } from "react"

export type Card158Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  single?: boolean
  hintText?: Record<string, string>
  accent?: string
  className?: string
  style?: CSSProperties
}

const HINT_LABEL: Record<string, string> = {
  single: "Открыта одна строка",
  multiple: "Можно раскрыть несколько",
}

// Часть блока datagrid-008, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-158"]){
--vibeui-card-158-border:light-dark(oklch(0.92 0 230),oklch(0.34 0 230));
--vibeui-card-158-muted:color-mix(in oklab,var(--vibeui-card-158-fg) 68%,transparent);
--vibeui-card-158-fg:light-dark(oklch(0.23 0 230),oklch(0.93 0 230));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-158"]{color-scheme:dark}
[data-vibeui-block="card-158"]{box-sizing:border-box}
[data-vibeui-block="card-158"] *{box-sizing:border-box}
[data-vibeui-block="card-158"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;
padding:0.875rem;border-bottom:1px solid var(--vibeui-card-158-border);}
[data-vibeui-block="card-158"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="card-158"] [data-part="hint"]{margin:0 0 0 auto;font-size:0.75rem;color:var(--vibeui-card-158-muted);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-158"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Строка с подробностями»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card158({
  heading = "Отгрузки",
  single = true,
  hintText = HINT_LABEL,
  accent,
  className,
  style,
  ...props
}: Card158Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-158-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-158" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-158"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="hint">
          {single
            ? (hintText.single ?? HINT_LABEL.single)
            : (hintText.multiple ?? HINT_LABEL.multiple)}
        </p>
      </div>
    </>
  )
}
