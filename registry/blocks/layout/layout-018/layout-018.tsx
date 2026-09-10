import type { CSSProperties, ReactNode } from "react"

type Layout018Scene = {
  index: string
  title: string
  text: string
  look?: "warm" | "paper" | "dark"
}

export type Layout018Props = {
  /** Свои сцены вместо демонстрационных. */
  children?: ReactNode
  heading?: string
  scenes?: Layout018Scene[]
  /** Видимый переход к следующему разделу после сцены. */
  exitLabel?: string
  exitHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Горизонтальная история от вертикальной прокрутки: на ограниченном
// участке экран закрепляется, и сцены проходят горизонтально. Реализация —
// CSS scroll-driven animation (view-timeline на sticky-обёртке), без JS
// и без GSAP. Длина закрепления равна числу сцен. Без поддержки
// view-timeline и при reduced motion закрепление полностью снимается —
// сцены идут обычной вертикальной последовательностью, контент и ссылки
// живут вне анимационного состояния.
const STYLES = `
:where([data-vibeui-block="layout-018"]){
--vibeui-layout-018-bg:#000000;
--vibeui-layout-018-accent:#ff5900;
--vibeui-layout-018-count:3;
--vibeui-layout-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-018"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-018-bg);
font-family:var(--vibeui-layout-018-font);
}
[data-vibeui-block="layout-018"] *{box-sizing:border-box}
[data-vibeui-block="layout-018"] [data-part="track"]{
display:flex;flex-direction:column;
}
[data-vibeui-block="layout-018"] [data-part="scene"]{
--vibeui-layout-018-scene-bg:#1a1a1a;
--vibeui-layout-018-scene-ink:#ffffff;
--vibeui-layout-018-scene-muted:color-mix(in oklab,#ffffff 64%,#1a1a1a);
flex:none;min-height:28rem;display:flex;
background:var(--vibeui-layout-018-scene-bg);color:var(--vibeui-layout-018-scene-ink);
}
[data-vibeui-block="layout-018"] [data-part="scene"][data-look="paper"]{
--vibeui-layout-018-scene-bg:#f2f2f2;
--vibeui-layout-018-scene-ink:#000000;
--vibeui-layout-018-scene-muted:color-mix(in oklab,#000000 58%,#f2f2f2);
}
[data-vibeui-block="layout-018"] [data-part="scene"][data-look="warm"]{
--vibeui-layout-018-scene-bg:#241a12;
}
[data-vibeui-block="layout-018"] [data-part="scene"][data-look="warm"]::before{
content:"";position:absolute;inset:0;pointer-events:none;
background:radial-gradient(24rem 14rem at 72% 26%,color-mix(in oklab,var(--vibeui-layout-018-accent) 30%,transparent),transparent 62%);
}
[data-vibeui-block="layout-018"] [data-part="scene"]{position:relative;overflow:hidden}
[data-vibeui-block="layout-018"] [data-part="inner"]{
max-width:44rem;margin:auto;width:100%;position:relative;
padding:3.5rem 1.5rem;display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-018"] [data-part="index"]{
font-size:0.8125rem;font-weight:660;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-layout-018-accent);
}
[data-vibeui-block="layout-018"] [data-part="scene"] h3{
margin:0;max-width:18ch;
font-size:clamp(1.75rem,4.6cqi,3rem);line-height:1.05;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="layout-018"] [data-part="scene"] p{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-layout-018-scene-muted);
}
[data-vibeui-block="layout-018"] [data-part="exit"]{
display:flex;justify-content:center;padding:1.5rem;
}
[data-vibeui-block="layout-018"] [data-part="exit"] a{
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.75rem;padding:0.375rem 1.375rem;
background:var(--vibeui-layout-018-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="layout-018"] [data-part="exit"] a:hover{filter:brightness(1.06)}
[data-vibeui-block="layout-018"] a:focus-visible{
outline:2px solid var(--vibeui-layout-018-accent);outline-offset:3px;
}
@supports (animation-timeline: view()) {
@media (prefers-reduced-motion:no-preference){
@container (min-width: 52rem){
[data-vibeui-block="layout-018"] [data-part="pin"]{
height:calc(var(--vibeui-layout-018-count)*60rem);
}
[data-vibeui-block="layout-018"] [data-part="viewport"]{
position:sticky;top:0;overflow:hidden;
}
[data-vibeui-block="layout-018"] [data-part="track"]{
flex-direction:row;width:calc(var(--vibeui-layout-018-count)*100%);
animation:vibeui-layout-018-pan linear both;
animation-timeline:view();
animation-range:contain 0% contain 100%;
}
[data-vibeui-block="layout-018"] [data-part="scene"]{
width:calc(100%/var(--vibeui-layout-018-count));min-height:34rem;
}
@keyframes vibeui-layout-018-pan{
from{transform:translateX(0)}
to{transform:translateX(calc(-100% + 100%/var(--vibeui-layout-018-count)))}
}
}
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SCENES: Layout018Scene[] = [
  {
    index: "Сцена 01",
    title: "Вертикаль движет горизонталь",
    text: "На широком экране участок закрепляется, и сцены едут вбок ровно столько, сколько вы прокручиваете вниз. Прогресс — чистый CSS view-timeline.",
    look: "warm",
  },
  {
    index: "Сцена 02",
    title: "Фолбэк честнее эффекта",
    text: "Без поддержки таймлайнов, на телефоне и при reduced motion те же сцены идут обычной вертикальной последовательностью.",
    look: "paper",
  },
  {
    index: "Сцена 03",
    title: "Выход всегда виден",
    text: "После последней сцены закрепление отпускает страницу, а кнопка ведёт к следующему разделу без точного скролла.",
    look: "dark",
  },
]

/** Горизонтальная история от вертикальной прокрутки на CSS view-timeline. */
export function Layout018({
  children,
  heading = "История коллекции",
  scenes = DEFAULT_SCENES,
  exitLabel = "К следующему разделу",
  exitHref = "#next",
  accent,
  className,
  style,
}: Layout018Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-018-accent": accent } : null),
    "--vibeui-layout-018-count": scenes.length,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-018" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="layout-018" aria-label={heading} className={className} style={palette}>
        <div data-part="pin">
          <div data-part="viewport">
            <div data-part="track">
              {children ??
                scenes.map((scene) => (
                  <article
                    data-part="scene"
                    data-look={scene.look === "dark" ? undefined : scene.look}
                    key={scene.index}
                  >
                    <div data-part="inner">
                      <span data-part="index">{scene.index}</span>
                      <h3>{scene.title}</h3>
                      <p>{scene.text}</p>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
        <div data-part="exit">
          <a href={exitHref}>{exitLabel}</a>
        </div>
      </section>
    </>
  )
}
