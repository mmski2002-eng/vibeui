import type { CSSProperties } from "react"

export type Dashboard051Quota = {
  name: string
  used: number
  limit: number
  unit: string
  warnAt: number
  onOver: string
}

export type Dashboard051Rate = {
  name: string
  value: string
  scope: string
}

export type Dashboard051Props = {
  title?: string
  resetIn?: string
  quotas?: Dashboard051Quota[]
  rates?: Dashboard051Rate[]
  raiseLabel?: string
  ratesTitle?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Локаль форматирования чисел. */
  locale?: string
  /** Шаблон предела рядом с расходом: {limit}. */
  ofText?: string
  /** Подписи зон: ok, warn, over. */
  zoneText?: Record<string, string>
  /** Шаблон строки под полосой: {share}, {unit} и {warn}. */
  metaText?: string
  /** Шаблон подписи полосы: {name} и {value}. */
  usageAriaText?: string
  /** Шаблон подсказки засечки: {value}. */
  notchTitleText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: квоты, у которых кроме предела есть порог предупреждения. Порог
// нарисован засечкой прямо в полосе, а не отдельной колонкой: только так видно,
// что расход уже зашёл в жёлтую зону, но предела ещё не достиг. Под каждой
// квотой подписано, что произойдёт при превышении, — это единственный вопрос,
// который на самом деле задают, глядя на такой экран. Жёсткие ограничения
// вынесены отдельным списком: их не расходуют, они просто действуют.
const STYLES = `
:where([data-vibeui-block="dashboard-051"]){
--vibeui-dashboard-051-bg:transparent;
/* Карточки и жёлоб полосы: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-051-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 275));
--vibeui-dashboard-051-track:light-dark(oklch(0.96 0.005 275),oklch(0.21 0.012 275));
--vibeui-dashboard-051-fg:light-dark(oklch(0.22 0.014 275),oklch(0.94 0.005 275));
--vibeui-dashboard-051-muted:light-dark(oklch(0.55 0.014 275),oklch(0.72 0.012 275));
--vibeui-dashboard-051-border:light-dark(oklch(0.91 0.006 275),oklch(0.36 0.012 275));
--vibeui-dashboard-051-accent:light-dark(oklch(0.52 0.16 275),oklch(0.75 0.14 275));
--vibeui-dashboard-051-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 275));
--vibeui-dashboard-051-soft:light-dark(oklch(0.96 0.02 275),oklch(0.32 0.045 275));
--vibeui-dashboard-051-warn:light-dark(oklch(0.68 0.15 70),oklch(0.82 0.13 70));
--vibeui-dashboard-051-over:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.17 25));
--vibeui-dashboard-051-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-051"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-051-bg);
color:var(--vibeui-dashboard-051-fg);
font-family:var(--vibeui-dashboard-051-sans);
border:1px solid var(--vibeui-dashboard-051-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-051"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-051"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-051"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.75rem}
[data-vibeui-block="dashboard-051"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-051"] [data-part="reset"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-051-muted)}
[data-vibeui-block="dashboard-051"] [data-part="raise"]{
appearance:none;border:0;cursor:pointer;font:inherit;margin-left:auto;
font-size:0.8125rem;font-weight:700;padding:0.5rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-051-accent);color:var(--vibeui-dashboard-051-on-accent);
}
[data-vibeui-block="dashboard-051"] [data-part="grid"]{display:grid;grid-template-columns:1fr;gap:0.625rem}
[data-vibeui-block="dashboard-051"] article{
display:grid;gap:0.375rem;padding:0.875rem;
background:var(--vibeui-dashboard-051-card);
border:1px solid var(--vibeui-dashboard-051-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-051"] article[data-zone="over"]{
border-color:color-mix(in oklab,var(--vibeui-dashboard-051-over) 50%,var(--vibeui-dashboard-051-card));
}
[data-vibeui-block="dashboard-051"] [data-part="top"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem;
}
[data-vibeui-block="dashboard-051"] h3{margin:0;font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-051"] [data-part="nums"]{
margin-left:auto;font-size:0.75rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-051"] [data-part="nums"] span{
font-weight:400;color:var(--vibeui-dashboard-051-muted);
}
[data-vibeui-block="dashboard-051"] [data-part="track"]{
position:relative;height:0.5rem;border-radius:9999px;
background:var(--vibeui-dashboard-051-track);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-051-border);overflow:hidden;
}
[data-vibeui-block="dashboard-051"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;border-radius:9999px;background:var(--vibeui-dashboard-051-accent);
}
[data-vibeui-block="dashboard-051"] article[data-zone="warn"] [data-part="fill"]{background:var(--vibeui-dashboard-051-warn)}
[data-vibeui-block="dashboard-051"] article[data-zone="over"] [data-part="fill"]{background:var(--vibeui-dashboard-051-over)}
/* Засечка порога предупреждения внутри полосы, а не отдельной колонкой. */
[data-vibeui-block="dashboard-051"] [data-part="notch"]{
position:absolute;top:-0.125rem;bottom:-0.125rem;width:0.125rem;border-radius:9999px;
background:var(--vibeui-dashboard-051-fg);
}
[data-vibeui-block="dashboard-051"] [data-part="foot"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.625rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-051-muted);
}
[data-vibeui-block="dashboard-051"] [data-part="zone"]{
display:inline-flex;align-items:center;gap:0.3125rem;font-weight:750;
color:var(--vibeui-dashboard-051-accent);
}
[data-vibeui-block="dashboard-051"] [data-part="zone"]::before{
content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;background:currentColor;
}
[data-vibeui-block="dashboard-051"] article[data-zone="warn"] [data-part="zone"]{color:var(--vibeui-dashboard-051-warn)}
[data-vibeui-block="dashboard-051"] article[data-zone="warn"] [data-part="zone"]::before{border-radius:0.125rem}
[data-vibeui-block="dashboard-051"] article[data-zone="over"] [data-part="zone"]{color:var(--vibeui-dashboard-051-over)}
[data-vibeui-block="dashboard-051"] article[data-zone="over"] [data-part="zone"]::before{
border-radius:0;transform:rotate(45deg);
}
[data-vibeui-block="dashboard-051"] [data-part="rates"]{
padding:0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-051-card);
border:1px solid var(--vibeui-dashboard-051-border);
}
[data-vibeui-block="dashboard-051"] [data-part="rates"] h3{margin-bottom:0.5rem;font-size:0.875rem}
[data-vibeui-block="dashboard-051"] dl{
margin:0;display:grid;grid-template-columns:1fr auto;gap:0.4375rem 0.75rem;
}
[data-vibeui-block="dashboard-051"] dt{font-size:0.75rem}
[data-vibeui-block="dashboard-051"] dt span{
display:block;font-size:0.625rem;color:var(--vibeui-dashboard-051-muted);
}
[data-vibeui-block="dashboard-051"] dd{
margin:0;text-align:right;font-size:0.75rem;font-weight:750;font-variant-numeric:tabular-nums;
white-space:nowrap;
}
[data-vibeui-block="dashboard-051"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-051-accent);outline-offset:2px;
}
@container (min-width: 42rem){
[data-vibeui-block="dashboard-051"] [data-part="grid"]{grid-template-columns:repeat(2,1fr)}
}
`

const DEFAULT_QUOTAS: Dashboard051Quota[] = [
  {
    name: "Запросы к API",
    used: 812000,
    limit: 1000000,
    unit: "запросов в месяц",
    warnAt: 80,
    onOver:
      "Сверх лимита запросы отклоняются с кодом 429 до следующего месяца.",
  },
  {
    name: "Хранилище файлов",
    used: 96,
    limit: 200,
    unit: "ГБ",
    warnAt: 85,
    onOver: "Сверх лимита загрузка новых файлов блокируется, старые остаются.",
  },
  {
    name: "Письма клиентам",
    used: 21400,
    limit: 20000,
    unit: "писем в месяц",
    warnAt: 90,
    onOver: "Превышение оплачивается отдельно: 0,4 ₽ за письмо сверх лимита.",
  },
  {
    name: "Активные участники",
    used: 12,
    limit: 25,
    unit: "мест в тарифе",
    warnAt: 90,
    onOver:
      "Сверх лимита приглашения не отправляются, нужен переход на тариф выше.",
  },
]

const DEFAULT_RATES: Dashboard051Rate[] = [
  {
    name: "Частота запросов",
    value: "60 в минуту",
    scope: "на один ключ доступа",
  },
  {
    name: "Размер одного файла",
    value: "512 МБ",
    scope: "при загрузке через интерфейс и API",
  },
  {
    name: "Строк в одной выгрузке",
    value: "500 000",
    scope: "больше — только фоновым заданием",
  },
  {
    name: "Одновременных отчётов",
    value: "3",
    scope: "на рабочее пространство",
  },
]

const ZONE_LABEL: Record<string, string> = {
  ok: "в пределах нормы",
  warn: "порог пройден",
  over: "лимит превышен",
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
 * Экран лимитов и квот: расход полосой с засечкой порога предупреждения,
 * последствие превышения текстом и список жёстких ограничений. Один файл,
 * ноль зависимостей, клиентского JS нет.
 */
export function Dashboard051({
  title = "Лимиты и квоты",
  resetIn = "счётчики месяца обнулятся через 13 дней",
  quotas = DEFAULT_QUOTAS,
  rates = DEFAULT_RATES,
  raiseLabel = "Увеличить лимиты",
  ratesTitle = "Жёсткие ограничения",
  accent,
  background = "",
  locale = "ru-RU",
  ofText = "из {limit}",
  zoneText = ZONE_LABEL,
  metaText = "{share} % · {unit} · порог {warn} %",
  usageAriaText = "{name}: израсходовано {value} процентов",
  notchTitleText = "Порог предупреждения: {value} %",
  className,
  style,
}: Dashboard051Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-051-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-051-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-051" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-051"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="reset">{resetIn}</p>
            <button type="button" data-part="raise">
              {raiseLabel}
            </button>
          </div>

          <div data-part="grid">
            {quotas.map((quota) => {
              const share = Math.round((quota.used / quota.limit) * 100)
              const zone =
                share >= 100 ? "over" : share >= quota.warnAt ? "warn" : "ok"

              return (
                <article key={quota.name} data-zone={zone}>
                  <div data-part="top">
                    <h3>{quota.name}</h3>
                    <span data-part="nums">
                      {quota.used.toLocaleString(locale)}{" "}
                      <span>
                        {ofText.replace(
                          "{limit}",
                          quota.limit.toLocaleString(locale),
                        )}
                      </span>
                    </span>
                  </div>

                  <div
                    data-part="track"
                    role="progressbar"
                    aria-valuenow={quota.used}
                    aria-valuemin={0}
                    aria-valuemax={quota.limit}
                    aria-label={usageAriaText
                      .replace("{name}", quota.name)
                      .replace("{value}", String(share))}
                  >
                    <span
                      data-part="fill"
                      style={{ width: `${Math.min(100, share)}%` }}
                    />
                    <span
                      data-part="notch"
                      style={{ left: `${quota.warnAt}%` }}
                      title={notchTitleText.replace(
                        "{value}",
                        String(quota.warnAt),
                      )}
                    />
                  </div>

                  <p data-part="foot">
                    <span data-part="zone">
                      {zoneText[zone] ?? ZONE_LABEL[zone]}
                    </span>
                    <span>
                      {metaText
                        .replace("{share}", String(share))
                        .replace("{unit}", quota.unit)
                        .replace("{warn}", String(quota.warnAt))}
                    </span>
                  </p>

                  <p data-part="foot">{quota.onOver}</p>
                </article>
              )
            })}
          </div>

          <div data-part="rates">
            <h3>{ratesTitle}</h3>
            <dl>
              {rates.map((rate) => (
                <div key={rate.name} style={{ display: "contents" }}>
                  <dt>
                    {rate.name}
                    <span>{rate.scope}</span>
                  </dt>
                  <dd>{rate.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
