import type { ComponentProps, CSSProperties } from "react"

export type Button088Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  topic?: string
  title?: string
  year?: string
  minutes?: number
  minuteUnits?: readonly [string, string, string]
  lessLabel?: string
  moreLabel?: string
  isOpen?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

function plural(value: number, one: string, few: string, many: string) {
  const mod10 = value % 10
  const mod100 = value % 100
  if (mod10 === 1 && mod100 !== 11) return `${value} ${one}`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${value} ${few}`
  return `${value} ${many}`
}

// Часть блока writer-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-088"]){
--vibeui-button-088-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-088-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-button-088-muted:color-mix(in oklab,var(--vibeui-button-088-fg) 60%,var(--vibeui-button-088-bg));
--vibeui-button-088-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-088-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-088"]{color-scheme:dark}
[data-vibeui-block="button-088"]{box-sizing:border-box}
[data-vibeui-block="button-088"] *{box-sizing:border-box}
[data-vibeui-block="button-088"]{display:grid;grid-template-columns:minmax(0,1fr);gap:.4rem 1.5rem;align-items:baseline;width:100%;padding:1.3rem 0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
[data-vibeui-block="button-088"]:focus-visible{outline:2px solid var(--vibeui-button-088-accent);outline-offset:4px}
[data-vibeui-block="button-088"] [data-part="name"]{display:block;margin:0;font-family:var(--vibeui-button-088-display);font-weight:400;font-size:clamp(1.7rem,3.6cqi,2.8rem);line-height:1.1;letter-spacing:-.01em;transition:color .3s,transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="button-088"] [data-part="meta"]{display:flex;gap:1.2rem;font-size:.85rem;font-style:italic;color:var(--vibeui-button-088-muted);white-space:nowrap;font-variant-numeric:tabular-nums}
[data-vibeui-block="button-088"] [data-part="meta"] span+span::before{content:"·";margin-right:1.2rem;color:var(--vibeui-button-088-accent)}
[data-vibeui-block="button-088"] [data-part="topic"]{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-button-088-muted)}
[data-vibeui-block="button-088"] [data-part="more"]{font-style:italic;font-size:.95rem;color:var(--vibeui-button-088-accent);white-space:nowrap}
@container (min-width: 40rem){
[data-vibeui-block="button-088"] [data-part="meta"]>span:not([data-part="more"]){opacity:0;transform:translateX(1rem);transition:opacity .4s,transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="button-088"]:focus-visible [data-part="meta"]>span{opacity:1;transform:none}
[data-vibeui-block="button-088"] [data-part="topic"]{grid-column:1/-1}
}
@container (min-width: 56rem){
[data-vibeui-block="button-088"] [data-part="topic"]{grid-column:auto;width:6.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-088"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-строка архива текстов: тема, название, год, минуты чтения и «подробнее/свернуть»; раскрыта через aria-expanded. */
export function Button088({
  topic = "Города",
  title = "Город, который спит на боку",
  year = "2024",
  minutes = 12,
  minuteUnits = ["минута", "минуты", "минут"],
  lessLabel = "свернуть",
  moreLabel = "читать дальше",
  isOpen,
  accent,
  className,
  style,
  ...props
}: Button088Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-088-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-088" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-088" type="button" aria-expanded={isOpen}
        className={className}
        style={palette}
      >
        <span data-part="topic">{topic}</span>
        <span data-part="name">{title}</span>
        <span data-part="meta">
          <span>{year}</span>
          <span>{plural(minutes, ...minuteUnits)}</span>
          <span data-part="more">{isOpen ? lessLabel : moreLabel}</span>
        </span>
      </button>
    </>
  )
}
