import type { CSSProperties } from "react"

export type Dashboard074Recipe = {
  name: string
  when: string
  ifText: string
  then: string[]
  runs: number
  lastRun: string
  enabled: boolean
  failing?: string
}

export type Dashboard074Props = {
  title?: string
  subtitle?: string
  recipes?: Dashboard074Recipe[]
  newLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подписи тумблера по ключам on и off. */
  stateText?: Record<string, string>
  /** Заголовки шагов по ключам when, if и then. */
  stepText?: Record<string, string>
  /** Счётчик срабатываний: {runs}. */
  runsText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: сценарий автоматизации читается как предложение «когда — если —
// то», и именно так он тут и нарисован: три шага в ряд со стрелками между
// ними, а не свёрнутое название вроде «Эскалация №4». Действий может быть
// несколько, поэтому третий шаг — список: спрятав второе действие, интерфейс
// заставляет открывать сценарий ради проверки. Счётчик срабатываний за месяц
// и время последнего запуска стоят рядом с тумблером: включённый сценарий,
// не сработавший ни разу, — это либо мёртвое условие, либо ошибка, и её
// подписывают прямо в карточке.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-074"]){
--vibeui-dashboard-074-bg:transparent;
/* Карточка сценария и плашка шага: подложка самого блока прозрачна. */
--vibeui-dashboard-074-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 200));
--vibeui-dashboard-074-inset:light-dark(oklch(0.985 0.003 200),oklch(0.22 0.012 200));
--vibeui-dashboard-074-fg:light-dark(oklch(0.21 0.014 200),oklch(0.94 0.005 200));
--vibeui-dashboard-074-muted:light-dark(oklch(0.54 0.014 200),oklch(0.72 0.012 200));
--vibeui-dashboard-074-border:light-dark(oklch(0.91 0.006 200),oklch(0.36 0.012 200));
--vibeui-dashboard-074-accent:light-dark(oklch(0.55 0.13 39.8),oklch(0.74 0.12 39.8));
--vibeui-dashboard-074-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-074-knob:light-dark(oklch(1 0 0),oklch(0.93 0.004 200));
--vibeui-dashboard-074-soft:light-dark(oklch(0.965 0.02 200),oklch(0.3 0.035 39.8));
--vibeui-dashboard-074-when:light-dark(oklch(0.55 0.14 39.8),oklch(0.76 0.13 39.8));
--vibeui-dashboard-074-if:light-dark(oklch(0.52 0.11 39.8),oklch(0.8 0.12 39.8));
--vibeui-dashboard-074-then:light-dark(oklch(0.5 0.13 39.8),oklch(0.76 0.13 39.8));
--vibeui-dashboard-074-fail:light-dark(oklch(0.57 0.19 25),oklch(0.75 0.16 25));
--vibeui-dashboard-074-fail-line:light-dark(oklch(0.82 0.08 25),oklch(0.5 0.11 25));
--vibeui-dashboard-074-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-074"]{color-scheme:dark}
[data-vibeui-block="dashboard-074"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-074-bg);
color:var(--vibeui-dashboard-074-fg);
font-family:var(--vibeui-dashboard-074-sans);
border:1px solid var(--vibeui-dashboard-074-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-074"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-074"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-074"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-074"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-074"] [data-part="sub"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-074-muted);max-width:52ch}
[data-vibeui-block="dashboard-074"] [data-part="new"]{
margin-left:auto;appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:700;padding:0.4375rem 0.875rem;border-radius:0.5625rem;
background:var(--vibeui-dashboard-074-accent);color:var(--vibeui-dashboard-074-on-accent);
}
[data-vibeui-block="dashboard-074"] [data-part="list"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-074"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.5rem;padding:0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-074-card);border:1px solid var(--vibeui-dashboard-074-border);
}
[data-vibeui-block="dashboard-074"] [data-part="card"][data-enabled="false"] [data-part="flow"]{opacity:0.5}
[data-vibeui-block="dashboard-074"] [data-part="card"][data-failing="true"]{border-color:var(--vibeui-dashboard-074-fail-line)}
[data-vibeui-block="dashboard-074"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.625rem}
[data-vibeui-block="dashboard-074"] h3{margin:0;font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-074"] [data-part="switch"]{
margin-left:auto;display:inline-flex;align-items:center;gap:0.4375rem;cursor:pointer;
font-size:0.6875rem;font-weight:700;color:var(--vibeui-dashboard-074-muted);white-space:nowrap;
}
[data-vibeui-block="dashboard-074"] [data-part="switch"] input{
appearance:none;margin:0;width:2rem;height:1.125rem;border-radius:9999px;cursor:pointer;position:relative;
background:var(--vibeui-dashboard-074-border);transition:background 0.15s ease;
}
[data-vibeui-block="dashboard-074"] [data-part="switch"] input::after{
content:"";position:absolute;top:0.1875rem;left:0.1875rem;width:0.75rem;height:0.75rem;
border-radius:50%;background:var(--vibeui-dashboard-074-knob);transition:transform 0.15s ease;
}
[data-vibeui-block="dashboard-074"] [data-part="switch"] input:checked{background:var(--vibeui-dashboard-074-accent)}
[data-vibeui-block="dashboard-074"] [data-part="switch"] input:checked::after{transform:translateX(0.875rem)}
[data-vibeui-block="dashboard-074"] [data-part="flow"]{display:grid;grid-template-columns:1fr;gap:0.375rem;align-items:stretch}
[data-vibeui-block="dashboard-074"] [data-part="step"]{
display:flex;flex-direction:column;gap:0.1875rem;padding:0.5625rem 0.6875rem;border-radius:0.6875rem;
background:var(--vibeui-dashboard-074-inset);border:1px solid var(--vibeui-dashboard-074-border);
}
[data-vibeui-block="dashboard-074"] [data-part="step"] b{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.07em;
}
[data-vibeui-block="dashboard-074"] [data-step="when"] b{color:var(--vibeui-dashboard-074-when)}
[data-vibeui-block="dashboard-074"] [data-step="if"] b{color:var(--vibeui-dashboard-074-if)}
[data-vibeui-block="dashboard-074"] [data-step="then"] b{color:var(--vibeui-dashboard-074-then)}
[data-vibeui-block="dashboard-074"] [data-part="step"] span{font-size:0.75rem;line-height:1.4}
[data-vibeui-block="dashboard-074"] [data-part="step"] ul{margin:0;padding-left:0.9375rem;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="dashboard-074"] [data-part="step"] li{font-size:0.75rem;line-height:1.4}
[data-vibeui-block="dashboard-074"] [data-part="arrow"]{
display:none;align-self:center;color:var(--vibeui-dashboard-074-muted);font-size:0.875rem;
}
[data-vibeui-block="dashboard-074"] [data-part="foot"]{
margin:0;display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;font-size:0.6875rem;
color:var(--vibeui-dashboard-074-muted);
}
[data-vibeui-block="dashboard-074"] [data-part="foot"] b{color:var(--vibeui-dashboard-074-fg);font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-074"] [data-part="fail"]{color:var(--vibeui-dashboard-074-fail);font-weight:700}
[data-vibeui-block="dashboard-074"] :is(a,button,input,label):focus-visible{
outline:2px solid var(--vibeui-dashboard-074-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-074"] [data-part="flow"]{grid-template-columns:1fr auto 1fr auto 1.4fr}
[data-vibeui-block="dashboard-074"] [data-part="arrow"]{display:block}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-074"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_RECIPES: Dashboard074Recipe[] = [
  {
    name: "Эскалация зависших заявок",
    when: "заявка не меняет этап 48 часов",
    ifText: "сумма больше 300 000 ₽ и исполнитель назначен",
    then: [
      "поднять приоритет до высокого",
      "добавить руководителя отдела наблюдателем",
      "отправить письмо исполнителю",
    ],
    runs: 214,
    lastRun: "сработал 40 минут назад",
    enabled: true,
  },
  {
    name: "Приветствие новому клиенту",
    when: "создан клиент",
    ifText: "источник — форма на сайте",
    then: [
      "отправить письмо «Спасибо за заявку»",
      "поставить задачу менеджеру",
    ],
    runs: 1288,
    lastRun: "сработал 6 минут назад",
    enabled: true,
  },
  {
    name: "Возврат уходящих",
    when: "клиент не заходил 30 дней",
    ifText: "тариф платный и оплата продлится через 21 день",
    then: [
      "добавить в сегмент «Риск оттока»",
      "запустить цепочку из трёх писем",
    ],
    runs: 0,
    lastRun: "ни разу за 30 дней",
    enabled: true,
    failing: "условие не выполнялось ни разу — проверьте порог в 30 дней",
  },
  {
    name: "Архив закрытых заявок",
    when: "заявка закрыта",
    ifText: "прошло 90 дней после закрытия",
    then: ["перенести в архив", "снять с исполнителя"],
    runs: 640,
    lastRun: "выключен 12 мая",
    enabled: false,
  },
]

const STATE_TEXT: Record<string, string> = {
  on: "включён",
  off: "выключен",
}

const STEP_TEXT: Record<string, string> = {
  when: "Когда",
  if: "Если",
  then: "То",
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
 * Экран сценариев автоматизации: каждый сценарий читается как «когда — если —
 * то» тремя шагами со стрелками, действия перечислены полностью, рядом
 * счётчик срабатываний. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard074({
  title = "Сценарии автоматизации",
  subtitle = "Сценарии срабатывают в порядке создания; повторный запуск для одной записи не чаще раза в час.",
  recipes = DEFAULT_RECIPES,
  newLabel = "Новый сценарий",
  accent,
  background = "",
  stateText = STATE_TEXT,
  stepText = STEP_TEXT,
  runsText = "срабатываний за 30 дней: {runs}",
  className,
  style,
}: Dashboard074Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-074-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-074-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const state = { ...STATE_TEXT, ...stateText }
  const step = { ...STEP_TEXT, ...stepText }
  // Число срабатываний выделено жирным, поэтому шаблон разрезается по метке.
  const [runsBefore, runsAfter = ""] = runsText.split("{runs}")

  return (
    <>
      <style href="vibeui-dashboard-074" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-074"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="sub">{subtitle}</p>
            <button type="button" data-part="new">
              {newLabel}
            </button>
          </div>

          <ul data-part="list">
            {recipes.map((recipe) => (
              <li
                key={recipe.name}
                data-part="card"
                data-enabled={recipe.enabled}
                data-failing={Boolean(recipe.failing)}
              >
                <div data-part="top">
                  <h3>{recipe.name}</h3>
                  <label data-part="switch">
                    <input type="checkbox" defaultChecked={recipe.enabled} />
                    {recipe.enabled ? state.on : state.off}
                  </label>
                </div>

                <div data-part="flow">
                  <div data-part="step" data-step="when">
                    <b>{step.when}</b>
                    <span>{recipe.when}</span>
                  </div>
                  <span data-part="arrow" aria-hidden="true">
                    →
                  </span>
                  <div data-part="step" data-step="if">
                    <b>{step.if}</b>
                    <span>{recipe.ifText}</span>
                  </div>
                  <span data-part="arrow" aria-hidden="true">
                    →
                  </span>
                  <div data-part="step" data-step="then">
                    <b>{step.then}</b>
                    <ul>
                      {recipe.then.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p data-part="foot">
                  <span>
                    {runsBefore}
                    <b>{recipe.runs}</b>
                    {runsAfter}
                  </span>
                  <span>{recipe.lastRun}</span>
                  {recipe.failing ? (
                    <span data-part="fail">{recipe.failing}</span>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
