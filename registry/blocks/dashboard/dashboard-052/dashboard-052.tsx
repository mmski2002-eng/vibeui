import type { CSSProperties } from "react"

export type Dashboard052Job = {
  name: string
  asked: string
  state: "В очереди" | "Готовится" | "Готов" | "Просрочен" | "Ошибка"
  progress: number
  size: string
  rows: string
  expires: string
}

export type Dashboard052Props = {
  title?: string
  hint?: string
  datasets?: string[]
  dataset?: string
  formats?: string[]
  format?: string
  range?: string
  ranges?: string[]
  jobs?: Dashboard052Job[]
  createLabel?: string
  downloadLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Заголовок формы заказа. */
  formTitle?: string
  /** Подпись поля набора данных. */
  datasetLabel?: string
  /** Подпись поля периода. */
  rangeLabel?: string
  /** Подпись группы форматов. */
  formatLabel?: string
  /** Пояснение под кнопкой заказа. */
  noteText?: string
  /** Подписи состояний: ключ — значение state. */
  stateText?: Record<string, string>
  /** Шаблон подписи полосы: {name} и {value}. */
  progressAriaText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: выгрузка данных как фоновое задание, а не как мгновенная кнопка
// «скачать». Форма заказа и список заданий стоят рядом, потому что после
// нажатия человек ищет глазами именно строку своего задания. Формат выбирается
// радиокнопками, а не списком: вариантов три, и выбор должен быть виден без
// раскрытия. У готового файла подписан срок жизни ссылки — просроченная
// ссылка без объяснения выглядит как поломка. Прогресс показан полосой и
// процентом, потому что «готовится» без цифры ничего не говорит о времени.
const STYLES = `
:where([data-vibeui-block="dashboard-052"]){
--vibeui-dashboard-052-bg:transparent;
/* Панели и поля ввода: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-052-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 190));
--vibeui-dashboard-052-inset:light-dark(oklch(0.97 0.004 190),oklch(0.22 0.012 190));
--vibeui-dashboard-052-fg:light-dark(oklch(0.22 0.014 190),oklch(0.94 0.005 190));
--vibeui-dashboard-052-muted:light-dark(oklch(0.55 0.014 190),oklch(0.72 0.012 190));
--vibeui-dashboard-052-border:light-dark(oklch(0.91 0.006 190),oklch(0.36 0.012 190));
--vibeui-dashboard-052-accent:light-dark(oklch(0.55 0.12 39.8),oklch(0.76 0.11 39.8));
--vibeui-dashboard-052-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-052-soft:light-dark(oklch(0.95 0.025 190),oklch(0.32 0.045 39.8));
--vibeui-dashboard-052-ok:light-dark(oklch(0.55 0.13 155),oklch(0.74 0.13 155));
--vibeui-dashboard-052-bad:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.17 25));
--vibeui-dashboard-052-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-052"]{color-scheme:dark}
[data-vibeui-block="dashboard-052"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-052-bg);
color:var(--vibeui-dashboard-052-fg);
font-family:var(--vibeui-dashboard-052-sans);
border:1px solid var(--vibeui-dashboard-052-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-052"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-052"] [data-part="shell"]{display:grid;grid-template-columns:1fr;gap:0.875rem}
[data-vibeui-block="dashboard-052"] [data-part="head"]{
grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.75rem;
}
[data-vibeui-block="dashboard-052"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-052"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-052-muted)}
[data-vibeui-block="dashboard-052"] form{
display:grid;gap:0.625rem;align-self:start;padding:0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-052-card);
border:1px solid var(--vibeui-dashboard-052-border);
}
[data-vibeui-block="dashboard-052"] h3{margin:0;font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-052"] [data-part="field"]{display:grid;gap:0.25rem}
[data-vibeui-block="dashboard-052"] [data-part="label"]{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-dashboard-052-muted);
}
[data-vibeui-block="dashboard-052"] select{
font:inherit;font-size:0.8125rem;color:inherit;width:100%;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-052-border);background:var(--vibeui-dashboard-052-inset);
}
[data-vibeui-block="dashboard-052"] fieldset{border:0;margin:0;padding:0;min-width:0}
[data-vibeui-block="dashboard-052"] legend{
padding:0;margin:0 0 0.25rem;
font-size:0.6875rem;font-weight:650;color:var(--vibeui-dashboard-052-muted);
}
[data-vibeui-block="dashboard-052"] [data-part="formats"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="dashboard-052"] [data-part="pick"]{
display:inline-flex;align-items:center;gap:0.375rem;cursor:pointer;
padding:0.375rem 0.625rem;border-radius:0.5rem;font-size:0.75rem;font-weight:650;
border:1px solid var(--vibeui-dashboard-052-border);background:var(--vibeui-dashboard-052-inset);
}
[data-vibeui-block="dashboard-052"] [data-part="pick"]:has(input:checked){
border-color:var(--vibeui-dashboard-052-accent);
background:var(--vibeui-dashboard-052-soft);color:var(--vibeui-dashboard-052-accent);
}
[data-vibeui-block="dashboard-052"] [data-part="pick"]:has(input:focus-visible){
outline:2px solid var(--vibeui-dashboard-052-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-052"] [data-part="pick"] input{
margin:0;width:0.875rem;height:0.875rem;accent-color:var(--vibeui-dashboard-052-accent);
}
[data-vibeui-block="dashboard-052"] [data-part="create"]{
appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.8125rem;font-weight:700;padding:0.5625rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-052-accent);color:var(--vibeui-dashboard-052-on-accent);
}
[data-vibeui-block="dashboard-052"] [data-part="note"]{
margin:0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-dashboard-052-muted);
}
[data-vibeui-block="dashboard-052"] [data-part="jobs"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="dashboard-052"] article{
display:grid;grid-template-columns:1fr auto;gap:0.3125rem 0.75rem;align-items:center;
padding:0.75rem 0.875rem;
background:var(--vibeui-dashboard-052-card);
border:1px solid var(--vibeui-dashboard-052-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-052"] [data-part="name"]{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-052"] [data-part="asked"]{
grid-column:1;font-size:0.6875rem;color:var(--vibeui-dashboard-052-muted);
}
[data-vibeui-block="dashboard-052"] [data-part="state"]{
grid-column:2;grid-row:1;display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.6875rem;font-weight:750;white-space:nowrap;
}
[data-vibeui-block="dashboard-052"] [data-part="state"]::before{
content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;
box-shadow:inset 0 0 0 1.5px currentColor;
}
[data-vibeui-block="dashboard-052"] article[data-state="Готов"] [data-part="state"]{color:var(--vibeui-dashboard-052-ok)}
[data-vibeui-block="dashboard-052"] article[data-state="Готов"] [data-part="state"]::before{background:currentColor}
[data-vibeui-block="dashboard-052"] article[data-state="Готовится"] [data-part="state"]{color:var(--vibeui-dashboard-052-accent)}
[data-vibeui-block="dashboard-052"] article[data-state="В очереди"] [data-part="state"]{color:var(--vibeui-dashboard-052-muted)}
[data-vibeui-block="dashboard-052"] article[data-state="Просрочен"] [data-part="state"]{color:var(--vibeui-dashboard-052-muted)}
[data-vibeui-block="dashboard-052"] article[data-state="Просрочен"] [data-part="state"]::before{border-radius:0}
[data-vibeui-block="dashboard-052"] article[data-state="Ошибка"] [data-part="state"]{color:var(--vibeui-dashboard-052-bad)}
[data-vibeui-block="dashboard-052"] article[data-state="Ошибка"] [data-part="state"]::before{
background:currentColor;border-radius:0;transform:rotate(45deg);
}
[data-vibeui-block="dashboard-052"] [data-part="track"]{
grid-column:1/-1;height:0.3125rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-052-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-052-border);
}
[data-vibeui-block="dashboard-052"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;background:var(--vibeui-dashboard-052-accent);
}
[data-vibeui-block="dashboard-052"] [data-part="foot"]{
grid-column:1;display:flex;flex-wrap:wrap;gap:0.25rem 0.625rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-052-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-052"] [data-part="get"]{
grid-column:2;appearance:none;cursor:pointer;font:inherit;white-space:nowrap;
font-size:0.6875rem;font-weight:700;padding:0.375rem 0.6875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-052-border);
background:var(--vibeui-dashboard-052-card);color:var(--vibeui-dashboard-052-accent);
}
[data-vibeui-block="dashboard-052"] [data-part="get"][disabled]{
color:var(--vibeui-dashboard-052-muted);cursor:not-allowed;
}
[data-vibeui-block="dashboard-052"] :is(a,button,select):focus-visible{
outline:2px solid var(--vibeui-dashboard-052-accent);outline-offset:2px;
}
@container (min-width: 50rem){
[data-vibeui-block="dashboard-052"] [data-part="shell"]{grid-template-columns:19rem 1fr;gap:1rem}
}
`

const DEFAULT_JOBS: Dashboard052Job[] = [
  {
    name: "Клиенты и контакты, CSV",
    asked: "заказал Игорь Панов, сегодня в 12:04",
    state: "Готовится",
    progress: 62,
    size: "—",
    rows: "≈ 1 280 строк",
    expires: "ссылка будет жить 24 часа",
  },
  {
    name: "Операции за I квартал, XLSX",
    asked: "заказала Мария Соловьёва, сегодня в 11:20",
    state: "Готов",
    progress: 100,
    size: "18,4 МБ",
    rows: "42 118 строк",
    expires: "ссылка активна ещё 21 час",
  },
  {
    name: "Журнал действий за месяц, JSON",
    asked: "заказала Анна Реброва, вчера в 18:41",
    state: "Просрочен",
    progress: 100,
    size: "6,1 МБ",
    rows: "9 402 строки",
    expires: "срок ссылки истёк, закажите выгрузку заново",
  },
  {
    name: "Остатки по складам, CSV",
    asked: "заказал Пётр Хромов, вчера в 09:12",
    state: "Ошибка",
    progress: 34,
    size: "—",
    rows: "—",
    expires: "склад «В» не ответил, задание остановлено",
  },
]

const STATE_LABEL: Record<string, string> = {
  "В очереди": "В очереди",
  Готовится: "Готовится",
  Готов: "Готов",
  Просрочен: "Просрочен",
  Ошибка: "Ошибка",
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
 * Страница экспорта: форма заказа выгрузки и список заданий с прогрессом,
 * размером и сроком жизни ссылки. Один файл, ноль зависимостей, клиентского
 * JS нет.
 */
export function Dashboard052({
  title = "Экспорт данных",
  hint = "выгрузки готовятся в фоне и не занимают вкладку",
  datasets = [
    "Клиенты и контакты",
    "Операции и оплаты",
    "Остатки по складам",
    "Журнал действий",
  ],
  dataset = "Клиенты и контакты",
  formats = ["CSV", "XLSX", "JSON"],
  format = "CSV",
  range = "За I квартал",
  ranges = ["За месяц", "За I квартал", "За год", "Всё время"],
  jobs = DEFAULT_JOBS,
  createLabel = "Заказать выгрузку",
  downloadLabel = "Скачать",
  accent,
  background = "",
  formTitle = "Новая выгрузка",
  datasetLabel = "Что выгружаем",
  rangeLabel = "Период",
  formatLabel = "Формат файла",
  noteText = "Готовый файл появится в списке справа. Ссылка на скачивание живёт 24 часа, после этого выгрузку нужно заказать заново.",
  stateText = STATE_LABEL,
  progressAriaText = "{name}: готовность {value} процентов",
  className,
  style,
}: Dashboard052Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-052-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-052-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-052" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-052"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>

          <form>
            <h3>{formTitle}</h3>

            <p data-part="field">
              <label data-part="label" htmlFor="dashboard-052-dataset">
                {datasetLabel}
              </label>
              <select id="dashboard-052-dataset" defaultValue={dataset}>
                {datasets.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </p>

            <p data-part="field">
              <label data-part="label" htmlFor="dashboard-052-range">
                {rangeLabel}
              </label>
              <select id="dashboard-052-range" defaultValue={range}>
                {ranges.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </p>

            <fieldset>
              <legend>{formatLabel}</legend>
              <span data-part="formats">
                {formats.map((item) => (
                  <label key={item} data-part="pick">
                    <input
                      type="radio"
                      name="dashboard-052-format"
                      defaultChecked={item === format}
                    />
                    {item}
                  </label>
                ))}
              </span>
            </fieldset>

            <button type="button" data-part="create">
              {createLabel}
            </button>

            <p data-part="note">{noteText}</p>
          </form>

          <div data-part="jobs">
            {jobs.map((job) => (
              <article key={job.name} data-state={job.state}>
                <span data-part="name">{job.name}</span>
                <span data-part="state">
                  {stateText[job.state] ?? job.state}
                </span>
                <span data-part="asked">{job.asked}</span>

                <div
                  data-part="track"
                  role="progressbar"
                  aria-valuenow={job.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={progressAriaText
                    .replace("{name}", job.name)
                    .replace("{value}", String(job.progress))}
                >
                  <span
                    data-part="fill"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>

                <span data-part="foot">
                  <span>{job.rows}</span>
                  <span>{job.size}</span>
                  <span>{job.expires}</span>
                </span>

                <button
                  type="button"
                  data-part="get"
                  disabled={job.state !== "Готов"}
                >
                  {downloadLabel}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
