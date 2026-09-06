import type { CSSProperties } from "react"

export type Commerce012Stage = {
  label: string
  at?: string
  state?: "done" | "now" | "wait"
}

export type Commerce012Event = {
  at: string
  text: string
}

export type Commerce012Props = {
  order?: string
  status?: string
  eta?: string
  where?: string
  stages?: Commerce012Stage[]
  events?: Commerce012Event[]
  courier?: { name: string; note: string }
  cta?: string
  /** Подписи блока: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: отслеживание, где текущий этап видно не только цветом. Пройденное
// несёт галочку, текущее — кольцо с пульсом, будущее — пустой круг: форма
// работает там, где цвет не различают. Полоса становится горизонтальной от
// ширины блока, а не окна, поэтому её можно поставить и в узкую колонку
// личного кабинета. Подробная история спрятана в details: она нужна редко,
// но когда нужна — нужна целиком.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-012"]){
--vibeui-commerce-012-bg:transparent;
--vibeui-commerce-012-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-012-muted:light-dark(oklch(0.55 0 265),oklch(0.72 0 265));
--vibeui-commerce-012-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-commerce-012-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-012-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-commerce-012-ok:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-commerce-012-on-ok:light-dark(oklch(1 0 0),oklch(0.19 0.02 152));
--vibeui-commerce-012-face:light-dark(oklch(0.88 0.07 262),oklch(0.38 0.08 262));
--vibeui-commerce-012-on-face:light-dark(oklch(0.28 0.06 262),oklch(0.95 0 262));
--vibeui-commerce-012-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-012"]{color-scheme:dark}
[data-vibeui-block="commerce-012"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-012-bg);
font-family:var(--vibeui-commerce-012-sans);color:var(--vibeui-commerce-012-fg);
}
[data-vibeui-block="commerce-012"] *{box-sizing:border-box}
[data-vibeui-block="commerce-012"] [data-part="shell"]{padding:1rem;max-width:52rem;margin:0 auto}
[data-vibeui-block="commerce-012"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;margin-bottom:0.625rem}
[data-vibeui-block="commerce-012"] [data-part="order"]{font-size:0.75rem;color:var(--vibeui-commerce-012-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-012"] [data-part="chip"]{
margin-left:auto;padding:0.1875rem 0.5rem;border-radius:9999px;font-size:0.6875rem;font-weight:700;
background:color-mix(in oklab,var(--vibeui-commerce-012-accent) 14%,transparent);color:var(--vibeui-commerce-012-accent);
}
[data-vibeui-block="commerce-012"] h2{margin:0 0 0.25rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-012"] [data-part="where"]{margin:0 0 1.25rem;font-size:0.8125rem;color:var(--vibeui-commerce-012-muted)}
[data-vibeui-block="commerce-012"] ol{list-style:none;margin:0;padding:0;display:grid;gap:0.875rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-012"] [data-part="stage"]{position:relative;display:grid;grid-template-columns:1.5rem minmax(0,1fr);gap:0.625rem;align-items:start}
[data-vibeui-block="commerce-012"] [data-part="stage"]::before{
content:"";position:absolute;left:0.6875rem;top:1.5rem;bottom:-0.875rem;width:2px;
background:var(--vibeui-commerce-012-border);
}
[data-vibeui-block="commerce-012"] [data-part="stage"]:last-child::before{display:none}
[data-vibeui-block="commerce-012"] [data-part="stage"][data-state="done"]::before{background:var(--vibeui-commerce-012-ok)}
/* Форма значка, а не только цвет: этап читается без различения оттенков. */
[data-vibeui-block="commerce-012"] [data-part="dot"]{
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:9999px;font-size:0.6875rem;line-height:1;
border:2px solid var(--vibeui-commerce-012-border);background:var(--vibeui-commerce-012-bg);
color:var(--vibeui-commerce-012-muted);
}
[data-vibeui-block="commerce-012"] [data-state="done"] [data-part="dot"]{
background:var(--vibeui-commerce-012-ok);border-color:var(--vibeui-commerce-012-ok);color:var(--vibeui-commerce-012-on-ok);
}
[data-vibeui-block="commerce-012"] [data-state="now"] [data-part="dot"]{
border-color:var(--vibeui-commerce-012-accent);color:var(--vibeui-commerce-012-accent);
animation:vibeui-commerce-012-pulse 2s ease-out infinite;
}
@keyframes vibeui-commerce-012-pulse{
0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-commerce-012-accent) 45%,transparent)}
70%{box-shadow:0 0 0 0.5rem color-mix(in oklab,var(--vibeui-commerce-012-accent) 0%,transparent)}
100%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-commerce-012-accent) 0%,transparent)}
}
[data-vibeui-block="commerce-012"] [data-part="label"]{margin:0.125rem 0 0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="commerce-012"] [data-state="wait"] [data-part="label"]{color:var(--vibeui-commerce-012-muted);font-weight:500}
[data-vibeui-block="commerce-012"] [data-part="at"]{margin:0.125rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-012-muted);font-variant-numeric:tabular-nums}
@container (min-width: 40rem){
[data-vibeui-block="commerce-012"] ol{grid-template-columns:repeat(4,minmax(0,1fr));gap:0.5rem}
[data-vibeui-block="commerce-012"] [data-part="stage"]{grid-template-columns:1fr;gap:0.375rem}
[data-vibeui-block="commerce-012"] [data-part="stage"]::before{left:1.75rem;right:-0.5rem;top:0.6875rem;bottom:auto;width:auto;height:2px}
}
[data-vibeui-block="commerce-012"] [data-part="courier"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;margin-top:1.25rem;
padding:0.75rem;border-radius:1rem;border:1px solid var(--vibeui-commerce-012-border);background:var(--vibeui-commerce-012-soft);
}
[data-vibeui-block="commerce-012"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:9999px;
background:var(--vibeui-commerce-012-face);font-size:0.75rem;font-weight:700;color:var(--vibeui-commerce-012-on-face);
}
[data-vibeui-block="commerce-012"] [data-part="who"]{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="commerce-012"] [data-part="note"]{margin:0.0625rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-012-muted)}
[data-vibeui-block="commerce-012"] [data-part="call"]{
margin-left:auto;appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-012-border);background:var(--vibeui-commerce-012-bg);
color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-012"] [data-part="call"]:focus-visible{outline:2px solid var(--vibeui-commerce-012-accent);outline-offset:2px}
[data-vibeui-block="commerce-012"] details{margin-top:0.875rem;border-top:1px solid var(--vibeui-commerce-012-border);padding-top:0.75rem}
[data-vibeui-block="commerce-012"] summary{cursor:pointer;font-size:0.8125rem;font-weight:650;list-style:none}
[data-vibeui-block="commerce-012"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="commerce-012"] summary::before{content:"▸";display:inline-block;margin-right:0.375rem;color:var(--vibeui-commerce-012-muted)}
[data-vibeui-block="commerce-012"] details[open] summary::before{content:"▾"}
[data-vibeui-block="commerce-012"] summary:focus-visible{outline:2px solid var(--vibeui-commerce-012-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="commerce-012"] dl{margin:0.625rem 0 0;display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.75rem;font-size:0.75rem}
[data-vibeui-block="commerce-012"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-012"] dt{color:var(--vibeui-commerce-012-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="commerce-012"] dd{margin:0}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STAGES: Commerce012Stage[] = [
  { label: "Заказ собран", at: "10 марта, 20:15", state: "done" },
  { label: "Уехал со склада", at: "11 марта, 06:40", state: "done" },
  { label: "В пути к вам", at: "сегодня, 09:12", state: "now" },
  { label: "Вручён", at: "ожидается до 18:00", state: "wait" },
]

const DEFAULT_EVENTS: Commerce012Event[] = [
  { at: "09:12", text: "Курьер забрал заказ в сортировочном центре" },
  { at: "06:40", text: "Отправлен со склада «Восток»" },
  { at: "10.03 20:15", text: "Собран и упакован" },
  { at: "10.03 14:02", text: "Оплачен картой •• 4417" },
]

/** Русские подписи по умолчанию: установленный файл не меняет язык сам. */
const LABELS: Record<string, string> = {
  tracking: "Отслеживание заказа {order}",
  order: "Заказ {order}",
  now: "сейчас",
  history: "Подробная история",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Отслеживание доставки: этапы формой значка, история — в details.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce012({
  order = "№ 2024-1187",
  status = "В пути",
  eta = "Сегодня до 18:00",
  where = "Москва, Пушкина 12, кв. 40 · курьер позвонит за час",
  stages = DEFAULT_STAGES,
  events = DEFAULT_EVENTS,
  courier = { name: "Артём К.", note: "Курьер · 4,9 из 5 по 312 доставкам" },
  cta = "Позвонить курьеру",
  labels = LABELS,
  accent,
  background = "",
  className,
  style,
}: Commerce012Props) {
  const text = { ...LABELS, ...labels }

  const palette = {
    ...(accent ? { "--vibeui-commerce-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const glyph = (state: Commerce012Stage["state"]) =>
    state === "done" ? "✓" : state === "now" ? "●" : ""

  return (
    <>
      <style href="vibeui-commerce-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-012"
        className={className}
        style={palette}
        aria-label={text.tracking.replace("{order}", order)}
      >
        <div data-part="shell">
          <div data-part="top">
            <span data-part="order">
              {text.order.replace("{order}", order)}
            </span>
            <span data-part="chip">{status}</span>
          </div>
          <h2>{eta}</h2>
          <p data-part="where">{where}</p>

          <ol>
            {stages.map((stage) => (
              <li
                key={stage.label}
                data-part="stage"
                data-state={stage.state ?? "wait"}
              >
                <span data-part="dot" aria-hidden="true">
                  {glyph(stage.state)}
                </span>
                <div>
                  <p data-part="label">
                    {stage.label}
                    {stage.state === "now" ? ` · ${text.now}` : ""}
                  </p>
                  {stage.at ? <p data-part="at">{stage.at}</p> : null}
                </div>
              </li>
            ))}
          </ol>

          <div data-part="courier">
            <span data-part="face" aria-hidden="true">
              {courier.name.slice(0, 1)}
            </span>
            <div>
              <p data-part="who">{courier.name}</p>
              <p data-part="note">{courier.note}</p>
            </div>
            <button type="button" data-part="call">
              {cta}
            </button>
          </div>

          <details>
            <summary>{text.history}</summary>
            <dl>
              {events.map((event) => (
                <div key={event.at} data-part="pair">
                  <dt>{event.at}</dt>
                  <dd>{event.text}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      </section>
    </>
  )
}
