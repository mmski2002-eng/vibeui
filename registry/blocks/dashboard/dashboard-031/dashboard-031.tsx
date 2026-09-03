import type { CSSProperties } from "react"

export type Dashboard031Result = {
  label: string
  now: string
  target: string
  percent: number
}

export type Dashboard031Goal = {
  title: string
  owner: string
  due: string
  percent: number
  state?: "ontrack" | "risk" | "behind"
  results: Dashboard031Result[]
}

export type Dashboard031Props = {
  title?: string
  quarter?: string
  goals?: Dashboard031Goal[]
  timeGone?: number
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Шаблон опорной строки: {gone} и {average}. */
  timelineText?: string
  /** Слова состояния: ontrack, risk, behind. */
  stateText?: Record<string, string>
  /** Шаблон числа результата: {now} и {target}. */
  resultText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: цели квартала, где прогресс сравнивается не с сотней, а с
// прошедшим временем. Строка «квартал пройден на 62 %» стоит наверху, и
// шестьдесят процентов цели — это ровно по графику, а не «почти готово».
// Кольцо нарисовано conic-gradient с вырезом через mask: без SVG и без
// библиотеки. Состояние цели подписано словом и формой значка, потому что
// «зелёный–жёлтый–красный» на печати и при дальтонизме сливается.
const STYLES = `
:where([data-vibeui-block="dashboard-031"]){
--vibeui-dashboard-031-bg:transparent;
--vibeui-dashboard-031-panel:light-dark(oklch(0.985 0.003 265),oklch(0.27 0.012 265));
/* Жёлоб полосы результата: подложка блока прозрачна, и рисовать жёлоб ею нечем. */
--vibeui-dashboard-031-track:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-dashboard-031-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-dashboard-031-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-dashboard-031-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.011 265));
--vibeui-dashboard-031-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-dashboard-031-ok:light-dark(oklch(0.55 0.14 152),oklch(0.76 0.14 152));
--vibeui-dashboard-031-risk:light-dark(oklch(0.66 0.15 70),oklch(0.8 0.13 70));
--vibeui-dashboard-031-late:light-dark(oklch(0.55 0.18 25),oklch(0.73 0.16 25));
--vibeui-dashboard-031-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-031"]{color-scheme:dark}
[data-vibeui-block="dashboard-031"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-031-bg);
color:var(--vibeui-dashboard-031-fg);
font-family:var(--vibeui-dashboard-031-sans);
border:1px solid var(--vibeui-dashboard-031-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-031"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-031"] [data-part="shell"]{padding:1.125rem}
[data-vibeui-block="dashboard-031"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.75rem;margin-bottom:0.375rem;
}
[data-vibeui-block="dashboard-031"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-031"] [data-part="quarter"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-031-muted)}
/* Опора для чтения прогресса: сколько квартала уже прошло. */
[data-vibeui-block="dashboard-031"] [data-part="timeline"]{
margin:0 0 1rem;font-size:0.75rem;font-weight:650;
color:var(--vibeui-dashboard-031-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-031"] [data-part="goals"]{
display:grid;grid-template-columns:1fr;gap:0.75rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-031"] [data-part="goal"]{
display:grid;grid-template-columns:auto 1fr;gap:0.375rem 0.875rem;
background:var(--vibeui-dashboard-031-panel);
border:1px solid var(--vibeui-dashboard-031-border);border-radius:0.875rem;
padding:0.875rem;
}
[data-vibeui-block="dashboard-031"] [data-part="ring"]{
grid-row:span 3;align-self:start;position:relative;
width:3.5rem;height:3.5rem;border-radius:9999px;
background:conic-gradient(var(--vibeui-dashboard-031-tone) var(--vibeui-dashboard-031-p),var(--vibeui-dashboard-031-border) 0);
-webkit-mask:radial-gradient(circle,transparent 58%,black 59%);
mask:radial-gradient(circle,transparent 58%,black 59%);
}
[data-vibeui-block="dashboard-031"] [data-part="ringtext"]{
position:absolute;inset:0;display:grid;place-content:center;
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-031"] [data-state="ontrack"]{--vibeui-dashboard-031-tone:var(--vibeui-dashboard-031-ok)}
[data-vibeui-block="dashboard-031"] [data-state="risk"]{--vibeui-dashboard-031-tone:var(--vibeui-dashboard-031-risk)}
[data-vibeui-block="dashboard-031"] [data-state="behind"]{--vibeui-dashboard-031-tone:var(--vibeui-dashboard-031-late)}
[data-vibeui-block="dashboard-031"] [data-part="row"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.5rem;
}
[data-vibeui-block="dashboard-031"] h3{margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-031"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:650;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-dashboard-031-tone);
}
[data-vibeui-block="dashboard-031"] [data-part="mark"]{
width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-dashboard-031-tone);
}
[data-vibeui-block="dashboard-031"] [data-state="risk"] [data-part="mark"]{
background:none;border-radius:0.125rem;
box-shadow:inset 0 0 0 2px var(--vibeui-dashboard-031-tone);
}
[data-vibeui-block="dashboard-031"] [data-state="behind"] [data-part="mark"]{
border-radius:0.125rem;transform:rotate(45deg);
}
[data-vibeui-block="dashboard-031"] [data-part="owner"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-031-muted);
}
[data-vibeui-block="dashboard-031"] ol{
grid-column:2;margin:0.25rem 0 0;padding:0;list-style:none;display:grid;gap:0.4375rem;
}
[data-vibeui-block="dashboard-031"] [data-part="kr"]{font-size:0.75rem}
[data-vibeui-block="dashboard-031"] [data-part="krline"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem;margin:0 0 0.1875rem;
}
[data-vibeui-block="dashboard-031"] [data-part="krnums"]{
margin-left:auto;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-dashboard-031-muted);
}
[data-vibeui-block="dashboard-031"] [data-part="track"]{
display:block;height:0.3125rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-031-track);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-031-border);
}
[data-vibeui-block="dashboard-031"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
width:var(--vibeui-dashboard-031-w);
background:var(--vibeui-dashboard-031-tone);
}
@container (min-width: 50rem){
[data-vibeui-block="dashboard-031"] [data-part="goals"]{grid-template-columns:repeat(2,1fr)}
[data-vibeui-block="dashboard-031"] [data-part="shell"]{padding:1.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-031"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GOALS: Dashboard031Goal[] = [
  {
    title: "Каталог отвечает на запрос за один заход",
    owner: "Анна Реброва",
    due: "до 31 марта",
    percent: 74,
    state: "ontrack",
    results: [
      {
        label: "Блоков в каталоге",
        now: "412",
        target: "500",
        percent: 82,
      },
      {
        label: "Доля запросов без результата",
        now: "9 %",
        target: "5 %",
        percent: 62,
      },
    ],
  },
  {
    title: "Установленный блок совпадает с превью",
    owner: "Илья Мохов",
    due: "до 31 марта",
    percent: 48,
    state: "risk",
    results: [
      {
        label: "Блоков с собственной палитрой",
        now: "356",
        target: "412",
        percent: 86,
      },
      {
        label: "Жалоб на расхождение вида",
        now: "14",
        target: "0",
        percent: 30,
      },
    ],
  },
  {
    title: "Промпт установки понятен агенту без правок",
    owner: "Ким Сон",
    due: "до 15 апреля",
    percent: 21,
    state: "behind",
    results: [
      {
        label: "Переведённых описаний",
        now: "180",
        target: "412",
        percent: 44,
      },
      {
        label: "Успешных установок подряд",
        now: "12",
        target: "50",
        percent: 24,
      },
    ],
  },
  {
    title: "Витрина держит мобильную ширину",
    owner: "Пётр Гай",
    due: "до 31 марта",
    percent: 88,
    state: "ontrack",
    results: [
      { label: "Проверенных категорий", now: "13", target: "15", percent: 87 },
      { label: "Ошибок раскладки", now: "3", target: "0", percent: 90 },
    ],
  },
]

const STATE_WORD: Record<string, string> = {
  ontrack: "по графику",
  risk: "под угрозой",
  behind: "отстаёт",
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
 * Цели квартала: кольцо прогресса, состояние словом и формой, ключевые
 * результаты с полосами. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard031({
  title = "Цели квартала",
  quarter = "I квартал · 4 цели",
  goals = DEFAULT_GOALS,
  timeGone = 62,
  accent,
  background = "",
  timelineText = "Квартал пройден на {gone} %, цели выполнены в среднем на {average} %",
  stateText = STATE_WORD,
  resultText = "{now} из {target}",
  className,
  style,
}: Dashboard031Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-031-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-031-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const average = Math.round(
    goals.reduce((sum, goal) => sum + goal.percent, 0) /
      Math.max(1, goals.length),
  )

  return (
    <>
      <style href="vibeui-dashboard-031" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-031"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <p data-part="quarter">{quarter}</p>
          </header>
          <p data-part="timeline">
            {timelineText
              .replace("{gone}", String(timeGone))
              .replace("{average}", String(average))}
          </p>

          <ul data-part="goals">
            {goals.map((goal) => (
              <li
                key={goal.title}
                data-part="goal"
                data-state={goal.state ?? "ontrack"}
              >
                <div
                  data-part="ring"
                  style={
                    {
                      "--vibeui-dashboard-031-p": `${goal.percent}%`,
                    } as CSSProperties
                  }
                  role="progressbar"
                  aria-valuenow={goal.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={goal.title}
                >
                  <span data-part="ringtext">{goal.percent} %</span>
                </div>
                <div data-part="row">
                  <h3>{goal.title}</h3>
                  <span data-part="state">
                    <span data-part="mark" aria-hidden="true" />
                    {stateText[goal.state ?? "ontrack"] ??
                      STATE_WORD[goal.state ?? "ontrack"]}
                  </span>
                </div>
                <p data-part="owner">
                  {goal.owner} · {goal.due}
                </p>
                <ol>
                  {goal.results.map((result) => (
                    <li key={result.label} data-part="kr">
                      <p data-part="krline">
                        <span>{result.label}</span>
                        <span data-part="krnums">
                          {resultText
                            .replace("{now}", result.now)
                            .replace("{target}", result.target)}
                        </span>
                      </p>
                      <span data-part="track">
                        <span
                          data-part="fill"
                          style={
                            {
                              "--vibeui-dashboard-031-w": `${result.percent}%`,
                            } as CSSProperties
                          }
                        />
                      </span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
