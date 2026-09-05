import type { ComponentProps, CSSProperties } from "react"

export type Git001Props = Omit<ComponentProps<"section">, "children" | "title"> & {
  title?: string
  badge?: string
  mainLabel?: string
  branchLabel?: string
  accent?: string
  /** Отключает петлю анимации: граф сразу в конечном, полностью нарисованном состоянии. */
  animate?: boolean
  /** false — ветка ещё открыта: линия обрывается, коммит слияния не рисуется. */
  merged?: boolean
}

// Идея: коммит-рейл main рисуется сверху вниз, от него в точке форка
// отделяется кривая ветки — на ней несколько своих коммитов, — и через
// вторую кривую сливается обратно в main. Обе линии — один SVG path с
// pathLength="1", поэтому stroke-dashoffset рисует их без знания реальной
// длины кривой. Коммиты всплывают по очереди вслед за отрисовкой линии,
// весь цикл зациклен и обрамлён общим fade — на стыке петель обрыв дуги не
// заметен глазу.
const STYLES = `
:where([data-vibeui-block="git-001"]){
--vibeui-git-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-git-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-git-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-git-001-muted:color-mix(in oklab,var(--vibeui-git-001-fg) 60%,transparent);
--vibeui-git-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-git-001-main:light-dark(oklch(0.55 0 0),oklch(0.75 0 0));
--vibeui-git-001-accent:light-dark(oklch(0.58 0.19 155),oklch(0.75 0.16 155));
--vibeui-git-001-accent-fg:oklch(from var(--vibeui-git-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-git-001-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
--vibeui-git-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="git-001"]{color-scheme:dark}
[data-vibeui-block="git-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-git-001-fg);font-family:var(--vibeui-git-001-font);
}
[data-vibeui-block="git-001"] *{box-sizing:border-box}
[data-vibeui-block="git-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-git-001-border);
background:var(--vibeui-git-001-card);overflow:hidden;
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="git-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-git-001-border);
}
[data-vibeui-block="git-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="git-001"] [data-part="badge"]{
display:inline-flex;align-items:center;height:1.125rem;padding:0 0.5rem;
border-radius:9999px;font-size:0.625rem;font-weight:650;
color:var(--vibeui-git-001-muted);
background:color-mix(in oklab,var(--vibeui-git-001-fg) 8%,transparent);
}
[data-vibeui-block="git-001"][data-merged="true"] [data-part="badge"]{
color:var(--vibeui-git-001-accent-fg);
background:var(--vibeui-git-001-accent);
}
[data-vibeui-block="git-001"] [data-part="stage"]{
padding:0.875rem 0.5rem 1rem;
}
[data-vibeui-block="git-001"] [data-part="stage"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="git-001"] [data-part="graph"]{
animation:vibeui-git-001-cycle 6s ease-in-out infinite;
}
[data-vibeui-block="git-001"][data-animate="false"] [data-part="graph"]{animation:none;opacity:1}
[data-vibeui-block="git-001"] [data-part="label"]{
font-family:var(--vibeui-git-001-mono);font-size:6.5px;
fill:var(--vibeui-git-001-muted);letter-spacing:0.02em;
}
[data-vibeui-block="git-001"] [data-part="label"][data-line="branch"]{fill:var(--vibeui-git-001-accent)}
[data-vibeui-block="git-001"] [data-part="main-line"]{
fill:none;stroke:var(--vibeui-git-001-main);stroke-width:2;stroke-linecap:round;
stroke-dasharray:1;stroke-dashoffset:1;
animation:vibeui-git-001-main-draw 6s linear infinite;
}
[data-vibeui-block="git-001"] [data-part="branch-line"]{
fill:none;stroke:var(--vibeui-git-001-accent);stroke-width:2;stroke-linecap:round;
stroke-dasharray:1;stroke-dashoffset:1;
animation:vibeui-git-001-branch-draw 6s linear infinite;
}
[data-vibeui-block="git-001"][data-animate="false"] [data-part="main-line"],
[data-vibeui-block="git-001"][data-animate="false"] [data-part="branch-line"]{
animation:none;stroke-dashoffset:0;
}
[data-vibeui-block="git-001"] [data-part="dot"]{
opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(0.4);
animation:vibeui-git-001-pop 6s linear infinite;
}
[data-vibeui-block="git-001"][data-animate="false"] [data-part="dot"]{
animation:none;opacity:1;transform:scale(1);
}
[data-vibeui-block="git-001"] [data-part="dot"][data-line="main"]{fill:var(--vibeui-git-001-card);stroke:var(--vibeui-git-001-main);stroke-width:2}
[data-vibeui-block="git-001"] [data-part="dot"][data-line="branch"]{fill:var(--vibeui-git-001-card);stroke:var(--vibeui-git-001-accent);stroke-width:2}
[data-vibeui-block="git-001"] [data-part="dot"][data-role="merge"]{fill:var(--vibeui-git-001-accent);stroke:var(--vibeui-git-001-accent)}
@keyframes vibeui-git-001-cycle{
0%{opacity:0}
3%{opacity:1}
88%{opacity:1}
96%,100%{opacity:0}
}
@keyframes vibeui-git-001-main-draw{
0%{stroke-dashoffset:1}
58%,100%{stroke-dashoffset:0}
}
@keyframes vibeui-git-001-branch-draw{
0%,18%{stroke-dashoffset:1}
58%,100%{stroke-dashoffset:0}
}
@keyframes vibeui-git-001-pop{
0%{opacity:0;transform:scale(0.4)}
6%{opacity:1;transform:scale(1)}
100%{opacity:1;transform:scale(1)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="git-001"] [data-part="graph"]{animation:none;opacity:1}
[data-vibeui-block="git-001"] [data-part="main-line"],
[data-vibeui-block="git-001"] [data-part="branch-line"]{animation:none;stroke-dashoffset:0}
[data-vibeui-block="git-001"] [data-part="dot"]{animation:none;opacity:1;transform:scale(1)}
}
`

/** Момент всплытия точки внутри 6-секундного цикла, секунды. */
const REVEAL = {
  initial: 0.05,
  fork: 1.05,
  branchFirst: 1.5,
  branchMid: 2.05,
  branchLast: 2.6,
  merge: 3.35,
  final: 3.5,
} as const

/**
 * Граф веток: main-рейл сверху вниз, кривая ветки отделяется и сливается
 * обратно. Один файл, ноль зависимостей, собственная палитра. Анимация —
 * зацикленная отрисовка линий на чистом CSS.
 */
export function Git001({
  title = "История коммитов",
  badge,
  mainLabel = "main",
  branchLabel = "feature/onboarding",
  accent,
  animate = true,
  merged = true,
  className,
  style,
  ...props
}: Git001Props) {
  const palette = {
    ...(accent ? { "--vibeui-git-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const branchPath = merged
    ? "M36 96 C 36 122 140 118 140 144 L 140 192 C 140 218 36 214 36 240"
    : "M36 96 C 36 122 140 118 140 144 L 140 192 L 140 206"

  const resolvedBadge = badge ?? (merged ? "Merged" : "В работе")

  return (
    <>
      <style href="vibeui-git-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="git-001"
        data-slot="git-branch-graph"
        data-merged={merged ? "true" : undefined}
        data-animate={animate ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="gtitle">{title}</p>
            <span data-part="badge">{resolvedBadge}</span>
          </div>
          <div data-part="stage">
            <svg
              data-part="graph"
              viewBox="0 0 200 300"
              role="img"
              aria-label={`${mainLabel} ${merged ? "слился с" : "и"} ${branchLabel}`}
            >
              <text data-part="label" data-line="main" x="10" y="14">
                {mainLabel}
              </text>
              <text data-part="label" data-line="branch" x="146" y="130">
                {branchLabel}
              </text>

              <path data-part="main-line" pathLength={1} d="M36 22 V 278" />
              <path data-part="branch-line" pathLength={1} d={branchPath} />

              <circle
                data-part="dot"
                data-line="main"
                cx="36"
                cy="22"
                r="4.5"
                style={{ animationDelay: `${REVEAL.initial}s` }}
              />
              <circle
                data-part="dot"
                data-line="main"
                cx="36"
                cy="96"
                r="4.5"
                style={{ animationDelay: `${REVEAL.fork}s` }}
              />
              <circle
                data-part="dot"
                data-line="branch"
                cx="140"
                cy="144"
                r="4"
                style={{ animationDelay: `${REVEAL.branchFirst}s` }}
              />
              <circle
                data-part="dot"
                data-line="branch"
                cx="140"
                cy="168"
                r="4"
                style={{ animationDelay: `${REVEAL.branchMid}s` }}
              />
              <circle
                data-part="dot"
                data-line="branch"
                cx="140"
                cy="192"
                r="4"
                style={{ animationDelay: `${REVEAL.branchLast}s` }}
              />
              {merged ? (
                <circle
                  data-part="dot"
                  data-line="main"
                  data-role="merge"
                  cx="36"
                  cy="240"
                  r="5"
                  style={{ animationDelay: `${REVEAL.merge}s` }}
                />
              ) : null}
              <circle
                data-part="dot"
                data-line="main"
                cx="36"
                cy="278"
                r="4.5"
                style={{ animationDelay: `${REVEAL.final}s` }}
              />
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}
