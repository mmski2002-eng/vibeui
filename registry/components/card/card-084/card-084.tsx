import type { ComponentProps, CSSProperties } from "react"

export type Card084Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  time?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока delivery-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-084"]){
--vibeui-card-084-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-084-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-084-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-084-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-084-line:color-mix(in oklab,var(--vibeui-card-084-fg) 14%,transparent);
--vibeui-card-084-muted:color-mix(in oklab,var(--vibeui-card-084-fg) 62%,var(--vibeui-card-084-bg));
--vibeui-card-084-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-084"]{color-scheme:dark}
[data-vibeui-block="card-084"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-084"] *{box-sizing:border-box}
[data-vibeui-block="card-084"]{position:relative;transition:opacity .4s}
[data-vibeui-block="card-084"][data-state="todo"]{opacity:.45}
[data-vibeui-block="card-084"]::before{content:"";position:absolute;left:-2.2rem;top:.3rem;width:1.4rem;height:1.4rem;border-radius:50%;border:2px solid var(--vibeui-card-084-line);background:var(--vibeui-card-084-bg);transition:background .3s,border-color .3s,transform .3s cubic-bezier(.34,1.56,.64,1)}
[data-vibeui-block="card-084"][data-state="done"]::before,[data-vibeui-block="card-084"][data-state="now"]::before{background:var(--vibeui-card-084-accent);border-color:var(--vibeui-card-084-accent)}
[data-vibeui-block="card-084"][data-state="now"]::before{transform:scale(1.25);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-card-084-accent) 25%,transparent)}
[data-vibeui-block="card-084"] h3{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin:0;font-family:var(--vibeui-card-084-display);font-weight:700;font-size:1rem}
[data-vibeui-block="card-084"] h3 time{font-family:var(--vibeui-card-084-font);font-weight:600;font-size:.82rem;color:var(--vibeui-card-084-muted);font-variant-numeric:tabular-nums;opacity:0;transition:opacity .3s}
[data-vibeui-block="card-084"][data-state="done"] time,[data-vibeui-block="card-084"][data-state="now"] time{opacity:1}
[data-vibeui-block="card-084"] p{margin:.25rem 0 0;font-size:.88rem;color:var(--vibeui-card-084-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-084"] *{animation:none!important;transition:none!important}}
`

/** Шаг статуса заказа: заголовок, время и описание; состояние done/now/todo через data-state. */
export function Card084({
  title = "Заказ принят",
  time = "12:41",
  text = "Оплата прошла, повар видит заказ на экране.",
  accent,
  className,
  style,
  ...props
}: Card084Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-084-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-084" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-084"
        className={className}
        style={palette}
      >
        <h3>
          {title}
          <time>{time}</time>
        </h3>
        <p>{text}</p>
      </li>
    </>
  )
}
