import type { ComponentProps, CSSProperties } from "react"

export type Card079Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  who?: string
  what?: string
  ago?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока bento-010, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-079"]){
--vibeui-card-079-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-079-line:color-mix(in oklab,var(--vibeui-card-079-fg) 12%,transparent);
--vibeui-card-079-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-079-muted:color-mix(in oklab,var(--vibeui-card-079-fg) 58%,var(--vibeui-card-079-bg));
--vibeui-card-079-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-079"]{color-scheme:dark}
[data-vibeui-block="card-079"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-079"] *{box-sizing:border-box}
[data-vibeui-block="card-079"]{display:inline-flex;align-items:center;gap:.5rem;height:2.4rem;padding:0 .9rem;border-radius:999px;background:var(--vibeui-card-079-bg);border:1px solid var(--vibeui-card-079-line);white-space:nowrap;font-size:.84rem}
[data-vibeui-block="card-079"] b{font-weight:600}
[data-vibeui-block="card-079"] span{font-family:var(--vibeui-card-079-mono);font-size:.66rem;color:var(--vibeui-card-079-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-079"] *{animation:none!important;transition:none!important}}
`

/** Строка ленты покупок: кто, что и когда — для бегущей строки социального доказательства. */
export function Card079({
  who = "Маша из Казани",
  what = "Атлас — UI-кит",
  ago = "только что",
  accent,
  className,
  style,
  ...props
}: Card079Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-079-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-079" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-079"
        className={className}
        style={palette}
      >
        <b>{who}</b>
        {what}
        <span>{ago}</span>
      </li>
    </>
  )
}
