import type { CSSProperties } from "react"

export type Dashboard037Request = {
  code: string
  subject: string
  client: string
  channel: string
  left: string
  overdue?: boolean
  priority: "Срочно" | "Обычно" | "Низкий"
}

export type Dashboard037Worker = {
  name: string
  role: string
  load: number
  free: string
}

export type Dashboard037Props = {
  title?: string
  queueLabel?: string
  waiting?: number
  overdue?: number
  requests?: Dashboard037Request[]
  picked?: string
  workers?: Dashboard037Worker[]
  assignLabel?: string
  laterLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: очередь заявок и назначение исполнителя на одном экране, чтобы
// диспетчеру не приходилось открывать карточку ради одного действия. Выбор
// заявки собран на радиокнопках: подсветка идёт через :has(), состояние держит
// браузер, клавиатурная навигация по очереди достаётся даром. Срок ответа
// показан оставшимся временем, а просрочка — полосой, словом и знаком, потому
// что одним красным цветом её не отличить на монохромном экране. Загрузка
// исполнителя нарисована полосой, чтобы назначение не уходило вслепую.
const STYLES = `
:where([data-vibeui-block="dashboard-037"]){
--vibeui-dashboard-037-bg:oklch(0.985 0.003 265);
--vibeui-dashboard-037-card:oklch(1 0 0);
--vibeui-dashboard-037-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-037-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-037-border:oklch(0.91 0.006 265);
--vibeui-dashboard-037-accent:oklch(0.54 0.16 250);
--vibeui-dashboard-037-soft:oklch(0.96 0.02 250);
--vibeui-dashboard-037-hot:oklch(0.58 0.19 25);
--vibeui-dashboard-037-warm:oklch(0.68 0.15 68);
--vibeui-dashboard-037-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-037"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-037-bg);
color:var(--vibeui-dashboard-037-fg);
font-family:var(--vibeui-dashboard-037-sans);
border:1px solid var(--vibeui-dashboard-037-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-037"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-037"] [data-part="shell"]{display:grid;gap:0.875rem;grid-template-columns:1fr}
[data-vibeui-block="dashboard-037"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem 0.875rem;grid-column:1/-1;
}
[data-vibeui-block="dashboard-037"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-037"] [data-part="counts"]{
display:flex;gap:0.75rem;margin-left:auto;font-size:0.75rem;color:var(--vibeui-dashboard-037-muted);
}
[data-vibeui-block="dashboard-037"] [data-part="counts"] b{
font-variant-numeric:tabular-nums;color:var(--vibeui-dashboard-037-fg);
}
[data-vibeui-block="dashboard-037"] [data-part="counts"] [data-late] b{color:var(--vibeui-dashboard-037-hot)}
[data-vibeui-block="dashboard-037"] fieldset{border:0;margin:0;padding:0;min-width:0}
[data-vibeui-block="dashboard-037"] legend{
padding:0;margin:0 0 0.5rem;
font-size:0.625rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dashboard-037-muted);
}
[data-vibeui-block="dashboard-037"] [data-part="queue"]{display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="dashboard-037"] [data-part="item"]{
display:grid;grid-template-columns:auto 1fr auto;gap:0.125rem 0.625rem;align-items:start;
position:relative;cursor:pointer;padding:0.625rem 0.75rem;
background:var(--vibeui-dashboard-037-card);
border:1px solid var(--vibeui-dashboard-037-border);border-radius:0.75rem;
border-left:0.1875rem solid var(--vibeui-dashboard-037-border);
}
[data-vibeui-block="dashboard-037"] [data-part="item"][data-late="yes"]{border-left-color:var(--vibeui-dashboard-037-hot)}
[data-vibeui-block="dashboard-037"] [data-part="item"]:has(input:checked){
border-color:var(--vibeui-dashboard-037-accent);background:var(--vibeui-dashboard-037-soft);
}
[data-vibeui-block="dashboard-037"] [data-part="item"]:has(input:focus-visible){
outline:2px solid var(--vibeui-dashboard-037-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-037"] [data-part="item"] input{
grid-row:1/3;margin:0.1875rem 0 0;width:0.9375rem;height:0.9375rem;
accent-color:var(--vibeui-dashboard-037-accent);
}
[data-vibeui-block="dashboard-037"] [data-part="subject"]{
grid-column:2;font-size:0.8125rem;font-weight:700;line-height:1.35;
}
[data-vibeui-block="dashboard-037"] [data-part="meta"]{
grid-column:2;font-size:0.6875rem;color:var(--vibeui-dashboard-037-muted);
}
[data-vibeui-block="dashboard-037"] [data-part="sla"]{
grid-column:3;grid-row:1/3;align-self:center;text-align:right;white-space:nowrap;
font-size:0.6875rem;font-weight:750;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-037"] [data-part="item"][data-late="yes"] [data-part="sla"]{color:var(--vibeui-dashboard-037-hot)}
[data-vibeui-block="dashboard-037"] [data-part="prio"]{
display:inline-block;margin-right:0.375rem;padding:0 0.3125rem;border-radius:0.3125rem;
font-size:0.5625rem;font-weight:800;letter-spacing:0.03em;text-transform:uppercase;
border:1px solid currentColor;
}
[data-vibeui-block="dashboard-037"] [data-part="prio"][data-level="Срочно"]{color:var(--vibeui-dashboard-037-hot)}
[data-vibeui-block="dashboard-037"] [data-part="prio"][data-level="Обычно"]{color:var(--vibeui-dashboard-037-warm)}
[data-vibeui-block="dashboard-037"] [data-part="prio"][data-level="Низкий"]{color:var(--vibeui-dashboard-037-muted)}
[data-vibeui-block="dashboard-037"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.625rem;align-self:start;
background:var(--vibeui-dashboard-037-card);
border:1px solid var(--vibeui-dashboard-037-border);border-radius:0.875rem;padding:0.875rem;
}
[data-vibeui-block="dashboard-037"] [data-part="panel"] h3{
margin:0;font-size:0.875rem;font-weight:750;
}
[data-vibeui-block="dashboard-037"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-dashboard-037-muted);
}
[data-vibeui-block="dashboard-037"] [data-part="who"]{
display:grid;grid-template-columns:1fr auto;gap:0.25rem 0.625rem;align-items:center;
padding:0.5rem 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-dashboard-037-border);
}
[data-vibeui-block="dashboard-037"] [data-part="who"]:has(input:checked){
border-color:var(--vibeui-dashboard-037-accent);background:var(--vibeui-dashboard-037-soft);
}
[data-vibeui-block="dashboard-037"] [data-part="who"]:has(input:focus-visible){
outline:2px solid var(--vibeui-dashboard-037-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-037"] [data-part="who"] input{
position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="dashboard-037"] [data-part="name"]{font-size:0.8125rem;font-weight:700}
[data-vibeui-block="dashboard-037"] [data-part="role"]{
font-size:0.6875rem;color:var(--vibeui-dashboard-037-muted);
}
[data-vibeui-block="dashboard-037"] [data-part="load"]{
grid-column:2;grid-row:1/3;width:5rem;text-align:right;
font-size:0.625rem;color:var(--vibeui-dashboard-037-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-037"] [data-part="bar"]{
display:block;height:0.25rem;margin-top:0.1875rem;border-radius:9999px;
background:var(--vibeui-dashboard-037-bg);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-037-border);overflow:hidden;
}
[data-vibeui-block="dashboard-037"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;background:var(--vibeui-dashboard-037-accent);
}
[data-vibeui-block="dashboard-037"] [data-part="acts"]{display:flex;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="dashboard-037"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;font:inherit;flex:1 1 8rem;
font-size:0.8125rem;font-weight:700;padding:0.5625rem 0.875rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-037-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-037"] [data-part="later"]{
appearance:none;cursor:pointer;font:inherit;
font-size:0.8125rem;font-weight:650;padding:0.5625rem 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-dashboard-037-border);background:var(--vibeui-dashboard-037-card);color:inherit;
}
[data-vibeui-block="dashboard-037"] :is(button,input,select):focus-visible{
outline:2px solid var(--vibeui-dashboard-037-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="dashboard-037"] [data-part="shell"]{grid-template-columns:1.55fr 1fr;gap:1rem}
}
`

const DEFAULT_REQUESTS: Dashboard037Request[] = [
  {
    code: "ЗА-4821",
    subject: "Не приходит акт за февраль",
    client: "ООО «Северный лес»",
    channel: "Почта",
    left: "просрочено 40 мин",
    overdue: true,
    priority: "Срочно",
  },
  {
    code: "ЗА-4822",
    subject: "Ошибка при оплате картой",
    client: "ИП Гаврилов",
    channel: "Чат",
    left: "осталось 25 мин",
    priority: "Срочно",
  },
  {
    code: "ЗА-4823",
    subject: "Добавить второго бухгалтера",
    client: "АО «Прибор»",
    channel: "Телефон",
    left: "осталось 2 ч",
    priority: "Обычно",
  },
  {
    code: "ЗА-4824",
    subject: "Вопрос по тарифу «Команда»",
    client: "Студия «Полдень»",
    channel: "Форма на сайте",
    left: "осталось 5 ч",
    priority: "Низкий",
  },
]

const DEFAULT_WORKERS: Dashboard037Worker[] = [
  { name: "Игорь Панов", role: "Первая линия", load: 40, free: "4 из 10" },
  { name: "Мария Соловьёва", role: "Биллинг", load: 80, free: "8 из 10" },
  { name: "Пётр Хромов", role: "Техподдержка", load: 20, free: "2 из 10" },
]

/**
 * Экран заявок: очередь с приоритетом и сроком ответа слева, назначение
 * исполнителя справа. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard037({
  title = "Заявки в работе",
  queueLabel = "Очередь по сроку ответа",
  waiting = 14,
  overdue = 3,
  requests = DEFAULT_REQUESTS,
  picked = "ЗА-4821",
  workers = DEFAULT_WORKERS,
  assignLabel = "Назначить и открыть",
  laterLabel = "Отложить",
  accent,
  className,
  style,
}: Dashboard037Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-037-accent": accent } : null),
    ...style,
  } as CSSProperties

  const current = requests.find((request) => request.code === picked)

  return (
    <>
      <style href="vibeui-dashboard-037" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-037"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="counts">
              <span>
                ждут ответа <b>{waiting}</b>
              </span>
              <span data-late="">
                просрочено <b>{overdue}</b>
              </span>
            </p>
          </div>

          <fieldset>
            <legend>{queueLabel}</legend>
            <div data-part="queue">
              {requests.map((request) => (
                <label
                  key={request.code}
                  data-part="item"
                  data-late={request.overdue ? "yes" : "no"}
                >
                  <input
                    type="radio"
                    name="dashboard-037-request"
                    defaultChecked={request.code === picked}
                    aria-label={`${request.code}: ${request.subject}`}
                  />
                  <span data-part="subject">
                    <span
                      data-part="prio"
                      data-level={request.priority}
                      title={`Приоритет: ${request.priority}`}
                    >
                      {request.priority}
                    </span>
                    {request.subject}
                  </span>
                  <span data-part="meta">
                    {request.code} · {request.client} · {request.channel}
                  </span>
                  <span data-part="sla">
                    {request.overdue ? "! " : null}
                    {request.left}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div data-part="panel">
            <h3>Назначить исполнителя</h3>
            <p data-part="hint">
              {current
                ? `${current.code} · ${current.subject}`
                : "Выберите заявку в очереди."}{" "}
              Загрузка считается по открытым заявкам за сегодня.
            </p>

            {workers.map((worker) => (
              <label key={worker.name} data-part="who">
                <input
                  type="radio"
                  name="dashboard-037-worker"
                  defaultChecked={worker === workers[0]}
                />
                <span data-part="name">{worker.name}</span>
                <span data-part="role">{worker.role}</span>
                <span data-part="load">
                  {worker.free}
                  <span data-part="bar">
                    <span
                      data-part="fill"
                      style={{ width: `${worker.load}%` }}
                    />
                  </span>
                </span>
              </label>
            ))}

            <div data-part="acts">
              <button type="button" data-part="go">
                {assignLabel}
              </button>
              <button type="button" data-part="later">
                {laterLabel}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
