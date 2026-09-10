import type { CSSProperties, ReactNode } from "react"

type Layout019Frame = {
  index: string
  title: string
  text: string
  /** Ракурс кадра-заглушки. */
  angle?: "front" | "side" | "detail" | "open"
}

export type Layout019Props = {
  /** Свои этапы вместо демонстрационных. */
  children?: ReactNode
  heading?: string
  lede?: string
  frames?: Layout019Frame[]
  /** Переход дальше без просмотра всех кадров. */
  skipLabel?: string
  skipHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Покадровая история продукта, статичная основа: смысловые этапы —
// ракурсы и состояния предмета — показаны рядом со своими подписями и
// характеристиками. Это базовая версия семейства и одновременно его
// честный fallback: canvas-секвенция сотен кадров — расширение проекта
// с отдельной оценкой веса ассетов, а не условие доступа к содержимому.
// Ссылка «дальше» ведёт мимо кадров. Без JS.
const STYLES = `
:where([data-vibeui-block="layout-019"]){
--vibeui-layout-019-bg:#000000;
--vibeui-layout-019-ink:#ffffff;
--vibeui-layout-019-muted:color-mix(in oklab,#ffffff 62%,#000000);
--vibeui-layout-019-line:color-mix(in oklab,#ffffff 14%,transparent);
--vibeui-layout-019-accent:#ff5900;
--vibeui-layout-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-019"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-019-bg);color:var(--vibeui-layout-019-ink);
font-family:var(--vibeui-layout-019-font);
}
[data-vibeui-block="layout-019"] *{box-sizing:border-box}
[data-vibeui-block="layout-019"] [data-part="shell"]{
max-width:80rem;margin:0 auto;padding:3rem 1rem 4rem;
display:flex;flex-direction:column;gap:2rem;
}
[data-vibeui-block="layout-019"] [data-part="head"]{
display:flex;flex-direction:column;gap:0.75rem;max-width:40rem;
}
[data-vibeui-block="layout-019"] [data-part="head"] h2{
margin:0;font-size:clamp(1.875rem,5cqi,3.25rem);line-height:1.05;
letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="layout-019"] [data-part="head"] p{
margin:0;font-size:1.0625rem;line-height:1.6;color:var(--vibeui-layout-019-muted);
}
[data-vibeui-block="layout-019"] [data-part="skip"]{
align-self:flex-start;color:var(--vibeui-layout-019-ink);text-decoration:none;
font-size:0.9375rem;font-weight:580;
border-bottom:2px solid var(--vibeui-layout-019-accent);padding-bottom:0.125rem;
transition:color .16s ease;
}
[data-vibeui-block="layout-019"] [data-part="skip"]:hover{color:var(--vibeui-layout-019-accent)}
[data-vibeui-block="layout-019"] [data-part="frames"]{
display:flex;flex-direction:column;gap:2.5rem;
}
[data-vibeui-block="layout-019"] [data-part="frame"]{
display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-019"] [data-part="stage"]{
position:relative;aspect-ratio:16/9;overflow:hidden;
background:radial-gradient(60% 90% at 50% 100%,#231d16 0%,#0a0806 70%,#000000 100%);
}
[data-vibeui-block="layout-019"] [data-part="stage"]::before{
content:"";position:absolute;inset:0;
background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-layout-019-accent) 14%,transparent),transparent 42%);
}
[data-vibeui-block="layout-019"] [data-part="object"]{
position:absolute;left:50%;top:54%;width:34%;aspect-ratio:1.6;
transform:translate(-50%,-50%);
background:linear-gradient(150deg,#3a3f45 0%,#14161a 84%);
border:1px solid color-mix(in oklab,#ffffff 20%,transparent);
box-shadow:0 2rem 3rem rgb(0 0 0 / 50%);
}
[data-vibeui-block="layout-019"] [data-part="frame"][data-angle="side"] [data-part="object"]{
width:18%;transform:translate(-50%,-50%) skewY(-6deg);
}
[data-vibeui-block="layout-019"] [data-part="frame"][data-angle="detail"] [data-part="object"]{
width:56%;top:64%;
}
[data-vibeui-block="layout-019"] [data-part="frame"][data-angle="open"] [data-part="object"]{
width:34%;
box-shadow:0 2rem 3rem rgb(0 0 0 / 50%),0.75rem -0.75rem 0 color-mix(in oklab,var(--vibeui-layout-019-accent) 46%,transparent);
}
[data-vibeui-block="layout-019"] [data-part="caption"]{
display:flex;flex-direction:column;gap:0.375rem;max-width:44rem;
}
[data-vibeui-block="layout-019"] [data-part="caption"] span{
font-size:0.8125rem;font-weight:660;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-layout-019-accent);
}
[data-vibeui-block="layout-019"] [data-part="caption"] h3{
margin:0;font-size:1.375rem;letter-spacing:-0.015em;font-weight:660;
}
[data-vibeui-block="layout-019"] [data-part="caption"] p{
margin:0;font-size:1rem;line-height:1.6;color:var(--vibeui-layout-019-muted);
}
[data-vibeui-block="layout-019"] a:focus-visible{
outline:2px solid var(--vibeui-layout-019-accent);outline-offset:3px;
}
@container (min-width: 56rem){
[data-vibeui-block="layout-019"] [data-part="shell"]{padding:4rem 2rem 5rem}
[data-vibeui-block="layout-019"] [data-part="frame"]{
flex-direction:row;align-items:center;gap:2.5rem;
}
[data-vibeui-block="layout-019"] [data-part="stage"]{flex:0 0 56%}
[data-vibeui-block="layout-019"] [data-part="frame"]:nth-child(even){flex-direction:row-reverse}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FRAMES: Layout019Frame[] = [
  {
    index: "Кадр 01 · Общий вид",
    title: "Предмет в студийном свете",
    text: "Каждый смысловой этап — отдельный кадр с подписью и характеристиками. История читается и без движения.",
    angle: "front",
  },
  {
    index: "Кадр 02 · Профиль",
    title: "Тоньше, чем кажется",
    text: "Ракурсы меняются кадрами, а не прокруткой сотен изображений: вес страницы предсказуем.",
    angle: "side",
  },
  {
    index: "Кадр 03 · Деталь",
    title: "Крупный план узла",
    text: "Технические характеристики живут текстом рядом с кадром — сцена их не заменяет.",
    angle: "detail",
  },
  {
    index: "Кадр 04 · Разборка",
    title: "Что внутри",
    text: "Финальный этап показывает устройство. Дальше — обычные секции страницы.",
    angle: "open",
  },
]

/** Покадровая история продукта: смысловые этапы с кадрами и подписями, без canvas. */
export function Layout019({
  children,
  heading = "Устройство «Прибор-4»",
  lede = "История предмета по смысловым кадрам: ракурс, профиль, деталь, разборка. Canvas-секвенция — расширение, а не условие.",
  frames = DEFAULT_FRAMES,
  skipLabel = "Пропустить и перейти к характеристикам",
  skipHref = "#specs",
  accent,
  className,
  style,
}: Layout019Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-019" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="layout-019" aria-label={heading} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <h2>{heading}</h2>
            <p>{lede}</p>
            <a data-part="skip" href={skipHref}>
              {skipLabel}
            </a>
          </div>
          <div data-part="frames">
            {children ??
              frames.map((frame) => (
                <article
                  data-part="frame"
                  data-angle={frame.angle === "front" ? undefined : frame.angle}
                  key={frame.index}
                >
                  <div data-part="stage" role="img" aria-label={frame.title}>
                    <span data-part="object" aria-hidden="true" />
                  </div>
                  <div data-part="caption">
                    <span>{frame.index}</span>
                    <h3>{frame.title}</h3>
                    <p>{frame.text}</p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
