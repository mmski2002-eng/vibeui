import type { CSSProperties } from "react"

export type Dashboard068Member = {
  name: string
  role: string
  available: number
  planned: number
  absence?: string
  projects: { name: string; hours: number }[]
}

export type Dashboard068Props = {
  title?: string
  week?: string
  members?: Dashboard068Member[]
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Итог по команде: {planned} и {available}. */
  totalText?: string
  /** Часы человека: {planned} и {available}. */
  hoursText?: string
  /** Расшифровка полосы: {name}, {planned}, {available}. */
  trackAriaText?: string
  /** Подсказка засечки ёмкости: {available}. */
  capTitleText?: string
  /** Строка проекта: {name} и {hours}. */
  projectText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: капасити — это разговор про два числа, доступные часы и
// запланированные, и главное в нём — граница между ними. Поэтому полоса рисует
// план, а засечка на ней — доступную ёмкость: перегруз выезжает за засечку и
// виден без чтения цифр. Ёмкость уменьшена отсутствиями, и причина отсутствия
// подписана рядом — «минус 16 часов» без объяснения выглядит ошибкой данных.
// Внутри полосы план разбит на проекты долями: вопрос «чем он занят» задают
// сразу после вопроса «сколько он занят». Итог по команде считается от суммы,
// а не усредняется по людям: усреднение прячет одного перегруженного.
const STYLES = `
:where([data-vibeui-block="dashboard-068"]){
--vibeui-dashboard-068-bg:transparent;
/* Карточки, жёлоб полосы и чип отсутствия: подложка блока прозрачна. */
--vibeui-dashboard-068-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 175));
--vibeui-dashboard-068-inset:light-dark(oklch(0.985 0.003 175),oklch(0.22 0.012 175));
--vibeui-dashboard-068-fg:light-dark(oklch(0.21 0.014 175),oklch(0.94 0.005 175));
--vibeui-dashboard-068-muted:light-dark(oklch(0.54 0.014 175),oklch(0.72 0.012 175));
--vibeui-dashboard-068-border:light-dark(oklch(0.91 0.006 175),oklch(0.36 0.012 175));
--vibeui-dashboard-068-accent:light-dark(oklch(0.55 0.11 39.8),oklch(0.7 0.11 39.8));
--vibeui-dashboard-068-soft:light-dark(oklch(0.965 0.02 190),oklch(0.3 0.03 190));
--vibeui-dashboard-068-over:light-dark(oklch(0.57 0.19 39.8),oklch(0.72 0.17 39.8));
--vibeui-dashboard-068-over-line:light-dark(oklch(0.83 0.09 39.8),oklch(0.49 0.11 39.8));
--vibeui-dashboard-068-free:light-dark(oklch(0.62 0.12 39.8),oklch(0.76 0.13 39.8));
--vibeui-dashboard-068-alt:light-dark(oklch(0.62 0.13 39.8),oklch(0.7 0.13 39.8));
--vibeui-dashboard-068-alt2:light-dark(oklch(0.66 0.14 39.8),oklch(0.74 0.13 39.8));
--vibeui-dashboard-068-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-068"]{color-scheme:dark}
[data-vibeui-block="dashboard-068"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-068-bg);
color:var(--vibeui-dashboard-068-fg);
font-family:var(--vibeui-dashboard-068-sans);
border:1px solid var(--vibeui-dashboard-068-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-068"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-068"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-068"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-068"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-068"] [data-part="week"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-068-muted)}
[data-vibeui-block="dashboard-068"] [data-part="total"]{
margin-left:auto;font-size:0.75rem;font-weight:700;font-variant-numeric:tabular-nums;
padding:0.25rem 0.5625rem;border-radius:0.5rem;background:var(--vibeui-dashboard-068-soft);
}
[data-vibeui-block="dashboard-068"] [data-part="list"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-068"] [data-part="member"]{
display:grid;gap:0.3125rem;padding:0.6875rem 0.8125rem;border-radius:0.8125rem;
background:var(--vibeui-dashboard-068-card);border:1px solid var(--vibeui-dashboard-068-border);
}
[data-vibeui-block="dashboard-068"] [data-member="over"]{border-color:var(--vibeui-dashboard-068-over-line)}
[data-vibeui-block="dashboard-068"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem}
[data-vibeui-block="dashboard-068"] [data-part="top"] b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-068"] [data-part="top"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-068-muted)}
[data-vibeui-block="dashboard-068"] [data-part="absence"]{
font-size:0.625rem;font-weight:700;padding:0.0625rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-068-inset);border:1px solid var(--vibeui-dashboard-068-border);
}
[data-vibeui-block="dashboard-068"] [data-part="hours"]{
margin-left:auto;font-size:0.75rem;font-weight:750;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="dashboard-068"] [data-member="over"] [data-part="hours"]{color:var(--vibeui-dashboard-068-over)}
[data-vibeui-block="dashboard-068"] [data-member="free"] [data-part="hours"]{color:var(--vibeui-dashboard-068-free)}
[data-vibeui-block="dashboard-068"] [data-part="track"]{
position:relative;height:0.875rem;border-radius:0.3125rem;overflow:visible;
background:var(--vibeui-dashboard-068-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-068-border);
}
[data-vibeui-block="dashboard-068"] [data-part="stack"]{
position:absolute;inset:0 auto 0 0;display:flex;gap:0.0625rem;border-radius:0.3125rem;overflow:hidden;
}
[data-vibeui-block="dashboard-068"] [data-part="stack"] span{display:block;height:100%}
[data-vibeui-block="dashboard-068"] [data-part="stack"] span:nth-child(1){background:var(--vibeui-dashboard-068-accent)}
[data-vibeui-block="dashboard-068"] [data-part="stack"] span:nth-child(2){background:var(--vibeui-dashboard-068-alt)}
[data-vibeui-block="dashboard-068"] [data-part="stack"] span:nth-child(3){background:var(--vibeui-dashboard-068-alt2)}
[data-vibeui-block="dashboard-068"] [data-member="over"] [data-part="stack"] span{background:var(--vibeui-dashboard-068-over)}
/* Засечка доступной ёмкости: план правее неё — это уже перегруз. */
[data-vibeui-block="dashboard-068"] [data-part="cap"]{
position:absolute;top:-0.1875rem;bottom:-0.1875rem;width:0.125rem;border-radius:9999px;
background:var(--vibeui-dashboard-068-fg);
}
[data-vibeui-block="dashboard-068"] [data-part="projects"]{
margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-068-muted);
}
[data-vibeui-block="dashboard-068"] [data-part="projects"] li{display:inline-flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="dashboard-068"] [data-part="projects"] i{width:0.5rem;height:0.5rem;border-radius:0.125rem;display:inline-block}
[data-vibeui-block="dashboard-068"] [data-part="projects"] li:nth-child(1) i{background:var(--vibeui-dashboard-068-accent)}
[data-vibeui-block="dashboard-068"] [data-part="projects"] li:nth-child(2) i{background:var(--vibeui-dashboard-068-alt)}
[data-vibeui-block="dashboard-068"] [data-part="projects"] li:nth-child(3) i{background:var(--vibeui-dashboard-068-alt2)}
[data-vibeui-block="dashboard-068"] [data-part="note"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-068-muted);max-width:66ch}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-068"] [data-part="list"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
}
`

const DEFAULT_MEMBERS: Dashboard068Member[] = [
  {
    name: "Ирина Кузнецова",
    role: "старший менеджер",
    available: 40,
    planned: 34,
    projects: [
      { name: "Склад в Тюмени", hours: 18 },
      { name: "Линия розлива", hours: 10 },
      { name: "Совещания", hours: 6 },
    ],
  },
  {
    name: "Павел Дорохов",
    role: "менеджер",
    available: 40,
    planned: 51,
    projects: [
      { name: "Линия розлива", hours: 26 },
      { name: "Станция очистки", hours: 17 },
      { name: "Дежурство", hours: 8 },
    ],
  },
  {
    name: "Марина Тюрина",
    role: "аналитик",
    available: 24,
    planned: 22,
    absence: "отпуск со среды",
    projects: [
      { name: "Склад в Тюмени", hours: 14 },
      { name: "Отчётность", hours: 8 },
    ],
  },
  {
    name: "Егор Савельев",
    role: "инженер",
    available: 40,
    planned: 17,
    projects: [
      { name: "Станция очистки", hours: 12 },
      { name: "Обучение", hours: 5 },
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
 * Экран капасити команды: план полосой, доступная ёмкость засечкой, разбивка
 * плана по проектам долями и причина сокращения ёмкости словами. Один файл,
 * ноль зависимостей, клиентского JS нет.
 */
export function Dashboard068({
  title = "Загрузка команды",
  week = "неделя 9–15 июня, часы плановые",
  members = DEFAULT_MEMBERS,
  note = "Ёмкость уже уменьшена на отпуска и дежурства. Часы совещаний считаются занятыми: убрав их из плана, вы получите цифру, в которую никто не укладывается.",
  accent,
  background = "",
  totalText = "по команде {planned} из {available} ч",
  hoursText = "{planned} / {available} ч",
  trackAriaText = "{name}: запланировано {planned} часов из {available} доступных",
  capTitleText = "Доступно {available} ч",
  projectText = "{name} — {hours} ч",
  className,
  style,
}: Dashboard068Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-068-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-068-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const totalAvailable = members.reduce(
    (sum, member) => sum + member.available,
    0,
  )
  const totalPlanned = members.reduce((sum, member) => sum + member.planned, 0)

  return (
    <>
      <style href="vibeui-dashboard-068" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-068"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="week">{week}</p>
            <p data-part="total">
              {totalText
                .replace("{planned}", String(totalPlanned))
                .replace("{available}", String(totalAvailable))}
            </p>
          </div>

          <ul data-part="list">
            {members.map((member) => {
              const peak = Math.max(member.available, member.planned)
              const zone =
                member.planned > member.available
                  ? "over"
                  : member.planned < member.available * 0.7
                    ? "free"
                    : "busy"

              return (
                <li key={member.name} data-part="member" data-member={zone}>
                  <div data-part="top">
                    <b>{member.name}</b>
                    <span>{member.role}</span>
                    {member.absence ? (
                      <span data-part="absence">{member.absence}</span>
                    ) : null}
                    <span data-part="hours">
                      {hoursText
                        .replace("{planned}", String(member.planned))
                        .replace("{available}", String(member.available))}
                    </span>
                  </div>

                  <div
                    data-part="track"
                    role="progressbar"
                    aria-valuenow={member.planned}
                    aria-valuemin={0}
                    aria-valuemax={peak}
                    aria-label={trackAriaText
                      .replace("{name}", member.name)
                      .replace("{planned}", String(member.planned))
                      .replace("{available}", String(member.available))}
                  >
                    <span
                      data-part="stack"
                      style={{ width: `${(member.planned / peak) * 100}%` }}
                    >
                      {member.projects.map((project) => (
                        <span
                          key={project.name}
                          style={{
                            width: `${(project.hours / member.planned) * 100}%`,
                          }}
                        />
                      ))}
                    </span>
                    <span
                      data-part="cap"
                      style={{ left: `${(member.available / peak) * 100}%` }}
                      title={capTitleText.replace(
                        "{available}",
                        String(member.available),
                      )}
                    />
                  </div>

                  <ul data-part="projects">
                    {member.projects.map((project) => (
                      <li key={project.name}>
                        <i />
                        {projectText
                          .replace("{name}", project.name)
                          .replace("{hours}", String(project.hours))}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>

          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
