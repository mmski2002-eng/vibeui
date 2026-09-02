import type { CSSProperties } from "react"

export type Dashboard040Contract = {
  code: string
  party: string
  subject: string
  sum: string
  start: string
  end: string
  passed: number
  left: string
  state: "Действует" | "Истекает" | "На продлении" | "Завершён"
  auto?: boolean
}

export type Dashboard040Props = {
  title?: string
  filters?: string[]
  activeFilter?: string
  contracts?: Dashboard040Contract[]
  newLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись списка фильтров. */
  filterLabel?: string
  /** Подписи состояний договора по ключу. */
  stateText?: Record<string, string>
  /** Шаблон подписи полосы срока: {value}. */
  termAriaText?: string
  /** Шаблон даты начала: {date}. */
  fromText?: string
  /** Шаблон даты окончания: {date}. */
  toText?: string
  /** Пометка автопродления. */
  autoLabel?: string
  /** Подпись ссылки на договор. */
  openLabel?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: договоры, где срок — это отрезок, а не две даты. Полоса
// показывает, какая часть срока уже прошла, а подпись рядом называет остаток
// словами: «через 18 дней» понятнее, чем «до 31.03». Карточка истекающего
// договора несёт рамку, полосу и слово, поэтому статус переживает печать и
// монохромный экран. Автопродление отмечено отдельным значком: это условие
// меняет смысл срока и не должно теряться среди реквизитов.
const STYLES = `
:where([data-vibeui-block="dashboard-040"]){
--vibeui-dashboard-040-bg:transparent;
/* Карточки и жёлоб срока: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-040-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-dashboard-040-track:light-dark(oklch(0.96 0.004 265),oklch(0.21 0.012 265));
--vibeui-dashboard-040-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-dashboard-040-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-dashboard-040-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.011 265));
--vibeui-dashboard-040-accent:light-dark(oklch(0.48 0.15 285),oklch(0.75 0.14 285));
--vibeui-dashboard-040-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 285));
--vibeui-dashboard-040-soft:light-dark(oklch(0.96 0.02 285),oklch(0.31 0.05 285));
--vibeui-dashboard-040-warn:light-dark(oklch(0.62 0.16 55),oklch(0.79 0.14 55));
--vibeui-dashboard-040-warnline:light-dark(oklch(0.79 0.09 55),oklch(0.5 0.09 55));
--vibeui-dashboard-040-done:light-dark(oklch(0.62 0.012 265),oklch(0.66 0.012 265));
--vibeui-dashboard-040-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-040"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-040-bg);
color:var(--vibeui-dashboard-040-fg);
font-family:var(--vibeui-dashboard-040-sans);
border:1px solid var(--vibeui-dashboard-040-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-040"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-040"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-040"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem}
[data-vibeui-block="dashboard-040"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-040"] [data-part="new"]{
appearance:none;border:0;cursor:pointer;font:inherit;margin-left:auto;
font-size:0.8125rem;font-weight:700;padding:0.5rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-040-accent);color:var(--vibeui-dashboard-040-on-accent);
}
[data-vibeui-block="dashboard-040"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.375rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-040"] [data-part="chip"]{
display:inline-block;padding:0.3125rem 0.6875rem;border-radius:9999px;
font-size:0.75rem;font-weight:650;text-decoration:none;color:var(--vibeui-dashboard-040-muted);
border:1px solid var(--vibeui-dashboard-040-border);background:var(--vibeui-dashboard-040-card);
}
[data-vibeui-block="dashboard-040"] [data-part="chip"][aria-current]{
color:var(--vibeui-dashboard-040-on-accent);background:var(--vibeui-dashboard-040-accent);border-color:transparent;
}
[data-vibeui-block="dashboard-040"] [data-part="cards"]{display:grid;grid-template-columns:1fr;gap:0.625rem}
[data-vibeui-block="dashboard-040"] article{
display:grid;gap:0.4375rem;padding:0.875rem;
background:var(--vibeui-dashboard-040-card);
border:1px solid var(--vibeui-dashboard-040-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-040"] article[data-state="Истекает"]{
border-color:var(--vibeui-dashboard-040-warnline);
}
[data-vibeui-block="dashboard-040"] article[data-state="Завершён"]{opacity:0.75}
[data-vibeui-block="dashboard-040"] [data-part="top"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.625rem;
}
[data-vibeui-block="dashboard-040"] h3{margin:0;font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-040"] [data-part="code"]{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-dashboard-040-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-040"] [data-part="tag"]{
margin-left:auto;display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.6875rem;font-weight:750;padding:0.125rem 0.5rem;border-radius:9999px;
border:1px solid currentColor;color:var(--vibeui-dashboard-040-accent);
}
[data-vibeui-block="dashboard-040"] [data-part="tag"]::before{
content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;background:currentColor;
}
[data-vibeui-block="dashboard-040"] article[data-state="Истекает"] [data-part="tag"]{color:var(--vibeui-dashboard-040-warn)}
[data-vibeui-block="dashboard-040"] article[data-state="Истекает"] [data-part="tag"]::before{border-radius:0.125rem}
[data-vibeui-block="dashboard-040"] article[data-state="Завершён"] [data-part="tag"]{color:var(--vibeui-dashboard-040-done)}
[data-vibeui-block="dashboard-040"] article[data-state="Завершён"] [data-part="tag"]::before{background:transparent;box-shadow:inset 0 0 0 1.5px currentColor}
[data-vibeui-block="dashboard-040"] [data-part="subject"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-dashboard-040-muted);
}
[data-vibeui-block="dashboard-040"] [data-part="term"]{display:grid;gap:0.25rem}
[data-vibeui-block="dashboard-040"] [data-part="track"]{
position:relative;height:0.375rem;border-radius:9999px;
background:var(--vibeui-dashboard-040-track);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-040-border);overflow:hidden;
}
[data-vibeui-block="dashboard-040"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;border-radius:9999px;background:var(--vibeui-dashboard-040-accent);
}
[data-vibeui-block="dashboard-040"] article[data-state="Истекает"] [data-part="fill"]{background:var(--vibeui-dashboard-040-warn)}
[data-vibeui-block="dashboard-040"] article[data-state="Завершён"] [data-part="fill"]{background:var(--vibeui-dashboard-040-done)}
[data-vibeui-block="dashboard-040"] [data-part="dates"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-040-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-040"] [data-part="left"]{margin-left:auto;font-weight:750;color:var(--vibeui-dashboard-040-fg)}
[data-vibeui-block="dashboard-040"] article[data-state="Истекает"] [data-part="left"]{color:var(--vibeui-dashboard-040-warn)}
[data-vibeui-block="dashboard-040"] [data-part="foot"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;
padding-top:0.4375rem;border-top:1px solid var(--vibeui-dashboard-040-border);
}
[data-vibeui-block="dashboard-040"] [data-part="sum"]{font-size:0.875rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-040"] [data-part="auto"]{
display:inline-flex;align-items:center;gap:0.25rem;
font-size:0.6875rem;font-weight:650;color:var(--vibeui-dashboard-040-accent);
padding:0.125rem 0.4375rem;border-radius:0.375rem;background:var(--vibeui-dashboard-040-soft);
}
[data-vibeui-block="dashboard-040"] [data-part="link"]{
margin-left:auto;font-size:0.75rem;font-weight:700;color:var(--vibeui-dashboard-040-accent);text-decoration:none;
}
[data-vibeui-block="dashboard-040"] [data-part="link"]:hover{text-decoration:underline}
[data-vibeui-block="dashboard-040"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-040-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-040"] [data-part="cards"]{grid-template-columns:repeat(2,1fr)}
}
`

const DEFAULT_CONTRACTS: Dashboard040Contract[] = [
  {
    code: "ДГ-114",
    party: "ООО «Северный лес»",
    subject:
      "Поставка пиломатериалов, рамочный договор с ежемесячными заявками",
    sum: "4 200 000 ₽",
    start: "12.04.2023",
    end: "31.03.2026",
    passed: 86,
    left: "через 18 дней",
    state: "Истекает",
    auto: true,
  },
  {
    code: "ДГ-128",
    party: "АО «Прибор»",
    subject: "Обслуживание учётной системы и техподдержка первой линии",
    sum: "1 080 000 ₽",
    start: "01.09.2024",
    end: "31.08.2026",
    passed: 52,
    left: "через 5 месяцев",
    state: "Действует",
  },
  {
    code: "ДГ-131",
    party: "Студия «Полдень»",
    subject: "Разработка фирменного стиля и макетов для трёх площадок",
    sum: "640 000 ₽",
    start: "15.01.2026",
    end: "15.07.2026",
    passed: 24,
    left: "через 4 месяца",
    state: "На продлении",
  },
  {
    code: "ДГ-097",
    party: "ИП Гаврилов",
    subject: "Аренда складского помещения площадью 240 м²",
    sum: "1 440 000 ₽",
    start: "01.02.2023",
    end: "31.01.2026",
    passed: 100,
    left: "истёк 31.01",
    state: "Завершён",
  },
]

const DEFAULT_STATES: Record<string, string> = {
  Действует: "Действует",
  Истекает: "Истекает",
  "На продлении": "На продлении",
  Завершён: "Завершён",
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
 * Страница договоров: фильтр-чипы и карточки, где срок показан полосой
 * пройденной части и остатком словами. Один файл, ноль зависимостей,
 * клиентского JS нет.
 */
export function Dashboard040({
  title = "Договоры",
  filters = ["Все", "Действуют", "Истекают", "На продлении", "Завершены"],
  activeFilter = "Все",
  contracts = DEFAULT_CONTRACTS,
  newLabel = "Новый договор",
  accent,
  background = "",
  filterLabel = "Отбор договоров",
  stateText = DEFAULT_STATES,
  termAriaText = "Срок пройден на {value} процентов",
  fromText = "с {date}",
  toText = "по {date}",
  autoLabel = "автопродление включено",
  openLabel = "Открыть договор",
  className,
  style,
}: Dashboard040Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-040-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-040-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-040" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-040"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <button type="button" data-part="new">
              {newLabel}
            </button>
          </div>

          <nav aria-label={filterLabel}>
            <ul data-part="chips">
              {filters.map((filter) => (
                <li key={filter}>
                  <a
                    href="#dashboard-040"
                    data-part="chip"
                    aria-current={filter === activeFilter ? "page" : undefined}
                  >
                    {filter}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-part="cards">
            {contracts.map((contract) => (
              <article key={contract.code} data-state={contract.state}>
                <div data-part="top">
                  <h3>{contract.party}</h3>
                  <span data-part="code">{contract.code}</span>
                  <span data-part="tag">
                    {stateText[contract.state] ?? contract.state}
                  </span>
                </div>

                <p data-part="subject">{contract.subject}</p>

                <div data-part="term">
                  <div
                    data-part="track"
                    role="progressbar"
                    aria-valuenow={contract.passed}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={termAriaText.replace(
                      "{value}",
                      String(contract.passed),
                    )}
                  >
                    <span
                      data-part="fill"
                      style={{ width: `${contract.passed}%` }}
                    />
                  </div>
                  <p data-part="dates">
                    <span>{fromText.replace("{date}", contract.start)}</span>
                    <span>{toText.replace("{date}", contract.end)}</span>
                    <span data-part="left">{contract.left}</span>
                  </p>
                </div>

                <div data-part="foot">
                  <span data-part="sum">{contract.sum}</span>
                  {contract.auto ? (
                    <span data-part="auto">{autoLabel}</span>
                  ) : null}
                  <a href="#dashboard-040" data-part="link">
                    {openLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
