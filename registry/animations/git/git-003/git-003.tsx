import type { ComponentProps, CSSProperties } from "react"

export type Git003Check = {
  label: string
}

export type Git003Props = Omit<ComponentProps<"section">, "children" | "title"> & {
  title?: string
  number?: string
  branch?: string
  base?: string
  /** Показывать строку "branch → base" под заголовком. */
  showBranch?: boolean
  checks?: Git003Check[]
  accent?: string
  /** Отключает петлю анимации: все проверки сразу зелёные, PR слит. */
  animate?: boolean
}

// Идея: карточка PR со списком CI-проверок. У каждой — иконка статуса:
// вращающийся спиннер (pending) кроссфейдится в галочку (success) в свой
// момент цикла. Когда все проверки прошли, пилюля статуса кроссфейдится из
// серого "Open" в фиолетовый "Merged". Обе кроссфейд-анимации используют
// один и тот же приём: длительность равна общей длительности цикла, а
// момент переключения задаётся animation-delay строки — при бесконечном
// повторе фаза остаётся стабильной от цикла к циклу. Цикл обрамлён общим
// fade, чтобы обрыв кадра на стыке петель был не виден.
const STYLES = `
:where([data-vibeui-block="git-003"]){
--vibeui-git-003-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-git-003-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-git-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-git-003-muted:color-mix(in oklab,var(--vibeui-git-003-fg) 58%,transparent);
--vibeui-git-003-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-git-003-pending:color-mix(in oklab,var(--vibeui-git-003-fg) 45%,transparent);
--vibeui-git-003-success:light-dark(oklch(0.6 0.15 150),oklch(0.72 0.14 150));
--vibeui-git-003-accent:light-dark(oklch(0.5 0.19 300),oklch(0.72 0.17 300));
--vibeui-git-003-accent-fg:oklch(from var(--vibeui-git-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-git-003-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
--vibeui-git-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="git-003"]{color-scheme:dark}
[data-vibeui-block="git-003"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-git-003-fg);font-family:var(--vibeui-git-003-font);
}
[data-vibeui-block="git-003"] *{box-sizing:border-box}
[data-vibeui-block="git-003"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-git-003-border);
background:var(--vibeui-git-003-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="git-003"] [data-part="head"]{
padding:0.75rem 0.875rem 0.625rem;border-bottom:1px solid var(--vibeui-git-003-border);
}
[data-vibeui-block="git-003"] [data-part="top"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="git-003"] [data-part="gtitle"]{
margin:0;font-size:0.8125rem;font-weight:650;letter-spacing:-0.01em;line-height:1.35;
}
[data-vibeui-block="git-003"] [data-part="number"]{
flex:none;font-family:var(--vibeui-git-003-mono);font-size:0.6875rem;
color:var(--vibeui-git-003-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="git-003"] [data-part="branch"]{
margin:0.3125rem 0 0;font-family:var(--vibeui-git-003-mono);font-size:0.6875rem;
color:var(--vibeui-git-003-muted);
}
[data-vibeui-block="git-003"] [data-part="checks"]{
display:flex;flex-direction:column;gap:0.5rem;margin:0;padding:0.75rem 0.875rem;list-style:none;
}
[data-vibeui-block="git-003"] [data-part="check"]{
display:flex;align-items:center;gap:0.5rem;
}
[data-vibeui-block="git-003"] [data-part="check-label"]{
font-size:0.75rem;font-weight:550;
}
[data-vibeui-block="git-003"] [data-part="icon"]{
position:relative;flex:none;display:grid;width:1rem;height:1rem;
}
[data-vibeui-block="git-003"] [data-part="icon"] > *{grid-area:1/1;width:100%;height:100%;display:block}
[data-vibeui-block="git-003"] [data-part="spinner"]{
color:var(--vibeui-git-003-pending);
animation:vibeui-git-003-icon-out 8s linear infinite;
}
[data-vibeui-block="git-003"] [data-part="spinner"] circle{
transform-origin:center;
animation:vibeui-git-003-spin 0.8s linear infinite;
}
[data-vibeui-block="git-003"] [data-part="check-mark"]{
color:var(--vibeui-git-003-success);opacity:0;transform:scale(0.5);
display:grid;
transform-box:fill-box;transform-origin:center;
animation:vibeui-git-003-icon-in 8s linear infinite;
}
[data-vibeui-block="git-003"] [data-part="check-mark"] svg{width:100%;height:100%;display:block}
[data-vibeui-block="git-003"][data-animate="false"] [data-part="spinner"]{display:none}
[data-vibeui-block="git-003"][data-animate="false"] [data-part="check-mark"]{
animation:none;opacity:1;transform:scale(1);
}
[data-vibeui-block="git-003"] [data-part="foot"]{
display:grid;padding:0.625rem 0.875rem 0.75rem;
}
[data-vibeui-block="git-003"] [data-part="status-open"],
[data-vibeui-block="git-003"] [data-part="status-merged"]{
grid-area:1/1;display:inline-flex;align-items:center;justify-content:center;
height:1.5rem;padding:0 0.75rem;border-radius:9999px;
font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="git-003"] [data-part="status-open"]{
color:var(--vibeui-git-003-muted);
background:color-mix(in oklab,var(--vibeui-git-003-fg) 8%,transparent);
animation:vibeui-git-003-status-out 8s linear infinite;
}
[data-vibeui-block="git-003"] [data-part="status-merged"]{
color:var(--vibeui-git-003-accent-fg);background:var(--vibeui-git-003-accent);
opacity:0;
animation:vibeui-git-003-status-in 8s linear infinite;
}
[data-vibeui-block="git-003"][data-animate="false"] [data-part="status-open"]{display:none}
[data-vibeui-block="git-003"][data-animate="false"] [data-part="status-merged"]{opacity:1}
@keyframes vibeui-git-003-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-git-003-icon-out{
0%,2%{opacity:1}
7%,100%{opacity:0}
}
@keyframes vibeui-git-003-icon-in{
0%,2%{opacity:0;transform:scale(0.5)}
7%,100%{opacity:1;transform:scale(1)}
}
@keyframes vibeui-git-003-status-out{
0%,2%{opacity:1}
9%,100%{opacity:0}
}
@keyframes vibeui-git-003-status-in{
0%,2%{opacity:0}
9%,100%{opacity:1}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="git-003"] [data-part="spinner"]{display:none}
[data-vibeui-block="git-003"] [data-part="spinner"] circle{animation:none}
[data-vibeui-block="git-003"] [data-part="check-mark"]{animation:none;opacity:1;transform:scale(1)}
[data-vibeui-block="git-003"] [data-part="status-open"]{display:none}
[data-vibeui-block="git-003"] [data-part="status-merged"]{animation:none;opacity:1}
}
`

const CHECK_PATH = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const DEFAULT_CHECKS: Git003Check[] = [
  { label: "Lint" },
  { label: "Type check" },
  { label: "Unit tests" },
  { label: "Build" },
]

/** Момент переключения pending → success внутри 8-секундного цикла, секунды. */
const CHECK_DELAY_STEP = 1.1
const CHECK_DELAY_START = 0.6
const STATUS_DELAY_GAP = 0.4

/**
 * Карточка pull request со списком CI-проверок, которые по очереди
 * переключаются из pending в success, а после — пилюля статуса
 * кроссфейдится в "Merged". Один файл, ноль зависимостей, своя палитра.
 */
export function Git003({
  title = "Add currency formatting to price component",
  number = "#482",
  branch = "feature/currency-format",
  base = "main",
  showBranch = true,
  checks = DEFAULT_CHECKS,
  accent,
  animate = true,
  className,
  style,
  ...props
}: Git003Props) {
  const palette = {
    ...(accent ? { "--vibeui-git-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const mergedDelay =
    CHECK_DELAY_START + (checks.length - 1) * CHECK_DELAY_STEP + STATUS_DELAY_GAP

  return (
    <>
      <style href="vibeui-git-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="git-003"
        data-slot="git-pull-request"
        data-animate={animate ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <div data-part="top">
              <p data-part="gtitle">{title}</p>
              <span data-part="number">{number}</span>
            </div>
            {showBranch ? (
              <p data-part="branch">
                {branch} → {base}
              </p>
            ) : null}
          </div>
          <ul data-part="checks">
            {checks.map((check, index) => (
              <li data-part="check" key={check.label}>
                <span data-part="icon" aria-hidden="true">
                  <svg
                    data-part="spinner"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{
                      animationDelay: `${CHECK_DELAY_START + index * CHECK_DELAY_STEP}s`,
                    }}
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="21 16"
                    />
                  </svg>
                  <span
                    data-part="check-mark"
                    style={{
                      animationDelay: `${CHECK_DELAY_START + index * CHECK_DELAY_STEP}s`,
                    }}
                  >
                    {CHECK_PATH}
                  </span>
                </span>
                <span data-part="check-label">{check.label}</span>
              </li>
            ))}
          </ul>
          <div data-part="foot">
            <span data-part="status-open">Open</span>
            <span
              data-part="status-merged"
              style={{ animationDelay: `${mergedDelay}s` }}
            >
              Merged
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
