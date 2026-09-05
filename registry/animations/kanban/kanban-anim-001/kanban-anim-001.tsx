import type { ComponentProps, CSSProperties } from "react"

export type KanbanAnim001Card = {
  title: string
  tag?: string
  /** Эта карточка визуально «перетаскивается» в следующую колонку. */
  drag?: boolean
}

export type KanbanAnim001Column = {
  title: string
  cards: KanbanAnim001Card[]
}

export type KanbanAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  columns?: KanbanAnim001Column[]
  accent?: string
  /** Секунд на полный круг: появление карточек и один перенос между колонками. */
  duration?: number
}

// Идея: канбан-доска из трёх колонок. Карточки в каждой колонке появляются
// вразнобой (тот же трюк со сдвинутым animation-delay по позиции, что и в
// checklist-001), а одна помеченная карточка (drag: true) едет в соседнюю
// колонку и обратно через отдельный @keyframes на translate/scale/rotate —
// это иллюстрация перетаскивания, а не настоящий drag-n-drop: JS не
// участвует, сдвиг посчитан в процентах от собственной ширины карточки
// (100% + отступ колонок), поэтому работает при любой ширине доски.
const STYLES = `
:where([data-vibeui-block="kanban-anim-001"]){
--vibeui-kanban-anim-001-duration:10s;
--vibeui-kanban-anim-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-kanban-anim-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-kanban-anim-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-kanban-anim-001-muted:color-mix(in oklab,var(--vibeui-kanban-anim-001-fg) 56%,transparent);
--vibeui-kanban-anim-001-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-kanban-anim-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-kanban-anim-001-shadow-rest:0 1px 2px oklch(0 0 0 / 0.06);
--vibeui-kanban-anim-001-shadow-lift:0 16px 28px -12px oklch(0 0 0 / 0.35),0 2px 4px oklch(0 0 0 / 0.1);
--vibeui-kanban-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="kanban-anim-001"]{color-scheme:dark}
[data-vibeui-block="kanban-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:26rem;margin:0;
color:var(--vibeui-kanban-anim-001-fg);font-family:var(--vibeui-kanban-anim-001-font);
}
[data-vibeui-block="kanban-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="kanban-anim-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
margin:0 0 0.5rem;padding:0 0.125rem;
}
[data-vibeui-block="kanban-anim-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="kanban-anim-001"] [data-part="board"]{
display:flex;align-items:flex-start;gap:0.75rem;
}
[data-vibeui-block="kanban-anim-001"] [data-part="column"]{
flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:0.5rem;
border-radius:0.875rem;border:1px solid var(--vibeui-kanban-anim-001-border);
background:var(--vibeui-kanban-anim-001-frame);padding:0.5rem;
}
[data-vibeui-block="kanban-anim-001"] [data-part="col-head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.375rem;
padding:0 0.1875rem;
}
[data-vibeui-block="kanban-anim-001"] [data-part="col-title"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.625rem;font-weight:650;color:var(--vibeui-kanban-anim-001-muted);
text-transform:uppercase;letter-spacing:0.03em;
}
[data-vibeui-block="kanban-anim-001"] [data-part="col-count"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
min-width:1.0625rem;height:1.0625rem;padding:0 0.25rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-kanban-anim-001-muted);
background:color-mix(in oklab,var(--vibeui-kanban-anim-001-fg) 8%,transparent);
}
[data-vibeui-block="kanban-anim-001"] [data-part="cards"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="kanban-anim-001"] [data-part="card"]{
display:flex;align-items:center;gap:0.4375rem;min-width:0;
border-radius:0.625rem;border:1px solid var(--vibeui-kanban-anim-001-border);
background:var(--vibeui-kanban-anim-001-card);padding:0.4375rem 0.5625rem;
box-shadow:var(--vibeui-kanban-anim-001-shadow-rest);
animation:vibeui-kanban-anim-001-appear var(--vibeui-kanban-anim-001-duration) ease-in-out infinite;
}
[data-vibeui-block="kanban-anim-001"] [data-part="grip"]{
flex:none;width:0.625rem;height:0.625rem;color:var(--vibeui-kanban-anim-001-muted);
}
[data-vibeui-block="kanban-anim-001"] [data-part="card-title"]{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;font-weight:600;
}
[data-vibeui-block="kanban-anim-001"] [data-part="card-tag"]{
flex:none;font-size:0.5625rem;font-weight:600;padding:0.0625rem 0.375rem;border-radius:9999px;
color:var(--vibeui-kanban-anim-001-muted);
background:color-mix(in oklab,var(--vibeui-kanban-anim-001-fg) 7%,transparent);
}
[data-vibeui-block="kanban-anim-001"] [data-part="card"][data-drag="true"]{
position:relative;z-index:5;animation-name:vibeui-kanban-anim-001-drag;
border-color:color-mix(in oklab,var(--vibeui-kanban-anim-001-accent) 45%,var(--vibeui-kanban-anim-001-border));
}
@keyframes vibeui-kanban-anim-001-appear{
0%,4%{opacity:0;translate:0 0.4rem}
14%,90%{opacity:1;translate:0 0}
100%{opacity:0;translate:0 0.4rem}
}
@keyframes vibeui-kanban-anim-001-drag{
0%,20%{transform:translate(0,0) scale(1) rotate(0deg);box-shadow:var(--vibeui-kanban-anim-001-shadow-rest)}
30%{transform:translate(0,-0.5rem) scale(1.07) rotate(-2deg);box-shadow:var(--vibeui-kanban-anim-001-shadow-lift)}
48%{transform:translate(calc(100% + 0.75rem),-0.3125rem) scale(1.07) rotate(2deg);box-shadow:var(--vibeui-kanban-anim-001-shadow-lift)}
58%,86%{transform:translate(calc(100% + 0.75rem),0) scale(1) rotate(0deg);box-shadow:var(--vibeui-kanban-anim-001-shadow-rest)}
96%,100%{transform:translate(0,0) scale(1) rotate(0deg);box-shadow:var(--vibeui-kanban-anim-001-shadow-rest)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="kanban-anim-001"] [data-part="card"]{animation:none;opacity:1;translate:0 0}
[data-vibeui-block="kanban-anim-001"] [data-part="card"][data-drag="true"]{transform:none}
}
`

function GripIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      data-part="grip"
    >
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  )
}

const DEFAULT_COLUMNS: KanbanAnim001Column[] = [
  {
    title: "К выполнению",
    cards: [
      { title: "Обновить лендинг", tag: "UI" },
      { title: "Настроить оплату", tag: "Backend", drag: true },
      { title: "Написать тесты", tag: "QA" },
    ],
  },
  {
    title: "В работе",
    cards: [
      { title: "Дизайн профиля", tag: "UI" },
      { title: "API уведомлений", tag: "Backend" },
    ],
  },
  {
    title: "Готово",
    cards: [
      { title: "Аудит доступности", tag: "QA" },
      { title: "Обновить зависимости", tag: "DevOps" },
    ],
  },
]

/**
 * Канбан-доска с тремя колонками, где карточки стаггер-появляются, а одна
 * помеченная карточка визуально едет в соседнюю колонку и обратно. Один
 * файл, ноль зависимостей, собственная палитра, JS не участвует.
 */
export function KanbanAnim001({
  title = "Спринт 24",
  columns = DEFAULT_COLUMNS,
  accent,
  duration = 10,
  className,
  style,
  ...props
}: KanbanAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-kanban-anim-001-accent": accent } : null),
    "--vibeui-kanban-anim-001-duration": `${duration}s`,
    ...style,
  } as CSSProperties

  const total = columns.reduce((sum, column) => sum + column.cards.length, 0)
  // Сквозной номер карточки нужен для лесенки задержек. Считаем смещение
  // колонки заранее: менять счётчик по ходу разметки нельзя — рендер должен
  // оставаться чистым.
  const offsets = columns.map((column, index) =>
    columns
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.cards.length, 0),
  )

  return (
    <>
      <style href="vibeui-kanban-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="kanban-anim-001"
        data-slot="kanban-board"
        className={className}
        style={palette}
      >
        {title ? (
          <div data-part="head">
            <p data-part="gtitle">{title}</p>
          </div>
        ) : null}
        <div data-part="board">
          {columns.map((column, columnIndex) => (
            <div data-part="column" key={column.title}>
              <div data-part="col-head">
                <span data-part="col-title">{column.title}</span>
                <span data-part="col-count">{column.cards.length}</span>
              </div>
              <div data-part="cards">
                {column.cards.map((card, cardIndex) => {
                  const index = offsets[columnIndex] + cardIndex
                  const delay = card.drag
                    ? undefined
                    : `calc(var(--vibeui-kanban-anim-001-duration) * ${(-(
                        index / total
                      )).toFixed(4)})`

                  return (
                    <div
                      data-part="card"
                      data-drag={card.drag ? "true" : undefined}
                      key={card.title}
                      style={delay ? { animationDelay: delay } : undefined}
                    >
                      <GripIcon />
                      <span data-part="card-title">{card.title}</span>
                      {card.tag ? (
                        <span data-part="card-tag">{card.tag}</span>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
