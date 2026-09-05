import type { ComponentProps, CSSProperties } from "react"

export type Connections003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  status?: string
  /** Ровно четыре этапа — под них рассчитана раскладка вдоль базовой линии. */
  stages?: string[]
  accent?: string
  paused?: boolean
  numbers?: boolean
}

// Идея: четыре этапа в ряд, соединённые базовой линией. Полоска прогресса
// растёт через все этапы (transform: scaleX от 0 до 1), а хвостовая точка
// едет по той же линии через offset-path с той же длительностью — оба
// синхронны, потому что оба линейны и стартуют одновременно. Каждый этап
// вспыхивает акцентом и остаётся «пройденным»: один keyframes-набор,
// сдвинутый по фазе отрицательной задержкой на четверть цикла на этап.
const STYLES = `
:where([data-vibeui-block="connections-003"]){
--vibeui-connections-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-connections-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-connections-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-connections-003-muted:color-mix(in oklab,var(--vibeui-connections-003-fg) 60%,transparent);
--vibeui-connections-003-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-connections-003-line:color-mix(in oklab,var(--vibeui-connections-003-fg) 22%,transparent);
--vibeui-connections-003-accent:light-dark(oklch(0.6 0.16 150),oklch(0.78 0.14 150));
--vibeui-connections-003-accent-fg:oklch(from var(--vibeui-connections-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-connections-003-done:color-mix(in oklab,var(--vibeui-connections-003-accent) 18%,var(--vibeui-connections-003-frame));
--vibeui-connections-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="connections-003"]{color-scheme:dark}
[data-vibeui-block="connections-003"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;margin:0;
color:var(--vibeui-connections-003-fg);font-family:var(--vibeui-connections-003-font);
}
[data-vibeui-block="connections-003"] *{box-sizing:border-box}
[data-vibeui-block="connections-003"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-connections-003-border);
background:var(--vibeui-connections-003-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="connections-003"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-connections-003-border);
}
[data-vibeui-block="connections-003"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="connections-003"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:600;color:var(--vibeui-connections-003-muted);
}
[data-vibeui-block="connections-003"] [data-part="statusdot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-connections-003-accent);
animation:vibeui-connections-003-blink 1.6s ease-in-out infinite;
}
[data-vibeui-block="connections-003"] [data-part="stage-area"]{padding:0.5rem 0.375rem 0.75rem}
[data-vibeui-block="connections-003"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="connections-003"] [data-part="edge"]{
fill:none;stroke:var(--vibeui-connections-003-line);stroke-width:1.5;
}
[data-vibeui-block="connections-003"] [data-part="progress"]{
fill:var(--vibeui-connections-003-accent);
transform-box:fill-box;transform-origin:0% 50%;transform:scaleX(0);
animation:vibeui-connections-003-progress 3.2s linear infinite;
}
[data-vibeui-block="connections-003"] [data-part="runner"]{
fill:var(--vibeui-connections-003-accent);offset-distance:0%;
offset-path:path("M44 100 L276 100");
animation:vibeui-connections-003-run 3.2s linear infinite;
}
[data-vibeui-block="connections-003"] [data-part="badge"]{
fill:var(--vibeui-connections-003-card);stroke:var(--vibeui-connections-003-border);stroke-width:1;
}
[data-vibeui-block="connections-003"] [data-part="number"]{
font-size:7px;font-weight:700;fill:var(--vibeui-connections-003-muted);
font-family:var(--vibeui-connections-003-font);text-anchor:middle;dominant-baseline:middle;
}
[data-vibeui-block="connections-003"][data-numbers="false"] [data-part="badge"],
[data-vibeui-block="connections-003"][data-numbers="false"] [data-part="number"]{display:none}
[data-vibeui-block="connections-003"] [data-part="chip"]{
fill:var(--vibeui-connections-003-frame);stroke:var(--vibeui-connections-003-border);stroke-width:1;
animation:vibeui-connections-003-stage 3.2s linear infinite;
}
[data-vibeui-block="connections-003"] [data-part="chip"][data-index="0"]{animation-delay:0s}
[data-vibeui-block="connections-003"] [data-part="chip"][data-index="1"]{animation-delay:-0.8s}
[data-vibeui-block="connections-003"] [data-part="chip"][data-index="2"]{animation-delay:-1.6s}
[data-vibeui-block="connections-003"] [data-part="chip"][data-index="3"]{animation-delay:-2.4s}
[data-vibeui-block="connections-003"] [data-part="label"]{
font-size:7.5px;font-weight:650;fill:var(--vibeui-connections-003-fg);
font-family:var(--vibeui-connections-003-font);text-anchor:middle;dominant-baseline:middle;
}
[data-vibeui-block="connections-003"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-connections-003-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes vibeui-connections-003-run{from{offset-distance:0%}to{offset-distance:100%}}
@keyframes vibeui-connections-003-stage{
0%,2%{fill:var(--vibeui-connections-003-frame);stroke:var(--vibeui-connections-003-border)}
6%,10%{fill:var(--vibeui-connections-003-accent);stroke:var(--vibeui-connections-003-accent)}
14%,100%{fill:var(--vibeui-connections-003-done);stroke:var(--vibeui-connections-003-accent)}
}
@keyframes vibeui-connections-003-blink{0%,100%{opacity:.45}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="connections-003"] [data-part="progress"]{animation:none;transform:scaleX(0)}
[data-vibeui-block="connections-003"] [data-part="runner"]{animation:none;opacity:0}
[data-vibeui-block="connections-003"] [data-part="chip"]{animation:none}
[data-vibeui-block="connections-003"] [data-part="statusdot"]{animation:none}
}
`

const DEFAULT_STAGES = ["Сборка", "Тесты", "Деплой", "Прод"]
const POSITIONS = [44, 128, 212, 276]

/**
 * Пайплайн: горизонтальная цепочка этапов с бегущим прогрессом. Один файл,
 * ноль зависимостей, собственная палитра, анимация на CSS (transform +
 * offset-path).
 */
export function Connections003({
  title = "Конвейер релиза",
  status = "Выполняется",
  stages = DEFAULT_STAGES,
  accent,
  paused = false,
  numbers = true,
  className,
  style,
  ...props
}: Connections003Props) {
  const palette = {
    ...(accent ? { "--vibeui-connections-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const items = stages.slice(0, 4)

  return (
    <>
      <style href="vibeui-connections-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="connections-003"
        data-slot="connections-003"
        data-paused={paused ? "true" : undefined}
        data-numbers={numbers ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            <span data-part="status">
              <span data-part="statusdot" aria-hidden="true" />
              {status}
            </span>
          </div>
          <div data-part="stage-area">
            <svg viewBox="0 0 320 150" role="img" aria-label={title}>
              <path data-part="edge" d="M44 100 L276 100" />
              <rect
                data-part="progress"
                x="44"
                y="98"
                width="232"
                height="4"
                rx="2"
              />
              <circle data-part="runner" cx="0" cy="0" r="5" />

              {items.map((label, index) => {
                const x = POSITIONS[index]

                return (
                  <g key={label}>
                    <circle data-part="badge" cx={x} cy={72} r="8" />
                    <text data-part="number" x={x} y={72}>
                      {index + 1}
                    </text>
                    <rect
                      data-part="chip"
                      data-index={index}
                      x={x - 32}
                      y="86"
                      width="64"
                      height="28"
                      rx="8"
                    />
                    <text data-part="label" x={x} y={100}>
                      {label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}
