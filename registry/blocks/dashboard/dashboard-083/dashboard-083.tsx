import type { CSSProperties } from "react"

export type Dashboard083Step = {
  text: string
  owner: string
  due: string
  done: boolean
  blocked?: string
}

export type Dashboard083Process = {
  name: string
  target: string
  steps: Dashboard083Step[]
  open?: boolean
}

export type Dashboard083Props = {
  title?: string
  subtitle?: string
  processes?: Dashboard083Process[]
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Дробь прогресса. Подставляются {done} и {total}. */
  ratioText?: string
  /** Подпись полосы прогресса для читалки. {name}, {done}, {total}. */
  progressText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: чек-лист процесса нужен, чтобы не забыть шаг и знать, чей он.
// Поэтому у каждого пункта стоит ответственный и срок — безымянный чек-лист
// исполняется всеми и никем. Процессы свёрнуты в details, а в заголовке
// прогресс полосой и дробью «4 из 7»: свёрнутый процесс обязан отвечать,
// как далеко зашли. Заблокированный шаг не просто не отмечен — у него
// подписана причина и он выделен: разница между «ещё не сделали» и «сделать
// нельзя» решает, кому идти разбираться. Полоса прогресса считает только
// выполненные шаги, заблокированные в неё не входят.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-083"]){
--vibeui-dashboard-083-bg:transparent;
/* Карточка процесса и подложка шага: сам блок остаётся прозрачным. */
--vibeui-dashboard-083-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 165));
--vibeui-dashboard-083-inset:light-dark(oklch(0.985 0.003 165),oklch(0.22 0.012 165));
--vibeui-dashboard-083-fg:light-dark(oklch(0.21 0.014 165),oklch(0.94 0.005 165));
--vibeui-dashboard-083-muted:light-dark(oklch(0.54 0.014 165),oklch(0.72 0.012 165));
--vibeui-dashboard-083-border:light-dark(oklch(0.91 0.006 165),oklch(0.36 0.012 165));
--vibeui-dashboard-083-accent:light-dark(oklch(0.55 0.12 39.8),oklch(0.76 0.13 39.8));
--vibeui-dashboard-083-soft:light-dark(oklch(0.965 0.02 165),oklch(0.3 0.03 165));
--vibeui-dashboard-083-block:light-dark(oklch(0.57 0.19 39.8),oklch(0.72 0.16 39.8));
--vibeui-dashboard-083-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-083"]{color-scheme:dark}
[data-vibeui-block="dashboard-083"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-083-bg);
color:var(--vibeui-dashboard-083-fg);
font-family:var(--vibeui-dashboard-083-sans);
border:1px solid var(--vibeui-dashboard-083-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-083"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-083"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-083"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-083"] [data-part="sub"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-083-muted);max-width:64ch}
[data-vibeui-block="dashboard-083"] [data-part="list"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-083"] details{
background:var(--vibeui-dashboard-083-card);border:1px solid var(--vibeui-dashboard-083-border);
border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="dashboard-083"] summary{
list-style:none;cursor:pointer;padding:0.75rem 0.875rem;
display:grid;grid-template-columns:1fr auto;gap:0.3125rem 0.75rem;align-items:center;
}
[data-vibeui-block="dashboard-083"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-083"] [data-part="pname"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="dashboard-083"] [data-part="pname"] b{font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-083"] [data-part="pname"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-083-muted)}
[data-vibeui-block="dashboard-083"] [data-part="ratio"]{
font-size:0.75rem;font-weight:750;font-variant-numeric:tabular-nums;white-space:nowrap;
padding:0.1875rem 0.5rem;border-radius:0.4375rem;background:var(--vibeui-dashboard-083-soft);
}
[data-vibeui-block="dashboard-083"] [data-part="track"]{
grid-column:1 / -1;height:0.375rem;border-radius:9999px;position:relative;overflow:hidden;
background:var(--vibeui-dashboard-083-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-083-border);
}
[data-vibeui-block="dashboard-083"] [data-part="track"] span{
position:absolute;inset:0 auto 0 0;border-radius:9999px;background:var(--vibeui-dashboard-083-accent);
}
[data-vibeui-block="dashboard-083"] [data-part="steps"]{
list-style:none;margin:0;padding:0 0.875rem 0.875rem;display:flex;flex-direction:column;gap:0.25rem;
}
[data-vibeui-block="dashboard-083"] [data-part="step"]{
display:grid;grid-template-columns:auto 1fr;gap:0.125rem 0.5rem;align-items:start;
padding:0.4375rem 0.5625rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-083-inset);border:1px solid transparent;
}
[data-vibeui-block="dashboard-083"] [data-part="step"][data-blocked="true"]{
border-color:color-mix(in oklab,var(--vibeui-dashboard-083-block) 38%,light-dark(white,black));
background:color-mix(in oklab,var(--vibeui-dashboard-083-block) 8%,light-dark(white,black));
}
[data-vibeui-block="dashboard-083"] input[type="checkbox"]{
margin:0.125rem 0 0;width:1rem;height:1rem;accent-color:var(--vibeui-dashboard-083-accent);
}
[data-vibeui-block="dashboard-083"] [data-part="text"]{font-size:0.8125rem;font-weight:650;line-height:1.4;cursor:pointer}
[data-vibeui-block="dashboard-083"] [data-part="step"]:has(input:checked) [data-part="text"]{
color:var(--vibeui-dashboard-083-muted);text-decoration:line-through;
}
[data-vibeui-block="dashboard-083"] [data-part="smeta"]{
grid-column:2;margin:0;display:flex;flex-wrap:wrap;gap:0.1875rem 0.625rem;
font-size:0.625rem;color:var(--vibeui-dashboard-083-muted);
}
[data-vibeui-block="dashboard-083"] [data-part="why"]{color:var(--vibeui-dashboard-083-block);font-weight:700}
[data-vibeui-block="dashboard-083"] summary::after{
content:"раскрыть";grid-row:1;grid-column:2;justify-self:end;
font-size:0.625rem;font-weight:700;color:var(--vibeui-dashboard-083-accent);display:none;
}
[data-vibeui-block="dashboard-083"] :is(a,button,input,label,summary):focus-visible{
outline:2px solid var(--vibeui-dashboard-083-accent);outline-offset:2px;
}
@container (min-width: 42rem){
[data-vibeui-block="dashboard-083"] [data-part="steps"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
}
`

const DEFAULT_PROCESSES: Dashboard083Process[] = [
  {
    name: "Выход нового сотрудника",
    target: "закрыть за первые три рабочих дня",
    open: true,
    steps: [
      {
        text: "Завести учётную запись и выдать роль",
        owner: "Ирина К.",
        due: "день 1",
        done: true,
      },
      {
        text: "Выдать доступ к хранилищу паролей",
        owner: "Ирина К.",
        due: "день 1",
        done: true,
      },
      {
        text: "Подписать соглашение о неразглашении",
        owner: "кадры",
        due: "день 1",
        done: true,
      },
      {
        text: "Назначить наставника на первый месяц",
        owner: "руководитель",
        due: "день 2",
        done: true,
      },
      {
        text: "Выдать рабочий ноутбук",
        owner: "снабжение",
        due: "день 2",
        done: false,
        blocked: "ноутбуки приедут 19 июня — поставка задерживается",
      },
      {
        text: "Провести знакомство с командой",
        owner: "руководитель",
        due: "день 3",
        done: false,
      },
      {
        text: "Первая задача из бэклога",
        owner: "наставник",
        due: "день 3",
        done: false,
      },
    ],
  },
  {
    name: "Закрытие месяца",
    target: "до 5-го числа следующего месяца",
    steps: [
      {
        text: "Сверить выручку с бухгалтерией",
        owner: "Марина Т.",
        due: "1-е число",
        done: true,
      },
      {
        text: "Разобрать расхождения по счетам",
        owner: "Марина Т.",
        due: "2-е число",
        done: false,
      },
      {
        text: "Собрать отчёт по филиалам",
        owner: "Ирина К.",
        due: "3-е число",
        done: false,
      },
      {
        text: "Отправить отчёт руководителям",
        owner: "Ирина К.",
        due: "5-е число",
        done: false,
      },
    ],
  },
  {
    name: "Отключение сотрудника",
    target: "в день увольнения, до конца дня",
    steps: [
      {
        text: "Отозвать доступы и ключи API",
        owner: "Ирина К.",
        due: "в день Х",
        done: false,
      },
      {
        text: "Передать заявки другому менеджеру",
        owner: "руководитель",
        due: "в день Х",
        done: false,
      },
      {
        text: "Забрать технику и пропуск",
        owner: "снабжение",
        due: "в день Х",
        done: false,
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
 * Страница чек-листов процессов: процессы свёрнуты в details с прогрессом в
 * заголовке, у каждого шага ответственный и срок, заблокированный шаг несёт
 * причину. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard083({
  title = "Чек-листы процессов",
  subtitle = "Шаг считается выполненным, когда его отметил ответственный. Заблокированный шаг не мешает идти дальше по списку, но закрывает процесс целиком.",
  processes = DEFAULT_PROCESSES,
  accent,
  background = "",
  ratioText = "{done} из {total}",
  progressText = "{name}: выполнено {done} из {total}",
  className,
  style,
}: Dashboard083Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-083-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-083-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const fill = (template: string, values: Record<string, string>) =>
    template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)

  return (
    <>
      <style href="vibeui-dashboard-083" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-083"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="sub">{subtitle}</p>
          </div>

          <div data-part="list">
            {processes.map((process) => {
              const done = process.steps.filter((step) => step.done).length
              const share = Math.round((done / process.steps.length) * 100)

              return (
                <details key={process.name} open={process.open}>
                  <summary>
                    <span data-part="pname">
                      <b>{process.name}</b>
                      <span>{process.target}</span>
                    </span>
                    <span data-part="ratio">
                      {fill(ratioText, {
                        done: String(done),
                        total: String(process.steps.length),
                      })}
                    </span>
                    <span
                      data-part="track"
                      role="progressbar"
                      aria-valuenow={done}
                      aria-valuemin={0}
                      aria-valuemax={process.steps.length}
                      aria-label={fill(progressText, {
                        name: process.name,
                        done: String(done),
                        total: String(process.steps.length),
                      })}
                    >
                      <span style={{ width: `${share}%` }} />
                    </span>
                  </summary>

                  <ul data-part="steps">
                    {process.steps.map((step) => (
                      <li
                        key={step.text}
                        data-part="step"
                        data-blocked={Boolean(step.blocked)}
                      >
                        <input
                          type="checkbox"
                          defaultChecked={step.done}
                          id={`dashboard-083-${process.name}-${step.text}`}
                        />
                        <label
                          data-part="text"
                          htmlFor={`dashboard-083-${process.name}-${step.text}`}
                        >
                          {step.text}
                        </label>
                        <p data-part="smeta">
                          <span>{step.owner}</span>
                          <span>{step.due}</span>
                          {step.blocked ? (
                            <span data-part="why">{step.blocked}</span>
                          ) : null}
                        </p>
                      </li>
                    ))}
                  </ul>
                </details>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
