import type { CSSProperties } from "react"

export type Ai010Task = {
  title: string
  detail?: string
  tool?: string
  owner?: string
}

export type Ai010Column = {
  key: string
  label: string
  tone?: "queue" | "active" | "done"
  tasks: Ai010Task[]
}

export type Ai010Props = {
  title?: string
  goal?: string
  columns?: Ai010Column[]
  progressLabel?: string
  /** Счётчик прогресса: {done}, {total} и {percent} подставляются числами. */
  progressText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: план агента как доска, а не как лента. Лента отвечает на
// вопрос «что было», доска — на вопрос «сколько осталось»: колонки
// «в очереди», «в работе» и «готово» показывают объём работы целиком, и
// видно, что агент делает параллельно.
//
// Полоска прогресса нарисована элементом, а не текстом, но продублирована
// подписью и ролью progressbar с aria-valuenow: без неё доля читается
// только глазами. Колонки на узком блоке встают друг под друга — три
// столбца по 12 символов нечитаемы, и это решает container query.
const STYLES = `
:where([data-vibeui-block="ai-010"]){
--vibeui-ai-010-bg:transparent;
--vibeui-ai-010-card:light-dark(oklch(1 0 0),oklch(0.25 0.011 265));
--vibeui-ai-010-tint:light-dark(oklch(0.985 0.003 265),oklch(0.22 0.01 265));
--vibeui-ai-010-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.006 265));
--vibeui-ai-010-muted:light-dark(oklch(0.53 0.014 265),oklch(0.69 0.012 265));
--vibeui-ai-010-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-ai-010-accent:light-dark(oklch(0.55 0.18 45),oklch(0.76 0.15 55));
--vibeui-ai-010-done:light-dark(oklch(0.58 0.13 155),oklch(0.72 0.13 155));
--vibeui-ai-010-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-ai-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-010"]{
background:var(--vibeui-ai-010-bg);color:var(--vibeui-ai-010-fg);
font-family:var(--vibeui-ai-010-sans);
border:1px solid var(--vibeui-ai-010-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-010"] *{box-sizing:border-box}
[data-vibeui-block="ai-010"] [data-part="shell"]{padding:1.25rem;display:grid;gap:1rem}
[data-vibeui-block="ai-010"] h2{margin:0;font-size:1rem;font-weight:680;letter-spacing:-0.01em}
[data-vibeui-block="ai-010"] [data-part="goal"]{
margin:0.25rem 0 0;max-width:60ch;font-size:0.8125rem;line-height:1.6;color:var(--vibeui-ai-010-muted);
}
[data-vibeui-block="ai-010"] [data-part="progress"]{display:grid;gap:0.375rem}
[data-vibeui-block="ai-010"] [data-part="progress-top"]{
display:flex;justify-content:space-between;gap:0.75rem;
font-size:0.6875rem;color:var(--vibeui-ai-010-muted);font-variant-numeric:tabular-nums;
}
/* Полоска дублируется подписью: доля не должна читаться только глазами. */
[data-vibeui-block="ai-010"] [data-part="track"]{
height:0.375rem;border-radius:9999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-ai-010-fg) 10%,transparent);
}
[data-vibeui-block="ai-010"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
background:var(--vibeui-ai-010-done);
transition:width .3s ease;
}
[data-vibeui-block="ai-010"] [data-part="board"]{display:grid;gap:0.75rem;align-items:start}
[data-vibeui-block="ai-010"] [data-part="column"]{
display:grid;gap:0.5rem;align-content:start;
padding:0.75rem;border-radius:0.9375rem;
border:1px solid var(--vibeui-ai-010-border);background:var(--vibeui-ai-010-card);
}
[data-vibeui-block="ai-010"] h3{
margin:0;display:flex;align-items:center;gap:0.4375rem;
font-size:0.75rem;font-weight:660;
}
[data-vibeui-block="ai-010"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-ai-010-fg) 30%,transparent);
}
[data-vibeui-block="ai-010"] [data-tone="active"] [data-part="dot"]{background:var(--vibeui-ai-010-accent)}
[data-vibeui-block="ai-010"] [data-tone="done"] [data-part="dot"]{background:var(--vibeui-ai-010-done)}
[data-vibeui-block="ai-010"] [data-part="count"]{
margin-left:auto;font-size:0.6875rem;color:var(--vibeui-ai-010-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-010"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="ai-010"] li{
display:grid;gap:0.25rem;padding:0.5625rem 0.6875rem;border-radius:0.6875rem;
border:1px solid var(--vibeui-ai-010-border);
background:var(--vibeui-ai-010-tint);
}
[data-vibeui-block="ai-010"] [data-tone="active"] li{
border-color:color-mix(in oklab,var(--vibeui-ai-010-accent) 40%,var(--vibeui-ai-010-border));
}
[data-vibeui-block="ai-010"] [data-tone="done"] [data-part="task"]{
color:var(--vibeui-ai-010-muted);text-decoration:line-through;
text-decoration-color:color-mix(in oklab,var(--vibeui-ai-010-done) 60%,transparent);
}
[data-vibeui-block="ai-010"] [data-part="task"]{font-size:0.75rem;font-weight:620;line-height:1.4}
[data-vibeui-block="ai-010"] [data-part="detail"]{font-size:0.6875rem;line-height:1.5;color:var(--vibeui-ai-010-muted)}
[data-vibeui-block="ai-010"] [data-part="tool"]{
justify-self:start;padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-ai-010-fg) 6%,transparent);
font-family:var(--vibeui-ai-010-mono);font-size:0.625rem;color:var(--vibeui-ai-010-muted);
}
@container (min-width: 44rem){
[data-vibeui-block="ai-010"] [data-part="shell"]{padding:1.5rem 1.75rem}
[data-vibeui-block="ai-010"] [data-part="board"]{grid-template-columns:repeat(3,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Ai010Column[] = [
  {
    key: "queue",
    label: "В очереди",
    tone: "queue",
    tasks: [
      {
        title: "Собрать форму заявки",
        detail: "contact-001 с темой обращения и согласием на обработку.",
        tool: "catalog.install",
      },
      {
        title: "Прогнать сборку",
        detail: "Проверить типы и линтер перед показом результата.",
        tool: "shell.run",
      },
    ],
  },
  {
    key: "active",
    label: "В работе",
    tone: "active",
    tasks: [
      {
        title: "Подставить тексты из брифа",
        detail: "Заголовки и подписи для hero и блока преимуществ.",
        tool: "file.edit",
      },
    ],
  },
  {
    key: "done",
    label: "Готово",
    tone: "done",
    tasks: [
      {
        title: "Разобрал бриф",
        detail: "Выделил цель страницы и три обязательных экрана.",
      },
      {
        title: "Выбрал блоки",
        detail: "hero-002, features-001, pricing-001 — все без зависимостей.",
        tool: "catalog.search",
      },
      { title: "Завёл ветку", tool: "git.branch" },
    ],
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Доска плана агента: очередь, работа и готовое рядом плюс общий прогресс.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Ai010({
  title = "План агента",
  goal = "Собрать лендинг студии из блоков каталога, подставить тексты и прогнать сборку.",
  columns = DEFAULT_COLUMNS,
  progressLabel = "Выполнено задач",
  progressText = "{done} из {total} · {percent}%",
  accent,
  background = "",
  className,
  style,
}: Ai010Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const total = columns.reduce((sum, column) => sum + column.tasks.length, 0)
  const done =
    columns.find((column) => column.tone === "done")?.tasks.length ?? 0
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <>
      <style href="vibeui-ai-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-010"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header>
            <h2>{title}</h2>
            <p data-part="goal">{goal}</p>
          </header>

          <div data-part="progress">
            <div data-part="progress-top">
              <span>{progressLabel}</span>
              <span>
                {progressText
                  .replace("{done}", String(done))
                  .replace("{total}", String(total))
                  .replace("{percent}", String(percent))}
              </span>
            </div>
            <div
              data-part="track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label={progressLabel}
            >
              <span data-part="fill" style={{ width: `${percent}%` }} />
            </div>
          </div>

          <div data-part="board">
            {columns.map((column) => (
              <section
                key={column.key}
                data-part="column"
                data-tone={column.tone ?? "queue"}
              >
                <h3>
                  <span data-part="dot" aria-hidden="true" />
                  {column.label}
                  <span data-part="count">{column.tasks.length}</span>
                </h3>
                <ul>
                  {column.tasks.map((task) => (
                    <li key={task.title}>
                      <span data-part="task">{task.title}</span>
                      {task.detail ? (
                        <span data-part="detail">{task.detail}</span>
                      ) : null}
                      {task.tool ? (
                        <span data-part="tool">{task.tool}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
