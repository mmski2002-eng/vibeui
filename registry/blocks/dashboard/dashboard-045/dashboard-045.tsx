import type { CSSProperties } from "react"

export type Dashboard045Plan = {
  name: string
  when: string
  keep: string
  on: boolean
}

export type Dashboard045Point = {
  stamp: string
  kind: "Полный" | "Разностный"
  size: string
  spent: string
  state: "Готов" | "Проверяется" | "С ошибкой"
}

export type Dashboard045Props = {
  title?: string
  nextRun?: string
  usedGb?: number
  quotaGb?: number
  plans?: Dashboard045Plan[]
  points?: Dashboard045Point[]
  restoreLabel?: string
  runLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Заголовок таблицы точек восстановления. */
  pointsTitle?: string
  /** Заголовок панели расписаний. */
  plansTitle?: string
  /** Подпись полосы занятого места. */
  storageLabel?: string
  /** Шаблон дроби хранилища: {used} и {quota}. */
  usedText?: string
  /** Шаблон подписи полосы: {value}. */
  quotaAriaText?: string
  /** Шаблон подписи переключателя: {name}. */
  planAriaText?: string
  /** Заголовки колонок таблицы по ключам. */
  columnsText?: Record<string, string>
  /** Подписи типов копии: ключ — значение kind. */
  kindText?: Record<string, string>
  /** Подписи состояний: ключ — значение state. */
  stateText?: Record<string, string>
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: экран резервных копий, где расписание и точки восстановления
// стоят рядом. Расписания — переключатели на нативных чекбоксах: выключенное
// правило остаётся видимым, а не исчезает из списка, иначе о нём забывают.
// Занятое место показано полосой и дробью «использовано из»: полоса отвечает
// за запас, дробь — за точность. У каждой точки восстановления есть кнопка
// восстановления рядом со строкой, потому что это действие ищут именно здесь,
// а не в общем меню.
const STYLES = `
:where([data-vibeui-block="dashboard-045"]){
--vibeui-dashboard-045-bg:transparent;
/* Панели и жёлоб полосы: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-045-card:light-dark(oklch(1 0 0),oklch(0.26 0 230));
--vibeui-dashboard-045-track:light-dark(oklch(0.96 0 230),oklch(0.21 0 230));
--vibeui-dashboard-045-fg:light-dark(oklch(0.22 0 230),oklch(0.94 0 230));
--vibeui-dashboard-045-muted:light-dark(oklch(0.55 0 230),oklch(0.72 0 230));
--vibeui-dashboard-045-border:light-dark(oklch(0.91 0 230),oklch(0.36 0 230));
--vibeui-dashboard-045-accent:light-dark(oklch(0.5 0.14 230),oklch(0.74 0.13 230));
--vibeui-dashboard-045-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 230));
--vibeui-dashboard-045-soft:light-dark(oklch(0.96 0 230),oklch(0.32 0.045 230));
--vibeui-dashboard-045-bad:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.17 25));
--vibeui-dashboard-045-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dashboard-045-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-045"]{color-scheme:dark}
[data-vibeui-block="dashboard-045"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-045-bg);
color:var(--vibeui-dashboard-045-fg);
font-family:var(--vibeui-dashboard-045-sans);
border:1px solid var(--vibeui-dashboard-045-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-045"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-045"] [data-part="shell"]{display:grid;grid-template-columns:1fr;gap:0.875rem}
[data-vibeui-block="dashboard-045"] [data-part="head"]{
grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem 0.875rem;
}
[data-vibeui-block="dashboard-045"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-045"] [data-part="next"]{
margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-045-muted);
}
[data-vibeui-block="dashboard-045"] [data-part="run"]{
appearance:none;border:0;cursor:pointer;font:inherit;margin-left:auto;
font-size:0.8125rem;font-weight:700;padding:0.5rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-045-accent);color:var(--vibeui-dashboard-045-on-accent);
}
[data-vibeui-block="dashboard-045"] [data-part="quota"]{
grid-column:1/-1;display:grid;gap:0.3125rem;padding:0.75rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-045-card);
border:1px solid var(--vibeui-dashboard-045-border);
}
[data-vibeui-block="dashboard-045"] [data-part="cap"]{
display:flex;flex-wrap:wrap;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="dashboard-045"] [data-part="cap"] span:last-child{
color:var(--vibeui-dashboard-045-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-045"] [data-part="track"]{
height:0.4375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-045-track);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-045-border);
}
[data-vibeui-block="dashboard-045"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;background:var(--vibeui-dashboard-045-accent);
}
[data-vibeui-block="dashboard-045"] :is([data-part="panel"],[data-part="side"]){
background:var(--vibeui-dashboard-045-card);
border:1px solid var(--vibeui-dashboard-045-border);border-radius:0.875rem;padding:0.875rem;
align-self:start;
/* Грид-ячейка иначе наследует авто-минимум своего содержимого: широкая
   таблица внутри раздвигает всю колонку шире экрана вместо прокрутки внутри. */
min-width:0;
}
[data-vibeui-block="dashboard-045"] h3{margin:0 0 0.625rem;font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-045"] [data-part="plan"]{
display:grid;grid-template-columns:1fr auto;gap:0.125rem 0.75rem;align-items:center;
padding:0.5rem 0;border-top:1px solid var(--vibeui-dashboard-045-border);
}
[data-vibeui-block="dashboard-045"] [data-part="plan"]:first-of-type{border-top:0;padding-top:0}
[data-vibeui-block="dashboard-045"] [data-part="pname"]{font-size:0.8125rem;font-weight:700}
[data-vibeui-block="dashboard-045"] [data-part="pwhen"]{
font-size:0.6875rem;color:var(--vibeui-dashboard-045-muted);
}
/* Переключатель — нативный чекбокс: состояние, клавиатура и форма даром. */
[data-vibeui-block="dashboard-045"] [data-part="switch"]{
grid-column:2;grid-row:1/3;position:relative;width:2.125rem;height:1.25rem;flex:none;
border-radius:9999px;background:var(--vibeui-dashboard-045-border);
}
[data-vibeui-block="dashboard-045"] [data-part="switch"] input{
position:absolute;inset:0;margin:0;opacity:0;cursor:pointer;width:100%;height:100%;
}
[data-vibeui-block="dashboard-045"] [data-part="knob"]{
position:absolute;top:0.1875rem;left:0.1875rem;width:0.875rem;height:0.875rem;border-radius:50%;
background:var(--vibeui-dashboard-045-card);transition:left .16s ease;
}
[data-vibeui-block="dashboard-045"] [data-part="switch"]:has(input:checked){background:var(--vibeui-dashboard-045-accent)}
[data-vibeui-block="dashboard-045"] [data-part="switch"]:has(input:checked) [data-part="knob"]{left:1.0625rem}
[data-vibeui-block="dashboard-045"] [data-part="switch"]:has(input:focus-visible){
outline:2px solid var(--vibeui-dashboard-045-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-045"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="dashboard-045"] table{width:100%;min-width:26rem;border-collapse:collapse}
[data-vibeui-block="dashboard-045"] th{
text-align:left;font-size:0.625rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-dashboard-045-muted);padding:0 0.5rem 0.4375rem 0;white-space:nowrap;
}
[data-vibeui-block="dashboard-045"] td{
padding:0.5rem 0.5rem 0.5rem 0;font-size:0.75rem;
border-top:1px solid var(--vibeui-dashboard-045-border);vertical-align:middle;
}
[data-vibeui-block="dashboard-045"] [data-part="stamp"]{font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="dashboard-045"] [data-part="kind"]{
display:inline-block;padding:0.0625rem 0.375rem;border-radius:0.3125rem;
font-family:var(--vibeui-dashboard-045-mono);font-size:0.625rem;font-weight:700;
background:var(--vibeui-dashboard-045-soft);color:var(--vibeui-dashboard-045-accent);
}
[data-vibeui-block="dashboard-045"] [data-part="size"]{font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="dashboard-045"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.3125rem;font-weight:650;white-space:nowrap;
}
[data-vibeui-block="dashboard-045"] [data-part="state"]::before{
content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;background:currentColor;
}
[data-vibeui-block="dashboard-045"] tr[data-state="Проверяется"] [data-part="state"]{color:var(--vibeui-dashboard-045-muted)}
[data-vibeui-block="dashboard-045"] tr[data-state="Проверяется"] [data-part="state"]::before{
background:transparent;box-shadow:inset 0 0 0 1.5px currentColor;
}
[data-vibeui-block="dashboard-045"] tr[data-state="С ошибкой"] [data-part="state"]{color:var(--vibeui-dashboard-045-bad)}
[data-vibeui-block="dashboard-045"] tr[data-state="С ошибкой"] [data-part="state"]::before{border-radius:0}
[data-vibeui-block="dashboard-045"] [data-part="restore"]{
appearance:none;cursor:pointer;font:inherit;white-space:nowrap;
font-size:0.6875rem;font-weight:700;padding:0.3125rem 0.625rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-dashboard-045-border);
background:var(--vibeui-dashboard-045-card);color:var(--vibeui-dashboard-045-accent);
}
[data-vibeui-block="dashboard-045"] [data-part="restore"][disabled]{
color:var(--vibeui-dashboard-045-muted);cursor:not-allowed;
}
[data-vibeui-block="dashboard-045"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-045-accent);outline-offset:2px;
}
@container (min-width: 50rem){
[data-vibeui-block="dashboard-045"] [data-part="shell"]{
grid-template-columns:1fr 18rem;gap:1rem;
grid-template-areas:"head head" "table quota" "table plans";
}
[data-vibeui-block="dashboard-045"] [data-part="head"]{grid-area:head}
[data-vibeui-block="dashboard-045"] [data-part="quota"]{grid-area:quota;grid-column:auto}
[data-vibeui-block="dashboard-045"] [data-part="panel"]{grid-area:table}
[data-vibeui-block="dashboard-045"] [data-part="side"]{grid-area:plans}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-045"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS: Dashboard045Plan[] = [
  {
    name: "Ежедневная копия",
    when: "каждый день в 03:00",
    keep: "хранить 30 дней",
    on: true,
  },
  {
    name: "Недельная полная",
    when: "по воскресеньям в 01:00",
    keep: "хранить 12 недель",
    on: true,
  },
  {
    name: "Копия перед обновлением",
    when: "при выкатке новой версии",
    keep: "хранить 7 дней",
    on: false,
  },
]

const DEFAULT_POINTS: Dashboard045Point[] = [
  {
    stamp: "17 марта, 03:00",
    kind: "Разностный",
    size: "1,8 ГБ",
    spent: "4 мин",
    state: "Готов",
  },
  {
    stamp: "16 марта, 03:00",
    kind: "Разностный",
    size: "2,1 ГБ",
    spent: "5 мин",
    state: "Готов",
  },
  {
    stamp: "15 марта, 03:00",
    kind: "Разностный",
    size: "1,9 ГБ",
    spent: "4 мин",
    state: "Проверяется",
  },
  {
    stamp: "14 марта, 01:00",
    kind: "Полный",
    size: "24,6 ГБ",
    spent: "38 мин",
    state: "Готов",
  },
  {
    stamp: "13 марта, 03:00",
    kind: "Разностный",
    size: "—",
    spent: "прервано",
    state: "С ошибкой",
  },
]

const COLUMN_LABEL: Record<string, string> = {
  when: "Когда",
  kind: "Тип",
  size: "Размер",
  state: "Состояние",
  action: "Действие",
}

const KIND_LABEL: Record<string, string> = {
  Полный: "Полный",
  Разностный: "Разностный",
}

const STATE_LABEL: Record<string, string> = {
  Готов: "Готов",
  Проверяется: "Проверяется",
  "С ошибкой": "С ошибкой",
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
 * Экран резервных копий: расписания переключателями, занятое место полосой и
 * таблица точек восстановления с действием в строке. Один файл, ноль
 * зависимостей, клиентского JS нет.
 */
export function Dashboard045({
  title = "Резервные копии",
  nextRun = "следующий запуск сегодня в 03:00",
  usedGb = 118,
  quotaGb = 200,
  plans = DEFAULT_PLANS,
  points = DEFAULT_POINTS,
  restoreLabel = "Восстановить",
  runLabel = "Сделать копию сейчас",
  accent,
  background = "",
  pointsTitle = "Точки восстановления",
  plansTitle = "Расписание",
  storageLabel = "Занято в хранилище",
  usedText = "{used} из {quota} ГБ",
  quotaAriaText = "Хранилище занято на {value} процентов",
  planAriaText = "Расписание «{name}»",
  columnsText = COLUMN_LABEL,
  kindText = KIND_LABEL,
  stateText = STATE_LABEL,
  className,
  style,
}: Dashboard045Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-045-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-045-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const share = Math.min(100, Math.round((usedGb / quotaGb) * 100))

  return (
    <>
      <style href="vibeui-dashboard-045" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-045"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="next">{nextRun}</p>
            <button type="button" data-part="run">
              {runLabel}
            </button>
          </div>

          <div data-part="quota">
            <p data-part="cap">
              <span>{storageLabel}</span>
              <span>
                {usedText
                  .replace("{used}", String(usedGb))
                  .replace("{quota}", String(quotaGb))}
              </span>
            </p>
            <div
              data-part="track"
              role="progressbar"
              aria-valuenow={share}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={quotaAriaText.replace("{value}", String(share))}
            >
              <span data-part="fill" style={{ width: `${share}%` }} />
            </div>
          </div>

          <div data-part="panel">
            <h3>{pointsTitle}</h3>
            <div data-part="scroll">
              <table>
                <caption hidden>{pointsTitle}</caption>
                <thead>
                  <tr>
                    <th scope="col">{columnsText.when ?? COLUMN_LABEL.when}</th>
                    <th scope="col">{columnsText.kind ?? COLUMN_LABEL.kind}</th>
                    <th scope="col">{columnsText.size ?? COLUMN_LABEL.size}</th>
                    <th scope="col">
                      {columnsText.state ?? COLUMN_LABEL.state}
                    </th>
                    <th scope="col">
                      <span hidden>
                        {columnsText.action ?? COLUMN_LABEL.action}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.stamp} data-state={point.state}>
                      <td data-part="stamp">{point.stamp}</td>
                      <td>
                        <span data-part="kind">
                          {kindText[point.kind] ?? point.kind}
                        </span>
                      </td>
                      <td data-part="size">
                        {point.size} · {point.spent}
                      </td>
                      <td>
                        <span data-part="state">
                          {stateText[point.state] ?? point.state}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          data-part="restore"
                          disabled={point.state !== "Готов"}
                        >
                          {restoreLabel}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div data-part="side">
            <h3>{plansTitle}</h3>
            {plans.map((plan) => (
              <div key={plan.name} data-part="plan">
                <span data-part="pname">{plan.name}</span>
                <span data-part="pwhen">
                  {plan.when} · {plan.keep}
                </span>
                <span data-part="switch">
                  <input
                    type="checkbox"
                    defaultChecked={plan.on}
                    aria-label={planAriaText.replace("{name}", plan.name)}
                  />
                  <span data-part="knob" aria-hidden="true" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
