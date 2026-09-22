import type { ComponentProps, CSSProperties } from "react"

export type Card125Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  time?: string
  title?: string
  place?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока event-013, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-125"]){
--vibeui-card-125-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-125-card:light-dark(#ffffff,#242424);
--vibeui-card-125-display:"Cormorant Garamond",Georgia,serif;
--vibeui-card-125-line:light-dark(color-mix(in oklab,var(--vibeui-card-125-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-card-125-fg) 22%,transparent));
--vibeui-card-125-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-card-125-script:"Marck Script","Segoe Script",cursive;
--vibeui-card-125-silver:#9fb0c8;
--vibeui-card-125-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-125"]{color-scheme:dark}
[data-vibeui-block="card-125"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-125"] *{box-sizing:border-box}
[data-vibeui-block="card-125"]{position:relative;display:grid;grid-template-columns:4.2rem minmax(0,1fr);gap:.2rem 1rem;padding:1.1rem 1.2rem 1.1rem 1rem;border:1px solid transparent;border-radius:.8rem;transition:background .5s,border-color .5s,box-shadow .5s}
[data-vibeui-block="card-125"][data-active="true"]{background:var(--vibeui-card-125-card);border-color:rgb(242 182 79 / .4);box-shadow:0 0 0 1px rgb(242 182 79 / .12),0 20px 40px -28px rgb(242 182 79 / .5)}
[data-vibeui-block="card-125"] time{grid-row:span 3;align-self:start;font-family:var(--vibeui-card-125-display);font-size:1.6rem;font-weight:500;line-height:1;font-variant-numeric:lining-nums tabular-nums;color:var(--vibeui-card-125-muted);transition:color .5s}
[data-vibeui-block="card-125"][data-active="true"] time{color:var(--vibeui-card-125-accent);text-shadow:0 0 18px rgb(242 182 79 / .5)}
[data-vibeui-block="card-125"] h3{margin:0;font-family:var(--vibeui-card-125-display);font-size:1.45rem;font-weight:500;line-height:1.15}
[data-vibeui-block="card-125"] h3 span{margin-left:.6rem;font-family:var(--vibeui-card-125-script);font-size:1.05rem;font-weight:400;color:var(--vibeui-card-125-silver)}
[data-vibeui-block="card-125"] p{margin:0;font-size:.92rem;color:var(--vibeui-card-125-muted)}
[data-vibeui-block="card-125"] i{position:absolute;left:-.35rem;top:1.35rem;width:.7rem;height:.7rem;border-radius:50%;background:var(--vibeui-card-125-line);transition:background .5s,box-shadow .5s}
[data-vibeui-block="card-125"][data-active="true"] i,[data-vibeui-block="card-125"][data-done="true"] i{background:var(--vibeui-card-125-accent);box-shadow:0 0 10px var(--vibeui-card-125-accent)}
[data-vibeui-block="card-125"] i{left:.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-125"] *{animation:none!important;transition:none!important}}
`

/** Строка программы с индикатором: время, заголовок и описание; активный и прошедшие по data-active/data-done. */
export function Card125({
  time = "15:30",
  title = "Сбор гостей",
  place = "Слот живой программы",
  text = "Слот живой программы",
  accent,
  className,
  style,
  ...props
}: Card125Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-125-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-125" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-125"
        className={className}
        style={palette}
      >
        <i aria-hidden="true" />
        <time>{time}</time>
        <h3>
          {title}
          {place ? <span>{place}</span> : null}
        </h3>
        {text ? <p>{text}</p> : null}
      </li>
    </>
  )
}
