import type { ComponentProps, CSSProperties } from "react"

export type TimelineAnim001Milestone = {
  date: string
  title: string
  description?: string
}

export type TimelineAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  kicker?: string
  title?: string
  description?: string
  milestones?: TimelineAnim001Milestone[]
  accent?: string
  /** "auto" переключает по ширине контейнера; иначе ориентация закреплена. */
  orientation?: "auto" | "vertical" | "horizontal"
}

// Идея: лента вех, соединённых линией, которая рисуется постепенно —
// заготовка линии лежит фоном, а поверх неё растёт залитый отрезок
// (transform: scale от 0 до 1, transform-origin у начала). Точки появляются
// по очереди вдоль неё с задержкой, синхронной с прогрессом отрисовки.
// В узкой колонке лента вертикальная (линия слева, вехи одна под другой),
// на широком контейнере container-query переключает её в горизонтальную:
// линия сверху, вехи в ряд. Направление и ориентация анимации линии меняются
// вместе — тем же переключением animation-name внутри @container.
const STYLES = `
:where([data-vibeui-block="timeline-anim-001"]){
--vibeui-timeline-anim-001-bg:transparent;
--vibeui-timeline-anim-001-fg:light-dark(oklch(0.19 0.016 266),oklch(0.98 0.003 266));
--vibeui-timeline-anim-001-muted:light-dark(oklch(0.5 0.021 266),oklch(0.75 0.019 266));
--vibeui-timeline-anim-001-border:light-dark(oklch(0.16 0.014 266 / 16%),oklch(1 0 0 / 16%));
--vibeui-timeline-anim-001-card:light-dark(oklch(1 0 0),oklch(0.225 0.008 266));
--vibeui-timeline-anim-001-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.163 264));
--vibeui-timeline-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="timeline-anim-001"]{color-scheme:dark}
[data-vibeui-block="timeline-anim-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);
container-type:inline-size;
background:var(--vibeui-timeline-anim-001-bg);color:var(--vibeui-timeline-anim-001-fg);
font-family:var(--vibeui-timeline-anim-001-font);
}
[data-vibeui-block="timeline-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="timeline-anim-001"] [data-part="frame"]{
padding:clamp(2.5rem,10cqi,5rem) clamp(1.25rem,6cqi,2.5rem);
}
[data-vibeui-block="timeline-anim-001"] [data-part="head"]{
max-width:38rem;margin:0 auto;text-align:center;
}
[data-vibeui-block="timeline-anim-001"] [data-part="kicker"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0 0 0.75rem;
font-size:0.75rem;font-weight:650;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-timeline-anim-001-accent);
}
[data-vibeui-block="timeline-anim-001"] [data-part="title"]{
margin:0;font-size:clamp(1.5rem,4.5cqi,2.5rem);font-weight:650;
letter-spacing:-0.02em;line-height:1.15;text-wrap:balance;
}
[data-vibeui-block="timeline-anim-001"] [data-part="desc"]{
margin:0.875rem 0 0;font-size:clamp(0.9375rem,1.6cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-timeline-anim-001-muted);text-wrap:pretty;
}
[data-vibeui-block="timeline-anim-001"] [data-part="rail"]{
position:relative;margin:clamp(2rem,6cqi,3.5rem) 0 0;padding:0 0 0 2.25rem;
}
[data-vibeui-block="timeline-anim-001"] [data-part="list"]{
list-style:none;margin:0;padding:0;
}
[data-vibeui-block="timeline-anim-001"] [data-part="track"]{
position:absolute;left:0.5rem;top:0.375rem;bottom:0.375rem;width:2px;
background:var(--vibeui-timeline-anim-001-border);
}
[data-vibeui-block="timeline-anim-001"] [data-part="fill"]{
position:absolute;left:0.5rem;top:0.375rem;bottom:0.375rem;width:2px;
background:var(--vibeui-timeline-anim-001-accent);transform-origin:top;transform:scaleY(0);
animation:vibeui-timeline-anim-001-draw-v 1.4s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="timeline-anim-001"] [data-part="row"]{
position:relative;display:flex;flex-direction:column;gap:0.25rem;padding-bottom:1.75rem;
}
[data-vibeui-block="timeline-anim-001"] [data-part="row"]:last-child{padding-bottom:0}
[data-vibeui-block="timeline-anim-001"] [data-part="dot"]{
position:absolute;left:-2.25rem;top:0.125rem;width:1.125rem;height:1.125rem;
border-radius:9999px;background:var(--vibeui-timeline-anim-001-card);
border:2px solid var(--vibeui-timeline-anim-001-accent);
opacity:0;transform:scale(0.4);
animation:vibeui-timeline-anim-001-pop .4s cubic-bezier(.34,1.56,.64,1) both;
animation-delay:var(--vibeui-timeline-anim-001-delay,0s);
}
[data-vibeui-block="timeline-anim-001"] [data-part="date"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-timeline-anim-001-accent);
}
[data-vibeui-block="timeline-anim-001"] [data-part="mtitle"]{
margin:0;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="timeline-anim-001"] [data-part="mdesc"]{
margin:0.125rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-timeline-anim-001-muted);
}
@container (min-width:42rem){
[data-vibeui-block="timeline-anim-001"] [data-part="rail"]{
padding:2.25rem 0 0;
}
[data-vibeui-block="timeline-anim-001"] [data-part="list"]{
display:flex;gap:0;
}
[data-vibeui-block="timeline-anim-001"] [data-part="track"]{
left:0;right:0;top:0;bottom:auto;height:2px;width:auto;
}
[data-vibeui-block="timeline-anim-001"] [data-part="fill"]{
left:0;right:0;top:0;bottom:auto;height:2px;width:auto;
transform-origin:left;transform:scaleX(0);
animation-name:vibeui-timeline-anim-001-draw-h;
}
[data-vibeui-block="timeline-anim-001"] [data-part="row"]{
flex:1;align-items:center;text-align:center;padding:2rem 0.75rem 0;gap:0.375rem;
}
[data-vibeui-block="timeline-anim-001"] [data-part="dot"]{left:50%;top:-2.25rem;transform:translateX(-50%) scale(0.4)}
[data-vibeui-block="timeline-anim-001"] [data-part="dot"]{animation-name:vibeui-timeline-anim-001-pop-h}
}
[data-vibeui-block="timeline-anim-001"][data-orientation="horizontal"] [data-part="rail"]{padding:2.25rem 0 0}
[data-vibeui-block="timeline-anim-001"][data-orientation="horizontal"] [data-part="list"]{display:flex;gap:0}
[data-vibeui-block="timeline-anim-001"][data-orientation="horizontal"] [data-part="track"]{left:0;right:0;top:0;bottom:auto;height:2px;width:auto}
[data-vibeui-block="timeline-anim-001"][data-orientation="horizontal"] [data-part="fill"]{left:0;right:0;top:0;bottom:auto;height:2px;width:auto;transform-origin:left;transform:scaleX(0);animation-name:vibeui-timeline-anim-001-draw-h}
[data-vibeui-block="timeline-anim-001"][data-orientation="horizontal"] [data-part="row"]{flex:1;align-items:center;text-align:center;padding:2rem 0.75rem 0;gap:0.375rem}
[data-vibeui-block="timeline-anim-001"][data-orientation="horizontal"] [data-part="dot"]{left:50%;top:-2.25rem;transform:translateX(-50%) scale(0.4);animation-name:vibeui-timeline-anim-001-pop-h}
[data-vibeui-block="timeline-anim-001"][data-orientation="vertical"] [data-part="rail"]{padding:0 0 0 2.25rem}
[data-vibeui-block="timeline-anim-001"][data-orientation="vertical"] [data-part="list"]{display:block}
[data-vibeui-block="timeline-anim-001"][data-orientation="vertical"] [data-part="track"]{left:0.5rem;right:auto;top:0.375rem;bottom:0.375rem;height:auto;width:2px}
[data-vibeui-block="timeline-anim-001"][data-orientation="vertical"] [data-part="fill"]{left:0.5rem;right:auto;top:0.375rem;bottom:0.375rem;height:auto;width:2px;transform-origin:top;transform:scaleY(0);animation-name:vibeui-timeline-anim-001-draw-v}
[data-vibeui-block="timeline-anim-001"][data-orientation="vertical"] [data-part="row"]{flex:none;align-items:stretch;text-align:left;padding:0 0 1.75rem;gap:0.25rem}
[data-vibeui-block="timeline-anim-001"][data-orientation="vertical"] [data-part="row"]:last-child{padding-bottom:0}
[data-vibeui-block="timeline-anim-001"][data-orientation="vertical"] [data-part="dot"]{left:-2.25rem;top:0.125rem;transform:scale(0.4);animation-name:vibeui-timeline-anim-001-pop}
@keyframes vibeui-timeline-anim-001-draw-v{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes vibeui-timeline-anim-001-draw-h{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes vibeui-timeline-anim-001-pop{from{opacity:0;transform:scale(0.4)}to{opacity:1;transform:none}}
@keyframes vibeui-timeline-anim-001-pop-h{from{opacity:0;transform:translateX(-50%) scale(0.4)}to{opacity:1;transform:translateX(-50%) scale(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="timeline-anim-001"] [data-part="fill"]{animation:none;transform:none}
[data-vibeui-block="timeline-anim-001"] [data-part="dot"]{animation:none;opacity:1;transform:none}
[data-vibeui-block="timeline-anim-001"] [data-part="dot"]{transform:translateX(0) scale(1)}
}
@container (min-width:42rem){
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="timeline-anim-001"] [data-part="dot"]{transform:translateX(-50%) scale(1)}
}
}
`

const DEFAULT_MILESTONES: TimelineAnim001Milestone[] = [
  {
    date: "Янв 2023",
    title: "Первая версия каталога",
    description: "20 компонентов и Copy for AI",
  },
  {
    date: "Июн 2023",
    title: "Публичный запуск",
    description: "Открытая бета, первые команды",
  },
  {
    date: "Фев 2024",
    title: "shadcn-совместимый registry",
    description: "Установка одной командой в CLI",
  },
  {
    date: "Сен 2024",
    title: "500+ компонентов",
    description: "Блоки, анимации и полноценные шаблоны",
  },
]

/**
 * Секция вех: линия рисуется постепенно, точки появляются вдоль неё по
 * очереди. Вертикальная лента в узком месте, горизонтальная — на широком
 * контейнере. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function TimelineAnim001({
  kicker = "Путь продукта",
  title = "Вехи, которые привели нас сюда",
  description = "Коротко о том, как каталог рос от первой версии до текущего релиза.",
  milestones = DEFAULT_MILESTONES,
  accent,
  orientation = "auto",
  className,
  style,
  ...props
}: TimelineAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="timeline-anim-001"
        data-slot="timeline-section"
        data-orientation={orientation !== "auto" ? orientation : undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {kicker || title || description ? (
            <div data-part="head">
              {kicker ? <p data-part="kicker">{kicker}</p> : null}
              {title ? <h2 data-part="title">{title}</h2> : null}
              {description ? <p data-part="desc">{description}</p> : null}
            </div>
          ) : null}
          <div data-part="rail">
            <span data-part="track" aria-hidden="true" />
            <span data-part="fill" aria-hidden="true" />
            <ol data-part="list">
              {milestones.map((milestone, index) => (
                <li data-part="row" key={milestone.title}>
                  <span
                    data-part="dot"
                    aria-hidden="true"
                    style={
                      {
                        "--vibeui-timeline-anim-001-delay": `${0.5 + index * 0.22}s`,
                      } as CSSProperties
                    }
                  />
                  <span data-part="date">{milestone.date}</span>
                  <p data-part="mtitle">{milestone.title}</p>
                  {milestone.description ? (
                    <p data-part="mdesc">{milestone.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
