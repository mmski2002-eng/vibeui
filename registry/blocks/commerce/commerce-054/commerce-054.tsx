"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Commerce054Speed = {
  value: string
  label: string
  hint: string
  factor: number
}

export type Commerce054Props = {
  title?: string
  lead?: string
  areaLabel?: string
  areaUnit?: string
  areaMin?: number
  areaMax?: number
  area?: number
  ratePerArea?: number
  windowsLabel?: string
  windowsMax?: number
  windows?: number
  ratePerWindow?: number
  speedLegend?: string
  speeds?: Commerce054Speed[]
  extraLabel?: string
  extraHint?: string
  extraPrice?: number
  minimum?: number
  currency?: string
  breakdownTitle?: string
  totalLabel?: string
  minimumNote?: string
  cta?: string
  formulaTitle?: string
  formula?: string
  /** Цена за окно рядом с полем: {price} подставляется суммой. */
  perWindowTemplate?: string
  /** Строка расшифровки по окнам: {count} и {price}. */
  windowsRowTemplate?: string
  /** Строка расшифровки по срочности: {speed} и {factor}. */
  speedRowTemplate?: string
  /** Порог минимального заказа: {price} подставляется суммой. */
  minimumTemplate?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: расчёт стоимости услуги по параметрам, где видно не только
// число, но и как оно получилось. Каждая строка расшифровки показывает
// множитель, поэтому спор о цене решается на экране, а не в переписке.
// Минимальный заказ подсвечивается отдельно: без него калькулятор обещает
// сумму, которую компания не примет.
const STYLES = `
:where([data-vibeui-block="commerce-054"]){
--vibeui-commerce-054-bg:transparent;
--vibeui-commerce-054-fg:light-dark(oklch(0.21 0.014 230),oklch(0.94 0.006 230));
--vibeui-commerce-054-muted:light-dark(oklch(0.53 0.016 230),oklch(0.73 0.013 230));
--vibeui-commerce-054-border:light-dark(oklch(0.9 0.008 230),oklch(0.38 0.014 230));
--vibeui-commerce-054-soft:light-dark(oklch(0.972 0.006 230),oklch(0.27 0.012 230));
--vibeui-commerce-054-chip:light-dark(oklch(1 0 0),oklch(0.22 0.01 230));
--vibeui-commerce-054-accent:light-dark(oklch(0.5 0.15 235),oklch(0.74 0.13 235));
--vibeui-commerce-054-onaccent:light-dark(oklch(0.99 0 0),oklch(0.2 0.04 235));
--vibeui-commerce-054-warn:light-dark(oklch(0.55 0.14 60),oklch(0.8 0.13 70));
--vibeui-commerce-054-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-054"]{
box-sizing:border-box;background:var(--vibeui-commerce-054-bg);
color:var(--vibeui-commerce-054-fg);font-family:var(--vibeui-commerce-054-sans);
}
[data-vibeui-block="commerce-054"] *{box-sizing:border-box}
[data-vibeui-block="commerce-054"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:1.25rem 1rem 2rem;display:grid;gap:1.25rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-054"] h2{margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-054"] [data-part="lead"]{margin:0 0 1.25rem;max-width:52ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-054-muted)}
[data-vibeui-block="commerce-054"] [data-part="field"]{margin-bottom:1.125rem}
[data-vibeui-block="commerce-054"] [data-part="flabel"]{
display:flex;justify-content:space-between;align-items:baseline;gap:0.75rem;margin-bottom:0.375rem;
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-054"] [data-part="fvalue"]{font-variant-numeric:tabular-nums;color:var(--vibeui-commerce-054-accent);font-weight:750}
[data-vibeui-block="commerce-054"] input[type="range"]{width:100%;accent-color:var(--vibeui-commerce-054-accent);height:1.5rem}
[data-vibeui-block="commerce-054"] input[type="number"]{
width:6rem;height:2.5rem;padding:0 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-054-border);background:var(--vibeui-commerce-054-chip);
font:inherit;font-size:0.9375rem;color:inherit;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-054"] input:focus-visible,
[data-vibeui-block="commerce-054"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-054"] summary:focus-visible{outline:2px solid var(--vibeui-commerce-054-accent);outline-offset:2px}
[data-vibeui-block="commerce-054"] fieldset{border:0;margin:0 0 1.125rem;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-054"] legend{padding:0;margin:0 0 0.5rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-054"] [data-part="speeds"]{display:grid;gap:0.5rem;grid-template-columns:1fr;clear:both}
[data-vibeui-block="commerce-054"] [data-part="speed"]{position:relative;display:block}
[data-vibeui-block="commerce-054"] [data-part="speed"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-054"] [data-part="sface"]{
display:block;cursor:pointer;border:1px solid var(--vibeui-commerce-054-border);border-radius:0.75rem;padding:0.5625rem 0.75rem;
transition:border-color .14s ease,background-color .14s ease;
}
[data-vibeui-block="commerce-054"] [data-part="speed"] input:checked+[data-part="sface"]{
border-color:var(--vibeui-commerce-054-accent);background:var(--vibeui-commerce-054-soft);
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-054-accent);
}
[data-vibeui-block="commerce-054"] [data-part="speed"] input:focus-visible+[data-part="sface"]{outline:2px solid var(--vibeui-commerce-054-accent);outline-offset:2px}
[data-vibeui-block="commerce-054"] [data-part="slabel"]{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-054"] [data-part="shint"]{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-commerce-054-muted)}
[data-vibeui-block="commerce-054"] [data-part="check"]{display:flex;gap:0.625rem;align-items:flex-start;font-size:0.875rem;cursor:pointer}
[data-vibeui-block="commerce-054"] [data-part="check"] input{margin:0.1875rem 0 0;width:1.125rem;height:1.125rem;accent-color:var(--vibeui-commerce-054-accent)}
[data-vibeui-block="commerce-054"] [data-part="chint"]{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-commerce-054-muted)}
[data-vibeui-block="commerce-054"] [data-part="panel"]{
border:1px solid var(--vibeui-commerce-054-border);border-radius:1rem;padding:1rem 1.125rem;
background:var(--vibeui-commerce-054-soft);align-self:start;
}
[data-vibeui-block="commerce-054"] h3{margin:0 0 0.625rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-054"] dl{margin:0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0.375rem 0.75rem;font-size:0.8125rem}
[data-vibeui-block="commerce-054"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-054"] dt{color:var(--vibeui-commerce-054-muted);min-width:0}
[data-vibeui-block="commerce-054"] dd{margin:0;text-align:right;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-054"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0.875rem 0 0;
padding-top:0.75rem;border-top:1px solid var(--vibeui-commerce-054-border);
}
[data-vibeui-block="commerce-054"] [data-part="total"] span:first-child{font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-054"] [data-part="sum"]{font-size:1.625rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-054"] [data-part="minimum"]{
margin:0.5rem 0 0;padding:0.5rem 0.625rem;border-radius:0.625rem;
background:var(--vibeui-commerce-054-chip);border:1px solid var(--vibeui-commerce-054-warn);
font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-054-warn);
}
[data-vibeui-block="commerce-054"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.875rem;margin-top:0.875rem;border-radius:0.875rem;
background:var(--vibeui-commerce-054-accent);color:var(--vibeui-commerce-054-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-054"] details{margin-top:0.875rem;font-size:0.75rem;color:var(--vibeui-commerce-054-muted)}
[data-vibeui-block="commerce-054"] summary{cursor:pointer;font-weight:650}
[data-vibeui-block="commerce-054"] details p{margin:0.375rem 0 0;line-height:1.55}
@container (min-width: 34rem){
[data-vibeui-block="commerce-054"] [data-part="speeds"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 48rem){
[data-vibeui-block="commerce-054"] [data-part="shell"]{padding:2rem 2rem 3rem;grid-template-columns:minmax(0,1fr) 19rem;gap:1.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-054"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SPEEDS: Commerce054Speed[] = [
  {
    value: "plan",
    label: "По записи",
    hint: "Ближайшее окно — через 4 дня",
    factor: 1,
  },
  {
    value: "fast",
    label: "За три дня",
    hint: "Бригада собирается вне графика",
    factor: 1.25,
  },
  {
    value: "rush",
    label: "Завтра",
    hint: "Ночная смена, выезд до 9 утра",
    factor: 1.6,
  },
]

function money(value: number, currency: string) {
  return `${Math.round(value).toLocaleString("ru-RU")} ${currency}`
}

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

/**
 * Расчёт стоимости услуги по параметрам с расшифровкой каждой строки и
 * порогом минимального заказа. Один файл, ноль зависимостей.
 */
export function Commerce054({
  title = "Сколько будет стоить уборка",
  lead = "Двигайте параметры — цена пересчитывается сразу, а рядом видно, из чего она сложилась.",
  areaLabel = "Площадь помещения",
  areaUnit = "м²",
  areaMin = 20,
  areaMax = 200,
  area = 64,
  ratePerArea = 95,
  windowsLabel = "Окон вымыть",
  windowsMax = 12,
  windows = 3,
  ratePerWindow = 480,
  speedLegend = "Когда нужно",
  speeds = DEFAULT_SPEEDS,
  extraLabel = "Вывезти строительный мусор",
  extraHint = "До 10 мешков, машина приезжает вместе с бригадой",
  extraPrice = 2400,
  minimum = 6000,
  currency = "₽",
  breakdownTitle = "Как складывается цена",
  totalLabel = "К оплате",
  minimumNote = "Расчёт ниже минимального заказа, поэтому в счёт войдёт минимальная сумма.",
  cta = "Записаться на расчёт",
  formulaTitle = "Точная формула",
  formula = "Площадь умножается на ставку за квадратный метр, к ней прибавляются окна по фиксированной цене, сумма умножается на коэффициент срочности, затем добавляются отдельно оплачиваемые работы.",
  perWindowTemplate = "{price} за окно",
  windowsRowTemplate = "Окна: {count} × {price}",
  speedRowTemplate = "Срочность: {speed} (×{factor})",
  minimumTemplate = "Минимальный заказ — {price}.",
  accent,
  background = "",
  className,
  style,
}: Commerce054Props) {
  const [squares, setSquares] = useState(area)
  const [glass, setGlass] = useState(windows)
  const [speed, setSpeed] = useState(speeds[0]?.value ?? "plan")
  const [extra, setExtra] = useState(false)

  const chosenSpeed =
    speeds.find((entry) => entry.value === speed) ??
    speeds[0] ??
    DEFAULT_SPEEDS[0]

  const areaCost = squares * ratePerArea
  const windowCost = glass * ratePerWindow
  const urgentBase = (areaCost + windowCost) * chosenSpeed.factor
  const urgentAdd = urgentBase - (areaCost + windowCost)
  const extraCost = extra ? extraPrice : 0
  const raw = urgentBase + extraCost
  const total = Math.max(raw, minimum)
  const belowMinimum = raw < minimum

  const palette = {
    ...(accent ? { "--vibeui-commerce-054-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-054-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-054" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-054"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>

            <div data-part="field">
              <label data-part="flabel" htmlFor="commerce-054-area">
                <span>{areaLabel}</span>
                <span data-part="fvalue">
                  {squares} {areaUnit}
                </span>
              </label>
              <input
                id="commerce-054-area"
                type="range"
                min={areaMin}
                max={areaMax}
                step={1}
                value={squares}
                onChange={(event) => setSquares(Number(event.target.value))}
              />
            </div>

            <div data-part="field">
              <label data-part="flabel" htmlFor="commerce-054-windows">
                <span>{windowsLabel}</span>
                <span data-part="fvalue">
                  {perWindowTemplate.replace(
                    "{price}",
                    money(ratePerWindow, currency),
                  )}
                </span>
              </label>
              <input
                id="commerce-054-windows"
                type="number"
                min={0}
                max={windowsMax}
                step={1}
                value={glass}
                onChange={(event) =>
                  setGlass(
                    Math.max(
                      0,
                      Math.min(windowsMax, Number(event.target.value)),
                    ),
                  )
                }
              />
            </div>

            <fieldset>
              <legend>{speedLegend}</legend>
              <div data-part="speeds">
                {speeds.map((entry) => (
                  <label
                    key={entry.value}
                    data-part="speed"
                    htmlFor={`commerce-054-speed-${entry.value}`}
                  >
                    <input
                      type="radio"
                      id={`commerce-054-speed-${entry.value}`}
                      name="commerce-054-speed"
                      value={entry.value}
                      checked={speed === entry.value}
                      onChange={() => setSpeed(entry.value)}
                    />
                    <span data-part="sface">
                      <span data-part="slabel">{entry.label}</span>
                      <span data-part="shint">{entry.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label data-part="check" htmlFor="commerce-054-extra">
              <input
                type="checkbox"
                id="commerce-054-extra"
                checked={extra}
                onChange={(event) => setExtra(event.target.checked)}
              />
              <span>
                {extraLabel} — {money(extraPrice, currency)}
                <span data-part="chint">{extraHint}</span>
              </span>
            </label>
          </div>

          <aside data-part="panel" aria-live="polite">
            <h3>{breakdownTitle}</h3>
            <dl>
              <div data-part="pair">
                <dt>
                  {squares} {areaUnit} × {money(ratePerArea, currency)}
                </dt>
                <dd>{money(areaCost, currency)}</dd>
              </div>
              <div data-part="pair">
                <dt>
                  {windowsRowTemplate
                    .replace("{count}", String(glass))
                    .replace("{price}", money(ratePerWindow, currency))}
                </dt>
                <dd>{money(windowCost, currency)}</dd>
              </div>
              <div data-part="pair">
                <dt>
                  {speedRowTemplate
                    .replace("{speed}", chosenSpeed.label)
                    .replace("{factor}", String(chosenSpeed.factor))}
                </dt>
                <dd>
                  {urgentAdd > 0 ? `+ ${money(urgentAdd, currency)}` : "—"}
                </dd>
              </div>
              <div data-part="pair">
                <dt>{extraLabel}</dt>
                <dd>{extra ? `+ ${money(extraPrice, currency)}` : "—"}</dd>
              </div>
            </dl>
            <p data-part="total">
              <span>{totalLabel}</span>
              <span data-part="sum">{money(total, currency)}</span>
            </p>
            {belowMinimum ? (
              <p data-part="minimum">
                {minimumNote}{" "}
                {minimumTemplate.replace("{price}", money(minimum, currency))}
              </p>
            ) : null}
            <button type="button" data-part="go">
              {cta}
            </button>
            <details>
              <summary>{formulaTitle}</summary>
              <p>{formula}</p>
            </details>
          </aside>
        </div>
      </section>
    </>
  )
}
