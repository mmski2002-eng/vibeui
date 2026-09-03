import type { CSSProperties } from "react"

export type Dashboard069Task = {
  key: string
  title: string
  kind: string
  points: number
  owner: string
  ready: boolean
}

export type Dashboard069Props = {
  title?: string
  sprintMeta?: string
  capacity?: number
  committed?: Dashboard069Task[]
  backlog?: Dashboard069Task[]
  cutLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись рядом со шкалой. */
  gaugeText?: string
  /** Подпись шкалы для скринридера. */
  gaugeAriaText?: string
  /** Знак перед накопленной суммой. */
  sumPrefix?: string
  /** Пометка задачи, не готовой к работе. */
  notReadyText?: string
  /** Сноска под списком. */
  footText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: спринт планируют не списком задач, а линией отсечения. Поэтому
// задачи идут одним потоком, сумма оценок копится сверху вниз, и там, где она
// переваливает за ёмкость, встаёт явная черта «дальше не влезает» — вместо
// двух колонок, между которыми надо перетаскивать. Задача без готовности к
// работе помечена отдельно: взять её в спринт можно, но известно, что она
// встанет. Оценка задачи показана в поинтах и накопленной суммой рядом,
// потому что вопрос всегда один: «если добавлю вот эту, что вылетит».
const STYLES = `
:where([data-vibeui-block="dashboard-069"]){
--vibeui-dashboard-069-bg:transparent;
/* Карточки задач и жёлоб шкалы: подложка блока прозрачна. */
--vibeui-dashboard-069-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 275));
--vibeui-dashboard-069-inset:light-dark(oklch(0.985 0.003 275),oklch(0.22 0.012 275));
--vibeui-dashboard-069-fg:light-dark(oklch(0.21 0.014 275),oklch(0.94 0.005 275));
--vibeui-dashboard-069-muted:light-dark(oklch(0.55 0.014 275),oklch(0.72 0.012 275));
--vibeui-dashboard-069-border:light-dark(oklch(0.91 0.006 275),oklch(0.36 0.012 275));
--vibeui-dashboard-069-accent:light-dark(oklch(0.52 0.16 275),oklch(0.73 0.14 275));
--vibeui-dashboard-069-soft:light-dark(oklch(0.965 0.02 275),oklch(0.3 0.035 275));
--vibeui-dashboard-069-cut:light-dark(oklch(0.57 0.19 25),oklch(0.75 0.17 25));
--vibeui-dashboard-069-cut-line:light-dark(oklch(0.8 0.1 25),oklch(0.5 0.11 25));
--vibeui-dashboard-069-warn:light-dark(oklch(0.68 0.15 72),oklch(0.8 0.14 72));
--vibeui-dashboard-069-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-069-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-069"]{color-scheme:dark}
[data-vibeui-block="dashboard-069"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-069-bg);
color:var(--vibeui-dashboard-069-fg);
font-family:var(--vibeui-dashboard-069-sans);
border:1px solid var(--vibeui-dashboard-069-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-069"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-069"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-069"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-069"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-069"] [data-part="meta"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-069-muted)}
[data-vibeui-block="dashboard-069"] [data-part="gauge"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.875rem;
padding:0.6875rem 0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-069-card);border:1px solid var(--vibeui-dashboard-069-border);
}
[data-vibeui-block="dashboard-069"] [data-part="gauge"] b{font-size:1.25rem;font-weight:750;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
[data-vibeui-block="dashboard-069"] [data-part="gauge"] span{font-size:0.75rem;color:var(--vibeui-dashboard-069-muted)}
[data-vibeui-block="dashboard-069"] [data-part="track"]{
flex:1 1 10rem;position:relative;height:0.5rem;border-radius:9999px;
background:var(--vibeui-dashboard-069-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-069-border);overflow:hidden;
}
[data-vibeui-block="dashboard-069"] [data-part="track"] span{
position:absolute;inset:0 auto 0 0;border-radius:9999px;background:var(--vibeui-dashboard-069-accent);
}
[data-vibeui-block="dashboard-069"] [data-part="tasks"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="dashboard-069"] [data-part="task"]{
display:grid;grid-template-columns:auto 1fr auto;gap:0.1875rem 0.625rem;align-items:center;
padding:0.5rem 0.6875rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-069-card);border:1px solid var(--vibeui-dashboard-069-border);
}
[data-vibeui-block="dashboard-069"] [data-part="task"][data-out="true"]{background:transparent;opacity:0.72}
[data-vibeui-block="dashboard-069"] [data-part="key"]{
font-family:var(--vibeui-dashboard-069-mono);font-size:0.6875rem;font-weight:700;
color:var(--vibeui-dashboard-069-muted);white-space:nowrap;
}
[data-vibeui-block="dashboard-069"] [data-part="name"]{font-size:0.8125rem;font-weight:650;min-width:0}
[data-vibeui-block="dashboard-069"] [data-part="pts"]{
font-size:0.75rem;font-weight:750;font-variant-numeric:tabular-nums;white-space:nowrap;
padding:0.125rem 0.4375rem;border-radius:0.375rem;background:var(--vibeui-dashboard-069-soft);
}
[data-vibeui-block="dashboard-069"] [data-part="sub"]{
grid-column:2 / -1;margin:0;display:flex;flex-wrap:wrap;gap:0.25rem 0.625rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-069-muted);
}
[data-vibeui-block="dashboard-069"] [data-part="kind"]{
font-size:0.625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
}
[data-vibeui-block="dashboard-069"] [data-part="notready"]{color:var(--vibeui-dashboard-069-warn);font-weight:700}
[data-vibeui-block="dashboard-069"] [data-part="sum"]{
font-variant-numeric:tabular-nums;font-weight:650;color:var(--vibeui-dashboard-069-muted);
}
/* Черта отсечения: всё ниже неё в спринт не помещается. */
[data-vibeui-block="dashboard-069"] [data-part="cut"]{
display:flex;align-items:center;gap:0.5rem;margin:0.25rem 0;
font-size:0.6875rem;font-weight:750;color:var(--vibeui-dashboard-069-cut);
}
[data-vibeui-block="dashboard-069"] [data-part="cut"]::before,
[data-vibeui-block="dashboard-069"] [data-part="cut"]::after{
content:"";flex:1 1 auto;height:0;border-top:2px dashed var(--vibeui-dashboard-069-cut-line);
}
[data-vibeui-block="dashboard-069"] [data-part="foot"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-069-muted);max-width:66ch}
@container (min-width: 42rem){
[data-vibeui-block="dashboard-069"] [data-part="task"]{grid-template-columns:5.5rem minmax(0,1fr) auto auto}
[data-vibeui-block="dashboard-069"] [data-part="sub"]{grid-column:2;justify-self:start}
}
`

const DEFAULT_COMMITTED: Dashboard069Task[] = [
  {
    key: "PLT-311",
    title: "Экспорт заявок в XLSX без блокировки интерфейса",
    kind: "фича",
    points: 8,
    owner: "Егор Савельев",
    ready: true,
  },
  {
    key: "PLT-318",
    title: "Дубликаты клиентов: склейка по ИНН",
    kind: "фича",
    points: 13,
    owner: "Марина Тюрина",
    ready: true,
  },
  {
    key: "PLT-322",
    title: "Падение при импорте CSV с BOM",
    kind: "баг",
    points: 3,
    owner: "Павел Дорохов",
    ready: true,
  },
  {
    key: "PLT-327",
    title: "Сохранённые представления: общий доступ",
    kind: "фича",
    points: 5,
    owner: "Егор Савельев",
    ready: true,
  },
]

const DEFAULT_BACKLOG: Dashboard069Task[] = [
  {
    key: "PLT-330",
    title: "Правила валидации: подсказка при срабатывании",
    kind: "фича",
    points: 8,
    owner: "не назначено",
    ready: false,
  },
  {
    key: "PLT-334",
    title: "Тайм-аут отчёта на больших выборках",
    kind: "баг",
    points: 5,
    owner: "не назначено",
    ready: true,
  },
  {
    key: "PLT-339",
    title: "Переезд на новый почтовый шлюз",
    kind: "долг",
    points: 13,
    owner: "не назначено",
    ready: false,
  },
]

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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
 * Страница спринта с бэклогом: задачи одним потоком, накопленная сумма оценок
 * и явная черта отсечения там, где ёмкость спринта заканчивается. Один файл,
 * ноль зависимостей, клиентского JS нет.
 */
export function Dashboard069({
  title = "Спринт 24",
  sprintMeta = "9–20 июня · команда «Платформа» · осталось 6 рабочих дней",
  capacity = 30,
  committed = DEFAULT_COMMITTED,
  backlog = DEFAULT_BACKLOG,
  cutLabel = "дальше не влезает в ёмкость спринта",
  accent,
  background = "",
  gaugeText = "поинтов набрано из ёмкости команды",
  gaugeAriaText = "Набрано поинтов из ёмкости спринта",
  sumPrefix = "Σ",
  notReadyText = "не готова к работе: нет описания и макета",
  footText = "Ёмкость посчитана по средней скорости за три спринта и уже уменьшена на отпуск Марины. Задачи ниже черты остаются в бэклоге и не переносятся автоматически.",
  className,
  style,
}: Dashboard069Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-069-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-069-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const all = [...committed, ...backlog]
  let running = 0
  const rows = all.map((task) => {
    running += task.points
    return { task, sum: running, out: running > capacity }
  })
  const cutIndex = rows.findIndex((row) => row.out)
  const taken = cutIndex === -1 ? running : (rows[cutIndex - 1]?.sum ?? 0)

  return (
    <>
      <style href="vibeui-dashboard-069" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-069"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="meta">{sprintMeta}</p>
          </div>

          <div data-part="gauge">
            <b>
              {taken} / {capacity}
            </b>
            <span>{gaugeText}</span>
            <span
              data-part="track"
              role="progressbar"
              aria-valuenow={taken}
              aria-valuemin={0}
              aria-valuemax={capacity}
              aria-label={gaugeAriaText}
            >
              <span
                style={{
                  width: `${Math.min(100, (taken / capacity) * 100)}%`,
                }}
              />
            </span>
          </div>

          <ul data-part="tasks">
            {rows.map((row, index) => (
              <li key={row.task.key} style={{ display: "contents" }}>
                {index === cutIndex ? <p data-part="cut">{cutLabel}</p> : null}
                <div data-part="task" data-out={row.out}>
                  <span data-part="key">{row.task.key}</span>
                  <span data-part="name">{row.task.title}</span>
                  <span data-part="pts">{row.task.points}</span>
                  <span data-part="sum">
                    {sumPrefix} {row.sum}
                  </span>
                  <p data-part="sub">
                    <span data-part="kind">{row.task.kind}</span>
                    <span>{row.task.owner}</span>
                    {row.task.ready ? null : (
                      <span data-part="notready">{notReadyText}</span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p data-part="foot">{footText}</p>
        </div>
      </section>
    </>
  )
}
