import type { CSSProperties } from "react"

export type Dashboard072Variant = {
  name: string
  traffic: number
  visitors: number
  conversions: number
  rate: number
  low: number
  high: number
  control?: boolean
}

export type Dashboard072Experiment = {
  name: string
  metric: string
  days: number
  needDays: number
  verdict: "collecting" | "winner" | "flat"
  variants: Dashboard072Variant[]
}

export type Dashboard072Props = {
  title?: string
  experiment?: Dashboard072Experiment
  stopLabel?: string
  shipLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Приговоры по ключам collecting, winner, flat. */
  verdictText?: Record<Dashboard072Experiment["verdict"], string>
  /** Подпись прогресса набора для скринридера. */
  progressAriaText?: string
  /** Строка срока: {days} и {needDays}. */
  daysText?: string
  /** Пометка контрольной ветки. */
  controlLabel?: string
  /** Доля трафика: {traffic}. */
  trafficText?: string
  /** Расшифровка отрезка: {name}, {rate}, {low}, {high}. */
  scaleAriaText?: string
  /** Числа строки по ключам rate, rateLabel, range, count. */
  numbersText?: Record<string, string>
  /** Подпись оси: {value}. */
  axisText?: string
  /** Сноска под кнопками. */
  noteText?: string
  /** Локаль форматирования чисел. */
  numberLocale?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: разница конверсий без интервала — это не результат, а повод
// ошибиться. Поэтому каждая ветка рисует не столбик, а отрезок доверительного
// интервала с точкой оценки внутри: пересекающиеся отрезки видно глазом, и
// вывод «разницы нет» не приходится объяснять словами. Шкала общая для всех
// веток, иначе отрезки несравнимы. Приговор написан текстом сверху и повторён
// подписью под шкалой, а кнопка «выкатить победителя» появляется, только когда
// приговор это позволяет: интерфейс не должен помогать принять решение раньше
// данных. Прогресс набора подписан днями — это то, чем меряют ожидание.
const STYLES = `
:where([data-vibeui-block="dashboard-072"]){
--vibeui-dashboard-072-bg:transparent;
/* Плашка приговора, полотно графика и жёлоб шкалы: подложка блока прозрачна. */
--vibeui-dashboard-072-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 285));
--vibeui-dashboard-072-inset:light-dark(oklch(0.985 0.003 285),oklch(0.22 0.012 285));
--vibeui-dashboard-072-fg:light-dark(oklch(0.21 0.014 285),oklch(0.94 0.005 285));
--vibeui-dashboard-072-muted:light-dark(oklch(0.55 0.014 285),oklch(0.72 0.012 285));
--vibeui-dashboard-072-border:light-dark(oklch(0.91 0.006 285),oklch(0.36 0.012 285));
--vibeui-dashboard-072-accent:light-dark(oklch(0.52 0.16 285),oklch(0.73 0.14 285));
--vibeui-dashboard-072-accent-line:light-dark(oklch(0.86 0.04 285),oklch(0.48 0.07 285));
--vibeui-dashboard-072-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.04 285));
--vibeui-dashboard-072-soft:light-dark(oklch(0.965 0.02 285),oklch(0.3 0.035 285));
--vibeui-dashboard-072-control:light-dark(oklch(0.6 0.02 285),oklch(0.72 0.02 285));
--vibeui-dashboard-072-span-control:light-dark(oklch(0.86 0.01 285),oklch(0.45 0.015 285));
--vibeui-dashboard-072-win:light-dark(oklch(0.58 0.13 155),oklch(0.74 0.13 155));
--vibeui-dashboard-072-span-win:light-dark(oklch(0.85 0.06 155),oklch(0.45 0.07 155));
--vibeui-dashboard-072-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-072"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-072-bg);
color:var(--vibeui-dashboard-072-fg);
font-family:var(--vibeui-dashboard-072-sans);
border:1px solid var(--vibeui-dashboard-072-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-072"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-072"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-072"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-072"] [data-part="metric"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-072-muted)}
[data-vibeui-block="dashboard-072"] [data-part="verdict"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.75rem;
padding:0.6875rem 0.8125rem;border-radius:0.875rem;font-size:0.8125rem;
background:var(--vibeui-dashboard-072-soft);
border:1px solid var(--vibeui-dashboard-072-accent-line);
}
[data-vibeui-block="dashboard-072"] [data-part="verdict"] b{font-weight:750}
[data-vibeui-block="dashboard-072"] [data-part="progress"]{
flex:1 1 8rem;min-width:6rem;height:0.375rem;border-radius:9999px;position:relative;overflow:hidden;
background:var(--vibeui-dashboard-072-card);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-072-border);
}
[data-vibeui-block="dashboard-072"] [data-part="progress"] span{
position:absolute;inset:0 auto 0 0;background:var(--vibeui-dashboard-072-accent);border-radius:9999px;
}
[data-vibeui-block="dashboard-072"] [data-part="chart"]{
display:flex;flex-direction:column;gap:0.5rem;padding:0.875rem 0.8125rem 0.625rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-072-card);border:1px solid var(--vibeui-dashboard-072-border);
}
[data-vibeui-block="dashboard-072"] [data-part="row"]{display:grid;grid-template-columns:1fr;gap:0.25rem 0.75rem;align-items:center}
[data-vibeui-block="dashboard-072"] [data-part="who"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.4375rem}
[data-vibeui-block="dashboard-072"] [data-part="who"] b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-072"] [data-part="who"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-072-muted)}
[data-vibeui-block="dashboard-072"] [data-part="tag"]{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;background:var(--vibeui-dashboard-072-soft);
}
/* Отрезок доверительного интервала: пересечение отрезков и есть «разницы нет». */
[data-vibeui-block="dashboard-072"] [data-part="scale"]{
position:relative;height:1.375rem;border-radius:0.375rem;
background:var(--vibeui-dashboard-072-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-072-border);
}
[data-vibeui-block="dashboard-072"] [data-part="span"]{
position:absolute;top:50%;height:0.375rem;transform:translateY(-50%);border-radius:9999px;
background:var(--vibeui-dashboard-072-span-control);
}
[data-vibeui-block="dashboard-072"] [data-win="true"] [data-part="span"]{
background:var(--vibeui-dashboard-072-span-win);
}
[data-vibeui-block="dashboard-072"] [data-part="dot"]{
position:absolute;top:50%;width:0.625rem;height:0.625rem;border-radius:50%;
transform:translate(-50%,-50%);background:var(--vibeui-dashboard-072-control);
box-shadow:0 0 0 2px var(--vibeui-dashboard-072-card);
}
[data-vibeui-block="dashboard-072"] [data-win="true"] [data-part="dot"]{background:var(--vibeui-dashboard-072-win)}
[data-vibeui-block="dashboard-072"] [data-part="nums"]{
margin:0;display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;font-size:0.6875rem;
color:var(--vibeui-dashboard-072-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-072"] [data-part="nums"] b{color:var(--vibeui-dashboard-072-fg);font-weight:750}
[data-vibeui-block="dashboard-072"] [data-part="axis"]{
display:flex;justify-content:space-between;font-size:0.625rem;color:var(--vibeui-dashboard-072-muted);
font-variant-numeric:tabular-nums;border-top:1px solid var(--vibeui-dashboard-072-border);padding-top:0.3125rem;
}
[data-vibeui-block="dashboard-072"] [data-part="acts"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center}
[data-vibeui-block="dashboard-072"] [data-part="acts"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.4375rem 0.875rem;border-radius:0.5625rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-072-border);
}
[data-vibeui-block="dashboard-072"] [data-part="acts"] button[data-primary="true"]{
background:var(--vibeui-dashboard-072-accent);color:var(--vibeui-dashboard-072-on-accent);border-color:transparent;
}
[data-vibeui-block="dashboard-072"] [data-part="note"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-072-muted);max-width:64ch}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-072"] [data-part="row"]{grid-template-columns:11rem minmax(0,1fr) 13rem}
}
`

const DEFAULT_EXPERIMENT: Dashboard072Experiment = {
  name: "Кнопка «Начать бесплатно» на тарифах",
  metric: "целевая метрика: доля регистраций от просмотров страницы тарифов",
  days: 9,
  needDays: 14,
  verdict: "collecting",
  variants: [
    {
      name: "A · текущая",
      traffic: 50,
      visitors: 18420,
      conversions: 571,
      rate: 3.1,
      low: 2.85,
      high: 3.36,
      control: true,
    },
    {
      name: "B · с ценой",
      traffic: 25,
      visitors: 9180,
      conversions: 321,
      rate: 3.5,
      low: 3.14,
      high: 3.87,
    },
    {
      name: "C · без формы",
      traffic: 25,
      visitors: 9240,
      conversions: 388,
      rate: 4.2,
      low: 3.81,
      high: 4.6,
    },
  ],
}

const VERDICTS: Record<Dashboard072Experiment["verdict"], string> = {
  collecting: "данных пока мало: интервалы веток пересекаются",
  winner: "есть победитель: интервалы разошлись",
  flat: "разницы нет: интервалы совпали",
}

const NUMBERS_TEXT: Record<string, string> = {
  rate: "{rate} %",
  rateLabel: "конверсия",
  range: "{low}–{high} %",
  count: "{conversions} из {visitors}",
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
 * Экран A/B-эксперимента: ветки показаны отрезками доверительных интервалов на
 * общей шкале, приговор написан словами, кнопка выката закрыта до набора
 * данных. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard072({
  title = "Эксперимент: кнопка на странице тарифов",
  experiment = DEFAULT_EXPERIMENT,
  stopLabel = "Остановить эксперимент",
  shipLabel = "Выкатить победителя",
  accent,
  background = "",
  verdictText = VERDICTS,
  progressAriaText = "Прогресс набора данных",
  daysText = "идёт {days} из {needDays} дней",
  controlLabel = "контроль",
  trafficText = "{traffic} % трафика",
  scaleAriaText = "{name}: конверсия {rate} процента, интервал от {low} до {high}",
  numbersText = NUMBERS_TEXT,
  axisText = "{value} %",
  noteText = "Отрезок — доверительный интервал конверсии, точка — сама оценка. Пока отрезки веток перекрываются, победителя нет, каким бы заманчивым ни выглядело различие средних.",
  numberLocale = "ru-RU",
  className,
  style,
}: Dashboard072Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-072-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-072-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const verdicts = { ...VERDICTS, ...verdictText }
  const numbers = { ...NUMBERS_TEXT, ...numbersText }

  const min = Math.min(...experiment.variants.map((variant) => variant.low))
  const max = Math.max(...experiment.variants.map((variant) => variant.high))
  const pad = (max - min) * 0.25 || 0.5
  const from = min - pad
  const to = max + pad
  const at = (value: number) => ((value - from) / (to - from)) * 100
  const best = experiment.variants.reduce((top, variant) =>
    variant.rate > top.rate ? variant : top,
  )

  return (
    <>
      <style href="vibeui-dashboard-072" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-072"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="metric">{experiment.metric}</p>
          </div>

          <div data-part="verdict">
            <b>{verdicts[experiment.verdict]}</b>
            <span
              data-part="progress"
              role="progressbar"
              aria-valuenow={experiment.days}
              aria-valuemin={0}
              aria-valuemax={experiment.needDays}
              aria-label={progressAriaText}
            >
              <span
                style={{
                  width: `${(experiment.days / experiment.needDays) * 100}%`,
                }}
              />
            </span>
            <span>
              {daysText
                .replace("{days}", String(experiment.days))
                .replace("{needDays}", String(experiment.needDays))}
            </span>
          </div>

          <div data-part="chart">
            {experiment.variants.map((variant) => (
              <div
                key={variant.name}
                data-part="row"
                data-win={variant.name === best.name}
              >
                <p data-part="who">
                  <b>{variant.name}</b>
                  {variant.control ? (
                    <span data-part="tag">{controlLabel}</span>
                  ) : null}
                  <span>
                    {trafficText.replace("{traffic}", String(variant.traffic))}
                  </span>
                </p>

                <div
                  data-part="scale"
                  role="img"
                  aria-label={scaleAriaText
                    .replace("{name}", variant.name)
                    .replace("{rate}", String(variant.rate))
                    .replace("{low}", String(variant.low))
                    .replace("{high}", String(variant.high))}
                >
                  <span
                    data-part="span"
                    style={{
                      left: `${at(variant.low)}%`,
                      width: `${at(variant.high) - at(variant.low)}%`,
                    }}
                  />
                  <span
                    data-part="dot"
                    style={{ left: `${at(variant.rate)}%` }}
                  />
                </div>

                <p data-part="nums">
                  <span>
                    <b>
                      {numbers.rate.replace("{rate}", variant.rate.toFixed(1))}
                    </b>{" "}
                    {numbers.rateLabel}
                  </span>
                  <span>
                    {numbers.range
                      .replace("{low}", variant.low.toFixed(2))
                      .replace("{high}", variant.high.toFixed(2))}
                  </span>
                  <span>
                    {numbers.count
                      .replace("{conversions}", String(variant.conversions))
                      .replace(
                        "{visitors}",
                        variant.visitors.toLocaleString(numberLocale),
                      )}
                  </span>
                </p>
              </div>
            ))}

            <div data-part="axis">
              <span>{axisText.replace("{value}", from.toFixed(1))}</span>
              <span>
                {axisText.replace("{value}", ((from + to) / 2).toFixed(1))}
              </span>
              <span>{axisText.replace("{value}", to.toFixed(1))}</span>
            </div>
          </div>

          <div data-part="acts">
            <button
              type="button"
              data-primary={experiment.verdict === "winner"}
            >
              {shipLabel}
            </button>
            <button type="button">{stopLabel}</button>
          </div>

          <p data-part="note">{noteText}</p>
        </div>
      </section>
    </>
  )
}
