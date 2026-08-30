import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card006Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "title"
> & {
  title?: string
  status?: "todo" | "doing" | "review" | "done"
  done?: number
  total?: number
  due?: string
  assignee?: string
  accent?: string
}

// Идея компонента: карточка задачи с прогрессом подзадач. Прогресс подписан
// числами «7 из 12», а не только полосой: по длине полосы никто не назовёт,
// сколько осталось. Срок краснеет только когда он прошёл — заранее пугать
// цветом бессмысленно, дата и так видна.
const STYLES = `
:where([data-vibeui-block="card-006"]){
--vibeui-card-006-bg:oklch(1 0 0);
--vibeui-card-006-fg:oklch(0.22 0.014 265);
--vibeui-card-006-muted:oklch(0.56 0.014 265);
--vibeui-card-006-border:oklch(0.91 0.006 265);
--vibeui-card-006-track:oklch(0.93 0.005 265);
--vibeui-card-006-accent:oklch(0.55 0.17 265);
--vibeui-card-006-late:oklch(0.56 0.19 25);
--vibeui-card-006-status:oklch(0.6 0.014 265);
--vibeui-card-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="card-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:18rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-card-006-bg);
border:1px solid var(--vibeui-card-006-border);border-radius:0.875rem;
color:var(--vibeui-card-006-fg);font-family:var(--vibeui-card-006-font);
}
[data-vibeui-block="card-006"][data-status="doing"]{--vibeui-card-006-status:oklch(0.6 0.16 265)}
[data-vibeui-block="card-006"][data-status="review"]{--vibeui-card-006-status:oklch(0.68 0.16 75)}
[data-vibeui-block="card-006"][data-status="done"]{--vibeui-card-006-status:oklch(0.58 0.15 152)}
[data-vibeui-block="card-006"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;align-self:flex-start;
height:1.375rem;padding:0 0.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-card-006-status) 12%,oklch(1 0 0));
color:color-mix(in oklab,var(--vibeui-card-006-status) 80%,oklch(0.2 0.02 265));
font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="card-006"] [data-part="dot"]{width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-card-006-status)}
[data-vibeui-block="card-006"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="card-006"] [data-part="progress"]{display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="card-006"] [data-part="numbers"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-card-006-muted);
}
[data-vibeui-block="card-006"] [data-part="percent"]{color:var(--vibeui-card-006-fg);font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="card-006"] [data-part="track"]{
height:0.375rem;border-radius:9999px;background:var(--vibeui-card-006-track);overflow:hidden;
}
[data-vibeui-block="card-006"] [data-part="fill"]{
height:100%;border-radius:inherit;background:var(--vibeui-card-006-accent);
}
[data-vibeui-block="card-006"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-card-006-muted);
}
/* Срок краснеет только после того, как прошёл: заранее цвет ничего не даёт. */
[data-vibeui-block="card-006"] [data-part="due"][data-late="true"]{color:var(--vibeui-card-006-late);font-weight:650}
[data-vibeui-block="card-006"] [data-part="assignee"]{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="card-006"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.375rem;height:1.375rem;border-radius:9999px;
background:oklch(0.92 0.05 var(--vibeui-card-006-hue,250));
color:oklch(0.38 0.09 var(--vibeui-card-006-hue,250));
font-size:0.625rem;font-weight:700;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-006"] *{animation:none!important;transition:none!important}}
`

const STATUS_TEXT = {
  todo: "В очереди",
  doing: "В работе",
  review: "На проверке",
  done: "Готово",
}

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

/**
 * Карточка задачи: статус, прогресс подзадач числами и срок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card006({
  title = "Собрать каталог компонентов",
  status = "doing",
  done = 7,
  total = 12,
  due = "до 20 марта",
  assignee = "Марк Ильин",
  accent,
  className,
  style,
  ...props
}: Card006Props) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0

  const palette = {
    "--vibeui-card-006-hue": hue(assignee),
    ...(accent ? { "--vibeui-card-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-006" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-vibeui-block="card-006"
        data-status={status}
        className={className}
        style={palette}
      >
        <span data-part="status">
          <span data-part="dot" aria-hidden="true" />
          {STATUS_TEXT[status]}
        </span>
        <h3 data-part="title">{title}</h3>
        <div data-part="progress">
          <p data-part="numbers">
            <span>
              Подзадачи: {done} из {total}
            </span>
            <span data-part="percent">{percent}%</span>
          </p>
          <div
            data-part="track"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Готово ${done} из ${total} подзадач`}
          >
            <div data-part="fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <p data-part="foot">
          <span data-part="assignee">
            <span data-part="face" aria-hidden="true">
              {initials(assignee)}
            </span>
            {assignee}
          </span>
          <span
            data-part="due"
            data-late={status !== "done" && due.includes("вчера")}
          >
            {due}
          </span>
        </p>
      </article>
    </>
  )
}
