import type { CSSProperties } from "react"

export type Dashboard085Goal = {
  name: string
  current: number
  target: number
  unit: string
  weight: number
  owner: string
  comment: string
}

export type Dashboard085Department = {
  name: string
  lead: string
  goals: Dashboard085Goal[]
}

export type Dashboard085Props = {
  title?: string
  quarter?: string
  timeShare?: number
  departments?: Dashboard085Department[]
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Итог отдела. Подставляется {score}. */
  scoreText?: string
  /** Вес цели. Подставляется {weight}. */
  weightText?: string
  /** Слово между текущим и целевым значением. */
  ofLabel?: string
  /** Подпись полосы для читалки. {name}, {current}, {target}, {unit}. */
  goalLabelText?: string
  /** Подсказка засечки прошедшего времени. Подставляется {share}. */
  paceText?: string
  /** Подпись отставания. Подставляется {points}. */
  lagText?: string
  /** Пояснение под таблицей целей. */
  legendText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: цель на 70 % — это хорошо или плохо? Ответ зависит от того,
// сколько квартала прошло. Поэтому на каждой полосе стоит засечка «прошло
// времени», и отставание видно как разрыв между заливкой и засечкой, а не
// вычисляется в уме. Вес цели подписан числом: без веса отдел с пятью
// формальными целями выглядит успешнее отдела с одной тяжёлой. Итог по отделу
// считается взвешенно и стоит в шапке отдела — сравнивать отделы по среднему
// арифметическому целей нечестно. Комментарий владельца лежит прямо под целью:
// цифра без объяснения провоцирует неверные выводы на встрече.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-085"]){
--vibeui-dashboard-085-bg:transparent;
/* Карточка отдела и жёлоб полосы: подложка самого блока прозрачна. */
--vibeui-dashboard-085-card:light-dark(oklch(1 0 0),oklch(0.26 0 300));
--vibeui-dashboard-085-inset:light-dark(oklch(0.985 0 300),oklch(0.22 0 300));
--vibeui-dashboard-085-fg:light-dark(oklch(0.21 0 300),oklch(0.94 0 300));
--vibeui-dashboard-085-muted:light-dark(oklch(0.54 0 300),oklch(0.72 0 300));
--vibeui-dashboard-085-border:light-dark(oklch(0.91 0 300),oklch(0.36 0 300));
--vibeui-dashboard-085-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.74 0.14 39.8));
--vibeui-dashboard-085-soft:light-dark(oklch(0.965 0 300),oklch(0.3 0 300));
--vibeui-dashboard-085-ahead:light-dark(oklch(0.58 0.13 39.8),oklch(0.74 0.13 39.8));
--vibeui-dashboard-085-behind:light-dark(oklch(0.57 0.19 39.8),oklch(0.72 0.16 39.8));
--vibeui-dashboard-085-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-085"]{color-scheme:dark}
[data-vibeui-block="dashboard-085"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-085-bg);
color:var(--vibeui-dashboard-085-fg);
font-family:var(--vibeui-dashboard-085-sans);
border:1px solid var(--vibeui-dashboard-085-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-085"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-085"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-085"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-085"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-085"] [data-part="quarter"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-085-muted)}
[data-vibeui-block="dashboard-085"] [data-part="dept"]{
display:flex;flex-direction:column;gap:0.5rem;padding:0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-085-card);border:1px solid var(--vibeui-dashboard-085-border);
}
[data-vibeui-block="dashboard-085"] [data-part="dhead"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.625rem}
[data-vibeui-block="dashboard-085"] h3{margin:0;font-size:0.9375rem;font-weight:750}
[data-vibeui-block="dashboard-085"] [data-part="lead"]{font-size:0.6875rem;color:var(--vibeui-dashboard-085-muted)}
[data-vibeui-block="dashboard-085"] [data-part="score"]{
margin-left:auto;font-size:0.8125rem;font-weight:750;font-variant-numeric:tabular-nums;
padding:0.1875rem 0.5rem;border-radius:0.4375rem;background:var(--vibeui-dashboard-085-soft);
}
[data-vibeui-block="dashboard-085"] [data-part="score"][data-state="behind"]{
color:var(--vibeui-dashboard-085-behind);
background:color-mix(in oklab,var(--vibeui-dashboard-085-behind) 12%,light-dark(white,black));
}
[data-vibeui-block="dashboard-085"] [data-part="score"][data-state="ahead"]{
color:var(--vibeui-dashboard-085-ahead);
background:color-mix(in oklab,var(--vibeui-dashboard-085-ahead) 14%,light-dark(white,black));
}
[data-vibeui-block="dashboard-085"] [data-part="goals"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-085"] [data-part="goal"]{display:grid;grid-template-columns:1fr;gap:0.1875rem 0.75rem}
[data-vibeui-block="dashboard-085"] [data-part="gname"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem}
[data-vibeui-block="dashboard-085"] [data-part="gname"] b{font-size:0.8125rem;font-weight:700}
[data-vibeui-block="dashboard-085"] [data-part="weight"]{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;background:var(--vibeui-dashboard-085-soft);
color:var(--vibeui-dashboard-085-muted);
}
[data-vibeui-block="dashboard-085"] [data-part="nums"]{
margin-left:auto;font-size:0.75rem;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="dashboard-085"] [data-part="nums"] span{font-weight:400;color:var(--vibeui-dashboard-085-muted)}
[data-vibeui-block="dashboard-085"] [data-part="track"]{
position:relative;height:0.5rem;border-radius:9999px;
background:var(--vibeui-dashboard-085-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-085-border);
}
[data-vibeui-block="dashboard-085"] [data-part="fill"]{
position:absolute;top:0;bottom:0;left:0;border-radius:9999px;background:var(--vibeui-dashboard-085-accent);
}
[data-vibeui-block="dashboard-085"] [data-goal="behind"] [data-part="fill"]{background:var(--vibeui-dashboard-085-behind)}
[data-vibeui-block="dashboard-085"] [data-goal="ahead"] [data-part="fill"]{background:var(--vibeui-dashboard-085-ahead)}
/* Засечка «прошло времени»: разрыв с заливкой и есть отставание. */
[data-vibeui-block="dashboard-085"] [data-part="pace"]{
position:absolute;top:-0.1875rem;bottom:-0.1875rem;width:0.125rem;border-radius:9999px;
background:var(--vibeui-dashboard-085-fg);
}
[data-vibeui-block="dashboard-085"] [data-part="gfoot"]{
margin:0;display:flex;flex-wrap:wrap;gap:0.1875rem 0.625rem;font-size:0.625rem;
color:var(--vibeui-dashboard-085-muted);
}
[data-vibeui-block="dashboard-085"] [data-part="lag"]{color:var(--vibeui-dashboard-085-behind);font-weight:700}
[data-vibeui-block="dashboard-085"] [data-part="legend"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-085-muted);max-width:66ch}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-085"] [data-part="goal"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:center}
[data-vibeui-block="dashboard-085"] [data-part="gfoot"]{grid-column:1 / -1}
}
`

const DEFAULT_DEPARTMENTS: Dashboard085Department[] = [
  {
    name: "Продажи",
    lead: "Ирина Кузнецова",
    goals: [
      {
        name: "Выручка квартала",
        current: 41.2,
        target: 60,
        unit: "млн ₽",
        weight: 50,
        owner: "Ирина К.",
        comment: "Две крупные сделки перенесены на июль по вине заказчика.",
      },
      {
        name: "Средний чек",
        current: 412,
        target: 380,
        unit: "тыс. ₽",
        weight: 20,
        owner: "Ирина К.",
        comment: "Растёт за счёт сервисных договоров, а не разовых поставок.",
      },
      {
        name: "Доля повторных клиентов",
        current: 34,
        target: 45,
        unit: "%",
        weight: 30,
        owner: "Павел Д.",
        comment: "Сценарий возврата пока не запущен — ждём выкат почты.",
      },
    ],
  },
  {
    name: "Поддержка",
    lead: "Марина Тюрина",
    goals: [
      {
        name: "Первый ответ быстрее часа",
        current: 88,
        target: 90,
        unit: "%",
        weight: 40,
        owner: "Марина Т.",
        comment: "Проседает только по ночам: одна смена на весь поток.",
      },
      {
        name: "Оценка после обращения",
        current: 4.6,
        target: 4.5,
        unit: "из 5",
        weight: 35,
        owner: "Марина Т.",
        comment: "Держится третий квартал подряд.",
      },
      {
        name: "Статей в базе знаний",
        current: 109,
        target: 140,
        unit: "шт.",
        weight: 25,
        owner: "Алла Н.",
        comment: "Пишем по три в неделю, до цели нужно пять.",
      },
    ],
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
 * Страница целей и KPI по отделам: у каждой цели полоса с засечкой «прошло
 * времени», вес цели числом, взвешенный итог в шапке отдела и комментарий
 * владельца под цифрой. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard085({
  title = "Цели и KPI",
  quarter = "второй квартал · прошло 78 % срока, до конца 20 дней",
  timeShare = 78,
  departments = DEFAULT_DEPARTMENTS,
  accent,
  background = "",
  scoreText = "{score} % цели квартала",
  weightText = "вес {weight} %",
  ofLabel = "из",
  goalLabelText = "{name}: {current} из {target} {unit}",
  paceText = "Прошло {share} % квартала",
  lagText = "отстаёт от хода времени на {points} п. п.",
  legendText = "Вертикальная засечка на полосе — доля прошедшего времени квартала. Заливка левее засечки означает отставание, правее — опережение. Итог отдела считается с учётом веса целей, а не как среднее.",
  className,
  style,
}: Dashboard085Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-085-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-085-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const fill = (template: string, values: Record<string, string>) =>
    template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)

  return (
    <>
      <style href="vibeui-dashboard-085" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-085"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="quarter">{quarter}</p>
          </div>

          {departments.map((department) => {
            const weighted = department.goals.reduce(
              (sum, goal) =>
                sum +
                Math.min(120, (goal.current / goal.target) * 100) *
                  (goal.weight / 100),
              0,
            )
            const state =
              weighted >= timeShare + 5
                ? "ahead"
                : weighted <= timeShare - 10
                  ? "behind"
                  : "onpace"

            return (
              <article key={department.name} data-part="dept">
                <div data-part="dhead">
                  <h3>{department.name}</h3>
                  <span data-part="lead">{department.lead}</span>
                  <span data-part="score" data-state={state}>
                    {fill(scoreText, { score: String(Math.round(weighted)) })}
                  </span>
                </div>

                <ul data-part="goals">
                  {department.goals.map((goal) => {
                    const share = Math.min(
                      100,
                      (goal.current / goal.target) * 100,
                    )
                    const goalState =
                      share >= timeShare + 5
                        ? "ahead"
                        : share <= timeShare - 10
                          ? "behind"
                          : "onpace"

                    return (
                      <li
                        key={goal.name}
                        data-part="goal"
                        data-goal={goalState}
                      >
                        <p data-part="gname">
                          <b>{goal.name}</b>
                          <span data-part="weight">
                            {fill(weightText, {
                              weight: String(goal.weight),
                            })}
                          </span>
                          <span data-part="nums">
                            {goal.current}{" "}
                            <span>
                              {ofLabel} {goal.target}
                            </span>{" "}
                            {goal.unit}
                          </span>
                        </p>

                        <div
                          data-part="track"
                          role="progressbar"
                          aria-valuenow={goal.current}
                          aria-valuemin={0}
                          aria-valuemax={goal.target}
                          aria-label={fill(goalLabelText, {
                            name: goal.name,
                            current: String(goal.current),
                            target: String(goal.target),
                            unit: goal.unit,
                          })}
                        >
                          <span
                            data-part="fill"
                            style={{ width: `${share}%` }}
                          />
                          <span
                            data-part="pace"
                            style={{ left: `${timeShare}%` }}
                            title={fill(paceText, {
                              share: String(timeShare),
                            })}
                          />
                        </div>

                        <p data-part="gfoot">
                          <span>{goal.owner}</span>
                          <span>{goal.comment}</span>
                          {goalState === "behind" ? (
                            <span data-part="lag">
                              {fill(lagText, {
                                points: String(Math.round(timeShare - share)),
                              })}
                            </span>
                          ) : null}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </article>
            )
          })}

          <p data-part="legend">{legendText}</p>
        </div>
      </section>
    </>
  )
}
