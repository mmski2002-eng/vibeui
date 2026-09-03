import type { CSSProperties } from "react"

export type Dashboard047Queue = {
  name: string
  workers: string
  waiting: number
  running: number
  failed: number
  wait: string
  limit: number
}

export type Dashboard047Failure = {
  job: string
  queue: string
  reason: string
  attempt: number
  attempts: number
  nextTry: string
}

export type Dashboard047Props = {
  title?: string
  hint?: string
  queues?: Dashboard047Queue[]
  failures?: Dashboard047Failure[]
  retryLabel?: string
  dropLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Заголовок раздела упавших задач. */
  failuresTitle?: string
  /** Подписи счётчиков очереди по ключам. */
  statsText?: Record<string, string>
  /** Шаблон подписи полосы: {name}, {waiting} и {limit}. */
  depthAriaText?: string
  /** Шаблон подсказки попыток: {attempt} и {attempts}. */
  attemptTitleText?: string
  /** Шаблон строки попытки: {attempt}, {attempts} и {next}. */
  attemptText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: очереди задач, где глубина очереди показана полосой от предела,
// а не голым числом: «412» ничего не значит, пока не известно, много это или
// норма. Повторы упавших задач нарисованы точками попыток — заполненные уже
// израсходованы, пустые остались; так видно, что задача на последнем круге,
// без чтения счётчика. Время следующей попытки названо явно, потому что до
// него ручной перезапуск чаще всего не нужен.
const STYLES = `
:where([data-vibeui-block="dashboard-047"]){
--vibeui-dashboard-047-bg:transparent;
/* Плитки и жёлоб полосы: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-047-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 285));
--vibeui-dashboard-047-track:light-dark(oklch(0.96 0.005 285),oklch(0.21 0.012 285));
--vibeui-dashboard-047-fg:light-dark(oklch(0.22 0.014 285),oklch(0.94 0.005 285));
--vibeui-dashboard-047-muted:light-dark(oklch(0.55 0.014 285),oklch(0.72 0.012 285));
--vibeui-dashboard-047-border:light-dark(oklch(0.91 0.006 285),oklch(0.36 0.012 285));
--vibeui-dashboard-047-accent:light-dark(oklch(0.52 0.16 285),oklch(0.75 0.14 285));
--vibeui-dashboard-047-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 285));
--vibeui-dashboard-047-soft:light-dark(oklch(0.96 0.02 285),oklch(0.32 0.045 285));
--vibeui-dashboard-047-bad:light-dark(oklch(0.58 0.19 25),oklch(0.73 0.17 25));
--vibeui-dashboard-047-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dashboard-047-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-047"]{color-scheme:dark}
[data-vibeui-block="dashboard-047"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-047-bg);
color:var(--vibeui-dashboard-047-fg);
font-family:var(--vibeui-dashboard-047-sans);
border:1px solid var(--vibeui-dashboard-047-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-047"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-047"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-047"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.75rem}
[data-vibeui-block="dashboard-047"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-047"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-047-muted)}
[data-vibeui-block="dashboard-047"] [data-part="grid"]{display:grid;grid-template-columns:1fr;gap:0.5rem}
[data-vibeui-block="dashboard-047"] [data-part="queue"]{
display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.75rem;
padding:0.75rem 0.875rem;
background:var(--vibeui-dashboard-047-card);
border:1px solid var(--vibeui-dashboard-047-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-047"] h3{
margin:0;font-family:var(--vibeui-dashboard-047-mono);font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="dashboard-047"] [data-part="workers"]{
font-size:0.6875rem;color:var(--vibeui-dashboard-047-muted);text-align:right;white-space:nowrap;
}
[data-vibeui-block="dashboard-047"] [data-part="depth"]{grid-column:1/-1;display:grid;gap:0.25rem}
[data-vibeui-block="dashboard-047"] [data-part="track"]{
height:0.4375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-047-track);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-047-border);
}
[data-vibeui-block="dashboard-047"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;background:var(--vibeui-dashboard-047-accent);
}
[data-vibeui-block="dashboard-047"] [data-part="queue"][data-hot="yes"] [data-part="fill"]{background:var(--vibeui-dashboard-047-bad)}
[data-vibeui-block="dashboard-047"] [data-part="nums"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.875rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-047-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-047"] [data-part="nums"] b{color:var(--vibeui-dashboard-047-fg);font-weight:750}
[data-vibeui-block="dashboard-047"] [data-part="nums"] [data-bad] b{color:var(--vibeui-dashboard-047-bad)}
[data-vibeui-block="dashboard-047"] [data-part="fails"]{
background:var(--vibeui-dashboard-047-card);
border:1px solid var(--vibeui-dashboard-047-border);border-radius:0.875rem;padding:0.875rem;
}
[data-vibeui-block="dashboard-047"] [data-part="fails"] h3{
font-family:var(--vibeui-dashboard-047-sans);font-size:0.875rem;margin-bottom:0.625rem;
}
[data-vibeui-block="dashboard-047"] [data-part="fail"]{
display:grid;grid-template-columns:1fr auto;gap:0.25rem 0.75rem;align-items:center;
padding:0.625rem 0;border-top:1px solid var(--vibeui-dashboard-047-border);
}
[data-vibeui-block="dashboard-047"] [data-part="fail"]:first-of-type{border-top:0;padding-top:0}
[data-vibeui-block="dashboard-047"] [data-part="job"]{
font-family:var(--vibeui-dashboard-047-mono);font-size:0.75rem;font-weight:700;overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-047"] [data-part="reason"]{
grid-column:1;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-dashboard-047-muted);
}
/* Точки попыток: израсходованные закрашены, оставшиеся пустые. */
[data-vibeui-block="dashboard-047"] [data-part="tries"]{
grid-column:2;grid-row:1/3;display:flex;align-items:center;gap:0.5rem;white-space:nowrap;
}
[data-vibeui-block="dashboard-047"] [data-part="dots"]{display:flex;gap:0.1875rem}
[data-vibeui-block="dashboard-047"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:50%;
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-047-muted);
}
[data-vibeui-block="dashboard-047"] [data-part="dot"][data-used="yes"]{
background:var(--vibeui-dashboard-047-bad);box-shadow:none;
}
[data-vibeui-block="dashboard-047"] [data-part="when"]{
font-size:0.625rem;color:var(--vibeui-dashboard-047-muted);
}
[data-vibeui-block="dashboard-047"] [data-part="acts"]{grid-column:2;display:flex;gap:0.375rem;justify-self:end}
[data-vibeui-block="dashboard-047"] [data-part="retry"]{
appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.6875rem;font-weight:700;padding:0.3125rem 0.625rem;border-radius:0.4375rem;
background:var(--vibeui-dashboard-047-accent);color:var(--vibeui-dashboard-047-on-accent);
}
[data-vibeui-block="dashboard-047"] [data-part="drop"]{
appearance:none;cursor:pointer;font:inherit;
font-size:0.6875rem;font-weight:650;padding:0.3125rem 0.625rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-dashboard-047-border);background:var(--vibeui-dashboard-047-card);color:inherit;
}
[data-vibeui-block="dashboard-047"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-047-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-047"] [data-part="grid"]{grid-template-columns:repeat(2,1fr)}
}
@container (min-width: 62rem){
[data-vibeui-block="dashboard-047"] [data-part="grid"]{grid-template-columns:repeat(4,1fr)}
}
`

const DEFAULT_QUEUES: Dashboard047Queue[] = [
  {
    name: "mail:send",
    workers: "6 воркеров",
    waiting: 84,
    running: 6,
    failed: 0,
    wait: "3 с",
    limit: 500,
  },
  {
    name: "reports:build",
    workers: "2 воркера",
    waiting: 412,
    running: 2,
    failed: 7,
    wait: "11 мин",
    limit: 500,
  },
  {
    name: "webhooks:deliver",
    workers: "4 воркера",
    waiting: 26,
    running: 4,
    failed: 3,
    wait: "8 с",
    limit: 500,
  },
  {
    name: "images:resize",
    workers: "8 воркеров",
    waiting: 5,
    running: 3,
    failed: 0,
    wait: "1 с",
    limit: 500,
  },
]

const DEFAULT_FAILURES: Dashboard047Failure[] = [
  {
    job: "reports:build#91204",
    queue: "reports:build",
    reason: "Таймаут запроса к складскому API: 30 000 мс без ответа.",
    attempt: 4,
    attempts: 5,
    nextTry: "следующая попытка через 12 минут",
  },
  {
    job: "webhooks:deliver#77310",
    queue: "webhooks:deliver",
    reason: "Получатель ответил 502, тело ответа пустое.",
    attempt: 2,
    attempts: 5,
    nextTry: "следующая попытка через 4 минуты",
  },
  {
    job: "reports:build#91198",
    queue: "reports:build",
    reason: "Не хватило памяти на выгрузку за год: 512 МБ на процесс.",
    attempt: 5,
    attempts: 5,
    nextTry: "попытки исчерпаны, задача в мёртвой очереди",
  },
]

const STATS_LABEL: Record<string, string> = {
  waiting: "в очереди",
  running: "в работе",
  failed: "упало",
  wait: "ожидание",
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
 * Экран очередей задач: глубина очереди полосой от предела и разбор упавших
 * задач с точками попыток и временем следующего повтора. Один файл, ноль
 * зависимостей, клиентского JS нет.
 */
export function Dashboard047({
  title = "Очереди задач",
  hint = "обновляется каждые 5 секунд",
  queues = DEFAULT_QUEUES,
  failures = DEFAULT_FAILURES,
  retryLabel = "Повторить",
  dropLabel = "Снять",
  accent,
  background = "",
  failuresTitle = "Упавшие задачи и повторы",
  statsText = STATS_LABEL,
  depthAriaText = "{name}: {waiting} задач в очереди из {limit}",
  attemptTitleText = "Попытка {attempt} из {attempts}",
  attemptText = "попытка {attempt} из {attempts} · {next}",
  className,
  style,
}: Dashboard047Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-047-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-047-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-047" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-047"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>

          <div data-part="grid">
            {queues.map((queue) => {
              const share = Math.min(
                100,
                Math.round((queue.waiting / queue.limit) * 100),
              )

              return (
                <article
                  key={queue.name}
                  data-part="queue"
                  data-hot={share > 50 ? "yes" : "no"}
                >
                  <h3>{queue.name}</h3>
                  <span data-part="workers">{queue.workers}</span>

                  <div data-part="depth">
                    <div
                      data-part="track"
                      role="progressbar"
                      aria-valuenow={queue.waiting}
                      aria-valuemin={0}
                      aria-valuemax={queue.limit}
                      aria-label={depthAriaText
                        .replace("{name}", queue.name)
                        .replace("{waiting}", String(queue.waiting))
                        .replace("{limit}", String(queue.limit))}
                    >
                      <span data-part="fill" style={{ width: `${share}%` }} />
                    </div>
                    <p data-part="nums">
                      <span>
                        {statsText.waiting ?? STATS_LABEL.waiting}{" "}
                        <b>{queue.waiting}</b>
                      </span>
                      <span>
                        {statsText.running ?? STATS_LABEL.running}{" "}
                        <b>{queue.running}</b>
                      </span>
                      <span data-bad={queue.failed > 0 ? "" : undefined}>
                        {statsText.failed ?? STATS_LABEL.failed}{" "}
                        <b>{queue.failed}</b>
                      </span>
                      <span>
                        {statsText.wait ?? STATS_LABEL.wait} <b>{queue.wait}</b>
                      </span>
                    </p>
                  </div>
                </article>
              )
            })}
          </div>

          <div data-part="fails">
            <h3>{failuresTitle}</h3>
            {failures.map((failure) => (
              <div key={failure.job} data-part="fail">
                <span data-part="job">{failure.job}</span>
                <span data-part="reason">{failure.reason}</span>

                <span data-part="tries">
                  <span
                    data-part="dots"
                    title={attemptTitleText
                      .replace("{attempt}", String(failure.attempt))
                      .replace("{attempts}", String(failure.attempts))}
                  >
                    {Array.from({ length: failure.attempts }).map(
                      (_, index) => (
                        <span
                          key={index}
                          data-part="dot"
                          data-used={index < failure.attempt ? "yes" : "no"}
                        />
                      ),
                    )}
                  </span>
                  <span data-part="when">
                    {attemptText
                      .replace("{attempt}", String(failure.attempt))
                      .replace("{attempts}", String(failure.attempts))
                      .replace("{next}", failure.nextTry)}
                  </span>
                </span>

                <span data-part="acts">
                  <button type="button" data-part="retry">
                    {retryLabel}
                  </button>
                  <button type="button" data-part="drop">
                    {dropLabel}
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
