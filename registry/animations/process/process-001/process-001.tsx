import type { ComponentProps, CSSProperties } from "react"

export type Process001Step = {
  title: string
  description?: string
}

export type Process001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  description?: string
  steps?: Process001Step[]
  accent?: string
  /** Секунд на полный круг: сколько занимает обход всей цепочки шагов. */
  duration?: number
}

// Идея: полноширинная секция процесса — ряд пронумерованных шагов,
// соединённых линией. Линия прогресса заполняется слева направо одним
// keyframe на весь цикл, а рядом с ней каждый номер шага подсвечивается по
// очереди: у каждого узла тот же keyframe, что и у соседей, но со своей
// положительной задержкой `duration * (index / count)` — поэтому подсветка
// идёт строго по порядку шагов и синхронна с бегущей линией, хотя всё это
// один непрерывный бесконечный цикл, а не серия отдельных срабатываний.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит секцию в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
//
// container-type делает секцию собственным query-контейнером: плотность
// раскладки шагов считается от её ширины, а не от ширины окна.
const STYLES = `
:where([data-vibeui-block="process-001"]){
--vibeui-process-001-duration:8s;
--vibeui-process-001-bg:transparent;
--vibeui-process-001-fg:light-dark(oklch(0.2 0 266),oklch(0.97 0 266));
--vibeui-process-001-muted:light-dark(oklch(0.5 0 266),oklch(0.72 0 266));
--vibeui-process-001-border:light-dark(oklch(0.16 0 266 / 16%),oklch(1 0 0 / 18%));
--vibeui-process-001-card:light-dark(oklch(1 0 0),oklch(0.22 0 266));
--vibeui-process-001-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.163 264));
--vibeui-process-001-accent-fg:light-dark(oklch(0.99 0 266),oklch(0.17 0 266));
--vibeui-process-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="process-001"]{color-scheme:dark}
[data-vibeui-block="process-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);
background:var(--vibeui-process-001-bg);color:var(--vibeui-process-001-fg);
font-family:var(--vibeui-process-001-font);
container-type:inline-size;
}
[data-vibeui-block="process-001"] *{box-sizing:border-box}
[data-vibeui-block="process-001"] [data-part="frame"]{
padding:clamp(2.5rem,10cqi,5rem) clamp(1.25rem,6cqi,2.5rem);
}
[data-vibeui-block="process-001"] [data-part="head"]{
max-width:34rem;margin:0 auto;text-align:center;
}
[data-vibeui-block="process-001"] [data-part="title"]{
margin:0;font-size:clamp(1.75rem,5.5cqi,2.625rem);line-height:1.15;
font-weight:650;letter-spacing:-0.015em;text-wrap:balance;
}
[data-vibeui-block="process-001"] [data-part="desc"]{
margin:0.75rem 0 0;font-size:clamp(0.9375rem,2cqi,1.0625rem);
line-height:1.6;color:var(--vibeui-process-001-muted);text-wrap:pretty;
}
[data-vibeui-block="process-001"] [data-part="steps"]{
position:relative;max-width:56rem;margin:3rem auto 0;
}
[data-vibeui-block="process-001"] [data-part="list"]{
position:relative;display:flex;justify-content:space-between;gap:0.75rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="process-001"] [data-part="track"],
[data-vibeui-block="process-001"] [data-part="fill"]{
position:absolute;top:1.25rem;left:1.25rem;right:1.25rem;height:2px;z-index:0;
}
[data-vibeui-block="process-001"] [data-part="track"]{background:var(--vibeui-process-001-border)}
[data-vibeui-block="process-001"] [data-part="fill"]{
background:var(--vibeui-process-001-accent);transform:scaleX(0);transform-origin:left center;
animation:vibeui-process-001-fill var(--vibeui-process-001-duration) linear infinite;
}
[data-vibeui-block="process-001"] [data-part="step"]{
position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;
flex:1;min-width:0;text-align:center;gap:0.75rem;
}
[data-vibeui-block="process-001"] [data-part="node"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2.5rem;height:2.5rem;border-radius:9999px;
border:2px solid var(--vibeui-process-001-border);background:var(--vibeui-process-001-card);
color:var(--vibeui-process-001-muted);font-size:1rem;font-weight:700;
animation:vibeui-process-001-node var(--vibeui-process-001-duration) ease-in-out infinite;
}
[data-vibeui-block="process-001"] [data-part="label"]{
margin:0;font-size:0.9375rem;font-weight:600;
}
[data-vibeui-block="process-001"] [data-part="step-desc"]{
display:none;margin:0;font-size:0.8125rem;line-height:1.5;
color:var(--vibeui-process-001-muted);max-width:12rem;
}
@container (min-width:36rem){
[data-vibeui-block="process-001"] [data-part="step-desc"]{display:block}
}
@keyframes vibeui-process-001-fill{
0%{transform:scaleX(0);opacity:1}
80%{transform:scaleX(1);opacity:1}
92%,100%{transform:scaleX(1);opacity:0}
}
@keyframes vibeui-process-001-node{
0%,4%{background:var(--vibeui-process-001-card);border-color:var(--vibeui-process-001-border);color:var(--vibeui-process-001-muted);transform:scale(1)}
8%{background:var(--vibeui-process-001-accent);border-color:var(--vibeui-process-001-accent);color:var(--vibeui-process-001-accent-fg);transform:scale(1.14)}
10%,90%{background:var(--vibeui-process-001-accent);border-color:var(--vibeui-process-001-accent);color:var(--vibeui-process-001-accent-fg);transform:scale(1)}
96%,100%{background:var(--vibeui-process-001-card);border-color:var(--vibeui-process-001-border);color:var(--vibeui-process-001-muted);transform:scale(1)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="process-001"] [data-part="fill"]{animation:none;transform:scaleX(1);opacity:0.6}
[data-vibeui-block="process-001"] [data-part="node"]{animation:none}
}
`

const DEFAULT_STEPS: Process001Step[] = [
  {
    title: "Заявка",
    description: "Команда фиксирует задачу и контекст в одном месте.",
  },
  {
    title: "Диагностика",
    description: "Разбираем причину и оцениваем варианты решения.",
  },
  {
    title: "Внедрение",
    description: "Вносим изменения и проверяем их на реальных данных.",
  },
  {
    title: "Поддержка",
    description: "Следим за результатом и остаёмся на связи.",
  },
]

/**
 * Секция пошагового процесса: пронумерованные узлы соединены линией, которая
 * непрерывно заполняется слева направо, подсвечивая текущий шаг по очереди.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Process001({
  title = "Как мы работаем",
  description = "Прозрачный процесс от заявки до поддержки — без сюрпризов на каждом шаге.",
  steps = DEFAULT_STEPS,
  accent,
  duration = 8,
  className,
  style,
  ...props
}: Process001Props) {
  const palette = {
    ...(accent ? { "--vibeui-process-001-accent": accent } : null),
    "--vibeui-process-001-duration": `${duration}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-process-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="process-001"
        data-slot="process"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="head">
            <h2 data-part="title">{title}</h2>
            {description ? <p data-part="desc">{description}</p> : null}
          </div>
          <div data-part="steps">
            <span data-part="track" aria-hidden="true" />
            <span data-part="fill" aria-hidden="true" />
            <ol data-part="list">
              {steps.map((step, index) => {
                const delay = `calc(var(--vibeui-process-001-duration) * ${(
                  index / steps.length
                ).toFixed(4)})`

                return (
                  <li data-part="step" key={step.title}>
                    <span
                      data-part="node"
                      aria-hidden="true"
                      style={{ animationDelay: delay }}
                    >
                      {index + 1}
                    </span>
                    <p data-part="label">{step.title}</p>
                    {step.description ? (
                      <p data-part="step-desc">{step.description}</p>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
