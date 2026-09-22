import type { ComponentProps, CSSProperties } from "react"

export type Card101Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока gadget-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-101"]){
--vibeui-card-101-accent:light-dark(#111111,#f2ede4);
--vibeui-card-101-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-101-glass:color-mix(in oklab,var(--vibeui-card-101-fg) 5%,transparent);
--vibeui-card-101-line:color-mix(in oklab,var(--vibeui-card-101-fg) 14%,transparent);
--vibeui-card-101-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-101-muted:color-mix(in oklab,var(--vibeui-card-101-fg) 60%,var(--vibeui-card-101-bg));
--vibeui-card-101-fg:light-dark(#111111,#f2ede4);
--vibeui-card-101-bg:light-dark(#ffffff,#0a0a0a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-101"]{color-scheme:dark}
[data-vibeui-block="card-101"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-101"] *{box-sizing:border-box}
[data-vibeui-block="card-101"]{display:grid;grid-template-columns:2rem 1fr;gap:.2rem .8rem;padding:.9rem 1rem;border-radius:1rem;border:1px solid transparent;cursor:default;transition:background .2s,border-color .2s}
[data-vibeui-block="card-101"]:hover,[data-vibeui-block="card-101"][data-hot="true"]{background:var(--vibeui-card-101-glass);border-color:var(--vibeui-card-101-line)}
[data-vibeui-block="card-101"]::before{counter-increment:vibeui-gadget-002;content:"0" counter(vibeui-gadget-002);grid-row:span 2;font-family:var(--vibeui-card-101-mono);font-size:.8rem;color:var(--vibeui-card-101-accent);padding-top:.2rem}
[data-vibeui-block="card-101"] h3{margin:0;font-family:var(--vibeui-card-101-display);font-weight:700;font-size:1rem;letter-spacing:-.01em}
[data-vibeui-block="card-101"] p{margin:0;font-size:.9rem;color:var(--vibeui-card-101-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-101"] *{animation:none!important;transition:none!important}}
`

/** Строка списка деталей взрыв-схемы: название и описание; подсвечена по data-hot. */
export function Card101({
  name = "Диффузор",
  text = "Опаловый поликарбонат, 2 мм. Рассеивает 96 светодиодов в один ровный диск без точек.",
  accent,
  className,
  style,
  ...props
}: Card101Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-101-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-101" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-101"
        className={className}
        style={palette}
      >
        <h3>{name}</h3>
        <p>{text}</p>
      </li>
    </>
  )
}
