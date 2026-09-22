import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Card074Props = Omit<ComponentProps<"article">, "title" | "children"> & {
  media?: ReactNode
  value?: string
  title?: string
  text?: string
  numbers?: boolean
  index?: number
  ghost?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Ghost({ kind }: { kind: string }) {
  switch (kind) {
    case "empty":
      return <></>
    case "list":
      return <><div data-part="rows"><span><i /><b /></span><span><i /><b /></span><span><i /><b /></span><span><i /><b /></span></div><span data-part="bar" data-soft="" /></>
    case "window":
      return <><span data-part="window"><i /><i /><i /></span></>
    case "image":
      return <><span data-part="image" /><span data-part="bar" /><span data-part="bar" data-soft="" /></>
    case "chart":
      return <><svg data-part="spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path data-fill="" d="M0 32 L14 26 L28 29 L42 18 L56 21 L70 10 L84 13 L100 4 L100 40 L0 40 Z" /><path d="M0 32 L14 26 L28 29 L42 18 L56 21 L70 10 L84 13 L100 4" /></svg><span data-part="bar" /><span data-part="bar" data-soft="" /></>
    case "proof":
      return <><div data-part="faces"><i /><i /><i /><i /></div><span data-part="bar" data-wide="" /><span data-part="bar" data-soft="" /></>
    default:
      return null
  }
}

// Часть блока layout-016, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-074"]){
--vibeui-card-074-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-074-dur-4:340ms;
--vibeui-card-074-dur-5:460ms;
--vibeui-card-074-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-card-074-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-card-074-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-card-074-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-card-074-glow:color-mix(in oklab,var(--vibeui-card-074-accent) 42%,transparent);
--vibeui-card-074-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-card-074-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
--vibeui-card-074-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-card-074-on-accent:oklch(from var(--vibeui-card-074-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-074-radius:1.25rem;
--vibeui-card-074-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-card-074-tile-2:light-dark(#f7f7f7,#222222);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-074"]{color-scheme:dark}
[data-vibeui-block="card-074"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-074"] *{box-sizing:border-box}
@keyframes vibeui-card-074-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-card-074-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
[data-vibeui-block="card-074"]{position:relative;overflow:hidden;min-height:10rem;padding:1.5rem;border-radius:var(--vibeui-card-074-radius);
background:var(--vibeui-card-074-tile);border:1px solid var(--vibeui-card-074-edge);
display:flex;flex-direction:column;justify-content:flex-end;gap:0.75rem;
--vibeui-card-074-mx:50%;--vibeui-card-074-my:50%;--vibeui-card-074-on:0;
transition:transform var(--vibeui-card-074-dur-5) cubic-bezier(.2,.8,.2,1),border-color var(--vibeui-card-074-dur-5);}
[data-vibeui-block="card-074"]::before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(22rem circle at var(--vibeui-card-074-mx) var(--vibeui-card-074-my),color-mix(in oklab,var(--vibeui-card-074-accent) 14%,transparent),transparent 60%);opacity:var(--vibeui-card-074-on);transition:opacity var(--vibeui-card-074-dur-5)}
[data-vibeui-block="card-074"]::after{content:"";position:absolute;inset:-1px;pointer-events:none;border-radius:inherit;padding:1px;background:radial-gradient(18rem circle at var(--vibeui-card-074-mx) var(--vibeui-card-074-my),color-mix(in oklab,var(--vibeui-card-074-accent) 70%,transparent),transparent 55%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:var(--vibeui-card-074-on);transition:opacity var(--vibeui-card-074-dur-5)}
[data-vibeui-block="card-074"]:hover{border-color:var(--vibeui-card-074-edge-hover)}
[data-vibeui-block="card-074"] h3{margin:0;font-size:1.125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="card-074"] p{margin:0;color:var(--vibeui-card-074-muted);font-size:0.9375rem;line-height:1.45}
[data-vibeui-block="card-074"] [data-part="value"]{font-size:clamp(2.5rem,6cqi,3.5rem);font-weight:650;letter-spacing:-0.03em;line-height:1}
[data-vibeui-block="card-074"] [data-part="media"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="card-074"] [data-part="media"] > *{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="card-074"] > :not([data-part="media"]):not([data-part="num"]){position:relative}
[data-vibeui-block="card-074"] [data-part="num"]{position:absolute;top:1.125rem;left:1.125rem;z-index:1;font:500 0.6875rem/1 var(--vibeui-card-074-mono);letter-spacing:0.08em;padding:0.375rem 0.5rem;border-radius:999px;color:var(--vibeui-card-074-muted);border:1px solid var(--vibeui-card-074-edge);background:color-mix(in oklab,var(--vibeui-card-074-tile) 70%,transparent);transition:color var(--vibeui-card-074-dur-4),border-color var(--vibeui-card-074-dur-4),background-color var(--vibeui-card-074-dur-4)}
[data-vibeui-block="card-074"]:hover [data-part="num"]{color:var(--vibeui-card-074-on-accent);background:var(--vibeui-card-074-accent);border-color:var(--vibeui-card-074-accent)}
[data-vibeui-block="card-074"][data-numbers] [data-part="faces"],[data-vibeui-block="card-074"][data-numbers] [data-part="spark"],[data-vibeui-block="card-074"][data-numbers] [data-part="rows"],[data-vibeui-block="card-074"][data-numbers] [data-part="image"],[data-vibeui-block="card-074"][data-numbers] [data-part="window"]{margin-top:2rem}
[data-vibeui-block="card-074"] [data-part="bar"]{display:block;height:0.875rem;border-radius:999px;background:var(--vibeui-card-074-ghost-strong);width:70%}
[data-vibeui-block="card-074"] [data-part="bar"][data-soft]{background:var(--vibeui-card-074-ghost);height:0.625rem;width:50%}
[data-vibeui-block="card-074"] [data-part="bar"][data-wide]{width:88%}
[data-vibeui-block="card-074"] [data-part="bar"][data-big]{height:1.5rem}
[data-vibeui-block="card-074"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="card-074"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="card-074"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-card-074-accent);flex:none;transition:transform var(--vibeui-card-074-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-074"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-card-074-ghost);flex:1}
[data-vibeui-block="card-074"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="card-074"] [data-part="rows"][data-table] span{gap:1.25rem;padding:0.5rem 0;border-bottom:1px solid var(--vibeui-card-074-edge)}
[data-vibeui-block="card-074"] [data-part="rows"][data-table] b:first-child{max-width:30%}
[data-vibeui-block="card-074"]:hover [data-part="rows"] i{transform:scale(1.35)}
[data-vibeui-block="card-074"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="card-074"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-card-074-tile);background:var(--vibeui-card-074-ghost-strong);margin-inline-start:-0.625rem;transition:transform var(--vibeui-card-074-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-074"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-card-074-accent)}
[data-vibeui-block="card-074"]:hover [data-part="faces"] i:nth-child(2){transform:translateX(3px)}
[data-vibeui-block="card-074"]:hover [data-part="faces"] i:nth-child(3){transform:translateX(6px)}
[data-vibeui-block="card-074"]:hover [data-part="faces"] i:nth-child(4){transform:translateX(9px)}
[data-vibeui-block="card-074"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="card-074"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-card-074-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="card-074"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-card-074-glow);fill-opacity:0.25;stroke:none}
[data-vibeui-block="card-074"]:hover [data-part="spark"] path:not([data-fill]){animation:vibeui-card-074-draw 1.1s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-074"] [data-part="image"]{display:block;flex:1;min-height:6rem;border-radius:0.75rem;background:radial-gradient(70% 80% at 80% 15%,var(--vibeui-card-074-glow) 0%,transparent 65%),radial-gradient(60% 70% at 15% 85%,var(--vibeui-card-074-glow-soft) 0%,transparent 65%),var(--vibeui-card-074-tile-2);margin-bottom:auto;transition:transform 0.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-074"]:hover [data-part="image"]{transform:scale(1.02)}
[data-vibeui-block="card-074"] [data-part="window"]{display:block;flex:1;min-height:8rem;border-radius:0.75rem 0.75rem 0 0;border:1px solid var(--vibeui-card-074-edge);border-bottom:0;background:linear-gradient(var(--vibeui-card-074-tile-2),var(--vibeui-card-074-tile-2)) 0 0 / 100% 2rem no-repeat,repeating-linear-gradient(to bottom,transparent 0 2.75rem,var(--vibeui-card-074-ghost) 2.75rem 3.25rem) 1.25rem 0 / calc(100% - 2.5rem) 100% no-repeat,var(--vibeui-card-074-tile);position:relative;margin-bottom:0}
[data-vibeui-block="card-074"] [data-part="window"] i{position:absolute;top:0.7rem;width:0.6rem;height:0.6rem;border-radius:999px;background:var(--vibeui-card-074-ghost-strong)}
[data-vibeui-block="card-074"] [data-part="window"] i:nth-child(1){left:0.75rem;background:var(--vibeui-card-074-accent)}
[data-vibeui-block="card-074"] [data-part="window"] i:nth-child(2){left:1.6rem}
[data-vibeui-block="card-074"] [data-part="window"] i:nth-child(3){left:2.45rem}
[data-vibeui-block="card-074"]{animation:vibeui-card-074-rise 0.8s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-card-074-i) * 80ms)}
@supports (animation-timeline: view()){
[data-vibeui-block="card-074"]{animation:vibeui-card-074-rise linear both;animation-timeline:view();animation-range:entry 0% entry 35%;animation-delay:0s}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-074"]:hover{transform:none}
[data-vibeui-block="card-074"]::before,[data-vibeui-block="card-074"]::after{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-074"] *{animation:none!important;transition:none!important}}
`

/** Плитка витрины каталога — бренд, рубрики или карточка: номер, значение, заголовок, текст или медиа; без содержимого — скелет-заглушка. */
export function Card074({
  media,
  value,
  title,
  text,
  numbers = true,
  index = 0,
  ghost,
  accent,
  className,
  style,
  ...props
}: Card074Props) {
  const palette = {
    "--vibeui-card-074-i": index,
    ...(accent ? { "--vibeui-card-074-accent": accent } : null),
    ...style,
  } as CSSProperties
  const filled = Boolean((title || text || value || media))

  return (
    <>
      <style href="vibeui-card-074" precedence="medium">
        {STYLES}
      </style>
      <article
          {...props}
          data-slot="card"
          data-vibeui-block="card-074"
          data-numbers={numbers ? "" : undefined}
          aria-hidden={filled ? undefined : true}
          className={className}
          style={palette}
        >
        {media ? <div data-part="media">{media}</div> : null}
        {numbers ? (
          <span data-part="num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        {filled ? (
          <>
            {value ? <span data-part="value">{value}</span> : null}
            {title ? <h3>{title}</h3> : null}
            {text ? <p>{text}</p> : null}
          </>
        ) : (
          <Ghost kind={ghost} />
        )}
      </article>
    </>
  )
}
