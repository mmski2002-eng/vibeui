import type { ComponentProps, CSSProperties } from "react"

export type Button098Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  href?: string
  mark?: string
  name?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока podcast-006, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-098"]){
--vibeui-button-098-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-098-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-button-098-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-button-098-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-button-098-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-098-line:color-mix(in oklab,var(--vibeui-button-098-fg) 12%,transparent);
--vibeui-button-098-on-accent:oklch(from var(--vibeui-button-098-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-098"]{color-scheme:dark}
[data-vibeui-block="button-098"]{box-sizing:border-box}
[data-vibeui-block="button-098"] *{box-sizing:border-box}
[data-vibeui-block="button-098"]{position:relative;display:grid;gap:.8rem;padding:1.1rem;border-radius:1rem;background:var(--vibeui-button-098-bg);box-shadow:0 0 0 1px var(--vibeui-button-098-line);color:inherit;text-decoration:none;overflow:hidden;transform:rotateX(calc(var(--vibeui-button-098-ty) * 8deg)) rotateY(calc(var(--vibeui-button-098-tx) * -8deg));transition:transform .3s var(--vibeui-button-098-ease),box-shadow .3s,background .3s}
[data-vibeui-block="button-098"]::before{content:"";position:absolute;inset:0;background:radial-gradient(10rem circle at var(--vibeui-podcast-006-x,50%) var(--vibeui-podcast-006-y,50%),color-mix(in oklab,var(--vibeui-button-098-accent) 22%,transparent),transparent 60%);opacity:0;transition:opacity .35s;pointer-events:none}
[data-vibeui-block="button-098"]:hover::before{opacity:1}
[data-vibeui-block="button-098"] > *{position:relative}
[data-vibeui-block="button-098"]:hover{box-shadow:0 0 0 1px var(--vibeui-button-098-accent),0 20px 40px -24px color-mix(in oklab,var(--vibeui-button-098-accent) 60%,rgb(0 0 0 / .6));background:color-mix(in oklab,var(--vibeui-button-098-accent) 8%,var(--vibeui-button-098-bg))}
[data-vibeui-block="button-098"]:focus-visible{outline:2px solid var(--vibeui-button-098-accent);outline-offset:3px}
[data-vibeui-block="button-098"] [data-part="mark"]{width:2.4rem;height:2.4rem;border-radius:.6rem;display:grid;place-items:center;background:var(--vibeui-button-098-fg);color:var(--vibeui-button-098-bg);font-family:var(--vibeui-button-098-display);font-weight:800;font-size:1.1rem;text-transform:uppercase;transition:background .3s,color .3s,transform .4s var(--vibeui-button-098-ease)}
[data-vibeui-block="button-098"]:hover [data-part="mark"]{background:var(--vibeui-button-098-accent);color:var(--vibeui-button-098-on-accent);transform:rotate(-8deg) scale(1.1)}
[data-vibeui-block="button-098"] span{font-weight:500;font-size:.92rem}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-098"],[data-vibeui-block="button-098"] [data-part="mark"]{transform:none!important}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-098"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-плитка платформы с меткой и названием; наклон за курсором через переменные. */
export function Button098({
  href = "#",
  mark = "Плитка платформы",
  name = "Яндекс Музыка",
  accent,
  className,
  style,
  ...props
}: Button098Props) {
  const palette = {
    ["--vibeui-button-098-tx" as string]: 0, ["--vibeui-button-098-ty" as string]: 0,
    ...(accent ? { "--vibeui-button-098-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-098" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-098" href={href}
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true">
          {mark ?? name.charAt(0)}
        </span>
        <span>{name}</span>
      </a>
    </>
  )
}
