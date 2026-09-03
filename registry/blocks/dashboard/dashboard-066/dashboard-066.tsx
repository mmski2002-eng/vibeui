import type { CSSProperties } from "react"

export type Dashboard066Person = {
  name: string
  role: string
  done: number
  active: number
  waiting: number
  late: number
}

export type Dashboard066Props = {
  title?: string
  period?: string
  people?: Dashboard066Person[]
  sortNote?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подписи легенды по ключам late, waiting, active, done. */
  legendText?: Record<string, string>
  /** Расшифровка полосы: {name}, {late}, {waiting}, {active}, {done}. */
  barAriaText?: string
  /** Подписи цифр по ключам total, late, done. */
  statsText?: Record<string, string>
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: «задачи по исполнителям» обычно рисуют четырьмя колонками цифр,
// и сравнить людей глазами невозможно. Здесь у каждого одна составная полоса:
// доли статусов занимают ширину пропорционально числу задач, а сама полоса —
// пропорционально общей загрузке относительно самого загруженного. Так видно
// сразу две вещи: у кого больше работы и из чего она состоит. Просрочка стоит
// первым сегментом слева, у одного края: искать её взглядом по середине полосы
// нельзя. Цифры остаются рядом — полоса отвечает «кто», цифры отвечают
// «насколько», и легенда подписывает сегменты словами, а не только цветом.
const STYLES = `
:where([data-vibeui-block="dashboard-066"]){
--vibeui-dashboard-066-bg:transparent;
/* Карточки строк и хвост полосы: подложка блока прозрачна. */
--vibeui-dashboard-066-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 255));
--vibeui-dashboard-066-inset:light-dark(oklch(0.985 0.003 255),oklch(0.22 0.012 255));
--vibeui-dashboard-066-fg:light-dark(oklch(0.21 0.014 255),oklch(0.94 0.005 255));
--vibeui-dashboard-066-muted:light-dark(oklch(0.55 0.014 255),oklch(0.72 0.012 255));
--vibeui-dashboard-066-border:light-dark(oklch(0.91 0.006 255),oklch(0.36 0.012 255));
--vibeui-dashboard-066-accent:light-dark(oklch(0.52 0.15 255),oklch(0.73 0.13 255));
--vibeui-dashboard-066-soft:light-dark(oklch(0.965 0.02 255),oklch(0.3 0.035 255));
--vibeui-dashboard-066-late:light-dark(oklch(0.57 0.19 25),oklch(0.7 0.18 25));
--vibeui-dashboard-066-waiting:light-dark(oklch(0.72 0.13 85),oklch(0.78 0.14 85));
--vibeui-dashboard-066-active:light-dark(oklch(0.55 0.14 255),oklch(0.68 0.14 255));
--vibeui-dashboard-066-done:light-dark(oklch(0.68 0.09 155),oklch(0.73 0.11 155));
--vibeui-dashboard-066-seg-ink:light-dark(oklch(1 0 0),oklch(0.17 0.02 255));
--vibeui-dashboard-066-waiting-ink:light-dark(oklch(0.25 0.05 85),oklch(0.2 0.05 85));
--vibeui-dashboard-066-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-066"]{color-scheme:dark}
[data-vibeui-block="dashboard-066"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-066-bg);
color:var(--vibeui-dashboard-066-fg);
font-family:var(--vibeui-dashboard-066-sans);
border:1px solid var(--vibeui-dashboard-066-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-066"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-066"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-066"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-066"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-066"] [data-part="period"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-066-muted)}
[data-vibeui-block="dashboard-066"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;margin:0;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-dashboard-066-muted);
}
[data-vibeui-block="dashboard-066"] [data-part="legend"] li{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="dashboard-066"] [data-part="legend"] i{width:0.6875rem;height:0.6875rem;border-radius:0.1875rem;display:inline-block}
[data-vibeui-block="dashboard-066"] [data-part="rows"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-066"] [data-part="row"]{
display:grid;grid-template-columns:1fr;gap:0.3125rem 0.875rem;align-items:center;
padding:0.625rem 0.75rem;border-radius:0.8125rem;
background:var(--vibeui-dashboard-066-card);border:1px solid var(--vibeui-dashboard-066-border);
}
[data-vibeui-block="dashboard-066"] [data-part="who"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.4375rem;min-width:0}
[data-vibeui-block="dashboard-066"] [data-part="who"] b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-066"] [data-part="who"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-066-muted)}
[data-vibeui-block="dashboard-066"] [data-part="bar"]{
display:flex;gap:0.125rem;height:1.125rem;min-width:0;
}
[data-vibeui-block="dashboard-066"] [data-part="seg"]{
display:flex;align-items:center;justify-content:center;min-width:0;overflow:hidden;
font-size:0.625rem;font-weight:750;color:var(--vibeui-dashboard-066-seg-ink);border-radius:0.25rem;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-066"] [data-seg="late"]{background:var(--vibeui-dashboard-066-late)}
[data-vibeui-block="dashboard-066"] [data-seg="waiting"]{background:var(--vibeui-dashboard-066-waiting);color:var(--vibeui-dashboard-066-waiting-ink)}
[data-vibeui-block="dashboard-066"] [data-seg="active"]{background:var(--vibeui-dashboard-066-active)}
[data-vibeui-block="dashboard-066"] [data-seg="done"]{background:var(--vibeui-dashboard-066-done)}
[data-vibeui-block="dashboard-066"] [data-part="rest"]{
flex:1 1 auto;border-radius:0.25rem;background:var(--vibeui-dashboard-066-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-066-border);
}
[data-vibeui-block="dashboard-066"] [data-part="nums"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;margin:0;font-size:0.6875rem;
color:var(--vibeui-dashboard-066-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-066"] [data-part="nums"] b{color:var(--vibeui-dashboard-066-fg);font-weight:750}
[data-vibeui-block="dashboard-066"] [data-part="nums"] [data-late="true"]{color:var(--vibeui-dashboard-066-late)}
[data-vibeui-block="dashboard-066"] [data-part="note"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-066-muted)}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-066"] [data-part="row"]{grid-template-columns:11rem minmax(0,1fr);align-items:center}
[data-vibeui-block="dashboard-066"] [data-part="who"]{grid-row:1 / span 2;flex-direction:column;align-items:flex-start;gap:0.0625rem}
}
`

const DEFAULT_PEOPLE: Dashboard066Person[] = [
  {
    name: "Ирина Кузнецова",
    role: "старший менеджер",
    done: 14,
    active: 6,
    waiting: 3,
    late: 1,
  },
  {
    name: "Павел Дорохов",
    role: "менеджер",
    done: 9,
    active: 8,
    waiting: 5,
    late: 4,
  },
  {
    name: "Марина Тюрина",
    role: "менеджер",
    done: 11,
    active: 4,
    waiting: 1,
    late: 0,
  },
  {
    name: "Егор Савельев",
    role: "менеджер",
    done: 5,
    active: 3,
    waiting: 6,
    late: 2,
  },
  {
    name: "Алла Никитина",
    role: "стажёр",
    done: 4,
    active: 2,
    waiting: 0,
    late: 0,
  },
]

const LEGEND_TEXT: Record<string, string> = {
  late: "просрочено",
  waiting: "ждёт ответа",
  active: "в работе",
  done: "сделано",
}

const STATS_TEXT: Record<string, string> = {
  total: "всего",
  late: "просрочено",
  done: "закрыто за неделю",
}

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
 * Экран статусов задач по исполнителям: составная полоса, где ширина сегментов
 * равна числу задач, а длина всей полосы — загрузке относительно самого
 * занятого. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard066({
  title = "Задачи по исполнителям",
  period = "текущая неделя, 9–15 июня",
  people = DEFAULT_PEOPLE,
  sortNote = "Список отсортирован по числу просроченных, а не по алфавиту: сверху тот, кому нужна помощь.",
  accent,
  background = "",
  legendText = LEGEND_TEXT,
  barAriaText = "{name}: просрочено {late}, ждёт ответа {waiting}, в работе {active}, сделано {done}",
  statsText = STATS_TEXT,
  className,
  style,
}: Dashboard066Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-066-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-066-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const legend = { ...LEGEND_TEXT, ...legendText }
  const stats = { ...STATS_TEXT, ...statsText }

  const totals = people.map(
    (person) => person.done + person.active + person.waiting + person.late,
  )
  const peak = Math.max(1, ...totals)

  return (
    <>
      <style href="vibeui-dashboard-066" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-066"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="period">{period}</p>
          </div>

          <ul data-part="legend">
            {(["late", "waiting", "active", "done"] as const).map((kind) => (
              <li key={kind}>
                <i
                  style={{
                    background: `var(--vibeui-dashboard-066-${kind})`,
                  }}
                />
                {legend[kind]}
              </li>
            ))}
          </ul>

          <ul data-part="rows">
            {people.map((person, index) => {
              const total = totals[index]
              const scale = total / peak

              return (
                <li key={person.name} data-part="row">
                  <p data-part="who">
                    <b>{person.name}</b>
                    <span>{person.role}</span>
                  </p>

                  <div
                    data-part="bar"
                    role="img"
                    aria-label={barAriaText
                      .replace("{name}", person.name)
                      .replace("{late}", String(person.late))
                      .replace("{waiting}", String(person.waiting))
                      .replace("{active}", String(person.active))
                      .replace("{done}", String(person.done))}
                  >
                    {(
                      [
                        ["late", person.late],
                        ["waiting", person.waiting],
                        ["active", person.active],
                        ["done", person.done],
                      ] as const
                    ).map(([kind, value]) =>
                      value > 0 ? (
                        <span
                          key={kind}
                          data-part="seg"
                          data-seg={kind}
                          style={{
                            flex: `0 0 ${(value / peak) * 100 * 0.92}%`,
                          }}
                        >
                          {value}
                        </span>
                      ) : null,
                    )}
                    {scale < 0.995 ? <span data-part="rest" /> : null}
                  </div>

                  <p data-part="nums">
                    <span>
                      {stats.total} <b>{total}</b>
                    </span>
                    <span data-late={person.late > 0}>
                      {stats.late} <b>{person.late}</b>
                    </span>
                    <span>
                      {stats.done} <b>{person.done}</b>
                    </span>
                  </p>
                </li>
              )
            })}
          </ul>

          <p data-part="note">{sortNote}</p>
        </div>
      </section>
    </>
  )
}
