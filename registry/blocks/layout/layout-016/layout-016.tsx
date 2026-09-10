import type { CSSProperties, ReactNode } from "react"

export type Layout016Props = {
  /** Контент после сцены раскрытия. */
  children?: ReactNode
  kicker?: string
  title?: string
  /** Слот медиа; без него — стилизованный кадр. */
  media?: ReactNode
  mediaLabel?: string
  caption?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Раскрытие фотографии: медиа начинается в аккуратной рамке и
// расширяется до ширины секции по мере прокрутки. Реализация — CSS
// scroll-driven animation (view-timeline) без JS: прогресс привязан к
// видимости сцены. @supports-страховка и prefers-reduced-motion
// показывают сразу раскрытый кадр — контент никогда не заперт за
// анимацией. Расширяется только визуальный слой, текст не масштабируется.
const STYLES = `
:where([data-vibeui-block="layout-016"]){
--vibeui-layout-016-bg:#ffffff;
--vibeui-layout-016-ink:#000000;
--vibeui-layout-016-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-016-accent:#ff5900;
--vibeui-layout-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-016"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-016-bg);color:var(--vibeui-layout-016-ink);
font-family:var(--vibeui-layout-016-font);
}
[data-vibeui-block="layout-016"] *{box-sizing:border-box}
[data-vibeui-block="layout-016"] [data-part="shell"]{
max-width:80rem;margin:0 auto;padding:2.5rem 1rem 3rem;
display:flex;flex-direction:column;gap:1.25rem;
}
[data-vibeui-block="layout-016"] [data-part="kicker"]{
margin:0;display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:620;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-layout-016-muted);
}
[data-vibeui-block="layout-016"] [data-part="kicker"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-layout-016-accent);
}
[data-vibeui-block="layout-016"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(1.75rem,4.4cqi,2.75rem);line-height:1.08;letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="layout-016"] [data-part="stage"]{
margin:1rem 0;
}
[data-vibeui-block="layout-016"] [data-part="media"]{
width:100%;margin:0 auto;overflow:hidden;
aspect-ratio:16/9;position:relative;
}
[data-vibeui-block="layout-016"] [data-part="scene"]{
position:absolute;inset:0;
background:linear-gradient(155deg,#2b3036 0%,#59606a 46%,#93887a 78%,#3b352c 100%);
}
[data-vibeui-block="layout-016"] [data-part="scene"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(26rem 14rem at 72% 30%,rgb(255 205 155 / 30%),transparent 62%);
}
[data-vibeui-block="layout-016"] [data-part="caption"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-layout-016-muted);
}
@supports (animation-timeline: view()) {
@media (prefers-reduced-motion:no-preference){
[data-vibeui-block="layout-016"] [data-part="media"]{
animation:vibeui-layout-016-open linear both;
animation-timeline:view();
animation-range:entry 10% cover 55%;
}
@keyframes vibeui-layout-016-open{
from{width:62%;border-radius:1.25rem}
to{width:100%;border-radius:0}
}
}
}
[data-vibeui-block="layout-016"] a:focus-visible{
outline:2px solid var(--vibeui-layout-016-accent);outline-offset:2px;
}
@container (min-width: 52rem){
[data-vibeui-block="layout-016"] [data-part="shell"]{padding:3.5rem 2rem 4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-016"] *{animation:none!important;transition:none!important}}
`

/** Сцена раскрытия медиа: рамка расширяется до ширины секции CSS scroll-timeline. */
export function Layout016({
  children,
  kicker = "Пространство",
  title = "Кадр раскрывается по мере чтения",
  media,
  mediaLabel = "Интерьер с тёплым светом",
  caption = "Раскрытие — CSS view-timeline; без поддержки и при reduced motion кадр сразу широкий.",
  accent,
  className,
  style,
}: Layout016Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-016" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="layout-016" className={className} style={palette}>
        <div data-part="shell">
          <p data-part="kicker">{kicker}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="stage">
            <div data-part="media">
              {media ?? <div data-part="scene" role="img" aria-label={mediaLabel} />}
            </div>
          </div>
          <p data-part="caption">{caption}</p>
          {children}
        </div>
      </section>
    </>
  )
}
