import type { CSSProperties } from "react"

export type Pricing019Usage = {
  label: string
  used: number
  limit: number
  unit?: string
}

export type Pricing019Props = {
  currentName?: string
  currentPrice?: string
  currentPeriod?: string
  renewLabel?: string
  renewDate?: string
  usage?: Pricing019Usage[]
  upgradeName?: string
  upgradePrice?: string
  upgradeDelta?: string
  upgradeGains?: string[]
  upgradeAction?: { label: string; href: string }
  manageAction?: { label: string; href: string }
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Строка расхода. Плейсхолдеры {used} и {limit}. */
  usageText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: не витрина тарифов, а экран биллинга внутри продукта. Слева
// текущий план с расходом лимитов, справа предложение апгрейда. Полоски
// расхода — <progress>, а не div с шириной в процентах: браузер сам
// объявляет значение и максимум, а число рядом дублирует его текстом.
// Полоса, перевалившая за 80 %, красится в предупреждающий цвет — именно
// она и есть аргумент за переход, поэтому апгрейд стоит рядом, а не в письме.
const STYLES = `
:where([data-vibeui-block="pricing-019"]){
--vibeui-pricing-019-bg:transparent;
--vibeui-pricing-019-fg:light-dark(oklch(0.2 0.012 265),oklch(0.94 0.005 265));
--vibeui-pricing-019-muted:light-dark(oklch(0.51 0.012 265),oklch(0.7 0.01 265));
--vibeui-pricing-019-card:light-dark(oklch(1 0 0),oklch(0.25 0.011 265));
--vibeui-pricing-019-line:light-dark(oklch(0.89 0.006 265),oklch(0.37 0.011 265));
--vibeui-pricing-019-track:light-dark(oklch(0.92 0.006 265),oklch(0.34 0.01 265));
--vibeui-pricing-019-accent:light-dark(oklch(0.52 0.17 265),oklch(0.72 0.15 265));
--vibeui-pricing-019-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.03 265));
--vibeui-pricing-019-warn:light-dark(oklch(0.65 0.16 55),oklch(0.79 0.15 55));
--vibeui-pricing-019-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="pricing-019"]{
box-sizing:border-box;background:var(--vibeui-pricing-019-bg);color:var(--vibeui-pricing-019-fg);
font-family:var(--vibeui-pricing-019-sans);
}
[data-vibeui-block="pricing-019"] *{box-sizing:border-box}
[data-vibeui-block="pricing-019"] [data-part="shell"]{
max-width:60rem;width:100%;margin:0 auto;padding:3rem 1.25rem;
display:grid;grid-template-columns:1fr;gap:1.25rem;align-items:start;
}
[data-vibeui-block="pricing-019"] [data-part="panel"]{
padding:1.5rem;border-radius:1.125rem;border:1px solid var(--vibeui-pricing-019-line);background:var(--vibeui-pricing-019-card);
}
[data-vibeui-block="pricing-019"] [data-part="tag"]{
display:inline-block;margin:0 0 0.75rem;padding:0.1875rem 0.5rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-pricing-019-accent) 12%,transparent);color:var(--vibeui-pricing-019-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="pricing-019"] h2{margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="pricing-019"] [data-part="line"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;margin:0.5rem 0 0;
font-size:0.875rem;color:var(--vibeui-pricing-019-muted);
}
[data-vibeui-block="pricing-019"] [data-part="amount"]{font-size:1rem;font-weight:700;color:var(--vibeui-pricing-019-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-019"] [data-part="usage"]{list-style:none;margin:1.5rem 0 0;padding:0;display:grid;gap:1rem}
[data-vibeui-block="pricing-019"] [data-part="usagehead"]{display:flex;justify-content:space-between;gap:1rem;margin-bottom:0.375rem;font-size:0.8125rem}
[data-vibeui-block="pricing-019"] [data-part="value"]{color:var(--vibeui-pricing-019-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-019"] progress{
appearance:none;width:100%;height:0.375rem;border:0;border-radius:9999px;
background:var(--vibeui-pricing-019-track);overflow:hidden;display:block;
}
[data-vibeui-block="pricing-019"] progress::-webkit-progress-bar{background:var(--vibeui-pricing-019-track);border-radius:9999px}
[data-vibeui-block="pricing-019"] progress::-webkit-progress-value{background:var(--vibeui-pricing-019-accent);border-radius:9999px}
[data-vibeui-block="pricing-019"] progress::-moz-progress-bar{background:var(--vibeui-pricing-019-accent);border-radius:9999px}
[data-vibeui-block="pricing-019"] [data-high="true"] progress::-webkit-progress-value{background:var(--vibeui-pricing-019-warn)}
[data-vibeui-block="pricing-019"] [data-high="true"] progress::-moz-progress-bar{background:var(--vibeui-pricing-019-warn)}
[data-vibeui-block="pricing-019"] [data-high="true"] [data-part="value"]{color:var(--vibeui-pricing-019-warn);font-weight:650}
[data-vibeui-block="pricing-019"] [data-part="manage"]{
display:inline-flex;align-items:center;margin-top:1.5rem;height:2.5rem;padding:0 1.125rem;border-radius:0.625rem;
border:1px solid var(--vibeui-pricing-019-line);color:var(--vibeui-pricing-019-fg);
font-size:0.875rem;font-weight:650;text-decoration:none;transition:border-color .16s ease;
}
[data-vibeui-block="pricing-019"] [data-part="manage"]:hover{border-color:var(--vibeui-pricing-019-fg)}
[data-vibeui-block="pricing-019"] [data-upgrade="true"]{
border:0;background:linear-gradient(160deg,var(--vibeui-pricing-019-accent),color-mix(in oklab,var(--vibeui-pricing-019-accent) 70%,black));
color:var(--vibeui-pricing-019-accent-fg);
}
[data-vibeui-block="pricing-019"] [data-upgrade="true"] [data-part="tag"]{background:oklch(1 0 0 / 18%);color:var(--vibeui-pricing-019-accent-fg)}
[data-vibeui-block="pricing-019"] [data-upgrade="true"] h2{color:var(--vibeui-pricing-019-accent-fg)}
[data-vibeui-block="pricing-019"] [data-upgrade="true"] [data-part="line"]{color:oklch(1 0 0 / 78%)}
[data-vibeui-block="pricing-019"] [data-upgrade="true"] [data-part="amount"]{color:var(--vibeui-pricing-019-accent-fg)}
[data-vibeui-block="pricing-019"] [data-part="gains"]{list-style:none;margin:1.25rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="pricing-019"] [data-part="gains"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="pricing-019"] [data-part="plus"]{flex:0 0 auto;font-weight:700}
[data-vibeui-block="pricing-019"] [data-part="cta"]{
display:flex;align-items:center;justify-content:center;margin-top:1.5rem;height:2.75rem;border-radius:0.625rem;
background:var(--vibeui-pricing-019-card);color:var(--vibeui-pricing-019-accent);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:opacity .16s ease;
}
[data-vibeui-block="pricing-019"] [data-part="cta"]:hover{opacity:.9}
[data-vibeui-block="pricing-019"] a:focus-visible{outline:2px solid var(--vibeui-pricing-019-accent);outline-offset:3px}
[data-vibeui-block="pricing-019"] [data-upgrade="true"] [data-part="cta"]:focus-visible{outline-color:var(--vibeui-pricing-019-card)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-019"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="pricing-019"] [data-part="panel"]{padding:1.875rem}
}
@container (min-width: 52rem){
[data-vibeui-block="pricing-019"] [data-part="shell"]{grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:1.5rem;padding:5rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_USAGE: Pricing019Usage[] = [
  { label: "Проекты", used: 8, limit: 10 },
  { label: "Участники", used: 5, limit: 5 },
  { label: "Установок секций за месяц", used: 214, limit: 500 },
]

const DEFAULT_GAINS = [
  "Безлимит проектов и участников",
  "Передача проекта клиенту с исходниками",
  "Поддержка за четыре часа",
  "Счета и закрывающие документы",
]

const DEFAULT_LABELS: Record<string, string> = {
  current: "Текущий план",
  next: "Следующий шаг",
}

function fill(template: string, values: Record<string, number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
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

/** Блок текущего плана и апгрейда: расход лимитов на <progress> и предложение рядом. */
export function Pricing019({
  currentName = "Тариф «Команда»",
  currentPrice = "1 490 ₽",
  currentPeriod = "в месяц",
  renewLabel = "Следующее списание",
  renewDate = "14 апреля",
  usage = DEFAULT_USAGE,
  upgradeName = "Тариф «Агентство»",
  upgradePrice = "4 900 ₽",
  upgradeDelta = "+3 410 ₽ к текущему счёту",
  upgradeGains = DEFAULT_GAINS,
  upgradeAction = { label: "Перейти на «Агентство»", href: "#" },
  manageAction = { label: "Управлять подпиской", href: "#" },
  labels = DEFAULT_LABELS,
  usageText = "{used} из {limit}",
  accent,
  background = "",
  className,
  style,
}: Pricing019Props) {
  const text = (key: string) => labels[key] ?? DEFAULT_LABELS[key]

  const palette = {
    ...(accent ? { "--vibeui-pricing-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-019" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-019"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="panel">
            <p data-part="tag">{text("current")}</p>
            <h2>{currentName}</h2>
            <p data-part="line">
              <span data-part="amount">{currentPrice}</span>
              {currentPeriod} · {renewLabel}: {renewDate}
            </p>

            <ul data-part="usage">
              {usage.slice(0, 4).map((entry) => {
                const share = entry.limit > 0 ? entry.used / entry.limit : 0

                return (
                  <li
                    key={entry.label}
                    data-high={share >= 0.8 ? "true" : undefined}
                  >
                    <span data-part="usagehead">
                      <span>{entry.label}</span>
                      <span data-part="value">
                        {fill(usageText, {
                          used: entry.used,
                          limit: entry.limit,
                        })}
                        {entry.unit ? ` ${entry.unit}` : ""}
                      </span>
                    </span>
                    <progress
                      value={entry.used}
                      max={entry.limit}
                      aria-label={entry.label}
                    />
                  </li>
                )
              })}
            </ul>

            <a data-part="manage" href={manageAction.href}>
              {manageAction.label}
            </a>
          </div>

          <div data-part="panel" data-upgrade="true">
            <p data-part="tag">{text("next")}</p>
            <h2>{upgradeName}</h2>
            <p data-part="line">
              <span data-part="amount">{upgradePrice}</span>
              {currentPeriod} · {upgradeDelta}
            </p>

            <ul data-part="gains">
              {upgradeGains.slice(0, 5).map((gain) => (
                <li key={gain}>
                  <span data-part="plus" aria-hidden="true">
                    +
                  </span>
                  {gain}
                </li>
              ))}
            </ul>

            <a data-part="cta" href={upgradeAction.href}>
              {upgradeAction.label}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
