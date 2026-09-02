import type { CSSProperties } from "react"

export type Commerce070Point = {
  id: string
  label: string
  at: string
  x: number
  y: number
  state: "done" | "now" | "wait"
}

export type Commerce070Props = {
  parcel?: string
  status?: string
  eta?: string
  where?: string
  points?: Commerce070Point[]
  timelineTitle?: string
  nowLabel?: string
  mapLabel?: string
  mapFallback?: string
  courier?: string
  courierPhone?: string
  cta?: string
  secondary?: string
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: отслеживание посылки на карте-заглушке. Карта нарисована
// градиентом и сеткой линий, точки расставлены процентами — блок остаётся
// одним файлом и не тянет тайлы. Главное: карта дублируется списком точек с
// временем, потому что карта не читается скринридером и не грузится на
// плохом интернете, а вопрос «где посылка» остаётся.
const STYLES = `
:where([data-vibeui-block="commerce-070"]){
--vibeui-commerce-070-bg:transparent;
--vibeui-commerce-070-surface:light-dark(oklch(1 0 0),oklch(0.22 0.014 210));
--vibeui-commerce-070-fg:light-dark(oklch(0.21 0.014 210),oklch(0.94 0.007 210));
--vibeui-commerce-070-muted:light-dark(oklch(0.53 0.016 210),oklch(0.73 0.013 210));
--vibeui-commerce-070-border:light-dark(oklch(0.9 0.008 210),oklch(0.38 0.016 210));
--vibeui-commerce-070-soft:light-dark(oklch(0.972 0.006 210),oklch(0.27 0.016 210));
--vibeui-commerce-070-land:light-dark(oklch(0.94 0.02 160),oklch(0.3 0.025 160));
--vibeui-commerce-070-water:light-dark(oklch(0.9 0.045 215),oklch(0.36 0.055 215));
--vibeui-commerce-070-grid:light-dark(oklch(0.88 0.012 210),oklch(0.37 0.02 210));
--vibeui-commerce-070-road:light-dark(oklch(0.99 0 0),oklch(0.47 0.02 210));
--vibeui-commerce-070-veil:light-dark(oklch(1 0 0 / 88%),oklch(0.21 0.014 210 / 88%));
--vibeui-commerce-070-accent:light-dark(oklch(0.48 0.15 215),oklch(0.75 0.14 215));
--vibeui-commerce-070-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.04 215));
--vibeui-commerce-070-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-070"]{
box-sizing:border-box;background:var(--vibeui-commerce-070-bg);
color:var(--vibeui-commerce-070-fg);font-family:var(--vibeui-commerce-070-sans);
}
[data-vibeui-block="commerce-070"] *{box-sizing:border-box}
[data-vibeui-block="commerce-070"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:1.25rem 1rem 2rem;display:grid;gap:1.25rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-070"] [data-part="parcel"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-070-accent)}
[data-vibeui-block="commerce-070"] h2{margin:0.375rem 0 0.25rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-070"] [data-part="eta"]{margin:0;font-size:1.0625rem;font-weight:650}
[data-vibeui-block="commerce-070"] [data-part="where"]{margin:0.25rem 0 1rem;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-commerce-070-muted)}
[data-vibeui-block="commerce-070"] [data-part="map"]{
position:relative;aspect-ratio:4/3;border-radius:1rem;overflow:hidden;
border:1px solid var(--vibeui-commerce-070-border);
background:
linear-gradient(115deg,transparent 46%,var(--vibeui-commerce-070-water) 46%,var(--vibeui-commerce-070-water) 54%,transparent 54%),
repeating-linear-gradient(0deg,var(--vibeui-commerce-070-grid) 0 1px,transparent 1px 3.25rem),
repeating-linear-gradient(90deg,var(--vibeui-commerce-070-grid) 0 1px,transparent 1px 3.25rem),
var(--vibeui-commerce-070-land);
}
[data-vibeui-block="commerce-070"] [data-part="road"]{
position:absolute;inset:0;
background:
linear-gradient(72deg,transparent 47.4%,var(--vibeui-commerce-070-road) 47.4%,var(--vibeui-commerce-070-road) 52.6%,transparent 52.6%),
linear-gradient(168deg,transparent 61%,var(--vibeui-commerce-070-road) 61%,var(--vibeui-commerce-070-road) 64%,transparent 64%);
}
[data-vibeui-block="commerce-070"] [data-part="pin"]{
position:absolute;transform:translate(-50%,-50%);
width:1.125rem;height:1.125rem;border-radius:9999px;
border:2px solid var(--vibeui-commerce-070-road);background:var(--vibeui-commerce-070-muted);
box-shadow:0 1px 3px oklch(0.2 0.02 210 / 35%);
left:var(--vibeui-commerce-070-x,50%);top:var(--vibeui-commerce-070-y,50%);
}
[data-vibeui-block="commerce-070"] [data-part="pin"][data-state="done"]{background:var(--vibeui-commerce-070-accent)}
[data-vibeui-block="commerce-070"] [data-part="pin"][data-state="now"]{
width:1.5rem;height:1.5rem;background:var(--vibeui-commerce-070-accent);
animation:vibeui-commerce-070-ring 1.8s ease-out infinite;
}
[data-vibeui-block="commerce-070"] [data-part="pin"][data-state="wait"]{background:var(--vibeui-commerce-070-road);border-color:var(--vibeui-commerce-070-muted)}
@keyframes vibeui-commerce-070-ring{
0%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-commerce-070-accent) 45%,transparent)}
70%{box-shadow:0 0 0 0.75rem transparent}
100%{box-shadow:0 0 0 0 transparent}
}
[data-vibeui-block="commerce-070"] [data-part="fallback"]{
position:absolute;left:0.75rem;bottom:0.75rem;right:0.75rem;margin:0;padding:0.5rem 0.625rem;border-radius:0.625rem;
background:var(--vibeui-commerce-070-veil);font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-070-muted);
}
[data-vibeui-block="commerce-070"] h3{margin:0 0 0.625rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-commerce-070-muted)}
[data-vibeui-block="commerce-070"] ol{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="commerce-070"] [data-part="step"]{display:flex;gap:0.625rem;align-items:flex-start}
[data-vibeui-block="commerce-070"] [data-part="dot"]{
flex:none;width:1.125rem;height:1.125rem;margin-top:0.125rem;border-radius:9999px;
display:flex;align-items:center;justify-content:center;font-size:0.625rem;font-weight:800;color:var(--vibeui-commerce-070-onaccent);
background:var(--vibeui-commerce-070-accent);
}
[data-vibeui-block="commerce-070"] [data-part="dot"][data-state="now"]{background:var(--vibeui-commerce-070-surface);border:2px solid var(--vibeui-commerce-070-accent)}
[data-vibeui-block="commerce-070"] [data-part="dot"][data-state="wait"]{background:var(--vibeui-commerce-070-surface);border:2px solid var(--vibeui-commerce-070-border)}
[data-vibeui-block="commerce-070"] [data-part="slabel"]{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-070"] [data-part="sat"]{display:block;margin-top:0.0625rem;font-size:0.75rem;color:var(--vibeui-commerce-070-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-070"] [data-part="now"]{
display:inline-block;margin-left:0.375rem;padding:0.0625rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-commerce-070-accent);color:var(--vibeui-commerce-070-onaccent);font-size:0.625rem;font-weight:700;
letter-spacing:0.04em;text-transform:uppercase;vertical-align:1px;
}
[data-vibeui-block="commerce-070"] [data-part="courier"]{
margin-top:1rem;padding:0.75rem 0.875rem;border-radius:0.875rem;background:var(--vibeui-commerce-070-soft);
display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;justify-content:space-between;
}
[data-vibeui-block="commerce-070"] [data-part="cname"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-070"] [data-part="cphone"]{margin:0.0625rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-070-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-070"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.5rem;padding:0 1.25rem;border-radius:0.75rem;
background:var(--vibeui-commerce-070-accent);color:var(--vibeui-commerce-070-onaccent);font:inherit;font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="commerce-070"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;margin-top:0.625rem;
border:1px solid var(--vibeui-commerce-070-border);background:var(--vibeui-commerce-070-surface);
color:inherit;font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-070"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-070"] [data-part="alt"]:focus-visible{outline:2px solid var(--vibeui-commerce-070-accent);outline-offset:2px}
[data-vibeui-block="commerce-070"] [data-part="note"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-070-muted)}
@container (min-width: 46rem){
[data-vibeui-block="commerce-070"] [data-part="shell"]{padding:2rem 2rem 3rem;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:1.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-070"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

const DEFAULT_POINTS: Commerce070Point[] = [
  {
    id: "1",
    label: "Склад отправителя, Всеволожск",
    at: "9 марта, 20:15",
    x: 16,
    y: 22,
    state: "done",
  },
  {
    id: "2",
    label: "Сортировочный центр, Парнас",
    at: "10 марта, 04:40",
    x: 38,
    y: 44,
    state: "done",
  },
  {
    id: "3",
    label: "Курьер на маршруте, Петроградская сторона",
    at: "11 марта, 12:05",
    x: 62,
    y: 58,
    state: "now",
  },
  {
    id: "4",
    label: "Ваш адрес, наб. реки Карповки, 12",
    at: "Ожидается сегодня до 18:00",
    x: 84,
    y: 76,
    state: "wait",
  },
]

/**
 * Отслеживание посылки на карте-заглушке: карта нарисована CSS, а точки
 * продублированы списком с временем. Один файл, ноль зависимостей.
 */
export function Commerce070({
  parcel = "Посылка № RU842119075",
  status = "Курьер везёт заказ",
  eta = "Сегодня до 18:00",
  where = "Последнее обновление 12:05, курьер на Петроградской стороне. До вас четыре адреса.",
  points = DEFAULT_POINTS,
  timelineTitle = "Где была посылка",
  nowLabel = "сейчас",
  mapLabel = "Схема маршрута посылки",
  mapFallback = "Схема условная: она показывает порядок точек, а не реальные улицы. Точные адреса — в списке ниже.",
  courier = "Курьер Дмитрий",
  courierPhone = "+7 921 000-77-13",
  cta = "Позвонить курьеру",
  secondary = "Перенести доставку",
  note = "Курьер звонит за 30 минут до приезда. Если не отвечаете два раза — посылка уезжает в пункт выдачи и ждёт там семь дней.",
  accent,
  background = "",
  className,
  style,
}: Commerce070Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-070-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-070-bg": background,
          // Точки списка и кнопка переноса не должны просвечивать: им нужна
          // непрозрачная подложка, а она задана тем же цветом.
          "--vibeui-commerce-070-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-070" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-070"
        className={className}
        style={palette}
        aria-label={status}
      >
        <div data-part="shell">
          <div>
            <p data-part="parcel">{parcel}</p>
            <h2>{status}</h2>
            <p data-part="eta">{eta}</p>
            <p data-part="where">{where}</p>

            <div data-part="map" role="img" aria-label={mapLabel}>
              <span data-part="road" aria-hidden="true" />
              {points.map((point) => (
                <span
                  key={point.id}
                  data-part="pin"
                  data-state={point.state}
                  style={
                    {
                      "--vibeui-commerce-070-x": `${point.x}%`,
                      "--vibeui-commerce-070-y": `${point.y}%`,
                    } as CSSProperties
                  }
                />
              ))}
              <p data-part="fallback">{mapFallback}</p>
            </div>
          </div>

          <div>
            <h3>{timelineTitle}</h3>
            <ol>
              {points.map((point) => (
                <li key={point.id} data-part="step">
                  <span
                    data-part="dot"
                    data-state={point.state}
                    aria-hidden="true"
                  >
                    {point.state === "done" ? "✓" : ""}
                  </span>
                  <span>
                    <span data-part="slabel">
                      {point.label}
                      {point.state === "now" ? (
                        <span data-part="now">{nowLabel}</span>
                      ) : null}
                    </span>
                    <span data-part="sat">{point.at}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div data-part="courier">
              <div>
                <p data-part="cname">{courier}</p>
                <p data-part="cphone">{courierPhone}</p>
              </div>
              <button type="button" data-part="go">
                {cta}
              </button>
            </div>
            <button type="button" data-part="alt">
              {secondary}
            </button>
            <p data-part="note">{note}</p>
          </div>
        </div>
      </section>
    </>
  )
}
