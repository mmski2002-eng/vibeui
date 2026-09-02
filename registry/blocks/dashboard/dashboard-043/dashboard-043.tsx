import type { CSSProperties } from "react"

export type Dashboard043Service = {
  name: string
  role: string
  state: "Работает" | "Сбои" | "Недоступен" | "Обслуживание"
  uptime: string
  latency: string
  days: number[]
}

export type Dashboard043Props = {
  title?: string
  overall?: string
  checked?: string
  services?: Dashboard043Service[]
  legend?: string
  historyLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подписи состояний: ключ — значение state у сервиса. */
  stateText?: Record<string, string>
  /** Подпись перед аптаймом. */
  uptimeLabel?: string
  /** Подпись перед откликом. */
  latencyLabel?: string
  /** Шаблон подписи ленты: {name} и {uptime}. */
  daysAriaText?: string
  /** Шаблон подсказки дня: {day} и {value}. */
  dayTitleText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: статусная доска, где у каждого сервиса не только текущее
// состояние, но и лента за тридцать дней. Каждый день — отдельный столбик с
// title, поэтому «когда именно было плохо» видно без графика и без единой
// зависимости. Значение дня переводится в высоту заливки, а не только в цвет:
// одинаково окрашенные столбики не отличают лёгкую деградацию от падения.
// Общее состояние вынесено в баннер с aria-live: оно меняется без
// перезагрузки и обязано прозвучать.
const STYLES = `
:where([data-vibeui-block="dashboard-043"]){
--vibeui-dashboard-043-bg:transparent;
/* Карточки сервисов: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-043-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 240));
--vibeui-dashboard-043-fg:light-dark(oklch(0.22 0.014 240),oklch(0.94 0.005 240));
--vibeui-dashboard-043-muted:light-dark(oklch(0.55 0.014 240),oklch(0.72 0.012 240));
--vibeui-dashboard-043-border:light-dark(oklch(0.91 0.006 240),oklch(0.36 0.012 240));
--vibeui-dashboard-043-ok:light-dark(oklch(0.58 0.13 155),oklch(0.75 0.14 155));
--vibeui-dashboard-043-warn:light-dark(oklch(0.66 0.15 70),oklch(0.81 0.14 70));
--vibeui-dashboard-043-bad:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.17 25));
--vibeui-dashboard-043-accent:light-dark(oklch(0.5 0.14 240),oklch(0.74 0.13 240));
/* Текст на заливке предупреждения: в тёмной ветке заливка светлая. */
--vibeui-dashboard-043-on-warn:light-dark(oklch(1 0 0),oklch(0.21 0.04 70));
--vibeui-dashboard-043-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-043"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-043-bg);
color:var(--vibeui-dashboard-043-fg);
font-family:var(--vibeui-dashboard-043-sans);
border:1px solid var(--vibeui-dashboard-043-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-043"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-043"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-043"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.75rem}
[data-vibeui-block="dashboard-043"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-043"] [data-part="checked"]{
margin:0 0 0 auto;font-size:0.6875rem;color:var(--vibeui-dashboard-043-muted);
}
[data-vibeui-block="dashboard-043"] [data-part="banner"]{
display:flex;align-items:center;gap:0.625rem;padding:0.75rem 0.875rem;border-radius:0.875rem;
background:color-mix(in oklab,var(--vibeui-dashboard-043-warn) 12%,var(--vibeui-dashboard-043-card));
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-043-warn) 45%,var(--vibeui-dashboard-043-card));
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-043"] [data-part="sign"]{
width:1.375rem;height:1.375rem;flex:none;border-radius:0.375rem;display:grid;place-items:center;
font-size:0.8125rem;font-weight:800;
background:var(--vibeui-dashboard-043-warn);color:var(--vibeui-dashboard-043-on-warn);
}
[data-vibeui-block="dashboard-043"] [data-part="list"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-043"] article{
display:grid;grid-template-columns:1fr;gap:0.5rem;padding:0.75rem 0.875rem;
background:var(--vibeui-dashboard-043-card);
border:1px solid var(--vibeui-dashboard-043-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-043"] [data-part="who"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.625rem}
[data-vibeui-block="dashboard-043"] h3{margin:0;font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-043"] [data-part="role"]{font-size:0.6875rem;color:var(--vibeui-dashboard-043-muted)}
[data-vibeui-block="dashboard-043"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-left:auto;
font-size:0.6875rem;font-weight:750;white-space:nowrap;
}
[data-vibeui-block="dashboard-043"] [data-part="dot"]{width:0.5rem;height:0.5rem;border-radius:50%;flex:none}
[data-vibeui-block="dashboard-043"] article[data-state="Работает"] [data-part="state"]{color:var(--vibeui-dashboard-043-ok)}
[data-vibeui-block="dashboard-043"] article[data-state="Работает"] [data-part="dot"]{background:var(--vibeui-dashboard-043-ok)}
[data-vibeui-block="dashboard-043"] article[data-state="Сбои"] [data-part="state"]{color:var(--vibeui-dashboard-043-warn)}
[data-vibeui-block="dashboard-043"] article[data-state="Сбои"] [data-part="dot"]{background:var(--vibeui-dashboard-043-warn);border-radius:0.125rem}
[data-vibeui-block="dashboard-043"] article[data-state="Недоступен"] [data-part="state"]{color:var(--vibeui-dashboard-043-bad)}
[data-vibeui-block="dashboard-043"] article[data-state="Недоступен"] [data-part="dot"]{
background:var(--vibeui-dashboard-043-bad);border-radius:0;transform:rotate(45deg);
}
[data-vibeui-block="dashboard-043"] article[data-state="Обслуживание"] [data-part="state"]{color:var(--vibeui-dashboard-043-muted)}
[data-vibeui-block="dashboard-043"] article[data-state="Обслуживание"] [data-part="dot"]{
background:transparent;box-shadow:inset 0 0 0 1.5px var(--vibeui-dashboard-043-muted);
}
[data-vibeui-block="dashboard-043"] [data-part="days"]{
display:flex;gap:0.125rem;align-items:flex-end;height:1.625rem;
}
[data-vibeui-block="dashboard-043"] [data-part="day"]{
flex:1 1 0;min-width:0.125rem;height:100%;border-radius:0.125rem;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-dashboard-043-ok) 16%,var(--vibeui-dashboard-043-card));
display:flex;align-items:flex-end;
}
[data-vibeui-block="dashboard-043"] [data-part="bar"]{
display:block;width:100%;border-radius:0.125rem;background:var(--vibeui-dashboard-043-ok);
}
[data-vibeui-block="dashboard-043"] [data-part="day"][data-level="warn"] [data-part="bar"]{background:var(--vibeui-dashboard-043-warn)}
[data-vibeui-block="dashboard-043"] [data-part="day"][data-level="bad"] [data-part="bar"]{background:var(--vibeui-dashboard-043-bad)}
[data-vibeui-block="dashboard-043"] [data-part="foot"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-043-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-043"] [data-part="foot"] b{color:var(--vibeui-dashboard-043-fg);font-weight:750}
[data-vibeui-block="dashboard-043"] [data-part="more"]{
margin-left:auto;font-weight:700;color:var(--vibeui-dashboard-043-accent);text-decoration:none;
}
[data-vibeui-block="dashboard-043"] [data-part="more"]:hover{text-decoration:underline}
[data-vibeui-block="dashboard-043"] [data-part="legend"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-043-muted);
}
[data-vibeui-block="dashboard-043"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-043-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-043"] article{
grid-template-columns:15rem 1fr;align-items:center;column-gap:1rem;
}
[data-vibeui-block="dashboard-043"] [data-part="who"]{flex-direction:column;align-items:flex-start;gap:0.125rem}
[data-vibeui-block="dashboard-043"] [data-part="state"]{margin-left:0}
[data-vibeui-block="dashboard-043"] [data-part="foot"]{grid-column:2}
}
`

function pattern(seed: number) {
  const days: number[] = []

  for (let index = 0; index < 30; index += 1) {
    const wave = Math.sin((index + seed) * 1.7) * 0.5 + 0.5
    days.push(Math.round(88 + wave * 12))
  }

  return days
}

const DEFAULT_SERVICES: Dashboard043Service[] = [
  {
    name: "Веб-приложение",
    role: "app.kontur.ru",
    state: "Работает",
    uptime: "99,98 %",
    latency: "184 мс",
    days: pattern(1),
  },
  {
    name: "Платёжный шлюз",
    role: "pay.kontur.ru",
    state: "Сбои",
    uptime: "99,41 %",
    latency: "1 240 мс",
    days: [...pattern(2).slice(0, 26), 74, 61, 68, 72],
  },
  {
    name: "Складской API",
    role: "api.kontur.ru/stock",
    state: "Работает",
    uptime: "99,95 %",
    latency: "96 мс",
    days: pattern(4),
  },
  {
    name: "Отчёты и выгрузки",
    role: "reports.kontur.ru",
    state: "Обслуживание",
    uptime: "99,80 %",
    latency: "— ",
    days: [...pattern(6).slice(0, 29), 80],
  },
]

const STATE_LABEL: Record<string, string> = {
  Работает: "Работает",
  Сбои: "Сбои",
  Недоступен: "Недоступен",
  Обслуживание: "Обслуживание",
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
 * Экран мониторинга: баннер общего состояния, список сервисов со статусом,
 * аптаймом и лентой за тридцать дней. Один файл, ноль зависимостей,
 * клиентского JS нет.
 */
export function Dashboard043({
  title = "Состояние сервисов",
  overall = "Частичная деградация: платёжный шлюз отвечает медленно",
  checked = "проверено 40 секунд назад",
  services = DEFAULT_SERVICES,
  legend = "Каждый столбик — сутки. Высота показывает долю успешных проверок за день, наведение раскрывает точное значение.",
  historyLabel = "История",
  accent,
  background = "",
  stateText = STATE_LABEL,
  uptimeLabel = "аптайм за 30 дней",
  latencyLabel = "отклик",
  daysAriaText = "{name}: доступность за 30 дней, итог {uptime}",
  dayTitleText = "День {day}: {value} % успешных проверок",
  className,
  style,
}: Dashboard043Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-043-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-043-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-043" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-043"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="checked">{checked}</p>
          </div>

          <p data-part="banner" aria-live="polite">
            <span data-part="sign" aria-hidden="true">
              !
            </span>
            {overall}
          </p>

          <div data-part="list">
            {services.map((service) => (
              <article key={service.name} data-state={service.state}>
                <div data-part="who">
                  <h3>{service.name}</h3>
                  <span data-part="role">{service.role}</span>
                  <span data-part="state">
                    <span data-part="dot" aria-hidden="true" />
                    {stateText[service.state] ?? service.state}
                  </span>
                </div>

                <div
                  data-part="days"
                  role="img"
                  aria-label={daysAriaText
                    .replace("{name}", service.name)
                    .replace("{uptime}", service.uptime)}
                >
                  {service.days.map((value, index) => (
                    <span
                      key={index}
                      data-part="day"
                      data-level={
                        value < 80 ? "bad" : value < 95 ? "warn" : "ok"
                      }
                      title={dayTitleText
                        .replace("{day}", String(index + 1))
                        .replace("{value}", String(value))}
                    >
                      <span data-part="bar" style={{ height: `${value}%` }} />
                    </span>
                  ))}
                </div>

                <p data-part="foot">
                  <span>
                    {uptimeLabel} <b>{service.uptime}</b>
                  </span>
                  <span>
                    {latencyLabel} <b>{service.latency}</b>
                  </span>
                  <a href="#dashboard-043" data-part="more">
                    {historyLabel}
                  </a>
                </p>
              </article>
            ))}
          </div>

          <p data-part="legend">{legend}</p>
        </div>
      </section>
    </>
  )
}
