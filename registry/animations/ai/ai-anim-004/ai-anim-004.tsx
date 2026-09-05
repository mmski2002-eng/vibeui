import type { ComponentProps, CSSProperties } from "react"

export type AiAnim004Source = {
  label: string
}

export type AiAnim004Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  status?: string
  query?: string
  /** Ровно три источника — под них рассчитаны кривые SVG. */
  sources?: AiAnim004Source[]
  accent?: string
  paused?: boolean
  labels?: boolean
}

const DEFAULT_SOURCES: AiAnim004Source[] = [
  { label: "Документация API" },
  { label: "Тикеты поддержки" },
  { label: "Гайд по продукту" },
]

// Идея: запрос слева рассылает импульс по трём кривым к ранжированным
// карточкам-источникам справа — по очереди, а не одновременно. Все четыре
// элемента (три импульса и их карточки) делят один и тот же общий цикл и
// длительность анимации: у каждого только своя фаза активности внутри
// цикла (стагер через animation-delay), поэтому импульсы «прибывают»
// строго по рангу 1 → 2 → 3, а карточка вспыхивает в момент прибытия —
// тот же приём фазового сдвига, что и в connections-001, но с
// последовательной, а не параллельной подсветкой.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="ai-anim-004"]){
--vibeui-ai-anim-004-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-ai-anim-004-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-ai-anim-004-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-ai-anim-004-muted:color-mix(in oklab,var(--vibeui-ai-anim-004-fg) 60%,transparent);
--vibeui-ai-anim-004-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-ai-anim-004-line:color-mix(in oklab,var(--vibeui-ai-anim-004-fg) 20%,transparent);
--vibeui-ai-anim-004-accent:light-dark(oklch(0.58 0.18 165),oklch(0.75 0.15 165));
--vibeui-ai-anim-004-accent-fg:oklch(from var(--vibeui-ai-anim-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-ai-anim-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-anim-004"]{color-scheme:dark}
[data-vibeui-block="ai-anim-004"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;margin:0;
color:var(--vibeui-ai-anim-004-fg);font-family:var(--vibeui-ai-anim-004-font);
}
[data-vibeui-block="ai-anim-004"] *{box-sizing:border-box}
[data-vibeui-block="ai-anim-004"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-ai-anim-004-border);
background:var(--vibeui-ai-anim-004-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="ai-anim-004"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-ai-anim-004-border);
}
[data-vibeui-block="ai-anim-004"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="ai-anim-004"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:600;color:var(--vibeui-ai-anim-004-muted);
}
[data-vibeui-block="ai-anim-004"] [data-part="statusdot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-ai-anim-004-accent);
animation:vibeui-ai-anim-004-blink 1.6s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-004"] [data-part="stage"]{padding:0.5rem 0.375rem 0.75rem}
[data-vibeui-block="ai-anim-004"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="ai-anim-004"] [data-part="edge"]{
fill:none;stroke:var(--vibeui-ai-anim-004-line);stroke-width:1.5;
}
[data-vibeui-block="ai-anim-004"] [data-part="query"]{
fill:var(--vibeui-ai-anim-004-accent);stroke:var(--vibeui-ai-anim-004-accent);stroke-width:1;
}
[data-vibeui-block="ai-anim-004"] [data-part="querylabel"]{
font-size:8px;font-weight:650;fill:var(--vibeui-ai-anim-004-accent-fg);
font-family:var(--vibeui-ai-anim-004-font);text-anchor:middle;dominant-baseline:middle;
}
[data-vibeui-block="ai-anim-004"] [data-part="node"]{
fill:var(--vibeui-ai-anim-004-frame);stroke:var(--vibeui-ai-anim-004-border);stroke-width:1;
transform-box:fill-box;transform-origin:center;
animation:vibeui-ai-anim-004-hit 3s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-004"] [data-part="node"][data-index="0"]{animation-delay:0s}
[data-vibeui-block="ai-anim-004"] [data-part="node"][data-index="1"]{animation-delay:1s}
[data-vibeui-block="ai-anim-004"] [data-part="node"][data-index="2"]{animation-delay:2s}
[data-vibeui-block="ai-anim-004"] [data-part="rank"]{
fill:var(--vibeui-ai-anim-004-card);stroke:var(--vibeui-ai-anim-004-border);stroke-width:1;
}
[data-vibeui-block="ai-anim-004"] [data-part="ranklabel"]{
font-size:7px;font-weight:750;fill:var(--vibeui-ai-anim-004-muted);
font-family:var(--vibeui-ai-anim-004-font);text-anchor:middle;dominant-baseline:middle;
}
[data-vibeui-block="ai-anim-004"] [data-part="label"]{
font-size:8px;font-weight:650;fill:var(--vibeui-ai-anim-004-fg);
font-family:var(--vibeui-ai-anim-004-font);text-anchor:middle;dominant-baseline:middle;
}
[data-vibeui-block="ai-anim-004"][data-labels="false"] [data-part="label"],
[data-vibeui-block="ai-anim-004"][data-labels="false"] [data-part="querylabel"]{display:none}
[data-vibeui-block="ai-anim-004"] [data-part="packet"]{
offset-distance:0%;fill:var(--vibeui-ai-anim-004-accent);opacity:0;
animation:vibeui-ai-anim-004-run 3s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-004"] [data-part="packet"][data-index="0"]{offset-path:path("M84 100 Q160 100 236 44");animation-delay:0s}
[data-vibeui-block="ai-anim-004"] [data-part="packet"][data-index="1"]{offset-path:path("M84 100 L236 100");animation-delay:1s}
[data-vibeui-block="ai-anim-004"] [data-part="packet"][data-index="2"]{offset-path:path("M84 100 Q160 100 236 156");animation-delay:2s}
[data-vibeui-block="ai-anim-004"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-ai-anim-004-run{
0%{offset-distance:0%;opacity:0}
3%{opacity:1}
30%{offset-distance:100%;opacity:1}
36%{opacity:0}
100%{opacity:0}
}
@keyframes vibeui-ai-anim-004-hit{
0%{fill:var(--vibeui-ai-anim-004-frame);stroke:var(--vibeui-ai-anim-004-border);transform:scale(1)}
30%{fill:var(--vibeui-ai-anim-004-frame);stroke:var(--vibeui-ai-anim-004-border);transform:scale(1)}
34%{fill:color-mix(in oklab,var(--vibeui-ai-anim-004-accent) 22%,var(--vibeui-ai-anim-004-frame));stroke:var(--vibeui-ai-anim-004-accent);transform:scale(1.05)}
48%{fill:color-mix(in oklab,var(--vibeui-ai-anim-004-accent) 10%,var(--vibeui-ai-anim-004-frame));stroke:var(--vibeui-ai-anim-004-border);transform:scale(1)}
100%{fill:var(--vibeui-ai-anim-004-frame);stroke:var(--vibeui-ai-anim-004-border);transform:scale(1)}
}
@keyframes vibeui-ai-anim-004-blink{0%,100%{opacity:0.45}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="ai-anim-004"] [data-part="packet"]{animation:none;opacity:0}
[data-vibeui-block="ai-anim-004"] [data-part="node"]{animation:none}
[data-vibeui-block="ai-anim-004"] [data-part="statusdot"]{animation:none}
}
`

/**
 * Схождение импульса от запроса к ранжированным источникам: три импульса
 * бегут по кривым по очереди, а карточка-источник вспыхивает в момент
 * прибытия своего импульса. Один файл, ноль зависимостей, собственная
 * палитра, вся анимация на CSS (offset-path).
 */
export function AiAnim004({
  title = "Поиск источников",
  status = "Ранжирование",
  query = "Запрос",
  sources = DEFAULT_SOURCES,
  accent,
  paused = false,
  labels = true,
  className,
  style,
  ...props
}: AiAnim004Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-anim-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const items = sources.slice(0, 3)
  const ys = [44, 100, 156]

  return (
    <>
      <style href="vibeui-ai-anim-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="ai-anim-004"
        data-slot="ai-retrieval"
        data-paused={paused ? "true" : undefined}
        data-labels={labels ? undefined : "false"}
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
          <div data-part="stage">
            <svg viewBox="0 0 320 200" role="img" aria-label={title}>
              <path data-part="edge" d="M84 100 Q160 100 236 44" />
              <path data-part="edge" d="M84 100 L236 100" />
              <path data-part="edge" d="M84 100 Q160 100 236 156" />

              <circle data-part="packet" data-index="0" r="4" />
              <circle data-part="packet" data-index="1" r="4" />
              <circle data-part="packet" data-index="2" r="4" />

              <g>
                <circle data-part="query" cx="52" cy="100" r="30" />
                <text data-part="querylabel" x="52" y="100">
                  {query}
                </text>
              </g>

              {items.map((source, index) => {
                const y = ys[index]

                return (
                  <g key={source.label}>
                    <rect
                      data-part="node"
                      data-index={index}
                      x="236"
                      y={y - 12}
                      width="76"
                      height="24"
                      rx="8"
                    />
                    <circle data-part="rank" cx="248" cy={y} r="7" />
                    <text data-part="ranklabel" x="248" y={y + 0.5}>
                      {index + 1}
                    </text>
                    <text data-part="label" x="284" y={y}>
                      {source.label}
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
