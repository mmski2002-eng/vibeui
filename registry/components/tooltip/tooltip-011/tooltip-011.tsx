import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Задержка появления в секундах: сканирование сетки не устраивает мигание. */
  delay?: number
  /** Статусы узлов сетки: влияют только на цвет точки. */
  statuses?: ("ok" | "warn" | "down")[]
}

// Идея компонента: сетка статус-точек мониторинга. Пробегая курсором по
// сетке, вы не должны видеть вспышки подсказок на каждой точке — появление
// откладывается, а скрытие происходит мгновенно, стоит увести курсор дальше.
const STYLES = `
:where([data-vibeui-block="tooltip-011"]){
--vibeui-tooltip-011-bg:oklch(1 0 0);
--vibeui-tooltip-011-fg:oklch(0.25 0.014 265);
--vibeui-tooltip-011-muted:oklch(0.55 0.014 265);
--vibeui-tooltip-011-border:oklch(0.9 0.006 265);
--vibeui-tooltip-011-tip:oklch(0.22 0.014 265);
--vibeui-tooltip-011-accent:oklch(0.57 0.17 265);
--vibeui-tooltip-011-ok:oklch(0.72 0.17 152);
--vibeui-tooltip-011-warn:oklch(0.8 0.17 85);
--vibeui-tooltip-011-down:oklch(0.62 0.21 25);
--vibeui-tooltip-011-delay:0.45s;
--vibeui-tooltip-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-011"]{
display:flex;flex-direction:column;gap:0.875rem;
width:100%;max-width:22rem;box-sizing:border-box;
padding:1.25rem;border:1px solid var(--vibeui-tooltip-011-border);border-radius:1rem;
background:var(--vibeui-tooltip-011-bg);color:var(--vibeui-tooltip-011-fg);
font-family:var(--vibeui-tooltip-011-font);
}
[data-vibeui-block="tooltip-011"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(8,1fr);gap:0.5rem;
}
[data-vibeui-block="tooltip-011"] [data-part="cell"]{position:relative;display:inline-flex}
[data-vibeui-block="tooltip-011"] [data-part="dot"]{
appearance:none;cursor:pointer;padding:0;border:none;
width:1rem;height:1rem;border-radius:9999px;background:var(--vibeui-tooltip-011-status);
}
[data-vibeui-block="tooltip-011"] [data-part="dot"]:focus-visible{outline:2px solid var(--vibeui-tooltip-011-accent);outline-offset:2px}
[data-vibeui-block="tooltip-011"] [data-part="cell"][data-status="warn"]{--vibeui-tooltip-011-status:var(--vibeui-tooltip-011-warn)}
[data-vibeui-block="tooltip-011"] [data-part="cell"][data-status="down"]{--vibeui-tooltip-011-status:var(--vibeui-tooltip-011-down)}
[data-vibeui-block="tooltip-011"] [data-part="cell"]:not([data-status="warn"]):not([data-status="down"]){--vibeui-tooltip-011-status:var(--vibeui-tooltip-011-ok)}
/* Базовое правило: скрытие без задержки, opacity сразу возвращается в 0. */
[data-vibeui-block="tooltip-011"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);left:50%;z-index:20;
width:max-content;max-width:12rem;
padding:0.375rem 0.5625rem;border-radius:0.5rem;
background:var(--vibeui-tooltip-011-tip);color:oklch(0.98 0.002 265);
font-size:0.75rem;line-height:1.4;
pointer-events:none;opacity:0;
transform:translate(-50%,0.25rem);
transition:opacity .1s ease 0s,transform .1s ease 0s;
}
[data-vibeui-block="tooltip-011"] [data-part="tip"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:inherit;transform:rotate(45deg);
}
/* Задержка живёт только в открытом состоянии — appear ждёт, hide не ждёт. */
[data-vibeui-block="tooltip-011"] [data-part="cell"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-011"] [data-part="cell"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
transition-delay:var(--vibeui-tooltip-011-delay);
}
[data-vibeui-block="tooltip-011"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-tooltip-011-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-011"] *{animation:none!important;transition:none!important}}
`

const STATUS_LABEL: Record<string, string> = {
  ok: "Узел в порядке",
  warn: "Повышенная задержка",
  down: "Узел недоступен",
}

function buildStatuses(overrides?: ("ok" | "warn" | "down")[]) {
  const grid: ("ok" | "warn" | "down")[] = Array.from(
    { length: 16 },
    () => "ok",
  )

  if (overrides) {
    overrides.forEach((status, index) => {
      if (index < grid.length) {
        grid[index] = status
      }
    })
    return grid
  }

  grid[5] = "warn"
  grid[11] = "down"
  return grid
}

/**
 * Сетка статус-точек, где подсказка ждёт перед появлением, но прячется
 * мгновенно. Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip011({
  delay = 0.45,
  statuses,
  className,
  style,
  ...props
}: Tooltip011Props) {
  const grid = buildStatuses(statuses)
  const palette = {
    "--vibeui-tooltip-011-delay": `${delay}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tooltip-011"
        className={className}
        style={palette}
      >
        <div data-part="grid">
          {grid.map((status, index) => {
            const id = `vibeui-tooltip-011-${index}`

            return (
              <span data-part="cell" data-status={status} key={id}>
                <button
                  data-part="dot"
                  type="button"
                  aria-describedby={id}
                  aria-label={`Узел ${index + 1}`}
                />
                <span data-part="tip" role="tooltip" id={id}>
                  {STATUS_LABEL[status]}
                </span>
              </span>
            )
          })}
        </div>
        <p data-part="note">
          Задержка появления — <b>{delay}&nbsp;с</b>, скрытие — мгновенно.
          Проведите курсором по сетке: подсказки не мигают на каждой точке.
        </p>
      </div>
    </>
  )
}
