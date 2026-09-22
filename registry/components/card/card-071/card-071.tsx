import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Card071Props = Omit<ComponentProps<"article">, "title" | "children"> & {
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
    case "icon":
      return <><span data-part="icon" /><span data-part="bar" /><span data-part="bar" data-soft="" /></>
    default:
      return null
  }
}

// Часть блока layout-012, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-071"]){
--vibeui-card-071-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-071-dur-4:340ms;
--vibeui-card-071-dur-5:460ms;
--vibeui-card-071-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-card-071-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-card-071-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-card-071-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-card-071-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
--vibeui-card-071-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-card-071-on-accent:oklch(from var(--vibeui-card-071-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-071-radius:1.25rem;
--vibeui-card-071-tile:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-071"]{color-scheme:dark}
[data-vibeui-block="card-071"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-071"] *{box-sizing:border-box}
[data-vibeui-block="card-071"]{position:relative;overflow:hidden;min-height:10rem;padding:1.5rem;border-radius:var(--vibeui-card-071-radius);
background:var(--vibeui-card-071-tile);border:1px solid var(--vibeui-card-071-edge);
display:flex;flex-direction:column;justify-content:flex-end;gap:0.75rem;
--vibeui-card-071-mx:50%;--vibeui-card-071-my:50%;--vibeui-card-071-on:0;
transition:transform var(--vibeui-card-071-dur-5) cubic-bezier(.2,.8,.2,1),border-color var(--vibeui-card-071-dur-5);}
[data-vibeui-block="card-071"]::before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(22rem circle at var(--vibeui-card-071-mx) var(--vibeui-card-071-my),color-mix(in oklab,var(--vibeui-card-071-accent) 14%,transparent),transparent 60%);opacity:var(--vibeui-card-071-on);transition:opacity var(--vibeui-card-071-dur-5)}
[data-vibeui-block="card-071"]::after{content:"";position:absolute;inset:-1px;pointer-events:none;border-radius:inherit;padding:1px;background:radial-gradient(18rem circle at var(--vibeui-card-071-mx) var(--vibeui-card-071-my),color-mix(in oklab,var(--vibeui-card-071-accent) 70%,transparent),transparent 55%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:var(--vibeui-card-071-on);transition:opacity var(--vibeui-card-071-dur-5)}
[data-vibeui-block="card-071"]:hover{border-color:var(--vibeui-card-071-edge-hover)}
[data-vibeui-block="card-071"] h3{margin:0;font-size:1.125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="card-071"] p{margin:0;color:var(--vibeui-card-071-muted);font-size:0.9375rem;line-height:1.45}
[data-vibeui-block="card-071"] [data-part="value"]{font-size:clamp(2.5rem,6cqi,3.5rem);font-weight:650;letter-spacing:-0.03em;line-height:1}
[data-vibeui-block="card-071"] [data-part="media"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="card-071"] [data-part="media"] > *{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="card-071"] > :not([data-part="media"]):not([data-part="num"]){position:relative}
[data-vibeui-block="card-071"] [data-part="num"]{position:absolute;top:1.125rem;left:1.125rem;z-index:1;font:500 0.6875rem/1 var(--vibeui-card-071-mono);letter-spacing:0.08em;padding:0.375rem 0.5rem;border-radius:999px;color:var(--vibeui-card-071-muted);border:1px solid var(--vibeui-card-071-edge);background:color-mix(in oklab,var(--vibeui-card-071-tile) 70%,transparent);transition:color var(--vibeui-card-071-dur-4),border-color var(--vibeui-card-071-dur-4),background-color var(--vibeui-card-071-dur-4)}
[data-vibeui-block="card-071"]:hover [data-part="num"]{color:var(--vibeui-card-071-on-accent);background:var(--vibeui-card-071-accent);border-color:var(--vibeui-card-071-accent)}
[data-vibeui-block="card-071"][data-numbers] [data-part="icon"]{margin-top:2rem}
[data-vibeui-block="card-071"] [data-part="bar"]{display:block;height:0.875rem;border-radius:999px;background:var(--vibeui-card-071-ghost-strong);width:70%}
[data-vibeui-block="card-071"] [data-part="bar"][data-soft]{background:var(--vibeui-card-071-ghost);height:0.625rem;width:50%}
[data-vibeui-block="card-071"] [data-part="bar"][data-wide]{width:88%}
[data-vibeui-block="card-071"] [data-part="bar"][data-big]{height:1.5rem}
[data-vibeui-block="card-071"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-card-071-accent);margin-bottom:auto;transition:transform var(--vibeui-card-071-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-071"]:hover [data-part="icon"]{transform:rotate(-6deg) scale(1.08)}
[data-vibeui-block="card-071"][data-area="core"] [data-part="num"]{top:0.5rem;left:0.5rem}
[data-vibeui-block="card-071"][data-area="core"] [data-part="icon"]{margin:0;width:3rem;height:3rem;border-radius:1rem}
[data-vibeui-block="card-071"][data-area="core"] [data-part="bar"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-071"]:hover{transform:none}
[data-vibeui-block="card-071"]::before,[data-vibeui-block="card-071"]::after{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-071"] *{animation:none!important;transition:none!important}}
`

/** Узел орбиты интеграций: номер, значение, заголовок, текст или медиа; без содержимого — скелет-заглушка. Кольца и вращение держит блок. */
export function Card071({
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
}: Card071Props) {
  const palette = {
    "--vibeui-card-071-i": index,
    ...(accent ? { "--vibeui-card-071-accent": accent } : null),
    ...style,
  } as CSSProperties
  const filled = Boolean((title || text || value || media))

  return (
    <>
      <style href="vibeui-card-071" precedence="medium">
        {STYLES}
      </style>
      <article
          {...props}
          data-slot="card"
          data-vibeui-block="card-071"
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
