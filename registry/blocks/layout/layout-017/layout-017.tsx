import type { CSSProperties } from "react"

export type Layout017Props = {
  /** Строка-разворот огромной контурной антиквой: «18 · XII». */
  line?: string
  /** Рукописная строка поверх нижнего края: «когда стемнеет». */
  script?: string
  /** Подпись капителью над строкой: день, место, час. */
  caption?: string
  /** Сугроб по нижнему краю — мягкий переход к следующей секции. */
  drift?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Пауза-разворот между плотными секциями: одна строка во всю ширину
// контурной антиквой, по ней по мере прокрутки проходит тёплый блик, как
// от свечи, а сама строка чуть едет вбок. Поверх — рукописная строка,
// снизу сугроб вместо резкого края. Всё на scroll-timeline, без JS; без
// поддержки блик стоит посередине, строка на месте. Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="layout-017"]){
--vibeui-layout-017-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-017-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-017-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-layout-017-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-017-display:"Cormorant Garamond",Georgia,serif;
--vibeui-layout-017-script:"Marck Script","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-017"]{color-scheme:dark}
:where([data-vibeui-block="layout-017"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-017"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-017"]{box-sizing:border-box;position:relative;display:grid;place-items:center;min-height:min(66svh,44rem);overflow:hidden;background:var(--vibeui-layout-017-bg);color:var(--vibeui-layout-017-fg)}
[data-vibeui-block="layout-017"] *{box-sizing:border-box}
[data-vibeui-block="layout-017"] [data-part="frame"]{position:relative;display:grid;justify-items:center;width:100%;padding:5rem 0 7rem;text-align:center}
[data-vibeui-block="layout-017"] [data-part="caption"]{display:flex;align-items:center;gap:1rem;margin:0 0 1.2rem;padding:0 1.25rem;font-family:var(--vibeui-layout-017-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-layout-017-muted)}
[data-vibeui-block="layout-017"] [data-part="caption"]::before,[data-vibeui-block="layout-017"] [data-part="caption"]::after{content:"";width:clamp(1.5rem,6cqi,4rem);height:1px;background:currentColor;opacity:.5}
[data-vibeui-block="layout-017"] [data-part="line"]{margin:0;white-space:nowrap;font-family:var(--vibeui-layout-017-display);font-size:clamp(3.5rem,28cqi,17rem);font-weight:300;line-height:.9;letter-spacing:-.02em;font-variant-numeric:lining-nums;color:transparent;-webkit-text-stroke:1px color-mix(in oklab,var(--vibeui-layout-017-fg) 50%,transparent);background:linear-gradient(100deg,transparent 34%,color-mix(in oklab,var(--vibeui-layout-017-accent) 85%,transparent) 50%,transparent 66%) 50% 0/260% 100% no-repeat text}
[data-vibeui-block="layout-017"] [data-part="script"]{position:relative;margin:-.35em 0 0;padding:0 1.25rem;font-family:var(--vibeui-layout-017-script);font-size:clamp(1.6rem,5cqi,3.2rem);line-height:1.1;color:var(--vibeui-layout-017-accent);transform:rotate(-4deg);text-shadow:0 0 1.4rem color-mix(in oklab,var(--vibeui-layout-017-accent) 45%,transparent)}
[data-vibeui-block="layout-017"] [data-part="drift"]{position:absolute;left:0;right:0;bottom:-1px;width:100%;height:clamp(3rem,9cqi,6rem);pointer-events:none;-webkit-mask-image:linear-gradient(#000 35%,transparent);mask-image:linear-gradient(#000 35%,transparent)}
[data-vibeui-block="layout-017"] [data-part="drift"] path{fill:var(--vibeui-layout-017-fg)}
[data-vibeui-block="layout-017"] [data-part="drift"] path:first-child{opacity:.06}
[data-vibeui-block="layout-017"] [data-part="drift"] path:last-child{opacity:.1}
@keyframes vibeui-layout-017-glint{from{background-position:100% 0}to{background-position:0 0}}
@keyframes vibeui-layout-017-drift{from{transform:translateX(5%)}to{transform:translateX(-5%)}}
@keyframes vibeui-layout-017-rise{from{opacity:0;transform:translateY(1rem) rotate(-4deg)}to{opacity:1;transform:rotate(-4deg)}}
@supports (animation-timeline:view()){
[data-vibeui-block="layout-017"] [data-part="line"]{animation:vibeui-layout-017-glint linear both,vibeui-layout-017-drift linear both;animation-timeline:view(),view()}
[data-vibeui-block="layout-017"] [data-part="script"]{animation:vibeui-layout-017-rise ease-out both;animation-timeline:view();animation-range:entry 40% cover 45%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-017"] *{animation:none!important;transition:none!important}}
`

/** Пауза-разворот: огромная контурная строка во всю ширину, тёплый блик по прокрутке, рукописная строка и сугроб по нижнему краю. */
export function Layout017({
  line = "18 · XII",
  script = "когда стемнеет",
  caption = "Суббота · Лесная усадьба · 16:00",
  drift = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Layout017Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-017-accent": accent } : null),
    ...(ink ? { "--vibeui-layout-017-fg": ink } : null),
    ...(background ? { "--vibeui-layout-017-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-layout-017" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="layout-017" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="frame">
          {caption ? <p data-part="caption">{caption}</p> : null}
          <h2 data-part="line">{line}</h2>
          {script ? <p data-part="script">{script}</p> : null}
        </div>
        {drift ? (
          <svg data-part="drift" viewBox="0 0 1440 96" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 58c120-26 250-34 390-14s250 30 390 8 300-44 420-28 180 22 240 18V96H0z" />
            <path d="M0 78c160-18 300-12 460 2s300 10 470-6 330-18 510 4V96H0z" />
          </svg>
        ) : null}
      </section>
    </>
  )
}
