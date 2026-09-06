import type { CSSProperties } from "react"

export type Dashboard048Delivery = {
  stamp: string
  event: string
  code: number
  status: "Доставлено" | "Повтор" | "Отклонено"
  spent: string
  attempt: string
  body: string
}

export type Dashboard048Props = {
  title?: string
  endpoint?: string
  secret?: string
  events?: string[]
  successRate?: string
  deliveries?: Dashboard048Delivery[]
  resendLabel?: string
  secretLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись перед маской секрета. */
  secretHint?: string
  /** Подпись списка отправляемых событий. */
  eventsLabel?: string
  /** Заголовок журнала доставки. */
  logTitle?: string
  /** Уточнение рядом с заголовком журнала. */
  logHint?: string
  /** Шаблон подсказки кода ответа: {code}. */
  codeTitleText?: string
  /** Подписи состояний: ключ — значение status. */
  statusText?: Record<string, string>
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: история доставки вебхуков, где каждая попытка раскрывается на
// месте через <details>: тело ответа нужно редко, но когда нужно — открывать
// отдельную страницу дорого, а состояние раскрытия при этом держит браузер.
// Код ответа набран моноширинным шрифтом и подписан словом: «502» без
// «Отклонено» читают только те, кто и так знает. Секрет показан маской с
// кнопкой — открытый секрет на экране попадает в скриншоты и записи демо.
const STYLES = `
:where([data-vibeui-block="dashboard-048"]){
--vibeui-dashboard-048-bg:transparent;
/* Панели и врезки: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-048-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 200));
--vibeui-dashboard-048-inset:light-dark(oklch(0.97 0.004 200),oklch(0.22 0.012 200));
--vibeui-dashboard-048-fg:light-dark(oklch(0.22 0.014 200),oklch(0.94 0.005 200));
--vibeui-dashboard-048-muted:light-dark(oklch(0.55 0.014 200),oklch(0.72 0.012 200));
--vibeui-dashboard-048-border:light-dark(oklch(0.91 0.006 200),oklch(0.36 0.012 200));
--vibeui-dashboard-048-accent:light-dark(oklch(0.55 0.13 39.8),oklch(0.75 0.12 39.8));
--vibeui-dashboard-048-soft:light-dark(oklch(0.96 0.02 200),oklch(0.32 0.04 39.8));
--vibeui-dashboard-048-ok:light-dark(oklch(0.56 0.13 155),oklch(0.74 0.13 155));
--vibeui-dashboard-048-warn:light-dark(oklch(0.66 0.15 70),oklch(0.81 0.13 70));
--vibeui-dashboard-048-bad:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.17 25));
/* Тело ответа остаётся тёмной консолью в обеих темах — это вывод, не текст. */
--vibeui-dashboard-048-ink:light-dark(oklch(0.26 0.02 200),oklch(0.19 0.014 200));
--vibeui-dashboard-048-on-ink:light-dark(oklch(0.93 0.01 200),oklch(0.9 0.012 200));
/* Текст на цветной плашке кода: в тёмной ветке плашки светлее фона. */
--vibeui-dashboard-048-on-fill:light-dark(oklch(1 0 0),oklch(0.19 0.03 200));
--vibeui-dashboard-048-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dashboard-048-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-048"]{color-scheme:dark}
[data-vibeui-block="dashboard-048"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-048-bg);
color:var(--vibeui-dashboard-048-fg);
font-family:var(--vibeui-dashboard-048-sans);
border:1px solid var(--vibeui-dashboard-048-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-048"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-048"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-048"] [data-part="head"]{
display:grid;gap:0.5rem;padding:0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-048-card);
border:1px solid var(--vibeui-dashboard-048-border);
}
[data-vibeui-block="dashboard-048"] [data-part="top"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;
}
[data-vibeui-block="dashboard-048"] h2{margin:0;font-size:1rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-048"] [data-part="rate"]{
margin-left:auto;font-size:0.6875rem;font-weight:750;padding:0.1875rem 0.5rem;border-radius:9999px;
color:var(--vibeui-dashboard-048-ok);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-048-ok) 40%,var(--vibeui-dashboard-048-card));
background:color-mix(in oklab,var(--vibeui-dashboard-048-ok) 12%,var(--vibeui-dashboard-048-card));
}
[data-vibeui-block="dashboard-048"] [data-part="url"]{
display:block;font-family:var(--vibeui-dashboard-048-mono);font-size:0.75rem;
padding:0.4375rem 0.625rem;border-radius:0.5rem;overflow-wrap:anywhere;
background:var(--vibeui-dashboard-048-inset);
border:1px solid var(--vibeui-dashboard-048-border);
}
[data-vibeui-block="dashboard-048"] [data-part="secret"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;font-size:0.75rem;
}
[data-vibeui-block="dashboard-048"] [data-part="mask"]{
font-family:var(--vibeui-dashboard-048-mono);letter-spacing:0.08em;
padding:0.1875rem 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-dashboard-048-inset);
border:1px solid var(--vibeui-dashboard-048-border);
}
[data-vibeui-block="dashboard-048"] [data-part="show"]{
appearance:none;cursor:pointer;font:inherit;
font-size:0.6875rem;font-weight:700;padding:0.25rem 0.5625rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-dashboard-048-border);
background:var(--vibeui-dashboard-048-card);color:var(--vibeui-dashboard-048-accent);
}
[data-vibeui-block="dashboard-048"] [data-part="tags"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-048"] [data-part="tags"] li{
font-family:var(--vibeui-dashboard-048-mono);font-size:0.625rem;font-weight:650;
padding:0.125rem 0.4375rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-048-soft);color:var(--vibeui-dashboard-048-accent);
}
[data-vibeui-block="dashboard-048"] [data-part="log"]{
background:var(--vibeui-dashboard-048-card);
border:1px solid var(--vibeui-dashboard-048-border);border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="dashboard-048"] [data-part="cap"]{
display:flex;align-items:baseline;gap:0.5rem;padding:0.625rem 0.875rem;
border-bottom:1px solid var(--vibeui-dashboard-048-border);
font-size:0.75rem;font-weight:750;
}
[data-vibeui-block="dashboard-048"] [data-part="cap"] span{
font-weight:400;font-size:0.6875rem;color:var(--vibeui-dashboard-048-muted);
}
[data-vibeui-block="dashboard-048"] details{border-top:1px solid var(--vibeui-dashboard-048-border)}
[data-vibeui-block="dashboard-048"] details:first-of-type{border-top:0}
[data-vibeui-block="dashboard-048"] summary{
display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:0.25rem 0.75rem;
cursor:pointer;list-style:none;padding:0.5625rem 0.875rem;
}
[data-vibeui-block="dashboard-048"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-048"] summary:hover{background:var(--vibeui-dashboard-048-inset)}
[data-vibeui-block="dashboard-048"] [data-part="code"]{
grid-row:1/3;font-family:var(--vibeui-dashboard-048-mono);font-size:0.75rem;font-weight:800;
min-width:2.75rem;text-align:center;padding:0.25rem 0.375rem;border-radius:0.4375rem;
color:var(--vibeui-dashboard-048-on-fill);background:var(--vibeui-dashboard-048-ok);
}
[data-vibeui-block="dashboard-048"] details[data-status="Повтор"] [data-part="code"]{background:var(--vibeui-dashboard-048-warn)}
[data-vibeui-block="dashboard-048"] details[data-status="Отклонено"] [data-part="code"]{background:var(--vibeui-dashboard-048-bad)}
[data-vibeui-block="dashboard-048"] [data-part="event"]{
font-family:var(--vibeui-dashboard-048-mono);font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="dashboard-048"] [data-part="meta"]{
grid-column:2;font-size:0.625rem;color:var(--vibeui-dashboard-048-muted);
}
[data-vibeui-block="dashboard-048"] [data-part="right"]{
grid-column:3;grid-row:1/3;display:flex;align-items:center;gap:0.5rem;white-space:nowrap;
font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="dashboard-048"] [data-part="chev"]{
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-dashboard-048-muted);
border-bottom:1.5px solid var(--vibeui-dashboard-048-muted);
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="dashboard-048"] details[open] [data-part="chev"]{transform:rotate(-135deg)}
[data-vibeui-block="dashboard-048"] [data-part="body"]{
margin:0 0.875rem 0.75rem;padding:0.625rem 0.75rem;border-radius:0.5rem;
font-family:var(--vibeui-dashboard-048-mono);font-size:0.6875rem;line-height:1.55;
white-space:pre-wrap;overflow-wrap:anywhere;
background:var(--vibeui-dashboard-048-ink);color:var(--vibeui-dashboard-048-on-ink);
}
[data-vibeui-block="dashboard-048"] [data-part="again"]{
appearance:none;cursor:pointer;font:inherit;margin:0 0.875rem 0.875rem;
font-size:0.6875rem;font-weight:700;padding:0.3125rem 0.6875rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-dashboard-048-border);
background:var(--vibeui-dashboard-048-card);color:var(--vibeui-dashboard-048-accent);
}
[data-vibeui-block="dashboard-048"] :is(a,button,summary):focus-visible{
outline:2px solid var(--vibeui-dashboard-048-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="dashboard-048"] summary{grid-template-columns:auto 1fr auto auto;column-gap:1rem}
[data-vibeui-block="dashboard-048"] [data-part="meta"]{grid-column:3;grid-row:1/3;align-self:center;text-align:right}
[data-vibeui-block="dashboard-048"] [data-part="right"]{grid-column:4}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-048"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DELIVERIES: Dashboard048Delivery[] = [
  {
    stamp: "17 марта, 12:41:08",
    event: "invoice.paid",
    code: 200,
    status: "Доставлено",
    spent: "184 мс",
    attempt: "попытка 1 из 5",
    body: '{\n  "ok": true,\n  "received": "invoice.paid",\n  "id": "evt_9f21"\n}',
  },
  {
    stamp: "17 марта, 12:38:52",
    event: "order.created",
    code: 502,
    status: "Повтор",
    spent: "30 000 мс",
    attempt: "попытка 2 из 5, следующая через 4 минуты",
    body: "502 Bad Gateway\nupstream connect error or disconnect before headers",
  },
  {
    stamp: "17 марта, 12:30:14",
    event: "customer.updated",
    code: 200,
    status: "Доставлено",
    spent: "96 мс",
    attempt: "попытка 1 из 5",
    body: '{\n  "ok": true,\n  "received": "customer.updated"\n}',
  },
  {
    stamp: "17 марта, 11:58:03",
    event: "invoice.voided",
    code: 401,
    status: "Отклонено",
    spent: "72 мс",
    attempt: "попытки исчерпаны",
    body: '{\n  "error": "signature mismatch",\n  "hint": "проверьте секрет подписи"\n}',
  },
]

const STATUS_LABEL: Record<string, string> = {
  Доставлено: "Доставлено",
  Повтор: "Повтор",
  Отклонено: "Отклонено",
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
 * Страница вебхука: адрес, секрет под маской, набор событий и история
 * доставки, где каждая попытка раскрывается на месте. Один файл, ноль
 * зависимостей, клиентского JS нет.
 */
export function Dashboard048({
  title = "Вебхук биллинга",
  endpoint = "https://hooks.kontur.ru/billing/v2/incoming",
  secret = "whsec_••••••••••••••••••••3f19",
  events = [
    "invoice.paid",
    "invoice.voided",
    "order.created",
    "customer.updated",
  ],
  successRate = "97,4 % доставок за сутки",
  deliveries = DEFAULT_DELIVERIES,
  resendLabel = "Отправить повторно",
  secretLabel = "Показать",
  accent,
  background = "",
  secretHint = "Секрет подписи:",
  eventsLabel = "Отправляемые события",
  logTitle = "История доставки",
  logHint = "последние 4 попытки",
  codeTitleText = "Код ответа {code}",
  statusText = STATUS_LABEL,
  className,
  style,
}: Dashboard048Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-048-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-048-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-048" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-048"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <div data-part="top">
              <h2>{title}</h2>
              <span data-part="rate">{successRate}</span>
            </div>

            <code data-part="url">{endpoint}</code>

            <p data-part="secret">
              {secretHint} <span data-part="mask">{secret}</span>
              <button type="button" data-part="show">
                {secretLabel}
              </button>
            </p>

            <ul data-part="tags" aria-label={eventsLabel}>
              {events.map((event) => (
                <li key={event}>{event}</li>
              ))}
            </ul>
          </div>

          <div data-part="log">
            <p data-part="cap">
              {logTitle} <span>{logHint}</span>
            </p>

            {deliveries.map((delivery) => (
              <details
                key={delivery.stamp}
                data-status={delivery.status}
                open={delivery.status === "Повтор"}
              >
                <summary>
                  <span
                    data-part="code"
                    title={codeTitleText.replace(
                      "{code}",
                      String(delivery.code),
                    )}
                  >
                    {delivery.code}
                  </span>
                  <span data-part="event">{delivery.event}</span>
                  <span data-part="meta">
                    {delivery.stamp} · {delivery.spent} · {delivery.attempt}
                  </span>
                  <span data-part="right">
                    {statusText[delivery.status] ?? delivery.status}
                    <span data-part="chev" aria-hidden="true" />
                  </span>
                </summary>
                <pre data-part="body">{delivery.body}</pre>
                <button type="button" data-part="again">
                  {resendLabel}
                </button>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
