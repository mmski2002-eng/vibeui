import type { CSSProperties, ReactNode } from "react"

type Layout013Chapter = {
  index: string
  title: string
  text: string
}

export type Layout013Props = {
  /** Свои главы вместо демонстрационных. */
  children?: ReactNode
  heading?: string
  chapters?: Layout013Chapter[]
  /** Слот закреплённой иллюстрации; без него — стилизованная сцена. */
  visual?: ReactNode
  visualLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Главы с закреплённой иллюстрацией: короткие главы текста идут потоком
// слева, один визуал держится sticky справа в пределах секции. Для
// объяснения продукта, процесса и технологии. Длина сцены равна сумме
// глав — пустых экранов ради анимации нет. Смену состояния визуала по
// активной главе добавляет scrollspy принимающего проекта; базовый
// каркас honest-статичен. В узкой колонке визуал встаёт после глав.
const STYLES = `
:where([data-vibeui-block="layout-013"]){
--vibeui-layout-013-bg:#ffffff;
--vibeui-layout-013-ink:#000000;
--vibeui-layout-013-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-013-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-013-accent:#ff5900;
--vibeui-layout-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-013"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-013-bg);color:var(--vibeui-layout-013-ink);
font-family:var(--vibeui-layout-013-font);
}
[data-vibeui-block="layout-013"] *{box-sizing:border-box}
[data-vibeui-block="layout-013"] [data-part="shell"]{
max-width:80rem;margin:0 auto;padding:2.5rem 1rem 4rem;
display:flex;flex-direction:column;gap:2rem;
}
[data-vibeui-block="layout-013"] [data-part="heading"]{
margin:0;max-width:24ch;
font-size:clamp(1.75rem,4.4cqi,2.75rem);line-height:1.08;letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="layout-013"] [data-part="body"]{
display:flex;flex-direction:column;gap:2rem;
}
[data-vibeui-block="layout-013"] [data-part="chapters"]{
flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2.5rem;
}
[data-vibeui-block="layout-013"] [data-part="chapter"]{
display:flex;flex-direction:column;gap:0.5rem;max-width:34rem;
}
[data-vibeui-block="layout-013"] [data-part="chapter"] span{
display:inline-flex;align-items:center;gap:0.625rem;
font-size:0.8125rem;font-weight:640;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-layout-013-accent);
}
[data-vibeui-block="layout-013"] [data-part="chapter"] h3{
margin:0;font-size:1.375rem;letter-spacing:-0.015em;font-weight:650;
}
[data-vibeui-block="layout-013"] [data-part="chapter"] p{
margin:0;font-size:1rem;line-height:1.65;
color:color-mix(in oklab,#000000 80%,#ffffff);
}
[data-vibeui-block="layout-013"] [data-part="visual"]{
flex:none;min-height:18rem;
}
[data-vibeui-block="layout-013"] [data-part="scene"]{
position:relative;height:100%;min-height:18rem;overflow:hidden;
background:linear-gradient(150deg,#1a1a1a 0%,#000000 82%);
}
[data-vibeui-block="layout-013"] [data-part="scene"]::before{
content:"";position:absolute;inset:0;
background:radial-gradient(20rem 12rem at 70% 24%,color-mix(in oklab,var(--vibeui-layout-013-accent) 32%,transparent),transparent 64%);
}
[data-vibeui-block="layout-013"] [data-part="scene"]::after{
content:"";position:absolute;left:14%;right:14%;top:26%;bottom:26%;
border:1px solid color-mix(in oklab,#ffffff 22%,transparent);
background:color-mix(in oklab,#ffffff 6%,transparent);
}
[data-vibeui-block="layout-013"] a:focus-visible{
outline:2px solid var(--vibeui-layout-013-accent);outline-offset:2px;
}
@container (min-width: 54rem){
[data-vibeui-block="layout-013"] [data-part="shell"]{padding:3.5rem 2rem 5rem}
[data-vibeui-block="layout-013"] [data-part="body"]{
flex-direction:row;align-items:flex-start;gap:3.5rem;
}
[data-vibeui-block="layout-013"] [data-part="visual"]{
flex:0 0 44%;position:sticky;top:1.5rem;min-height:26rem;
}
[data-vibeui-block="layout-013"] [data-part="scene"]{min-height:26rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHAPTERS: Layout013Chapter[] = [
  {
    index: "01 · Замер",
    title: "Система видит данные",
    text: "Первая глава объясняет вход: подключение источников занимает вечер, а не спринт. Текст идёт обычным потоком — сколько нужно словам, столько и экрана.",
  },
  {
    index: "02 · Разбор",
    title: "Модель раскладывает поток",
    text: "Иллюстрация справа держится закреплённой, пока читаются главы. Смену её состояния по активной главе подключает scrollspy проекта.",
  },
  {
    index: "03 · Ответ",
    title: "Команда получает выводы",
    text: "Финальная глава завершает сцену; ниже страница продолжается обычными секциями — закрепление отпускает визуал само.",
  },
]

/** Главы с закреплённой иллюстрацией: текст потоком, визуал sticky в пределах сцены. */
export function Layout013({
  children,
  heading = "Как устроен продукт",
  chapters = DEFAULT_CHAPTERS,
  visual,
  visualLabel = "Иллюстрация продукта",
  accent,
  className,
  style,
}: Layout013Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-013" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="layout-013" className={className} style={palette}>
        <div data-part="shell">
          <h2 data-part="heading">{heading}</h2>
          <div data-part="body">
            <div data-part="chapters">
              {children ??
                chapters.map((chapter) => (
                  <article data-part="chapter" key={chapter.index}>
                    <span>{chapter.index}</span>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.text}</p>
                  </article>
                ))}
            </div>
            <div data-part="visual">
              {visual ?? <div data-part="scene" role="img" aria-label={visualLabel} />}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
